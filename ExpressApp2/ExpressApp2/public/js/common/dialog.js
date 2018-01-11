
$(document).ready(function(){
        // groupType 사양및 장단점 역할
        // sourceType 구분 역할
        var groupType =  $('#groupType').val();
        var sourceType = $('#sourceType').val();
        dialogsAjax(groupType, sourceType);
        $('#groupType').change(function(){
            groupType = $('#groupType').val();
            sourceType = $('#sourceType').val();
            $('#currentPage').val(1);
            dialogsAjax(groupType, sourceType);
        });
        $('#sourceType').change(function(){
            groupType = $('#groupType').val();
            sourceType = $('#sourceType').val();
            $('#currentPage').val(1);
            dialogsAjax(groupType, sourceType);
        });
});

function dialogsAjax(groupType, sourceType){

    params = {
        'currentPage' : ($('#currentPage').val()== '')? 1 : $('#currentPage').val(),
        'groupType':groupType,
        'sourceType' : sourceType
    };

    $.tiAjax({
        type: 'POST',
        url: '/learning/dialogs',
        data : params,
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
                            '<td class="txt_center">' + data.list[i].DLG_API_DEFINE +'</td>' +
                            '<td class="txt_center">' + data.list[i].LUIS_INTENT +'</td>' +
                            '<td class="txt_left" colspan="5">' + data.list[i].DLG_DESCRIPTION + '</td>' +
                            '<td class="txt_center" colspan="2">' + data.list[i].LUIS_ENTITIES +'</td>' +
                            '</tr>';
                }
            }
            $('#dialogTbltbody').append(item);
            console.log(data.pageList);
            $('#pagination').html('').append(data.pageList).css('width', (35 * $('.li_paging').length) +'px');
        }
    });

}

$(document).on('click','.li_paging',function(e){
    if($(e.target).val() != $('#currentPage').val()){
        $('#currentPage').val($(e.target).val())
        var groupType =  $('#groupType').val();
        var sourceType = $('#sourceType').val();
        dialogsAjax(groupType, sourceType);
    }
});