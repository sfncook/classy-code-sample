const _ = require('lodash');

module.exports = class UserParser {
  constructor() {
    this.parse = this.parse.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findSingle = this.findSingle.bind(this);
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

  findAll(users, queryParams) {
    return _.filter(users, queryParams);
  }

  findSingle(users, queryParams) {
    const objs = this.findAll(users, queryParams);
    if(objs && objs.length) {
      return objs[0];
    } else {
      return undefined;
    }
  }

};