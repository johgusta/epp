var path = require('path')

module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        includePaths: [
          path.resolve(__dirname, 'node_modules')
        ]
      }
    }
  },
  devServer: {
    port: 3000,
  }
};
