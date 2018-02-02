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

    $('#addDialogClose , #addDialogCancel').click(function(){
        $('#mediaCarouselLayout').css('display','none');
        $('#cardLayout').css('display','none');
        $('#appInsertForm')[0].reset();
    });
    //** 모달창 끝 */
})

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
                    item += '<td class="txt_center" style="width: 30%">' + data.list[i].ENTITY + "</td>" ;
                    item += '<td class="txt_center" style="width: 40%">' + data.list[i].ENTITY_VALUE; 
                    item += '<form action="" method="post" name="entityForm" style="display: inline;">';
                    item += '<img src="../images/plus_icon.png" class="openAddInput" style="height:17px; width: 17px; margin-left: 10px;">';
                    item += '<img src="../images/minus_icon.png" class="closeAddInput" style="height:17px; width: 17px; margin-left: 10px; display: none;">';
                    item += '<div style="display: none;"><input type="text" name="addEntityValue"/>';
                    item += '<button class="btn addEntityValueBtn">저장</button>';
                    item += '</div>';
                    item += '<input type="hidden" name="entityDefine" value="' + data.list[i].ENTITY + '">';
                    item += '<input type="hidden" name="apiGroup" value="' + data.list[i].API_GROUP + '">';
                    item += '</td>';
                    item += '<td class="txt_center" style="width: 30%">' + data.list[i].API_GROUP + '</td>';  
                    item += '</form>';
                    item += '</tr>';
                }
                
            }
            $('#entitesTbltbody').append(item);
            $('#pagination').html('').append(data.pageList).css('width', (35 * $('.li_paging').length) +'px');
        }
    });
}

$(document).on('click','.li_paging',function(e){
    if($(e.target).val() != $('#currentPage').val()){
        $('#currentPage').val($(e.target).val())
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

        alert("저장하실 엔티티 밸류를 입력해주세요");
    } else {

        var addValues = $(this).parent().parent().serializeObject();
        addEntityValueAjax(addValues);
    }
})

//엔티티 밸류 저장(추가) ajax
function addEntityValueAjax(addValues) {

    $.ajax({
        url: '/learning/addEntityValue',
        dataType: 'json',
        type: 'POST',
        data: addValues,
        success: function(data) {
            if(data.status == 200){
                alert("추가하였습니다.");
                $("#iptentites").val(addValues.addEntityValue);
                searchEntities();
            } else {
                alert("오류 발생으로 인해 추가하지 못하였습니다.");
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
                        item += '<td class="txt_center" style="width: 30%">' + data.list[i].ENTITY + "</td>" ;
                        item += '<td class="txt_center" style="width: 40%">' + data.list[i].ENTITY_VALUE; 
                        item += '<form action="" method="post" name="entityForm" style="display: inline;">';
                        item += '<img src="../images/plus_icon.png" class="openAddInput" style="height:17px; width: 17px; margin-left: 10px;">';
                        item += '<img src="../images/minus_icon.png" class="closeAddInput" style="height:17px; width: 17px; margin-left: 10px; display: none;">';
                        item += '<div style="display: none;"><input type="text" name="addEntityValue"/>';
                        item += '<button class="btn addEntityValueBtn">저장</button>';
                        item += '</div>';
                        item += '<input type="hidden" name="entityDefine" value="' + data.list[i].ENTITY + '">';
                        item += '<input type="hidden" name="apiGroup" value="' + data.list[i].API_GROUP + '">';
                        item += '</td>';
                        item += '<td class="txt_center" style="width: 30%">' + data.list[i].API_GROUP + '</td>';  
                        item += '</form>';
                        item += '</tr>';
                    }
                    
                }
                $('#entitesTbltbody').append(item);
                $('#pagination').html('').append(data.pageList).css('width', (35 * $('.li_paging').length) +'px');
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
    
    var defineText = $('input[name=entityDefine]').val();
    var valueText = $('input[name=entityValue]').val();
    
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
                $('#addDialogClose').click();
                alert("추가하였습니다.");
                entitiesAjax();
            } else {
                alert("오류 발생으로 인해 추가하지 못하였습니다.");
            }
        }
    });
}
//** 모달창 끝 */