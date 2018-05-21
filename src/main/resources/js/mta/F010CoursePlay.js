var timeID = '';
var time = 0;
var uuid = GetRequest().uuid;
var cwId = '';
var titleInfo = '';
var coursewareId=0;
var notesPage = '';
var askqaPage = '';
var tzFlag = '';
$(function (){
	
	$(".mainNavi ul li").bind("click",function(){
		$(this).addClass("selected").siblings().removeClass("selected");
		var index = $(".mainNavi ul li").index($(this));
		$("#content > div").eq(index).show().siblings().hide();
	});
	
//	 var flashvars={
//		f:'/mta3/resources/js/ckplayer/1.flv',
//        c:0,
//        e:0,
//        loaded:'getPlayStatus'
//    };
//    var video=['/mta3/resources/js/ckplayer/2.flv->video/flv'];
//    CKobject.embed('resources/js/ckplayer/ckplayer/ckplayer.swf','courseplay','ckplayer_a1','686','508',false,flashvars,'');
    
    getChapterMenu();
    
  //加載課程筆記
	getNote();
	
	getAskqa();
    
});

function getPlayStatus(){
	if(CKobject.getObjectById('ckplayer_a1').getType()){
      CKobject.getObjectById('ckplayer_a1').addListener('time',getPlayTime);
      CKobject.getObjectById('ckplayer_a1').addListener('paused',stopTime);
      CKobject.getObjectById('ckplayer_a1').addListener('sendNetStream',initTotalTime);
    }
    else{
      CKobject.getObjectById('ckplayer_a1').addListener('time','getPlayTime');
      CKobject.getObjectById('ckplayer_a1').addListener('paused','stopTime');
      CKobject.getObjectById('ckplayer_a1').addListener('sendNetStream','initTotalTime');
    }

//	initTotalTime();
}

function initTotalTime(){
	
//	延迟10秒获取视频总时长
//	setTimeout("getTotalTime()",5000);
	getTotalTime();
	if(timeID != ''){
		clearTimeout(timeID);
	}
}

function getTotalTime(){
	totalTime = CKobject.getObjectById('ckplayer_a1').getStatus().totalTime;
}

//获取当前播放时间
function getPlayTime(t){
	time = t;
}


//判断播放暂停状态
function stopTime(b){
    if(!b){
    	gatTimeStatus();
    }else{
    	clearTimeout(timeID);
    }
}

function gatTimeStatus(){
	var p = Math.ceil(time*100/totalTime);
	if(progres[cwId] != 100){
		if(p > progres[cwId]){
			progres[cwId] = p;
			// console.log(progres[cwId]);
			saveProgres();
		}
		timeID = setTimeout("gatTimeStatus()",60000);
	}
}

function playerstop(){
	clearTimeout(timeID);
	var p = Math.ceil(time*100/totalTime);
	progres[cwId] = p;
	if(p == 100){
	    updateStatus();
	}
	saveProgres();
}

function saveProgres(){
	// console.log(JSON.stringify(progres));
	$.ajax({
		url:'mta/F010/updateProgres.html',
		dataType: 'json',
		data: {"uuid":uuid,"progres":JSON.stringify(progres)},
		type: 'post'
	});
}

function getChapterMenu(){
	$.ajax({
		url:'mta/F010/getChapterInfo.html',
		dataType: 'json',
		data: {"uuid":uuid},
		type: 'post',
		success:function(result){
		    tzFlag = result.tzFlag;
			var chapterInfo = result.chapterInfo;
			progres = eval("("+result.progres+")");
			for(var i in chapterInfo){
				var chapterHtml = "";
				var chapter = chapterInfo[i];
				chapterHtml += "<dl><dt>第" + parseInt(parseInt(i)+1) + "章 "+ chapter.chapterName +"</dt>";
				var section = chapter.section;
				for(var y in section){
					chapterHtml += "<dd><h3>&nbsp;第" + parseInt(parseInt(y)+1) + "节 "+ section[y].sectionName +"</h3></dd>";
					var kejian = section[y].kejian;
					for(var x in kejian){
						chapterHtml += "<dd><a onclick='videoSet("+ kejian[x].coursewareId +",this)'>&nbsp;&nbsp;" + parseInt(parseInt(x)+1) + " "+ kejian[x].name +"</a></dd>";
					}
				}
				chapterHtml += "</dl>";
				$("#chapterMenu").append(chapterHtml);
			}
			//加载第一个课件
			$("#chapterMenu").find("a:first").click();
			
		}
	});
}

//獲取url參數
function GetRequest() {
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		var strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

function videoSet(coursewareId,obj){
	cwId = coursewareId;
	titleInfo = $(obj).parents("dl").find("dt").html() + $(obj).parents("dl").find("dd:first h3").html();
	$("#chapterMenu").find("a").removeClass("currentCourseware");
	$(obj).addClass("currentCourseware");
	$.ajax({
		url:'mta/F010/url.html',
		dataType: 'json',
		data: {"coursewareId":coursewareId},
		type: 'post',
		success:function(result){
			var type = result.type;
			var url = result.url;
			switch (type) {
			case 3:
				$("#courseplay").empty();
				addSwf(url);
				break;
			case 4:
                $("#courseplay").empty();
                
                var browser = navigator.appName;
                // var b_version = navigator.appVersion;
                // var version = b_version.split(";"); 
                if(browser == "Microsoft Internet Explorer"){
                    //如果是IE(6,7,8):
                    // var trim_Version = version[1].replace(/[ ]/g,"");
                    var h = '<object classid="clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6" width="100%" height="100%" >'+
                            '<param name="invokeURLs" value="0" >' +
                            '<param name="autostart" value="1" />' +
                            '<param name="url" value="'+ url +'" />' +
                            '</object>';
                     $("#courseplay").html(h);
                     addMp3();
                }else {
                    var o = '<div style="margin-top: 240px;"><audio  controls="controls" autoplay="1"><source src="'+ url +'" type="audio/mpeg"/></audio></div>';
                    $("#courseplay").html(o);
                    $("#courseplay").css("background-color","black");
                    addMp3();
                }
				break;
			case 5:
				$("#courseplay").empty();
				addPic(url);
				break;
			case 6:
				$("#courseplay").empty();
				$("#courseplay").html("<iframe src='"+ url +"' width='100%' height='100%'></iframe> ");
				addPdf();
				break;
			case 7:
				$("#courseplay").empty();
				$("#courseplay").html("<iframe src='"+ url +"' width='100%' height='100%'></iframe> ");
				addPdf();
				break;
			case 8:
				$("#courseplay").empty();
				$("#courseplay").html("<iframe src='"+ url +"' width='100%' height='100%'></iframe> ");
				addPdf();
				break;
			default:
				var flashvars={
						f:url,
						c:0,
						e:0,
						loaded:'getPlayStatus'
				};
			    if(tzFlag == '1'){
			        // CKobject.getObjectById('ckplayer_a1').changeStyle('setup','1,1,1,1,1,2,0,1,0,0,0,1,200,0,2,1,0,1,1,1,1,10,3,0,1,2,3000,0,0,0,0,1,1,1,1,5,1,250,0,90,0,0,0');
			    }
				CKobject.embed('resources/js/ckplayer/ckplayer/ckplayer.swf','courseplay','ckplayer_a1','686','508',false,flashvars,'');
				break;
			}
//			CKobject.getObjectById('ckplayer_a1').newAddress('{f->'+ result +'}{s->0}');
		}
	});
}
function addSwf(url){
	var h = '<embed src="'+ url +'" type="application/x-shockwave-flash" width="100%" height="508"></embed>';
	$("#courseplay").html(h);
	//保存进度 100
	progres[cwId] = 100;
	updateStatus();
	saveProgres();
}
function addPic(url){
	var h = "<a id='slideLeftBtn' class='arr_left' title='点击查看上一张图'>左移动</a>" +
		"<a id='slideRightBtn' class='arr_right' title='点击查看下一张图'>右移动</a>" +
		"<div class='scroll_cont' id='slideContent' style='height:508px;'></div>" +
		"<div id='slideNum' class='numList' hidden='hidden'></div>";
	$("#courseplay").html(h);
	picUrl = eval(url);
	for(var i in picUrl){
		var html = "<div class='box'><span class='img_middle_span'></span><img src='"+ picUrl[i].picPath +"' class='img_middle' ></div>";
		$("#slideContent").append(html);
	}
	
	$("#courseplay").slide({ 
		mainCell:"#slideContent",
		prevCell:"#slideLeftBtn",
		nextCell:"#slideRightBtn",
		effect:"left",
		autoPlay:false,
		easing:"easeInOutCirc"
	});
	
    $("#courseplay").on("mouseover mouseout",function(event){
        if(event.type == "mouseover"){
            $(".arr_left,.arr_right").attr("style","display:inline"); 
        }else if(event.type == "mouseout"){
            $(".arr_left,.arr_right").hide();
        }
    });
	
	//保存进度 100
	progres[cwId] = 100;
	updateStatus();
	saveProgres();
}

function addPdf(){
	//保存进度 100
	progres[cwId] = 100;
	updateStatus();
	saveProgres();
}

function addMp3(){
	//保存进度 100
	progres[cwId] = 100;
	updateStatus();
	saveProgres();
}

function updateStatus(){
    var flag = true;
    $.each(progres,function(i,n){
        if(n != 100){
            flag = false;
        }
    });
    if(flag){
        $.ajax({
           url:'mta/F010/updateCourseStatus.html',
           data: {"uuid":uuid},
           type:'POST' 
        });
    }
}

function getNote(){
	//声明分页组件
	notesPage = myPage("notesPage");
	//指定分页事件
	notesPage.getData = noteGetData;
	notesPage.rows = 10;
	noteGetData(notesPage.pageNum);
	notesPage.dataTotal = notesTotal;
	notesPage.initPage();
}

function noteGetData(page){
	$.ajax({
		url:'mta/F010/getNote.html',
		dataType: 'json',
		data: {uuid : uuid,page:page,rows:notesPage.rows},
		async:false,
		type: 'post',
		success:function(result){
			notesTotal = result.total;
			$("#noteTotal").html(notesTotal);
			var data = result.data;
			$("#notes").empty();
			for(var i in data){
				var html = "<div class='movenotes'><dl><dt>" +
					"<img src='resources/mta/images/notes_pic01.png' width='99' height='99' alt='' /></dt><dd>" +
					"<span>"+ data[i].title +"</span><dd>";
				html += "<dd>"+ data[i].content +"</dd><dd>"+ data[i].insDate +"</dd></dl>";
				html += "<ul><li onclick='delNote("+ data[i].id +")'><img src='resources/mta/images/ask_icon03.png' width='69' height='30' /></li></ul>";
				html += "</div>";
				
				$("#notes").append(html);
			}
		}
	});
}

function getAskqa(){
	//声明分页组件
	askqaPage = myPage("askqaPage");
	//指定分页事件
	askqaPage.getData = askGetData;
	askqaPage.rows = 10;
	askGetData(askqaPage.pageNum);
	askqaPage.dataTotal = askTotal;
	askqaPage.initPage();
}

function addHfDiv(obj){
	$(".askhf").remove();
	upid = $(obj).val();
	var html = "<div class='askhf'><dl><dt><textarea name='' cols='' rows='' id='messageLi'></textarea></dt>" +
		"<dd><a onclick='saveAnswer()'><img src='resources/mta/images/ask_icon06.png' width='69' height='30' /></a></dd></dl></div>";
	var v = $(obj).parents(".askq");
	$(v).after(html);
}

function askGetData(page){
	$.ajax({
		url:'mta/F010/getAskqa.html',
		dataType: 'json',
		data: {uuid:uuid,page:page,rows:askqaPage.rows},
		async: false,
		type: 'post',
		success:function(result){
			$("#askqa").empty();
			var ask = result.ask;
			askTotal = result.total;
			var answerMap = result.answer;
			for(var i in ask){
				var wAp = ask[i].wAp;
				var appStatus = ask[i].appStatus;
				var html = "<div class='askq'><dl><dt><img src='resources/mta/images/q.png' width='36' height='40' /></dt>" +
					"<dd><span>"+ ask[i].title +"</span><button class='js-showAnswer' style='float: right;'>展开回答</button></dd>" +
					"<dd>内容："+ ask[i].wCon +"</dd>" +
					"<dd>提问者："+ ask[i].wUname +"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;提问时间："+ ask[i].wTime +"</dd></dl>" +
					"<ul><li onclick='addHfDiv(this)' value='"+ ask[i].wId +"'>";
				if(ask[i].dStatus == 1 && wAp != 1){
					html += "<img src='resources/mta/images/ask_icon01.png' width='69' height='30' />";
				}
				html += "</li></ul></div>";
				
				$("#askqa").append(html);
				
				var answer = answerMap[ask[i].wId];
				var html = "<div class='js-answer'>";
				for(var y in answer){
					html += "<div class='aska' style='clear:both;'><dl><dt><img src='resources/mta/images/a.png' width='36' height='40' /></dt>" +
						"<dd>回答者："+ answer[y].dUserName +"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;回答时间："+ answer[y].dTime +"</dd>" +
						"<dd class='js-content'>回答内容："+ answer[y].dCon +"</dd></dl><ul>";
					if(answer[y].editStatus == 1){
						html += "<li onclick='editAnswer(this,"+ answer[y].dId +")'><img src='resources/mta/images/ask_icon02.png' width='69' height='30' /></li>" +
						"<li onclick='delAnswer("+ answer[y].dId +")'><img src='resources/mta/images/ask_icon03.png' width='69' height='30' /></li>";
					}
					if(appStatus == 1 && wAp != 1){
						html += "<li><img src='resources/mta/images/ask_icon05.png' width='69' height='30' /></li>";
					}
					html += "</ul></div>";
				}
				html += "</div>";
				$("#askqa").append(html);
				
			}
			$(".js-answer").attr("style","display:none;");
			$(".js-showAnswer").click(function() {
                $(this).parents("div").next(".js-answer").slideToggle("fast");
                if($(this).html() != "收起回答"){
                    $(this).html("收起回答");
                }else{
                    $(this).html("展开回答");
                }
			});
		}
	});
}


function showTiwen(){
	$("#askTitle").val("");
	$("#textarea").val("");
	$("#tiwenDiv").show();
}

function saveAsk(){
	var title = $("#askTitle").val();
	var content = $("#twtextarea").val();
	if(title == ''){
		alert("标题不能为空！");
		$("#askTitle").focus();
		return;
	}
	$.ajax({
		url: 'mta/F010/saveAsk.html',
		dataType: 'json',
		data: {uuid:uuid,'title':title,'content':content},
		type: 'post',
		success:function(result){
			$("#tiwenDiv").hide();
			getAskqa();
		}
	});
}

function hideAsk(){
	$("#tiwenDiv").hide();
}

function hideBiji(){
	$("#bijiDiv").hide();
}

function saveAnswer(){
	var content = $("#messageLi").val();
	if(content == ''){
		alert("内容不能为空！");
		return;
	}
	$.ajax({
		url: 'mta/F010/saveAnswer.html',
		dataType: 'json',
		data: {uuid:uuid,'upid':upid,'content':content},
		type: 'post',
		success:function(result){
//			$(".askhf").remove();
			getAskqa();
		}
	});
}

function delAnswer(anId){
	if(!confirm("确定要删除吗？")){
		return;
	}
	$.ajax({
		url: 'mta/F040/delAnswer.html',
		dataType: 'json',
		data: {id:anId},
		type: 'post',
		success:function(result){
//			$(".askhf").remove();
			getAskqa();
		}
	});
}

function editAnswer(obj,dId){
	$(".askhf").remove();
	var content = $(obj).parents(".aska").find(".js-content").html();
	var html = "<div class='askhf'><dl><dt><textarea name='' cols='' rows='' id='messageLi'>"+ content.substring(5,content.lenght) +"</textarea></dt>" +
		"<dd><a onclick='updateAnswer("+ dId +")'><img src='resources/mta/images/ask_icon06.png' width='69' height='30' /></a></dd>" +
		"<dd><a onclick='cancelAnswer(this)'><img src='resources/mta/images/ask_icon07.png' width='69' height='30' /></a></dd>" +
		"</dl></div>";
	$(obj).parents(".aska").after(html);
	objHtml = $(obj).parents(".aska").prop("outerHTML");;
	$(obj).parents(".aska").remove();
}

function cancelAnswer(obj){
	$(obj).parents(".askhf").after(objHtml);
	$(obj).parents(".askhf").remove();
}

function updateAnswer(dId){
	var content = $("#messageLi").val();
	if(content == ''){
		alert("内容不能为空！");
		return;
	}
	$.ajax({
		url: 'mta/F040/updAnswer.html',
		dataType: 'json',
		data: {id:dId,'content':content},
		type: 'post',
		success:function(result){
//			$(".askhf").remove();
			getAskqa();
		}
	});
}

function showBijiDiv(){
	$("#bijiTitle").val(titleInfo.replace("&nbsp;"," "));
	$("#textarea").val("");
	$("#bijiDiv").show();
}

function saveBiji(){
	var title = $("#bijiTitle").val();
	var content = $("#textarea").val();
	if(title == '' || content == ''){
		alert("标题或内容不能为空！");
		return;
	}
	$.ajax({
		url: 'mta/F010/saveNote.html',
		dataType: 'json',
		data: {'title':title,'content':content,'uuid':uuid},
		type: 'post',
		success:function(result){
			$("#bijiDiv").hide();
			getNote();
		}
	});
}

function delNote(id){
	if(!confirm("确定要删除吗？")){
		return;
	}
	$.ajax({
		url: 'mta/F010/delNote.html',
		dataType: 'json',
		data: {id:id},
		type: 'post',
		success:function(result){
			getNote();
		}
	});
}