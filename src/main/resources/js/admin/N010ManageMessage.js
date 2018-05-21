$(function() {
//	creatGrid();
	creatMsgGrid();
//	$('#updateWin').window({
//		width : 830,
//		height : 440,
//		draggable : false,
//		resizable : false,
//		collapsible : false,
//		minimizable : true,
//		maximizable : true,
//		closable : true,
//		closed : true,
//		inline : true,
//		title : '编辑公告',
//		modal : true
//	});
//	$('#messagetb').textbox({    
//	    iconAlign:'left',
//	    width : 900,
//	    height : 200,
//	    multiline:true,
//	    prompt : '请输入公告内容',
//	});
	creatUserGrid();
	$('#selectchoseUser').window({
		width : 900,
		height :400,
		draggable : false,
		resizable : false,
		collapsible : false,
		minimizable : true,
		maximizable : true,
		closable : true,
		closed : true,
		inline : true,
		title : '查找用户',
		modal : true
	});
	$('#userGroup').combotree({
		multiple : true,
		checkbox : true,
		lines : true,
		animate : false,
		cascadeCheck : false,
		editable : true,
		url : baseUrl + '/admin/U030/findGroupAddALL.html',
		required : false,
		onHidePanel:function(){
			var ids=$('#userGroup').combotree("getValues");
			$("#groupids").val(ids);
		},
		onCheck : checkTreeNode
	});
	// 实现选中子节点不关联父节点，选中父节点选中子节点
	function checkTreeNode(node, checked) {
		if (checked) {
			if (node.children != null) {
				var children = $('#userGroup').combotree('tree').tree('getChildren', node.target);
				for ( var i = 0; i < children.length; i++) {
					$('#userGroup').combotree('tree').tree('check', children[i].target);
				}
			}
		}
	}
	//保存公告
	$('#saveform').form({
		url : baseUrl + "/admin/N010/addMtaSysMessage.html",
		onSubmit : function() {
			return $('#saveform').form("validate");
		},
		success : function(data) {
			if (data > 0) {
				// 跳转到公告管理
				$("#tt").tabs("select", 1);
				$('#itemlist').datagrid('reload');
				$("#msgtitle").val('');
				UE.getEditor('container').setContent("");
			} 
		}
	});
	//编辑已发布的公告，修改内容和标题
	$('#editForm').form({
		url : baseUrl + "/admin/N010/updMessage.html",
		onSubmit : function() {
			return $('#editForm').form("validate");
		},
		success : function(data) {
			$("#tt").tabs("select", 1);
			$('#itemlist').datagrid('reload');
			$('#updateWin').window('close');
		}
	});
	
	//查找用户发送信息
	$('#user_name').click(function(){
		//打开窗口
		$('#selectchoseUser').window('open');
	});
	//给用户发送消息
	$('#savemessageform').form({
		url :baseUrl + "/admin/N010/sendMessage.html",
		onSubmit : function() {
			return $('#savemessageform').form("validate");
		},
		success : function(data) {
			if (data > 0) {
				$("#user_name").val('');
				$("#userGroup").combotree('clear');
//				$("#userGroup").combotree('setValue','');
				UE.getEditor('editorcontent').setContent("");
				$("#tt").tabs("select", 0);
				$("#groupids").val("");
				$('#messageList').datagrid('reload');
			}else if(data==-1){
				$.messager.alert('提示', "请填写收件人", 'info');
			}else if(data==-2){
				$.messager.alert('提示', "发送失败！", 'info');
			}else{
				$.messager.alert('提示', "请填写消息内容！", 'info');
			}
		}
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
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : true,// 分页组件是否显示
		pageNumber : 1,// 起始页
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50 ],// 每页显示多少行
		rownumbers : true,// 行号
		url : baseUrl + "/admin/N010/showAllMessage.html",
		// queryParams:{},//查询参数
		// queryParams:data,
		toolbar : '#tbar',
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			checkbox : true
		} ] ],
		columns : [ [ {
			field : 'msgTitle',
			title : '公告标题',
			width : 120,
			sortable : true,
			sorter : datasort,
			align : 'left',
			halign: 'center'
		}, {
			field : 'msgContent',
			title : '公告内容',
			width : 280,
			sortable : true,
			sorter : datasort,
			align : 'left',
			halign: 'center'
		}, {
			field : 'sendTime',
			title : '发布时间',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'center',
			formatter : fmdate
		}, 
		{
			field : 'manage',
			title : '操作',
			align : 'center',
			width : 120,
			sortable : true,
			sorter : datasort,
			formatter : fmup
		} ] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
			$('.edit_message').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
			$('.drop_message').linkbutton({
				iconCls : 'icon-no',
				plain : true
			});
		}
	});
}
function creatMsgGrid() {
	$('#messageList').datagrid({
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
		pageList : [ 10, 20, 50,100,200,500 ],// 每页显示多少行
		rownumbers : true,// 行号
		url : baseUrl + "/admin/N010/showAllMsg.html",
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			checkbox : true
		} ] ],
		columns : [ [  {
			field : 'recipientName',
			title : '接收人',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left',
			halign: 'center'
		},
		{
			field : 'msgContent',
			title : '消息内容',
			width : 180,
			sortable : true,
			sorter : datasort,
			align : 'left',
			halign: 'center'
		}, {
			field : 'sendTime',
			title : '发送时间',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'center'
		}, 
		{
			field : 'manage',
			title : '操作',
			align : 'center',
			width : 120,
			sortable : true,
			sorter : datasort,
			formatter : fmMsgLog
		} ] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
			$('.del_msg_log').linkbutton({
				iconCls : 'icon-no',
				plain : true
			});
		}
	});
}
function creatUserGrid() {
	$('#userlist').datagrid({
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
		url : baseUrl + '/admin/U010/findAllUserForManager.html',
		toolbar : '#ubar',
		
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			checkbox : true
		} ] ],
		columns : [ [ {
			field : 'username',
			title : '用户名',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'center'
		}, {
			field : 'realname',
			title : '真实姓名',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'center'
		}, {
			field : 'nickname',
			title : '昵称',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'center'
		},{
			field : 'rolename',
			title : '角色',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'center'
		}, {
			field : 'groupname',
			title : '所属用户组',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'center'
		}
		] ]
	});
}
function datasort(a, b) {
	return (a > b ? 1 : -1);
}
function seachMessageByParam(){
	var messageName=$("#msgtitleCondition").val();
	var sendTimeStart=$("#sendTimeStartCondition").next().find(".textbox-value").val();
	var sendTimeEnd=$("#sendTimeEndCondition").next().find(".textbox-value").val();
	$('#itemlist').datagrid('load', {
		msgtitle: messageName,
		sendTimeStart:sendTimeStart,
		sendTimeEnd:sendTimeEnd
	});
}
function seachMsgLogByParam(){
	var messageName=$("#recipientName").val();
	var sendTimeStart=$("#sendTimeStart").next().find(".textbox-value").val();
	var sendTimeEnd=$("#sendTimeEnd").next().find(".textbox-value").val();
	$('#messageList').datagrid('load', {
		recipientName: messageName,
		sendTimeStart:sendTimeStart,
		sendTimeEnd:sendTimeEnd
	});
}
function seachUser(){
	var userName=$("#msguserCondition").val();
	var userReal=$("#realuser").val();
	$('#userlist').datagrid('load', {
		username:userName,
		realname:userReal
	});
}
// 打开编辑窗口
function openUpdWin(id) {
	$.post(baseUrl + "/admin/N010/findUpdMessage.html", {
		id: id
	}, 
	function(data) {
		// 为更新form赋值
		$("#msgid").val(data.id);
		$("#msgtitle1").val(data.msgtitle);
		msgContentEditor.setContent(data.msgcontent);
	}, "json");
	$('#updateWin').window('open');
}
function fmup(value, rowData, rowIndex) {
	var id = rowData.id;
	var str="<a onclick='openUpdWin("+ id+ ")' class='edit_message'>编辑</a>";
	str += "<a onclick='delMessageById("+ id+ ");' class='drop_message' >删除</a>";
	return str;
}
function fmMsgLog(value, rowData, rowIndex) {
	var id = rowData.id;
	var str="<a onclick='delMsgLogById("+ id+ ");' class='del_msg_log'>删除</a>";
	return str;
}
// 日期转换
function fmdate(value, rowData, rowIndex) {
	// fmtLongDate--common.js
	return fmtLongDate(new Date(value));
}
// 刷新
function reloadGrid() {
	$('#itemlist').datagrid('clearSelections');
	$('#itemlist').datagrid('reload');
}

//刷新
function reloadMsgLogGrid() {
	$('#messageList').datagrid('clearSelections');
	$('#messageList').datagrid('reload');
}

//保存发布公告
function submitForm(){
	$('#saveform').submit();
	return false;
}
//保存消息
function submitpersonForm(){
	$('#savemessageform').submit();
	return false;
}
//更新公告
function editForm(){
	$('#editForm').submit();
}

//选择发送用户，弹出提示信息
function submitUserForm() {
	$.messager.confirm('选择用户', '确定选择这些用户?', function(r) {
		if (r) {
			submitUser();
			$('#selectchoseUser').window('close');
		}
	});
}
// 选择用户
function submitUser() {
	var items_uid = new Array();
	var items_name=new Array();
	var items = $('#userlist').datagrid('getSelections');
	if (items.length <= 0) {
		msgShow('请选择要添加的用户');
		return;
	}
	// 获取选中用户的ID和姓名，并组成集合
	for ( var i = 0; i < items.length; i++) {
		items_uid.push(items[i].userid);
		items_name.push(items[i].username);
	}
	$('#user_name').val(items_name);
	$('#userId').val(items_uid);
	
	
	return items_uid;
}
// 删除公告提示
function delMessage() {
	$.messager.confirm('删除提示', '确定要删除选中公告?', function(r) {
		if (r) {
			delMsg();
		}
	});
}
// 删除公告
function delMsg() {
	var items_id = new Array();
	var items = $('#itemlist').datagrid('getSelections');
	if (items.length <= 0) {
		msgShow('请选择要删除的公告');
		return;
	}
	// 获取选中消息的ID，并组成集合
	for ( var i = 0; i < items.length; i++) {
		items_id.push(items[i].id);
	}

	$.post(baseUrl + "/admin/N010/deleteMtaSysMessage.html", {
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
//单个删除
function delMessageById(mId) {
	$.messager.confirm('删除提示', '确定要删除这条公告?', function(r) {
		if (r) {
			$.post(baseUrl + "/admin/N010/deleteMessage.html", {
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
//删除消息日志
function delMsgLog() {
	var items_id = new Array();
	var items = $('#messageList').datagrid('getSelections');
	if (items.length <= 0) {
		msgShow('请选择要删除的消息');
		return;
	}
	// 获取选中消息的ID，并组成集合
	for ( var i = 0; i < items.length; i++) {
		items_id.push(items[i].id);
	}

	$.post(baseUrl + "/admin/N010/delMsgLog.html", {
		mid : items_id
	}, function(data) {
		if (data > 0) {
			msgShow('删除成功');
			reloadMsgLogGrid();
		} else {
			msgShow('删除失败，请稍后重试');
			reloadMsgLogGrid();
		}
	}, "json");
}
//单个删除
function delMsgLogById(mId) {
	$.messager.confirm('删除提示', '确定要删除这条消息?', function(r) {
		if (r) {
			$.post(baseUrl + "/admin/N010/delMsgLogById.html", {
				id : mId
			}, function(data) {
				if (data > 0) {
					msgShow('删除成功');
					reloadMsgLogGrid();
				} else {
					msgShow('删除失败，请稍后重试');
					reloadMsgLogGrid();
				}
			}, "json");
		}
	});
}