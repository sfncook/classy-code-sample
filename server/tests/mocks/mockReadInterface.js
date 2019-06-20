const _ = require('lodash');

module.exports = class MockReadInterface {
  constructor(sinon, lines) {
    this.lines = lines;
    if(sinon) {
      sinon.spy(this, 'on');
    }
  }

  on(event, callback) {
    if(event==='line') {
      _.forEach(this.lines, line=>callback(line));
    }
    if(event==='close') {
      callback();
    }
  }
};
