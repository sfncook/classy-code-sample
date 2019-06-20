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
let mockNext;

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

  const nextCallback = ()=>{};
  mockNext = sinon.spy(nextCallback);

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
      userRoutes.groupsPath = 'userRoutes.groupsPath';
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
      sinon.assert.notCalled(mockNext);
    });

  });


});

