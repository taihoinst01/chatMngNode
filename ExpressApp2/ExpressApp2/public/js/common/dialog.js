var language;
;(function($) {
    $.ajax({
        url: '/jsLang',
        dataType: 'json',
        type: 'POST',
        success: function(data) {
            language= data.lang;

            // groupType 사양및 장단점 역할
            // sourceType 구분 역할
            var groupType =  $('.selected').text();
            var sourceType = $('#tblSourceType').val();
            selectDlgByTxt(groupType, sourceType);
        }
    });
})(jQuery);

var rememberSelBoxHtml = '';



$(document).ready(function(){


    //검색 enter
    $('#iptDialog').keyup(function(e){
        if(e.keyCode == 13) {
            //searchIptDlg(1);
            selectDlgByTxt('selectDlgByTxt', 'search');
        }
    });


    //그룹박스
    $('.selectbox .selected').click(function(e){
        $('.selectOptionsbox').toggleClass('active');
        e.stopPropagation();
    });
    
    //그룹박스 영역 이외에 클릭시 그룹박스 닫기
    $('html').click(function(e){

        if(!$(e.target).hasClass("selectArea")){

            $('.selectOptionsbox').removeClass('active');
        }
    });

    $('#tblSourceType').change(function(){
        
        groupType = $('.selected').text();
        sourceType = $('#tblSourceType').val();
        $('#currentPage').val(1);
        rememberSelBoxHtml = $('#selBoxBody').html();
        selectDlgByTxt(groupType, sourceType);
        
        /*
        var selTypeVal = $('#tblSourceType :selected').text();
        $('#dialogTbltbody tr').show();
        $('#dialogTbltbody tr').each(function () {
            if ($(this).children().eq(0).text() === selTypeVal) {
            } else {
                $(this).hide();
            }
        });
        */

    });

    /**모달 */
    //다이얼로그 Add
    /*
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
    */

    // 다이얼로그 생성 모달 
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

    // 다이얼로그 생성 모달
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

    // 다이얼로그 생성 모달
    $(document).on('click', '.addMediaBtn',function(e){

        $(this).parent().parent().find($('.mediaBtnName')).each(function(index){
    
            if($(this).css('display') === 'none') {
    
                $(this).show();
                $(this).parent().parent().find($('.mediaBtnContent')).eq(index).show();
                return false; 
            }
        });
    
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

    //다이얼로그 생성
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
    /** 모달 끝 */

    // 다이얼로그 생성 모달 (소스 타입 변경)
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

    // 다이얼로그 생성 모달
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
    
    $('#iptDialog').on('input',function(e){

        if($(this).val() !== "") {
            $(this).next().removeClass('disable');
            $(this).next().prop("disabled", false);
        } else {
            $(this).next().addClass('disable');
            $(this).next().prop("disabled", true);
        }   
    });
});


//검색어로 검색
var saveSelectDivHtml;
var searchIptText; //페이징시 필요한 검색어 담아두는 변수
function searchIptDlg(page){

    if(page) {
        $('#currentPage').val(1);
        searchIptText = $('#iptDialog').val();
    }

    params = {
        'sourceType2': sourceType2,
        'searchGroupL': searchGroupL,
        'searchGroupM': searchGroupM,
        'searchGroupS': searchGroupS,
        'currentPage' : ($('#currentPage').val()== '')? 1 : $('#currentPage').val(),
        'searchText': searchIptText
    };

    $.tiAjax({
        type: 'POST',
        url: '/learning/searchIptDlg',
        data : params,
        isloading: true,
        success: function(data) {

            $('#dialogTbltbody').html('');
            var item = '';
            if(data.list.length > 0){
                
                for(var i = 0; i < data.list.length; i++){
                    if(data.list[i].DLG_API_DEFINE == 'D'){
                        data.list[i].DLG_API_DEFINE = 'Common';
                    }
                    item += '<tr>' +
                            '<td>' + data.list[i].DLG_API_DEFINE +'</td>' +
                            '<td>' + data.list[i].GroupS +'</td>' +
                            '<td class="txt_left tex01"><a href="#"  data-toggle="modal" data-target="#dialogShowMordal"  onclick="searchDialog('+ data.list[i].DLG_ID +');return false;">' + data.list[i].DLG_DESCRIPTION + '</a></td>' +
                            '<td>' + data.list[i].LUIS_ENTITIES +'</td>' +
                            '</tr>';
                }

                searchIptText = params.searchText;
                currentSearchNum = 0;

                if(data.groupList.length > 0) {
                    var item2 = '';
                    var item3 = '';
                    item2 = '<label for="all" class="allGroup selectArea">View all</label>';
                    for(var i = 0; i <data.groupList.length; i++) {
                        item2 += '<ul class="checkouter selectArea">' +
                                '<li class="selectArea">' +
                                '<div class="heading selectArea">' +
                                '<label class="groupL selectArea" for="' + data.groupList[i].largeGroup + '">' + data.groupList[i].largeGroup + '</label>' +
                                '<span class="checktoggle largeGroup selectArea"></span></div>' +
                                '<ul class="checklist selectArea" id="' + data.groupList[i].largeGroup + '">' +
                                '</ul>' +
                                '</li>' +
                                '</ul>';
                        
                        item3 += '<option>' + data.groupList[i].largeGroup + '</option>'
                    }
                    $('.selectOptionsbox').html("");
                    $('.selectOptionsbox').append(item2);
                    //$('#searchGroupL').append(item3);
                    $('.checklist').hide();
                    saveSelectDivHtml = item2;
                } else {
                    $('.selectOptionsbox').html("");
                }
            } else {
                item += '<tr style="height: 175px;">' +
                            '<td colspan="4">' + language.NO_DATA + '</td>' +
                        '</tr>';
            }
  
            $('#dialogTbltbody').append(item);

            $('#pagination').html('').append(data.pageList);
        }
    });
}

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

function writeCarouselImg(e) {
    var icx = $('#commonLayout').find('.insertForm').index($(e).parents('.insertForm'));
    var jcx = $(e).parents('.insertForm').find('input[name=imgUrl]').index(e);

    $('#dialogPreview').children().eq(icx).find('ul:eq(0)').children().eq(jcx).find('.imgContainer img').attr("src",e.value);
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

function createDialog(){

    var idx = $('form[name=dialogLayout]').length;
    var array = [];
    var exit = false;
    if ($('#description').val().trim() === "" ) {
        alert(language.Description_must_be_entered);
        return false;
    }
    $('.insertForm input[name=dialogTitle]').each(function(index) {
        if ($(this).val().trim() === "") {
            alert();
            exit = true;
            return false;
        }
    });
    if(exit) return;
    $('.insertForm textarea[name=dialogText]').each(function(index) {
        if ($(this).val().trim() === "") {
            alert(language.You_must_enter_a_Dialog_Title);
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
        data: {'data' : array},
        success: function(data) {
            alert('success');
            $('.createDlgModalClose').click();
        }
    });
}

//selectbox 중그룹 및 소그룹 찾기 kh
$(document).on('change', '.searchGroup', function(){

    if($(this).attr('id') == 'searchGroupL') {

        searchGroup($(this).val(), 'searchMedium', 1);
    } else if($(this).attr('id') == 'searchGroupM') {
        searchGroup($(this).val(), 'searchSmall', 1, $('#searchGroupL').val());
    }
    
});

//search버튼 클릭시 다이얼로그 검색
$(document).on('click', '#searchDlgBtn', function() {

    var group  = {
        sourceType2: $('#sourceType2').val(),
        searchGroupL: $('#searchGroupL').val(),
        searchGroupM: $('#searchGroupM').val(),
        searchGroupS: $('#searchGroupS').val()
    }

    $('#currentPage').val(1);
    selectDlgByFilter(group);

});

var searchGroups; // 페이징을 위해서 검색 후 그룹들을 담아둘 변수
function selectDlgByFilter(group){
    
    sourceType2 = $('#sourceType2').val();
    searchGroupL = $('#searchGroupL').val();
    searchGroupM = $('#searchGroupM').val();
    searchGroupS = $('#searchGroupS').val();
    
    params = {
        //'searchTxt':$('#iptDialog').val(),
        'currentPage' : ($('#currentPage').val()== '')? 1 : $('#currentPage').val(),
        'searchGroupL': group.searchGroupL,
        'searchGroupM': group.searchGroupM,
        'searchGroupS': group.searchGroupS,
        'sourceType2': group.sourceType2
    };
    if (searchText !== '') {
        params.searchText = searchText;
    }
    if (searchGroupL !== '') {
        params.upperGroupL = searchGroupL;
    }
    if (searchGroupM !== '') {
        params.upperGroupM =searchGroupM;
    }
    if (searchGroupS !== '') {
        params.upperGroupS = searchGroupS;
    }
    
    $.tiAjax({
        type: 'POST',
        url: '/learning/dialogs2',
        data : params,
        isloading: true,
        success: function(data) {

            $('#dialogTbltbody').html('');
            var item = '';
            if(data.list.length > 0){
                
                for(var i = 0; i < data.list.length; i++){
                    if(data.list[i].DLG_API_DEFINE == 'D'){
                        data.list[i].DLG_API_DEFINE = 'Common';
                    }
                    item += '<tr>' +
                            '<td>' + data.list[i].DLG_API_DEFINE +'</td>' +
                            '<td>' + data.list[i].GroupS +'</td>' +
                            '<td class="txt_left tex01"><a href="#"  data-toggle="modal" data-target="#dialogShowMordal"   onclick="searchDialog('+ data.list[i].DLG_ID +');return false;">' + data.list[i].DLG_DESCRIPTION + '</a></td>' +
                            '<td>' + data.list[i].LUIS_ENTITIES +'</td>' +
                            '</tr>';
                }

                
                
                if (searchGroupL !== '') {
                    if (!$('#selBoxBody').find('label[for=' + searchGroupL + ']').parent().hasClass('active')) {
                        $('#selBoxBody').find('label[for=' + searchGroupL + ']').next().trigger('click');
                    }
                }
                

            } else {
                item += '<tr style="height: 175px;">' +
                            '<td colspan="4">' + language.NO_DATA + '</td>' +
                        '</tr>';
            }
        
            $('#dialogTbltbody').append(item);

            $('#pagination').html('').append(data.pageList);
            currentSearchNum = 1;
            searchGroups = group;
        }
    });

}

//그룹메뉴에서 모두보기 눌렀을시 리스트 초기화
$(document).on('click', '.allGroup', function(){
    var groupType =  $(this).text();
    var sourceType = $('#tblSourceType').val();
    $('#currentPage').val(1);
    $('.selected').text($(this).text());
    $('.selectOptionsbox').removeClass('active');
    selectDlgByTxt(groupType, sourceType);
}) 

// 소그룹 클릭시 리스트 출력
$(document).on('click', '.smallGroup', function(){
    
    var group  = {
        searchGroupL: $('.currentGroupL').text(),
        searchGroupM: $('.currentGroupM').text(),
        searchGroupS: $(this).children().text(),
        sourceType2: $('#tblSourceType').val()
    }

    $('.selected').text($(this).find('.menuName').text());
    $('.selectOptionsbox').removeClass('active');


    $('#currentPage').val(1);
    selectDlgByFilter(group);
});

/** 대그룹 혹은 중그룹 클릭시 하위 그룹 검색  */
$(document).on('click', '.checktoggle', function (e) {
    
    // 대그룹 클릭시 중그룹 검색
    if($(this).hasClass('largeGroup')){

        if($(this).parent().hasClass('active')) {

            $(this).parent().next().slideToggle(200);
            $(this).parent().toggleClass('active').toggleClass('bgcolor');
            
        } else {
            if($(this).parent().next().children().size() == 0) {
                searchGroup($(this).prev().text(), 'searchMedium');       
            }

            $('.largeGroup').parent().removeClass('active').removeClass('bgcolor');
            $('.largeGroup').parent().next().slideUp(200);
            $('.currentGroupL').removeClass('currentGroupL');

            $(this).prev().addClass('currentGroupL');
            $(this).parent().addClass('active').addClass('bgcolor');
            $(this).parent().next().slideDown(200);

            if (searchGroupM !== '') {
                if ($('#selBoxBody').find('label[for=' + searchGroupL + ']').parents('li')
                                .find('label[for=' + searchGroupM + ']').parent().next().css('display') !== 'block' ) {
                if (searchGroupM !== '') {
                    $('#selBoxBody').find('label[for=' + searchGroupL + ']').parents('li')
                                    .find('label[for=' + searchGroupM + ']').next().trigger('click');
                }
            }
            }
            
        }
    }

    // 중분류 클릭시 소분류 검색
    if($(this).hasClass('mediumGroup')) {

        if($(this).parent().hasClass('active')) {
            $(this).parent().next().slideToggle(200);
            $(this).parent().toggleClass('active').toggleClass('bgcolor');
        } else {
            if($(this).parent().next().children().size() == 0) {
                searchGroup($(this).prev().text(), 'searchSmall', 0, $('.groupL.currentGroupL').text());       
            }

            $('.mediumGroup').parent().removeClass('active').removeClass('bgcolor');
            $('.mediumGroup').parent().next().slideUp(200);
            $('.currentGroupM').removeClass('currentGroupM');

            $(this).prev().addClass('currentGroupM');
            $(this).parent().addClass('active').addClass('bgcolor');
            $(this).parent().next().slideDown(200);
        }
    }
});

function searchGroup(groupName, group, type, groupL) {
    $.tiAjax({
        type: 'POST',
        url: '/learning/searchGroup',
        data : {'groupName' : groupName, 'group' : group, 'searchType' : type, 'groupL': groupL, 'searchTxt':$('#iptDialog').val()},
        isloading: true,
        success: function(data) {
            if(type == 1) {

                if(group == 'searchMedium') {

                    var item = '<option value="">' + language.Middle_group + '</option>';

                    for(var i = 0; i <data.groupList.length; i++) {
                        if (searchGroupL !== '') {
                            //if (groupName === searchGroupL) {
                                item += '<option>' + data.groupList[i].mediumGroup + '</option>';
                            //}
                        } else {
                            item += '<option>' + data.groupList[i].mediumGroup + '</option>';
                        }
                    }
                    $('#searchGroupM').html('');
                    $('#searchGroupS').html('');
                    $('#searchGroupS').html('<option value="">' + language.Small_group + '</option>');
                    $('#searchGroupM').append(item);
                    
                    //$('#selBoxBody').find('label[for=' + groupName + ']').next().trigger('click');

                    if(data.groupList.length > 0) {
                        var item2 = '';
        
                        for(var i = 0; i <data.groupList.length; i++) {
                            item2 += '<li class="selectArea">' +
                                     '<div class="heading selectArea">' +
                                     '<label class="selectArea groupM" for="' + data.groupList[i].mediumGroup + '">' + data.groupList[i].mediumGroup + '</label>' +
                                     '<span class="checktoggle mediumGroup selectArea"></span></div>' +
                                     '<ul class="checklist2 selectArea ' + data.groupList[i].mediumGroup + ' ' + groupName + '">' +
                                     '</ul>' +
                                     '</li>';
                            
                        }
                    }
                    $('#' + groupName).empty();
                    $('#' + groupName).append(item2);
                    $('.checklist2').hide();
                    

                } else if(group == 'searchSmall') {
                    var item = '<option value="">' + language.Small_group + '</option>';

                    for(var i = 0; i <data.groupList.length; i++) {
                        if (searchGroupM !== '') {
                            //if (data.groupList[i].smallGroup === searchGroupM) {
                                item += '<option>' + data.groupList[i].smallGroup + '</option>';
                            //}
                        } else {
                            item += '<option>' + data.groupList[i].smallGroup + '</option>';
                        }
                    }

                    $('#searchGroupS').html('');
                    $('#searchGroupS').append(item);

                    //$('#selBoxBody').find('label[for=' + $('#searchGroupL').val() + ']').parents('li')
                    //                .find('label[for=' + groupName + ']').next().trigger('click');

                    if(data.groupList.length > 0) {
                        var item2 = '';
        
                        for(var i = 0; i <data.groupList.length; i++) {

                            item2 += '<li class="smallGroup">' +
                                     '<label for="check2 groupS" class="menuName">' + data.groupList[i].smallGroup + '</label>' + 
                                     '</li>';
                        }
                    }
                    $('.' + groupName + '.' + groupL).empty();
                    $('.' + groupName + '.' + groupL).append(item2);


                }
            } else {

                if(group == 'searchMedium') {
                    
                    if(data.groupList.length > 0) {
                        var item2 = '';
        
                        for(var i = 0; i <data.groupList.length; i++) {
                            item2 += '<li class="selectArea">' +
                                     '<div class="heading selectArea">' +
                                     '<label class="selectArea groupM" for="' + data.groupList[i].mediumGroup + '">' + data.groupList[i].mediumGroup + '</label>' +
                                     '<span class="checktoggle mediumGroup selectArea"></span></div>' +
                                     '<ul class="checklist2 selectArea ' + data.groupList[i].mediumGroup + ' ' + groupName + '">' +
                                     '</ul>' +
                                     '</li>';
                            
                        }
                    }
                    $('#' + groupName).empty();
                    $('#' + groupName).append(item2);
                    $('.checklist2').hide();
                    
                } else if(group == 'searchSmall') {
                    
                    if(data.groupList.length > 0) {
                        var item2 = '';
        
                        for(var i = 0; i <data.groupList.length; i++) {

                            item2 += '<li class="smallGroup">' +
                                     '<label for="check2 groupS" class="menuName">' + data.groupList[i].smallGroup + '</label>' + 
                                     '</li>';
                        }
                    }
                    $('.' + groupName + '.' + groupL).empty();
                    $('.' + groupName + '.' + groupL).append(item2);
                }
            }
            
        }
    });
}

/* 서치그룹으로 통합함 서치그룹이 문제 생길시 이걸 이용해서 중그룹 찾기
function searchMidGroup(groupName) {
    $.tiAjax({
        type: 'POST',
        url: '/learning/searchMidGroup',
        data : {'groupName' : groupName},
        isloading: true,
        success: function(data) {
            if(data.groupList.length > 0) {
                var item2 = '';

                for(var i = 0; i <data.groupList.length; i++) {
                    item2 += '<li class="selectArea">' +
                             '<div class="heading selectArea">' +
                             '<label class="selectArea" for="' + data.groupList[i].mediumGroup + '">' + data.groupList[i].mediumGroup + '</label>' +
                             '<span class="checktoggle mediumGroup selectArea"></span></div>' +
                             '<ul class="checklist selectArea" id="' + data.groupList[i].mediumGroup + '">' +
                             '</ul>' +
                             '</li>';
                }
            }
            $('#' + groupName).empty();
            $('#' + groupName).append(item2);
        }
    });
}*/

//dialog 페이지 첫 로딩때도 실행
var sourceType2 = $('#sourceType2').val();
var searchGroupL = '';
var searchGroupM = '';
var searchGroupS = '';
var searchText = '';
function selectDlgByTxt(groupType, sourceType){
    if (sourceType === 'search') {
        sourceType = $('#sourceType2').val();
    }
    params = {
        'sourceType2': sourceType2,
        'searchGroupL': searchGroupL,
        'searchGroupM': searchGroupM,
        'searchGroupS': searchGroupS,
        'currentPage' : ($('#currentPage').val()== '')? 1 : $('#currentPage').val(),
        'groupType':groupType,
        'sourceType' : sourceType,
        'searchTxt':$('#iptDialog').val()
    };

    $.tiAjax({
        type: 'POST',
        url: '/learning/dialogs',
        data : params,
        isloading: true,
        success: function(data) {
            searchText = $('#iptDialog').val();
            $('#dialogTbltbody').html('');
            var item = '';
            if(data.list.length > 0){
                
                for(var i = 0; i < data.list.length; i++){
                    if(data.list[i].DLG_API_DEFINE == 'D'){
                        data.list[i].DLG_API_DEFINE = 'Common';
                    }
                    item += '<tr>' +
                            '<td>' + data.list[i].DLG_API_DEFINE +'</td>' +
                            '<td>' + data.list[i].GroupS +'</td>' +
                            '<td class="txt_left tex01"><a href="#"  data-toggle="modal" data-target="#dialogShowMordal"  onclick="searchDialog('+ data.list[i].DLG_ID +');return false;">' + data.list[i].DLG_DESCRIPTION + '</a></td>' +
                            '<td>' + data.list[i].LUIS_ENTITIES +'</td>' +
                            '</tr>';
                }

                if(data.groupList.length > 0) {
                    var item2 = '';
                    item2 = '<label for="all" class="allGroup selectArea">View all</label>';
                    for(var i = 0; i <data.groupList.length; i++) {
                        item2 += '<ul class="checkouter selectArea">' +
                                '<li class="selectArea">' +
                                '<div class="heading selectArea">' +
                                '<label class="groupL selectArea" for="' + data.groupList[i].largeGroup + '">' + data.groupList[i].largeGroup + '</label>' +
                                '<span class="checktoggle largeGroup selectArea"></span></div>' +
                                '<ul class="checklist selectArea" id="' + data.groupList[i].largeGroup + '">' +
                                '</ul>' +
                                '</li>' +
                                '</ul>';
                    }
                    $('.selectOptionsbox').html("");
                    $('.selectOptionsbox').append(item2);
                    $('.checklist').hide();
                    saveSelectDivHtml = item2;
                }
            } else {
                item += '<tr style="height: 175px;">' +
                            '<td colspan="4">' + language.NO_DATA + '</td>' +
                        '</tr>';
            }
        
            currentSearchNum = 2;
            $('#dialogTbltbody').append(item);

            $('#pagination').html('').append(data.pageList);

            if (rememberSelBoxHtml !== '') {
                $('#selBoxBody').html(rememberSelBoxHtml);
            }

        }
    });
}




var currentSearchNum = 2; // 0: 검색어로 검색한 경우, 1: 테이블 위 그룹으로 검색한 경우, 2: 테이블에 있는 그룹으로 검색한 경우
$(document).on('click','.li_paging',function(e){
    
    if(!$(this).hasClass('active')){
        $('#currentPage').val($(this).text());
        if(currentSearchNum == 0) {

            searchIptDlg(); 
        } else if(currentSearchNum == 1) {

            selectDlgByFilter(searchGroups);
        } else if(currentSearchNum == 2) {

            var groupType =  $('.selected').text();
            var sourceType = $('#tblSourceType').val();
            selectDlgByTxt(groupType, sourceType);
        }
    }
});

var $insertForm;
var $dlgForm;
var $carouselForm;
var $mediaForm;
function openModalBox(target){
    
    /*
    if ($('div[checked=checked]').length !== 1) {
        alert('Utterance를 1개 선택해야 합니다.');
        return;
    }
    */

    //carousel clone 초기값 저장
    $insertForm = $('#commonLayout .insertForm').eq(0).clone();
    $dlgForm = $('#commonLayout .textLayout').eq(0).clone();
    $carouselForm = $('#commonLayout .carouselLayout').eq(0).clone();
    $mediaForm = $('#commonLayout .mediaLayout').eq(0).clone();

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
    setTimeout(function() {
        $(target).fadeIn( );
        $('#dialogPreview').css({'height':'80%'});
      }, 250);

    $('html').css({'overflow': 'hidden', 'height': '100%'});
        $('#element').on('scroll touchmove mousewheel', function(event) { // 터치무브와 마우스휠 스크롤 방지
            event.preventDefault();
            event.stopPropagation();
            return false;
    });
    wrapWindowByMask();

    if(target == "#create_dlg") {
        $(".insertForm form").append($(".textLayout").clone(true));
        $(".insertForm .textLayout").css("display","block");
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
/** 모달 끝 */






var botChatNum4Desc = 1; 
//dlg 저장
var dlgMap = new Object();
function searchDialog(dlgID) {
    $.ajax({
        url: '/learning/getDlgAjax',                //주소
        dataType: 'json',                  //데이터 형식
        type: 'POST',                      //전송 타입
        data: {'dlgID':dlgID},      //데이터를 json 형식, 객체형식으로 전송

        success: function(result) {          //성공했을 때 함수 인자 값으로 결과 값 나옴
            var inputUttrHtml = '';

            if(result['list'].length == 0) {
                inputUttrHtml += '<div style="display:table-cell;vertical-align:middle; height:400px; width:900px; text-align:center;">' +
                                    language.NO_DATA +
                                 '</div>';
            } else {

                var row = result['list'];
                /*
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
                */

                for (var i = 0; i < row.length; i++) {
                    botChatNum4Desc++;
                    var val = row[i];

                    inputUttrHtml += '<div style="width: 90%; height: 90%; float:left; margin: 15px 20px;">';
                    //inputUttrHtml += '<div style="height: 10%; width: 100%; z-index:5; background-color: #6f6c6c;">';
                    //inputUttrHtml += '<div class="check-radio-tweak-wrapper2 searchDlgChk" type="checkbox">';
                    //inputUttrHtml += '<input name="chksearch" class="tweak-input" type="checkbox"/>';
                    //inputUttrHtml += '</div>';
                    //inputUttrHtml += '</div>';
                    inputUttrHtml += '<div style="height: 90%; overflow: scroll; overflow-x: hidden; background-color: rgb(241, 243, 246);; padding:10px;">';

                    //for(var l = 0; l < val.length; l++){
                        var tmp = val;//val[l];

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
                                    inputUttrHtml += '<div class="wc-message wc-message-from-bot">';
                                    inputUttrHtml += '<div class="wc-message-content">';
                                    inputUttrHtml += '<svg class="wc-message-callout"></svg>';
                                    inputUttrHtml += '<div class="wc-carousel slideBanner" style="width: 312px;">';
                                    inputUttrHtml += '<div>';
                                    inputUttrHtml += '<button class="scroll previous" id="prevBtn' + (botChatNum4Desc) + '" style="display: none;" onclick="prevBtn(' + botChatNum4Desc + ')">';
                                    inputUttrHtml += '<img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_left_401x.png">';
                                    inputUttrHtml += '</button>';
                                    inputUttrHtml += '<div class="wc-hscroll-outer" >';
                                    inputUttrHtml += '<div class="wc-hscroll" style="margin-bottom: 0px;" class="content" id="slideDiv' + (botChatNum4Desc) + '">';
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
                                if((tmp.dlg.length == 2 && j == 1) || (tmp.dlg.length == 1 && j == 0)) {
                                    inputUttrHtml += '</ul>';
                                    inputUttrHtml += '</div>';
                                    inputUttrHtml += '</div>';
                                    inputUttrHtml += '</div></div></div></div>';
                                } else if((tmp.dlg.length-1) == j) {
                                    inputUttrHtml += '</ul>';
                                    inputUttrHtml += '</div>';
                                    inputUttrHtml += '</div>';
                                    inputUttrHtml += '<button class="scroll next" id="nextBtn' + (botChatNum4Desc) + '" onclick="nextBtn(' + botChatNum4Desc + ')"><img src="https://bot.hyundai.com/assets/images/02_contents_carousel_btn_right_401x.png"></button>';
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
                    //}
                

                inputUttrHtml += '</div>';
                inputUttrHtml += '</div>';
                }
            }
            $('#dialogShow').html(inputUttrHtml);
            //$('#dialogShow').prepend(inputUttrHtml);
            //openModalBox('#dialogShowMordal');
            
        } 
        

    }); // ------      ajax 끝-----------------
}

