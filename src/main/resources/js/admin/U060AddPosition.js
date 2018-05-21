/**
 * 职位管理添加js
 * 
 * @author LiMeng
 * 
 * @since 2015/07/06
 */
$(function() {
	$('#addPosFrom').form({
		url : baseUrl +"/admin/U060/addPos.html",
		onSubmit : function() {
			return $('#addPosFrom').form("validate");
		},
		success : function(data) {
			if (data > 0) {
				window.parent.closeTabByTitle("职位管理");
				window.parent.openTab("职位管理", baseUrl +"/admin/U060/ManagePosition.html");
				window.parent.closeTabByTitle("新建职位");
			} else if (data == 0) {
				msgShow("<span style='color:red'>该职位已存在！</span>");
			} else {
				msgShow("<span style='color:red'>未知错误！请稍后重试！</span>");
			}
		}
	});
});

function subAddPosForm(){
	
	var des=$("#des").val();
	if(des ==null || des==""){
		msgShow("<span style='color:red'>请填写职位描述！</span>");
		return;
	}
	$('#addPosFrom').submit();
	return false;
}