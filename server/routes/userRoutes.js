
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
    this.getUsersWithQuery = this.getUsersWithQuery.bind(this);
    this.getUserGroups = this.getUserGroups.bind(this);
  }

  linkRoutes(httpServer) {
    httpServer.registerGet(
      '/users',
      this.getUsers
    );
    httpServer.registerGet(
      '/users/:uid',
      this.getUser
    );
    httpServer.registerGet(
      '/users/query',
      this.getUsersWithQuery
    );
    httpServer.registerGet(
      '/users/:uid/groups',
      this.getUserGroups
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

  async getUsersWithQuery(req, res) {
    try {
      const lines = await this.fileLoader.loadFile(this.usersPath);
      const users = this.userParser.parse(lines);
      res.json(this.userParser.findAll(users, req.query));
    } catch (e) {
      this.logger.error(e);
      console.trace(e);
      res.status(SERVER_ERROR_CODE).json({ msg: 'Error while processing getUsersWithQuery' });
    }
  }

  async getUserGroups(req, res) {
    try {
      const uid = req.params.uid;
      const lines = await this.fileLoader.loadFile(this.usersPath);
      const users = this.userParser.parse(lines);
      const user = this.userParser.findSingle(users, {uid:uid});

      const groupsStrs = await this.fileLoader.loadFile(this.groupsPath);
      const allGroups = this.groupParser.parse(groupsStrs);
      const groupsForUser = this.groupParser.findAll(allGroups, {members:[user.name]});
      res.json(groupsForUser);
    } catch (e) {
      this.logger.error(e);
      console.trace(e);
      res.status(SERVER_ERROR_CODE).json({ msg: 'Error while processing getUserGroups' });
    }
  }

};
