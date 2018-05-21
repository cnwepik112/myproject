var queryDate = {};
queryDate.rows = 7;
var page_select_index=4;
var resourcePage;
$(function(){
	resourcePage=myPage("resourcePage");
	//初始化我的资源
	initMyResource();
	//指定分页事件
	resourcePage.getData = getMyResource;
});
//初始资源数据(重新生成MyPage)
function initMyResource(){
	queryDate.page = 1;
	$.ajax({
		url:'findMyResource.html',
		data: queryDate,
		type: 'post',
		dataType: 'json',
		success:function(result){
			createMyPage(Math.ceil(result.total/queryDate.rows));
			var myResource = result.rows;
			$("#resourceList tbody").empty();
			for(var i in myResource){
				if(i%2==0){
				var hang = 
					"<tr class='trColor'>"+"<td align='center'><img src='../../resources/images/icon/"+myResource[i].type+".png ' width='41' height='41' alt='' /></td>"+
					"<td>"+myResource[i].resourceName+"</td>"+
					"<td align='center'>"+myResource[i].userName+"</td>"+
					"<td align='center'>"+myResource[i].size+"</td>"+
					"<td align='center'>"+myResource[i].updDate+"</td>"+
					"<td align='center'>"+myResource[i].downloads+"</td>"+
					"<td align='center'><a href='downloadResources.html?resourceId="+myResource[i].resourceId+"' target='_blank'><img src='../../resources/mta/images/icon_download.png' width='77' height='35' alt='' /></a></td>"+"</tr>";
				}else{
					var hang = 
						"<tr>"+"<td align='center'><img src='../../resources/images/icon/"+myResource[i].type+".png ' width='41' height='41' alt='' /></td>"+
						"<td>"+myResource[i].resourceName+"</td>"+
						"<td align='center'>"+myResource[i].userName+"</td>"+
						"<td align='center'>"+myResource[i].size+"</td>"+
						"<td align='center'>"+myResource[i].updDate+"</td>"+
						"<td align='center'>"+myResource[i].downloads+"</td>"+
						"<td align='center'><a href='downloadResources.html?resourceId="+myResource[i].resourceId+"' target='_blank'><img src='../../resources/mta/images/icon_download.png' width='77' height='35' alt='' /></a></td>"+"</tr>";
				}
				$("#resourceList tbody").append(hang);
			}
		}
	});
}
//考试数据翻页方法
function getMyResource(pageNo){
	if(queryDate.page != pageNo){
		//设置页码
		queryDate.page = pageNo;
		$.ajax({
			url:'findMyResource.html',
			data: queryDate,
			type: 'post',
			dataType: 'json',
			success:function(result){
				var myResource = result.rows;
				$("#resourceList tbody").empty();
				for(var i in myResource){
					if(i%2==0){
					var hang = 
						"<tr class='trColor'>"+"<td align='center'><img src='../../resources/images/icon/"+myResource[i].type+".png ' width='41' height='41' alt='' /></td>"+
						"<td>"+myResource[i].resourceName+"</td>"+
						"<td align='center'>"+myResource[i].userName+"</td>"+
						"<td align='center'>"+myResource[i].size+"</td>"+
						"<td align='center'>"+myResource[i].updDate+"</td>"+
						"<td align='center'>"+myResource[i].downloads+"</td>"+
						"<td align='center'><a href='downloadResources.html?resourceId="+myResource[i].resourceId+"' target='_blank'><img src='../../resources/mta/images/icon_download.png' width='77' height='35' alt='' /></a></td>"+"</tr>";
					}else{
						var hang = 
							"<tr>"+"<td align='center'><img src='../../resources/images/icon/"+myResource[i].type+".png ' width='41' height='41' alt='' /></td>"+
							"<td>"+myResource[i].resourceName+"</td>"+
							"<td align='center'>"+myResource[i].userName+"</td>"+
							"<td align='center'>"+myResource[i].size+"</td>"+
							"<td align='center'>"+myResource[i].updDate+"</td>"+
							"<td align='center'>"+myResource[i].downloads+"</td>"+
							"<td align='center'><a href='downloadResources.html?resourceId="+myResource[i].resourceId+"' target='_blank'><img src='../../resources/mta/images/icon_download.png' width='77' height='35' alt='' /></a></td>"+"</tr>";
					}
					$("#resourceList tbody").append(hang);
				}
			}
		});
	}
}
function find(){
	var name = $("#name").val();
	$.post("findName.html",{name:name},function(){
	});
}
function createMyPage(total){
	resourcePage.initPage(total);
}