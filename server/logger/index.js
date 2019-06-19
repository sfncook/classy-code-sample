const winston = require('winston');
const fs = require('fs');

module.exports = class Logger {
  constructor(config) {
    const level = config.get('logger.level');
    const myTransports = [];
    if(config.get('logger.outputConsole')) {
      myTransports.push(new winston.transports.Console());
    }
    this.logger = winston.createLogger({
      level: level,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(info => {
          return `[${info.timestamp} ${info.level}] ${info.message}`;
        })
      ),
      exitOnError: false,
      transports: myTransports,
    });
    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);
    this.log = this.log.bind(this);
    this.info = this.info.bind(this);
    this.verbose = this.verbose.bind(this);
    this.debug = this.debug.bind(this);
    this.silly = this.silly.bind(this);
    this.formatStr = this.formatStr.bind(this);
  }

  formatStr() {
    let str = '';
    Object.values(arguments).forEach(arg=>{
      if(typeof arg==='object') {
        str +=  JSON.stringify(arg, undefined, 2);
      } else {
        str += arg;
      }
    });
    return str;
  }

  error() {
    const str = this.formatStr(...arguments);
    this.logger.log('error', str);
  }

  warn() {
    const str = this.formatStr(...arguments);
    this.logger.log('warn', str);
  }

  log() {
    const str = this.formatStr(...arguments);
    this.logger.log('info', str);
  }

  info() {
    const str = this.formatStr(...arguments);
    this.logger.log('info', str);
  }

  verbose() {
    const str = this.formatStr(...arguments);
    this.logger.log('verbose', str);
  }

  debug() {
    const str = this.formatStr(...arguments);
    this.logger.log('debug', str);
  }

  silly() {
    const str = this.formatStr(...arguments);
    this.logger.log('silly', str);
  }
};
