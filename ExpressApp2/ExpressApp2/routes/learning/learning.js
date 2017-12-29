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

module.exports = router;
