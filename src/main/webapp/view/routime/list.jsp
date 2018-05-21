<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta charset="UTF-8">
<title>考勤列表</title>
</head>
<body>

<form id="pagerForm" method="post" action="<%=request.getContextPath()%>/attendance/get_list">
	<input type="hidden" name="status" value="${param.status}">
	<input type="hidden" name="keywords" value="${param.keywords}" />
	<input type="hidden" name="pageNum" value="1" />
	<input type="hidden" name="numPerPage" value="${model.numPerPage}" />
	<input type="hidden" name="orderField" value="${param.orderField}" />
</form>


<div class="pageHeader">
	<form onsubmit="return navTabSearch(this);" action="<%=request.getContextPath()%>/attendance/get_list" method="post" onreset="$(this).find('select.combox').comboxReset()">
	
	</form>
</div>

<div layoutH="0">
	<div class="row">
		<div class="col-md-6 col-sm-12">

			<div class="panel collapse" defH="150">
				<h1>左边容器</h1>
				<div class="pageContent" height="200px;">
	<div class="panelBar">
		<ul class="toolBar">
			<li><a class="add" href="<%=request.getContextPath()%>/attendance/add" target="dialog"><span>添加</span></a></li>
			<li><a class="delete" href="<%=request.getContextPath()%>/attendance/delete?id={sid_user}" target="ajaxTodo" title="确定要删除吗?"><span>删除</span></a></li>
			<li><a class="edit" href="<%=request.getContextPath()%>/attendance/edit?id={sid_user}" target="dialog"><span>修改</span></a></li>
		</ul>
	</div>
	<table class="table" width="100%" layoutH="138">
		<thead>
			<tr>
				<th width="80">考勤ID</th>
				<th width="100">员工ID</th>
				<th width="100">工作日期</th>
				<th width="100">上班时间</th>
				<th width="100">下班时间</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="item" items="${list}" varStatus="status">
				<tr target="sid_user" rel="${item.id}">
					<td>${item.id}</td>  
					<td>${item.employeeId}</td>
					<td>
						${item.workDate}
					</td>
					<td>${item.arrivalTime}</td>
					<td>
						${item.leaveTime}
					</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
	<div class="panelBar">
		<div class="pages">
			<span>显示</span>
			<select class="combox" name="numPerPage" onchange="navTabPageBreak({numPerPage:this.value})">
				<option value="20">20</option>
				<option value="50">50</option>
			</select>
			<span>条，共${totalCount}条</span>
		</div>
		<div class="pagination" targetType="navTab" totalCount="10" numPerPage="20" pageNumShown="10" currentPage="1"></div>
	</div>
</div>
			</div>

		</div>
		<div class="col-md-6 col-sm-12">

			<div class="panel collapse" defH="150">
				<h1>右边容器</h1>
				<div>
					拖动浏览器窗口大小,测试页面布局
				</div>
			</div>

		</div>
	</div>

	


</body>
</html>