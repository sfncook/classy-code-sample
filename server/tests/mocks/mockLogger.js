
module.exports = class MockLogger {
  constructor(sinon) {
    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);
    this.log = this.log.bind(this);
    this.info = this.info.bind(this);
    this.verbose = this.verbose.bind(this);
    this.debug = this.debug.bind(this);
    this.silly = this.silly.bind(this);

    if(sinon) {
      sinon.spy(this, 'error');
      sinon.spy(this, 'warn');
      sinon.spy(this, 'log');
      sinon.spy(this, 'info');
      sinon.spy(this, 'verbose');
      sinon.spy(this, 'debug');
      sinon.spy(this, 'silly');
    }
  }

  error(){}
  warn(){}
  log(){}
  info(){}
  verbose(){}
  debug(){}
  silly(){}
};
