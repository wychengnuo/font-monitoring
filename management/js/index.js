/**
 * @param 避免全局污染
 */

var ind = {

    /**
     *  @param { object } 获取数据
     */

    getDate: function () {

        var table, table1, td, td1, td2, td3, tr, tr1, tr2, tr3;

        $.ajax({
            type: 'get',
            url: 'http://localhost:3000/getError',
            data: '',
            async: false,
            success: function (data) {

                if (data.success) {

                    var date = data.data;

                    tr1 = '', tr3 = '';

                    for (var i = 0; i < date.length; i++) {

                        td = '', td1 = '', tr = '', tr2 = '', tr3 = '';

                        var a = JSON.parse(date[i]);

                        var localData = a.localData;

                        debugger

                        for (var e in localData) {

                            var c = JSON.parse(localData[e]);

                            td3 = '', td2 = '';

                            for (var d in c) {
                                td2 += '<th>' + d + '</th>';
                                td3 += '<td>' + c[d] + '</td>';
                            }

                            if(!tr2)
                                tr2 += '<thead><tr>' + td2 + '</tr></thead>';
                            
                            tr3 += '<tr>' + td3 + '</tr>';

                        }

                        delete a.localData;

                        for (var b in a) {

                            td += '<th>' + b + '</th>';
                            td1 += '<td>' + a[b] + '</td>';

                        }

                        tr += '<thead><tr>' + td + '</tr></thead>';
                        tr1 += '<tr>' + td1 + '</tr>';

                    }

                    table = '<table class="table table-bordered table-hover">' + tr + tr1 + '</table>';
                    table1 = '<table class="table table-bordered table-hover">' + tr2 + tr3 + '</table>';

                    $("#ss").html(table);
                    $("#date").html(table1);
                } else {

                    $("#ss,#date").html('暂无数据').css('text-align','center');

                }

            },
            error: function (date) { 
                 $("#ss,#date").html('暂无数据').css('text-align','center');
            }
        });
    }


};


$(function () {
    // setInterval(function () {
    //     ind.getDate();
    // }, 2000);

    $("#check").on('click', function () {
        ind.getDate();
    });
    
    ind.getDate();

});