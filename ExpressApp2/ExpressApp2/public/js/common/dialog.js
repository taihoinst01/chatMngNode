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
    var sourceType = $('#sourceType').val();
    dialogsAjax(groupType, sourceType);

    $('#sourceType').change(function(){
        groupType = $('.selected').text();
        sourceType = $('#sourceType').val();
        $('#currentPage').val(1);
        dialogsAjax(groupType, sourceType);
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

    /**모달 */
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

    $('#addDialogClose , #addDialogCancel').click(function(){
        $('#mediaCarouselLayout').css('display','none');
        $('#cardLayout').css('display','none');
        $('#appInsertForm')[0].reset();
        $('#dialogPreview').html('');
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
});

//selectbox 중그룹 및 소그룹 찾기 kh
$(document).on('change', '.searchGroup', function(){

    if($(this).attr('id') == 'searchGroupL') {

        searchGroup($(this).val(), 'searchMedium', 1);
    } else if($(this).attr('id') == 'searchGroupM') {
        alert("확인1");
        searchGroup($(this).val(), 'searchSmall', 1, $('#searchGroupL').val());
    }
    
});

//search버튼 클릭시 다이얼로그 검색
$(document).on('click', '#searchDlgBtn', function() {

    var searchText = $('#iptDialog').val();
    var sourceType2 = $('#sourceType2').val();
    var group  = {
        searchGroupL: $('#searchGroupL').val(),
        searchGroupM: $('#searchGroupM').val(),
        searchGroupS: $('#searchGroupS').val()
    }

    if(searchText == '' || searchText == null ) {
        
        alert("검색어를 입력해주세요");
        return;
    } else {

       if(group.searchGroupL == 'default' || group.searchGroupM == 'default' || group.searchGroupS == 'default') {
           
            alert("그룹을 재설정 해주세요");
       } else {

            $('#currentPage').val(1);
            dialogsAjax2(group, sourceType2, searchText);
       }
    }
});

function dialogsAjax2(group, sourceType2, searchText){

    params = {
        'currentPage' : ($('#currentPage').val()== '')? 1 : $('#currentPage').val(),
        'searchGroupL': group.searchGroupL,
        'searchGroupM': group.searchGroupM,
        'searchGroupS': group.searchGroupS,
        'sourceType2': sourceType2,
        'searchText': searchText
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

                
            }

            
            $('#dialogTbltbody').append(item);

            $('#pagination').html('').append(data.pageList).css('width', (35 * $('.li_paging').length) +'px');
        }
    });

}

//그룹메뉴에서 모두보기 눌렀을시 리스트 초기화
$(document).on('click', '.allGroup', function(){
    var groupType =  $(this).text();
    var sourceType = $('#sourceType').val();
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
        searchGroupS: $(this).children().text()
    }

    $('.selected').text($(this).find('.menuName').text());
    $('.selectOptionsbox').removeClass('active');

    var groupType =  $('.selected').text();
    var sourceType = $('#sourceType').val();
    $('#currentPage').val(1);
    dialogsAjax2(group, sourceType, "");
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

                    var item = '<option value="default">중그룹</option>';

                    for(var i = 0; i <data.groupList.length; i++) {

                        item += '<option>' + data.groupList[i].mediumGroup + '</option>';
                    }

                    $('#searchGroupM').html('');
                    $('#searchGroupS').html('');
                    $('#searchGroupS').html('<option value="default">소그룹</option>');
                    $('#searchGroupM').append(item);
                } else if(group == 'searchSmall') {
                    alert("확인3");
                    var item = '<option value="default">소그룹</option>';

                    for(var i = 0; i <data.groupList.length; i++) {
                        alert("확인4");
                        item += '<option>' + data.groupList[i].smallGroup + '</option>';
                    }
                    alert("확인5");
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
                    item2 = '<label for="all" class="allGroup selectArea">모두보기</label>';
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
            }

            
            $('#dialogTbltbody').append(item);

            $('#pagination').html('').append(data.pageList).css('width', (35 * $('.li_paging').length) +'px');
        }
    });

}

$(document).on('click','.li_paging',function(e){
    if($(e.target).val() != $('#currentPage').val()){
        $('#currentPage').val($(e.target).val())
        var groupType =  $('.selected').text();
        var sourceType = $('#sourceType').val();
        dialogsAjax(groupType, sourceType);
    }
});

/** 모달 */
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

