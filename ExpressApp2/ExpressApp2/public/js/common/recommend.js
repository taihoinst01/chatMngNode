$(document).ready(function () {
    $('.btn_delete').attr("disabled","disabled").css('background','url(../images/btn_delete_dis.png)')
    $('.span_delete').css('color','#465361c4');

    $('div[type=checkbox]').click(function() {
        var checkCount = $('div[type=checkbox][checked]').length;
        if(checkCount > 0){
            $('.btn_delete').removeAttr("disabled").css('background','url(../images/btn_delete.png)')
            $('.span_delete').css('color','#2873ca');
        }else{
            $('.btn_delete').attr("disabled","disabled").css('background','url(../images/btn_delete_dis.png)')
            $('.span_delete').css('color','#465361c4');
        }
    });
})

function deleteRecommend(){
    alert('미구현입니다');
}