var authController = require('./controllers/auth');

module.exports = function (app) {
    app.get('/', authController.index);
    app.get('/signin', authController.signin);
    app.get('/logout', authController.logout);
    app.get('/auth/callback', authController.authCallback);
    app.get('/auth/test', authController.test);
};