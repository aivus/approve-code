var auth = require('../../services/auth');

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
        auth.authorize(req).done(function(){
            res.redirect('/');
        });
    }
};