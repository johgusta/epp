var express = require('express');
var path = require('path');

var app = express();

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 5000;
var publicPath = path.resolve(__dirname, '../build');

// We point to our static assets
app.use(express.static(publicPath));

app.get('*', function(request, response){
    response.sendFile(path.resolve(__dirname, '../build/index.html'));
});

// And run the server
app.listen(port, function () {
    console.log('Server running on port ' + port);
});