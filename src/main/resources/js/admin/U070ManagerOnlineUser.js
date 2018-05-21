$(function(){
	// 加载查询列表
	creatGrid();
});
/**
 * easyUi dataGrid注册方式说明，防止二次渲染 class注册方式一般是为了初始化属性，js方式则属性和事件都可初始化
 * 但是不管是class方式还是js方式注册组件，每次注册，只要被设置过url属性就会做请求。
 * 所以在不可避免要使用js方式注册的情况下，索性就不要使用class方式注册了。
 */
function creatGrid() {
	$('#onlineUserList').datagrid({
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
		url : 'findOnlineUsers.html',
		toolbar : '#tbar',
		columns : [ [ {
			field : 'username',
			title : '用户名',
			width : 100,
			halign: 'center',
			align : 'left'
		}, {
			field : 'nickName',
			title : '用户昵称',
			width : 100,
			halign: 'center',
			align : 'left'
		}, {
			field : 'realName',
			title : '真实姓名',
			width : 80,
			halign: 'center',
			align : 'left'
		}, {
			field : 'gender',
			title : '性别',
			width : 40,
			halign: 'center',
			align : 'center'

		}, {
			field : 'regIp',
			title : '注册IP',
			width : 100,
			halign: 'center',
			align : 'center'

		}, {
			field : 'lastLoginIp',
			title : '登录IP',
			width : 100,
			halign: 'center',
			align : 'center'

		}, {
			field : 'loginCount',
			title : '登录次数',
			width : 50,
			halign: 'center',
			align : 'right'
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
			$('.forced').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
		}
	});
}
// 操作
function operate(value, rowData, rowIndex) {
	var userId = rowData.userId;
	return "<a href='javascript:forcedOffline("+userId+");' class='forced'>强制下线</a>";
}
//强制下线
function forcedOffline(userId){
	$.ajax({
		url:"forcedOffline.html",
		type: 'post',
		data:{"userId":userId,"msg":"forcedOffline"},
		dataType: 'json',
		success:function(data){
			if(data){
				alert("强制登出成功!");
				reload();
			}else{
				alert("强制登出失败!");
			}
		}
	});
}
// 刷新
function reload() {
	$('#onlineUserList').datagrid('clearSelections');
	$('#onlineUserList').datagrid('reload');
}
//查询
function find(){
	var userName = $("#userName").val();
	$('#onlineUserList').datagrid('load', {
		userName : userName
	});
}