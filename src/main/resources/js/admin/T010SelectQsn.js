var savetype=0;
$(function() {
	$('#tt').tabs({
		fit:true,
		cache:false,
		onSelect:selectTab
	});
	UE.getEditor("answerTitleEditor");
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
				url : baseUrl + "/admin/T010/saveSelectQsh.html",
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
						}else{
							if(savetype==1){
								window.parent.closeTabByTitle("试题管理");
								window.parent.openTab("试题管理", baseUrl
										+ "/admin/T010/manageQsn.html");
								window.parent.closeTabByTitle("编辑试题-不定项选择题");
							}else{
								window.parent.closeTabByTitle("试题管理");
							}
						}
						//清空下拉框内容
						$('#qsnclassify').combotree('setValue', '');
						$('#qsnlevel').combotree('setValue', '');
						$('#qsnknowledge').combotree('setValue', '');
						//清空题干和选项
						UE.getEditor("answerTitleEditor").setContent('');
						UE.getEditor("answer_1").setContent('');
						UE.getEditor("answer_2").setContent('');
						UE.getEditor("answer_3").setContent('');
						UE.getEditor("answer_4").setContent('');
						
						UE.getEditor("answerEditor").setContent('');
						var childrenItems = $("#answerOl").children("li");
						if(childrenItems.length > 4){
							for(var i=childrenItems.length;i>3;i--){
								$(childrenItems[i]).remove();
							}
						}
						//清空勾选项
						$("input[name='answer']").attr("checked",false);
					}else if(data == -2){
						msgShow("<span style='color:red'>试题重复，请修改题干！</span>");
					}  else {
						msgShow("<span style='color:red'>未知错误！请稍后重试！</span>");
					}
				}
			});
	if (pageType == 0) {
		//pageType 0代表添加 1代表更新 如果为0则实例初始ABCD四个选项
		UE.getEditor("answer_1");
		UE.getEditor("answer_2");
		UE.getEditor("answer_3");
		UE.getEditor("answer_4");
	} else {
		//否则禁用其他Tab标签并在解析加载后执行根据答案加载选项
		$('#tt').tabs("disableTab", 0);
		$('#tt').tabs("disableTab", 2);
		$('#tt').tabs("disableTab", 3);
		$('#tt').tabs("disableTab", 4);
		$('#tt').tabs("disableTab", 5);
		UE.getEditor("answerEditor").addListener( 'ready', function( editor ) {
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
		window.parent.closeTabByTitle("编辑试题-不定项选择题");
	}
}
//根据答案加载选项
function addQsnAnswerLi() {
	$.post(baseUrl+ "/admin/T010/findSelectQsn.html",{qsnid:rqsnid},function(data){
		$("#qsnclassify").combotree("setValue",data.classifyid);
		$("#qsnlevel").combotree("setValue",data.levelid);
		$("#qsnknowledge").combotree("setValue",data.knowledgeid);
		$("#qsnidValue").val(data.qsnid);
		//将答案转json
		var xxItems=eval("("+data.xx+")");
		var num=1;
		for(var i in xxItems){
			//循环答案并向OL中添加答案HTML
			var liHtml = "<li>"
				+ "<input type='checkbox' name='answer' id='answer_checkbox_"+num+"'/>答案&nbsp;&nbsp;<a class='blue_color_a' href='javascript:;' onclick='removeAnswerChild(this)'>删除</a>"

				+ "&nbsp;&nbsp;&nbsp;&nbsp;" + "<span id='answer_" + num
				+ "_content' style='color:red;'></span><br/>"
				+ "<textarea id='answer_" + num + "' ueid='answer_" + num
				+ "' name='content' style='width:90%;height:50px;' >"+xxItems[i].xx+"</textarea>"
				+ "</li>";
			$("#answerOl").append(liHtml);
			UE.getEditor('answer_' + num);
			
			num++;
		}
		var daanValues=data.daan.split(",");
		for(var j=0;j<daanValues.length;j++){
			$("#answer_checkbox_"+daanValues[j]).attr("checked", true);
		}
		nextNum=xxItems.length+1;
		UE.getEditor("answerTitleEditor").setContent(data.title);
		UE.getEditor("answerEditor").setContent(data.jieda);
		
	},"json");
}
var nextNum=5;
//添加选项
function addAnswerChild(){
	var liHtml="<li>"+
		"<input type='checkbox' name='answer'/>答案&nbsp;&nbsp;<a class='blue_color_a' href='javascript:;' onclick='removeAnswerChild(this)'>删除</a>"+
		"&nbsp;&nbsp;&nbsp;&nbsp;" + "<span id='answer_" + nextNum+ "_content' style='color:red;'></span><br/>"+
		"<textarea id='answer_"+nextNum+"' ueid='answer_" + nextNum+"' name='content' style='width:90%;height:50px;' > </textarea>"+
		"</li>";
	$("#answerOl").append(liHtml);
	UE.getEditor('answer_'+nextNum);
	
	nextNum++;
}
//移除选项
function removeAnswerChild(obj){
	var liItem=$(obj).parent();
	liItem.remove();
}
//点击tab标签跳转页面
function selectTab(title,index){
	if(index==0){
		window.location.href=baseUrl+"/admin/T010/editQsn.html?type=add&qsnid=0";
	}else if(index==2){
		window.location.href=baseUrl+"/admin/T010/editJudgeQsn.html?type=add&qsnid=0";
	}else if(index==3){
		window.location.href=baseUrl+"/admin/T010/editInBlankQsn.html?type=add&qsnid=0";
	}else if(index==4){
		window.location.href=baseUrl+"/admin/T010/editShortAnswerQsn.html?type=add&qsnid=0";
	}else if(index==5){
		window.location.href=baseUrl+"/admin/T010/editReadQsn.html?type=add&qsnid=0";
	}
}
//保存试题信息
function saveQsn(type) {
	savetype=type;
	var error = 0;//错误数
	var obj = {};//声明选项MAP
	var answer = "";//初始选项答案
	var titleContent = UE.getEditor("answerTitleEditor").getContent();
	var jiedaContent = UE.getEditor("answerEditor").getContent();
	var liitems = $("#answerOl").children("li");
	for ( var i = 0; i < liitems.length; i++) {
		//循环li数组 获取按钮对象
		var checkBoxItem = $(liitems[i]).children("input");
		if ($(checkBoxItem).is(":checked")) {
			//如果按钮被选中则记录答案
			if(answer==""){
				answer+=i+1;
			}else{
				answer+=","+(i+1); 
			}
			
		}
		//获取文本信息
		var textarea = $(liitems[i]).children("textarea");
		var id = $(textarea).attr("ueid");
		var content = UE.getEditor(id).getContent();
		var text = UE.getEditor(id).getContentTxt();
		if (text == "" || text == null) {
			//如果答案纯文本为空则向错误提示信息处添加错误信息
			$("#" + id + "_content").html("答案文本不能为空！");
			error = error + 1;
		} else {
			$("#" + id + "_content").html("");
		}
		var objchild = {
			"xx" : 0
		};
		//组织选项json数据
		objchild.xx = content;
		obj[(i + 1) + ""] = objchild;
	}
	var answers=answer.split(",");
	if (answer == "" || answers.length < 1) {
		$("#answer_daan_content").html("请至少选择一项作为答案！");
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
	$("#daanValue").val(answer);
	$("#xxValue").val(JSON.stringify(obj));
	$("#titleValue").val(titleContent);
	$("#jiedaValue").val(jiedaContent);
	$('#qsnForm').submit();
	return false;
}