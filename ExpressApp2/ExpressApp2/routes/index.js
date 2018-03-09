'use strict';
var express = require('express');
var Client = require('node-rest-client').Client;
var sql = require('mssql');
var dbConfig = require('../config/dbConfig');
var dbConnect = require('../config/dbConnect');
var luisConfig = require('../config/luisConfig');
var i18n = require("i18n");
var router = express.Router();

const HOST = 'https://westus.api.cognitive.microsoft.com'; // Luis api host
var subKey = luisConfig.subKey; // Subscription Key
var saveAppList;
/* GET home page. */
router.get('/', function (req, res) {
    if(req.session.sid) {

        try{

            //db정보 조회

            dbConnect.getConnection(sql).then(pool => { 
                return pool.request().query( "SELECT USER_NAME, PASSWORD, SERVER, DATABASE_NAME, APP_NAME, APP_ID FROM TBL_DB_CONFIG; " ) 
            }).then(result => {
                let dbValue = result.recordset;
                req.session.dbValue = dbValue;
                sql.close();
            }).catch(err => {
                console.log(err);
                sql.close();
            });

            var client = new Client();
            var options = {
                headers: {
                    'Ocp-Apim-Subscription-Key': subKey
                }
            };
            
            client.get( HOST + '/luis/api/v2.0/apps/', options, function (data, response) {
                //console.log(data)
                var appList = data;
                saveAppList = JSON.parse(JSON.stringify(data));
                var listStr = 'SELECT APP_NAME, APP_ID FROM TBL_LUIS_APP ';
                dbConnect.getConnection(sql).then(pool => {
                    //new sql.ConnectionPool(dbConfig).connect().then(pool => {
                        return pool.request().query(listStr)
                        }).then(result => {
                            let rows = result.recordset;
                            console.log(rows);
                            var newAppList = [];
                            var deleteAppStr = "";
                            
                            for (var i = 0; i < rows.length; i++) {
                                //luis에서 삭제한 app check
                                var chkDelApp = true;

                                for (var j=0; j<appList.length; j++) {
                                    
                                    //db - luis상 app name이 같으면
                                    if (rows[i].APP_NAME === appList[j].name) {
                                        
                                        if (rows[i].APP_ID === appList[j].id) {
                                            //db에 존재하는 앱은 제외
                                            appList.splice(j,1);
                                        } else {
                                            //기존 앱이 삭제되고 같은 이름의 새 앱이 생긴 경우
                                            deleteAppStr += "DELETE FROM TBL_LUIS_APP WHERE APP_NAME = '" + rows[i].APP_NAME + "' AND APP_ID = '" + rows[i].APP_ID + "'; \n";
                                        }

                                        chkDelApp = false;
                                        break;
                                    }
                                }

                                if (chkDelApp) {
                                    deleteAppStr += "DELETE FROM TBL_LUIS_APP WHERE APP_NAME = '" + rows[i].APP_NAME + "' AND APP_ID = '" + rows[i].APP_ID + "'; \n";
                                }
                            }

                            if (appList.length > 0 || deleteAppStr !== "") {
                                var appStr = "";
                                var appRelationStr = "";
                                var loginId = req.session.sid;
                                for (var i=0; i<appList.length; i++) {
                                    if (req.query.appInsertName) {
                                        var appColor = (req.query.appInsertName === appList[i].name?req.query.appColor: 'color_01');
                                        appStr += "INSERT INTO TBL_LUIS_APP (APP_NUM, SUBSC_KEY, APP_ID, VERSION, APP_NAME, OWNER_EMAIL, REG_DT, CULTURE, DESCRIPTION, APP_COLOR) \n";
                                        appStr += "VALUES ((SELECT isNULL(MAX(APP_NUM),0) FROM TBL_LUIS_APP)+1, '" + subKey + "', '" + appList[i].id + "', \n" +
                                            " '" + appList[i].activeVersion + "', '" + appList[i].name + "', '" + appList[i].ownerEmail + "', \n" +
                                            " convert(VARCHAR(33), '" + appList[i].createdDateTime + "', 126), '" + appList[i].culture + "', '" + appList[i].description + "', " +
                                            " '" + appColor + "'); \n";

                                        var userId = req.session.sid;
                                        appStr += "INSERT INTO TBL_USER_RELATION_APP(USER_ID, APP_ID) " +
                                        "     VALUES ('" + userId + "', '" + appList[i].id + "'); \n";    
                                    } else {

                                        var tmp = Math.floor(Math.random() * (15 - 1)) + 1;
                                        var randNum = pad(tmp, 2);
                                        appStr += "INSERT INTO TBL_LUIS_APP (APP_NUM, SUBSC_KEY, APP_ID, VERSION, APP_NAME, OWNER_EMAIL, REG_DT, CULTURE, DESCRIPTION, APP_COLOR) \n";
                                        appStr += "VALUES ((SELECT isNULL(MAX(APP_NUM),0) FROM TBL_LUIS_APP)+1, '" + subKey + "', '" + appList[i].id + "', \n" +
                                            " '" + appList[i].activeVersion + "', '" + appList[i].name + "', '" + appList[i].ownerEmail + "', \n" +
                                            " convert(VARCHAR(33), '" + appList[i].createdDateTime + "', 126), '" + appList[i].culture + "', '" + appList[i].description + "', " +
                                            " 'color_" + randNum + "'); \n";
                                    }
                                }
                                //convert(datetime, '2008-10-23T18:52:47.513', 126)
                                //let insertApp = await pool.request().query(appStr);
                                dbConnect.getConnection(sql).then(pool => { 
                                    return pool.request().query(deleteAppStr + appStr) 
                                }).then(result => {

                                }).catch(err => {
                                    console.log(err);
                                    sql.close();
                                });
                            }

                            res.redirect("/list");
                            
                          sql.close();
                        }).catch(err => {
                          console.log(err);
                          sql.close();
                        });

                /*    
                (async () => {
                    try {
                        //let pool = await sql.connect(dbConfig);
                        let pool = dbConfig.getConnection(sql);
                        let listVal = await pool.request().query(listStr);
                        let rows = listVal.recordset;

                        var newAppList = [];
                        for (var i = 0; i < rows.length; i++) {
                            for (var j=0; j<appList.length; j++) {
                                if (rows[i].APP_ID === appList[j].id) {
                                    appList.splice(j,1);
                                    break;
                                }
                            }
                        }

                        if (appList.length > 0) {
                            var appStr = "";
                            var appRelationStr = "";
                            var loginId = req.session.sid;
                            for (var i=0; i<appList.length; i++) {
                                appStr += "INSERT INTO TBL_LUIS_APP (APP_NUM, SUBSC_KEY, APP_ID, VERSION, APP_NAME, OWNER_EMAIL, REG_DT, CULTURE, DESCRIPTION) ";
                                appStr += "VALUES ((SELECT isNULL(MAX(APP_NUM),0) FROM TBL_LUIS_APP)+1, '" + subKey + "', '" + appList[i].id + "', " +
                                    " '" + appList[i].activeVersion + "', '" + appList[i].name + "', '" + appList[i].ownerEmail + "', " +
                                    " convert(VARCHAR(33), '" + appList[i].createdDateTime + "', 126), '" + appList[i].culture + "', '" + appList[i].description + "'); ";
                            }
                            //convert(datetime, '2008-10-23T18:52:47.513', 126)
                            let insertApp = await pool.request().query(appStr);
                        }

                        res.redirect("/list");
                        
                    } catch (err) {
                        console.log(err);
                        //res.redirect("/list");
                    } finally {
                        sql.close();
                    }
                })()
            
                sql.on('error', err => {
                    // ... error handler
                })
                
            });
            */
            })    

        }catch(e){
            console.log(e);
        }
        
    }
    else{
        res.cookie('i18n', 'ko', { maxAge: 900000, httpOnly: true });
        res.render('login');   
    }
    
});

router.get('/list', function (req, res) {
    req.session.selMenu = 'm1';
    var loginId = req.session.sid;
    var userListStr = "SELECT A.APP_ID, A.VERSION, A.APP_NAME, FORMAT(A.REG_DT,'yyyy-MM-dd') REG_DT, A.CULTURE, A.DESCRIPTION, A.APP_COLOR \n" +
                      "  FROM TBL_LUIS_APP A, TBL_USER_RELATION_APP B \n" +
                      " WHERE 1=1 \n" +
                      "   AND A.APP_ID = B.APP_ID \n" +
                      "   AND B.USER_ID = '" + loginId + "'; \n";

    var rows;
    var cnt_query;
    dbConnect.getConnection(sql).then(pool => {
    //new sql.ConnectionPool(dbConfig).connect().then(pool => {
        return pool.request().query(userListStr)
        }).then(result => {
            rows = result.recordset
            req.session.leftList = rows;
            if (rows.length > 0) {
                cnt_query = " SELECT ( SELECT COUNT( DISTINCT LUIS_INTENT ) FROM TBL_DLG_RELATION_LUIS WHERE LUIS_ID ='" + rows[0].APP_NAME + "')  AS INTENT_CNT, \n" +
                                    "( SELECT COUNT( GroupL )    FROM TBL_DLG  WHERE GroupL ='" + rows[0].APP_NAME + "') AS DLG_CNT \n";
                for (var i=1; i<rows.length; i++) {
                    cnt_query += "UNION ALL \n";
                    cnt_query += " SELECT ( SELECT COUNT( DISTINCT LUIS_INTENT ) FROM TBL_DLG_RELATION_LUIS WHERE LUIS_ID ='" + rows[i].APP_NAME + "')  AS INTENT_CNT, \n" +
                                     "( SELECT COUNT( GroupL )    FROM TBL_DLG  WHERE GroupL ='" + rows[i].APP_NAME + "') AS DLG_CNT \n";
                }
            }

            dbConnect.getConnection(sql).then(pool => {
                return pool.request().query(cnt_query)
            }).then(result => {
                let rows2 = result.recordset;
    
                for (var i=0; i<rows.length; i++) {
                    rows[i].INTENT_CNT = rows2[i].INTENT_CNT;
                    rows[i].DLG_CNT = rows2[i].DLG_CNT;
                }
    
                req.session.save(function(){
                    res.render('appList',
                    {
                        title: 'Express',
                        appName: req.session.appName,
                        selMenu: req.session.selMenu,
                        list: rows,
                        leftList: req.session.leftList
                    });
                });
                
                sql.close();
            }).catch(err => {
                res.status(500).send({ message: "${err}"})
                sql.close();
            });

        }).catch(err => {
            res.status(500).send({ message: "${err}"})
            sql.close();
    });
    
    sql.on('error', err => {
        sql.close();
    })
});

router.get('/addChatbot', function (req, res) {
    req.session.selMenus = 'ms1';
    res.render('addChatbot');
});

//Chatbot App Insert
router.post('/admin/addChatBotApps', function (req, res){
    var chatName = req.body.appInsertName;
    var culture = req.body.appInsertCulture;
    var chatDes = req.body.appDes;
    var chatColor = req.body.color;

    (async () => {
        try {
            var insertChatQuery = "INSERT INTO TBL_CHATBOT_APP(CHATBOT_NUM,CHATBOT_NAME,CULTURE,DESCRIPTION,APP_COLOR) ";
            insertChatQuery += "VALUES((SELECT ISNULL(MAX(CHATBOT_NUM),0) FROM TBL_CHATBOT_APP)+1, @chatName, @culture, @chatDes, @chatColor)";

            var insertDbQuery = "INSERT INTO TBL_DB_CONFIG(USER_NAME,PASSWORD,SERVER,DATABASE_NAME,APP_NAME,APP_ID) ";
            insertDbQuery += "VALUES('taihoinst', 'taiho9788!', 'taiholab.database.windows.net', @chatName, @chatName, @chatName)";

            let pool = await dbConnect.getConnection(sql);
            let insertChat = await pool.request()
                .input('chatName', sql.NVarChar, chatName)
                .input('culture', sql.NVarChar, culture)
                .input('chatDes', sql.NVarChar, chatDes)
                .input('chatColor', sql.NVarChar, chatColor)
                .query(insertChatQuery);

            let insertDb = await pool.request()
                .input('chatName', sql.NVarChar, chatName)
                .query(insertDbQuery);
            
            if(insertChat.rowsAffected.length > 0 && insertDb.rowsAffected.length > 0){
                res.send({result:true});
            } else {
                res.send({result:false});
            }
        } catch (err) {
            console.log(err)
            // ... error checks
        } finally {
            sql.close();
        }
    })()

});

//Luis app insert
router.post('/admin/putAddApps', function (req, res){
    var appService = req.body.appInsertService;
    var appName = req.body.appInsertName;
    var appCulture = req.body.appInsertCulture;
    var appDes = req.body.appDes;

    var client = new Client();
    
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

                //색상 등록
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

//Luis app delete
router.post('/admin/deleteApp', function (req, res){
    var appId = req.body.deleteAppId;

    var client = new Client();
    var options = {
        headers: {
            'Ocp-Apim-Subscription-Key': subKey
        }
    };
    try{
        client.delete( HOST + '/luis/api/v2.0/apps/' + appId , options, function (data, response) {
            res.json(data);
        });
    }catch(e){
        console.log(e);
    }
    
});

//Luis app rename
router.post('/admin/renameApp', function (req, res){
    var appId = req.body.renameAppId;
    var appName = req.body.renameAppName;
    var client = new Client();
    var options = {
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subKey
        },
        data: {
            'name': appName
        }
    };
    try{
        client.put( HOST + '/luis/api/v2.0/apps/' + appId , options, function (data, response) {
            res.json(data);
        });
    }catch(e){
        console.log(e);
    }
    
});

//luis Train
//Luis app insert
router.post('/admin/trainApp', function (req, res){
    var appId = req.session.appId;
    var appName = req.session.appName;
    var versionId;

    for (var i=0; i<saveAppList.length; i++) {
        if (appName === saveAppList[i].name) {
            versionId = saveAppList[i].endpoints.PRODUCTION.versionId;
        }
    }
    var client = new Client();
    
    var options = {
        headers: {
            'Ocp-Apim-Subscription-Key': subKey
        }
    };
    try{
        client.get( HOST + '/luis/api/v2.0/apps/' + appId + '/versions/' + versionId + '/train', options, function (data, response) {
            //console.log(data); // app id값
            var responseData = data;
            var trainResult = {};
            var sucCnt = 0;
            var failCnt = 0;
            //200:성공  400:실패
            // statusId 
            // - 0 : Success
            // - 1 : UpToDate   최신 정보
            // - 2 : InProgress  진행 중
            // - 3 : Fail     -> fail시  failureReason에 이유 넘어옴
            if (response.statusCode == 200) {
                for (var i=0; i< responseData.length; i++) {
                    if (responseData[i].details.statusId === 0 ) {
                        sucCnt++;
                    } else if (responseData[i].details.statusId === 3) {
                        failCnt++;
                    } else {
                        //continue;
                    }
                }
                trainResult.sucCnt = sucCnt;
                trainResult.failCnt = failCnt;
                res.send({result : response.statusCode, resultValue : trainResult});

            } else if (response.statusCode == 400) {
                res.send({result : response.statusCode, message : data.error.message});
            } else { //401
                res.send({result : response.statusCode, message : response.message});
            }


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

router.get('/index/lang', function (req, res) {
    if(req.cookies.i18n == "en") {
        res.cookie('i18n', 'ko', { maxAge: 24000 * 60 * 60 , httpOnly: true });
    } else if (req.cookies.i18n == "ko") {
        res.cookie('i18n', 'en', { maxAge: 24000 * 60 * 60, httpOnly: true });
    }

    res.redirect('back');
});

router.post('/jsLang', function (req, res) {

    if(res.locals.languageNow == "en") {
        res.send({ lang: res.locals.en});
    } else if (res.locals.languageNow == "ko") {
        res.send({lang: res.locals.ko});
    }
});


function pad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}


module.exports = router;
