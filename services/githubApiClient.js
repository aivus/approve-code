var ApiClient = require('apiapi');

// Base GH client for access to API
var apiClient = new ApiClient({
    baseUrl: 'https://api.github.com',

    // Define api methods
    methods: {
        user: 'get /user',
        user_repos: 'get /user/repos'
    },

    // Github api requires proper user-agent to work
    headers: {
        'user-agent': 'approve-me/base'
    }
});

module.exports = apiClient;
