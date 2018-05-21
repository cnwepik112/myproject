$(function(){
	// 加载查询列表
	creatGrid();
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
});
/**
 * easyUi dataGrid注册方式说明，防止二次渲染 class注册方式一般是为了初始化属性，js方式则属性和事件都可初始化
 * 但是不管是class方式还是js方式注册组件，每次注册，只要被设置过url属性就会做请求。
 * 所以在不可避免要使用js方式注册的情况下，索性就不要使用class方式注册了。
 */
function creatGrid() {
	$('#courseList').datagrid({
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
		url : 'findCourses.html',
		toolbar : '#tbar',
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			checkbox : true
		} ] ],
		columns : [ [ {
			field : 'name',
			title : '课程名称',
			width : 120,
			halign: 'center',
			align : 'left',
			sortable : true,
			sorter : datasort
		}, {
			field : 'classifyName',
			title : '课程分类',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'studyTime',
			title : '学习时间',
			width : 200,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'coursewareCount',
			title : '课件数',
			width : 45,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right'

		}, {
			field : 'credit',
			title : '学分',
			width : 45,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right'

		}, {
			field : 'period',
			title : '学时',
			width : 45,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right'

		}, {
			field : 'insUser',
			title : '创建人',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'updDate',
			title : '更新时间',
			width : 80,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'center'
		}, {
			field : 'manage',
			title : '操作',
			halign: 'center',
			align : 'center',
			width : 100,
			formatter : operate
		} ] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
			$('.edit_course').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
			$('.drop_course').linkbutton({
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
	var id = rowData.courseId;
	return "<a href='javascript:updInfo("+id+");'  class='edit_course'>编辑</a><a onclick='delById("
			+ id + ");' class='drop_course' >删除</a>";
}
// 刷新
function reloadGrid() {
	$('#courseList').datagrid('clearSelections');
	$('#courseList').datagrid('reload');
}
// 查询
function findCourse() {
	// 课程名称
	var courseName = $("#courseName").val();
	// 课程分类
	var courseClassify = $("#courseClassifyCombox").next().find(
			".textbox-value").val();
	// 学时开始时间
	var dateStart = $("#studyTimeStart").next().find(".textbox-value").val();
	// 学时结束时间
	var dateEnd = $("#studyTimeStart").next().find(".textbox-value").val();
	// 创建人
	var createPeople = $("#createPeople").val();
	$('#courseList').datagrid('load', {
		courseName : courseName,
		classifyid : courseClassify,
		dateStart : dateStart,
		dateEnd : dateEnd,
		createPeople:createPeople
	});
}
// 添加课程
function addCourse() {
	window.parent.openTab("添加课程", "admin/addCourseLoad.html");
}
// 删除课程
function delCourse() {
	var items_id = new Array();
	var items = $('#courseList').datagrid('getSelections');
	if (items.length <= 0) {
		$.messager.alert('提示', '请选择要删除的课程', 'info');
		return;
	}
	$.messager.confirm('删除提示', '确定要删除选中课程?', function(r) {
		if (r) {
			// 获取选中课程的ID，并组成集合
			for ( var i = 0; i < items.length; i++) {
				items_id.push(items[i].courseId);
			}
			$.post("delCourse.html", {
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
// 根据ID删除
function delById(id) {
	var items_id = new Array();
	items_id.push(id);
	$.messager.confirm('删除提示', '确定要删除该课程?', function(r) {
		if (r) {
			$.post("delCourse.html", {
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
function updInfo(id){
	window.parent.closeTabByTitle("编辑课程");
	window.parent.openTab("编辑课程", "admin/editCourseLoad.html?courseId="+id);
}