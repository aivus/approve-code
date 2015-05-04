var reposService = require('../../services/repos');
var users = require('../../services/users');
var _ = require('lodash');

module.exports = {
    list: function(req, res) {
        reposService.getReposSettingsByUser(req.user).then(function(reposSettings) {
            reposService.getUserRepos(req.user).then(function(reposData) {
                res.render('repo_list.twig', {
                    user: req.user,
                    repos: reposData.repos,
                    reposUpdatedAt: reposData.updatedAt,
                    reposSettings: reposSettings
                });
            });
        });
    },

    sync: function (req, res) {
        reposService.getUserRepos(req.user, {forceUpdate: true}).then(function (reposData) {
            res.redirect('/repos');
        });
    },

    changeState: function changeState(req, res) {
        reposService.changeRepoState(req.user, req.accessToken, +req.params.id, req.body.state == 'true').then(function(result) {
            // @todo need implement this
            console.log('Success');
            res.sendStatus(200);
        }).catch(function() {
            console.log(arguments);
            res.status(500).send('Server error');
        });
    }
};
