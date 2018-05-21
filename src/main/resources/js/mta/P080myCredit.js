var queryDate = {};
queryDate.rows = 9;
var page_select_index=3;
var creditPage;
$(function(){
	creditPage= myPage("creditPage");
	//初始化我的学分
	initMyCredit();
	//指定分页事件
	creditPage.getData = getMyCredit;
	function find(){
		var name = $("#name").val();
		$.post("findName.html",{name:name},function(){
		});
	}
});
//初始成绩数据(重新生成MyPage)
function initMyCredit(){
	queryDate.page = 1;
	$.ajax({
		url:'findMyCredit.html',
		data: queryDate,
		type: 'post',
		dataType: 'json',
		success:function(result){
			createMyPage(Math.ceil(result.total/queryDate.rows));
			var myCredit = result.rows;
			$("#creditList tbody").empty();
			for(var i in myCredit){
				if(myCredit[i].courseName!=''){
				var ksData=eval("("+myCredit[i].kaoshiJson+")");
				if(i%2==0){
				var hang = 
//					"<tr class='trColor'><td>"+myCredit[i].courseName+"</td>"+
					"<tr class='trColor'><td align='center'>"+myCredit[i].classname+"</td>"+
					"<td align='center'>"+ksData.examName+"</td>"+
					"<td align='center'>"+myCredit[i].sorce+"</td>"+
					"<td align='center'>"+myCredit[i].updDate+"</td></tr>";
				}else{
					var hang = 
//						"<tr><td>"+myCredit[i].courseName+"</td>"+
						"<tr><td align='center'>"+myCredit[i].classname+"</td>"+
						"<td align='center'>"+ksData.examName+"</td>"+
						"<td align='center'>"+myCredit[i].sorce+"</td>"+
						"<td align='center'>"+myCredit[i].updDate+"</td></tr>";
				}
				$("#creditList tbody").append(hang);
				}
				else {
					if(i%2==0){
					var hang = 
//						"<tr class='trColor'><td>"+myCredit[i].courseName+"</td>"+
						"<tr class='trColor'><td align='center'>"+myCredit[i].classname+"</td>"+
						"<td align='center'>"+myCredit[i].kaoshiJson+"</td>"+
						"<td align='center'>"+myCredit[i].sorce+"</td>"+
						"<td align='center'>"+myCredit[i].updDate+"</td></tr>";
					}else{
						var hang = 
//							"<tr><td>"+myCredit[i].courseName+"</td>"+
							"<tr><td align='center'>"+myCredit[i].classname+"</td>"+
							"<td align='center'>"+myCredit[i].kaoshiJson+"</td>"+
							"<td align='center'>"+myCredit[i].sorce+"</td>"+
							"<td align='center'>"+myCredit[i].updDate+"</td></tr>";
					}
					$("#creditList tbody").append(hang);
				}
			}
		}
	});
}
//考试数据翻页方法
function getMyCredit(pageNo){
	if(queryDate.page != pageNo){
		//设置页码
		queryDate.page = pageNo;
		$.ajax({
			url:'findMyCredit.html',
			data: queryDate,
			type: 'post',
			dataType: 'json',
			success:function(result){
				var myCredit = result.rows;
				$("#creditList tbody").empty();
				for(var i in myCredit){
					if(myCredit[i].courseName!=''){
					var ksData=eval("("+myCredit[i].kaoshiJson+")");
					if(i%2==0){
					var hang = 
//						"<tr class='trColor'><td>"+myCredit[i].courseName+"</td>"+
						"<tr class='trColor'><td align='center'>"+myCredit[i].classname+"</td>"+
						"<td align='center'>"+ksData.examName+"</td>"+
						"<td align='center'>"+myCredit[i].sorce+"</td>"+
						"<td align='center'>"+myCredit[i].updDate+"</td></tr>";
					}else{
						var hang = 
//							"<tr><td>"+myCredit[i].courseName+"</td>"+
							"<tr><td align='center'>"+myCredit[i].classname+"</td>"+
							"<td align='center'>"+ksData.examName+"</td>"+
							"<td align='center'>"+myCredit[i].sorce+"</td>"+
							"<td align='center'>"+myCredit[i].updDate+"</td></tr>";
					}
					$("#creditList tbody").append(hang);
					}
					else {
						if(i%2==0){
						var hang = 
//							"<tr class='trColor'><td>"+myCredit[i].courseName+"</td>"+
							"<tr class='trColor'><td align='center'>"+myCredit[i].classname+"</td>"+
							"<td align='center'>"+myCredit[i].kaoshiJson+"</td>"+
							"<td align='center'>"+myCredit[i].sorce+"</td>"+
							"<td align='center'>"+myCredit[i].updDate+"</td></tr>";
						}else{
							var hang = 
//								"<tr><td>"+myCredit[i].courseName+"</td>"+
								"<tr><td align='center'>"+myCredit[i].classname+"</td>"+
								"<td align='center'>"+myCredit[i].kaoshiJson+"</td>"+
								"<td align='center'>"+myCredit[i].sorce+"</td>"+
								"<td align='center'>"+myCredit[i].updDate+"</td></tr>";
						}
						$("#creditList tbody").append(hang);
					}
				}
			}
		});
	}
}
function createMyPage(total){
	creditPage.initPage(total);
}