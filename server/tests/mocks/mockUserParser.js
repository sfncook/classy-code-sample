
module.exports = class MockUserParser {
  constructor(sinon) {
    if(sinon) {
      sinon.spy(this, 'parse');
      sinon.spy(this, 'findAll');
      sinon.spy(this, 'findSingle');
    }
  }

  parse() {}
  findAll() {}
  findSingle() {}
};
