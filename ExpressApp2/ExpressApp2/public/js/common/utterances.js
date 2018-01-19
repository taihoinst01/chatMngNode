



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

    $("input[name=dlgChk]").bind('click',function(){
        $(this).each(function(){
            //
            if($(this).parent().attr('checked') == "checked") {
                $(this).parent().removeAttr('checked');
                changeBtnAble('learn', false);
            } else {
                $(this).parent().attr("checked", "checked");
                changeBtnAble('learn', true);
            }
        });
    })

    // recommend에서 넘어온 문장 insert
    var recommendParam = $('#utterence').val();
    if(recommendParam){
        utterInput(recommendParam);
    }
    // Utterance 입력
    $("#iptUtterance").keypress(function(e) {

        if (e.keyCode == 13){	//	Enter Key

            $("#entityUtteranceTextTable tbody").html("");
            $("#dialogRecommand").html("");

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

    // Utterance Learn
    $('#utterLearn').click(function(){

        var entity = $('input[name=entity').val();
        
        var inputDlgId = $('input[name=dlgId]');
        var dlgId = [];
        inputDlgId.each(function(n) { 
            dlgId[n] = inputDlgId[n].value;
            return dlgId;
        });

        $.ajax({
            url: '/learning/learnUtterAjax',
            dataType: 'json',
            type: 'POST',
            data: {'entity':entity, 'dlgId':dlgId},
            success: function(result) {
                if(result['result'] == true) {
                    alert("추가 하였습니다.");
                    
                    $('input[name=ch1All]').parent().attr('checked', false);
                    changeBtnAble(false);

                    $("#entityUtteranceTextTable tbody").html("");
                    $("#dialogRecommand").html("");

                    $('#utterLearn').attr("disabled", "disabled");
                    $('#utterLearn').addClass("disable");

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
                $('#entityUtteranceTextTable tbody').html('');
                //$(this).parent().parent().remove();
            }
        });
        $('#dialogRecommand').html("");
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
                    $(this).parent().click();
                } 
                checkedVal = true;
            });
        } else {
            $("input[name=ch1]").each(function() {
                if ( typeof $(this).parent().attr("checked") != 'undefined' ) {
                    $(this).parent().click();
                }
                checkedVal = false;
            });
        }
        changeBtnAble('delete', checkedVal);
    });

	$('#addDialogClose , #addDialogCancel').click(function(){
        $('#mediaCarouselLayout').css('display','none');
        $('#cardLayout').css('display','none');
        $('#appInsertForm')[0].reset();
        $('#dialogPreview').html('');
    });

    //dlg 체크박스 전체선택 
    $('#checkAllDlg').parent().click(function() {
        //var checkedVal = false;
        
        if (typeof $('#checkAllDlg').parent().attr('checked') != 'undefined') {
            $("input[name=dlgChk]").each(function() {
                if ( typeof $(this).parent().attr("checked") == 'undefined' ) {
                    $(this).parent().click();
                } 
                //checkedVal = true;
            });
        } else {
            $("input[name=dlgChk]").each(function() {
                if ( typeof $(this).parent().attr("checked") != 'undefined' ) {
                    $(this).parent().click();
                }
               //checkedVal = false;
            });
        }
    });
    
    // 타입 변경시 버튼, 이미지 관련 input 생성 및 삭제
    $('#dlgType').change(function(e){
        if($(e.target).val() == "2"){
            $('#mediaCarouselLayout').css('display','none');
            $('#cardLayout').css('display','none');
        }else if($(e.target).val() == "4"){
            $('#mediaCarouselLayout').css('display','block');
            $('#cardLayout').css('display','none');
        }else{
            $('#mediaCarouselLayout').css('display','block');
            $('#cardLayout').css('display','block');
        }
        openModalBox('#create_dlg');
    });

    //다이얼로그 Add
    $('#addDialogBtn').click(function(e){
        var dlgType = $('#dlgType').val();
        var dlgHtml = '';
        if(dlgType == '2'){ //text
            if($('#dialogText').val() == ''){
                alert('다이얼로그 텍스트를 입력하세요');
            }else{
                dlgHtml += '<div class="wc-message wc-message-from-bot" style="width:90%;">';
                dlgHtml += '<div class="wc-message-content">';
                dlgHtml += '<svg class="wc-message-callout"></svg>';
                dlgHtml += '<div><div class="format-markdown"><div class="textMent">';
                dlgHtml += '<p>';
                dlgHtml += $('#dialogText').val();
                dlgHtml += '</p>';
                dlgHtml += '</div></div></div></div></div>';
            }

            $('#dialogPreview').append(dlgHtml);
        }else if(dlgType == '3'){ //carousel
            if($('#add-carousel').length == 0){ //초기 append
                dlgHtml += '<div id="add-carousel">';
                dlgHtml += '<div class="wc-message wc-message-from-bot">';
                dlgHtml += '<div class="wc-message-content"><!-- react-empty: 124 -->';
                dlgHtml += '<svg class="wc-message-callout"></svg>';
                dlgHtml += '<div>';
                dlgHtml += '<div class="wc-carousel" style="width: 312px;">';
                dlgHtml += '<div>';
                dlgHtml += '<div class="wc-hscroll-outer">';
                dlgHtml += '<div class="wc-hscroll" style="margin-bottom: 0px;">';
                dlgHtml += '<ul>';
                dlgHtml += '<li class="wc-carousel-item">';
                dlgHtml += '<div class="wc-card hero">';
                dlgHtml += '<div class="wc-container imgContainer">';
                dlgHtml += '<img src="https://bot.hyundai.com/assets/images/mainfeatureImg/01_Kona.jpg">';
                dlgHtml += '</div>';
                //dlgHtml += '<h1>Kona 핵심기능</h1>';
                dlgHtml += '<p class="carousel">'+$('#dialogText').val()+'</p>';
                dlgHtml += '<ul class="wc-card-buttons">';
                for(var i = 0 ; i < $('input[id^="buttonName"]').length ; i ++){
                    if($('#buttonName' + (i+1)).val() != ''){
                        dlgHtml += '<li>';
                        dlgHtml += '<button>'+$('#buttonName' + (i+1)).val()+'</button>';
                        dlgHtml += '</li>';
                    }
                }
                dlgHtml += '</ul>';
                dlgHtml += '</div>';
                dlgHtml += '</li>';
                dlgHtml += '</ul>';
                dlgHtml += '</div>';
                dlgHtml += '</div>';
                dlgHtml += '</div>';
                dlgHtml += '</div>';
                dlgHtml += '</div>';
                dlgHtml += '</div>';
                dlgHtml += '</div>';
                dlgHtml += '</div>';

                $('#dialogPreview').append(dlgHtml);
            }else{
                if($('#add-carousel').length == 1){
                    var prevBtnHtml = '';
                    var afterBtnHtml = '';
    
                    prevBtnHtml += '<button class="scroll previous">';
                    prevBtnHtml += '<img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_left_401x.png">';
                    prevBtnHtml += '</button>';
                    afterBtnHtml += '<button class="scroll next">';
                    afterBtnHtml += '<img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_right_401x.png">';
                    afterBtnHtml += '</button>';
    
                    $('.wc-carousel > div').prepend(prevBtnHtml);
                    $('.wc-carousel > div').append(afterBtnHtml);

                    $('.scroll.previous').click(function(e){
                        scrollPrevoius();
                        e.stopPropagation();
                        e.preventDefault();
                    })
                    $('.scroll.next').click(function(e){
                        scrollNext();
                        e.stopPropagation();
                        e.preventDefault();
                    })
                }
                
                var dlgHtml = '';
                dlgHtml += '<li class="wc-carousel-item">';
                dlgHtml += '<div class="wc-card hero">';
                dlgHtml += '<div class="wc-container imgContainer">';
                dlgHtml += '<img src="https://bot.hyundai.com/assets/images/style/USP_style_03.jpg">';
                dlgHtml += '</div>';
                //dlgHtml += '<h1>스타일</h1>';
                dlgHtml += '<p class="carousel">'+$('#dialogText').val()+'</p>';
                dlgHtml += '<ul class="wc-card-buttons">';
                for(var i = 0 ; i < $('input[id^="buttonName"]').length ; i ++){
                    if($('#buttonName' + (i+1)).val() != ''){
                        dlgHtml += '<li>';
                        dlgHtml += '<button>'+$('#buttonName' + (i+1)).val()+'</button>';
                        dlgHtml += '</li>';
                    }
                }
                dlgHtml += '</ul>';
                dlgHtml += '</div>';
                dlgHtml += '</li>';

                $('.wc-hscroll > ul').append(dlgHtml);
            }
        }else if(dlgType == '4'){ //media

        }else{
        }

        $('#appInsertForm')[0].reset();
        $('#dlgType').change();

        e.stopPropagation();
        e.preventDefault();
    });

    $("#searchRargeGroup").change(function(){
        var str = "";
        $( "#searchRargeGroup option:selected" ).each(function() {
          str = $( this ).text() + " ";
        });
        selectGroup("searchMediumGroup",str);
    });

    $("#searchMediumGroup").change(function(){
        var str1 = "";
        $( "#searchRargeGroup option:selected" ).each(function() {
          str1 = $( this ).text() + " ";
        });

        var str2 = "";
        $( "#searchMediumGroup option:selected" ).each(function() {
          str2 = $( this ).text() + " ";
        });

        selectGroup("searchSmallGroup",str1,str2);
    });

    $("#searchDialogBtn").on('click',function(){
        searchDialog();
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
                var inputUttrHtml = '';
                inputUttrHtml += '<tr> <td> <div class="check-radio-tweak-wrapper" type="checkbox">';
                inputUttrHtml += '<input name="dlgChk" class="tweak-input"  onclick="" type="checkbox"/> </div> </td>';
                inputUttrHtml += '<td class="txt_left" ><input type="hidden" name="' + data.DLG_ID + '" value="' + data.DLG_ID + '" />' + data.CARD_TEXT + '</td></tr>';
                $('#dlgListTable').find('tbody').prepend(inputUttrHtml);

                $('#addDialogClose').click();
            }
        }
    });
}

var botChatNum = 1; 

function selectDlgListAjax(entity) {
    $.ajax({
        url: '/learning/selectDlgListAjax',                //주소
        dataType: 'json',                  //데이터 형식
        type: 'POST',                      //전송 타입
        data: {'entity':entity},      //데이터를 json 형식, 객체형식으로 전송

        success: function(result) {          //성공했을 때 함수 인자 값으로 결과 값 나옴
            var inputUttrHtml = '';
            for (var i=0; i<result['list'].length; i++) {
                var tmp = result['list'][i];

                for(var j = 0; j < tmp.dlg.length; j++) {
                    if(tmp.dlg[j].DLG_TYPE == 2) {
                        inputUttrHtml += '<div class="wc-message wc-message-from-bot">';
                        inputUttrHtml += '<div class="wc-message-content">';
                        inputUttrHtml += '<svg class="wc-message-callout"></svg>';
                        inputUttrHtml += '<div><div class="format-markdown"><div class="textMent">';
                        inputUttrHtml += '<p>';
                        inputUttrHtml += '<input type="hidden" name="dlgId" value="' + tmp.dlg[j].DLG_ID + '"/>';
                        inputUttrHtml += tmp.dlg[j].CARD_TEXT;
                        inputUttrHtml += '</p>';
                        inputUttrHtml += '</div></div></div></div></div>';
                    } else if(tmp.dlg[j].DLG_TYPE == 3) {
                        
                        if(j == 0) {
                            inputUttrHtml += '<div class="wc-message wc-message-from-bot" style="width:90%">';
                            inputUttrHtml += '<div class="wc-message-content" style="width:90%;">';
                            inputUttrHtml += '<svg class="wc-message-callout"></svg>';
                            inputUttrHtml += '<div class="wc-carousel slideBanner" style="width: 312px;">';
                            inputUttrHtml += '<div>';
                            inputUttrHtml += '<button class="scroll previous" id="prevBtn' + (botChatNum) + '" style="display: none;" onclick="prevBtn(' + botChatNum + ')">';
                            inputUttrHtml += '<img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_left_401x.png">';
                            inputUttrHtml += '</button>';
                            inputUttrHtml += '<div class="wc-hscroll-outer" >';
                            inputUttrHtml += '<div class="wc-hscroll" style="margin-bottom: 0px;" class="content" id="slideDiv' + (botChatNum) + '">';
                            inputUttrHtml += '<ul>';
                            inputUttrHtml += '<input type="hidden" name="dlgId" value="' + tmp.dlg[j].DLG_ID + '"/>';
                        }
                        inputUttrHtml += '<li class="wc-carousel-item">';
                        inputUttrHtml += '<div class="wc-card hero">';
                        inputUttrHtml += '<div class="wc-container imgContainer" >';
                        inputUttrHtml += '<img src="' + tmp.dlg[j].IMG_URL +'">';
                        inputUttrHtml += '</div>';
                        if(tmp.dlg[j].CARD_TITLE != null) {
                            inputUttrHtml += '<h1>' + /*cardtitle*/ tmp.dlg[j].CARD_TITLE + '</h1>';
                        }
                        if(tmp.dlg[j].CARD_TEXT != null) {
                            inputUttrHtml += '<p class="carousel">' + /*cardtext*/ tmp.dlg[j].CARD_TEXT + '</p>';
                        }
                        inputUttrHtml += '<ul class="wc-card-buttons"><li><button>' + /*btntitle*/ tmp.dlg[j].BTN_1_TITLE + '<button></li></ul>';
                        inputUttrHtml += '</div>';
                        inputUttrHtml += '</li>';
                        
                        //다이얼로그가 한개일때에는 오른쪽 버튼 x
                        if(tmp.dlg.length == 1) {
                            inputUttrHtml += '</ul>';
                            inputUttrHtml += '</div>';
                            inputUttrHtml += '</div>';
                            inputUttrHtml += '</div></div></div></div></div>';
                        } else if((tmp.dlg.length-1) == j) {
                            inputUttrHtml += '</ul>';
                            inputUttrHtml += '</div>';
                            inputUttrHtml += '</div>';
                            inputUttrHtml += '<button class="scroll next" id="nextBtn' + (botChatNum) + '" onclick="nextBtn(' + botChatNum + ')"><img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_right_401x.png"></button>';
                            inputUttrHtml += '</div></div></div></div></div>';
                        }
                   
                    } else if(tmp.dlg[j].DLG_TYPE == 4) {
                        inputUttrHtml += '<div class="wc-message wc-message-from-bot">';
                        inputUttrHtml += '<div class="wc-message-content">';
                        inputUttrHtml += '<svg class="wc-message-callout"></svg>';
                        inputUttrHtml += '<div>';
                        inputUttrHtml += '<div class="wc-carousel">';
                        inputUttrHtml += '<div>';
                        inputUttrHtml += '<button class="scroll previous" disabled=""><img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_left_401x.png"></button>';
                        inputUttrHtml += '<div class="wc-hscroll-outer">';
                        inputUttrHtml += '<div class="wc-hscroll" style="margin-bottom: 0px;">';
                        inputUttrHtml += '<ul>';
                        inputUttrHtml += '<li class="wc-carousel-item wc-carousel-play">';
                        inputUttrHtml += '<div class="wc-card hero">';
                        inputUttrHtml += '<div class="wc-card-div imgContainer">';
                        inputUttrHtml += '<input type="hidden" name="dlgId" value="' + tmp.dlg[j].DLG_ID + '"/>';
                        inputUttrHtml += '<img src="' + /* 이미지 url */ tmp.dlg[j].MEDIA_URL + '">';
                        inputUttrHtml += '<div class="playImg"></div>';
                        inputUttrHtml += '<div class="hidden" alt="' + tmp.dlg[j].CARD_TITLE + '"></div>';
                        inputUttrHtml += '<div class="hidden" alt="' + /* media url */ tmp.dlg[j].CARD_VALUE + '"></div>';
                        inputUttrHtml += '</div>';
                        inputUttrHtml += '<h1>' + /* title */ tmp.dlg[j].CARD_TITLE + '</h1>';
                        inputUttrHtml += '<ul class="wc-card-buttons">';
                        inputUttrHtml += '</ul>';
                        inputUttrHtml += '</div>';
                        inputUttrHtml += '</li></ul></div></div>';
                        inputUttrHtml += '<button class="scroll next" disabled=""><img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_right_401x.png"></button>';
                        inputUttrHtml += '</div></div></div></div></div>';
                    }
                }

                //inputUttrHtml += '<tr> <td> <div class="check-radio-tweak-wrapper" type="checkbox">';
                //inputUttrHtml += '<input name="dlgChk" class="tweak-input"  onclick="" type="checkbox"/> </div> </td>';
                //inputUttrHtml += '<td class="txt_left" ><input type="hidden" name="' + tmp.DLG_ID + '" value="' + tmp.DLG_ID + '" />' + tmp.CARD_TEXT + '</td></tr>';
                //inputUttrHtml += '<td class="txt_center" > <a href="#" class="btn btn-small">Add</a> </td></tr>';
            }//<a href="#" class="btn b02  btn-small js-modal-close">Cancel</a>
            //$('#dlgListTable').find('tbody').empty();

            $('#dialogRecommand').prepend(inputUttrHtml);

            botChatNum++;
        } 

    }); // ------      ajax 끝-----------------
}

//오른쪽 버튼 클릭시 슬라이드
function nextBtn(botChatNum) {
    
    $("#slideDiv" + botChatNum).animate({scrollLeft : ($("#slideDiv" + botChatNum).scrollLeft() + 312)}, 500, function(){
       
        if($("#slideDiv" + botChatNum).scrollLeft() == 
                ((Math.ceil($("#slideDiv" + botChatNum).find(".wc-carousel-item").length / 2)) - 1) * 312) {
            $("#nextBtn" + botChatNum).hide();
        }
        
    });

    $("#prevBtn" + botChatNum).show();
}

//왼쪽 버튼 클릭시 슬라이드
function prevBtn(botChatNum) {

    $("#slideDiv" + botChatNum).animate({scrollLeft : ($("#slideDiv" + botChatNum).scrollLeft() - 312)}, 500, function() {
        
        if($("#slideDiv" + botChatNum).scrollLeft() == 0) {
            $("#prevBtn" + botChatNum).hide();
        }
    });
    
    $("#nextBtn" + botChatNum).show();
}

//checkbox 선택시 이벤트 $(this).attr("checked")
$(document).on('click','div[type=checkbox]',function(event){
    
    var checkedVal = false;
    var checkedVal2 = false;

    if (typeof $(this).attr("checked") == 'undefined') {
        $(this).attr("checked", "");
    } else {
        $(this).removeAttr('checked');
    }
    

    $("input[name=ch1]").each(function() {
        if (typeof $(this).parent().attr("checked") != 'undefined') {
            checkedVal = true;
        } 
    });
    changeBtnAble('delete', checkedVal);

    $("input[name=dlgChk]").each(function() {
        if (typeof $(this).parent().attr("checked") != 'undefined') {
            checkedVal2 = true;
        } 
    });

    if(checkedVal == true && checkedVal2 == true) {
        changeBtnAble('learn', true);
    } else {
        changeBtnAble('learn', false);
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
                //var utter = utterHighlight(entities,result['iptUtterance']);
                var utter = utterHighlight(result.commonEntities,result['iptUtterance']);
                var selBox = result['selBox'];

                $('#iptUtterance').val('');
                var inputUttrHtml = '';
                inputUttrHtml += '<tr> <td> <div class="check-radio-tweak-wrapper checkUtter" type="checkbox">';
                inputUttrHtml += '<input name="ch1" class="tweak-input" type="checkbox" onclick="" /> </div> </td>';
                inputUttrHtml += '<td class="txt_left" ><input type=hidden name="entity" value="' + result['entities'] + '"/>' + utter + '</td>';
                if(result.commonEntities){
                    inputUttrHtml += '<tr><td> </td><td class="txt_left" >';
                    for(var i = 0; i < result.commonEntities.length ; i++){
                        inputUttrHtml += '<input type=hidden value="' + result.commonEntities[i].ENTITY_VALUE + '"/>' + result.commonEntities[i].ENTITY_VALUE + '::' + result.commonEntities[i].ENTITY;
                        if(i != result.commonEntities.length - 1 ) {
                            inputUttrHtml += "&nbsp&nbsp";
                        }
                    }
                    inputUttrHtml += '</td></tr>';
                }         
                /*
                if(result.commonEntities){
                    for(var i = 0; i < result.commonEntities.length ; i++){
                        inputUttrHtml += '<tr> <td> </td>';
                        inputUttrHtml += '<td class="txt_left" ><input type=hidden value="' + result.commonEntities[i].ENTITY_VALUE + '"/>' + result.commonEntities[i].ENTITY_VALUE + '::' + result.commonEntities[i].ENTITY + '</td>';
                    }
                }
                */
                //inputUttrHtml += '<td class="txt_right02" >'; 
                //inputUttrHtml += '<select id="intentNameList" name="intentNameList" class="select_box">'
                /*
                if(selBox != null) {
                    for( var i = 0 ; i < selBox.length; i++) {
                        inputUttrHtml += '<option value="' + selBox[i]['LUIS_INTENT'] + '">' + selBox[i]['LUIS_INTENT'] + '</option>'
                    }
                    selectDlgListAjax(selBox[0]['LUIS_INTENT']);
                } else {
                    inputUttrHtml += '<option value="" selected>no intent</option>'
                }

                inputUttrHtml += '</select></td></tr>';
                */
                $('#entityUtteranceTextTable').find('tbody').prepend(inputUttrHtml);

                selectDlgListAjax(entities);
                
            }
        } //function끝

    }); // ------      ajax 끝-----------------
}

function utterHighlight(entities, utter) {
    var result = utter;
    if(entities){
        for(var i = 0; i < entities.length; i++) {
            result = result.replace(entities[i].ENTITY_VALUE, '<span class="highlight">' + entities[i].ENTITY_VALUE + '</span>');
        }
    }
    return result;
}

function selectGroup(selectId,str1,str2) {
    $.ajax({
        url: '/learning/selectGroup',                //주소
        dataType: 'json',                  //데이터 형식
        type: 'POST',
        data: {'selectId':selectId,'selectValue1':str1,'selectValue2':str2},
        success: function(result) {
            var group = result.rows;
            $("#"+selectId).html("");
            if(selectId == "searchRargeGroup") {
                $("#"+selectId).append('<option value="LargeGroup">LargeGroup</option>' );
            } else if(selectId == "searchMediumGroup") {
                $("#"+selectId).append('<option value="MediumGroup">MediumGroup</option>' );
            }
            for(var i = 0; i < group.length; i++){
                $("#"+selectId).append('<option value="' + group[i]['GROUP'] + '">' + group[i]['GROUP'] + '</option>' );
            }
        }
    });
}

//---------------두연 추가

function openModalBox(target){

    // 화면의 높이와 너비를 변수로 만듭니다.
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();

    // 마스크의 높이와 너비를 화면의 높이와 너비 변수로 설정합니다.
    $('.mask').css({'width':maskWidth,'height':maskHeight});


    // 레이어 팝업을 가운데로 띄우기 위해 화면의 높이와 너비의 가운데 값과 스크롤 값을 더하여 변수로 만듭니다.
    var left = ( $(window).scrollLeft() + ( $(window).width() - $(target).width()) / 2 );
    //var top = ( $(window).scrollTop() + ( $(window).height() - $(target).height()) / 2 );

    // css 스타일을 변경합니다.
    $(target).css({'left':left,'top':'25px', 'position':'absolute'});

    // 레이어 팝업을 띄웁니다.
    $(target).show();
    $('#dialogPreview').css({'height':$('#dialogSet').height()});

    $('html').css({'overflow': 'hidden', 'height': '100%'});
        $('#element').on('scroll touchmove mousewheel', function(event) { // 터치무브와 마우스휠 스크롤 방지
            event.preventDefault();
            event.stopPropagation();
            return false;
    });
    wrapWindowByMask();
    selectGroup('searchRargeGroup');
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

function searchDialog() {
    var formData = $("form[name=searchForm]").serialize();
    $.ajax({
        url: '/learning/searchDialog',
        dataType: 'json',
        type: 'POST',
        data: formData,
        success: function(result) {
            var row = [];
            var arrayNum = 0;
            for (var k = 0; k < result['list'].length; k++) {
                if(k != 0 && result['list'][k].RNUM == result['list'][k-1].RNUM) {
                    var num = result['list'][k].DLG_ORDER_NO - 1;
                    arrayNum--;
                    row[arrayNum][num] = result['list'][k];
                    arrayNum++;
                } else{
                    row[arrayNum] = [];
                    row[arrayNum][0] = result['list'][k];
                    arrayNum++;
                }
            }

            var inputUttrHtml = '';
            for (var i = 0; i < row.length; i++) {
                var val = row[i];
                inputUttrHtml += '<tr>';
                inputUttrHtml += '<td>';
                inputUttrHtml += '<div class="check-radio-tweak-wrapper" type="checkbox">';
                inputUttrHtml += '<input name="chsearch" class="tweak-input" type="checkbox"/>';
                inputUttrHtml += '</div>';
                inputUttrHtml += '</td>';
                inputUttrHtml += '<td>';
                inputUttrHtml += '<table class="Tbl" width="100%" height="20px">';
                inputUttrHtml += '<thead>';
                inputUttrHtml += '<tr bgcolor="#e7e7e7">';
                for(var l = 0; l < val.length; l++){
                    var tmp = val[l];
                    inputUttrHtml += '<td>';
                    for(var j = 0; j < tmp.dlg.length; j++) {
                        if(tmp.dlg[j].DLG_TYPE == 2) {
                            inputUttrHtml += '<div class="wc-message wc-message-from-bot" style="width:200px">';
                            inputUttrHtml += '<div class="wc-message-content">';
                            inputUttrHtml += '<svg class="wc-message-callout"></svg>';
                            inputUttrHtml += '<div><div class="format-markdown"><div class="textMent">';
                            inputUttrHtml += '<p>';
                            inputUttrHtml += '<input type="hidden" name="dlgId" value="' + tmp.dlg[j].DLG_ID + '"/>';
                            inputUttrHtml += tmp.dlg[j].CARD_TEXT;
                            inputUttrHtml += '</p>';
                            inputUttrHtml += '</div></div></div></div></div>';
                        } else if(tmp.dlg[j].DLG_TYPE == 3) {
                            if(j == 0) {
                                inputUttrHtml += '<div class="wc-message wc-message-from-bot" style="margin-bottom:0px">';
                                inputUttrHtml += '<div class="wc-message-content">';
                                inputUttrHtml += '<svg class="wc-message-callout"></svg>';
                                inputUttrHtml += '<div class="wc-carousel slideBanner" style="width: 312px;">';
                                inputUttrHtml += '<div>';
                                inputUttrHtml += '<button class="scroll previous" id="prevBtn' + (botChatNum) + '" style="display: none;" onclick="prevBtn(' + botChatNum + ')">';
                                inputUttrHtml += '<img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_left_401x.png">';
                                inputUttrHtml += '</button>';
                                inputUttrHtml += '<div class="wc-hscroll-outer" >';
                                inputUttrHtml += '<div class="wc-hscroll" style="margin-bottom: 0px;" class="content" id="slideDiv' + (botChatNum) + '">';
                                inputUttrHtml += '<ul>';
                                inputUttrHtml += '<input type="hidden" name="dlgId" value="' + tmp.dlg[j].DLG_ID + '"/>';
                            }
                            inputUttrHtml += '<li class="wc-carousel-item">';
                            inputUttrHtml += '<div class="wc-card hero">';
                            inputUttrHtml += '<div class="wc-container imgContainer" >';
                            inputUttrHtml += '<img src="' + tmp.dlg[j].IMG_URL +'">';
                            inputUttrHtml += '</div>';
                            if(tmp.dlg[j].CARD_TITLE != null) {
                                inputUttrHtml += '<h1>' + /*cardtitle*/ tmp.dlg[j].CARD_TITLE + '</h1>';
                            }
                            if(tmp.dlg[j].CARD_TEXT != null) {
                                inputUttrHtml += '<p class="carousel" style="height:20px;min-height:20px;">' + /*cardtext*/ tmp.dlg[j].CARD_TEXT + '</p>';
                            }
                            if(tmp.dlg[j].BTN_1_TITLE != null) {
                                inputUttrHtml += '<ul class="wc-card-buttons"><li><button>' + /*btntitle*/ tmp.dlg[j].BTN_1_TITLE + '</button></li></ul>';
                            }
                            inputUttrHtml += '</div>';
                            inputUttrHtml += '</li>';
                            
                            //다이얼로그가 한개일때에는 오른쪽 버튼 x
                            if(tmp.dlg.length == 1) {
                                inputUttrHtml += '</ul>';
                                inputUttrHtml += '</div>';
                                inputUttrHtml += '</div>';
                                inputUttrHtml += '</div></div></div></div></div>';
                            } else if((tmp.dlg.length-1) == j) {
                                inputUttrHtml += '</ul>';
                                inputUttrHtml += '</div>';
                                inputUttrHtml += '</div>';
                                inputUttrHtml += '<button class="scroll next" id="nextBtn' + (botChatNum) + '" onclick="nextBtn(' + botChatNum + ')"><img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_right_401x.png"></button>';
                                inputUttrHtml += '</div></div></div></div></div>';
                            }
                        } else if(tmp.dlg[j].DLG_TYPE == 4) {
                            inputUttrHtml += '<div class="wc-message wc-message-from-bot">';
                            inputUttrHtml += '<div class="wc-message-content">';
                            inputUttrHtml += '<svg class="wc-message-callout"></svg>';
                            inputUttrHtml += '<div>';
                            inputUttrHtml += '<div class="wc-carousel">';
                            inputUttrHtml += '<div>';
                            inputUttrHtml += '<button class="scroll previous" disabled=""><img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_left_401x.png"></button>';
                            inputUttrHtml += '<div class="wc-hscroll-outer">';
                            inputUttrHtml += '<div class="wc-hscroll" style="margin-bottom: 0px;">';
                            inputUttrHtml += '<ul style="min-width:0px">';
                            inputUttrHtml += '<li class="wc-carousel-item wc-carousel-play">';
                            inputUttrHtml += '<div class="wc-card hero" style="width:70%">';
                            inputUttrHtml += '<div class="wc-card-div imgContainer">';
                            inputUttrHtml += '<input type="hidden" name="dlgId" value="' + tmp.dlg[j].DLG_ID + '"/>';
                            inputUttrHtml += '<img src="' + /* 이미지 url */ tmp.dlg[j].MEDIA_URL + '">';
                            inputUttrHtml += '<div class="playImg"></div>';
                            inputUttrHtml += '<div class="hidden" alt="' + tmp.dlg[j].CARD_TITLE + '"></div>';
                            inputUttrHtml += '<div class="hidden" alt="' + /* media url */ tmp.dlg[j].CARD_VALUE + '"></div>';
                            inputUttrHtml += '</div>';
                            inputUttrHtml += '<h1>' + /* title */ tmp.dlg[j].CARD_TITLE + '</h1>';
                            inputUttrHtml += '<ul class="wc-card-buttons">';
                            inputUttrHtml += '</ul>';
                            inputUttrHtml += '</div>';
                            inputUttrHtml += '</li></ul></div></div>';
                            inputUttrHtml += '<button class="scroll next" disabled=""><img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_right_401x.png"></button>';
                            inputUttrHtml += '</div></div></div></div></div>';
                        }
                    }
                    inputUttrHtml += '</td>';

                }
                inputUttrHtml += '</tr>';
                inputUttrHtml += '</thead>';
                inputUttrHtml += '</table>';
                inputUttrHtml += '</td>';
                inputUttrHtml += '</tr>';
            }

            $('#searchListTbl tbody').prepend(inputUttrHtml);
            var rowPerPage = $('[name="rowPerPage"]').val() * 1;// 1 을  곱하여 문자열을 숫자형로 변환

            //		console.log(typeof rowPerPage);
            
                var zeroWarning = 'Sorry, but we cat\'t display "0" rows page. + \nPlease try again.'
                if (!rowPerPage) {
                    alert(zeroWarning);
                    return;
                }
                $('#nav').remove();
                var $products = $('#searchListTbl');
            
                $products.after('<div id="nav">');
            
            
                var $tr = $($products).children('tbody').children('tr');
                var rowTotals = $tr.length;
            //	console.log(rowTotals);
            
                var pageTotal = Math.ceil(rowTotals/ rowPerPage);
                var i = 0;
            
                for (; i < pageTotal; i++) {
                    $('<a href="#"></a>')
                            .attr('rel', i)
                            .html(i + 1)
                            .appendTo('#nav');
                }
            
                $tr.addClass('off-screen')
                        .slice(0, rowPerPage)
                        .removeClass('off-screen');
            
                var $pagingLink = $('#nav a');
                $pagingLink.on('click', function (evt) {
                    evt.preventDefault();
                    var $this = $(this);
                    if ($this.hasClass('active')) {
                        return;
                    }
                    $pagingLink.removeClass('active');
                    $this.addClass('active');
            
                    // 0 => 0(0*4), 4(0*4+4)
                    // 1 => 4(1*4), 8(1*4+4)
                    // 2 => 8(2*4), 12(2*4+4)
                    // 시작 행 = 페이지 번호 * 페이지당 행수
                    // 끝 행 = 시작 행 + 페이지당 행수
            
                    var currPage = $this.attr('rel');
                    var startItem = currPage * rowPerPage;
                    var endItem = startItem + rowPerPage;
            
                    $tr.css('opacity', '0.0')
                            .addClass('off-screen')
                            .slice(startItem, endItem)
                            .removeClass('off-screen')
                            .animate({opacity: 1}, 300);
            
                });
            
                $pagingLink.filter(':first').addClass('active');
            
        },
        error:function(e){  
            alert(e.responseText);  
        }  
    });
}