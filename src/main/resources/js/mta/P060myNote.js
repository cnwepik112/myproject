var queryDate = {};
queryDate.rows = 10;
var page_select_index=6;
var myPage;
$(function(){
	myPage = myPage("myPage");
	//初始化我的笔记
	initMyNote();
	//指定分页事件
	myPage.getData = getMyNote;
});
//初始资源数据(重新生成MyPage)
function initMyNote(){
	queryDate.page = 1;
	$.ajax({
		url:'findMyNote.html',
		data: queryDate,
		type: 'post',
		dataType: 'json',
		success:function(result){
			createMyPage(Math.ceil(result.total/queryDate.rows));
			var myNote = result.rows;
			$("#myTbody").empty();
			getData(myNote);
		}
	});
}
//考试数据翻页方法
function getMyNote(pageNo){
	if(queryDate.page != pageNo){
		//设置页码
		queryDate.page = pageNo;
		$.ajax({
			url:'findMyNote.html',
			data: queryDate,
			type: 'post',
			dataType: 'json',
			success:function(result){
				var myNote = result.rows;
				$("#myTbody").empty();			
				getData(myNote);
			}
		});
	}
}
function createMyPage(total){
	myPage.initPage(total);
}
function getData(myNote){
	for(var i in myNote){
		if(myNote[i].name == null){
			myNote[i].name = '';
		
		}
		if(myNote[i].title == null){
			myNote[i].title ='';
		}
		if(myNote[i].content == null){
			myNote[i].content ='';
		}
		if(i%2 == 0){
			
			var hang = 
				"<tr class='trColor'>"+
				"<td class='td' align='left' height='39' width='350' ><a title='"+myNote[i].name+"'>"+myNote[i].name + "  " + myNote[i].title+"</a></td>"+
				"<td class='td' align='left' height='39' width='350' ><a title='"+myNote[i].content+"'>"+myNote[i].content+"</a></td>"+
				"<td class='td' align='center' height='39' width='350'><a title='"+myNote[i].insDate+"'>"+myNote[i].insDate+"</a></td>" + "</tr>";
			$("#myTbody").append(hang);
		}else{
			var hang = 
				"<tr>"+
				"<td class='td' align='left' height='39' width='350' ><a title='"+myNote[i].name+"'>"+myNote[i].name + "  " + myNote[i].title+"</a></td>"+
				"<td class='td' align='left' height='39' width='350' ><a title='"+myNote[i].content+"'>"+myNote[i].content+"</a></td>"+
				"<td class='td' align='center' height='39' width='350'><a title='"+myNote[i].insDate+"'>"+myNote[i].insDate+"</a></td>" + "</tr>";
			$("#myTbody").append(hang);

		}
	}
}