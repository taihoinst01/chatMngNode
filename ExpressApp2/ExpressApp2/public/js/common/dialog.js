var language;
;(function($) {
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

    // groupType 사양및 장단점 역할
    // sourceType 구분 역할
    var groupType =  $('.selected').text();
    var sourceType = $('#tblSourceType').val();
    dialogsAjax(groupType, sourceType);

    $('#tblSourceType').change(function(){
        groupType = $('.selected').text();
        sourceType = $('#tblSourceType').val();
        $('#currentPage').val(1);
        dialogsAjax(groupType, sourceType);
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
        //$(".insertFormWrap").append(insertForm);
        var insertHtml = '';
        insertHtml += '<div class="dialogView">';
        insertHtml += '<div class="wc-message wc-message-from-bot" style="width:80%;">';
        insertHtml += '<div class="wc-message-content">';
        insertHtml += '<svg class="wc-message-callout"></svg>';
        insertHtml += '<div><div class="format-markdown"><div class="textMent">';
        insertHtml += '<p>';
        insertHtml += language.Please_enter;
        insertHtml += '</p>';
        insertHtml += '</div></div></div></div></div>';
        insertHtml += '</div>';

        $("#dialogPreview").append(insertHtml);
        e.stopPropagation();
        e.preventDefault();
        
    });

    
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

    $(document).on('click', '[name=addMediaBtn]',function(e){

        $(this).parent().parent().find($('.mediaBtnName')).each(function(index){

            if($(this).css('display') === 'none') {

                $(this).show();
                $(this).parent().parent().next().find($('.mediaBtnContent')).eq(index).show();
                return false; 
            }
        });


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

            var mediaForm = '<div id="mediaLayout" style="display: block;">' + $mediaForm.html() + '</div>'
            $('.insertForm:eq(' + idx + ') form').append('<div id="mediaLayout" style="display:none;">' + mediaForm + '</div>') ;
            $('.insertForm:eq(' + idx + ') #mediaLayout').css('display', 'block');
            //$('.insertForm:eq(' + idx + ') #mediaLayout').find('[name=addMediaBtn]:last').closest('div').css('display', 'inline-block');
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
        
        if($('#btnCreatLgroup').html() == 'cancel') {

            $('#btnCreatLgroup').click();
        }
        $('#dialogPreview').html('<div class="dialogView"><div><div class="wc-message wc-message-from-bot" style="width:80%;"><div class="wc-message-content"><svg class="wc-message-callout"></svg><div><div class="format-markdown"><div class="textMent"><p>입력해주세요...</p></div></div></div></div></div></div></div>');

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

    $('#sourceType').change(function(e){

        if($(e.target).val() == "API") {
            $('#dialogPreview').html('');
            $('#commonLayout').css('display','none');
            $('#apiLayout').css('display','block');
        } else {
    
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
    
            $('#commonLayout').css('display','block');
            $('#commonLayout div:first').prepend(insertForm);
            $('#dialogPreview').html('<div class="dialogView"><div><div class="wc-message wc-message-from-bot" style="width:80%;"><div class="wc-message-content"><svg class="wc-message-callout"></svg><div><div class="format-markdown"><div class="textMent"><p>입력해주세요...</p></div></div></div></div></div></div></div>');
            
            $('#apiLayout').css('display','none');
            $(".insertForm form").append($("#textLayout").clone(true));
            $('.insertForm #textLayout').css('display','block');
        }
    });

    // create LargeGroup
    $('#btnCreatLgroup').on('click',function(){
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
var searchIptText; //페이징시 필요한 검색어 담아두는 변수
function searchIptDlg(page){

    if(page) {
        $('#currentPage').val(1);
        searchIptText = $('#iptDialog').val();
    }

    params = {
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
                            '<td class="txt_center">' + data.list[i].DLG_API_DEFINE +'</td>' +
                            '<td class="txt_center">' + data.list[i].GroupS +'</td>' +
                            '<td class="txt_left">' + data.list[i].DLG_DESCRIPTION + '</td>' +
                            '<td class="txt_center">' + data.list[i].LUIS_ENTITIES +'</td>' +
                            '</tr>';
                }

                searchIptText = params.searchText;
                currentSearchNum = 0;
            } else {
                item += '<tr style="height: 175px;">' +
                            '<td colspan="4">' + language.NO_DATA + '</td>' +
                        '</tr>';
            }
  
            $('#dialogTbltbody').append(item);

            $('#pagination').html('').append(data.pageList).css('width', (35 * $('.li_paging').length) +'px');
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

            var createDlgClone = $('#dialogPreview .dialogView').children().clone();          
            $('#dialogRecommand').html('');
            $('#dialogRecommand').append(createDlgClone);
            $('#addDialogCancel').click();
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
    dialogsAjax2(group);

});

var searchGroups; // 페이징을 위해서 검색 후 그룹들을 담아둘 변수
function dialogsAjax2(group){
  
    params = {
        'currentPage' : ($('#currentPage').val()== '')? 1 : $('#currentPage').val(),
        'searchGroupL': group.searchGroupL,
        'searchGroupM': group.searchGroupM,
        'searchGroupS': group.searchGroupS,
        'sourceType2': group.sourceType2
    };

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
                            '<td class="txt_center">' + data.list[i].DLG_API_DEFINE +'</td>' +
                            '<td class="txt_center">' + data.list[i].GroupS +'</td>' +
                            '<td class="txt_left">' + data.list[i].DLG_DESCRIPTION + '</td>' +
                            '<td class="txt_center">' + data.list[i].LUIS_ENTITIES +'</td>' +
                            '</tr>';
                }

                
            } else {
                item += '<tr style="height: 175px;">' +
                            '<td colspan="4">' + language.NO_DATA + '</td>' +
                        '</tr>';
            }
        
            $('#dialogTbltbody').append(item);

            $('#pagination').html('').append(data.pageList).css('width', (35 * $('.li_paging').length) +'px');
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
    dialogsAjax(groupType, sourceType);
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
    dialogsAjax2(group);
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
        data : {'groupName' : groupName, 'group' : group, 'groupL': groupL},
        isloading: true,
        success: function(data) {
            if(type == 1) {

                if(group == 'searchMedium') {

                    var item = '<option value="">' + language.Middle_group + '</option>';

                    for(var i = 0; i <data.groupList.length; i++) {

                        item += '<option>' + data.groupList[i].mediumGroup + '</option>';
                    }

                    $('#searchGroupM').html('');
                    $('#searchGroupS').html('');
                    $('#searchGroupS').html('<option value="">' + language.Small_group + '</option>');
                    $('#searchGroupM').append(item);
                } else if(group == 'searchSmall') {
                    var item = '<option value="">' + language.Small_group + '</option>';

                    for(var i = 0; i <data.groupList.length; i++) {
                        item += '<option>' + data.groupList[i].smallGroup + '</option>';
                    }
                    $('#searchGroupS').html('');
                    $('#searchGroupS').append(item);

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

function dialogsAjax(groupType, sourceType){

    params = {
        'currentPage' : ($('#currentPage').val()== '')? 1 : $('#currentPage').val(),
        'groupType':groupType,
        'sourceType' : sourceType
    };

    $.tiAjax({
        type: 'POST',
        url: '/learning/dialogs',
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
                            '<td class="txt_center">' + data.list[i].DLG_API_DEFINE +'</td>' +
                            '<td class="txt_center">' + data.list[i].GroupS +'</td>' +
                            '<td class="txt_left">' + data.list[i].DLG_DESCRIPTION + '</td>' +
                            '<td class="txt_center">' + data.list[i].LUIS_ENTITIES +'</td>' +
                            '</tr>';
                }

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
                    $('#searchGroupL').append(item3);
                    $('.checklist').hide();
                }
            } else {
                item += '<tr style="height: 175px;">' +
                            '<td colspan="4">' + language.NO_DATA + '</td>' +
                        '</tr>';
            }
        
            $('#dialogTbltbody').append(item);

            $('#pagination').html('').append(data.pageList).css('width', (35 * $('.li_paging').length) +'px');
        }
    });

}

var currentSearchNum = 2; // 0: 검색어로 검색한 경우, 1: 테이블 위 그룹으로 검색한 경우, 2: 테이블에 있는 그룹으로 검색한 경우
$(document).on('click','.li_paging',function(e){
    
    if($(e.target).val() != $('#currentPage').val()){
        $('#currentPage').val($(e.target).val());
        if(currentSearchNum == 0) {

            searchIptDlg(); 
        } else if(currentSearchNum == 1) {

            dialogsAjax2(searchGroups);
        } else if(currentSearchNum == 2) {
            dialogsAjax2();
        }
        /*
        $('#currentPage').val($(e.target).val())
        var groupType =  $('.selected').text();
        var sourceType = $('#tblSourceType').val();
        dialogsAjax(groupType, sourceType);
        */
    }
});

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
    $mediaForm = $('#commonLayout #mediaLayout').eq(0).clone();

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

