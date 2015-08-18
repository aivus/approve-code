var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var auth = require('../services/auth');
var authController = require('./controllers/auth');
var userModel = require('./models/userModel');

module.exports = function (app) {
    app.use(bodyParser.json());         // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    app.use(express.static(path.resolve(__dirname, '../public')));
    app.use(session({
        store: new FileStore(),
        secret: 'some-secret',
        resave: false,
        saveUninitialized: true
    }));

    app.use(function (req, res, next) {
        if (!req.session.github_nonce) {
            req.session.github_nonce = auth.generateNonce(64);
        }

        return next();
    });

    app.use(function (req, res, next) {
        req.user = null;

        if (!req.session.user_id) {
            return next();
        }

        return userModel.getUser(req.session.user_id).then(function (user) {

            // User not found in db
            if (!user) {
                authController.logout(req, res);
                return;
            }

            req.user = user;
            return next();
        });
    });

    // Show /repos only for authorized users
    app.use('/repos', checkAuthAndGetUser);

    app.set('views', path.resolve(__dirname, 'views'));
    app.set('view engine', 'twig');
};

/**
 * Middleware for check user authenticate
 *
 * @param req
 * @param res
 * @param next
 */
var checkAuthAndGetUser = function (req, res, next) {
    if (req.user) {
        return next();
    } else {
        res.status(403).send('Forbidden');
    }
};