$(function () {
	$.post("getBigData.html", {
		period : $("#periodVal").attr("value")
	}, function(data) {
	    $('#container').highcharts({
	        title: {
	            text: '用户注册、登陆、考试、证书统计'
	        },
	        xAxis: {
	        	categories:data.period
	        },
	        yAxis: {
	            title: {
	                text: '个数'
	            },
	            plotLines: [{
	                value: 0,
	                width: 1,
	                color: '#808080'
	            }]
	        },
	        tooltip: {
	            valueSuffix: '个'
	        },
	        legend: {
	            layout: 'vertical',
	            align: 'right',
	            verticalAlign: 'middle',
	            borderWidth: 0
	        },
	        series: [{
	            name: '注册',
	            data: data.regist
	        }, {
	            name: '登陆',
	            data: data.login
	        }, {
	            name: '考试',
	            data: data.exam
	        }, {
	            name: '证书',
	            data: data.certificates
	        }]
	    });
	}, "json");
	
	//课件类型选择
	$("li").click(function(){
		$("#periodVal").val($(this).attr("id"));
		$(this).addClass("selecthover").siblings().removeClass("selecthover");
		$.post("getBigData.html", {
			period : $("#periodVal").attr("value")
		}, function(data) {
		    $('#container').highcharts({
		        title: {
		            text: '用户注册、登陆、考试、证书统计'
		        },
		        xAxis: {
		        	categories:data.period
		        },
		        yAxis: {
		            title: {
		                text: '人数'
		            },
		            plotLines: [{
		                value: 0,
		                width: 1,
		                color: '#808080'
		            }]
		        },
		        tooltip: {
		            valueSuffix: '人'
		        },
		        legend: {
		            layout: 'vertical',
		            align: 'right',
		            verticalAlign: 'middle',
		            borderWidth: 0
		        },
		        series: [{
		            name: '注册',
		            data: data.regist
		        }, {
		            name: '登陆',
		            data: data.login
		        }, {
		            name: '考试',
		            data: data.exam
		        }, {
		            name: '证书',
		            data: data.certificates
		        }]
		    });
		}, "json");
	});
});