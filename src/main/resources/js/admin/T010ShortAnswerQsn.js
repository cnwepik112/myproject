var savetype=0;
$(function() {
	$('#tt').tabs({
		fit : true,
		cache : false,
		onSelect : selectTab
	});
	UE.getEditor("answerTitleEditor");
	UE.getEditor("answerContentEditor");
	UE.getEditor("answerEditor");
	//初始化试题分类
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
	//初始化试题难度
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
	//初始化试题知识点
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
	//初始化试题提交表单
	$('#qsnForm').form(
			{
				url : baseUrl + "/admin/T010/saveShortAnswerQsn.html",
				onSubmit : function() {
					return $('#qsnForm').form("validate");
				},
				success : function(data) {
					if (data > 0) {
						msgShow("保存成功！");
						if (pageType == 0) {
							if(savetype==1){
								window.parent.closeTabByTitle("试题管理");
								window.parent.openTab("试题管理", baseUrl
										+ "/admin/T010/manageQsn.html");
								window.parent.closeTabByTitle("添加试题");
							}else{
								window.parent.closeTabByTitle("试题管理");
							}
						} else {
							if(savetype==1){
								window.parent.closeTabByTitle("试题管理");
								window.parent.openTab("试题管理", baseUrl
										+ "/admin/T010/manageQsn.html");
								window.parent.closeTabByTitle("编辑试题-简答题");
							}else{
								window.parent.closeTabByTitle("试题管理");
							}
						}
						//清空下拉框内容
						$('#qsnclassify').combotree('setValue', '');
						$('#qsnlevel').combotree('setValue', '');
						$('#qsnknowledge').combotree('setValue', '');
						//清空题干和解析
						UE.getEditor("answerTitleEditor").setContent('');
						UE.getEditor("answerContentEditor").setContent('');
						UE.getEditor("answerEditor").setContent('');
					} else if(data == -2){
						msgShow("<span style='color:red'>试题重复，请修改题干！</span>");
					} else {
						msgShow("<span style='color:red'>未知错误！请稍后重试！</span>");
					}
				}
			});
	if (pageType == 1) {
		//pageType 0代表添加 1代表更新 如果为1则禁用其他Tab标签并在解析加载后执行根据答案加载选项
		$('#tt').tabs("disableTab", 0);
		$('#tt').tabs("disableTab", 1);
		$('#tt').tabs("disableTab", 2);
		$('#tt').tabs("disableTab", 3);
		$('#tt').tabs("disableTab", 5);
		UE.getEditor("answerEditor").addListener('ready', function(editor) {
			addQsnAnswerLi();
		});
	}
});
function removePanel(){
	window.parent.closeTabByTitle("试题管理");
	window.parent.openTab("试题管理", baseUrl
			+ "/admin/T010/manageQsn.html");
	if (pageType == 0) {
		window.parent.closeTabByTitle("添加试题");
	}else{
		window.parent.closeTabByTitle("编辑试题-简答题");
	}
}
//根据答案加载选项
function addQsnAnswerLi() {
	$.post(baseUrl + "/admin/T010/findShortAnswerQsn.html", {
		qsnid : rqsnid
	}, function(data) {
		$("#qsnclassify").combotree("setValue", data.classifyid);
		$("#qsnlevel").combotree("setValue", data.levelid);
		$("#qsnknowledge").combotree("setValue", data.knowledgeid);
		$("#qsnidValue").val(data.qsnid);

		UE.getEditor("answerTitleEditor").setContent(data.title);
		UE.getEditor("answerContentEditor").setContent(data.daan);
		UE.getEditor("answerEditor").setContent(data.jieda);

	}, "json");
}
//点击tab标签跳转页面
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
	} else if (index == 5) {
		window.location.href = baseUrl
				+ "/admin/T010/editReadQsn.html?type=add&qsnid=0";
	}
}
//保存试题信息
function saveQsn(type) {
	savetype=type;
	var error = 0;
	var titleContent = UE.getEditor("answerTitleEditor").getContent();
	var answerContent = UE.getEditor("answerContentEditor").getContent();
	var jiedaContent = UE.getEditor("answerEditor").getContent();

	if (answerContent == null || answerContent == "") {
		$("#answer_daan_content").html("请输入答案内容！");
		error++;
	} else {
		$("#answer_daan_content").html("");
	}
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
	$("#daanValue").val(answerContent);
	$("#jiedaValue").val(jiedaContent);
	$('#qsnForm').submit();
	return false;
}