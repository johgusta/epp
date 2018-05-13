var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: ['./src/js/app.js']
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { test: /\.css$/, loader: 'style-loader!css-loader' }
        ]
    },
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin([
            { from: './src/static' }
        ])
    ],
    devServer: {
        historyApiFallback: true
    }
};