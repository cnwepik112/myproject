var groupData;
var roleData;
$(function() {
	creatGrid();
	createTree();
	//本地上传加载上传的FileInput
	$('#uploadIconFile').filebox({
		buttonText: '选择头像',
		onChange: function (newValue, oldValue) {
				var validateType=validateFileType(newValue);
				if(!validateType){
					msgShow("请上传gif、jpg、png格式的图片");
					return;
				}
				$('#uploadIconForm').submit();
			}
	});
	$('#updateWin').window({
		width : 900,
		height : 500,
		draggable : true,
		resizable : true,
		collapsible : false,
		minimizable : true,
		maximizable : true,
		closable : true,
		closed : true,
		inline : true,
		title : '编辑用户',
		modal : true,
		onClose:function(){
			$('#updUserFrom').form("clear");
//			$('#userBirthday').datebox("clear");
//			$('#userBirthday').datebox("setValue","");
		}
	});
	$('#updRoleDia').dialog({
		// iconCls:'icon-save',
		title : '编辑角色',
		closed : true,
		modal : true,
		shadow : false
	});
	$('#updUserIconWin').dialog({
		// iconCls:'icon-save',
		title : '编辑头像',
		closed : true,
		modal : true,
		shadow : false
	});
	$('#updGroupDia').dialog({
		// iconCls:'icon-save',
		title : '编辑用户组',
		closed : true,
		modal : true,
		shadow : false
	});
	$('#updGroupIdsDia').dialog({
		// iconCls:'icon-save',
		title : '用户授权',
		closed : true,
		modal : true,
		shadow : false,
		onClose:function(){
			$('#groupidtree').tree('reload');
		}
	});
	$('#updUserRole').combobox({
		url : baseUrl + '/admin/U040/findALLRole.html',
		editable : false,
		required : true,
		valueField : 'roleid',
		textField : 'name'
	});
	$('#userPosition').combobox({
		url : baseUrl +'/admin/U060/findPosition.html',
		editable : false,
		required : false,
		valueField : 'positionid',
		textField : 'name'
	});
	$('#updUserGroup').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		url : baseUrl + '/admin/U030/findAllGroup.html',
		required : true
	});
//	$('#searchUserRole').combobox({
//		url : baseUrl + '/admin/U040/findRoleAddAll.html',
//		editable : true,
//		required : false,
//		//panelHeight : 60,
//		valueField : 'roleid',
//		textField : 'name'
//	});
	$('#searchUserGroup').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
//		panelHeight:'200',
//		panelWidth:'auto',
		panelMinWidth:200,
		panelMaxWidth:300,
		panelMaxHeight:200,
		animate : true,
		editable : true,
		url : baseUrl + '/admin/U030/findGroupAddALL.html',
		required : false,
		onHidePanel : getChildren
//		onShowPanel:function(){
//			$('#searchUserGroup').combotree('panel').panel({bodyCls:'panel_body_class'});
//		}
	});
	$('#excelForm').form({
		url : "exportUserExcel.html"
		// success : function(data) {
			// $.messager.alert('提示',data,'info');
		// }
	});
	// 上传课程封面Form绑定
	$('#uploadIconForm').form({
		url : baseUrl + '/admin/U010/uploadPeopleImg.html',
		onSubmit : function() {
			return $('#uploadIconForm').form("validate");
		},
		success : function(data) {
			var obj = eval('(' + data + ')');
			if(obj.status=="success"){
				//上传成功
				$("#userIcon").val(obj.url);
				$("#iconpic").attr("src",obj.url);
				//msgShow("上传成功");

			}else if(obj.status=="typeError"){

				msgShow("上传类型错误");

			}else{
				msgShow("上传异常");
			}
		}
	});
});
// 创建tree
function createTree() {
	$('#groupidtree').tree({
		checkbox : true,
		lines : true,
		animate : false,
		cascadeCheck : false,
		url : baseUrl + '/admin/U030/findAllGroup.html',
		onLoadSuccess : function() {
			$('#groupidtree').tree('collapseAll');
		},
		onCheck : checkTreeNode
	});
}
// 实现选中子节点不关联父节点，选中父节点选中子节点
function checkTreeNode(node, checked) {
	if (checked) {
		if (node.children != null) {
			var children = $('#groupidtree').tree('getChildren', node.target);
			for ( var i = 0; i < children.length; i++) {
				$('#groupidtree').tree('check', children[i].target);
			}
		}
	}
}
/**
 * easyUi dataGrid注册方式说明，防止二次渲染 class注册方式一般是为了初始化属性，js方式则属性和事件都可初始化
 * 但是不管是class方式还是js方式注册组件，每次注册，只要被设置过url属性就会做请求。
 * 所以在不可避免要使用js方式注册的情况下，索性就不要使用class方式注册了。
 */
function creatGrid() {
	$('#itemlist')
			.datagrid(
					{
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
						pageList : [ 10, 20, 50,100,200,500 ],// 每页显示多少行
						rownumbers : true,// 行号
						url : 'findAllUserForManager.html',
						// queryParams:{},//查询参数
						// queryParams:data,
						toolbar : '#tbar',
						frozenColumns : [ [ {
							field : 'select',
							title : '选择',
							checkbox : true
						} ] ],
						columns : [ [ {
							field : 'username',
							title : '用户名',
							width : 100,
							sortable : true,
							sorter : datasort,
							align : 'left'
						}, {
							field : 'realname',
							title : '真实姓名',
							width : 90,
							sortable : true,
							sorter : datasort,
							align : 'left'
						}, {
							field : 'gender',
							title : '性别',
							width : 35,
							sortable : true,
							sorter : datasort,
							align : 'left',
							formatter:fmGender
						}, {
							field : 'groupname',
							title : '所属用户组',
							width : 100,
							align : 'left',
							sortable : true,
							sorter : datasort,
							formatter : fmGroup
						}, {
							field : 'credit',
							title : '学分',
							width : 35,
							align : 'right',
							sortable : true,
							sorter : datasort
						}, {
							field : 'positionid',
							title : '职位',
							width : 50,
							align : 'left',
							sortable : true,
							sorter : datasort,
							formatter : fmPos
						}, {
							field : 'roleid',
							title : '角色',
							width : 50,
							align : 'left',
							sortable : true,
							sorter : datasort,
							formatter : fmRole

						}, {
							field : 'groupids',
							title : '管理范围',
							width : 80,
							align : 'left',
							sortable : true,
							sorter : datasort,
							formatter : fmGroupIds
						}, {
							field : 'status',
							title : '用户状态',
							width : 40,
							align : 'left',
							sortable : true,
							sorter : datasort,
							styler : cellStylerStatus,
							formatter : fmStatus
						}, {
							field : 'review',
							title : '审核状态',
							width : 40,
							align : 'left',
							sortable : true,
							sorter : datasort,
							styler : cellStylerReview,
							formatter : fmReview
						},
						// {
						// field : 'insdate',
						// title : '注册时间',
						// width : 100,
						// align : 'right',
						// formatter : fmdate
						// },
						// {
						// field : 'regip',
						// title : '注册IP',
						// width : 100,
						// align : 'right'
						// },
						{
							field : 'manage',
							title : '操作',
							align : 'center',
							width : 150,
							formatter : fmup
						} ] ],
						view : detailview,
						detailFormatter : function(index, row) {
							return '<div id="userinfo_'
									+ index
									+ '" style="height:80px;padding:5px;"></div>';
						},
						onExpandRow : function(index, row) {
							var sex = "男";
							if (!row.gender) {
								sex = "女";
							}
							var pic =baseUrl+"/resources/mta/images/my_pic01.png";
							if(row.icon !=null){
								pic = row.icon;
							}
							var table = "<table width='100%' border='0' cellspacing='0' cellpadding='0'>"
									+ "<tr height='18px'><td colspan='6' style='border:0;background: #c3d9e0'><sapn style='font-size:14px;font-weight:bold;'>详细信息</span></td></tr>"
									+ "<tr height='18px'><td width='10%' rowspan='3' style='border:0;font-size:12px !important;' align='center'><img src='"
									+pic
									+"' width='60' height='60'/></td><td width='18%' style='border:0;font-size:12px !important;'>用户名："
									+ row.username
									+ "</td><td width='18%' style='border:0;font-size:12px !important;'>真实姓名："
									+ row.realname
									+ "</td><td width='18%' style='border:0;font-size:12px !important;'>昵称："
									+ row.nickname
									+ "</td><td width='18%' style='border:0;font-size:12px !important;'>性别："
									+ sex
									+ "</td><td width='18%' style='border:0;font-size:12px !important;'>出生日期："
									+ fmbirthday(row.birthday, null, null)
									+ "</td></tr>"
									+ "<tr height='18px'><td style='border:0;font-size:12px !important;'>电话："
									+ row.tel
									+ "</td><td style='border:0;font-size:12px !important;'>邮箱："
									+ row.email
									+ "</td><td style='border:0;font-size:12px !important;'>学分："
									+ row.credit
									+ "</td><td style='border:0;font-size:12px !important;'>学历："
									+ row.examcard
									+"</td><td style='border:0;font-size:12px !important;'></td></tr>"
									+ "<tr height='18px'><td style='border:0;font-size:12px !important;'>注册时间："
									+ fmdate(row.insdate, null, null)
									+ "</td><td style='border:0;font-size:12px !important;'>更新时间："
									+ fmdate(row.upddate, null, null)
									+ "</td><td style='border:0;font-size:12px !important;'>最后一次登录时间："+ fmdate(row.lastlogindate, null, null)+"</td><td style='border:0;font-size:12px !important;'>&nbsp;</td><td style='border:0;'>&nbsp;</td></tr>"
									+

									"</table>";
							$("#userinfo_" + index).empty().append(table);
							$(this).datagrid('fixDetailRowHeight', index);
						},
						// 当数据载入成功时触发。
						onLoadSuccess : function(data) {
							
							$('.edit_user').linkbutton({
								iconCls : 'icon-edit',
								plain : true
							});$('.edit_user_photo').linkbutton({
								iconCls : 'icon-edit',
								plain : true
							});
							$('.drop_user').linkbutton({
								iconCls : 'icon-no',
								plain : true
							});
//							$('.review_user').linkbutton({
//								iconCls : 'icon-reload',
//								plain : true
//							});
//							$('.status_user').linkbutton({
//								iconCls : 'icon-reload',
//								plain : true
//							});
						}
					});

}

// 打开编辑窗口
function openUpdWin(id) {
	$.post("findUpdUser.html", {
		id : id
	}, function(data) {
		// 为更新form赋值
		$("#userid").val(data.userid);
		$("#username").val(data.username);
		$("#password").val(data.pwd);
		$("#realpass").val(data.pwd);
		$("#realname").val(data.realname);
		$("#examcard").val(data.examcard);
		$("#nickname").val(data.nickname);
		$("#idcard").val(data.idcard);
		$("#credit").val(data.credit);
		$("#tel").val(data.tel);
		$("#email").val(data.email);
		$("#positionid").val(data.positionid);
		//判断该用户是否有用户组
		if(data.groupid == null){
			$("#userGroup").combotree("setValue", "");
		}else{
			$("#userGroup").combotree("setValue", data.groupid);
		}
		$('#userRole').combobox("setValue", data.roleid);
		$('#userPosition').combobox("setValue", data.positionid);
		// 因为性别类型为boolean型，组织int型
		if (data.gender==true) {
			$('#radio1').click();
		} else if (data.gender == false){
			$('#radio2').click();
		}else{
			$('input[name=gender]').attr("checked",false);
		}

		// 判断是出生日期为空
		if (data.birthday != null) {
			// fmtShortDate -- common.js中
			var birthdayTime = fmtShortDate(new Date(data.birthday));
			$("#userBirthday").datebox("setValue", birthdayTime);
		}
	}, "json");
	$('#updateWin').window('open');
}
function fmPos(value, rowData, rowIndex) {
	return rowData.positionname;
}
function fmup(value, rowData, rowIndex) {
	var id = rowData.userid;
	
	var str = "<a onclick='openUpdIconWin(" + id + ")' class='edit_user_photo'>" +
		/*	"<i class='fa fa-pencil'></i>" +*/
			"编辑头像</a>";
	str += "<a onclick='openUpdWin(" + id + ")' class='edit_user'>" +
			/*"<i class='fa fa-pencil'></i>" +*/
			"编辑</a>";
	if (id != 1) {
		str += "<a onclick='delUserById(" + id + ");' class='drop_user' >" +
				/*"<i class='fa fa-close'></i>" +*/
				"删除</a>";
	}
	return str;
}
// 排序
function datasort(a, b) {
	return (a > b ? 1 : -1);
}
// 角色
function fmRole(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='updUserRole("
			+ value + "," + rowData.userid + ");'>" + rowData.rolename + "</a>";
}
//角色
function fmGender(value, rowData, rowIndex) {
	
	if(value == true){
		return "男";
	}else if(value == false){
		return "女";
	}
	return "";
}
// 用户组
function fmGroup(value, rowData, rowIndex) {
	if (value != null && value != '') {
		return "<a href='javascript:;' class='blue_color_a' onclick='updUserGroup("
				+ rowData.groupid
				+ ","
				+ rowData.userid
				+ ");'>"
				+ value
				+ "</a>";
	}
	return "";
}
// 用户组
function fmGroupIds(value, rowData, rowIndex) {

	return "<a href='javascript:;' class='blue_color_a' onclick='updUserGroupIds("
			+ rowData.userid + ");'>查看管理范围 </a>";
}
function fmbirthday(value, rowData, rowIndex){
	if (value != null && value != '') {
		return fmtShortDate(new Date(value));
	}
	return "";
}
// 日期转换
function fmdate(value, rowData, rowIndex) {
	// fmtLongDate--common.js
	if (value != null && value != '') {
		return fmtLongDate(new Date(value));
	}
	return "";
}
// 状态
function fmStatus(value, rowData, rowIndex) {
	if (rowData.userid != 1) {
		if (value == 0) {
			return "<a href='javascript:;' class='blue_color_a' onclick='statusUser(" + rowData.status + "," +rowData.userid
						+ ");'>已解禁</a>";
		} else {
			return "<a href='javascript:;' class='blue_color_a' onclick='statusUser(" + rowData.status + "," +rowData.userid
						+ ");'>禁用</a>";
		}
	}
	return "已解禁";
}
// 状态
function fmReview(value, rowData, rowIndex) {
	if (rowData.userid != 1) {
		if (value == 1) {
			return "<a href='javascript:;' class='blue_color_a' onclick='reviewUser(" + rowData.review + "," + rowData.userid
						+ ");'>已审核</a>";
		} else {
			return "<a href='javascript:;' class='blue_color_a' onclick='reviewUser(" + rowData.review + "," + rowData.userid
						+ ");'>未审核</a>";
		}
	}
	return "已审核";
}
// 用户状态如果为禁用则变色提醒
function cellStylerStatus(value, row, index) {
	if (value > 0) {
		return 'background-color:#FA8072;color:#fff;';
	}
}
// 用户审核状态如果为未审核则变色提醒
function cellStylerReview(value, row, index) {
	if (value <= 0 || !value) {
		return 'background-color:#FA8072;color:#fff;';
	}
}
// 刷新
function reloadGrid() {
	$('#itemlist').datagrid('clearSelections');
	$('#itemlist').datagrid('reload');
}
// 删除用户提示
function delUserMessage() {
	$.messager.confirm('删除提示', '确定要删除选中用户?', function(r) {
		if (r) {
			delUser();
		}else{
			$('#itemlist').datagrid('clearSelections');
		}
	});
}
//删除用户
function delUserById(userid) {
	var items_id = new Array();
	items_id.push(userid);
	$.messager.confirm('删除提示', '确定要删除选中用户?', function(r) {
		if (r) {
			$.post("updateUserDel.html", {
				uid : items_id
			}, function(data) {
				if (data > 0) {
					msgShow('删除成功!');
					reloadGrid();
				} else {
					msgShow('删除失败，请稍后重试');
					reloadGrid();
				}
			}, "json");
		}else{
			$('#itemlist').datagrid('clearSelections');
		}
	});
}
// 删除用户
function delUser() {
	var items_id = new Array();
	var items = $('#itemlist').datagrid('getSelections');
	if (items.length <= 0) {
		$.messager.alert('提示', '请选择要删除的用户', 'info');
		return;
	}
	// 获取选中用户的ID，并组成集合
	for ( var i = 0; i < items.length; i++) {
		items_id.push(items[i].userid);
	}
	$.post("updateUserDel.html", {
		uid : items_id
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
function addUserInfo() {
	window.parent.openTab("添加用户", "admin/U010/addUser.html");
}
// 审核、冻结用户
function reviewUser(type, uid) {
	var dataParam = {
		review : false,
		id : uid
	};
	if (!type) {
		dataParam.review = true;
	}
	var str="确定该用户状态改为“未审核”状态?";
	if(!type){
		str="确定该用户状态改为“审核”状态?";
	}
	$.messager.confirm('操作提示', str, function(r) {
		if (r) {
			$.post("updMtaSysUserReview.html", dataParam, function(data) {
				if (data == 0) {
					msgShow('操作失败，请稍后重试');
					return;
				}
				msgShow('操作成功!');
				$('#itemlist').datagrid('reload');
			}, "json");
		}
	});
}
// 解禁、禁用用户
function statusUser(type, uid) {
	var dataParam = {
		status : 1,
		id : uid
	};
	if (type == 1) {
		dataParam.status = 0;
	}
	var str="确定“禁用”该用户?";
	if(type == 1){
		str="确定“解禁”该用户?";
	}
	$.messager.confirm('操作提示', str, function(r) {
		if (r) {
			$.post("updMtaSysUserStatus.html", dataParam, function(data) {
				if (data == 0) {
					msgShow('操作失败，请稍后重试');
					return;
				}
				msgShow('操作成功!');
				$('#itemlist').datagrid('reload');
			}, "json");
		}
	});
}
// 打开编辑角色dialog
function updUserRole(id, uid) {
	$('#updRoleDia').dialog('open');
	$('#updUserRole').combobox('setValue', id);
	$('#userid').val(uid);
}
// 打开编辑用户组dialog
function updUserGroup(id, uid) {
	$('#updGroupDia').dialog('open');
	if(id ==null){
		
		$('#updUserGroup').combotree("setValue", "无用户组");
	}else{
		
		$('#updUserGroup').combotree("setValue", id);
	}
	$('#userid').val(uid);
}
// 打开编辑授权dialog
function updUserGroupIds(uid) {
	$('#userid').val(uid);
	$.post("findUserGroupByUserId.html", {
		uid : uid
	}, function(data) {
		$('#updGroupIdsDia').dialog({
			onBeforeOpen:function(){
				$('#groupidtree').tree('expandAll');
				if (data.groupid != null && data.groupid != '') {
					var ids = data.groupid.split(",");
					for ( var i = 0; i < ids.length; i++) {
						// 循环权限节点ID
						var gid = parseInt(ids[i]);
						var pnode = $('#groupidtree').tree('find', gid);
						if(pnode != null){
							$('#groupidtree').tree('check', pnode.target);
							var items=pnode.children;
							if(items!=null && items != 	undefined){
								var children = $('#groupidtree').tree('getChildren',pnode.target);
								for ( var j = 0; j < children.length; j++) {
									// 循环所有节点匹配权限ID
									var node = $('#groupidtree').tree('find', children[j].id);
									$('#groupidtree').tree('uncheck', node.target);
								}
							}
						}
					}
				}
			}
		});
		// 判断返回数据中权限ID集合是否为空
		$('#updGroupIdsDia').dialog("open");
		
	}, "json");
}
// 保存角色
function saveUserRole() {
	var roleid = $('#updUserRole').combobox('getValue');
	var userid = $('#userid').val();
	$.post("updUserRole.html", {
		uid : userid,
		rid : roleid
	}, function(data) {
		if (data == 0) {
			msgShow('操作失败，请稍后重试');
			return;
		}
		msgShow('操作成功!');
		$('#updRoleDia').dialog('close');
		$('#itemlist').datagrid('reload');
	}, "json");
}
// 保存用户组
function saveUserGroup() {
	var groupid = $('#updUserGroup').combotree("getValue");
	var userid = $('#userid').val();
	$.post("updUserGroup.html", {
		uid : userid,
		gid : groupid
	}, function(data) {
		if (data == 0) {
			msgShow('操作失败，请稍后重试!');
			return;
		}
		msgShow('操作成功!');
		$('#updGroupDia').dialog('close');
		$('#itemlist').datagrid('reload');
	}, "json");
}
// 保存权限
function saveUserGroupIds() {
	var userid = $('#userid').val();
	var items = $('#groupidtree').tree('getChecked');
	var ids = '';
	for ( var i = 0; i < items.length; i++) {
		if (i == 0) {
			ids += items[i].id;
		} else {
			ids += "," + items[i].id;
		}
	}
	$.post("addUserGroup.html", {
		uid : userid,
		gids : ids
	}, function(data) {
		if (data == 0) {
			msgShow('操作失败，请稍后重试!');
			return;
		}
		msgShow('操作成功!');
		$('#updGroupIdsDia').dialog('close');
		$('#itemlist').datagrid('reload');
	}, "json");
}




// 查询
function seachUserByParam() {
	var param = {
			username : '',
			realname : '',
			tel : '',
//			email : '',
			roleid : 0,
			groupid : 0
		};

	var search_username = $("#userLike").val();
	var search_realname = $("#realNameLike").val();
	var search_tel = $("#telLike").val();
//	var search_email = $("#emailLike").val();
//	var search_roleid = $('#searchUserRole').combobox('getValue');
//	var search_groupid = $('#searchUserGroup').combotree('getValue');
	var search_groupid = $('#groupids').val();
	
	param.username = search_username;
	param.realname = search_realname;
	param.tel = search_tel;
//	param.email = search_email;
//	param.roleid = search_roleid;
	param.groupid = search_groupid;
	
	$("#exusername").val(search_username);
	$("#exrealname").val(search_realname);
	$("#extel").val(search_tel);
//	$("#exemail").val(search_email);
//	$("#exroleid").val(search_roleid);
	$("#exgroupid").val(search_groupid);

	$('#itemlist').datagrid('load', param);
}
function reviewAllUser(){
	$.messager.confirm('提示', '确定要审核所有未审核用户?', function(r) {
		if (r) {
			$.post("reviewAllUser.html",function(data){
				if(data >= 0){
					msgShow('审核成功！');
					$('#itemlist').datagrid('reload');
					return;
				}
				msgShow('操作失败，请稍后重试！');
				
			},"json");
		}
	});
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
// 导出Excel
function exportExcel() {
	$('#excelForm').submit();
	return false;
}
function validateFileType(fileName){

	//获取文件的扩展名
	var dotNdx = fileName.lastIndexOf('.');

	//扩展名变成小写
	var exetendName = fileName.slice(dotNdx + 1).toLowerCase();

	//定义返回值
	var checkType=false;

	//判断类型
	checkType = exetendName=="png"||exetendName=="jpg"||exetendName=="gif";

	//返回文件类型的验证值
	return checkType;
}
function openUpdIconWin(id){
	$("#userid").val(id);
	$('#updUserIconWin').dialog('open');
}
function updateUserICON(){
	var dataParam={
		userid:$("#userid").val(),
		icon:$("#userIcon").val()
	};
	$.post(baseUrl + "/admin/U010/updIcon.html",dataParam,function(res){
		if(res > 0){
			msgShow('上传成功');
			$('#updUserIconWin').dialog('close');
			$('#itemlist').datagrid('reload');
		}else{
			msgShow('操作失败，请稍后重试！');
		}
	},"json");
}