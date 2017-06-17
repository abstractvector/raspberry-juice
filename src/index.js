// import { CronJob } from 'cron';
import config from 'config';
import nodeCleanup from 'node-cleanup';
import logger from './logger';
import Zone from './zone';

const zones = {};

// need some graceful error handling to make sure the pins are set low on exit
nodeCleanup(() => {
  Object.keys(zones).forEach((zoneKey) => {
    zones[zoneKey].write(false);
  });
});

logger.notice('Starting Raspberry Juice');

// create the zones
if (typeof config.get('zones') === 'object' && Object.keys(config.get('zones')).length > 0) {
  const zonesConfig = config.get('zones');

  Object.keys(zonesConfig).forEach((zoneKey) => {
    zones[zoneKey] = new Zone(zoneKey, zonesConfig[zoneKey]);
    logger.info(`Created ${zones[zoneKey].name} zone using pin ${zones[zoneKey].pin}`);
  });
}

zones['1'].run(5, () => {
  logger.info('Schedule complete');
});

// create the schedules
