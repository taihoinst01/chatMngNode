$(document).ready(function () {
    $('.btn_delete').attr("disabled","disabled").css('background','url(../images/btn_delete_dis.png)')
    $('.span_delete').css('color','#465361c4');

    $('div[type=checkbox]').click(function(e) {
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
    });
})

function deleteRecommend(){
    alert('미구현입니다');
}