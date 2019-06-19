
const SERVER_ERROR_CODE = 500;

module.exports = class GroupRoutes {

  constructor(logger, config, fileLoader, userParser, groupParser) {
    this.logger = logger;
    this.fileLoader = fileLoader;
    this.userParser = userParser;
    this.groupParser = groupParser;
    this.usersPath = config.get('runtime.usersPath');
    this.groupsPath = config.get('runtime.groupsPath');

    this.linkRoutes = this.linkRoutes.bind(this);
    this.getUserGroups = this.getUserGroups.bind(this);
    this.getGroups = this.getGroups.bind(this);
  }

  linkRoutes(httpServer) {
    httpServer.registerGet(
      '/users/:uid/groups',
      this.getUserGroups
    );
    httpServer.registerGet(
      '/groups',
      this.getGroups
    );
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

  async getGroups(req, res) {
    try {
      const lines = await this.fileLoader.loadFile(this.groupsPath);
      const groups = this.groupParser.parse(lines);
      res.json(groups);
    } catch (e) {
      res.status(SERVER_ERROR_CODE).json({ msg: 'Error while processing getGroups' });
    }
  }


};
