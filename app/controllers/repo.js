var reposService = require('../../services/repos');
var users = require('../../services/users');

module.exports = {
    reposList: function(req, res) {
        users.getProfile(req.session.user_id).then(function(user) {
            reposService.getUserRepos(user).then(function(reposData) {
                res.render('repo_list.twig', {
                    user: user,
                    repos: JSON.parse(reposData.repos),
                    reposUpdatedAt: +reposData.updatedAt
                });
            });
        });
    },

    sync: function (req, res) {
        users.getProfile(req.session.user_id).then(function(user) {
            reposService.getUserRepos(user, {forceUpdate: true}).then(function (reposData) {
                res.redirect('/repos');
            });
        });
    }
};