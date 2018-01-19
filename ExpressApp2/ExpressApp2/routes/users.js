'use strict';
var express = require('express');
var crypto = require('crypto');
var sql = require('mssql');
var dbConfig = require('../config/dbConfig');
var router = express.Router();

var key = 'taiho123!@#$';

/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.post('/login', function (req, res) {  
    //req.session.sid = req.body.mLoginId;

    var userId = req.body.mLoginId;
    var userPw = req.body.mLoginPass;

    //암호화
    /*
    var cipher = crypto.createCipher('aes192', key);
    cipher.update('1234', 'utf8', 'base64');
    var cipheredOutput = cipher.final('base64');
    console.log(cipheredOutput);
    */

    new sql.ConnectionPool(dbConfig).connect().then(pool => {
        return pool.request().query("SELECT USER_ID, SCRT_NUM FROM TB_USER_M WHERE USER_ID = '" + userId +"'")
        }).then(result => {
            let rows = result.recordset;
            console.log(rows);

            if(rows.length > 0 && rows[0].USER_ID != null && rows[0].USER_ID == userId) {
                //암호화 해제
                var decipher = crypto.createDecipher('aes192', key);
                decipher.update(rows[0].SCRT_NUM, 'base64', 'utf8');
                var decipheredOutput = decipher.final('utf8');

                console.log(decipheredOutput);

                if(decipheredOutput == userPw) {
                    req.session.sid = req.body.mLoginId;
                    req.session.save(function(){
                        res.redirect("/list");
                     });
                } else {
                    res.send('<script>alert("비밀번호가 일치하지 않습니다.");location.href="/";</script>');
                }
            } else {
                res.send('<script>alert("아이디를 찾을수 없습니다.");location.href="/";</script>');
            }
          sql.close();
        }).catch(err => {
          console.log(err);
          sql.close();
        });

});

router.get('/logout', function (req, res) {  
    delete req.session.sid;
	req.session.save(function(){
		res.redirect('/');
	});
});
//{selMenu: req.session.selMenu}
router.get('/codeMng', function (req, res) {  
    req.session.selMenu = 'm1';
    res.locals.selLeftMenu = '공통코드관리';
    res.render('codeMng');
});

router.get('/screenMng', function (req, res) {  
    req.session.selMenu = 'm1';
    res.locals.selLeftMenu = '화면관리';
    res.render('screenMng');
});

router.get('/menuMng', function (req, res) {  
    req.session.selMenu = 'm1';
    res.locals.selLeftMenu = '메뉴관리';
    res.render('menuMng');
});

router.get('/authGrpMng', function (req, res) {  
    req.session.selMenu = 'm1';
    res.locals.selLeftMenu = '권한그룹관리';
    res.render('authGrpMng');
});

router.get('/authDtlMng', function (req, res) {  
    req.session.selMenu = 'm1';
    res.locals.selLeftMenu = '권한상세관리';
    res.render('authDtlMng');
});

router.get('/userMng', function (req, res) {  
    req.session.selMenu = 'm1';
    res.locals.selLeftMenu = '사용자관리';
    res.render('userMng');
});

router.get('/userAuthMng', function (req, res) {  
    req.session.selMenu = 'm1';
    res.locals.selLeftMenu = '사용자권한관리';
    res.render('userAuthMng');
});

router.get('/userAppMng', function (req, res) {  
    req.session.selMenu = 'm1';
    res.locals.selLeftMenu = '사용자앱매핑관리';
    res.render('userAppMng');
});

module.exports = router;
