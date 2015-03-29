var auth = require('../../services/auth');
var reposService = require('../../services/repos');


module.exports = {
    index: function (req, res) {
        if (auth.isAuthorized(req)) {

            reposService.getUserRepos(req).then(function(repos) {
                res.render('repo_list.twig', {
                    user: JSON.parse(req.session.user),
                    repos: JSON.parse(repos)
                });
            });
        } else {
            res.render('index.twig');
        }
    }
};