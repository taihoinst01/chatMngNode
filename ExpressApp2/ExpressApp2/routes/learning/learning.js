'use strict';
var express = require('express');
var sql = require('mssql');
var dbConfig = require('../../config/dbConfig');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    req.session.selMenu = 'm3';
    res.redirect('/learning/entities');
});

router.get('/recommend', function (req, res) {

    new sql.ConnectionPool(dbConfig).connect().then(pool => {
        return pool.request().query("SELECT SEQ,QUERY FROM TBL_QUERY_ANALYSIS_RESULT WHERE RESULT='D'")
        }).then(result => {
            let rows = result.recordset;
                      
            req.session.selMenus = 'ms1';
            res.render('recommend', {
                selMenus: req.session.selMenus,
                title: 'learning recommend page',
                list: rows
            } );
          sql.close();
        }).catch(err => {
          console.log(err);
          sql.close();
        });
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


router.get('/entities', function (req, res) {

    req.session.selMenus = 'ms4';
    res.render('entities', {
        selMenus: req.session.selMenus,
        title: 'learning Entities page'
    } );
});

module.exports = router;
