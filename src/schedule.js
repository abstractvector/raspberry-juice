import { EventEmitter } from 'events';
import async from 'async';
import { CronJob } from 'cron';
import logger from './logger';

class Schedule extends EventEmitter {
  constructor(config, zones) {
    super();
    if (config.cron) {
      this.setCron(config.cron);
    }

    this.setProgram(config.program);

    this.job = new CronJob({
      cronTime: this.cron,
      onTick: this.execute.bind(this),
      start: true,
      timeZone: 'America/Los_Angeles',
    });

    this.zones = zones;
  }

  setCron(cron) {
    this.cron = cron;
    return this;
  }

  setProgram(program) {
    this.program = program;
    return this;
  }

  execute() {
    logger.notice('Commencing program');
    async.eachSeries(Object.keys(this.program), (zoneKey, callback) => {
      this.zones[zoneKey].run(this.program[zoneKey], (error) => {
        setTimeout(() => {
          callback(error);
        }, 1000);
      });
    }, (error) => {
      if (error) {
        return logger.error(`Program finished running with error: ${error}`);
      }
      return logger.notice('Program finished successfully');
    });
  }
}

export default Schedule;
