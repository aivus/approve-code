var express = require('express');
var configureRoutes = require('./routes');
var configureMiddleware = require('./middleware');

var app = express();
configureRoutes(app);
configureMiddleware(app);

app.listen(3000, function() {
    console.log('Started!');
});
