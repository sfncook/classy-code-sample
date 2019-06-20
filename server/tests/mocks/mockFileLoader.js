
module.exports = class MockFileLoader {
  constructor(sinon) {
    if(sinon) {
      sinon.spy(this, 'loadFile');
    }
  }

  loadFile() {}
};
