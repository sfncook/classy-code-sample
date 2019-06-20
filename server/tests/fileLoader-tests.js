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

const samplePath = 'SAMPLE_PATH';

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

  describe('loadFile', ()=>{
    beforeEach(init);

    it(`3 lines`, async ()=>{
      const expectedResponse = ['foo1','foo2','foo3'];
      mockReadInterface.lines = expectedResponse;

      const actualResponse = await fileReader.loadFile(samplePath);

      expect(actualResponse).to.eql(expectedResponse);
      sinon.assert.calledOnce(mockFs.createReadStream);
      sinon.assert.calledWithExactly(mockFs.createReadStream, samplePath);
      sinon.assert.calledOnce(mockReadStream.on);
      sinon.assert.calledWith(mockReadStream.on, 'error');
      sinon.assert.calledOnce(mockReadline.createInterface);
      sinon.assert.calledWithExactly(mockReadline.createInterface, {input:mockReadStream});
      sinon.assert.calledTwice(mockReadInterface.on);
      sinon.assert.calledWith(mockReadInterface.on, 'line');
      sinon.assert.calledWith(mockReadInterface.on, 'close');
    });

    it(`empty file`, async ()=>{
      const expectedResponse = [];
      mockReadInterface.lines = expectedResponse;

      const actualResponse = await fileReader.loadFile(samplePath);

      expect(actualResponse).to.eql(expectedResponse);
    });

    it(`4 identical lines`, async ()=>{
      const expectedResponse = ['same','same','same','same'];
      mockReadInterface.lines = expectedResponse;

      const actualResponse = await fileReader.loadFile(samplePath);

      expect(actualResponse).to.eql(expectedResponse);
    });

    it(`ignores comments(1)`, async ()=>{
      const expectedResponse = ['foo1','foo2','foo3'];
      const initLines = ['#ignore_me','foo1','foo2','foo3'];
      mockReadInterface.lines = initLines;

      const actualResponse = await fileReader.loadFile(samplePath);

      expect(actualResponse).to.eql(expectedResponse);
    });

    it(`ignores comments (2)`, async ()=>{
      const expectedResponse = ['foo1','foo2','foo3'];
      const initLines = ['foo1','foo2','#ignore_me','foo3'];
      mockReadInterface.lines = initLines;

      const actualResponse = await fileReader.loadFile(samplePath);

      expect(actualResponse).to.eql(expectedResponse);
    });

    it(`ignores comments (last)`, async ()=>{
      const expectedResponse = ['foo1','foo2','foo3'];
      const initLines = ['foo1','foo2','foo3','#ignore_me'];
      mockReadInterface.lines = initLines;

      const actualResponse = await fileReader.loadFile(samplePath);

      expect(actualResponse).to.eql(expectedResponse);
    });
  });

});

