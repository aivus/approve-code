var GitHubApi = require('github');

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: true,
    protocol: "https",
    timeout: 5000,
    headers: {
        "user-agent": "Approve-github-pullrequest" // GitHub is happy with a unique user agent
    }
});

module.exports = {
    getAPI: function() {
        return github
    },

    test: function(request, response) {

        github.authenticate({
            type: 'oauth',
            token: ''
        });

        var msg = {
            user: 'aivus',
            repo: 'test',
            sha: '',
            state: 'success',
            description: 'Some description',
            context: 'success'
        };

        github.statuses.create(msg, function(error, data) {
            console.log(error, data);
        });

        response.send('OK');
    }
};