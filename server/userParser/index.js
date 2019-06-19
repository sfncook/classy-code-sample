const _ = require('lodash');

module.exports = class UserParser {
  constructor() {
    this.parse = this.parse.bind(this);
  }

  parse(userStrs) {
    return _.map(userStrs, userString=>{
      const tokens = userString.split(':');
      return {
        name:tokens[0],
        uid:tokens[2],
        gid:tokens[3],
        comment:tokens[4],
        home:tokens[5],
        shell:tokens[6]
      };
    });
  }

};