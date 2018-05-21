/**
 * 成绩管理js
 * 
 * @since 2015/06/29
 * @author Limeng
 */
$(function() {
	
	creatGrid();
	
//	//考试名字下拉框
//	$('#ksname').combobox({
//		url :baseUrl +"/admin/T070/findKsNameAddAll.html",
//		editable : false,
//		required : false,
//		valueField : 'kaoshiId', //基础数据值名称绑定到该下拉列表框。
//		textField : 'kaoshiName' //基础数据字段名称绑定到该下拉列表框。
//	});
	//导出条件表单
	$('#excelForm').form({
		url : baseUrl +"/admin/T070/outChengJiExcel.html",
		success : function(data) {
			$.messager.alert('提示',data,'info');
		}
	});
	// 职位分类
	$('#positionCombox').combobox({
		url : baseUrl +'/admin/U060/findPosition.html',
		panelHeight : 60,
		valueField : 'positionid',
		textField : 'name'
	});
	//查看窗口
	$('#seewin').window({    
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
		maximized:true,
		title : '查看试卷',
		modal : true   
	});
	$('#updSorce').dialog({
		// iconCls:'icon-save',
		title : '修改成绩',
		closed : true,
		modal : true,
		shadow : false
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
		pageList : [ 10, 20, 50, 100 ],// 每页显示多少行
		rownumbers : true,// 行号
		url : baseUrl +"/admin/T070/findAllChengji.html",
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
			width : 120,
			sortable : true,
			halign: 'center',
			align : 'left'
		}, {
			
			field : 'kstimes',
			title : '考试次数',
			width : 50,
			sortable : true,
			halign: 'center',
			align : 'right'
		}, {
			field : 'sjtotalsorce',
			title : '试卷总分',
			width : 50,
			sortable : true,
			halign: 'center',
			align : 'right'
		}, {
			field : 'kssorce',
			title : '考试得分',
			width : 70,
			sortable : true,
			halign: 'center',
			align : 'right',
			formatter : fmsorce
		}, {
			field : 'startTime',
			title : '答卷开始时间',
			width : 120,
			sortable : true,
			formatter : fmdate,
			halign: 'center',
			align : 'center'
		}, {
			field : 'endTime',
			title : '答卷结束时间',
			width :120,
			formatter : fmdate,
			sortable : true,
			halign: 'center',
			align : 'center'
		},{
			field : 'SJC',
			title : '考试时长',
			width : 60,
			sortable : true,
			halign: 'center',
			align : 'right'
		},{
			field : 'ksuserName',
			title : '考生用户名',
			width : 80,
			sortable : true,
			align : 'left'
		}, {
			field : 'ksrealName',
			title : '考生真实姓名',
			width : 70,
			sortable : true,
			align : 'left'
		}, {
			field : 'examcard',
			title : '考生学历',
			width : 80,
			sortable : true,
			align : 'left'
		}, {
			field : 'positionname',
			title : '考生职位',
			width : 80,
			sortable : true,
			align : 'left'
		}, {
			field : 'groupName',
			title : '考生用户组',
			width : 80,
			sortable : true,
			align : 'left'
		}, {
			field : 'okrateState',
			title : '是否及格',
			width : 50,
			sortable : true,
			align : 'left'
		}, {
			field : 'manage',
			title : '操作',
			align : 'center',
			width : 200,
			formatter : fmup
		} ] ],
		// 当数据载入成功时触发。
		onLoadSuccess : function(data) {
			$('.see_chengji').linkbutton({
				iconCls : 'icon-search',
				plain : true
			});
			$('.out_chengji').linkbutton({
				iconCls : 'icon-word',
				plain : true
			});
			$('.del_chengji').linkbutton({
				iconCls : 'icon-no',
				plain : true
			});
		}
	});

}
function fmup(value, rowData, rowIndex) {
	var id = rowData.ksuid;
	var sid=rowData.shijuanid;
	var ksuserName = rowData.ksuserName;
	var ksname = rowData.ksname;
	var kstimes = rowData.kstimes;
	var sjtotalsorce = rowData.sjtotalsorce;
	var kssorce = rowData.kssorce;
	var startTime = rowData.startTime;
	var endTime = rowData.endTime;
	var str="<a onclick='openSeeWin("+ id+")' class='see_chengji'>查看</a>";
	str += "<a onclick='outWord("+ id+");' class='out_chengji' >导出</a>";
	str += "<a onclick='delCjById("+ id+");' class='del_chengji' >删除</a>";
	return str;
}
//======================================查看试卷=================================//
//打开查看窗口
function openSeeWin(id) {
	window.parent.closeTabByTitle("成绩试卷预览");
	window.parent.openTab("成绩试卷预览", baseUrl+"/admin/T070/ChengJiPreview.html?id="+id);
}
function getData(id){
	alert(id);
	$.post(baseUrl +"/admin/T070/getMyShiJuanInfo.html", {
	id : id
	}, function(data) {	
		loadSjInfo(data);
	}, "json");
}
function loadSjInfo(data){
	//卷子名
	var sjname=data.kstitle;
	//alert(sjname);
	//固定题
	var gud_shitimix=eval("("+data.d_shitimix+")");
	var gud_shitimix=eval("("+gud_shitimix.data+")");
//	//固答案
//	var gud_daandata=eval("("+data.daandata+")");
//	//alert(gud_daandata);
//	//随机题
//	var shuij_xtmix=eval("("+data.d_xtmix+")");
//	//alert(shuij_xtmix);
//	//随答案
//	var shuij_rdaandata=eval("("+data.rdaandata+")");
//	//alert(shuij_rdaandata);
	//容器
	var C=$("#seewin");
	C.append(sjname);
	for(var i=0;i<gud_shitimix.length;i++){
		var html='<p>';
		html+=gud_shitimix[i].title;
		html+='</p>';
		C.append(html);
	}
	
	
		
	
}
//======================================查看结束=================================//
//导出
function outWord(id){
	
	window.location.href=baseUrl +"/admin/T070/outWord.html?id="+id;
	
}
//日期转换
function fmdate(value, rowData, rowIndex) {
	// fmtLongDate--common.js
	if (value != null && value != '') {
		return fmtLongDate(new Date(value));
	}
	return "";
}
//查询
function seachChengjiByParam() {
	//给隐藏表单赋值
	var ksname=$("#ksname").val();
	$("#exksname").attr("value",ksname);
	var ksusername=$("#ksusername").val();
	$("#exksusername").attr("value",ksusername);
	var search_examcard = $("#examcardlike").val();
	var search_positionid = $('#positionCombox').combobox('getValue');
	$("#exExamcard").val(search_examcard);
	$("#expositionid").val(search_positionid);
	var param = {
		ksname : ksname,
		ksusername:ksusername,
		examcard:search_examcard,
		positionid:search_positionid
	};
	$('#itemlist').datagrid('load', param);
}
//刷新
function reloadGrid() {
	$('#itemlist').datagrid('clearSelections');
	$('#itemlist').datagrid('reload');
}

//导出Excel
function exportExcel() {
	$('#excelForm').submit();
	return false;
}
//删除用户
function delCjById(id) {
	var items_id = new Array();
	items_id.push(id);
	$.messager.confirm('删除提示', '确定要删除选中成绩?', function(r) {
		if (r) {
			$.post(baseUrl +"/admin/T070/delChengji.html", {
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
//删除用户提示
function delCjMessage() {
	$.messager.confirm('删除提示', '确定要删除选中成绩?', function(r) {
		if (r) {
			delCj();
		}else{
			$('#itemlist').datagrid('clearSelections');
		}
	});
}
//删除用户
function delCj() {
	var items_id = new Array();
	var items = $('#itemlist').datagrid('getSelections');
	if (items.length <= 0) {
		$.messager.alert('提示', '请选择要删除的成绩', 'info');
		return;
	}
	// 获取选中用户的ID，并组成集合
	for ( var i = 0; i < items.length; i++) {
		items_id.push(items[i].ksuid);
	}
	$.post(baseUrl +"/admin/T070/delChengji.html", {
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
//修改成绩
function fmsorce(value, rowData, rowIndex) {
	return rowData.kssorce + "<a href='javascript:;' class='blue_color_a' onclick='updSorce(" +rowData.ksuid + "," + rowData.kssorce 
			+ ");'>" + " 修改成绩</a>";
}
//弹出修改成绩
function updSorce(ksuid, kssorce) {
	$("#ksuid").val(ksuid);
	$("#sorce").numberbox("setValue", kssorce);
	$('#updSorce').dialog('open');
}
// 保存修改成绩
function saveSorce() {
	var ksuid = $('#ksuid').val();
	var sorce = $('#sorce').val();
	$.post(baseUrl +"/admin/T070/updSorce.html", {
		ksuid : ksuid,
		sorce : sorce
	}, function(data) {
		if (data == 0) {
			msgShow('操作失败，请稍后重试!');
			return;
		}
		msgShow('操作成功!');
		$('#updSorce').dialog('close');
		$('#itemlist').datagrid('reload');
	}, "json");
}