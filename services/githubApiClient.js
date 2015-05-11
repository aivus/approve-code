var ApiClient = require('apiapi');

// Base GH client for access to API
var apiClient = new ApiClient({
    baseUrl: 'https://api.github.com',

    // Define api methods
    methods: {
        user: 'get /user',
        getUserRepos: 'get /user/repos',
        getHook: 'get /repos/{owner}/{repo}/hooks/{hookId}',
        createHook: 'post /repos/{owner}/{repo}/hooks',
        removeHook: 'delete /repos/{owner}/{repo}/hooks/{hookId}'
    },

    // Github api requires proper user-agent to work
    headers: {
        'user-agent': 'approve-me/base'
    }
});

module.exports = apiClient;
