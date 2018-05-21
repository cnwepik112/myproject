/**
 * 职位管理js
 * 
 * @author LiMeng
 * 
 * @since 2015/07/06
 */
$(function(){
	creatGrid();
	//设置编辑窗口参数
	$('#updateWin').window({
		width : 800,
		height : 500,
		draggable : false,
		resizable : false,
		collapsible : false,
		minimizable : true,
		maximizable : true,
		closable : true,
		closed : true,
		inline : true,
		title : '编辑职位',
		modal : true
	});
});

/**
 * easyUi dataGrid注册方式说明，防止二次渲染 class注册方式一般是为了初始化属性，js方式则属性和事件都可初始化
 * 但是不管是class方式还是js方式注册组件，每次注册，只要被设置过url属性就会做请求。
 * 所以在不可避免要使用js方式注册的情况下，索性就不要使用class方式注册了。
 */
function creatGrid() {
	$('#itemlist').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		checkOnSelect:false,//点复选框才选中
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : false,// 分页组件是否显示
		pageNumber : 1,// 起始页
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50 ],// 每页显示多少行
		rownumbers : true,// 行号
		url : baseUrl +"/admin/U060/showAllPos.html",
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
			title : '职位名称',
			width : 50,
			sortable : true,
			halign: 'center',
			align : 'left'
		}, {
			
			field : 'des',
			title : '职位描述',
			width : 180,
			sortable : true,
			halign: 'center',
			align : 'left'
		}, {
			
			field : 'sortBtn',
			title : '排序',
			width : 100,
			sortable : true,
			halign: 'center',
			align : 'center',
			formatter: sort
		}, {
			field : 'manage',
			title : '操作',
			align : 'center',
			width : 100,
			formatter : fmup
		} ] ],

		 //当数据载入成功时触发。
		onLoadSuccess : function(data) {
			
			$('.edit_cert').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
			$('.drop_cert').linkbutton({
				iconCls : 'icon-no',
				plain : true
			});
			$('.copy_role').linkbutton({
				iconCls : 'icon-copy',
				plain : true
			});
			$('.move_first').linkbutton({
				iconCls : 'icon-top',
				plain : true
			});
			$('.move_up').linkbutton({
				iconCls : 'icon-up',
				plain : true
			});
			$('.move_down').linkbutton({
				iconCls : 'icon-down',
				plain : true
			});
			$('.move_last').linkbutton({
				iconCls : 'icon-bottom',
				plain : true
			});
		}
	});
}
function sort(value,rowData,rowIndex){
	var positionid=rowData.positionid;
	return "<a href='javascript:moveFirstSort("+positionid+");;' title='置顶' id='move_first"+positionid+"' class='move_first'></a><a href='javascript:moveUpSort("+positionid+");' title='上移' id='move_up"+positionid+"' class='move_up'></a><a onclick='javascript:moveDownSort("+positionid+");' title='下移' " +
			"id='move_down"+positionid+"' class='move_down'></a><a onclick='javascript:moveLastSort("+positionid+");;' title='置底' id='move_last"+positionid+"' class='move_last'></a>";
}

function fmup(value, rowData, rowIndex) {
	
	var id = rowData.positionid;
	var str="<a onclick='openUpdWin("+ id+ ")' class='edit_cert'>编辑</a>";
	str += "<a onclick='delPosById("+ id+ ");' class='drop_cert' >删除</a>";
	return str;
}
//排序
function datasort(a, b) {
	return (a > b ? 1 : -1);
}
//==============排序函数=================//
function moveUpSort(id){
	//alert(id);
	var thisTr = $("#move_up"+id).parent().parent().parent();
	var prevTr = thisTr.prev();
	var param = {"positionid":id};
	$.ajax({
		url : baseUrl +"/admin/U060/moveUpSortPos.html",
		async : false,
		type : 'post',
		data : param,
		dataType : 'json',
		success : function(data){
			var tmp =prevTr.clone();
			prevTr.remove();
			thisTr.after(tmp);
			reloadGrid();
		}
	});
}
function moveDownSort(id){
var thisTr = $("#move_down"+id).parent().parent().parent();
var prevTr = thisTr.next();
var param = {"positionid":id};
$.ajax({
	url : baseUrl +"/admin/U060/moveDownSortPos.html",
	async : false,
	type : 'post',
	data : param,
	dataType : 'json',
	success : function(data){
		var tmp =prevTr.clone();
		prevTr.remove();
		thisTr.before(tmp);
		reloadGrid();
	}
});
}
function moveFirstSort(id){
	var thisTr = $("#move_first"+id).parent().parent().parent();
	var firstTr = thisTr.parent().find("tr:first");
	var param = {"positionid":id};
	$.ajax({
		url : baseUrl +"/admin/U060/moveFirstSortPos.html",
		//url : "#.html",
		async : false,
		type : 'post',
		data : param,
		dataType : 'json',
		success : function(data){
			if(data!='已经是第一个了'){
				var tmp = thisTr.clone();
				thisTr.remove();
				firstTr.before(tmp);
				reloadGrid();
			}
		}
	});

}
function moveLastSort(id){
var thisTr = $("#move_last"+id).parent().parent().parent();
var lastTr = thisTr.parent().find("tr:last");
var param = {"positionid":id};
$.ajax({
	url : baseUrl +"/admin/U060/moveLastSortPos.html",
	async : false,
	type : 'post',
	data : param,
	dataType : 'json',
	success : function(data){
		if(data !='已经是最后一个了'){
			var tmp = thisTr.clone();
			thisTr.remove();
			lastTr.after(tmp);
			reloadGrid();
		}
	}
});

}
//==============排序函数结束=================//
//打开新建职位
function addPosInfo() {
	window.parent.openTab("新建职位", baseUrl +"/admin/U060/AddPosition.html");
}

//查找
function findPos(){
	var posName=$("#PosName").val();
	$('#itemlist').datagrid('load', {    
		name: posName  
	});
}

//删除单个职位
function delPosById(mId) {
	$.messager.confirm('删除提示', '确定要删除这条数据?', function(r) {
		
		if (r) {
			$.post(baseUrl +"/admin/U060/deletePos.html", {
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
//删除所选职位提示
function delSelectPos() {
	var items = $('#itemlist').datagrid('getSelections');
	if (items.length <= 0) {
		msgShow('请选择要删除的数据');
		return;
	}else{
		$.messager.confirm('删除提示', '确定要删除选中数据?', function(r) {
			if (r) {
				delSelPos();
			}
		});
	}
}
// 删除所选职位
function delSelPos() {
	var items_id = new Array();
	var items = $('#itemlist').datagrid('getSelections');
	if (items.length <= 0) {
		msgShow('请选择要删除的数据');
		return;
	}
	// 获取选中消息的ID，并组成集合
	for ( var i = 0; i < items.length; i++) {
		items_id.push(items[i].positionid);
	}
	
	
	$.post(baseUrl +"/admin/U060/deleteSelectPos.html", {
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

//打开编辑窗口
function openUpdWin(id) {
	$.post(baseUrl +"/admin/U060/findUpdPos.html", {
		id : id
	}, function(data) {	
		$("#positionid").val(data.positionid);
		$("#name_upd").val(data.name);
		$('#des_upd').textbox('setValue',data.des);
		$("#sort").val(data.sort);
	}, "json");
	//打开编辑窗口弹出
	$('#updateWin').window('open');
}

//职位更新
$(function(){
	$("#updPosFrom").form({
		url : baseUrl +"/admin/U060/updPos.html",
		onSubmit : function() {
			return $('#updPosFrom').form("validate");
		},
		success : function(data) {
			if (data > 0) {
				$('#updateWin').window("close");
				reloadGrid();
				msgShow("<span style='color:black'>数据修改成功！</span>");
			} else if (data == 0) {
				msgShow("<span style='color:red'>该数据已存在！</span>");
			} else {
				msgShow("<span style='color:red'>未知错误！请稍后重试！</span>");
			}
		}
	});
});

function subUpdPosForm(){
	var des = $("#des_upd").textbox('getValue');
	if(des == null || des == ""){
		msgShow("<span style='color:red'>描述没有填写！</span>");
		return ;
	}
	$("#updPosFrom").submit();
	return false;
}

//刷新
function reloadGrid() {
	$('#itemlist').datagrid('clearSelections');
	$('#itemlist').datagrid('reload');
}

