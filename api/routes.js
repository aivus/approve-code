var authController = require('./controllers/auth');
var indexController = require('./controllers/index');

module.exports = function (app) {
    app.get('/', indexController.index);
    app.get('/signin', authController.signin);
    app.get('/logout', authController.logout);
    app.get('/auth/callback', authController.authCallback);
};