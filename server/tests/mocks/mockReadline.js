
module.exports = class MockReadline {
  constructor(sinon, mockReadInterface) {
    this.mockReadInterface = mockReadInterface;
    if(sinon) {
      sinon.spy(this, 'createInterface');
    }
  }

  createInterface(params) {
    return this.mockReadInterface;
  }
};
