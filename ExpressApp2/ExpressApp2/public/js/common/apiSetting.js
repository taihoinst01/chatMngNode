

$(document).ready(function() {


    makGrid(); 
    
    
 /*
    $('#searchEmpNm,#searchApiId').on('keypress', function(e) {
        if (e.keyCode == 13) doSearchParam();
    });
*/
    $('#searchApiId').focus();

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
          {name:'statusFlag', label:'상태', width:40, align:'center', sortable:false},
          {name:'API_ID_HIDDEN' , label:'API_ID_HIDDEN' , hidden:true},
          {name:'API_ID'    , label:'API_ID'            , width:80, editable:false, align:'left', sortable:true, hidden:false},
          {name:'API_URL'    , label:'URL'            , width:90, editable:false, align:'left', sortable:true, hidden:false},
          {name:'API_DESC'    , label:'DESC'            , width:200, editable:false, align:'left', sortable:true, hidden:false}
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
            if (editableCells.indexOf(colName) >= 0 || (statusVal ==='NEW' && colName === 'API_ID') ) { 
                beforVal = $(this).getCell(iRow, iCol);
                $(this).setColProp(colName, { editable: true }); 
                $(this).editCell(iRow, iCol, true); 
            } 
        },
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
        alert("추가중인 사용자가 있습니다.");
    } else if ($('#gridList').find('input[type=text]').length >0) {
        alert('수정중인 cell이 있습니다.');
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
