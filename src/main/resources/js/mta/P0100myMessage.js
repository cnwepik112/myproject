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

function updReadFlag(msgid){
	$.post(baseUrl+'/mta/P0100/updReadFlag.html',{id:msgid},function(data){
		getNoReadMes();
//		$('#msgTitle').html(data.msgtitle);
		$('#msgContent').html(data.msgcontent);
		$('.theme-popover-mask').fadeIn(300);
		$('.theme-popover').slideDown(300);
	},"json");
}

function closeImageDiv(){
	getResults(queryDate.page);
	$('.theme-popover-mask').fadeOut(300);
	$('.theme-popover').slideUp(300);
}
//初始成绩数据(重新生成MyPage)
function initMyQuestionsAsk(){
	queryDate.page = 1;
	queryDate.rows = 10;
	$.post(baseUrl+'/mta/P0100/findMesList.html',queryDate,
			function(result){
			createMyPage(Math.ceil(result.total/queryDate.rows));
			var myResults = result.rows;
			$("#myMessageList tbody").empty();
			for ( var i in myResults) {
				var datatime="";
				if("sendtime" in myResults[i]){
					datatime=myResults[i].sendtime;
				}
				var msgState="";
				if(myResults[i].readmsg==0){
					msgState="<span style='font-weight: bold;font-size:14px;'>未读</span>";
				}else{
					msgState="已读";
				}
				var hang="";
				var strContent= myResults[i].msgcontent;
				if(strContent.length>25){
					strContent=strContent.substr(0,25)+"...";
				}
				if (i % 2 == 0) {
						hang = "<tr class='trColor'><td align='center'>个人消息</td>"
							+ "<td class='td'>" + strContent
							+ "</td>"
							+ "<td align='center'>" + datatime+ "</td>"
							+ "<td align='center'>" + msgState+ "</td>"
							+ "<td align='center' class='td'><a href='javascript:;' onclick='updReadFlag("+myResults[i].id+");'><img src='"+baseUrl+"/resources/mta/images/icon_see.png' width='77' height='35' alt='' /></a></td>" 
							+ "</tr>";
				} else {
						hang = "<tr><td align='center'>个人消息</td>"
								+ "<td class='td'>" + strContent
								+ "</td>"
								+ "<td align='center'>" + datatime+ "</td>"
								+ "<td align='center'>" + msgState+ "</td>"
								+ "<td align='center' class='td'><a href='javascript:;' onclick='updReadFlag("+myResults[i].id+");'><img src='"+baseUrl+"/resources/mta/images/icon_see.png' width='77' height='35' alt='' /></a></td>" 
								+ "</tr>";
				}
				$("#myMessageList tbody").append(hang);
			}
			
		},"json");
}

//考试数据翻页方法
function getResults(pageNo){
		//设置页码
		queryDate.page = pageNo;
		$.post(baseUrl+'/mta/P0100/findMesList.html',queryDate,
			function(result){
			var myResults = result.rows;
			$("#myMessageList tbody").empty();
			for ( var i in myResults) {
				var datatime="";
				if("sendtime" in myResults[i]){
					datatime=myResults[i].sendtime;
				}
				var msgState="";
				if(myResults[i].readmsg==0){
					msgState="<span style='font-weight: bold;font-size:14px;'>未读</span>";
				}else{
					msgState="已读";
				}
				var hang="";
				var strContent= myResults[i].msgcontent;
				if(strContent.length>25){
					strContent=strContent.substr(0,25)+"...";
				}
				if (i % 2 == 0) {
					hang = "<tr class='trColor'><td align='center'>个人消息</td>"
							+ "<td class='td'>" + strContent
							+ "</td>"
							+ "<td align='center'>" + datatime+ "</td>"
							+ "<td align='center'>" + msgState+ "</td>"
							+ "<td align='center' class='td'><a href='javascript:;' onclick='updReadFlag("+myResults[i].id+");'><img src='"+baseUrl+"/resources/mta/images/icon_see.png' width='77' height='35' alt='查看' /></a></td>" 
							+ "</tr>";
				} else {
					hang = "<tr><td align='center'>个人消息</td>"
								+ "<td class='td'>" + strContent
								+ "</td>"
								+ "<td align='center'>" + datatime+ "</td>"
								+ "<td align='center'>" + msgState+ "</td>"
								+ "<td align='center' class='td'><a href='javascript:;' onclick='updReadFlag("+myResults[i].id+");'><img src='"+baseUrl+"/resources/mta/images/icon_see.png' width='77' height='35' alt='查看' /></a></td>" 
								+ "</tr>";
				}
				$("#myMessageList tbody").append(hang);
			}
			
		},"json");
}
function createMyPage(total){
	questionPage.initPage(total);
}