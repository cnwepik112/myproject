$(function(){
	var UA = navigator.userAgent;
    var isIE = UA.indexOf('MSIE') > -1;
    var v = isIE ? /\d+/.exec(UA.split(';')[1]) : 'no ie';
    if(v<8){
   	 alert("温馨提示：您的浏览器内核低于IE8.0版本，为了您的体验，请您升级浏览器！");
    }
	//获取课程分类
	getCourseType();
	//获取课程信息
	getCourseByTypeId(1);
	//获取系统公告
	getSystemMsg();
	//获取课程排行
	getCourseByStatus();
	
	//考试分类绑定事件
	$("#courseTypeUl").delegate("li","click",function(){
		$("#courseTypeUl").find(".liSelected").removeClass("liSelected");
		$(this).addClass("liSelected");
		getCourseByTypeId($(this).attr("id").split("_")[1]);
	});
	
	//选项卡点击事件
	$(".card ul li").mouseover(function(){
		$(this).addClass('selected').siblings().removeClass('selected');
		var liId = $(this).attr("id");
		$("#card"+liId).show().siblings("div").hide();
	});
	
});

function getCourseType(){
	$.ajax({
		url: 'mta/getCourseType.html',
		type: 'post',
		dataType: 'json',
		success:function(result){
			for(var i in result){
				$("#courseTypeUl").append("<li id='courseType_"+ result[i].classifyId +"'><a>"+ result[i].name +"</a></li>");
			}
			$("#courseTypeUl").find("li:first").addClass("liSelected");
		}
	});
}

function getCourseByTypeId(tid){
	$.ajax({
		url: 'mta/getCourseByTypeId.html',
		type: 'post',
		data: {"tid":tid},
		dataType: 'json',
		success:function(result){
			$("#courseListDiv").empty();
			var  html = '';
			for(var i in result){
				var imgsrc="resources/mta/images/pic01.png";
				if(result[i].pic != "" && typeof(result[i].pic) != 'undefined'){
					imgsrc=result[i].pic;
				}
				html += "<dl><dt><a href='mta/F010/CourseInfo.html?uuid="+ result[i].uuid +"'><img src='"+ imgsrc +"' width='201' height='125'/></a></dt>" +
				 		"<dd>课程名称：<span title='"+result[i].fullname+"'><a href='mta/F010/CourseInfo.html?uuid="+ result[i].uuid +"' >&nbsp;"+ result[i].shortname +"</a></span></dd>" + 
				 		"<dd>主讲老师："+ (result[i].lecturerName==undefined?'':result[i].lecturerName) +"</dd></dl>";
			}
//			for(var y=0;y<(6-result.length);y++){
//				html += "<dl><dt><img src='resources/mta/images/pic01.png' width='201' height='125'/>" +
//				"</dt><dd>课程名称：未上传课程</dd><dd>主讲老师：Mta</dd></dl>";
//			}
			$("#courseListDiv").append(html);
		}
	});
}

function getSystemMsg(){
	$.ajax({
		url: 'mta/getSystemMsg.html',
		type: 'post',
		dataType: 'json',
		success:function(result){
			for(var i in result){
				var html = "<dl><dt>["+ result[i].msgDate +"]</dt><dd><a onclick='news("+result[i].id+");'><div style='white-space:nowrap; width:130px; line-height:20px; text-overflow:ellipsis;-moz-text-overflow: ellipsis; overflow:hidden'>"+ result[i].msgTitle +"</div></a></dd></dl>";
				$("#sysMsg").append(html);
			}
		}
	});
}

function closeImageDiv(){
	//getResults(queryDate.page);
	$('.theme-popover-mask').fadeOut(300);
	$('.theme-popover').slideUp(300);
}

//新闻弹出页
function news(id){

	$.post("mta/getNews.html",{id : id},function(data){
		$('#msgContent').html(data.msgcontent);
		$('.theme-popover-mask').fadeIn(300);
		$('.theme-popover').slideDown(300);
	},"json");
}

function getCourseByStatus(){
	$.ajax({
		url: 'mta/getCourseByStatus.html',
		type: 'post',
		dataType: 'json',
		success:function(result){
			var zx = result.zxCourse;
			var zr = result.zrCourse;
			for(var i in zr){
				var imgsrc="resources/mta/images/pic01.png";
				if(zr[i].pic != "" && typeof(zr[i].pic) != 'undefined'){
					imgsrc=zr[i].pic;
				}
				var html = "<dl class='js-title' style='overflow: hidden;'>" +
						   "<dt><img src='resources/mta/images/numb0"+ (parseInt(i)+parseInt(1)) +".png' width='16' height='15' />" +
						   "</dt><dd><div style='white-space:nowrap; width:200px; line-height:32px; text-overflow:ellipsis;-moz-text-overflow: ellipsis; overflow:hidden'>"+ zr[i].name +"</div></dd>" +
						   "<dd><span><a href='mta/F010/CourseInfo.html?uuid="+ zr[i].uuid +"'><img style='cursor:pointer;' src='"+ imgsrc +"' width='90' height='49' /></a></span>" +
						   "<a href='mta/F010/CourseInfo.html?uuid="+ zr[i].uuid +"'><p>"+ zr[i].rs +"人报名学习</p><p>讲师："+ zr[i].lecturerName +"</p></a></dd></dl>";
				$("#cardZR").append(html);
			}
			for(var i in zx){
				var imgsrc="resources/mta/images/pic01.png";
				if(zx[i].pic != "" && typeof(zx[i].pic) != 'undefined'){
					imgsrc=zx[i].pic;
				}
				var html = "<dl class='js-title' style='overflow: hidden;'>" +
						   "<dt><img src='resources/mta/images/numb0"+ (parseInt(i)+parseInt(1)) +".png' width='16' height='15' />" +
						   "</dt><dd><div style='white-space:nowrap; width:200px; line-height:32px; text-overflow:ellipsis;-moz-text-overflow: ellipsis; overflow:hidden'>"+ zx[i].name +"</div></dd>" +
						   "<dd><span><a href='mta/F010/CourseInfo.html?uuid="+ zr[i].uuid +"'><img src='" + imgsrc +"' width='90' height='49' /></span>" +
						   "<a href='mta/F010/CourseInfo.html?uuid="+ zr[i].uuid +"'><p>"+ zx[i].rs +"人报名学习</p><p>讲师："+ zx[i].lecturerName +"</p></a></dd></dl>";
				$("#cardZX").append(html);
			}
			
			$("#cardZR").find("dl:not(:first)").height(32);
			$("#cardZX").find("dl:not(:first)").height(32);
			$(".js-title").hover(
				function(){
					$(this).stop(true).animate({height:"82px"},500).siblings().stop(true).animate({height:"32px"},500);
				}
			);
		}
	});
}
