const convict = require('convict');
const fs = require('fs');

// Define a schema
const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "dev", "test"],
    default: "dev",
    env: "NODE_ENV"
  },

  logger:{
    level: {
      doc: "Log level error,warn,info,debug,verbose,silly",
      format: String,
      default: 'info',
      env: "LOG_LEVEL",
      arg: "logLevel"
    },
    outputConsole:{
      doc: "Print logger output to the console (stdout)",
      format: Boolean,
      default: true,
      env: "LOG_OUTPUT_CONSOLE",
      arg: "logOutputConsole"
    },
    outputFile:{
      doc: "Print logger output to a file (see filename)",
      format: Boolean,
      default: false,
      env: "LOG_OUTPUT_FILE",
      arg: "logOutputFile"
    },
    logDir:{
      doc: "If outputFile is true, path to output logs to",
      format: String,
      default: "logs",
      env: "LOG_DIR",
      arg: "logDir"
    },
  },

  httpServer: {
    port: {
      doc: "HTTP server port.",
      format: "port",
      default: 3000,
      env: "PORT",
      arg: "port"
    },
    cors: {
      origin: {
        doc: "Origins for cors filter.",
        format: Array,
        default: [],
        env: "CORS_ORIGIN",
        arg: "corsOrigin"
      },
      methods: {
        doc: "Origins for cors filter.",
        format: Array,
        default: [],
        env: "CORS_METHODS",
        arg: "corsMethods"
      },
    }
  },
});

// Load environment dependent configuration
const env = config.get('env');

const configEnvFilePath = `./server/config/config_${env}.json`;
(fs.existsSync(configEnvFilePath) && config.loadFile(configEnvFilePath)) || console.warn(`WARNING: configEnvFilePath file not found:${configEnvFilePath}`);

// Perform validation
config.validate({allowed: 'strict'});

module.exports = config;

