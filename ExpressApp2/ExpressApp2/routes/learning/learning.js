'use strict';
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    req.session.menu = 'm3';

    res.render('learning', {
        selMenu: req.session.menu,
        title: 'learning page'
    } );
});

router.get('/entities', function (req, res) {

    res.render('entities', {
        selMenu: req.session.menu,
        title: 'learning Entities page'
    } );
});

router.get('/utterances', function (req, res) {

    res.render('utterances', {
        selMenu: req.session.menu,
        title: 'learning utterances page'
    } );
});

router.get('/recommend', function (req, res) {

    res.render('recommend', {
        selMenu: req.session.menu,
        title: 'learning recommend page'
    } );
});

module.exports = router;
