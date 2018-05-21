$(function() {
	creatGrid1();//未审核Grid
	creatGrid2();//已审核Grid
	creatGrid3();//审核未通过Grid
	//未审核考试分类tree
	$('#searchKaoShiFenLei').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : true,
		onHidePanel : getChildrenSKSF,//获取子节点
		url : baseUrl + '/admin/B010/findKaoShiClassAddALL.html',
		required : false
	});
	//已审核分类tree
	$('#finishSearchKaoShiFenLei').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : true,
		onHidePanel : getChildrenFSKSF,//获取子节点
		url : baseUrl + '/admin/B010/findKaoShiClassAddALL.html',
		required : false
	});
	//审核通过tree
	$('#finishSearchKaoShiFenLeiFail').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : true,
		onHidePanel : getChildrenTSKSF,//获取子节点
		url : baseUrl + '/admin/B010/findKaoShiClassAddALL.html',
		required : false
	});
});
var classifyids="";//全局变量
function getChildrenSKSF() {
	var grouptree = $('#searchKaoShiFenLei').combotree('tree');//对应combotreeID
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
var finishclassifyids="";//全局变量
function getChildrenFSKSF() {
	var grouptree = $('#finishSearchKaoShiFenLei').combotree('tree');//对应combotreeID
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
	finishclassifyids=ids;//赋值给全局变量 记录所选分类全部ID
}
var nofinishclassifyids="";//全局变量
function getChildrenTSKSF() {
	var grouptree = $('#finishSearchKaoShiFenLeiFail').combotree('tree');//对应combotreeID
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
	nofinishclassifyids=ids;//赋值给全局变量 记录所选分类全部ID
}
//加载报名未审核
function creatGrid1() {
	$('#auditList').datagrid({
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
		url : baseUrl + '/admin/T090/showAllAudits.html',
		queryParams: {"signupFlag": 0},
		toolbar : '#tbar',
		frozenColumns : [ [ {
			field : 'select',title : '选择',width : 50,checkbox : true
		} ] ],
		columns : [ [ 
		{
			field : 'ksname',title : '考试名称',width : 100,rowspan:2,halign: 'center',
			sortable : true,sorter : datasort,align : 'left'
		}, {
			field : 'mkscname',title : '考试分类',width : 80,rowspan:2,halign: 'center',
			sortable : true,sorter : datasort,align : 'left'
		}, {
			field : '',title : '考试日期',width : 240,colspan:2,
			sortable : true,sorter : datasort,align : 'center'
		}, {	
			field : 'totalsorce',title : '考试总分',width : 80,rowspan:2,halign: 'center',
			sortable : true,sorter : datasort,align : 'right'
		},{
			field : 'groupName',title : '用户组',width : 80,rowspan:2,halign: 'center',
			sortable : true,sorter : datasort,align : 'left'
		},{
			field : 'realName',title : '真实姓名',width : 80,rowspan:2,halign: 'center',
			sortable : true,sorter : datasort,align : 'left'				
		},{
			field : 'userName',title : '用户登录名',width : 80,rowspan:2,halign: 'center',
			sortable : true,sorter : datasort,align : 'left'
		}, {
			field : 'signupTm',title : '报名时间',width : 120,
			rowspan:2,sortable : true,sorter : datasort,align : 'center',
			formatter:fmdate
		}, 
		{
			field : 'manage',title : '状态设置',align : 'center',width : 120,
			rowspan:2,sortable : true,sorter : datasort
			,formatter : fmup1
		} 
//		, 
//		{
//			field : 'manage1',title : '操作',align : 'center',width : 120,
//			rowspan:2,sortable : true,sorter : datasort
//			,formatter : del
//		} 
		],[
 		{
			field : 'startTm',title : '开始时间',width : 120,
			sortable : true,sorter : datasort,align : 'center',
			formatter:fmdate
		}, {
			field : 'endTm',title : '结束时间',align : 'center',width : 120,
			sortable : true,sorter : datasort,formatter:fmdate
		}
		] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {	
			$('.startaudit_usersPass').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
			$('.startaudit_usersFail').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
//			$('.drop_message').linkbutton({
//				iconCls : 'icon-no',
//				plain : true
//			});
		}
	});	
}
//查询未审核
function seachKaoShiByParam(){
	//考试名称
	var ksname=$("#kaoshiName").val();
	//考试分类id
//	var mkscname=$("#searchKaoShiFenLei").next().find(".textbox-value").val();
	var mkscname=classifyids;
	//考试用户
	var userName=$("#userName").val();
	$('#auditList').datagrid('load', {
		signupFlag:0,
		ksname:ksname,
		mkscname:mkscname,
		userName:userName
	});
}
//操作未审核信息，变为审核通过和未通过
function fmup1(value, rowData, rowIndex) {
	var id = rowData.id;
	var str="<a onclick='toShenHePass("+ id+ ")' style= 'border: 1px solid #0C0C0C;background: #F5F1EC;margin-right:5px;margin-bottom:2px' class='startaudit_usersPass'>通过</a>";
	str +="<a onclick='toShenHeFail("+ id+ ")' style= 'border: 1px solid #0C0C0C;background: #F5F1EC;margin-bottom:2px' class='startaudit_usersFail'>不通过</a>";
	return str;
}
//审核通过
function toShenHePass(id){
	$.messager.confirm('审核提示', '确定要通过此次报名?', function(r) {
		if (r) {
			$.post(baseUrl + '/admin/T090/toAuditsPass.html', {
				id : id
			} ,function(data) {
				if (data > 0) {
					msgShow('审核通过！');
					reloadGrid1();
					reloadGrid2();
				} else {
					msgShow('审核失败，请稍后重试');
					reloadGrid();
				}
			}, "json");
		}
	});	
}
//批量审核通过
function auditSomeToPass(){
	$.messager.confirm('审核提示', '确定要通过所选报名?', function(r) {
		if (r) {
			someToPass();
		}
	});
}
//批量通过（实现）
function someToPass(){
	var items_id = new Array();
	var items = $('#auditList').datagrid('getSelections');
	if (items.length <=0){
		msgShow("请选择要审核的报名！");
		return;
	}
	for (var i=0; i<items.length; i++) {
		items_id.push(items[i].id);
	}
	$.post(baseUrl + "/admin/T090/auditsSomeToPass.html",{
		mid : items_id
	},
	function(data){
		if(data>0){
			msgShow('审核成功！');
			reloadGrid1();
			reloadGrid2();		
		}
	},"json");
}
//审核不通过
function toShenHeFail(id){
	$.messager.confirm('审核提示', '确定要拒绝此次报名?', function(r) {
		if (r) {
			$.post(baseUrl + '/admin/T090/toAuditsFail.html', {
				id : id
			} ,function(data) {
				if (data > 0) {
					msgShow('审核未通过！');
					reloadGrid1();
					reloadGrid3();
				} else {
					msgShow('删除失败，请稍后重试');
					reloadGrid();
				}
			}, "json");
		}
	});	
}
//批量审核不通过
function auditSomeToFail(){
	$.messager.confirm('审核提示', '确定要拒绝所选报名?', function(r) {
		if (r) {
			someToFail();
		}
	});
}
//批量不通过（实现）
function someToFail(){
	var items_id = new Array();
	var items = $('#auditList').datagrid('getSelections');
	if (items.length <=0){
		msgShow("请选择要拒绝的报名！");
		return;
	}
	for (var i=0; i<items.length; i++) {
		items_id.push(items[i].id);
	}
	$.post(baseUrl + "/admin/T090/auditsSomeToFail.html",{
		mid : items_id
	},
	function(data){
		if(data>0){
			msgShow('拒绝成功！');
			reloadGrid1();
			reloadGrid3();		
		}
	},"json");
}
//加载已审核报名
function creatGrid2() {
	$('#finishAuditList').datagrid({
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
		url : baseUrl + '/admin/T090/showAllAudits.html',
		queryParams: {"signupFlag": 1},
		toolbar : '#tbar2',
		frozenColumns : [ [ {
			field : 'select',title : '选择',width : 50,checkbox : true
		} ] ],
		columns : [ [
		{
			field : 'ksname',title : '考试名称',width : 100,rowspan:2,halign: 'center',
			sortable : true,sorter : datasort,align : 'left'
		}, {
			field : 'mkscname',title : '考试分类',width : 80,rowspan:2,halign: 'center',
			sortable : true,sorter : datasort,align : 'left'
		}, {
			field : '',title : '考试日期',width : 240,colspan:2,
			sortable : true,sorter : datasort,align : 'center'
		}, {	
			field : 'totalsorce',title : '考试总分',width : 80,rowspan:2,halign: 'center',
			sortable : true,sorter : datasort,align : 'right'
		},{
			field : 'groupName',title : '用户组',width : 80,rowspan:2,halign: 'center',
			sortable : true,sorter : datasort,align : 'left'
		},{
			field : 'realName',title : '真实姓名',width : 80,rowspan:2,halign: 'center',
			sortable : true,sorter : datasort,align : 'left'				
		},{
			field : 'userName',title : '用户登录名',width : 80,rowspan:2,halign: 'center',
			sortable : true,sorter : datasort,align : 'left'
		}, {
			field : 'signupTm',title : '报名时间',width : 120,rowspan:2,
			sortable : true,sorter : datasort,align : 'center',
			formatter:fmdate
		}, 
		{
			field : 'manage',title : '状态设置',align : 'center',width : 120,
			rowspan:2,sortable : true,sorter : datasort,
			formatter : fmup
		}
//		,
//		{
//			field : 'manage1',title : '操作',align : 'center',width : 120,
//			rowspan:2,sortable : true,sorter : datasort
//			,formatter : del
//		} 
		],[
		{
			field : 'startTm',title : '开始时间',width : 120,sortable : true,
			sorter : datasort,align : 'center',formatter:fmdate
		}, {
			field : 'endTm',title : '结束时间',align : 'center',width : 120,
			sortable : true,sorter : datasort,formatter:fmdate
		}
		] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
			
			$('.passToFail').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
//			$('.drop_message').linkbutton({
//				iconCls : 'icon-no',
//				plain : true
//			});
		}
	});	
}
//查询已审核
function finishseachKaoShiByParam(){
	//考试名称
	var ksname1=$("#newkaoshiName").val();
	
	//考试分类id
//	var mkscname1=$("#finishSearchKaoShiFenLei").next().find(".textbox-value").val();
	var mkscname1=finishclassifyids;
	//考试用户
	var userName1=$("#newuserName").val();
	$('#finishAuditList').datagrid('load', {
		signupFlag:1,
		ksname:ksname1,
		mkscname:mkscname1,
		userName:userName1
	});
}
//操作已审核信息，变为未审核
function fmup(value, rowData, rowIndex) {
	var id = rowData.id;
	var str="<a onclick='toShenHeFail1("+ id+ ")' style= 'border: 1px solid #0C0C0C;background: #F5F1EC;' class='passToFail'>不通过</a>";
	return str;
}
//通过审核变成未通过
function toShenHeFail1(id){
	$.messager.confirm('审核提示', '确定要变为不通过吗?', function(r) {
		if (r) {
			$.post(baseUrl + '/admin/T090/toAuditsFail.html', {
				id : id
			} ,function(data) {
				if (data > 0) {
					msgShow('审核不通过！');
					reloadGrid2();
					reloadGrid3();
				} else {
					msgShow('审核失败，请稍后重试');
					reloadGrid2();
					reloadGrid3();
				}
			}, "json");
		}
	});	
}
//审核通过选项卡中 批量不通过
function auditSomePassToFail(){
	$.messager.confirm('审核提示', '确定要拒绝所选报名?', function(r) {
		if (r) {
			newSomeToFail();
		}
	});
}
function newSomeToFail(){
	var items_id = new Array();
	var items = $('#finishAuditList').datagrid('getSelections');
	if (items.length <=0){
		msgShow("请选择要审核的报名！");
		return;
	}
	for (var i=0; i<items.length; i++) {
		items_id.push(items[i].id);
	}
	$.post(baseUrl + "/admin/T090/auditsSomeToFail.html",{
		mid : items_id
	},
	function(data){
		if(data>0){
			msgShow('审核成功！');
			reloadGrid2();
			reloadGrid3();		
		}
	},"json");
}
//加载审核未通过
function creatGrid3() {
	$('#finishAuditListFail').datagrid({
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
		url : baseUrl + '/admin/T090/showAllAudits.html',
		queryParams: {"signupFlag": 2},
		toolbar : '#tbar3',
		frozenColumns : [ [ {
			field : 'select',title : '选择',width : 50,checkbox : true
		} ] ],
		columns : [ [ 
		{
			field : 'ksname',title : '考试名称',width : 100,rowspan:2,halign: 'center',
			sortable : true,sorter : datasort,align : 'left'
		}, {
			field : 'mkscname',title : '考试分类',width : 80,rowspan:2,halign: 'center',
			sortable : true,sorter : datasort,align : 'left'
		}, {
			field : '',title : '考试日期',width : 240,colspan:2,
			sortable : true,sorter : datasort,align : 'center'
		}, {	
			field : 'totalsorce',title : '考试总分',width : 80,rowspan:2,
			sortable : true,sorter : datasort,align : 'right'
		},{
			field : 'groupName',title : '用户组',width : 80,rowspan:2,halign: 'center',
			sortable : true,sorter : datasort,align : 'left'
		},{
			field : 'realName',title : '真实姓名',width : 80,rowspan:2,halign: 'center',
			sortable : true,sorter : datasort,align : 'left'				
		},{
			field : 'userName',title : '用户登录名',width : 80,rowspan:2,halign: 'center',
			sortable : true,sorter : datasort,align : 'left'
		}, {
			field : 'signupTm',title : '报名时间',width : 120,
			rowspan:2,sortable : true,sorter : datasort,align : 'center',
			formatter:fmdate
		}, 
		{
			field : 'manage',title : '状态设置',align : 'center',width : 120,
			rowspan:2,sortable : true,sorter : datasort
			,formatter : fmup3
		} 
//		, 
//		{
//			field : 'manage1',title : '操作',align : 'center',width : 120,
//			rowspan:2,sortable : true,sorter : datasort
//			,formatter : del
//		} 
		],[
		{
			field : 'startTm',title : '开始时间',width : 120,
			sortable : true,sorter : datasort,align : 'center',
			formatter:fmdate
		}, {
			field : 'endTm',title : '结束时间',align : 'center',width : 120,
			sortable : true,sorter : datasort,formatter:fmdate
		}
		] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
			
			$('.startaudit_usersFail').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
//			$('.drop_message').linkbutton({
//				iconCls : 'icon-no',
//				plain : true
//			});
		}
	});	
}
//查询审核未通过
function finishseachKaoShiByParamFail(){
	//考试名称
	var ksname=$("#newkaoshiNameFail").val();
	//考试分类id
//	var mkscname=$("#finishSearchKaoShiFenLeiFail").next().find(".textbox-value").val();
	var mkscname=nofinishclassifyids;
	//考试用户
	var userName=$("#newuserNameFail").val();
	$('#finishAuditListFail').datagrid('load', {
		signupFlag:2,
		ksname:ksname,
		mkscname:mkscname,
		userName:userName
	});
}
//操作未审核信息，变为已审核
function fmup3(value, rowData, rowIndex){
	var id = rowData.id;
	var str="<a onclick='toShenHePass1("+ id+ ")' style= 'border: 1px solid #0C0C0C;background: #F5F1EC;' class='startaudit_usersFail'>通过</a>";
	return str;
}
//function del(value, rowData, rowIndex) {
//	var id = rowData.id;
//	var str = "<a onclick='delMessageById("+ id+ ");' class='drop_message' >删除</a>";
//	return str;
//}
function delMessageById(mId) {
	$.messager.confirm('删除提示', '确定要删除这条报名信息?', function(r) {
		if (r) {
			$.post(baseUrl + '/admin/T090/deleteAuditById.html', {
				id : mId
			}, function(data) {
				if (data > 0) {
					msgShow('删除成功');
					reloadGrid3();
					reloadGrid2();
					reloadGrid1();
				} else {
					msgShow('删除失败，请稍后重试');
					reloadGrid3();
				}
			}, "json");
		}
	});
}
function toShenHePass1(id){
	$.messager.confirm('审核提示', '确定要变成通过吗?', function(r) {
		if (r) {
			$.post(baseUrl + '/admin/T090/toAuditsPass.html', {
				id : id
			} ,function(data) {
				if (data > 0) {
					msgShow('审核通过！');
					reloadGrid3();
					reloadGrid2();
				} else {
					msgShow('审核失败，请稍后重试');
					reloadGrid3();
					reloadGrid2();
				}
			}, "json");
		}
	});	
}
//未通过选项卡中 批量通过
function auditSomeFailToPass(){
	$.messager.confirm('审核提示', '确定要通过所选报名?', function(r) {
		if (r) {
			newSomeToPass();
		}
	});
}
function newSomeToPass(){
	var items_id = new Array();
	var items = $('#finishAuditListFail').datagrid('getSelections');
	if (items.length <=0){
		msgShow("请选择要审核的报名！");
		return;
	}
	for (var i=0; i<items.length; i++){
		items_id.push(items[i].id);
	}
	$.post(baseUrl + '/admin/T090/auditsSomeToPass.html',{
		mid : items_id
	},
	function(data){
		if(data>0){
			msgShow('审核成功！');
			reloadGrid2();
			reloadGrid3();		
		}
	},"json");
}
//排序
function datasort(a,b){
	return (a > b ? 1 : -1);
}
function ksTime(value, rowData, rowIndex){
	return fmtLongDate(new Date(value))+"~"+fmtLongDate(new Date(rowData.endTm));
}
// 日期转换
function fmdate(value, rowData, rowIndex) {
	// fmtLongDate--common.js
	return fmtLongDate(new Date(value));
}
// 刷新未审核列表
function reloadGrid1() {
	$('#auditList').datagrid('clearSelections');
	$('#auditList').datagrid('reload');
}
//刷新已通过列表
function reloadGrid2() {
	$('#finishAuditList').datagrid('clearSelections');
	$('#finishAuditList').datagrid('reload');
}
//刷新未通过列表
function reloadGrid3() {
	$('#finishAuditListFail').datagrid('clearSelections');
	$('#finishAuditListFail').datagrid('reload');
}