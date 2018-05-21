$(function() {
	init();
	creatGrid();
	creatKsGrid();
	creatKsGrid1();
	creatKsGrid2();
	creatKsGrid3();
	$('#selectExams').combobox({
		url : baseUrl + "/admin/T050/findExamMonitorName.html",
		editable : false,
		required : false,
		valueField : 'kaoshiId', //基础数据值名称绑定到该下拉列表框。
		textField : 'kaoshiName' //基础数据字段名称绑定到该下拉列表框。
	});
	$('#ksGridDiv').dialog({
		fit:false,
		title : '未考试用户列表',
		width:750,
		height:450,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	$('#ksGridDiv1').dialog({
		fit:false,
		title : '考试中用户列表',
		width:750,
		height:450,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	$('#ksGridDiv2').dialog({
		fit:false,
		title : '已交卷用户列表',
		width:750,
		height:450,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	$('#ksGridDiv3').dialog({
		fit:false,
		title : '考试用户列表',
		width:750,
		height:450,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	$('.searchUserGroup').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
//		panelHeight:'200',
//		panelWidth:'auto',
		panelMinWidth:200,
		panelMaxWidth:300,
		panelMaxHeight:200,
		animate : true,
		editable : true,
		url : baseUrl + '/admin/U030/findGroupAddALL.html',
		required : false,
		onHidePanel : getChildren

	});
	
	$('#excelForm').form({
		url : baseUrl + "/admin/T050/exportUserExcel.html"
		// success : function(data) {
			// $.messager.alert('提示',data,'info');
		// }
	});
	
});
//获得所选用户组节点及子节点,暂未调用
function getChildren() {
	var grouptree = $('.searchUserGroup').combotree('tree');
	var n = grouptree.tree('getSelected');
	var ids=n.id;
	var items=n.children;
	if(items!=null){
		var children = grouptree.tree('getChildren', n.target);
		for(var i=0;i<children.length;i++){
			var item=children[i];
			ids=ids+","+item.id;
		}
	}
}

//未考试用户列表
function fmks(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showKsGridDia("
			+ rowData.ksid + ");'>" + rowData.s2count + "</a>";
}
//考试中用户列表
function fmks1(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showKsGridDia1("
			+ rowData.ksid + ");'>" + rowData.s3count + "</a>";
}
//已交卷用户列表
function fmks2(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showKsGridDia2("
			+ rowData.ksid + ");'>" + rowData.s4count + "</a>";
}
//考试用户列表
function fmks3(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='showKsGridDia3("
			+ rowData.ksid + ");'>" + rowData.sumcount + "</a>";
}
//打开未考试用户列表dialog
function showKsGridDia(ksid) {
	$('#ksGridDiv').dialog("open");
	/*$('#ksGrid').datagrid("load",{*/
		$('#ksGrid').datagrid({
		queryParams : {'ksid': ksid},
		url : baseUrl + "/admin/T050/findKSUser.html"
	});
	$("#ks").val(ksid);
	$("#searchUserGroup1").combotree("setValue",0);
	$("#groupids").val("");
}
//打开考试中用户列表dialog
function showKsGridDia1(ksid) {
	$('#ksGridDiv1').dialog("open");
	$('#ksGrid1').datagrid({
		queryParams : {'ksid': ksid},
		url : baseUrl + "/admin/T050/findKSUser1.html"
		});
}
//打开已交卷用户列表dialog
function showKsGridDia2(ksid) {
	$('#ksGridDiv2').dialog("open");
	$('#ksGrid2').datagrid({
		queryParams : {'ksid': ksid},
		url : baseUrl + "/admin/T050/findKSUser2.html"
		});
	$("#ks").val(ksid);
	$("#searchUserGroup2").combotree("setValue",0);
	$("#groupids").val("");
}
//打开考试用户列表dialog
function showKsGridDia3(ksid) {
	$('#ksGridDiv3').dialog("open");
	$('#ksGrid3').datagrid({
		queryParams : {'ksid': ksid},
		url : baseUrl + "/admin/T050/findKSUser3.html"
		});
	$("#ks").val(ksid);
	$("#searchUserGroup3").combotree("setValue",0);
	$("#groupids").val("");
}
function searchExam(){
	//考试名称
	var ksid=$("#selectExams").next().find(".textbox-value").val();
	$('#selectOneExamList').datagrid('load', {
		ksid:ksid
	});
}
//用户组查询
function searchExamUserGroup(type){
	var param = {
			groupid : 0,
			ksid : ''
			
		};
	var grouptree = $('#searchUserGroup'+type).combotree('tree');
	var n = grouptree.tree('getSelected');
	var ids=n.id;
	var items=n.children;
	if(items!=null){
		var children = grouptree.tree('getChildren', n.target);
		for(var i=0;i<children.length;i++){
			var item=children[i];
			ids=ids+","+item.id;
		}
	}
	$("#groupids").val(ids);
	var search_ksid = $("#ks").val();
	var search_groupid = $('#groupids').val();
	
	param.groupid = search_groupid;
	param.ksid = search_ksid;
	
	$("#exgroupid").val(search_groupid);
	$("#ks").val(search_ksid);
	if(type==1){
		$('#ksGrid').datagrid('load', param);
	}else if(type==2){
		$('#ksGrid2').datagrid('load', param);
	}else if(type==3){
		$('#ksGrid3').datagrid('load', param);
	}
}
function allToStop(){
	var ksid=$("#selectExams").next().find(".textbox-value").val();
	$.messager.confirm('更新提示', '确定要强行收卷?', function(r) {
		if (r) {
			$.post(baseUrl + "/admin/T050/allToStop.html", {
				ksid : ksid
			}, function(data) {
				if (data > 0) {
					msgShow('收卷成功!');
					$('#selectOneExamList').datagrid('reload');
				} else {
					msgShow('收卷失败，请稍后重试！');
					reloadGrid();
				}
			}, "json");
		}
	});
}
function creatGrid() {
	$('#selectOneExamList').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : true,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : true,// 分页组件是否显示
		pageNumber : 1,// 起始页
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50 ],// 每页显示多少行
		rownumbers : true,// 行号
		url : baseUrl + '/admin/T050/showAllMonitor.html',
		columns : [ [ {
			field : 'ksid',title : '考试id',width : 30,halign: 'center',
			sortable : true,sorter : datasort,align : 'right'
		},{
			field : 'ksname',title : '考试名称',width : 30,halign: 'center',
			sortable : true,sorter : datasort,align : 'left'
		},{
			field : 'beginTm',title : '开始时间',width : 50,
			sortable : true,sorter : datasort,align : 'center',
			formatter : fmdate
		}, {
			field : 'endTm',title : '结束时间',width : 50,
			sortable : true,sorter : datasort,align : 'center',
			formatter : fmdate
		}, {
			field : 'sumcount',title : '总人数',width : 30,halign: 'center',
			sortable : true,sorter : datasort,align : 'right',
			formatter : fmks3
		},{
			field : 's2count',title : '未考试人数',width : 30,halign: 'center',
			sortable : true,sorter : datasort,align : 'right',
			formatter : fmks
		},{
			field : 's3count',title : '考试中人数',width : 30,halign: 'center',
			sortable : true,sorter : datasort,align : 'right',
			formatter : fmks1
		},
		{
			field : 's4count',title : '已交卷人数',width : 30,halign: 'center',
			sortable : true,sorter : datasort,align : 'right',
			formatter : fmks2
		}] ]
	});
}
function creatKsGrid() {
	$('#ksGrid').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : true,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : false,// 分页组件是否显示
		rownumbers : true,// 行号
		columns : [ [ {
			field : 'uid',title : '用户ID',width : 50,fixed : true,halign: 'center',
			align : 'right',sortable : true,sorter : datasort
		}, {
			field : 'NAME',title : '用户名',width : 60,halign: 'center',
			sortable : true,sorter : datasort,align : 'center'
		}, {
			field : 'realname',title : '姓名',width : 60,halign: 'center',
			sortable : true,sorter : datasort,align : 'center'
		}, {
			field : 'telephone',title : '手机号',width : 80,halign: 'center',
			sortable : true,sorter : datasort,align : 'center'
		},{
			field : 'manage',title : '操作',align : 'center',
			width : 100,formatter : kaoshiForOne
		} ] ],
		onLoadSuccess : function(data) {
			$('.toStopOne').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
			$('.toStartOne').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
			$('.shouJuanOne').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
		}
	});
}
function kaoshiForOne(value, rowData, rowIndex){
	var uid= rowData.uid;
	var str="<a onclick='toStop("+ uid+ ")' class='toStopOne'>暂停</a>";
	str += "<a onclick='toStart("+ uid+ ");' class='toStartOne' >开始</a>";
	str += "<a onclick='toSubmit("+ uid+ ");' class='shouJuanOne' >强行收卷</a>";
	return str;
}
//未考试用户 强行收卷
function toFinish(uid,ksid,state){
	shoujuan(uid,ksid,state);
}
//强行收卷方法
function shoujuan(uid,ksid,state){
	$.messager.confirm('更新提示', '确定要强行收卷?', function(r) {
		if (r) {
			$.post(baseUrl + "/admin/T050/oneToStop.html", {
				uid : uid,
				ksid : ksid,
				state:state,
				msg:"submit"
			}, function(data) {
				if (data > 0) {
					msgShow('收卷成功!');
					$('#ksGrid').datagrid('reload');
					$('#ksGrid1').datagrid('reload');
					$('#selectOneExamList').datagrid('reload');
				} else {
					msgShow('收卷失败，请稍后重试！');
					reloadGrid();
				}
			}, "json");
		}
	});
}

function creatKsGrid1() {
	$('#ksGrid1').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : true,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : false,// 分页组件是否显示
		rownumbers : true,// 行号
		columns : [ [ {
			field : 'uid',title : '用户ID',width : 50,fixed : true,halign: 'center',
			align : 'right',sortable : true,sorter : datasort
		}, {
			field : 'NAME',title : '用户名',width : 60,halign: 'center',
			sortable : true,sorter : datasort,align : 'center'
		}, {
			field : 'realname',title : '姓名',width : 60,halign: 'center',
			sortable : true,sorter : datasort,align : 'center'
		}, {
			field : 'telephone',title : '手机号',width : 60,halign: 'center',
			sortable : true,sorter : datasort,align : 'center'
		},{
			field : 'manage',title : '操作',align : 'center',
			width : 100,formatter : kaoshiForOne2
		}] ],
		onLoadSuccess : function(data) {
			$('.toStopOne').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
			$('.toStartOne').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
			$('.shouJuanOne').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
		}
	});
}
function kaoshiForOne2(value, rowData, rowIndex){
	var uid= rowData.uid;
	var str="<a onclick='toStop("+ uid+ ")' class='toStopOne'>暂停</a>";
	str += "<a onclick='toStart("+ uid+ ");' class='toStartOne' >开始</a>";
	str += "<a onclick='toSubmit("+ uid+ ");' class='shouJuanOne' >强行收卷</a>";
	return str;
}
//考试中用户 强行收卷
function toFinish2(uid,ksid,state){
	shoujuan(uid,ksid,state);
}
function init() {
 	//initDHTML();
 	//p_join_listen('/stocks/server');
 	}
 	
 	// onData method called by pushlet frame
 	function onData(pushletEvent) {
 	var valueLayer = getRawObject(pushletEvent.get('name'));
 	//layerWrite(valueLayer, pushletEvent.get('rate'));
 	alert(pushletEvent.get('rate'));
 	}
//考试中用户 暂停
function toStop(uid){
	$.messager.confirm('提示', '确定要暂停考试?', function(r) {
		if (r) {
			$.post(baseUrl + "/admin/T050/oneClientToStop.html", {
				userid:uid,
				msg:"stop"
			}, "json");
		}
	});
}
//考试中用户开始
function toStart(uid){
	$.messager.confirm('提示', '确定要开始考试?', function(r) {
		if (r) {
			$.post(baseUrl + "/admin/T050/oneClientToStop.html", {
				userid:uid,
				msg:"start"
			}, "json");
		}
	});
}
//考试中用户强行收卷
function toSubmit(uid){
	$.messager.confirm('提示', '确定要强行收卷?', function(r) {
		if (r) {
			$.post(baseUrl + "/admin/T050/oneClientToStop.html", {
				userid:uid,
				msg:"submit"
			}, function(data) {
				if (data > 0) {
					countDown(5);
				}
			}, "json");
		}
	});
}
function countDown(secs){
    if(--secs>0) {
    	setTimeout( "countDown(" +secs+ ")" ,1000);
    } else {
    	$('#selectOneExamList').datagrid('reload');
    }
 }
//考试中用户 暂停
function allToStop(){
	var items=$('#selectOneExamList').datagrid('getSelections');
	if(items.length > 0){
		$.messager.confirm('提示', '确定要暂停考试?', function(r) {
			if (r) {
				$.post(baseUrl + "/admin/T050/allToManage.html", {
					ksid:items[0].ksid,
					msg:"stop"
				}, "json");
			}
		});
	}else{
		msgShow('请选择考试');
	}
	
}
//考试中用户开始
function allToStart(){
	var items=$('#selectOneExamList').datagrid('getSelections');
	if(items.length > 0){
		$.messager.confirm('提示', '确定要开始考试?', function(r) {
			if (r) {
				$.post(baseUrl + "/admin/T050/allToManage.html", {
					ksid:items[0].ksid,
					msg:"start"
				}, "json");
			}
		});
	}else{
		msgShow('请选择考试');
	}
}
//考试中用户开始
function allToSubmit(){
	var items=$('#selectOneExamList').datagrid('getSelections');
	if(items.length > 0){
		$.messager.confirm('提示', '确定要强行收卷?', function(r) {
			if (r) {
				$.post(baseUrl + "/admin/T050/allToManage.html", {
					ksid:items[0].ksid,
					msg:"submit"
				}, function(data) {
					$('#selectOneExamList').datagrid('reload');
				}, "json");
			}
		});
	}else{
		msgShow('请选择考试');
	}
}
function creatKsGrid2() {
	$('#ksGrid2').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : true,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : false,// 分页组件是否显示
		rownumbers : true,// 行号
		columns : [ [ {
			field : 'uid',title : '用户ID',width : 50,fixed : true,halign: 'center',
			align : 'right',sortable : true,sorter : datasort
		}, {
			field : 'NAME',title : '用户名',width : 60,halign: 'center',
			sortable : true,sorter : datasort,align : 'center'
		}, {
			field : 'realname',title : '姓名',width : 60,halign: 'center',
			sortable : true,sorter : datasort,align : 'center'
		}, {
			field : 'telephone',title : '手机号',width : 60,halign: 'center',
			sortable : true,sorter : datasort,align : 'center'
		} ] ]
	});
}
function creatKsGrid3() {
	$('#ksGrid3').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : true,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : false,// 分页组件是否显示
		rownumbers : true,// 行号
		columns : [ [ {
			field : 'uid',title : '用户ID',width : 50,fixed : true,halign: 'center',
			align : 'right',sortable : true,sorter : datasort
		}, {
			field : 'NAME',title : '用户名',width : 80,halign: 'center',
			sortable : true,sorter : datasort,align : 'center'
		}, {
			field : 'realname',title : '姓名',width : 80,halign: 'center',
			sortable : true,sorter : datasort,align : 'center'
		}, {
			field : 'telephone',title : '手机号',width : 80,halign: 'center',
			sortable : true,sorter : datasort,align : 'center'
		} ] ]
	});
}
//页面列表的排序
function datasort(a, b) {
	return (a > b ? 1 : -1);
}
// 日期转换
function fmdate(value, rowData, rowIndex) {
	// fmtLongDate--common.js
	return fmtLongDate(new Date(value));
}
// 刷新
function reloadGrid() {
	$('#selectOneExamList').datagrid('clearSelections');
	$('#selectOneExamList').datagrid('reload');
}
//导出Excel
function exportExcel(state) {
	$("#state").val(state);
	$('#excelForm').submit();
	return false;
}