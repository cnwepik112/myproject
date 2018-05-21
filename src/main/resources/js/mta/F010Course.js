
var queryDate = {};
queryDate.rows = 20;
// 按最新排序
queryDate.orderFlg = 'zx';
var coursePage;
$(function(){
	creatkcClassify(0,"0");
	
	$("#kcClassifyDl").find("dd:first > a").addClass("selectedKslx");
	
	//课程分类绑定事件
	$("#kcClassifyDl").delegate("dd","click",function(){
		$("#kcClassifyDl").find(".selectedKslx").removeClass("selectedKslx");
		$(this).addClass("selectedKslx");
	});
	
	//课程状态绑定事件
	$("#kcStatusDl").delegate("dd","click",function(){
		$("#kcStatusDl").find(".selectedKszt").removeClass("selectedKszt");
		$(this).addClass("selectedKszt");
		kcztSelected($(this).attr("id").split("_")[1]);
	});
	
	//初始化课程数据
	initCourse();
	//指定分页事件
	coursePage = myPage("coursePage");
	//指定分页事件
	coursePage.getData = getCourse;
	coursePage.rows = 10;
//	appraiseGetData(coursePage.pageNum);
//	coursePage.dataTotal = coursePageTotal;
	coursePage.initPage();
	
	
});
var h2html="";
var h2html_new="";
//根据根节点获取课程类型
function creatkcClassify(fid,fname){
	if(queryDate.kcClassifyId != fid){
//		if(fid=="0"){
//			h2html="";
//		}else{
//			h2html+="&nbsp;&nbsp;>&nbsp;&nbsp;"+fname;
//		}
		$.ajax({
			url:'mta/F010/getCourseType.html',
			data: {'fid':fid},
			type: 'post',
			dataType: 'json',
			success:function(result){
				var html = '';
				for(var i in result){
					html += "<dd onclick='changeSelected("+ result[i].id +",\""+ result[i].name +"\")'><a>"+ result[i].name +"</a></dd>";
				}
				if(html != ''){
					$("#kcClassifyDl").html('<dt>课程类型：</dt><dd onclick="changeSelected(0,0);"><a>全部</a></dd>'+html);
					$("#kcClassifyDl").find("dd:first > a").addClass("selectedKslx");
//					h2html_new+="&nbsp;&nbsp;>&nbsp;&nbsp;"+fname;
//					$("#h2text").html(h2html+h2html_new);
				}
//				else{
//					h2html_new="&nbsp;&nbsp;>&nbsp;&nbsp;"+fname;
//					$("#h2text").html(h2html+h2html_new);
//				}
			}
		});
	}
}

//课程分类点击事件
function changeSelected(fid,fname){
	//alert(fid);
	//&nbsp;&nbsp;>&nbsp;&nbsp;计算机分类&nbsp;&nbsp; >&nbsp;&nbsp;java
//	if(fid==0){
//		$("#h2text").html("");
//	}else{
//		if(queryDate.kcClassifyId != fid){
//			$("#h2text").append("&nbsp;&nbsp;>&nbsp;&nbsp;"+fname);
//		}
//	}
	creatkcClassify(fid,fname);
	queryDate.kcClassifyId = fid;
	initCourse();
}

//课程状态点击事件
function kcztSelected(ztid){
	if(queryDate.kcStatusId != ztid){
		queryDate.kcStatusId = ztid;
		initCourse();
	}
}

//最新最热
function changeStatus(order,obj){
	if(queryDate.orderFlg != order){
		queryDate.orderFlg = order;
		queryDate.page = 0;
		getCourse(1);
		$(obj).siblings("li").removeClass("orderClass");
		$(obj).addClass("orderClass");
	}
}

//搜索
function searchData(){
	creatkcClassify(0,"0");
	queryDate.kcClassifyId = 0;
	queryDate.searchText = $("#searchText").val();
	initCourse();
	$("#kcClassifyDl").find("dd:first > a").addClass("selectedKslx");
}

//初始化课程数据    检索课程数据 (重新生成MyPage)
function initCourse(){
	//alert(queryDate);
	queryDate.page = 1;
	var html = "";
	$.ajax({
		url:'mta/F010/getCourse.html',
		data: queryDate,
		type: 'post',
		dataType: 'json',
		success:function(result){
			createMyPage(Math.ceil(result.total/queryDate.rows));
			var kcData = result.rows;
			$("#kcInfromation").empty();
			for(var i in kcData){
				var imgsrc="resources/mta/images/pic01.png";
				if(kcData[i].pic != "" && typeof(kcData[i].pic) != 'undefined'){
					imgsrc=kcData[i].pic;
				}
//				IF(IMGSRC != "RESOURCES/MTA/IMAGES/PIC01.PNG"){
//					ALERT(IMGSRC);
//				}
//				if(kcData[i].publicClass == true){
//					html = "<dl><dt><a href='mta/F010/CourseInfo.html?uuid="+ kcData[i].uuid +"'>" +
//					"<img src='"+ imgsrc +"' width='240' height='134' />" +
//					"</a></dt><dd>课程名称：<a href='mta/F010/CourseInfo.html?uuid="+ kcData[i].uuid +"'>"+ kcData[i].name +"</a>" +
//					"</dd><dd>主讲老师："+ (kcData[i].lecturerName==undefined?'':kcData[i].lecturerName) +
//					"</dd></dl>";
//				}else{
//					html = "<dl><dt><a href='mta/F010/CourseInfo.html?uuid="+ kcData[i].uuid +"'>" +
//					"<img src='"+ imgsrc +"' width='240' height='134' />" +
//					"</a></dt><dd>" +
//					"<img src='resources/images/public.png' style='vertical-align:middle;'/>" +
//					"课程名称：<a href='mta/F010/CourseInfo.html?uuid="+ kcData[i].uuid +"'>"+ kcData[i].name +"</a>" +
//					"</dd><dd>主讲老师："+ (kcData[i].lecturerName==undefined?'':kcData[i].lecturerName) +
//					"</dd></dl>";
//				}
//				alert(kcData[i].name);
				if(kcData[i].publicClass){
					html='<dl>'+
							'<dt>'+
								'<a href="mta/F010/CourseInfo.html?uuid='+ kcData[i].uuid +'">'+
								'<img src="'+imgsrc+'" width="240" height="134" /></a>'+
							'</dt>'+
							'<dd style="height:20px">'+
								'课程名称：<a href="mta/F010/CourseInfo.html?uuid='+ kcData[i].uuid +'">'+kcData[i].name.substring(0,10)+'</a>'+
							'</dd>'+
							'<dd>'+
								'主讲老师：'+(kcData[i].lecturerName==undefined?'':kcData[i].lecturerName) +
							'</dd>'+
						'</dl>';					
				}else{
					html='<dl>'+
							'<dt>'+
								'<a href="mta/F010/CourseInfo.html?uuid='+ kcData[i].uuid +'">'+
								'<img src="'+imgsrc+'" width="240" height="134" /></a>'+
							'</dt>'+
							'<dd style="height:20px">'+
								'<img src="resources/images/public.png" style="vertical-align:middle;" width="16" height="16"/>'+
								'课程名称：<a href="mta/F010/CourseInfo.html?uuid='+ kcData[i].uuid +'">'+kcData[i].name.substring(0,10)+'</a>'+
							'</dd>'+
							'<dd>'+
								'主讲老师：'+(kcData[i].lecturerName==undefined?'':kcData[i].lecturerName) +
							'</dd>'+
						'</dl>';
				}
				//alert(typeof kcData[i].publicClass);
				$("#kcInfromation").append(html);
			}
		}
	});
}

//课程数据翻页方法
function getCourse(pageNo){
	
	if(queryDate.page != pageNo){
		//设置页码
		queryDate.page = pageNo;
		
		$.ajax({
			url:'mta/F010/getCourse.html',
			data: queryDate,
			type: 'post',
			dataType: 'json',
			success:function(result){
				var kcData = result.rows;
				$("#kcInfromation").empty();
				for(var i in kcData){
					var imgsrc="resources/mta/images/pic01.png";
					if(kcData[i].pic != "" && typeof(kcData[i].pic) != 'undefined'){
						imgsrc=kcData[i].pic;
					}
					if(kcData[i].publicClass){
						html='<dl>'+
								'<dt>'+
									'<a href="mta/F010/CourseInfo.html?uuid='+ kcData[i].uuid +'">'+
									'<img src="'+imgsrc+'" width="240" height="134" /></a>'+
								'</dt>'+
								'<dd style="height:20px">'+
									'课程名称：<a href="mta/F010/CourseInfo.html?uuid='+ kcData[i].uuid +'">'+kcData[i].name.substring(0,10)+'</a>'+
								'</dd>'+
								'<dd>'+
									'主讲老师：'+(kcData[i].lecturerName==undefined?'':kcData[i].lecturerName) +
								'</dd>'+
							'</dl>';					
					}else{
						html='<dl>'+
								'<dt>'+
									'<a href="mta/F010/CourseInfo.html?uuid='+ kcData[i].uuid +'">'+
									'<img src="'+imgsrc+'" width="240" height="134" /></a>'+
								'</dt>'+
								'<dd style="height:20px">'+
									'<img src="resources/images/public.png" style="vertical-align:middle;" width="16" height="16"/>'+
									'课程名称：<a href="mta/F010/CourseInfo.html?uuid='+ kcData[i].uuid +'">'+kcData[i].name.substring(0,10)+'</a>'+
								'</dd>'+
								'<dd>'+
									'主讲老师：'+(kcData[i].lecturerName==undefined?'':kcData[i].lecturerName) +
								'</dd>'+
							'</dl>';
					}
					
					$("#kcInfromation").append(html);
				}
			}
		});
	}
}

function createMyPage(total){
	coursePage.initPage(total);
}
