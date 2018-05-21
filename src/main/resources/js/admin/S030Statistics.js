// 考试统计
$(function() {		
	creatGrid();
	creatYksGrid();
	creatSksGrid();
	creatJgGrid();
	creatWcjGrid();
	creatPmGrid();
	// 考试grid
	$('#ksGridDiv').dialog({
		fit:false,
		title : '考试统计',
		width:350,
		height:470,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	// 应考试grid
	$('#yksGridDiv').dialog({
		fit:false,
		title : '应考试用户详细',
		width:350,
		height:470,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	// 实际考试grid
	$('#sksGridDiv').dialog({
		fit:false,
		title : '实际考试用户详细',
		width:350,
		height:470,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	// 考试及格用户grid
	$('#jgGridDiv').dialog({
		fit:false,
		title : '考试及格用户详细',
		width:350,
		height:470,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	// 未参加考试用户grid
	$('#wcjGridDiv').dialog({
		fit:false,
		title : '未参加考试用户详细',
		width:350,
		height:470,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	// 及格率饼状图
	$('#containerPie').dialog({
		fit:false,
		title : '及格率饼图',
		width:650,
		height:470,
		closed : true,
		modal : true,
		draggable : false,
		shadow : false
	});
	// 未参加考试用户grid
	$('#pmGridDiv').dialog({
		fit:false,
		title : '用户考试排名详细',
		width:350,
		height:470,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	//导出条件表单
	$('#exportForm').form({
		url : baseUrl + "/admin/S030/exportExcel.html",
		success : function(data) {
			$.messager.alert('提示',data,'info');
		}
	});
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
		idField : 'ksId', // 是标识字段
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : true,// 分页组件是否显示
		pageNumber : 1,// 起始页
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50, 100 ],// 每页显示多少行
		rownumbers : true,// 行号
		url : baseUrl + '/admin/S030/findExamStatistics.html',
		columns : [ [ {
			field : 'ksid',
			title : 'ID',
			width : 20,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right'
		}, {			
			field : 'name',
			title : '考试名称',
			width : 100,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'yks',
			title : '应考试人数',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right',
			formatter : fmyks
		}, {
			field : 'sks',
			title : '实际考试人数',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right',
			formatter : fmsks
		}, {
			field : 'jg',
			title : '及格人数',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right',
			formatter : fmjg
		}, {
			field : 'wcj',
			title : '未参加人数',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right',
			formatter : fmwcj
		}, {
			field : 'jgl',
			title : '及格率',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right',
			formatter : fmPie
		}, {
			field : 'pm',
			title : '成绩排名',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'center',
			formatter : fmpm
		}, {
			field : 'fsd',
			title : '分数段统计',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'center',
			formatter : fmname
		},{
			field : 'manage',
			title : '操作',
			align : 'center',
			width : 80,
			formatter : fmup
		}  ] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
			$('.edit_qsn').linkbutton({
				iconCls : 'icon-excel',
				plain : true
			});
		}
	});
}
// 应该考试用户grid
function creatYksGrid() {
	$('#yksGrid').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : false,// 分页组件是否显示
//		pageNumber : 1,// 起始页
//		pageSize : 10,// 每页显示的记录条数，默认为10
//		pageList : [ 10, 20, 50, 100 ],// 每页显示多少行
		rownumbers : true,// 行号
		columns : [ [ {
			field : 'userName',
			title : '用户名',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'realName',
			title : '真实姓名',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		} ] ]
	});
}
// 实际考试用户grid
function creatSksGrid() {
	$('#sksGrid').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : false,// 分页组件是否显示
//		pageNumber : 1,// 起始页
//		pageSize : 10,// 每页显示的记录条数，默认为10
//		pageList : [ 10, 20, 50, 100 ],// 每页显示多少行
		rownumbers : true,// 行号
		columns : [ [ {
			field : 'userName',
			title : '用户名',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'realName',
			title : '真实姓名',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		} ] ]
	});
}
// 及格用户grid
function creatJgGrid() {
	$('#jgGrid').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : false,// 分页组件是否显示
//		pageNumber : 1,// 起始页
//		pageSize : 10,// 每页显示的记录条数，默认为10
//		pageList : [ 10, 20, 50, 100 ],// 每页显示多少行
		rownumbers : true,// 行号
		columns : [ [ {
			field : 'userName',
			title : '用户名',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'realName',
			title : '真实姓名',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		} ] ]
	});
}
// 未参加用户grid
function creatWcjGrid() {
	$('#wcjGrid').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : false,// 分页组件是否显示
//		pageNumber : 1,// 起始页
//		pageSize : 10,// 每页显示的记录条数，默认为10
//		pageList : [ 10, 20, 50, 100 ],// 每页显示多少行
		rownumbers : true,// 行号
		columns : [ [ {
			field : 'userName',
			title : '用户名',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'realName',
			title : '真实姓名',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		} ] ]
	});
}
// 用户考试排名grid
function creatPmGrid() {
	$('#pmGrid').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : false,// 分页组件是否显示
		rownumbers : true,// 行号
		columns : [ [ {
			field : 'userName',
			title : '用户名',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'realName',
			title : '真实姓名',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'fenshu',
			title : '分数',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right'
		} ] ]
	});
}
// 排序
function datasort(a, b) {
	return (a > b ? 1 : -1);
}

// 刷新
function reloadGrid() {
	$('#itemlist').datagrid('clearSelections');
	$('#itemlist').datagrid('reload');
}

// 查询
function seachStatisticsByParam() {
	var param = {
		username : '',
		realname : ''
	};
	var search_examName = $("#examName").val();
	var search_groupids = $("#groupids").val();
	param.examName = search_examName;
	param.groupids = search_groupids;

	$('#itemlist').datagrid('load', param);
}
// 
function fmname(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showExamDetail("
			+ rowData.ksid + ");'>查看分数段统计</a>";
}
function fmup(value, rowData, rowIndex) {
	var id = rowData.qsnid;
	var str = "<a onclick='exportExcel(" + id + ","+rowData.ksid+","+rowData.jgl+")' class='edit_qsn'>导出</a>";

	return str;
}
function exportExcel(id,ksid,jgl){
	$("#itemId").val(id);
	$("#ksid").val(ksid);
	$("#jgl").val(jgl);
	$("#exportForm").submit();
}
function showExamDetail(ksid){
	window.parent.openTab("考试分数段统计", "admin/S030/showExamDetail.html?ksid=" + ksid);
}
// 应考试用户连接
function fmyks(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showYksGridDia("
			+ rowData.ksid + ");'>" + rowData.yks + "</a>";
}
// 打开应考试用户列表dialog
function showYksGridDia(ksid) {
	$('#yksGridDiv').dialog("open");
	$('#yksGrid').datagrid({
		queryParams : {'ksid': ksid},
		url : baseUrl + "/admin/S030/findExamYks.html"
		});
}
// 实际考试用户链接
function fmsks(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showSksGridDia("
			+ rowData.ksid + ");'>" + rowData.sks + "</a>";
}
// 打开实际考试用户列表dialog
function showSksGridDia(ksid) {
	$('#sksGridDiv').dialog("open");
	$('#sksGrid').datagrid({
		queryParams : {'ksid': ksid},
		url : baseUrl + "/admin/S030/findExamSks.html"
		});
}
// 及格用户链接
function fmjg(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showJgGridDia("
			+ rowData.ksid + ");'>" + rowData.jg + "</a>";
}
// 打开及格用户列表dialog
function showJgGridDia(ksid) {
	$('#jgGridDiv').dialog("open");
	$('#jgGrid').datagrid({
		queryParams : {'ksid': ksid},
		url : baseUrl + "/admin/S030/findExamJg.html"
		});
}
// 未参加用户链接
function fmwcj(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showWcjGridDia("
			+ rowData.ksid + ");'>" + rowData.wcj + "</a>";
}
// 打开未参加用户列表dialog
function showWcjGridDia(ksid) {
	$('#wcjGridDiv').dialog("open");
	$('#wcjGrid').datagrid({
		queryParams : {'ksid': ksid},
		url : baseUrl + "/admin/S030/findExamWcj.html"
		});
}
// 及格率饼状图
function fmPie(value, rowData, rowIndex) {
	if (rowData.yks == 0) {
		return "<a href='javascript:;' class='blue_color_a' onclick='showPie(\""
			+ rowData.name + "\"," + rowData.jg + "," + rowData.yks + ");'>" + (0).toFixed(1) + "%" + "</a>";
	} else {
		return "<a href='javascript:;' class='blue_color_a' onclick='showPie(\""
			+ rowData.name+ "\"," + rowData.jg + "," + rowData.yks + ");'>" + (rowData.jg/rowData.yks*100).toFixed(1) + "%" + "</a>";
	}
}
// 未参加用户链接
function fmpm(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showPmGridDia("
			+ rowData.ksid + ");'>查看排名</a>";
}
// 打开未参加用户列表dialog
function showPmGridDia(ksid) {
	$('#pmGridDiv').dialog("open");
	$('#pmGrid').datagrid({
		queryParams : {'ksid': ksid},
		url : baseUrl + "/admin/S030/findExamPm.html"
		});
}
// 打开课程饼状图dialog
function showPie(name, jg, yks) {

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
            text: '及格率'
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
            name: '及格率',
            data: [
                ['未及格率', yks - jg/yks],
                {
                    name: '及格率',
                    y: jg/yks,
                    sliced: true,
                    selected: true
                }
            ]
        }]
    });
	$('#containerPie').dialog("open");
}