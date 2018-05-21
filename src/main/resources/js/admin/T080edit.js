var gridtype=0;
$(function() {
	// 用户未添加列表
	createUnAddUserGrid();
	// 用户已添加列表
	createAddedUserGrid();
	//已选择试卷列表
	creatAddedShijuanGrid();
	createTree();
	// 试卷分类
	$('#searchclassify').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		onHidePanel : getShijuanChildren,//获取子节点
		url : baseUrl + '/admin/B010/findShiJuanClassAddALL.html',
		required : false
	});
	//本地上传加载上传的FileInput
	$('#uploadCoverFile').filebox({
		buttonText: '选择封面',
		onChange: function (newValue, oldValue) {
				var validateType=validateFileType(newValue);
				if(!validateType){
					msgShow("请上传gif、jpg、png格式的图片");
					return;
				}
				$('#uploadForm').submit();
			}
	});
	//添加表单加载验证
	$('#addForm').form({
		url :  baseUrl + '/admin/T080/saveExercise.html',
		onSubmit : function() {
			var sjValue = $("#shijuanId").val();
			if(sjValue == '' || sjValue == null){
				msgShow("<span style='color:red'>请选择试卷！</span>");
				return false;
			}
			$.messager.progress({
				msg:'正在保存，请稍后...',
				text:'loading'
			});
			
			if(!$('#addForm').form("validate")){
				$.messager.progress('close');
			}
			return $('#addForm').form("validate");
		},
		success : function(data) {
			$.messager.progress('close');
			if(data>0){
				if(pageType == 0){
					window.parent.closeTabByTitle("练习作业管理");
					window.parent.openTab("练习作业管理", baseUrl+"/admin/T080/manageEx.html");
					window.parent.closeTabByTitle("添加练习");
				}else{
					window.parent.closeTabByTitle("练习作业管理");
					window.parent.openTab("练习作业管理", baseUrl+"/admin/T080/manageEx.html");
					window.parent.closeTabByTitle("编辑练习");
				}
			}else{
				msgShow("<span style='color:red'>未知错误！请稍后重试！</span>");
			}
		}
	});
	// 上传课程封面Form绑定
	$('#uploadForm').form({
		url : baseUrl + '/admin/T080/uploadExImg.html',
		onSubmit : function() {
			return $('#uploadForm').form("validate");
		},
		success : function(data) {
			var obj = eval('(' + data + ')');
			if(obj.status=="success"){
				//上传成功
				$("#cover").val(obj.url);
				$("#coverPic").attr("src",obj.url);
				//msgShow("上传成功");

			}else if(obj.status=="typeError"){

				msgShow("上传类型错误");

			}else{
				msgShow("上传异常");
			}
		}
	});
	$('#chooseExamPaperWin').dialog({
		fit:false,
		title : '选择试卷',
		width:800,
		height:490,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false,
		onOpen:function(){
			if(gridtype==0){
				gridtype==1;
				// 试卷选择列表
				creatExamPaperGrid();
			}
		}
		
	});
	$('#updGroupIdsDia').dialog({
		title : '用户组',
		closed : true,
		modal : true,
		shadow : false
	});
	
	$('#positionCombox').combobox({
		url : baseUrl +'/admin/U060/findPositionAddAll.html',
		editable : false,
		required : false,
		valueField : 'positionid',
		textField : 'name'
	});
	//用户组分类
	$('#userGroupComboxTree').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		panelMinWidth:200,
		panelMaxWidth:300,
		panelMaxHeight:200,
		url :baseUrl + '/admin/U030/findGroupAddALL.html',
		required : false,
		onHidePanel : getChildren
	});
	if(pageType == 1){
		getExInfo();
	}
});
var sjClassifyids="";//全局变量
function getShijuanChildren() {
	var grouptree = $('#searchclassify').combotree('tree');//对应combotreeID
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
//创建未添加用户列表
function createUnAddUserGrid() {
	$('#unAddUserList').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		idField:'userid',
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		rownumbers : true,// 行号
		pagination : true,// 分页组件是否显示
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50 ],// 每页显示多少行
		url:baseUrl + '/admin/U010/findUserForLearn.html',
		queryParams:{
			groupids:",0"
		},
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			checkbox : true
		} ] ],
		columns : [ [  {
			field : 'username',
			title : '用户名',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'realname',
			title : '真实姓名',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'nickname',
			title : '昵称',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'rolename',
			title : '角色',
			width : 80,
			align : 'left',
			sortable : true,
			sorter : datasort

		}, {
			field : 'groupname',
			title : '所属用户组',
			width : 80,
			align : 'left',
			sortable : true,
			sorter : datasort
		}, {
			field : 'positionname',
			title : '职位',
			width : 80,
			align : 'left',
			sortable : true,
			sorter : datasort
		} ] ]
	});
}
//创建已添加用户列表
function createAddedUserGrid() {
	$('#addedUserList').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		idField:'userid',
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		rownumbers : true,// 行号
		pagination : false,// 分页组件是否显示
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50 ],// 每页显示多少行
		url:baseUrl + '/admin/U010/findUserForLearn.html',
		queryParams:{
			groupids:",0"
		},
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			checkbox : true
		} ] ],
		columns : [ [  {
			field : 'username',
			title : '用户名',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'realname',
			title : '真实姓名',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'nickname',
			title : '昵称',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'rolename',
			title : '角色',
			width : 80,
			align : 'left',
			sortable : true,
			sorter : datasort

		}, {
			field : 'groupname',
			title : '所属用户组',
			width : 80,
			align : 'left',
			sortable : true,
			sorter : datasort
		}, {
			field : 'positionname',
			title : '职位',
			width : 80,
			align : 'left',
			sortable : true,
			sorter : datasort
		}] ]
	});
}
//试卷列表
function creatExamPaperGrid() {
	$('#examPaperList').datagrid({
		fit:true,
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		rownumbers:true,// 行号
		border : false,
		idField:'sjid',
		singleSelect:true,// 设置为true将只允许选择一行。
		pagination : true,// 分页组件是否显示
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		rownumbers : true,// 行号
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50 ],// 每页显示多少行
		url : baseUrl + '/admin/T030/findShijuanList.html',
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			checkbox : true
		}] ],
		columns : [ [ {
			field : 'title',
			title : '试卷名称',
			width : 200,
			fixed : true,
			align : 'left',
			sortable : true,
			sorter : datasort,
			formatter:titleLength
		}, {
			field : 'name',
			title : '试卷分类',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'totalsorce',
			title : '试卷总分',
			width : 50,
			sortable : true,
			sorter : datasort,
			align : 'right'
		}, {
			field : 'totalshiti',
			title : '试题总数',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'right'
		}, {
			field : 'review',
			title : '审核状态',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left',
			formatter:fmReview
		},{
			field : 'username',
			title : '创建人',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'insdate',
			title : '创建时间',
			width : 120,
			align : 'center',
			sortable : true,
			sorter : datasort,
			formatter : fmdate
		}] ]
	});
}
//已选择试卷列表
function creatAddedShijuanGrid() {
	$('#addedShijuanList').datagrid({
		fit:true,
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		rownumbers:true,// 行号
		border : false,
		singleSelect:false,// 设置为true将只允许选择一行。
		pagination : false,// 分页组件是否显示
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		rownumbers : true,// 行号
//		pageSize : 10,// 每页显示的记录条数，默认为10
//		pageList : [ 10, 20, 50 ],// 每页显示多少行
//		url : baseUrl + '/admin/T030/findShijuanList.html',
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			checkbox : true
		}] ],
		columns : [ [ {
			field : 'title',
			title : '试卷名称',
			width : 200,
			fixed : true,
			align : 'left',
			sortable : true,
			sorter : datasort,
			formatter:titleLength
		}, {
			field : 'name',
			title : '试卷分类',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'totalsorce',
			title : '试卷总分',
			width : 50,
			sortable : true,
			sorter : datasort,
			align : 'right'
		}, {
			field : 'totalshiti',
			title : '试题总数',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'right'
		}, {
			field : 'review',
			title : '审核状态',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left',
			formatter:fmReview
		},{
			field : 'username',
			title : '创建人',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'insdate',
			title : '创建时间',
			width : 120,
			align : 'center',
			sortable : true,
			sorter : datasort,
			formatter : fmdate
		}] ]
	});
}
function titleLength(value, rowData, rowIndex){
	if(value.length>15){
		return value.substr(0,15)+"...";
	}
	return value;
}
function fmReview(value, rowData, rowIndex){
	if(value){
		return "已审核";
	}
	return "未审核";
}

// 排序
function datasort(a, b) {
	return (a > b ? 1 : -1);
}
function fmup(value, rowData, rowIndex) {
	var str= "<a onclick='dropAddedUser("+rowIndex+");' class='drop_user' >删除</a>";
	return str;
}
// 日期转换
function fmdate(value, rowData, rowIndex) {
	// fmtLongDate--common.js
	if (value != null && value != '') {
		return fmtLongDate(new Date(value));
	}
	return "";
}
//根据条件查询用户
function findUsersByCondition(){
	// 用户组
	var groupId = $("input:hidden[name='groupid']").val();
	//职位ID
	var positionId = $("input:hidden[name='positionid']").val();
	$('#unAddUserList').datagrid({url : baseUrl + '/admin/T080/findUsers.html'});
	$('#unAddUserList').datagrid('load', {
		groupid : groupId,
		positionid : positionId
	});
}

//根据条件查询试卷
function seachSjByParam() {
	var param = {
		title : '',
		sjclassifyid :'',
		username : ''
	};

	var search_title = $("#searchtitle").val();
	var search_classifyid = sjClassifyids;
	var search_user = $("#searchuser").val();
	param.title = search_title;
	param.sjclassifyid = search_classifyid;
	param.username = search_user;
	$('#examPaperList').datagrid('load', param);
}
//打开试卷窗口
function openExamShiJuanWin(){
	$('#chooseExamPaperWin').dialog('open');
}

//保存试卷
function saveExamShiJuan(){
	var item = $('#examPaperList').datagrid('getSelected');
	$("#sjZF").val(item.totalsorce);
	$("#shijuanId").val(item.sjid);
//	$('#addedShijuanList').datagrid('deleteRow',0);
	var rows=$('#addedShijuanList').datagrid('getRows');
	if(rows.length>0){
		$('#addedShijuanList').datagrid('updateRow',{index:0,row:item});
	}else{
		$('#addedShijuanList').datagrid('appendRow',item);
	}
	$('#chooseExamPaperWin').dialog('close');
}
//删除试卷
function delExamShiJuan(){
	
	var items = $('#addedShijuanList').datagrid('getSelections');
	if (items.length <= 0) {
		$.messager.alert('提示', '请选择要删除的试卷', 'info');
		return;
	}
	$.messager.confirm('删除提示', '确定要删除选中试卷?<br/>提示：练习必须添加试卷！', function(r) {
		if (r) {
			$("#sjZF").val(0);
			$("#shijuanId").val("");
			$('#addedShijuanList').datagrid('deleteRow',0);
			$('#addedShijuanList').datagrid('clearSelections');
		}else{
			$('#addedShijuanList').datagrid('clearSelections');
		}
	});
}

//实现选中子节点不关联父节点，选中父节点选中子节点
function checkTreeNode(node, checked) {
	if (checked) {
		if (node.children != null) {
			var children = $('#userGroup').tree('getChildren', node.target);
			for ( var i = 0; i < children.length; i++) {
				$('#userGroup').tree('check', children[i].target);
			}
		}
	}
}
/**
 * 验证文件类型
 * 
 * @param fileName
 * @returns {Boolean}
 */
function validateFileType(fileName){

	//获取文件的扩展名
	var dotNdx = fileName.lastIndexOf('.');

	//扩展名变成小写
	var exetendName = fileName.slice(dotNdx + 1).toLowerCase();

	//定义返回值
	var checkType=false;

	//判断类型
	checkType = exetendName=="png"||exetendName=="jpg"||exetendName=="gif";

	//返回文件类型的验证值
	return checkType;
}
//选择用户
function selectedUsers(){
	var items_uid = "";
	var userItems = $('#addedUserList').datagrid('getRows');
	// 获取选中用户的ID和姓名，并组成集合
	for ( var i = 0; i < userItems.length; i++) {
		items_uid+=","+userItems[i].userid;
	}
	$("#userIds").val(items_uid);
}
function addExerciseForm(){
	selectedUsers();
	$('#addForm').submit();
	return false;
}
//创建tree
function createTree() {
	$('#userGroup').tree({
		checkbox : true,
		lines : true,
		animate : false,
		cascadeCheck : false,
		url : baseUrl + '/admin/U030/findGroupAddALL.html',
		onCheck : checkTreeNode,
		onLoadSuccess:function(){
			$('#usersDia').dialog({
				title : '用户',
				closed : true,
				modal : true,
				shadow : false
			});
		}
	});
}

//打开用户组dialog
function openGroupDlg(){
	$('#updGroupIdsDia').dialog("open");
}
//打开用户dialog
function openUsersDlg(){
	var items=$('#addedUserList').datagrid("getRows");
	var useridstr="";
	for(var i=0;i<items.length;i++){
		useridstr+=","+items[i].userid;
	}
	var treeItems=$('#userGroup').tree('getChildren');
	var groupidstr="";
	for(var i=0;i<treeItems.length;i++){
		if(treeItems[i].id != 0){
			groupidstr+=","+treeItems[i].id;
		}
	}
	//加载权限下非选中用户
	$('#unAddUserList').datagrid("load",{userids:useridstr,groupids:groupidstr});
	$('#usersDia').dialog("open");
}
//删除选中用户
function dropAddedUser(){
	var rows=$('#addedUserList').datagrid("getSelections");
	for(var i=0;i<rows.length;){
		var index=$('#addedUserList').datagrid("getRowIndex",rows[i]);
		$('#addedUserList').datagrid("deleteRow",index);
	}	
}
//根据选择用户组加载用户
function searchGroupUsers(){
	var items=$('#userGroup').tree('getChecked');
	var groupidstr="";
	for(var i=0;i<items.length;i++){
		if(items[i].id != 0){
			groupidstr+=","+items[i].id;
		}
	}
	$('#groupids').val(groupidstr);
	$('#addedUserList').datagrid("load",{groupids:groupidstr});
	$('#updGroupIdsDia').dialog("close");
}

//查询用户
function seachUserByParam() {
	var items=$('#addedUserList').datagrid("getRows");
	var useridstr="";
	for(var i=0;i<items.length;i++){
		useridstr+=","+items[i].userid;
	}
	var treeItems=$('#userGroup').tree('getChildren');
	var groupidstr="";
	for(var i=0;i<treeItems.length;i++){
		if(treeItems[i].id != 0){
			groupidstr+=","+treeItems[i].id;
		}
	}
	var ingroupids = $('#ingroupids').val();
	if(ingroupids != "" && ingroupids != null){
		groupidstr=","+ingroupids;
	}
	var param = {
			username : '',
//			groupid : 0,
			positionid:0,
			userids:useridstr,
			groupids:groupidstr
	};
	
	var search_username = $("#userLike").val();
//	var search_groupid = $('#userGroupComboxTree').combotree('getValue');
	var search_positionid=$('#positionCombox').combobox('getValue');
	param.username = search_username;
//	param.groupid = search_groupid;
	param.positionid = search_positionid;

	$('#unAddUserList').datagrid('load', param);
}
//获得所选用户组节点及子节点,暂未调用
function getChildren() {
	var grouptree = $('#userGroupComboxTree').combotree('tree');
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
	$("#ingroupids").val(ids);
}
//向已选择用户追加用户
function addUsersTOAddedGrid(){
	var rows=$('#unAddUserList').datagrid("getSelections");
	for(var i=0;i<rows.length;i++){
//		var index=$('#unAddUserList').datagrid("getRowIndex",rows[i]);
		$('#addedUserList').datagrid("appendRow",rows[i]);
//		$('#unAddUserList').datagrid("deleteRow",index);
	} 
	$('#unAddUserList').datagrid("clearSelections");
	seachUserByParam();
}
//编辑时加载练习信息
function getExInfo(){
	$.post(baseUrl+ "/admin/T080/findExerciseById.html",{exid:rexid},function(data){
		$("#coursewareName").val(data.ex.name);
		$("#courseDesc").val(data.ex.des);
		$("#sjZF").val(data.ex.totalsorce);
		$("#cover").val(data.ex.pic);
		$("#userIds").val(data.userids);
		$("#shijuanId").val(data.ex.sjid);
		$("#coverPic").attr("src",data.ex.pic);
		$("#cc").combobox("setValue",data.ex.totaltm);
		$("#studyTimeStart").datetimebox("setValue",data.ex.begintm);
		$("#studyTimeEnd").datetimebox("setValue",data.ex.endtm);
		if(data.userids != ""){
			$('#addedUserList').datagrid("load",{uids:data.userids});
		}
		$('#addedShijuanList').datagrid({
			url:baseUrl + '/admin/T030/findShijuanById.html',
			queryParams:{
				sjid:data.ex.sjid
			}
		});
	},"json");
}