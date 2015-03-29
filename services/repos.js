var github = require('./githubApiClient').baseGHApiClient;
var Promise = require('bluebird');
//var redis = require("redis");
//var client = redis.createClient();

// Retrieve and return user repos if they doesn't exist
// If they are exist - return from session
function getUserRepos(req, forceUpdate) {
    if (!req.session.repos || forceUpdate == true) {
        return github.user_repos({
            access_token: req.session.access_token
        }).then(function(repos) {
            req.session.repos = repos;
            return Promise.resolve(repos);
        });
    } else {
        console.log('from the session');
        return Promise.resolve(req.session.repos);
    }
}

module.exports = {
    getUserRepos: getUserRepos
};