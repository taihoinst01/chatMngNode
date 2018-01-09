$(document).ready(function(){
    entitiesAjax();
})

function entitiesAjax(){
    $.tiAjax({
        type: 'POST',
        url: '/learning/entities',
        isloading: true,
        success: function(data) {
            $('#entitesTbltbody').html('');
            var item = '';
            if(data.list.length > 0){
                for(var i = 0; i < data.list.length; i++){
                    item += '<tr>' +
                    '<td class="txt_center" colspan="3">' + data.list[i].ENTITY_VALUE + "</td>" ;
                    item += '</a>' +
                    '<td class="txt_center" colspan="3">' +
                    data.list[i].ENTITY +
                    '</td>' +
                    '</tr>';
                }
            }
            $('#entitesTbltbody').append(item);
        }
    });
}