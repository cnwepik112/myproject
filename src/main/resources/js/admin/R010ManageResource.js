$(function() {
	//选择资源类型
	creatForm();
	$("li").click(function(){
		$("#typeVal").val($(this).attr("id"));
		$(this).addClass("selecthover").siblings().removeClass("selecthover");
	});
	//创建资源添加弹出框
	creatGrid();
	$('#newaddSource').dialog({
		title : '资源添加',
		closed : true,
		width:715,
		heigth:200,
		modal : true,
		shadow : false,
		onOpen:function(){
			$("li:first").click();
			$('#uploadFile').filebox({
				buttonText: '选择文件',
				prompt:'请选择文件...',
				onChange: function (newValue, oldValue) {
					var validateType=validateFileType(newValue);
					if(!validateType){
						msgShow("上传类型错误");
						return;
					}
					$('#uploadForm').submit();
					return false;
				}
			});
		}
	});
	$('#addSource').click(function(){
		//打开增加资源窗口
		$('#newaddSource').dialog('open');
	});
	//提交form （选择文件类型，进入方法）
	$("#updResourceForm").form({
		url : "updResource.html",
		onSubmit : function() {
			return $("#updResourceForm").form("validate");
		},
		success : function(data) {
			if (data > 0) {
				msgShow("更新成功！");
				$("#updateWin").window("close");
				$("#resourceList").datagrid("reload");
			} else {
				$.messager.alert('提示','未知错误！请稍后重试','info');
			}
		}
	});
	//定义编辑资源窗口
	$('#updateWin').window({
		width : 400,
		height : 240,
		draggable : false,
		resizable : false,
		collapsible : false,
		minimizable : true,
		maximizable : true,
		closable : true,
		closed : true,
		inline : true,
		title : '编辑资源',
		modal : true
	});
	$('#resourceClassifyCombx').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		url : baseUrl + '/admin/B020/findResourcesClassifyTree.html',
		required : false
	});
	$('#editresourceClassifynewCombx').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		url : baseUrl + '/admin/B020/findResourcesClassifyTree.html',
		required : false
	});
	//课件分类下拉列表
	$('#classifyid').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		url : baseUrl + '/admin/B020/findResourcesClassifyTree.html',
		required : false
		
	});
	$('#saveResource').form({
		url : baseUrl + "/admin/R010/updResourceInfo.html",
		onSubmit : function() {
			return $('#saveResource').form("validate");
		},
		success : function(data) {
			if(data>0){
				msgShow("保存成功！");
				$('#newaddSource').dialog('close');
				$('#resourceList').datagrid('reload');
			}
		}
	});
});
function submitResourceForm(){
	$('#saveResource').submit();
}
function creatForm(){
	$('#uploadForm').form({
		url : baseUrl + "/admin/R010/addMtaSysResource.html",
		onSubmit : function() {
			return $('#uploadForm').form("validate");
		},
		success : function(data) {	
			var obj = eval('(' + data + ')');
			if(obj.status=="success"){
				//加载进度
				loadProgress();
				$("#resourceId").val(obj.resourceId);
				$("#typeValNew").val(obj.type);
//				$("#fileRadioNew").val(obj.fileOne);
				$("#fileSize").val(obj.fileSize);
				$("#content").val(obj.content);
				msgShow("上传成功");
			}else if(obj.status=="typeError"){
				msgShow("上传类型错误");
			}else{
				msgShow("上传异常");
			}
		}
	});
}
function creatGrid() {
	$('#resourceList').datagrid({
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
		url : baseUrl + '/admin/R010/showMtaSysResource.html',
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 30,
			checkbox : true
		} ] ],
		columns : [ [ 
//		{
//			field : 'resourceId',
//			title : 'ID',
//			width : 30,
//			halign: 'center',
//			sortable : true,
//			sorter : datasort,
//			align : 'right'
//		},
		{
			field : 'resourceName',
			title : '资源名称',
			width : 180,
			halign: 'center',
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'type',
			title : '类型',
			width : 80,
			halign: 'center',
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'classifyName',
			title : '资源分类',
			width : 80,
			halign: 'center',
			sortable : true,
			sorter : datasort,
			align : 'left'
		},{
			field : 'size',
			title : '大小',
			width : 80,
			halign: 'center',
			sortable : true,
			sorter : datasort,
			align : 'right'
		},{
			field : 'downloads',
			title : '下载次数',
			width : 80,
			halign: 'center',
			sortable : true,
			sorter : datasort,
			align : 'right'
		},
		{
			field : 'userName',
			title : '创建人',
			width : 100,
			halign: 'center',
			sortable : true,
			sorter : datasort,
			align : 'left'
		}, {
			field : 'updDate',
			title : '上传时间',
			width : 150,
			halign: 'center',
			sortable : true,
			sorter : datasort,
			align : 'center'
		}, 
		{
			field : 'manage',
			title : '操作',
			align : 'center',
			width : 100,
			formatter : fmup
		} ] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
			$('.edit_resource').linkbutton({
				iconCls : 'icon-edit',
				plain : true
			});
			$('.drop_resource').linkbutton({
				iconCls : 'icon-no',
				plain : true
			});
		}
	});
}
function fmup(value, rowData, rowIndex) {
	var id = rowData.resourceId;
	var str="<a onclick='openUpdWin("+ id+ ")' class='edit_resource'>编辑</a>";
	str += "<a onclick='delResource("+ id+ ");' class='drop_resource' >删除</a>";
	return str;
}
//页面列表的排序
function datasort(a, b) {
	return (a > b ? 1 : -1);
}
//打开编辑窗口
function openUpdWin(id) {
	$.post(baseUrl + "/admin/R010/findUpdResource.html", {
		id : id
	}, function(data) {
		// 为更新form赋值
		$("#editResourceId").val(data.resourceid);
		$("#editresourceName").val(data.name);
		$("#editresourceClassifynewCombx").combotree("setValue", data.classifyid);
	}, "json");
	$('#updateWin').window('open');
}
//单个删除资源
function delResource(mId) {
	$.messager.confirm('删除提示', '确定要删除这个资源?', function(r) {
		if (r) {
			$.post(baseUrl + "/admin/R010/deleteResource.html", {
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
// 刷新
function reloadGrid() {
	$('#itemlist').datagrid('clearSelections');
	$('#itemlist').datagrid('reload');
}
//验证文件类型
function validateFileType(fileName){
	//选中的文件类型
	var typeVal=$('#typeVal').val();
	//获取文件的扩展名
	var dotNdx = fileName.lastIndexOf('.');
	//扩展名变成小写
	var exetendName = fileName.slice(dotNdx + 1).toLowerCase();
	//定义返回值
	var checkType=false;
	//判断类型
	switch(parseInt(typeVal))
	{
	case 1:// FLV
		checkType = exetendName=="flv";
		break;
	case 2:// MP4
		checkType = exetendName=="mp4";
		break;
	case 3:// SWF
		checkType = exetendName=="swf";
		break;
	case 4:// MP3
		checkType = exetendName=="mp3";
		break;
	case 5:// 图片
		checkType = exetendName=="png"||exetendName=="jpg"||exetendName=="gif"||exetendName=="bmp";
		break;
	case 6:// PDF
		checkType = exetendName=="pdf";
		break;
	case 7://Word
		checkType = exetendName=="doc"||exetendName=="docx";
		break;
	case 8:// Excel
		checkType = exetendName=="xlsx"|| exetendName=="xls";
		break;
	default:// 其它
		checkType = exetendName=="avi"||exetendName=="txt"||exetendName=="java";
	}
	//返回文件类型的验证值
	return checkType;
}
//删除资源
function delSomeResource() {
	var items_id = new Array();
	var items = $('#resourceList').datagrid('getSelections');
	if (items.length <= 0) {
		$.messager.alert('提示', '请选择要删除的资源', 'info');
		return;
	}
	$.messager.confirm('删除提示', '确定要删除选中资源?', function(r) {
		if (r) {
			// 获取选中课件的ID，并组成集合
			for ( var i = 0; i < items.length; i++) {
				items_id.push(items[i].resourceId);
			}
			$.post(baseUrl + "/admin/R010/delResource.html", {
				rid : items_id
			}, function(data) {
				if (data > 0) {
					msgShow('删除成功!');
					$('#resourceList').datagrid('reload');
				} else {
					msgShow('删除失败，请稍后重试');
					reloadGrid();
				}
			}, "json");
		}
	});
}
//更新资源
function submitUpdForm() {
	$.messager.confirm('更新提示', '确定更改此资源信息?', function(r) {
		if (r) {
			$('#updResourceForm').submit();
			return false;
		}
	});
}
function searchResource(){
	//资源名称
	var resourceName=$("#resourceName").val();
	//资源分类
	var resourceClassify=$("#resourceClassifyCombx").next().find(".textbox-value").val();
	var dateStart=$("#updateTimeStart").next().find(".textbox-value").val();
	var dateEnd=$("#updateTimeEnd").next().find(".textbox-value").val();
	$('#resourceList').datagrid('load', {    
		resourceName: resourceName,
		classifyid:resourceClassify,
		dateStart:dateStart,
		dateEnd:dateEnd
	});
}
//刷新
function reloadGrid() {
	$('#resourceList').datagrid('clearSelections');
	$('#resourceList').datagrid('reload');
}
/**
 * 加载进度
 */
function loadProgress(){
	var fd = new FormData();
	fd.append("uploadFile", document.getElementsByName("file")[0].files[0]);
	var xhr = new XMLHttpRequest();
	xhr.upload.addEventListener("progress", uploadProgress, false);
	xhr.addEventListener("load", uploadComplete, false);
	xhr.addEventListener("error", uploadFailed, false);
	xhr.addEventListener("abort", uploadCanceled, false);
	xhr.open("POST", "addMtaSysResource.html");
	xhr.send(fd);
}
function uploadProgress(evt) {
	if (evt.lengthComputable) {
		var percentComplete = Math.round(evt.loaded * 100 / evt.total);
		$('#progressNumber').progressbar('setValue', percentComplete);
	}
	else {
		document.getElementById('progressNumber').innerHTML = '无法计算';
	}
}
function uploadComplete(evt) {
	//服务器返回数据
	//var message = evt.target.responseText;
}
function uploadFailed(evt) {
	msgShow("上传出错!");
}
function uploadCanceled(evt) {
	msgShow("上传已由用户或浏览器取消删除连接");
}