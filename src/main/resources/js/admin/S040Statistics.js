$(function() {
	creatGrid();
	creatXxGrid();
	creatWxxGrid();
	creatXxzGrid();
	creatYxwGrid();
	creatTgGrid();

	// 课程分类
	$('#courseClassifyCombox').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,//不可编辑
		url : baseUrl + '/admin/B020/findCourseClassifyTree.html',
		required : false
	});
	
	// 应该学习grid
	$('#xxGridDiv').dialog({
		fit:false,
		title : '应该学习用户',
		width:650,
		height:470,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	// 未学习grid
	$('#wxxGridDiv').dialog({
		fit:false,
		title : '未学习用户',
		width:450,
		height:470,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	// 学习中grid
	$('#xxzGridDiv').dialog({
		fit:false,
		title : '学习中用户',
		width:450,
		height:470,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	// 已学完grid
	$('#yxwGridDiv').dialog({
		fit:false,
		title : '已学完用户',
		width:650,
		height:470,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	// 通过grid
	$('#tgGridDiv').dialog({
		fit:false,
		title : '已通过用户',
		width:650,
		height:470,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});

	// 课程饼状图
	$('#containerPie').dialog({
		fit:false,
		title : '课程状态分布饼图',
		width:650,
		height:470,
		closed : true,
		modal : true,
		draggable : false,
		shadow : false
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
		idField : 'courseId', // 是标识字段
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : true,// 分页组件是否显示
		pageNumber : 1,// 起始页
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50, 100 ],// 每页显示多少行
		rownumbers : true,// 行号
		url : baseUrl + '/admin/S040/findCourseStatistics.html',
		columns : [ [ {
			field : 'courseId',
			title : '课程ID',
			width : 30,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right'
		}, {			
			field : 'name',
			title : '课程名称',
			width : 80,
			sortable : true,
			sorter : datasort,
			formatter : fmPie,
			halign: 'center',
			align : 'left'
		}, {
			field : 'classifyName',
			title : '分类名称',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'xxcnt',
			title : '应该学习人数',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right',
			formatter : fmXx
		}, {
			field : 'wxxcnt',
			title : '未学习人数',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right',
			formatter : fmWxx
		}, {
			field : 'xxzcnt',
			title : '学习中人数',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right',
			formatter : fmXxz
		}, {
			field : 'yxwcnt',
			title : '已学完人数',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right',
			formatter : fmYxw
		}, {
			field : 'tgcnt',
			title : '已通过人数',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right',
			formatter : fmTg
		}, {
			field : 'tgl',
			title : '课程的通过率',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right',
			formatter : fmTgl
		} ] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
		}
	});
}
// 应该学习人数grid
function creatXxGrid() {
	$('#xxGrid').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : true,// 分页组件是否显示
		pageNumber : 1,// 起始页
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50, 100 ],// 每页显示多少行
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
			title : '真实名称',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'studyProgres',
			title : '学习进度',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'appraise',
			title : '评价',
			width : 80,
			sortable : true,
			sorter : datasort,
			formatter : fmappraise,
			halign: 'center',
			align : 'center'
		}, {
			field : 'content',
			title : '评价内容',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		} ] ]
	});
}
// 未学习人数grid
function creatWxxGrid() {
	$('#wxxGrid').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : true,// 分页组件是否显示
		pageNumber : 1,// 起始页
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50, 100 ],// 每页显示多少行
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
			title : '真实名称',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		} ] ]
	});
}
// 学习中人数grid
function creatXxzGrid() {
	$('#xxzGrid').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : true,// 分页组件是否显示
		pageNumber : 1,// 起始页
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50, 100 ],// 每页显示多少行
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
			title : '真实名称',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'studyProgres',
			title : '学习进度',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		} ] ]
	});
}
// 已学完人数grid
function creatYxwGrid() {
	$('#yxwGrid').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : true,// 分页组件是否显示
		pageNumber : 1,// 起始页
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50, 100 ],// 每页显示多少行
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
			title : '真实名称',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'studyProgres',
			title : '学习进度',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'appraise',
			title : '评价',
			width : 80,
			sortable : true,
			sorter : datasort,
			formatter : fmappraise,
			halign: 'center',
			align : 'center'
		}, {
			field : 'content',
			title : '评价内容',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		} ] ]
	});
}
// 已通过人数grid
function creatTgGrid() {
	$('#tgGrid').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : true,// 分页组件是否显示
		pageNumber : 1,// 起始页
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50, 100 ],// 每页显示多少行
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
			title : '真实名称',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'appraise',
			title : '评价',
			width : 80,
			sortable : true,
			sorter : datasort,
			formatter : fmappraise,
			halign: 'center',
			align : 'center'
		}, {
			field : 'content',
			title : '评价内容',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		} ] ]
	});
}

// 排序
function datasort(a, b) {
	return (a > b ? 1 : -1);
}
// 评价状态
function fmappraise(value, rowData, rowIndex) {
	if (value == -1) {
		return "呵呵";
	} else if (value == 0) {
		return "无感！";
	} else if (value == 1) {
		return "哇哦！";
	}
	return "";
}
// 刷新
function reloadGrid() {
	$('#itemlist').datagrid('clearSelections');
	$('#itemlist').datagrid('reload');
}

// 查询
function seachStatisticsByParam() {
	var param = {
		name : '',
		classifyId : ''
	};

	var search_name = $("#courseName").val();
	// 课程分类
	var search_classifyId = $("#courseClassifyCombox").next().find(
			".textbox-value").val();
	param.name = search_name;
	param.classifyId = search_classifyId;

	$('#itemlist').datagrid('load', param);
}
// 应该学习人数
function fmXx(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showXxGridDia("
			+ rowData.courseId + ");'>" + rowData.xxcnt + "</a>";
}
// 打开应该学习人列表dialog
function showXxGridDia(cid) {
	$('#xxGridDiv').dialog("open");
	$('#xxGrid').datagrid("load",{
		url : baseUrl + '/admin/S040/findCourseXx.html',
		courseId:cid});
}
// 未学习人数
function fmWxx(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showWxxGridDia("
			+ rowData.courseId + ");'>" + rowData.wxxcnt + "</a>";
}
// 打开未学习人列表dialog
function showWxxGridDia(cid) {
	$('#wxxGridDiv').dialog("open");
	$('#wxxGrid').datagrid("load",{
		url : baseUrl + '/admin/S040/findCourseXx.html',
		courseId:cid, state:0});
}
// 学习中人数
function fmXxz(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showXxzGridDia("
			+ rowData.courseId + ");'>" + rowData.xxzcnt + "</a>";
}
// 打开学习中列表dialog
function showXxzGridDia(cid) {
	$('#xxzGridDiv').dialog("open");
	$('#xxzGrid').datagrid("load",{
		url : baseUrl + '/admin/S040/findCourseXx.html',
		courseId:cid, state:1});
}
// 已学完人数
function fmYxw(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showYxwGridDia("
			+ rowData.courseId + ");'>" + rowData.yxwcnt + "</a>";
}
// 打开学习中列表dialog
function showYxwGridDia(cid) {
	$('#yxwGridDiv').dialog("open");
	$('#yxwGrid').datagrid("load",{
		url : baseUrl + '/admin/S040/findCourseXx.html',
		courseId:cid, state:3});
}
// 通过人数
function fmTg(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showTgGridDia("
			+ rowData.courseId + ");'>" + rowData.tgcnt + "</a>";
}
// 打开通过列表dialog
function showTgGridDia(cid) {
	$('#tgGridDiv').dialog("open");
	$('#tgGrid').datagrid("load",{
		url : baseUrl + '/admin/S040/findCourseXx.html',
		courseId:cid, state:4});
}
// 课程通过率
function fmTgl(value, rowData, rowIndex) {
	if (rowData.xxcnt == 0) {
		return 0;
	} else {
		return rowData.tgcnt / rowData.xxcnt;
	}
}
// 课程饼状图
function fmPie(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showPie("
			+ rowData.xxcnt + "," + rowData.wxxcnt + ","
			+ rowData.xxzcnt + "," + rowData.yxwcnt + ","
			+ rowData.tgcnt + ");'>" + rowData.name + "</a>";
}
// 打开课程饼状图dialog
function showPie(xxcnt, wxxcnt, xxzcnt, yxwcnt, tgcnt) {
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
            name: '所占比率',
            data: [
                ['未学习人数', wxxcnt/xxcnt],
                ['学习中人数', xxzcnt/xxcnt],
                {
                    name: '已学完人数',
                    y: yxwcnt/xxcnt,
                    sliced: true,
                    selected: true
                },
                ['已通过人数', tgcnt/xxcnt]
            ]
        }]
    });
	$('#containerPie').dialog("open");
}
