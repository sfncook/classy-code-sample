
module.exports = class MockFs {
  constructor(sinon, mockReadStream) {
    this.mockReadStream = mockReadStream;
    if(sinon) {
      sinon.spy(this, 'createReadStream');
    }
  }

  createReadStream(path) {
    return this.mockReadStream;
  }
};
