'use strict';
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.post('/login', function (req, res) {  
    req.session.sid = req.body.mLoginId;
    req.session.save(function(){
       res.redirect("/list");
    });
});

router.get('/logout', function (req, res) {  
    delete req.session.sid;
	req.session.save(function(){
		res.redirect('/');
	});
});

module.exports = router;
