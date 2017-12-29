'use strict';
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    req.session.menu = 'm2';

    res.render('dialog', {
        selMenu: req.session.menu,
        title: 'dialog page'
    } );
});

module.exports = router;
