var ghConfig = require('../config/github');
var crypto = require('crypto');

function getGHAuthenticateLink() {
    var state = generateNonce(64);
    var link = 'https://github.com/login/oauth/authorize'
        + '?client_id=' + ghConfig.client_id
        + '&scope=user,repo'
        + '&state=' + state;

    return link;
}

function generateNonce(length) {
    return crypto.randomBytes(length * 2).toString("hex").slice(0, length);
}

function getAccessToken () {
    // TODO: Add session check

    github.authorization.create({
        scopes: ["user", "repo"],
        note: "what this auth is for",
        note_url: "http://url-to-this-auth-app"
        //,
        //headers: {
        //    "X-GitHub-OTP": ""
        //}
    }, function(err, res) {
        if (res && res.token) {
            return res.token;
        }
    });
}

module.exports = {
    generateNonce: generateNonce,
    getGHAuthenticateLink: getGHAuthenticateLink,
    getAccessToken: getAccessToken
};