




// Utterance 삭제
$(document).on('click', '#utterDelete', function() {
    $(this).parent().parent().next().remove();
    $(this).parent().parent().remove();

    $('#dialogRecommand').html("");
    $('input[name=ch1All]').parent().attr('checked', false);

    if ($('.clickUtter').length < 1) {
        $('#nav').remove();
    }
    changeBtnAble(false);
    /*
    $('.checkUtter').each(function(){
        if($(this).attr('checked') == 'checked') {
            //$('#entityUtteranceTextTable tbody').html('');
            var delVal = $(this).parent().next().find('input[name=entity]').val();
            var sameUtterCnt = 0;
            $('.clickUtter').each(function(){
                var utterVal = $(this).find('input[name=entity]').val();
                if (delVal === utterVal) {
                    sameUtterCnt++;
                }
            });
            if (sameUtterCnt < 2) {
                delete dlgMap[delVal];
            }

            $(this).parent().parent().next().remove();
            $(this).parent().parent().remove();
        }
    });
    */
});


$(document).ready(function(){

    //add eneity mordal save btn check
    $('#entityDefine, #entityValue').on('input',function(e){
        if( $('#entityDefine').val() !== "" &&  $('#entityValue').val() !== "") {
            $('#btnAddEntity').removeClass('disable');
            $('#btnAddEntity').prop("disabled", false);
        } else {
            $('#btnAddEntity').addClass('disable');
            $('#btnAddEntity').prop("disabled", true);
        }   
    });

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

            //$("#entityUtteranceTextTable tbody").html("");
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

    

    //다이얼로그 생성 모달 닫는 이벤트(초기화)
    $(".js-modal-close").click(function() {
        $('html').css({'overflow': 'auto', 'height': '100%'}); //scroll hidden 해제
        $('#layoutBackground').hide();

        //$('#element').off('scroll touchmove mousewheel'); // 터치무브 및 마우스휠 스크롤 가능

        //$('#appInsertDes').val('');
        //$("#intentList option:eq(0)").attr("selected", "selected");
        //$('#intentList').find('option:first').attr('selected', 'selected');
        //initMordal('intentList', 'Select Intent');
        //initMordal('entityList', 'Select Entity');
        //$('#dlgLang').find('option:first').attr('selected', 'selected');
        //$('#dlgOrder').find('option:first').attr('selected', 'selected');
    });
    //add entity mordal close event
    $('#addEntityClose , #addEntityCancel').click(function(){
        $('#layoutBackground').css('display','none');
        $('#entityDefine').val("");  
        $('#entityValue').val("");
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
        //changeBtnAble('delete', checkedVal);
    });

	$('#addDialogClose , #addDialogCancel').click(function(){
        $('#mediaCarouselLayout').css('display','none');
        $('#cardLayout').css('display','none');
        $('#appInsertForm')[0].reset();
        $('.insertForm').remove();
        var insertForm = '';
        insertForm += '<div class="insertForm" style="border-bottom:1px solid rgb(43, 111, 189);">';
        insertForm += '<form name="dialogLayout" id="dialogLayout">';
        insertForm += '<p class="texcon03">Dialogue Type <span>(required) </span></p>';
        insertForm += '<p><select name="dlgType" class="inbox02" id="dlgType" style="width:95%" >';
        insertForm += '<option value="2" selected>Text</option>';
        insertForm += '<option value="3">Carousel</option>';
        insertForm += '<option value="4">Media</option>';
        insertForm += '</select></p>';
        insertForm += '<div class="clear-both"></div>';
        insertForm += '</form>';
        insertForm += '</div>';
        
        $('#apiLayout').css('display', 'none');
        $('#commonLayout').css('display', 'block');
        $('#commonLayout div:first').prepend(insertForm);
        $('#dialogPreview').html('<div class="dialogView"><div><div class="wc-message wc-message-from-bot" style="width:80%;"><div class="wc-message-content"><svg class="wc-message-callout"></svg><div><div class="format-markdown"><div class="textMent"><p>입력해주세요...</p></div></div></div></div></div></div></div>');
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

    // 소스 타입 변경
    $('#sourceType').change(function(e){
        if($(e.target).val() == "API") {
            $('#dialogPreview').html('');
            $('#commonLayout').css('display','none');
            $('#apiLayout').css('display','block');
        } else {

            $('.insertForm').remove();

            var insertForm = '';
            insertForm += '<div class="insertForm" style="border-bottom:1px solid rgb(43, 111, 189);">';
            insertForm += '<p class="texcon03">Dialogue Type <span>(required) </span></p>';
            insertForm += '<p><select name="dlgType" class="inbox02" id="dlgType" style="width:95%" >';
            insertForm += '<option value="2" selected>Text</option>';
            insertForm += '<option value="3">Carousel</option>';
            insertForm += '<option value="4">Media</option>';
            insertForm += '</select></p>';
            insertForm += '<div class="clear-both"></div>';
            insertForm += '<p class="texcon03">Dialogue Text  <span>(required) </span></p>';
            insertForm += '<p><textarea name="dialogText" id="dialogText" cols="" rows="3" style="width:95%; resize:none;" placeholder="Input text.." onkeyup="writeDialog(this);" onkeyup="dialogValidation("dialogInsert");"></textarea></p>';
            insertForm += '</div>';
    
            $('#commonLayout div:first').prepend(insertForm);
            $('#dialogPreview').html('<div class="dialogView"><div><div class="wc-message wc-message-from-bot" style="width:80%;"><div class="wc-message-content"><svg class="wc-message-callout"></svg><div><div class="format-markdown"><div class="textMent"><p>입력해주세요...</p></div></div></div></div></div></div></div>');

            $('#commonLayout').css('display','block');
            $('#apiLayout').css('display','none');
        }
    });
    
// 타입 변경시 버튼, 이미지 관련 input 생성 및 삭제
/*
    $('#dlgType').change(function(e){
        var idx = $('#dlgType').index(this);


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
*/

    // create LargeGroup
    $('#btnCreateLgroup').on('click',function(){
        if($(this).html() == "new") {
            $(this).html('cancel');
            $(this).css('margin','6px 0 0 55px');
            $('#largeGroupEdit').css('display','block');
            $('#largeGroup').css('display','none');
        } else {
            $(this).html('new');
            $(this).css('margin','6px 0 0 65px');
            $('#largeGroupEdit').css('display','none');
            $('#largeGroup').css('display','block');
        }
        return;
    });
    
    //다이얼로그 Add From
    $('#addDialogBtn').click(function(e){
        //$(".insertForm:eq(0)").clone(true).appendTo(".copyForm");
        //$(".copyForm textarea[name=dialogText]:last").val('');

        var insertForm = '';
        insertForm += '<div class="insertForm" style="border-bottom:1px solid rgb(43, 111, 189);">';
        insertForm += '<form name="dialogLayout" id="dialogLayout">';
        insertForm += '<p class="texcon03">Dialogue Type <span>(required) </span></p>';
        insertForm += '<p><select name="dlgType" class="inbox02" id="dlgType" style="width:95%" >';
        insertForm += '<option value="2" selected>Text</option>';
        insertForm += '<option value="3">Carousel</option>';
        insertForm += '<option value="4">Media</option>';
        insertForm += '</select></p>';
        insertForm += '<div class="clear-both"></div>';
        insertForm += '<div id="textLayout" style="display:block;">';
        insertForm += '<p class="texcon03">Dialogue Title <span>(required) </span></p>';
        insertForm += '<p><input name="dialogTitle" type="text" class="inbox02" id="imgUrl" style="width:95%" placeholder="Input image url.." onkeyup="writeDialogTitle(this);" /></p>';
        insertForm += '<p class="texcon03">Dialogue Text  <span>(required) </span></p>';
        insertForm += '<p><textarea name="dialogText" id="dialogText" cols="" rows="2" style="width:95%; resize:none;" placeholder="Input text.." onkeyup="writeDialog(this);" onkeyup="dialogValidation("dialogInsert");"></textarea></p>';
        insertForm += '</div>';
        insertForm += '</form>';
        insertForm += '</div>';

        $(".insertForm:last").after(insertForm);
        
        var insertHtml = '';
        insertHtml += '<div class="dialogView">';
        insertHtml += '<div class="wc-message wc-message-from-bot" style="width:80%;">';
        insertHtml += '<div class="wc-message-content">';
        insertHtml += '<svg class="wc-message-callout"></svg>';
        insertHtml += '<div><div class="format-markdown"><div class="textMent">';
        insertHtml += '<p>';
        insertHtml += '입력해주세요...';
        insertHtml += '</p>';
        insertHtml += '</div></div></div></div></div>';
        insertHtml += '</div>';

        $("#dialogPreview").append(insertHtml);
        e.stopPropagation();
        e.preventDefault();
        
    });


    //다이얼로그 Add
    /*$('#addDialogBtn').click(function(e){
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
    */

    $("#searchLargeGroup").change(function(){
        var str = "";
        $( "#searchLargeGroup option:selected" ).each(function() {
          str = $( this ).text() + " ";
        });
        selectGroup("searchMediumGroup",str);
    });

    $("#searchMediumGroup").change(function(){
        var str1 = "";
        $( "#searchLargeGroup option:selected" ).each(function() {
          str1 = $( this ).text() + " ";
        });

        var str2 = "";
        $( "#searchMediumGroup option:selected" ).each(function() {
          str2 = $( this ).text() + " ";
        });

        selectGroup("searchSmallGroup",str1,str2);
    });

    $("#searchDialogBtn").on('click',function(){

        if($('input[name=serachDlg]').val() == '' && $('#searchLargeGroup').val() == '') {
            alert('검색어 또는 그룹을 선택해주세요');
        } else {
            searchDialog();
        }
        $("#searchDlgResultDiv").html("");

        
    });

    $("#searchDialogClose").on('click',function(){
        $("#searchDialogCancel").click();
    });

    $("#searchDialogCancel").on('click',function(){
        $('input[name=serachDlg]').val('');
        $('#searchDlgResultDiv').html('');
    });

});


//utter td 클릭
$(document).on('click','.clickUtter',function(event){
    var utter = $(this).find('input[name=entity]').val();
    $('#dialogRecommand').html(dlgMap[utter]);
});

//intent selbox 선택
$(document).on('change','#intentNameList',function(event){
    selectDlgListAjax($("#intentNameList option:selected").val());
});

$(document).on('change','select[name=dlgType]',function(e){
    var idx = $("select[name=dlgType]").index(this);
    var insertHtml = "";

    $('.insertForm:eq(' + idx + ') #carouselLayout').remove();
    $('.insertForm:eq(' + idx + ') #mediaLayout').remove();
    $('.insertForm:eq(' + idx + ')').find('.clear-both').each(function( index) {
        if ( index != 0 ) {
            $(this).next().remove();
            $(this).remove();
        } 
    });

    if($(e.target).val() == "2") {

    } else if($(e.target).val() == "3") {
        //var $clone = $('#carouselLayout').clone();  <div id="carouselLayout" style="display: block;">[object Object]</div>
        var caraousHtml = '<div id="carouselLayout" style="display: block;">' + $carouselForm.html() + '</div>'
        $('.insertForm:eq(' + idx + ') form').append('<div id="carouselLayout" style="display:none;">' + caraousHtml + '</div>') ;
        $('.insertForm:eq(' + idx + ') #carouselLayout').css('display', 'block');
        $('.insertForm:eq(' + idx + ') #carouselLayout').find('a[name=addCarouselBtn]:last').closest('div').css('display', 'inline-block');
    } else if($(e.target).val() == "4") {
        var $clone = $('#mediaLayout').clone();
        $('.insertForm:eq(' + idx + ') form').append($clone);
        $('.insertForm:eq(' + idx + ') #mediaLayout').css('display', 'block');
    }

    if($(e.target).val() == "2") {
        $(".dialogView").eq(idx).html('');
        insertHtml += '<div class="wc-message wc-message-from-bot" style="width:80%;">';
        insertHtml += '<div class="wc-message-content">';
        insertHtml += '<svg class="wc-message-callout"></svg>';
        insertHtml += '<div><div class="format-markdown"><div class="textMent">';
        insertHtml += '<p>';
        insertHtml += '입력해주세요...';
        insertHtml += '</p>';
        insertHtml += '</div></div></div></div></div>';

        $(".dialogView").eq(idx).html(insertHtml);
    } else if($(e.target).val() == "3") {
        $(".dialogView").eq(idx).html('');
        insertHtml += '<div class="wc-message wc-message-from-bot" style="width:90%">';
        insertHtml += '<div class="wc-message-content" style="width:90%;">';
        insertHtml += '<svg class="wc-message-callout"></svg>';
        insertHtml += '<div class="wc-carousel slideBanner" style="width: 312px;">';
        insertHtml += '<div>';
        insertHtml += '<button class="scroll previous" id="prevBtn' + (idx) + '" style="display: none; height: 30px;" onclick="prevBtn(' + idx + ')">';
        insertHtml += '<img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_left_401x.png">';
        insertHtml += '</button>';
        insertHtml += '<div class="wc-hscroll-outer" >';
        insertHtml += '<div class="wc-hscroll" style="margin-bottom: 0px;" class="content" id="slideDiv' + (idx) + '">';
        insertHtml += '<ul>';
        insertHtml += '<li class="wc-carousel-item">';
        insertHtml += '<div class="wc-card hero">';
        insertHtml += '<div class="wc-container imgContainer">';
        insertHtml += '<img src="https://bot.hyundai.com/assets/images/movieImg/teasure/02_teaser.jpg">';
        insertHtml += '</div>';
        insertHtml += '<h1>CARD_TITLE</h1>';
        insertHtml += '<p class="carousel">CARD_TEXT</p>';
        insertHtml += '<ul class="wc-card-buttons"><li><button>BTN_1_TITLE</button></li></ul>';
        insertHtml += '</div>';
        insertHtml += '</li>';
        /*
        insertHtml += '<li class="wc-carousel-item">';
        insertHtml += '<div class="wc-card hero">';
        insertHtml += '<div class="wc-container imgContainer">';
        insertHtml += '<img src="https://bot.hyundai.com/assets/images/movieImg/teasure/02_teaser.jpg">';
        insertHtml += '</div>';
        insertHtml += '<h1>CARD_TITLE</h1>';
        insertHtml += '<p class="carousel">CARD_TEXT</p>';
        insertHtml += '<ul class="wc-card-buttons"><li><button>BTN_1_TITLE</button></li></ul>';
        insertHtml += '</div>';
        insertHtml += '</li>';
        */
        insertHtml += '</ul>';
        insertHtml += '</div>';
        insertHtml += '</div>';
        insertHtml += '<button class="scroll next" style="display: none; height: 30px;" id="nextBtn' + (idx) + '" onclick="nextBtn(' + idx + ')"><img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_right_401x.png"></button>';
        insertHtml += '</div></div></div></div>';
        $(".dialogView").eq(idx).html(insertHtml);
    } else if($(e.target).val() == "4") {
        $(".dialogView").eq(idx).html('');
        insertHtml += '<div class="wc-message wc-message-from-bot">';
        insertHtml += '<div class="wc-message-content">';
        insertHtml += '<svg class="wc-message-callout"></svg>';
        insertHtml += '<div>';
        insertHtml += '<div class="wc-carousel">';
        insertHtml += '<div>';
        insertHtml += '<button class="scroll previous" disabled=""><img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_left_401x.png"></button>';
        insertHtml += '<div class="wc-hscroll-outer">';
        insertHtml += '<div class="wc-hscroll" style="margin-bottom: 0px;">';
        insertHtml += '<ul>';
        insertHtml += '<li class="wc-carousel-item wc-carousel-play">';
        insertHtml += '<div class="wc-card hero">';
        insertHtml += '<div class="wc-card-div imgContainer">';
        insertHtml += '<input type="hidden" name="dlgId" value="dlg_id"/>';
        insertHtml += '<img src="https://bot.hyundai.com/assets/images/convenience/USP_convenience_09.jpg">';
        insertHtml += '<div class="playImg"></div>';
        insertHtml += '<div class="hidden" alt="card_title"></div>';
        insertHtml += '<div class="hidden" alt="card_value"></div>';
        insertHtml += '</div>';
        insertHtml += '<h1>media title</h1>';
        insertHtml += '<ul class="wc-card-buttons">';
        insertHtml += '</ul>';
        insertHtml += '</div>';
        insertHtml += '</li></ul></div></div>';
        insertHtml += '<button class="scroll next" disabled=""><img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_right_401x.png"></button>';
        insertHtml += '</div></div></div></div></div>';

        $(".dialogView").eq(idx).html(insertHtml);
    }
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
function writeDialogTitle(e) {

    //var idx = $('input[name=dialogTitle]').index(e);
    var idx = $('#commonLayout .insertForm').index($(e).parents('.insertForm'));
    var icx = $('#commonLayout').find('.insertForm').index($(e).parents('.insertForm'));
    var jcx = $(e).parents('.insertForm').find('input[name=dialogTitle]').index(e);

    if($(e).parents('.insertForm').find('select[name=dlgType]').val() == 3) {
        //$('.dialogView:eq(' + idx + ') .carousel').html(e.value);
        $('#dialogPreview').children().eq(icx).find('ul:eq(0)').children().eq(jcx).find('h1').text(e.value);
    } else if($(e).parents('.insertForm').find('select[name=dlgType]').val() == 4) {
        $('#dialogPreview').children().eq(icx).find('h1').html(e.value);
        //$('.dialogView h1').eq(idx).html(e.value);
    } else {
        //$('#dialogPreview').children().eq(icx).find('.textMent p').html(e.value);
    }
}

$(document).on('change','.insertForm #mediaLayout input[name=imgUrl]',function(e){
    var idx = $(".insertForm #mediaLayout input[name=imgUrl]").index(this);
    $('.dialogView .wc-card-div img:eq(' + idx + ')').attr("src",$(e.target).val());
});


function writeCarouselImg(e) {
    var icx = $('#commonLayout').find('.insertForm').index($(e).parents('.insertForm'));
    var jcx = $(e).parents('.insertForm').find('input[name=imgUrl]').index(e);

    $('#dialogPreview').children().eq(icx).find('ul:eq(0)').children().eq(jcx).find('.imgContainer img').attr("src",e.value);
}

function writeDialog(e) {
    //var idx = $('textarea[name=dialogText]').index(e);
    
    var idx = $('#commonLayout .insertForm').index($(e).parents('.insertForm'));
    var icx = $('#commonLayout').find('.insertForm').index($(e).parents('.insertForm'));
    //var jcx = $(e).parents('.insertForm').find('input[name=dialogTitle]').index(e);
    
    if($(e).parents('.insertForm').find('select[name=dlgType]').val() == 3) {
        //$('.dialogView:eq(' + idx + ') .carousel').html(e.value);
        //var icx = $('#commonLayout').find('.insertForm').index($(e).parents('.insertForm'));
        var jcx = $(e).parents('.insertForm').find('textarea[name=dialogText]').index(e);
        $('#dialogPreview').children().eq(icx).find('ul:eq(0)').children().eq(jcx).find('p').text(e.value);
    } else if($(e).parents('.insertForm').find('select[name=dlgType]').val() == 4) {
        $('.dialogView h1').eq(idx).html(e.value);
    } else {
        //$('.dialogView .textMent p:eq(' + idx + ')').html(e.value);
        //$('#dialogPreview').children().eq(icx).find('.textMent p:eq(' + idx + ')').html(e.value);
        $('#dialogPreview').children().eq(icx).find('.textMent p').html(e.value);
    }

    //캐러졀 용
    /*
    if ( $(e).parents('.insertForm').find('select[name=dlgType]').val() == 3 ) {
        var icx = $('#commonLayout').find('.insertForm').index($(e).parents('.insertForm'));
        var jcx = $(e).parents('.insertForm').find('textarea[name=dialogText]').index(e);

        $('#dialogPreview').children().eq((1)).find('ul:eq(0)').children().eq(1).find('p').text(e.value);
    }
    */
    
    
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

function createDialog(){

    var entity = $('input[name=entity]').val();
    var idx = $('form[name=dialogLayout]').length;
    var array = [];
    var exit = false;
    if ($('#description').val().trim() === "" ) {
        alert("description을 입력해야 합니다.");
        return false;
    }
    $('.insertForm input[name=dialogTitle]').each(function(index) {
        if ($(this).val().trim() === "") {
            alert("Dialog Title을 입력해야 합니다.");
            exit = true;
            return false;
        }
    });
    if(exit) return;
    $('.insertForm textarea[name=dialogText]').each(function(index) {
        if ($(this).val().trim() === "") {
            alert("Dialog Text을 입력해야 합니다.");
            exit = true;
            return false;
        }
    });
    if(exit) return;
    $('.insertForm input[name=imgUrl]').each(function(index) {
        if ($(this).val().trim() === "") {
            alert("Image URL을 입력해야 합니다.");
            exit = true;
            return false;
        }
    });
    if(exit) return;


    for(var i = 0 ; i < idx ; i++) {
        var tmp = $("form[name=dialogLayout]").eq(i).serializeArray();
        var object  = {};
        var carouselArr = [];
        var objectCarousel = {};
        if (tmp[0].value === "3") {
            for (var j = 1; j < tmp.length; j++) {
                if (typeof objectCarousel[tmp[j].name] !== "undefined" || j === tmp.length-1) {
                    carouselArr.push(objectCarousel);
                    objectCarousel = {};
                } 
                object[tmp[0].name] = tmp[0].value;
                objectCarousel[tmp[j].name] = tmp[j].value;
            }
            object['carouselArr'] = carouselArr;
        } else {
            for (var j = 0; j < tmp.length; j++) {
                object[tmp[j].name] = tmp[j].value;
            }
        }
        
        array[i] = JSON.stringify(object);//JSON.stringify(tmp);//tmp.substring(1, tmp.length-2);
    }
    //JSON.stringify($("form[name=appInsertForm]").serializeObject());
    array[array.length] = JSON.stringify($("form[name=appInsertForm]").serializeObject());//JSON.stringify($("form[name=appInsertForm]"));

    $.ajax({
        url: '/learning/addDialog',
        dataType: 'json',
        type: 'POST',
        data: {'data' : array, 'entity' : entity},
        success: function(data) {
            alert('success');

            var createDlgClone = $('#dialogPreview .dialogView').children().clone();          
            $('#dialogRecommand').html('');
            $('#dialogRecommand').append(createDlgClone);
            $('#addDialogCancel').click();
        }
    });
}

var botChatNum = 1; 
//dlg 저장
var dlgMap = new Object();
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
                        if(tmp.dlg.length == 2 && j == 1) {
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

            //dlg 기억.
            var utter ="";
            for (var i=0; i<entity.length; i++) {
                utter += entity[i] + ",";
            }
            utter = utter.substr(0, utter.length-1);
            dlgMap[utter] = inputUttrHtml;

            botChatNum++;
        } 

    }); // ------      ajax 끝-----------------
}

//오른쪽 버튼 클릭시 슬라이드
function nextBtn(botChatNum) {
    
    $("#slideDiv" + botChatNum).animate({scrollLeft : ($("#slideDiv" + botChatNum).scrollLeft() + 312)}, 500, function(){

        if($("#slideDiv" + botChatNum).scrollLeft() == 
                ($("#slideDiv" + botChatNum).find(".wc-carousel-item").length - 2) * 156) {
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
    //changeBtnAble('delete', checkedVal);

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
            //$('#utterDelete').attr("disabled", "disabled");
            //$('#utterDelete').addClass("disable");   
        } else {
            //$('#utterDelete').removeAttr('disabled');
            //$('#utterDelete').removeClass("disable");
        }
    }
}


function utterInput(queryText) {
    var queryTextArr = [];
    if (typeof queryText === 'string') {
        queryTextArr[0] = queryText;
    } else {  //'object'
        queryTextArr = queryText.reverse();
    }


    $.ajax({
        url: '/learning/utterInputAjax',                //주소
        dataType: 'json',                  //데이터 형식
        type: 'POST',                      //전송 타입
        data: {'iptUtterance': queryTextArr},      //데이터를 json 형식, 객체형식으로 전송

        success: function(result) {          //성공했을 때 함수 인자 값으로 결과 값 나옴
            var entities = result['entities'];
            for (var k=0; k< queryTextArr.length; k++) {

                
                if(entities[k] != null) {
                    entities[k] = entities[k].split(",");
                }else{
                    entities[k] = [];
                }
    
                if ( result['result'] == true ) {
                    //var utter = utterHighlight(entities,result['iptUtterance']);
                    var utter = utterHighlight(result.commonEntities[k],result['iptUtterance'][k]);
                    var selBox = result['selBox'];
    
                    $('#iptUtterance').val('');
                    var inputUttrHtml = '';
                    inputUttrHtml += '<tr><input type="hidden" name="hiddenUtter" value="' + queryText + '"/> <td> <div class="check-radio-tweak-wrapper checkUtter" type="checkbox">';
                    inputUttrHtml += '<input name="ch1" class="tweak-input" type="checkbox" onclick="" /> </div> </td>';
                    inputUttrHtml += '<td class="txt_left clickUtter"><input type=hidden name="entity" value="' + result['entities'][k] + '"/>' + utter + '</td>';
                    inputUttrHtml += '<td class="txt_right"><button class="btn_delete" id="utterDelete" style="width: 19px; margin: 0 5px 0 0;"></button></td>';
                    inputUttrHtml += '<tr><td></td><td class="txt_left" >';
                    
                    if(result.commonEntities[k]){
                        for(var i = 0; i < result.commonEntities[k].length ; i++){
                            var commonTmp = result.commonEntities[k];
                            inputUttrHtml += '<input type=hidden value="' + commonTmp[i].ENTITY_VALUE + '"/>' + commonTmp[i].ENTITY_VALUE + '::' + commonTmp[i].ENTITY;
                            if(i != commonTmp[i].length - 1 ) {
                                inputUttrHtml += "&nbsp&nbsp";
                            }
                        }
                    }else{
                        inputUttrHtml += '엔티티 없음';
                    }
                    inputUttrHtml += '</td><td></td></tr>';
             
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
    
                    selectDlgListAjax(entities[k]);
    
                    var rowPerPage = $('[name="dlgRowPerPage"]').val() * 1;// 1 을  곱하여 문자열을 숫자형로 변환
    
                    //		console.log(typeof rowPerPage);
                    
                        var zeroWarning = 'Sorry, but we cat\'t display "0" rows page. + \nPlease try again.'
                        if (!rowPerPage) {
                            alert(zeroWarning);
                            return;
                        }
                        $('#nav').remove();
                        var $products = $('#entityUtteranceTextTable');
                    
                        $products.after('<div id="nav" style="text-align:center">');
                    
                    
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
                    
                }
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
            if(selectId == "searchLargeGroup") {
                $("#"+selectId).append('<option value="">largeGroup</option>');
                $('#searchMediumGroup').html("");
                $('#searchSmallGroup').html("");
                $('#searchMediumGroup').append('<option value="">mediumGroup</option>');
                $('#searchSmallGroup').append('<option value="">smallGroup</option>');
            } else if(selectId == "searchMediumGroup") {
                $("#"+selectId).append('<option value="">mediumGroup</option>' );
                $('#searchSmallGroup').html("");
                $('#searchSmallGroup').append('<option value="">smallGroup</option>');
            } else {
                $('#searchSmallGroup').append('<option value="">smallGroup</option>');
            }
            for(var i = 0; i < group.length; i++){
                $("#"+selectId).append('<option value="' + group[i]['GROUP'] + '">' + group[i]['GROUP'] + '</option>' );
            }
        }
    });
}

//---------------두연 추가
var $insertForm;
var $dlgForm;
var $carouselForm;
function openModalBox(target){

    /*
    if ($('div[checked=checked]').length !== 1) {
        alert('Utterance를 1개 선택해야 합니다.');
        return;
    }
    */

    //carousel clone 초기값 저장
    $insertForm = $('#commonLayout .insertForm').eq(0).clone();
    $dlgForm = $('#commonLayout #textLayout').eq(0).clone();
    $carouselForm = $('#commonLayout #carouselLayout').eq(0).clone();


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

    if(target == "#create_dlg") {
        $(".insertForm form").append($("#textLayout").clone(true));
        $(".insertForm #textLayout").css("display","block");
    }

    if(target == "#search_dlg") {
        
        selectGroup('searchLargeGroup');
    }
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
                botChatNum++;
                var val = row[i];

                inputUttrHtml += '<div style="width: 405px; height: 85%; float:left; margin: 15px 20px;">';
                inputUttrHtml += '<div style="height: 10%; width: 100%; z-index:5; background-color: #6f6c6c;">';
                inputUttrHtml += '<div class="check-radio-tweak-wrapper2 searchDlgChk" type="checkbox">';
                inputUttrHtml += '<input name="chksearch" class="tweak-input" type="checkbox"/>';
                inputUttrHtml += '</div>';
                inputUttrHtml += '</div>';
                inputUttrHtml += '<div style="height: 90%; overflow: scroll; overflow-x: hidden; background-color: rgb(241, 243, 246);; padding:10px;">';

                for(var l = 0; l < val.length; l++){
                    var tmp = val[l];

                    for(var j = 0; j < tmp.dlg.length; j++) {

                        if(tmp.dlg[j].DLG_TYPE == 2) {
  
                            inputUttrHtml += '<div class="wc-message wc-message-from-bot" style="width:200px">';
                            inputUttrHtml += '<div class="wc-message-content">';
                            inputUttrHtml += '<svg class="wc-message-callout"></svg>';
                            inputUttrHtml += '<div><div class="format-markdown"><div class="textMent">';
                            inputUttrHtml += '<p>';
                            inputUttrHtml += '<input type="hidden" name="searchDlgId" value="' + tmp.dlg[j].DLG_ID + '"/>';
                            inputUttrHtml += tmp.dlg[j].CARD_TEXT;
                            inputUttrHtml += '</p>';
                            inputUttrHtml += '</div></div></div></div></div>';

                        } else if(tmp.dlg[j].DLG_TYPE == 3) {

                            if(j == 0) {
                                inputUttrHtml += '<div class="wc-message wc-message-from-bot">';
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
                                inputUttrHtml += '<input type="hidden" name="searchDlgId" value="' + tmp.dlg[j].DLG_ID + '"/>';
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
                            if((tmp.dlg.length == 2 && j == 1) || (tmp.dlg.length == 1 && j == 0)) {
                                inputUttrHtml += '</ul>';
                                inputUttrHtml += '</div>';
                                inputUttrHtml += '</div>';
                                inputUttrHtml += '</div></div></div></div>';
                            } else if((tmp.dlg.length-1) == j) {
                                inputUttrHtml += '</ul>';
                                inputUttrHtml += '</div>';
                                inputUttrHtml += '</div>';
                                inputUttrHtml += '<button class="scroll next" id="nextBtn' + (botChatNum) + '" onclick="nextBtn(' + botChatNum + ')"><img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_right_401x.png"></button>';
                                inputUttrHtml += '</div></div></div></div>';
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
                            inputUttrHtml += '<input type="hidden" name="searchDlgId" value="' + tmp.dlg[j].DLG_ID + '"/>';
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
                }

                inputUttrHtml += '</div>';
                inputUttrHtml += '</div>';
            }

            $('#searchDlgResultDiv').prepend(inputUttrHtml);
           
        },
        error:function(e){  
            alert(e.responseText);  
        }  
    });
}

// Search Dialogue 팝업창 
// 다이얼로그 체크박스 단일 체크
$(document).on('click', '.searchDlgChk', function() {

    $('.searchDlgChk').not($(this)).each(function(){
        $(this).removeAttr('checked');
    });
})

function selectDialog() {

    var rowNum = -1;
    $("input[name=chksearch]").each(function(n) {
        var chk = $("input[name=chksearch]").parent().eq(n).attr('checked');
        if(chk == "checked") {
            rowNum = n;
        }
    });

    if(rowNum == -1) {

        alert("다이얼로그를 선택해주세요");
    } else {
        var cloneDlg = $("input[name=chksearch]").parent().parent().eq(rowNum).next().children().clone();
        $('#dialogRecommand').html('');
        $('#dialogRecommand').append(cloneDlg);
        $('#searchDialogCancel').click();
    }

}

/*
function searchSaveDialog() {

    
    var entity = $('input[name=entity]').val();

    var rowNum;
    $("input[name=chksearch]").each(function(n) {
        var chk = $("input[name=chksearch]").parent().eq(n).attr('checked');
        if(chk == "checked") {
            rowNum = n;
        }
    });

    var dlgId = [];

    $("input[name=chksearch]").parent().parent().eq(rowNum).next().find('input[name=searchDlgId]').each(function(n){
        dlgId[n] = $(this).val();
    });

    $.ajax({
        url: '/learning/learnUtterAjax',
        dataType: 'json',
        type: 'POST',
        data: {'entity':entity, 'dlgId':dlgId},
        success: function(result) {
            alert('추가 되었습니다.');
            $("#searchDialogCancel").click();
        }
    });
    


}
*/


var carouselDivHtml = 
$(document).on('click', 'a[name=carouseBtn]',function(e){
    //e.stopPropagation();
    //e.preventDefault();
    //var index = 0;
    $(this).parent().parent().find('select').each(function(index) {
        if ( $(this).css("display") === 'none') {
            $(this).show();
            $(this).parent().parent().next().find('input').eq(index).show();
            $(this).parent().parent().next().next().find('input').eq(index).show();
            return false;   
        }
    });
});

//textLayout

//var $carouselForm = $('#commonLayout #carouselLayout').eq(($('#commonLayout #carouselLayout').length)-1).clone();
$(document).on('click', 'a[name=addCarouselBtn]', function(e){
    //var $newInsertForm = $insertForm.clone();
    //var $newDlgForm = $dlgForm.clone();
    //var $newCarouselForm = $carouselForm.clone();
    
    var idx =  $("a[name=addCarouselBtn]:visible").index(this);
    var jdx = $('select[name=dlgType]').index(( $("a[name=addCarouselBtn]:visible").eq(idx).parents('#dialogLayout').find('select[name=dlgType]') ));
    //$('a[name=addCarouselBtn]').eq(0).parent().parent().remove();
    //$(this).parents('.insertForm').after( $newInsertForm);  
    //<div id="textLayout" style="display: block;">  </div>
    var caraousHtml = '<div id="carouselLayout" style="display: block;">' + $carouselForm.html() + '</div>';
    var dlgFormHtml = '<div id="textLayout" style="display: block;">' + $dlgForm.html() + '</div>';
    $(this).parents('#dialogLayout').append('<div class="clear-both"></div>').append(dlgFormHtml).append(caraousHtml);
    //$(this).parents('.insertForm').next().find('.clear-both').after($newDlgForm);
    var claerLen = $(this).parents('#dialogLayout').children('.clear-both').length-1;
    $(this).parents('#dialogLayout').children('.clear-both').eq(claerLen).next().css('display', 'block');
    $(this).parents('#dialogLayout').children('.clear-both').eq(claerLen).next().next().css('display', 'block');
    //$(this).parent().parent().remove();
    $(this).parent().parent().css('display', 'none');
    $(this).parents('#dialogLayout').find('a[name=addCarouselBtn]:last').closest('div').css('display', 'inline-block');

    var inputUttrHtml = '<li class="wc-carousel-item">';
    inputUttrHtml += '<div class="wc-card hero">';
    inputUttrHtml += '<div class="wc-container imgContainer" >';
    inputUttrHtml += '<img src="https://bot.hyundai.com/assets/images/movieImg/teasure/02_teaser.jpg">';
    inputUttrHtml += '</div>';
    inputUttrHtml += '<h1>CARD_TITLE</h1>';
    inputUttrHtml += '<p class="carousel">CARD_TEXT</p>';
    inputUttrHtml += '<ul class="wc-card-buttons"><li><button>BTN_1_TITLE</button></li></ul>';
    inputUttrHtml += '</div>';
    inputUttrHtml += '</li>';

    var kdx = $('.insertForm').index($(this).parents('.insertForm'));

    $('.dialogView').eq( jdx ).find('#slideDiv' + kdx).children().append(inputUttrHtml);
    
    if ($('.dialogView').eq( jdx ).find('#slideDiv' + kdx).children().children().length > 2) {
        $('#nextBtn'+ jdx).show();
    }
    

});


//** 모달창 */
function openModalEntity(target){

    // 화면의 높이와 너비를 변수로 만듭니다.
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();

    // 마스크의 높이와 너비를 화면의 높이와 너비 변수로 설정합니다.
    $('.mask').css({'width':maskWidth,'height':maskHeight});


    // 레이어 팝업을 가운데로 띄우기 위해 화면의 높이와 너비의 가운데 값과 스크롤 값을 더하여 변수로 만듭니다.
    var left = ( $(window).scrollLeft() + ( $(window).width() - $(target).width()) / 2 );
    var top = ( $(window).scrollTop() + ( $(window).height() - $(target).height()) / 2 );

    // css 스타일을 변경합니다.
    $(target).css({'left':left,'top':top, 'position':'absolute'});

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
}

//엔티티 추가
function insertEntity(){

    $.ajax({
        url: '/learning/insertEntity',
        dataType: 'json',
        type: 'POST',
        data: $('#entityInsertForm').serializeObject(),
        success: function(data) {
            if(data.status == 200){
                $('#addEntityClose').click();
                alert("추가하였습니다.");
                var originalUtter = [];
                $('input[name=hiddenUtter]').each(function() {
                    originalUtter.push($(this).val());
                });
                $('#utterListDiv').find('tbody').html('');
                $('#nav').remove();
                utterInput(originalUtter);
            } else {
                alert("오류 발생으로 인해 추가하지 못하였습니다.");
            }
        }
    });
}
//** 모달창 끝 */


//insertHtml += '<button class="scroll previous" id="prevBtn" style="display: none;" onclick="prevBtn(botChatNum)">';
//insertHtml += '<img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_left_401x.png">';
//insertHtml += '</button>';



//inputUttrHtml += '<button class="scroll next" id="nextBtn' + (botChatNum) + '" onclick="nextBtn(' + botChatNum + ')"><img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_right_401x.png"></button>';