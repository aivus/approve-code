var ApiClient = require('apiapi');

// This github APIClient needed for web application flow
var loginGithubApiClient = new ApiClient({
    baseUrl: 'https://github.com',

    // Define api methods
    methods: {
        authorize: 'post /login/oauth/access_token'
    },

    // Github api requires proper user-agent to work
    headers: {
        'user-agent': 'approve-me/login'
    }
});

module.exports = loginGithubApiClient;
