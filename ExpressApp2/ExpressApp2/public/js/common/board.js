
//var entityList = [];
var entityHash = {};
//실행 순서 1
$(document).ready(function () {
    getEntityListAjax ();
});
//실행 순서 2
$(document).ready(function () {
    var appName = getParameters('appName')
    
    $.ajax({
        url: '/board/getCounts',
        dataType: 'json',
        type: 'POST',
        data: {'appName':appName},
        success: function(result) {
            if (typeof result != 'undefined') {
                $('#spanIntentsCount').html(result.INTENT_CNT);
                $('#spanEntitiesCount').html(result.ENTITY_CNT);
                $('#spanUtteranceCount').html(result.DLG_CNT);
            }
        }
    });
    
    getEndpointHistory();
    getEntityLabel();
})


function getEntityListAjax () {
    var appId = $('#appId').val();//getParameters('appId');
    var subKey = $('#subKey').val();
    var params = {
        // Request parameters
        "skip": "0",
        "take": "500",
    };
  
    $.ajax({
        url: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + appId + "/versions/0.1/models?" + $.param(params),
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subKey);
        },
        type: "GET",
        // Request body
        data: "",
    })
    .done(function(data) {
        //entityList = data;
        mkEntityList (data);
    })
    .fail(function() {
        alert("error");
    });
}


function mkEntityList (list) {
    /*
    for (var i=0; i<list.length; i++) {
        if(list[i].readableType.indexOf("Entity") != -1) {
            entityList.push(list[i]);
        }
    }
    */
    for (var i=0; i<list.length; i++) {
        if(list[i].readableType.indexOf("Entity") != -1) {
            var strParent = list[i].name;

            for (var j=0; j<list[i].children.length; j++) {
                var entity = list[i].children[j];
                var strChild = entity.name;
                entityHash[entity.id] = strParent + "::" + strChild;
            }
        }
    }
}

var getParameters = function (paramName) {
    // 리턴값을 위한 변수 선언
    var returnValue;

    // 현재 URL 가져오기
    var url = location.href;

    // get 파라미터 값을 가져올 수 있는 ? 를 기점으로 slice 한 후 split 으로 나눔
    var parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');

    // 나누어진 값의 비교를 통해 paramName 으로 요청된 데이터의 값만 return
    for (var i = 0; i < parameters.length; i++) {
        var varName = parameters[i].split('=')[0];
        if (varName.toUpperCase() == paramName.toUpperCase()) {
            returnValue = parameters[i].split('=')[1];
            return decodeURIComponent(returnValue);
        }
    }
};


function getEndpointHistory () {
    var appId = $('#appId').val();//getParameters('appId');
    var subKey = $('#subKey').val();
    var date = getIsoDate();

    var params = {
        // These are optional request parameters. They are set to their default values.  //$.param(params)
        "timezoneOffset": "0",
        "verbose": "false",
        "spellCheck": "false",
        "staging": "false",
    };
    //"https://westus.api.cognitive.microsoft.com/luis/webapi/v2.0/apps/" + pApp.getId() + "/versions/" + pApp.getVersionId() + "/stats/endpointhitshistory"
    $.ajax({
        url: "https://westus.api.cognitive.microsoft.com/luis/webapi/v2.0/apps/" + appId + "/versions/0.1/stats/endpointhitshistory?from=" 
            + date.fromDate + "&to=" + date.toDate,
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subKey);
        },
        type: "GET",
        // The request body may be empty for a GET request
        data: "",
    })
    .done(function(data) {
        //Object.values(data)
        var historyArr = data;
        var sumOfhits = 0;
        google.charts.load('current', {'packages':['annotationchart']});
        google.charts.setOnLoadCallback(drawChart);


        function drawChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('date', 'Date');
            data.addColumn('number', '');
            //data.addColumn('string', 'Kepler title');
            //data.addColumn('string', 'Kepler text');

            for (var i in historyArr) {
                data.addRow([new Date(i), historyArr[i]]);
                sumOfhits += historyArr[i];
            }
            var newDate = new Date();
            var chart = new google.visualization.AnnotationChart(document.getElementById('chart_div'));
            var options = {
                //displayZoomButtons: false,   //줌버튼
                //zoomEndTime: new Date(),
                //vAxis: { gridlines: { count: 4 } },
                min : 0,
                max : 5000,
                //zoomStartTime: newDate.getTime() - (1000*60*60*24*360*2),
                //zoomStartTime: parseDate(2016, 11, 29),
                //allValuesSuffix:"asdfasf",   //우측 상단 추가 string 표시
                //displayDateBarSeparator: false,  // 우측상단 구분자|추가
                //legendPosition: 'sameRow', //newRow
                displayAnnotations: true
                //displayRangeSelector: false //하단 범위지정
            };
            //chart.setVisibleChartRange('1d', '1y');
            chart.draw(data, options);
         }

         $("#spanEndpointCount").html(sumOfhits);



    })
    .fail(function() {
        alert("error");
    });
}


function getIsoDate() {
    var dt = new Date();
    // 월을 구하고 1만큼 증가

    var mnth = dt .getUTCMonth(); 
    mnth++;

    var day = dt.getUTCDate();
    if(day < 10) {
        day = "0"+day;
    }

    var fromDay = dt.getUTCDate()-7;
    if(fromDay < 10) {
        fromDay = "0"+fromDay;
    }

    var yr = dt.getUTCFullYear();
    var hrs = dt.getUTCHours();

    if(hrs < 10) { 
        hrs = "0"+hrs;
    }

    var min = dt.getUTCMinutes();

    if(min < 10) {
        min = "0"+min;
    }

    var sec = dt.getUTCSeconds();

    if(sec < 10) {
        sec = "0"+sec
    };

    var toDate = yr+"-"+mnth+"-"+day+"T"+hrs+":"+min+":"+sec+"Z";
    var fromDate = yr+"-"+mnth+"-"+fromDay+"T"+hrs+":"+min+":"+sec+"Z";
    var date = {
        toDate:toDate,
        fromDate:fromDate
    };
    return date;
}

function getEntityLabel() {
    var appId = $('#appId').val();//getParameters('appId');
    var subKey = $('#subKey').val();

    var params = {
    };
    
    $.ajax({
        url: "https://westus.api.cognitive.microsoft.com/luis/webapi/v2.0/apps/" + appId + "/versions/0.1/stats/labelsperentity",
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subKey);
        },
        type: "GET",
        // The request body may be empty for a GET request
        data: "",
    })
    .done(function(data) {
        
        var entityList = data;

        // 2. Column 차트 - Entity Breakdown..
        google.charts.load("current", {packages:['corechart']});
        google.charts.setOnLoadCallback(drawChartColumn);

        function drawChartColumn() {

            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Task', 'name');
            data.addColumn('number', 'Labels Count', 'labelsCnt');
            //data.addColumn({type:'string', role:'style'});
            /*
            for(var i=0; i<entityList.length; i++){

                var webColor = '#'+'0123456789abcdef'.split('').map(function(v,i,a){return i>5 ? null : a[Math.floor(Math.random()*16)] }).join('');
                data.addRow(eval("['"+entityList[i].name+"', "+entityList[i].labelsCnt+", 'color: "+webColor+"']"));

            }
            
            for (var i in entityList) {
                data.addRow([ entityHash[i], entityList[i], 'color: webColor']);
            }
            */

            for (var i in entityList) {
                data.addRow([ entityHash[i], entityList[i]]);
            }
            var options = {
                title: 'Intent Breakdown \nON LABELED UTTERANCES',
                chartArea: {
                      left: "3%",
                      top: "13%",
                      height: "85%",
                      width: "85%"
                },
                is3D: false
            };

            var chart = new google.visualization.PieChart(document.getElementById('columnchart_values'));
            chart.draw(data, options);

            function pieClickHandler (obj) {
                if(obj.targetID.indexOf("legendscrollbutton") != -1){
                    //오른쪽 목록 상,하 버튼
                }else if (obj.targetID.indexOf("slice") == -1){
                    //link(intent) 이벤트(else부분)가 걸려있는 곳 말고 다른곳 클릭시 새창에 띄우기.
                    
                }else{
                    /*
                    //차트 클릭시 이벤트
                    var arrTarget = obj.targetID.split("#");
                    var intentIndex = Number(arrTarget[1]);
                    var intentName = encodeURI(encodeURIComponent(data.getValue(intentIndex, 0)));
                    var intentId = intentList[intentIndex].id;
                    */
                    //location.href = "/admin/intentDetail.do?name="+intentName+"&id="+intentId;
                }
            }
            google.visualization.events.addListener(chart, 'click', pieClickHandler);
            /*
            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1,
                                { calc: "stringify",
                                    sourceColumn: 1,
                                    type: "string",
                                    role: "annotation" },
                                2]);

            var options = {
                title: "Entity Breakdown \nON LABELED UTTERANCES",
                //width: 520,
                //height: 400,
                bar: {groupWidth: "1%"},
                chartArea: {right:5,'width': '90%', 'height': '70%'},
                legend: { position: "none" }
                };
            var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));
            chart.draw(view, options);

            function columnClickHandler (obj) {
                    if (obj.targetID.indexOf("bar") == -1){
                        
                    }else{
                        var arrTarget = obj.targetID.split("#");
                        var entityId = data.getValue(Number(arrTarget[1]), 1);
                        location.href = "/admin/entityList.do";
                    }
            }
            google.visualization.events.addListener(chart, 'click', columnClickHandler);
            */
            
        }


    })
    .fail(function() {
        alert("error");
    });
}