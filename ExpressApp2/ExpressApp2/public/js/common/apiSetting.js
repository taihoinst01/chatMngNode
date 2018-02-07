
//가장 먼저 실행.
var language;
;(function($) {
    $.ajax({
        url: '/jsLang',
        dataType: 'json',
        type: 'POST',
        success: function(data) {
            language= data.lang;
            
            makGrid(); 
            gridResize("gridList");
        }
    });
})(jQuery);
$(document).ready(function() {
    $('#searchApiId').focus();
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
    $('#searchApiId').on('keypress', function(e) {
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

var editableCells = ['API_ID', 'API_URL', 'API_DESC'];
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
          {name:'statusFlag', label:language['STATUS'], width:40, align:'center', sortable:false},
          {name:'API_ID_HIDDEN' , label:language['APP_ID'], hidden:true},
          {name:'API_ID'    , label:language['APP_ID'], width:80, editable:false, align:'left', sortable:true, hidden:false},
          {name:'API_URL'    , label:language['URL'], width:90, editable:false, align:'left', sortable:true, hidden:false},
          {name:'API_DESC'    , label:language['DESC'], width:200, editable:false, align:'left', sortable:true, hidden:false}
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
        ondblClickRow : function (rowid, iRow, iCol) { 
            var colModels = $(this).getGridParam('colModel'); 
            var colName = colModels[iCol].name; 

            var statusVal = $('#gridList').jqGrid().getRowData(rowid).statusFlag;
            if (editableCells.indexOf(colName) >= 0 || (statusVal ==='NEW' && colName === 'API_ID') ) { 
                beforVal = $(this).getCell(iRow, iCol);
                $(this).setColProp(colName, { editable: true }); 
                $(this).editCell(iRow, iCol, true); 
            } 
        },
        afterEditCell: function (rowid, cellname, value, iRow, iCol) { 
            $('.edit-cell > input').blur(function(){
                $("#gridList").jqGrid("saveCell",iRow,iCol);
            });
            
            $('tbody').find('tr').each(function () {
                if ($(this).hasClass('ui-state-highlight')) {
                    $(this).removeClass('ui-state-highlight')
                }
            });
            $('tbody').find('#' + rowid).children().eq(iCol).removeClass('ui-state-highlight');
            $('tbody').find('#' + rowid).addClass('ui-state-highlight');
            //$('tbody').find('#' + rowid).trigger('click');
        },

        beforeSubmitCell : function(rowid, cellName, cellValue, iRow, iCol) {   // submit 전
          //console.log(  "@@@@@@ rowid = " +rowid + " , cellName = " + cellName + " , cellValue = " + cellValue );
          if ( $(this).val() !== beforVal) {
              var statusVal = $('#gridList').jqGrid().getRowData(rowid).statusFlag;
              if (statusVal === 'NEW' || statusVal === 'DEL') {

              } else {

                $("#gridList").jqGrid('setCell', rowid, 'statusFlag', "EDIT");
                //var len = $('input[name=cell_checkbox]:checked').length;
                var checkRow = ($('#gridList').jqGrid().getRowData('addRow').statusFlag === 'NEW' ? rowid : rowid-1);
                $('input[name=cell_checkbox]').eq(checkRow).trigger('click');
                
              }
          }
          $('tbody').find('#' + rowid).children().eq(iCol).removeClass('ui-state-highlight');
          //return {"id":rowid, "cellName":cellName, "cellValue": cellValue}
        },
  
        
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
        url: '/users/selectApiList',
        success: function(data) {
            saveGridData = data;
            var grid = $("#gridList");
            //var gridData = JSON.parse(data.d);
            grid.clearGridData();

            for (var i=0;i<=data.records;i++) { 
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
        alert(language['ADDED_USER_EXISTS']);
    } else if ($('#gridList').find('input[type=text]').length >0) {
        alert(language['MODIFIED_USER_EXISTS']);
    }else {
        var grid = $('#gridList');
        grid.jqGrid('addRowData', "addRow", {  statusFlag : "NEW"}, "first");
        $('input[name=cell_checkbox]').eq(0).trigger('click');

        $("#gridList").jqGrid("resetSelection");
        $('#gridList').setSelection("addRow", true);
        
        $('#gridList').setColProp("API_ID", { editable: true }); 
        //$('#gridList').setColProp("EMP_NM", { editable: true }); 
        $('#gridList').editCell(1, 3, true); 
        //$('#gridList').editCell(1, 6, true);
    }
}

//저장
function saveAction() {
    // true : select 된 데이터, false : transaction 일으킨 데이터
    var checkedLen = $('input[name=cell_checkbox]:checked').length;
    if (checkedLen < 1) {
        alert(language['NO_SELECTED_CELL']);
        return;
    } else {
        for (var i=0; i< checkedLen; i++) {
            var checkedId = $('input[name=cell_checkbox]:checked').eq(i).parents('tr').attr('id');
            if($('#gridList').jqGrid().getRowData(checkedId).API_ID === "") {
                alert(language['INPUT_API_ID']);
                return;
            } else if($('#gridList').jqGrid().getRowData(checkedId).API_URL === "") {
                alert(language['INPUT_API_URL']);
                return;
            } 
        }

        var saveArr = new Array();
        $('input[name=cell_checkbox]:checked').each(function() {
            var rowId = $(this).parent().parent().attr("id");
            //$('#gridList').jqGrid().getRowData(rowId);
            var data = new Object() ;

            data.statusFlag = $('#gridList').jqGrid().getRowData(rowId).statusFlag;
            data.API_ID = $('#gridList').jqGrid().getRowData(rowId).API_ID;
            data.API_ID_HIDDEN = $('#gridList').jqGrid().getRowData(rowId).API_ID_HIDDEN;
            data.API_URL = $('#gridList').jqGrid().getRowData(rowId).API_URL;
            data.API_DESC = $('#gridList').jqGrid().getRowData(rowId).API_DESC;
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
            url: '/users/saveApiInfo',
            success: function(data) {
                console.log(data);
                if (data.status === 200) {
                    window.location.reload();
                } else {
                    alert(data.message);
                }
            }
        });


    } 
    
    
    
    
}

// 선택된 rows delete
function deleteAction() {
    //var selRow = $('#gridList').jqGrid('getGridParam', 'selrow');
    if ($('input[name=cell_checkbox]:checked').length > 0) {
        if ( confirm(language['ASK_DELETE'])) {
            $('input[name=cell_checkbox]:checked').each(function() {
                //$(this).parent().parent().removeNode();
                //$('#gridList').jqGrid('delRowData', $(this).parent().parent().attr("id"));
                if ( $(this).val() !== beforVal) {
                    $("#gridList").jqGrid('setCell', $(this).parent().parent().attr("id"), 'statusFlag', "DEL");
                }
            });
        }
    } else {
        alert(language['NO_SELECTED_CELL']);
    }
}
