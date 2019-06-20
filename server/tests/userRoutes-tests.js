const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const expect = chai.expect;
chai.use(sinonChai);
const { mockReq, mockRes } = require('sinon-express-mock');

const MockLogger = require('../mocks/mockLogger');
const MockConfig = require('../mocks/mockConfig');
const MockFileLoader = require('../mocks/mockFileLoader');
const MockUserParser = require('../mocks/mockUserParser');
const MockGroupParser = require('../mocks/mockGroupParser');
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

const init = (method, path)=>{
  return ()=>{
    mockLogger = new MockLogger(sinon);
    mockConfig = new MockConfig(sinon);
    mockFileLoader = new MockFileLoader(sinon);
    mockUserParser = new MockUserParser(sinon);
    mockGroupParser = new MockGroupParser(sinon);

    const nextCallback = ()=>{};
    mockNext = sinon.spy(nextCallback);

    defaultRequest.method = method;
    defaultRequest.originalUrl = path;

    //Object to test
    userRoutes = new UserRoutes(mockLogger, mockConfig, mockFileLoader, mockUserParser, mockGroupParser);
  }
};

describe('UserRoutes Tests', function () {
  describe('_preAuthMachineId', function () {
    beforeEach(init());

    it(`(negative) selectWhere throws error`, async ()=>{
      const req = mockReq(defaultRequest);
      const res = mockRes();
      const expectedMachineId = 1234;
      req.query.machine_id = expectedMachineId;
      const mockUsers_userHasRoleInReq_stub = sinon.stub(mockUsers, 'userHasRoleInReq');
      mockUsers_userHasRoleInReq_stub.withArgs(req, Roles.rootAdmin).returns(false);
      mockUsers_userHasRoleInReq_stub.returns(false);
      const expectedErrorThrown = {foo:'bar'};
      const mockSql_selectWhere_stub = sinon.stub(mockSql, 'selectWhere');
      mockSql_selectWhere_stub.throws(expectedErrorThrown);
      sinon.spy(AbstractRoutes.prototype, 'handleError');

      runtimeRoutes._preAuthMachineId(req, res, mockNext);

      sinon.assert.calledOnce(AbstractRoutes.prototype.handleError);
      sinon.assert.calledWithExactly(AbstractRoutes.prototype.handleError, expectedErrorThrown, req, res);
      sinon.assert.calledWithExactly(mockSql_selectWhere_stub, SqlTableNames.machines, 'id', expectedMachineId, true);
      sinon.assert.notCalled(mockNext);
    });

  });


});

