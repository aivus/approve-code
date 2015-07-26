var mongoose = require('mongoose');
var repo = require('./repoModel');
var _ = require('lodash');

var UserSchema = new mongoose.Schema({
    profile: {
        gid: Number,
        login: String,
        name: String,
        email: String
    },
    repos: [repo.RepoSchema],
    reposSynced: Number,
    accessToken: String
});

var UserModel = mongoose.model('user', UserSchema);

var getProfile = function (gid) {
    return getUser(gid).then(function (user) {
        return user ? user.profile : null;
    });
};

var updateProfile = function (user) {
    var newData = {
        profile: {
            gid: user.id,
            login: user.login,
            name: user.name,
            email: user.email
        }
    };

    return UserModel.findOneAndUpdate({'profile.gid': user.id}, newData, {
        new: true,
        upsert: true
    }).exec();
};

var getAccessToken = function (gid) {
    return UserModel.findOne({'profile.gid': gid}).exec().then(function (user) {
        return user.accessToken;
    });
};

var updateAccessToken = function (gid, accessToken) {
    return UserModel.findOneAndUpdate({'profile.gid': gid}, {accessToken: accessToken}, {new: true}).exec();
};

var getUser = function (gid) {
    return UserModel.findOne({'profile.gid': gid}).exec();
};

module.exports = {
    getProfile: getProfile,
    updateProfile: updateProfile,
    getUser: getUser,
    getAccessToken: getAccessToken,
    updateAccessToken: updateAccessToken,
    UserModel: UserModel
};
