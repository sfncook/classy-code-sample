
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

  const fs = require('fs');
  const readline = require('readline');
  const FileLoader = require('./fileLoader');
  const fileLoader = new FileLoader(logger, fs, readline);
  // try {
  //   const lines = await fileLoader.loadFile('/etc/passwdx');
  //   console.log('lines.length:',lines.length);
  // } catch(e) {
  //   console.log('error:',e);
  // }

  const UserParser = require('./userParser');
  const userParser = new UserParser();

  const GroupParser = require('./groupParser');
  const groupParser = new GroupParser();

  const RuntimeRoutes = require('./routes/runtimeRoutes');
  const runtimeRoutes = new RuntimeRoutes(logger, config, fileLoader, userParser, groupParser);
  runtimeRoutes.linkRoutes(httpServer);

  httpServer.startListening();
})();
