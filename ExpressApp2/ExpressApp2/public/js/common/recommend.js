$(document).ready(function () {
    recommendAjax('all');
    $('.btn_delete').attr("disabled","disabled").css('background','url(../images/btn_delete_dis.png)')
    $('.span_delete').css('color','#465361c4');

    $('div[type=checkbox]').click(function(e) {
        checkBoxHandler(e);
    });

    $('#recommendPeriod').change(function(e){
        recommendAjax($(e.target).find('option:selected').val());
    });
})

function recommendAjax(selectType){

    params = {
        'selectType' : selectType
    };
    $.tiAjax({
        type: 'POST',
        data: params,
        url: '/learning/recommend',
        isloading: true,
        success: function(data) {
            $('#recommendContents').html('');
            var item = '';
            if(data.list.length > 0){
                for(var i = 0; i < data.list.length; i++){
                    item += '<tr>' +
                    '<td class="txt_left" style="width: 3%;">' +
                    '<div class="check-radio-tweak-wrapper" type="checkbox">' +
                    '<input type="checkbox" class="tweak-input" id="" name=""/></div></td>' +
                    '<td class="txt_left" colspan="3"><a href="/learning/utterances" class="dashLink" >';
                    var query = data.list[i].QUERY;
                    var entities = data.list[i].ENTITIES.split(',');
                    if(entities.length > 0){
                        for(var j = 0; j < entities.length; j++){
                            query = query.split(entities[j]).join('<span class="highlight">'+entities[j]+'</span>');
                        }
                    }
                    item += query;
                    item += '</a></td>' +
                    '<td class="txt_center">' +
                    '<select id="" name="" class="select_box">' +
                    '<option value="" selected>intent select..</option>';
                    for(var j = 0; j < data.list[i].intentList.length; j++){
                        item += '<option value="">'+data.list[i].intentList[j].LUIS_INTENT+'</option>';
                    }
                    item += '</select>';
                    item += '</td>';
                    item += '<td class="txt_right02"><a href="#" class="btn_util" onclick="itemClick();"></a></td>';
                    item += '</tr>';
                }
            }
            $('#recommendContents').append(item);
        }
    });
}

//html append시 이벤트 핸들러 달아주기
$(document).on('click','div[type=checkbox]',function(e){
    var checkedVal = false;
    if (typeof $(this).attr("checked") == 'undefined') {
        $(this).attr("checked", "");
    } else {
        $(this).removeAttr('checked');
    }
    checkBoxHandler(e);
});

//체크박스 click 이벤트 핸들러
function checkBoxHandler(e){
    var isAll = $(e.target).children('#recommendAll').length;
    var isChecked = $(e.target).attr('checked');

    if(isAll == 1 && isChecked == 'checked'){
        $('div[type=checkbox]').each(function(index,item){
            if(index > 0 && $(item).attr('checked') != 'checked'){
                $(item).click();
            }
        });
    }else if(isAll == 1 && isChecked != 'checked'){
        $('div[type=checkbox]').each(function(index,item){
            if($(item).attr('checked') == 'checked'){
                $(item).click();
            }
        });
    }
    var checkCount = $('div[type=checkbox][checked]').length;
    if(checkCount > 0){
        $('.btn_delete').removeAttr("disabled").css('background','url(../images/btn_delete.png)')
        $('.span_delete').css('color','#2873ca');
    }else{
        $('.btn_delete').attr("disabled","disabled").css('background','url(../images/btn_delete_dis.png)')
        $('.span_delete').css('color','#465361c4');
    }
    
    if($('#recommendAll').parents('div[type=checkbox]').attr('checked') == 'checked' && checkCount == 1){
        $('#recommendAll').parents('div[type=checkbox]').click();
    }
}

//delete 버튼 클릭 이벤트
function deleteRecommend(){
    alert('미구현입니다');
}