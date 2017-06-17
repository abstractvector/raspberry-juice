import async from 'async';
import config from 'config';
import nodeCleanup from 'node-cleanup';
import logger from './logger';
import Schedule from './schedule';
import Zone from './zone';

const zones = {};

// need some graceful error handling to make sure the pins are set low on exit
nodeCleanup((exitCode, signal) => {
  async.each(zones, (zone, callback) => {
    zone.write(false, callback);
  }, (error) => {
    if (error) {
      logger.error(`Error whilst shutting down: ${error}`);
    } else {
      logger.notice('All zones have been turned off and pins returned to low state');
    }

    process.exit(process.pid, signal);
  });

  nodeCleanup.uninstall();
  return false;
});

logger.notice('Starting Raspberry Juice');

// create the schedules
const setupSchedules = () => {
  const schedules = [];

  if (Array.isArray(config.get('schedules')) && config.get('schedules').length > 0) {
    config.get('schedules').forEach((scheduleConfig) => {
      const schedule = new Schedule(scheduleConfig, zones);
      schedules.push(schedule);
      logger.info('Successfully created schedule');
    });
  }
};

// create the zones
if (typeof config.get('zones') === 'object' && Object.keys(config.get('zones')).length > 0) {
  const schedulesConfig = config.get('zones');

  Object.keys(schedulesConfig).forEach((scheduleKey) => {
    zones[scheduleKey] = new Zone(scheduleKey, schedulesConfig[scheduleKey]);
    logger.info(`Created ${zones[scheduleKey].name} zone using pin ${zones[scheduleKey].pin}`);
  });

  async.each(zones, (zone, callback) => {
    zone.setup(callback);
  }, (error) => {
    if (error) {
      return logger.error(`Error setting up the zones: ${error}`);
    }

    logger.notice('All zones setup successfully');

    setupSchedules();

    return true;
  });
}
