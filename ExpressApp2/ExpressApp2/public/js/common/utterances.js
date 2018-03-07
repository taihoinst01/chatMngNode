var language;
;(function($) {
    console.log("utterance test");
    $.ajax({
        url: '/jsLang',
        dataType: 'json',
        type: 'POST',
        success: function(data) {
            language= data.lang;
        }
    });
})(jQuery);

$(document).ready(function(){
    // recommend에서 넘어온 문장 insert
    var recommendParam = $('#utterence').val();
    if(recommendParam){
        utterInput(recommendParam);
    }
});

// Utterance 삭제
$(document).on('click', '.utterDelete', function() {

    $(this).parents('tr').next().remove();
    $(this).parents('tr').remove();
    
    /*
    if ($('#entityUtteranceTextTable tbody').find('.off-screen').length > 0) {
        //$('#entityUtteranceTextTable tbody').find('.off-screen').eq(0).animate({opacity: 1}, 300);
        $('#entityUtteranceTextTable tbody').find('.off-screen').eq(0).removeClass('off-screen');
        //$('#entityUtteranceTextTable tbody').find('.off-screen').eq(0).animate({opacity: 1}, 300);
        $('#entityUtteranceTextTable tbody').find('.off-screen').eq(0).removeClass('off-screen');
    }
    */
    var $tr = $('.recommendTbl tbody').children('tr');
    $tr.css('opacity', '0.0')
            .addClass('off-screen')
            .slice(0, 6)
            .removeClass('off-screen')
            .animate({opacity: 1}, 300);
    


    $('.dialog_box').html("");
    $('input[name=tableAllChk]').parent().iCheck('uncheck');

    
    changeBtnAble(false);
    pagingFnc();
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

function pagingFnc() {
    var rowPerPage = $('[name="dlgRowPerPage"]').val() * 1;// 1 을  곱하여 문자열을 숫자형로 변환

//		console.log(typeof rowPerPage);

    var zeroWarning = 'Sorry, but we cat\'t display "0" rows page. + \nPlease try again.'
    if (!rowPerPage) {
        alert(zeroWarning);
        return;
    }
    $('.pagination').html('');
    var $products = $('.recommendTbl');

    //$products.after('<div id="nav" style="text-align:center">');


    var $tr = $($products).children('tbody').children('tr');
    var rowTotals = $tr.length;
//	console.log(rowTotals);

    var pageTotal = Math.ceil(rowTotals/ rowPerPage);
    var i = 0;

    for (; i < pageTotal; i++) {
        $('<li><a href="#" rel="' + i + '">'+ (i + 1) +'</a></li>')
                .appendTo('.pagination');
    }

    $tr.addClass('off-screen')
            .slice(0, rowPerPage)
            .removeClass('off-screen');


    var $pagingLink = $('.pagination a');
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
        //pagingSkip();

    });
    $pagingLink.filter(':first').addClass('active');
    //pagingSkip();
       
}

function pagingSkip() {

    $('#preBtn').remove();
    $('#nextBtn').remove();
    $('#firstBtn').remove();
    $('#lastBtn').remove();
    $('.pagination').children('a').show();

    var activeIndex = $('.pagination').children('a').index($('.active'));
    if (activeIndex-4 > 0) {
        $('.pagination').children('a')
                .slice(0, activeIndex-4)
                .hide();

        $('<a href="#"></a>')
                .attr('id', "firstBtn")
                .html("[1]")
                .prependTo('.pagination');


                
        /*
        $('<a href="#"></a>')
                .attr('id', "preBtn")
                .html("[<]")
                .prependTo('#nav');
        */
        
    }
    var activeRightIndex;
    if ($('#firstBtn').length>0) {
        activeRightIndex = activeIndex +6;
    } else {
        activeRightIndex = activeIndex +5;
    }
    if (activeRightIndex < $('.pagination').children('a').length) {
        var rightLen = $('.pagination').children('a').length;
        if ( $('#preBtn').length > 0) { 
            activeRightIndex += 2;
        }
        $('.pagination').children('a')
                .slice(activeRightIndex, rightLen)
                .hide();
        $('<a href="#"></a>')
                .attr('id', "lastBtn")
                .html('[' + $('.pagination').children('a').eq($('.pagination').children('a').length-1).html() + ']')
                .appendTo('.pagination');
        /*
        $('<a href="#"></a>')
                .attr('id', "nextBtn")
                .html("[>]")
                .appendTo('#nav');
        */
    }
}
/*
$(document).on('click', '#preBtn', function() {
    $('.active').prev().trigger('click');
    return false;
});
*/
/*
$(document).on('click', '#nextBtn', function() {
    $('.active').next().trigger('click');
    return false;
});
*/
$(document).on('click', '#firstBtn', function() {
    $('.pagination').children('a').eq(2).trigger('click');
    return false;
});
$(document).on('click', '#lastBtn', function() {
    $('.pagination').children('a').eq($('.pagination').children('a').length-3).trigger('click');
    return false;
});
$(document).ready(function(){

    //add eneity mordal save btn check
    $('input[name=entityDefine], input[name=entityValue]').on('input',function(e){
        if( $('input[name=entityDefine]').val() !== "" &&  $('input[name=entityValue]').val() !== "") {
            $('#btnAddEntity').removeClass('disable');
            $('#btnAddEntity').prop("disabled", false);
        } else {
            $('#btnAddEntity').addClass('disable');
            $('#btnAddEntity').prop("disabled", true);
        }   
    });

    $("input[name=dlgChk]").bind('click',function(){
        var checkedVal = false;
        var checkedVal2 = false;

        
        $("input[name=ch1]").each(function() {
            if (typeof $(this).parent().attr("checked") != 'undefined') {
                checkedVal = true;
            } 
        });

        if($(this).parent().attr('checked') == "checked") {
            $(this).parent().removeAttr('checked');
            checkedVal2 = false;
            //changeBtnAble('learn', false);
        } else {
            $(this).parent().attr("checked", "checked");
            checkedVal2 = true;
            //changeBtnAble('learn', true);
        }

        if(checkedVal == true && checkedVal2 == true) {
            changeBtnAble('learn', true);
        } else {
            changeBtnAble('learn', false);
        }
        /*
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
        */
    })

    // Utterance 입력
    $('input[name=iptUtterance]').keypress(function(e) {

        if (e.keyCode == 13){	//	Enter Key

            //$("#entityUtteranceTextTable tbody").html("");
            $('.dialog_box').html('');

            $('input[name=iptUtterance]').attr('readonly',true);
            var queryText = $(this).val();
            if(queryText.trim() == "" || queryText.trim() == null) {
                $('input[name=iptUtterance]').attr('readonly',false);
                return false;
            }
            utterInput(queryText);

            $("input[name=iptUtterance]").attr("readonly",false);
        }
    });

    // Utterance Learn
    $('#utterLearn').click(function(){

        var entity = $('input[name=entity]').val();
        
        var inputDlgId = $('input[name=dlgId]');
        var dlgId = new Array();
        inputDlgId.each(function(n) { 
            dlgId.push(inputDlgId[n].value);
            return dlgId;
        });

        $.ajax({
            url: '/learning/learnUtterAjax',
            dataType: 'json',
            type: 'POST',
            data: {'entity':entity, 'dlgId':dlgId},
            success: function(result) {
                if(result['result'] == true) {
                    alert(language.Added);
                    
                    $('input[name=tableAllChk]').parent().iCheck('uncheck');
                    changeBtnAble(false);

                    $('.recommendTbl tbody').html('');
                    $('.dialog_box').html('');

                    $('#utterLearn').attr('disabled', 'disabled');
                    $('#utterLearn').addClass('disable');

                    $('input[name=dlgBoxChk]').parent().iCheck('uncheck');
                    $('.pagination').html('');
                }else{
                    alert(language.It_failed);
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
    $('.addEntityModalClose').click(function(){
        $('form[name=entityInsertForm]')[0].reset();
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
    
	$('.createDlgModalClose').click(function(){
        $('#mediaCarouselLayout').css('display','none');
        $('#cardLayout').css('display','none');
        $('#appInsertForm')[0].reset();
        $('.insertForm').remove();
        
        var insertForm = '';
        insertForm += '<div class="insertForm">';
        insertForm += '<div class="form-group" >';
        insertForm += '<form name="dialogLayout" id="dialogLayout">';
        insertForm += '<label>' + language.DIALOG_BOX_TYPE + '<span class="nec_ico">*</span> </label>';
        insertForm += '<select class="form-control" name="dlgType">';
        insertForm += '<option value="2">' + language.TEXT_TYPE + '</option>';
        insertForm += '<option value="3">' + language.CARD_TYPE + '</option>';
        insertForm += '<option value="4">' + language.MEDIA_TYPE + '</option>';
        insertForm += '</select>';
        insertForm += '<div class="clear-both"></div>';
        insertForm += '</form>';
        insertForm += '</div>';
        insertForm += '</div>';
        
        $('#apiLayout').css('display', 'none');
        $('#commonLayout').css('display', 'block');
        $('#commonLayout').prepend(insertForm);
        
        if($('#btnCreateLgroup').html() == '취소' || $('#btnCreateLgroup').html() == 'CANCEL') {

            $('#btnCreateLgroup').click();
        }
        var dialogView = '';
        dialogView += '<div class="dialogView" >';
        dialogView += '<div class="wc-message wc-message-from-bot" style="width:80%;">';
        dialogView += '<div class="wc-message-content">';
        dialogView += '<svg class="wc-message-callout"></svg>';
        dialogView += '<div>';
        dialogView += '<div class="format-markdown">';
        dialogView += '<div class="textMent">';
        dialogView += '<p>' + language.Please_enter + '</p>';
        dialogView += '</div>';
        dialogView += '</div>';
        dialogView += '</div>';
        dialogView += '</div>';
        dialogView += '</div>';
        dialogView += '</div>';
        $('#dialogViewWrap').html(dialogView);
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
            $('.dialogView').html('');
            $('#commonLayout').css('display','none');
            $('#apiLayout').css('display','block');
        } else {

            $('.insertForm').remove();
            var insertForm = '';
            insertForm += '<div class="insertForm">';
            insertForm += '<div class="form-group" >';
            insertForm += '<form name="dialogLayout" id="dialogLayout">';
            insertForm += '<label>' + language.DIALOG_BOX_TYPE + '<span class="nec_ico">*</span> </label>';
            insertForm += '<select class="form-control" name="dlgType">';
            insertForm += '<option value="2">' + language.TEXT_TYPE + '</option>';
            insertForm += '<option value="3">' + language.CARD_TYPE + '</option>';
            insertForm += '<option value="4">' + language.MEDIA_TYPE + '</option>';
            insertForm += '</select>';
            insertForm += '<div class="clear-both"></div>';
            insertForm += '</form>';
            insertForm += '</div>';
            insertForm += '</div>';
            
            $('#commonLayout').css('display','block');
            $('#commonLayout').prepend(insertForm);
            var dialogView = '';
            dialogView += '<div class="dialogView" >';
            dialogView += '<div class="wc-message wc-message-from-bot" style="width:80%;">';
            dialogView += '<div class="wc-message-content">';
            dialogView += '<svg class="wc-message-callout"></svg>';
            dialogView += '<div>';
            dialogView += '<div class="format-markdown">';
            dialogView += '<div class="textMent">';
            dialogView += '<p>' + language.Please_enter + '</p>';
            dialogView += '</div>';
            dialogView += '</div>';
            dialogView += '</div>';
            dialogView += '</div>';
            dialogView += '</div>';
            dialogView += '</div>';
            $('#dialogViewWrap').html(dialogView);
            
            $('#apiLayout').css('display','none');
            $(".insertForm form").append($(".textLayout").clone(true));
            $('.insertForm .textLayout').css('display','block');
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
    $('#btnCreateLgroup').on('click',function(e){
        if($(this).html() == "신규" || $(this).html() == "NEW") {
            $(this).html(language.CANCEL);
            $('#largeGroupEdit').css('display','block');
            $('#largeGroup').css('display','none');
        } else {
            $(this).html(language.NEW);
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
            insertForm += '<hr>';
            insertForm += '<div class="insertForm">';
            insertForm += '<div class="form-group" >';
            insertForm += '<form name="dialogLayout" id="dialogLayout">';
            insertForm += '<label>' + language.DIALOG_BOX_TYPE + '<span class="nec_ico">*</span> </label>';
            insertForm += '<select class="form-control" name="dlgType">';
            insertForm += '<option value="2">' + language.TEXT_TYPE + '</option>';
            insertForm += '<option value="3">' + language.CARD_TYPE + '</option>';
            insertForm += '<option value="4">' + language.MEDIA_TYPE + '</option>';
            insertForm += '</select>';
            insertForm += '<div class="clear-both"></div>';

            insertForm += '<div class="textLayout" style="display: block;">';
            insertForm += '<div class="form-group">';
            insertForm += '<label>' + language.DIALOG_BOX_TITLE + '<span class="nec_ico">*</span></label>';
            insertForm += '<input type="text" name="dialogTitle" class="form-control" onkeyup="writeDialogTitle(this);" placeholder=" ' + language.Please_enter + '">';
            insertForm += '</div>';
            insertForm += '<div class="form-group">';
            insertForm += '<label>' + language.DIALOG_BOX_CONTENTS + '<span class="nec_ico">*</span></label>';
            insertForm += '<input type="text" name="dialogText" class="form-control" onkeyup="writeDialog(this);" placeholder=" ' + language.Please_enter + ' ">';
            insertForm += '</div>';
            insertForm += '</div>';
            insertForm += '</form>';
            insertForm += '</div>';
            insertForm += '</div>';

        $(".insertForm:last").after(insertForm);
        //$(".insertFormWrap").append(insertForm);
        var dialogView = '';
            dialogView += '<div class="dialogView" >';
            dialogView += '<div class="wc-message wc-message-from-bot" style="width:80%;">';
            dialogView += '<div class="wc-message-content">';
            dialogView += '<svg class="wc-message-callout"></svg>';
            dialogView += '<div>';
            dialogView += '<div class="format-markdown">';
            dialogView += '<div class="textMent">';
            dialogView += '<p>' + language. Please_enter + '</p>';
            dialogView += '</div>';
            dialogView += '</div>';
            dialogView += '</div>';
            dialogView += '</div>';
            
        $('#dialogViewWrap').append(dialogView);
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

            $('.dialogView').append(dlgHtml);
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

                $('.dialogView').append(dlgHtml);
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
            alert(language.Select_search_word_or_group);
        } else {
            $("#searchDlgResultDiv").html("");
            searchDialog();
        }

        
    });

    $(".searchDialogClose").on('click',function(){
        $('input[name=serachDlg]').val('');
        $('#searchDlgResultDiv').html('');
        $('.dialog_result strong').html(' 0 ');
    });

});


//utter td 클릭
$(document).on('click','.clickUtter',function(event){
    var utter = $(this).find('input[name=entity]').val();
    $('.dialog_box').html(dlgMap[utter]);
});

//intent selbox 선택
$(document).on('change','#intentNameList',function(event){
    selectDlgListAjax($("#intentNameList option:selected").val());
});

// 다이얼로그 생성 모달 (다이얼로그 타입 변경)
$(document).on('change','select[name=dlgType]',function(e){
    var idx = $("select[name=dlgType]").index(this);
    var insertHtml = "";

    $('.insertForm:eq(' + idx + ') .carouselLayout').remove();
    $('.insertForm:eq(' + idx + ') .mediaLayout').remove();
    $('.insertForm:eq(' + idx + ')').find('.clear-both').each(function( index) {

        if ( index != 0 ) {
            $(this).next().remove();
            $(this).remove();
        } 
    });

    if($(e.target).val() == "2") {

    } else if($(e.target).val() == "3") {
        //var $clone = $('.carouselLayout').clone();  <div id="carouselLayout" style="display: block;">[object Object]</div>
        var caraousHtml = '<div class="carouselLayout" style="display: block;">' + $carouselForm.html() + '</div>'
        $('.insertForm:eq(' + idx + ') form').append('<div class="carouselLayout" style="display:none;">' + caraousHtml + '</div>') ;
        $('.insertForm:eq(' + idx + ') .carouselLayout').css('display', 'block');
        $('.insertForm:eq(' + idx + ') .carouselLayout').find('.addCarouselBtn:last').closest('div').css('display', 'inline-block');
    } else if($(e.target).val() == "4") {
        var mediaForm = '<div id="mediaLayout" style="display: block;">' + $mediaForm.html() + '</div>'
        $('.insertForm:eq(' + idx + ') form').append('<div class="mediaLayout" style="display:none;">' + mediaForm + '</div>') ;
        $('.insertForm:eq(' + idx + ') .mediaLayout').css('display', 'block');
        $('.insertForm:eq(' + idx + ') .mediaLayout').find('.addMediaBtn:last').closest('div').css('display', 'inline-block');
    }

    if($(e.target).val() == "2") {
        $(".dialogView").eq(idx).html('');
        insertHtml += '<div class="wc-message wc-message-from-bot" style="width:80%;">';
        insertHtml += '<div class="wc-message-content">';
        insertHtml += '<svg class="wc-message-callout"></svg>';
        insertHtml += '<div><div class="format-markdown"><div class="textMent">';
        insertHtml += '<p>';
        insertHtml += language.Please_enter;
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
        insertHtml += '<ul style="padding-left: 0px;">';
        insertHtml += '<li class="wc-carousel-item">';
        insertHtml += '<div class="wc-card hero">';
        insertHtml += '<div class="wc-container imgContainer">';
        insertHtml += '<img src="https://bot.hyundai.com/assets/images/movieImg/teasure/02_teaser.jpg">';
        insertHtml += '</div>';
        insertHtml += '<h1>CARD_TITLE</h1>';
        insertHtml += '<p class="carousel">CARD_TEXT</p>';
        insertHtml += '<ul class="wc-card-buttons" style="padding-left: 0px;"><li><button>BTN_1_TITLE</button></li></ul>';
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
        insertHtml += '<ul style="padding-left: 0px;">';
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
        insertHtml += '<ul class="wc-card-buttons" style="padding-left: 0px;">';
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
        var dialogText = $('input[name=dialogText]').val();
        
        if(dialogText != "") {
            $('#btnAddDlg').removeClass("disable");
            $('#btnAddDlg').attr("disabled", false);
        } else {
            $('#btnAddDlg').attr("disabled", "disabled");
            $('#btnAddDlg').addClass("disable");
        }
    }
}

// 다이얼로그 생성 모달 (다이얼로그 타이틀 입력)
function writeDialogTitle(e) {

    //var idx = $('input[name=dialogTitle]').index(e);
    var idx = $('#commonLayout .insertForm').index($(e).parents('.insertForm'));
    var icx = $('#commonLayout').find('.insertForm').index($(e).parents('.insertForm'));
    var jcx = $(e).parents('.insertForm').find('input[name=dialogTitle]').index(e);

    if($(e).parents('.insertForm').find('select[name=dlgType]').val() == 3) {
        //$('.dialogView:eq(' + idx + ') .carousel').html(e.value);
        $('.dialogView').children().eq(icx).find('ul:eq(0)').children().eq(jcx).find('h1').text(e.value);
    } else if($(e).parents('.insertForm').find('select[name=dlgType]').val() == 4) {
        $('.dialogView').children().eq(icx).find('h1').html(e.value);
        //$('.dialogView h1').eq(idx).html(e.value);
    } else {
        //$('.dialogView').children().eq(icx).find('.textMent p').html(e.value);
    }
}

$(document).on('change','.insertForm .mediaLayout input[name=imgUrl]',function(e){
    var idx = $(".insertForm .mediaLayout input[name=imgUrl]").index(this);
    $('.dialogView .wc-card-div img:eq(' + idx + ')').attr("src",$(e.target).val());
});


function writeCarouselImg(e) {
    var icx = $('#commonLayout').find('.insertForm').index($(e).parents('.insertForm'));
    var jcx = $(e).parents('.insertForm').find('input[name=imgUrl]').index(e);

    $('.dialogView').children().eq(icx).find('ul:eq(0)').children().eq(jcx).find('.imgContainer img').attr("src",e.value);
}

// 다이얼로그 생성 모달 (다이얼로그 텍스트 입력)
function writeDialog(e) {
    //var idx = $('textarea[name=dialogText]').index(e);
    
    var idx = $('#commonLayout .insertForm').index($(e).parents('.insertForm'));
    var icx = $('#commonLayout').find('.insertForm').index($(e).parents('.insertForm'));
    //var jcx = $(e).parents('.insertForm').find('input[name=dialogTitle]').index(e);
    
    if($(e).parents('.insertForm').find('select[name=dlgType]').val() == 3) {
        //$('.dialogView:eq(' + idx + ') .carousel').html(e.value);
        //var icx = $('#commonLayout').find('.insertForm').index($(e).parents('.insertForm'));
        var jcx = $(e).parents('.insertForm').find('input[name=dialogText]').index(e);
        $('.dialogView').children().eq(icx).find('ul:eq(0)').children().eq(jcx).find('p').text(e.value);
    } else if($(e).parents('.insertForm').find('select[name=dlgType]').val() == 4) {
        $('.dialogView h1').eq(idx).html(e.value);
    } else {
        //$('.dialogView .textMent p:eq(' + idx + ')').html(e.value);
        //$('.dialogView').children().eq(icx).find('.textMent p:eq(' + idx + ')').html(e.value);
        $('.dialogView').children().eq(icx).find('.textMent p').html(e.value);
    }

    //캐러졀 용
    /*
    if ( $(e).parents('.insertForm').find('select[name=dlgType]').val() == 3 ) {
        var icx = $('#commonLayout').find('.insertForm').index($(e).parents('.insertForm'));
        var jcx = $(e).parents('.insertForm').find('textarea[name=dialogText]').index(e);

        $('.dialogView').children().eq((1)).find('ul:eq(0)').children().eq(1).find('p').text(e.value);
    }
    */
    
    
}

//다이얼로그 생성
/*
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
                $('dialog_box').prepend(inputUttrHtml);                    
                $('.createDlgModalClose').click();
            }
        }
    });
}
*/
function createDialog(){

    var entity = $('input[name=entity]').val();
    var idx = $('form[name=dialogLayout]').length;
    var array = [];
    var exit = false;
    if ($('#description').val().trim() === "" ) {
        alert(language.Description_must_be_entered);
        return false;
    }
    $('.insertForm input[name=dialogTitle]').each(function(index) {
        if ($(this).val().trim() === "") {
            alert(language.You_must_enter_a_Dialog_Title);
            exit = true;
            return false;
        }
    });
    if(exit) return;
    $('.insertForm input[name=dialogText]').each(function(index) {
        if ($(this).val().trim() === "") {
            alert(language.You_must_enter_the_dialog_text);
            exit = true;
            return false;
        }
    });
    if(exit) return;
    $('.insertForm input[name=imgUrl]').each(function(index) {
        if ($(this).val().trim() === "") {
            alert(language.ImageURL_must_be_entered);
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

            var inputUttrHtml = '';
            for(var i = 0; i < data.list.length; i++) {
                inputUttrHtml += '<input type="hidden" name="dlgId" value="' + data.list[i] + '"/>';
            }

            var createDlgClone = $('.dialogView').children().clone();
            $('.dialog_box').html('');
            $('.dialog_box').append(createDlgClone);
            $('.dialog_box').append(inputUttrHtml);
            $('.createDlgModalClose').click();
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
                            inputUttrHtml += '<ul style="padding-left:0px;">';
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
                        inputUttrHtml += '<ul style="padding-left:0px;>';
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

            $('.dialog_box').prepend(inputUttrHtml);

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
                    var utter = utterHighlight(result.commonEntities[k],result['iptUtterance'][k]);
                    var selBox = result['selBox'];
    
                    $('input[name="iptUtterance"').val('');
                    var inputUttrHtml = '';
                    inputUttrHtml += '<tr><input type="hidden" name="hiddenUtter" value="' + queryText + '"/>';
                    inputUttrHtml += '<td> <input type="checkbox" name="tableCheckBox" class="flat-red"></td>';
                    inputUttrHtml += '<td class="txt_left clickUtter"><input type=hidden name="entity" value="' + result['entities'][k] + '"/>' + utter + '</td>';
                    inputUttrHtml += '<td><a href="#"><span class="fa  fa-trash utterDelete"><span class="hc">삭제</span></span></a></td></tr>';
                    inputUttrHtml += '<tr><td></td><td class="txt_left">';
                    
                    if(result.commonEntities[k]){
                        for(var i = 0; i < result.commonEntities[k].length ; i++){
                            var commonTmp = result.commonEntities[k];
                            inputUttrHtml += '<input type=hidden value="' + commonTmp[i].ENTITY_VALUE + '"/>' + commonTmp[i].ENTITY_VALUE + '::' + commonTmp[i].ENTITY;
                            if(i != commonTmp[i].length - 1 ) {
                                inputUttrHtml += "&nbsp&nbsp";
                            }
                        }
                    }else{
                        inputUttrHtml += language.NoEntity;
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
                    $('.recommendTbl').find('tbody').prepend(inputUttrHtml);
    
                    selectDlgListAjax(entities[k]);
    
                    pagingFnc();

                    //Flat red color scheme for iCheck
                    $('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck({
                        checkboxClass: 'icheckbox_flat-green',
                        radioClass   : 'iradio_flat-green'
                    })
                    
                    $('input[name=tableAllChk]').on('ifChecked', function(event) {
                        $('input[name=tableCheckBox]').parent().iCheck('check');
                            
                    }).on('ifUnchecked', function() {
                            $('input[name=tableCheckBox]').parent().iCheck('uncheck');
                        });

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
var $mediaForm;
function openModalBox(target){

    //carousel clone 초기값 저장
    $insertForm = $('#commonLayout .insertForm').eq(0).clone();
    $dlgForm = $('#commonLayout .textLayout').eq(0).clone();
    $carouselForm = $('#commonLayout .carouselLayout').eq(0).clone();
    $mediaForm = $('#commonLayout .mediaLayout').eq(0).clone();

    if(target == "#create_dlg") {
        $(".insertForm form").append($(".textLayout").clone(true));
        $(".insertForm .textLayout").css("display","block");
    }

    if(target == "#search_dlg") {
        selectGroup('searchLargeGroup');
    }

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

            var inputUttrHtml = '';

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

            for (var i = 0; i < row.length; i++) {
                botChatNum++;
                var val = row[i];

                inputUttrHtml += '<div class="chat_box">';
                inputUttrHtml += '<p><input type="checkbox" name="searchDlgChk" class="flat-red"></p>';          
                inputUttrHtml += '<div style="width: 350px; height: 95%; overflow: scroll; overflow-x: hidden; padding:10px;">';
                inputUttrHtml += '<div>';

                for(var l = 0; l < val.length; l++){
                    var tmp = val[l];

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
                                inputUttrHtml += '<div class="wc-message wc-message-from-bot">';
                                inputUttrHtml += '<div class="wc-message-content">';
                                inputUttrHtml += '<svg class="wc-message-callout"></svg>';
                                inputUttrHtml += '<div class="wc-carousel slideBanner">';
                                inputUttrHtml += '<div>';
                                inputUttrHtml += '<button class="scroll previous" id="prevBtn' + (botChatNum) + '" style="display: none;" onclick="prevBtn(' + botChatNum + ')">';
                                inputUttrHtml += '<img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_left_401x.png">';
                                inputUttrHtml += '</button>';
                                inputUttrHtml += '<div class="wc-hscroll-outer" >';
                                inputUttrHtml += '<div class="wc-hscroll" style="margin-bottom: 0px;" class="content" id="slideDiv' + (botChatNum) + '">';
                                inputUttrHtml += '<ul style="padding-left: 0px;">';
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
                                inputUttrHtml += '<ul class="wc-card-buttons" style="padding-left:0px;"><li><button>' + /*btntitle*/ tmp.dlg[j].BTN_1_TITLE + '</button></li></ul>';
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
                }
            
                inputUttrHtml += '</div>';
                inputUttrHtml += '</div>';
                inputUttrHtml += '</div>';
            }
            
            $(".dialog_result strong").html(" " + row.length +" ");
            $('#searchDlgResultDiv').prepend(inputUttrHtml);

            //Flat red color scheme for iCheck
            $('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass   : 'iradio_flat-green'
            })
           
        },
        error:function(e){  
            alert(e.responseText);  
        }  
    });
}

// Search Dialogue 팝업창 
// 다이얼로그 체크박스 단일 체크
$(document).on('ifChecked', 'input[name=searchDlgChk]', function(event) {
    
    $('input[name=searchDlgChk]').not($(this)).each(function(){
        $(this).parent().iCheck('uncheck')
    });
        
})

function selectDialog() {

    var successFlagg = false;
    $("input[name=searchDlgChk]").each(function(n) {
        var chk = $(this).parent().hasClass('checked');
        if(chk == true) {
            var cloneDlg = $(this).parent().parent().next().children().clone();
            $('.dialog_box').html('');
            $('.dialog_box').append(cloneDlg);
            $('.searchDialogClose').click();
            successFlagg = true;
            return false;
        }
    });

    if(successFlagg == false) {

        alert(language.Please_select_a_dialogue);
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

$(document).on('click', '.carouseBtn',function(e){
    //e.stopPropagation();
    //e.preventDefault();
    //var index = 0;
    $(this).parent().parent().find('select').each(function(index) {
        if ( $(this).css("display") === 'none') {
            $(this).show();
            $(this).parent().next().find('input').eq(index).show();
            $(this).parent().next().next().find('input').eq(index).show();
            return false;   
        }
    });
});

$(document).on('click', '.addMediaBtn',function(e){

    $(this).parent().parent().find($('.mediaBtnName')).each(function(index){

        if($(this).css('display') === 'none') {

            $(this).show();
            $(this).parent().parent().find($('.mediaBtnContent')).eq(index).show();
            return false; 
        }
    });

});

//textLayout


$(document).on('click', '.addCarouselBtn', function(e){
    //var $newInsertForm = $insertForm.clone();
    //var $newDlgForm = $dlgForm.clone();
    //var $newCarouselForm = $carouselForm.clone();
    
    var idx =  $(".addCarouselBtn:visible").index(this);
    var jdx = $('select[name=dlgType]').index(( $(".addCarouselBtn:visible").eq(idx).parents('form[name=dialogLayout]').find('select[name=dlgType]') ));
    //$('.addCarouselBtn').eq(0).parent().parent().remove();
    //$(this).parents('.insertForm').after( $newInsertForm);  
    //<div id="textLayout" style="display: block;">  </div>
    var caraousHtml = '<div class="carouselLayout" style="display: block;">' + $carouselForm.html() + '</div>';
    var dlgFormHtml = '<div class="textLayout" style="display: block;">' + $dlgForm.html() + '</div>';
    $(this).parents('form[name=dialogLayout]').append('<div class="clear-both"></div>').append(dlgFormHtml).append(caraousHtml);
    //$(this).parents('.insertForm').next().find('.clear-both').after($newDlgForm);
    var claerLen = $(this).parents('form[name=dialogLayout]').children('.clear-both').length-1;
    $(this).parents('form[name=dialogLayout]').children('.clear-both').eq(claerLen).next().css('display', 'block');
    $(this).parents('form[name=dialogLayout]').children('.clear-both').eq(claerLen).next().next().css('display', 'block');
    //$(this).parent().parent().remove();
    $(this).parent().css('display', 'none');
    $(this).parents('form[name=dialogLayout]').find('.addCarouselBtn:last').closest('div').css('display', 'inline-block');

    var inputUttrHtml = '<li class="wc-carousel-item">';
    inputUttrHtml += '<div class="wc-card hero">';
    inputUttrHtml += '<div class="wc-container imgContainer" >';
    inputUttrHtml += '<img src="https://bot.hyundai.com/assets/images/movieImg/teasure/02_teaser.jpg">';
    inputUttrHtml += '</div>';
    inputUttrHtml += '<h1>CARD_TITLE</h1>';
    inputUttrHtml += '<p class="carousel">CARD_TEXT</p>';
    inputUttrHtml += '<ul class="wc-card-buttons" style="padding-left:0px;"><li><button>BTN_1_TITLE</button></li></ul>';
    inputUttrHtml += '</div>';
    inputUttrHtml += '</li>';

    var kdx = $('.insertForm').index($(this).parents('.insertForm'));

    $('.dialogView').eq( jdx ).find('#slideDiv' + kdx).children().append(inputUttrHtml);
    
    if ($('.dialogView').eq( jdx ).find('#slideDiv' + kdx).children().children().length > 2) {
        $('#nextBtn'+ jdx).show();
    }
    

});

//엔티티 추가
function insertEntity(){

    $.ajax({
        url: '/learning/insertEntity',
        dataType: 'json',
        type: 'POST',
        data: $('#entityInsertForm').serialize(),
        success: function(data) {
            if(data.status == 200){
                $('.addEntityModalClose').click();
                alert(language.Added);
                //var originalUtter = [];
                //$('input[name=hiddenUtter]').each(function() {
                //    originalUtter.push($(this).val());
                //});
                //$('.recommendTbl').find('tbody').html('');
                //$('.pagination').html('');
                //utterInput(originalUtter);
            } else {
                alert(language.It_failed);
            }
        }
    });
}
//** 모달창 끝 */


//insertHtml += '<button class="scroll previous" id="prevBtn" style="display: none;" onclick="prevBtn(botChatNum)">';
//insertHtml += '<img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_left_401x.png">';
//insertHtml += '</button>';



//inputUttrHtml += '<button class="scroll next" id="nextBtn' + (botChatNum) + '" onclick="nextBtn(' + botChatNum + ')"><img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_right_401x.png"></button>';