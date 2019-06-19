
const SERVER_ERROR_CODE = 500;

module.exports = class RuntimeRoutes {

  constructor(logger, config, fileLoader, userParser, groupParser) {
    this.logger = logger;
    this.fileLoader = fileLoader;
    this.userParser = userParser;
    this.groupParser = groupParser;
    this.usersPath = config.get('runtime.usersPath');
    this.groupsPath = config.get('runtime.groupsPath');

    this.linkRoutes = this.linkRoutes.bind(this);
    this.getUsers = this.getUsers.bind(this);
  }

  linkRoutes(httpServer) {
    httpServer.registerGet(
      '/users',
      this.getUsers
    );
  }

  async getUsers(req, res) {
    try {
      const lines = await this.fileLoader.loadFile(this.usersPath);
      const users = this.userParser.parse(lines);
      res.json(users);
    } catch (e) {
      res.status(SERVER_ERROR_CODE).json({ msg: 'Error while processing getUsers' });
    }
  }


};
