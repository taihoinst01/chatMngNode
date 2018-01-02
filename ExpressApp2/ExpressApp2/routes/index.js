'use strict';
var express = require('express');
var Client = require('node-rest-client').Client;
var router = express.Router();

var HOST = 'https://westus.api.cognitive.microsoft.com';
var subKey = 'db5c8e83e84f4c9e9c21f5da0b5a48fd';

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
    req.session.selMenu = 'm1';
    console.log("메뉴 : " + req.param.menu);
    
    res.render('index',
        {
            title: 'Express',
            selMenu: req.session.selMenu,
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

router.post('/admin/putAddApps', function (req, res){
    var appService = req.body.appInsertService;
    var appName = req.body.appInsertName;
    var appCulture = req.body.appInsertCulture;
    var appDes = req.body.appInsertDes;

    var client = new Client();
    
    try{
        var appId;
        var options = {
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': subKey
            },
            data: {
                'name': appName,
                'description': appDes,
                'culture': appCulture
            }
        };
        client.post( HOST + '/luis/api/v2.0/apps/', options, function (data, response) {
            //console.log(data); // app id값
            var responseData;
            if(response.statusCode == 201){ // 등록 성공
                responseData = {'appId': data};
            }else{
                responseData = data;
            }
            res.json(responseData);
        });
    }catch(e){
        console.log(e);
    }

});

router.post('/ajaxTest', function (req, res) {
    var responseData = {'title' : 'ajax테스트 게시물', 'writer' : req.session.sid, 'date': '2017-12-28'};
    res.json(responseData);
});

module.exports = router;
