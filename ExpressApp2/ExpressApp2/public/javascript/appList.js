

/*
$(document).ready(function () {

    $(document).mouseup(function (e) {
        var container = $('.appLayout');
        if( !container.has(e.target).length)
            container.hide();
    });
});
*/
/*
$('html').click(function(e) { 
    if ($('.appLayout').css('display') == 'block') {

        if(!$(e.target).hasClass("appLayout")) {
            //alert('영역 밖입니다.'); 
            $('.appLayout').css('display', 'none');
        }
    }
}); 
*/


$(document).ready(function(){
    $(document).mousedown(function(e){
    $('.appLayout').each(function(){
            if( $(this).css('display') == 'block' )
            {
                var l_position = $(this).offset();
                l_position.right = parseInt(l_position.left) + ($(this).innerWidth());//($(this).width() + $(this).css('padding'));
                l_position.bottom = parseInt(l_position.top) + parseInt($(this).height());
    
    
                if( ( l_position.left <= e.pageX && e.pageX <= l_position.right )
                    && ( l_position.top <= e.pageY && e.pageY <= l_position.bottom ) )
                {
                    //alert( 'popup in click' );
                }
                else
                {
                    //alert( 'popup out click' );
                    $(this).hide();
                }
            }
        });
    }); 
})



//click위치 return, 사용안함.dyyoo
function abspos(e, object){
    this.x = e.clientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
    this.y = e.clientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
    return this;
}
//end


function GetAbsPosition(object) {
    var position = new Object;
    position.x = 0;
    position.y = 0;
    
    //location return
    if( object ) {
        position.x = object.offsetLeft;
        position.y = object.offsetTop;
        
        if( object.offsetParent ) {
            var parentpos = GetAbsPosition(object.offsetParent);
            position.x += parentpos.x;
            position.y += parentpos.y;
        }
    }
    
    //size return
    position.cx = object.offsetWidth;
    position.cy = object.offsetHeight;
    
    return position;
}
  
function itemClick(e, object){
    //var ex_obj = $('.appLayout');
    var ex_obj = document.getElementById('lay');
    if(!e) e = window.Event;
    pos = GetAbsPosition(object);//abspos(e, object);
    //x위치 수정해서 위치조정
    ex_obj.style.left = (pos.x-145)+"px";
    ex_obj.style.top = (pos.y+20)+"px";

    if ($('.appLayout').css('display') == 'none') {
        $('.appLayout').show();
    }
    //ex_obj.style.display = ex_obj.style.display=='none'?'block':'none';
}
