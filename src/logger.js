import logger from 'winston';

logger.setLevels({
  debug: 7,
  info: 6,
  notice: 5,
  warn: 4,
  error: 3,
  crit: 2,
  alert: 1,
  emerg: 0,
});

logger.addColors({
  debug: 'green',
  info: 'cyan',
  silly: 'magenta',
  warn: 'yellow',
  error: 'red',
});

logger.remove(logger.transports.Console);

logger.add(logger.transports.Console, {
  level: 'debug',
  timestamp: true,
  colorize: true,
});

export default logger;
