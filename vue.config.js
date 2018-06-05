var path = require('path')

module.exports = {
  lintOnSave: false,
  baseUrl: '/',
  css: {
    loaderOptions: {
      sass: {
        includePaths: [
          path.resolve(__dirname, 'node_modules')
        ]
      }
    }
  },
};
