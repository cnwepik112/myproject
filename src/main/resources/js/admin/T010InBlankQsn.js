var savetype=0;
$(function() {
	$('#tt').tabs({
		fit:true,
		cache:false,
		onSelect:selectTab
	});
	UE.getEditor("answerTitleEditor");
	//题干部分丢失焦点触发删除填空选项方法
	UE.getEditor("answerTitleEditor").addListener('blur',function(editor){removeChildLiByUe();});
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
	$('#qsnForm').form({
		url : baseUrl + "/admin/T010/saveInBlankQsh.html",
		onSubmit : function() {
			return $('#qsnForm').form("validate");
		},
		success : function(data) {
			if (data > 0) {
				if (pageType == 0) {
					msgShow("保存成功！");
					if(savetype==1){
						window.parent.closeTabByTitle("试题管理");
						window.parent.openTab("试题管理", baseUrl
								+ "/admin/T010/manageQsn.html");
						window.parent.closeTabByTitle("添加试题");
					}else{
						window.parent.closeTabByTitle("试题管理");
					}
				}else{
					msgShow("保存成功！");
					if(savetype==1){
						window.parent.closeTabByTitle("试题管理");
						window.parent.openTab("试题管理", baseUrl
								+ "/admin/T010/manageQsn.html");
						window.parent.closeTabByTitle("编辑试题-填空题");
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
				UE.getEditor("answerEditor").setContent('');
				$("#answerOl").empty();
			}else if(data == -2){
				msgShow("<span style='color:red'>试题重复，请修改题干！</span>");
			}else {
				msgShow("<span style='color:red'>未知错误！请稍后重试！</span>");
			}
		}
	});
	if (pageType == 1) {
		//pageType 0代表添加 1代表更新 如果为1则禁用其他Tab标签并在解析加载后执行根据答案加载选项
		$('#tt').tabs("disableTab", 0);
		$('#tt').tabs("disableTab", 1);
		$('#tt').tabs("disableTab", 2);
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
		window.parent.closeTabByTitle("编辑试题-填空题");
	}
}
//被删除填空游标数组
var removeNum=[];
//下一位填空游标
var nextNum=1;
//最大填空游标
var maxNum=1;
//根据答案加载选项
function addQsnAnswerLi() {
		$.post(baseUrl+ "/admin/T010/findInBlankQsn.html",{qsnid:rqsnid},function(data){
			$("#qsnclassify").combotree("setValue",data.classifyid);
			$("#qsnlevel").combotree("setValue",data.levelid);
			$("#qsnknowledge").combotree("setValue",data.knowledgeid);
			$("#qsnidValue").val(data.qsnid);
			//将答案转json
			var kongsItems=eval("("+data.kongs+")");
			
			var num=1;
			
			for(var i in kongsItems){
				//循环答案并向OL中添加答案HTML
				var liHtml="<li>"+
				"<input type='button' disabled='disabled' style='width:80px' linkageblock='options:"+num+"' value='填空"+num+"'/>&nbsp;&nbsp;"+
				"<a class='blue_color_a' href='javascript:;' cid='"+num+"' onclick='removeAnswerChild(this)'>删除</a><br/><br/>"+
				"<span style='font-size:12px;font-style: italic;'>答案：</span><input id='options_txt_"+num+"_0' class='input_user_info' type='text'/>&nbsp;&nbsp;"+
				"<input id='options_txt_"+num+"_1' class='input_user_info' type='text'/>&nbsp;&nbsp;"+
				"<input id='options_txt_"+num+"_2' class='input_user_info' type='text'/><span style='font-size:12px;font-style: italic;'>支持添加多个答案</span>"+
				"</li>";
				$("#answerOl").append(liHtml);
				var strs=kongsItems[i].kong.split("#");
				for(var j=0;j<strs.length;j++){
					$('#options_txt_'+num+'_'+j).val(strs[j]);
				}
				$('#options_txt_'+num+'_0').validatebox({    
				    required: true   
				}); 
				
				num++;
			}
			maxNum=num;
			var newTitle=replaceTitleContentFromDate(data.title);
			UE.getEditor("answerTitleEditor").setContent(newTitle);
			UE.getEditor("answerEditor").setContent(data.jieda);
			
		},"json");
}

//增加填空
function addAnswerChild(){
	
	if(removeNum.length>0){
		//如果被删除填空游标数组长度>0则排序并赋值给下一位填空游标
		removeNum=removeNum.sort(function(a,b){return a>b?1:-1});
		nextNum=removeNum[0];
	}else{
		//否则 等于最大游标
		nextNum=maxNum;
	}
	//插入内容
	var liHtml="<li>"+
		"<input type='button' disabled='disabled' style='width:80px' linkageblock='options:"+nextNum+"' value='填空"+nextNum+"'/>&nbsp;&nbsp;"+
		"<a class='blue_color_a' href='javascript:;' cid='"+nextNum+"' onclick='removeAnswerChild(this)'>删除</a><br/><br/>"+
		"<span style='font-size:12px;font-style: italic;'>答案：</span><input id='options_txt_"+nextNum+"_0' class='input_user_info' type='text'/>&nbsp;&nbsp;"+
		"<input id='options_txt_"+nextNum+"_1' class='input_user_info' type='text'/>&nbsp;&nbsp;"+
		"<input id='options_txt_"+nextNum+"_2' class='input_user_info' type='text'/><span style='font-size:12px;font-style: italic;'>支持添加多个答案</span>"+
		"</li>";
	$("#answerOl").append(liHtml);
	$('#options_txt_'+nextNum+'_0').validatebox({    
	    required: true   
	});  
	//获取题干内容
	var oldText=UE.getEditor("answerTitleEditor").getContent();
	//最佳html代码 即向editor中追加象征填空空位按钮
	UE.getEditor("answerTitleEditor").execCommand('insertHtml', "<input type='button' style='width:80px' disabled='disabled' linkageblock='options:"+nextNum+"' value='填空"+nextNum+"'/>")
	
	if(removeNum.length>0){
		//如果被删除填空游标数组长度>0则删除第一位
		removeNum.splice(0,1);
	}else{
		//最大游标数+1
		maxNum++;
	}
}
//当删除Editor中的空位按钮时删除答案选项中对应空位
function removeChildLiByUe(){
	var oldText=UE.getEditor("answerTitleEditor").getContent();
	//查询Ol下删除按钮组
	var items=$("#answerOl").find("a");
	for(var i=0;i<items.length;i++){
		var item=items[i];
		//根据删除按钮获得上一个同胞button的linkageblock属性值
		var btnlinkageblock=$(item).prev().attr("linkageblock");
		//如果Editor中内容不包含属性值则删除对应空位
		if(oldText.indexOf(btnlinkageblock) < 0){
			removeNum.push($(item).attr("cid"));
			$(item).parent().remove();
		}
	}
}
//删除答案选项
function removeAnswerChild(obj){
	removeNum.push($(obj).attr("cid"));
	var btnlinkageblock=$(obj).prev().attr("linkageblock");
	var btnValue=$(obj).prev().attr("value");
	var liItem=$(obj).parent();
	liItem.remove();
	var oldText=UE.getEditor("answerTitleEditor").getContent();
	var newText=replaceTitleContent(oldText,btnlinkageblock);
	UE.getEditor("answerTitleEditor").setContent(newText);
	
}
//为删除填空选项时同时删除Editor中的选项构建Editor中的内容
function replaceTitleContent(content,rStr){
	var newContent=content;
	var strs=content.split("<input");
	for(var i=0;i<strs.length;i++){
		var str=strs[i];
		if(str.indexOf(rStr)>0){
			str=str.substr(0,str.indexOf("/>")+2);
			var inputStr="<input"+str;
			newContent=newContent.replace(inputStr,"");
		}
	}
	return newContent;
}
//为保存，构建题干Editor中的内容
function replaceTitleContentForSave(content){
	var newContent=content;
	var strs=content.split("<input");
	for(var i=0;i<strs.length;i++){
		var str=strs[i];
		var lastIndex=str.indexOf("/>");
		if(lastIndex!==-1){
			str=str.substr(0,lastIndex+2);
			var inputStr="<input"+str;
			newContent=newContent.replace(inputStr,"（）");
		}
	}
	return newContent;
}
//为保存，构建题干Editor中的内容
function replaceTitleContentFromDate(content){
	var newContent="";
	var strs=content.trim().replace("()","（）").split("（）");
	for(var i=0;i<strs.length;i++){
		var num=i+1;
		if(i<strs.length-1){
			newContent+=strs[i]+"<input type='button' style='width:80px' disabled='disabled' linkageblock='options:"+num+"' value='填空"+num+"'/>";
		}else{
			newContent+=strs[i];
		}
	}
	return newContent;
}
//点击tab标签跳转页面
function selectTab(title,index){
	if(index==0){
		window.location.href=baseUrl+"/admin/T010/editQsn.html?type=add&qsnid=0";
	}else if(index==1){
		window.location.href=baseUrl+"/admin/T010/editSelectQsn.html?type=add&qsnid=0";
	}else if(index==2){
		window.location.href=baseUrl+"/admin/T010/editJudgeQsn.html?type=add&qsnid=0";
	}else  if(index==4){
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
//	var answer = 0;//初始选项答案
	var titleContent = UE.getEditor("answerTitleEditor").getContent();
	var titleContentTxt = UE.getEditor("answerTitleEditor").getContentTxt();
	var jiedaContent = UE.getEditor("answerEditor").getContent();
	var liitems = $("#answerOl").children("li");
	for ( var i = 0; i < liitems.length; i++) {
		//循环li数组 获取按钮对象
		var txtItem = $(liitems[i]).children("input.input_user_info");
		var answer = "";
		for(var j=0;j<txtItem.length;j++){
			if(j==0){
				answer+=$(txtItem[j]).val();
			}else{
				answer+="#"+$(txtItem[j]).val();
			}
		}
		var objchild = {
			"kong" : ""
		};
		//组织选项json数据
		objchild.kong = answer;
		obj[(i + 1) + ""] = objchild;
	}
	
	if (liitems.length <= 0) {
		$("#answer_daan_content").html("请添加答案！");
		error++;
	} else {
		$("#answer_daan_content").html("");
	}
	if (titleContentTxt == "" || titleContentTxt == null) {
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
	var titleTxt=replaceTitleContentForSave(titleContent);
	$("#kongsValue").val(JSON.stringify(obj));
	$("#titleValue").val(titleTxt);
	$("#jiedaValue").val(jiedaContent);
	$('#qsnForm').submit();
	return false;
}