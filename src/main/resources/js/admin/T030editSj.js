var gridtype=0;
var classifyids="";//全局变量
var levelids="";//全局变量
var knowledgeids="";//全局变量
$(function() {
//	creatGrid();
	creatSjGrid();
	creatGdGrid();
	$('#shijuanclassify').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		url : baseUrl + '/admin/B010/findSjClass.html',
		required : true
	});
	$('#searchclassify').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		onHidePanel : getClassifyChildren,//获取子节点
		url : baseUrl + '/admin/B010/findQsnClassifyAddALL.html',
		required : false
	});
	$('#searchshititype').combobox({
		url :baseUrl + '/admin/B010/findQsnTypeAddAll.html',
		editable : false,
		required : false,
		valueField : 'sttypeid',
		textField : 'name'
	});
	$('#searchlevel').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		onHidePanel : getLevelChildren,//获取子节点
		url : baseUrl + '/admin/B010/findQsnLevelAddALL.html',
		required : false
	});
	$('#searchknowledge').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		onHidePanel : getKnowledgeChildren,//获取子节点
		url : baseUrl + '/admin/B010/findQsnKnowledgeAddALL.html',
		required : false
	});
	
	$('#qsnclassify').combotree({
		multiple : true,
		checkbox : true,
		lines : true,
		animate : true,
		editable : false,
		cascadeCheck : false,
		value:0,
		url : baseUrl + '/admin/B010/findQsnClassifyAddALL.html',
		onHidePanel:loadQsnCount,
		onCheck : checkTreeNode,
		required : false
	});
	$('#qsnshititype').combobox({
		url :baseUrl + '/admin/B010/findQsnTypeAddAll.html',
		editable : false,
		required : false,
		valueField : 'sttypeid',
		value:0,
		onChange:loadQsnCount,
		textField : 'name'
	});
	$('#qsnlevel').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		value:0,
		onChange:loadQsnCount,
		url : baseUrl + '/admin/B010/findQsnLevelAddALL.html',
		required : false
	});
	$('#qsnknowledge').combotree({
		multiple : true,
		checkbox : true,
		lines : true,
		animate : true,
		editable : false,
		cascadeCheck : false,
		value:0,
		onHidePanel:loadQsnCount,
		onCheck : checkKnowledgeTreeNode,
		url : baseUrl + '/admin/B010/findQsnKnowledgeAddALL.html',
		required : false
	});
	$('#gdQsn').dialog({
		fit:false,
		title : '固定试题选择',
		width:950,
		height:500,
		closed : true,
		modal : true,
		draggable:true,
		shadow : false,
		onClose:sumfen,
		onBeforeOpen:function(){
//			if(gridtype!=0){
				$('#itemlist').datagrid("clearSelections");
				$('#itemlist').datagrid("clearChecked");
//			}
		}
//	,
//		onOpen:function(){
//			if(gridtype==0){
//				gridtype==1;
//				creatGrid();
//			}
//		}
	});
	creatGrid();
	//随机试题选择弹出款
	$('#sjQsn').dialog({
		fit:false,
		title : '随机试题选择',
		width:400,
		height:400,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false,
		onOpen:function(){
			$.post(baseUrl + '/admin/T010/findQsnCount.html',function(data){
				$('#qsnclassify').combotree("clear");
				$('#qsnlevel').combotree("setValue",0);
				$('#qsnshititype').combobox("setValue",0);
				$('#qsnknowledge').combotree("clear");
				$("#qsnNum").numberspinner("setValue",0);
				$("#qsnCount").html(data);
				$("#qsnCount").attr("countid",data);
			},"json");
		},
		onClose:sumfen
	});
	$('#sjQsnGrid').dialog({
		fit:false,
		title : '随机试题预览',
		width:950,
		height:550,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	$('#gdQsnGrid').dialog({
		fit:false,
		title : '固定试题列表',
		width:950,
		height:550,
		closed : true,
		modal : true,
		draggable:false,
		shadow : false
	});
	
	$('#sjForm').form({
		url : baseUrl + '/admin/T030/saveShijuan.html',
		onSubmit : function() {
			var zf=$("#sjZF").val();
//			var intTpye=/^[1-9]+[0-9]*]*$/;
//			if(!intTpye.test(zf)){
//				msgShow("<span style='color:red'>试卷总分必须为正整数！</span>");
//				return false;
//			}
			if(zf<=0 || zf ==''){
				msgShow("<span style='color:red'>试卷总分不能为空或0！</span>");
				return false;
			}
			return $('#sjForm').form("validate");
		},
		success : function(data) {
			var resData=eval("("+data+")");
			if (resData.res > 0) {
				if(pageType == 0){
//					window.parent.closeTabByTitle("试卷管理");
					window.parent.closeTabByTitle("试卷预览");
//					window.parent.openTab("试卷管理", baseUrl+"/admin/T030/manageSj.html");
//					alert("保存成功！");
					window.parent.openTab("试卷预览", baseUrl+"/admin/T030/previewSjForExam.html?sjid="+resData.sjid);
					window.parent.closeTabByTitle("添加试卷");
				}else{
//					window.parent.closeTabByTitle("试卷管理");
					window.parent.closeTabByTitle("试卷预览");
//					window.parent.openTab("试卷管理", baseUrl+"/admin/T030/manageSj.html");
//					alert("保存成功！");
					window.parent.openTab("试卷预览", baseUrl+"/admin/T030/previewSjForExam.html?sjid="+resData.sjid);
					window.parent.closeTabByTitle("编辑试卷");
				}
			} else {
				msgShow("<span style='color:red'>未知错误！请稍后重试！</span>");
			}
		}
	});
	
	if(pageType == 1){
		getSjInfo();
	}
});
function checkTreeNode(node, checked) {
	if (checked) {
		if (typeof(node.children) != "undefined" && node.children != null) {
			var t = $('#qsnclassify').combotree('tree');
			var children = t.tree('getChildren', node.target);
			for ( var i = 0; i < children.length; i++) {
				t.tree('check', children[i].target);
			}
		}
	}
}
function checkKnowledgeTreeNode(node, checked) {
	if (checked) {
		if (typeof(node.children) != "undefined" && node.children != null) {
			var t = $('#qsnknowledge').combotree('tree');
			var children = t.tree('getChildren', node.target);
			for ( var i = 0; i < children.length; i++) {
				t.tree('check', children[i].target);
			}
		}
	}
}
function getClassifyChildren() {
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
	classifyids=ids;//赋值给全局变量 记录所选分类全部ID
}
function getLevelChildren() {
	var grouptree = $('#searchlevel').combotree('tree');//对应combotreeID
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
	levelids=ids;//赋值给全局变量 记录所选分类全部ID
}
function getKnowledgeChildren() {
	var grouptree = $('#searchknowledge').combotree('tree');//对应combotreeID
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
	knowledgeids=ids;//赋值给全局变量 记录所选分类全部ID
}
function noSubmit(){
	$.messager.confirm('确认','您还没有保存试卷，确认返回试卷管理吗？',function(r){    
		if (r) {
			window.parent.closeTabByTitle("试卷管理");
			window.parent.openTab("试卷管理", baseUrl + "/admin/T030/manageSj.html");
			window.parent.closeTabByTitle("编辑试卷");
		}
	}); 
	
}
/**
 * easyUi dataGrid注册方式说明，防止二次渲染 class注册方式一般是为了初始化属性，js方式则属性和事件都可初始化
 * 但是不管是class方式还是js方式注册组件，每次注册，只要被设置过url属性就会做请求。
 * 所以在不可避免要使用js方式注册的情况下，索性就不要使用class方式注册了。
 */
//选择固定试题列表
function creatGrid() {
	$('#itemlist').datagrid(
		{
			fit : true,// 设置为true时铺满它所在的容器.
			fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
			nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
			striped : true,// 设置为true将交替显示行背景。
			idField : 'qsnid',
			collapsible : true,// 定义是否显示可折叠按钮。
			singleSelect : false,// 设置为true将只允许选择一行。
			border : false,
			remoteSort : false,// 定义是否通过远程服务器对数据排序。
			pagination : true,// 分页组件是否显示
			pageNumber : 1,// 起始页
			pageSize : 10,// 每页显示的记录条数，默认为10
			pageList : [ 10, 20, 50 ],// 每页显示多少行
			rownumbers : true,// 行号
			url : baseUrl + '/admin/T010/findQsnList.html',
//			checkOnSelect:false,
			frozenColumns : [ [ {
				field : 'select',
				title : '选择',
				width : 50,
				checkbox : true
			} ] ],
			columns : [ [{
				field : 'title',
				title : '题目',
				width : 200,
				fixed : true,
				align : 'left',
				sortable : true,
				sorter : datasort,
				formatter:titleLength
			}, {
				field : 'classifyname',
				title : '试题分类',
				width : 80,
				sortable : true,
				sorter : datasort,
				align : 'left'
			}, {
				field : 'shititypename',
				title : '试题类型',
				width : 80,
				sortable : true,
				sorter : datasort,
				align : 'left'
			}, {
				field : 'levelname',
				title : '试题难度',
				width : 80,
				sortable : true,
				sorter : datasort,
				align : 'left'
			}, {
				field : 'knowledgename',
				title : '试题知识点',
				width : 80,
				sortable : true,
				sorter : datasort,
				align : 'left'
			}, {
				field : 'username',
				title : '创建人',
				width : 80,
				align : 'left',
				sortable : true
			} ] ]
		});
}
//查看固定试题列表
function creatGdGrid() {
	$('#gdGrid').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
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
		url : baseUrl + '/admin/T010/findGdQsnList.html',
		queryParams:{
			ids:",0"
		},
		columns : [ [ {
			field : 'title',
			title : '题目',
			width : 200,
			fixed : true,
			align : 'left',
			sortable : true,
			sorter : datasort,
			formatter : titleLength
		}, {
			field : 'classifyname',
			title : '试题分类',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'shititypename',
			title : '试题类型',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'levelname',
			title : '试题难度',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'knowledgename',
			title : '试题知识点',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'username',
			title : '创建人',
			width : 80,
			align : 'left',
			sortable : true
		} ,{
			field : 'manage',
			title : '操作',
			align : 'center',
			width : 80,
			formatter : fmup
		} ] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
			$('.drop_qsn').linkbutton({
				iconCls : 'icon-no',
				plain : true
			});
		}
	});
}
//查看随机试题列表
function creatSjGrid() {
	$('#sjGrid').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : false,// 分页组件是否显示
		rownumbers : true,// 行号
		url : baseUrl + '/admin/T010/findSjQsnList.html',
		queryParams:{
			randnum:0
		},
		columns : [ [ {
			field : 'title',
			title : '题目',
			width : 200,
			fixed : true,
			align : 'left',
			sortable : true,
			sorter : datasort,
			formatter : titleLength
		}, {
			field : 'classifyname',
			title : '试题分类',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'shititypename',
			title : '试题类型',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'levelname',
			title : '试题难度',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'knowledgename',
			title : '试题知识点',
			width : 80,
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'username',
			title : '创建人',
			width : 80,
			align : 'left',
			sortable : true
		} ] ]
	});
}

function fmup(value, rowData, rowIndex) {
	var id = rowData.qsnid;
	var str = "<a onclick='delGDgridRow("+id+");' class='drop_qsn' >删除</a>";
	return str;
}
//function titleLength(value, rowData, rowIndex){
//	if(value.length>15){
//		return value.substr(0,15);
//	}
//	return value;
//}
function titleLength(value, rowData, rowIndex){
	var strArray=value.split("<img");
	var res=value;
	if(strArray.length > 0){
		for(var i=0;i<strArray.length;i++){
			var str=strArray[i];
			if(str.indexOf("src")>0){
				str=str.substr(0,str.indexOf("/>")+2);
				var imgStr="<img"+str;
				res=res.replace(imgStr,"");
			}
		}
	}
	var vArray=res.split("<video");
	if(vArray.length > 0){
		for(var i=0;i<vArray.length;i++){
			var str=vArray[i];
			if(str.indexOf("/video")>0){
				str=str.substr(0,str.indexOf("</video>")+8);
				var vStr="<video"+str;
				res=res.replace(vStr,"[影音文件]");
			}
		}
	}
	var wvArray = res.split("<embed");
	if(wvArray.length > 0){
		for(var i=0;i<wvArray.length;i++){
			var str=wvArray[i];
			if(str.indexOf("type")>0){
				str=str.substr(0,str.indexOf("/>")+2);
				var vStr="<embed"+str;
				res=res.replace(vStr,"[影音文件]");
			}
		}
	}
	if(res.length>15){
		return res.substr(0,15);
	}
	return res;
}
// 排序
function datasort(a, b) {
	return (a > b ? 1 : -1);
}
//记录选择行
var oldIndex=0;
//行号
var tdindex=1;
function addTableRow() {
	var tdHtml="<tr height='35px'>" +
			"<td align='left'><input id='ms_"+tdindex+"' class='input_user_info' indexid='"+tdindex+"' style='width:100%;height:25px;' type='text'/></td>" +
			"<td align='center'><a id='gdxz_"+tdindex+"' indexid='"+tdindex+"' onclick='showGdDia(this);'>固定选题</a></td>" +
			"<td align='center'><a href='javascript:;' indexid='"+tdindex+"' class='blue_color_a' id='gdnum_"+tdindex+"' onclick='showGdGridDia(this)'>0</a>" +
			"<input type='hidden' id='gdQsnids_"+tdindex+"'></td>" +
			"<td align='center'><a id='sjxz_"+tdindex+"' indexid='"+tdindex+"' onclick='showSjDia(this);'>随机抽题</a></td>" +
			"<td align='center'><a href='javascript:;' indexid='"+tdindex+"' class='blue_color_a' id='sjnum_"+tdindex+"' onclick='showSjGridDia(this)'>0</a>" +
			"<input type='hidden' id='sjQsnCs_"+tdindex+"'></td>" +
			"<td align='center'><input type='text' id='fen_"+tdindex+"' onblur='qsnFenOnkeyup(this.id)' value='0' style='width:60px;height:25px;border: 1px solid #c3d9e0;text-align:center;'/></td>" +
			"<td align='center'><a id='manage_"+tdindex+"' indexid='"+tdindex+"' onclick='delSjMessage(this);'>删除</a></td>" +
			"</tr>";
	$('#sjInfoTable').append(tdHtml);
	$('#gdxz_'+tdindex).linkbutton({
		iconCls : 'icon-add',
		plain:true
	});
	$('#sjxz_'+tdindex).linkbutton({
		iconCls : 'icon-add',
		plain:true
	});
	$('#manage_'+tdindex).linkbutton({
		iconCls : 'icon-no',
		plain:true
	}); 
	tdindex++;
}
//当试题分数输入时触发，如果输入非数字则赋值为0
function qsnFenOnkeyup(obj){
	var fenvalue=$("#"+obj).val();
	var re = /^[0-9]\d*([.][1-9])?$/;
	if(!re.test(fenvalue)){
		$.messager.alert('提示','每题分数必须为正整数或一位小数，如：0.5！');    
		$("#"+obj).val(0);
	}
	if(parseFloat(fenvalue) > 100){
		$.messager.alert('提示','每题分数不可大于100');    
		$("#"+obj).val(0);
	}
	sumfen();
}
//计算总分
function sumfen(){
	var items=$("#sjInfoTable").find("input.input_user_info");
	var sjfenSum=0;
	var qsnCountSum=0;
	for(var i=0;i<items.length;i++){
		var indexid=$(items[i]).attr("indexid");
		var gdnum=$("#gdnum_"+indexid).html();
		var sjnum=$("#sjnum_"+indexid).html();
		var fen=$('#fen_'+indexid).val();
		var qsnfenSum=(parseInt(gdnum)+parseInt(sjnum))*fen;
		sjfenSum=sjfenSum+qsnfenSum;
		qsnCountSum=qsnCountSum+(parseInt(gdnum)+parseInt(sjnum));
	}
	$('#sjZF').val(sjfenSum);
	$('#qsnCountSum').val(qsnCountSum);
}
//删除段落
function delSjMessage(obj){
	var indexid=$(obj).attr("indexid");
	var delIds=$("#gdQsnids_"+indexid).val();
	var oldAllQsnIds=$("#gdQsnList").val();
	var newAllQsnIds=oldAllQsnIds.replace(delIds,"");
	$("#gdQsnList").val(newAllQsnIds);
	$(obj).parent().parent().remove();
	sumfen();
}
//显示选择固定试题列表
function showGdDia(obj){
	$('#gdQsn').dialog("open");
	oldIndex=$(obj).attr("indexid");
	seachQsnByParam();
}
//显示随机试题参数
function showSjDia(obj){
	$('#sjQsn').dialog("open");
	oldIndex=$(obj).attr("indexid");
	
}
//显示查看随机试题列表
function showSjGridDia(obj){
	$('#sjQsnGrid').dialog("open");
	oldIndex=$(obj).attr("indexid");
	if($("#sjQsnCs_"+oldIndex).val() != '' && $("#sjQsnCs_"+oldIndex).val() != null){
		var data=eval("(" + $("#sjQsnCs_"+oldIndex).val() + ")");
		$('#sjGrid').datagrid("load",data);
	}
}
//显示已选择固定试题列表
function showGdGridDia(obj){
	$('#gdQsnGrid').dialog("open");
	oldIndex=$(obj).attr("indexid");
	var oldQsnIds=$("#gdQsnids_"+oldIndex).val();
	if(oldQsnIds != '' && oldQsnIds != null){
		$('#gdGrid').datagrid("load",{ids:oldQsnIds});
	}
}
//删除已选择的固定试题
function delGDgridRow(qsnid){
	var oldQsnIds=$("#gdQsnids_"+oldIndex).val();
	var oldArray=oldQsnIds.split(",");
	var oldAllQsnIds=$("#gdQsnList").val();
	var oldAllArray=oldAllQsnIds.split(",");
	var newQsnids="";
	var newAllQsnids="";
	for(var i=1;i<oldArray.length;i++){
		if(parseInt(oldArray[i]) != qsnid){
			newQsnids += ","+oldArray[i];		
		}
	}
	for(var i=1;i<oldAllArray.length;i++){
		if(parseInt(oldAllArray[i]) != qsnid){
			newAllQsnids += ","+oldAllArray[i];		
		}
	}
	var qsnCount=newQsnids.split(",").length-1;
	if(newQsnids=="" || newQsnids ==null){
		$('#gdGrid').datagrid("load",{ids:",0"});
		qsnCount=0;
	}else{
		$('#gdGrid').datagrid("load",{ids:newQsnids});
	}
	$("#gdnum_"+oldIndex).html(qsnCount);
	$("#gdQsnids_"+oldIndex).val(newQsnids);
	$("#gdQsnList").val(newAllQsnids);
	sumfen();
}
//更新试题列表
function reloadGrid(){
	$('#itemlist').datagrid("reload");
}
//查询固定试题
function seachQsnByParam() {
	var param = {
		title : '',
		shititypeid : 0,
		knowledgeid :'',
		classifyid :'',
		levelid :'',
		qsnids:""
	};

	var search_title = $("#searchtitle").val();
	var search_shititypeid = $('#searchshititype').combotree('getValue');
//	var search_knowledgeid = $('#searchknowledge').combotree('getValue');
//	var search_classifyid = $('#searchclassify').combotree('getValue');
	var search_levelid = $('#searchlevel').combotree('getValue');
//	var classifyids="";//全局变量
//	var levelids="";//全局变量
//	var knowledgeids="";//全局变量
	var search_knowledgeid =knowledgeids;
	var search_classifyid = classifyids;
//	var search_levelid = levelids;
	var search_qsnids=$("#gdQsnList").val();
	//alert($('#searchlevel').combotree('getValue'));
	
	param.title = search_title;
	param.shititypeid = search_shititypeid;
	param.knowledgeid = search_knowledgeid;
	param.classifyid = search_classifyid;
	param.levelid = search_levelid;
	param.qsnids = search_qsnids;

	$('#itemlist').datagrid('load', param);
}
//保存已选择的固定试题
function showSelectSum(){
	var items=$('#itemlist').datagrid("getSelections");
	for(var i=0;i<items.length;i++){
		var oldIds=$("#gdQsnids_"+oldIndex).val();
		var oldAllIds=$("#gdQsnList").val();
		$("#gdQsnids_"+oldIndex).val(oldIds+","+items[i].qsnid);
		$("#gdQsnList").val(oldAllIds+","+items[i].qsnid);
	}
	var oldQsnIds=$("#gdQsnids_"+oldIndex).val();
	var qsnCount=oldQsnIds.split(",").length-1;
	$("#gdnum_"+oldIndex).html(qsnCount);
	$('#gdQsn').dialog("close");
}
//加载随机试题总题数
function loadQsnCount(){
	var cid=$('#qsnclassify').combotree("getValues");
	var lid=$('#qsnlevel').combotree("getValue");
	var tid=$('#qsnshititype').combobox("getValue");
	var kid=$('#qsnknowledge').combotree("getValues");
	$.post(baseUrl + '/admin/T010/findQsnCount.html',
		{classifyid:cid.join(","),shititypeid:tid,levelid:lid,knowledgeid:kid.join(",")},
		function(data){
			$("#qsnCount").html(data);
			$("#qsnCount").attr("countid",data);
		},
		"json");
}
//保存随机试题参数
function saveSjQSN(){
	var num=$("#qsnNum").numberspinner("getValue");
	if(num<0 || num==null || num==''){
		msgShow("<span style='color:red'>请填写试题数量！</span>");
		return;
	}
	if(num>300){
		msgShow("<span style='color:red'>试题数量不能大于300！</span>");
		return;
	}
	var qsnCount=$("#qsnCount").attr("countid");
	if(num>parseInt(qsnCount)){
		msgShow("<span style='color:red'>所填试题数量大于总数量！</span>");
		return;
	}
	var cid=$('#qsnclassify').combotree("getValues");
	if(cid.length <= 0){
		msgShow("<span style='color:red'>请选择试题分类！</span>");
		return;
	}
//	if(cid.length>num){
//		msgShow("<span style='color:red'>试题数量小于所选分类数量！</span>");
//		return;
//	}
	var lid=$('#qsnlevel').combotree("getValue");
	var tid=$('#qsnshititype').combobox("getValue");
	var kid=$('#qsnknowledge').combotree("getValues");
	if(kid.length <= 0){
		msgShow("<span style='color:red'>请选择试题知识点！</span>");
		return;
	}
	var param="{classifyid:'"+cid.join(",")+"',shititypeid:"+tid+",levelid:"+lid+",knowledgeid:'"+kid.join(",")+"',randnum:"+num+"}";
	$("#sjnum_"+oldIndex).html(num);
	$("#sjQsnCs_"+oldIndex).val(param);
	$('#sjQsn').dialog("close");
}
//保存试卷信息
function saveShiJuan(){
//	$.post(baseUrl+ "/admin/T030/getKsSj.html",{sjid:rsjid},function(data){
//		if(data>0){
//			msgShow("<span style='color:red'>此试卷已应用禁止修改！</span>");
//		}else{
			var okstate=fmtSjJson();
			if(okstate!="ok"){
				msgShow("<span style='color:red'>"+okstate+"</span>");
				return;
			}
			$('#sjForm').submit();
			return false;
//		}
//	},"json");	
} 
//组织段落数据
function fmtSjJson(){
	var allQsnids=$("#gdQsnList").val();
	var d_dlmix={"allids":allQsnids};
	var d_xtmix={};
	var pJson={
		"d_dlmix":d_dlmix,
		"d_xtmix":d_xtmix
	};
	var items=$("#sjInfoTable").find("input.input_user_info");
	for(var i=0;i<items.length;i++){
		var indexid=$(items[i]).attr("indexid");
		var sjQsnCsValue=$("#sjQsnCs_"+indexid).val();
		var qsnFen=parseFloat($("#fen_"+indexid).val());
		if(qsnFen==0){
			return "段落"+(i+1)+"分数不能为0";
			break;
		}
		var key=(i+1)+"";
		d_dlmix[key]={"t":$(items[i]).val(),"ids":$("#gdQsnids_"+indexid).val(),"fen":qsnFen};
		
		if(sjQsnCsValue != '' && sjQsnCsValue != null){
			var data=eval("(" + sjQsnCsValue + ")");
			d_xtmix[key]={
					"did":i+1,
					"classifyid":data.classifyid,
					"shititypeid":data.shititypeid,
					"levelid":data.levelid,
					"knowledgeid":data.knowledgeid,
					"num":data.randnum,
					"fen":qsnFen
					};
		}
		
	}
	var jsonStr=JSON.stringify(pJson);
	$("#dlInfo").val(jsonStr);
	return "ok";
}
//加载试卷信息
function getSjInfo(){
	$.post(baseUrl+ "/admin/T030/getSjInfoById.html",{sid:rsjid},function(data){
		$('#shijuanclassify').combotree("setValue",data.sjclassifyid);
		$('#sjtitle').val(data.title);
		$('#sjDesEditor').val(data.des);
		$('#sjid').val(data.sjid);
		$('#qsnCountSum').val(data.totalshiti);
		$('#sjZF').val(data.totalsorce);
		$('#gdQsnList').val(data.des);
//		$('#sjDesEditor').val(data.des);
		var dlItems=eval("("+data.dDlmix+")");
		var xtItems=eval("("+data.dXtmix+")");
		$('#gdQsnList').val(dlItems.allids);
		delete dlItems.allids;
		var num=1;
		var sjInx=1;
		for(var i in dlItems){
			var gdids=dlItems[num+""].ids.split(",");
			var gdCount=gdids.length-1;
			var tdHtml="<tr height='35px'>" +
			"<td align='left'><input id='ms_"+num+"' class='input_user_info' indexid='"+num+"' style='width:100%;height:25px;' type='text' value='"+dlItems[num+""].t+"'/></td>" +
			"<td align='center'><a id='gdxz_"+num+"' indexid='"+num+"' onclick='showGdDia(this);'>固定选题</a></td>" +
			"<td align='center'><a href='javascript:;' indexid='"+num+"' class='blue_color_a' id='gdnum_"+num+"' onclick='showGdGridDia(this)'>"+gdCount+"</a>" +
			"<input type='hidden' id='gdQsnids_"+num+"' value='"+dlItems[num+""].ids+"'/></td>" +
			"<td align='center'><a id='sjxz_"+num+"' indexid='"+num+"' onclick='showSjDia(this);'>随机抽题</a></td>" +
			"<td align='center'><a href='javascript:;' indexid='"+num+"' class='blue_color_a' id='sjnum_"+num+"' onclick='showSjGridDia(this)'>0</a>" +
			"<input type='hidden' id='sjQsnCs_"+num+"'></td>" +
			"<td align='center'><input type='text' id='fen_"+num+"' onblur='qsnFenOnkeyup(this.id)' value='"+dlItems[num+""].fen+"' style='width:60px;height:25px;border: 1px solid #c3d9e0;text-align:center;'/></td>" +
			"<td align='center'><a id='manage_"+num+"' indexid='"+num+"' onclick='delSjMessage(this);'>删除</a></td>" +
			"</tr>";
			$('#sjInfoTable').append(tdHtml);
			$('#gdxz_'+num).linkbutton({
				iconCls : 'icon-add',
				plain:true
			});
			$('#sjxz_'+num).linkbutton({
				iconCls : 'icon-add',
				plain:true
			});
			$('#manage_'+num).linkbutton({
				iconCls : 'icon-no',
				plain:true
			}); 
			num++;
		}
		for(var j in xtItems){
			$("#sjnum_"+sjInx).html(xtItems[sjInx+""].num);
			var param="{classifyid:'"+xtItems[sjInx+""].classifyid+"',shititypeid:"+xtItems[sjInx+""].shititypeid+",levelid:"+xtItems[sjInx+""].levelid+",knowledgeid:'"+xtItems[sjInx+""].knowledgeid+"',randnum:"+xtItems[sjInx+""].num+"}";
			$("#sjQsnCs_"+sjInx).val(param);
			sjInx++;
		}
		tdindex=num;
	},"json");
}