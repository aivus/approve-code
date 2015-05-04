var auth = require('../../services/auth');
var users = require('../../services/users');
var github = require('../../services/githubApiClient');
var _ = require('lodash');

module.exports = {

    signin : function (req, res) {
        res.redirect(auth.getGHAuthenticateLink(req.session.github_nonce));
    },

    logout: function(req, res) {
        req.session.destroy();
        delete req.session;
        res.redirect('/');
    },

    authCallback: function(req, res) {
        var nonce = req.session.github_nonce;
        if (!req.query.code || req.query.state != nonce) {
            res.status(401).send('Invalid state or code not found');
            return;
        }

        // Trying to authorize
        auth.authorize(req.query.code).then(function (user) {
            req.session.user_id = user.id;
        }).done(function(){
            res.redirect('/');
        });
    },

    /**
     * Middleware for check user authenticate
     *
     * @param req
     * @param res
     * @param next
     */
    checkAuthAndGetUser: function (req, res, next) {
        if (auth.isAuthorized(req.session.user_id)) {
            return users.getProfile(req.session.user_id).then(function(user){
                req.user = user;
                return users.getAccessToken(user).then(function(accessToken) {
                    // @todo: Dirty hack
                    github.headers = _.extend({}, github.headers, {Authorization: 'token ' + accessToken});
                    req.accessToken = accessToken;
                    return next();
                });
            });
        } else {
            res.status(403).send('Forbidden');
        }
    }
};
