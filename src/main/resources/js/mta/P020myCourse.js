var queryDate = {};
queryDate.rows = 7;
page_select_index = 0;
var coursePage;
var coursePingjia = 1;
$(function() {
	$("#ksStatusDl").delegate("dd", "click", function() {
		$("#ksStatusDl").find(".selectedKszt1").removeClass("selectedKszt1");
		$(this).addClass("selectedKszt1");
		ksztSelected($(this).attr("id").split("_")[1]);
	});
	coursePage = myPage("coursePage");
	// 初始化我的课程
	initMyCourse();
	// 指定分页事件
	coursePage.getData = getMyCourse;
//选择评价等级
	$("#pingjia_ul li").on("click",function(i, n) {
				$(this).find("img").attr("src","../../resources/mta/images/" + $(this).attr("id")+ "_selected.png");
				$(this).siblings("li").each(
						function(i, n) {
							$(n).find("img").attr("src","../../resources/mta/images/" + $(n).attr("id") + ".png");
						});
				coursePingjia = $(this).val();
			});
});
function ksztSelected(courseType) {
	queryDate.courseType = courseType;
	initMyCourse();
}
// 初始课程数据(重新生成MyPage)
function initMyCourse() {
	queryDate.page = 1;
	$.ajax({
				url : 'findMyCourse.html',
				data : queryDate,
				type : 'post',
				dataType : 'json',
				success : function(result) {
					createMyPage(Math.ceil(result.total / queryDate.rows));
					var myCourse = result.rows;
					var nowDate = result.nowDate;
					$("#courseList tbody").empty();
					var pingjiaUrl='';
					var xuexiImg='';
					for ( var i in myCourse) {
						if (myCourse[i].pic == '' || myCourse[i].pic == null) {
							myCourse[i].pic = '../../resources/mta/images/pic01new.png';
						}
						if(queryDate.courseType==3){
							xuexiImg='../../resources/mta/images/icon_studyFinish.png';
						}
						if(queryDate.courseType!=3){
							xuexiImg='../../resources/mta/images/icon_study.png';
						}
						if(myCourse[i].appraiseid==0){
							pingjiaUrl='../../resources/mta/images/icon_pingjia.png';
							var hang = "";
							if (nowDate < myCourse[i].endTm){
								if (i % 2 == 0) {
									hang += "<tr class='trColor'>"+ "<td align='center'><img src='"+ myCourse[i].pic+ "' width='71' height='71' alt='' /></td>"
									+ "<td><a href='"+ baseurl+ "/mta/F010/CourseInfo.html?uuid="+ myCourse[i].uuid+ "' target='_blank'>"+ myCourse[i].courseName+ "</a></td>"
									+ "<td align='center'>"+ myCourse[i].classifyName+ "</td>"
									+ "<td align='center'>"+ myCourse[i].beginTm+ "</td>"
									+ "<td align='center'>"+ myCourse[i].endTm+ "</td>"
									+ "<td align='center'>"+ myCourse[i].credit+ "</td>"
									+ "<td align='center'><a href='"+ baseurl+ "/mta/F010/Courseplay.html?uuid="+ myCourse[i].uuid+ "' target='_blank'><img src='"+xuexiImg+"' width='77' height='35' alt='' /></a>"
									+ "<a onclick=openImageDiv("+ myCourse[i].courseId+ "); href='javascript:void(0);'><img src='"+pingjiaUrl+"' width='77' height='35' alt='' /></a></td>" + "</tr>";
								} else {
									hang += "<tr>" + "<td align='center'><img src='"+ myCourse[i].pic+ "' width='71' height='71' alt='' /></td>"
									+ "<td><a href='"+ baseurl+ "/mta/F010/CourseInfo.html?uuid="+ myCourse[i].uuid+ "' target='_blank'>"+ myCourse[i].courseName+ "</a></td>"
									+ "<td align='center'>"+ myCourse[i].classifyName+ "</td>"
									+ "<td align='center'>"+ myCourse[i].beginTm+ "</td>"
									+ "<td align='center'>"+ myCourse[i].endTm+ "</td>"
									+ "<td align='center'>"+ myCourse[i].credit+ "</td>"
									+ "<td align='center'><a href='"+ baseurl+ "/mta/F010/Courseplay.html?uuid="+ myCourse[i].uuid+ "' target='_blank'><img src='"+xuexiImg+"' width='77' height='35' alt='' /></a>"
									+ "<a onclick=openImageDiv("+ myCourse[i].courseId+ "); href='javascript:void(0);'><img src='"+pingjiaUrl+"' width='77' height='35' alt='' /></a></td>" + "</tr>";
								}
							}
							else{
								if (i % 2 == 0) {
									hang += "<tr class='trColor'>"+ "<td align='center'><img src='"+ myCourse[i].pic+ "' width='71' height='71' alt='' /></td>"
									+ "<td><a href='"+ baseurl+ "/mta/F010/CourseInfo.html?uuid="+ myCourse[i].uuid+ "' target='_blank'>"+ myCourse[i].courseName+ "</a></td>"
									+ "<td align='center'>"+ myCourse[i].classifyName+ "</td>"
									+ "<td align='center'>"+ myCourse[i].beginTm+ "</td>"
									+ "<td align='center'>"+ myCourse[i].endTm+ "</td>"
									+ "<td align='center'>"+ myCourse[i].credit+ "</td>"
									+ "<td align='center'><img src='../../resources/mta/images/icon_studyFinish.png' width='77' height='35' alt='' />"
									+ "<a onclick=openImageDiv("+ myCourse[i].courseId+ "); href='javascript:void(0);' ><img src='"+pingjiaUrl+"' width='77' height='35' alt='' /></a></td>" + "</tr>";
								} else {
									hang += "<tr>" + "<td align='center'><img src='"+ myCourse[i].pic+ "' width='71' height='71' alt='' /></td>"
									+ "<td><a href='"+ baseurl+ "/mta/F010/CourseInfo.html?uuid="+ myCourse[i].uuid+ "' target='_blank'>"+ myCourse[i].courseName+ "</a></td>"
									+ "<td align='center'>"+ myCourse[i].classifyName+ "</td>"
									+ "<td align='center'>"+ myCourse[i].beginTm+ "</td>"
									+ "<td align='center'>"+ myCourse[i].endTm+ "</td>"
									+ "<td align='center'>"+ myCourse[i].credit+ "</td>"
									+ "<td align='center'><img src='../../resources/mta/images/icon_studyFinish.png' width='77' height='35' alt='' />"
									+ "<a onclick=openImageDiv("+ myCourse[i].courseId+ "); href='javascript:void(0);' ><img src='"+pingjiaUrl+"' width='77' height='35' alt='' /></a></td>" + "</tr>";
								}
							}
						}
						if(myCourse[i].appraiseid!=0){
							pingjiaUrl='../../resources/mta/images/icon_pingjiaFinish.png';
							myCourse[i].courseId = 0;
							var hang = "";
							if (nowDate < myCourse[i].endTm){
								if (i % 2 == 0) {
									hang += "<tr class='trColor'>"+ "<td align='center'><img src='"+ myCourse[i].pic+ "' width='71' height='71' alt='' /></td>"
									+ "<td><a href='"+ baseurl+ "/mta/F010/CourseInfo.html?uuid="+ myCourse[i].uuid+ "' target='_blank'>"+ myCourse[i].courseName+ "</a></td>"
									+ "<td align='center'>"+ myCourse[i].classifyName+ "</td>"
									+ "<td align='center'>"+ myCourse[i].beginTm+ "</td>"
									+ "<td align='center'>"+ myCourse[i].endTm+ "</td>"
									+ "<td align='center'>"+ myCourse[i].credit+ "</td>"
									+ "<td align='center'><a href='"+ baseurl+ "/mta/F010/Courseplay.html?uuid="+ myCourse[i].uuid+ "' target='_blank'><img src='"+xuexiImg+"' width='77' height='35' alt='' /></a>"
									+ "<img src='"+pingjiaUrl+"' width='77' height='35' alt='' /></td>" + "</tr>";
								} else {
									hang += "<tr>" + "<td align='center'><img src='"+ myCourse[i].pic+ "' width='71' height='71' alt='' /></td>"
									+ "<td><a href='"+ baseurl+ "/mta/F010/CourseInfo.html?uuid="+ myCourse[i].uuid+ "' target='_blank'>"+ myCourse[i].courseName+ "</a></td>"
									+ "<td align='center'>"+ myCourse[i].classifyName+ "</td>"
									+ "<td align='center'>"+ myCourse[i].beginTm+ "</td>"
									+ "<td align='center'>"+ myCourse[i].endTm+ "</td>"
									+ "<td align='center'>"+ myCourse[i].credit+ "</td>"
									+ "<td align='center'><a href='"+ baseurl+ "/mta/F010/Courseplay.html?uuid="+ myCourse[i].uuid+ "' target='_blank'><img src='"+xuexiImg+"' width='77' height='35' alt='' /></a>"
									+ "<img src='"+pingjiaUrl+"' width='77' height='35' alt='' /></td>" + "</tr>";
								}
							}
							else{
								if (i % 2 == 0) {
									hang += "<tr class='trColor'>"+ "<td align='center'><img src='"+ myCourse[i].pic+ "' width='71' height='71' alt='' /></td>"
									+ "<td><a href='"+ baseurl+ "/mta/F010/CourseInfo.html?uuid="+ myCourse[i].uuid+ "' target='_blank'>"+ myCourse[i].courseName+ "</a></td>"
									+ "<td align='center'>"+ myCourse[i].classifyName+ "</td>"
									+ "<td align='center'>"+ myCourse[i].beginTm+ "</td>"
									+ "<td align='center'>"+ myCourse[i].endTm+ "</td>"
									+ "<td align='center'>"+ myCourse[i].credit+ "</td>"
									+ "<td align='center'><img src='../../resources/mta/images/icon_studyFinish.png' width='77' height='35' alt='' />"
									+ "<img src='"+pingjiaUrl+"' width='77' height='35' alt='' /></td>" + "</tr>";
								} else {
									hang += "<tr>" + "<td align='center'><img src='"+ myCourse[i].pic+ "' width='71' height='71' alt='' /></td>"
									+ "<td><a href='"+ baseurl+ "/mta/F010/CourseInfo.html?uuid="+ myCourse[i].uuid+ "' target='_blank'>"+ myCourse[i].courseName+ "</a></td>"
									+ "<td align='center'>"+ myCourse[i].classifyName+ "</td>"
									+ "<td align='center'>"+ myCourse[i].beginTm+ "</td>"
									+ "<td align='center'>"+ myCourse[i].endTm+ "</td>"
									+ "<td align='center'>"+ myCourse[i].credit+ "</td>"
									+ "<td align='center'><img src='../../resources/mta/images/icon_studyFinish.png' width='77' height='35' alt='' />"
									+ "<img src='"+pingjiaUrl+"' width='77' height='35' alt='' /></td>" + "</tr>";
								}
							}

						}
						$("#courseList tbody").append(hang);
					}
				}
			});
}
// 课程数据翻页方法
function getMyCourse(pageNo) {
	if (queryDate.page != pageNo) {
		// 设置页码
		queryDate.page = pageNo;
		$.ajax({
			url : 'findMyCourse.html',
			data : queryDate,
			type : 'post',
			dataType : 'json',
			success : function(result) {
				var myCourse = result.rows;
				var nowDate = result.nowDate;
				$("#courseList tbody").empty();
				var pingjiaUrl='';
				var xuexiImg='';
				for ( var i in myCourse) {
					if (myCourse[i].pic == ''|| myCourse[i].pic == null) {
						myCourse[i].pic = '../../resources/mta/images/pic01new.png';
					}
					if(queryDate.courseType==3){
						xuexiImg='../../resources/mta/images/icon_studyFinish.png';
					}
					if(queryDate.courseType!=3){
						xuexiImg='../../resources/mta/images/icon_study.png';
					}
					if(myCourse[i].appraiseid==0){
						pingjiaUrl='../../resources/mta/images/icon_pingjia.png';
						var hang = "";
						if (nowDate < myCourse[i].endTm){
							if (i % 2 == 0) {
								hang += "<tr class='trColor'>"+ "<td align='center'><img src='"+ myCourse[i].pic+ "' width='71' height='71' alt='' /></td>"
								+ "<td><a href='"+ baseurl+ "/mta/F010/CourseInfo.html?uuid="+ myCourse[i].uuid+ "' target='_blank'>"+ myCourse[i].courseName+ "</a></td>"
								+ "<td align='center'>"+ myCourse[i].classifyName+ "</td>"
								+ "<td align='center'>"+ myCourse[i].beginTm+ "</td>"
								+ "<td align='center'>"+ myCourse[i].endTm+ "</td>"
								+ "<td align='center'>"+ myCourse[i].credit+ "</td>"
								+ "<td align='center'><a href='"+ baseurl+ "/mta/F010/Courseplay.html?uuid="+ myCourse[i].uuid+ "' target='_blank'><img src='"+xuexiImg+"' width='77' height='35' alt='' /></a>"
								+ "<a onclick=openImageDiv("+ myCourse[i].courseId+ "); href='javascript:void(0);'><img src='"+pingjiaUrl+"' width='77' height='35' alt='' /></a></td>" + "</tr>";
							} else {
								hang += "<tr>" + "<td align='center'><img src='"+ myCourse[i].pic+ "' width='71' height='71' alt='' /></td>"
								+ "<td><a href='"+ baseurl+ "/mta/F010/CourseInfo.html?uuid="+ myCourse[i].uuid+ "' target='_blank'>"+ myCourse[i].courseName+ "</a></td>"
								+ "<td align='center'>"+ myCourse[i].classifyName+ "</td>"
								+ "<td align='center'>"+ myCourse[i].beginTm+ "</td>"
								+ "<td align='center'>"+ myCourse[i].endTm+ "</td>"
								+ "<td align='center'>"+ myCourse[i].credit+ "</td>"
								+ "<td align='center'><a href='"+ baseurl+ "/mta/F010/Courseplay.html?uuid="+ myCourse[i].uuid+ "' target='_blank'><img src='"+xuexiImg+"' width='77' height='35' alt='' /></a>"
								+ "<a onclick=openImageDiv("+ myCourse[i].courseId+ "); href='javascript:void(0);'><img src='"+pingjiaUrl+"' width='77' height='35' alt='' /></a></td>" + "</tr>";
							}
						}
						else{
							if (i % 2 == 0) {
								hang += "<tr class='trColor'>"+ "<td align='center'><img src='"+ myCourse[i].pic+ "' width='71' height='71' alt='' /></td>"
								+ "<td><a href='"+ baseurl+ "/mta/F010/CourseInfo.html?uuid="+ myCourse[i].uuid+ "' target='_blank'>"+ myCourse[i].courseName+ "</a></td>"
								+ "<td align='center'>"+ myCourse[i].classifyName+ "</td>"
								+ "<td align='center'>"+ myCourse[i].beginTm+ "</td>"
								+ "<td align='center'>"+ myCourse[i].endTm+ "</td>"
								+ "<td align='center'>"+ myCourse[i].credit+ "</td>"
								+ "<td align='center'><img src='../../resources/mta/images/icon_studyFinish.png' width='77' height='35' alt='' />"
								+ "<a onclick=openImageDiv("+ myCourse[i].courseId+ "); href='javascript:void(0);' ><img src='"+pingjiaUrl+"' width='77' height='35' alt='' /></a></td>" + "</tr>";
							} else {
								hang += "<tr>" + "<td align='center'><img src='"+ myCourse[i].pic+ "' width='71' height='71' alt='' /></td>"
								+ "<td><a href='"+ baseurl+ "/mta/F010/CourseInfo.html?uuid="+ myCourse[i].uuid+ "' target='_blank'>"+ myCourse[i].courseName+ "</a></td>"
								+ "<td align='center'>"+ myCourse[i].classifyName+ "</td>"
								+ "<td align='center'>"+ myCourse[i].beginTm+ "</td>"
								+ "<td align='center'>"+ myCourse[i].endTm+ "</td>"
								+ "<td align='center'>"+ myCourse[i].credit+ "</td>"
								+ "<td align='center'><img src='../../resources/mta/images/icon_studyFinish.png' width='77' height='35' alt='' />"
								+ "<a onclick=openImageDiv("+ myCourse[i].courseId+ "); href='javascript:void(0);' ><img src='"+pingjiaUrl+"' width='77' height='35' alt='' /></a></td>" + "</tr>";
							}
						}
					}
					if(myCourse[i].appraiseid!=0){
						pingjiaUrl='../../resources/mta/images/icon_pingjiaFinish.png';
						myCourse[i].courseId = 0;
						var hang = "";
						if (nowDate < myCourse[i].endTm){
							if (i % 2 == 0) {
								hang += "<tr class='trColor'>"+ "<td align='center'><img src='"+ myCourse[i].pic+ "' width='71' height='71' alt='' /></td>"
								+ "<td><a href='"+ baseurl+ "/mta/F010/CourseInfo.html?uuid="+ myCourse[i].uuid+ "' target='_blank'>"+ myCourse[i].courseName+ "</a></td>"
								+ "<td align='center'>"+ myCourse[i].classifyName+ "</td>"
								+ "<td align='center'>"+ myCourse[i].beginTm+ "</td>"
								+ "<td align='center'>"+ myCourse[i].endTm+ "</td>"
								+ "<td align='center'>"+ myCourse[i].credit+ "</td>"
								+ "<td align='center'><a href='"+ baseurl+ "/mta/F010/Courseplay.html?uuid="+ myCourse[i].uuid+ "' target='_blank'><img src='"+xuexiImg+"' width='77' height='35' alt='' /></a>"
								+ "<img src='"+pingjiaUrl+"' width='77' height='35' alt='' /></td>" + "</tr>";
							} else {
								hang += "<tr>" + "<td align='center'><img src='"+ myCourse[i].pic+ "' width='71' height='71' alt='' /></td>"
								+ "<td><a href='"+ baseurl+ "/mta/F010/CourseInfo.html?uuid="+ myCourse[i].uuid+ "' target='_blank'>"+ myCourse[i].courseName+ "</a></td>"
								+ "<td align='center'>"+ myCourse[i].classifyName+ "</td>"
								+ "<td align='center'>"+ myCourse[i].beginTm+ "</td>"
								+ "<td align='center'>"+ myCourse[i].endTm+ "</td>"
								+ "<td align='center'>"+ myCourse[i].credit+ "</td>"
								+ "<td align='center'><a href='"+ baseurl+ "/mta/F010/Courseplay.html?uuid="+ myCourse[i].uuid+ "' target='_blank'><img src='"+xuexiImg+"' width='77' height='35' alt='' /></a>"
								+ "<img src='"+pingjiaUrl+"' width='77' height='35' alt='' /></td>" + "</tr>";
							}
						}
						else{
							if (i % 2 == 0) {
								hang += "<tr class='trColor'>"+ "<td align='center'><img src='"+ myCourse[i].pic+ "' width='71' height='71' alt='' /></td>"
								+ "<td><a href='"+ baseurl+ "/mta/F010/CourseInfo.html?uuid="+ myCourse[i].uuid+ "' target='_blank'>"+ myCourse[i].courseName+ "</a></td>"
								+ "<td align='center'>"+ myCourse[i].classifyName+ "</td>"
								+ "<td align='center'>"+ myCourse[i].beginTm+ "</td>"
								+ "<td align='center'>"+ myCourse[i].endTm+ "</td>"
								+ "<td align='center'>"+ myCourse[i].credit+ "</td>"
								+ "<td align='center'><img src='../../resources/mta/images/icon_studyFinish.png' width='77' height='35' alt='' />"
								+ "<img src='"+pingjiaUrl+"' width='77' height='35' alt='' /></td>" + "</tr>";
							} else {
								hang += "<tr>" + "<td align='center'><img src='"+ myCourse[i].pic+ "' width='71' height='71' alt='' /></td>"
								+ "<td><a href='"+ baseurl+ "/mta/F010/CourseInfo.html?uuid="+ myCourse[i].uuid+ "' target='_blank'>"+ myCourse[i].courseName+ "</a></td>"
								+ "<td align='center'>"+ myCourse[i].classifyName+ "</td>"
								+ "<td align='center'>"+ myCourse[i].beginTm+ "</td>"
								+ "<td align='center'>"+ myCourse[i].endTm+ "</td>"
								+ "<td align='center'>"+ myCourse[i].credit+ "</td>"
								+ "<td align='center'><img src='../../resources/mta/images/icon_studyFinish.png' width='77' height='35' alt='' />"
								+ "<img src='"+pingjiaUrl+"' width='77' height='35' alt='' /></td>" + "</tr>";
							}
						}
					}
					$("#courseList tbody").append(hang);
				}
			}
		});
	}
}
function find() {
	var name = $("#name").val();
	$.post("findName.html", {
		name : name
	}, function() {
	});
}
function createMyPage(total) {
	coursePage.initPage(total);
}
//打开我的评价 窗口
function openImageDiv(courseId) {
	if (courseId =='0'){
		return;
	}
	$("#courseIdPingjia").val(courseId);
	$('.theme-popover-mask').fadeIn(100);
	$('.theme-popover').slideDown(200);
}
//关闭我的评价窗口
function closeImageDiv() {
	$('.theme-popover-mask').fadeOut(100);
	$('.theme-popover').slideUp(200);
}
// 保存“我的评价”
function saveTheAppraise() {
	if (coursePingjia == 2) {
		alert("请选择评级！");
		return;
	}
	var courseId = $("#courseIdPingjia").val();
	var textarea = $("#textarea").val();
	$.post("courPingjia.html", {
		courseId : courseId,
		appraise : coursePingjia,
		content : textarea
	}, function(data) {
		if (data > 0) {
			alert("评价成功！");
			$("#textarea").val("");
			$('.theme-popover-mask').fadeOut(100);
			$('.theme-popover').slideUp(200);
			initMyCourse();
		}else if (data<0){
			alert("已评价！");
			return;
		}
	});
}
function cancel() {
	$('.theme-popover-mask').fadeOut(100);
	$('.theme-popover').slideUp(200);
}