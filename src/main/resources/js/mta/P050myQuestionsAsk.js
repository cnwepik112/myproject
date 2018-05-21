var queryDate = {};
var page_select_index=5;
var questionPage;
$(function(){
	questionPage = myPage("questionPage");
	//初始化我的成绩
	initMyQuestionsAsk();
	//指定分页事件
	questionPage.getData = getResults;
});
function check(){
	$('.theme-popover').html(
			"<div class='biji111'>"+
			"<ul>"+
			"<li style='position: absolute; top:10px;left:470px;'>"+
			"<a  onclick='javascript:closeImageDiv();' href='javascript:void(0);'>关闭</a>"+
			"</li>"+
			"</ul>"+
			"<h2><img src='"+baseUrl+"/resources/mta/images/biji_h2_pic02.png' width='141' height='35' alt='' /></h2>"+
			"<dl>"+
			"<dd>"+
			"<label for='textarea'></label>"+
			"<textarea name='textarea' id='textarea' cols='45' rows='5'></textarea>"+
			"</dd>"+
			"</dl>"+
			"<ul>"+
			"<li><a href='javascript:;' onclick='addQuestionsAsk();'><img src='"+baseUrl+"/resources/mta/images/ask_icon08.png' width='80' height='30' alt='' /></a></li>"+
			"</ul>"+
			"</div>");
	$('.theme-popover-mask').fadeIn(300);
	$('.theme-popover').slideDown(300);
}

function closeImageDiv(){
	$('.theme-popover-mask').fadeOut(300);
	$('.theme-popover').slideUp(300);
}
function addQuestionsAsk(){
	var content = $("#textarea").val();
	if(content !=null && content != ''){
		$.post("addQuestionsAsk.html",{"content":content},function(data){
				initMyQuestionsAsk();
				closeImageDiv();
		});
	}else{
		alert("您的问题为空！！！");
	}
			
}
//初始成绩数据(重新生成MyPage)
function initMyQuestionsAsk(){
	queryDate.page = 1;
	queryDate.rows = 10;
	$.ajax({
		url:'findMyQuestionsAsk.html',
		data: queryDate,
		type: 'post',
		dataType: 'json',
		success:function(result){
			
			createMyPage(Math.ceil(result.total/queryDate.rows));
			var myResults = result.rows;
			$("#myQuestionsAskList tbody").empty();
			for(var i in myResults){
				if(myResults[i].name == null){
					myResults[i].name = '自问答';
				}
				if(i%2==0){
				var hang = 
					"<tr class='trColor'>"+
					"<td>"+myResults[i].name+"</td>"+
					"<td class='td'><a title='"+myResults[i].title+"'>"+myResults[i].title+"</td>"+
					"<td align='center'>"+myResults[i].insDate+"</td>"+
					"<td align='center' class='td'>"+myResults[i].counts+"</a></td>"+
					"</tr>"
				}else{
					var hang = 
						"<tr>"+
						"<td>"+myResults[i].name+"</td>"+
						"<td class='td'><a title='"+myResults[i].title+"'>"+myResults[i].title+"</td>"+
						"<td align='center'>"+myResults[i].insDate+"</td>"+
						"<td align='center' class='td'>"+myResults[i].counts+"</a></td>"+
						"</tr>"
				}
				$("#myQuestionsAskList tbody").append(hang);
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
			url:'findMyQuestionsAsk.html',
			data: queryDate,
			type: 'post',
			dataType: 'json',
			success:function(result){
				var myResults = result.rows;
				$("#myQuestionsAskList tbody").empty();
				for(var i in myResults){
					if(myResults[i].name == null){
						myResults[i].name = '自问答';
					}
					if(i%2==0){
						var hang = 
							"<tr class='trColor'>"+
							"<td>"+myResults[i].name+"</td>"+
							"<td class='td'><a title='"+myResults[i].title+"'>"+myResults[i].title+"</td>"+
							"<td align='center'>"+myResults[i].insDate+"</td>"+
							"<td align='center' class='td'>"+myResults[i].counts+"</a></td>"+
							"</tr>"
						}else{
							var hang = 
								"<tr>"+
								"<td>"+myResults[i].name+"</td>"+
								"<td class='td'><a title='"+myResults[i].title+"'>"+myResults[i].title+"</td>"+
								"<td align='center'>"+myResults[i].insDate+"</td>"+
								"<td align='center' class='td'>"+myResults[i].counts+"</a></td>"+
								"</tr>"
						}
						$("#myQuestionsAskList tbody").append(hang);
					}
			}
		});
	}
}
function createMyPage(total){
	questionPage.initPage(total);
}