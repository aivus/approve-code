var github = require('./githubApiClient').baseGHApiClient;
var Promise = require('bluebird');
var client = require('../helpers/redisHelper').client;
var userModel = require('../models/user');
var _ = require('lodash');

// Retrieve and return user repos if they doesn't exist
// If they are exist - return from session
function getUserRepos(user, params) {
    var options = _.extend({}, params);

    // TODO: Refactor this
    return client.hexists('user:' + user.id, 'repos').then(function(exists) {
        if (!exists || options.forceUpdate == true) {
            return userModel.getAccessToken(user).then(function(access_token) {
                return github.user_repos({
                    access_token: access_token
                }).then(function(repos) {
                    return client.hset('user:' + user.id, 'repos', repos).then(function(result) {
                        console.log('retrieve repos from github');
                        return Promise.resolve(repos);
                    });
                });
            });
        } else {
            console.log('retrieve repos from redis');
            return client.hget('user:' + user.id, 'repos').then(function(repos) {
                return Promise.resolve(repos);
            });
        }
    });
}

module.exports = {
    getUserRepos: getUserRepos
};