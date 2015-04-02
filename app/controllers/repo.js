var reposService = require('../../services/repos');
var userModel = require('../../models/user');

module.exports = {
    reposList: function(req, res) {
        userModel.getProfile(req.session.user_id).then(function(user) {
            reposService.getUserRepos(user).then(function(repos) {
                res.render('repo_list.twig', {
                    user: user,
                    repos: JSON.parse(repos)
                });
            });
        });
    },

    sync: function (req, res) {
        userModel.getProfile(req.session.user_id).then(function(user) {
            reposService.getUserRepos(user, {forceUpdate: true}).then(function (repos) {
                res.redirect('/repos');
            });
        });
    }
};