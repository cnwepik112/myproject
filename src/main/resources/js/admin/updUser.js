$(function() {
	$('#updUserFrom').form({
		url : "updMtaSysUser.html",
		onSubmit : function() {
			return $('#updUserFrom').form("validate");
		},
		success : function(data) {
			if (data > 0) {
				$.messager.alert('提示', '编辑用户成功！','info');
				$('#updateWin').window('close');
				$('#itemlist').datagrid('reload');
			
			} else {
				$.messager.alert('提示','未知错误！请稍后重试','info');
			}
		}
	});
	$('#userRole').combobox({   
	    url:baseUrl+'/admin/U040/findALLRole.html',
	    editable:false,
	    required:false,   
	    panelHeight:'auto',
	    valueField:'roleid',   
	    textField:'name'  
	});
	$('#userGroup').combotree({
		multiple:false,
		checkbox:false,
		lines:true,
		animate:true,
		editable:false,
	    url: baseUrl+'/admin/U030/findAllGroup.html',
	    required: true
	});
});
function subUpdForm() {
	$.messager.confirm('编辑提示', '确定更改此用户信息?', function(r) {
		if (r) {
			$('#updUserFrom').submit();
			return false;
		}
	});
}
function backUserManager(){
	$('#updateWin').window('close');
}