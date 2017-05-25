/**
 * @param 避免全局污染
 */

var ind = {

    /**
     *  @param { object } 获取数据
     */

    getDate: function () {

        var table, td, td1,tr, tr1;

        $.ajax({
            type: 'get',
            url: 'http://localhost:3000/getError',
            data: '',
            async: false,
            success: function (data) {

                if (data.success) {

                    var date = data.data;

                    tr = '', tr1 = '', td = '', td1 = '';
                    
                    var a = JSON.parse(date);

                    for (var b in a) {
                        td += '<th>' + b + '</th>';
                        td1 += '<td>' + a[b] + '</td>';

                    }
                    
                    tr = '<thead><tr>' + td + '</tr></thead>';
                    tr1 += '<tr>' + td1 + '</tr>';

                    table = '<table class="table table-bordered table-hover">' + tr + tr1 + '</table>';

                    $('#ss').html(table);
                } else {

                    $('#ss,#date').html('暂无数据').css('text-align','center');

                }
            },
            error: function (date) { 
                $('#ss,#date').html('暂无数据').css('text-align','center');
            }
        });

        $.ajax({
            type: 'get',
            url: 'http://localhost:3000/getError1',
            data: '',
            async: false,
            success: function (data) {
                if (data.success) {
                    
                    tr = '', tr1 = '', td = '', td1 = '';
                    var date = data.data;
                    for (var i = 0; i < date.length; i++) {
                        var d = JSON.parse(date[i]);
                        for (var a in d) {
                            f = JSON.parse(d[a]);
                            if (a.indexOf('err') != -1) {
                                for (var e in f) {
                                    td += '<th>' + e + '</th>';
                                    td1 += '<td>' + f[e] + '</td>';
                                }
                                tr = '<thead><tr>' + td + '</tr></thead>';
                                tr1 += '<tr>' + td1 + '</tr>';
                            }
                        }
                    }

                    table = '<table class="table table-bordered table-hover">' + tr + tr1 + '</table>';

                    $('#date').html(table);
                }

            },
            error: function (date) { 
                
            }
        });
    }
};


$(function () {

    $('#check').on('click', function () {
        ind.getDate();
    });
    
    ind.getDate();

});