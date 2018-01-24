

$(document).ready(function() {


    makGrid(); 
    
    
 /*
    $('#searchEmpNm,#searchUserId').on('keypress', function(e) {
        if (e.keyCode == 13) doSearchParam();
    });
*/
    $('#searchUserId').focus();

    //jqgrid resize
    gridResize("gridList");

});

window.onresize = function() {
    gridResize("gridList");
}

$(document).ready(function() {
    /*
    $('#searchGrpDiv').on('change', function(e) {
        doSearchParam();
    });
    */
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
function makGrid() {
    $("#gridList").jqGrid({
        //url: '../json/data.json',
        //datatype: "json",
        //mtype: 'POST',  
        //editurl: 'clientArray',
        datatype: function(postdata) {
            doSearchParam(postdata);
        },
          
        
        colModel: [
          {name:'sel', label:'' , width:30, editable:false, align:'center', sortable:false, hidden:false, formatter:selCell},
          {name:'statusFlag', label:'상태', width:40, align:'center', sortable:false},
          {name:'USER_ID_HIDDEN' , label:'USER_ID_HIDDEN' , hidden:true},
          {name:'USER_ID'    , label:'ID'            , width:80, editable:false, align:'left', sortable:true, hidden:false},
          {name:'초기화'     , label:'비밀번호' , width:70, editable:false, align:'center', sortable:false, hidden:false, formatter:linkInitPwd},
          {name:'EMP_NM'    , label:'NAME'            , width:90, editable:false, align:'left', sortable:true, hidden:false},
          {name:'REG_DT'    , label:'REG_DT'            , width:100, editable:false, align:'left', sortable:true, hidden:false},
          {name:'REG_ID'    , label:'REG_ID'            , width:100, editable:false, align:'left', sortable:true, hidden:false},
          {name:'MOD_DT'    , label:'MOD_DT'            , width:100, editable:false, align:'left', sortable:false, hidden:false},
          {name:'MOD_ID'    , label:'MOD_ID'            , width:100, editable:false, align:'left', sortable:false, hidden:false},
          {name:'LAST_LOGIN_DT'    , label:'LAST_LOGIN_DT'            , width:100, editable:false, align:'left', sortable:false, hidden:false},
          {name:'LOGIN_FAIL_DT'    , label:'LOGIN_FAIL_DT'            , width:100, editable:false, align:'left', sortable:false, hidden:false},
          {name:'SCRT_NUM'   , label:'비밀번호'      , width:100, editable:false, align:'left', sortable:true, hidden:true}
        ],
        width: $("#gridList").width(),
        height: 650,
        pager: '#pager',
        emptyrecords: "데이터가 없습니다.",
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
        ondblClickRow : function (rowid, iRow, iCol) { 
            var colModels = $(this).getGridParam('colModel'); 
            var colName = colModels[iCol].name; 

            var statusVal = $('#gridList').jqGrid().getRowData(rowid).statusFlag;
            if (editableCells.indexOf(colName) >= 0 || (statusVal ==='NEW' && colName === 'USER_ID') ) { 
                beforVal = $(this).getCell(iRow, iCol);
                $(this).setColProp(colName, { editable: true }); 
                $(this).editCell(iRow, iCol, true); 
            } 
        },/*
        editCellValid: function(rowid, cellname) {
            if (cellname == "USER_ID" && $("#gridList").jqGrid('getCell', rowid, "USER_ID_HIDDEN") != "") {
                return false;
            }
            return true;
        },*/
        afterEditCell: function (rowid, cellname, value, iRow, iCol) { 
            //$(this).setColProp(cellname, { editable: false }); 
        },

        beforeSubmitCell : function(rowid, cellName, cellValue) {   // submit 전
          //console.log(  "@@@@@@ rowid = " +rowid + " , cellName = " + cellName + " , cellValue = " + cellValue );
          if ( $(this).val() !== beforVal) {
              var statusVal = $('#gridList').jqGrid().getRowData(rowid).statusFlag;
              if (statusVal === 'NEW' || statusVal === 'DEL') {

              } else {

                $("#gridList").jqGrid('setCell', rowid, 'statusFlag', "EDIT");
                //var len = $('input[name=cell_checkbox]:checked').length;
                $('input[name=cell_checkbox]').eq(rowid-1).trigger('click');
                
              }
          }
          //return {"id":rowid, "cellName":cellName, "cellValue": cellValue}
        },
  
        
        });
}

function linkInitPwd(cellValue, options, rowObject, action) {
    var userId = rowObject.USER_ID_HIDDEN;
    return '<a href="javascript://" class="sbtn" onclick="initPassword(\''+ userId +'\');">초기화</a>';
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
    if(confirm('초기화 하시곘습니까?')) {
        var grid = $("#gridList");
        //var gridData = JSON.parse(data.d);
        grid.clearGridData();

        for (var i=0;i<=saveGridData.rows.length;i++) { 
            //$("#gridList").jqGrid('addRowData', i+1, data.rows[i]);
            grid.addRowData(i + 1, saveGridData.rows[i]);
        }
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
            
        }
    });
    
}

//추가 
//var editableCells = ['USER_ID', 'EMP_NM'];
function insertAction() {
    if ($('#gridList').find("#addRow").length !== 0) {
        alert("추가중인 사용자가 있습니다.");
    } else {
        var grid = $('#gridList');
        grid.jqGrid('addRowData', "addRow", {  statusFlag : "NEW"}, "first");
        $('input[name=cell_checkbox]').eq(0).trigger('click');

        $("#gridList").jqGrid("resetSelection");
        $('#gridList').setSelection("addRow", true);
        
        $('#gridList').setColProp("USER_ID", { editable: true }); 
        //$('#gridList').setColProp("EMP_NM", { editable: true }); 
        $('#gridList').editCell(1, 4, true); 
        //$('#gridList').editCell(1, 6, true);
    }
    
    //{  statusFlag : "NEW",  position : "first"}
    //$('#gridList').addRowData("addRow", {  statusFlag : "NEW"}, "first");
    //$('#gridList').find("#addRow_").eq(0).trigger("click");
    //$('#gridList').setSelection("addRow", true);
}

//저장
function saveAction() {
    // true : select 된 데이터, false : transaction 일으킨 데이터
    var checkedLen = $('input[name=cell_checkbox]:checked').length;
    if (checkedLen > 0) {
        var saveArr = new Array();
        $('input[name=cell_checkbox]:checked').each(function() {
            var rowId = $(this).parent().parent().attr("id");
            //$('#gridList').jqGrid().getRowData(rowId);
            var data = new Object() ;

            data.statusFlag = $('#gridList').jqGrid().getRowData(rowId).statusFlag;
            data.USER_ID = $('#gridList').jqGrid().getRowData(rowId).USER_ID;
            data.EMP_NM = $('#gridList').jqGrid().getRowData(rowId).EMP_NM;
            saveArr.push(data);
            //변경된 전체 row값
            //saveArr2.push($('#gridList').jqGrid().getChangedCells());
        });    

        //save
        var jsonData = JSON.stringify(saveArr);
        var params = {
            'saveArr' : jsonData
        };
        $.tiAjax({
            type: 'POST',
            datatype: "JSON",
            data: params,
            isloading: true,
            url: '/users/saveUserInfo',
            success: function(data) {
                console.log(data);
                if (data.status === 200) {
                    window.location.reload();
                } else {
                    alert(data.message);
                }
            }
        });
    } else {
        alert('변경된 데이터가 없습니다.');
        return;
    }
    




/*


    var selarrw = $('#gridList').getArrayFromGridRow(false);
    if (selarrw.length == 0) {
        alert('변경된 데이터가 없습니다.');
        return;
    }

    var dataIDs = $('#gridList').getDataIDs();
    for (var i = 0, len = dataIDs.length; i < len; i++) {

        var rowId = dataIDs[i];
        var row = $('#gridList').jqGrid ('getRowData', rowId);
        // 등록/수정만 Validation
        if (row.statusFlag != "D" && row.delYn != "N") {

            // ID
            if (row.userId == null || row.userId == "") {
                alert('ID를 입력 해주세요.');
                var rowIndex = $("#" + rowId)[0].rowIndex;
                $('#gridList').setSelectionGrid(rowIndex, 6, false);
                return false;
            }
            if (row.userId.indexOf(" ") > 0) {
                alert('ID는 공백을 입력할 수 없습니다.');
                var rowIndex = $("#" + rowId)[0].rowIndex;
                $('#gridList').setSelectionGrid(rowIndex, 6, false);
                return false;
            }
            // State : NEW 에 해당 되는 것만 id 체크 
            if (rowId.indexOf("new") != -1) {
                if (isEmail(row.userId) == false) {
                    alert('ID는 Email형식으로 입력 해주세요.');
                    var rowIndex = $("#" + rowId)[0].rowIndex;
                    $('#gridList').setSelectionGrid(rowIndex, 6, false);
                    return false;
                }
            }
            if (row.userId.length > 100) {
                var rowIndex = $("#" + rowId)[0].rowIndex;
                $('#gridList').setSelectionGrid(rowIndex, 6, false);
                return false;
            }
            if (row.userIdHidden != "" && row.userIdHidden != null && row.userId != row.userIdHidden) {
                alert('현재 사용중인 ID는 변경 할 수 없습니다.');
                return false;
            }

            // 사원명
            if (row.empNm == null || row.empNm == "") {
                alert('사용자명을 입력 해주세요.');
                var rowIndex = $("#" + rowId)[0].rowIndex;
                $('#gridList').setSelectionGrid(rowIndex, 8, false);
                return false;
            }
            if (row.empNm.indexOf(" ") > 0) {
                alert('사용자명은 공백은 입력할 수 없습니다.');
                var rowIndex = $("#" + rowId)[0].rowIndex;
                $('#gridList').setSelectionGrid(rowIndex, 8, false);
                return false;
            }
            if (rowId.indexOf("new") != -1) {
                if (isHanEngSpace(row.empNm) == false) {
                    alert('사용자명은 한글과 영어형식으로 입력 해주세요.');
                    var rowIndex = $("#" + rowId)[0].rowIndex;
                    $('#gridList').setSelectionGrid(rowIndex, 8, false);
                    return false;
                }
            }

            // 사원 영문명
            if (row.empEngnm == null || row.empEngnm == "") {
                alert('사용자영문명을 입력 해주세요.');
                var rowIndex = $("#" + rowId)[0].rowIndex;
                $('#gridList').setSelectionGrid(rowIndex, 9, false);
                return false;
            }
            if (row.empEngnm.indexOf(" ") > 0) {
                alert('사용자영문명은 공백은 입력할 수 없습니다.');
                var rowIndex = $("#" + rowId)[0].rowIndex;
                $('#gridList').setSelectionGrid(rowIndex, 9, false);
                return false;
            }
            if (rowId.indexOf("new") != -1) {
                if (isEngSpace(row.empEngnm) == false) {
                    alert('사용자영문명은 영어형식으로 입력 해주세요.');
                    var rowIndex = $("#" + rowId)[0].rowIndex;
                    $('#gridList').setSelectionGrid(rowIndex, 9, false);
                    return false;
                }
            }

            // 이메일
            if (row.email == null || row.email == "") {
                alert('이메일을 입력 해주세요.');
                var rowIndex = $("#" + rowId)[0].rowIndex;
                $('#gridList').setSelectionGrid(rowIndex, 10, false);
                return false;
            }
            if (row.email.indexOf(" ") > 0) {
                alert('이메일은 공백은 입력할 수 없습니다.');
                var rowIndex = $("#" + rowId)[0].rowIndex;
                $('#gridList').setSelectionGrid(rowIndex, 10, false);
                return false;
            }
            if (isEmail(row.email) == false) {
                alert('이메일은 Email형식으로 입력 해주세요.');
                var rowIndex = $("#" + rowId)[0].rowIndex;
                $('#gridList').setSelectionGrid(rowIndex, 10, false);
                return false;
            }
        }
    }

    if (confirm('저장하시겠습니까?')) {
        var gridIds = {
            "gridList" : "dsGridList"
        };
        
        $.tiAjax({
            applyId: "frm",
            category: "grid",
            gridId: gridIds,
            gridSelect : false,   // true : select 된 데이터, false : transaction 일으킨 데이터
            url: '/admin/saveUserList.do',
            success: function(data) {
                doSearchParam();
            }
        });
        
    }
    */
}

// 비밀번호 초기화 
function initPassword(userId) {
    if (confirm('비밀번호를 초기화 하시겠습니까?')) {
        var params = {
            paramUserId: userId
        }
        
        $.tiAjax({
            data: params,
            url: '/users/inItPassword',
            success: function(data) {
                alert(data.message);
            }
        });
        
    }
}

// 선택된 rows delete
function deleteAction() {
    //var selRow = $('#gridList').jqGrid('getGridParam', 'selrow');
    

    if ($('input[name=cell_checkbox]:checked').length > 0) {
        if ( confirm('삭제하시겠습니까?')) {
            $('input[name=cell_checkbox]:checked').each(function() {
                //$(this).parent().parent().removeNode();
                //$('#gridList').jqGrid('delRowData', $(this).parent().parent().attr("id"));
                if ( $(this).val() !== beforVal) {
                    $("#gridList").jqGrid('setCell', $(this).parent().parent().attr("id"), 'statusFlag', "DEL");
                }
            });
        }
    } else {
        alert('선택된 행이 없습니다.');
    }
}
