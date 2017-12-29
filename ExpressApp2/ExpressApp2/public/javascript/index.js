$(document).ready(function () {
    $('.ajaxsend').click(function(){
        // content-type을 설정하고 데이터 송신
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-type', "application/json");

        // 데이터 수신이 완료되면 표시
        xhr.addEventListener('load', function(){
            console.log(xhr.responseText);
            // 문자열 형식으로 변환
            var result = JSON.parse(xhr.responseText);
            // 데이터가 없으면 return 반환
            if(result.result !== 'ok') return;
            // 데이터가 있으면 결과값 표시
            document.querySelector(".serult").innerHTML = result.email;
        });
    })

})
function addApp() {
    wrapWindowByMask();
}

function wrapWindowByMask(){
    // 화면의 높이와 너비를 변수로 만듭니다.
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();

    // 마스크의 높이와 너비를 화면의 높이와 너비 변수로 설정합니다.
    $('.mask').css({'width':maskWidth,'height':maskHeight});


    // 레이어 팝업을 가운데로 띄우기 위해 화면의 높이와 너비의 가운데 값과 스크롤 값을 더하여 변수로 만듭니다.
    var left = ( $(window).scrollLeft() + ( $(window).width() - $('#new_chatbot').width()) / 2 );
    var top = ( $(window).scrollTop() + ( $(window).height() - $('#new_chatbot').height()) / 2 );

    // css 스타일을 변경합니다.
    $('#new_chatbot').css({'left':left,'top':top, 'position':'absolute'});

    // 레이어 팝업을 띄웁니다.
    $('#new_chatbot').show();
}