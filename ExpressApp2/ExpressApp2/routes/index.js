'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index',
        {
            title: 'Express',
            id: '',
            list: {}
        });
});

router.get('/list', function (req, res) {
    res.render('index',
        {
            title: 'Express',
            id: '',
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

router.post('/login', function (req, res) {
    var id = req.body.id;
    var pwd = req.body.pwd;

    console.log("id : " + id);
    console.log("pwd : " + pwd);

    res.render('index',
        {
            title: 'Express',
            id: id,
            list: []
        });
});

module.exports = router;
