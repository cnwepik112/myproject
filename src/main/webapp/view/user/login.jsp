<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>办公管理系统</title>
<link href="<%=request.getContextPath()%>/static/css/main.css" rel="stylesheet" type="text/css" />
</head>

<body>
	<div class="login">
    <div class="box png">
		<div class="logo png"></div>
		<div class="input">
			<div class="log">
				<div class="name">
					<label>用户名</label><input type="text" class="text" id="value_1" placeholder="用户名" name="value_1" tabindex="1">
				</div>
				<div class="pwd">
					<label>密　码</label><input type="password" class="text" id="value_2" placeholder="密码" name="value_2" tabindex="2">
					<input type="button" class="submit" tabindex="3" value="登录" id="loginBtn">
					<div class="check"></div>
				</div>
				<div class="tip"></div>
			</div>
		</div>
	</div>
    <div class="air-balloon ab-1 png"></div>
	<div class="air-balloon ab-2 png"></div>
    <div class="footer"></div>
</div>

<script type="text/javascript" src="js/jQuery.js"></script>
<script type="text/javascript" src="js/fun.base.js"></script>
<script type="text/javascript" src="js/script.js"></script>


<!--[if IE 6]>
<script src="js/DD_belatedPNG.js" type="text/javascript"></script>
<script>DD_belatedPNG.fix('.png')</script>
<![endif]-->
<div style="text-align:center;margin:50px 0; font-family:Georgia;color:rgba(243, 43, 43, 0.82);font-size: 20px;">
<p>
2018毕业设计

</p>
<p>produce by huangdf</p>
<p>email:603241014@qq.com</p>
</div>
</body>

<script src="<%=request.getContextPath()%>/static/js/jQuery.js" type="text/javascript"></script>
<script src="<%=request.getContextPath()%>/static/js/fun.base.js" type="text/javascript"></script>
<script src="<%=request.getContextPath()%>/static/js/script.js" type="text/javascript"></script>
<script type="text/javascript">

$(function () {
    $("#loginBtn").on("click", function () {
        var userParam = {
        	username: $("#username").val(),
            password: $("#password").val()
        }
        $.ajax({
            type: "post",
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify(userParam),
            url: "<%=request.getContextPath()%>/login",
            success: function (res) {
            	// 在浏览器控制台打印返回结果	
            	console.log(res);
            	// 页面跳转到首页
            	window.location.href = "<%=request.getContextPath()%>/view/index.jsp";
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                
            }
        });
    });
});
</script>
</html>