const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const expect = chai.expect;
chai.use(sinonChai);

const GroupParser = require('../groupParser');

let groupParser;

const init = ()=>{
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

    it(`length five, same groups`, async ()=>{
      const groupStrs = [
        'one1:*:two1:three',
        'one2:*:two2:three',
        'one3:*:two3:three',
        'one4:*:two4:three',
        'one5:*:two5:three',
      ];
      const expectedResponse = [
        {name:'one1',gid:'two1',members:['three']},
        {name:'one2',gid:'two2',members:['three']},
        {name:'one3',gid:'two3',members:['three']},
        {name:'one4',gid:'two4',members:['three']},
        {name:'one5',gid:'two5',members:['three']},
      ];

      const actualResponse = await groupParser.parse(groupStrs);

      expect(actualResponse).to.eql(expectedResponse);
    });

    it(`length five, diff groups`, async ()=>{
      const groupStrs = [
        'one1:*:two1:three1',
        'one2:*:two2:three2',
        'one3:*:two3:three3',
        'one4:*:two4:three4',
        'one5:*:two5:three5',
      ];
      const expectedResponse = [
        {name:'one1',gid:'two1',members:['three1']},
        {name:'one2',gid:'two2',members:['three2']},
        {name:'one3',gid:'two3',members:['three3']},
        {name:'one4',gid:'two4',members:['three4']},
        {name:'one5',gid:'two5',members:['three5']},
      ];

      const actualResponse = await groupParser.parse(groupStrs);

      expect(actualResponse).to.eql(expectedResponse);
    });

    it(`length five, diff&multiple groups`, async ()=>{
      const groupStrs = [
        'one1:*:two1:three1,three2',
        'one2:*:two2:three2,three4',
        'one3:*:two3:three3,three6',
        'one4:*:two4:three4,three8',
        'one5:*:two5:three5,three10',
      ];
      const expectedResponse = [
        {name:'one1',gid:'two1',members:['three1','three2']},
        {name:'one2',gid:'two2',members:['three2','three4']},
        {name:'one3',gid:'two3',members:['three3','three6']},
        {name:'one4',gid:'two4',members:['three4','three8']},
        {name:'one5',gid:'two5',members:['three5','three10']},
      ];

      const actualResponse = await groupParser.parse(groupStrs);

      expect(actualResponse).to.eql(expectedResponse);
    });
  });

});

