var express = require('express');
var path = require('path');

var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS

var app = express();

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, '../build');

var useSslRedirect = process.env.FORCE_SSL === 'true';
if (useSslRedirect) {
    var configIgnoreHosts = process.env.SSL_IGNORE_HOSTS;
    ignoreHosts = configIgnoreHosts ? JSON.parse(configIgnoreHosts) : undefined;
    app.use(redirectToHTTPS(ignoreHosts));
}

// We point to our static assets
app.use(express.static(publicPath));

app.get('*', function(request, response){
    response.sendFile(path.resolve(__dirname, '../build/index.html'));
});

// And run the server
app.listen(port, function () {
    console.log('Server running on port ' + port);
});