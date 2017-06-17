import logger from './logger';

class Gpio {
  static setup(channel, direction, onSetup /* err*/) {
    logger.debug(`Mock: setup(channel=${channel}, direction=${direction}, onSetup=${typeof onSetup})`);
    if (typeof onSetup === 'function') {
      onSetup();
    }
  }

  static write(channel, value, onWrite /* err*/) {
    logger.debug(`Mock: write(channel=${channel}, value=${value}, onWrite=${typeof onWrite})`);
    if (typeof onWrite === 'function') {
      onWrite();
    }
  }

  static destroy(onDestroy /* err*/) {
    logger.debug(`Mock: destroy(onDestroy=${typeof onDestroy})`);
    if (typeof onDestroy === 'function') {
      onDestroy();
    }
  }
}

Gpio.DIR_IN = 'in';
Gpio.DIR_OUT = 'out';
Gpio.DIR_LOW = 'low';
Gpio.DIR_HIGH = 'high';

Gpio.MODE_RPI = 'mode_rpi';
Gpio.MODE_BCM = 'mode_bcm';

Gpio.EDGE_NONE = 'none';
Gpio.EDGE_RISING = 'rising';
Gpio.EDGE_FALLING = 'falling';
Gpio.EDGE_BOTH = 'both';

export default Gpio;
