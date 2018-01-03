



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
});

$(document).ready(function(){

    // Utterance 입력
    $("#iptUtterance").keypress(function(e) {

        if (e.keyCode == 13){	//	Enter Key
            $("#iptUtterance").attr("readonly",true);
            var queryText = $(this).val();
            if(queryText.trim() == "" || queryText.trim() == null) {
                $("#iptUtterance").attr("readonly",false);
                return false;
            }
            utterInput(queryText);

            $("#iptUtterance").attr("readonly",false);
        }

    });

    
});

//checkbox 선택시 이벤트 $(this).attr("checked")
$(document).on('click','input[name=ch1]',function(event){
    $("input[name=ch1]").each(function() {
        if ( $(this).prop("checked") ) {
            $('#utterDelete').removeAttr('disabled');
            $('#utterDelete').removeClass("disable");
            return false;
        }
    });

    $('#utterDelete').attr("disabled", "disabled");
    $('#utterDelete').addClass("disable");   

});




function utterInput(queryText) {

    $.ajax({
        url: '/learning/utterInputAjax',                //주소
        dataType: 'json',                  //데이터 형식
        type: 'POST',                      //전송 타입
        data: {'iptUtterance':queryText},      //데이터를 json 형식, 객체형식으로 전송

        success: function(result) {          //성공했을 때 함수 인자 값으로 결과 값 나옴
            var entities = result['entities'];
            if(entities != null) {
                entities = entities.split(",");
                console.log(entities);
            }

            if ( result['result'] == true ) {
                var utter = utterHighlight(entities,result['iptUtterance']);

                $('#iptUtterance').val('');
                var inputUttrHtml = '';
                inputUttrHtml += '<tr><td><input name="ch1" class="tweak-input" type="checkbox"  onclick="" /></td>';
                inputUttrHtml += '<td class="txt_left" >' + utter + '</td>';
                inputUttrHtml += '<td class="txt_right02" >' + 'inputIntent' + '</td></tr>';
                
                $('#entityUtteranceTextTable').find('tbody').prepend(inputUttrHtml);
            }
        } //function끝

    }); // ------      ajax 끝-----------------
}