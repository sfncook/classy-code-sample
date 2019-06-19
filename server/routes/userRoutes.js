
const SERVER_ERROR_CODE = 500;

module.exports = class UserRoutes {

  constructor(logger, config, fileLoader, userParser, groupParser) {
    this.logger = logger;
    this.fileLoader = fileLoader;
    this.userParser = userParser;
    this.groupParser = groupParser;
    this.usersPath = config.get('runtime.usersPath');
    this.groupsPath = config.get('runtime.groupsPath');

    this.linkRoutes = this.linkRoutes.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getUserWithQuery = this.getUserWithQuery.bind(this);
  }

  linkRoutes(httpServer) {
    httpServer.registerGet(
      '/users',
      this.getUsers
    );
    httpServer.registerGet(
      '/users/query',
      this.getUserWithQuery
    );
    httpServer.registerGet(
      '/users/:uid',
      this.getUser
    );
  }

  async getUsers(req, res) {
    try {
      const lines = await this.fileLoader.loadFile(this.usersPath);
      const users = this.userParser.parse(lines);
      res.json(users);
    } catch (e) {
      this.logger.error(e);
      console.trace(e);
      res.status(SERVER_ERROR_CODE).json({ msg: 'Error while processing getUsers' });
    }
  }

  async getUser(req, res) {
    try {
      const uid = req.params.uid;
      const lines = await this.fileLoader.loadFile(this.usersPath);
      const users = this.userParser.parse(lines);
      const user = this.userParser.findSingle(users, {uid:uid});
      res.json(user);
    } catch (e) {
      this.logger.error(e);
      console.trace(e);
      res.status(SERVER_ERROR_CODE).json({ msg: 'Error while processing getUser' });
    }
  }

  async getUserWithQuery(req, res) {
    try {
      const lines = await this.fileLoader.loadFile(this.usersPath);
      const users = this.userParser.parse(lines);
      res.json(this.userParser.findAll(users, req.query));
    } catch (e) {
      this.logger.error(e);
      console.trace(e);
      res.status(SERVER_ERROR_CODE).json({ msg: 'Error while processing getUserWithQuery' });
    }
  }

};
