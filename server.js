/* eslint-disable */

var express = require('express');
var path = require('path');
var history = require('connect-history-api-fallback');

var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS

var app = express();

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;

var useSslRedirect = process.env.FORCE_SSL === 'true';
if (useSslRedirect) {
    var configIgnoreHosts = process.env.SSL_IGNORE_HOSTS;
    var ignoreHosts = configIgnoreHosts ? JSON.parse(configIgnoreHosts) : undefined;
    app.use(redirectToHTTPS(ignoreHosts));
}

// We point to our static assets
var publicPath = path.resolve(__dirname, './dist');
var staticMiddleware = express.static(publicPath)
app.use(staticMiddleware);
app.use(history());
app.use(staticMiddleware);

// app.get('*', function(request, response){
//     response.sendFile(path.resolve(__dirname, '../build/index.html'));
// });

// And run the server
app.listen(port, function () {
    console.log('Server running on port ' + port);
});
