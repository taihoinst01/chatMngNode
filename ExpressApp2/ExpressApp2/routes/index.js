'use strict';
var express = require('express');
var Client = require('node-rest-client').Client;
var router = express.Router();

const HOST = 'https://westus.api.cognitive.microsoft.com'; // Luis api host
var subKey = 'db5c8e83e84f4c9e9c21f5da0b5a48fd'; // Subscription Key

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

    var client = new Client();

    var options = {
        headers: {
            'Ocp-Apim-Subscription-Key': subKey
        }
    };
    try{
        client.get( HOST + '/luis/api/v2.0/apps/', options, function (data, response) {
            console.log(data)
            res.render('index',
            {
                title: 'Express',
                selMenu: req.session.selMenu,
                list: data
            });
        });
    }catch(e){
        console.log(e);
    }
    
    /*
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
    */
});

//Luis app insert
router.post('/admin/putAddApps', function (req, res){
    var appService = req.body.appInsertService;
    var appName = req.body.appInsertName;
    var appCulture = req.body.appInsertCulture;
    var appDes = req.body.appInsertDes;

    var client = new Client();
    
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
    try{
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

router.post('/ajax1', function (req, res) {
    console.log("동기동기 비동기");
    var responseData = {'result': 'ok', 'title' : 'ajax테스트 게시물', 'writer' : req.session.sid, 'date': '2017-12-28'};
    res.json(responseData);
});

router.post('/ajax2', function(req, res, next) {

    console.log('POST 방식으로 서버 호출됨');
    //view에 있는 data 에서 던진 값을 받아서

    var msg = req.body.msg;
    msg = '[에코]' + msg;

    //json 형식으로 보내 준다.
    res.send({result:true, msg:msg});

});

module.exports = router;
