var savetype=0;
$(function() {
	$('#tt').tabs({
		fit : true,
		cache : false,
		onSelect : selectTab
	});
	UE.getEditor("answerTitleEditor");
	UE.getEditor("answerEditor");
	creatGrid();
	// 初始化试题分类
	$('#qsnclassify').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		url : baseUrl + '/admin/B010/findQsnClassify.html',
		required : true,
		cascadeCheck : false
	});
	// 初始化试题难度
	$('#qsnlevel').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		url : baseUrl + '/admin/B010/findQsnLevel.html',
		required : true,
		cascadeCheck : false
	});
	// 初始化试题知识点
	$('#qsnknowledge').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		url : baseUrl + '/admin/B010/findQsnKnowledge.html',
		required : true,
		cascadeCheck : false
	});
	// 初始化试题提交表单
	$('#qsnForm').form(
			{
				url : baseUrl + "/admin/T010/saveReadQsh.html",
				onSubmit : function() {
					return $('#qsnForm').form("validate");
				},
				success : function(data) {
					if (data > 0) {
						if (pageType == 0) {
							msgShow("保存成功，请添加子试题！");
							$('#addQsnidValue').val(data);
							$('#saveQsnBtn').linkbutton('disable');
							$('#saveAndCloseQsnBtn').linkbutton('disable');
							$('#addChildBtn').linkbutton('enable');
							if(savetype==1){
								$('#addQsnidValue').val("");
								window.parent.closeTabByTitle("试题管理");
								window.parent.openTab("试题管理", baseUrl
										+ "/admin/T010/manageQsn.html");
								window.parent.closeTabByTitle("添加试题");
							}else{
								window.parent.closeTabByTitle("试题管理");
							}
						} else {
							msgShow("保存成功！");
							if(savetype==1){
								window.parent.closeTabByTitle("试题管理");
								window.parent.openTab("试题管理", baseUrl
										+ "/admin/T010/manageQsn.html");
								window.parent.closeTabByTitle("编辑试题-阅读理解");
							}else{
								window.parent.closeTabByTitle("试题管理");
							}
						}
						//清空下拉框内容
//						$('#qsnclassify').combotree('setValue', '');
//						$('#qsnlevel').combotree('setValue', '');
//						$('#qsnknowledge').combotree('setValue', '');
//						//清空题干和解析
//						UE.getEditor("answerTitleEditor").setContent('');
//						UE.getEditor("answerEditor").setContent('');
					} else if(data == -2){
						msgShow("<span style='color:red'>试题重复，请修改题干！</span>");
					} else {
						msgShow("<span style='color:red'>未知错误！请稍后重试！</span>");
					}
				}
			});
	if (pageType == 0) {
		$('#addChildBtn').linkbutton('disable');
	} else {
		// pageType 0代表添加 1代表更新 如果为1则禁用其他Tab标签并在解析加载后执行根据答案加载选项
		$('#tt').tabs("disableTab", 0);
		$('#tt').tabs("disableTab", 1);
		$('#tt').tabs("disableTab", 2);
		$('#tt').tabs("disableTab", 3);
		$('#tt').tabs("disableTab", 4);
		UE.getEditor("answerEditor").addListener('ready', function(editor) {
			addQsnAnswerLi();
		});
	}
	$('#childQsnDia').dialog({
		title : '添加子试题',
		width : 900,
		height : 600,
		closed : true,
		cache : false,
		modal : true,
		draggable : false,
		buttons : '#bb',
		onBeforeOpen:function(){
			addFourRadio();
			addFourSelect();
		},
		onClose : function(){
			$("#radioOl").html("");
			$("#selectOl").html("");
			
		}
	});
	$('#updRadioQsnDia').dialog({
		title : '编辑子试题',
		width : 900,
		height : 600,
		closed : true,
		cache : false,
		modal : true,
		draggable : false,
		buttons : '#updbb'
	});
	$('#ttChild').tabs({
		fit : true,
		border : false,
		cache : false
	});
	$('#updttChild').tabs({
		fit : true,
		border : false,
		cache : false
	});
});
function removePanel(){
	window.parent.closeTabByTitle("试题管理");
	window.parent.openTab("试题管理", baseUrl
			+ "/admin/T010/manageQsn.html");
	if (pageType == 0) {
		window.parent.closeTabByTitle("添加试题");
	}else{
		window.parent.closeTabByTitle("编辑试题-阅读理解");
	}
}
// 根据答案加载选项
function addQsnAnswerLi() {
	$.post(baseUrl + "/admin/T010/findReadQsn.html", {
		qsnid : rqsnid
	}, function(data) {
		$("#qsnclassify").combotree("setValue", data.classifyid);
		$("#qsnlevel").combotree("setValue", data.levelid);
		$("#qsnknowledge").combotree("setValue", data.knowledgeid);
		$("#qsnidValue").val(data.qsnid);
		$("#addQsnidValue").val(data.qsnid);
		UE.getEditor("answerTitleEditor").setContent(data.title);
		UE.getEditor("answerEditor").setContent(data.jieda);
		$('#itemlist').datagrid("load", {
			qsnid : data.qsnid
		});
	}, "json");
}
function creatGrid() {
	$('#itemlist').datagrid({
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : true,// 设置为true将只允许选择一行。
		border : true,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		pagination : false,// 分页组件是否显示
		rownumbers : true,// 行号
		url : baseUrl + '/admin/T010/findReadQsnChildQsn.html',
		queryParams : {
			qsnid : 0
		},
		toolbar : '#tbar',
		columns : [ [ {
			field : 'title',
			title : '试题内容',
			width : 200,
			align : 'left',
			sortable : true,
			sorter : datasort,
			formatter:titleLength
		}, {
			field : 'tx',
			title : '题型',
			width : 80,
			align : 'right',
			sortable : true,
			sorter : datasort,
			formatter : fmType
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
function fmup(value, rowData, rowIndex) {
	var str = "<a onclick='openUpdChildQsnDia("+rowIndex+")' class='edit_qsn'>编辑</a>";
	str += "<a onclick='delChildQSN("+rowIndex+");' class='drop_qsn' >删除</a>";
	return str;
}
function fmType(value, rowData, rowIndex) {
	if (value == "danxuan") {
		return "单选题";
	}
	if (value == "duoxuan") {
		return "不定项选择题";
	}
	if (value == "panduan") {
		return "判断题";
	}
	if (value == "jianda") {
		return "简答题";
	}
}
// 排序
function datasort(a, b) {
	return (a > b ? 1 : -1);
}

function delChildQSN(rowIndex){
	var qsnid=$("#addQsnidValue").val();
	$.post(baseUrl + "/admin/T010/delReadQsnChildQsn.html",{childid:rowIndex+1,qid:qsnid},function(data){
		if(data>0){
			msgShow("删除成功！");
			$('#itemlist').datagrid("load", {
				qsnid : qsnid
			});
			return;
		}
		msgShow("未知错误，请稍后重试！");
	},"json");
}
function selectTab(title, index) {
	if (index == 0) {
		window.location.href = baseUrl
				+ "/admin/T010/editQsn.html?type=add&qsnid=0";
	} else if (index == 1) {
		window.location.href = baseUrl
				+ "/admin/T010/editSelectQsn.html?type=add&qsnid=0";
	} else if (index == 2) {
		window.location.href = baseUrl
				+ "/admin/T010/editJudgeQsn.html?type=add&qsnid=0";
	} else if (index == 3) {
		window.location.href = baseUrl
				+ "/admin/T010/editInBlankQsn.html?type=add&qsnid=0";
	} else if (index == 4) {
		window.location.href = baseUrl
				+ "/admin/T010/editShortAnswerQsn.html?type=add&qsnid=0";
	}
}
function radioChecked(obj) {
	var value = $(obj).attr("aid");
	if (value == 1) {
		$('#radioRight').click();
	} else {
		$('#radioWrong').click();
	}
}
function updRadioChecked(obj) {
	var value = $(obj).attr("aid");
	if (value == 1) {
		$('#updradioRight').click();
	} else {
		$('#updradioWrong').click();
	}
}
// 保存试题信息
function saveQsn(type) {
	savetype=type;
	var error = 0;// 错误数
	var titleContent = UE.getEditor("answerTitleEditor").getContent();
	var jiedaContent = UE.getEditor("answerEditor").getContent();
	if (titleContent == "" || titleContent == null) {
		$("#answer_title_content").html("请输入题干内容！");
		error++;
	} else {
		$("#answer_title_content").html("");
	}
//	if (jiedaContent == "" || jiedaContent == null) {
//		$("#answer_content").html("请输入答题解析内容！");
//		error++;
//	} else {
//		$("#answer_content").html("");
//	}
	if (error > 0) {
		return;
	}
	$("#titleValue").val(titleContent);
	$("#jiedaValue").val(jiedaContent);
	$('#qsnForm').submit();
	return false;
}
function openChildQsnDia() {
	$('#childQsnDia').dialog("open");
	$('#ttChild').tabs("select",0);
}

function openUpdChildQsnDia(index) {
	$('#itemlist').datagrid('selectRow',index);
	var data=$('#itemlist').datagrid('getSelected');
	$('#updRadioQsnDia').dialog("open");
	$("#childqsnId").val(data.id);
	if(data.tx=="danxuan"){
		$('#updttChild').tabs("select", 0);
		$('#updttChild').tabs("disableTab", 1);
		$('#updttChild').tabs("disableTab", 2);
		$('#updttChild').tabs("disableTab", 3);
		$("#upd_radioOl").html("");
		$("#upd_radio_title").val(data.title);
		addRadioLi(data.xx,data.daan);
	}else if(data.tx=="duoxuan"){
		$('#updttChild').tabs("select", 1);
		$('#updttChild').tabs("disableTab", 0);
		$('#updttChild').tabs("disableTab", 2);
		$('#updttChild').tabs("disableTab", 3);
		$("#upd_selectOl").html("");
		$("#upd_select_title").val(data.title);
		addSelectLi(data.xx,data.daan);
	}else if(data.tx=="panduan"){
		$('#updttChild').tabs("select", 2);
		$('#updttChild').tabs("disableTab", 0);
		$('#updttChild').tabs("disableTab", 1);
		$('#updttChild').tabs("disableTab", 3);
		$("#updJudgeTitle").val(data.title);
		if(data.daan==1){
			$("#updradioRight").click();
		}else{
			$("#updradioWrong").click();
		}
	}else if(data.tx=="jianda"){
		$('#updttChild').tabs("select", 3);
		$('#updttChild').tabs("disableTab", 0);
		$('#updttChild').tabs("disableTab", 1);
		$('#updttChild').tabs("disableTab", 2);
		$("#updjiandaTitle").val(data.title);
		$("#updjiandaAnswer").val(data.daan);
	}
	
}
function addFourRadio(){
	for(var i=1;i<5;i++){
		var liHtml = "<li>"
			+ "<input type='radio' class='radio_type' name='answer'/>答案&nbsp;&nbsp;&nbsp;"
			+ "<input id='radio_answer_"
			+ i
			+ "' class='input_user_info' style='width:250px;' type='text' />&nbsp;&nbsp;&nbsp;&nbsp;"
			+ "<a class='blue_color_a' href='javascript:;' onclick='removeAnswerChild(this)'>删除</a>"
			+ "</li>";
		$("#radioOl").append(liHtml);
		$('#radio_answer_' + i).validatebox({
			required : true
		});
	}
}
function addFourSelect(){
	for(var i=1;i<5;i++){
		var liHtml = "<li>"
			+ "<input type='checkbox' class='check_type' name='answer'/>答案&nbsp;&nbsp;&nbsp;"
			+ "<input id='select_answer_"
			+ i
			+ "' class='input_user_info' style='width:250px;' type='text' />&nbsp;&nbsp;&nbsp;&nbsp;"
			+ "<a class='blue_color_a' href='javascript:;' onclick='removeAnswerChild(this)'>删除</a>"
			+ "</li>";
		$("#selectOl").append(liHtml);
		$('#select_answer_' + i).validatebox({
			required : true
		});
	}
}
var nextNum = 5;
var updNextNum = 5;
var selectNextNum = 5;
var selectUpdNextNum = 5;
function addRadioLi(xx,daan){
	var xxItems=eval("("+xx+")");
	var num=1;
	for(var i in xxItems){
		//循环答案并向OL中添加答案HTML
		var liHtml = "<li>"
			+ "<input type='radio' class='radio_type' id='upd_radio_"+num+"' name='answer'/>答案&nbsp;&nbsp;&nbsp;"
			+ "<input id='upd_radio_answer_"
			+ num
			+ "' class='input_user_info' style='width:250px;' type='text' />&nbsp;&nbsp;&nbsp;&nbsp;"
			+ "<a class='blue_color_a' href='javascript:;' onclick='removeAnswerChild(this)'>删除</a>"
			+ "</li>";
		$("#upd_radioOl").append(liHtml);
		$('#upd_radio_answer_' + num).validatebox({
			required : true
		});
		$('#upd_radio_answer_' + num).val(xxItems[i].xx);
		if(num==daan){
			$("#upd_radio_"+num).click();
		}
		num++;
	}
	updNextNum=num;
}
function addSelectLi(xx,daan){
	var xxItems=eval("("+xx+")");
	var num=1;
	for(var i in xxItems){
		//循环答案并向OL中添加答案HTML
		var liHtml = "<li>"
			+ "<input type='checkbox' class='check_type' id='upd_select_"+num+"' name='answer'/>答案&nbsp;&nbsp;&nbsp;"
			+ "<input id='upd_select_answer_"
			+ num
			+ "' class='input_user_info' style='width:250px;' type='text' />&nbsp;&nbsp;&nbsp;&nbsp;"
			+ "<a class='blue_color_a' href='javascript:;' onclick='removeAnswerChild(this)'>删除</a>"
			+ "</li>";
		$("#upd_selectOl").append(liHtml);
		$('#upd_select_answer_' + num).validatebox({
			required : true
		});
		$('#upd_select_answer_' + num).val(xxItems[i].xx);
		
		num++;
	}
	var daanValues=daan.split(",");
	for(var j=0;j<daanValues.length;j++){
		$("#upd_select_"+daanValues[j]).attr("checked", true);
	}
	selectNextNum=num;
}
//编辑页添加单选选项
function addupdAnswerChild() {

	var liHtml = "<li>"
			+ "<input type='radio' class='radio_type' name='answer'/>答案&nbsp;&nbsp;&nbsp;"
			+ "<input id='upd_radio_answer_"
			+ updNextNum
			+ "' class='input_user_info' style='width:250px;' type='text' />&nbsp;&nbsp;&nbsp;&nbsp;"
			+ "<a class='blue_color_a' href='javascript:;' onclick='removeAnswerChild(this)'>删除</a>"
			+ "</li>";
	$("#upd_radioOl").append(liHtml);
	$('#upd_radio_answer_' + updNextNum).validatebox({
		required : true
	});
	updNextNum++;
}
//编辑页添加多选选项
function addupdSelectChild() {
	var liHtml = "<li>"
		+ "<input type='checkbox' class='check_type' name='answer'/>答案&nbsp;&nbsp;&nbsp;"
		+ "<input id='upd_select_answer_"
		+ selectUpdNextNum
		+ "' class='input_user_info' style='width:250px;' type='text' />&nbsp;&nbsp;&nbsp;&nbsp;"
		+ "<a class='blue_color_a' href='javascript:;' onclick='removeAnswerChild(this)'>删除</a>"
		+ "</li>";
	$("#upd_selectOl").append(liHtml);
	$('#upd_select_answer_' + selectUpdNextNum).validatebox({
		required : true
	});
	selectUpdNextNum++;
}
// 添加单选题型选项
function addAnswerChild() {
	var liHtml = "<li>"
			+ "<input type='radio' class='radio_type' name='answer'/>答案&nbsp;&nbsp;&nbsp;"
			+ "<input id='radio_answer_"
			+ nextNum
			+ "' class='input_user_info' style='width:250px;' type='text' />&nbsp;&nbsp;&nbsp;&nbsp;"
			+ "<a class='blue_color_a' href='javascript:;' onclick='removeAnswerChild(this)'>删除</a>"
			+ "</li>";
	$("#radioOl").append(liHtml);
	$('#radio_answer_' + nextNum).validatebox({
		required : true
	});
	nextNum++;
}
//添加多选题型选项
function addSelectAnswerChild() {
	var liHtml = "<li>"
		+ "<input type='checkbox' class='check_type' name='answer'/>答案&nbsp;&nbsp;&nbsp;"
		+ "<input id='select_answer_"
		+ selectNextNum
		+ "' class='input_user_info' style='width:250px;' type='text' />&nbsp;&nbsp;&nbsp;&nbsp;"
		+ "<a class='blue_color_a' href='javascript:;' onclick='removeAnswerChild(this)'>删除</a>"
		+ "</li>";
	$("#selectOl").append(liHtml);
	$('#select_answer_' + selectNextNum).validatebox({
		required : true
	});
	selectNextNum++;
}
// 移除选项
function removeAnswerChild(obj) {
	var liItem = $(obj).parent();
	liItem.remove();
}
// 保存试题信息
function saveChildQsn() {
	var error = 0;// 错误数
	var obj = {};// 声明选项MAP
	var tab = $('#ttChild').tabs('getSelected');
	var index = $('#ttChild').tabs('getTabIndex', tab);
	var objChild = {};
	if (index == 0) {
		var answer = 0;// 初始选项答案
		var titleContent = $("#radio_title").val();
		obj["tx"] = "danxuan";
		obj["title"] = titleContent;
		var liitems = $("#radioOl").children("li");
		for ( var i = 0; i < liitems.length; i++) {
			// 循环li数组 获取按钮对象
			var radioItem = $(liitems[i]).children("input.radio_type");
			if ($(radioItem).is(":checked")) {
				// 如果按钮被选中则记录答案
				answer = i + 1;
			}
			// 获取文本信息
			var textarea = $(liitems[i]).children("input.input_user_info");
			var content = $(textarea).val();

			var objchildxx = {
				"xx" : 0
			};
			// 组织选项json数据
			objchildxx.xx = content;
			objChild[(i + 1) + ""] = objchildxx;
		}
		obj["xx"] = objChild;
		obj["daan"] = answer;
		if (answer == 0) {
			$("#radio_daan_content").html("请选择一项作为答案！");
			error++;
		} else {
			$("#radio_daan_content").html("");
		}
		if (!$('#radioForm').form("validate")) {
			return;
		}
		if (error > 0) {
			return;
		}
	}else if (index == 1) {
		var selectAnswer = "";// 初始选项答案
		var titleContent = $("#select_title").val();
		obj["tx"] = "duoxuan";
		obj["title"] = titleContent;
		var liitems = $("#selectOl").children("li");
		for ( var i = 0; i < liitems.length; i++) {
			// 循环li数组 获取按钮对象
			var selectItem = $(liitems[i]).children("input.check_type");
			if ($(selectItem).is(":checked")) {
				//如果按钮被选中则记录答案
				if(selectAnswer==""){
					selectAnswer+=i+1;
				}else{
					selectAnswer+=","+(i+1); 
				}
				
			}
			// 获取文本信息
			var textarea = $(liitems[i]).children("input.input_user_info");
			var content = $(textarea).val();

			var objchildxx = {
				"xx" : 0
			};
			// 组织选项json数据
			objchildxx.xx = content;
			objChild[(i + 1) + ""] = objchildxx;
		}
		obj["xx"] = objChild;
		obj["daan"] = selectAnswer;
		var answers=selectAnswer.split(",");
		if (selectAnswer==="" || answers.length < 1) {
			$("#select_daan_content").html("请至少选择一项作为答案！");
			error++;
		} else {
			$("#select_daan_content").html("");
		}
		if (!$('#selectForm').form("validate")) {
			return;
		}
		if (error > 0) {
			return;
		}
	}else if(index == 2){
		var judgeAnswer=-1;
		var jdaan = $("input:radio[name='judgeDaan']");
		var titleContent = $("#add_panduan_title").val();
		obj["tx"] = "panduan";
		obj["title"] = titleContent;
		for(var i=0;i<jdaan.length;i++){
			if ($(jdaan[i]).is(":checked")) {
				// 如果按钮被选中则记录答案
				judgeAnswer = $(jdaan[i]).val();
			}
		}
		obj["daan"] = judgeAnswer;
		if (judgeAnswer ==-1) {
			$("#judge_daan_content").html("请选择一项作为答案！");
			error++;
		} else {
			$("#judge_daan_content").html("");
		}
		if (!$('#judgeForm').form("validate")) {
			return;
		}
		if (error > 0) {
			return;
		}
	}else if(index == 3){
		var titleContent = $("#jiandatitle").val();
		var answerContent = $("#jiandadaan").val();
		obj["tx"] = "jianda";
		obj["title"] = titleContent;
		obj["daan"] = answerContent;
		if (!$('#jiandaForm').form("validate")) {
			return;
		}
		if (error > 0) {
			return;
		}
	}
	var qsnid = $("#addQsnidValue").val();
	$.post(baseUrl + "/admin/T010/updReadQsnChildQsn.html", {
		"qsnid" : qsnid,
		"data" : JSON.stringify(obj)
	}, function(data) {
		if (data > 0) {
			$.messager.confirm('提示', '保存成功,是否继续添加子试题？', function(r) {
				if (r) {
					
				} else {
					$('#childQsnDia').dialog("close");
				}
			});
			$('#itemlist').datagrid("load", {
				qsnid : qsnid
			});
		}else{
			msgShow("未知错误，请稍后重试！");
		}
	}, "json");
}
//保存试题信息
function updChildQsn() {
	var error = 0;// 错误数
	var obj = {};// 声明选项MAP
	var tab = $('#updttChild').tabs('getSelected');
	var index = $('#updttChild').tabs('getTabIndex', tab);
	var childQsnId=$('#childqsnId').val();
	var objChild = {};
	if (index == 0) {
		var answer = 0;// 初始选项答案
		var titleContent = $("#upd_radio_title").val();
		obj["tx"] = "danxuan";
		obj["title"] = titleContent;
		var liitems = $("#upd_radioOl").children("li");
		for ( var i = 0; i < liitems.length; i++) {
			// 循环li数组 获取按钮对象
			var radioItem = $(liitems[i]).children("input.radio_type");
			if ($(radioItem).is(":checked")) {
				// 如果按钮被选中则记录答案
				answer = i + 1;
			}
			// 获取文本信息
			var textarea = $(liitems[i]).children("input.input_user_info");
			var content = $(textarea).val();

			var objchildxx = {
				"xx" : 0
			};
			// 组织选项json数据
			objchildxx.xx = content;
			objChild[(i + 1) + ""] = objchildxx;
		}
		obj["xx"] = objChild;
		obj["daan"] = answer;
		if (answer == 0) {
			$("#upd_radio_daan_content").html("请选择一项作为答案！");
			error++;
		} else {
			$("#upd_radio_daan_content").html("");
		}
		if (!$('#updradioForm').form("validate")) {
			return;
		}
		if (error > 0) {
			return;
		}
	}else if (index == 1) {
		var selectAnswer = "";// 初始选项答案
		var titleContent = $("#upd_select_title").val();
		obj["tx"] = "duoxuan";
		obj["title"] = titleContent;
		var liitems = $("#upd_selectOl").children("li");
		for ( var i = 0; i < liitems.length; i++) {
			// 循环li数组 获取按钮对象
			var selectItem = $(liitems[i]).children("input.check_type");
			if ($(selectItem).is(":checked")) {
				//如果按钮被选中则记录答案
				if(selectAnswer==""){
					selectAnswer+=i+1;
				}else{
					selectAnswer+=","+(i+1); 
				}
				
			}
			// 获取文本信息
			var textarea = $(liitems[i]).children("input.input_user_info");
			var content = $(textarea).val();

			var objchildxx = {
				"xx" : 0
			};
			// 组织选项json数据
			objchildxx.xx = content;
			objChild[(i + 1) + ""] = objchildxx;
		}
		obj["xx"] = objChild;
		obj["daan"] = selectAnswer;
		var answers=selectAnswer.split(",");
//		alert(selectAnswer+"|"+answers.length);
		if (selectAnswer==="" || answers.length < 1) {
			$("#upd_select_daan_content").html("请至少选择一项作为答案！");
			error++;
		} else {
			$("#upd_select_daan_content").html("");
		}
		if (!$('#updselectForm').form("validate")) {
			return;
		}
		if (error > 0) {
			return;
		}
	}else if(index == 2){
		var judgeAnswer=-1;
		var jdaan = $("input:radio[name='updJudgedaan']");
		var titleContent = $("#updJudgeTitle").val();
		obj["tx"] = "panduan";
		obj["title"] = titleContent;
		for(var i=0;i<jdaan.length;i++){
			if ($(jdaan[i]).is(":checked")) {
				// 如果按钮被选中则记录答案
				judgeAnswer = $(jdaan[i]).val();
			}
		}
		obj["daan"] = judgeAnswer;
		if (!$('#updJudgeForm').form("validate")) {
			return;
		}
		if (error > 0) {
			return;
		}
	}else if(index == 3){
		var titleContent = $("#updjiandaTitle").val();
		var answerContent = $("#updjiandaAnswer").val();
		obj["tx"] = "jianda";
		obj["title"] = titleContent;
		obj["daan"] = answerContent;
		if (!$('#updJiandaForm').form("validate")) {
			return;
		}
		if (error > 0) {
			return;
		}
	}
	var qsnid = $("#addQsnidValue").val();
	$.post(baseUrl + "/admin/T010/updChildQsn.html", {
		"qsnid" : qsnid,
		"childid":childQsnId,
		"childData" : JSON.stringify(obj)
	}, function(data) {
		if (data > 0) {
			msgShow("更新成功！");
			$('#updRadioQsnDia').dialog("close");
			$('#itemlist').datagrid("load", {
				qsnid : qsnid
			});
		}
	}, "json");
}