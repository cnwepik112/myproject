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





<div class="pageContent">
	<div class="panelBar">
		<ul class="toolBar">
			<li><a class="add" href="<%=request.getContextPath()%>/attendance/add" target="dialog"><span>添加</span></a></li>
			<li><a class="delete" href="<%=request.getContextPath()%>/attendance/delete?id={sid_user}" target="ajaxTodo" title="确定要删除吗?"><span>删除</span></a></li>
			
		</ul>
	</div>
	<table class="table" width="100%" layoutH="138">
		<thead>
			<tr>
				<th width="80">项目名称</th>
				<th width="100">项目创建者</th>
				<th width="100">日期</th>
				<th width="100">审核是否通过</th>
				
			</tr>
		</thead>
		<tbody>
			<c:forEach var="audit" items="${auditList}" varStatus="status">
				<tr target="sid_user" rel="${item.pname}">
					<td>${item.pname}</td>  
					<td>${item.name}</td>
					<td>
						${item.date}
					</td>
					<td>已通过</td>
					
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

</body>
</html>