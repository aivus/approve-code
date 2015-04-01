var _ = require('lodash');

module.exports = {
    index: function (req, res) {
        res.render('index.twig', {
            user: _.isUndefined(req.session.user) ? null : JSON.parse(req.session.user)
        });
    }
};