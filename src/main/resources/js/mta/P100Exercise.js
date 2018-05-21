var queryDate = {};
queryDate.rows = 7;
var page_select_index=2;
var examPage;
$(function(){
	examPage = myPage("examPage");
	//初始化我的成绩
	initExam();
	//指定分页事件
	examPage.getData = getResults;
});


//初始成绩数据(重新生成MyPage)
function initExam(){
	queryDate.page = 1;
	$.ajax({
		url:baseUrl+'/mta/P100/findExerciseList.html',
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
				var imgsrc="resources/mta/images/exericseImage.png";
				if(myResults[i].pic != "" && typeof(myResults[i].pic) != 'undefined'){
					imgsrc=myResults[i].pic;
				}
				var picture = "<img src='"+imgsrc+"' width='71' height='71' alt='"+myResults[i].name+"'/>";
				var state="<a href='"+baseUrl+"/mta/P100/goExercise.html?eeUuid="+ myResults[i].uuid +"' target='_blank'><img src='resources/mta/images/startExercise.png' alt='参加练习' width='77' height='35'/></a>";
				if(i%2==0){
					hang = 
					"<tr class='trColor'>"+
					"<td width='40px' align='center'>"+parseInt(parseInt(i)+1)+"</td>"+
					"<td >"+picture+"</td>"+
					"<td width='210px'><a title='"+myResults[i].name+"'>"+myResults[i].name+"</a></td>"+
					"<td align='center'>"+myResults[i].beginTm+"</td>"+
					"<td align='center'>"+myResults[i].endTm+"</td>"+
					"<td align='center'>"+myResults[i].totalsorce+"</td>"+
					"<td width='107px' align='center'>"+state+"</td>"+
					"</tr>";
				}else{
					hang = 
						"<tr>"+
						"<td width='40px' align='center'>"+parseInt(parseInt(i)+1)+"</td>"+
						"<td>"+picture+"</td>"+
						"<td width='210px'><a title='"+myResults[i].name+"'>"+myResults[i].name+"</a></td>"+
						"<td align='center'>"+myResults[i].beginTm+"</td>"+
						"<td align='center'>"+myResults[i].endTm+"</td>"+
						"<td align='center'>"+myResults[i].totalsorce+"</td>"+
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
			url:baseUrl+'/mta/P100/findExerciseList.html',
			data: queryDate,
			type: 'post',
			dataType: 'json',
			success:function(result){
				var myResults = result.rows;
				$("#examList tbody").empty();
				var hang="";
				for(var i in myResults){
					var state="<a href='"+baseUrl+"/mta/P100/goExercise.html?eeUuid="+ myResults[i].uuid +"' target='_blank'><img src='resources/mta/images/icon_exam.png' alt='参加考试' width='77' height='35'/></a>";
					var imgsrc="resources/mta/images/logoimg/pic02.png";
					if(myResults[i].pic != "" && typeof(myResults[i].pic) != 'undefined'){
						imgsrc=myResults[i].pic;
					}
					var picture = "<img src='"+imgsrc+"' width='71' height='71' alt='"+myResults[i].name+"'/>";
					var state="";
					if(i%2==0){
						hang = 
						"<tr class='trColor'>"+
						"<td width='40px' align='center'>"+parseInt((parseInt(i)+1)+(parseInt(pageNo)-1)*7)+"</td>"+
						"<td >"+picture+"</td>"+
						"<td width='210px'><a title='"+myResults[i].name+"'>"+myResults[i].name+"</a></td>"+
						"<td align='center'>"+myResults[i].beginTm+"</td>"+
						"<td align='center'>"+myResults[i].endTm+"</td>"+
						"<td align='center'>"+myResults[i].totalsorce +"</td>"+
						"<td width='107px' align='center'>"+state+"</td>"+
						"</tr>";
					}else{
						hang = 
							"<tr>"+
							"<td width='40px' align='center'>"+parseInt((parseInt(i)+1)+(parseInt(pageNo)-1)*7)+"</td>"+
							"<td>"+picture+"</td>"+
							"<td width='210px'><a title='"+myResults[i].name+"'>"+myResults[i].name+"</a></td>"+
							"<td align='center'>"+myResults[i].beginTm+"</td>"+
							"<td align='center'>"+myResults[i].endTm+"</td>"+
							"<td align='center'>"+myResults[i].totalsorce+"</td>"+
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