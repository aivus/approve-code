var _ = require('lodash');
var userModel = require('../../models/user');

module.exports = {
    index: function (req, res) {
        userModel.getProfile(req.session.user_id).done(function(user) {
            res.render('index.twig', {
                user: user
            });
        });
    }
};