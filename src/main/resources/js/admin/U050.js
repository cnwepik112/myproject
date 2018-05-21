var groupData;
var roleData;
$(function() {
	creatGrid();
	$('#addWin').window({
		width : 400,
		height : 550,
		draggable : false,
		resizable : false,
		collapsible : false,
		minimizable : true,
		maximizable : true,
		closable : true,
		closed : true,
		inline : true,
		title : '添加讲师',
		modal : true,
		onClose:function(){
			$(':input', '#addFrom').not(
			':button, :submit, :reset, :hidden').val('')
			.removeAttr('checked').removeAttr('selected');
			$("#birthday").datebox("clear");
		}
	});
	$('#updWin').window({
		width : 400,
		height : 550,
		draggable : false,
		resizable : false,
		collapsible : false,
		minimizable : true,
		maximizable : true,
		closable : true,
		closed : true,
		inline : true,
		title : '编辑讲师',
		modal : true
	});
	$('#addFrom').form({
		url : baseUrl + "/admin/U050/addMtaLecturer.html",
		onSubmit : function() {
			return $('#addFrom').form("validate");
		},
		success : function(data) {
			if (data > 0) {
				msgShow("添加讲师成功！");
				$('#addWin').window("close");
				$(':input', '#addFrom').not(
						':button, :submit, :reset, :hidden').val('')
						.removeAttr('checked').removeAttr('selected');
				$("#birthday").datebox("clear");
				$('#itemlist').datagrid("reload");
			} else {
				msgShow("<span style='color:red'>未知错误！请稍后重试！</span>");
			}
		}
	});
	$('#updFrom').form({
		url : baseUrl + "/admin/U050/updMtaLecturer.html",
		onSubmit : function() {
			return $('#updFrom').form("validate");
		},
		success : function(data) {
			if (data > 0) {
				msgShow("编辑讲师成功！");
				$('#updWin').window("close");
				$('#itemlist').datagrid("reload");
			} else {
				msgShow("<span style='color:red'>未知错误！请稍后重试！</span>");
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
		url : baseUrl + '/admin/U050/findLecturerByPage.html',
		toolbar : '#tbar',
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			checkbox : true
		} ] ],
		columns : [ [ {
			field : 'name',
			title : '姓名',
			width : 80,
			align : 'left'
		}, {
			field : 'birthday',
			title : '出生年月',
			width : 100,
			align : 'center',
			formatter : fmShortdate
		}, {
			field : 'gender',
			title : '性别',
			width : 80,
			align : 'left',
			formatter : fmSex	
		}, {
			field : 'level',
			title : '讲师级别',
			width : 80,
			align : 'left'
		}, {
			field : 'tel',
			title : '电话',
			width : 80,
			align : 'left'
		}, {
			field : 'email',
			title : '邮箱',
			width : 80,
			align : 'left'
		}, {
			field : 'insdate',
			title : '创建日期',
			width : 100,
			align : 'center',
			formatter : fmdate
		}, {
			field : 'manage',
			title : '操作',
			align : 'center',
			width : 150,
			formatter : fmup
		} ] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
			$('.edit_user').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
			$('.drop_user').linkbutton({
				iconCls : 'icon-no',
				plain : true
			});
		}
	});

}
function fmup(value, rowData, rowIndex) {
	var id = rowData.lecturerid;
	var str = "<a onclick='openUpdWin(" + id + ")' class='edit_user'>编辑</a>";
	str += "<a onclick='delLecturerById(" + id + ");' class='drop_user' >删除</a>";
	return str;
}
// 排序
function datasort(a, b) {
	return (a > b ? 1 : -1);
}
// 长日期转换
function fmdate(value, rowData, rowIndex) {
	// fmtLongDate--common.js
	if (value != null && value != '') {
		return fmtLongDate(new Date(value));
	}
	return "";
}
//短日期转换
function fmShortdate(value, rowData, rowIndex) {
	// fmtLongDate--common.js
	if (value != null && value != '') {
		return fmtShortDate(new Date(value));
	}
	return "";
}
function fmSex(value, rowData, rowIndex){
	if(value){
		return "男";
	}else if(!value){
		return "女";
	}
	return "未知";
}
// 刷新
function reloadGrid() {
	$('#itemlist').datagrid('clearSelections');
	$('#itemlist').datagrid('reload');
}
// 删除用户提示
function delLecturerMessage() {
	$.messager.confirm('删除提示', '确定要删除选中讲师?', function(r) {
		if (r) {
			delLecturer();
		}
	});
}
// 删除用户
function delLecturer() {
	var items_id = new Array();
	var items = $('#itemlist').datagrid('getSelections');
	if (items.length <= 0) {
		$.messager.alert('提示', '请选择要删除的讲师', 'info');
		return;
	}
	// 获取选中用户的ID，并组成集合
	for ( var i = 0; i < items.length; i++) {
		items_id.push(items[i].lecturerid);
	}
	$.post(baseUrl + '/admin/U050/delLecturerByid.html', {
		lid : items_id
	}, function(data) {
		if (data > 0) {
			msgShow("删除讲师成功！");
			reloadGrid();
		} else {
			msgShow("<span style='color:red'>删除失败，请稍后重试！</span>");
			reloadGrid();
		}
	}, "json");
}
//删除用户
function delLecturerById(id) {
	var items_id = new Array();
	items_id.push(id);
	$.messager.confirm('删除提示', '确定要删除选中讲师?', function(r) {
		if (r) {
			$.post(baseUrl + '/admin/U050/delLecturerByid.html', {
				lid : items_id
			}, function(data) {
				if (data > 0) {
					msgShow("删除讲师成功！");
					reloadGrid();
				} else {
					msgShow("<span style='color:red'>删除失败，请稍后重试！</span>");
					reloadGrid();
				}
			}, "json");
		}
	});
}

// 查询
function seachLecturerByParam() {
	var param = {
		name : '',
		tel : '',
		email : ''
	};

	var search_realname = $("#realNameLike").val();
	var search_tel = $("#telLike").val();
	var search_email = $("#emailLike").val();

	param.name = search_realname;
	param.tel = search_tel;
	param.email = search_email;

	$('#itemlist').datagrid('load', param);
}
function openAddWin() {
	$('#addWin').window('open');
}
//打开编辑窗口
function openUpdWin(id) {
	$.post(baseUrl + '/admin/U050/findUpdLecturer.html', {
		lid : id
	}, function(data) {
		// 为更新form赋值
		$("#updlecturerId").val(data.lecturerid);
		$("#updname").val(data.name);
		$("#updtel").val(data.tel);
		$("#updemail").val(data.email);
		$("#updlevel").val(data.level);
		$("#updbriefintroduction").val(data.briefintroduction);
		// 因为性别类型为boolean型，组织int型
		if (data.gender) {
			$('#updRadio1').click();
		} else {
			$('#updRadio2').click();
		}

		// 判断是出生日期为空
		if (data.birthday != null) {
			// fmtShortDate -- common.js中
			var birthdayTime = fmtShortDate(new Date(data.birthday));
			$("#updbirthday").datebox("setValue", birthdayTime);
		}
		$("#updname").focus();
	}, "json");
	$('#updWin').window('open');
	
}
// 提交form
function subAddForm() {
	$('#addFrom').submit();
	return false;
}
function closeAddWin(){
	$('#addWin').window('close');
}
function subUpdForm() {
	$('#updFrom').submit();
	return false;
}
function closeupdWin(){
	$('#updWin').window('close');
}