var _ = require('lodash');

module.exports = {
    index: function (req, res) {
        res.render('index.twig', {
            user: req.user ? req.user : null
        });
    }
};