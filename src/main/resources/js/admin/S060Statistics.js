// 错题统计
$(function() {		
	creatGrid();
/*	creatUserGrid();*/

	// 考试分类
	$('#examClassifyCombox').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,//不可编辑
		onHidePanel : getChildrens,//获取子节点
		url : baseUrl + '/admin/B010/findKaoShiClassAddALL.html',
		required : false
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
	$('#searchclassify').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		onHidePanel : getChildren,//获取子节点
		panelMinWidth:200,
		panelMaxWidth:300,
		panelMaxHeight:200,
		url : baseUrl + '/admin/B010/findQsnClassifyAddALL.html',
		required : false
	});
	$('#searchknowledge').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		onHidePanel : getChildrenKnowledge,//获取子节点
		panelMinWidth:200,
		panelMaxWidth:300,
		panelMaxHeight:200,
		url : baseUrl + '/admin/B010/findQsnKnowledgeAddALL.html',
		required : false
	});
	// 错题用户grid
	$('#userGridDiv').dialog({
		fit:false,
		title : '错题用户详细',
		width:750,
		height:470,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	$('#excelForm').form({
		url : baseUrl + "/admin/S060/exportUserExcel.html"
	});
});
var classifyids="";//全局变量
function getChildrens() {
	var grouptree = $('#examClassifyCombox').combotree('tree');//对应combotreeID
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
	classifyids=ids;//赋值给全局变量 记录所选分类全部ID
}
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
		url : baseUrl + '/admin/S060/getErrorShiti.html',
		columns : [ [ {
			field : 'typename',
			title : '题型',
			width : 100,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'qsnId',
			title : '问题ID',
			width : 30,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right'
		}, {			
			field : 'title',
			title : '试题题目',
			width : 170,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'ksid',
			title : '考试ID',
			width : 50,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right'
		}, {			
			field : 'name',
			title : '考试名称',
			width : 170,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'cnt',
			title : '错题人数',
			width : 60,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right',
			formatter : fmct
		}, {
			field : 'cuowulv',
			title : '错误率',
			width : 60,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'right',
			formatter : fmcwl
		} ] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
		}
	});
}
// 错题用户grid
function creatUserGrid() {
	var ksid = $("#ksid").val();
	var qsnId = $("#qsnId").val();

	$('#userGrid').datagrid({
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
		queryParams : {'ksid':ksid ,'qsnId': qsnId},
		url : baseUrl + "/admin/S060/getErrorUser.html",
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
			field : 'ksdaan',
			title : '考生答案',
			width : 120,
			sortable : true,
			sorter : datasort,
			halign: 'center',
			align : 'left'
		}, {
			field : 'daan',
			title : '正确答案',
			width : 120,
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

// 刷新
function reloadGrid() {
	$('#itemlist').datagrid('clearSelections');
	$('#itemlist').datagrid('reload');
}

// 查询
function seachStatisticsByParam() {
	var param = {
		ksClassifyId : '',
		examName : '',
		stClassifyId : '',
		knowledgeClassifyId : ''
	};
	var search_examClassify = classifyids;
	if(search_examClassify == 0){
		search_examClassify = '';
	}
	var search_stClassify = stClassifyids;
	if(search_stClassify == 0){
		search_stClassify = '';
	}
	var search_knowledgeClassify = knowledgeClassifyids;
	if(search_knowledgeClassify == 0){
		search_knowledgeClassify = '';
	}
	
	var search_examName = $("#examNameBox").val();

	param.ksClassifyId = search_examClassify;
	param.examName = search_examName;
	param.stClassifyId = search_stClassify;
	param.knowledgeClassifyId = search_knowledgeClassify;

	$('#itemlist').datagrid('load', param);
}
// 错题用户连接
function fmct(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showUserGridDia("
			+ rowData.ksid + "," + rowData.qsnId + ");'>" + rowData.cnt + "</a>";
}
// 打开应错题用户列表dialog
function showUserGridDia(ksid, qsnId) {
	$('#ksid').val(ksid);
	$('#qsnId').val(qsnId);
	$('#userGridDiv').dialog("open");
	/*$('#userGrid').datagrid({
		queryParams : {'ksid':ksid ,'qsnId': qsnId},
		url : baseUrl + "/admin/S060/getErrorUser.html"
		});*/
	creatUserGrid();
}
// 错题率
function fmcwl(value, rowData, rowIndex) {
	return rowData.cuowulv + "%";
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
// 错题分类子节点
var stClassifyids="";//全局变量
function getChildren() {
	var grouptree =  $('#searchclassify').combotree('tree');//对应combotreeID
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
	stClassifyids=ids;//赋值给全局变量 记录所选分类全部ID
}
var knowledgeClassifyids="";//错题知识点子节点
function getChildrenKnowledge() {
	var grouptree =  $('#searchknowledge').combotree('tree');//对应combotreeID
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
	knowledgeClassifyids=ids;//赋值给全局变量 记录所选分类全部ID
}
//导出Excel
function exportExcel() {
	$('#excelForm').submit();
	return false;
}