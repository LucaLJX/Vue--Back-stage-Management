var config;

var env = 'dev';
var arguments = process.argv.splice(2);
for (var arg of arguments) {
  if (arg == '--prod') {
    console.log('采用生产模式配置')
    env = 'prod'
  }
}

if (env == 'prod') {
  config = require('./env.config.prod');
} else {
  config = require('./env.config.dev');
}
config.env = env;

module.exports = config

