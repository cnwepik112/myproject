$(function() {
	creatGrid();
	$('#courseClassifyCombx').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,//不可编辑
		url : baseUrl + '/admin/B020/findCoursewareClassifyTree.html',
		required : false
	});
});
/**
 * easyUi dataGrid注册方式说明，防止二次渲染 class注册方式一般是为了初始化属性，js方式则属性和事件都可初始化
 * 但是不管是class方式还是js方式注册组件，每次注册，只要被设置过url属性就会做请求。
 * 所以在不可避免要使用js方式注册的情况下，索性就不要使用class方式注册了。
 */
function creatGrid() {
	$('#coursewareList').datagrid({
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
		url : 'findcoursewares.html',
		toolbar : '#tbar',
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			checkbox : true
		} ] ],
		columns : [ [ {
			field : 'coursewareName',
			title : '课件名称',
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
			title : '课件分类',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'timelength',
			title : '学时（分）',
			width : 45,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right'
	
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
		},
		{
			field : 'manage',
			title : '操作',
			halign: 'center',
			align : 'center',
			width : 80,
			formatter : operate
		} ] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
			$('.edit_courseware').linkbutton({
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
//操作
function operate(value, rowData, rowIndex) {
	var id=rowData.coursewareId;
	return "<a href='javascript:void(0)' onclick='updInfo("+id+");' class='edit_courseware'>编辑</a><a href='javascript:void(0);' onclick='delById("+id+");' class='drop_courseware' >删除</a>";
}

//打开页面
function addCourseware(){
	window.parent.openTab("添加课件", "admin/C020AddCourseware.html");
}
//格式化日期
function fmdate(value, rowData, rowIndex) {
	if (value != null && value != '') {
		return fmtLongDate(new Date(value));
	}
	return "";
}
function findCourseware(){
	//课件名称
	var coursewareName=$("#coursewareName").val();
	//课件分类
	var coursewareClassify=$("#courseClassifyCombx").combotree("getValue");
	//学时（分）开始
	var studyTimeStart=$("#periodStart").datebox("getValue");
	//学时（分）结束
	var studyTimeEnd=$("#periodEnd").datebox("getValue");
	var dateStart=$("#updateTimeStart").next().find(".textbox-value").val();
	var dateEnd=$("#updateTimeEnd").next().find(".textbox-value").val();
	$('#coursewareList').datagrid('load', {    
		coursewareName: coursewareName,
		classifyid:coursewareClassify,
		timeLengthStart:studyTimeStart,
		timeLengthEnd:studyTimeEnd,
		dateStart:dateStart,
		dateEnd:dateEnd
	});
}
//刷新
function reloadGrid() {
	$('#coursewareList').datagrid('clearSelections');
	$('#coursewareList').datagrid('reload');
}

// 删除课件
function delCourseware() {
	var items_id = new Array();
	var items = $('#coursewareList').datagrid('getSelections');
	if (items.length <= 0) {
		$.messager.alert('提示', '请选择要删除的课件', 'info');
		return;
	}
	$.messager.confirm('删除提示', '确定要删除选中课件?', function(r) {
		if (r) {
			// 获取选中课件的ID，并组成集合
			for ( var i = 0; i < items.length; i++) {
				items_id.push(items[i].coursewareId);
			}
			$.post("delCourseware.html", {
				cid : items_id
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
	$.messager.confirm('删除提示', '确定要删除该课件?', function(r) {
		if (r) {
			$.post("delCourseware.html", {
				cid :items_id
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
 * 编辑课件
 */
function updInfo(id){
	window.parent.closeTabByTitle("编辑课件");
	window.parent.openTab("编辑课件", "admin/findUpdCourseware.html?id="+id);
}
