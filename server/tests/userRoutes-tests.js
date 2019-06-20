const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const expect = chai.expect;
chai.use(sinonChai);
const { mockReq, mockRes } = require('sinon-express-mock');

const MockLogger = require('./mocks/mockLogger');
const MockConfig = require('./mocks/mockConfig');
const MockFileLoader = require('./mocks/mockFileLoader');
const MockUserParser = require('./mocks/mockUserParser');
const MockGroupParser = require('./mocks/mockGroupParser');
const UserRoutes = require('../routes/userRoutes');

// Mocks for injection
let mockLogger;
let mockConfig;
let mockFileLoader;
let mockUserParser;
let mockGroupParser;

let defaultRequest = {
  method:'',
  originalUrl:'',
  query:{},
  params:{},
  body:{},
};

// Object to test
let userRoutes;

const init = ()=>{
  mockLogger = new MockLogger(sinon);
  mockConfig = new MockConfig(sinon);
  mockFileLoader = new MockFileLoader(sinon);
  mockUserParser = new MockUserParser(sinon);
  mockGroupParser = new MockGroupParser(sinon);

  //Object to test
  userRoutes = new UserRoutes(mockLogger, mockConfig, mockFileLoader, mockUserParser, mockGroupParser);
};

describe('UserRoutes Tests', function () {
  
  describe('getUsers', function () {
    beforeEach(init);

    it('simple call succeeds', async ()=>{
      const req = mockReq(defaultRequest);
      const res = mockRes();

      const expectedLoadFileLines = 'expectedLoadFileLines';
      userRoutes.usersPath = 'userRoutes.usersPath';
      mockFileLoader.loadFile.restore();
      sinon.stub(mockFileLoader, 'loadFile').returns(Promise.resolve(expectedLoadFileLines));
      const expectedResponse = 'expectedResponse';
      mockUserParser.parse.restore();
      sinon.stub(mockUserParser, 'parse').returns(expectedResponse);

      await userRoutes.getUsers(req, res);

      sinon.assert.calledOnce(mockFileLoader.loadFile);
      sinon.assert.calledWithExactly(mockFileLoader.loadFile, userRoutes.usersPath);
      sinon.assert.calledOnce(mockUserParser.parse);
      sinon.assert.calledWithExactly(mockUserParser.parse, expectedLoadFileLines);
      sinon.assert.calledOnce(res.json);
      sinon.assert.calledWithExactly(res.json, expectedResponse);
    });

  });

  describe('getUser', function () {
    beforeEach(init);

    it('simple call succeeds', async ()=>{
      const req = mockReq(defaultRequest);
      const res = mockRes();
      const expectedUid = 'expectedUid';
      req.params.uid = expectedUid;

      const expectedLoadFileLines = 'expectedLoadFileLines';
      userRoutes.usersPath = 'userRoutes.usersPath';
      mockFileLoader.loadFile.restore();
      sinon.stub(mockFileLoader, 'loadFile').returns(Promise.resolve(expectedLoadFileLines));
      const expectedResponse1 = 'expectedResponse1';
      const expectedResponse2 = 'expectedResponse2';
      mockUserParser.parse.restore();
      sinon.stub(mockUserParser, 'parse').returns(expectedResponse1);
      mockUserParser.findSingle.restore();
      sinon.stub(mockUserParser, 'findSingle').returns(expectedResponse2);

      await userRoutes.getUser(req, res);

      sinon.assert.calledOnce(mockFileLoader.loadFile);
      sinon.assert.calledWithExactly(mockFileLoader.loadFile, userRoutes.usersPath);
      sinon.assert.calledOnce(mockUserParser.parse);
      sinon.assert.calledWithExactly(mockUserParser.parse, expectedLoadFileLines);
      sinon.assert.calledOnce(mockUserParser.findSingle);
      sinon.assert.calledWithExactly(mockUserParser.findSingle, expectedResponse1, {uid:expectedUid});
      sinon.assert.calledOnce(res.json);
      sinon.assert.calledWithExactly(res.json, expectedResponse2);
    });

  });


});

