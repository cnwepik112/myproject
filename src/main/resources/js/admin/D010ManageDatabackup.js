var groupData;
var roleData;
$(function() {
	creatGrid();


	/**
	 * easyUi dataGrid注册方式说明，防止二次渲染 class注册方式一般是为了初始化属性，js方式则属性和事件都可初始化
	 * 但是不管是class方式还是js方式注册组件，每次注册，只要被设置过url属性就会做请求。
	 * 所以在不可避免要使用js方式注册的情况下，索性就不要使用class方式注册了。
	 */
	function creatGrid() {
		$('#dataList').datagrid(
				{
					fit : true,// 设置为true时铺满它所在的容器.
					fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
					nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
					striped : true,// 设置为true将交替显示行背景。
					singleSelect : false,// 设置为true将只允许选择一行。
					border : false,
					remoteSort : false,// 定义是否通过远程服务器对数据排序。
					pagination : true,// 分页组件是否显示
					pageNumber : 1,// 起始页
					pageSize : 10,// 每页显示的记录条数，默认为10
					pageList : [ 10, 20, 50 ],// 每页显示多少行
					rownumbers : true,// 行号
					url : 'findAllDataBackup.html',
					toolbar : '#tbar',
					frozenColumns : [ [ {
						field : 'select',
						title : '选择',
						width : 50,
						checkbox : true
					} ] ],
					columns : [ [ {
						field : 'path',
						title : '备份名字',
						width : 50,
						sortable : true,
						sorter : datasort,
						halign: 'center',
						align : 'left'
					}, {
						field : 'url',
						title : '备份地址',
						width : 50,
						sortable : true,
						sorter : datasort,
						halign: 'center',
						align : 'left'
					}, {
						field : 'ins_date',
						title : '备份时间',
						width : 30,
						halign: 'center',
						align : 'center',
						sortable : true,
						sorter : datasort,
						formatter : fmdate
					}, {
						field : 'manage',
						title : '操作',
						halign: 'center',
						align : 'center',
						width : 50,
						formatter : fmup
					} ] ],
					detailFormatter : function(index, row) {
						return '<div id="userinfo_' + index
								+ '" style="height:80px;padding:5px;"></div>';
					},
					// 当数据载入成功时触发。
					onLoadSuccess : function(data) {
						// 操作中的按钮
						$('.edit_data').linkbutton({
							iconCls : 'icon-download',
							plain : true
						});
						$('.recovery_data').linkbutton({
							iconCls : 'icon-recovery',
							plain : true
						});
						$('.drop_data').linkbutton({
							iconCls : 'icon-no',
							plain : true
						});
					}
				});

	}
	// 操作按钮
	function fmup(value, rowData, rowIndex) {
		var id = rowData.id;
		var str = "<a onclick='exportData(" + id
				+ ");' class='edit_data'>下载</a>";
		str += "<a onclick='Restore(" + id + ");' class='recovery_data'>恢复</a>";
		str += "<a onclick='delDataBackup(" + id
				+ ");' class='drop_data'>删除</a>";
		return str;
	}

	// 排序
	function datasort(a, b) {
		return (a > b ? 1 : -1);
	}

	// 日期转换
	function fmdate(value, rowData, rowIndex) {
		if (value != null && value != '') {
			return fmtLongDate(new Date(value));
		}
		return "";
	}

	// 下载数据备份表单
	$('#DataForm').form({
		url : "exportDataBackup.html",
		success : function(data) {
		}
	});

	//创建资源添加弹出框
	$('#newaddSource').dialog({
		width : 500,
		height : 280,
		draggable : false,
		resizable : false,
		collapsible : false,
		minimizable : true,
		maximizable : true,
		shadow : false,
		closable : true,
		closed : true,
		inline : true,
		title : '编辑资源',
		modal : true,
		onOpen:function(){
			$('#filePath').filebox({
				buttonText: '选择文件',
				prompt:'请选择文件...'
			});
		}
	});
	//创建升级数据库添加弹出框
	$('#newupsql').dialog({
		width : 500,
		height : 280,
		draggable : false,
		resizable : false,
		collapsible : false,
		minimizable : true,
		maximizable : true,
		shadow : false,
		closable : true,
		closed : true,
		inline : true,
		title : '更新数据库',
		modal : true,
		onOpen:function(){
			$('#filePath').filebox({
				buttonText: '选择文件',
				prompt:'请选择文件...'
			});
		}
	});

	//打开增加资源窗口
	$('#addSource').click(function(){
		$('#newaddSource').dialog('open');
	});
	
	//打开升级数据库窗口
	$('#upsql').click(function(){
		$('#newupsql').dialog('open');
	});

	//上传文件提交
	$('#uploadForm').form({
		url : baseUrl + "/admin/D010/addDtaBackup.html",
		onSubmit : function() {
			var file = $("#filePath").filebox("getValue");
			var num = file.lastIndexOf(".");
			//num+1 取值往后延一位
			var extname = file.substring(num + 1);
			if (extname != "sql") {
				msgShow("<span style='color:red;'>请选择sql文件!</span>");
				return false;
			}
			if($('#uploadForm').form("validate")){
				$('#newaddSource').window("close");
				msgShow("<span>上传成功！</span>");
				reloadGrid();
			}
			return $('#uploadForm').form("validate");
		}
	});
	
	//更新数据库文件提交
	$('#uploadsqlForm').form({
		url : baseUrl + "/admin/D010/upsql.html",
		onSubmit : function() {
			var file = $("#filePath").filebox("getValue");
			var num = file.lastIndexOf(".");
			//num+1 取值往后延一位
			var extname = file.substring(num + 1);
			if (extname != "sql") {
				msgShow("<span style='color:red;'>请选择sql文件!</span>");
				return false;
			}
			if($('#uploadsqlForm').form("validate")){
				$('#newupsql').window("close");
				msgShow("<span>上传成功！</span>");
				reloadGrid();
			}
			return $('#uploadsqlForm').form("validate");
		}
	});
});

// 下载数据备份
function exportData(id) {
	// 文本域赋值
	$('#bfid').val(id);
	// 提交form
	$('#DataForm').submit();	
	return false;
}

//提交上传数据备份按钮
function submitResourceForm(){
	$('#uploadForm').submit();
}
//提交更新数据备份按钮
function submitsqlForm(){
	$('#uploadsqlForm').submit();
}

/**
 * 验证文件类型
 * 
 * @param fileName
 * @returns {Boolean}
 */
function validateFileType(fileName) {
	// 获取文件的扩展名
	var dotNdx = fileName.lastIndexOf('.');
	// 扩展名变成小写
	var exetendName = fileName.slice(dotNdx + 1).toLowerCase();
	// 定义返回值
	var checkType = false;
	// 判断类型
	if (exetendName == "sql" || exetendName == "sql") {
		checkType = true;
	}
	// 返回文件类型的验证值
	return checkType;
}

// 数据备份
function updDataInfo() {
	$.post("updDataInfo.html", {}, function(data) {
			if (data > 0) {
				msgShow('数据备份成功');
				reloadGrid();
			} else {
				msgShow('备份失败，数据库地址不对');
			}
		}, "json");
}

// 搜索
function seachDataByParam() {
	var path = $("#path").val();
	var param = {
	path : path
	};
	$('#dataList').datagrid('load', param);
}

// 单个删除数据
function delDataBackup(id) {
	$.messager.confirm('删除提示', '确定要删除这条数据?', function(r) {
		if (r) {
			$.post("delDataBackup.html", {
				id : id
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

// 删除所选数据提示
function delDataBackups() {
	var items = $('#dataList').datagrid('getSelections');
	if (items.length > 0) {
		$.messager.confirm('删除提示', '确定要删除选中数据?', function(r) {
			if (r) {
				delCert();
			}
		});
	} else {
		msgShow('请选择要删除的数据');
	}
}

// 删除所选数据
function delCert() {
	var items_id = new Array();
	var items = $('#dataList').datagrid('getSelections');
	if (items.length <= 0) {
		msgShow('请选择要删除的数据');
		return;
	}
	// 获取选中消息的ID，并组成集合
	for ( var i = 0; i < items.length; i++) {
		items_id.push(items[i].id);
	}
	$.post("delDataBackups.html", {
		id : items_id
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

// 恢复
function Restore(id) {
	$.messager.confirm('恢复提示', '确定要恢复所选数据?', function(r) {
		if (r) {
			$.post("Restore.html", {
				id : id
			}, function() {
				msgShow('恢复成功');
			});
		}
	});
}

// 刷新
function reloadGrid() {
	$('#dataList').datagrid('clearSelections');
	$('#dataList').datagrid('reload');
}
