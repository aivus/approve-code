var Promise = require('bluebird');
var _ = require('lodash');
var ghConfig = require('../config/github');
var crypto = require('crypto');
var githubLogin = require('./githubApiClient').loginGHApiClient;
var github = require('./githubApiClient').baseGHApiClient;

function getGHAuthenticateLink(nonce) {
    return 'https://github.com/login/oauth/authorize'
        + '?client_id=' + ghConfig.client_id
        + '&scope=' + ghConfig.scope.join()
        + '&state=' + nonce;
}

function generateNonce(length) {
    return crypto.randomBytes(length * 2).toString("hex").slice(0, length);
}

function authorize(req) {
    return githubLogin.authorize({
        client_id: ghConfig.client_id,
        client_secret: ghConfig.client_secret,
        code: req.query.code
    }).then(function(body) {
        // Check on access_token and correct scope
        if (body.access_token && _.difference(body.scope.split(','), ghConfig.scope).length == 0) {
            // Store access_token to session
            req.session.access_token = body.access_token;
            return Promise.resolve();
        } else {
            return Promise.reject();
        }
    });
}

function isAuthorized(req) {
    console.log(req.session.access_token);
    return req.session.access_token;
}

module.exports = {
    generateNonce: generateNonce,
    getGHAuthenticateLink: getGHAuthenticateLink,
    authorize: authorize,
    isAuthorized: isAuthorized
};