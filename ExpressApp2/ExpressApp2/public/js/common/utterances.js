



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

    // recommend에서 넘어온 문장 insert
    var recommendParam = $('#utterence').val();
    if(recommendParam){
        utterInput(recommendParam);
    }
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

    // Utterance 삭제
    $('#utterLearn').click(function(){
        
        var utterBox = $("#entityUtteranceTextTable div[type=checkbox]");
        var intent = "";
        var entity = "";
        var dlgId = "";
        utterBox.each(function(n){
    
            if ($(utterBox[n]).attr("checked") == "checked") {
                var tr = $(utterBox[n]).parent().parent();
                var td = tr.children();
                intent = $(td.eq(2).children()).val();
                entity = $(td.eq(1).children()).val();        
            }
        });

        var dlgBox = $("#dlgListTable div[type=checkbox]");

        dlgBox.each(function(n){
    
            if ($(dlgBox[n]).attr("checked") == "checked") {
                var tr = $(dlgBox[n]).parent().parent();
                var td = tr.children();
                dlgId = $(td.eq(1).children()).val();
            }
        });

        $.ajax({
            url: '/learning/learnUtterAjax',
            dataType: 'json',
            type: 'POST',
            data: {'intent':intent, 'entity':entity, 'dlgId':dlgId},
            success: function(result) {
                if(result['result'] == true) {
                    alert("추가 하였습니다.");
                }else{
                    alert("실패하였습니다.");
                }
            }
        });

    });

    // Utterance 삭제
    $('#utterDelete').click(function(){

        $('.checkUtter').each(function(){
            if($(this).attr('checked') == 'checked') {
                $(this).parent().parent().remove();
            }
        });
        $('input[name=ch1All]').parent().attr('checked', false);
        changeBtnAble(false);
    });

    //다이얼로그 생성 모달 닫는 이벤트(초기화)
    $(".js-modal-close").click(function() {
        $('html').css({'overflow': 'auto', 'height': '100%'}); //scroll hidden 해제
        //$('#element').off('scroll touchmove mousewheel'); // 터치무브 및 마우스휠 스크롤 가능

        $('#appInsertDes').val('');
        $("#intentList option:eq(0)").attr("selected", "selected");
        //$('#intentList').find('option:first').attr('selected', 'selected');
        initMordal('intentList', 'Select Intent');
        initMordal('entityList', 'Select Entity');
        $('#dlgLang').find('option:first').attr('selected', 'selected');
        $('#dlgOrder').find('option:first').attr('selected', 'selected');
        $('#layoutBackground').hide();
    });

    //utter 체크박스 전체선택 
    $('#allCheck').parent().click(function() {
        var checkedVal = false;
        if (typeof $('#allCheck').parent().attr('checked') != 'undefined') {
            $("input[name=ch1]").each(function() {
                if ( typeof $(this).parent().attr("checked") == 'undefined' ) {
                    $(this).parent().attr("checked", '');
                } 
                checkedVal = true;
            });
        } else {
            $("input[name=ch1]").each(function() {
                if ( typeof $(this).parent().attr("checked") != 'undefined' ) {
                    $(this).parent().removeAttr('checked');
                }
                checkedVal = false;
            });
        }
        changeBtnAble('delete', checkedVal);
    });

	$('#addDialogClose , #addDialogCancel').click(function(){
        $('#dialogText').val('');
    });

    //dlg 체크박스 전체선택 
    $('#checkAllDlg').parent().click(function() {
        var checkedVal = false;
        if (typeof $('#checkAllDlg').parent().attr('checked') != 'undefined') {
            $("input[name=dlgChk]").each(function() {
                if ( typeof $(this).parent().attr("checked") == 'undefined' ) {
                    $(this).parent().attr("checked", '');
                } 
                checkedVal = true;
            });
        } else {
            $("input[name=dlgChk]").each(function() {
                if ( typeof $(this).parent().attr("checked") != 'undefined' ) {
                    $(this).parent().removeAttr('checked');
                }
                checkedVal = false;
            });
        }
        changeBtnAble('learn', checkedVal);
    });
    
});

//intent selbox 선택
$(document).on('change','#intentNameList',function(event){
    selectDlgListAjax($("#intentNameList option:selected").val());
});

//다이얼로그 생성 유효성 검사
function dialogValidation(type){
    if(type == 'dialogInsert'){
        var dialogText = $('#dialogText').val();
        
        if(dialogText != "") {
            $('#btnAddDlg').removeClass("disable");
            $('#btnAddDlg').attr("disabled", false);
        } else {
            $('#btnAddDlg').attr("disabled", "disabled");
            $('#btnAddDlg').addClass("disable");
        }
    }
}

//다이얼로그 생성
function insertDialog(){

    $.ajax({
        url: '/learning/insertDialog',
        dataType: 'json',
        type: 'POST',
        data: $('#appInsertForm').serializeObject(),
        success: function(data) {
            if(data.status == 200){
                $('#addDialogClose').click();
            }
        }
    });
}

function selectDlgListAjax(intentName) {
    $.ajax({
        url: '/learning/selectDlgListAjax',                //주소
        dataType: 'json',                  //데이터 형식
        type: 'POST',                      //전송 타입
        data: {'intentName':intentName},      //데이터를 json 형식, 객체형식으로 전송

        success: function(result) {          //성공했을 때 함수 인자 값으로 결과 값 나옴
            var inputUttrHtml = '';
            for (var i=0; i<result['list'].length; i++) {
                var tmp = result['list'][i];
                inputUttrHtml += '<tr> <td> <div class="check-radio-tweak-wrapper" type="checkbox">';
                inputUttrHtml += '<input name="dlgChk" class="tweak-input"  onclick="" type="checkbox"/> </div> </td>';
                inputUttrHtml += '<td class="txt_left" ><input type="hidden" name="' + tmp.DLG_ID + '" value="' + tmp.DLG_ID + '" />' + tmp.CARD_TEXT + '</td></tr>';
                //inputUttrHtml += '<td class="txt_center" > <a href="#" class="btn btn-small">Add</a> </td></tr>';
            }//<a href="#" class="btn b02  btn-small js-modal-close">Cancel</a>
            $('#dlgListTable').find('tbody').empty();
            $('#dlgListTable').find('tbody').prepend(inputUttrHtml);
        } 

    }); // ------      ajax 끝-----------------
}


//checkbox 선택시 이벤트 $(this).attr("checked")
$(document).on('click','div[type=checkbox]',function(event){
    var checkedVal = false;
    if (typeof $(this).attr("checked") == 'undefined') {
        $(this).attr("checked", "");
    } else {
        $(this).removeAttr('checked');
    }
    
    if ( $(this).parents('.Tbl_wrap').find('input[type=checkbox]').attr('id') == 'allCheck' ) {
        $("input[name=ch1]").each(function() {
            if (typeof $(this).parent().attr("checked") != 'undefined') {
                checkedVal = true;
            } 
        });
        changeBtnAble('delete', checkedVal);
    } else {
        $("input[name=dlgChk]").each(function() {
            if (typeof $(this).parent().attr("checked") != 'undefined') {
                checkedVal = true;
            } 
        });
        changeBtnAble('learn', checkedVal);
    }
});

function changeBtnAble(btnName, boolVal){
    if (btnName=='learn') {
        if (!boolVal) {
            $('#utterLearn').attr("disabled", "disabled");
            $('#utterLearn').addClass("disable");  
        } else {
            $('#utterLearn').removeAttr('disabled');
            $('#utterLearn').removeClass("disable");
        }
    } else {
        if (!boolVal) {
            $('#utterDelete').attr("disabled", "disabled");
            $('#utterDelete').addClass("disable");   
        } else {
            $('#utterDelete').removeAttr('disabled');
            $('#utterDelete').removeClass("disable");
        }
    }
}


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
            }else{
                entities = [];
            }

            if ( result['result'] == true ) {
                var utter = utterHighlight(entities,result['iptUtterance']);
                var selBox = result['selBox'];

                $('#iptUtterance').val('');
                var inputUttrHtml = '';
                inputUttrHtml += '<tr> <td> <div class="check-radio-tweak-wrapper checkUtter" type="checkbox">';
                inputUttrHtml += '<input name="ch1" class="tweak-input" type="checkbox" onclick="" /> </div> </td>';
                inputUttrHtml += '<td class="txt_left" ><input type=hidden value="' + result['entities'] + '"/>' + utter + '</td>';
                inputUttrHtml += '<td class="txt_right02" >'; 
                inputUttrHtml += '<select id="intentNameList" name="intentNameList" class="select_box">'

                if(selBox != null) {
                    for( var i = 0 ; i < selBox.length; i++) {
                        inputUttrHtml += '<option value="' + selBox[i]['LUIS_INTENT'] + '">' + selBox[i]['LUIS_INTENT'] + '</option>'
                    }
                    selectDlgListAjax(selBox[0]['LUIS_INTENT']);
                } else {
                    inputUttrHtml += '<option value="" selected>no intent</option>'
                }

                inputUttrHtml += '</select></td></tr>';
                
                $('#entityUtteranceTextTable').find('tbody').prepend(inputUttrHtml);
                
            }
        } //function끝

    }); // ------      ajax 끝-----------------
}

function utterHighlight(entities, utter) {
    var result = utter;
    for(var i = 0; i < entities.length; i++) {
        result = result.replace(entities[i], '<span class="highlight">' + entities[i] + '</span>');
    }
    return result;
}

//---------------두연 추가

function openModalBox(target){
    if(target === '#rename_chatbot'){
        $('#lay').css('display','none');
        $('#reName').val($('#currentAppName').val());
    }
    // 화면의 높이와 너비를 변수로 만듭니다.
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();

    // 마스크의 높이와 너비를 화면의 높이와 너비 변수로 설정합니다.
    $('.mask').css({'width':maskWidth,'height':maskHeight});


    // 레이어 팝업을 가운데로 띄우기 위해 화면의 높이와 너비의 가운데 값과 스크롤 값을 더하여 변수로 만듭니다.
    var left = ( $(window).scrollLeft() + ( $(window).width() - $('#create_dlg').width()) / 2 );
    var top = ( $(window).scrollTop() + ( $(window).height() - $('#create_dlg').height()) / 2 );

    // css 스타일을 변경합니다.
    $(target).css({'left':left,'top':top, 'position':'absolute'});

    // 레이어 팝업을 띄웁니다.
    $(target).show();

    $('html').css({'overflow': 'hidden', 'height': '100%'});
        $('#element').on('scroll touchmove mousewheel', function(event) { // 터치무브와 마우스휠 스크롤 방지
            event.preventDefault();
            event.stopPropagation();
            return false;
    });
    wrapWindowByMask();
}

function wrapWindowByMask(){ //화면의 높이와 너비를 구한다. 
    var maskHeight = $(document).height(); 
    var maskWidth = $(window).width(); //마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채운다. 
    $('#layoutBackground').css({'width':maskWidth,'height':maskHeight}); //마스크의 투명도 처리 
    $('#layoutBackground').fadeTo("fast",0.7); 
} 

function selectInent(intent) {
    //intent하위 entity 존재하면 entity select box disable제거되게 구현해야함
    $('#entityList').removeAttr("disabled");
}

function selectEntity(entity) {
    //intent하위 entity 존재하면 entity select box disable제거되게 구현해야함
    $('#btnAddDlg').removeAttr("disabled");
    $('#btnAddDlg').removeClass("disable");
}

function initMordal(objId, objName) {
    //<option selected="selected" disabled="disabled">Select Intent<!-- 서비스 선택 --></option>
    if (objId == 'entityList') {
        $('#'+ objId).attr("disabled", "disabled");
    }
    $('#btnAddDlg').attr("disabled", "disabled");
    $('#btnAddDlg').addClass("disable");

    $('#'+ objId + ' option:eq(0)').remove();
    $('#'+ objId ).prepend('<option selected="selected" disabled="disabled">' + objName + '</option>');

}