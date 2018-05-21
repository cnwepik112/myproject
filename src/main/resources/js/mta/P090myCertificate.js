var queryDate = {};
queryDate.rows = 10;
var page_select_index=4;
var certificatePage;
$(function(){
	certificatePage=myPage("certificatePage");
	//初始化我的证书
	initMyCertificate();
	//指定分页事件
	certificatePage.getData = getCertificate;
});
function find(){
	var name = $("#name").val();
	$.post("findName.html",{name:name},function(){
	});
}
function openImageDiv(url){
	//浏览器可见区域的高度
	var wHeight=$(window).height();
	//浏览器可见区域的宽度
	var dWidth=$(window).width();
	$('.certificate').html('<img src="'+url+'"  width="800" height="600"  />');
//	var popHeight= $('.theme-popover').height();
//	var popWidth= $('.theme-popover').width();
//	var height=(wHeight-popHeight)/2;
//	var width=(dWidth-popWidth)/2;
//	$('.theme-popover').css("top",height+"px");
//	$('.theme-popover').css("left",width+"px");
	
	$('.theme-popover-mask').fadeIn(100);
	$('.theme-popover').slideDown(200);
}

function closeImageDiv(){
	$('.theme-popover-mask').fadeOut(100);
	$('.theme-popover').slideUp(200);
}
//初始证书数据(重新生成MyPage)
function initMyCertificate(){
	queryDate.page = 1;
	$.ajax({
		url:'findMyCertificate.html',
		data: queryDate,
		type: 'post',
		dataType: 'json',
		success:function(result){
			createMyPage(Math.ceil(result.total/queryDate.rows));
			var myCertificate = result.rows;
			$("#certificateList tbody").empty();
			for(var i in myCertificate){
					if(i%2==0){
						var hang = 
						"<tr class='trColor'><td>"+myCertificate[i].classname+"</td>"+
						"<td align='center'>"+myCertificate[i].kaoshiJson+"</td>"+
						"<td align='center'>"+myCertificate[i].expiryDate+"</td>"+
						"<td align='center'><a onclick=openImageDiv('"+myCertificate[i].pic+"');  href='javascript:;'>查看</a></td></tr>";
					}else{
						var hang = 
							"<tr><td>"+myCertificate[i].classname+"</td>"+
							"<td align='center'>"+myCertificate[i].kaoshiJson+"</td>"+
							"<td align='center'>"+myCertificate[i].expiryDate+"</td>"+
							"<td align='center'><a onclick=openImageDiv('"+myCertificate[i].pic+"');  href='javascript:;'>查看</a></td></tr>";
					}
					$("#certificateList tbody").append(hang);
				}
			}
	});
}
//考试数据翻页方法
function getCertificate(pageNo){
	if(queryDate.page != pageNo){
		//设置页码
		queryDate.page = pageNo;
		$.ajax({
			url:'findMyCertificate.html',
			data: queryDate,
			type: 'post',
			dataType: 'json',
			success:function(result){
				var myCertificate = result.rows;
				$("#certificateList tbody").empty();
				for(var i in myCertificate){
					if(myCertificate[i].courseName!=''){
						var examName="";
						if (typeof(myCertificate[i].kaoshiJson)!='undefined') {
							var ksData=eval("("+myCertificate[i].kaoshiJson+")");
							examName = ksData.examName;
						} 
						if(i%2==0){
						var hang = 
							"<tr class='trColor'><td>"+myCertificate[i].classname+"</td>"+
//							"<td align='center'>"+myCertificate[i].teacherName+"</td>"+
							"<td align='center'>"+examName+"</td>"+
							"<td align='center'>"+myCertificate[i].expiryDate+"</td>"+
							"<td align='center'><a onclick=openImageDiv('"+myCertificate[i].pic+"');  href='javascript:;'>查看</a></td></tr>";
						}else{
							var hang = 
								"<tr><td>"+myCertificate[i].classname+"</td>"+
//								"<td align='center'>"+myCertificate[i].teacherName+"</td>"+
								"<td align='center'>"+examName+"</td>"+
								"<td align='center'>"+myCertificate[i].expiryDate+"</td>"+
								"<td align='center'><a onclick=openImageDiv('"+myCertificate[i].pic+"');  href='javascript:;'>查看</a></td></tr>";
						}
						$("#certificateList tbody").append(hang);
						}
						else {
							if(i%2==0){
							var hang = 
								"<tr class='trColor'><td>"+myCertificate[i].classname+"</td>"+
//								"<td align='center'>"+myCertificate[i].teacherName+"</td>"+
								"<td align='center'>"+myCertificate[i].kaoshiJson+"</td>"+
								"<td align='center'>"+myCertificate[i].expiryDate+"</td>"+
								"<td align='center'><a onclick=openImageDiv('"+myCertificate[i].pic+"');  href='javascript:;'>查看</a></td></tr>";
							}else{
								var hang = 
									"<tr><td>"+myCertificate[i].classname+"</td>"+
//									"<td align='center'>"+myCertificate[i].teacherName+"</td>"+
									"<td align='center'>"+myCertificate[i].kaoshiJson+"</td>"+
									"<td align='center'>"+myCertificate[i].expiryDate+"</td>"+
									"<td align='center'><a onclick=openImageDiv('"+myCertificate[i].pic+"');  href='javascript:;'>查看</a></td></tr>";
							}
							$("#certificateList tbody").append(hang);
						}
				}
			}
		});
	}
}
function createMyPage(total){
	certificatePage.initPage(total);
}