var auth = require('./controllers/auth');
var index = require('./controllers/index');
var repo = require('./controllers/repo');

module.exports = function (app) {
    app.get('/', index.index);
    app.get('/auth/signin', auth.signin);
    app.get('/auth/callback', auth.authCallback);
    app.get('/auth/logout', auth.logout);

    app.get('/repos', auth.checkAuthAndGetUser, repo.list);
    app.get('/repos/sync', auth.checkAuthAndGetUser, repo.sync);
    app.post('/repos/:id/state', auth.checkAuthAndGetUser, repo.changeState);
};