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
                        return Promise.resolve({repos: JSON.parse(repos), updatedAt: currentTimestamp});
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

function getReposSettingsByUser(user) {
    return getUserRepos(user).then(function(reposData) {
        return Promise.reduce(reposData.repos, function(total, repo) {
            return client.hgetall('repo:' + repo.id).then(function(settings) {
                if (settings) {
                    console.log(repo.id, settings);
                    total[repo.id] = settings;
                }
                return total;
            });
        }, {});
    });
}

function changeRepoState(user, accessToken, repoId, state) {
    // Force update to prevent changing repository settings without repository on github
    var repo;
    return getUserRepos(user, {forceUpdate: true}).then(function(reposData) {
        repo = _.find(reposData.repos, {id: repoId});
        if (!repo) {
            return Promise.reject('Repository not found');
        }

        return client.hmget('repo:' + repoId, 'hookId');
    }).then(function (redisData) {
        // Remove webhook if it was set early
        if (redisData[0]) {
            return client.hdel('repo:' + repoId, 'hookId').then(function() {
                return client.hset('repo:' + repoId, 'state', false).then(function() {
                    console.log('try to remove webhook:', redisData[0]);
                    return github.removeHook({
                        owner: repo.owner.login,
                        repo: repo.name,
                        hookId: redisData[0]
                    }, {
                        headers: {
                            Authorization: 'token ' + accessToken
                        }
                    });
                })
            });
        }

        // If webhook not setted early - continue
        return Promise.resolve();
    }).then(function(){
        // Add webhook
        if (state) {
            console.log('token', accessToken);
            return github.createHook({
                owner: repo.owner.login,
                repo: repo.name,
                name: 'web',
                config: {
                    // @todo: Move it to config
                    url: 'http://approve-code.aws.antipenko.pp.ua/webhook',
                    content_type: 'json',
                    insecure_ssl: 1
                },
                events: [
                    'pull_request',
                    'pull_request_review_comment'
                ],
                active: 1
            }, {
                headers: {
                    Authorization: 'token ' + accessToken
                }
            });
        }

        return Promise.resolve();
    }).then(function(webhookData) {
        if (webhookData) {
            return client.hmset('repo:' + repoId, 'state', state, 'hookId', webhookData.id);
        } else {
            return client.hmset('repo:' + repoId, 'state', state);
        }
    });
}

module.exports = {
    getUserRepos: getUserRepos,
    changeRepoState: changeRepoState,
    getReposSettingsByUser: getReposSettingsByUser
};