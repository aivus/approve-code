var reposService = require('../../services/repos');

module.exports = {
    reposList: function(req, res) {
        reposService.getUserRepos(req).then(function(repos) {
            res.render('repo_list.twig', {
                user: JSON.parse(req.session.user),
                repos: JSON.parse(repos)
            });
        });
    },

    sync: function (req, res) {
        reposService.getUserRepos(req, true).then(function(repos) {
            res.redirect('/repos');
        });
    }
};