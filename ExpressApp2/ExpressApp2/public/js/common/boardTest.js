
$(document).ready(function(){
    //google.charts.load('current', {'packages':['table']});
    //google.charts.setOnLoadCallback(drawChart);
    //drawWordCloud();
    setChannelList();
});


var minDate = new Date(2010, 8-1, 1);
var maxDate = new Date(2010, 8-1, 31);
var slider;
var startDate;
var endDate;
$(function() {
    slider = $('#slider').slider({range: true, max: daysDiff(minDate, maxDate),
            slide: function(event, ui) { resync(ui.values); }});
    startDate = $('#startDate').datepicker({minDate: minDate, maxDate: maxDate,
            onSelect: function(dateStr) { resync(); }}).
        keyup(function() { resync(); });
    endDate = $('#endDate').datepicker({minDate: minDate, maxDate: maxDate,
            onSelect: function(dateStr) { resync(); }}).
        keyup(function() { resync(); });
});

function resync(values) {
    if (values) {
        var date = new Date(minDate.getTime());
        date.setDate(date.getDate() + values[0]);
        startDate.val($.datepicker.formatDate('mm/dd/yy', date));
        date = new Date(minDate.getTime());
        date.setDate(date.getDate() + values[1]);
        endDate.val($.datepicker.formatDate('mm/dd/yy', date));
    }
    else {
        var start = daysDiff(minDate, startDate.datepicker('getDate') || minDate);
        var end = daysDiff(minDate, endDate.datepicker('getDate') || maxDate);
        start = Math.min(start, end);
        slider.slider('values', 0, start);
        slider.slider('values', 1, end);
    }
    startDate.datepicker('option', 'maxDate', endDate.datepicker('getDate') || maxDate);
    endDate.datepicker('option', 'minDate', startDate.datepicker('getDate') || minDate);
}

function daysDiff(d1, d2) {
    return  Math.floor((d2.getTime() - d1.getTime()) / 86400000);
}






















/*
$( function() {
     var baseDate = new Date();
     $( "#slider-range" ).slider({

       range: true,
       min: 0,
       max: 720,
       animate: 'slow',
       values: [ 360, 720 ],
       slide: function( event, ui ) {
               var date1 = new Date(baseDate.getTime() - (1000*60*60*24*360*2)-10); // Calculate the new date
               var date2 = new Date(baseDate.getTime() - (1000*60*60*24*360*2)+10); // Calculate the new date
               date1.setDate(date1.getDate() + ui.values[ 0 ]); //ui.values[ 0 ]
               date2.setDate(date2.getDate() + ui.values[ 1 ]);
               //var date = $('#datepicker').datepicker({ dateFormat: 'dd-mm-yy' }).val();

               $('#testDatepicker1').datepicker('setDate', (date1)); // And set into the datepicker
               $('#testDatepicker2').datepicker('setDate', (date2)); // And set into the datepicker

               //var dd = fDate1.spli("/");
               //var aa = fDate2.spli("/");

       }
     });
});

$(function() {
     $( "#testDatepicker1" ).datepicker({
         format: 'yy-mm-dd'
     });
     $( "#testDatepicker2" ).datepicker({
         format: 'yy-mm-dd'
     });
 });
*/










google.charts.load(  'visualization'
                   , '1.1'
                   , {'packages':['corechart', 'table']}
);
$('#testDatepicker1').val("");
$('#testDatepicker2').val("");
// Set a callback to run when the Google Visualization API is loaded.
/* google.charts.setOnLoadCallback(drawStatusOverview);
google.charts.setOnLoadCallback(drawOftenQueryList);
google.charts.setOnLoadCallback(drawNoneQueryList);
google.charts.setOnLoadCallback(drawLowScoreList);
drawWordCloud(); */

//Declare formats (유로 포맷 설정 참고)
/*
var formatterEuro = {
    decimalSymbol: ',',
    groupingSymbol: '.',
    negativeColor: 'red',
    negativeParens: true,
    prefix: '\u20AC '
};
*/

var StatusTable;
var StatusTable2;
var StatusTable3;
var StatusTable4;

//word cloud 총 질문수
var totlaUsedWordCount;

//remove the google chart styling and add the bootstrap styling
//Also add the css class Totalrow
function resetStyling(id) {
    $('#' + id + ' table')
        .removeClass('google-visualization-table-table')
        .addClass('table table-bordered table-condensed table-striped table-hover');
    var parentRow = $('#' + id + ' td.TotalCell').parent();
    parentRow.addClass('TotalRow');
}

//select channel list
var channelList = new Array();
function setChannelList(){

     $.tiAjax({
         url: '/admin/selectChannelList.do',
         isloading: true,
         success: function(data) {
             if (data.error_code != null && data.error_message != null) {
                 alert(data.error_message);
             } else {

                for (var i=0; i<data.channelList.length; i++) {
                    channelList.push( data.channelList[i].channel );
                    //list.push( data.dsGridList[i].dirPath );
                }
                //selectbox 내용 설정
                var listHtml = "<p><select name=\"selChannel\" class=\"inbox02\" id=\"selChannel\" style=\"width:98%\">";
                    listHtml += "<option value='all'>전체</option>";
                for(var i=0; i<channelList.length; i++){
                    listHtml += "<option value="+ channelList[i] +">"+channelList[i] + "</option>";
                }
                listHtml += "</select></p></div>";
                $('#channelListDiv').append(listHtml);
                filterSearch()
             }
         }
     });
}

//필터 값 넘기기 test
function filterSearch() {
    google.charts.setOnLoadCallback(drawStatusOverview);
    google.charts.setOnLoadCallback(drawOftenQueryList);
    google.charts.setOnLoadCallback(drawNoneQueryList);
    google.charts.setOnLoadCallback(drawLowScoreList);
    drawWordCloud();
    /* $.tiAjax({
         applyId: 'filterForm',
         url: '/admin/selectFilteredBIList.do',
         isloading: true,
         success: function(data) {
             if (data.error_code != null && data.error_message != null) {
                 alert(data.error_message);
             } else {
                alert("success");
             }
         }
     }); */
}
//자주하는 질문 table 컬럼 사이즈 세팅.(임시 추후 개선)
function setOftenListColumnWid(){
    $('#StatusOverview2').find("th[aria-label='Sort column']").eq(0).css('width', '8%');
    $('#StatusOverview2').find("th[aria-label='Sort column']").eq(1).css('width', '12%');
    $('#StatusOverview2').find("th[aria-label='Sort column']").eq(2).css('width', '8%');
    $('#StatusOverview2').find("th[aria-label='Sort column']").eq(3).css('width', '20%');
    $('#StatusOverview2').find("th[aria-label='Sort column']").eq(4).css('width', '20%');
    $('#StatusOverview2').find("th[aria-label='Sort column']").eq(5).css('width', '20%');
    $('#StatusOverview2').find("th[aria-label='Sort column']").eq(6).css('width', '12%');
}

//자주하는 질문 table 컬럼 사이즈 세팅.(임시 추후 개선)
function setLowScoreListColumnWid(){
    $('#StatusOverview4').find("th[aria-label='Sort column']").eq(0).css('width', '10%');
    $('#StatusOverview4').find("th[aria-label='Sort column']").eq(1).css('width', '5%');
    $('#StatusOverview4').find("th[aria-label='Sort column']").eq(2).css('width', '8%');
    $('#StatusOverview4').find("th[aria-label='Sort column']").eq(3).css('width', '13%');
    $('#StatusOverview4').find("th[aria-label='Sort column']").eq(4).css('width', '20%');
    $('#StatusOverview4').find("th[aria-label='Sort column']").eq(5).css('width', '20%');
    $('#StatusOverview4').find("th[aria-label='Sort column']").eq(6).css('width', '15%');
    $('#StatusOverview4').find("th[aria-label='Sort column']").eq(7).css('width', '9%');
}

function clickWordCloud (textVal) {
    //alert(textVal);

    if (textVal != "" && textVal != null) {
        $('#intentName').val(textVal);
        google.charts.setOnLoadCallback(drawStatusOverview);
        google.charts.setOnLoadCallback(drawOftenQueryList);
        google.charts.setOnLoadCallback(drawNoneQueryList);
        google.charts.setOnLoadCallback(drawLowScoreList);

        $('#intentName').val("");
    }

}
function drawWordCloud() {
    $.tiAjax({
          applyId: 'filterForm',
          url: '/admin/selectOftenUseWord.do',
          isloading: true,
          success: function(data) {
              if (data.error_code != null && data.error_message != null) {
                  alert(data.error_message);
              } else {

                  var oftenUsedList = data.oftenUsedList;
                  totlaUsedWordCount = 0;
                  for (var i=0; i< oftenUsedList.length; i++) {
                      totlaUsedWordCount += oftenUsedList[i].weight;
                      oftenUsedList[i].handlers = {
                        click: function() {
                            clickWordCloud($(this).text());
                        },
                        mouseover: function(e) {

                            $(".flyout").text("");
                            $(".flyout").text($(this).text() + ": " + $(this).attr('weight'));
                            $(".flyout").fadeIn();
                            $(".flyout").css({
                                "top":e.pageY+10+"px",
                                "left":e.pageX+10+"px"
                            });
                            $('.flyout').removeClass('hidden');
                            $(this).mousemove(function(e){
                                $(".flyout").css({
                                    "top":e.pageY+10+"px",
                                    "left":e.pageX+10+"px"
                                });
                            })
                        },
                        mouseout: function() {
                            $('.flyout').addClass('hidden');
                        }

                    };



                  }//$('#keywords').jQCloud('update', new_words);
                  if(totlaUsedWordCount==0){
                      $("#my_favorite_latin_words").html(" ");
                  }
                  if($("#my_favorite_latin_words").html() != ""){
                      $('#my_favorite_latin_words').jQCloud('update', oftenUsedList);
                  }else{

                      $("#my_favorite_latin_words").jQCloud(oftenUsedList, {
                        autoResize: true
                        //,colors: ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#feb24c", "#fed976", "#ffeda0", "#ffffcc"]
                        ,fontSize: {
                            from: 0.04,
                            to: 0.001
                          }
                      } );
                  }


                  $('#wordCloudTotal').find('h1').text(totlaUsedWordCount);
              }
          }
    });
}


function drawStatusOverview() {

    $.tiAjax({
          applyId: 'filterForm',
          url: '/admin/selectIntentScoreList.do',
          isloading: true,
          success: function(data) {
              if (data.error_code != null && data.error_message != null) {
                  alert(data.error_message);
              } else {
                    var tableList = data.scoreList;
                    var tmpColumn1 = new Array();
                    var tmpColumn2 = new Array();
                    var tmpColumn3 = new Array();
                    var tmpColumn4 = new Array();

                    var inputData = new google.visualization.DataTable();

                    //declare the columns
                    inputData.addColumn('string', 'INTENT');
                    inputData.addColumn('number', '갯수');
                    inputData.addColumn('number', '평균INTENT_SCORE');
                    inputData.addColumn('number', '최소INTENT_SCORE');
                    inputData.addColumn('number', '최대INTENT_SCORE');

                    //insert data here
                    //don't forget to set the classname TotalCell to the last datarow!!!


                    for (var i=0; i< tableList.length; i++) {
                        inputData.addRow([tableList[i].intentName, tableList[i].intentCount, tableList[i].intentScoreAVG, tableList[i].intentScoreMIN, tableList[i].intentScoreMAX]);
                        tmpColumn1.push(tableList[i].intentCount);
                        tmpColumn2.push(tableList[i].intentScoreAVG);
                        tmpColumn3.push(tableList[i].intentScoreMIN);
                        tmpColumn4.push(tableList[i].intentScoreMAX);
                    }
                    inputData.addRow(
                        [{
                            v: '합계',
                            p: {
                                className: 'TotalCell'
                            }
                          },
                          google.visualization.data.sum(tmpColumn1),
                          google.visualization.data.sum(tmpColumn2),
                          google.visualization.data.sum(tmpColumn3),
                          google.visualization.data.sum(tmpColumn4),
                        ]
                    );


                    //attach table to the html
                    StatusTable = new google.visualization.Table(document.getElementById('StatusOverview'));

                    //add the listener events
                    google.visualization.events.addListener(StatusTable, 'ready', function () {
                        resetStyling('StatusOverview');
                    });

                    //sorting event
                    google.visualization.events.addListener(StatusTable, 'sort', function (ev) {
                        //find the last row
                        var parentRow = $('#StatusOverview td.TotalCell').parent();
                        //set the TotalRow row to the last row again.
                        if (!parentRow.is(':last-child')) {
                            parentRow.siblings().last().after(parentRow);
                        }

                        //reset the styling of the table
                        resetStyling('StatusOverview');
                    });

                    //draw the table
                    StatusTable.draw(inputData, {
                        showRowNumber: false,
                        width: '90%',
                        height: 'auto'
                    });
              }
          }
    });

}




function drawOftenQueryList() {
    $.tiAjax({
          applyId: 'filterForm',
          url: '/admin/selectOftenQueryList.do',
          isloading: true,
          success: function(data) {
              if (data.error_code != null && data.error_message != null) {
                  alert(data.error_message);
              } else {
                    var oftenList = data.ofenQueryList;

                    var inputData2 = new google.visualization.DataTable();

                    //declare the columns
                    inputData2.addColumn('string', 'INTENT');
                    inputData2.addColumn('string', '한글질문');
                    inputData2.addColumn('string', '채널');
                    inputData2.addColumn('string', 'DLG답변');
                    inputData2.addColumn('string', 'CARD답변');
                    inputData2.addColumn('string', 'BTN답변');
                    inputData2.addColumn('string', '날짜');

                    //insert data here
                    //don't forget to set the classname TotalCell to the last datarow!!!


                    for (var i=0; i< oftenList.length; i++) {
                        inputData2.addRow([oftenList[i].intentName
                                          , oftenList[i].koQuestion
                                          , oftenList[i].channel
                                          , oftenList[i].dlgAnswer
                                          , oftenList[i].cardAnswer
                                          , oftenList[i].btnAnswer
                                          , oftenList[i].dimdate]);
                    }
                    /* inputData2.addRow(
                        [{
                            v: '합계',
                            p: {
                                className: 'TotalCell'
                            }
                          },
                          '',
                          '',
                          '',
                          '',
                          '',
                          '',
                        ]
                    ); */

                    StatusTable2 = new google.visualization.Table(document.getElementById('StatusOverview2'));
/*
                    //add the listener events
                    google.visualization.events.addListener(StatusTable2, 'ready', function () {
                        resetStyling('StatusOverview2');
                    });

                    //sorting event
                    google.visualization.events.addListener(StatusTable2, 'sort', function (ev) {
                        //find the last row
                        var parentRow2 = $('#StatusOverview2 td.TotalCell').parent();
                        //set the TotalRow row to the last row again.
                        if (!parentRow2.is(':last-child')) {
                            parentRow2.siblings().last().after(parentRow2);
                        }

                        //reset the styling of the table
                        resetStyling('StatusOverview2');
                    }); */

                    StatusTable2.draw(inputData2,
                               {
                                page: 'enable',
                                pageSize: 500,
                                scrollLeftStartPosition: 100,
                                showRowNumber: false,
                                width: '90%',
                                height: '500px',
                                allowHtml: true
                                });

                    setOftenListColumnWid();
                  }
              }
      });
}


function drawNoneQueryList() {
    $.tiAjax({
          applyId: 'filterForm',
          url: '/admin/selectNoneQuery.do',
          isloading: true,
          success: function(data) {
              if (data.error_code != null && data.error_message != null) {
                  alert(data.error_message);
              } else {
                    var noneList = data.noneQueryList;

                    var inputData3 = new google.visualization.DataTable();

                    //declare the columns
                    inputData3.addColumn('string', 'INTENT');
                    inputData3.addColumn('string', '한글질문');
                    inputData3.addColumn('string', '등록일');

                    //insert data here
                    //don't forget to set the classname TotalCell to the last datarow!!!


                    for (var i=0; i< noneList.length; i++) {
                        inputData3.addRow([noneList[i].intentName
                                          , noneList[i].koQuestion
                                          , noneList[i].dimdate]);
                    }
                    /* inputData2.addRow(
                        [{
                            v: '합계',
                            p: {
                                className: 'TotalCell'
                            }
                          },
                          '',
                          '',
                          '',
                        ]
                    ); */

                    StatusTable3 = new google.visualization.Table(document.getElementById('StatusOverview3'));
/*
                    //add the listener events
                    google.visualization.events.addListener(StatusTable2, 'ready', function () {
                        resetStyling('StatusOverview2');
                    });

                    //sorting event
                    google.visualization.events.addListener(StatusTable2, 'sort', function (ev) {
                        //find the last row
                        var parentRow2 = $('#StatusOverview2 td.TotalCell').parent();
                        //set the TotalRow row to the last row again.
                        if (!parentRow2.is(':last-child')) {
                            parentRow2.siblings().last().after(parentRow2);
                        }

                        //reset the styling of the table
                        resetStyling('StatusOverview2');
                    }); */

                    StatusTable3.draw(inputData3,
                               {
                                page: 'enable',
                                pageSize: 500,
                                scrollLeftStartPosition: 100,
                                showRowNumber: false,
                                width: '90%',
                                height: '500px',
                                allowHtml: true
                                });
                  }
              }
      });
}


function drawLowScoreList() {
    $.tiAjax({
          applyId: 'filterForm',
          url: '/admin/selectLowScoreIntent.do',
          isloading: true,
          success: function(data) {
              if (data.error_code != null && data.error_message != null) {
                  alert(data.error_message);
              } else {
                    var lowScoreList = data.lowScoreList;

                    var inputData4 = new google.visualization.DataTable();

                    //declare the columns
                    inputData4.addColumn('number', 'INTENT_SCORE');
                    inputData4.addColumn('string', '구간');
                    inputData4.addColumn('string', 'INTENT');
                    inputData4.addColumn('string', '한글질문');
                    inputData4.addColumn('string', 'DLG답변');
                    inputData4.addColumn('string', 'CARD답변');
                    inputData4.addColumn('string', 'BTN답변');
                    inputData4.addColumn('string', '등록일');

                    //insert data here
                    //don't forget to set the classname TotalCell to the last datarow!!!


                    for (var i=0; i< lowScoreList.length; i++) {
                        inputData4.addRow([lowScoreList[i].intentScore
                                          , lowScoreList[i].district
                                          , lowScoreList[i].intentName
                                          , lowScoreList[i].koQuestion
                                          , lowScoreList[i].dlgAnswer
                                          , lowScoreList[i].cardAnswer
                                          , lowScoreList[i].btnAnswer
                                          , lowScoreList[i].dimdate]);
                    }
                    /* inputData2.addRow(
                        [{
                            v: '합계',
                            p: {
                                className: 'TotalCell'
                            }
                          },
                          '',
                          '',
                          '',
                        ]
                    ); */

                    StatusTable4 = new google.visualization.Table(document.getElementById('StatusOverview4'));
/*
                    //add the listener events
                    google.visualization.events.addListener(StatusTable2, 'ready', function () {
                        resetStyling('StatusOverview2');
                    });

                    //sorting event
                    google.visualization.events.addListener(StatusTable2, 'sort', function (ev) {
                        //find the last row
                        var parentRow2 = $('#StatusOverview2 td.TotalCell').parent();
                        //set the TotalRow row to the last row again.
                        if (!parentRow2.is(':last-child')) {
                            parentRow2.siblings().last().after(parentRow2);
                        }

                        //reset the styling of the table
                        resetStyling('StatusOverview2');
                    }); */

                    StatusTable4.draw(inputData4,
                               {
                                page: 'enable',
                                pageSize: 500,
                                scrollLeftStartPosition: 100,
                                showRowNumber: false,
                                width: '90%',
                                height: '500px',
                                allowHtml: true
                                });
                    setLowScoreListColumnWid();
                  }
              }
    });
}
