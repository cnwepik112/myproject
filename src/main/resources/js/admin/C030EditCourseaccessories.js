$(function() {
	$('#editClassifyCombx').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,//不可编辑
		url : baseUrl + '/admin/B020/findAccessoriesClassifyTree.html',
		required : false
	});
	$('#updForm').form({
		url : "updAccessoriesInfo.html",
		onSubmit : function() {
			return $('#updForm').form("validate");
		},
		success : function(data) {
			if (data > 0) {
				$.messager.confirm('提示', '更新附件信息成功！', function(r) {
					if (r) {
						window.parent.closeTabByTitle("附件管理");
						window.parent.openTab("附件管理", "admin/C030ManageAccessories.html");
						window.parent.closeTabByTitle("编辑附件");
					}
				});

			} else {
				$.messager.alert('提示', '未知错误！请稍后重试', 'info');
			}
		}
	});
	if($("#accessoriesType").val()==1){
		//图片类
		creatPicGrid($("#editCourseaccessoriesId").val());
	}
});

/**
 * easyUi dataGrid注册方式说明，防止二次渲染 class注册方式一般是为了初始化属性，js方式则属性和事件都可初始化
 * 但是不管是class方式还是js方式注册组件，每次注册，只要被设置过url属性就会做请求。
 * 所以在不可避免要使用js方式注册的情况下，索性就不要使用class方式注册了。
 */
function creatPicGrid(id) {
	$('#picList').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		rownumbers : true,// 行号
		singleSelect:true,
		url : 'findContentByPic.html?accessoriesId='+id,
		columns : [ [ {
			field : 'picPath',
			title : '图片',
			width : 80,
			align : 'center',
			formatter : fmimage
		}, {
			field : 'picName',
			title : '图片名称',
			width : 100,
			align : 'center'
		}, {
			field : 'classifyName',
			title : '类型',
			width : 50,
			align : 'center'
		}, {
			field : 'sort',
			title : '排序',
			width : 80,
			align : 'center',
			formatter:sort

		}, {
			field : 'uploadTime',
			title : '上传时间',
			width : 80,
			align : 'center'
		} ] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
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
/**
 * 格式化图片
 */
function fmimage(value, rowData, rowIndex){
	return "<img src='"+value+"' style='width:50px;height:40px;border:1px solid #c3d9e0; margin:2px;'/>";
}

/**
 * 格式化排序
 */
function sort(value,rowData,rowIndex){
	return	"<a href='javascript:moveFirstSort();' title='置顶' class='move_first'></a>" +
			"<a href='javascript:moveUpSort();' title='上移' class='move_up'></a>" +
			"<a href='javascript:moveDownSort();' title='下移' class='move_down'></a>" +
			"<a href='javascript:moveLastSort();' title='置底' class='move_last'></a>";
}
/**
 * 向上排序
 */
function moveUpSort(){
	var rows =$('#picList').datagrid('getRows');
	var row=$('#picList').datagrid('getSelected');
	var index=$('#picList').datagrid('getRowIndex',row);
	if(index==0){
		msgShow("已经是第一个了");
		return;
	}
	var oldRow=rows[index-1];
	rows[index-1]=row;
	rows[index]=oldRow;
	$('#picList').datagrid('loadData',rows);
}

/**
 * 向下排序
 */
function moveDownSort(){
	var rows =$('#picList').datagrid('getRows');
	var row=$('#picList').datagrid('getSelected');
	var index=$('#picList').datagrid('getRowIndex',row);
	if((rows.length-1)==index){
		msgShow("已经是最后一个了");
		return;
	}
	var oldRow=rows[index+1];
	rows[index+1]=row;
	rows[index]=oldRow;
	$('#picList').datagrid('loadData',rows);
}

/**
 * 排序到第一个
 */
function moveFirstSort(){
	var rows =$('#picList').datagrid('getRows');
	var row=$('#picList').datagrid('getSelected');
	var index=$('#picList').datagrid('getRowIndex',row);
	if(index==0){
		msgShow("已经是第一个了");
		return;
	}
	var oldRow;
	for(var i=index-1;i>=0;i--){
		oldRow=rows[i];
		rows[i+1]=oldRow;
	}
	rows[0]=row;
	$('#picList').datagrid('loadData',rows);
}

/**
 * 排序到最后一个
 */
function moveLastSort(){
	var rows =$('#picList').datagrid('getRows');
	var length=rows.length;
	var row=$('#picList').datagrid('getSelected');
	var index=$('#picList').datagrid('getRowIndex',row);
	if(length-1==index){
		msgShow("已经是最后一个了");
		return;
	}
	var oldRow;
	for(var i=index+1;i<=length;i++){
		oldRow=rows[i];
		rows[i-1]=oldRow;
	}
	rows[length-1]=row;
	$('#picList').datagrid('loadData',rows);
}
/**
 * 更新附件
 */
function updForm() {
	if($("#accessoriesType").val()==1){
		var rows =$('#picList').datagrid('getRows');
		$("#url").val(JSON.stringify(rows));
	}
	$.messager.confirm('编辑提示', '确定更改此附件信息?', function(r) {
		if (r) {
			$('#updForm').submit();
			return false;
		}
	});
}