var github = require('./githubApiClient').baseGHApiClient;
var Promise = require('bluebird');
var client = require('../helpers/redisHelper').client;

// Retrieve and return user repos if they doesn't exist
// If they are exist - return from session
function getUserRepos(req, forceUpdate) {
    var user = JSON.parse(req.session.user);
    return client.hexists('user:' + user.id, 'repos').then(function(exists) {
        if (!exists || forceUpdate == true) {
            return github.user_repos({
                access_token: req.session.access_token
            }).then(function(repos) {
                return client.hset('user:' + user.id, 'repos', repos).then(function(result) {
                    console.log('retrieve repos from github');
                    return Promise.resolve(repos);
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