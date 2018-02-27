



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



var saveTableHtml = "";
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
                    tableHtml += '<tr><td>' + data.rows[i].SEQ + '</td>';
                    tableHtml += '<td><input type="checkbox" class="flat-red" name="tableCheckBox"></td>';
                    tableHtml += '<td>' + data.rows[i].USER_ID + '</td>'
                    tableHtml += '<td>' + data.rows[i].EMP_NM + '</td>'
                    tableHtml += '<td>' + '<a href="javascript://" class="" onclick="initPassword(\''+ data.rows[i].USER_ID +'\');">' + '초기화'+ '</a>' + '</td>'
                    tableHtml += '<td>' + data.rows[i].REG_DT + '</td>'
                    tableHtml += '<td>' + data.rows[i].REG_ID + '</td>'
                    tableHtml += '<td>' + data.rows[i].MOD_DT + '</td>'
                    tableHtml += '<td>' + data.rows[i].LAST_LOGIN_DT + '</td>'
                    tableHtml += '<td>' + data.rows[i].LOGIN_FAIL_CNT + '</td></tr>'
                }
    
                saveTableHtml = tableHtml;
                $('#tableBodyId').html(tableHtml);
            } else {
                $('#tableBodyId').html('');
            }
            
        }
    });

}

// 비밀번호 초기화 
function initPassword(userId) {
    if (confirm(language['ASK_PW_INIT'])) {
        var params = {
            paramUserId: userId
        }
        
        $.ajax({
            data: params,
            url: '/users/inItPassword',
            success: function(data) {
                alert(data.message);
            }
        });
        
    }
}
