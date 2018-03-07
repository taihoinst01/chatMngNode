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
    entitiesAjax();

    //** 모달창 */
    //다이얼로그 생성 모달 닫는 이벤트(초기화)
    $(".js-modal-close").click(function() {
        $('html').css({'overflow': 'auto', 'height': '100%'}); //scroll hidden 해제
        //$('#element').off('scroll touchmove mousewheel'); // 터치무브 및 마우스휠 스크롤 가능

        $('#btnAddDlg').attr("disabled", "disabled");
        $('#btnAddDlg').addClass("disable");
        $('#layoutBackground').hide();
    });

    $('.addDialogCancel').click(function(){
        $('#appInsertForm')[0].reset();
    });
    //** 모달창 끝 */

    //생성버튼클릭시 다른div hidden
    $('#entites').click(function() {
        
        $('.close').trigger('click')
    });
});

$(document).on("click", ".more", function(e){
    if($(e.target).hasClass('more')){
        $(e.target).addClass('close').removeClass('more');
        $(e.target).parent().find(".board").css('visibility', 'visible');
     }
});

$(document).on("click", ".close", function(e){
    if($(e.target).hasClass('close')){
        $(e.target).addClass('more').removeClass('close');  
        $(e.target).parent().find(".board").css('visibility', 'hidden');
     }
});

$(document).on("click", ".cancelEntityValueBtn", function(e){
    $(e.target).parent().parent().parent().parent().parent().find(".close").addClass('more').removeClass('close');
    $(e.target).parent().parent().parent().parent().parent().find(".board").css('visibility', 'hidden');
});

function entitiesAjax(){

    params = {
        'currentPage' : ($('#currentPage').val()== '')? 1 : $('#currentPage').val()
    };
    $.tiAjax({
        type: 'POST',
        data: params,
        url: '/learning/entities',
        isloading: true,
        success: function(data) {
            $('#entitesTbltbody').html('');
            var item = '';
            if(data.list.length > 0){
                for(var i = 0; i < data.list.length; i++){
                    
                    item += '<tr>';
                    item += '<td>' + data.list[i].ENTITY + "</td>" ;
                    item += '<td><span class="fl">' + data.list[i].ENTITY_VALUE + "</span>";
                    item += '<a class="more fl"><span class="hc">+</span></a>';
                    item += '<div class="board">';
                    item += '<ul>';
                    item += '<form action="" method="post" name="entityForm">';
                    item += ' <li class="inp"><input name="entityValue" type="text" class="form-control fl"  style="width:60%;">';
                    item += '<button type="button" class="btn btn_01 mb05 addEntityValueBtn">저장</button> <button type="button" class="btn btn-default mb05 cancelEntityValueBtn">취소</button>';
                    item += '</li>';
                    item += '<input type="hidden" name="entityDefine" value="' + data.list[i].ENTITY + '">';
                    item += '<input type="hidden" name="apiGroup" value="' + data.list[i].API_GROUP + '">';
                    item += "</form>";
                    item += '</ul>';
                    item += '</div>';
                    item += '</td>';
                    item += '<td>' + data.list[i].API_GROUP + '</td>';  
                    item += '</tr>';
                }
                
            } else {
                item += '<tr>' +
                            '<td colspan="4">' + language.NO_DATA + '</td>' +
                        '</tr>';
            }
            
            $('#entitesTbltbody').append(item);
            $('#pagination').html('').append(data.pageList);
        }
    });
}

$(document).on('click','.li_paging',function(e){
    if($(e.target).parent().val() != $('#currentPage').val()){
        $('#currentPage').val($(e.target).parent().val())
        entitiesAjax();
    }
});

//엔티티 밸류 추가창 열기버튼
$(document).on('click', '.openAddInput', function() {

    $('.openAddInput').not($(this)).each(function(){
        if($(this).css('display') == 'none') {
            $(this).next().click();
        }
    })

    $(this).toggle();
    $(this).next().toggle();
    $(this).next().next().toggle();
})

//엔티티 밸류 추가창 닫기 버튼
$(document).on('click', '.closeAddInput', function() {

    $(this).toggle();
    $(this).prev().toggle();
    $(this).next().toggle();
})

//엔티티 밸류 저장 버튼
$(document).on('click', '.addEntityValueBtn', function() {
    
    //form submit 방지
    var submitAction = function(e) {
        e.preventDefault();
        e.stopPropagation();
        /* do something with Error */
    };
    $(this).parent().parent().on('submit', submitAction);

    if($(this).prev().val() == '' || $(this).prev().val() == null) {

        alert(language.Enter_entity_value_to_save);
    } else {

        var addValues = $(this).parent().parent().serializeObject();
        addEntityValueAjax(addValues);
    }
})

//엔티티 밸류 저장(추가) ajax
function addEntityValueAjax(addValues) {

    $.ajax({
        url: '/learning/insertEntity',
        dataType: 'json',
        type: 'POST',
        data: addValues,
        success: function(data) {
            if(data.status == 200){
                alert(language.Added);
                $("#iptentites").val(addValues.entityValue);
                searchEntities();
            } else if(data.status == 'Duplicate') {
                alert(language.DUPLICATE_ENTITIES_EXIST);
            } else {
                alert(language.It_failed);
            }
        }
    });
}

//엔티티 검색
function searchEntities() {

    if($("#iptentites").val() == '' || $("#iptentites").val() == null) {
        $('#currentPage').val(1);
        entitiesAjax();
    } else {
        params = {
            'currentPage' : 1,
            'searchEntities' : $('#iptentites').val()
        };
        $.tiAjax({
            type: 'POST',
            data: params,
            url: '/learning/searchEntities',
            isloading: true,
            success: function(data) {
                $('#entitesTbltbody').html('');
                var item = '';
                if(data.list.length > 0){
                    for(var i = 0; i < data.list.length; i++){
                        item += '<tr>';
                        item += '<td>' + data.list[i].ENTITY + "</td>" ;
                        item += '<td><span class="fl">' + data.list[i].ENTITY_VALUE + "</span>";
                        item += '<a class="more fl"><span class="hc">+</span></a>';
                        item += '<input type="hidden" name="entityDefine" value="' + data.list[i].ENTITY + '">';
                        item += '<input type="hidden" name="apiGroup" value="' + data.list[i].API_GROUP + '">';
                        item += '<div class="board">';
                        item += '<ul>';
                        item += '<form action="" method="post" name="entityForm">';
                        item += ' <li class="inp"><input name="entityValue" type="text" class="form-control fl"  style="width:60%;">';
                        item += '<button type="button" class="btn btn_01 mb05 addEntityValueBtn">저장</button> <button type="button" class="btn btn-default mb05 cancelEntityValueBtn">취소</button>';
                        item += '</li>';
                        item += '<input type="hidden" name="entityDefine" value="' + data.list[i].ENTITY + '">';
                        item += '<input type="hidden" name="apiGroup" value="' + data.list[i].API_GROUP + '">';
                        item += "</form>";
                        item += '</ul>';
                        item += '</div>';
                        item += '</td>';
                        item += '<td>' + data.list[i].API_GROUP + '</td>';  
                        item += '</tr>';
                    }
                    
                } else {
                    item += '<tr style="height: 175px;">' +
                                '<td colspan="4">' + language.NO_DATA + '</td>' +
                            '</tr>';
                }
                $('#entitesTbltbody').append(item);
                $('#pagination').html('').append(data.pageList);
            }
        });
    }
}

//** 모달창 */
function openModalBox(target){

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

function wrapWindowByMask(){ //화면의 높이와 너비를 구한다. 
    var maskHeight = $(document).height(); 
    var maskWidth = $(window).width(); //마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채운다. 
    $('#layoutBackground').css({'width':maskWidth,'height':maskHeight}); //마스크의 투명도 처리 
    $('#layoutBackground').fadeTo("fast",0.7); 
} 


//모달창 입력값에 따른 save 버튼 활성화 처리
function dialogValidation(){
    
    var defineText = $('#entityDefine').val();
    var valueText = $('#entityValue').val();
    
    if(defineText != "" && valueText != "") {
        $('#btnAddDlg').removeClass("disable");
        $('#btnAddDlg').attr("disabled", false);
    } else {
        $('#btnAddDlg').attr("disabled", "disabled");
        $('#btnAddDlg').addClass("disable");
    }
       
}

//엔티티 추가
function insertEntity(){

    $.ajax({
        url: '/learning/insertEntity',
        dataType: 'json',
        type: 'POST',
        data: $('#appInsertForm').serializeObject(),
        success: function(data) {
            if(data.status == 200){
                $('.addDialogCancel').click();
                alert(language.Added);
                entitiesAjax();
            } else if(data.status == 'Duplicate') {
                alert(language.DUPLICATE_ENTITIES_EXIST);
            } else {
                alert(language.It_failed);
            }
        }
    });
}
//** 모달창 끝 */