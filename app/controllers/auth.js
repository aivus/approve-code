var userModel = require('../models/userModel');
var auth = require('../../services/auth');
var github = require('../../services/githubApiClient');

var signin = function (req, res) {
    res.redirect(auth.getGHAuthenticateLink(req.session.github_nonce));
};

var logout = function (req, res) {
    req.session.destroy();
    delete req.session;
    res.redirect('/');
};

var callback = function (req, res) {
    var nonce = req.session.github_nonce;
    if (!req.query.code || req.query.state != nonce) {
        res.status(401).send('Invalid state or code not found');
        return;
    }

    // Trying to authorize
    auth.authorize(req.query.code).then(function (user) {
        req.session.user_id = user.profile.id;
        res.redirect('/');
    }).catch(function () {
        res.redirect('/');
    });
};

module.exports = {
    signin: signin,
    logout: logout,
    callback: callback
};
