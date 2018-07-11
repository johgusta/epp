const path = require('path');

module.exports = {
  lintOnSave: true,
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(glsl|vs|fs)$/,
          use: 'shader-loader',
          // options: {
          //   glsl: {
          //     chunkPath: path.resolve("/glsl/chunks")
          //   }
          // }
        },
      ],
    },
  },
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
