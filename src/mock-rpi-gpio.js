import logger from './logger';

class Gpio {
  static setup(channel, direction, edge, onSetup /* err*/) {
    logger.debug(`Mock: setup(channel=${channel}, direction=${direction}, edge=${edge}, onSetup=${typeof onSetup})`);
    if (typeof onSetup === 'function') {
      onSetup();
    }
  }

  static write(channel, value, onWrite /* err*/) {
    logger.debug(`Mock: setup(channel=${channel}, value=${value}, onWrite=${typeof onWrite})`);
    if (typeof onWrite === 'function') {
      onWrite();
    }
  }
}

export default Gpio;
