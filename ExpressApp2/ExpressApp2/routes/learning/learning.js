﻿'use strict';
var express = require('express');
var sql = require('mssql');
var dbConfig = require('../../config/dbConfig');
var paging = require('../../config/paging');
var util = require('../../config/util');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    req.session.selMenus = 'ms1';
    req.session.selMenu = 'm3';
    res.redirect('/learning/recommend');
});

router.get('/recommend', function (req, res) {
    req.session.selMenus = 'ms1';
    res.render('recommend', {selMenus: 'ms1'});
});

router.post('/recommend', function (req, res) {
    var selectType = req.body.selectType;
    var currentPage = req.body.currentPage;

    (async () => {
        try {
            var entitiesQueryString = "SELECT TBZ.* "+
            "FROM (SELECT TBY.* "+
            "FROM (SELECT ROW_NUMBER() OVER(ORDER BY TBX.SEQ DESC) AS NUM, "+
            "COUNT('1') OVER(PARTITION BY '1') AS TOTCNT, "+
            "CEILING((ROW_NUMBER() OVER(ORDER BY TBX.SEQ DESC) )/ convert(numeric ,10)) PAGEIDX, "+
            "TBX.* "+
            "FROM ( "+
            "SELECT SEQ,QUERY,CONVERT(CHAR(19), UPD_DT, 20) AS UPD_DT,(SELECT RESULT FROM dbo.FN_ENTITY_ORDERBY_ADD(QUERY)) AS ENTITIES " +
            "FROM TBL_QUERY_ANALYSIS_RESULT " + 
            "WHERE RESULT='D'";
            
            if(selectType == 'yesterday'){
                entitiesQueryString += " AND (CONVERT(CHAR(10), UPD_DT, 23)) like '%'+(select CONVERT(CHAR(10), (select dateadd(day,-1,getdate())), 23)) + '%'";
            }else if(selectType == 'lastWeek'){
                entitiesQueryString += " AND (CONVERT(CHAR(10), UPD_DT, 23)) >= (SELECT CONVERT(CHAR(10), (DATEADD(wk, DATEDIFF(d, 0, getdate()) / 7 - 1, -1)), 23))";
                entitiesQueryString += " AND (CONVERT(CHAR(10), UPD_DT, 23)) <= (SELECT CONVERT(CHAR(10), (DATEADD(wk, DATEDIFF(d, 0, getdate()) / 7 - 1, 5)), 23))";
            }else if(selectType == 'lastMonth'){
                entitiesQueryString += " AND (CONVERT(CHAR(7), UPD_DT, 23)) like '%'+ (select CONVERT(CHAR(7), (select dateadd(month,-1,getdate())), 23)) + '%'";
            }else{
            }

            entitiesQueryString += " ) TBX) TBY) TBZ";
            entitiesQueryString += " WHERE PAGEIDX = @currentPage";
            entitiesQueryString += " ORDER BY NUM";

            let pool = await sql.connect(dbConfig)
            let result1 = await pool.request()
                .input('currentPage', sql.Int, currentPage)
                .query(entitiesQueryString)
            let rows = result1.recordset;

            
            var result = [];
            for(var i = 0; i < rows.length; i++){
                var item = {};
                var query = rows[i].QUERY;
                var seq = rows[i].SEQ;
                var entities = rows[i].ENTITIES;
                var updDt = rows[i].UPD_DT;
                var entityArr = rows[i].ENTITIES.split(',');
                var luisQueryString = "";

                item.QUERY = query;
                item.UPD_DT = updDt;
                item.SEQ = seq;
                item.ENTITIES = entities;
                if(entityArr[0] == ""){
                    item.intentList = [];
                }else{
                    for(var j = 0; j < entityArr.length; j++) {
                        if(j == 0){
                            luisQueryString += "SELECT DISTINCT LUIS_INTENT FROM TBL_DLG_RELATION_LUIS WHERE LUIS_ENTITIES LIKE '%" + entityArr[j] + "%'"
                        }else{
                            luisQueryString += "OR LUIS_ENTITIES LIKE '%" + entityArr[j] + "%'";
                        }
                    }
                    let luisIntentList = await pool.request()
                    .query(luisQueryString)
                    item.intentList = luisIntentList.recordset
                }
                result.push(item);
            }

            if(rows.length > 0){
                res.send({list : result, pageList : paging.pagination(currentPage,rows[0].TOTCNT)});
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

router.get('/utterances', function (req, res) {
	var utterance = req.query.utterance;

    req.session.selMenus = 'ms2';
    res.render('utterances', {
        selMenus: req.session.selMenus,
        title: 'learning utterances page',
		utterance: utterance
    } );
});

router.get('/dialog', function (req, res) {

    req.session.selMenus = 'ms3';
    res.render('dialog', {
        selMenus: req.session.selMenus,
        title: 'learning dialog page'
    } );
});

/*
router.post('/', function (req, res) {
    
    
    var currentPage = req.body.currentPage;

    (async () => {
        try {
            var sourceType = req.body.sourceType;
            var groupType = req.body.groupType;
            var dlg_desQueryString = "select tbp.* from " +
                                     "(select ROW_NUMBER() OVER(ORDER BY LUIS_ENTITIES DESC) AS NUM, " +
                                     "COUNT('1') OVER(PARTITION BY '1') AS TOTCNT, "  +
                                     "CEILING((ROW_NUMBER() OVER(ORDER BY LUIS_ENTITIES DESC))/ convert(numeric ,10)) PAGEIDX, " +
                                     "DLG_DESCRIPTION, DLG_API_DEFINE ,LUIS_ENTITIES, LUIS_INTENT " +
                                     "from TBL_DLG a, TBL_DLG_RELATION_LUIS b " + 
                                     "where a.DLG_ID = b.DLG_ID and LUIS_INTENT like '%" + groupType + "%' " +
                                     "and DLG_API_DEFINE like '%" + sourceType + "%') tbp " +
                                     "WHERE PAGEIDX = @currentPage";
            let pool = await sql.connect(dbConfig);
            let result1 = await pool.request().input('currentPage', sql.Int, currentPage).query(dlg_desQueryString);
            let rows = result1.recordset;
            
            var result = [];
            for(var i = 0; i < rows.length; i++){
                var item = {};

                var description = rows[i].DLG_DESCRIPTION;
                var apidefine = rows[i].DLG_API_DEFINE;
                var luisentties = rows[i].LUIS_ENTITIES;
                var luisentent = rows[i].LUIS_INTENT;

                item.DLG_DESCRIPTION = description;
                item.DLG_API_DEFINE = apidefine;
                item.LUIS_ENTITIES = luisentties;
                item.LUIS_INTENT = luisentent;

                result.push(item);
            }
            if(rows.length > 0){
                res.send({list : result, pageList : paging.pagination(currentPage,rows[0].TOTCNT)});
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
//다이얼로그 대그룹 중그룹 소그룹 셀렉트 박스
router.post('/searchGroup', function (req, res) {
    
    var group = req.body.group;
    var groupName = req.body.groupName;
    var groupL = req.body.groupL;

    (async () => {
        try {

            let pool = await sql.connect(dbConfig);

            var searchGroupQuery;
            if(group == 'searchMedium') {

                searchGroupQuery = "select distinct MEDIUM_GROUP from TBL_DLG where LARGE_GROUP = @groupName";

                let result1 = await pool.request().input('groupName', sql.NVarChar, groupName).query(searchGroupQuery);
                let rows = result1.recordset;
                
                var groupList = [];
                for(var i = 0; i < rows.length; i++){
                    var item = {};

                    var mediumGroup = rows[i].MEDIUM_GROUP;

                    item.mediumGroup = mediumGroup; 

                    groupList.push(item);
                }

                res.send({groupList: groupList});
            } else if(group == 'searchSmall') {

                searchGroupQuery = "select distinct SMALL_GROUP from TBL_DLG where LARGE_GROUP = '" + groupL + "' and MEDIUM_GROUP = @groupName";

                let result1 = await pool.request().input('groupName', sql.NVarChar, groupName).query(searchGroupQuery);
                let rows = result1.recordset;
                
                var groupList = [];
                for(var i = 0; i < rows.length; i++){
                    var item = {};

                    var smallGroup = rows[i].SMALL_GROUP;
                    item.smallGroup = smallGroup; 

                    groupList.push(item);
                }

                res.send({groupList: groupList});
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

//dialog.html 소그룹이 선택 돼었을때 리스트 뿌려주기
router.post('/selectSmallGroup', function (req, res) {
    
    var groupName = req.body.groupName;
    var currentPage = 1;

    if(req.body.currentPage != null) {
        currentPage = req.body.currentPage;
    } 
    (async () => {
        try {

            var selectSmallGroup = "select tbp.* from " +
                                 "(select ROW_NUMBER() OVER(ORDER BY LUIS_ENTITIES DESC) AS NUM, " +
                                 "COUNT('1') OVER(PARTITION BY '1') AS TOTCNT, "  +
                                 "CEILING((ROW_NUMBER() OVER(ORDER BY LUIS_ENTITIES DESC))/ convert(numeric ,10)) PAGEIDX, " +
                                 "DLG_DESCRIPTION, SMALL_GROUP, DLG_API_DEFINE ,LUIS_ENTITIES" +
                                 "from TBL_DLG a, TBL_DLG_RELATION_LUIS b " + 
                                 "where a.DLG_ID = b.DLG_ID and SMALL_GROUP like '%" + groupName + "%' " +
                                 "and DLG_API_DEFINE like '%" + sourceType + "%') tbp " +
                                 "WHERE PAGEIDX = @currentPage";

            //var searchMidGroup = "select * from TBL_DLG where SMALL_GROUP = @groupName";
            let pool = await sql.connect(dbConfig);
            let result1 = await pool.request().input('currentPage', sql.Int, currentPage).query(selectSmallGroup);
            let rows = result1.recordset;
            
            var result = [];
            for(var i = 0; i < rows.length; i++){
                var item = {};

                var description = rows[i].DLG_DESCRIPTION;
                var apidefine = rows[i].DLG_API_DEFINE;
                var luisentent = rows[i].LUIS_INTENT;
                var smallGroup = rows[i].SMALL_GROUP;
                
                item.DLG_DESCRIPTION = description;
                item.DLG_API_DEFINE = apidefine;
                item.LUIS_INTENT = luisentent;
                item.SMALL_GROUP = smallGroup;

                result.push(item);
            }
            if(rows.length > 0){
                res.send({list : result, pageList : paging.pagination(currentPage,rows[0].TOTCNT)});
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

/*
//그룹 테스트
router.post('/searchMidGroup', function (req, res) {
    
    
    var groupName = req.body.groupName;

    (async () => {
        try {
            var searchMidGroup = "select distinct MEDIUM_GROUP from TBL_DLG where LARGE_GROUP = @groupName";
            let pool = await sql.connect(dbConfig);
            let result1 = await pool.request().input('groupName', sql.NVarChar, groupName).query(searchMidGroup);
            let rows = result1.recordset;
            
            var groupList = [];
            for(var i = 0; i < rows.length; i++){
                var item = {};

                var mediumGroup = rows[i].MEDIUM_GROUP;

                item.mediumGroup = mediumGroup; 
                console.log("mediumGroup:" + mediumGroup);


                groupList.push(item);
            }


            if(rows.length > 0){
                res.send({groupList: groupList});
            }else{
                res.send({list : groupList});
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

router.post('/dialogs2', function (req, res) {
    
    var currentPage = req.body.currentPage;
    var sourceType2 = req.body.sourceType2;
    var searchGroupL = req.body.searchGroupL;
    var searchGroupM = req.body.searchGroupM;
    var searchGroupS = req.body.searchGroupS;
    var searchText = req.body.searchText;

    (async () => {
        try {
                    
            var dlg_desQueryString = "select tbp.* from " +
                                     "(select ROW_NUMBER() OVER(ORDER BY LUIS_ENTITIES DESC) AS NUM, " +
                                     "COUNT('1') OVER(PARTITION BY '1') AS TOTCNT, "  +
                                     "CEILING((ROW_NUMBER() OVER(ORDER BY LUIS_ENTITIES DESC))/ convert(numeric ,10)) PAGEIDX, " +
                                     "DLG_DESCRIPTION, DLG_API_DEFINE ,LUIS_ENTITIES, SMALL_GROUP " +
                                     "from TBL_DLG a, TBL_DLG_RELATION_LUIS b where a.DLG_ID = b.DLG_ID ";

                dlg_desQueryString += "and LARGE_GROUP = '" + searchGroupL + "' and MEDIUM_GROUP = '" + searchGroupM + "' and SMALL_GROUP = '" + searchGroupS + "' ";
                  
                dlg_desQueryString += "and DLG_API_DEFINE like '%" + sourceType2 + "%' ";
                if(searchText != "") {
                    dlg_desQueryString+= "and LUIS_ENTITIES like '%" + searchText + "%' ";
                }
                dlg_desQueryString += ") tbp WHERE PAGEIDX = @currentPage";
            let pool = await sql.connect(dbConfig);
            let result1 = await pool.request().input('currentPage', sql.Int, currentPage).query(dlg_desQueryString);
            let rows = result1.recordset;
            
            var result = [];
            for(var i = 0; i < rows.length; i++){
                var item = {};

                var description = rows[i].DLG_DESCRIPTION;
                var apidefine = rows[i].DLG_API_DEFINE;
                var luisentties = rows[i].LUIS_ENTITIES;
                var luisentent = rows[i].LUIS_INTENT;
                var smallGroup = rows[i].SMALL_GROUP;

                item.DLG_DESCRIPTION = description;
                item.DLG_API_DEFINE = apidefine;
                item.LUIS_ENTITIES = luisentties;
                item.LUIS_INTENT = luisentent;
                item.SMALL_GROUP = smallGroup;

                result.push(item);
            }

            var group_query = "select distinct LARGE_GROUP from TBL_DLG where LARGE_GROUP is not null";
            let result2 = await pool.request().query(group_query);
            let rows2 = result2.recordset;
            
            var groupList = [];
            for(var i = 0; i < rows2.length; i++){
                var item2 = {};

                var largeGroup = rows2[i].LARGE_GROUP;

                item2.largeGroup = largeGroup;

                groupList.push(item2);
            }

            if(rows.length > 0){
                res.send({list : result, pageList : paging.pagination(currentPage,rows[0].TOTCNT), groupList: groupList});
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

router.post('/dialogs', function (req, res) {
    
    
    var currentPage = req.body.currentPage;

    (async () => {
        try {
            var sourceType = req.body.sourceType;
            var groupType = req.body.groupType;
            
            var dlg_desQueryString = "select tbp.* from " +
                                     "(select ROW_NUMBER() OVER(ORDER BY LUIS_ENTITIES DESC) AS NUM, " +
                                     "COUNT('1') OVER(PARTITION BY '1') AS TOTCNT, "  +
                                     "CEILING((ROW_NUMBER() OVER(ORDER BY LUIS_ENTITIES DESC))/ convert(numeric ,10)) PAGEIDX, " +
                                     "DLG_DESCRIPTION, DLG_API_DEFINE ,LUIS_ENTITIES, SMALL_GROUP " +
                                     "from TBL_DLG a, TBL_DLG_RELATION_LUIS b where a.DLG_ID = b.DLG_ID ";
            if(groupType != '모두보기') {

                dlg_desQueryString += "and SMALL_GROUP = '" + groupType + "' ";
            }      
                dlg_desQueryString += "and DLG_API_DEFINE like '%" + sourceType + "%') tbp " +
                                      "WHERE PAGEIDX = @currentPage";
            let pool = await sql.connect(dbConfig);
            let result1 = await pool.request().input('currentPage', sql.Int, currentPage).query(dlg_desQueryString);
            let rows = result1.recordset;
            
            var result = [];
            for(var i = 0; i < rows.length; i++){
                var item = {};

                var description = rows[i].DLG_DESCRIPTION;
                var apidefine = rows[i].DLG_API_DEFINE;
                var luisentties = rows[i].LUIS_ENTITIES;
                var luisentent = rows[i].LUIS_INTENT;
                var smallGroup = rows[i].SMALL_GROUP;

                item.DLG_DESCRIPTION = description;
                item.DLG_API_DEFINE = apidefine;
                item.LUIS_ENTITIES = luisentties;
                item.LUIS_INTENT = luisentent;
                item.SMALL_GROUP = smallGroup;

                result.push(item);
            }

            var group_query = "select distinct LARGE_GROUP from TBL_DLG where LARGE_GROUP is not null";
            let result2 = await pool.request().query(group_query);
            let rows2 = result2.recordset;
            
            var groupList = [];
            for(var i = 0; i < rows2.length; i++){
                var item2 = {};

                var largeGroup = rows2[i].LARGE_GROUP;

                item2.largeGroup = largeGroup;

                groupList.push(item2);
            }

            if(rows.length > 0){
                res.send({list : result, pageList : paging.pagination(currentPage,rows[0].TOTCNT), groupList: groupList});
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

router.post('/utterInputAjax', function(req, res, next) {
 
    //view에 있는 data 에서 던진 값을 받아서
    var iptUtterance = req.body.iptUtterance;

    (async () => {
        try {
            let pool = await sql.connect(dbConfig)
            let result1 = await pool.request()
                .input('iptUtterance', sql.NVarChar, iptUtterance)
                .query('SELECT RESULT FROM dbo.FN_ENTITY_ORDERBY_ADD(@iptUtterance)')
            
            let rows = result1.recordset;

            if(rows[0]['RESULT'] != '') {
                var entities = rows[0]['RESULT'];
                var entityArr = entities.split(',');
                var queryString = "";
                for(var i = 0; i < entityArr.length; i++) {
                    if(i == 0){
                        queryString += "SELECT DISTINCT LUIS_INTENT FROM TBL_DLG_RELATION_LUIS WHERE LUIS_ENTITIES LIKE '%" + entityArr[i] + "%'"
                    }else{
                        queryString += "OR LUIS_ENTITIES LIKE '%" + entityArr[i] + "%'";
                    }
                }

                let result2 = await pool.request()
                .query(queryString)
                
                let rows2 = result2.recordset

                var queryString2 = "SELECT ENTITY_VALUE,ENTITY FROM TBL_COMMON_ENTITY_DEFINE WHERE ENTITY IN (";
                for(var i = 0; i < entityArr.length; i++) {
                    queryString2 += "'";
                    queryString2 += entityArr[i];
                    queryString2 += "'";
                    queryString2 += (i != entityArr.length-1)? "," : "";
                }
                queryString2 += ")";
                let result3 = await pool.request()
                .query(queryString2)
                
                let rows3 = result3.recordset
                var commonEntities = [];
                for(var i = 0; i < rows3.length; i++) {
                    // 중복되는 엔티티가 있는 경우 길이가 긴 것이 우선순위를 갖음
                    if(iptUtterance.indexOf(rows3[i].ENTITY_VALUE) != -1){
                        // 첫번째 엔티티는 등록
                        var isCommonAdd = false;
                        if(commonEntities.length == 0){
                            isCommonAdd = true;
                        }else{
                            for(var j = 0 ; j < commonEntities.length ; j ++){
                                var longEntity = '';
                                var shortEntity = '';
                                var isAdd = false;
                                if(rows3[i].ENTITY_VALUE.length >= commonEntities[j].ENTITY_VALUE.length){
                                    longEntity = rows3[i].ENTITY_VALUE;
                                    shortEntity = commonEntities[j].ENTITY_VALUE;
                                    isAdd = true;
                                }else{
                                    longEntity = commonEntities[j].ENTITY_VALUE;
                                    shortEntity = rows3[i].ENTITY_VALUE;
                                }
                                if(longEntity.indexOf(shortEntity) != -1){
                                    if(isAdd){
                                        commonEntities.splice(j,1);
                                        isCommonAdd = true;
                                        break;
                                    }
                                }else{
                                    isAdd = true;
                                }
                                if(isAdd && j == commonEntities.length-1){
                                    isCommonAdd = true;
                                }
                            }
                        }
                        if(isCommonAdd){
                            var item = {};
                            item.ENTITY_VALUE = rows3[i].ENTITY_VALUE;
                            item.ENTITY = rows3[i].ENTITY;
                            commonEntities.push(item);
                        }
                    }
                }

                res.send({result:true, iptUtterance:iptUtterance, entities:entities, selBox:rows2, commonEntities: commonEntities});
            } else {
                res.send({result:true, iptUtterance:iptUtterance});
            }
        
        } catch (err) {
            // ... error checks
            console.log(err);
        } finally {
            sql.close();
        }
    })()
    
    sql.on('error', err => {
        // ... error handler
    })

});


router.get('/entities', function (req, res) {

    req.session.selMenus = 'ms4';
    res.render('entities', {
        selMenus: req.session.selMenus,
        title: 'learning Entities page'
    } );
});


router.post('/entities', function (req, res) {

    var currentPage = req.body.currentPage;

    (async () => {
        try {
         
            var entitiesQueryString = "select tbp.* from " +
                                      "(select ROW_NUMBER() OVER(ORDER BY api_group DESC) AS NUM, " +
                                      "COUNT('1') OVER(PARTITION BY '1') AS TOTCNT, "  +
                                      "CEILING((ROW_NUMBER() OVER(ORDER BY api_group DESC))/ convert(numeric ,10)) PAGEIDX, " +
                                      "entity_value, entity, api_group from ( SELECT DISTINCT entity, API_GROUP , STUFF(( " +
                                      "SELECT ',' + b.entity_value FROM TBL_COMMON_ENTITY_DEFINE b " +
                                      "WHERE b.entity = a.entity FOR XML PATH('') ),1,1,'') AS entity_value " +
                                      "FROM TBL_COMMON_ENTITY_DEFINE a where API_GROUP != 'OCR TEST' " +
                                      "group by entity, API_GROUP) " +
                                      "tbl_common_entity_define where api_group != 'OCR TEST') tbp " +
                                      "WHERE PAGEIDX = @currentPage";
            
            let pool = await sql.connect(dbConfig)
            let result1 = await pool.request().input('currentPage', sql.Int, currentPage).query(entitiesQueryString);

            let rows = result1.recordset;

            var result = [];
            for(var i = 0; i < rows.length; i++){
                var item = {};

                var entitiyValue = rows[i].entity_value;
                var entity = rows[i].entity;
                var apiGroup = rows[i].api_group;

                item.ENTITY_VALUE = entitiyValue;
                item.ENTITY = entity;
                item.API_GROUP = apiGroup;

                result.push(item);
            }
            if(rows.length > 0){
                res.send({list : result, pageList : paging.pagination(currentPage,rows[0].TOTCNT)});
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

//엔티티 추가
router.post('/insertEntity', function (req, res) {
    
    var entityDefine = req.body.entityDefine;
    var entityValue = req.body.entityValue;
    var apiGroup = req.body.apiGroup;

    (async () => {
        try {

            var insertQueryString1 = 'INSERT INTO tbl_common_entity_define(ENTITY, ENTITY_VALUE, API_GROUP) VALUES ' +
            '(@entityDefine, @entityValue, @apiGroup)';
            
            let pool = await sql.connect(dbConfig);

            let result1 = await pool.request()
                .input('entityDefine', sql.NVarChar, entityDefine)
                .input('entityValue', sql.NVarChar, entityValue)
                .input('apiGroup', sql.NVarChar, apiGroup)
                .query(insertQueryString1);  
            
            res.send({status:200 , message:'insert Success'});
        
        } catch (err) {
            console.log(err);
            res.send({status:500 , message:'insert Entity Error'});
        } finally {
            sql.close();
        }
    })()
    
    sql.on('error', err => {
    })
    
});

//엔티티 검색
router.post('/searchEntities', function (req, res) {

    var currentPage = req.body.currentPage;
    var searchEntities = req.body.searchEntities;
    
    (async () => {
        try {
         
            var entitiesQueryString = "select tbp.* from " +
                                      "(select ROW_NUMBER() OVER(ORDER BY api_group DESC) AS NUM, " +
                                      "COUNT('1') OVER(PARTITION BY '1') AS TOTCNT, "  +
                                      "CEILING((ROW_NUMBER() OVER(ORDER BY api_group DESC))/ convert(numeric ,10)) PAGEIDX, " +
                                      "entity_value, entity, api_group from (SELECT DISTINCT entity, API_GROUP , STUFF(( " +
                                      "SELECT ',' + b.entity_value FROM TBL_COMMON_ENTITY_DEFINE b " +
                                      " WHERE b.entity = a.entity FOR XML PATH('') ),1,1,'') AS entity_value " +
                                      "FROM TBL_COMMON_ENTITY_DEFINE a where API_GROUP != 'OCR TEST' " +
                                      "and (entity = @searchEntities or entity_value = @searchEntities) " +
                                      "group by entity, API_GROUP) a" +
                                      " ) tbp " +
                                      "WHERE PAGEIDX = @currentPage";
            
            let pool = await sql.connect(dbConfig)
            let result1 = await pool.request().input('currentPage', sql.Int, currentPage).input('searchEntities', sql.NVarChar, searchEntities).query(entitiesQueryString);

            let rows = result1.recordset;

            var result = [];
            for(var i = 0; i < rows.length; i++){
                var item = {};

                var entitiyValue = rows[i].entity_value;
                var entity = rows[i].entity;
                var apiGroup = rows[i].api_group;

                item.ENTITY_VALUE = entitiyValue;
                item.ENTITY = entity;
                item.API_GROUP = apiGroup;

                result.push(item);
            }
            if(rows.length > 0){
                res.send({list : result, pageList : paging.pagination(currentPage,rows[0].TOTCNT)});
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

router.post('/selectDlgListAjax', function (req, res) {

    var entity = [];
    entity = req.body['entity[]'];
    

    var relationText = "SELECT RNUM, LUIS_ENTITIES, A.DLG_ID DLG_ID, B.DLG_TYPE, DLG_ORDER_NO \n"
                     + "FROM (\n"
                     + "SELECT RANK() OVER(ORDER BY LUIS_ENTITIES) AS RNUM, LUIS_ENTITIES, DLG_ID \n"
                     + "FROM TBL_DLG_RELATION_LUIS \n"
                     + "WHERE 1=1\n";
    if(Array.isArray(entity)){
        for(var i = 0; i < entity.length; i++) {
            if(i == 0) {
                relationText += "AND LUIS_ENTITIES LIKE '%" + entity[i] +"%'\n";
            } else {
                relationText += "OR LUIS_ENTITIES LIKE '%" + entity[i] +"%'\n";
            }      
        }
    } else {
        relationText += "AND LUIS_ENTITIES LIKE '%" + entity +"%'\n";
    }
    
    relationText += "GROUP BY LUIS_ENTITIES, DLG_ID \n"
                 + ") A LEFT OUTER JOIN TBL_DLG B\n"
                 + "ON A.DLG_ID = B.DLG_ID \n"
                 + "WHERE RNUM = 1\n"
                 + "ORDER BY LUIS_ENTITIES desc, DLG_ORDER_NO";

    var dlgText = "SELECT DLG_ID, CARD_TITLE, CARD_TEXT, USE_YN, '2' AS DLG_TYPE \n"
                  + "FROM TBL_DLG_TEXT\n"
                  + "WHERE USE_YN = 'Y'\n"
                  + "AND DLG_ID IN (\n"
                  + "SELECT DISTINCT DLG_ID\n"
                  + "FROM TBL_DLG_RELATION_LUIS\n"
                  + "WHERE 1=1\n";
    if(Array.isArray(entity)){
        for(var i = 0; i < entity.length; i++) {
            if(i == 0) {
                dlgText += "AND LUIS_ENTITIES LIKE '%" + entity[i] +"%'\n";
            } else {
                dlgText += "OR LUIS_ENTITIES LIKE '%" + entity[i] +"%'\n";
            }
        }
    } else {
        dlgText += "AND LUIS_ENTITIES LIKE '%" + entity +"%'\n";
    }

    dlgText += ") \n ORDER BY DLG_ID";

    var dlgCard = "SELECT DLG_ID, CARD_TEXT, CARD_TITLE, IMG_URL, BTN_1_TYPE, BTN_1_TITLE, BTN_1_CONTEXT,\n"
                  + "BTN_2_TYPE, BTN_2_TITLE, BTN_2_CONTEXT,\n"
                  + "BTN_3_TYPE, BTN_3_TITLE, BTN_3_CONTEXT,\n"
                  + "BTN_4_TYPE, BTN_4_TITLE, BTN_4_CONTEXT,\n"
                  + "CARD_ORDER_NO, CARD_VALUE,\n"
                  + "USE_YN, '3' AS DLG_TYPE \n"
                  + "FROM TBL_DLG_CARD\n"
                  + "WHERE USE_YN = 'Y'\n"
                  + "AND DLG_ID IN (\n"
                  + "SELECT DISTINCT DLG_ID\n"
                  + "FROM TBL_DLG_RELATION_LUIS\n"
                  + "WHERE 1=1\n";
    if(Array.isArray(entity)){
        for(var i = 0; i < entity.length; i++) {
            if(i == 0) {
                dlgCard += "AND LUIS_ENTITIES LIKE '%" + entity[i] +"%'\n";
            } else {
                dlgCard += "OR LUIS_ENTITIES LIKE '%" + entity[i] +"%'\n";
            }
        }
    } else{
        dlgCard += "AND LUIS_ENTITIES LIKE '%" + entity +"%'\n";
    }

    dlgCard += ") \n ORDER BY DLG_ID";
    
    var dlgMedia = "SELECT DLG_ID, CARD_TEXT, CARD_TITLE, MEDIA_URL, BTN_1_TYPE, BTN_1_TITLE, BTN_1_CONTEXT,\n"
                  + "BTN_2_TYPE, BTN_2_TITLE, BTN_2_CONTEXT,\n"
                  + "BTN_3_TYPE, BTN_3_TITLE, BTN_3_CONTEXT,\n"
                  + "BTN_4_TYPE, BTN_4_TITLE, BTN_4_CONTEXT,\n"
                  + "CARD_VALUE,\n"
                  + "USE_YN, '4' AS DLG_TYPE \n"
                  + "FROM TBL_DLG_MEDIA\n"
                  + "WHERE USE_YN = 'Y'\n"
                  + "AND DLG_ID IN (\n"
                  + "SELECT DISTINCT DLG_ID\n"
                  + "FROM TBL_DLG_RELATION_LUIS\n"
                  + "WHERE 1=1\n";
    
    if(Array.isArray(entity)){
        for(var i = 0; i < entity.length; i++) {
            if(i == 0) {
                dlgMedia += "AND LUIS_ENTITIES LIKE '%" + entity[i] +"%'\n";
            } else {
                dlgMedia += "OR LUIS_ENTITIES LIKE '%" + entity[i] +"%'\n";
            }
        }
    } else {
        dlgMedia += "AND LUIS_ENTITIES LIKE '%" + entity +"%'\n";
    }

    dlgMedia += ") \n ORDER BY DLG_ID";

    (async () => {
        try {
            let pool = await sql.connect(dbConfig)

            let dlgTextResult = await pool.request()
                .query(dlgText);
            let rowsText = dlgTextResult.recordset;

            let dlgCardResult = await pool.request()
                .query(dlgCard);
            let rowsCard = dlgCardResult.recordset;

            let dlgMediaResult = await pool.request()
                .query(dlgMedia);
            let rowsMedia = dlgMediaResult.recordset;
            
            let result1 = await pool.request()
                .query(relationText)
            let rows = result1.recordset;
            var result = [];
            for(var i = 0; i < rows.length; i++){
                var row = {};
                row.RNUM = rows[i].RNUM;
                row.LUIS_ENTITIES = rows[i].LUIS_ENTITIES;
                row.DLG_ID = rows[i].DLG_ID;
                row.DLG_TYPE = rows[i].DLG_TYPE;
                row.DLG_ORDER_NO = rows[i].DLG_ORDER_NO;
                row.dlg = [];

                let dlg_type = rows[i].DLG_TYPE;
                if(dlg_type == 2){
                    for(var j = 0; j < rowsText.length; j++){
                        let textDlgId = rowsText[j].DLG_ID;
                        if(row.DLG_ID == textDlgId){
                            row.dlg.push(rowsText[j]);
                        }
                    }
                }else if(dlg_type == 3){
                    for(var j = 0; j < rowsCard.length; j++){
                        var cardDlgId = rowsCard[j].DLG_ID;
                        if(row.DLG_ID == cardDlgId){
                            row.dlg.push(rowsCard[j]);
                        }
                    }
                }else if(dlg_type == 4){
                    for(var j = 0; j < rowsMedia.length; j++){
                        var mediaDlgId = rowsMedia[j].DLG_ID;
                        if(row.DLG_ID == mediaDlgId){
                            row.dlg.push(rowsMedia[j]);
                        }
                    }
                }
                result.push(row);
            }

            res.send({list : result});
        
        } catch (err) {
            console.log(err);
        } finally {
            sql.close();
        }
    })()

    sql.on('error', err => {
        console.log(err);
    })
});

//다이얼로그 추가
router.post('/insertDialog', function (req, res) {
    res.send({status:600 , message:'ing...'});
    /*
    var sourceType = req.body.sourceType;
    var largeGroup = req.body.largeGroup;
    var mediumGroup = req.body.mediumGroup;
    var smallGroup = req.body.smallGroup;
    var description = util.nullCheck(req.body.description, null);

    var dlgType = req.body.dlgType; // 2 : text , 3 : carousel , 4 : media
    var dialogOrderNo = req.body.dialogOrderNo;
    var dialogText = util.nullCheck(req.body.dialogText, null);

    var cardOrderNo = req.body.cardOrderNo;

    var buttonName1 = util.nullCheck(req.body.buttonName1, null);
    var buttonName2 = util.nullCheck(req.body.buttonName2, null);
    var buttonName3 = util.nullCheck(req.body.buttonName3, null);
    var buttonName4 = util.nullCheck(req.body.buttonName4, null);
    var buttonContent1 = util.nullCheck(req.body.buttonContent1, null);
    var buttonContent2 = util.nullCheck(req.body.buttonContent2, null);
    var buttonContent3 = util.nullCheck(req.body.buttonContent3, null);
    var buttonContent4 = util.nullCheck(req.body.buttonContent4, null);
    var btn1Type = (buttonName1 != null)? 'imBack' : null;
    var btn2Type = (buttonName2 != null)? 'imBack' : null;
    var btn3Type = (buttonName3 != null)? 'imBack' : null;
    var btn4Type = (buttonName4 != null)? 'imBack' : null;
    var imgUrl = util.nullCheck(req.body.imgUrl, null);

    (async () => {
        try {

            var selectQueryString1 = 'SELECT ISNULL(MAX(DLG_ID)+1,1) AS DLG_ID FROM TBL_DLG';
            let pool = await sql.connect(dbConfig)
            let result1 = await pool.request()
                .query(selectQueryString1)
            let rows1 = result1.recordset;
            
            var insertQueryString1 = 'INSERT INTO TBL_DLG(DLG_ID,DLG_NAME,DLG_DESCRIPTION,DLG_LANG,DLG_TYPE,DLG_ORDER_NO,USE_YN) VALUES ' +
            '(@dlgId,@dialogText,@dialogText,\'KO\',@dlgType,@dialogOrderNo,\'Y\')';

            let result2 = await pool.request()
                .input('dlgId', sql.Int, rows1[0].DLG_ID)
                .input('dialogText', sql.NVarChar, dialogText)
                .input('dlgType', sql.NVarChar, dlgType)
                .input('dialogOrderNo', sql.Int, dialogOrderNo)
                .query(insertQueryString1)  
            //let rows2 = result2.recordset;
            
            var selectQueryString2 = '';
            if(dlgType == '2'){
                selectQueryString2 = 'SELECT ISNULL(MAX(TEXT_DLG_ID)+1,1) AS TYPE_DLG_ID FROM TBL_DLG_TEXT';
            }else if(dlgType == '3'){
                selectQueryString2 = 'SELECT ISNULL(MAX(CARD_DLG_ID)+1,1) AS TYPE_DLG_ID FROM TBL_DLG_CARD';
            }else if(dlgType == '4'){
                selectQueryString2 = 'SELECT ISNULL(MAX(MEDIA_DLG_ID)+1,1) AS TYPE_DLG_ID FROM TBL_DLG_MEDIA';
            }else{
            }
            
            let result3 = await pool.request()
                .query(selectQueryString2)
            let rows3 = result3.recordset; //rows3[0].TYPE_DLG_ID

            var insertQueryString2 = '';
            if(dlgType == '2'){
                insertQueryString2 = 'INSERT INTO TBL_DLG_TEXT(TEXT_DLG_ID,DLG_ID,CARD_TEXT,USE_YN) VALUES ' +
                '(@typeDlgId,@dlgId,@dialogText,\'Y\')';
            }else if(dlgType == '3'){
                insertQueryString2 = 'INSERT INTO TBL_DLG_CARD(CARD_DLG_ID,DLG_ID,CARD_TEXT,IMG_URL,BTN_1_TYPE,BTN_1_TITLE,BTN_1_CONTEXT,BTN_2_TYPE,BTN_2_TITLE,BTN_2_CONTEXT,BTN_3_TYPE,BTN_3_TITLE,BTN_3_CONTEXT,BTN_4_TYPE,BTN_4_TITLE,BTN_4_CONTEXT,CARD_ORDER_NO,USE_YN) VALUES ' +
                '(@typeDlgId,@dlgId,@dialogText,@imgUrl,@btn1Type,@buttonName1,@buttonContent1,@btn2Type,@buttonName2,@buttonContent2,@btn3Type,@buttonName3,@buttonContent3,@btn4Type,@buttonName4,@buttonContent4,@cardOrderNo,\'Y\')';
            }else if(dlgType == '4'){
                insertQueryString2 = 'INSERT INTO TBL_DLG_MEDIA(MEDIA_DLG_ID,DLG_ID,CARD_TEXT,MEDIA_URL,BTN_1_TYPE,BTN_1_TITLE,BTN_1_CONTEXT,BTN_2_TYPE,BTN_2_TITLE,BTN_2_CONTEXT,BTN_3_TYPE,BTN_3_TITLE,BTN_3_CONTEXT,BTN_4_TYPE,BTN_4_TITLE,BTN_4_CONTEXT,USE_YN) VALUES ' +
                '(@typeDlgId,@dlgId,@dialogText,@imgUrl,@btn1Type,@buttonName1,@buttonContent1,@btn2Type,@buttonName2,@buttonContent2,@btn3Type,@buttonName3,@buttonContent3,@btn4Type,@buttonName4,@buttonContent4,\'Y\')';
            }else{
            }

            let result4 = await pool.request()
                .input('typeDlgId', sql.Int, rows3[0].TYPE_DLG_ID)
                .input('dlgId', sql.Int, rows1[0].DLG_ID)
                .input('dialogText', sql.NVarChar, dialogText)
                .input('imgUrl', sql.NVarChar, imgUrl)
                .input('btn1Type', sql.NVarChar, btn1Type)
                .input('buttonName1', sql.NVarChar, buttonName1)
                .input('buttonContent1', sql.NVarChar, buttonContent1)
                .input('btn2Type', sql.NVarChar, btn2Type)
                .input('buttonName2', sql.NVarChar, buttonName2)
                .input('buttonContent2', sql.NVarChar, buttonContent2)
                .input('btn3Type', sql.NVarChar, btn3Type)
                .input('buttonName3', sql.NVarChar, buttonName3)
                .input('buttonContent3', sql.NVarChar, buttonContent3)
                .input('btn4Type', sql.NVarChar, btn4Type)
                .input('buttonName4', sql.NVarChar, buttonName4)
                .input('buttonContent4', sql.NVarChar, buttonContent4)
                .input('cardOrderNo', sql.NVarChar, cardOrderNo)
                .query(insertQueryString2)

            res.send({status:200 , message:'insert Success', DLG_ID: rows1[0].DLG_ID, CARD_TEXT: dialogText});
        
        } catch (err) {
            console.log(err);
            res.send({status:500 , message:'insert Dialog Error'});
        } finally {
            sql.close();
        }
    })()
    
    sql.on('error', err => {
    })
    */
});

router.post('/learnUtterAjax', function (req, res) {
    var intent = req.body.intent;
    var entity = req.body.entity;
    var dlgId = req.body['dlgId[]'];

    var queryText = "INSERT INTO TBL_DLG_RELATION_LUIS(LUIS_ID,LUIS_INTENT,LUIS_ENTITIES,DLG_ID,DLG_API_DEFINE,USE_YN) "
                  + "VALUES( 'kona_luis_06', 'luis_test', @entity, @dlgId, 'D', 'Y' )";
    
    (async () => {
        try {
            let pool = await sql.connect(dbConfig);
            let result1;
            for(var i = 0 ; i < dlgId.length; i++) {
                result1 = await pool.request()
                    .input('entity', sql.NVarChar, entity)
                    .input('dlgId', sql.NVarChar, dlgId[i])
                    .query(queryText);
            }
            
            console.log(result1);

            let rows = result1.rowsAffected;

            if(rows[0] == 1) {
                res.send({result:true});
            } else {
                res.send({result:false});
            }
        
        } catch (err) {
            // ... error checks
            console.log(err);
        } finally {
            sql.close();
        }
    })()
    
    sql.on('error', err => {
        // ... error handler
    })
});


router.post('/deleteRecommend',function(req,res){
    var seqs = req.body.seq;
    var arryseq = seqs.split(',');
        (async () => {
        try{
                let pool = await sql.connect(dbConfig)
                for(var i = 0 ; i < arryseq.length; i ++)
                {
                   var deleteQueryString1 = "UPDATE TBL_QUERY_ANALYSIS_RESULT SET RESULT='T' WHERE seq='"+arryseq[i]+"'";
                   let result5 = await pool.request().query(deleteQueryString1); 
                }
                res.send();
            }catch(err){
            
            }finally {
                sql.close();
            } 
        })()
        
        sql.on('error', err => {
            console.log(err);
        })
});

router.post('/selectGroup',function(req,res){
    var selectId = req.body.selectId;
    var selectValue1 = req.body.selectValue1;
    var selectValue2 = req.body.selectValue2;
    (async () => {
    try{
            let pool = await sql.connect(dbConfig)
            var queryText = "";
            if(selectId == "searchLargeGroup") {
                queryText = "SELECT DISTINCT LARGE_GROUP AS 'GROUP' FROM TBL_DLG WHERE LARGE_GROUP IS NOT NULL";
            } else if(selectId == "searchMediumGroup") {
                selectValue1 = selectValue1.trim();
                queryText = "SELECT DISTINCT MEDIUM_GROUP AS 'GROUP'\n";
                queryText += "FROM TBL_DLG\n";
                queryText += "WHERE LARGE_GROUP IS NOT NULL\n";
                queryText += "AND LARGE_GROUP LIKE '%" + selectValue1 + "%'";
            } else if(selectId == "searchSmallGroup") {
                selectValue1 = selectValue1.trim();
                selectValue2 = selectValue2.trim();
                queryText = "SELECT DISTINCT SMALL_GROUP AS 'GROUP'\n";
                queryText += "FROM TBL_DLG\n";
                queryText += "WHERE LARGE_GROUP IS NOT NULL\n";
                queryText += "AND LARGE_GROUP LIKE '%" + selectValue1 + "%'\n";
                queryText += "AND MEDIUM_GROUP LIKE '%" + selectValue2 + "%'";
            }

            let result = await pool.request().query(queryText);
            var rows = result.recordset;

            res.send({rows:rows});
        }catch(err){
            console.log(err);
        }finally {
            sql.close();
        } 
    })()
    
    sql.on('error', err => {
        console.log(err);
    })
});

router.post('/searchDialog',function(req,res){
    var searchLargeGroup = req.body.searchLargeGroup;
    var searchMediumGroup = req.body.searchMediumGroup;
    var searchSmallGroup = req.body.searchSmallGroup;
    var serachDlg = req.body.serachDlg.trim();
    
    var relationText = "SELECT RNUM, LUIS_ENTITIES, A.DLG_ID DLG_ID, B.DLG_TYPE, DLG_ORDER_NO \n";
        relationText += "FROM (\n";
        relationText += "SELECT RANK() OVER(ORDER BY LUIS_ENTITIES) AS RNUM, LUIS_ENTITIES, DLG_ID \n";
        relationText += "FROM TBL_DLG_RELATION_LUIS \n";
        relationText += "WHERE 1=1\n";
        if(serachDlg) {

            relationText += "AND LUIS_ENTITIES like '%" + serachDlg + "%'\n";
        } else {
            
            if(searchLargeGroup != null) {
                relationText += "AND LUIS_ID = '" + searchLargeGroup + "'\n";
                if(searchMediumGroup != null) {
                    relationText += "AND LUIS_INTENT = '" + searchMediumGroup + "'\n";
                    if(searchSmallGroup != null) {
                        relationText += "AND LUIS_ENTITIES LIKE '%" + searchSmallGroup + "%'\n";
                    }
                }
            }
        }
        relationText += "GROUP BY LUIS_ENTITIES, DLG_ID \n";
        relationText += ") A LEFT OUTER JOIN TBL_DLG B\n";
        relationText += "ON A.DLG_ID = B.DLG_ID \n";
        relationText += "ORDER BY LUIS_ENTITIES, DLG_ORDER_NO";

    var dlgText = "SELECT DLG_ID, CARD_TITLE, CARD_TEXT, USE_YN, '2' AS DLG_TYPE \n"
        dlgText += "FROM TBL_DLG_TEXT\n";
        dlgText += "WHERE USE_YN = 'Y'\n"
        dlgText += "AND DLG_ID IN (\n"
        dlgText += "SELECT DISTINCT DLG_ID\n"
        dlgText += "FROM TBL_DLG_RELATION_LUIS\n"
        dlgText += "WHERE 1=1\n";

        if(serachDlg != '' || serachDlg != null) {
        
            dlgText += "AND LUIS_ENTITIES like '%" + serachDlg + "%'\n";
        } else {
            if(searchLargeGroup != null) {
                dlgText += "AND LUIS_ID = '" + searchLargeGroup + "'\n";
                if(searchMediumGroup != null) {
                    dlgText += "AND LUIS_INTENT = '" + searchMediumGroup + "'\n";
                    if(searchSmallGroup != null) {
                        dlgText += "AND LUIS_ENTITIES LIKE '%" + searchSmallGroup + "%'\n";
                    }
                }
            }   
        }
        dlgText += ") \n ORDER BY DLG_ID";

    var dlgCard = "SELECT DLG_ID, CARD_TEXT, CARD_TITLE, IMG_URL, BTN_1_TYPE, BTN_1_TITLE, BTN_1_CONTEXT,\n";
        dlgCard += "BTN_2_TYPE, BTN_2_TITLE, BTN_2_CONTEXT,\n";
        dlgCard += "BTN_3_TYPE, BTN_3_TITLE, BTN_3_CONTEXT,\n";
        dlgCard += "BTN_4_TYPE, BTN_4_TITLE, BTN_4_CONTEXT,\n";
        dlgCard += "CARD_ORDER_NO, CARD_VALUE,\n";
        dlgCard += "USE_YN, '3' AS DLG_TYPE \n";
        dlgCard += "FROM TBL_DLG_CARD\n";
        dlgCard += "WHERE USE_YN = 'Y'\n";
        dlgCard += "AND DLG_ID IN (\n";
        dlgCard += "SELECT DISTINCT DLG_ID\n";
        dlgCard += "FROM TBL_DLG_RELATION_LUIS\n";
        dlgCard += "WHERE 1=1\n";

        if(serachDlg != '' || serachDlg != null) {
        
            dlgCard += "AND LUIS_ENTITIES like '%" + serachDlg + "%'\n";
        } else {

            if(searchLargeGroup != null) {
                dlgCard += "AND LUIS_ID = '" + searchLargeGroup + "'\n";
                if(searchMediumGroup != null) {
                    dlgCard += "AND LUIS_INTENT = '" + searchMediumGroup + "'\n";
                    if(searchSmallGroup != null) {
                        dlgCard += "AND LUIS_ENTITIES LIKE '%" + searchSmallGroup + "%'\n";
                    }
                }
            }
        }
        dlgCard += ") \n ORDER BY DLG_ID";
    
    var dlgMedia = "SELECT DLG_ID, CARD_TEXT, CARD_TITLE, MEDIA_URL, BTN_1_TYPE, BTN_1_TITLE, BTN_1_CONTEXT,\n";
        dlgMedia += "BTN_2_TYPE, BTN_2_TITLE, BTN_2_CONTEXT,\n";
        dlgMedia += "BTN_3_TYPE, BTN_3_TITLE, BTN_3_CONTEXT,\n";
        dlgMedia += "BTN_4_TYPE, BTN_4_TITLE, BTN_4_CONTEXT,\n";
        dlgMedia += "CARD_VALUE,\n";
        dlgMedia += "USE_YN, '4' AS DLG_TYPE \n";
        dlgMedia += "FROM TBL_DLG_MEDIA\n";
        dlgMedia += "WHERE USE_YN = 'Y'\n";
        dlgMedia += "AND DLG_ID IN (\n";
        dlgMedia += "SELECT DISTINCT DLG_ID\n";
        dlgMedia += "FROM TBL_DLG_RELATION_LUIS\n";
        dlgMedia += "WHERE 1=1\n";

        if(serachDlg != '' || serachDlg != null) {
        
            dlgMedia += "AND LUIS_ENTITIES like '%" + serachDlg + "%'\n";
        } else {

            if(searchLargeGroup != null) {
                dlgMedia += "AND LUIS_ID = '" + searchLargeGroup + "'\n";
                if(searchMediumGroup != null) {
                    dlgMedia += "AND LUIS_INTENT = '" + searchMediumGroup + "'\n";
                    if(searchSmallGroup != null) {
                        dlgMedia += "AND LUIS_ENTITIES LIKE '%" + searchSmallGroup + "%'\n";
                    }
                }
            }
        }
        dlgMedia += ") \n ORDER BY DLG_ID";

    (async () => {
        try{
            let pool = await sql.connect(dbConfig)

            let dlgTextResult = await pool.request()
                .query(dlgText);
            let rowsText = dlgTextResult.recordset;

            let dlgCardResult = await pool.request()
                .query(dlgCard);
            let rowsCard = dlgCardResult.recordset;

            let dlgMediaResult = await pool.request()
                .query(dlgMedia);
            let rowsMedia = dlgMediaResult.recordset;
            
            let result1 = await pool.request()
                .query(relationText)
            let rows = result1.recordset;
            var result = [];
            for(var i = 0; i < rows.length; i++){
                var row = {};
                row.RNUM = rows[i].RNUM;
                row.LUIS_ENTITIES = rows[i].LUIS_ENTITIES;
                row.DLG_ID = rows[i].DLG_ID;
                row.DLG_TYPE = rows[i].DLG_TYPE;
                row.DLG_ORDER_NO = rows[i].DLG_ORDER_NO;
                row.dlg = [];
                
                let dlg_type = rows[i].DLG_TYPE;
                if(dlg_type == 2){
                    for(var j = 0; j < rowsText.length; j++){
                        let textDlgId = rowsText[j].DLG_ID;
                        if(row.DLG_ID == textDlgId){
                            row.dlg.push(rowsText[j]);
                        }
                    }
                }else if(dlg_type == 3){
                    for(var j = 0; j < rowsCard.length; j++){
                        var cardDlgId = rowsCard[j].DLG_ID;
                        if(row.DLG_ID == cardDlgId){
                            row.dlg.push(rowsCard[j]);
                        }
                    }
                }else if(dlg_type == 4){
                    for(var j = 0; j < rowsMedia.length; j++){
                        var mediaDlgId = rowsMedia[j].DLG_ID;
                        if(row.DLG_ID == mediaDlgId){
                            row.dlg.push(rowsMedia[j]);
                        }
                    }
                }
                result.push(row);
            }

            res.send({list : result});
        
        }catch(err){
            console.log(err);
        }finally {
            sql.close();
        }
    })()
    
    sql.on('error', err => {
        sql.close();
        console.log(err);
    })

});


router.post('/addDialog',function(req,res){
    var entity = req.body['entity'];
    var data = req.body['data[]'];
    var array = [];
    var queryText = "";

    if( typeof data == "string"){
        console.log("data is string");
        var json = JSON.parse(data);

        for( var key in json) {
            console.log("key : " + key + " value : " + json[key]);
        }
    
    } else {
        console.log("data is object");

        var dataIdx = data.length;

        for(var i = 0; i < dataIdx; i++) {
            array[i] = JSON.parse(data[i]);
        }

        for(var i = 0; i < array.length; i++) {
            for( var key in array[i]) {
                console.log("key : " + key + " value : " + array[i][key]);
            }
        }
    }

    (async () => {
        try{
            let pool = await sql.connect(dbConfig);
            var selectDlgId = 'SELECT ISNULL(MAX(DLG_ID)+1,1) AS DLG_ID FROM TBL_DLG';
            var selectTextDlgId = 'SELECT ISNULL(MAX(TEXT_DLG_ID)+1,1) AS TYPE_DLG_ID FROM TBL_DLG_TEXT';
            var selectMediaDlgId = 'SELECT ISNULL(MAX(MEDIA_DLG_ID)+1,1) AS TYPE_DLG_ID FROM TBL_DLG_MEDIA';
            var insertTblDlg = 'INSERT INTO TBL_DLG(DLG_ID,DLG_NAME,DLG_DESCRIPTION,DLG_LANG,DLG_TYPE,DLG_ORDER_NO,USE_YN) VALUES ' +
            '(@dlgId,@dialogText,@dialogText,\'KO\',@dlgType,@dialogOrderNo,\'Y\')';
            var inserTblDlgText = 'INSERT INTO TBL_DLG_TEXT(TEXT_DLG_ID,DLG_ID,CARD_TITLE,CARD_TEXT,USE_YN) VALUES ' +
            '(@textDlgId,@dlgId,@dialogTitle,@dialogText,\'Y\')';
            var insertTblDlgMedia = 'INSERT INTO TBL_DLG_MEDIA(MEDIA_DLG_ID,DLG_ID,CARD_TITLE,CARD_TEXT,MEDIA_URL,BTN_1_TYPE,BTN_1_TITLE,BTN_1_CONTEXT,BTN_2_TYPE,BTN_2_TITLE,BTN_2_CONTEXT,BTN_3_TYPE,BTN_3_TITLE,BTN_3_CONTEXT,BTN_4_TYPE,BTN_4_TITLE,BTN_4_CONTEXT,CARD_VALUE,USE_YN) VALUES ' +
            '(@mediaDlgId,@dlgId,@dialogTitle,@dialogText,@imgUrl,@btn1Type,@buttonName1,@buttonContent1,@btn2Type,@buttonName2,@buttonContent2,@btn3Type,@buttonName3,@buttonContent3,@btn4Type,@buttonName4,@buttonContent4,@cardValue,\'Y\')';
            var insertTblRelation = "INSERT INTO TBL_DLG_RELATION_LUIS(LUIS_ID,LUIS_INTENT,LUIS_ENTITIES,DLG_ID,DLG_API_DEFINE,USE_YN) " + 
            "VALUES( 'kona_luis_06', 'luis_test', @entity, @dlgId, 'D', 'Y' )";

            var largeGroup = array[array.length - 1]["largeGroup"];
            var mediumGroup = array[array.length - 1]["mediumGroup"];
            var smallGroup = array[array.length - 1]["smallGroup"];
            var sourceType = array[array.length - 1]["sourceType"];
            var description = array[array.length - 1]["description"];


            for(var i = 0; i < (array.length-1); i++) {
                if(array[i]["dlgType"] == "2") {
                    let result1 = await pool.request()
                    .query(selectDlgId)
                    let dlgId = result1.recordset;

                    let result2 = await pool.request()
                    .input('dlgId', sql.Int, dlgId[0].DLG_ID)
                    .input('dialogText', sql.NVarChar, description)
                    .input('dlgType', sql.NVarChar, array[i]["dlgType"])
                    .input('dialogOrderNo', sql.Int, (i+1))
                    .query(insertTblDlg)

                    let result3 = await pool.request()
                    .query(selectTextDlgId)
                    let textDlgId = result3.recordset;

                    let result4 = await pool.request()
                    .input('textDlgId', sql.Int, textDlgId[0].TYPE_DLG_ID)
                    .input('dlgId', sql.Int, dlgId[0].DLG_ID)
                    .input('dialogTitle', sql.NVarChar, array[i]["dialogTitle"])
                    .input('dialogText', sql.NVarChar, array[i]["dialogText"])
                    .query(inserTblDlgText)

                    let result5 = await pool.request()
                    .input('entity', sql.NVarChar, entity)
                    .input('dlgId', sql.Int, dlgId[0].DLG_ID)
                    .query(insertTblRelation)
                } else if(array[i]["dlgType"] == "3") {

                } else if(array[i]["dlgType"] == "4") {
                    let result1 = await pool.request()
                    .query(selectDlgId)
                    let dlgId = result1.recordset;

                    let result2 = await pool.request()
                    .input('dlgId', sql.Int, dlgId[0].DLG_ID)
                    .input('dialogText', sql.NVarChar, description)
                    .input('dlgType', sql.NVarChar, array[i]["dlgType"])
                    .input('dialogOrderNo', sql.Int, (i+1))
                    .query(insertTblDlg)

                    let result3 = await pool.request()
                    .query(selectMediaDlgId)
                    let mediaDlgId = result3.recordset;

                    let result4 = await pool.request()
                    .input('mediaDlgId', sql.Int, mediaDlgId[0].TYPE_DLG_ID)
                    .input('dlgId', sql.Int, dlgId[0].DLG_ID)
                    .input('dialogTitle', sql.NVarChar, array[i]["dialogTitle"])
                    .input('dialogText', sql.NVarChar, array[i]["dialogText"])
                    .input('imgUrl', sql.NVarChar, array[i]["imgUrl"])
                    .input('btn1Type', sql.NVarChar, array[i]["btn1Type"])
                    .input('buttonName1', sql.NVarChar, array[i]["mButtonName1"])
                    .input('buttonContent1', sql.NVarChar, array[i]["mButtonContent1"])
                    .input('btn2Type', sql.NVarChar, array[i]["dialogTitle"])
                    .input('buttonName2', sql.NVarChar, array[i]["mButtonName2"])
                    .input('buttonContent2', sql.NVarChar, array[i]["mButtonContent2"])
                    .input('btn3Type', sql.NVarChar, array[i]["dialogTitle"])
                    .input('buttonName3', sql.NVarChar, array[i]["mButtonName3"])
                    .input('buttonContent3', sql.NVarChar, array[i]["mButtonContent3"])
                    .input('btn4Type', sql.NVarChar, array[i]["dialogTitle"])
                    .input('buttonName4', sql.NVarChar, array[i]["mButtonName4"])
                    .input('buttonContent4', sql.NVarChar, array[i]["mButtonContent4"])
                    .input('cardValue', sql.NVarChar, array[i]["mediaUrl"])
                    .query(insertTblDlgMedia)

                    let result5 = await pool.request()
                    .input('entity', sql.NVarChar, entity)
                    .input('dlgId', sql.Int, dlgId[0].DLG_ID)
                    .query(insertTblRelation)
                }
            }

            res.send({list : result});
        
        }catch(err){
            console.log(err);
        }finally {
            sql.close();
        }
    })()
    
    sql.on('error', err => {
        sql.close();
        console.log(err);
    })

});

module.exports = router;
