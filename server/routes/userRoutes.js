
const NOT_FOUND_CODE = 404;
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
      '/users/query',
      this.getUsersWithQuery
    );
    httpServer.registerGet(
      '/users/:uid',
      this.getUser
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
      if(user) {
        res.json(user);
      } else {
        res.status(NOT_FOUND_CODE).send('Not Found');
      }
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
      const foundUsers = this.userParser.findAll(users, req.query);
      if(foundUsers && foundUsers.length>0) {
        res.json(foundUsers);
      } else {
        res.status(NOT_FOUND_CODE).send('Not Found');
      }
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
      const user = this.userParser.findSingle(users, {uid:uid}) || {};

      const groupsStrs = await this.fileLoader.loadFile(this.groupsPath);
      const allGroups = this.groupParser.parse(groupsStrs);
      const groupsForUser = this.groupParser.findAll(allGroups, {member:[user.name]});
      if(groupsForUser && groupsForUser.length>0) {
        res.json(groupsForUser);
      } else {
        res.status(NOT_FOUND_CODE).send('Not Found');
      }
    } catch (e) {
      this.logger.error(e);
      console.trace(e);
      res.status(SERVER_ERROR_CODE).json({ msg: 'Error while processing getUserGroups' });
    }
  }

};
