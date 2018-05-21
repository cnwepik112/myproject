<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta charset="UTF-8">
<title>1</title>
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
	<form onsubmit="return navTabSearch(this);" action="<%=request.getContextPath()%>/humanresource/get_list" method="post" onreset="$(this).find('select.combox').comboxReset()">
	

<div class="pageContent">
	<form method="post" action="demo/common/ajaxDone.html" class="pageForm required-validate" onsubmit="return validateCallback(this, navTabAjaxDone);">
		<div class="pageFormContent" layoutH="56">
			<p>
				<label>客 户 号：</label>
				<input name="sn" type="text" size="30" value="100001" readonly="readonly"/>
			</p>
			<p>
				<label>客户名称：</label>
				<input name="name" class="required" type="text" size="30" value="张慧华" alt="请输入客户名称"/>
			</p>
			<p>
				<label>部门名称：</label>
				<input type="hidden" name="orgLookup.id" value="${orgLookup.id}"/>
				<input type="text" class="required" name="orgLookup.orgName" value="" suggestFields="orgNum,orgName" suggestUrl="demo/database/db_lookupSuggest.html" lookupGroup="orgLookup" />
				<a class="btnLook" href="demo/database/dwzOrgLookup.html" lookupGroup="orgLookup">查找带回</a>		
			</p>
			<p>
				<label>部门编号：</label>
				<input type="text" readonly="readonly" value="" name="dwz_orgLookup.orgNum" class="textInput">
			</p>
			<p>
				<label>识 别 码：</label>
				<input name="code" class="digits" type="text" size="30" alt="请输入数字"/>
			</p>
			<p>
				<label>客户类型：</label>
				<select name="type" class="required combox">
					<option value="">请选择</option>
					<option value="个人">个人</option>
					<option value="公司" selected>公司</option>
				</select>
			</p>
			<p>
				<label>营业执照号：</label>
				<input type="text" size="30" />
			</p>
			<p>
				<label>执照签发日期：</label>
				<input type="text" name="startDate" class="date" size="30" /><a class="inputDateButton" href="javascript:;">选择</a>
			</p>
			<p>
				<label>执照到期日期：</label>
				<input type="text" name="endDate" class="date" size="30" /><a class="inputDateButton" href="javascript:;">选择</a>
			</p>
			<p>
				<label>注册资金：</label>
				<select name="capital" class="required combox">
					<option value="">请选择</option>
					<option value="10">10</option>
					<option value="50" selected>50</option>
					<option value="100">100</option>
				</select>
				<span class="unit">万元</span>
			</p>
			<p>
				<label>注册类型：</label>
				<input type="text" size="30" />
			</p>
			<p>
				<label>注册地址：</label>
				<input type="text" size="30" />
			</p>
			<p>
				<label>所属行业：</label>
				<input type="text" size="30" />
			</p>
			<p>
				<label>组织机构代码：</label>
				<input type="text" size="30" />
			</p>
			<p>
				<label>国税登记证号码：</label>
				<input type="text" size="30" />
			</p>
			<p>
				<label>地税登记证号码：</label>
				<input type="text" size="30" />
			</p>
			<p>
				<label>贷款卡编码：</label>
				<input type="text" size="30" />
			</p>
			<p>
				<label>法人姓名：</label>
				<input type="text" size="30" />
			</p>
			<p>
				<label>法人代表身份证号：</label>
				<input type="text" size="30" />
			</p>
			<p>
				<label>身份证到期日期：</label>
				<input type="text" size="30" />
			</p>
			<p>
				<label>其他证件及号码：</label>
				<input type="text" size="30" />
			</p>
			<p>
				<label>曾用名称：</label>
				<input type="text" size="30" />
			</p>
			<p>
				<label>首次贷款日期：</label>
				<input readonly="readonly" type="text" size="30" />
			</p>
			<div class="divider"></div>
			<p>
				<label>建档日期：</label>
				<input readonly="readonly" type="text" size="30" />
			</p>
			<p>
				<label>管户经理：</label>
				<input readonly="readonly" type="text" size="30" />
			</p>
			<p>
				<label>最新修改时间：</label>
				<input readonly="readonly" type="text" size="30" />
			</p>
			<p>
				<label>最新修改人员：</label>
				<input readonly="readonly" type="text" size="30" />
			</p>
		</div>
		<div class="formBar">
			<ul>
				<!--<li><a class="buttonActive" href="javascript:;"><span>保存</span></a></li>-->
				<li><div class="buttonActive"><div class="buttonContent"><button type="submit">保存</button></div></div></li>
				<li>
					<div class="button"><div class="buttonContent"><button type="button" class="close">取消</button></div></div>
				</li>
			</ul>
		</div>
	</form>
</div>

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