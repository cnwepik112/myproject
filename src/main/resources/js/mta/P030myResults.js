var queryDate = {};
queryDate.rows = 6;
var page_select_index=1;
var resultsPage;
$(function(){
	resultsPage= myPage("resultsPage");
	//初始化我的成绩
	initMyResults();
	//指定分页事件
	resultsPage.getData = getResults;
	function find(){
		var name = $("#name").val();
		$.post("findName.html",{name:name},function(){
		});
	}
});
//初始成绩数据(重新生成MyPage)
function initMyResults(){
	queryDate.page = 1;
	$.ajax({
		url:'findMyResults.html',
		data: queryDate,
		type: 'post',
		dataType: 'json',
		success:function(result){
			createMyPage(Math.ceil(result.total/queryDate.rows));
			var myResults = result.rows;
			$("#resultsList tbody").empty();
			for(var i in myResults){
				var imgsrc=baseUrl+"/resources/mta/images/logoimg/pic02.png";
				if(myResults[i].pic != "" && typeof(myResults[i].pic) != 'undefined'){
					imgsrc=myResults[i].pic;
				}
				if(myResults[i].resultPublishTime<result.now){
					
					if(myResults[i].publishAnswerFlg==1){
						
						if(i%2==0){
							var hang = 
								"<tr class='trColor'><td align='center'>"+parseInt(parseInt(i)+1)+"</td>"+
								"<td align='center'><img src='"+imgsrc+"' width='71' height='71'/></td>"+
								"<td style='width:125px'>"+myResults[i].ksName+"</td>"+
								"<td align='center'>"+myResults[i].startTm+"</td>"+
								"<td align='center'>"+myResults[i].endTm+"</td>"+
								"<td align='center'>"+myResults[i].totalsorce+"</td>"+
								"<td align='center'>"+myResults[i].okrate+"</td>"+
								"<td align='center'>"+myResults[i].sorce+"</td>"+
								"<td align='center'>"+myResults[i].paiming+"</td>"+
								"<td align='center'><a href='findResultById.html?ksid="+myResults[i].ksid+"&id="+myResults[i].id+"' target='_blank'><img src='../../resources/mta/images/icon_see.png' width='77' height='35' alt='' /></a></td>"+"</tr>";
						}else{
							var hang = 
								"<tr >"+"<td align='center'>"+parseInt(parseInt(i)+1)+"</td>"+
								"<td align='center'><img src='"+imgsrc+"' width='71' height='71'/></td>"+
								"<td style='width:125px'>"+myResults[i].ksName+"</td>"+
								"<td align='center'>"+myResults[i].startTm+"</td>"+
								"<td align='center'>"+myResults[i].endTm+"</td>"+
								"<td align='center'>"+myResults[i].totalsorce+"</td>"+
								"<td align='center'>"+myResults[i].okrate+"</td>"+
								"<td align='center'>"+myResults[i].sorce+"</td>"+
								"<td align='center'>"+myResults[i].paiming+"</td>"+
								"<td align='center'><a href='findResultById.html?ksid="+myResults[i].ksid+"&id="+myResults[i].id+"' target='_blank'><img src='../../resources/mta/images/icon_see.png' width='77' height='35' alt='' /></a></td>"+"</tr>";
						}
					}
					if(myResults[i].publishAnswerFlg==0){
						if(i%2==0){
							var hang = 
								"<tr class='trColor'><td align='center'>"+parseInt(parseInt(i)+1)+"</td>"+
								"<td align='center'><img src='"+imgsrc+"' width='71' height='71'/></td>"+
								"<td style='width:125px'>"+myResults[i].ksName+"</td>"+
								"<td align='center'>"+myResults[i].startTm+"</td>"+
								"<td align='center'>"+myResults[i].endTm+"</td>"+
								"<td align='center'>"+myResults[i].totalsorce+"</td>"+
								"<td align='center'>"+myResults[i].okrate+"</td>"+
								"<td align='center'>"+myResults[i].sorce+"</td>"+
								"<td align='center'>"+myResults[i].paiming+"</td>"+
								"<td align='center'></td>"+"</tr>";
						}else{
							var hang = 
								"<tr >"+"<td align='center'>"+parseInt(parseInt(i)+1)+"</td>"+
								"<td align='center'><img src='"+imgsrc+"' width='71' height='71'/></td>"+
								"<td style='width:125px'>"+myResults[i].ksName+"</td>"+
								"<td align='center'>"+myResults[i].startTm+"</td>"+
								"<td align='center'>"+myResults[i].endTm+"</td>"+
								"<td align='center'>"+myResults[i].totalsorce+"</td>"+
								"<td align='center'>"+myResults[i].okrate+"</td>"+
								"<td align='center'>"+myResults[i].sorce+"</td>"+
								"<td align='center'>"+myResults[i].paiming+"</td>"+
								"<td align='center'></td>"+"</tr>";
						}
					}
				}else{
					if(i%2==0){
						var hang = 
							"<tr class='trColor'><td align='center'>"+parseInt(parseInt(i)+1)+"</td>"+
							"<td align='center'><img src='"+imgsrc+"' width='71' height='71' /></td>"+
							"<td style='width:125px'>"+myResults[i].ksName+"</td>"+
							"<td align='center'>"+myResults[i].startTm+"</td>"+
							"<td align='center'>"+myResults[i].endTm+"</td>"+
							"<td align='center'>"+myResults[i].totalsorce+"</td>"+
							"<td align='center'>"+myResults[i].okrate+"</td>"+
							"<td align='center'>机密</td>"+
							"<td align='center'>机密</td>"+
							"<td align='center'></td></tr>";
					}else{
						var hang = 
							"<tr >"+"<td align='center'>"+parseInt(parseInt(i)+1)+"</td>"+
							"<td align='center'><img src='"+imgsrc+"' width='71' height='71' /></td>"+
							"<td style='width:125px'>"+myResults[i].ksName+"</td>"+
							"<td align='center'>"+myResults[i].startTm+"</td>"+
							"<td align='center'>"+myResults[i].endTm+"</td>"+
							"<td align='center'>"+myResults[i].totalsorce+"</td>"+
							"<td align='center'>"+myResults[i].okrate+"</td>"+
							"<td align='center'>机密</td>"+
							"<td align='center'>机密</td>"+
							"<td align='center'></td></tr>";
					}
				}
				$("#resultsList tbody").append(hang);
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
			url:'findMyResults.html',
			data: queryDate,
			type: 'post',
			dataType: 'json',
			success:function(result){
				var myResults = result.rows;
				$("#resultsList tbody").empty();
				for(var i in myResults){
					var imgsrc=baseUrl+"/resources/mta/images/logoimg/pic02.png";
					if(myResults[i].pic != "" && typeof(myResults[i].pic) != 'undefined'){
						imgsrc=myResults[i].pic;
					}
					if(myResults[i].resultPublishTime<result.now){
						
						if(myResults[i].publishAnswerFlg==1){
							if(i%2==0){
								var hang = 
									"<tr class='trColor'><td align='center'>"+parseInt((parseInt(i)+1)+(parseInt(pageNo)-1)*6)+"</td>"+
									"<td align='center'><img src='"+imgsrc+"' width='71' height='71' alt='' /></td>"+
									"<td style='width:125px'>"+myResults[i].ksName+"</td>"+
									"<td align='center'>"+myResults[i].startTm+"</td>"+
									"<td align='center'>"+myResults[i].endTm+"</td>"+
									"<td align='center'>"+myResults[i].totalsorce+"</td>"+
									"<td align='center'>"+myResults[i].okrate+"</td>"+
									"<td align='center'>"+myResults[i].sorce+"</td>"+
									"<td align='center'>"+myResults[i].paiming+"</td>"+
									"<td align='center'><a href='findResultById.html?ksid="+myResults[i].ksid+"&id="+myResults[i].id+"' target='_blank'><img src='../../resources/mta/images/icon_see.png' width='77' height='35' alt='' /></a></td>"+"</tr>";
							}else{
								var hang = 
									"<tr >"+"<td align='center'>"+parseInt((parseInt(i)+1)+(parseInt(pageNo)-1)*6)+"</td>"+
									"<td align='center'><img src='"+imgsrc+"' width='71' height='71' alt='' /></td>"+
									"<td style='width:125px'>"+myResults[i].ksName+"</td>"+
									"<td align='center'>"+myResults[i].startTm+"</td>"+
									"<td align='center'>"+myResults[i].endTm+"</td>"+
									"<td align='center'>"+myResults[i].totalsorce+"</td>"+
									"<td align='center'>"+myResults[i].okrate+"</td>"+
									"<td align='center'>"+myResults[i].sorce+"</td>"+
									"<td align='center'>"+myResults[i].paiming+"</td>"+
									"<td align='center'><a href='findResultById.html?ksid="+myResults[i].ksid+"&id="+myResults[i].id+"' target='_blank'><img src='../../resources/mta/images/icon_see.png' width='77' height='35' alt='' /></a></td>"+"</tr>";
							}
						}
						if(myResults[i].publishAnswerFlg==0){
							if(i%2==0){
								var hang = 
									"<tr class='trColor'><td align='center'>"+parseInt((parseInt(i)+1)+(parseInt(pageNo)-1)*6)+"</td>"+
									"<td align='center'><img src='"+imgsrc+"' width='71' height='71'/></td>"+
									"<td style='width:125px'>"+myResults[i].ksName+"</td>"+
									"<td align='center'>"+myResults[i].startTm+"</td>"+
									"<td align='center'>"+myResults[i].endTm+"</td>"+
									"<td align='center'>"+myResults[i].totalsorce+"</td>"+
									"<td align='center'>"+myResults[i].okrate+"</td>"+
									"<td align='center'>"+myResults[i].sorce+"</td>"+
									"<td align='center'>"+myResults[i].paiming+"</td>"+
									"<td align='center'></td>"+"</tr>";
							}else{
								var hang = 
									"<tr >"+"<td align='center'>"+parseInt((parseInt(i)+1)+(parseInt(pageNo)-1)*6)+"</td>"+
									"<td align='center'><img src='"+imgsrc+"' width='71' height='71'/></td>"+
									"<td style='width:125px'>"+myResults[i].ksName+"</td>"+
									"<td align='center'>"+myResults[i].startTm+"</td>"+
									"<td align='center'>"+myResults[i].endTm+"</td>"+
									"<td align='center'>"+myResults[i].totalsorce+"</td>"+
									"<td align='center'>"+myResults[i].okrate+"</td>"+
									"<td align='center'>"+myResults[i].sorce+"</td>"+
									"<td align='center'>"+myResults[i].paiming+"</td>"+
									"<td align='center'></td>"+"</tr>";
							}
						}
					}else{
						if(i%2==0){
							var hang = 
								"<tr class='trColor'><td align='center'>"+parseInt((parseInt(i)+1)+(parseInt(pageNo)-1)*6)+"</td>"+
								"<td align='center'><img src='"+imgsrc+"' width='71' height='71' alt='' /></td>"+
								"<td style='width:125px'>"+myResults[i].ksName+"</td>"+
								"<td align='center'>"+myResults[i].startTm+"</td>"+
								"<td align='center'>"+myResults[i].endTm+"</td>"+
								"<td align='center'>"+myResults[i].totalsorce+"</td>"+
								"<td align='center'>"+myResults[i].okrate+"</td>"+
								"<td align='center'>机密</td>"+
								"<td align='center'>机密</td>"+
								"<td align='center'></td></tr>";
						}else{
							var hang = 
								"<tr >"+"<td align='center'>"+parseInt((parseInt(i)+1)+(parseInt(pageNo)-1)*6)+"</td>"+
								"<td align='center'><img src='"+imgsrc+"' width='71' height='71' alt='' /></td>"+
								"<td style='width:125px'>"+myResults[i].ksName+"</td>"+
								"<td align='center'>"+myResults[i].startTm+"</td>"+
								"<td align='center'>"+myResults[i].endTm+"</td>"+
								"<td align='center'>"+myResults[i].totalsorce+"</td>"+
								"<td align='center'>"+myResults[i].okrate+"</td>"+
								"<td align='center'>机密</td>"+
								"<td align='center'>机密</td>"+
								"<td align='center'></td></tr>";
						}
					}
					$("#resultsList tbody").append(hang);
				}
			}
		});
	}
}
function createMyPage(total){
	resultsPage.initPage(total);
}