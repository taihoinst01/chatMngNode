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

router.get('/setting', function (req, res) {  
    req.session.selMenu = 'm1';

    res.render('setting',{selMenu: req.session.selMenu});
});

module.exports = router;
