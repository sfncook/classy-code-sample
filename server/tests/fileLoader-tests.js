const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const expect = chai.expect;
chai.use(sinonChai);

const MockReadStream = require('./mocks/mockReadStream');
const MockReadInterface = require('./mocks/mockReadInterface');
const MockReadline = require('./mocks/mockReadline');
const MockFs = require('./mocks/mockFs');
const MockLogger = require('./mocks/mockLogger');
const FileLoader = require('../fileLoader');

// Mocks for injection
let mockReadStream;
let mockReadInterface;
let mockReadline;
let mockFs;
let mockLogger;

// Object to test
let fileReader;

const init = ()=>{
  mockReadStream = new MockReadStream(sinon);
  mockReadInterface = new MockReadInterface(sinon);
  mockReadline = new MockReadline(sinon, mockReadInterface);
  mockFs = new MockFs(sinon, mockReadStream);
  mockLogger = new MockLogger(sinon);

  //Object to test
  fileReader = new FileLoader(mockLogger, mockFs, mockReadline);
};

describe('FileLoader Tests', ()=>{

  describe('latest_telem_for_machine', ()=>{
    beforeEach(init);

    it(`(positive) correctly parses file`, async ()=>{
      mockFs.createReadStream.restore();
      sinon.stub(mockFs, 'createReadStream').returns(mockReadStream);

      // const machine_id = 1234;
      // const machine_id_int = 2345;
      // const expectedRawResponse = [{a:'fooa',b:'foob',c:'fooc'}];
      // mockGcpDatastore.int.restore();
      // const gcpDb_int_stub = sinon.stub(mockGcpDatastore, 'int');
      // gcpDb_int_stub.returns(machine_id_int);
      // const ds_runQuery_stub = sinon.stub(datastore, '_runQuery');
      // ds_runQuery_stub.returns(expectedRawResponse);

      // const actualResponse = await datastore.latest_telem_for_machine(machine_id);

      // sinon.assert.calledOnce(mockGcpDatastore.createQuery);
      // sinon.assert.calledOnce(mockGcpDatastore.int);
      // sinon.assert.calledOnce(mockGcpDatastore.filter);
      // sinon.assert.calledOnce(mockGcpDatastore.order);
      // sinon.assert.calledOnce(mockGcpDatastore.limit);
      // sinon.assert.calledOnce(ds_runQuery_stub);
      // sinon.assert.calledWithExactly(mockGcpDatastore.createQuery, datastore.kioskTelemetryKind);
      // sinon.assert.calledWithExactly(mockGcpDatastore.filter, 'machine_id', '=', machine_id_int);
      // sinon.assert.calledWithExactly(mockGcpDatastore.order, 'timeEventSec', {descending: true});
      // sinon.assert.calledWithExactly(mockGcpDatastore.limit, 1);
      // sinon.assert.calledWithExactly(ds_runQuery_stub, mockGcpDatastore);
      // expect(actualResponse).to.eql(expectedRawResponse);
    });
  });

});

