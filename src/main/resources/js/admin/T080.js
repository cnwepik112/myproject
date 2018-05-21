$(function() {
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
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : true,// 分页组件是否显示
		pageNumber : 1,// 起始页
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50 ],// 每页显示多少行
		rownumbers : true,// 行号
		url : baseUrl + '/admin/T080/findExerciseList.html',
		toolbar : '#tbar',
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			checkbox : true
		} ] ],
		columns : [ [ {
			field : 'name',
			title : '练习作业名称',
			width : 150,
			fixed : true,
			align : 'left',
			rowspan : 2,
			sortable : true,
			sorter : datasort,
			formatter : titleLength
		}, {
			field : 'sjtitle',
			title : '试卷名称',
			width : 150,
			sortable : true,
			rowspan : 2,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'totalsorce',
			title : '总分',
			width : 50,
			sortable : true,
			rowspan : 2,
			sorter : datasort,
			align : 'right'
		}, {
			field : 'lxtm',
			title : '练习作业日期',
			width : 200,
			sortable : true,
			colspan : 2,
			align : 'center'
		}, {
			field : 'username',
			title : '创建人',
			width : 80,
			sortable : true,
			rowspan : 2,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'insdate',
			title : '创建时间',
			width : 100,
			align : 'center',
			sortable : true,
			sorter : datasort,
			rowspan : 2,
			formatter : fmdate
		}, {
			field : 'manage',
			title : '操作',
			align : 'center',
			width : 80,
			rowspan : 2,
			formatter : fmup
		} ], [
		{
			field : 'begintm',
			title : '开始时间',
			width : 100,
			align : 'center',
			sortable : true,
			sorter : datasort,
			formatter : fmdate
		},{
			field : 'endtm',
			title : '结束时间',
			width : 100,
			align : 'center',
			sortable : true,
			sorter : datasort,
			formatter : fmdate
		}
		] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
			$('.edit_qsn').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
			$('.drop_qsn').linkbutton({
				iconCls : 'icon-no',
				plain : true
			});
		}
	});

}
function titleLength(value, rowData, rowIndex) {
	if (value.length > 15) {
		return value.substr(0, 15);
	}
	return value;
}

function fmup(value, rowData, rowIndex) {
	var id = rowData.exid;
	var str = "<a onclick='updEx(" + id + ")' class='edit_qsn'>编辑</a>";
	str += "<a onclick='delExById(" + id + ");' class='drop_qsn' >删除</a>";
	return str;
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

// 删除试题提示
function delEXMessage() {

	$.messager.confirm('删除提示', '确定要删除选中练习?', function(r) {
		if (r) {
			delEx();
		} else {
			$('#itemlist').datagrid('clearSelections');
		}
	});
}
// 删除练习
function delEx() {
	var items_id = new Array();
	var items = $('#itemlist').datagrid('getSelections');
	if (items.length <= 0) {
		$.messager.alert('提示', '请选择要删除的练习', 'info');
		return;
	}
	// 获取选中试题的ID，并组成集合
	for ( var i = 0; i < items.length; i++) {
		items_id.push(items[i].exid);
	}
	$.post(baseUrl + '/admin/T080/updExDel.html', {
		eids : items_id
	}, function(data) {
		if (data > 0) {
			msgShow('删除成功!');
			reloadGrid();
		} else {
			msgShow('删除失败，请稍后重试');
			reloadGrid();
		}
	}, "json");
}
//删除练习
function delExById(exid) {
	var items_id = new Array();
	items_id.push(exid);
	$.messager.confirm('删除提示', '确定要删除选中练习?', function(r) {
		if (r) {
			$.post(baseUrl + '/admin/T080/updExDel.html', {
				eids : items_id
			}, function(data) {
				if (data > 0) {
					msgShow('删除成功!');
					reloadGrid();
				} else {
					msgShow('删除失败，请稍后重试');
					reloadGrid();
				}
			}, "json");
		} else {
			$('#itemlist').datagrid('clearSelections');
		}
	});
}
//刷新
function reloadGrid() {
	$('#itemlist').datagrid('clearSelections');
	$('#itemlist').datagrid('reload');
}

// 查询
function seachExByParam() {
	var param = {
		name : '',
		username : ''
	};

	var search_title = $("#searchtitle").val();
	var search_user = $("#searchuser").val();
	param.name = search_title;
	param.username = search_user;

	$('#itemlist').datagrid('load', param);
}
// 添加练习
function editEx() {
	window.parent.closeTabByTitle("添加练习");
	window.parent.openTab("添加练习", baseUrl
			+ "/admin/T080/editExJSP.html?type=add&exid=0");
}
// 编辑练习
function updEx(id) {
	window.parent.closeTabByTitle("编辑练习");
	window.parent.openTab("编辑练习", baseUrl
			+ "/admin/T080/editExJSP.html?type=upd&exid=" + id);
}