var authController = require('./controllers/auth');
var indexController = require('./controllers/index');
var repoController = require('./controllers/repo');

module.exports = function (app) {
    app.get('/', indexController.index);
    app.get('/auth/signin', authController.signin);
    app.get('/auth/callback', authController.authCallback);
    app.get('/auth/logout', authController.logout);

    app.get('/repos', authController.checkAuth, repoController.reposList);
    app.get('/repos/sync', authController.checkAuth, repoController.sync);
};