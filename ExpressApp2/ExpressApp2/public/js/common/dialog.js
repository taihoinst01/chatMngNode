
$(document).ready(function(){
        // luisintent 사양및 장단점 역할
        // luisentities 구분 역할
        var luisintent =  $('#luisintent').val();
        var luisentities = $('#luisentities').val();
        dialogsAjax(luisintent, luisentities);
        $('#luisintent').change(function(){
            luisintent = $('#luisintent').val();
            luisentities = $('#luisentities').val();
            dialogsAjax(luisintent, luisentities);
        });
        $('#luisentities').change(function(){
            luisintent = $('#luisintent').val();
            luisentities = $('#luisentities').val();
            dialogsAjax(luisintent, luisentities);
        });
});

function dialogsAjax(luisintent, luisentities){

    $.tiAjax({
        type: 'POST',
        url: '/learning/dialogs',
        data : {'luisintent':luisintent, 'luisentities' : luisentities},
        isloading: true,
        success: function(data) {
            $('#dialogTbltbody').html('');
            var item = '';
            if(data.list.length > 0){
                for(var i = 0; i < data.list.length; i++){
                    if(data.list[i].DLG_API_DEFINE == 'D'){
                        data.list[i].DLG_API_DEFINE = 'Common';
                    }
                    item += '<tr>' +
                            '<td class="txt_center">'+data.list[i].LUIS_INTENT+'</td>' +
                            '<td class="txt_center">'+data.list[i].LUIS_ENTITIES+'</td>' +
                            '<td class="txt_left" colspan="3">' + data.list[i].DLG_DESCRIPTION + '</td>' +
                            '<td class="txt_left" colspan="3">'+data.list[i].LUIS_ENTITIES+'</td>' +
                            '</tr>';
                }
            }
            $('#dialogTbltbody').append(item);
        }
    });

}
