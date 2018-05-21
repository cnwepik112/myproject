$(function() {
		$.messager.progress({
			msg:'正在生成试卷，请稍后...',
			text:'loading'
		});
		$('#ff').form({
			url : baseUrl+"/admin/T060/updKaoshiUser.html",
			onSubmit : function() {
				return $('#ff').form("validate");
			},
			success : function(data) {
				if(data > 0){
					window.parent.closeTabByTitle("人工评卷");
					window.parent.openTab("人工评卷", baseUrl+"/admin/T060/evaluationAfter.html?ksid="+data);
					window.parent.closeTabByTitle("人工评分");
				} else {
					msgShow("<span style='color:red'>未知错误！请稍后重试！</span>");
				}
			}
		});  
		$.post(baseUrl+"/admin/T060/findEvaluationUserByParam.html",{id:kd},function(data){
			loadSjDl(data);
		},"json");
});
/**
 * 初始化页面
 * @param data
 */
function loadSjDl(data){
	$("#ksid").val(data.ksid);
	$("#okrate").val(data.okrate);
	/**
	 * 固定题json
	 * [{"tx":"","jiexi":"","sid":"","title":"","fen":"",ksdaan:"","children":{"1":{"ksdaan":"","daan":"","tx":"","title":"","defen":0}}}]
	 * tx:题型1-6 jiexi：答题解析 sid：试题Id title：标题 fen：试题分数 children：子试题（当tx为6即阅读理解题时存在）ksdaan：考生答案
	 * 子试题：1-N：子试题索引 ksdaan：考生答案 daan:答案 tx：题型（如：danxuan） title：标题 defen：得分
	 */
	var gddata=eval("("+data.daandata+")");
	//将原始数据存放hidden域中
	$("#gddata").val(data.daandata);
	
	/**
	 * 随机题json
	 * [{"tx":"","jiexi":"","sid":"","title":"","fen":"",ksdaan:"","children":{"1":{"ksdaan":"","daan":"","tx":"","title":"","defen":0}}}]
	 * tx:题型1-6 jiexi：答题解析 sid：试题Id title：标题 fen：试题分数 children：子试题（当tx为6即阅读理解题时存在）ksdaan：考生答案
	 * 子试题：1-N：子试题索引 ksdaan：考生答案 daan:答案 tx：题型（如：danxuan） title：标题 defen：得分
	 */
	var sjdata=eval("("+data.rdaandata+")");
	//将原始数据存放hidden域中
	$("#sjdata").val(data.rdaandata);
	$("#sorce").val(data.sorce);
	//试题索引
	var qsnIndex=1;
	//考试试卷标题
	$("#sjTitle").html("考试名称："+data.kstitle+"&nbsp;&nbsp;——&nbsp;&nbsp;试卷名称："+data.sjtitle);
	//HTML写入容器
	var C = $("#Container");
	//循环固定试题
	if(typeof(gddata)!="undefined" && gddata!=null){
		for(var i=0;i<gddata.length;i++){
			if(gddata[i].tx=='5' || gddata[i].tx=='6'){
				//如果是简单或者阅读理解组织html写入
				var qsnhtm=loadQsnInfo(qsnIndex,gddata[i],0,i);
				C.append(qsnhtm);
				qsnIndex++;
			}
		}
	}
	//循环随机试题
	if(typeof(sjdata)!="undefined" && sjdata!=null){
		for(var i=0;i<sjdata.length;i++){
			if(sjdata[i].tx=='5' || sjdata[i].tx=='6'){
				//如果是简单或者阅读理解组织html写入
				var qsnhtm=loadQsnInfo(qsnIndex,sjdata[i],1,i);
				C.append(qsnhtm);
				qsnIndex++;
			}
		}
	}
	//获取C下内容长度
	var childDivlength=C.children("div .panel_qsn").length;
	if(childDivlength>0){
		//如果有试题信息 则添加提交按钮
		C.append('<div style="padding:10px;text-align: center;border:0px;margin-bottom: 30px;">'
				+'<a id="manager-save" onclick="subAddForm();" style="width:150px;height:40px;">提交评分</a>'
				+'</div>');
	}
	
	$("#manager-save").linkbutton({
		iconCls : 'icon-save'
	});  
	//数字框
	$(".easyui-numberbox").numberbox({
		onChange:function(newValue,oldValue){
			//获取试题索引
			var index=$(this).attr("index");
			//试题类型
			var sttype=$(this).attr("sttype");
			//该题原始数据数组中的索引
			var dataIndex=$("#data_"+index).attr("dataindex");
			//随机或固定标识 1随机0固定
			var ststate=$("#data_"+index).attr("ststate");
			if(ststate=="0" && sttype=="5"){
				//如果是固定简答题则修改原始数据中的得分及老师评语
				var gdQsndata=eval("("+$("#gddata").val()+")");
				gdQsndata[parseInt(dataIndex)].defen=newValue;
				gdQsndata[parseInt(dataIndex)].tdes=$("#tec_des_"+index).val();
				$("#gddata").val(JSON.stringify(gdQsndata));
			}else if(ststate=="1" && sttype=="5"){
				//如果是随机简答题则修改原始数据中的得分及老师评语
				var sjQsndata=eval("("+$("#sjdata").val()+")");
				sjQsndata[parseInt(dataIndex)].defen=newValue;
				sjQsndata[parseInt(dataIndex)].tdes=$("#tec_des_"+index).val();
				$("#sjdata").val(JSON.stringify(sjQsndata));
			}else if(ststate=="0" && sttype=="6"){
				//如果是固定阅读理解则修改原始数据中的得分及老师评语
				var gdQsndata=eval("("+$("#gddata").val()+")");
				var cindex=$(this).attr("childindex");
				gdQsndata[parseInt(dataIndex)].children[cindex].defen=newValue;
				gdQsndata[parseInt(dataIndex)].children[cindex].tdes=$("#tec_des_"+index+"_"+cindex).val();
				$("#gddata").val(JSON.stringify(gdQsndata));
			}else if(ststate=="1" && sttype=="6"){
				//如果是随机阅读理解则修改原始数据中的得分及老师评语
				var sjQsndata=eval("("+$("#sjdata").val()+")");
				var cindex=$(this).attr("childindex");
				sjQsndata[parseInt(dataIndex)].children[cindex].defen=newValue;
				sjQsndata[parseInt(dataIndex)].children[cindex].tdes=$("#tec_des_"+index+"_"+cindex).val();
				$("#sjdata").val(JSON.stringify(sjQsndata));
			}
		}
	});  
	//当老师评语丢失焦点时
	$(".input_user_info").blur(function(){
		//获取试题索引
		var index=$(this).attr("index");
		//试题类型
		var sttype=$(this).attr("sttype");
		//该题原始数据数组中的索引
		var dataIndex=$("#data_"+index).attr("dataindex");
		//随机或固定标识 1随机0固定
		var ststate=$("#data_"+index).attr("ststate");

		if(ststate=="0" && sttype=="5"){
			//如果是固定简答题则修改原始数据中老师评语
			var gdQsndata=eval("("+$("#gddata").val()+")");
			gdQsndata[parseInt(dataIndex)].tdes=$(this).val();
			$("#gddata").val(JSON.stringify(gdQsndata));
		}else if(ststate=="1" && sttype=="5"){
			//如果是随机简答题则修改原始数据中老师评语
			var sjQsndata=eval("("+$("#sjdata").val()+")");
			sjQsndata[parseInt(dataIndex)].tdes=$(this).val();
			$("#sjdata").val(JSON.stringify(sjQsndata));
		}else if(ststate=="0" && sttype=="6"){
			//如果是固定阅读理解则修改原始数据中老师评语
			var gdQsndata=eval("("+$("#gddata").val()+")");
			var cindex=$(this).attr("childindex");
			gdQsndata[parseInt(dataIndex)].children[cindex].tdes=$(this).val();
			$("#gddata").val(JSON.stringify(gdQsndata));
		}else if(ststate=="1" && sttype=="6"){
			//如果是随机阅读理解题则修改原始数据中老师评语
			var sjQsndata=eval("("+$("#sjdata").val()+")");
			var cindex=$(this).attr("childindex");
			sjQsndata[parseInt(dataIndex)].children[cindex].tdes=$(this).val();
			$("#sjdata").val(JSON.stringify(sjQsndata));
		}
	});
	$.messager.progress('close');
}
//组织试题HTML
function loadQsnInfo(qindex,qsnData,ststate,dataindex){
	var qsnHtml='<div class="panel_qsn" ststate="'+ststate+'">'
					+'<div class="div_left">'
					+	'<span style="font-weight: bold;font-size:20pt !important;">'+qindex+'.</span>'
					+	'<br/>'
					+	'<span style="font-weight: bold;font-size:10pt !important;color:#9cc8f7;">'+qsnData.fen+'分</span>'
					+	'<input type="hidden" ststate="'+ststate+'" dataindex="'+dataindex+'" id="data_'+qindex+'" />'
					+'</div>'
					+'<div class="div_right">'
					+	'<div class="div_qsn_title">'+qsnData.title+'</div>';
	if(qsnData.tx == '5'){
		//简答题
		qsnHtml+='<div class="div_qsn_answer" style="font-size:10pt !important;margin-bottom:20px;">'
					+'<div class="div_qsn_answer_left">考生答案：</div>'
					+'<div class="div_qsn_answer_right"><textarea class="textarea_style" disabled>'+qsnData.ksdaan+'</textarea></div>'
					+'<div class="clear"></div>'
					+'<div class="div_qsn_answer_left">正确答案：</div>'
					+'<div class="div_qsn_answer_right"><textarea class="textarea_style" readonly="readonly">'+qsnData.daan+'</textarea></div>'
					+'<div class=div_fen>该题分数：'+qsnData.fen+'分。考生得分：<input type="text" sttype="5" index="'+qindex+'" class="easyui-numberbox" style="width:50px;height: 30px;" value="" data-options="min:0,precision:1,required: true" validType="jdfen['+qsnData.fen+']"></input></div>'
					+'<div class=div_fen>老师评语：<input type="text" id="tec_des_'+qindex+'" sttype="5" index="'+qindex+'" class="input_user_info" style="width:500px;text-align: left;" ></input></div>'
					+'<div class="clear"></div>'	
				+'</div>';
		
	}else if(qsnData.tx == '6'){
		//阅读理解
		if("children" in qsnData){
			//如果包含子试题
			var childrenData=qsnData.children;
			var childrenLength=getJsonLength(childrenData);
			//计算子试题每道题的平均分
			var qsnfen=(qsnData.fen*100)/childrenLength/100;
			for(var j in childrenData){
				//循环子试题 
				var childData=childrenData[j];
				if(childData.tx == "jianda"){
					//如果子试题中包含简答题，则组织html
					qsnHtml+='<div class="div_qsn_zuhe_info">'
							+	'<div class="div_qsn_title">'+childData.title+'</div>'
							+	'<div class="div_qsn_answer" style="font-size:10pt !important;margin-bottom:20px;">'
							+		'<div class="div_qsn_answer_left">考生答案：</div>'
							+		'<div class="div_qsn_answer_right"><textarea class="textarea_style" disabled>'+childData.ksdaan+'</textarea></div>'
							+		'<div class="div_qsn_answer_left">正确答案：</div>'
							+		'<div class="div_qsn_answer_right"><textarea class="textarea_style" readonly="readonly">'+childData.daan+'</textarea></div>'
							+		'<div class=div_fen>该题分数：'+qsnfen.toFixed(1)+'分。考生得分：<input childindex="'+j+'" type="text" index="'+qindex+'" sttype="6" class="easyui-numberbox" style="width:50px;height: 30px;" value="" data-options="min:0,precision:1,required: true"  validType="jdfen['+qsnfen.toFixed(1)+']"></input></div>'
							+		'<div class=div_fen>老师评语：<input type="text" childindex="'+j+'" id="tec_des_'+qindex+'_'+j+'" index="'+qindex+'" sttype="6" class="input_user_info" style="width:500px;text-align: left;" ></input></div>'
							+		'<div class="clear"></div>'		
							+	'</div>'
							+'</div>';
				}
			}
		}
	}
	qsnHtml+='</div>'
			+'<div class="div_qsn_answer">'
				+'<div class="div_qsn_answer_left">答题解析：</div>'
				+'<div class="div_qsn_answer_jx_right">'+qsnData.jiexi+'</div>'
			+'</div>'
			+'<div class="clear"></div>'
		+'</div>';
	return qsnHtml;
}
/**
 * 获取{}类型json长度 
 * @param jsonData
 * @returns {Number}
 */
function getJsonLength(jsonData){

	var jsonLength = 0;
	
	for(var item in jsonData){
	
		jsonLength++;
	
	}
	
	return jsonLength;

}
/**
 * 提交表单
 * @returns {Boolean}
 */
function subAddForm(){
	//累计总分
	var userSorce = parseFloat($("#sorce").val());
	var items=$(".easyui-numberbox");
	for(var i = 0;i<items.length;i++){
		var item = items[i];
		userSorce += parseFloat($(item).numberbox("getValue"));
	}
	$("#sorce").val(userSorce);
	$('#ff').submit(); 
	return false;
}