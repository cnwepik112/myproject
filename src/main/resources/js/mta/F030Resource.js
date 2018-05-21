var queryDate = {};
var questionPage;
$(function(){
	questionPage = myPage("questionPage");
	creatClassify(0);

	initMyResource();
	
	$("#classifyDl").find("dd:first > a").addClass("selectedKslx");
	
	//资源名字分类绑定事件
	$("#classifyDl").delegate("dd","click",function(){
		$("#classifyDl").find(".selectedKslx").removeClass("selectedKslx");
		$(this).addClass("selectedKslx");
	});
	
	//资源拓展名分类绑定事件
	$("#ksStatusDl").delegate("dd","click",function(){
		$("#ksStatusDl").find(".selectedKszt").removeClass("selectedKszt");
		$(this).addClass("selectedKszt");
		ksztSelected($(this).attr("id").split("_")[1]);
	});
	
	//资源最新最热分类绑定事件
	$("#newhot").delegate("li","click",function(){
		$("#newhot").find(".newhot").removeClass("newhot");
		$(this).addClass("newhot");
		Selected($(this).attr("id").split("_")[1]);
	});
	
	//指定分页事件
	questionPage.getData = getResource;
	
});

//根据根节点获取资源类型
function creatClassify(classifyId){
	if(queryDate.classifyId != classifyId){
	$.post("getFind.html",{'classifyId':classifyId},function(data){
		var html = '';
		for(var i in data){
			html += "<dd onclick='changeSelected("+ data[i].classifyId +")' style='width:100px;cursor: pointer; '><a>"+ data[i].name +"</a></dd>";
		}
		if(html != ''){
			$("#classifyDl").html("<dt>类型：</dt><dd id='classify' onclick='changeSelected(0)' style='cursor: pointer;'><a>全部</a></dd>"+html);
			$("#classifyDl").find("dd:first > a").addClass("selectedKslx");
		}
	},"json");
	}
}

//资源分类点击事件
function changeSelected(classifyId){
	creatClassify(classifyId);
	queryDate.classifyId = classifyId;
	initMyResource();
}

//资源类型点击事件
function ksztSelected(type){
	if(queryDate.type != type){
		queryDate.type = type;
		initMyResource();
	}
}
//资源最新最热类型点击事件
function Selected(temp){
	if(temp==1){
		
		queryDate.updDate = 1;
		queryDate.downloads = 0;
	}else{
		
		queryDate.updDate = 0;
		queryDate.downloads = 2;
	}
	initMyResource();
}

//初始资源数据(重新生成MyPage)
function initMyResource(){
	queryDate.page = 1;
	queryDate.rows = 7;
	queryDate.name = '';
	$.ajax({
		url:'findResource.html',
		data: queryDate,
		type: 'post',
		dataType: 'json',
		success:function(result){
			createMyPage(Math.ceil(result.total/queryDate.rows));
			var myResource = result.rows;
			$("#resourceList tbody").empty();
			for(var i in myResource){
				var hang = "<tr>"+
				"<td><img src='../../resources/images/icon/"+myResource[i].type+".png ' width='37' height='34' alt='' /></td>"+
					"<td>"+myResource[i].name+"</td>"+
					"<td>"+myResource[i].userName+"</td>"+
					"<td>"+myResource[i].size+"</td>"+
					"<td>"+myResource[i].updDate+"</td>"+
					"<td>"+myResource[i].downloads+"</td>"+
//				"<td><a href='downloadResources.html?uuid="+myResource[i].uuid+"' target='_blank'><img src='../../resources/mta/images/download.png' width='90' height='33' alt='' /></a></td>"+"</tr>";
					"<td><a href='javascript:void(0);' onclick=dianji('"+myResource[i].uuid+"') ><img src='../../resources/mta/images/download.png' width='90' height='33' alt='' /></a></td>"+"</tr>";
//				content
				$("#resourceList tbody").append(hang);
			}
		}
	});
}
//function downloadResources(uuid){
//	
//}
//点击事件 (下载)
function dianji(id){
	if(loginUserId != ''){
		window.location.href = baseUrl +"/mta/F030/downloadResources.html?uuid="+id+"";
		initMyResource();
		return false;
	}else {
		alert("请先登录！");
	}
}

//考试数据翻页方法
function getResource(pageNo){
	if(queryDate.page != pageNo){
		//设置页码
		queryDate.page = pageNo;
		$.ajax({
			url:'findResource.html',
			data: queryDate,
			type: 'post',
			dataType: 'json',
			success:function(result){
				var myResource = result.rows;
				$("#resourceList tbody").empty();
				for(var i in myResource){
					var hang = "<tr>"+
					"<td><img src='../../resources/images/icon/"+myResource[i].type+".png ' width='37' height='34' alt='' /></td>"+
						"<td>"+myResource[i].name+"</td>"+
						"<td>"+myResource[i].userName+"</td>"+
						"<td>"+myResource[i].size+"</td>"+
						"<td>"+myResource[i].updDate+"</td>"+
						"<td>"+myResource[i].downloads+"</td>"+
						"<td><a href='javascript:void(0);' onclick=dianji('"+myResource[i].uuid+"') ><img src='../../resources/mta/images/download.png' width='90' height='33' alt='' /></a></td>"+"</tr>";
//						"<td><a href='downloadResources.html?uuid="+myResource[i].uuid+"' target='_blank'><img src='../../resources/mta/images/download.png' width='90' height='33' alt='' /></a></td>"+"</tr>";
					$("#resourceList tbody").append(hang);
				}
			}
		});
	}
}

//搜索栏
function find(){
	queryDate = {};
	var name = $("#searchText").val();
	queryDate.name = name;
	queryDate.rows = 7;
	queryDate.page = 1;
	$.ajax({
		url:'findName.html',
		data: queryDate,
		type: 'post',
		dataType: 'json',
		success:function(result){
			createMyPage(Math.ceil(result.total/queryDate.rows));
			var myResource = result.rows;
			$("#resourceList tbody").empty();
			for(var i in myResource){
				var hang = "<tr>"+
				"<td><img src='../../resources/images/icon/"+myResource[i].type+".png ' width='37' height='34' alt='' /></td>"+
					"<td>"+myResource[i].name+"</td>"+
					"<td>"+myResource[i].userName+"</td>"+
					"<td>"+myResource[i].size+"</td>"+
					"<td>"+myResource[i].updDate+"</td>"+
					"<td>"+myResource[i].downloads+"</td>"+
					"<td><a href='downloadResources.html?uuid="+myResource[i].uuid+"' target='_blank'><img src='../../resources/mta/images/download.png' width='90' height='33' alt='' /></a></td>"+"</tr>";
				$("#resourceList tbody").append(hang);
				$("#ksClassifyDiv").find(".selectedKslx").removeClass("selectedKslx");
				$("#ksClassifyDiv").find("#classify").addClass("selectedKslx");
				$("#ksStatusDl").find(".selectedKszt").removeClass("selectedKszt");
				$("#ksStatusDl").find("#selectedKszt_0").addClass("selectedKszt");
				
			}
		}
	});
}

function createMyPage(total){
	questionPage.initPage(total);
}
