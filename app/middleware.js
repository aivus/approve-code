var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var auth = require('../services/auth');
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
            req.user = user;
            return next();
        });
    });

    app.set('views', path.resolve(__dirname, 'views'));
    app.set('view engine', 'twig');
};
