$(function() {
	creatGrid();
});
/**
 * easyUi dataGrid注册方式说明，防止二次渲染
 * class注册方式一般是为了初始化属性，js方式则属性和事件都可初始化
 * 但是不管是class方式还是js方式注册组件，每次注册，只要被设置过url属性就会做请求。
 * 所以在不可避免要使用js方式注册的情况下，索性就不要使用class方式注册了。
 */
function creatGrid() {
	$('#itemlist').datagrid({
		fit: true,//设置为true时铺满它所在的容器.
		fitColumns:true,//设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap: false,//设置为true，当数据长度超出列宽时将会自动截取。
		striped: true,//设置为true将交替显示行背景。
		collapsible: true,//定义是否显示可折叠按钮。
		singleSelect: false,//设置为true将只允许选择一行。
		border:false,
		remoteSort: false,//定义是否通过远程服务器对数据排序。
		rownumbers : true,//行号
		url:'findRoles.html',
		toolbar: '#tbar',
		columns: [[{field:'name',title:'角色名',width:80,halign: 'center',align:'left',sortable : true,sorter : datasort},
			{field:'functionName',title:'权限',width:180,halign: 'center',align:'left'},
			{field:'sortBtn',title:'排序',width:80,halign: 'center',align:'center',formatter: sort},
			{field:'manage',title: '操作',halign: 'center', align: 'center', width: 80, formatter: operate}
		]],
		//当数据载入成功时触发。
		onLoadSuccess : function(data) {
			$('.edit_role').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
			$('.drop_role').linkbutton({
				iconCls : 'icon-no',
				plain : true
			});
			$('.copy_role').linkbutton({
				iconCls : 'icon-copy',
				plain : true
			});
			$('.move_first').linkbutton({
				iconCls : 'icon-top',
				plain : true
			});
			$('.move_up').linkbutton({
				iconCls : 'icon-up',
				plain : true
			});
			$('.move_down').linkbutton({
				iconCls : 'icon-down',
				plain : true
			});
			$('.move_last').linkbutton({
				iconCls : 'icon-bottom',
				plain : true
			});
		}
	});
}
//排序
function datasort(a, b) {
	return (a > b ? 1 : -1);
}
function moveUpSort(id){
		var thisTr = $("#move_up"+id).parent().parent().parent();
		var prevTr = thisTr.prev();
		var param = {"roleid":id};
		$.ajax({
			url : "moveUpSort.html",
			async : false,
			type : 'post',
			data : param,
			dataType : 'json',
			success : function(data){
				var tmp =prevTr.clone();
				prevTr.remove();
				thisTr.after(tmp);
				reloadGrid();
			}
		});
}
function moveDownSort(id){
	var thisTr = $("#move_down"+id).parent().parent().parent();
	var prevTr = thisTr.next();
	var param = {"roleid":id};
	$.ajax({
		url : "moveDownSort.html",
		async : false,
		type : 'post',
		data : param,
		dataType : 'json',
		success : function(data){
			var tmp =prevTr.clone();
			prevTr.remove();
			thisTr.before(tmp);
			reloadGrid();
		}
	});
}
function moveFirstSort(id){
		var thisTr = $("#move_first"+id).parent().parent().parent();
		var firstTr = thisTr.parent().find("tr:first");
		var param = {"roleid":id};
		$.ajax({
			url : "moveFirstSort.html",
			async : false,
			type : 'post',
			data : param,
			dataType : 'json',
			success : function(data){
				if(data!='已经是第一个了'){
					var tmp = thisTr.clone();
					thisTr.remove();
					firstTr.before(tmp);
					reloadGrid();
				}
			}
		});
	
}
function moveLastSort(id){
	var thisTr = $("#move_last"+id).parent().parent().parent();
	var lastTr = thisTr.parent().find("tr:last");
	var param = {"roleid":id};
	$.ajax({
		url : "moveLastSort.html",
		async : false,
		type : 'post',
		data : param,
		dataType : 'json',
		success : function(data){
			var tmp = thisTr.clone();
			thisTr.remove();
			lastTr.after(tmp);
			reloadGrid();
		}
	});

}
//操作
function operate(value, rowData, rowIndex) {
	var id=rowData.roleid;
	var updOperate=0;
	var copyOperate=1;
	var returnStr="";
	if(id>2){
		returnStr="<a onclick='updRoleInfo("+id+","+updOperate+");'  class='edit_role'>编辑</a><a onclick='delRolerMessage("+id+");' class='drop_role' >删除</a><a onclick='javascript:updRoleInfo("+id+","+copyOperate+");' class='copy_role' >复制</a>";
	}
	return returnStr;
}
function sort(value,rowData,rowIndex){
	var roleId=rowData.roleid;
	return "<a onclick='moveFirstSort("+roleId+");' title='置顶' id='move_first"+roleId+"' class='move_first'></a><a onclick='moveUpSort("+roleId+");' title='上移' id='move_up"+roleId+"' class='move_up'></a><a onclick='moveDownSort("+roleId+");' title='下移' " +
			"id='move_down"+roleId+"' class='move_down'></a><a onclick='moveLastSort("+roleId+");' title='置底' id='move_last"+roleId+"' class='move_last'></a>";
}
// 刷新
function reloadGrid() {
	$('#itemlist').datagrid('clearSelections');
	$('#itemlist').datagrid('reload');
}
//删除用户提示
function delRolerMessage(roleId) {
	$.messager.confirm('删除提示', '确定要删除该角色吗?', function(r) {
		if (r) {
			delRole(roleId);
		}
	});
}
// 删除用户
function delRole(roleId) {
	$.post("delRole.html", {
		roleId : roleId
	}, function(data) {
		if (data > 0) {
			msgShow("删除成功");
			reloadGrid();
		} else if (data == -1) {
			msgShow("用户中存在此角色,无法删除");
			reloadGrid();
		} else {
			msgShow("删除失败，请稍后重试");
			reloadGrid();
		}

	}, "json");
}
function addRoleInfo(){
	window.parent.openTab("添加角色", baseUrl + "/admin/U040/showAddRole.html");
}
function findRoles(){
	var roleName=$("#roleName").val();
	$('#itemlist').datagrid('load', {
		name: roleName  
	});
}
function updRoleInfo(id,operate){
	var titleLable="";
	
	if(operate==0){
		titleLable="编辑角色";
	}else{
		titleLable="复制角色";
	}
	window.parent.closeTabByTitle(titleLable);
	window.parent.openTab(titleLable, baseUrl + "/admin/U040/U040UpdRole.html?roleId="+id+"&&operate="+operate);
}
