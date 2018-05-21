$(function () {
	$('#userGroup').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		url : baseUrl + '/admin/U030/findGroupAddALL.html',
		required : false,
		onSelect: function(rec){
			//考试名称
			var ksid = $('#selectExams').combobox('getValue');
			showData(rec.id, ksid);
			$('#itemlist').datagrid('load', {
				groupPid : rec.id, ksid : ksid
			});
		}
	});
	$('#selectExams').combobox({
		url :baseUrl + "/admin/T050/findExamMonitorName.html",
		editable : false,
		required : false,
		valueField : 'kaoshiId', //基础数据值名称绑定到该下拉列表框。
		textField : 'kaoshiName', //基础数据字段名称绑定到该下拉列表框。
		onSelect: function(rec){
			//考试名称
			var groupPid = $('#userGroup').combotree('getValue');
			showData(groupPid, rec.kaoshiId);
			$('#itemlist').datagrid('load', {
				groupPid : groupPid, ksid : rec.kaoshiId
			});
		}
	});

	showData(0, 0);
	creatGrid();
});

/**
 * easyUi dataGrid注册方式说明，防止二次渲染 class注册方式一般是为了初始化属性，js方式则属性和事件都可初始化
 * 但是不管是class方式还是js方式注册组件，每次注册，只要被设置过url属性就会做请求。
 * 所以在不可避免要使用js方式注册的情况下，索性就不要使用class方式注册了。
 */
function creatGrid() {
	$('#itemlist').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		idField : 'name', // 是标识字段
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : false,// 分页组件是否显示
		pageNumber : 1,// 起始页
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50, 100 ],// 每页显示多少行
		rownumbers : true,// 行号
		url : baseUrl + '/admin/S070/getData.html',
		columns : [ [ {
			field : 'name',
			title : '机构名称',
			width : 100,
			sortable : true,
			halign: 'center',
			align : 'left'
		}, {			
			field : 'yks',
			title : '应参考人数',
			width : 100,
			sortable : true,
			halign: 'center',
			align : 'right'
		}, {
			field : 'sks',
			title : '实际参考人数',
			width : 80,
			sortable : true,
			halign: 'center',
			align : 'right'
		}, {
			field : 'wcj',
			title : '未参考人数',
			width : 80,
			sortable : true,
			halign: 'center',
			align : 'right'
		}, {
			field : 'jg',
			title : '及格人数',
			width : 80,
			sortable : true,
			halign: 'center',
			align : 'right'
		} ] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {

		}
	});
}

// 显示
function showData(groupPid, ksid) {

	$.post(baseUrl + "/admin/S070/getData.html", {
		groupPid : groupPid,
		ksid:ksid
	}, function(data) {
		var obj = eval("(" + data + ")");//json为接收的后台返回的数据
		
		var json = obj.rows;
		var arr = new Array();
		var pieArr = new Array();
		var jgArr = new Array();
		for(var i=0;i<json.length;i++){
			var str = "{type: 'column', name: '" + json[i].name +
	            "',data:[" + json[i].yks + "," 
	            + json[i].sks + ","
	            + json[i].wcj + ","
	            + json[i].jg + ","
	            + (json[i].jg / json[i].yks).toFixed(4) * 100 + ","
	            + "]}";
			arr.push(str);
			
			var pieStr = "{name: '" + json[i].name +"', y: "+ json[i].yks + ",color: Highcharts.getOptions().colors[" + i +"]}";
			pieArr.push(pieStr);
			
		}
		
//		var str = "{type: 'spline',name: '及格率',data:[" + jgArr.join(",") + 
//            "],marker: {lineWidth: 2,lineColor: Highcharts.getOptions().colors[3],fillColor: 'white'}}";
//		arr.push(str);
		
		var str = "{type: 'pie', name: '机构人员统计',data: [" + pieArr.join(",") + "],"+
            "center: [100, 80],"+
            "size: 100,"+
            "showInLegend: false,"+
            "dataLabels: {"+
                "enabled: false"+
            "}"+
        "}";
		arr.push(str);
		var jsonString="["+arr.join(",")+"]";
		var jsonArr = eval('(' + jsonString + ')');
		
	    $('#container').highcharts({
	        title: {
	            text: '机构考试统计'
	        },
	        xAxis: {
	            categories: ['应参考人数', '实际参考人数', '未参考人数','及格人数','及格率']
	        },
	        labels: {
	            items: [{
	                html: '机构用户数统计',
	                style: {
	                    left: '70px',
	                    top: '18px',
	                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
	                }
	            }]
	        },
	        series: jsonArr
	    });
	});
}
