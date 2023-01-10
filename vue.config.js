//vue.config.js
var path = require('path');

module.exports = {
    outputDir: path.resolve('/Users/andrischatz/dev/personal/thisbody-server-main/dist'),
    css: {
     loaderOptions: {
      //pass options to stylus-loader
      stylus: {
       import: [path.resolve(__dirname, 'src/styles/vars')]
      }
     }
    }
   }