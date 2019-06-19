
const SERVER_ERROR_CODE = 500;

module.exports = class RuntimeRoutes {

  constructor(logger) {
    this.logger = logger;

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
    res.json({status:'ok'});
    // try {
    // } catch (e) {res.status(SERVER_ERROR_CODE).json({ msg: 'Error while processing getUsers' })}
  }


};
