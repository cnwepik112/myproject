$(function() {
	//创建查看弹出框
	creatGrid();
	$('#answerDialog').dialog({
		title : '回答信息',
		closed : true,
		modal : true,
		shadow : false
	});
});

function creatGrid() {
	$('#askList').datagrid({
		fit : false,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : true,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : true,// 分页组件是否显示
		pageNumber : 1,// 起始页
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50 ],// 每页显示多少行
		rownumbers : true,// 行号
		url : baseUrl + '/admin/Q010/showAskanswer.html',
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 30,
			checkbox : true
		} ] ],
		columns : [ [ {
			sortable : true,
			sorter : datasort,
			field : 'lyname',
			title : '来源',
			width : 50,
			halign: 'center',
			align : 'left',
			formatter:namefrm	
		}, {
			sortable : true,
			sorter : datasort,
			field : 'title',
			title : '问答标题',
			width : 200,
			halign: 'center',
			align : 'left'
		}, {
			sortable : true,
			sorter : datasort,
			field : 'userName',
			title : '提问人',
			width : 80,
			halign: 'center',
			align : 'left'
		},{
			sortable : true,
			sorter : datasort,
			field : 'insDate',
			title : '提问时间',
			width : 150,
			align : 'center'
		},{
			sortable : true,
			sorter : datasort,
			field : 'acount',
			title : '回答数',
			width : 50,
			align : 'right'
		},
		{
			field : 'manage',
			title : '操作',
			align : 'center',
			width : 100,
			formatter : fmup
		} ] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
			$('.edit_resource').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
			$('.drop_resource').linkbutton({
				iconCls : 'icon-no',
				plain : true
			});

		}
	});
}

//查询
function findAsk() {
	var content=$("#TitleContent").val();
	var insUser=$("#asked").val();
	$('#askList').datagrid('load', {
		title: content,
		insUser:insUser
	});
}

//格式化日期
function fmdate(value, rowData, rowIndex) {
	if (value != null && value != '') {
		return fmtLongDate(new Date(value));
	}
	return "";
}
function namefrm(value, rowData, rowIndex){
	if(value != null && value != ''){
		return value;
	}else{
		return "自问答";
	}
}
//排序
function datasort(a, b) {
	return (a > b ? 1 : -1);
}

//按钮
function fmup(value, rowData, rowIndex) {
	var id = rowData.id;
	var str="<a onclick='answerDialog("+ id+ ")' class='edit_resource'>查看</a>";
	str += "<a onclick='delAskById("+ id+ ");' class='drop_resource' >删除</a>";
	return str;
}

//删除问答提示
function delAnswerById(id) {
	$.messager.confirm('删除提示', '确定要删除这条回答?', function(r) {
		if (r) {
			del(id);
		}
	});
}
//单个删除
function delAskById(mId) {
	$.messager.confirm('删除提示', '确定要删除这条问答内容吗?', function(r) {
		if (r) {
			$.post(baseUrl + "/admin/Q010/deleteAskanswer.html", {
				id : mId
			}, function(data) {
				if (data > 0) {
					msgShow('删除成功');
					reloadGrid();
				} else {
					msgShow('删除失败，请稍后重试');
					reloadGrid();
				}
			}, "json");
		}
	});
}
function del(mId){
	$.post(baseUrl + "/admin/Q010/deleteAskanswer.html", {
		id : mId
	}, function(data) {
		if (data > 0) {
			msgShow('删除成功');
			reloadAnswerGrid();
		} else {
			msgShow('删除失败，请稍后重试');
			reloadAnswerGrid();
		}
	}, "json");
}
//多条删除
function delAsks() {
	var items_id = new Array();
	var items = $('#askList').datagrid('getSelections');
	if (items.length <= 0) {
		$.messager.alert('提示', '请选择要删除的问答内容', 'info');
		return;
	}
	// 获取选中消息的ID，并组成集合
	for ( var i = 0; i < items.length; i++) {
		items_id.push(items[i].id);
	}

	$.post(baseUrl + "/admin/Q010/deleteq010Askanswer.html", {
		mid : items_id
	}, function(data) {
		if (data > 0) {
			msgShow('删除成功');
			reloadGrid();
		} else {
			msgShow('删除失败，请稍后重试');
			reloadGrid();
		}
	}, "json");
}

// 刷新提问列表
function reloadGrid() {
	$('#askList').datagrid('clearSelections');
	$('#askList').datagrid('reload');
}
//刷新回答列表
function reloadAnswerGrid() {
	$('#answerList').datagrid('clearSelections');
	$('#answerList').datagrid('reload');
}

function creatAnswerGrid(id) {
	$('#answerList').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : true,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : true,// 分页组件是否显示
		pageNumber : 1,// 起始页
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50 ],// 每页显示多少行
		rownumbers : true,// 行号
		url : baseUrl + '/admin/Q010/lookOver.html?id='+id,
		columns : [ [ {
			field : 'ansUserName',
			title : '回答者',
			width : 60,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'ansContent',
			title : '解析内容',
			width : 160,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'ansInsDate',
			title : '解答时间',
			width : 60,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'center',
			formatter : fmdate
		},{
			field : 'manage',
			title : '操作',
			width : 40,
			align : 'center',
			formatter : operate
		}] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
			$('.drop_answer').linkbutton({
				iconCls : 'icon-no',
				plain : true
			});
		}
	});
}
//操作
function operate(value, rowData, rowIndex) {
	var id = rowData.ansid;
	return "<a onclick='delAnswerById("+ id+ ");' class='drop_answer' >删除</a>";
}
//查看
function answerDialog(id) {
	creatAnswerGrid(id);
	$('#answerDialog').dialog("open");
}