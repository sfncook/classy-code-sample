const fs = require('fs');

module.exports = class FileLoader {
  constructor(logger, readline) {
    this.logger = logger;
    this.readline = readline;

    this.loadFile = this.loadFile.bind(this);
  }

  async loadFile(path) {
    return new Promise((resolve, reject)=>{
      const readInt = this.readline.createInterface({input: fs.createReadStream(path)});
      const lines = [];
      readInt.on('line', line=>{  
        lines.push(line);
      });
      readInt.on('close', ()=>{
        resolve(lines);
      });
    });
  }

};