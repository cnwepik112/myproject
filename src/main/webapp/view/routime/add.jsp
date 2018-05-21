<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta charset="UTF-8">
<title>考勤信息添加</title>
</head>
<script type="text/javascript">
	function dialogAjaxDone(response) {
		alertMsg.correct(response.msg);
		$.pdialog.closeCurrent();
		navTab.reload("<%=request.getContextPath()%>/attendance/get_list", "");
	}
</script>
<body>
	<div class="pageContent">
		<form method="post" action="<%=request.getContextPath()%>/attendance/save" class="pageForm required-validate" onsubmit="return validateCallback(this, dialogAjaxDone)">
			<div class="pageFormContent" layoutH="80">
				<div class="unit">
					<label>考勤ID：</label>
					<input type="text" name="id" size="10" class="required" />
				</div>
				<div class="unit">
					<label>员工ID：</label>
					<input type="text" name="employeeId" size="10" class="required"/>
				</div>
				
				<div class="unit">
					<label>工作日期：</label>
					<input type="text" name="workDate" size="30" class="required"/>
					
				</div>
				<div class="unit">
					<label>上班时间：</label>
					<input type="text" name="arrivalTime" size="30" class="required"/>
				</div>
				<div class="unit">
					<label>下班时间：</label>
					<input type="text" name="leaveTime" size="30" class="required"/>
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