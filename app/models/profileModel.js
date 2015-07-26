var mongoose = require('mongoose');

var ProfileSchema = new mongoose.Schema({
    gid: Number,
    login: String,
    name: String,
    email: String
});

module.exports = {
    ProfileSchema: ProfileSchema
};