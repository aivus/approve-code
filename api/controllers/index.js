var auth = require('../../services/auth');

module.exports = {
    index: function (req, res) {
        res.render('login.twig', {
            github_signin_url: auth.getGHAuthenticateLink()
        });
    },

    authCallback: function(req, res) {
        var nonce = req.session.github_nonce;
        if (!req.query.code || req.query.state != nonce) {
            res.status(401);
            return;
        }

        if (!res.session.access_token) {
            res.session.access_token = auth.getAccessToken();
        }

        //res.redirect('/');
        res.send('ok');
    }
};