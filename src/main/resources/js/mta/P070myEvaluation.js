var queryDate = {};
var page_select_index=7;
var questionPage;
$(function(){
	questionPage = myPage("questionPage");
	//初始化我的成绩
	initMyEvaluation();
	//指定分页事件
	questionPage.getData = getResults;
});
//初始成绩数据(重新生成MyPage)
function initMyEvaluation(){
	queryDate.page = 1;
	queryDate.rows = 10;
	$.ajax({
		url:'findMyEvaluation.html',
		data: queryDate,
		type: 'post',
		dataType: 'json',
		success:function(result){
			createMyPage(Math.ceil(result.total/queryDate.rows));
			var myResults = result.rows;
			$("#evaluationList tbody").empty();
			for(var i in myResults){
				if(myResults[i].content == null){
					myResults[i].content = '';
				
				}
				if(myResults[i].interpretation == null){
					myResults[i].interpretation ='';
				}
				if(myResults[i].credit==0){
					var picture = "0"
				}
				if(myResults[i].credit>=1 && myResults[i].credit <= 29){
					var picture = "<img src='"+baseUrl+"/resources/mta/images/star_pic01.png'>"
				}
				if(myResults[i].credit>=30 && myResults[i].credit <= 59){
					var picture = "<img src='"+baseUrl+"/resources/mta/images/star_pic02.png'>"
				}
				if(myResults[i].credit>=60 && myResults[i].credit <= 79){
					var picture = "<img src='"+baseUrl+"/resources/mta/images/star_pic03.png'>"
				}
				if(myResults[i].credit>=80 && myResults[i].credit <= 89){
					var picture = "<img src='"+baseUrl+"/resources/mta/images/star_pic04.png'>"
				}
				if(myResults[i].credit>=90){
					var picture = "<img src='"+baseUrl+"/resources/mta/images/star_pic05.png'>"
				}
				if(i%2==0){
				var hang = 
					"<tr class='trColor'>"+
					"<td>"+myResults[i].kcName+"</td>"+
					"<td align='center'>"+myResults[i].jsName+"</td>"+
					"<td>"+picture+"</td>"+
					"<td><a title='"+myResults[i].content+"'>"+myResults[i].content+"</a></td>"+
					"<td align='center'>"+myResults[i].insDate+"</td>"+
					"<td class='td'><a title='"+myResults[i].interpretation+"'>"+myResults[i].interpretation+"</a></td>"+
					"</tr>"
				}else{
					var hang = 
						"<tr>"+
						"<td>"+myResults[i].kcName+"</td>"+
						"<td align='center'>"+myResults[i].jsName+"</td>"+
						"<td>"+picture+"</td>"+
						"<td><a title='"+myResults[i].content+"'>"+myResults[i].content+"</a></td>"+
						"<td align='center'>"+myResults[i].insDate+"</td>"+
						"<td class='td'><a title='"+myResults[i].interpretation+"'>"+myResults[i].interpretation+"</a></td>"+
						"</tr>"
				}
				$("#evaluationList tbody").append(hang);
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
			url:'findMyEvaluation.html',
			data: queryDate,
			type: 'post',
			dataType: 'json',
			success:function(result){
				var myResults = result.rows;
				$("#evaluationList tbody").empty();
				for(var i in myResults){
					if(myResults[i].content == null){
						myResults[i].content = '';
					
					}
					if(myResults[i].interpretation == null){
						myResults[i].interpretation ='';
					}
					if(myResults[i].credit==0){
						var picture = "0"
					}
					if(myResults[i].credit>=1 && myResults[i].credit <= 29){
						var picture = "<img src='"+baseUrl+"/resources/images/star_pic01.png'>"
					}
					if(myResults[i].credit>=30 && myResults[i].credit <= 59){
						var picture = "<img src='"+baseUrl+"/resources/images/star_pic02.png'>"
					}
					if(myResults[i].credit>=60 && myResults[i].credit <= 79){
						var picture = "<img src='"+baseUrl+"/resources/images/star_pic03.png'>"
					}
					if(myResults[i].credit>=80 && myResults[i].credit <= 89){
						var picture = "<img src='"+baseUrl+"/resources/images/star_pic04.png'>"
					}
					if(myResults[i].credit>=90){
						var picture = "<img src='"+baseUrl+"/resources/images/star_pic05.png'>"
					}
					if(i%2==0){
						var hang = 
							"<tr class='trColor'>"+
							"<td>"+myResults[i].kcName+"</td>"+
							"<td align='center'>"+myResults[i].jsName+"</td>"+
							"<td>"+picture+"</td>"+
							"<td><a title='"+myResults[i].content+"'>"+myResults[i].content+"</a></td>"+
							"<td align='center'>"+myResults[i].insDate+"</td>"+
							"<td class='td'><a title='"+myResults[i].interpretation+"'>"+myResults[i].interpretation+"</a></td>"+
							"</tr>"
						}else{
							var hang = 
								"<tr>"+
								"<td>"+myResults[i].kcName+"</td>"+
								"<td align='center'>"+myResults[i].jsName+"</td>"+
								"<td>"+picture+"</td>"+
								"<td><a title='"+myResults[i].content+"'>"+myResults[i].content+"</a></td>"+
								"<td align='center'>"+myResults[i].insDate+"</td>"+
								"<td class='td'><a title='"+myResults[i].interpretation+"'>"+myResults[i].interpretation+"</a></td>"+
								"</tr>"
						}
						$("#evaluationList tbody").append(hang);
					}
			}
		});
	}
}
function createMyPage(total){
	questionPage.initPage(total);
}