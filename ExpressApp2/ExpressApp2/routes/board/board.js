'use strict';

var express = require('express');
var sql = require('mssql');
var dbConfig = require('../../config/dbConfig');
var paging = require('../../config/paging');
var util = require('../../config/util');
var luisConfig = require('../../config/luisConfig');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    req.session.menu = 'm2';
    if (typeof req.query.appName !== 'undefined') {
        req.session.appName = req.query.appName;
        req.session.appId = req.query.appId;
        req.session.subKey = luisConfig.subKey;
    }
    
    var appName = req.session.appName;
    (async () => {
        try {
            var intentQry = " SELECT isnull((  SELECT      COUNT(distinct LUIS_INTENT) " +
                            "          FROM        TBL_DLG_RELATION_LUIS " +
                            "          GROUP BY    LUIS_ID "  +
                            "          HAVING      LUIS_ID = '" + appName + "'), 0) AS INTENT_CNT ";
            let pool = await sql.connect(dbConfig);
            let result1 = await pool.request().query(intentQry);
            let rows1 = result1.recordset;
            
            var EntityQry = "SELECT distinct STUFF(( SELECT ',' + b.LUIS_ENTITIES  " +
                            "                FROM TBL_DLG_RELATION_LUIS b " + 
                            "                WHERE b.LUIS_ID = '" + appName + "' FOR XML PATH('') ),1,1,'') AS concatEntity " +
                            "FROM TBL_DLG_RELATION_LUIS a " 
                            "group by LUIS_ID " + 
                            "having LUIS_ID = '" + appName + "' ";
            let result2 = await pool.request().query(EntityQry);
            let rows2 = result2.recordset;
            var entityStr = '';
            var entityList;
            if (rows2[0].concatEntity != null) {
                for (var i=0; i<rows2.length; i++) {
                    entityStr += rows2[i].concatEntity;
                }
                entityList = entityStr.split(',');
            }
            
            var uniqArray = Array.from(new Set(entityList));

            var DlgQry = " SELECT   isnull((  select      count(*)  " +
                         "                    from        TBL_DLG " +
                         "                    where       GroupL = '" + appName + "' " +
                         "                    and         use_yn ='Y'), 0) AS DLG_CNT ";;
            let result3 = await pool.request().query(DlgQry);
            let rows3 = result3.recordset;

            res.render('board', {   
                selMenu: req.session.menu,
                appName: req.session.appName,
                appId: req.session.appId,
                subKey: req.session.subKey,
                INTENT_CNT  : rows1[0].INTENT_CNT,
                ENTITY_CNT  : uniqArray.length,
                DLG_CNT     : rows3[0].DLG_CNT
            } );    
            //res.send({list : result});
            
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



/* GET users listing. */
router.get('/intentScore', function (req, res) {
    req.session.menu = 'm2';

    (async () => {
        try {
            var intentQry = " SELECT isnull((  SELECT      COUNT(distinct LUIS_INTENT) " +
                            "          FROM        TBL_DLG_RELATION_LUIS " +
                            "          GROUP BY    LUIS_ID "  +
                            "          HAVING      LUIS_ID = '" + appName + "'), 0) AS INTENT_CNT ";
            let pool = await sql.connect(dbConfig);
            let result1 = await pool.request().query(intentQry);
            let rows1 = result1.recordset;
            
            var EntityQry = "SELECT distinct STUFF(( SELECT ',' + b.LUIS_ENTITIES  " +
                            "                FROM TBL_DLG_RELATION_LUIS b " + 
                            "                WHERE b.LUIS_ID = '" + appName + "' FOR XML PATH('') ),1,1,'') AS concatEntity " +
                            "FROM TBL_DLG_RELATION_LUIS a " 
                            "group by LUIS_ID " + 
                            "having LUIS_ID = '" + appName + "' ";
            let result2 = await pool.request().query(EntityQry);
            let rows2 = result2.recordset;
            var entityStr = '';
            var entityList;
            if (rows2[0].concatEntity != null) {
                for (var i=0; i<rows2.length; i++) {
                    entityStr += rows2[i].concatEntity;
                }
                entityList = entityStr.split(',');
            }
            
            var uniqArray = Array.from(new Set(entityList));

            var DlgQry = " SELECT   isnull((  select      count(*)  " +
                         "                    from        TBL_DLG " +
                         "                    where       GroupL = '" + appName + "' " +
                         "                    and         use_yn ='Y'), 0) AS DLG_CNT ";;
            let result3 = await pool.request().query(DlgQry);
            let rows3 = result3.recordset;

            res.send( {   
                selMenu: req.session.menu,
                appName: req.session.appName,
                appId: req.session.appId,
                subKey: req.session.subKey,
                INTENT_CNT  : rows1[0].INTENT_CNT,
                ENTITY_CNT  : uniqArray.length,
                DLG_CNT     : rows3[0].DLG_CNT
            } );    
            //res.send({list : result});
            
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


/*
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
                            "          where       GroupL = '" + appName + "' " +
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
*/

router.post('/getScorePane', function (req, res) {
    (async () => {
        try {

            var selectQuery = "";
            selectQuery += "SELECT	LOWER(LUIS_INTENT) AS INTENT, \n";
            selectQuery += "AVG(CAST(LUIS_INTENT_SCORE AS FLOAT)) AS 평균INTENTSCORE, \n";
            selectQuery += "MAX(CAST(LUIS_INTENT_SCORE AS FLOAT)) AS 최대INTENTSCORE , \n";
            selectQuery += "MIN(CAST(LUIS_INTENT_SCORE AS FLOAT)) AS 최소INTENTSCORE, \n";
            selectQuery += "CHANNEL AS 채널,\n";
            selectQuery += "CONVERT(DATE,CONVERT(DATETIME,REG_DATE),120) AS 날짜,\n";
            selectQuery += "COUNT(*) AS 갯수\n";
            selectQuery += "FROM	TBL_HISTORY_QUERY A, TBL_QUERY_ANALYSIS_RESULT B \n";
            selectQuery += "WHERE	REPLACE(REPLACE(LOWER(A.CUSTOMER_COMMENT_KR),'.',''),'?','') = B.QUERY \n";
            selectQuery += "AND		REG_DATE > '07/19/2017 00:00:00'\n";
            selectQuery += "GROUP BY LUIS_INTENT, CHANNEL, CONVERT(DATE,CONVERT(DATETIME,REG_DATE),120)\n";

            let pool = await sql.connect(dbConfig);
            let result1 = await pool.request()
            .query(selectQuery)
        
            let rows = result1.recordset;

            res.send({list : result});
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

router.post('/getOftQuestion', function (req, res) {
    var selectQuery = "";
    selectQuery += "SELECT TOP 100 PERCENT 한글질문, 영어질문, 질문수, 날짜, 채널, RESULT, INTENT_SCORE, INTENT, ENTITIES, TEXT답변, CARD답변, CARDBTN답변, MEDIA답변, MEDIABTN답변\n";
    selectQuery += "FROM\n";
    selectQuery += "(";
    selectQuery += "SELECT CUSTOMER_COMMENT_KR AS 한글질문\n";
    selectQuery += ", ISNULL(영어질문,'') AS 영어질문\n";
    selectQuery += ", 질문수\n";
    selectQuery += ", dimdate AS 날짜\n";
    selectQuery += ", CHANNEL AS 채널\n";
    selectQuery += ", ISNULL(AN.RESULT,'') AS RESULT\n";
    selectQuery += ", ISNULL(AN.LUIS_INTENT_SCORE,'') AS INTENT_SCORE\n";
    selectQuery += ", ISNULL(LOWER(RE.LUIS_INTENT),'') AS INTENT\n";
    selectQuery += ", ISNULL(RE.LUIS_ENTITIES,'') AS ENTITIES\n";
    selectQuery += ", ISNULL(TE.CARD_TEXT,'') AS TEXT답변\n";
    selectQuery += ", ISNULL(CA.CARD_TITLE,'') AS CARD답변\n";
    selectQuery += ", ISNULL(CA.BTN_1_CONTEXT,'') AS CARDBTN답변\n";
    selectQuery += ", ISNULL(ME.CARD_TITLE,'') AS MEDIA답변\n";
    selectQuery += ", ISNULL(ME.BTN_1_CONTEXT,'') AS MEDIABTN답변\n";
    selectQuery += "FROM\n";
    selectQuery += "(\n";
    selectQuery += "SELECT CUSTOMER_COMMENT_KR, MAX(CUSTOMER_COMMENT_EN) AS '영어질문', COUNT(*) AS '질문수', CONVERT(DATE,CONVERT(DATETIME,REG_DATE),120) AS Dimdate, CHANNEL\n";
    selectQuery += "FROM TBL_HISTORY_QUERY\n";
    selectQuery += "WHERE CONVERT(DATE,CONVERT(DATETIME,REG_DATE),120) > '2017-07-24'\n";
    selectQuery += "GROUP BY CUSTOMER_COMMENT_KR, CONVERT(DATE,CONVERT(DATETIME,REG_DATE),120), CHANNEL\n";
    selectQuery += ") HI\n";
    selectQuery += "LEFT OUTER JOIN TBL_QUERY_ANALYSIS_RESULT AN\n";
    selectQuery += "ON REPLACE(REPLACE(LOWER(HI.CUSTOMER_COMMENT_KR),'.',''),'?','') = LOWER(AN.QUERY)\n";
    selectQuery += "LEFT OUTER JOIN (SELECT LUIS_INTENT,LUIS_ENTITIES,MIN(DLG_ID) AS DLG_ID FROM TBL_DLG_RELATION_LUIS GROUP BY LUIS_INTENT, LUIS_ENTITIES) RE\n";
    selectQuery += "ON AN.LUIS_INTENT = RE.LUIS_INTENT\n";
    selectQuery += "AND AN.LUIS_ENTITIES = RE.LUIS_ENTITIES\n";
    selectQuery += "LEFT OUTER JOIN TBL_DLG DL\n";
    selectQuery += "ON RE.DLG_ID = DL.DLG_ID\n";
    selectQuery += "LEFT OUTER JOIN TBL_DLG_TEXT TE\n";
    selectQuery += "ON DL.DLG_ID = TE.DLG_ID\n";
    selectQuery += "LEFT OUTER JOIN (SELECT DLG_ID, CARD_TEXT, CARD_TITLE, BTN_1_CONTEXT FROM TBL_DLG_CARD WHERE CARD_ORDER_NO = 1) CA\n";
    selectQuery += "ON DL.DLG_ID = CA.DLG_ID\n";
    selectQuery += "LEFT OUTER JOIN (SELECT DLG_ID, CARD_TEXT, CARD_TITLE, BTN_1_CONTEXT FROM TBL_DLG_MEDIA) ME\n";
    selectQuery += "ON DL.DLG_ID = ME.DLG_ID\n";
    selectQuery += ") AA\n";
    selectQuery += "WHERE RESULT <> '' AND RESULT IN ('H','S')\n";
    selectQuery += "ORDER BY 질문수 DESC, 날짜 DESC\n";

    (async () => {
        try {

            let pool = await sql.connect(dbConfig);
            let result1 = await pool.request()
            .query(selectQuery)
        
            let rows = result1.recordset;

            res.send({list : result});
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
