var path = require('path');
var express = require('express');
var session = require('express-session');
var auth = require('../services/auth');

module.exports = function (app) {
    app.use(express.static(path.resolve(__dirname,  '../public')));
    app.use(session({
        secret: '45y6j7h5g43f'
        //resave: false,
        //saveUninitialized: true
    }));

    app.use(function(req, res, next) {
        var githubNonce = req.session.github_nonce;
        if (!githubNonce) {
            req.session.github_nonce = auth.generateNonce(64);
        }

        return next();
    });

    app.set('views', path.resolve(__dirname,  'views'));
    app.set('view engine', 'twig');
};
