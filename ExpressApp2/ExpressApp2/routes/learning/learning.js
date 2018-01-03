'use strict';
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    req.session.selMenu = 'm3';
    
    res.render('learning', {
        selMenu: req.session.selMenu,
        selMenus: null,
        title: 'learning page'
    } );
});

router.get('/recommend', function (req, res) {

    req.session.selMenus = 'ms1';
    res.render('recommend', {
        selMenus: req.session.selMenus,
        title: 'learning recommend page'
    } );
});

router.get('/utterances', function (req, res) {

    req.session.selMenus = 'ms2';
    res.render('utterances', {
        selMenus: req.session.selMenus,
        title: 'learning utterances page'
    } );
});

router.get('/dialog', function (req, res) {

    req.session.selMenus = 'ms3';
    res.render('dialog', {
        selMenus: req.session.selMenus,
        title: 'learning dialog page'
    } );
});



router.post('/utterInputAjax', function(req, res, next) {
 
    //view에 있는 data 에서 던진 값을 받아서
    var iptUtterance = req.body.iptUtterance;

    //json 형식으로 보내 준다.
    res.send({result:true, iptUtterance:iptUtterance});

});


router.get('/entities', function (req, res) {

    req.session.selMenus = 'ms4';
    res.render('entities', {
        selMenus: req.session.selMenus,
        title: 'learning Entities page'
    } );
});

module.exports = router;
