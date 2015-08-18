var mongoose = require('mongoose');
var mongoConfig = require('../config/mongo');

var db = mongoose.connect(mongoConfig.dsn);

module.exports = db;