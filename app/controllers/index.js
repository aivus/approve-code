var _ = require('lodash');
var users = require('../../services/users');

module.exports = {
    index: function (req, res) {
        users.getProfile(req.session.user_id).done(function(user) {
            res.render('index.twig', {
                user: user
            });
        });
    }
};