$(document).ready(function () {
    $('.sideMainMenu').click(function(){
        if($(this).prev().hasClass('sortarr_down')) {
            $(this).prev().removeClass('sortarr_down');
            $(this).prev().addClass('sortarr_up');
        } else {
            $(this).prev().removeClass('sortarr_up');
            $(this).prev().addClass('sortarr_down');
        }
        $(this).parent().parent().next().toggleClass('subMenu');
    });
})