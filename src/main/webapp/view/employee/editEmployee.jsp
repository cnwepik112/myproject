<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta charset="UTF-8">
<title>员工信息编辑</title>
</head>
<script type="text/javascript">
	function dialogAjaxDone(response) {
		alertMsg.correct(response.msg);
		$.pdialog.closeCurrent();
		navTab.reload("<%=request.getContextPath()%>/employee/getAllEmployee", "");
	}
</script>
<body>
	<div class="pageContent">
		<form method="post" action="<%=request.getContextPath()%>/employee/save" class="pageForm required-validate" onsubmit="return validateCallback(this, dialogAjaxDone)">
			<div class="pageFormContent" layoutH="58">
				<div class="unit">
					<label>员工ID：</label>
					<input type="text" name="id" size="30" class="required" value="${employee.id}" />
				</div>
				<div class="unit">
					<label>员工姓名：</label>
					<input type="text" name="name" size="30" class="required" value="${employee.name}" />
				</div>
				<div class="unit">
					<label>性别：</label>
					<select class="combox" name="gender" class="required">
						<option value="0">请选择</option>
						<option value="1">男</option>
						<option value="2">女</option>
					</select>
				</div>
				<div class="unit">
					<label>联系电话：</label>
					<input type="text" name="phone" size="30" class="required" value="${employee.phone}" />
				</div>
				<div class="unit">
					<label>出生日期：</label>
					<input type="text" name="birthday" size="30" class="required" value="${employee.birthday}" />
				</div>
			</div>
			<div class="formBar">
				<ul>
					<li><div class="buttonActive"><div class="buttonContent"><button type="submit">提交</button></div></div></li>
					<li><div class="button"><div class="buttonContent"><button type="button" class="close">取消</button></div></div></li>
				</ul>
			</div>
		</form>
	</div>
</body>
</html>