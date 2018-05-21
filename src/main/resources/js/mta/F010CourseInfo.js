/**
 * @author M GL
 * 
 * @date 2015-8-5
 */
$(function() {

	if (errorMsg != '') {
		alert(errorMsg);
	}

	if (appraise <= 60) {
		if (40 < appraise) {
			$("#appraise_img").attr("src",
					"resources/mta/images/star_pic03.png");
		} else if (appraise <= 20) {
			$("#appraise_img").attr("src",
					"resources/mta/images/star_pic01.png");
		} else {
			$("#appraise_img").attr("src",
					"resources/mta/images/star_pic02.png");
		}
	} else if (80 < appraise) {
		$("#appraise_img").attr("src", "resources/mta/images/star_pic05.png");
	} else {
		$("#appraise_img").attr("src", "resources/mta/images/star_pic04.png");
	}

	$(".mainNavi ul li").bind("click", function() {
				$(this).addClass("selected").siblings().removeClass("selected");
				var index = $(".mainNavi ul li").index($(this));
				$("#content > div").eq(index).show().siblings().hide();
			});

	uuid = GetRequest().uuid;
	$.ajax({
		url : 'mta/F010/getChapterInfo.html',
		dataType : 'json',
		data : {
			"uuid" : uuid,
			"rows" : 20
		},
		async : false,
		type : 'post',
		success : function(result) {
			var chapterInfo = result.chapterInfo;
			$("#chapterInfo tbody").empty();
			if (result.progres != null) {
				var theadHtml = "<tr>" + "<th width='290'>章节名称</th>"
						+ "<th width='250'>课件名称</th>"
						+ "<th width='150'>分类</th>" + "<th width='100'>时长</th>"
						+ "<th width='290'>进度</th>" + "</tr>";
				$("#chapterInfo thead").empty();
				$("#chapterInfo thead").append(theadHtml);
				var progres = eval("(" + result.progres + ")");
				for (var i in chapterInfo) {
					var sumTimeLength = 0;
					var chapter = chapterInfo[i];
					var chapterHtml = "<tr><td><strong>第"
							+ parseInt(parseInt(i) + 1)
							+ "章 &nbsp;&nbsp;"
							+ chapter.chapterName
							+ "</strong></td>"
							+ "<td>&nbsp;</td><td>&nbsp;</td><td id='sumtl_"
							+ i
							+ "'></td>"
							+ "<td><div id='chapter_"
							+ i
							+ "' class='js-chapter' style='width:252px;height:24px'></div></td></tr>";
					$("#chapterInfo tbody").append(chapterHtml);
					var chapterPro = 0;
					var section = chapter.section;
					for (var y in section) {
						var sectionTimeLength = 0;
						var sectionHtml = "<tr><td><span>第"
								+ parseInt(parseInt(y) + 1)
								+ "节</span>&nbsp;&nbsp;"
								+ section[y].sectionName
								+ "</td>"
								+ "<td></td><td></td><td id='section_tl_"
								+ i
								+ "_"
								+ y
								+ "'></td>"
								+ "<td><div id='section_"
								+ i
								+ "_"
								+ y
								+ "' class='js-progressbar js-section' style='width:252px;height:24px'></div></td></tr>";
						$("#chapterInfo tbody").append(sectionHtml);
						var kejian = section[y].kejian;
						var sectionPro = 0;
						for (var x in kejian) {
							var kejianHtml = "<tr><td></td><td>"
									+ kejian[x].name
									+ "</td>"
									+ "<td>"
									+ kejian[x].classifyName
									+ "</td><td>"
									+ (kejian[x].timeLength).toFixed(2)
									+ "分钟</td>"
									+ "<td><div class='js-progressbar js-section' data-options='value:"
									+ progres[kejian[x].coursewareId]
									+ "' style='width:252px;height:24px'></div></td>"
									+ "</tr>";
							$("#chapterInfo tbody").append(kejianHtml);
							sectionPro += parseInt(progres[kejian[x].coursewareId]);
							sectionTimeLength += kejian[x].timeLength;
						}
						sectionPro = (sectionPro / kejian.length).toFixed(2);
						$("#section_" + i + "_" + y).progressbar({
									value : sectionPro
								});
						$("#section_tl_" + i + "_" + y).html(""
								+ sectionTimeLength.toFixed(2) + "分钟");
						chapterPro += sectionPro;
						sumTimeLength += sectionTimeLength;
					}
					chapterPro = chapterPro / section.length;
					$("#chapter_" + i).progressbar({
								value : chapterPro
							});
					$("#sumtl_" + i).html("<strong >"
							+ sumTimeLength.toFixed(2) + "分钟</strong>");
				}
			} else {
				var theadHtml = "<tr>" + "<th width='350'>章节名称</th>"
						+ "<th width='310'>课件名称</th>"
						+ "<th width='210'>分类</th>" + "<th width='160'>时长</th>"
						+ "</tr>";
				$("#chapterInfo thead").empty();
				$("#chapterInfo thead").append(theadHtml);
				for (var i in chapterInfo) {
					var sumTimeLength = 0;
					var chapter = chapterInfo[i];
					var chapterHtml = "<tr><td><strong>第"
							+ parseInt(parseInt(i) + 1) + "章 &nbsp;&nbsp;"
							+ chapter.chapterName + "</strong></td>"
							+ "<td>&nbsp;</td><td>&nbsp;</td><td id='sumtl_"
							+ i + "'></td>" + "</tr>";
					$("#chapterInfo tbody").append(chapterHtml);
					var section = chapter.section;
					for (var y in section) {
						var sectionTimeLength = 0;
						var sectionHtml = "<tr><td><span>第"
								+ parseInt(parseInt(y) + 1)
								+ "节</span>&nbsp;&nbsp;"
								+ section[y].sectionName + "</td>"
								+ "<td></td><td></td><td id='section_tl_" + i
								+ "_" + y + "'></td></tr>";
						$("#chapterInfo tbody").append(sectionHtml);
						var kejian = section[y].kejian;
						for (var x in kejian) {
							var kejianHtml = "<tr><td></td><td>"
									+ kejian[x].name + "</td>" + "<td>"
									+ kejian[x].classifyName + "</td><td>"
									+ (kejian[x].timeLength).toFixed(2)
									+ "分钟</td></tr>";
							$("#chapterInfo tbody").append(kejianHtml);
							sectionTimeLength += kejian[x].timeLength;
						}
						$("#section_tl_" + i + "_" + y).html(""
								+ sectionTimeLength.toFixed(2) + "分钟");
						sumTimeLength += sectionTimeLength;
					}
					$("#sumtl_" + i).html("<strong >"
							+ sumTimeLength.toFixed(2) + "分钟</strong>");
				}

			}
		}
	});
	// 批量渲染課件進度條
	$(".js-progressbar").progressbar();

	// 加載課程評價
	getAppraise();
	// 加載課程筆記
	getNote();

	getAskqa();

	getAnnex();

	getExam();
});
var appraisePage;
// 獲取url參數
function GetRequest() {
	
	var url = location.search; // 获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		var strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
		}
	}
	return theRequest;
}
// 跳转到课程播放页面
function showCourseplay() {
	// 判断用户是否登录
	$.ajax({
				url : 'mta/F010/getCourseplay.html',
				dataType : 'json',
				data : {},
				async : false,
				type : 'post',
				success : function(result) {
					// session存在
					if (result == 1) {
						window.location.href = baseUrl
								+ '/mta/F010/Courseplay.html?uuid=' + uuid;
					} else {
						showLogin();
					}
				}
			});
}

// 獲取課程評價
function getAppraise() {
	// 声明分页组件
	appraisePage = myPage("appraisePage");
	// 指定分页事件
	appraisePage.getData = appraiseGetData;
	appraisePage.rows = 10;
	appraiseGetData(appraisePage.pageNum);
	appraisePage.dataTotal = appraiseTotal;
	appraisePage.initPage();
}

function appraiseGetData(page) {
	$.ajax({
		url : 'mta/F010/getAppraise.html',
		dataType : 'json',
		data : {
			uuid : uuid,
			page : page,
			rows : appraisePage.rows
		},
		async : false,
		type : 'post',
		success : function(result) {
			appraiseTotal = result.total;
			var data = result.data;
			for (var i in data) {
				var html = "<div class='pingjia'><div class='pingjiaLeft'>"
						+ "<ul><li><img src='resources/mta/images/evaluation_pic01.png' width='76' height='76' alt='' /></li></ul></div>"
						+ "<div class='pingjiaRight'><dl><dt>"
						+ data[i].userName+ "</dt>";
				if (data[i].appraise == 1) {
					html += "<dt>好评<span><img src='resources/mta/images/star_pic03.png' alt='' /></span></dt>";
				} else if (data[i].appraise == 0) {
					html += "<dt>中评<span><img src='resources/mta/images/star_pic02.png' alt='' /></span></dt>";
				} else {
					html += "<dt>差评<span><img src='resources/mta/images/star_pic01.png' alt='' /></span></dt>";
				}
				html += "<dd>" + data[i].dateApp + " 评价</dd></dl><ul><li>"
						+ data[i].content + "</li>";
				if (data[i].interpretation != null) {
					html += "<li><span>回复：</span><dd>回复時間不存在</dd></li>"
							+ "<li>" + data[i].interpretation + "</li>";
				}
				html += "</ul></div></div>";

				$("#appraise").append(html);
			}
		}
	});
}
var notesPage;
function getNote() {
	// 声明分页组件
	notesPage = myPage("notesPage");
	// 指定分页事件
	notesPage.getData = noteGetData;
	notesPage.rows = 10;
	noteGetData(notesPage.pageNum);
	notesPage.dataTotal = notesTotal;
	notesPage.initPage();
}

function noteGetData(page) {
	$.ajax({
		url : 'mta/F010/getNote.html',
		dataType : 'json',
		data : {
			uuid : uuid,
			page : page,
			rows : notesPage.rows
		},
		async : false,
		type : 'post',
		success : function(result) {
			notesTotal = result.total;
			var data = result.data;
			$("#notes").empty();
			for (var i in data) {
				var html = "<div class='movenotes'><dl><dt>"
						+ "<img src='resources/mta/images/notes_pic01.png' width='99' height='99' alt='' /></dt><dd>"
						+ "<span>" + data[i].title + "</span><dd>";
				html += "<dd>" + data[i].content + "</dd><dd>"
						+ data[i].insDate + "</dd></dl>";
				// html += "<ul><li><img
				// src='resources/mta/images/ask_icon03.png' width='69'
				// height='30' /></li></ul>";
				html += "</div>";

				$("#notes").append(html);
			}
		}
	});
}
var askqaPage;
function getAskqa() {
	// 声明分页组件
	askqaPage = myPage("askqaPage");
	// 指定分页事件
	askqaPage.getData = askGetData;
	askqaPage.rows = 10;
	askGetData(askqaPage.pageNum);
	askqaPage.dataTotal = askTotal;
	askqaPage.initPage();
}

function addHfDiv(obj) {
	$(".askhf").remove();
	upid = $(obj).val();
	var html = "<div class='askhf'><dl><dt><textarea name='' cols='' rows='' id='messageLi'></textarea></dt>"
			+ "<dd><a onclick='saveAnswer()'><img src='resources/mta/images/ask_icon06.png' width='69' height='30' /></a></dd></dl></div>";
	var v = $(obj).parents(".askq");
	$(v).after(html);
}

function askGetData(page) {
	$.ajax({
		url : 'mta/F010/getAskqa.html',
		dataType : 'json',
		data : {
			uuid : uuid,
			page : page,
			rows : askqaPage.rows
		},
		async : false,
		type : 'post',
		success : function(result) {
			$("#askqa").empty();
			var ask = result.ask;
			askTotal = result.total;
			var answerMap = result.answer;
			for (var i in ask) {
				var wAp = ask[i].wAp;
				var appStatus = ask[i].appStatus;
				var html = "<div class='askq'><dl><dt><img src='resources/mta/images/q.png' width='36' height='40' /></dt>"
						+ "<dd class='js-showAnswer'><span>"
						+ ask[i].title
						+ "</span></dd>"
						+ "<dd>内容："
						+ ask[i].wCon
						+ "</dd>"
						+ "<dd>提问者："
						+ ask[i].wUname
						+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;提问时间："
						+ ask[i].wTime
						+ "</dd></dl>"
						+ "<ul><li onclick='addHfDiv(this)' value='"
						+ ask[i].wId + "'>";
				if (ask[i].dStatus == 1 && wAp != 1) {
					html += "<img src='resources/mta/images/ask_icon01.png' width='69' height='30' />";
				}
				html += "</li></ul></div>";

				$("#askqa").append(html);

				var answer = answerMap[ask[i].wId];
				var html = "<div class='js-answer'>";
				for (var y in answer) {
					html += "<div class='aska' style='clear:both;'><dl><dt><img src='resources/mta/images/a.png' width='36' height='40' /></dt>"
							+ "<dd>回答者："
							+ answer[y].dUserName
							+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;回答时间："
							+ answer[y].dTime
							+ "</dd>"
							+ "<dd class='js-content'>回答内容："
							+ answer[y].dCon
							+ "</dd></dl><ul>";
					if (answer[y].editStatus == 1) {
						html += "<li onclick='editAnswer(this,"
								+ answer[y].dId
								+ ")'><img src='resources/mta/images/ask_icon02.png' width='69' height='30' /></li>"
								+ "<li onclick='delAnswer("
								+ answer[y].dId
								+ ")'><img src='resources/mta/images/ask_icon03.png' width='69' height='30' /></li>";
					}
					if (appStatus == 1 && wAp != 1) {
						html += "<li><img src='resources/mta/images/ask_icon05.png' width='69' height='30' /></li>";
					}
					html += "</ul></div>";
				}
				html += "</div>";
				$("#askqa").append(html);

			}
			$(".js-answer").attr("style", "display:none;");
			$(".js-showAnswer").click(function() {
				$(this).parents("div").next(".js-answer").slideToggle("normal");
			});

			// var qId = 0;
			// for(var i=0;i<result.length;i++){
			// if(qId != result[i].wId){
			// qId = result[i].wId;
			// var html = "<div class='askq'><dl><dt><img
			// src='resources/mta/images/q.png' width='36' height='40' /></dt>"
			// +
			// "<dd><span>"+ result[i].title +"</span></dd>" +
			// "<dd>内容："+ result[i].wCon +"</dd>" +
			// "<dd>提问者："+ result[i].wUname
			// +"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;提问时间："+ result[i].wTime
			// +"</dd></dl>" +
			// "<ul><li onclick='addHfDiv(this)'>";
			// if(result[i].dStatus == 1 && result[i].wAp != 1){
			// html += "<img src='resources/mta/images/ask_icon01.png'
			// width='69' height='30' />";
			// }
			// html += "</li></ul></div>";
			//					
			// $("#askqa").append(html);
			// //輸出本條記錄的回答
			// if(result[i].dUserName != null){
			// var html = "<div class='aska'><dl><dt><img
			// src='resources/mta/images/a.png' width='36' height='40' /></dt>"
			// +
			// "<dd>回答者："+ result[i].dUserName
			// +"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;回答时间："+ result[i].dTime
			// +"</dd>" +
			// "<dd>回答内容："+ result[i].dCon +"</dd></dl><ul>";
			// if(result[i].editStatus == 1){
			// html += "<li><img src='resources/mta/images/ask_icon02.png'
			// width='69' height='30' /></li>" +
			// "<li><img src='resources/mta/images/ask_icon03.png' width='69'
			// height='30' /></li>";
			// }
			// if(result[i].appStatus == 1 && result[i].wAp != 1){
			// html += "<li><img src='resources/mta/images/ask_icon05.png'
			// width='69' height='30' /></li>";
			// }
			// html += "</ul></div>";
			// $("#askqa").append(html);
			// }
			// }else{
			//
			// var html = "<div class='aska'><dl><dt><img
			// src='resources/mta/images/a.png' width='36' height='40' /></dt>"
			// +
			// "<dd>回答者："+ result[i].dUserName
			// +"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;回答时间："+ result[i].dTime
			// +"</dd>" +
			// "<dd>回答内容："+ result[i].dCon +"</dd></dl><ul>";
			// if(result[i].editStatus == 1){
			// html += "<li><img src='resources/mta/images/ask_icon02.png'
			// width='69' height='30' /></li>" +
			// "<li><img src='resources/mta/images/ask_icon03.png' width='69'
			// height='30' /></li>";
			// }
			// if(result[i].appStatus == 1 && result[i].wAp != 1){
			// html += "<li><img src='resources/mta/images/ask_icon05.png'
			// width='69' height='30' /></li>";
			// }
			// html += "</ul></div>";
			// $("#askqa").append(html);
			// }
			// }
		}
	});
}
var annexPage;
function getAnnex() {
	// 声明分页组件
	annexPage = myPage("annexPage");
	// 指定分页事件
	annexPage.getData = annexGetData;
	annexPage.rows = 10;
	annexGetData(annexPage.pageNum);
	annexPage.dataTotal = annexTotal;
	annexPage.initPage();
}
// 课程的课件列表
function annexGetData(page) {
	$.ajax({
		url : 'mta/F010/getAnnex.html',
		dataType : 'json',
		data : {
			uuid : uuid,
			page : page,
			rows : annexPage.rows
		},
		async : false,
		type : 'post',
		success : function(result) {
			$("#annexTable tbody tr").remove();
			$("#annexTable thead tr").remove();
			var dwStatus = result.dwStatus;
			var trlist = result.resultList;
			annexTotal = trlist.length;
			if (dwStatus == 0) {
				var thHtml = "<tr><th width='50'>类型</th><th width='830'>课件名称</th><th width='120'>上传时间</th></tr>";
				$("#annexTable thead").append(thHtml);
				for (var i in trlist) {
					var html = "<tr><td width='50'>";
					switch (trlist[i].type) {
						case 0 :
							html += "<img src='resources/images/icon/icon_other.png' width='37' height='34' />";
							break;
						case 1 :
							html += "<img src='resources/images/icon/icon_pic.png' width='37' height='34' />";
							break;
						case 2 :
							html += "<img src='resources/images/icon/icon_pdf.png' width='37' height='34' />";
							break;
						case 3 :
							html += "<img src='resources/images/icon/icon_word.png' width='37' height='34' />";
							break;
						case 4 :
							html += "<img src='resources/images/icon/icon_excel.png' width='37' height='34' />";
							break;
						case 5 :
							html += "<img src='resources/images/icon/icon_other.png' width='37' height='34' />";
							break;
					}
					html += "</td><td width='450'>" + trlist[i].name + "</td>"
							+ "<td>" + trlist[i].updDate + "</td></tr>";
					$("#annexTable tbody").append(html);
				}
			} else {
				var thHtml = "<tr><th width='50'>类型</th><th width='830'>课件名称</th><th width='120'>上传时间</th><th width='100'>下载</th></tr>";
				$("#annexTable thead").append(thHtml);
				for (var i in trlist) {
					var html = "<tr><td width='50'>";
					switch (trlist[i].type) {
						case 0 :
							html += "<img src='resources/images/icon/icon_other.png' width='37' height='34' />";
							break;
						case 1 :
							html += "<img src='resources/images/icon/icon_pic.png' width='37' height='34' />";
							break;
						case 2 :
							html += "<img src='resources/images/icon/icon_pdf.png' width='37' height='34' />";
							break;
						case 3 :
							html += "<img src='resources/images/icon/icon_word.png' width='37' height='34' />";
							break;
						case 4 :
							html += "<img src='resources/images/icon/icon_excel.png' width='37' height='34' />";
							break;
						case 5 :
							html += "<img src='resources/images/icon/icon_other.png' width='37' height='34' />";
							break;
					}
					html += "</td><td width='450'>"
							+ trlist[i].name
							+ "</td>"
							+ "<td>"
							+ trlist[i].updDate
							+ "</td>"
							+ "<td><a href='"
							+ trlist[i].content
							+ "'><img src='resources/mta/images/download.png' width='90' height='33' /></a></td></tr>";
					$("#annexTable tbody").append(html);
				}
			}
		}
	});
}
// 课程测试
function getExam() {

	$.ajax({
		url : 'mta/F010/getExam.html',
		dataType : 'json',
		data : {
			uuid : uuid
		},
		async : false,
		type : 'post',
		success : function(result) {
			if (result != null && result != '') {
				var examData = eval("(" + result.kaoshiJson + ")");
				var html = "<dl><dt>"
						+ "<img src='resources/mta/images/exam_pic02.jpg' width='248' height='168' /></dt>"
						+ "<dd>考试名称：" + examData.examName + "</dd>" + "<dd>总分："
						+ examData.totalScore + "</dd>" + "<dd>及格分："
						+ examData.okrate + "</dd>" + "<dd>考试模式：";
				if (examData.pageSize == 0) {
					html += "整卷模式";
				} else {
					html += "逐题模式";
				}

				html += "</dd>"
						+ "<dd>考试时长："
						+ examData.totalTm
						+ " 分钟</dd>"
						+ "</dl>";
				if(result.state==1||result.state==3||result.state==5){
					//1:已学完,3：已考试;5考试中
					html += "<ul>"
					+ "<li><a onclick='showExam()' href='javascript:void(0);'><img src='resources/mta/images/exam_icon02.png' width='90' height='33' /></a></li>"
					+ "</ul>";
				}
				$("#exam").html(html);
			}
		}
	});
}

// 判断用户是否登录,是就跳转到考试
function showExam() {
	// 判断用户是否登录
	$.ajax({
				url : 'mta/F010/getCourseplay.html',
				dataType : 'json',
				data : {},
				async : false,
				type : 'post',
				success : function(result) {
					// session存在
					if (result == 1) {
						window.location.href = baseUrl
								+ '/mta/F020/getCourseExamInfo.html?kcUuid='
								+ uuid;
					} else {
						showLogin();
					}
				}
			});
}

function showTiwen() {
	$("#askTitle").val("");
	$("#textarea").val("");
	$("#tiwenDiv").show();
}

function saveAsk() {
	var title = $("#askTitle").val();
	var content = $("#textarea").val();
	if (title == '') {
		alert("标题不能为空！");
		return;
	}
	$.ajax({
				url : 'mta/F010/saveAsk.html',
				dataType : 'json',
				data : {
					uuid : uuid,
					'title' : title,
					'content' : content
				},
				type : 'post',
				success : function(result) {
					$("#tiwenDiv").hide();
					getAskqa();
				}
			});
}

function hideAsk() {
	$("#tiwenDiv").hide();
}

function saveAnswer() {
	var content = $("#messageLi").val();
	if (content == '') {
		alert("内容不能为空！");
		return;
	}
	$.ajax({
				url : 'mta/F010/saveAnswer.html',
				dataType : 'json',
				data : {
					uuid : uuid,
					'upid' : upid,
					'content' : content
				},
				type : 'post',
				success : function(result) {
					// $(".askhf").remove();
					getAskqa();
				}
			});
}

function delAnswer(anId) {
	if (!confirm("确定要删除吗？")) {
		return;
	}
	$.ajax({
				url : 'mta/F040/delAnswer.html',
				dataType : 'json',
				data : {
					id : anId
				},
				type : 'post',
				success : function(result) {
					// $(".askhf").remove();
					getAskqa();
				}
			});
}

function editAnswer(obj, dId) {
	$(".askhf").remove();
	var content = $(obj).parents(".aska").find(".js-content").html();
	var html = "<div class='askhf'><dl><dt><textarea name='' cols='' rows='' id='messageLi'>"
			+ content.substring(5, content.lenght)
			+ "</textarea></dt>"
			+ "<dd><a onclick='updateAnswer("
			+ dId
			+ ")'><img src='resources/mta/images/ask_icon06.png' width='69' height='30' /></a></dd>"
			+ "<dd><a onclick='cancelAnswer(this)'><img src='resources/mta/images/ask_icon07.png' width='69' height='30' /></a></dd>"
			+ "</dl></div>";
	$(obj).parents(".aska").after(html);
	objHtml = $(obj).parents(".aska").prop("outerHTML");;
	$(obj).parents(".aska").remove();
}

function cancelAnswer(obj) {
	$(obj).parents(".askhf").after(objHtml);
	$(obj).parents(".askhf").remove();
}

function updateAnswer(dId) {
	var content = $("#messageLi").val();
	if (content == '') {
		alert("内容不能为空！");
		return;
	}
	$.ajax({
				url : 'mta/F040/updAnswer.html',
				dataType : 'json',
				data : {
					id : dId,
					'content' : content
				},
				type : 'post',
				success : function(result) {
					// $(".askhf").remove();
					getAskqa();
				}
			});
}