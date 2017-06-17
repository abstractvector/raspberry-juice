const gpio = (process.platform !== 'win32') ? require('rpi-gpio') : require('./mock-rpi-gpio').default;

export default gpio;
