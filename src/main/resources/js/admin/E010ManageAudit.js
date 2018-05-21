
/**
 * 审核管理js
 * 
 * @author limeng
 * 
 * @since 2015/07/09
 */
//==========================用户审核js===========================//
//$(function(){
//	creatGrid(); 
//	$('#searchUserGroup').combotree({
//		multiple : false,
//		checkbox : false,
//		lines : true,
//		animate : true,
//		editable : true,
//		url : baseUrl + '/admin/U030/findGroupAddALL.html',
//		required : false
//	});
//	
//});

function creatGrid() {
	$('#itemlist').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : true,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : true,// 分页组件是否显示
		pageNumber : 1,// 起始页
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50 ],// 每页显示多少行
		rownumbers : true,// 行号
		url : baseUrl + '/admin/E010/findAllUserForManager.html',
		toolbar : '#tbar',
		columns:[[    
	        {field:'username',title:'用户名',width:80,sortable : true,halign: 'center',align:'left'},    
	        {field:'realname',title:'真实姓名',width:80,sortable : true,halign: 'center',align:'left'},    
	        
	        {field:'groupname',title:'所属用户组',width:80,sortable : true,halign: 'center',align:'left'},
	        {field:'gender',title:'性别',width:80,sortable : true,halign: 'center',align:'right',formatter : fmgender},
	        {field:'insdate',title:'创建时间',width:80,sortable : true,halign: 'center',align:'center',formatter : fmdate1},
	        {field:'review',title:'审核状态',width:80,sortable : true,halign: 'center',align:'center',styler : cellStylerReview,formatter : fmReview}
	    ]],
	    
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
			$('.review_user').linkbutton({
				iconCls : 'icon-reload',
				plain : true
			});
		}
	});
}
//日期转换
function fmdate1(value, rowData, rowIndex) {
	// fmtLongDate--common.js
	if (value != null && value != '') {
		return fmtLongDate(new Date(value));
	}
	return "";
}
//性别转换
function fmgender(value, rowData, rowIndex){
	if(value == true){
		return "男";
	}else if(value == false){
		return "女";
	}
}
//角色
function fmRole(value, rowData, rowIndex) {
	return "<a href='javascript:;' class='blue_color_a' onclick='updUserRole("
			+ value + "," + rowData.userid + ");'>" + rowData.rolename + "</a>";
}



//审核状态
function fmReview(value, rowData, rowIndex) {
	if (rowData.userid != 1) {
		if (value == 1) {
			return "<a href='javascript:;' class='blue_color_a' onclick='reviewUser(" + rowData.review + "," + rowData.userid
						+ ");'>已审核</a>";
		} else {
			return "<a href='javascript:;' class='blue_color_a' onclick='reviewUser(" + rowData.review + "," + rowData.userid
						+ ");'>未审核</a>";
		}
	}
	return "已审核";
}

// 用户审核状态如果为未审核则变色提醒
function cellStylerReview(value, row, index) {
	if (value <= 0 || !value) {
		return 'background-color:#FA8072;color:#fff;';
	}
}

//查询函数
function seachUserByParam() {
	
	var param = {
		username : $("#userLike").val(),
		realname : $("#realNameLike").val(),
		groupid : $("#searchUserGroup").combotree('getValue'),
		gender : $("#genderLike").combobox('getValue'),
		review : $("#user_reviewLike").combobox('getValue'),
		insdate : $("#user_dateLike").datebox('getValue')
	};

	$('#itemlist').datagrid('load', param);
}
//审核、冻结用户
function reviewUser(type, uid) {
	var dataParam = {
		review : false,
		id : uid
	};
	if (!type) {
		dataParam.review = true;
	}
	$.messager.confirm('操作提示', '确定要  审核/冻结  此用户?', function(r) {
		if (r) {
			$.post(baseUrl + "/admin/E010/updMtaSysUserReview.html", dataParam, function(data) {
				if (data == 0) {
					msgShow('操作失败，请稍后重试');
					return;
				}
				msgShow('操作成功!');
				$('#itemlist').datagrid('reload');
			}, "json");
		}
	});
}
//刷新
function reloadGrid() {
	$('#itemlist').datagrid('clearSelections');
	$('#itemlist').datagrid('reload');
}
//==========================用户审核js结束===========================//
//==========================试卷审核js===========================//
$(function(){
	
	creatGrid2(); 
	$('#searchShiJuanFenLei').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : true,
		onHidePanel : getSjChildren,//获取子节点
		url : baseUrl + '/admin/B010/findShiJuanClassAddALL.html',
		required : false
	});
});
var sjClassifyids="";//全局变量
function getSjChildren() {
	var grouptree = $('#searchShiJuanFenLei').combotree('tree');//对应combotreeID
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
	sjClassifyids=ids;//赋值给全局变量 记录所选分类全部ID
}
function creatGrid2() {
	$('#itemlist2').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : true,// 设置为true，当数据长度超出列宽时将会自动截取。
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
		url : baseUrl + '/admin/E010/findAllShiJuan.html',
		toolbar : '#tbar',
		columns:[[    
	        {field:'title',title:'试卷名称',width:120,sortable : true,halign: 'center',align:'left'},    
	        {field:'totalsorce',title:'总分',width:40,sortable : true,halign: 'center',align:'right'},
	        {field:'totalshiti',title:'试题总数',width:60,sortable : true,halign: 'center',align:'right'},
	        {field:'name',title:'试卷分类',width:80,sortable : true,halign: 'center',align:'left'},
	        {field:'username',title:'创建人',width:80,sortable : true,halign: 'center',align:'left'}, 
	        {field:'insdate',title:'创建时间',width:60,sortable : true,halign: 'center',align:'center',formatter : fmdate2}, 
	        {field:'sjyl',title:'预览',width:60,sortable : true,halign: 'center',align:'center',formatter:fmSjYl},
	        {field:'review',title:'审核状态',width:60,sortable : true,halign: 'center',align:'center',styler : cellStylerReview2,formatter : fmReview2}  
	    ]],
	    
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
			$('.review_Shijuan').linkbutton({
				iconCls : 'icon-reload',
				plain : true
			});
		}
	});
}
//日期转换
function fmdate2(value, rowData, rowIndex) {
	if (value != null && value != '') {
		return fmtLongDate(new Date(value));
	}
	return "";
}

//查询函数
function seachShiJuanByParam() {
	var param = {
		title : $("#titleLike").val(),
		sjclassifyid : sjClassifyids,
		totalsorce : $("#totalsorceLike").val(),
		review : $("#shijuan_reviewLike").combobox('getValue'),
		insdate : $("#shijuan_dateLike").datebox('getValue')
	};
	$('#itemlist2').datagrid('load', param);
}


//审核状态
function fmReview2(value2, rowData2, rowIndex2) {

	if (value2 == 1) {
		return "<a href='javascript:;' class='blue_color_a' onclick='reviewShijuan(" + rowData2.review + "," + rowData2.sjid
					+ ");'>已审核</a>";
	} else {
		return "<a href='javascript:;' class='blue_color_a' onclick='reviewShijuan(" + rowData2.review + "," + rowData2.sjid
					+ ");'>未审核</a>";
	}
	
}
//试卷预览
function fmSjYl(value2, rowData2, rowIndex2){
	str = "<a href='javascript:;' onclick='showSj(" + rowData2.sjid + ")' class='see_qsn'>预览</a>";
	return str;
}
function showSj(id){
	window.parent.closeTabByTitle("试卷预览");
	window.parent.openTab("试卷预览", baseUrl+"/admin/T030/previewSj.html?sjid="+id);
}
//用户审核状态如果为未审核则变色提醒
function cellStylerReview2(value, row, index) {
	if (value <= 0 || !value) {
		return 'background-color:#FA8072;color:#fff;';
	}
}

//审核、冻结用户
function reviewShijuan(type, uid) {
	var dataParam = {
		review : false,
		id : uid
	};
	if (!type) {
		dataParam.review = true;
	}
	var str="确定选中的试卷状态改为“未审核”状态?";
	if(!type){
		str="确定选中的试卷状态改为“审核”状态?";
	}
	$.messager.confirm('操作提示', str, function(r) {
		if (r) {
			$.post(baseUrl + "/admin/E010/updMtaShiJuanReview.html", dataParam, function(data) {
				if (data == 0) {
					msgShow('操作失败，请稍后重试');
					return;
				}
				msgShow('操作成功!');
				$('#itemlist2').datagrid('reload');
			}, "json");
		}
	});
}
//刷新
function reloadGrid2() {
	$('#itemlist2').datagrid('clearSelections');
	$('#itemlist2').datagrid('reload');
}
//==========================试卷审核js结束===========================//
//==========================考试审核js===========================//
$(function(){
	
	creatGrid3(); 
	$('#searchKaoShiFenLei').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		onHidePanel : getKsChildren,//获取子节点
		url : baseUrl + '/admin/B010/findKaoShiClassAddALL.html',
		required : false
	});
	
});
var ksClassifyIds="";//全局变量
function getKsChildren() {
	var grouptree = $('#searchKaoShiFenLei').combotree('tree');//对应combotreeID
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
	ksClassifyIds=ids;//赋值给全局变量 记录所选分类全部ID
}
function creatGrid3() {
	$('#itemlist3').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : true,// 设置为true，当数据长度超出列宽时将会自动截取。
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
		url : baseUrl + '/admin/E010/findAllKaoShi.html',
		columns:[[    
	        {field:'ksname',title:'考试名称',width:100,sortable : true,halign: 'center',align:'left'},    
	        {field:'kscname',title:'考试分类名',width:80,sortable : true,halign: 'center',align:'left'},    
	        {field:'beginTm',title:'开始时间',width:80,sortable : true,halign: 'center',align:'center',formatter : fmdate3},
	        {field:'endTm',title:'结束时间',width:80,sortable : true,halign: 'center',align:'center',formatter : fmdate3},
	        {field:'insUser',title:'创建人',width:60,sortable : true,halign: 'center',align:'left'},
	        {field:'insDate',title:'创建时间',width:80,sortable : true,halign: 'center',align:'center',formatter : fmdate3},
	        {field:'review',title:'审核状态',width:80,sortable : true,halign: 'center',align:'center',styler : cellStylerReview3,formatter : fmReview3} 
	    ]],
	    
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
			$('.review_KaoShi').linkbutton({
				iconCls : 'icon-reload',
				plain : true
			});
		}
	});
}
//日期转换
function fmdate3(value, rowData, rowIndex) {
	if (value != null && value != '') {
		return fmtLongDate(new Date(value));
	}
	return "";
}
//查询函数
function seachKaoShiByParam() {
	var param = {
		name : $("#nameLike_ks").val(),
		ksClassifyId : ksClassifyIds,
		insuser : $("#insUserLike_ks").val(),
		insDate : $("#kaoshi_dateLike").datebox('getValue'),
		review : $("#kaoshi_reviewLike").combobox('getValue')
	};
	$('#itemlist3').datagrid('load', param);
}
//用户审核状态如果为未审核则变色提醒
function cellStylerReview3(value, row, index) {
	if (value <= 0 || !value) {
		return 'background-color:#FA8072;color:#fff;';
	}
}
//审核状态
function fmReview3(value3, rowData3, rowIndex3) {
		if (value3 == 1) {
			return "<a href='javascript:;' class='blue_color_a' onclick='reviewKaoShi(" + rowData3.review + "," + rowData3.ksid
						+ ");'>已审核</a>";
		} else {
			return "<a href='javascript:;' class='blue_color_a' onclick='reviewKaoShi(" + rowData3.review + "," + rowData3.ksid
						+ ");'>未审核</a>";
		}
}

//审核、冻结用户
function reviewKaoShi(type, uid) {
	var dataParam = {
		review : false,
		id : uid
	};
	if (!type) {
		dataParam.review = true;
	}
	var str="确定选中的考试状态改为“未审核”状态?";
	if(!type){
		str="确定选中的考试状态改为“审核”状态?";
	}
	$.messager.confirm('操作提示', str, function(r) {
		if (r) {
			$.post(baseUrl + "/admin/E010/updMtaKaoShiReview.html", dataParam, function(data) {
				if (data == 0) {
					msgShow('操作失败，请稍后重试');
					return;
				}
				msgShow('操作成功!');
				$('#itemlist3').datagrid('reload');
			}, "json");
		}
	});
}
//刷新
function reloadGrid3() {
	$('#itemlist3').datagrid('clearSelections');
	$('#itemlist3').datagrid('reload');
}
//==========================考试审核js结束===========================//
//==========================课程审核js===========================//
$(function(){
	
	creatGrid4(); 
	$('#searchKeChengFenLei').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : true,
		onHidePanel : getKcChildren,//获取子节点
		url : baseUrl + '/admin/B010/findKeChengAddALL.html',
		required : false
	});
	
});
var kcClassifyIds="";//全局变量
function getKcChildren() {
	var grouptree = $('#searchKeChengFenLei').combotree('tree');//对应combotreeID
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
	kcClassifyIds=ids;//赋值给全局变量 记录所选分类全部ID
}
function creatGrid4() {
	$('#itemlist4').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : true,// 设置为true，当数据长度超出列宽时将会自动截取。
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
		url : baseUrl + '/admin/E010/findAllKeCheng.html',
		columns:[[    
	        {field:'name',title:'课程名称',width:160,sortable : true,halign: 'center',align:'left'},    
	        {field:'kcflname',title:'课程分类',width:80,sortable : true,halign: 'center',align:'left'},    
	        {field:'beginTm',title:'开始时间',width:80,sortable : true,halign: 'center',align:'center',formatter : fmdate4},
	        {field:'endTm',title:'结束时间',width:80,sortable : true,halign: 'center',align:'center',formatter : fmdate4}, 
	        {field:'credit',title:'学分',width:40,sortable : true,halign: 'center',align:'right'},
	        {field:'insUser',title:'创建人',width:60,sortable : true,halign: 'center',align:'left'},  
	        {field:'insDate',title:'创建时间',width:80,sortable : true,halign: 'center',align:'center',formatter : fmdate4},  
	        {field:'review',title:'审核状态',width:60,sortable : true,halign: 'center',align:'center',styler : cellStylerReview4,formatter : fmReview4}  
	    ]],
	    
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
			$('.review_KeCheng').linkbutton({
				iconCls : 'icon-reload',
				plain : true
			});
		}
	});
}
//查询函数
function seachKeChengByParam() {
	var param = {
		name : $("#nameLike_kc").val(),
		kcclassifyId:kcClassifyIds,
		insUser:$("#insUserLike_kc").val(),
		insDate:$("#kecheng_dateLike").datebox('getValue'),
		review : $("#kecheng_reviewLike").combobox('getValue')
	};
	$('#itemlist4').datagrid('load', param);
}
//日期转换
function fmdate4(value, rowData, rowIndex) {
	if (value != null && value != '') {
		return fmtLongDate(new Date(value));
	}
	return "";
}
//用户审核状态如果为未审核则变色提醒
function cellStylerReview4(value, row, index) {
	if (value <= 0 || !value) {
		return 'background-color:#FA8072;color:#fff;';
	}
}
//审核状态
function fmReview4(value4, rowData4, rowIndex4) {

	if (value4 == 1) {
		return "<a href='javascript:;' class='blue_color_a' onclick='reviewKeCheng(" + rowData4.review + "," + rowData4.courseId
					+ ");'>已审核</a>";
	} else {
		return "<a href='javascript:;' class='blue_color_a' onclick='reviewKeCheng(" + rowData4.review + "," + rowData4.courseId
					+ ");'>未审核</a>";
	}
}


//审核、冻结用户
function reviewKeCheng(type, uid) {
	var dataParam = {
		review : false,
		id : uid
	};
	if (!type) {
		dataParam.review = true;
	}
	var str="确定选中的课程状态改为“未审核”状态?";
	if(!type){
		str="确定选中的课程状态改为“审核”状态?";
	}
	$.messager.confirm('操作提示', str, function(r) {
		if (r) {
			$.post(baseUrl + "/admin/E010/updMtaKeChengReview.html", dataParam, function(data) {
				if (data == 0) {
					msgShow('操作失败，请稍后重试');
					return;
				}
				msgShow('操作成功!');
				$('#itemlist4').datagrid('reload');
			}, "json");
		}
	});
}
//刷新
function reloadGrid4() {
	$('#itemlist4').datagrid('clearSelections');
	$('#itemlist4').datagrid('reload');
}

//排序
function datasort(a, b) {
	return (a > b ? 1 : -1);
}
//==========================课程审核js结束===========================//