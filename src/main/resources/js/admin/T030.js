$(function() {
	creatGrid();
	$('#searchclassify').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		panelMinWidth:200,
		panelMaxWidth:300,
		panelMaxHeight:200,
		onHidePanel : getChildren,//获取子节点
		url : baseUrl + '/admin/B010/findShiJuanClassAddALL.html',
		required : false
	});
});
var classifyids="";//全局变量
function getChildren() {
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
/**
 * easyUi dataGrid注册方式说明，防止二次渲染 class注册方式一般是为了初始化属性，js方式则属性和事件都可初始化
 * 但是不管是class方式还是js方式注册组件，每次注册，只要被设置过url属性就会做请求。
 * 所以在不可避免要使用js方式注册的情况下，索性就不要使用class方式注册了。
 */
function creatGrid() {
	$('#itemlist').datagrid(
		{
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
			url : baseUrl + '/admin/T030/findShijuanList.html',
			toolbar : '#tbar',
			frozenColumns : [ [ {
				field : 'select',
				title : '选择',
				width : 50,
				checkbox : true
			} ] ],
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
				width : 50,
				sortable : true,
				sorter : datasort,
				align : 'right'
			}, {
				field : 'review',
				title : '审核状态',
				width : 60,
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
				width : 80,
				align : 'center',
				sortable : true,
				sorter : datasort,
				formatter : fmdate
			},{
				field : 'manage',
				title : '操作',
				align : 'center',
				width : 230,
				formatter : fmup
			} ] ],
			// 当数据载入成功时触发。
			onLoadSuccess : function(data) {
				$('.edit_qsn').linkbutton({
					iconCls : 'icon-edit',
					plain : true
				});
				$('.see_qsn').linkbutton({
					iconCls : 'icon-search',
					plain : true
				});
				$('.dowload_sj').linkbutton({
					iconCls : 'icon-download',
					plain : true
				});
				$('.drop_qsn').linkbutton({
					iconCls : 'icon-no',
					plain : true
				});
			}
		});

}
var code=["","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
function titleLength(value, rowData, rowIndex){
	if(value.length>15){
		return value.substr(0,15);
	}
	return value;
}
function fmReview(value, rowData, rowIndex){
	if(value){
		return "已审核";
	}
	return "未审核";
}

function fmup(value, rowData, rowIndex) {
	var id = rowData.sjid;
	var str = "<a onclick='updSj(" + id +")' class='edit_qsn'>编辑</a>";
	str += "<a onclick='showSj(" + id + ")' class='see_qsn'>预览</a>";
	str += "<a onclick='dowLoadSJ(" + id + ")' class='dowload_sj'>下载</a>";
	str += "<a onclick='delSjById(" + id + ");' class='drop_qsn' >删除</a>";
	return str;
}
// 排序
function datasort(a, b) {
	return (a > b ? 1 : -1);
}

// 日期转换
function fmdate(value, rowData, rowIndex) {
	// fmtLongDate--common.js
	if (value != null && value != '') {
		return fmtLongDate(new Date(value));
	}
	return "";
}

// 删除试题提示
function delSjMessage() {
	
	$.messager.confirm('删除提示', '确定要删除选中的试卷?', function(r) {
		if (r) {
			delSj();
		}else{
			$('#itemlist').datagrid('clearSelections');
		}
	});
}
// 删除试题
function delSj() {
	var items_id = new Array();
	var items = $('#itemlist').datagrid('getSelections');
	if (items.length <= 0) {
		$.messager.alert('提示', '请选择要删除的试卷', 'info');
		return;
	}
	// 获取选中试题的ID，并组成集合
	for ( var i = 0; i < items.length; i++) {
		items_id.push(items[i].sjid);
	}
	$.post(baseUrl + '/admin/T030/updSjDel.html', {
		sids : items_id
	}, function(data) {
		if (data > 0) {
			msgShow('删除成功!');
			reloadGrid();
		} else {
			msgShow('删除失败，请稍后重试');
			reloadGrid();
		}
	}, "json");
}
//删除试题
function delSjById(sjid) {
	var items_id = new Array();
	items_id.push(sjid);
	$.messager.confirm('删除提示', '确定要删除选中的试卷?', function(r) {
		if (r) {
			$.post(baseUrl + '/admin/T030/updSjDel.html', {
				sids : items_id
			}, function(data) {
				if (data > 0) {
					msgShow('删除成功!');
					reloadGrid();
				} else {
					msgShow('删除失败，请稍后重试');
					reloadGrid();
				}
			}, "json");
		}else{
			$('#itemlist').datagrid('clearSelections');
		}
	});
}
//刷新
function reloadGrid() {
	$('#itemlist').datagrid('clearSelections');
	$('#itemlist').datagrid('reload');
}
// 查询
function seachSjByParam() {
	var param = {
		title : '',
		sjclassifyid : '',
		username : ''
	};

	var search_title = $("#searchtitle").val();
	var search_classifyid = classifyids;
	var search_user = $("#searchuser").val();
	param.title = search_title;
	param.sjclassifyid = search_classifyid;
	param.username = search_user;
	
	$('#itemlist').datagrid('load', param);
}
//添加试卷
function editSj() {
	window.parent.closeTabByTitle("添加试卷");
	window.parent.openTab("添加试卷", baseUrl+"/admin/T030/addSjJsp.html?type=add&sjid=0");
	window.parent.closeTabByTitle("试卷管理");
}
//编辑试卷
function updSj(id){
	window.parent.closeTabByTitle("编辑试卷");
	window.parent.openTab("编辑试卷", baseUrl+"/admin/T030/addSjJsp.html?type=upd&sjid="+id);
	window.parent.closeTabByTitle("试卷管理");
}
function showSj(id){
	window.parent.closeTabByTitle("试卷预览");
	window.parent.openTab("试卷预览", baseUrl+"/admin/T030/previewSjForExam.html?sjid="+id);
	window.parent.closeTabByTitle("试卷管理");
}
function dowLoadSJ(id){
	window.location.href=baseUrl+"/admin/T030/dowloadSjWord.html?sjid="+id;
}