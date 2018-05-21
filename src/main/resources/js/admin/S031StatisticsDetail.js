$(function() {
	initPie();
});
// 根据ksid获得分数区间分布图
function initPie(){
	var ksid = $('#ksid').val();
	$.post(baseUrl + '/admin/S030/getExamDetail.html', {
		ksid : ksid
	}, function(data) {
		var datarow = data.rows;
		var totalCnt = datarow[0].cnt + datarow[1].cnt + 
		datarow[2].cnt + datarow[3].cnt + datarow[4].cnt;
	    $('#containerPie').highcharts({
	        chart: {
	            type: 'pie',
	            options3d: {
	                enabled: true,
	                alpha: 45,
	                beta: 0
	            }
	        },
	        title: {
	            text: ''
	        },
	        tooltip: {
	            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	        },
	        plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                depth: 35,
	                dataLabels: {
	                    enabled: true,
	                    format: '{point.name}'
	                }
	            }
	        },
	        series: [{
	            type: 'pie',
	            name: '分数段所占比率',
	            data: [
	                ["0~" + datarow[0].qujian, datarow[0].cnt/totalCnt],
	                [datarow[0].qujian + "~" + datarow[1].qujian, datarow[1].cnt/totalCnt],
	                [datarow[1].qujian + "~" + datarow[2].qujian, datarow[2].cnt/totalCnt],
	                [datarow[2].qujian + "~" + datarow[3].qujian, datarow[3].cnt/totalCnt],
	                [datarow[3].qujian + "~" + datarow[4].qujian, datarow[4].cnt/totalCnt]
	            ]
	        }]
	    });
	}, "json");
}