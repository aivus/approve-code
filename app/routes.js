var auth = require('./controllers/auth');
var index = require('./controllers/index');
var repo = require('./controllers/repo');

module.exports = function (app) {
    app.get('/', index.index);
    app.get('/auth/signin', auth.signin);
    app.get('/auth/callback', auth.callback);
    app.get('/auth/logout', auth.logout);

    app.get('/repos', checkAuthAndGetUser, repo.list);
    app.get('/repos/sync', checkAuthAndGetUser, repo.sync);
    app.post('/repos/:id/state', checkAuthAndGetUser, repo.changeState);
};

/**
 * Middleware for check user authenticate
 *
 * @param req
 * @param res
 * @param next
 */
var checkAuthAndGetUser = function (req, res, next) {
    // TODO: Think about move it somewhere
    if (req.user) {
        return next();
    } else {
        res.status(403).send('Forbidden');
    }
};