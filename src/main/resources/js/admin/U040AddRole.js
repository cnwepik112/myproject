$(function() {
	$('#addRoleForm').form({
		url : baseUrl + "/admin/U040/addRole.html",
		onSubmit : function() {
			return $('#addRoleForm').form("validate");
		},
		success : function(data) {
			if (data > 0) {
				$.messager.confirm('提示', '添加角色成功！', function(r) {
					if (r) {
						window.parent.closeTabByTitle("角色管理");
						window.parent.openTab("角色管理", baseUrl + "/admin/U040/ManageRole.html");
						window.parent.closeTabByTitle("添加角色");
					}
				});
			} else if (data == 0) {
				msgShow("请选择权限！");
			} else if (data == -1){
				msgShow("角色名已存在！");
			} else {
				msgShow("未知错误！请稍后重试");
			}
		}
	});
	$('#updRoleForm').form({
		url : "updRole.html",
		onSubmit : function() {
			return $("#updRoleForm").form("validate");
		},
		success : function(data) {
			if (data > 0) {
				$.messager.confirm('提示', '修改角色成功！', function(r) {
					if (r) {
						window.parent.closeTabByTitle("角色管理");
						window.parent.openTab("角色管理", baseUrl + "/admin/U040/ManageRole.html");
						window.parent.closeTabByTitle("编辑角色");
					}
				});
			} else if (data == 0) {
				msgShow("请选择权限！");
			} else {
				msgShow("未知错误！请稍后重试");
			}
		}
	});
});
// 提交form
function addForm() {
	$('#addRoleForm').submit();
	return false;
}

//提交form
function updForm() {
	$('#updRoleForm').submit();
	return false;
}
function quanxuan(obj){
    if($(obj).is(":checked")){
        $(obj).parents("fieldset").find("span input[type='checkbox']").prop("checked",true);
    }else{
        $(obj).parents("fieldset").find("span input[type='checkbox']").prop("checked",false);
    }
}