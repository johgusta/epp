const path = require('path');

module.exports = {
  lintOnSave: true,
  css: {
    loaderOptions: {
      sass: {
        includePaths: [
          path.resolve(__dirname, 'node_modules'),
        ],
      },
    },
  },
  devServer: {
    port: 3000,
  },
};
