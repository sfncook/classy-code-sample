const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

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

    this.app.use(bodyParser.urlencoded({
      extended: true
    }));
    this.app.use(fileUpload());
    this.app.use(bodyParser.json());

    // CORS is for when you're running locally and running server and client separately (assuming client is listening on port 3000)
    const corsOptions =  {
      origin: corsOrigins,
      methods: corsMethods,
      credentials: true,
    };
    this.app.use(cors(corsOptions));

    // Default routes
    const cacheControlMaxAge =  365/*days*/ * 24/*hrs*/ * 60/*min*/ * 60/*sec*/;
    this.app.use('/images', express.static(
      path.join(__dirname, '../images'), { cacheControl: true, setHeaders: (res)=>res.setHeader("Cache-Control","max-age="+cacheControlMaxAge) }
    ));
    this.app.use(express.static(path.join(__dirname, '../../dashboardUi/build')));
  }

  _logRequest(req, res, next) {
    this.logger.info(`[${req.method}] [${req.url}]`);
    next();
  }

  registerGet() {
    let args = [...arguments];
    args.splice(args.length-2, 0, this._logRequest);
    this.app.get(...args);
  }

  registerPut() {
    let args = [...arguments];
    args.splice(args.length-2, 0, this._logRequest);
    this.app.put(...args);
  }

  registerPost() {
    let args = [...arguments];
    args.splice(args.length-2, 0, this._logRequest);
    this.app.post(...args);
  }


  registerDelete() {
    let args = [...arguments];
    args.splice(args.length-2, 0, this._logRequest);
    this.app.delete(...args);
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


    // The "catchall" handler: for any request that doesn't
    // match one of the registered routes, send back React's index.html file.
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../../dashboardUi/build/index.html'));
    });

    this.httpServer.listen(this.port);
    this.logger.info('Listening on port:'+this.port );
  }
};

