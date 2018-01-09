/*
$(document).ready(function(){
    dialogsAjax();
})

function dialogsAjax(){
    $.tiAjax({
        type: 'POST',
        url: '/learning/dialogs',
        isloading: true,
        success: function(data) {
            $('#dialogTbltbody').html('');
            var item = '';
            if(data.list.length > 0){
                for(var i = 0; i < data.list.length; i++){
                    item += '<tr>' +
                            '<td class="txt_center">소스타입</td>' +
                            '<td class="txt_center">그룹란</td>' +
                            '<td class="txt_left" colspan="3">' + data.list[i].DLG_DESCRIPTION + '</td>' +
                            '<td class="txt_left" colspan="3">연결어터런스</td>' +
                            '</tr>';
                }
            }
            $('#dialogTbltbody').append(item);
        }
    });
}
*/