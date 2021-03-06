
console.log('\n\n\n\n');
console.log('************************************************************');
console.log('*                    Server starting                       *');
console.log('************************************************************');

(async ()=>{

  const config = require('./config');

  const Logger = require('./logger');
  const logger = new Logger(config);

  const fs = require('fs');
  const usersPath = config.get('runtime.usersPath');
  const groupsPath = config.get('runtime.groupsPath');
  if (!fs.existsSync(usersPath)) {
    logger.error(`Path to users file does not exist: ${usersPath}`);
  }
  if (!fs.existsSync(groupsPath)) {
    logger.error(`Path to groups file does not exist: ${groupsPath}`);
  }

  const HttpServer = require('./httpServer');
  const httpServer = new HttpServer(config, logger);

  const readline = require('readline');
  const FileLoader = require('./fileLoader');
  const fileLoader = new FileLoader(logger, fs, readline);

  const UserParser = require('./userParser');
  const userParser = new UserParser();

  const GroupParser = require('./groupParser');
  const groupParser = new GroupParser();

  const UserRoutes = require('./routes/userRoutes');
  const userRoutes = new UserRoutes(logger, config, fileLoader, userParser, groupParser);
  userRoutes.linkRoutes(httpServer);

  const GroupRoutes = require('./routes/groupRoutes');
  const groupRoutes = new GroupRoutes(logger, config, fileLoader, groupParser);
  groupRoutes.linkRoutes(httpServer);

  httpServer.startListening();
})();
