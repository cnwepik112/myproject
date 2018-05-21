var mask='<div style="display:none;background-color: #777;filter: alpha(opacity=60); opacity:0.5; -moz-opacity:0.5;top: 0px;left: 0px;right:0px;bottom:0px;position:fixed;height:100%;width:100%;overflow:hidden;z-index: 1001;"></div>';
$(document).ready(function() {
	var UA = navigator.userAgent;
    var isIE = UA.indexOf('MSIE') > -1;
    var v = isIE ? /\d+/.exec(UA.split(';')[1]) : 'no ie';
    if(v<8){
   	 	$("#ietext").html("温馨提示：您的浏览器内核低于IE8.0版本，为了您的体验，请您升级浏览器！<a href='/upload/uploadMta3/ie8/ie8-setup.rar'>下载安装</a>");
    }
	mask =$(mask);
	// 回车事件
	$(document).keydown(function(event){
		if (event.keyCode==13) { //回车键的键值为13
				regist(); //调用注册按钮的
		}
	}); 
});

// 注册按钮按下
function regist(){
	var error=0;
	var telPartten = /^1[3,4,5,6,7,8,9]\d{9}$/;
	var emailPartten = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;;

	var username = trim($("#username").val());
	var pwd1 = trim($("#pwd1").val());
	var pwd2 = trim($("#pwd2").val());
	var gender = $('input:radio[name="userBean.gender"]:checked').val();
	//var email = trim($("#email").val());
	var realName = trim($("#realName").val());
	var tel = trim($("#tel").val());
	var groupId = $("#groupId").val();
	var positionId = $("#positionId").val();
	// 用户名不能为空
	if (isEmpty(username)){
		$("#nameSpan").html("请输入用户名");
		$("#username").focus();
		error++;
	}else{
		$("#nameSpan").html("");
	}
	// 密码不能为空
	if (isEmpty(pwd1)){
		$("#pwd1Span").html("请输入确认密码");
		$("#pwd1").focus();
		error++;
	}else{
		$("#pwd1Span").html("");
	}
	// 密码不能为空
	if (isEmpty(pwd2)){
		$("#pwd2Span").html("请输入确认密码");
		$("#pwd2").focus();
		error++;
	}else{
		$("#pwd2Span").html("");
	}
	// 两次密码不一致
	if (pwd1 != pwd2){
		$("#pwd2Span").html("两次输入密码不一致");
		$("#pwd2").focus();
		error++;
	}else{
		$("#pwd2Span").html("");
	}
//	if(!emailPartten.test(email) && email != ''){
//		$("#emailSpan").html("请输入正确邮箱");
//		$("#email").focus();
//		error++;
//	}else{
//		$("#emailSpan").html("");
//	}
	if(!telPartten.test(tel) && tel != ''){
		$("#telSpan").html("请输入正确的手机号");
		$("#tel").focus();
		error++;
	}else{
		$("#telSpan").html("");
	}
	if (groupId==""||groupId.length==0){
		$("#groupIdSpan").html("请选择用户组");
		$("#groupId").focus();
		return false;
	}else{
		$("#groupIdSpan").html("");
	}
	if(error>0){
		return;
	}
	$.post(baseUrl + "/mta/registUser.html", {"username":username,"pwd":pwd1, "gender":gender, "realName":realName, "tel":tel,"positionid":positionId,"groupid":groupId},
	    	function(json){
	    		if (json!= "") {
	    			alert(json);
	    		} else {
					window.location.href=baseUrl + "/mta/P010/myCenter.html";
	    		}
	    	},"json");
};


// 显示注册
function showRegist() {
	var registFlag=true;
	$.ajax({
		async:false,
		url:baseUrl+"/mta/getRegistConfig.html",
		type: 'post',
		dataType: 'json',
		success:function(data){
			registFlag=data;
		}
	});
	if(!registFlag){
		alert("系统不允许注册");
		return;
	}
	pop($("#loginRegist"));
	$("#username").focus();
}