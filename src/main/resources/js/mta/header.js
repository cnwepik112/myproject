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
			if (!$("#loginShow").is(':hidden')) {
				login(); //调用登录按钮的登录事件
			}
			if (!$("#loginRegist").is(':hidden')) {
				regist(); //调用注册按钮的事件
			}
		}
	});
	PL.userUUID=loginUserId;
	PL._init(); 
	PL.joinListen('/getNewMessage');
	PL.setFun(onData);
});
function onData(event) {
	if(event.get("user_"+loginUserId)=="forcedOffline"){
		alert("你的账号被强制退出！");
		document.location.reload();
	}
}
// 登陆按钮按下
function login(){
	var username = trim($("#username").val());
	var pwd = trim($("#pwd").val());
	// 用户名不能为空
	if (isEmpty(username)){
		alert("请输入用户名");
		$("#username").focus();
		return false;
	}
	// 用户名不能为空
	if (isEmpty(pwd)){
		alert("请输入密码");
		$("#pwd").focus();
		return false;
	}
	$.post(baseUrl + "/mta/loginCheck.html", {"username":username,"pwd":pwd},
    	function(json){
    		if (json!= "") {
    			alert(json);
    		} else {
				history.go(0);
				document.location.reload();
    		}
    	},"json");
    
};
//退出按钮按下
function logout(){
	$.post(baseUrl + "/admin/logout.html", {},
    	function(data){
    	},"json");
    // 火狐浏览器需要弹出才能退出
//    if (navigator.userAgent.indexOf("Firefox")>0) {
//    }
    alert("您已成功退出本系统！");
    document.location.reload();

};
// 注册按钮按下
function regist(){
	var error=0;
	var telPartten = /^1[3,4,5,6,7,8,9]\d{9}$/;
	var emailPartten = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;;

	var username = trim($("#name").val());
	var pwd1 = trim($("#pwd1").val());
	var pwd2 = trim($("#pwd2").val());
	var gender = $('input:radio[name="userBean.gender"]:checked').val();
	var email = trim($("#email").val());
	var tel = trim($("#tel").val());

	// 用户名不能为空
	if (isEmpty(username)){
		$("#nameSpan").html("请输入用户名");
		$("#name").focus();
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
	if(!emailPartten.test(email) && email != ''){
		$("#emailSpan").html("请输入正确邮箱");
		$("#email").focus();
		error++;
	}else{
		$("#emailSpan").html("");
	}
	if(!telPartten.test(tel) && tel != ''){
		$("#telSpan").html("请输入正确的手机号");
		$("#tel").focus();
		error++;
	}else{
		$("#telSpan").html("");
	}
	if(error>0){
		return;
	}
	$.post(baseUrl + "/mta/registUser.html", {"username":username,"pwd":pwd1, "gender":gender, "email":email, "tel":tel},
	    	function(json){
	    		if (json!= "") {
	    			alert(json);
	    		} else {
					location.reload();
	    		}
	    	},"json");
};

// 显示登陆
function showLogin() {
	pop($("#loginShow"));
	$("#username").focus();
}
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
	$("#name").focus();
}
// 隐藏登陆，显示注册
function hideLoginShowRegist() {
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
	$("#loginShow").hide();
	pop($("#loginRegist"));
}
// 隐藏注册，显示登陆
function hideRegistShowLogin() {
	pop($("#loginShow"));
	$("#loginRegist").hide();
}
// 登陆页面 关闭按钮
function hideLogin() {
	mask.hide();
	$("#loginShow").hide();
}
// 注册页面 关闭按钮
function hideRegist() {
	mask.hide();
	$("#loginRegist").hide();
}
function pop(obj){
	$("body").append(mask);
	mask.show();
	obj.show();
	//浏览器可见区域的高度
	var wHeight=$(window).height();
	//浏览器可见区域的宽度
	var dWidth=$(window).width();
	var popHeight= obj.height();
	var popWidth= obj.width();
	var height=(wHeight-popHeight)/2;
	var width=(dWidth-popWidth)/2;
	obj.css("top",height+"px");
	obj.css("left",width+"px");
}