const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');

module.exports = class HttpServer {
  constructor(config, logger) {
    this.logger = logger;
    this.port = config.get('httpServer.port');
    const corsOrigins = config.get('httpServer.cors.origin');
    const corsMethods = config.get('httpServer.cors.methods');
    this.logger.debug('corsOrigins:',corsOrigins,' corsMethods:',corsMethods);
    this.onErrorCallback = null;

    this._logRequest = this._logRequest.bind(this);
    this._defaultErrorHandler = this._defaultErrorHandler.bind(this);

    this.registerGet = this.registerGet.bind(this);
    this.registerPut = this.registerPut.bind(this);
    this.registerPost = this.registerPost.bind(this);
    this.registerDelete = this.registerDelete.bind(this);

    this.app = express();
    this.httpServer = http.createServer(this.app);

    // CORS is for when you're running locally and running server and client separately (assuming client is listening on port 3000)
    const corsOptions =  {
      origin: corsOrigins,
      methods: corsMethods,
      credentials: true,
    };
    this.app.use(cors(corsOptions));
  }

  _logRequest(req, res, next) {
    this.logger.info(`[${req.method}] [${req.url}]`);
    next();
  }

  registerGet(path, callback) {
    this.app.get(path, this._logRequest, callback);
  }

  getServer() {
    return this.httpServer;
  }

  _defaultErrorHandler(err, req, res, next){
    if(this.onErrorCallback) {
      this.onErrorCallback(err, req, res, next);
    } else {
      this.logger.error('DefaultErrorHandler (onErrorCallback not set) err:',err);
    }
  }

  setOnErrorCallback(callback){
    this.onErrorCallback = callback;
  }


  startListening() {
    this.app.use(this._defaultErrorHandler);
    this.httpServer.listen(this.port);
    this.logger.info('Listening on port:'+this.port );
  }
};

