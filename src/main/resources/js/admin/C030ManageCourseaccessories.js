$(function() {
	creatGrid();
	//附件分类
	$('#classifyCombx').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,//不可编辑
		url : baseUrl + '/admin/B020/findAccessoriesClassifyTree.html',
		required : false
	});
});
/**
 * easyUi dataGrid注册方式说明，防止二次渲染 class注册方式一般是为了初始化属性，js方式则属性和事件都可初始化
 * 但是不管是class方式还是js方式注册组件，每次注册，只要被设置过url属性就会做请求。
 * 所以在不可避免要使用js方式注册的情况下，索性就不要使用class方式注册了。
 */
function creatGrid() {
	$('#itemList').datagrid({
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
		url : 'findAccessoriess.html',
		toolbar : '#tbar',
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			checkbox : true
		} ] ],
		columns : [ [ {
			field : 'accessoriesName',
			title : '附件名称',
			width : 120,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'type',
			title : '类型',
			width : 45,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'classifyName',
			title : '附件分类',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'userName',
			title : '创建人',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'updDate',
			title : '更新时间',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'center',
			formatter : fmdate
		}, {
			field : 'manage',
			title : '操作',
			align : 'center',
			halign: 'center',
			width : 80,
			formatter : operate
		} ] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
			$('.edit_accessories').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
			$('.drop_courseware').linkbutton({
				iconCls : 'icon-no',
				plain : true
			});
		}
	});

}
//排序
function datasort(a, b) {
	return (a > b ? 1 : -1);
}
// 操作
function operate(value, rowData, rowIndex) {
	var id = rowData.courseAccessoriesId;
	return "<a href='javascript:void(0);' onclick='updInfo(" + id+ ");' class='edit_accessories'>编辑</a>" +
			"<a href='javascript:void(0);' onclick='delById("+ id + ");' class='drop_courseware' >删除</a>";
}

// 打开页面
function add() {
	window.parent.openTab("添加附件", "admin/C030AddAccessories.html");
}
// 格式化日期
function fmdate(value, rowData, rowIndex) {
	if (value != null && value != '') {
		return fmtLongDate(new Date(value));
	}
	return "";
}
function find() {
	// 附件名称
	var coursewareName = $("#name").val();
	// 附件分类
	var coursewareClassify = $("#classifyCombx").val();
	var dateStart = $("#updateTimeStart").next().find(".textbox-value").val();
	var dateEnd = $("#updateTimeEnd").next().find(".textbox-value").val();

	$('#itemList').datagrid('load', {
		coursewareName : coursewareName,
		classifyid : coursewareClassify,
		dateStart : dateStart,
		dateEnd : dateEnd
	});

}
// 刷新
function reloadGrid() {
	$('#itemList').datagrid('clearSelections');
	$('#itemList').datagrid('reload');
}

// 删除附件
function del() {
	var items_id = new Array();
	var items = $('#itemList').datagrid('getSelections');
	if (items.length <= 0) {
		$.messager.alert('提示', '请选择要删除的附件', 'info');
		return;
	}
	$.messager.confirm('删除提示', '确定要删除选中附件?', function(r) {
		if (r) {
			// 获取选中附件的ID，并组成集合
			for ( var i = 0; i < items.length; i++) {
				items_id.push(items[i].courseAccessoriesId);
			}
			$.post("delAccessories.html", {
				aid : items_id
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
	});
}

//根据ID删除
function delById(id) {
	var items_id = new Array();
	items_id.push(id);
	$.messager.confirm('删除提示', '确定要删除该附件?', function(r) {
		if (r) {
			$.post("delAccessories.html", {
				aid :items_id
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
	});
}
/**
 * 编辑附件
 */
function updInfo(id){
	window.parent.closeTabByTitle("编辑附件");
	window.parent.openTab("编辑附件", "admin/findUpdAccessories.html?id="+id);
}