var mongoose = require('mongoose');
var repo = require('./repoModel');
var _ = require('lodash');

var UserSchema = new mongoose.Schema({
    profile: {
        id: Number,
        login: String,
        name: String,
        email: String
    },
    repos: [repo.RepoSchema],
    reposSynced: Number,
    accessToken: String
});

var UserModel = mongoose.model('user', UserSchema);

var updateOrCreateUser = function (userData) {
    return UserModel.findOne({'profile.id': userData.id}).exec().then(function (user) {
        return user ? user : createUser(userData);
    });
};

var createUser = function (userData) {
    var user = new UserModel({
        profile: _.pick(userData, ['id', 'login', 'name', 'email']),
        accessToken: userData.accessToken
    });

    return user.save();
};

var getUser = function (id) {
    return UserModel.findOne({'profile.id': id}).exec();
};

module.exports = {
    createUser: createUser,
    updateOrCreateUser: updateOrCreateUser,
    getUser: getUser,
    UserModel: UserModel
};
