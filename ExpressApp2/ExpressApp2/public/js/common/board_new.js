
;(function($) {

})(jQuery);


$(document).ready(function () {
    drawScoreList();
});




function getFilterVal() {

    var filterVal = {
        startDate : '02/27/2017', //$('input[name=daterangepicker_start]').val(),
        endDate : '02/27/2018', //$('input[name=daterangepicker_end]').val(),
        selDate  : $('#selDate').val(),
        selChannel  : $('#selChannel').val()
    };

    return filterVal;

}

function drawScoreList() { 

    $.ajax({
        url: '/board/intentScore',
        dataType: 'json',
        type: 'POST',
        data: getFilterVal(),
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
                    
                    $("#scoreTableBody").append(scoreList);
            }
        }
    })
}






