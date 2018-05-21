/**
 * 互动问答js
 * 
 * @since 2015/07/28
 * @author Limeng
 */

function   fmtLongDate(now)   {   
	var   year=now.getFullYear();
	var   month=now.getMonth()+1;   
	var   date=now.getDate();   
	var   hour=now.getHours();   
	var   minute=now.getMinutes();   
	var   second=now.getSeconds();   
	return year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;   
}
function   fmtShortDate(now)   {   
	var   year=now.getFullYear();
	var   month=now.getMonth()+1;   
	var   date=now.getDate();   
	return year+"-"+month+"-"+date;   
}

var queryDateCou = {};
queryDateCou.rows =10;
var queryDateFree = {};
queryDateFree.rows =10;
function showCouAskAnw(){
	$("#CouAskAnw").show();
	$("#ZiAskAns").hide();
	$("#kcSearch").show();
	$("#zwdSearch").hide();
	$("#kcSearch2").show();
	$("#zwdSearch2").hide();
	$("#pageCou").show();
	$("#pageFree").hide();
	queryDateCou.keyword="";
	initCouList();
	pageCou.getData = getCouPage;
}
function showZiAskAnw(){
	$("#ZiAskAns").show();
	$("#CouAskAnw").hide();
	$("#zwdSearch").show();
	$("#kcSearch").hide();
	$("#zwdSearch2").show();
	$("#kcSearch2").hide();
	$("#pageCou").hide();
	$("#pageFree").show();
	queryDateFree.keyword="";
	initFreeAskAns();
	pageFree.getData =getFreePage;
}
var pageCou;
var pageFree;
var className;
$(function(){
	pageCou = myPage("pageCou");
	pageFree = myPage("pageFree");
	initFreeAskAns();
	pageFree.getData =getFreePage;
	//自问答和课程问答选中切换样式
	$("#kcwdid").removeClass("askNaviSel");
	$("#zwdid").addClass("askNaviSel");
	$("#asknavi_id").delegate("li","click",function(){
		$("#asknavi_id").find(".askNaviSel").removeClass("askNaviSel");
		$(this).addClass("askNaviSel");
	});
});
//课程问答搜索框搜索
function kcSearch(){
	var keyword=$("#kcSearch").val();
	queryDateCou.keyword=keyword;
	initCouList();
}

//初始化
function initCouList(){

	queryDateCou.page = 1;
	
	$.ajax({
		url:'showAllCouList.html',
		data: queryDateCou,
		type: 'post',
		dataType: 'json',
		success:function(result){
			createMyPageCou(Math.ceil(result.total/queryDateCou.rows));
			data=result.rows;
			forCouData(data);
		}
	});
}
//翻页
function getCouPage(pageNo){
	if(queryDateCou.page != pageNo){
		//设置页码
		queryDateCou.page = pageNo;
		$.ajax({
			url:'showAllCouList.html',
			data: queryDateCou,
			type: 'post',
			dataType: 'json',
			success:function(result){
				data=result.rows;
				forCouData(data);
			}
		});
	}
}

function forCouData(data){
	$("#CouList").empty();
	for(var i=0;i<data.length;i++){
		var uuid=data[i].uuid;
		var courseid=data[i].courseId;
		var idname="askAndAns"+courseid;
		var html="<div class='askqa' id='askqa'"+courseid+">";
				html+="<div class='askmeus'>";
					html+="<table  border='0' cellpadding='0' cellspacing='0'>";
						html+="<tr>";
							html+="<th width='110'>"+data[i].lectName+"</th>";
							html+="<th width='452'>"+data[i].name+"</th>";
							html+="<th width='400'>"+data[i].askCount+"个问题</th>";
							html+="<th width='90' >" +
									"<a onclick=showAskAndAns('"+uuid+"',"+courseid+") style='cursor:pointer;'>查看</a>" +"|"+
									"<a onclick=couOpenAndClose("+courseid+") style='cursor:pointer;'>收起</a></th>";
						html+="</tr>";
					html+="</table>";
				html+="</div>";	
				html+="<div id="+idname+"></div>";
			html+="</div>";	
		$("#CouList").append(html);
	}
}
function couOpenAndClose(courseid){
	divname="#askAndAns"+courseid;
	if ($(divname).length>0){ 
		$(divname).empty();
	} 
	
}
function createMyPageCou(total){
	pageCou.initPage(total);
}
function showAskAndAns(uuid,courseid){
	myData={uuid:uuid};
	$.ajax({
		url:'showSelectedAskAndAns.html',
		data: myData,
		type: 'post',
		dataType: 'json',
		success:function(result){
			var idname="#askAndAns"+courseid;
			$(idname).empty();
			for(var i=0;i<result.length;i++){
				var time1=fmtLongDate(new Date(result[i].insdate));
				var html ='<div class="askq" id="couOpenClose'+courseid+'">';
				 		html+='<dl>';
					 		html+='<dt><img src="'+baseUrl+'/resources/mta/images/q.png" width="36" height="40" alt="" /></dt>';
					 		html+='<dd><span>'+result[i].title+'</span></dd>';
					 		html+='<dd>内容：'+result[i].content+'</dd>';
					 		html+='<dd>提问者：'+result[i].username+'&nbsp;&nbsp;&nbsp;&nbsp;提问时间：'+time1+'</dd>';
					 		html+='<span style="font-size: 14px; color: Gold;">';
					 		if(result[i].askApprove == 1){
					 			html+='已完结';
					 		}
					 		html+='</span>';
				 		html+='</dl>';
				 		html+='<ul>';
				 		//如果登陆者id不等于提问者id则显示回复按钮 且 问题采纳字段不等于1
				 		if(loginUserId != result[i].insuser && result[i].askApprove !=1){
				 			//调用弹出回复js  传入当前问题id
				 			html+='<li><a href="javascript:;"><img onclick=tancAskhf("'+result[i].id+'") src="'+baseUrl+'/resources/mta/images/ask_icon01.png" width="69" height="30" alt="" /></a></li>';
				 		}
				 		html+='</ul>';
				 	html+='</div>';	
			 	$(idname).append(html); 	
				 	for(var j=0;j<result[i].answerList.length;j++){
				 		var time2=fmtLongDate(new Date(result[i].answerList[j].insdate));
				 		var html2='<div class="aska">';
				 			html2+='<dl>';
					 			html2+='<dt><img src="'+baseUrl+'/resources/mta/images/a.png" width="36" height="40" alt="" /></dt>';
					 			html2+='<dd>回答者：'+result[i].answerList[j].username+'&nbsp;&nbsp;&nbsp;&nbsp;回答时间：'+time2+'</dd>';
					 			html2+='<dd>回答内容：'+result[i].answerList[j].content+'</dd>';
					 			
				 				if(result[i].answerList[j].ansApprove == 1){
				 					html2+='<span style="font-size: 14px; color: HotPink;">';
				 					html2+='被采纳';
					 				html2+='</span>';
				 				}
			 				html2+='</dl>';
			 				html2+='<ul>';
	
			 				//如果登陆者id 等于 回答者id 则显示编辑和删除 问题采纳字段不等于1
			 				if(loginUserId==result[i].answerList[j].insuser && result[i].askApprove !=1){
			 					html2+='<li><a href="javascript:;"><img onclick=getAnsById("'+result[i].answerList[j].id+'") src="'+baseUrl+'/resources/mta/images/ask_icon02.png" width="69" height="30" alt="" /></a></li>';
			 					html2+='<li><a href="javascript:;"><img onclick=delAnsById("'+result[i].answerList[j].id+'","'+courseid+'","'+uuid+'") src="'+baseUrl+'/resources/mta/images/ask_icon03.png" width="69" height="30" alt="" /></a></li>';
			 				}
			 				//如果登陆者id 等于 提问者id 则显示采纳 问题采纳字段不等于1
			 				if(loginUserId == result[i].insuser && result[i].askApprove !=1){
			 					html2+='<li><a href="javascript:;"><img onclick=updApprove("'+result[i].id+'","'+result[i].answerList[j].id+'","'+courseid+'","'+uuid+'") src="'+baseUrl+'/resources/mta/images/ask_icon05.png" width="69" height="30" alt="" /></a></li>';
			 				}
			 				html2+='</ul>';
		 				html2+='</div>';
		 				//编辑框
		 				html2+='<div style="display:none" class="ansbj ansbj'+result[i].answerList[j].id+'">';
		 					html2+='<textarea style="width:880px;height:66px;border:1px solid #ccc;padding:3px;color:#666;" name="" cols="" rows="" class="messageBJ'+result[i].answerList[j].id+'"></textarea>';
		 					html2+='<a href="javascript:;"><img onclick=updAnswer("'+result[i].answerList[j].id+'","'+courseid+'","'+uuid+'") src="'+baseUrl+'/resources/mta/images/ask_icon06.png" width="69" height="30" alt="" /></a>';
		 				html2+='</div>';
		 				
		 				$(idname).append(html2); 	
				 	}
				 	
				 	//回复框
				 	var html3='<div style="display:none" class="askhf askhf'+result[i].id+'">';
				 			html3+='<dl>';
				 				html3+='<dt><textarea style="width:880px;height:66px;border:1px solid #ccc;padding:3px;color:#666;" class="messageLi'+result[i].id+'" ></textarea></dt>';
				 				html3+='<dd><a href="javascript:;"><img onclick=addAnswer("'+result[i].id+'","'+courseid+'","'+uuid+'") src="'+baseUrl+'/resources/mta/images/ask_icon06.png" width="69" height="30" alt="" /></a></dd>';
				 				html3+='</dl>';
				 		html3+='</div>';
				$(idname).append(html3); 
				
			}
		}
	});
}

//弹出回复
function tancAskhf(askid){
	var calssName=".askhf"+askid;
	$(calssName).show();
}

//提交回复
function addAnswer(askid,courseId,uuid){
	className=".messageLi"+askid;
	var content = $(className).val();
	if(content !="" && content !=null && loginUserId !=""){
		$.post("AddAnswer.html",
		{
		id:askid,
		courseid:courseId,
		content:content
		},
		function(data,status){
			if(data > 0){
				showAskAndAns(uuid,courseId);
			}
		});
		}else{
			alert("没登陆 或 回复内容不能为空！！！");
		}
}

//取当前编辑回答的内容
function getAnsById(ansid){
	className=".messageBJ"+ansid;
	$.post("getAnswerById.html",
	{
		id:ansid
	},
	function(data,status){
		if(data != null){
			tancUpd(ansid);
			$(className).val(data.content);
		}
	},"json");
	
}
//弹出编辑框
function tancUpd(ansid){
	var calssName=".ansbj"+ansid;
	$(calssName).show();
}
//提交更新编辑内容
function updAnswer(ansid,courseid,uuid){
	className=".messageBJ"+ansid;
	var content=$(className).val();
	$.post("updAnswer.html",
	{
		id:ansid,
		content:content
	},
	function(data,status){
		if(data > 0){
			showAskAndAns(uuid,courseid);
		}
	},"json");
}

//删除回复
function delAnsById(ansid,courseid,uuid){
	if(confirm("确定删除？")){
		$.post("delAnswer.html",
		{
			id:ansid
		},
		function(data,status){
			if(data > 0){
				showAskAndAns(uuid,courseid);
			}
		},"json");
	}
}
//采纳按钮
function updApprove(askid,ansid,courseid,uuid){
	$.post("updApprove.html",
	{
		askid:askid,
		ansid:ansid
	},
	function(data,status){
		if(data > 0){
			showAskAndAns(uuid,courseid);
		}
	},"json");
}
//==================================================自问带==================================================//
function createMyPageFree(total){
	pageFree.initPage(total);
}
//插入问题
function insertAsk(){
	var content = $("#message").val();
	if(content !="" && content !=null && loginUserId !=""){
		$.post("insertAsk.html",
		{
		content:content
		},
		function(data,status){
			if(data > 0){
				initFreeAskAns();
				showZiAskAnw();
				$("#kcwdid").removeClass("askNaviSel");
				$("#zwdid").addClass("askNaviSel");
				$("#message").val("");
				confirm("提问成功");
			}
		});
	}else{
			alert("您没登陆 或 提问内容为空！！！");
	}
			
}
//自问答搜索框搜索
function freeSearch(){
	var keyword=$("#zwdSearch").val();
	queryDateFree.keyword=keyword;
	initFreeAskAns();
}
//初始化自问
function initFreeAskAns(){
	
	queryDateFree.page = 1;
	
	$.ajax({
		url:'findFreeAskAndAnsList.html',
		data: queryDateFree,
		type: 'post',
		dataType: 'json',
		success:function(data){
			createMyPageFree(Math.ceil(data.total/queryDateFree.rows));
			getFreeData(data);
			
		}
	});
} 

//翻页
function getFreePage(pageNo){
	if(queryDateFree.page != pageNo){
		//设置页码
		queryDateFree.page = pageNo;
		$.ajax({
			url:'findFreeAskAndAnsList.html',
			data: queryDateFree,
			type: 'post',
			dataType: 'json',
			success:function(data){
				getFreeData(data);
			}
		});
	}
}
//刷新当前页
function refreshFreePage(){
		//设置页码
		queryDateFree.page = pageFree.pageNum;
		$.ajax({
			url:'findFreeAskAndAnsList.html',
			data: queryDateFree,
			type: 'post',
			dataType: 'json',
			success:function(data){
				getFreeData(data);
			}
		});
}

function getFreeData(data){
	var result=data.rows;
	var idname="#ziaskList";
	$(idname).empty();
	for(var i=0;i<result.length;i++){
		var time1=fmtLongDate(new Date(result[i].insdate));
		var idname2="freeAns"+result[i].id;
		var html ='<div class="askq">';
		 		html+='<dl>';
			 		html+='<dt><img src="'+baseUrl+'/resources/mta/images/q.png" width="36" height="40" alt="" /></dt>';
			 		html+='<dd><a style="cursor:pointer" id=flag'+result[i].id+' flag="0" '+
			 		' onclick=ansShowHide("'+result[i].id+'","'+idname2+'","'+result[i].insuser+'","'+result[i].askApprove+'") ><span>'+result[i].title+'</span><span style="font-size:14px; color:#ccc;font-weight: normal;font-family:宋体;">展开/收起</span></a></dd>';
			 		html+='<dd>内容：'+result[i].content+'</dd>';
			 		html+='<dd>提问者：'+result[i].username+'&nbsp;&nbsp;&nbsp;&nbsp;提问时间：'+time1+'</dd>';
			 		html+='<span style="font-size: 14px; color: Gold;">';
			 		if(result[i].askApprove == 1){
			 			html+='已完结';
			 		}
			 		html+='</span>';
		 		html+='</dl>';
		 		html+='<ul>';
		 		//如果登陆者id不等于提问者id则显示回复按钮 且 问题采纳字段不等于1
		 		if(loginUserId != result[i].insuser && result[i].askApprove !=1){
		 			//调用弹出回复js  传入当前问题id
		 			html+='<li><a href="javascript:;"><img onclick=tancAskhf2("'+result[i].id+'","'+idname2+'","'+result[i].insuser+'","'+result[i].askApprove+'") src="'+baseUrl+'/resources/mta/images/ask_icon01.png" width="69" height="30" alt="" /></a></li>';
		 		}
		 		//如果登陆者id等于提问者id则显示删除按钮
		 		if(loginUserId == result[i].insuser){
		 			//调用删除 传入当前问题id
		 			html+='<li><a href="javascript:;"><img onclick=delAskById2("'+result[i].id+'","'+idname2+'","'+result[i].insuser+'","'+result[i].askApprove+'") src="'+baseUrl+'/resources/mta/images/ask_icon03.png" width="69" height="30" alt="" /></a></li>';
		 		}
		 		html+='</ul>';
		 	html+='</div>';	
		 	//放问题对应问题的div
		 	html+='<div id='+idname2+'></div>';
	 	$(idname).append(html); 	
		
		 
	 	//回复框
	 	var html3='<div style="display:none" class="askhf askhf'+result[i].id+'">';
	 			html3+='<dl>';
	 				html3+='<dt><textarea style="width:880px;height:66px;border:1px solid #ccc;padding:3px;color:#666;" class="messageLi'+result[i].id+'" ></textarea></dt>';
	 				html3+='<dd><a href="javascript:;"><img onclick=addAnswer2("'+result[i].id+'","'+idname2+'","'+result[i].insuser+'","'+result[i].askApprove+'") src="'+baseUrl+'/resources/mta/images/ask_icon06.png" width="69" height="30" alt="" /></a></dd>';
	 				html3+='</dl>';
	 		html3+='</div>';
		$(idname).append(html3); 
		
	}
}
function ansShowHide(askid,idname2,askuser,askApp){
	var flagid="#flag"+askid;
	var flag=$(flagid).attr("flag");
	if(flag=="0"){
		showClickAskAsn(askid,idname2,askuser,askApp);
		$(flagid).attr("flag","1");
	}
	if(flag=="1"){
		var idname="#"+idname2;
		$(idname).empty();
		$(flagid).attr("flag","0");
	}
}


function showClickAskAsn(askid,idname2,askuser,askApp){
	var idname="#"+idname2;
	$.ajax({
		url:'findFreeAnsList.html',
		data: {upid:askid},
		type: 'post',
		dataType: 'json',
		success:function(data){
			$(idname).empty();
			for(var j=0;j<data.length;j++){
		 		var time2=fmtLongDate(new Date(data[j].ansInsDate));
				//time2=data[j].insdate;
		 		var html2='<div class="aska">';
		 			html2+='<dl>';
			 			html2+='<dt><img src="'+baseUrl+'/resources/mta/images/a.png" width="36" height="40" alt="" /></dt>';
			 			html2+='<dd>回答者：'+data[j].ansUserName+'&nbsp;&nbsp;&nbsp;&nbsp;回答时间：'+time2+'</dd>';
			 			html2+='<dd>回答内容：'+data[j].ansContent+'</dd>';
			 			
		 				if(data[j].ansApprove == 1){
		 					html2+='<span style="font-size: 14px; color: HotPink;">';
		 					html2+='被采纳';
			 				html2+='</span>';
		 				}
	 				html2+='</dl>';
	 				html2+='<ul>';

	 				//如果登陆者id 等于 回答者id 则显示编辑和删除 问题采纳字段不等于1
	 				if(loginUserId==data[j].ansInsUser && askApp !=1){
	 					html2+='<li><a href="javascript:;"><img onclick=getAnsById2("'+data[j].ansid+'") src="'+baseUrl+'/resources/mta/images/ask_icon02.png" width="69" height="30" alt="" /></a></li>';
	 					html2+='<li><a href="javascript:;"><img onclick=delAnsById2("'+data[j].ansid+'","'+askid+'","'+idname2+'","'+askuser+'","'+askApp+'") src="'+baseUrl+'/resources/mta/images/ask_icon03.png" width="69" height="30" alt="" /></a></li>';
	 				}
	 				//如果登陆者id 等于 提问者id 则显示采纳 问题采纳字段不等于1
	 				if(loginUserId == askuser && askApp !=1){
	 					html2+='<li><a href="javascript:;"><img onclick=updApprove2("'+askid+'","'+data[j].ansid+'","'+askid+'","'+idname2+'","'+askuser+'","'+askApp+'") src="'+baseUrl+'/resources/mta/images/ask_icon05.png" width="69" height="30" alt="" /></a></li>';
	 					
	 				}
	 				html2+='</ul>';
 				html2+='</div>';
 				//编辑框
 				html2+='<div style="display:none" class="ansbj ansbj'+data[j].ansid+'">';
 					html2+='<textarea style="width:880px;height:66px;border:1px solid #ccc;padding:3px;color:#666;" name="" cols="" rows="" class="messageBJ'+data[j].ansid+'"></textarea>';
 					html2+='<a href="javascript:;"><img onclick=updAnswer2("'+data[j].ansid+'","'+askid+'","'+idname2+'","'+askuser+'","'+askApp+'") src="'+baseUrl+'/resources/mta/images/ask_icon06.png" width="69" height="30" alt="" /></a>';
 				html2+='</div>';
 				
 				$(idname).append(html2); 	
		 	}
		}
	});
	
}
//弹出回复
function tancAskhf2(askid,idname2,askuser,askApp){
	var calssName=".askhf"+askid;
	showClickAskAsn(askid,idname2,askuser,askApp);
	$(calssName).show();
}
//提交回复
function addAnswer2(askid,idname2,askuser,askApp){
	className=".messageLi"+askid;
	var content = $(className).val();
	if(content !="" && content !=null && loginUserId !=""){
		$.post("AddAnswer.html",
		{
		id:askid,
		content:content
		},
		function(data,status){
			if(data > 0){
				showClickAskAsn(askid,idname2,askuser,askApp);
				$(".askhf").hide();
			}
		});
		}else{
			confirm("没登陆 或 回复内容不能为空！！！")
		}
}
//取当前编辑回答的内容
function getAnsById2(ansid){
	className=".messageBJ"+ansid;
	$.post("getAnswerById.html",
	{
		id:ansid
	},
	function(data,status){
		if(data != null){
			tancUpd(ansid);
			$(className).val(data.content);
		}
	},"json");
	
}
//提交更新编辑内容
function updAnswer2(ansid,askid,idname2,askuser,askApp){
	className=".messageBJ"+ansid;
	var content=$(className).val();
	$.post("updAnswer.html",
	{
		id:ansid,
		content:content
	},
	function(data,status){
		if(data > 0){
			showClickAskAsn(askid,idname2,askuser,askApp);
		}
	},"json");
}
//删除问题
function delAskById2(ansid,askid,idname2,askuser,askApp){
	if(confirm("确定删除？")){
		$.post("delAskByid.html",
		{
			id:ansid
		},
		function(data,status){
			if(data > 0){
				refreshFreePage();
			}
		},"json");
	}
}
//删除回复
function delAnsById2(ansid,askid,idname2,askuser,askApp){
	if(confirm("确定删除？")){
		$.post("delAnswer.html",
		{
			id:ansid
		},
		function(data,status){
			if(data > 0){
				showClickAskAsn(askid,idname2,askuser,askApp);
			}
		},"json");
	}
}
//采纳按钮
function updApprove2(askid,ansid,askid,idname2,askuser,askApp){
	$.post("updApprove.html",
	{
		askid:askid,
		ansid:ansid
	},
	function(data,status){
		if(data > 0){
			 refreshFreePage();
			//showClickAskAsn(askid,idname2,askuser,askApp);
		}
	},"json");
}