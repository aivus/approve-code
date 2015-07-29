var mongoose = require('mongoose');
var ghConfig = require('../../config/github');
var github = require('./../../services/githubApiClient');
var Promise = require('bluebird');
var _ = require('lodash');

var PermissionSchema = new mongoose.Schema({
    name: String,
    value: Boolean
});

var RepoSchema = new mongoose.Schema({
    id: Number,
    name: String,
    full_name: String,
    private: Boolean,
    fork: Boolean,
    permissions: mongoose.Schema.Types.Mixed,
    settings: {
        webhookId: Number
    }
});

// Retrieve user repos from github
function getActualUserRepos(user) {
    return github.getUserRepos({access_token: user.accessToken})
        .then(function (reposData) {
            return updateRepos(user, reposData).then(function (user) {
                return user.repos;
            });
        });
}

function changeRepoState(user, repoId, state) {
    // Force update to prevent changing repository settings without repository on github
    return getActualUserRepos(user).then(function (repos) {
        var repo = _.find(repos, {id: repoId});
        if (!repo) {
            return Promise.reject('Repository not found');
        }

        // Remove webhook if it was set early
        if (!state && repo.settings.webhookId) {
            return github.removeHook({
                owner: user.profile.login,
                repo: repo.name,
                hookId: repo.settings.webhookId
            }, {
                headers: {
                    Authorization: 'token ' + user.accessToken
                }
            }).then(function () {
                repo = _.find(user.repos, repo);
                repo.settings.webhookId = null;
                return user.save();
            });
        } else if (state && !repo.settings.webhookId) {
            return github.createHook({
                owner: user.profile.login,
                repo: repo.name,
                name: 'web',
                config: ghConfig.webhookConfig,
                events: [
                    'pull_request',
                    'pull_request_review_comment'
                ],
                active: 1
            }, {
                headers: {
                    Authorization: 'token ' + user.accessToken
                }
            }).then(function (resp) {
                // TODO: Refactor it
                repo = _.find(user.repos, repo);
                repo.settings.webhookId = resp.id;
                //return repo.save();
                return user.save();
            });
        }

        // If webhook not setted early - continue
        return Promise.reject('Reject! State:' + state + '; Webookid:' + repo.settings.webhookId);
    });
}

var updateRepos = function (user, reposData) {
    var repos = JSON.parse(reposData);

    _.forEach(repos, function (repo) {
        // List of fields to update
        var repoFields = ['id', 'name', 'full_name', 'private', 'fork', 'permissions'];

        var foundRepo = _.find(user.repos, {'full_name': repo.full_name});
        var newRepoData = _.pick(repo, repoFields);

        if (foundRepo) {
            _.extend(foundRepo, newRepoData);
        } else {
            user.repos.push(newRepoData);
        }
    });

    user.reposSynced = Math.floor(new Date().getTime() / 1000);
    return user.save();
};

module.exports = {
    RepoSchema: RepoSchema,
    PermissionSchema: PermissionSchema,
    getActualUserRepos: getActualUserRepos,
    changeRepoState: changeRepoState
};