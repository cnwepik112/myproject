//计时器Id
var timeID = '';

var queryDate = {};
queryDate.rows = 20;
var page;
$(function(){
	creatksClassify(0);
	
	$("#ksClassifyDl").find("dd:first > a").addClass("selectedKslx");
	
	//考试分类绑定事件
	$("#ksClassifyDl").delegate("dd","click",function(){
		$("#ksClassifyDl").find(".selectedKslx").removeClass("selectedKslx");
		$(this).addClass("selectedKslx");
	});
	
	//考试状态绑定事件
	$("#ksStatusDl").delegate("dd","click",function(){
		$("#ksStatusDl").find(".selectedKszt").removeClass("selectedKszt");
		$(this).addClass("selectedKszt");
		ksztSelected($(this).attr("id").split("_")[1]);
	});
	
	//声明分页组件
	page = myPage("page");
	//指定分页事件
	page.getData = getExam;
	//初始化考试数据
	initExam();
	
});

//根据根节点获取考试类型
function creatksClassify(fid){
	if(queryDate.ksClassifyId != fid){
		$.ajax({
			url:'mta/F020/getExamType.html',
			data: {'fid':fid},
			type: 'post',
			dataType: 'json',
			success:function(result){
				var html = '';
				for(var i in result){
					html += "<dd onclick='changeSelected("+ result[i].id +")'><a>"+ result[i].name +"</a></dd>";
				}
				if(html != ''){
					$("#ksClassifyDl").html('<dt>考试类型：</dt><dd onclick="changeSelected(0)"><a>全部</a></dd>'+html);
					$("#ksClassifyDl").find("dd:first > a").addClass("selectedKslx");
				}
			}
		});
	}
}

//考试分类点击事件
function changeSelected(fid){
	creatksClassify(fid);
	queryDate.ksClassifyId = fid;
	initExam();
}

//考试状态点击事件
function ksztSelected(ztid){
	if(queryDate.ksStatusId != ztid){
		queryDate.ksStatusId = ztid;
		initExam();
	}
}


//搜索
function searchData(){
    creatksClassify(0);
    queryDate.ksClassifyId = 0;
    queryDate.ksStatusId = 0;
    queryDate.searchText = $("#searchText").val();
    initExam();
    $("#ksClassifyDl").find("dd:first > a").addClass("selectedKslx");
    $("#ksStatusDl").find(".selectedKszt").removeClass("selectedKszt");
	$("#ksStatusDl").find("#selectedKszt_0").addClass("selectedKszt");
}

//初始化考试数据    检索考试数据 (重新生成MyPage)
function initExam(){
	
	queryDate.page = 1;
	
	$.ajax({
		url:'mta/F020/getExam.html',
		data: queryDate,
		type: 'post',
		dataType: 'json',
		success:function(result){
			createMyPage(Math.ceil(result.total/queryDate.rows));
			var ksData = result.rows;
			$("#ksInfromation").empty();
			for(var i in ksData){
				var html = "<dl><dt>"+ ksData[i].name +"<br/>" +
					"开始时间："+ ksData[i].beginTm +"<br />" +
					"结束时间："+ ksData[i].endTm +"<br />";
				
				if(loginUserid==-1){
					//未登录
					//未报名
					html += "<dd><img src='resources/mta/images/test_pic04.png' width='234' height='34'/></dd>";
				}else{
					if(ksData[i].tmSec == 'yjs' && ksData[i].ksStatus == 0){
						//整场考试时间到期 结束
						html += "<dd><img src='resources/mta/images/test_pic03.png' width='234' height='34'/></dd>";
					}else{
						// 整场考试中
						html += "<span><img src='resources/mta/images/oclock.png' width='10' height='10'/></span>" +
								"<span class='js-tmSec-span' style='display:inline-block;margin-left:6px'><div></div><input type='hidden' value='"+ ksData[i].tmSec +"'/></span></dt>";
						//个人考试状态判断
						if(typeof(ksData[i].userId) == 'undefined' || ksData[i].userId == null){
							//未报名
							html += "<dd><a href='javascript:void(0);' onclick='sign_up(this,"+ksData[i].ksid+")'><img src='resources/mta/images/icon_exam_02.png' width='234' height='34'/></a></dd>";
						}else if(typeof(ksData[i].signupFlag) != 'undefined' && ksData[i].signupFlag ==0){
							//0报名审核中
							html += "<dd><img src='resources/mta/images/icon_exam_01.png' width='234' height='34'/></dd>";
						}else if(typeof(ksData[i].signupFlag) != 'undefined' && ksData[i].signupFlag == 2){
							//2是审核不通过
							html += "<dd><img src='resources/mta/images/icon_exam_010.png' width='234' height='34'/></dd>";
						}else if(typeof(ksData[i].state) != 'undefined' && ksData[i].state == 2 ){
							//参加考试
							html += "<dd><a href='mta/F020/examInstruction.html?ksUuid="+ ksData[i].uuid +"'><img src='resources/mta/images/test_pic01.png' width='234' height='34'/></a></dd>";
						}else if(typeof(ksData[i].state) != 'undefined' && ksData[i].state == 3 ){
							//正在考试中
							html += "<dd><a href='mta/F020/UserExam.html?ksUuid="+ ksData[i].uuid +"&flag=1'><img src='resources/mta/images/icon_exam_04.png' width='234' height='34'/></a></dd>";
						}else if(typeof(ksData[i].state) != 'undefined' && ksData[i].state > 3 ){
							if(ksData[i].overState == 1){
								//及格或次数达到上限不再考试结束
								html += "<dd><img src='resources/mta/images/test_pic03.png' width='234' height='34'/></dd>";
							}else{
								//参加考试
								html += "<dd><a href='mta/F020/examInstruction.html?ksUuid="+ ksData[i].uuid +"'><img src='resources/mta/images/test_pic01.png' width='234' height='34'/></a></dd>";
							}
						}else{
							//已交卷 考试结束
							html += "<dd><img src='resources/mta/images/test_pic03.png' width='234' height='34'/></dd>";
						}
					}
				}
				html+="</dl>";
				$("#ksInfromation").append(html);
			}
		}
	});
	if(timeID != ''){
		clearTimeout(timeID);
	}
	//设置每一秒调用一次倒计时函数
	timeID = setTimeout("count_down()",1000);
}

//考试数据翻页方法
function getExam(pageNo){
	if(queryDate.page != pageNo){
		//设置页码
		queryDate.page = pageNo;
		$.ajax({
			url:'mta/F020/getExam.html',
			data: queryDate,
			type: 'post',
			dataType: 'json',
			success:function(result){
				var ksData = result.rows;
				$("#ksInfromation").empty();
				for(var i in ksData){
					var html = "<dl><dt>"+ ksData[i].name +"<br/>" +
					"开始时间："+ ksData[i].beginTm +"<br />" +
					"结束时间："+ ksData[i].endTm +"<br />";
					if(loginUserid==-1){
						//未登录
						//未报名
						html += "<dd><img src='resources/mta/images/test_pic04.png' width='234' height='34'/></dd>";
					}else{
						if(ksData[i].tmSec == 'yjs' && ksData[i].ksStatus == 0){
							//整场考试时间到期 结束
							html += "<dd><img src='resources/mta/images/test_pic03.png' width='234' height='34'/></dd>";
						}else{
							// 整场考试中
							html += "<span><img src='resources/mta/images/oclock.png' width='10' height='10'/></span>" +
									"<span class='js-tmSec-span' style='display:inline-block;margin-left:6px'><div></div><input type='hidden' value='"+ ksData[i].tmSec +"'/></span></dt>";
							//个人考试状态判断
							if(typeof(ksData[i].userId) == 'undefined' || ksData[i].userId == null){
								//未报名
								html += "<dd><a href='javascript:void(0);' onclick='sign_up(this,"+ksData[i].ksid+")'><img src='resources/mta/images/icon_exam_02.png' width='234' height='34'/></a></dd>";
							}else if(typeof(ksData[i].signupFlag) != 'undefined' && ksData[i].signupFlag ==0){
								//0报名审核中
								html += "<dd><img src='resources/mta/images/icon_exam_01.png' width='234' height='34'/></dd>";
							}else if(typeof(ksData[i].signupFlag) != 'undefined' && ksData[i].signupFlag == 2){
								//2是审核不通过
								html += "<dd><img src='resources/mta/images/icon_exam_010.png' width='234' height='34'/></dd>";
							}else if(typeof(ksData[i].state) != 'undefined' && ksData[i].state == 2 ){
								//参加考试
								html += "<dd><a href='mta/F020/examInstruction.html?ksUuid="+ ksData[i].uuid +"'><img src='resources/mta/images/test_pic01.png' width='234' height='34'/></a></dd>";
							}else if(typeof(ksData[i].state) != 'undefined' && ksData[i].state == 3 ){
								//正在考试中
								html += "<dd><a href='mta/F020/UserExam.html?ksUuid="+ ksData[i].uuid +"&flag=1'><img src='resources/mta/images/icon_exam_04.png' width='234' height='34'/></a></dd>";
							}else if(typeof(ksData[i].state) != 'undefined' && ksData[i].state > 3 ){
								if(ksData[i].overState == 1){
									//及格或次数达到上限不再考试结束
									html += "<dd><img src='resources/mta/images/test_pic03.png' width='234' height='34'/></dd>";
								}else{
									//参加考试
									html += "<dd><a href='mta/F020/examInstruction.html?ksUuid="+ ksData[i].uuid +"'><img src='resources/mta/images/test_pic01.png' width='234' height='34'/></a></dd>";
								}
							}else{
								//已交卷 考试结束
								html += "<dd><img src='resources/mta/images/test_pic03.png' width='234' height='34'/></dd>";
							}
						}
					}
					html+="</dl>";
					$("#ksInfromation").append(html);
					//设置每一秒调用一次倒计时函数
				}
				if(timeID != ''){
					clearTimeout(timeID);
				}
				timeID = setTimeout("count_down()",1000);
			}
		});
	}
}

//定义倒计时函数
function count_down(){
	var int_day, int_hour, int_minute, int_second;
	
	var flag = false;
	
	$(".js-tmSec-span").each(function(i,n){
		var time_distance = $(n).find("input[type='hidden']").val();
		time_distance -= 1;
		$(n).find("input[type='hidden']").val(time_distance);
		if(time_distance >= 0){
			flag = true;
			// 相减的差数换算成天数   
			int_day = Math.floor(time_distance/86400);
			time_distance -= int_day * 86400;
			// 相减的差数换算成小时
			int_hour = Math.floor(time_distance/3600);
			time_distance -= int_hour * 3600;
			//相减的差数换算成分钟   
			int_minute = Math.floor(time_distance/60);  
			time_distance -= int_minute * 60; 
			// 相减的差数换算成秒数  
			int_second = Math.floor(time_distance);
			
			// 判断小时小于10时，前面加0进行占位
			if(int_hour < 10){
				int_hour = "0" + int_hour;  
			} 
			//判断分钟小于10时，前面加0进行占位      
			if(int_minute < 10){
				int_minute = "0" + int_minute;  
			} 
			// 判断秒数小于10时，前面加0进行占位 
			if(int_second < 10){
				int_second = "0" + int_second;       
			}
			
			//显示倒计时效果
			var tmSec = int_day + '天 ' + int_hour + '时 ' + int_minute + '分 ' + int_second + '秒';
			$(n).find("div").html(tmSec);
		}else{
			$(n).find("div").html("考试中...");
		}
	});
	if(flag){
		timeID = setTimeout("count_down()",1000);
	}
}

function createMyPage(total){
	page.initPage(total);
}
/**
 * 报名
 */
function sign_up(obj,ksid){
	$.ajax({
		url:'mta/F020/signUp.html',
		data: {'ksid':ksid},
		type: 'post',
		dataType: 'json',
		success:function(result){
			var html="";
			if(result>0){
				 html += "<dd><img src='resources/mta/images/icon_exam_01.png' width='234' height='34'/></dd>";
			}
			$(obj).parent().replaceWith(html);
		}
	});
}