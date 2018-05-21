var queryDate = {};
queryDate.rows = 6;
var page_select_index=0;
var examPage;
$(function(){
	examPage = myPage("examPage");
	//初始化我的成绩
	initExam();
	//指定分页事件
	examPage.getData = getResults;
	//我的考试状态绑定事件
	$("#examDl").delegate("dd","click",function(){
		$("#examDl").find(".selectedExam").removeClass("selectedExam");
		$(this).addClass("selectedExam");
		examSelected($(this).attr("id").split("_")[1]);
	});
});

//资源类型点击事件
function examSelected(state){
//	if(queryDate.ksStatusId != state){
		queryDate.ksStatusId = state;
		initExam();
//	}
}

////申请报名
//function check(id){
//	$.post("updExam.html",{"id":id},function(){
//		$("#examDl").find(".selectedExam").removeClass("selectedExam");
//		$("#examDl").find("#sh_9").addClass("selectedExam");
//		examSelected(1);
//	});
//}
/**
 * 报名
 */
function sign_up(obj,ksid){
	$.ajax({
		url:baseUrl+'/mta/F020/signUp.html',
		data: {'ksid':ksid},
		type: 'post',
		dataType: 'json',
		success:function(result){
			var html="";
			if(result>0){
				 html += "<img src='"+baseUrl+"/resources/mta/images/icon_shenhe.png' alt='报名审核中' width='77' height='35'/>";
			}
			$(obj).html(html);
		}
	});
}
//初始成绩数据(重新生成MyPage)
function initExam(){
	queryDate.page = 1;
	$.ajax({
		url:baseUrl+'/mta/F020/getExam.html',
		data: queryDate,
		type: 'post',
		dataType: 'json',
		success:function(result){
			createMyPage(Math.ceil(result.total/queryDate.rows));
			var myResults = result.rows;
			$("#examList tbody").empty();
			var hang="";
			for(var i in myResults){
				var state="";
				var imgsrc="resources/mta/images/logoimg/pic02.png";
				if(myResults[i].pic != "" && typeof(myResults[i].pic) != 'undefined'){
					imgsrc=myResults[i].pic;
				}
				var picture = "<img src='"+imgsrc+"' width='71' height='71' alt='"+myResults[i].name+"'/>";
			/*	//未报名
				if(myResults[i].state == 0){
					state = "<a href='javascript:void(0);' onclick='check("+myResults[i].id+");'><img src='"+baseUrl+"/resources/mta/images/icon_registration.png' width='77' height='35' alt='未报名'/></a>";
				}
				//报名未通过
				if(myResults[i].state == 1){
					state = "<img src='"+baseUrl+"/resources/mta/images/icon_shenhe.png' width='77' height='35' alt='报名未通过'/>";
				}
				//未考试
				if(myResults[i].state == 2){
					state = "<a href='"+baseUrl+"/mta/F020/UserExam.html?ksUuid="+myResults[i].uuid+"'><img src='"+baseUrl+"/resources/mta/images/icon_exam.png' width='77' height='35' alt='参加考试'/></a>";
				}
				//已交卷
				if(myResults[i].state == 4){
					state = "<img src='"+baseUrl+"/resources/mta/images/icon_assignment.png' width='77' height='35' alt='已交卷'/>";
				}*/
				if(myResults[i].tmSec == 'yjs' && myResults[i].ksStatus == 0){
					//整场考试时间到期 结束
					state= "<img src='"+baseUrl+"/resources/mta/images/icon_myExam_03.png' alt='已结束' width='77' height='35' alt='已结束'/>";
				}else{
					//个人考试状态判断
					if(typeof(myResults[i].userId) == 'undefined' || myResults[i].userId == null){
						//未报名
						state= "<a href='javascript:void(0);' onclick='sign_up(this,"+myResults[i].ksid+")'><img src='resources/mta/images/icon_myExam_01.png' alt='报名申请' width='77' height='35'/></a>";
					}else if(typeof(myResults[i].signupFlag) != 'undefined' && myResults[i].signupFlag ==0){
						//0报名审核中
						state= "<img src='"+baseUrl+"/resources/mta/images/icon_shenhe.png' alt='报名审核中' width='77' height='35'/>";
					}else if(typeof(myResults[i].signupFlag) != 'undefined' && myResults[i].signupFlag == 2){
						//2是报名审核不通过
						state= "<img src='"+baseUrl+"/resources/mta/images/icon_shenhewtg.jpg' alt='审核未通过' width='77' height='35'/>";
					}else if(typeof(myResults[i].state) != 'undefined' && myResults[i].state == 2 ){
						//参加考试
						state= "<a href='"+baseUrl+"/mta/F020/examInstruction.html?ksUuid="+ myResults[i].uuid +"&flag=1'><img src='resources/mta/images/icon_exam.png' alt='参加考试' width='77' height='35'/></a>";
					}else if(typeof(myResults[i].state) != 'undefined' && myResults[i].state == 3 ){
						//正在考试中
						state= "<a href='mta/F020/UserExam.html?ksUuid="+ myResults[i].uuid +"&flag=1'><img src='resources/mta/images/icon_myExam_02.png' alt='参加考试' width='77' height='35'/>";
					}else if(typeof(myResults[i].state) != 'undefined' && myResults[i].state > 3 ){
						if(myResults[i].overState == 1){
							//及格或次数达到上限不再考试结束
							state= "<img src='resources/mta/images/icon_myExam_03.png' alt='已结束' width='77' height='35'/>";
						}else{
							//参加考试
							state= "<a href='mta/F020/examInstruction.html?ksUuid="+ myResults[i].uuid +"&flag=1'><img src='resources/mta/images/icon_exam.png' alt='参加考试' width='77' height='35'/></a>";
						}
					}else{
						//已交卷 考试结束
						state= "<img src='resources/mta/images/icon_myExam_03.png' alt='已结束' width='77' height='35'/>";
					}
				}
				if(myResults[i].resultPublishTime>result.now){
					myResults[i].score = "机密";
				}
				if(i%2==0){
					hang = 
					"<tr class='trColor'>"+
					"<td width='40px' align='center'>"+parseInt(parseInt(i)+1)+"</td>"+
					"<td align='left'>"+picture+"</td>"+
					"<td width='310px'><a title='"+myResults[i].name+"'>"+myResults[i].name+"</a></td>"+
					"<td align='center'>"+myResults[i].beginTm+"</td>"+
					"<td align='center'>"+myResults[i].endTm+"</td>"+
					"<td align='center'>"+myResults[i].totalscore+"</td>"+
					"<td align='center'>"+myResults[i].score+"</td>"+
					"<td width='107px' align='center'>"+state+"</td>"+
					"</tr>";
				}else{
					hang = 
						"<tr>"+
						"<td width='40px' align='center'>"+parseInt(parseInt(i)+1)+"</td>"+
						"<td align='left'>"+picture+"</td>"+
						"<td width='310px'><a title='"+myResults[i].name+"'>"+myResults[i].name+"</a></td>"+
						"<td align='center'>"+myResults[i].beginTm+"</td>"+
						"<td align='center'>"+myResults[i].endTm+"</td>"+
						"<td align='center'>"+myResults[i].totalscore+"</td>"+
						"<td align='center'>"+myResults[i].score+"</td>"+
						"<td width='107px' align='center'>"+state+"</td>"+
						"</tr>";
				}
				$("#examList tbody").append(hang);
			}
		}
	});
}
//考试数据翻页方法
function getResults(pageNo){
	if(queryDate.page != pageNo){
		//设置页码
		queryDate.page = pageNo;
		$.ajax({
			url:baseUrl+'/mta/F020/getExam.html',
			data: queryDate,
			type: 'post',
			dataType: 'json',
			success:function(result){
				var myResults = result.rows;
				$("#examList tbody").empty();
				var hang="";
				for(var i in myResults){
					var state="";
					var imgsrc="resources/mta/images/logoimg/pic02.png";
					if(myResults[i].pic != "" && typeof(myResults[i].pic) != 'undefined'){
						imgsrc=myResults[i].pic;
					}
					var picture = "<img src='"+imgsrc+"' width='71' height='71' alt='"+myResults[i].name+"'/>";
					/*//未报名
					if(myResults[i].state == 0){
						state = "<a href='javascript:void(0);' onclick='check("+myResults[i].id+");'><img src='"+baseUrl+"/resources/mta/images/icon_registration.png' width='77' height='35' alt='未报名'/></a>";
					}
					//报名未通过
					if(myResults[i].state == 1){
						state = "<img src='"+baseUrl+"/resources/mta/images/icon_shenhe.png' width='77' height='35' alt='报名未通过'/>";
					}
					//未考试
					if(myResults[i].state == 2){
						state = "<a href='"+baseUrl+"/mta/F020/UserExam.html?ksUuid="+myResults[i].uuid+"'><img src='"+baseUrl+"/resources/mta/images/icon_exam.png' width='77' height='35' alt='参加考试'/></a>";
					}
					//已交卷
					if(myResults[i].state == 4){
						state = "<img src='"+baseUrl+"/resources/mta/images/icon_assignment.png' width='77' height='35' alt='已交卷'/>";
					}*/
					if(myResults[i].tmSec == 'yjs' && myResults[i].ksStatus == 0){
						//整场考试时间到期 结束
						state= "<img src='"+baseUrl+"/resources/mta/images/icon_myExam_03.png' alt='已结束' width='77' height='35' alt='已结束'/>";
					}else{
						//个人考试状态判断
						if(typeof(myResults[i].userId) == 'undefined' || myResults[i].userId == null){
							//未报名
							state= "<a href='javascript:void(0);' onclick='sign_up(this,"+myResults[i].ksid+")'><img src='resources/mta/images/icon_myExam_01.png' alt='报名申请' width='77' height='35'/></a>";
						}else if(typeof(myResults[i].signupFlag) != 'undefined' && myResults[i].signupFlag ==0){
							//0报名审核中
							state= "<img src='"+baseUrl+"/resources/mta/images/icon_shenhe.png' alt='报名审核中' width='77' height='35'/>";
						}else if(typeof(myResults[i].signupFlag) != 'undefined' && myResults[i].signupFlag == 2){
							//2是报名审核不通过
							state= "<img src='"+baseUrl+"/resources/mta/images/icon_shenhewtg.jpg' alt='审核未通过' width='77' height='35'/>";
						}else if(typeof(myResults[i].state) != 'undefined' && myResults[i].state == 2 ){
							//参加考试
							state= "<a href='"+baseUrl+"/mta/F020/examInstruction.html?ksUuid="+ myResults[i].uuid +"&flag=1'><img src='resources/mta/images/icon_exam.png' alt='参加考试' width='77' height='35'/></a>";
						}else if(typeof(myResults[i].state) != 'undefined' && myResults[i].state == 3 ){
							//正在考试中
							state= "<a href='mta/F020/UserExam.html?ksUuid="+ myResults[i].uuid +"&flag=1'><img src='resources/mta/images/icon_myExam_02.png' alt='参加考试' width='77' height='35'/>";
						}else if(typeof(myResults[i].state) != 'undefined' && myResults[i].state > 3 ){
							if(myResults[i].overState == 1){
								//及格或次数达到上限不再考试结束
								state= "<img src='resources/mta/images/icon_myExam_03.png' alt='已结束' width='77' height='35'/>";
							}else{
								//参加考试
								state= "<a href='mta/F020/examInstruction.html?ksUuid="+ myResults[i].uuid +"&flag=1'><img src='resources/mta/images/icon_exam.png' alt='参加考试' width='77' height='35'/></a>";
							}
						}else{
							//已交卷 考试结束
							state= "<img src='resources/mta/images/icon_myExam_03.png' alt='已结束' width='77' height='35'/>";
						}
					}
					if(i%2==0){
						hang = 
						"<tr class='trColor'>"+
						"<td width='40px' align='center'>"+parseInt((parseInt(i)+1)+(parseInt(pageNo)-1)*6)+"</td>"+
						"<td align='left'>"+picture+"</td>"+
						"<td width='310px'><a title='"+myResults[i].name+"'>"+myResults[i].name+"</a></td>"+
						"<td align='center'>"+myResults[i].beginTm+"</td>"+
						"<td align='center'>"+myResults[i].endTm+"</td>"+
						"<td align='center'>"+myResults[i].totalscore +"</td>"+
						"<td align='center'>"+myResults[i].score+"</td>"+
						"<td width='107px' align='center'>"+state+"</td>"+
						"</tr>";
					}else{
						hang = 
							"<tr>"+
							"<td width='40px' align='center'>"+parseInt((parseInt(i)+1)+(parseInt(pageNo)-1)*6)+"</td>"+
							"<td align='left'>"+picture+"</td>"+
							"<td width='310px'><a title='"+myResults[i].name+"'>"+myResults[i].name+"</a></td>"+
							"<td align='center'>"+myResults[i].beginTm+"</td>"+
							"<td align='center'>"+myResults[i].endTm+"</td>"+
							"<td align='center'>"+myResults[i].totalscore+"</td>"+
							"<td align='center'>"+myResults[i].score+"</td>"+
							"<td width='107px' align='center'>"+state+"</td>"+
							"</tr>";
					}
					$("#examList tbody").append(hang);
				}
			}
		});
	}
}
function createMyPage(total){
	examPage.initPage(total);
}