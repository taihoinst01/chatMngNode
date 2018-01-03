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

/* sent utterances ajax */
router.post('/utterInputAjax', function(req, res, next) {

    //view에 있는 data 에서 던진 값을 받아서
    var iptUtterance = req.body.iptUtterance;

    //json 형식으로 보내 준다.
    res.send({
        result:true, 
        iptUtterance:iptUtterance,
        entities: [
            {
                'startIndex': '0',
                'endIndex': '2',
                'entityName': 'hi',
            },
            {
                'startIndex': '4',
                'endIndex': '6',
                'entityName': '인사',
            }
        ]
    });

});




module.exports = router;
