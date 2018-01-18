'use strict';

var express = require('express');
var sql = require('mssql');
var dbConfig = require('../../config/dbConfig');
var paging = require('../../config/paging');
var util = require('../../config/util');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    req.session.menu = 'm2';

    res.render('board', {   selMenu: req.session.menu, 
        title: 'board page'
    } );
    
});


router.post('/getCounts', function (req, res) {

    var appName = req.body.appName;

    (async () => {
        try {
            var cntValue = " SELECT isnull((  SELECT      COUNT(distinct LUIS_INTENT) " +
                            "          FROM        TBL_DLG_RELATION_LUIS " +
                            "          GROUP BY    LUIS_ID "  +
                            "          HAVING      LUIS_ID = '" + appName + "'), 0) AS INTENT_CNT, " +
                            "       isnull((  SELECT	    count(distinct B.ENTITY_VALUE) " +
                            "          FROM	    TBL_DLG_RELATION_LUIS A, TBL_COMMON_ENTITY_DEFINE B " + 
                            "          WHERE	    A.LUIS_ID = '" + appName + "'  " +
                            "          AND		    A.LUIS_ENTITIES like '%'+B.ENTITY_VALUE+'%'), 0) AS ENTITY_CNT, " +
                            "       isnull((  select      count(*)  " +
                            "          from        TBL_DLG " +
                            "          where       LARGE_GROUP = '" + appName + "' " +
                            "          and         use_yn ='Y'), 0) AS DLG_CNT ";
            let pool = await sql.connect(dbConfig);
            let result1 = await pool.request().query(cntValue);
            let rows = result1.recordset;
            

            if(rows.length > 0){
                res.send({
                    INTENT_CNT  : rows[0].INTENT_CNT,
                    ENTITY_CNT  : rows[0].ENTITY_CNT,
                    DLG_CNT     : rows[0].DLG_CNT
                });           
            }else{
                res.send({list : result});
            }
        } catch (err) {
            console.log(err)
            // ... error checks
        } finally {
            sql.close();
        }
    })()

    sql.on('error', err => {
        // ... error handler
    })
    
 });


module.exports = router;
