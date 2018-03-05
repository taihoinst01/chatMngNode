








$(document).ready(function () {

    $('div[name=colorCircle]').click(function(){
        var colorNum = $(this).attr('class').split(' ')[1];
        
        $('#selColor').attr('class', 'img-circle_l ' + colorNum);
    });

    $('#saveApp').click(function() {
        addApp();
    });
    
    $('#cancelApp').click(function() {
        if( confirm("취소하시겠습니까?") ) {
            window.location.href='/list';
        }
    });


})


function addApp() {
    
    if ($('#appInsertName').val() === "") {
        alert("챗봇의 이름을 입력해 주세요.");
        return;
    }

    var params = {
        'color': $('#selColor').attr('class').split(' ')[1],
        'appInsertService': $('#appService').val(),
        'appInsertName': $('#appInsertName').val(),
        'appInsertCulture': $(":input:radio[name=r3]:checked").val(),
        'appDes': $('#appDes').val(),
    };


    $.ajax({
        type: 'POST',
        url: 'admin/putAddApps',
        data: params,
        success: function(data) {
            //console.log(data);
            if(data.appId != undefined && data.appId != null && data.appId != ''){
                window.location.href='/';
            }else{
                alert(data.error.message);
            }
        }
    });
}