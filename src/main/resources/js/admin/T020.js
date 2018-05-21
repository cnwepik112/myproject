$(function() {
	$('#importQsnForm').form({
		url : baseUrl + "/admin/T020/addQsnByImport.html",
		onSubmit : function() {
			
			var file = $("#filePath").filebox("getValue");
			var extname = validateFileType(file);
			
			if (!extname) {
				msgShow("<span style='color:red;'>请选择Excel或Word文件!</span>");
				return false;
			}
			if($('#importQsnForm').form("validate")){
				$.messager.progress({
					msg:'正在上传，请稍后...',text:'loading'});
			}
			return $('#importQsnForm').form("validate");
		},
		success : function(data) {
			$.messager.progress('close');
			var jsonData = eval('(' + data + ')');
			if (jsonData.error != -1) {
				$('#filePath').filebox('clear');
				var sumRes=jsonData.radioRes.res+jsonData.judgeRes.res+jsonData.readRes.res+jsonData.jiandaRes.res+jsonData.tiankongRes.res+jsonData.selectRes.res;
				$("#resNum").html(sumRes + "条记录，其中：单选题"+jsonData.radioRes.res+"条。不定项选择题"+jsonData.selectRes.res+"条。判断题"+jsonData.judgeRes.res+"条。填空题"+jsonData.tiankongRes.res+"条。简答题"+jsonData.jiandaRes.res+"条。阅读理解题"+jsonData.readRes.res+"条。");
				var radioRowError=jsonData.radioRes.rowError;
				var judgeRowError=jsonData.judgeRes.rowError;
				var readRowError=jsonData.readRes.rowError;
				var jiandaRowError=jsonData.jiandaRes.rowError;
				var tiankongRowError=jsonData.tiankongRes.rowError;
				var selectRowError=jsonData.selectRes.rowError;
				var sumErrorNum=radioRowError.length+judgeRowError.length+readRowError.length+jiandaRowError.length+tiankongRowError.length
				+selectRowError.length;
				var errorHtml=sumErrorNum+"条记录。";
				var errorRowHtml="";
				if(radioRowError.length>0){
					errorHtml+="单选题"+radioRowError.length+"条。";
					for(var i=0;i<radioRowError.length;i++){
						errorRowHtml+="<br/>单选题第<span style='color:red'>"+radioRowError[i].errorNum+"</span>题：";
						errorRowHtml+="<span style='color:red'>"+radioRowError[i].errorMsg+"</span>";
					}
				}
				if(selectRowError.length>0){
					errorHtml+="不定项选择题"+selectRowError.length+"条。";
					for(var i=0;i<selectRowError.length;i++){
						errorRowHtml+="<br/>不定项选择题第<span style='color:red'>"+selectRowError[i].errorNum+"</span>题：";
						errorRowHtml+="<span style='color:red'>"+selectRowError[i].errorMsg+"</span>";
					}
				}
				if(judgeRowError.length>0){
					errorHtml+="判断题"+judgeRowError.length+"条。";
					for(var i=0;i<judgeRowError.length;i++){
						errorRowHtml+="<br/>判断题第<span style='color:red'>"+judgeRowError[i].errorNum+"</span>题：";
						errorRowHtml+="<span style='color:red'>"+judgeRowError[i].errorMsg+"</span>";
					}
				}
				if(tiankongRowError.length>0){
					errorHtml+="填空题"+tiankongRowError.length+"条。";
					for(var i=0;i<tiankongRowError.length;i++){
						errorRowHtml+="<br/>填空题第<span style='color:red'>"+tiankongRowError[i].errorNum+"</span>题：";
						errorRowHtml+="<span style='color:red'>"+tiankongRowError[i].errorMsg+"</span>";
					}
				}
				if(jiandaRowError.length>0){
					errorHtml+="简答题"+jiandaRowError.length+"条。";
					for(var i=0;i<jiandaRowError.length;i++){
						errorRowHtml+="<br/>简答题第<span style='color:red'>"+jiandaRowError[i].errorNum+"</span>题：";
						errorRowHtml+="<span style='color:red'>"+jiandaRowError[i].errorMsg+"</span>";
					}
				}
				if(readRowError.length>0){
					errorHtml+="阅读理解题"+readRowError.length+"条。";
					for(var i=0;i<readRowError.length;i++){
						errorRowHtml+="<br/>阅读理解题第<span style='color:red'>"+readRowError[i].errorNum+"</span>题：";
						errorRowHtml+="<span style='color:red'>"+readRowError[i].errorMsg+"</span>";
					}
				}
				$("#rowerror").html(errorHtml+errorRowHtml);
			} else {
				msgShow("<span style='color:red'>上传失败，请稍后重试！</span>");
			}

		}
	});
	// 初始化试题分类
	$('#qsnclassify').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		url : baseUrl + '/admin/B010/findQsnClassify.html',
		required : true,
		cascadeCheck : false
	});
	// 初始化试题难度
	$('#qsnlevel').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		url : baseUrl + '/admin/B010/findQsnLevel.html',
		required : true,
		cascadeCheck : false
	});
	// 初始化试题知识点
	$('#qsnknowledge').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		url : baseUrl + '/admin/B010/findQsnKnowledge.html',
		required : true,
		cascadeCheck : false
	});
});

function qsnFormSubmit() {
	$('#importQsnForm').submit();
	
	return false;
}
/**
 * 验证文件类型
 * @param fileName
 * @returns {Boolean}
 */
function validateFileType(fileName){

	//获取文件的扩展名
	var dotNdx = fileName.lastIndexOf('.');

	//扩展名变成小写
	var exetendName = fileName.slice(dotNdx + 1).toLowerCase();
	//定义返回值
	var checkType=false;
	//判断类型
	if(exetendName == "xls" || exetendName =="xlsx"){
		checkType=true;
	}
	if(exetendName == "doc" || exetendName =="docx"){
		checkType=true;
	}
	//返回文件类型的验证值
	return checkType;
}