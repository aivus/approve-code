var github = require('./githubApiClient').baseGHApiClient;
var Promise = require('bluebird');
var redis = require("then-redis");
var client = redis.createClient();

// Retrieve and return user repos if they doesn't exist
// If they are exist - return from session
function getUserRepos(req, forceUpdate) {
    return client.hexists('user:' + req.session.user.id, 'repos').then(function(exists) {
        if (!exists || forceUpdate == true) {
            return github.user_repos({
                access_token: req.session.access_token
            }).then(function(repos) {
                return client.hset('user:' + req.session.user.id, 'repos', repos).then(function(result) {
                    return Promise.resolve(repos);
                });
            });
        } else {
            console.log('from the redis');
            return client.hget('user:' + req.session.user.id, 'repos').then(function(repos) {
                return Promise.resolve(repos);
            });
        }
    });
}

module.exports = {
    getUserRepos: getUserRepos
};