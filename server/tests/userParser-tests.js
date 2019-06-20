const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const expect = chai.expect;
chai.use(sinonChai);

const UserParser = require('../userParser');

let userParser;

const init = ()=>{
  userParser = new UserParser();
};

describe('UserParser Tests', ()=>{

  describe('parse', ()=>{
    beforeEach(init);

    it(`empty`, async ()=>{
      const userStrs = [];
      const expectedResponse = [];

      const actualResponse = await userParser.parse(userStrs);

      expect(actualResponse).to.eql(expectedResponse);
    });

    it(`length one`, async ()=>{
      const userStrs = ['one1:*:two1:three1:four1:five1:six1'];
      const expectedResponse = [
        {name:'one1',uid:'two1',gid:'three1',comment:'four1',home:'five1',shell:'six1'}
      ];

      const actualResponse = await userParser.parse(userStrs);

      expect(actualResponse).to.eql(expectedResponse);
    });

    it(`length five`, async ()=>{
      const userStrs = [
        'one1:*:two1:three1:four1:five1:six1',
        'one2:*:two2:three2:four2:five2:six2',
        'one3:*:two3:three3:four3:five3:six3',
        'one4:*:two4:three4:four4:five4:six4',
        'one5:*:two5:three5:four5:five5:six5',
      ];
      const expectedResponse = [
        {name:'one1',uid:'two1',gid:'three1',comment:'four1',home:'five1',shell:'six1'},
        {name:'one2',uid:'two2',gid:'three2',comment:'four2',home:'five2',shell:'six2'},
        {name:'one3',uid:'two3',gid:'three3',comment:'four3',home:'five3',shell:'six3'},
        {name:'one4',uid:'two4',gid:'three4',comment:'four4',home:'five4',shell:'six4'},
        {name:'one5',uid:'two5',gid:'three5',comment:'four5',home:'five5',shell:'six5'},
      ];

      const actualResponse = await userParser.parse(userStrs);

      expect(actualResponse).to.eql(expectedResponse);
    });
  });

  describe('findAll', ()=>{
    beforeEach(init);

    it(`find one by name`, async ()=>{
      const users = [
        {name:'one1',uid:'two1',gid:'three1',comment:'four1',home:'five1',shell:'six1'},
        {name:'one2',uid:'two2',gid:'three2',comment:'four2',home:'five2',shell:'six2'},
        {name:'one3',uid:'two3',gid:'three3',comment:'four3',home:'five3',shell:'six3'},
        {name:'one4',uid:'two4',gid:'three4',comment:'four4',home:'five4',shell:'six4'},
        {name:'one5',uid:'two5',gid:'three5',comment:'four5',home:'five5',shell:'six5'},
      ];
      const query = {name:'one1'};
      const expectedResponse = [{name:'one1',uid:'two1',gid:'three1',comment:'four1',home:'five1',shell:'six1'}];

      const actualResponse = await userParser.findAll(users, query);

      expect(actualResponse).to.eql(expectedResponse);
    });

    it(`find two by name`, async ()=>{
      const users = [
        {name:'one',uid:'two1',gid:'three1',comment:'four1',home:'five1',shell:'six1'},
        {name:'one',uid:'two2',gid:'three2',comment:'four2',home:'five2',shell:'six2'},
        {name:'one3',uid:'two3',gid:'three3',comment:'four3',home:'five3',shell:'six3'},
        {name:'one4',uid:'two4',gid:'three4',comment:'four4',home:'five4',shell:'six4'},
        {name:'one5',uid:'two5',gid:'three5',comment:'four5',home:'five5',shell:'six5'},
      ];
      const query = {name:'one'};
      const expectedResponse = [
        {name:'one',uid:'two1',gid:'three1',comment:'four1',home:'five1',shell:'six1'},
        {name:'one',uid:'two2',gid:'three2',comment:'four2',home:'five2',shell:'six2'},
      ];

      const actualResponse = await userParser.findAll(users, query);

      expect(actualResponse).to.eql(expectedResponse);
    });

    it(`find NONE by name`, async ()=>{
      const users = [
        {name:'one1',uid:'two1',gid:'three1',comment:'four1',home:'five1',shell:'six1'},
        {name:'one2',uid:'two2',gid:'three2',comment:'four2',home:'five2',shell:'six2'},
        {name:'one3',uid:'two3',gid:'three3',comment:'four3',home:'five3',shell:'six3'},
        {name:'one4',uid:'two4',gid:'three4',comment:'four4',home:'five4',shell:'six4'},
        {name:'one5',uid:'two5',gid:'three5',comment:'four5',home:'five5',shell:'six5'},
      ];
      const query = {name:'BAD_NAME'};
      const expectedResponse = [];

      const actualResponse = await userParser.findAll(users, query);

      expect(actualResponse).to.eql(expectedResponse);
    });

    it(`find ALL by name`, async ()=>{
      const users = [
        {name:'one',uid:'two1',gid:'three1',comment:'four1',home:'five1',shell:'six1'},
        {name:'one',uid:'two2',gid:'three2',comment:'four2',home:'five2',shell:'six2'},
        {name:'one',uid:'two3',gid:'three3',comment:'four3',home:'five3',shell:'six3'},
        {name:'one',uid:'two4',gid:'three4',comment:'four4',home:'five4',shell:'six4'},
        {name:'one',uid:'two5',gid:'three5',comment:'four5',home:'five5',shell:'six5'},
      ];
      const query = {name:'one'};
      const expectedResponse = users;

      const actualResponse = await userParser.findAll(users, query);

      expect(actualResponse).to.eql(expectedResponse);
    });

    it(`find one by name & uid`, async ()=>{
      const users = [
        {name:'one1',uid:'two1',gid:'three1',comment:'four1',home:'five1',shell:'six1'},
        {name:'one2',uid:'two2',gid:'three2',comment:'four2',home:'five2',shell:'six2'},
        {name:'one3',uid:'two3',gid:'three3',comment:'four3',home:'five3',shell:'six3'},
        {name:'one4',uid:'two4',gid:'three4',comment:'four4',home:'five4',shell:'six4'},
        {name:'one5',uid:'two5',gid:'three5',comment:'four5',home:'five5',shell:'six5'},
      ];
      const query = {name:'one4',uid:'two4'};
      const expectedResponse = [{name:'one4',uid:'two4',gid:'three4',comment:'four4',home:'five4',shell:'six4'}];

      const actualResponse = await userParser.findAll(users, query);

      expect(actualResponse).to.eql(expectedResponse);
    });

    it(`find one by name & uid & gid & comment & home & shell`, async ()=>{
      const users = [
        {name:'one1',uid:'two1',gid:'three1',comment:'four1',home:'five1',shell:'six1'},
        {name:'one2',uid:'two2',gid:'three2',comment:'four2',home:'five2',shell:'six2'},
        {name:'one3',uid:'two3',gid:'three3',comment:'four3',home:'five3',shell:'six3'},
        {name:'one4',uid:'two4',gid:'three4',comment:'four4',home:'five4',shell:'six4'},
        {name:'one5',uid:'two5',gid:'three5',comment:'four5',home:'five5',shell:'six5'},
      ];
      const query = {name:'one5',uid:'two5',gid:'three5',comment:'four5',home:'five5',shell:'six5'};
      const expectedResponse = [{name:'one5',uid:'two5',gid:'three5',comment:'four5',home:'five5',shell:'six5'}];

      const actualResponse = await userParser.findAll(users, query);

      expect(actualResponse).to.eql(expectedResponse);
    });

  });

  describe('findSingle', ()=>{
    beforeEach(init);

    it(`find one by name`, async ()=>{
      const users = [
        {name:'one1',uid:'two1',gid:'three1',comment:'four1',home:'five1',shell:'six1'},
        {name:'one2',uid:'two2',gid:'three2',comment:'four2',home:'five2',shell:'six2'},
        {name:'one3',uid:'two3',gid:'three3',comment:'four3',home:'five3',shell:'six3'},
        {name:'one4',uid:'two4',gid:'three4',comment:'four4',home:'five4',shell:'six4'},
        {name:'one5',uid:'two5',gid:'three5',comment:'four5',home:'five5',shell:'six5'},
      ];
      const query = {name:'one1'};
      const expectedResponse = {name:'one1',uid:'two1',gid:'three1',comment:'four1',home:'five1',shell:'six1'};

      const actualResponse = await userParser.findSingle(users, query);

      expect(actualResponse).to.eql(expectedResponse);
    });

    it(`find single and ignores second`, async ()=>{
      const users = [
        {name:'one',uid:'two1',gid:'three1',comment:'four1',home:'five1',shell:'six1'},
        {name:'one',uid:'two2',gid:'three2',comment:'four2',home:'five2',shell:'six2'},
        {name:'one3',uid:'two3',gid:'three3',comment:'four3',home:'five3',shell:'six3'},
        {name:'one4',uid:'two4',gid:'three4',comment:'four4',home:'five4',shell:'six4'},
        {name:'one5',uid:'two5',gid:'three5',comment:'four5',home:'five5',shell:'six5'},
      ];
      const query = {name:'one'};
      const expectedResponse = {name:'one',uid:'two1',gid:'three1',comment:'four1',home:'five1',shell:'six1'};

      const actualResponse = await userParser.findSingle(users, query);

      expect(actualResponse).to.eql(expectedResponse);
    });

    it(`find single by uid`, async ()=>{
      const users = [
        {name:'one1',uid:'two1',gid:'three1',comment:'four1',home:'five1',shell:'six1'},
        {name:'one2',uid:'two2',gid:'three2',comment:'four2',home:'five2',shell:'six2'},
        {name:'one3',uid:'two3',gid:'three3',comment:'four3',home:'five3',shell:'six3'},
        {name:'one4',uid:'two4',gid:'three4',comment:'four4',home:'five4',shell:'six4'},
        {name:'one5',uid:'two5',gid:'three5',comment:'four5',home:'five5',shell:'six5'},
      ];
      const query = {uid:'two5'};
      const expectedResponse = {name:'one5',uid:'two5',gid:'three5',comment:'four5',home:'five5',shell:'six5'};

      const actualResponse = await userParser.findSingle(users, query);

      expect(actualResponse).to.eql(expectedResponse);
    });

  });

});

