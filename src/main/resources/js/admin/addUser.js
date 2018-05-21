$(function() {
	$('#addUserFrom').form({
		url : "addMtaSysUser.html",
		onSubmit : function() {
			return $('#addUserFrom').form("validate");
		},
		success : function(data) {
			if (data > 0) {
				$.messager.confirm('提示', '添加用户成功！', function(r) {
					if (r) {
						window.parent.closeTabByTitle("用户管理");
						window.parent.openTab("用户管理", "admin/U010/manageUser.html");
						window.parent.closeTabByTitle("添加用户");
					}
				});
			} else if (data == 0) {
				msgShow("<span style='color:red'>该用户已存在！</span>");
			}else if (data == -2){
				alert("注册人数已达到购买上限，请联系www.mtavip.com获取技术支持!");
//				msgShow("<span style='color:red;hight:60px'>注册人数已达到购买上限，请联系www.mtavip.com获取技术支持!</span>")
			} else {
				msgShow("<span style='color:red'>未知错误！请稍后重试！</span>");
			}
		}
	});
	$('#userRole').combobox({
		url : baseUrl + '/admin/U040/findALLRole.html',
		required : false,
		editable : false,
		panelHeight:'auto',
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
	$('#userGroup').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		url : baseUrl + '/admin/U030/findAllGroup.html',
		required : true
		//onHidePanel : getChildren
	});
});
// 提交form
function subAddForm() {
	$('#addUserFrom').submit();
	return false;
}
//获得所选用户组节点及子节点,暂未调用
function getChildren() {
	var grouptree = $('#userGroup').combotree('tree');
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
	alert($("#groupids").val());
}