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
    var selectChannel = "";
    selectChannel += "  SELECT ISNULL(CHANNEL,'') AS CHANNEL FROM TBL_HISTORY_QUERY \n";
    selectChannel += "   WHERE REG_DATE > '08/28/2017 00:00:00' \n";
    selectChannel += "GROUP BY CHANNEL \n";
    dbConfig.getConnection(sql).then(pool => {
    //new sql.ConnectionPool(dbConfig).connect().then(pool => {
        return pool.request().query(selectChannel)
        }).then(result => {
            let rows = result.recordset
            
            res.render('board', {   
                selMenu: req.session.menu,
                appName: req.session.appName,
                appId: req.session.appId,
                subKey: req.session.subKey,
                channelList : rows
            } );   
            sql.close();
        }).catch(err => {
            res.status(500).send({ message: "${err}"})
            sql.close();
    });
    
    sql.on('error', err => {
        sql.close();
    })
    
});



/* GET users listing. */
router.post('/intentScore', function (req, res) {
    var selectQuery = "";
    selectQuery += "SELECT	LOWER(LUIS_INTENT) AS intentName, \n";
    selectQuery += "AVG(CAST(LUIS_INTENT_SCORE AS FLOAT)) AS intentScoreAVG, \n";
    selectQuery += "MAX(CAST(LUIS_INTENT_SCORE AS FLOAT)) AS intentScoreMAX , \n";
    selectQuery += "MIN(CAST(LUIS_INTENT_SCORE AS FLOAT)) AS intentScoreMIN, \n";
    selectQuery += "CHANNEL AS channel, \n";
    selectQuery += "CONVERT(DATE,CONVERT(DATETIME,REG_DATE),120) AS regDate, \n";
    selectQuery += "COUNT(*) AS intentCount \n";
    selectQuery += "FROM	TBL_HISTORY_QUERY A, TBL_QUERY_ANALYSIS_RESULT B \n";
    selectQuery += "WHERE	REPLACE(REPLACE(LOWER(A.CUSTOMER_COMMENT_KR),'.',''),'?','') = B.QUERY \n";
    selectQuery += "AND		REG_DATE > '07/19/2017 00:00:00' \n";
    selectQuery += "GROUP BY LUIS_INTENT, CHANNEL, CONVERT(DATE,CONVERT(DATETIME,REG_DATE),120) \n";
    dbConfig.getConnection(sql).then(pool => {
    //new sql.ConnectionPool(dbConfig).connect().then(pool => {
        return pool.request().query(selectQuery)
        }).then(result => {
            let rows = result.recordset
            res.send({list : rows});
            sql.close();
        }).catch(err => {
            res.status(500).send({ message: "${err}"})
            sql.close();
        });        
});

router.post('/getScorePanel', function (req, res) {
    
    var selectQuery = "";
        selectQuery += "SELECT   COUNT(*) AS CUSOMER_CNT \n";
        selectQuery += "    , SUM(RESPONSE_TIME)/COUNT(RESPONSE_TIME) AS REPLY_SPEED \n";
        selectQuery += "    , COUNT(*)/COUNT(DISTINCT USER_NUMBER) AS USER_QRY_AVG \n";
        selectQuery += "    , ROUND(CONVERT(FLOAT, (SELECT COUNT(*) FROM TBL_QUERY_ANALYSIS_RESULT))/COUNT(*) * 100, 2) * 100  AS CORRECT_QRY \n";
        selectQuery += "    , (SELECT (ROUND((SELECT CAST(COUNT(RESULT) AS FLOAT) FROM TBL_QUERY_ANALYSIS_RESULT WHERE RESULT='H') ";
        selectQuery += "      / (SELECT CAST(COUNT(RESULT) AS FLOAT) FROM TBL_QUERY_ANALYSIS_RESULT WHERE RESULT='D') * 100, 2) * 100) ) AS SEARCH_AVG \n";
        selectQuery += "    , (SELECT MAX(B.CNT) FROM (SELECT COUNT(*) AS CNT FROM TBL_HISTORY_QUERY GROUP BY USER_NUMBER ) B) AS MAX_QRY  \n";
        selectQuery += "FROM   TBL_HISTORY_QUERY \n";
    dbConfig.getConnection(sql).then(pool => {
    //new sql.ConnectionPool(dbConfig).connect().then(pool => {
        return pool.request().query(selectQuery)
        }).then(result => {
          let rows = result.recordset
          res.send({list : rows});
          sql.close();
        }).catch(err => {
          res.status(500).send({ message: "${err}"})
          sql.close();
        });
});

router.post('/getOftQuestion', function (req, res) {
    var selectQuery = "";
    selectQuery += "SELECT TOP 100 PERCENT 한글질문 AS KORQ, 영어질문 AS ENGQ, 질문수 AS QNUM, 날짜 AS DATE, 채널 AS CHANNEL, RESULT, INTENT_SCORE, INTENT, ENTITIES, TEXT답변 AS TEXT, CARD답변 AS CARD, CARDBTN답변 AS CARDBTN, MEDIA답변 AS MEDIA, MEDIABTN답변 AS MEDIABTN\n";
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
    dbConfig.getConnection(sql).then(pool => {
    //new sql.ConnectionPool(dbConfig).connect().then(pool => {
        return pool.request().query(selectQuery)
        }).then(result => {
          let rows = result.recordset
          res.send({list : rows});
          sql.close();
        }).catch(err => {
          res.status(500).send({ message: "${err}"})
          sql.close();
        });
});

router.post('/nodeQuery', function (req, res) {
    var selectQuery = "";
            selectQuery += "SELECT TOP 100 PERCENT korQuery, enQuery, queryCnt, queryDate, channel, result, intent_score, intent, entities, textResult, cardResult, cardBtnResult, mediaResult, mediaBtnResult \n";
            selectQuery += "FROM ( \n";
            selectQuery += "SELECT CUSTOMER_COMMENT_KR AS korQuery \n";
            selectQuery += "     , ISNULL(영어질문,'') AS enQuery \n";
            selectQuery += "     , 질문수 AS queryCnt \n";
            selectQuery += "     , dimdate AS queryDate \n";
            selectQuery += "     , CHANNEL AS channel \n";
            selectQuery += "     , ISNULL(AN.RESULT,'') AS result \n";
            selectQuery += "     , ISNULL(AN.LUIS_INTENT_SCORE,'') AS intent_score \n";
            selectQuery += "     , ISNULL(LOWER(RE.LUIS_INTENT),'') AS intent \n";
            selectQuery += "     , ISNULL(RE.LUIS_ENTITIES,'') AS entities \n";
            selectQuery += "     , ISNULL(TE.CARD_TEXT,'') AS textResult \n";
            selectQuery += "     , ISNULL(CA.CARD_TITLE,'') AS cardResult \n";
            selectQuery += "     , ISNULL(CA.BTN_1_CONTEXT,'') AS cardBtnResult \n";
            selectQuery += "     , ISNULL(ME.CARD_TITLE,'') AS mediaResult \n";
            selectQuery += "     , ISNULL(ME.BTN_1_CONTEXT,'') AS mediaBtnResult \n";
            selectQuery += "FROM ( \n";
            selectQuery += "     SELECT CUSTOMER_COMMENT_KR, MAX(CUSTOMER_COMMENT_EN) AS 영어질문, COUNT(*) AS 질문수, CONVERT(CHAR(19),CONVERT(DATETIME,REG_DATE),120) AS Dimdate, CHANNEL \n";
            selectQuery += "     FROM TBL_HISTORY_QUERY \n";
            selectQuery += "     WHERE CONVERT(DATE,CONVERT(DATETIME,REG_DATE),120) > '2017-07-24' \n";
            selectQuery += "     GROUP BY CUSTOMER_COMMENT_KR, CONVERT(CHAR(19),CONVERT(DATETIME,REG_DATE),120), CHANNEL \n";
            selectQuery += ") HI \n";
            selectQuery += "LEFT OUTER JOIN TBL_QUERY_ANALYSIS_RESULT AN \n";
            selectQuery += "     ON REPLACE(REPLACE(LOWER(HI.CUSTOMER_COMMENT_KR),'.',''),'?','') = LOWER(AN.QUERY) \n";
            selectQuery += "LEFT OUTER JOIN (SELECT LUIS_INTENT,LUIS_ENTITIES,MIN(DLG_ID) AS DLG_ID FROM TBL_DLG_RELATION_LUIS GROUP BY LUIS_INTENT, LUIS_ENTITIES) RE \n";
            selectQuery += "     ON AN.LUIS_INTENT = RE.LUIS_INTENT \n";
            selectQuery += "     AND AN.LUIS_ENTITIES = RE.LUIS_ENTITIES \n";
            selectQuery += "LEFT OUTER JOIN TBL_DLG DL \n";
            selectQuery += "     ON RE.DLG_ID = DL.DLG_ID\n";
            selectQuery += "LEFT OUTER JOIN TBL_DLG_TEXT TE \n";
            selectQuery += "     ON DL.DLG_ID = TE.DLG_ID \n";
            selectQuery += "LEFT OUTER JOIN (SELECT DLG_ID, CARD_TEXT, CARD_TITLE, BTN_1_CONTEXT FROM TBL_DLG_CARD WHERE CARD_ORDER_NO = 1) CA \n";
            selectQuery += "     ON DL.DLG_ID = CA.DLG_ID \n";
            selectQuery += "LEFT OUTER JOIN (SELECT DLG_ID, CARD_TEXT, CARD_TITLE, BTN_1_CONTEXT FROM TBL_DLG_MEDIA) ME \n";
            selectQuery += "     ON DL.DLG_ID = ME.DLG_ID \n";
            selectQuery += ") AA \n";
            selectQuery += "WHERE RESULT = '' OR RESULT IN ('D','N') \n";
            selectQuery += "ORDER BY queryCnt DESC, queryDate DESC; \n";
    
    dbConfig.getConnection(sql).then(pool => {
    //new sql.ConnectionPool(dbConfig).connect().then(pool => {
        return pool.request().query(selectQuery)
        }).then(result => {
          let rows = result.recordset
          res.send({list : rows});
          sql.close();
        }).catch(err => {
          res.status(500).send({ message: "${err}"})
          sql.close();
        });
});



router.post('/firstQueryBar', function (req, res) {
    var selectQuery =  "";
        selectQuery += "SELECT ISNULL(INTENT,'intent 없음') AS INTENT, ISNULL(날짜,'') AS REG_DATE, COUNT(*) AS INTENT_CNT, 채널 AS CHANNEL \n";
        selectQuery += "FROM ( \n";
        selectQuery += "    SELECT distinct history.user_number as 유저아이디 \n";
        selectQuery += "         , history.sid, history.customer_comment_kr as 한글질문 \n";
        selectQuery += "         , history.customer_comment_en as 영어질문 \n";
        selectQuery += "         , history.channel as 채널 \n";
        selectQuery += "         , history.reg_date as 질문등록시간 \n";
        selectQuery += "         , LOWER(analysis.LUIS_INTENT) as INTENT \n";
        selectQuery += "         , analysis.LUIS_ENTITIES as 답변 \n";
        selectQuery += "         , ROUND(CAST(analysis.LUIS_INTENT_SCORE AS FLOAT),2) as 컨피던스 \n";
        selectQuery += "         , case when history.customer_comment_kr ='Kona의 주요특징' or history.customer_comment_kr ='견적 내기' or history.customer_comment_kr ='시승신청' \n";
        selectQuery += "                     or history.customer_comment_kr ='나에게 맞는 모델을 추천해줘' then '메뉴' else '대화' end as 메시지구분 \n";
        selectQuery += "         , 날짜 \n";
        selectQuery += "    FROM ( \n";
        selectQuery += "        SELECT  ROW_NUMBER() OVER (PARTITION BY user_number ORDER BY min(sid) asc) AS Row \n";
        selectQuery += "            , user_number \n";
        selectQuery += "            , min(sid) AS sid \n";
        selectQuery += "            , customer_comment_kr \n";
        selectQuery += "            , customer_comment_en \n";
        selectQuery += "            , reg_date \n";
        selectQuery += "            , channel \n";
        selectQuery += "            , CONVERT(DATE,CONVERT(DATETIME,REG_DATE),120) AS 날짜 \n";
        selectQuery += "        FROM    tbl_history_query \n";
        selectQuery += "        WHERE  REG_DATE > '07/19/2017 00:00:00' \n";
        selectQuery += "        GROUP BY user_number, customer_comment_kr, customer_comment_en, reg_date, channel \n";
        selectQuery += "    )   AS history INNER join tbl_query_analysis_result as analysis on history.customer_comment_kr = analysis.query \n";
        selectQuery += "    WHERE history.Row = 1 \n";
        selectQuery += ") A \n";
        selectQuery += "GROUP BY INTENT, 날짜, 채널 \n";
    
    dbConfig.getConnection(sql).then(pool => {
    //new sql.ConnectionPool(dbConfig).connect().then(pool => {
        return pool.request().query(selectQuery)
        }).then(result => {
          let rows = result.recordset
          res.send({list : rows});
          sql.close();
        }).catch(err => {
          res.status(500).send({ message: "${err}"})
          sql.close();
        });
});

router.post('/firstQueryTable', function (req, res) {
    var selectQuery =  "";
        selectQuery += "SELECT CUSTOMER_COMMENT_KR AS koQuestion, 날짜 AS query_date, 채널 AS channel, 질문수 AS query_cnt  \n";
        selectQuery += "    , ROUND(CAST(ISNULL(AN.LUIS_INTENT_SCORE,0) AS FLOAT),2) AS intent_score \n";
        selectQuery += "    , ISNULL(LOWER(AN.LUIS_INTENT),'') AS intent_name \n";
        selectQuery += "    , ISNULL(TE.CARD_TEXT,'') AS txt_answer \n";
        selectQuery += "    , ISNULL(CA.CARD_TITLE,'') AS card_answer \n";
        selectQuery += "    , ISNULL(CA.BTN_1_CONTEXT,'') AS cardBtn_answer \n";
        selectQuery += "    , ISNULL(ME.CARD_TITLE,'') AS media_answer \n";
        selectQuery += "    , ISNULL(ME.BTN_1_CONTEXT,'') AS mediaBtn_answer \n";
        selectQuery += "    , CASE WHEN CUSTOMER_COMMENT_KR ='KONA의 주요특징' OR CUSTOMER_COMMENT_KR ='견적 내기' OR CUSTOMER_COMMENT_KR ='시승신청' \n";
        selectQuery += "         OR CUSTOMER_COMMENT_KR ='나에게 맞는 모델을 추천해줘' THEN '메뉴' ELSE '대화' END AS message_type \n";
        selectQuery += "FROM( \n";
        selectQuery += "    SELECT CUSTOMER_COMMENT_KR,날짜,COUNT(*) AS 질문수,채널 \n";
        selectQuery += "    FROM( \n";
        selectQuery += "        SELECT  ROW_NUMBER() OVER (PARTITION BY USER_NUMBER ORDER BY MIN(SID) ASC) AS ROW \n";
        selectQuery += "            , USER_NUMBER \n";
        selectQuery += "            , MIN(SID) AS SID \n";
        selectQuery += "            , CUSTOMER_COMMENT_KR \n";
        selectQuery += "            , CUSTOMER_COMMENT_EN \n";
        selectQuery += "            , REG_DATE \n";
        selectQuery += "            , CHANNEL AS 채널 \n";
        selectQuery += "            , CONVERT(CHAR(19),CONVERT(DATETIME,REG_DATE),120) AS 날짜 \n";
        selectQuery += "        FROM    TBL_HISTORY_QUERY \n";
        selectQuery += "        WHERE  REG_DATE > '07/19/2017 00:00:00' \n";
        selectQuery += "        GROUP BY USER_NUMBER, CUSTOMER_COMMENT_KR, CUSTOMER_COMMENT_EN, REG_DATE, CHANNEL \n";
        selectQuery += "    ) A \n";
        selectQuery += "    WHERE ROW = 1 \n";
        selectQuery += "    GROUP BY CUSTOMER_COMMENT_KR,날짜,채널 \n";
        selectQuery += ") HI LEFT OUTER JOIN TBL_QUERY_ANALYSIS_RESULT AN ON REPLACE(REPLACE(LOWER(HI.CUSTOMER_COMMENT_KR),'.',''),'?','') = LOWER(AN.QUERY) \n";
        selectQuery += "LEFT OUTER JOIN (SELECT LUIS_INTENT,LUIS_ENTITIES,MIN(DLG_ID) AS DLG_ID FROM TBL_DLG_RELATION_LUIS GROUP BY LUIS_INTENT, LUIS_ENTITIES) RE \n";
        selectQuery += "    ON AN.LUIS_INTENT = RE.LUIS_INTENT \n";
        selectQuery += "    AND AN.LUIS_ENTITIES = RE.LUIS_ENTITIES \n";
        selectQuery += "LEFT OUTER JOIN TBL_DLG DL \n";
        selectQuery += "    ON RE.DLG_ID = DL.DLG_ID \n";
        selectQuery += "LEFT OUTER JOIN TBL_DLG_TEXT TE \n";
        selectQuery += "    ON DL.DLG_ID = TE.DLG_ID \n";
        selectQuery += "LEFT OUTER JOIN (SELECT DLG_ID, CARD_TEXT, CARD_TITLE, BTN_1_CONTEXT FROM TBL_DLG_CARD WHERE CARD_ORDER_NO = 1) CA \n";
        selectQuery += "    ON DL.DLG_ID = CA.DLG_ID \n";
        selectQuery += "LEFT OUTER JOIN (SELECT DLG_ID, CARD_TEXT, CARD_TITLE, BTN_1_CONTEXT FROM TBL_DLG_MEDIA) ME \n";
        selectQuery += "    ON DL.DLG_ID = ME.DLG_ID \n";
    
    dbConfig.getConnection(sql).then(pool => {
    //new sql.ConnectionPool(dbConfig).connect().then(pool => {
        return pool.request().query(selectQuery)
        }).then(result => {
          let rows = result.recordset
          res.send({list : rows});
          sql.close();
        }).catch(err => {
          res.status(500).send({ message: "${err}"})
          sql.close();
        });
});


router.post('/getResponseScore', function (req, res) {
    
    var selectQuery = "";
        selectQuery += "SELECT  AVG(유저별평균답변시간) AS REPLY_AVG \n";
        selectQuery += "	 , (SELECT MAX(RESPONSE_TIME) FROM TBL_HISTORY_QUERY) AS MAX_REPLY \n";
        selectQuery += "	 , (SELECT MIN(RESPONSE_TIME) FROM TBL_HISTORY_QUERY WHERE RESPONSE_TIME >0) AS MIN_REPLY \n";
        selectQuery += "	 , AVG(유저별답변시간합) AS REPLY_SUM \n";
        selectQuery += "FROM ( ";
        selectQuery += "SELECT USER_NUMBER, SUM(RESPONSE_TIME) AS 유저별답변시간합, AVG(RESPONSE_TIME) AS 유저별평균답변시간 \n";
        selectQuery += "from TBL_HISTORY_QUERY  \n";
        selectQuery += "group by USER_NUMBER \n";
        selectQuery += ") A \n";
    
    dbConfig.getConnection(sql).then(pool => {
    //new sql.ConnectionPool(dbConfig).connect().then(pool => {
        return pool.request().query(selectQuery)
        }).then(result => {
          let rows = result.recordset
          res.send({list : rows});
          sql.close();
        }).catch(err => {
          res.status(500).send({ message: "${err}"})
          sql.close();
        });
});

router.post('/getQueryByEachTime', function (req, res) {
    
    var selectQuery = "";
        selectQuery += "SELECT REPLICATE('0', 2 - LEN(시간)) + 시간 AS TIME ";
        selectQuery += "     , SUM(질문수) AS QUERY_CNT \n";
        selectQuery += "FROM ( \n";
        selectQuery += "	 SELECT USER_NUMBER , datename(hh,reg_date) as 시간, CHANNEL AS 채널 ";
        selectQuery += "	     ,  CONVERT(DATE,CONVERT(DATETIME,REG_DATE),120) AS 날짜, COUNT(*) AS 질문수, CUSTOMER_COMMENT_KR \n";
        selectQuery += "	 FROM TBL_HISTORY_QUERY \n";
        selectQuery += "	 GROUP BY USER_NUMBER, datename(hh,reg_date), CHANNEL, CONVERT(DATE,CONVERT(DATETIME,REG_DATE),120), CUSTOMER_COMMENT_KR \n";
        selectQuery += "	 ) HI \n";
        selectQuery += "LEFT OUTER JOIN TBL_QUERY_ANALYSIS_RESULT AN \n";
        selectQuery += "ON REPLACE(REPLACE(LOWER(HI.CUSTOMER_COMMENT_KR),'.',''),'?','') = LOWER(AN.QUERY) \n";
        selectQuery += "GROUP BY (REPLICATE('0', 2 - LEN(시간)) + 시간)  \n";
        selectQuery += "HAVING 1=1 \n";
        selectQuery += "ORDER BY TIME; \n";


    dbConfig.getConnection(sql).then(pool => {
    //new sql.ConnectionPool(dbConfig).connect().then(pool => {
        return pool.request().query(selectQuery)
        }).then(result => {
          let rows = result.recordset
          var resultMap = [];
          var k=0;
          for (var i=0; i<24; i++) {
              if (Number(rows[k].TIME) === i ) {
                var obj = {};
                resultMap[i] = obj[rows[k].TIME] = rows[k].QUERY_CNT;
                k++;
              }else {
                  for (var j=i; j<Number(rows[k].TIME); j++) {
                    var obj = {};
                    resultMap[j] = obj[pad(j, 2)] =  0;
                  }
                  i=j-1;
              }
              if (resultMap.length === 25) break;
          }
          res.send({list : resultMap});
          sql.close();
        }).catch(err => {
          res.status(500).send({ message: "${err}"})
          sql.close();
        });
});
function pad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}



module.exports = router;
