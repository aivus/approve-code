var Promise = require('bluebird');
var ghConfig = require('../config/github');
var crypto = require('crypto');
var loginClient = require('./githubLoginClient');
var apiClient = require('./githubApiClient');
var userModel = require('../app/models/userModel');
var repoModel = require('../app/models/repoModel');
var _ = require('lodash');

function getGHAuthenticateLink(nonce) {
    return 'https://github.com/login/oauth/authorize' +
        '?client_id=' + ghConfig.client_id +
        '&scope=' + ghConfig.scope.join() +
        '&state=' + nonce;
}

function generateNonce(length) {
    return crypto.randomBytes(length * 2).toString('hex').slice(0, length);
}

var authorize = function (code) {
    return loginClient.authorize({
        client_id: ghConfig.client_id,
        client_secret: ghConfig.client_secret,
        code: code
    }).then(function (authInfo) {
        if (authInfo.error) {
            return Promise.reject(new Error(authInfo.error));
        }

        // Check on access_token and correct scope
        var isScopesSame = _.difference(authInfo.scope.split(','), ghConfig.scope).length == 0;

        if (authInfo.access_token && isScopesSame) {
            return getCurrentUserByApi(authInfo.access_token).then(function (userInfo) {
                // Update user info in db
                var newUserData = _.extend({}, JSON.parse(userInfo), {accessToken: authInfo.access_token});
                return userModel.updateOrCreateUser(newUserData).then(function(user) {
                    return repoModel.getActualUserRepos(user).then(function (repos) {
                        return user;
                    });
                });
            });
        } else {
            // @todo: Add error code
            return Promise.reject();
        }
    });
};

function getCurrentUserByApi(accessToken) {
    return apiClient.user({
        access_token: accessToken
    });
}

module.exports = {
    generateNonce: generateNonce,
    getGHAuthenticateLink: getGHAuthenticateLink,
    authorize: authorize
};
