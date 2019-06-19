const _ = require('lodash');

module.exports = class GroupParser {
  constructor() {
    this.parse = this.parse.bind(this);
  }

  parse(groupStrs) {
    return _.map(groupStrs, userString=>{
      const tokens = userString.split(':');
      return {
        name:tokens[0],
        gid:tokens[2],
        members:tokens[3].split(',')
      };
    });
  }

  findAll(groups, queryParams) {
    const foundGroups = _.filter(groups, queryParams);
    let groupsWithMembers = [];
    if(queryParams.member) {
      groupsWithMembers = _.filter(groups, group=>{
        const intersection = _.intersection(group.members, queryParams.member);
        return intersection.length>0;
      });
    }
    return [...foundGroups, ...groupsWithMembers];
  }

  findSingle(groups, queryParams) {
    const objs = this.findAll(groups, queryParams);
    if(objs && objs.length) {
      return objs[0];
    } else {
      return undefined;
    }
  }

};
