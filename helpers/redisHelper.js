var redis = require("then-redis");
var redisConfig = require('../config/redis');
var client = redis.createClient({
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password
});

module.exports = {
    client: client
};
