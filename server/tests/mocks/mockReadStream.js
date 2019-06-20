
module.exports = class MockReadStream {
  constructor(sinon) {
    if(sinon) {
      sinon.spy(this, 'on');
    }
  }

  on(event, callback) {
    
  }
};
