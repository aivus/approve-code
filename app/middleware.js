var path = require('path');
var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var auth = require('../services/auth');

module.exports = function (app) {
    app.use(express.static(path.resolve(__dirname,  '../public')));
    app.use(session({
        store: new FileStore(),
        secret: 'some-secret',
        resave: false,
        saveUninitialized: true
    }));

    app.use(function(req, res, next) {
        if (!req.session.github_nonce) {
            req.session.github_nonce = auth.generateNonce(64);
        }

        return next();
    });

    app.set('views', path.resolve(__dirname,  'views'));
    app.set('view engine', 'twig');
};
