'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    if(req.session.sid) {
        res.redirect("/list");
    }
    else{
        res.render('login');   
    }
    
});

router.get('/list', function (req, res) {
    res.render('index',
        {
            title: 'Express',
            selMenu: 'm1',
            list: [
                {
                    'title': '첫번째 게시물',
                    'writer': '에이다',
                    'date': '2017-12-27',
                },
                {
                    'title': '두번째 게시물',
                    'writer': '퀀텀',
                    'date': '2017-12-28',
                },
                {
                    'title': '세번째 게시물',
                    'writer': 'Jonber',
                    'date': '2017-12-28',
                }
            ]
        });
});

module.exports = router;
