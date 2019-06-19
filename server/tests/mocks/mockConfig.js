
module.exports = class MockConfig {
  constructor(sinon) {
    if(sinon) {
      sinon.spy(this, 'get');
    }
  }

  get(configPath) {
    return 123;
  }
};
