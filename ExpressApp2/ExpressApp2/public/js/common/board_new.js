
;(function($) {

})(jQuery);


$(document).ready(function () {
    
    "use strict";
    getScorePanel();

    drawScoreList();

    getOftQuestion();
    
    getResponseTime();

    getQueryByEachTime();

    drawNoneQuerytable();

    drawFirstQuery();

    drawfirstQuerytable();
});


//INTENT SCORE 평균/최소/최대 테이블 페이지 버튼 클릭
$(document).on('click','#scoreTablePaging .li_paging',function(e){
    if(!$(this).hasClass('active')){
        makeUserTable($(this).text());
    }
});
 
//미답변 질문 테이블 페이지 버튼 클릭
$(document).on('click','#noneQueryDivTablePaging .li_paging',function(e){
    if(!$(this).hasClass('active')){
        drawNoneQuerytable($(this).text());
    }
});
  
//고객 별 첫 질문 테이블 페이지 버튼 클릭
$(document).on('click','#fistQueryTablePaging .li_paging',function(e){
    if(!$(this).hasClass('active')){
        drawfirstQuerytable($(this).text());
    }
});


function getFilterVal(page) {
    var filterVal;
    if(page) {
        filterVal = {
            startDate : '02/27/2017', //$('input[name=daterangepicker_start]').val(),
            endDate : '02/27/2018', //$('input[name=daterangepicker_end]').val(),
            selDate  : $('#selDate').val(),
            selChannel  : $('#selChannel').val(),
            page : page
        };
    } else {
        filterVal = {
            startDate : '02/27/2017', //$('input[name=daterangepicker_start]').val(),
            endDate : '02/27/2018', //$('input[name=daterangepicker_end]').val(),
            selDate  : $('#selDate').val(),
            selChannel  : $('#selChannel').val()
        };
    }

    return filterVal;

}

//누적상담자수, 평균 응답 속도(ms), 평균 고객 질문 수, 평균 정상 답변율, 검색 응답률, 최대 고객 질문 수
function getScorePanel() {
    $.ajax({
        url: '/board/getScorePanel',
        dataType: 'json',
        type: 'POST',
        data: getFilterVal(),
        success: function(data) {
            var scores = data.list[0];
            $('#allCustomer').text(scores.CUSOMER_CNT);
            $('#avgReplySpeed').text(scores.REPLY_SPEED);
            $('#avgQueryCnt').text(scores.USER_QRY_AVG);

            var CORRECT_QRY = scores.CORRECT_QRY.toString();
            $('#avgCorrectAnswer').text(  (CORRECT_QRY.length>4? CORRECT_QRY.substr(0,4) : CORRECT_QRY ) + '%'  );
            $('#avgReply').text(scores.SEARCH_AVG + '%');
            $('#maxQueryCnt').text(scores.MAX_QRY);
        }
    })
}


//INTENT SCORE 평균/최소/최대
function drawScoreList(page) { 

    $.ajax({
        url: '/board/intentScore',
        dataType: 'json',
        type: 'POST',
        data: getFilterVal(page),
        success: function(data) {
            if (data.error_code != null && data.error_message != null) {
                alert(data.error_message);
            } else {
                var list = data.list;
                var scoreList = "";

                for (var i=0; i< list.length; i++) {
                    scoreList += "<tr><td>" + list[i].intentName + "</td>";
                    scoreList += "<td>" + list[i].intentCount + "</td>";
                    scoreList += "<td>" + list[i].intentScoreAVG + "</td>";
                    scoreList += "<td>" + list[i].intentScoreMIN + "</td>";
                    scoreList += "<td>" + list[i].intentScoreMAX + "</td></tr>";
                }
                
                $("#scoreTableBody").html(scoreList);
                $('#scoreTablePaging .pagination').html('').append(data.pageList);
            }
        }
    })
}

//자주 묻는 질문에 대한 답변 top 10
function getOftQuestion() {
    $.ajax({
        url: "/board/getOftQuestion",
        type: "post",
        data:  getFilterVal(),
    }).done(function(data) {
        if (data.error_code != null && data.error_message != null) {
            alert(data.error_message);
      } else {
            var tableList = data.list;

            var scoreList = "";

            for (var i=0; i< tableList.length; i++) {
                scoreList += "<tr><td>" + tableList[i].INTENT + "</td>";
                scoreList += "<td>" + tableList[i].KORQ + "</td>";
                scoreList += "<td>" + tableList[i].CHANNEL + "</td>";
                scoreList += "<td>" + tableList[i].QNUM + "</td>";
                scoreList += "<td>" + tableList[i].DATE + "</td></tr>";
            }
            
            $("#OftQuestionTableBody").html(scoreList);
              
        }
    });
}

//응답(평균/최대/최소)/평균 머무르는 시간
function getResponseTime() {
    
      $.ajax({
        url: '/board/getResponseScore',
        dataType: 'json',
        type: 'POST',
        data: getFilterVal(),
        success: function(data) {
            if (data.error_code != null && data.error_message != null) {
                alert(data.error_message);
            } else {
                //BAR CHART
                var bar = new Morris.Bar({
                    element: 'responseTimeDiv',
                    resize: true,
                    data: [
                    {y: '평균 답변시간', a: data.list[0].REPLY_AVG},
                    {y: '최대 답변시간', a: data.list[0].MAX_REPLY},
                    {y: '최소 답변시간', a: data.list[0].MIN_REPLY},
                    {y: '평균 머무르는 시간', a: data.list[0].REPLY_SUM}
                    ],
                    barColors: ['#5181ae', '#ff7659'],
                    xkey: 'y',
                    ykeys: ['a'],
                    labels: ['ms'],
                    hideHover: 'auto'
                });
            }
        }
    });
}



//시간대별 질문수
function getQueryByEachTime() {
    $.ajax({
        url: '/board/getQueryByEachTime',
        //dataType: 'json',
        type: 'POST',
        data: getFilterVal(),
        success: function(data) {
            if (data.error_code != null && data.error_message != null) {
                alert(data.error_message);
            } else {
                //BAR CHART
                var arrList = data.list;
                var jsonList = [];
                for (var i=0; i<arrList.length; i++) {

                    var timeObj = new Object();

                    timeObj.y = pad(i, 2)+":00";
                    timeObj.a = arrList[i];

                    jsonList.push(timeObj);

                }
                

                //BAR CHART
                var bar = new Morris.Bar({
                    element: 'timeOfDay_div',
                    resize: true,
                    data: jsonList,
                    barColors: ['#5181ae', '#ff7659'],
                    xkey: 'y',
                    ykeys: ['a'],
                    labels: ['질문수'],
                    hideHover: 'auto'
                });
            }

            
        }
    })
}

function pad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}


//미답변 질문
function drawNoneQuerytable(page) {
    $.ajax({
        url: '/board/nodeQuery',
        dataType: 'json',
        type: 'POST',
        data: getFilterVal(page),
        success: function(data) {
            if (data.error_code != null && data.error_message != null) {
                alert(data.error_message);
            } else {
                var list = data.list;
                var noneList = "";

                for (var i=0; i< list.length; i++) {
                    noneList += "<tr><td>" + list[i].intent + "</td>";
                    noneList += "<td>" + list[i].korQuery + "</td>";
                    noneList += "<td>" + list[i].channel + "</td>";
                    noneList += "<td>" + list[i].queryCnt + "</td>";
                    noneList += "<td>" + list[i].queryDate + "</td>";
                    noneList += "<td>" + list[i].result + "</td>";
                    noneList += "<td>" + list[i].textResult + "</td>";
                    noneList += "<td>" + list[i].cardResult + "</td>";
                    noneList += "<td>" + list[i].cardBtnResult + "</td></tr>";
                }
                
                $("#noneQueryDiv").html(noneList);
                $('#noneQueryDivTablePaging .pagination').html('').append(data.pageList);
                    
            }
        }
    });
}

//고객 별 첫 질문 //bar
function drawFirstQuery() {
    $.ajax({
        url: '/board/firstQueryBar',
        dataType: 'json',
        type: 'POST',
        data: getFilterVal(),
        success: function(data) {

            if (data.error_code != null && data.error_message != null) {
                alert(data.error_message);
            } else {

                var jsonList = [];
                for (var i=0; i<data.list.length; i++) {
    
                    var timeObj = new Object();
    
                    timeObj.x = data.list[i].INTENT;
                    timeObj.a = data.list[i].INTENT_CNT;
    
                    jsonList.push(timeObj);
                }
    
                //BAR CHART
                var bar = new Morris.Bar({
                    element: 'fistQueryDiv',
                    resize: true,
                    data: jsonList,
                    barColors: ['#5181ae', '#ff7659'],
                    xkey: 'x',
                    ykeys: ['a'],
                    labels: ['CNT'],
                    hideHover: 'auto'
                });	
            }
            
        }
    })
};

//고객 별 첫 질문 //table
function drawfirstQuerytable(page) {
    $.ajax({
        url: '/board/firstQueryTable',
        dataType: 'json',
        type: 'POST',
        data: getFilterVal(page),
        success: function(data) {
            if (data.error_code != null && data.error_message != null) {
                alert(data.error_message);
            } else {
                var list = data.list;
                var firstList = "";

                for (var i=0; i< list.length; i++) {
                    firstList += "<tr><td>" + list[i].intent_name + "</td>";
                    firstList += "<td>" + list[i].koQuestion + "</td>";
                    firstList += "<td>" + list[i].channel + "</td>";
                    firstList += "<td>" + list[i].query_cnt + "</td>";
                    firstList += "<td>" + list[i].query_date + "</td>";
                    firstList += "<td>" + list[i].message_type + "</td>";
                    firstList += "<td>" + list[i].intent_score + "</td></tr>";
                }
                $("#fistQueryTable").html(firstList);
                $('#fistQueryTablePaging .pagination').html('').append(data.pageList);
                    
            }
        }
    });
}


