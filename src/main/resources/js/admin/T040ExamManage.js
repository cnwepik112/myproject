$(function() {
	// 加载查询列表
	creatGrid();
	// 考试分类
	$('#examClassifyCombox').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,//不可编辑
		onHidePanel : getChildren,//获取子节点
		url : baseUrl + '/admin/B010/findKaoShiClassAddALL.html',
		required : false
	});
});
var classifyids="";//全局变量
function getChildren() {
	var grouptree = $('#examClassifyCombox').combotree('tree');//对应combotreeID
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
//刷新
function reloadGrid() {
	$('#examList').datagrid('clearSelections');
	$('#examList').datagrid('reload');
}
function creatGrid() {
	$('#examList').datagrid({
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
		url : baseUrl + "/admin/T040/examList.html",
		toolbar : '#tbar',
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			checkbox : true
			} ] ],
		columns : [ [ {
				field : 'ksname',
				title : '考试名称',
				width : 100,
				align : 'center',
				sortable : true
			}, {
				field : 'classifyName',
				title : '考试分类',
				width : 80,
				sortable : true,
				align : 'center'
			}, {
				field : 'totalsorce',
				title : '考试总分',
				width : 40,
				sortable : true,
				align : 'center'
			}, {
				field : 'okrate',
				title : '及格分数',
				width : 40,
				sortable : true,
				align : 'right'
	
			}, {
				field : 'review',
				title : '审核状态',
				width : 50,
				sortable : true,
				align : 'center'
	
			}, {
				field : 'examdate',
				title : '考试日期',
				width : 200,
				sortable : true,
				align : 'center'
	
			}, {
				field : 'insUser',
				title : '创建人',
				width : 60,
				sortable : true,
				align : 'center'
			}, {
				field : 'updDate',
				title : '更新时间',
				width : 80,
				sortable : true,
				align : 'center'
			}, {
				field : 'id',
				title : '操作',
				align : 'center',
				width : 150,
				formatter : operate
			} ] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
			$('.copy_course').linkbutton({
				iconCls : 'icon-copy',
				plain : true
			});
			$('.edit_course').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
			$('.drop_course').linkbutton({
				iconCls : 'icon-no',
				plain : true
			});
		}
	});
}

//操作
function operate(value, rowData, rowIndex) {
//	if(rowData.kaStatus == 0){
		return "<a onclick='copyById(" + value + ")' class='copy_course'>复制</a>" +
			"<a onclick='editById(" + value + ")' class='edit_course'>编辑</a>" +
			"<a onclick='delById(" + value + ")' class='drop_course' >删除</a>";
//	}else{
//		return "<a onclick='copyById(" + value + ")' class='copy_course'>复制</a>" +
//		"<a onclick='editById(" + value + ")' class='edit_course' data-options='disabled:true'>编辑</a>" +
//		"<a onclick='delById(" + value + ")' class='drop_course' data-options='disabled:true'>删除</a>";
//	}
}

function delById(id){
	$.messager.confirm('删除提示', '确定要删除选中考试?', function(r) {
		if (r) {
			var ids = new Array();
			ids.push(id);
			$.ajax({
				url: 'delExam.html',
				type:'post',
				data: {'ids':ids},
				success : function(result){
					$('#examList').datagrid('reload');
				}
			});
		}
	});
}

function deleteExam(){
	$.messager.confirm('删除提示', '确定要删除选中考试?', function(r) {
		if (r) {
			var items = $('#examList').datagrid('getSelections');
			var ids = new Array();
			for(var i in items){
				ids.push(items[i].id);
			}
			$.ajax({
				url: 'delExam.html',
				data: {'ids':ids},
				type: 'post',
				dataType: 'json',
				success : function(result){
					$('#examList').datagrid('reload');
				}
			});
		}
	});
}

function copyById(id){
	window.parent.closeTabByTitle("复制考试");
    window.parent.openTab("复制考试", baseUrl + "/admin/T040/copyExam.html?id="+id);
}

function queryExamData(){
	var ksClassifyId = classifyids;
	if(ksClassifyId == 0){
		ksClassifyId = '';
	}
	var name = $("#examNameBox").val();
	var insuser = $("#createPeople").val();
	$('#examList').datagrid('load',{
		ksClassifyId:ksClassifyId,
		name:name,
		insuser:insuser
	});
}

//添加考试
function addExam() {
	window.parent.openTab("添加考试", baseUrl + "/admin/T040/addExamLoad.html?sjid=0");
}

//编辑考试
function editById(id) {
//	$.messager.confirm('警告！', '修改考试将会导致成绩丢失或正在考试的考生无法交卷，请慎重修改！', function(r) {
//		if (r) {
			window.parent.closeTabByTitle("编辑考试");
			window.parent.openTab("编辑考试", baseUrl + "/admin/T040/examUpdate.html?id="+id);
//		}
//	});
}
