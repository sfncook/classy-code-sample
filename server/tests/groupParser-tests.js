const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const expect = chai.expect;
chai.use(sinonChai);

const GroupParser = require('../groupParser');

// Mocks for injection

// Object to test
let groupParser;

const init = ()=>{
  //Object to test
  groupParser = new GroupParser();
};

describe('GroupParser Tests', ()=>{

  describe('parse', ()=>{
    beforeEach(init);

    it(`length one`, async ()=>{
      const groupStrs = ['one:*:two:three'];
      const expectedResponse = [
        {
          name:'one',
          gid:'two',
          members:['three']
        }
      ];

      const actualResponse = await groupParser.parse(groupStrs);

      expect(actualResponse).to.eql(expectedResponse);
    });
  });

});

