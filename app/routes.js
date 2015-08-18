var auth = require('./controllers/auth');
var index = require('./controllers/index');
var repo = require('./controllers/repo');

module.exports = function (app) {
    app.get('/', index.index);

    app.get('/auth/signin', auth.signin);
    app.get('/auth/callback', auth.callback);
    app.get('/auth/logout', auth.logout);

    app.get('/repos', repo.list);
    app.get('/repos/sync', repo.sync);
    app.post('/repos/:id/process/enable', repo.enableProcess);
    app.post('/repos/:id/process/disable', repo.disableProcess);
};