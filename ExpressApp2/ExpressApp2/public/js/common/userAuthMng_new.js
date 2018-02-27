


$(document).ready(function() {
    makeUserTable();
});

$(document).ready(function() {

    //검색
    $('#searchBtn').click(function() {
        makeUserTable();
    });

    //엔터로 검색
    $('#searchName, #searchId').on('keypress', function(e) {
        if (e.keyCode == 13) makeUserTable();
    });
    
});
$(document).on('click', 'tr[name=userTr]', function() {
    $('tr[name=userTr]').css("background", '');
    var clickUserId = $(this).children().eq(1).text();

    makeAppTable(clickUserId);

    $(this).css("background", "aliceblue");

});

var initAppList;
var initAppCheck;
function makeUserTable() {
    
    var params = {
        'searchName' : $('#searchName').val(),
        'searchId' : $('#searchId').val(),
        'page' : $('td[dir=ltr]').find('input').val(),
        'rows' : $('td[dir=ltr]').find('select').val()
    };
    
    $.ajax({
        type: 'POST',
        data: params,
        url: '/users/selectUserList',
        success: function(data) {
           
            if (data.rows) {
                
                var tableHtml = "";
    
                for (var i=0;i<data.rows.length;i++) { 
                    tableHtml += '<tr style="cursor:pointer" name="userTr"><td>' + data.rows[i].SEQ + '</td>';
                    tableHtml += '<td>' + data.rows[i].USER_ID + '</td>'
                    tableHtml += '<td>' + data.rows[i].EMP_NM + '</td>'
                    tableHtml += '<td>' + data.rows[i].EMAIL + '</td>'
                }
    
                saveTableHtml = tableHtml;
                $('#userTableBodyId').html(tableHtml);

                //사용자의 appList 출력
                $('#userTableBodyId').find('tr').eq(0).children().eq(0).trigger('click');


            } else {
                $('#userTableBodyId').html('');
                $('#appTableBodyId').html('');
            }
            
        }
    });
}

function makeAppTable(userId) {
    
    var params = {
        'userId' : userId
    };
    
    $.ajax({
        type: 'POST',
        data: params,
        url: '/users/selectUserAppList',
        success: function(data) {
            initAppList = data.rows;
            initAppCheck = data.checkedApp;
            mkAppRow(data.rows, data.checkedApp);
        }
    });
}

//appList table tbody html 생성
function mkAppRow(rows, checkedApp) {

    $('#appTableBodyId').html('');
    var appHtml ="";

    for (var i=0;i<rows.length;i++) { 
        
        appHtml += '<tr><td>' + Number(i+1) + '</td>';
        
        var j=0;
        for (; j<checkedApp.length; j++) {
            if (rows[i].APP_ID === checkedApp[j].APP_ID) {
                appHtml += '<td><input type="checkbox" class="flat-red" checked name="tableCheckBox"></td>';
                break;
            } 
        }
        if (j === checkedApp.length) {
            appHtml += '<td><input type="checkbox" class="flat-red" name="tableCheckBox"></td>';
        }

        appHtml += '<td>' + rows[i].APP_NAME + '</td>';
        appHtml += '<td>' + rows[i].APP_ID + '</td>';
        appHtml += '<td>' + rows[i].OWNER_EMAIL + '</td></tr>';
    }

    $('#appTableBodyId').html(appHtml);
}


//초기화
function restoreGridAction() {
    if(confirm('초기화 하시겠습니까?')) {
        mkAppRow(initAppList, initAppCheck);
    }
}












