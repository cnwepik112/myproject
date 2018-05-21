$(function() {
	creatGrid();
	creatKsGrid();
	creatZsGrid();
	creatXfGrid();
	// 考试grid
	$('#ksGridDiv').dialog({
		fit:false,
		title : '用户考试详细',
		width:750,
		height:470,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	// 课程grid
	$('#kcGridDiv').dialog({
		fit:false,
		title : '用户课程详细',
		width:850,
		height:470,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	// 证书grid
	$('#zsGridDiv').dialog({
		fit:false,
		title : '用户证书详细',
		width:800,
		height:470,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	// 学分grid
	$('#xfGridDiv').dialog({
		fit:false,
		title : '用户学分详细',
		width:550,
		height:470,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	$('#searchUserGroup').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		panelMinWidth:200,
		panelMaxWidth:300,
		panelMaxHeight:200,
		animate : true,
		editable : true,
		url : baseUrl + '/admin/U030/findGroupAddALL.html',
		required : false,
		onHidePanel : getChildren
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
		idField : 'userId', // 是标识字段
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : true,// 分页组件是否显示
		pageNumber : 1,// 起始页
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50, 100 ],// 每页显示多少行
		rownumbers : true,// 行号
		url : baseUrl + '/admin/S020/findUserStatistics.html',
		columns : [ [ {
			field : 'userId',
			title : 'ID',
			width : 20,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right'
		}, {			
			field : 'userName',
			title : '用户名',
			width : 100,
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
			field : 'kscnt',
			title : '考试次数',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right',
			formatter : fmks
		}, {
			field : 'zscnt',
			title : '证书',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right',
			formatter : fmzs
		}, {
			field : 'credit',
			title : '总学分',
			width : 100,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right',
			formatter : fmxf
		} ] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {

		}
	});
}
// 考试grid
function creatKsGrid() {
	$('#ksGrid').datagrid({
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
			field : 'ksuid',
			title : 'ID',
			width : 40,
			fixed : true,
			halign: 'center',
			align : 'right',
			sortable : true,
			sorter : datasort
		}, {
			field : 'ksname',
			title : '考试名称',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'kstimes',
			title : '考试次数',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right'
		}, {
			field : 'sjtotalsorce',
			title : '试卷总分',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right'
		}, {
			field : 'kssorce',
			title : '用户得分',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right'
		}, {
			field : 'startTime',
			title : '开始考试时间',
			width : 120,
			sortable : true,
			sorter : datasort,
			formatter : fmdate,
			halign: 'center',
			align : 'center'
		}, {
			field : 'endTime',
			title : '结束考试时间',
			width : 120,
			sortable : true,
			sorter : datasort,
			formatter : fmdate,
			halign: 'center',
			align : 'center'
		} ] ]
	});
}

// 证书grid
function creatZsGrid() {
	$('#zsGrid').datagrid({
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
			field : 'id',
			title : 'ID',
			width : 40,
			fixed : true,
			halign: 'center',
			align : 'right',
			sortable : true,
			sorter : datasort
		}, {
			field : 'number',
			title : '证书编号',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'zsname',
			title : '证书名称',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'issueAgency',
			title : '发放机构',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'expiryDate',
			title : '发放日期',
			width : 120,
			sortable : true,
			sorter : datasort,
			formatter : fmdate,
			halign: 'center',
			align : 'center'
		}, {
			field : 'kcname',
			title : '来源课程',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'ksname',
			title : '来源考试',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		} ] ]
	});
}
// 学分grid
function creatXfGrid() {
	$('#xfGrid').datagrid({
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
			field : 'name',
			title : '获得学分来源',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'endTm',
			title : '获得学分时间',
			width : 80,
			sortable : true,
			sorter : datasort,
			formatter : fmdate,
			halign: 'center',
			align : 'center'
		}, {
			field : 'credit',
			title : '所得学分',
			width : 40,
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
// 日期转换
function fmdate(value, rowData, rowIndex) {
	// fmtLongDate--common.js
	if (value != null && value != '') {
		return fmtLongDate(new Date(value));
	}
	return "";
}

//获得所选用户组节点及子节点,暂未调用
function getChildren() {
	var grouptree = $('#searchUserGroup').combotree('tree');
	var n = grouptree.tree('getSelected');
	var ids=n.id;
	var items=n.children;
	if(items!=null){
		var children = grouptree.tree('getChildren', n.target);
		for(var i=0;i<children.length;i++){
			var item=children[i];
			ids=ids+","+item.id;
		}
	}
	$("#groupids").val(ids);
}

// 课程状态
function fmstate(value, rowData, rowIndex) {
	if (value == 0) {
		return "未学习";
	} else if (value == 1) {
		return "学习中";
	} else if (value == 2) {
		return "已学完";
	} else if (value == 3) {
		return "已考试";
	} else if (value == 4) {
		return "已及格";
	} else {
		return "未知";
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
			groupid : '',
			username : '',
			realname : ''
		};
	var search_groupid = $("#groupids").val();
	var search_username = $("#userNameLike").val();
	var search_realname = $("#realNameLike").val();
	param.username = search_username;
	param.realname = search_realname;
	param.groupid = search_groupid;
	$('#itemlist').datagrid('load', param);
}
// 考试连接
function fmks(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showKsGridDia("
			+ rowData.userId + ");'>" + rowData.kscnt + "</a>";
}
// 打开用户考试列表dialog
function showKsGridDia(uid) {
	$('#ksGridDiv').dialog("open");
	$('#ksGrid').datagrid({
		queryParams : {'userId': uid},
		url : baseUrl + "/admin/S020/findUserKS.html"
		});
}
// 课程链接
function fmkc(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showKcGridDia("
			+ rowData.userId + ");'>" + rowData.kccnt + "</a>";
}
// 打开用户课程列表dialog
function showKcGridDia(uid) {
	$('#kcGridDiv').dialog("open");
	$('#kcGrid').datagrid({
		queryParams : {'userId': uid},
		url : baseUrl + "/admin/S020/findUserKC.html"
		});
}
// 证书链接
function fmzs(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showZsGridDia("
			+ rowData.userId + ");'>" + rowData.zscnt + "</a>";
}
// 打开用户 证书列表dialog
function showZsGridDia(uid) {
	$('#zsGridDiv').dialog("open");
	$('#zsGrid').datagrid({
		queryParams : {'userId': uid},
		url : baseUrl + "/admin/S020/findUserZS.html"
		});
}
// 学分链接
function fmxf(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showXfGridDia("
			+ rowData.userId + ");'>" + rowData.credit + "</a>";
}
// 打开用户学分列表dialog
function showXfGridDia(uid) {
	$('#xfGridDiv').dialog("open");
	$('#xfGrid').datagrid({
		queryParams : {'userId': uid},
		url : baseUrl + "/admin/S020/findUserXF.html"
		});
}
