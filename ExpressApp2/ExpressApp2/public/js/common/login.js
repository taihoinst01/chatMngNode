
$(document).ready(function () {
    $('#sendLoginBtn').click(function () {
        $('#loginfrm').submit();
    });

    $('#mLoginPass').keyup(function(e){
        if(e.keyCode == 13) {
            $('#sendLoginBtn').click();
        }
    });
})
