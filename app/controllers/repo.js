var repo = require('../models/repoModel');

var list = function (req, res) {
    res.render('repo_list.twig', {
        user: req.user
    });
};

var sync = function (req, res) {
    repo.getActualUserRepos(req.user).then(function (repos) {
        res.redirect('/repos');
    });
};

/**
 * Change repository process status
 *
 * @param res
 * @param {Object} user
 * @param {int} id
 * @param {boolean} status
 */
var changeRepoProcessStatus = function (res, user, id, status) {
    repo.changeRepoStatus(user, id, status).then(function () {
        // @todo need implement this
        res.sendStatus(200);
    }).catch(function (error) {
        console.log(error);
        res.status(500).send('Server error');
    });
};

var enableProcess = function (req, res) {
    changeRepoProcessStatus(res, req.user, +req.params.id, true);
};

var disableProcess = function (req, res) {
    changeRepoProcessStatus(res, req.user, +req.params.id, true);
};

module.exports = {
    list: list,
    sync: sync,
    enableProcess: enableProcess,
    disableProcess: disableProcess
};
