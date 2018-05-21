/**
 *评价管理js
 * 
 * @since 2015/07/22
 * @author Limeng
 */
$(function() {
	
	creatGrid();
	
	//设置编辑窗口参数
	$('#updateWin').window({
		width : 400,
		height : 500,
		draggable : false,
		resizable : false,
		collapsible : false,
		minimizable : false,
		maximizable :false,
		closable : true,
		closed : true,
		inline : true,
		title : '编辑评价',
		modal : true
	});
	
});


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
		url : 'showAllAppraise.html',
		toolbar : '#tbar',
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			sortable : true,
			checkbox : true
		} ] ],
		columns : [ [ {
			field : 'name',
			title : '课程名称',
			width : 80,
			sortable : true,
			halign: 'center',
			align : 'left'
		}, {
			
			field : 'userName',
			title : '用户名称',
			width : 80,
			sortable : true,
			halign: 'center',
			align : 'left'
		}, {
			field : 'appraise',
			title : '评价',
			width : 50,
			sortable : true,
			halign: 'center',
			align : 'center',
			formatter : fmAppShow
		}, {
			field : 'content',
			title : '评价内容',
			width : 120,
			sortable : true,
			halign: 'center',
			align : 'left'
		}, {
			field : 'insDate',
			title : '创建时间',
			width : 80,
			sortable : true,
			halign: 'center',
			align : 'center',
			formatter : fmdate
		}, {
			field : 'interpretation',
			title : '解释说明',
			width : 80,
			sortable : true,
			halign: 'center',
			align : 'left'
		},{

			field : 'manage',
			title : '操作',
			align : 'center',
			width : 120,
			formatter : fmup
		} ] ],
		 //当数据载入成功时触发。
		onLoadSuccess : function(data) {
			
			$('.edit_app').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
			$('.drop_app').linkbutton({
				iconCls : 'icon-no',
				plain : true
			});
		}
	});

}

//排序
function datasort(a, b) {
	return (a > b ? 1 : -1);
}

function fmup(value, rowData, rowIndex) {
	
	var id = rowData.id;
	var str="<a onclick='openUpdWin("+ id+ ")' class='edit_app'>编辑</a>";
	str += "<a onclick='delAppById("+ id+ ");' class='drop_app' >删除</a>";
	return str;
}

//日期转换
function fmdate(value, rowData, rowIndex) {
	return fmtLongDate(new Date(value));
}

//评价转换
function fmAppShow(value, rowData, rowIndex){
	
	if(value == 1){
		return "好评";
	}else if(value == 0){
		return "中评";
	}else if(value == -1){
		return "差评";
	}
	
}

//查询
function getLike() {
	
	var name=$("#name").val();
	var userName=$("#username").val();
	var param = {
		name : name,
		userName : userName
	};

	$('#itemlist').datagrid('load', param);
}

//打开编辑窗口
function openUpdWin(id) {
	$.post("findUpdApp.html", {
		id : id
	}, function(data) {	
		
		$("#pj_id").val(data.id);
		$("#kc_name").html(data.name);
		$("#yh_name").html(data.userName);
		if(data.appraise == 0){
			$("#pj_combobox").combobox('select',0);
		}
		if(data.appraise == 1){
			$("#pj_combobox").combobox('select',1);
		}
		if(data.appraise == -1){
			$("#pj_combobox").combobox('select',-1);
		}
		
		$("#pj_content").textbox('setValue',data.content);
		
		$("#js_interpret").textbox('setValue',data.interpretation);
		
	}, "json");
	//打开编辑窗口弹出
	$('#updateWin').window('open');
}
//评价更新
$(function(){
	$("#updAppFrom").form({
		url : "updApp.html",
		onSubmit : function() {
			
			return $('#updAppFrom').form("validate");
		},
		success : function(data) {
			if (data > 0) {
				$('#updateWin').window("close");
				reloadGrid();
				msgShow("<span style='color:black'>评价修改成功！</span>");
			} else if (data == 0) {
				msgShow("<span style='color:red'>该评价已存在！</span>");
			} else {
				msgShow("<span style='color:red'>未知错误！请稍后重试！</span>");
			}
		}
	});
});
function subupdAppForm(){
	$("#updAppFrom").submit();
	return false;
}
//刷新
function reloadGrid() {
	$('#itemlist').datagrid('clearSelections');
	$('#itemlist').datagrid('reload');
}

//删除单个评价
function delAppById(mId) {
	$.messager.confirm('删除提示', '确定要删除这条数据?', function(r) {
		
		if (r) {
			$.post("delAppById.html", {
				id : mId
			}, function(data) {
				if (data > 0) {
					msgShow('删除成功');
					reloadGrid();
				} else {
					msgShow('删除失败，请稍后重试');
					reloadGrid();
				}
			}, "json");
		}
	});	
}

//删除所选评价
function delAppBySelect() {
	var items = $('#itemlist').datagrid('getSelections');
	if (items.length <= 0) {
		msgShow('请选择要删除的数据');
		return;
	}else{
		$.messager.confirm('删除提示', '确定要删除选中数据?', function(r) {
			if (r) {
				delApp();
			}
		});
	}
}

function delApp() {
	var items_id = new Array();
	var items = $('#itemlist').datagrid('getSelections');
	if (items.length <= 0) {
		msgShow('请选择要删除的数据');
		return;
	}
	// 获取选中消息的ID，并组成集合
	for ( var i = 0; i < items.length; i++) {
		items_id.push(items[i].id);
	}

	$.post("deleteBySelected.html", {
		mid : items_id
	}, function(data) {
		if (data > 0) {
			msgShow('删除成功');
			reloadGrid();
		} else {
			msgShow('删除失败，请稍后重试');
			reloadGrid();
		}
	}, "json");
}

//打开添加评价
function addCouAppInfo(){
	
	window.parent.openTab("添加评价", "admin/addCouAppInfo.html");
}











