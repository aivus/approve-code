var redis = require('../helpers/redisHelper').client;
//var Promise = require('bluebird');

module.exports = {
    getProfile: function(id) {
        console.log('getProfile:', id);
        return redis.hget('user:' + id, 'profile').then(function(profile) {
            return JSON.parse(profile);
        });
    },

    updateProfile: function(user) {
        console.log('updateProfile:', user.id);
        return redis.hset('user:' + user.id, 'profile', JSON.stringify(user)).then(function(result) {
            return result;
        });
    },

    getAccessToken: function(user) {
        console.log('getAccessToken:', user.id);
        return redis.hget('user:' + user.id, 'access_token').then(function(access_token) {
            return access_token;
        });
    },

    updateAccessToken: function(user, access_token) {
        console.log('updateAccessToken:', user.id);
        return redis.hset('user:' + user.id, 'access_token', access_token).then(function(success) {
            return success;
        });
    }
};
