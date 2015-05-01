var github = require('./githubApiClient');
var Promise = require('bluebird');
var client = require('../helpers/redisHelper').client;
var users = require('./users');
var _ = require('lodash');

// Retrieve and return user repos if they doesn't exist
// If they are exist - return from session
function getUserRepos(user, params) {
    var options = _.extend({}, params);

    // TODO: Refactor this
    return client.hexists('user:' + user.id, 'repos').then(function (exists) {
        if (!exists || options.forceUpdate == true) {
            return users.getAccessToken(user).then(function (accessToken) {
                return github.user_repos({
                    access_token: accessToken
                }).then(function (repos) {
                    var currentTimestamp = Math.floor(new Date().getTime() / 1000);
                    console.log(currentTimestamp);
                    return client.hmset('user:' + user.id, 'repos', repos, 'repos_updated_at', currentTimestamp).then(function (result) {
                        console.log('retrieve repos from github');
                        return Promise.resolve({repos: repos, updatedAt: currentTimestamp});
                    });
                });
            });
        } else {
            console.log('retrieve repos from redis');
            return client.hmget('user:' + user.id, 'repos', 'repos_updated_at').then(function (reposData) {
                return Promise.resolve({repos: JSON.parse(reposData[0]), updatedAt: +reposData[1]});
            });
        }
    });
}

function changeRepoState(user, repoId, state) {
    return getUserRepos(user).then(function(reposData) {
        var repo = _.find(reposData.repos, {id: repoId});
        if (!repo) {
            return Promise.reject();
        }

        // @todo need implement this
        return Promise.resolve();
    });
}

module.exports = {
    getUserRepos: getUserRepos,
    changeRepoState: changeRepoState
};