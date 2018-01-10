$(document).ready(function(){
    entitiesAjax();
})

function entitiesAjax(){

    params = {
        'currentPage' : ($('#currentPage').val()== '')? 1 : $('#currentPage').val()
    };
    $.tiAjax({
        type: 'POST',
        data: params,
        url: '/learning/entities',
        isloading: true,
        success: function(data) {
            $('#entitesTbltbody').html('');
            var item = '';
            if(data.list.length > 0){
                for(var i = 0; i < data.list.length; i++){
                    item += '<tr>' +
                    '<td class="txt_center" colspan="3">' + data.list[i].ENTITY + "</td>" ;
                    item += '</a>' +
                    '<td class="txt_center" colspan="3">' +
                    data.list[i].ENTITY_VALUE +
                    '</td>' +
                    '</tr>';
                }
                
            }
            $('#entitesTbltbody').append(item);
            $('#pagination').html('').append(data.pageList).css('width', (35 * $('.li_paging').length) +'px');
        }
    });
}

$(document).on('click','.li_paging',function(e){
    if($(e.target).val() != $('#currentPage').val()){
        $('#currentPage').val($(e.target).val())
        entitiesAjax();
    }
});