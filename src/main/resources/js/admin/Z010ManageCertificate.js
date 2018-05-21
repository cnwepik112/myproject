/**
 * 证书管理js
 * 
 * @since 2015/06/29
 * @author Limeng
 */
$(function() {
	creatGrid();
	//设置编辑窗口参数
	$('#updateWin').window({
		width : 820,
		height : 530,
		draggable : false,
		resizable : false,
		collapsible : false,
		minimizable : false,
		maximizable : false,
		closable : true,
		closed : true,
		inline : true,
		title : '编辑证书',
		modal : true
	});
	//设置查看用户窗口参数
	$('#CheckUserWin').window({    
		width : 617,
		height : 300,
		draggable : false,
		resizable : false,
		collapsible : false,
		minimizable : false,
		maximizable : false,
		closable : true,
		closed : true,
		inline : true,
		title : '查看证书发放用户',
		modal : true 
	}); 
	//日期框
	$('#dd').datebox({    
	    required:true   
	}); 
});

//证书更新
$(function(){
	$("#updCertFrom").form({
		url : baseUrl + "/admin/Z010/updCert.html",
		onSubmit : function() {
			
			return $('#addCertFrom').form("validate");
		},
		success : function(data) {
			if (data > 0) {
				$('#updateWin').window("close");
				reloadGrid();
				msgShow("<span style='color:black'>证书修改成功！</span>");
			} else if (data == 0) {
				msgShow("<span style='color:red'>该证书已存在！</span>");
			} else {
				msgShow("<span style='color:red'>未知错误！请稍后重试！</span>");
			}
		}
	});
});

function subupdCertForm(){
	$("#updCertFrom").submit();
	return false;
}
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
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : true,// 分页组件是否显示
		pageNumber : 1,// 起始页
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50 ],// 每页显示多少行
		rownumbers : true,// 行号
		url : baseUrl + '/admin/Z010/showAllCertificate.html',
		toolbar : '#tbar',
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			sortable : true,
			checkbox : true
		} ] ],
		columns : [ [ {
			field : 'number',
			title : '证书编号',
			width : 120,
			sortable : true,
			halign: 'center',
			align : 'right'
		}, {
			
			field : 'name',
			title : '证书名称',
			width : 80,
			sortable : true,
			halign: 'center',
			align : 'left'
		}, {
			field : 'issueAgency',
			title : '证书发放机构',
			width : 80,
			sortable : true,
			halign: 'center',
			align : 'left'
		}, {
			field : 'issueDate',
			title : '证书发放时间',
			width : 80,
			sortable : true,
			halign: 'center',
			align : 'center'
		}, {
			field : 'expiryDate',
			title : '证书有效时长',
			width : 80,
			sortable : true,
			halign: 'center',
			align : 'right'
		}, {

			field : 'manage',
			title : '操作',
			align : 'center',
			width : 140,
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
			$('.user_cert').linkbutton({
				iconCls : 'icon-user',
				plain : true
			});
		}
	});

}

function fmup(value, rowData, rowIndex) {
	
	var id = rowData.certId;
	var str="<a onclick='openUpdWin("+ id+ ")' class='edit_cert'>编辑</a>";
	str += "<a onclick='delcertById("+ id+ ");' class='drop_cert' >删除</a>";
	str += "<a onclick='checkUser("+ id+ ");' class='user_cert' >查看用户</a>";
	return str;
}

//打开编辑窗口
function openUpdWin(id) {
	$.post(baseUrl + "/admin/Z010/findUpdCert.html", {
		id : id
	}, function(data) {
		$("#certid").val(data.certid);
		$("#name_upd").val(data.name);
		$("#number_upd").val(data.number);
		$("#issueagency_upd").val(data.issueagency);
		$("#category_upd").val(data.category);
		$("#expirydate_upd").val(data.expirydate);
		$("#container").val(data.des);
		$("#pic").val(data.pic);
		$("#certPic").attr("src",data.pic);
		if (data.issuedate != null) {
			var issuedate = fmtShortDate(new Date(data.issuedate));
			$("#dd").datebox("setValue", issuedate);
		}
		//本地上传加载上传的FileInput
		$('#uploadCoverFile').filebox({
			buttonText: '选择证书',
			onChange: function (newValue, oldValue) {
					var validateType=validateFileType(newValue);
					if(!validateType){
						msgShow("请上传gif、jpg、png格式的图片");
						return;
					}
					$('#uploadForm').submit();
				}
		});
		// 上传课程封面Form绑定
		$('#uploadForm').form({
			url : baseUrl + "/admin/C010/uploadCover.html",
			onSubmit : function() {
				return $('#uploadForm').form("validate");
			},
			success : function(data) {
				var obj = eval('(' + data + ')');
				if(obj.status=="success"){
					//上传成功
					$("#pic").val(obj.url);
					$("#certPic").attr("src",obj.url);
				}else if(obj.status=="typeError"){

					msgShow("上传类型错误");

				}else{
					msgShow("上传异常");
				}
			}
		});
	}, "json");
	//打开编辑窗口弹出
	$('#updateWin').window('open');
}
//=============================================================================//
//打开查看用户窗口
function openUserWin(){
	//打开编辑窗口弹出
	$('#CheckUserWin').window('open');
	creatGrid2();	
	
}
function checkUser(mId){
		
	$.post(baseUrl + "/admin/Z010/CheckPassPar.html", {
		id : mId
	}, function(data) {
		if (data > 0) {
			
			openUserWin();
			
		} else {
			msgShow('查看失败，请稍后重试');
		}
	}, "json");
		
}
function creatGrid2() {
	$('#itemlist2').datagrid({    
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
	    url:baseUrl + "/admin/Z010/CheckCerUser.html",    
	    columns:[[    
	        {field:'userName',title:'发放的用户',width:300},    
	        {field:'expirydate',title:'发放的时间',width:300,formatter:fmdate}    
	    ]]    
	});  
}
//=============================================================================//
//单个删除证书
function delcertById(mId) {
	$.messager.confirm('删除提示', '确定要删除这条数据?', function(r) {
		
		if (r) {
			$.post(baseUrl + "/admin/Z010/deleteCertificates.html", {
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
//删除所选证书提示
function delCertificates() {
	var items = $('#itemlist').datagrid('getSelections');
	if (items.length <= 0) {
		msgShow('请选择要删除的数据');
		return;
	}else{
		$.messager.confirm('删除提示', '确定要删除选中数据?', function(r) {
			if (r) {
				delCert();
			}
		});
	}
}
// 删除所选证书
function delCert() {
	var items_id = new Array();
	var items = $('#itemlist').datagrid('getSelections');
	if (items.length <= 0) {
		msgShow('请选择要删除的数据');
		return;
	}
	// 获取选中消息的ID，并组成集合
	for ( var i = 0; i < items.length; i++) {
		items_id.push(items[i].certId);
	}

	$.post(baseUrl + "/admin/Z010/deleteSelectedCertificates.html", {
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
// 日期转换
function fmdate(value, rowData, rowIndex) {
	return fmtLongDate(new Date(value));
}
//排序
function datasort(a, b) {
	return (a > b ? 1 : -1);
}
function cellStylerStatus(value,row,index){
	if (value > 0){
		return 'background-color:#FA8072;color:#fff;';
	}
}
function cellStylerReview(value,row,index){
	if (value <= 0 || !value){
		return 'background-color:#FA8072;color:#fff;';
	}
}
// 刷新
function reloadGrid() {
	$('#itemlist').datagrid('clearSelections');
	$('#itemlist').datagrid('reload');
}
//打开添加证书
function addCertInfo() {
	window.parent.openTab("添加证书", baseUrl + "/admin/Z010/AddCertificate.html");
}

//日期框
$(function() {
	$('#dt').datebox({ 
		value: '',
		required:false 
	}); 
	$('#dt1').datebox({   
		value: '',  
		required:false 
	});
});

//查询
function getLike() {
	
	var name=$("#name").val();
	var number=$("#number").val();
	var issueAgency=$("#issueAgency").val();
	var issueDate1 = $('#dt').datebox('getValue');
	if(issueDate1 == ''){
	    issueDate1 = '1900-01-01';
	}
	var issueDate2 = $('#dt1').datebox('getValue');
	if(issueDate2 == ''){
        issueDate2 = '2200-01-01';
    }
	var param = {
		name : name,
		number : number,
		issueAgency : issueAgency,
		issueDate1:issueDate1,
		issueDate2:issueDate2
	};

	$('#itemlist').datagrid('load', param);
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
