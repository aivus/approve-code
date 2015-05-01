var reposService = require('../../services/repos');
var users = require('../../services/users');
var _ = require('lodash');

module.exports = {
    list: function(req, res) {
        reposService.getUserRepos(req.user).then(function(reposData) {
            res.render('repo_list.twig', {
                user: req.user,
                repos: reposData.repos,
                reposUpdatedAt: reposData.updatedAt
            });
        });
    },

    sync: function (req, res) {
        reposService.getUserRepos(req.user, {forceUpdate: true}).then(function (reposData) {
            res.redirect('/repos');
        });
    },

    changeState: function changeState(req, res) {
        reposService.changeRepoState(req.user, +req.params.id, req.params.state).then(function(result) {
            // @todo need implment this
            res.sendStatus(200);
        }).catch(function() {
            res.status(403).send('Forbidden');
        });
    }
};
