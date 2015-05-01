var Promise = require('bluebird');
var _ = require('lodash');
var ghConfig = require('../config/github');
var crypto = require('crypto');
var loginClient = require('./githubLoginClient');
var apiClient = require('./githubApiClient');
var users = require('./users');

function getGHAuthenticateLink(nonce) {
    return 'https://github.com/login/oauth/authorize'
        + '?client_id=' + ghConfig.client_id
        + '&scope=' + ghConfig.scope.join()
        + '&state=' + nonce;
}

function generateNonce(length) {
    return crypto.randomBytes(length * 2).toString("hex").slice(0, length);
}

function authorize(code) {
    return loginClient.authorize({
        client_id: ghConfig.client_id,
        client_secret: ghConfig.client_secret,
        code: code
    }).then(function(authInfo) {
        // Check on access_token and correct scope
        var isScopesSame = _.difference(authInfo.scope.split(','), ghConfig.scope).length == 0;

        if (authInfo.access_token && isScopesSame) {
            return getCurrentUser(authInfo.access_token).then(function(userInfo) {
                userInfo = JSON.parse(userInfo);
                // Store access_token and profile to redis
                users.updateAccessToken(userInfo, authInfo.access_token);
                users.updateProfile(userInfo);
                return Promise.resolve(userInfo);
            });
        } else {
            return Promise.reject();
        }
    });
}

function isAuthorized(user) {
    return !_.isUndefined(user);
}

function getCurrentUser(access_token) {
    return apiClient.user({
        access_token: access_token
    });
}

module.exports = {
    generateNonce: generateNonce,
    getGHAuthenticateLink: getGHAuthenticateLink,
    authorize: authorize,
    isAuthorized: isAuthorized
};
