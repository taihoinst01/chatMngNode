



// 대사표시방법 (ctrl + e) 
var iVal = 1;
$(document).keydown(function(e) {
    if (e.ctrlKey == true && e.which == 69) {

        // Ctrl + E 를 할 때  entityInfo 작업중인 라벨링이 있다면 삭제 처리 
        $('input[name=entityInfo]').each(function(e) {
           if($(this).val() == null || $(this).val() == "") {
               $(this).remove();
           }
        });

        iVal++;
        if (iVal ==  3) iVal = 0;
        var valueTokenArr = ["tokens","entities","compositeEntities"];
        $("select[name=tokenStyleSelectBox]").val(valueTokenArr[iVal]).trigger("change");
        return false;
    }



    // Utterance 입력
    $("#iptUtterance").keypress(function(e) {

        if (e.keyCode == 13){	//	Enter Key

        }

    });

});

/*
function utterInput() {

    $.ajax({
        url: '/learning/utterInputAjax',                //주소
        dataType: 'json',                  //데이터 형식
        type: 'POST',                      //전송 타입
        data: {'iptUtterance':$('#iptUtterance').val()},      //데이터를 json 형식, 객체형식으로 전송

        success: function(result) {          //성공했을 때 함수 인자 값으로 결과 값 나옴

            if ( result['result'] == true ) {

                //$('#result').html(result['msg']);
                var inpuntAttr = result['iptUtterance'];
                var attrArray = new Array();
                for(var i=0; i<inputAttr.length; i++) {

                    for(var j=0; i< result['entities'].length; j++) {
                        if (result['entities'][j].startIndex == i && result['entities'][j].endIndex != i) {
                            attrArray.push('{');
                        } else if (result['entities'][j].startIndex == i && ) {

                        }
                    }

                }
                
                
                $('#utterListDiv').append();

            }

            

        } //function끝

    }); // ------      ajax 끝-----------------
}
*/