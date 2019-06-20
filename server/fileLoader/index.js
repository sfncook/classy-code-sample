module.exports = class FileLoader {
  constructor(logger, fs, readline) {
    this.logger = logger;
    this.fs = fs;
    this.readline = readline;

    this.loadFile = this.loadFile.bind(this);
  }

  async loadFile(path) {
    return new Promise((resolve, reject)=>{
      const readStream = this.fs.createReadStream(path);
      readStream.on('error', err=>{reject(`File not found:${path}`)});
      const readInt = this.readline.createInterface({input:readStream});
      const lines = [];
      readInt.on('line', line=>{
        if(!line.startsWith('#')) {
          lines.push(line);
        }
      });
      readInt.on('close', ()=>{
        resolve(lines);
      });
    });
  }

};
