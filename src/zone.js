import logger from './logger';
import gpio from './gpio';

class Zone {
  constructor(key, config) {
    this.value = false;
    this.key = key;

    this.setPin(config.pin);
    this.setName(config.name);
  }

  setPin(pin) {
    if (!Number.isInteger(pin) || pin <= 0) {
      throw new Error(`Invalid zone pin specified for zone [${this.key}]: ${pin}`);
    }

    this.pin = pin;
    return this;
  }

  setName(name) {
    if (typeof name !== 'string') {
      throw new Error(`Invalid zone name specified for zone [${this.key}]: ${name}`);
    }

    this.name = name;
    return this;
  }

  setup(onSetup) {
    return gpio.setup(this.pin, gpio.DIR_LOW, (error) => {
      if (typeof onSetup === 'function') {
        return onSetup(error);
      }
      return error;
    });
  }

  run(duration, callback) {
    logger.notice(`Running ${this.name} zone for ${duration} seconds`);
    this.turnOn((error) => {
      if (error) {
        return callback(error);
      }

      return setTimeout(() => {
        this.turnOff(() => {
          logger.notice(`Completed program for ${this.name} zone`);
          return callback();
        });
      }, duration * 1e3);
    });
  }

  turnOn(callback) {
    if (typeof callback !== 'function') {
      throw new Error(`Invalid callback specified to turn on ${this.name} zone by activating pin ${this.pin}`);
    }

    logger.info(`Turning on ${this.name} zone`);

    return this.write(true, callback);
  }

  turnOff(callback) {
    if (typeof callback !== 'function') {
      throw new Error(`Invalid callback specified to turn on ${this.name} zone by deactivating pin ${this.pin}`);
    }

    logger.info(`Turning off ${this.name} zone`);
    return this.write(false, callback);
  }

  write(level, callback) {
    return gpio.write(this.pin, !!level, (error) => {
      if (!error) {
        this.value = !!level;
      }
      return typeof callback === 'function' ? callback(error) : error;
    });
  }
}

export default Zone;
