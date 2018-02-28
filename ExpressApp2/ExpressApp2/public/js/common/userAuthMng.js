
//가장 먼저 실행.
var language;
;(function($) {
    $.ajax({
        url: '/jsLang',
        dataType: 'json',
        type: 'POST',
        success: function(data) {
            language= data.lang;
            
            makeUserGrid(); 
            makeAppGrid();
            gridResize("gridList");
            gridResize("gridUserAuthList");
        }
    });
})(jQuery);

$(document).ready(function() {
    $('#searchUserId').focus();
});

window.onresize = function() {
    gridResize("gridList");
    gridResize("gridUserAuthList");
}

$(document).ready(function() {
    $('#searchEmpNm, #searchUserId').on('keypress', function(e) {
        if (e.keyCode == 13) doSearchParam();
    });

    $('#btn_Inq_search').on('click', function() {
        doSearchParam();
    });
    
});
var beforVal = '';
$(document).on('keypress','.edit-cell > input',function(e){
    if (e.keyCode == 13 || e.keyCode == 27) {
        if ( $(this).val() !== beforVal) {
            $("#gridList").jqGrid('setCell', $(this).parent().parent().attr('id'), 'statusFlag', "EDIT");
        }
    }
});

var editableCells = ['EMP_NM'];
function makeUserGrid() {
    $("#gridList").jqGrid({
        //url: '../json/data.json',
        //datatype: "json",
        //mtype: 'POST',  
        //editurl: 'clientArray',
        datatype: function(postdata) {
            doSearchParam(postdata);
        },
          
        colModel: [
          {name:'USER_ID_HIDDEN' , label:'USER_ID_HIDDEN' , hidden:true},
          {name:'USER_ID'    , label:language['ID'], width:70, editable:false, align:'left', sortable:true, hidden:false},
          {name:'EMP_NM'    , label:language['NAME'] , width:80, editable:false, align:'left', sortable:true, hidden:false},
          {name:'EMAIL'    , label:language['EMAIL'] , width:120, editable:false, align:'left', sortable:true, hidden:false}
        ],
        width: $("#gridList").width(),
        height: 650,
        pager: '#pager',
        emptyrecords: language['NO_DATA'],
        rowNum: 20, // 한페이지에 보여줄 데이터 수
        rowList: [ 20, 30], // 페이징 옵션
        rownumbers: true, // show row numbers
        rownumWidth: 25, // the width of the row numbers columns
        cellEdit: true, // true 시 틀고정 ( frozen column 기능 불가 )
        //cellsubmit:'remote',
        //onSelectRow: selRow,
        sortorder: 'asc',
        //caption:"gridList",
        loadonce:false, // true 하면 리로딩이 안됨 false
        viewrecords: true, 
        onSelectRow: function(rowid, status, e) {  			
            console.log("asdf : " + rowid + "/" + status + "e :" + e);	
            doSearchApp(rowid);
        }	
        
        });
}

function makeAppGrid() {
    $("#gridUserAuthList").jqGrid({
        //url: '../json/data.json',
        //datatype: "json",
        //mtype: 'POST',  
        //editurl: 'clientArray',
        datatype: function() {
            //doSearchApp(rowid);
        },
          
        colModel: [
          {name:'sel', label:'' , width:20, editable:false, align:'center', sortable:false, hidden:false, formatter:selCell},
          {name:'APP_NAME'    , label:language['APP'], width:70, editable:false, align:'left', sortable:true, hidden:false},
          {name:'APP_ID'    , label:language['APP_ID'], width:150, editable:false, align:'left', sortable:true, hidden:false},
          {name:'OWNER_EMAIL'    , label:language['OWNER'], width:60, editable:false, align:'right', sortable:true, hidden:false}
        ],
        width: $("#gridUserAuthList").width(),
        height: 650,
        pager: '#pagerAuth',
        emptyrecords: language['NO_DATA'],
        rowNum: 20, // 한페이지에 보여줄 데이터 수
        rowList: [ 20, 30], // 페이징 옵션
        rownumbers: true, // show row numbers
        rownumWidth: 25, // the width of the row numbers columns
        cellEdit: true, // true 시 틀고정 ( frozen column 기능 불가 )
        //cellsubmit:'remote',
        //onSelectRow: selRow,
        sortorder: 'asc',
        //caption:"gridList",
        loadonce:false, // true 하면 리로딩이 안됨 false
        viewrecords: true,
        
        });
}

function selCell(cellValue, options, rowObject, action) {
    var empNum = rowObject.empNum;
    var userId = rowObject.userId;
    return '<input type="checkbox" name="cell_checkbox" />';
}

//ㅇㅇㅇㅇㅇㅇㅇㅇㅇ
//그리드 리사이즈
var maxGridWidth = ""; // popup 사용 불가, contents가 그려지는 div 크기
var minGridWidth = 0; // 최소 그리드 사이즈
var preWindowWidth = 0; // 이전 창 크기
var shrinkFlag = true; // true : 사이즈조정, false : 사이즈고정, 스크롤 생성

function gridResize(gridId) {

    maxGridWidth = $(".grid_wrap").width() - 2; // popup 사용 불가, contents가 그려지는 div 크기
    minGridWidth = $('#' + gridId).width();
    setGridResize(gridId);
}

function setGridResize(gridId) {

    var windowWidth = $(window).width(); // 창크기
    var newGridWidth = windowWidth - 2; // 그리드의 새로운 width

    // 그리드에 적용할 width가 최대크기보다 작고 and 그리드에 적용할 width가 최소 크기보다 크고
    if (maxGridWidth > newGridWidth && minGridWidth < newGridWidth) {
        $('#' + gridId).setGridWidth(newGridWidth, shrinkFlag);
    }

    // 그리드가 최대크기보다 크거나 같을 경우
    if (maxGridWidth <= newGridWidth) {
        $('#' + gridId).setGridWidth(maxGridWidth, shrinkFlag); // 기본 사이즈로 초기화
    }

    // 그리드가 최소크기보다 작거나 같을 경우
    if (minGridWidth >= newGridWidth) {
        $('#' + gridId).setGridWidth(minGridWidth, shrinkFlag); // 최소 사이즈로 초기화
    }
    $('#' + gridId).jqGrid('setGridHeight',$(window).innerHeight() -400);
    preWindowWidth = windowWidth; // 현재 사이즈를 저장
}

//초기화
function restoreGridAction() {
    if(confirm(language['ASK_INIT'])) {
        mkAppRow(initAppList, initAppCheck);
    }
}


//조회
//그리드 초기화 할 때 사용할 grid data
var saveGridData;
function doSearchParam(postData) {
    var sort = postData? postData.sidx : "";
    var order = postData? postData.sord : "";
    var params = {
        'sort' : sort,
        'order' : order,
        'page' : $('td[dir=ltr]').find('input').val(),
        'rows' : $('td[dir=ltr]').find('select').val()
    };
    
    $.tiAjax({
        type: 'POST',
        applyId:"frm",
        data: params,
        isloading: true,
        url: '/users/selectUserList',
        success: function(data) {
            saveGridData = data;
            var grid = $("#gridList");
            //var gridData = JSON.parse(data.d);
            grid.clearGridData();

            for (var i=0;i<=data.rows.length;i++) { 
                //$("#gridList").jqGrid('addRowData', i+1, data.rows[i]);
                grid.addRowData(i + 1, data.rows[i]);
            }
            $('#gridList').find('tr').eq(1).children().eq(0).trigger('click');

        }
    });
}

//app 조회
var initAppList;
var initAppCheck; // 초기화 할 변수, 저장시 비교
function doSearchApp( rowid) {
    var id = $('#gridList').jqGrid().getRowData(rowid).USER_ID;
    var params = {
        'userId' : id
    };
    
    $.tiAjax({
        type: 'POST',
        data: params,
        isloading: true,
        url: '/users/selectUserAppList',
        success: function(data) {
            initAppList = data.rows;
            initAppCheck = data.checkedApp;
            mkAppRow(data.rows, data.checkedApp);
        }
    });
}

function mkAppRow(rows, checkedApp) {
    var grid = $("#gridUserAuthList");
    //var gridData = JSON.parse(data.d);
    grid.clearGridData();

    for (var i=0;i<rows.length;i++) { 
        //$("#gridList").jqGrid('addRowData', i+1, data.rows[i]);
        grid.addRowData(i + 1, rows[i]);

        for (var j=0; j<checkedApp.length; j++) {
            if (rows[i].APP_ID === checkedApp[j].APP_ID) {
                $('input[name=cell_checkbox]').eq(i).trigger('click');
            }
        }
    }
    if (rows.length >0) {
        $("#gridUserAuthList").setSelection(1);
    }
}
//저장
function saveAction() {
    // true : select 된 데이터, false : transaction 일으킨 데이터
    var saveArr = new Array();

    
    $('input[name=cell_checkbox]:checked').each(function() {
        
        var appId = $("#gridUserAuthList").jqGrid("getRowData", rowId).APP_ID;
        //추가로 체크한 app, 체크 취소한 app 구분
        var rememberLen = initAppCheck.length;
        for (var i=0; i<rememberLen; i++) {
            if (appId === initAppCheck[i].APP_ID) {
                initAppCheck.splice(i,1);
                break;
            }
        }
        if (rememberLen === initAppCheck.length) {
            saveArr.push(appId);
        }
    });    
    var rowUser  = $("#gridList").jqGrid("getGridParam", "selrow" );			
	var userId = $("#gridList").jqGrid("getRowData", rowUser).USER_ID;

    //save
    var jsonsaveArr = JSON.stringify(saveArr);
    var jsoninitAppCheck = JSON.stringify(initAppCheck);
    var params = {
        'userId' : userId,
        'saveData' : jsonsaveArr,
        'removeData' : jsoninitAppCheck,
    };
    $.tiAjax({
        type: 'POST',
        datatype: "JSON",
        data: params,
        isloading: true,
        url: '/users/updateUserAppList',
        success: function(data) {
            console.log(data);
            if (data.status === 200) {
                //window.location.reload();
                alert(data.message);
                $('#gridList').find('tr').eq(rowUser).children().eq(0).trigger('click');
            } else {
                alert(data.message);
            }
        }
    });
    
    
}