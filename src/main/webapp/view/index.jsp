<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>首页</title>

<link href="<%=request.getContextPath()%>/static/dwz/themes/default/style.css" rel="stylesheet" type="text/css" media="screen"/>
<link href="<%=request.getContextPath()%>/static/dwz/themes/css/core.css" rel="stylesheet" type="text/css" media="screen"/>
<link href="<%=request.getContextPath()%>/static/dwz/themes/css/print.css" rel="stylesheet" type="text/css" media="print"/>
<link href="<%=request.getContextPath()%>/static/dwz/uploadify/css/uploadify.css" rel="stylesheet" type="text/css" media="screen"/>

<script src="<%=request.getContextPath()%>/static/dwz/js/jquery-2.1.4.min.js" type="text/javascript"></script>
<script src="<%=request.getContextPath()%>/static/dwz/js/jquery.validate.js" type="text/javascript"></script>
<script src="<%=request.getContextPath()%>/static/dwz/bin/dwz.min.js" type="text/javascript"></script>
<script src="<%=request.getContextPath()%>/static/dwz/js/dwz.regional.zh.js" type="text/javascript"></script>

<script type="text/javascript">
$(function(){
	DWZ.init("<%=request.getContextPath()%>/static/dwz/dwz.frag.xml", {
		loginUrl:"login_dialog.html", loginTitle:"登录",	// 弹出登录对话框
		statusCode:{ok:200, error:300, timeout:301}, //【可选】
		pageInfo:{pageNum:"pageNum", numPerPage:"numPerPage", orderField:"orderField", orderDirection:"orderDirection"}, //【可选】
		keys: {statusCode:"statusCode", message:"message"}, //【可选】
		ui:{hideMode:'offsets'}, //【可选】hideMode:navTab组件切换的隐藏方式，支持的值有’display’，’offsets’负数偏移位置的值，默认值为’display’
		debug:false,	// 调试模式 【true|false】
		callback:function(){
			initEnv();
			$("#themeList").theme({themeBase:"themes"}); // themeBase 相对于index页面的主题base路径
		}
	});
});
</script>

</head>
<body>
	<div id="layout">
		<div id="header" style="height: 100px;">
			<div class="headerNav">
				<a class="logo" href="http://j-ui.com">标志</a>
				<ul class="nav">
					<li id="switchEnvBox"><a href="javascript:">（<span>广州</span>）</a>
						
					</li>
					
					<li><a href="changepwd.html" target="dialog" rel="changepwd" width="600">设置</a></li>
					<li><a href="http://www.cnblogs.com/dwzjs" target="_blank">博客</a></li>
					<li><a href="http://weibo.com/dwzui" target="_blank">微博</a></li>
					<li>${username}<a href="<%=request.getContextPath()%>/logout">退出</a></li>
				</ul>
				<ul class="themeList" id="themeList">
					<li theme="default"><div class="selected">蓝色</div></li>
					<li theme="green"><div>绿色</div></li>
					<!--<li theme="red"><div>红色</div></li>-->
					<li theme="purple"><div>紫色</div></li>
					<li theme="silver"><div>银色</div></li>
					<li theme="azure"><div>天蓝</div></li>
				</ul>
			</div>
			<!-- navMenu -->
			<div id="navMenu"style="height:50px;">
				<ul style="height:50px;">
					<li><a href="sidebar_2.html"><span>员工管理</span></a></li>
					<li><a href="sidebar_2.html"><span>考勤管理</span></a></li>
					<li><a href="sidebar_1.html"><span>计划管理</span></a></li>
					<li><a href="sidebar_2.html"><span>审核管理</span></a></li>
					<li><a href="sidebar_1.html"><span>日常管理</span></a></li>
					<li><a href="sidebar_1.html"><span>人事管理</span></a></li>
					<li><a href="sidebar_2.html"><span>系统设置</span></a></li>
				</ul>
			</div>
			
		</div>

		<div id="leftside" style="margin-top:50px;">
			<div id="sidebar_s">
				<div class="collapse">
					<div class="toggleCollapse"><div></div></div>
				</div>
			</div>
			<div id="sidebar">
			<div class="toggleCollapse"><h2>主菜单</h2><div>收缩</div></div>
				<div class="accordion" fillSpace="sidebar">
					<div class="accordionHeader">
						<h2><span>Folder</span>办公管理功能</h2>
					</div>
					<div class="accordionContent">
						<ul class="tree treeFolder">
							<li><a href="javascript:;">功能菜单</a>
								<ul>
									  <li><a href="<%=request.getContextPath()%>/employee/getAllEmployee" target="navTab" rel="employee">员工管理</a></li> 
									<li><a href="<%=request.getContextPath()%>/attendance/getAllAttendance" target="navTab" rel="attendance">考勤管理</a></li>
									<li><a href="<%=request.getContextPath()%>/plan/getAllPlan" target="navTab" rel="plan">计划管理</a></li>
									<li><a href="<%=request.getContextPath()%>/audit/getAllAudit" target="navTab" rel="audit">审核管理</a></li>
									<li><a href="<%=request.getContextPath()%>/routime/get_list" target="navTab" rel="routime">日常管理</a></li>
									<li><a href="<%=request.getContextPath()%>/humanresource/get_list"target="navTab" rel="routime" >业务中心</a></li>
									<li><a href="<%=request.getContextPath()%>/myset/get_list"target="navTab" rel="myset" >系统设置</a></li>
								</ul>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<div id="container" style="margin-top:50px;">
			<div id="navTab" class="tabsPage">
				<div class="tabsPageHeader">
					<div class="tabsPageHeaderContent"><!-- 显示左右控制时添加 class="tabsPageHeaderMargin" -->
						<ul class="navTab-tab">
							<!-- <li tabid="main" class="main"><a href="javascript:;"><span><span class="home_icon">我的主页</span></span></a></li> -->
						</ul>
					</div>
					<div class="tabsLeft">left</div><!-- 禁用只需要添加一个样式 class="tabsLeft tabsLeftDisabled" -->
					<div class="tabsRight">right</div><!-- 禁用只需要添加一个样式 class="tabsRight tabsRightDisabled" -->
					<div class="tabsMore">more</div>
				</div>
				<!-- <ul class="tabsMoreList">
					<li><a href="javascript:;">我的主页</a></li>
				</ul> -->
				<div class="navTab-panel tabsPageContent layoutBox">
					
				</div>
			</div>
		</div>
	</div>
	<div id="footer">Copyright &copy; 2010 <a href="javascript:;" target="dialog">DWZ团队</a> 京ICP备15053290号-2</div>
</body>
</html>