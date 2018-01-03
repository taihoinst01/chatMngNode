'use strict';
var express = require('express');
var sql = require('mssql');
var dbConfig = require('../../config/dbConfig');
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

router.get('/recommend', function (req, res) {

    res.render('recommend', {
        selMenu: req.session.menu,
        title: 'learning recommend page'
    } );
});


router.post('/utterInputAjax', function(req, res, next) {
 
    //view에 있는 data 에서 던진 값을 받아서
    var iptUtterance = req.body.iptUtterance;

    new sql.ConnectionPool(dbConfig).connect().then(pool => {
        return pool.request().query("SELECT RESULT FROM dbo.FN_ENTITY_ORDERBY_ADD('" + iptUtterance + "')")
        }).then(result => {
            let rows = result.recordset;
            
            if(rows.length > 0) {
                var entities = rows[0]['RESULT'];
                res.send({result:true, iptUtterance:iptUtterance, entities:entities});
            } else {
                res.send({result:true, iptUtterance:iptUtterance});
            }

          sql.close();
        }).catch(err => {
          console.log(err);
          sql.close();
        });
});

module.exports = router;
