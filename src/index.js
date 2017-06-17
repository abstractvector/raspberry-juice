// import { CronJob } from 'cron';
import async from 'async';
import config from 'config';
import nodeCleanup from 'node-cleanup';
import gpio from './gpio';
import logger from './logger';
import Zone from './zone';

const zones = {};

// need some graceful error handling to make sure the pins are set low on exit
nodeCleanup(() => {
  Object.keys(zones).forEach((zoneKey) => {
    zones[zoneKey].write(false);
  });

  gpio.destroy((error) => {
    if (error) {
      return logger.error(`Error whilst turning off zones: ${error}`);
    }
    return logger.notice('All zones successfully turned off');
  });

  process.exit(0);
});

logger.notice('Starting Raspberry Juice');

// create the zones
if (typeof config.get('zones') === 'object' && Object.keys(config.get('zones')).length > 0) {
  const zonesConfig = config.get('zones');

  Object.keys(zonesConfig).forEach((zoneKey) => {
    zones[zoneKey] = new Zone(zoneKey, zonesConfig[zoneKey]);
    logger.info(`Created ${zones[zoneKey].name} zone using pin ${zones[zoneKey].pin}`);
  });

  async.each(zones, (zone, callback) => {
    zone.setup(callback);
  }, (error) => {
    if (error) {
      return logger.error(`Error setting up the zones: ${error}`);
    }

    logger.notice('All zones setup successfully');

    zones['1'].run(5, () => {
      logger.info('Schedule complete');
    });

    return true;
  });
}

// create the schedules
