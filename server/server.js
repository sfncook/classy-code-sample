
console.log('\n\n\n\n');
console.log('************************************************************');
console.log('*                    Server starting                       *');
console.log('************************************************************');

(async ()=>{

  const config = require('./config'); // Init and load config

  if(config.get('env')!=='production' && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.warn('WARNING: The GOOGLE_APPLICATION_CREDENTIALS environment is not set.  This will cause the server to fail to start.');
  }

  const Logger = require('./logger');
  const logger = new Logger(config);

  const HttpServer = require('./httpServer');
  const httpServer = new HttpServer(config, logger);

  const RuntimeRoutes = require('./routes/runtimeRoutes');
  const runtimeRoutes = new RuntimeRoutes(logger);
  runtimeRoutes.linkRoutes(httpServer);

  httpServer.startListening();
})();
