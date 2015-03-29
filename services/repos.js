var github = require('./githubApiClient').baseGHApiClient;
var Promise = require('bluebird');

function getReposForTemplate(req) {
    return github.user_repos({
        access_token: req.session.access_token
    })
    //    .then(function(body) {
    //    return Promise.resolve(body);
    //})
        ;
}

module.exports = {
    getReposForTemplate: getReposForTemplate
};