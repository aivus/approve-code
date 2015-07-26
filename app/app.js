// Configure mongoose connection
require('../helpers/dbHelper');

var express = require('express');
var configureRoutes = require('./routes');
var configureMiddleware = require('./middleware');

var app = express();
configureMiddleware(app);
configureRoutes(app);

app.listen(3000, function() {
    console.log('Started!');
});
