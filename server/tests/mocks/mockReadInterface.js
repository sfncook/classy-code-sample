
module.exports = class MockReadInterface {
  constructor(sinon) {
    if(sinon) {
      sinon.spy(this, 'on');
    }
  }

  on(event, callback) {}
};
