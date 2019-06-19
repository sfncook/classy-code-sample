
const SERVER_ERROR_CODE = 500;

module.exports = class GroupRoutes {

  constructor(logger, config, fileLoader, groupParser) {
    this.logger = logger;
    this.fileLoader = fileLoader;
    this.groupParser = groupParser;
    this.groupsPath = config.get('runtime.groupsPath');

    this.linkRoutes = this.linkRoutes.bind(this);
    this.getGroups = this.getGroups.bind(this);
    this.getGroup = this.getGroup.bind(this);
    this.getGroupsWithQuery = this.getGroupsWithQuery.bind(this);
  }

  linkRoutes(httpServer) {
    httpServer.registerGet(
      '/groups',
      this.getGroups
    );
    httpServer.registerGet(
      '/groups/query',
      this.getGroupsWithQuery
    );
    httpServer.registerGet(
      '/groups/:gid',
      this.getGroup
    );
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

  async getGroup(req, res) {
    try {
      const gid = req.params.gid;
      const lines = await this.fileLoader.loadFile(this.groupsPath);
      const groups = this.groupParser.parse(lines);
      const group = this.groupParser.findSingle(groups, {gid:gid});
      res.json(group);
    } catch (e) {
      this.logger.error(e);
      console.trace(e);
      res.status(SERVER_ERROR_CODE).json({ msg: 'Error while processing getGroup' });
    }
  }

  async getGroupsWithQuery(req, res) {
    try {
      console.log('query:',req.query);
      const lines = await this.fileLoader.loadFile(this.groupsPath);
      const groups = this.groupParser.parse(lines);
      res.json(this.groupParser.findAll(groups, req.query));
    } catch (e) {
      this.logger.error(e);
      console.trace(e);
      res.status(SERVER_ERROR_CODE).json({ msg: 'Error while processing getGroupsWithQuery' });
    }
  }


};
