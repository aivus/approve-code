var repo = require('../models/repoModel');

module.exports = {
    list: function (req, res) {
        res.render('repo_list.twig', {
            user: req.user
        });
    },

    sync: function (req, res) {
        repo.getActualUserRepos(req.user).then(function (repos) {
            res.redirect('/repos');
        });
    },

    changeState: function changeState(req, res) {
        repo.changeRepoState(req.user, +req.params.id, req.body.state == 'true').then(function () {
            // @todo need implement this
            res.sendStatus(200);
        }).catch(function (error) {
            console.log(error);
            res.status(500).send('Server error');
        });
    }
};
