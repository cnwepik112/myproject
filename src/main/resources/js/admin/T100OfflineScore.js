$.extend($.fn.validatebox.defaults.rules,{
	scoreValue : {
		validator : function(value, param) {
			var partten = $('#totlescore').numberbox("getValue");
			if(parseFloat(partten) >= parseFloat(value)){
				return true;
			}else{
				return false;
			}
			
		},
		message : '分值不能大于考试总分'
	}
});
$(function() {
	creatGrid();
	$('#username').combobox({
		url : baseUrl + '/admin/T100/findAllUserName.html',
		editable : true,
		required : true,
		hasDownArrow:false,
		valueField : 'username',
		textField : 'username',
		filter:function(q,row){
			var opts=$(this).combobox("options");
			return row[opts.textField].indexOf(q)>-1;//将从头位置匹配改为任意匹配
		}
	});
	//本地上传加载上传的FileInput
	$('#uploadCoverFile').filebox({
		onChange: function (newValue, oldValue) {
			if(newValue != '' && newValue != null){
				var validateType=validateFileType(newValue);
				if(!validateType){
					msgShow("上传类型错误");
					$('#uploadCoverFile').filebox("clear");
					return;
				}
				$('#uploadForm').submit();
				return false;
			}
			
		}
	});
	// 上传Form绑定
	$('#uploadForm').form({
		url :  baseUrl + '/admin/T100/addOfflineScoreFromExcel.html',
		onSubmit : function() {
			if($('#uploadForm').form("validate")){
				$.messager.progress({
					msg:'正在上传，请稍后...',text:'loading'});
			}
			return $('#uploadForm').form("validate");
		},
		success : function(data) {
			$.messager.progress('close');
			$('#uploadCoverFile').filebox("clear");
			var obj = eval('(' + data + ')');
			if(obj.error==0){
				//上传成功
				msgShow("上传成功");
				$('#itemlist').datagrid('reload');
				if(obj.rowError.length > 0){
					$("#uploadMessage").html("");
					for(var i=0;i<obj.rowError.length;i++){
						var html='';
						html += '<span class="offspan">第'+obj.rowError[i]+'行：&nbsp;&nbsp;</span>';
						html += '<span class="offspanMessage">'+obj.userNameNo[i]+'!</span>';
						$("#uploadMessage").append(html);
					}
					$('#uploadMessageDialog').dialog('open');
				}

			}else if(obj.error==-2){

				msgShow(obj.message);

			}else{
				msgShow("上传异常");
			}
		}
	});
	$('#edfrom').form({
		url : baseUrl+"/admin/T100/saveOfflineScore.html",
		onSubmit : function() {
			return $('#edfrom').form("validate");
		},
		success : function(data) {
			if (data > 0) {
				$.messager.alert('提示', '保存线下成绩成功！','info');
				$('#editor').window('close');
				$('#itemlist').datagrid('reload');
			
			} else if (data == -1) {
				$.messager.alert('提示','考生用户名不存在于本系统中！','info');
			} else {
			 	$.messager.alert('提示','未知错误！请稍后重试','info');
			}
		}
	});
	$('#editor').dialog({
		width : 400,
		height : 500,
		draggable : true,
		resizable : true,
		collapsible : false,
		closable : true,
		closed : true,
		inline : true,
		title : '线下成绩录入',
		modal : true,
		buttons:'#bb',
		onClose:function(){
			$('#edfrom').form("clear");
		}
	});
	
});

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
			pageList : [ 10, 20, 50,100,300,500],// 每页显示多少行
			rownumbers : true,// 行号
			url : baseUrl + '/admin/T100/findAllOfflineScoreList.html',
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
				width : 200,
				fixed : true,
				align : 'left',
				sortable : true,
				sorter : datasort,
				formatter:titleLength
			}, {
				field : 'totleScore',
				title : '考试总分',
				width : 60,
				sortable : true,
				sorter : datasort,
				align : 'right'
			}, {
				field : 'okrate',
				title : '及格分',
				width : 60,
				sortable : true,
				sorter : datasort,
				align : 'right'
			}, {
				field : 'beginTm',
				title : '开始时间',
				width : 100,
				sortable : true,
				sorter : datasort,
				align : 'center'
			},{
				field : 'endTm',
				title : '结束时间',
				width : 100,
				sortable : true,
				sorter : datasort,
				align : 'center'
			},{
				field : 'username',
				title : '考生用户名',
				width : 80,
				sortable : true,
				sorter : datasort,
				align : 'center'
			},{
				field : 'realName',
				title : '真实姓名',
				width : 80,
				sortable : true,
				sorter : datasort,
				align : 'center'
			},{
				field : 'groupName',
				title : '考生用户组',
				width : 80,
				sortable : true,
				sorter : datasort,
				align : 'center'
			}, {
				field : 'score',
				title : '考生得分',
				width : 60,
				sortable : true,
				sorter : datasort,
				align : 'right'
			}, {
				field : 'updDate',
				title : '上传时间',
				width : 100,
				sortable : true,
				sorter : datasort,
				align : 'center'
			}, {
				field : 'manage',
				title : '操作',
				align : 'center',
				width : 150,
				formatter : fmup
			} ] ],
			// 当数据载入成功时触发。
			onLoadSuccess : function(data) {
				$('.edit_qsn').linkbutton({
					iconCls : 'icon-edit',
					plain : true
				});
				$('.drop_qsn').linkbutton({
					iconCls : 'icon-no',
					plain : true
				});
			}
		});

}
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
	var id = rowData.id;
	var str = "<a onclick='openEditorDlg(" + id +",1)' class='edit_qsn'>编辑</a>";
	str += "<a onclick='delScoreById(" + id + ");' class='drop_qsn' >删除</a>";
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
function delMessage() {
	
	$.messager.confirm('删除提示', '确定要删除选中的成绩?', function(r) {
		if (r) {
			delScore();
		}else{
			$('#itemlist').datagrid('clearSelections');
		}
	});
}
// 删除试题
function delScore() {
	var items_id = new Array();
	var items = $('#itemlist').datagrid('getSelections');
	if (items.length <= 0) {
		$.messager.alert('提示', '请选择要删除的成绩', 'info');
		return;
	}
	// 获取选中试题的ID，并组成集合
	for ( var i = 0; i < items.length; i++) {
		items_id.push(items[i].id);
	}
	$.post(baseUrl + '/admin/T100/delOfflineScore.html', {
		ids : items_id
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
function delScoreById(id) {
	var items_id = new Array();
	items_id.push(id);
	$.messager.confirm('删除提示', '确定要删除选中的成绩?', function(r) {
		if (r) {
			$.post(baseUrl + '/admin/T100/delOfflineScore.html', {
				ids : items_id
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
function seachByParam() {
	
	var param = {
		ksname : '',
		username : ''
	};

	var search_title = $("#searchKsname").val();
	var search_user = $("#searchUsername").val();
	
	param.ksname = search_title;
	param.username = search_user;
	
	$('#itemlist').datagrid('load', param);
}
//打开线下成绩编辑窗口
function openEditorDlg(id,type){
	if(type==0){
		$('#editor').dialog('open');
		$('#offid').val("");
		$('#username').combobox("readonly",false);
	}else{
		$.post(baseUrl + '/admin/T100/findOfflineScoreById.html',{id:id},function(data){
			
			$('#username').combobox("readonly",true);
			
			$('#offid').val(data.id);
			
			$('#ksname').val(data.ksname);
			
			$('#username').combobox("setText",data.username);
			
			$('#username').combobox("setValue",data.username);
			
			$('#beginTime').datetimebox("setText",data.beginTm);
			
			$('#endTime').datetimebox("setText",data.endTm);
			
			$('#totlescore').numberbox("setValue",data.totleScore);
			
			$('#okrate').numberbox("setValue",data.okrate);
			
			$('#score').numberbox("setValue",data.score);
			
			$('#editor').dialog('open');
			
		},"json");
	}
}
//关闭线下成绩编辑窗口
function closeEditorDlg(){
	$('#editor').dialog('close');
}
//提交
function subForm() {
	$.messager.confirm('提示', '确定保存此次考试信息?', function(r) {
		if (r) {
			$('#edfrom').submit();
			return false;
		}
	});
}
function fmtValue(newValue,oldValue){
	var totlescore = $('#totlescore').numberbox("getValue");
	if(newValue > totlescore){
		$(this).numberbox("setValue",totleScore);
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
	switch(exetendName)
	{
	case 'xls':// FLV
		checkType=true;
		break;
	case 'xlsx':// MP4
		checkType=true;
		break;
	default:// EXCEL
		checkType=false;
	}
	//返回文件类型的验证值
	return checkType;
}
