var allids="";
// 计时器Id
var timeID = '';
//试题总数
var shitiTotal=0;
//试题总分
var totalScore=0;
var time_distance=0;
//总时长
var totalTm=0;
//答卷模式 0整卷模式 1逐题模式
var pageModel=0;
//及格分数
var okrate=0;
//试题顺序是否打乱 0：不打乱1：打乱
var qsnRandomFlg=0;
var saveTimer='';
var examData="";
var jigeStatus='';

//遮罩层
var mask='<div style="display:none;background-color: #777;filter: alpha(opacity=60); opacity:0.5; -moz-opacity:0.5;top: 0px;left: 0px;right:0px;bottom:0px;position:fixed;height:100%;width:100%;overflow:hidden;z-index: 1002;"></div>';
$(function() {
	//滚动条选项卡悬浮
	$(window).scroll(function () {
		if ($(window).scrollTop() > 100) {
			$(".testNyLeft").css({position:"fixed",top:"40px"});
			$(".testTop").css({position:"fixed",top:"-15px"});
		}else{
			$(".testNyLeft").css({position:"",top:""});
			$(".testTop").css({position:"",top:""});
		}
	});
	//浏览器兼容数组indexOf
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(elt /* , from */) {
			var len = this.length >>> 0;
			var from = Number(arguments[1]) || 0;
			from = (from < 0) ? Math.ceil(from) : Math.floor(from);
			if (from < 0)
				from += len;

			for (; from < len; from++) {
				if (from in this && this[from] === elt)
					return from;
			}
			return -1;
		};
	}
	// 加载考试内容
	getExam();
	// 加载试卷提示信息
	loading();
	$.ajax({
		url:baseUrl + '/mta/F020/showExam.html',
		data:{sjId:sjId},
		type: 'post',
		dataType: 'json',
		success:function(data){
			//加载试卷试题信息
			loadSjDl(data);
			//关闭loading
			$("#loading").hide();
			saveTimer=setTimeout('saveShiJuan()',300000);
		}
	});

	mask =$(mask);

	if(timeID != ''){
		clearTimeout(timeID);
	}
	// 设置每一秒调用一次倒计时函数
	timeID = setTimeout("count_down()",1000);
});

/**
 * 获取考试控制内容
 */
function getExam(){
	$.ajax({
		url:'mta/F020/getCourseExam.html',
		dataType: 'json',
		data: {uuid:uuid},
		async: false,
		type: 'post',
		success:function(result){
			examData = eval("("+result.kaoshiJson+")");
			$("#sjTitle").text("考试名称："+examData.examName);
			//答卷模式 0整卷模式 1逐题模式
			pageModel=examData.pageSize;
			//及格分数
			okrate=examData.okrate;
			//试题顺序是否打乱 0：不打乱1：打乱
			qsnRandomFlg=examData.qsnRandomFlg;
		}
	});
}
function loadSjDl(data){

	/**
	 * 段落信息 1~N为对应段落数据，包含t:段落标题，ids：试题ID集合，fen：分值，t可以为空 allids:全部固定试题ID，应用于编辑试卷。
	 */
	var dlData=eval("("+data.dDlmix+")");

	/**
	 * 随机选题 后台重组此数据，所以与数据库中不同 fen：分值 did：段落ID data：试题数据
	 */
	var xtData=dXtmix;
	
	/**
	 * 试题数据 index:段落试题索引 如：1_7258,1段落索引，7258试题ID data：试题数据
	 */
	var stData=eval("("+data.dShitimix+")");

	// 保存所有试题ID
	allids=dlData.allids;
	
	// 删除段落数据中所有试题ID
	delete dlData.allids;
	// 段落索引
	var dlIndex=1;
	// HTML写入容器
	var C = $("#Container");
	// 选项卡
//	var X = $(".testNyLeft");
	//选项卡
	var X = $("#datika");
	// 试题索引
	var qsnIndex=1;
	for(var index in dlData){
		var keyArray=[];
		var idArray=dlData[dlIndex+""].ids.split(",");
		var qsnData=stData.data;
		for(var dindex in qsnData){
			var oqid=qsnData[dindex].qsnid+"";
			if(idArray.indexOf(oqid) > -1){
				keyArray.push(dindex);
			}
		}
		// 循环段落
		var dlTitle=dlData[dlIndex+""].t;
		if(dlTitle != "" && dlTitle != null){
			// 如果段落标题不为空，则向C中追加段落标题
			var titleHtml="<span class='duanluo' id='duanluo"+index+"'><h3>"+dlTitle+"(每题"+dlData[dlIndex+""].fen+"分)</h3></span>";

			var dlxxkHtml="<h2 class='xuanxiangka' id='xuanxiangka"+index+"'>"+dlTitle+"(每题"+dlData[dlIndex+""].fen+"分)</h2>";

			X.append(dlxxkHtml);

			C.append(titleHtml);
		}
		// 段落KEY
		var key=dlIndex+"";

		// 试题数据
		var num=1;
		var stNumUlHtml='<ul style="border-top: 0px" id="duanluo_'+index+'"></ul>';
		//X.find("h2:eq("+index+")").parent().append(stNumUlHtml);
		X.append(stNumUlHtml);
		var stNumHtml="";
		var shitiLength=idArray.length-1;
		if(qsnRandomFlg==0){
			//试题正常顺序
			for(var qsn in qsnData){
				var oldid=qsnData[qsn].qsnid+"";
				// 循环所有试题数据
				if(idArray.indexOf(oldid)>-1){
					// 如果试题ID是此段落试题则追加试题HTML
					var qsnHtml='<table class="shitiTable" id="shiti_'+qsnIndex+'" did="'+index+'" shitiId='+qsnData[qsn].qsnid+' border="0" cellpadding="0" cellspacing="0">';
					//stNumHtml+='<li class="xuanxiangkaNumber_'+index+'" id="biao_'+qsnData[qsn].qsnid+'" style="border-top: 1px solid #ccc;"><a href="'+baseUrl+'/mta/F020/goExam.html?ksUuid='+uuid+'#dl_qsn_'+qsnIndex+'">'+qsnIndex+'</a></li>';
					stNumHtml+='<li class="xuanxiangkaNumber_'+index+'" id="biao_'+qsnData[qsn].qsnid+'" style="border-top: 1px solid #ccc;"><a href="javascript:;" onclick="showQsn('+qsnIndex+')">'+qsnIndex+'</a></li>';
					qsnHtml+=loadQsnInfo(qsnIndex,qsnData[qsn],dlData[dlIndex+""].fen,0);
					qsnHtml+='</table>';
					C.append(qsnHtml);
					qsnIndex++;
					shitiTotal++;
					if(num==idArray.length-1){
						num=1;
						break;
					}
					num++;
					// 考虑试题不会重复则终止循环
					delete stData.data.qsn;
				}
			}
		}else{
			//试题打乱顺序
			for(var kindex=0;kindex<shitiLength;){
				var random=parseInt(shitiLength*Math.random());
				var keyStr=keyArray[random];
				var rqsnData = qsnData[keyStr];
				var oldid=rqsnData.qsnid+"";
				// 循环所有试题数据
				if(idArray.indexOf(oldid)>-1){
					// 如果试题ID是此段落试题则追加试题HTML
					var qsnHtml='<table class="shitiTable" id="shiti_'+qsnIndex+'" did="'+index+'" shitiId='+rqsnData.qsnid+' border="0" cellpadding="0" cellspacing="0">';
					//stNumHtml+='<li class="xuanxiangkaNumber_'+index+'" id="biao_'+rqsnData.qsnid+'" style="border-top: 1px solid #ccc;"><a href="'+baseUrl+'/mta/F020/goCourseExam.html?kcUuid='+uuid+'#dl_qsn_'+qsnIndex+'">'+qsnIndex+'</a></li>';
					stNumHtml+='<li class="xuanxiangkaNumber_'+index+'" id="biao_'+qsnData[qsn].qsnid+'" style="border-top: 1px solid #ccc;"><a href="javascript:;" onclick="showQsn('+qsnIndex+')">'+qsnIndex+'</a></li>';
					qsnHtml+=loadQsnInfo(qsnIndex,rqsnData,dlData[dlIndex+""].fen,0);
					qsnHtml+='</table>';
					C.append(qsnHtml);
					qsnIndex++;
					shitiTotal++;
					if(num==idArray.length-1){
						num=1;
						break;
					}
					num++;
					// 考虑试题不会重复则终止循环
					delete stData.data.keyStr;
					keyArray.remove(random);
					shitiLength--;
				}
			}
		}
		/**
		 * 随机选题 key是段落索引的字符串型，如果在随机试题数据中包含段落索引的key则代表此段落有随机选题
		 */
		if( key in xtData){
			/**
			 * 后台组成的随机试题数据
			 */
			var sjdata=xtData[key].data;
			// 具体组成试题HTML方式与固定试题类似
			for(var i=0;i<sjdata.length;i++){
				var item=sjdata[i];
				//stNumHtml+='<li class="xuanxiangkaNumber_'+index+'" id="biao_'+item.qsnid+'" style="border-top: 1px solid #ccc;"><a href="'+baseUrl+'/mta/F020/goExam.html?ksUuid='+uuid+'#dl_qsn_'+qsnIndex+'">'+qsnIndex+'</a></li>';
				stNumHtml+='<li class="xuanxiangkaNumber_'+index+'" id="biao_'+qsnData[qsn].qsnid+'" style="border-top: 1px solid #ccc;"><a href="javascript:;" onclick="showQsn('+qsnIndex+')">'+qsnIndex+'</a></li>';
				var qsnHtml='<table class="shitiTable" did="'+index+'" id="shiti_'+qsnIndex+'" border="0" cellpadding="0" cellspacing="0">';
					qsnHtml+=loadQsnInfo(qsnIndex,item,dlData[dlIndex+""].fen,1);
					qsnHtml+='</table>';
					if(qsnIndex > 1 && key == item.did+""){
							// 如果已加载试题数>1向上一道试题信息HTML后追加html
							// 向上一道试题信息HTML后追加html
							$("#dl_qsn_"+(qsnIndex-1)).parent().parent().after(qsnHtml);
					}else{
						//没有固定题的场合
						C.append(qsnHtml);
					}
					$("#dl_qsn_"+(qsnIndex)).attr("suiji",1);
				qsnIndex++;
				shitiTotal++;
			}
		}
		$("#duanluo_"+index).append(stNumHtml);
		dlIndex++;
	}
	// 试题信息加载完成关闭提示框
	// $.messager.progress('close');
	if(pageModel==1){
		// 逐题模式
		zhuti();
	}
}
/**
 * 
 * @param qindex
 * @param qsnData
 * @param qsnfen
 * @param isSuiJI
 *            0：固定 1：随机
 * @returns {String}
 */
function loadQsnInfo(qindex,qsnData,qsnfen,isSuiJi){
	
	var ksdaan;
	if(typeof(dnandata) != "undefined"&&dnandata!=null){
	var qsnid=qsnData.qsnid;
	if(isSuiJi==0 && qsnData.shititypeid<6){
		for(var i=0;i<dnandata.length;i++){
			if(dnandata[i].sid==qsnid){
				ksdaan=dnandata[i].ksdaan;
				break;
			}
		}
	}else if(isSuiJi==1 && qsnData.shititypeid<6){
		for(var i=0;i<rdaandata.length;i++){
			if(rdaandata[i].sid==qsnid){
				ksdaan=rdaandata[i].ksdaan;
				break;
			}
		}
	}
	}

	// 试题标题
	var daan=qsnData.daan;
	var gdQsnHtml='<tr id="dl_qsn_'+qindex+'" suiji="0" jieda="'+qsnData.jieda+'" class="shiti" shitiId="'+qsnData.qsnid+'" fen="'+qsnfen+'" shitiType="'+qsnData.shititypeid+'"><th colspan="3" align="left">第'+qindex+'题:<span class="title">'+qsnData.title+'</span>（分值：'+qsnfen+'分） </th>'
	+'<th width="100"><input type="hidden" id="hidden_'+qindex+'" value=\''+daan+'\'/><a onclick="add_biaoji(this)" class="biaoji" stId="'+qsnData.qsnid+'" href="javascript:;"><img src="resources/mta/images/biaoji.png" width="90" height="33" alt="标记" /></a></th></tr>';
	// 单选题
	if("xx" in qsnData && qsnData.shititypeid == 1){
		gdQsnHtml += '<tr><td width="720"><ol>';
		var xxdata=eval("("+qsnData.xx+")");
		for(var xxNum in xxdata){
			if(xxNum==ksdaan){
				gdQsnHtml +='<li indexid='+qindex+'_'+xxNum+' >';
				gdQsnHtml +='<input name="danxuan_'+qindex+'_xx" value="'+xxNum+'" stId="'+qsnData.qsnid+'" type="radio" checked="checked" id="danxuan_'+qindex+'_'+xxNum+'_xx" onclick="choose(this)" class="inputStyle"/>';
				gdQsnHtml +=xxdata[xxNum].xx+'</li>';
			}else{
				gdQsnHtml +='<li indexid='+qindex+'_'+xxNum+' >';
				gdQsnHtml +='<input name="danxuan_'+qindex+'_xx" value="'+xxNum+'" stId="'+qsnData.qsnid+'" type="radio" id="danxuan_'+qindex+'_'+xxNum+'_xx" onclick="choose(this)" class="inputStyle"/>';
				gdQsnHtml +=xxdata[xxNum].xx+'</li>';
			}
		}
		gdQsnHtml += '</ol></td></tr>';
	}
	// 多选题
	if("xx" in qsnData && qsnData.shititypeid == 2){
		gdQsnHtml += '<tr><td width="720"><ol>';
		var xxdata=eval("("+qsnData.xx+")");
		if(typeof(ksdaan)!="undefined"){
			var daanArray=ksdaan.split(",");
			for(var xxNum in xxdata){
				if(daanArray.indexOf(xxNum+"") > -1){
					gdQsnHtml +='<li indexid='+qindex+'_'+xxNum+' >';
					gdQsnHtml +='<input name="duoxuan_'+qindex+'_xx" value="'+xxNum+'" checked="checked" stId="'+qsnData.qsnid+'" type="checkbox" id="duoxuan_'+qindex+'_'+xxNum+'_xx" onclick="choose(this)" class="inputStyle"/>';
					gdQsnHtml +=xxdata[xxNum].xx+'</li>';
				}else{
					gdQsnHtml +='<li indexid='+qindex+'_'+xxNum+' >';
					gdQsnHtml +='<input name="duoxuan_'+qindex+'_xx" value="'+xxNum+'" stId="'+qsnData.qsnid+'" type="checkbox" id="duoxuan_'+qindex+'_'+xxNum+'_xx" onclick="choose(this)" class="inputStyle"/>';
					gdQsnHtml +=xxdata[xxNum].xx+'</li>';
				}
			}
		}else{
			for(var xxNum in xxdata){
				gdQsnHtml +='<li indexid='+qindex+'_'+xxNum+' >';
				gdQsnHtml +='<input name="duoxuan_'+qindex+'_xx" value="'+xxNum+'" stId="'+qsnData.qsnid+'" type="checkbox" id="duoxuan_'+qindex+'_'+xxNum+'_xx" onclick="choose(this)" class="inputStyle"/>';
				gdQsnHtml +=xxdata[xxNum].xx+'</li>';
			}
		}
		gdQsnHtml += '</ol></td></tr>';
	}
	// 判断题
	if(qsnData.shititypeid == 3){

		gdQsnHtml +='<tr><td width="720"><ol>';
		if(typeof(ksdaan)!="undefined"&&ksdaan!=""){
			if(ksdaan == "1"){
				gdQsnHtml +='<li indexid='+qindex+'_1 >';
				gdQsnHtml +='<input name="panduan_'+qindex+'_daan" type="radio" value="1" checked="checked" stId="'+qsnData.qsnid+'" id="panduan_'+qindex+'_1_daan" onclick="choose(this)" class="inputStyle"/>';
				gdQsnHtml +='√</li>';
	
				gdQsnHtml +='<li indexid='+qindex+'_0 >';
				gdQsnHtml +='<input name="panduan_'+qindex+'_daan" type="radio" value="0" stId="'+qsnData.qsnid+'" id="panduan_'+qindex+'_0_daan" onclick="choose(this)" class="inputStyle"/>';
				gdQsnHtml +='×</li>';
			}else{
				gdQsnHtml +='<li indexid='+qindex+'_1 >';
				gdQsnHtml +='<input name="panduan_'+qindex+'_daan" type="radio" value="1" stId="'+qsnData.qsnid+'" id="panduan_'+qindex+'_1_daan" onclick="choose(this)" class="inputStyle"/>';
				gdQsnHtml +='√</li>';
				
				gdQsnHtml +='<li indexid='+qindex+'_0 >';
				gdQsnHtml +='<input name="panduan_'+qindex+'_daan" type="radio" value="0" checked="checked" stId="'+qsnData.qsnid+'" id="panduan_'+qindex+'_0_daan" onclick="choose(this)" class="inputStyle"/>';
				gdQsnHtml +='×</li>';
			}
		}else{
			gdQsnHtml +='<li indexid='+qindex+'_1 >';
			gdQsnHtml +='<input name="panduan_'+qindex+'_daan" type="radio" value="1" stId="'+qsnData.qsnid+'" id="panduan_'+qindex+'_1_daan" onclick="choose(this)" class="inputStyle"/>';
			gdQsnHtml +='√</li>';

			gdQsnHtml +='<li indexid='+qindex+'_0 >';
			gdQsnHtml +='<input name="panduan_'+qindex+'_daan" type="radio" value="0" stId="'+qsnData.qsnid+'" id="panduan_'+qindex+'_0_daan" onclick="choose(this)" class="inputStyle"/>';
			gdQsnHtml +='×</li>';
		}
		gdQsnHtml += "</ol></td></tr>";
	}
	// 填空题
	if(qsnData.shititypeid == 4){
		gdQsnHtml += '<tr><th colspan="3" align="left">';
		var kongsData=eval("("+qsnData.daan+")");
		if(typeof(ksdaan)!="undefined"&&ksdaan!=""){
			for(var ki in ksdaan){
				var kongArray=ksdaan[ki].kong.split("#");
				gdQsnHtml +="空"+ki;
				for(var kai=0;kai<kongArray.length;kai++){
					if(kai==0){
						gdQsnHtml += '<input type="text" stId="'+qsnData.qsnid+'" value="'+kongArray[kai]+'" onchange="tiankong(this)" class="kong" name="tk_'+qindex+'" id="tabletextfield" />';
					}
				}
			}
		}else{
			for(var ki in kongsData){
				var kongArray=kongsData[ki].kong.split("#");
				gdQsnHtml +="空"+ki;
				for(var kai=0;kai<kongArray.length;kai++){
					if(kai==0){
						gdQsnHtml += '<input type="text" stId="'+qsnData.qsnid+'" onchange="tiankong(this)" class="kong" name="tk_'+qindex+'" id="tabletextfield" />';
					}
				}
			}
		}
		gdQsnHtml += "<br/><br/>";
		gdQsnHtml += '</th></tr>';
	}
	// 简答题
	if(qsnData.shititypeid == 5){
		gdQsnHtml += '<tr>';
		gdQsnHtml +='<td width="40">&nbsp;</td>';
		if(typeof(ksdaan)!="undefined"){
			gdQsnHtml +='<td width="680"><textarea name="jianda_'+qindex+'" onchange="jianda(this)" class="jiandaInput" stId="'+qsnData.qsnid+'" id="tabletextarea" cols="45" rows="5">'+ksdaan+'</textarea></td>';
		}else{
			gdQsnHtml +='<td width="680"><textarea name="jianda_'+qindex+'" onchange="jianda(this)" class="jiandaInput" stId="'+qsnData.qsnid+'" id="tabletextarea" cols="45" rows="5"></textarea></td>';
		}
		gdQsnHtml +='<td colspan="2"></td>';
		gdQsnHtml +='</tr>';
	}
	// 阅读理解
	if("data" in qsnData && qsnData.shititypeid == 6){
		/**
		 * 阅读理解子试题中试题数据 tx：题型；daan：答案；title：试题标题；xx：选项；
		 */
		if(typeof(dnandata) != "undefined"&&dnandata!=null){
			var childrenData;
			if(isSuiJi==0){
				for(var i=0;i<dnandata.length;i++){
					if(dnandata[i].sid==qsnid){
						childrenData=dnandata[i].children;
						break;
					}
				}
			}else if(isSuiJi==1){
				for(var i=0;i<rdaandata.length;i++){
					if(rdaandata[i].sid==qsnid){
						childrenData=rdaandata[i].children;
						break;
					}
				}	
			}
		}
		var zhQsnData=eval("("+qsnData.data+")");
		for(var cindex in zhQsnData){
			if(typeof(childrenData)!="undefined"){
				ksdaan=childrenData[cindex].ksdaan;
			}
			var childData=zhQsnData[cindex];
			var tx="";
			if(childData.tx=="danxuan"){
				tx="单选题";
			}else if(childData.tx=="duoxuan"){
				tx="多选题";
			}else if(childData.tx=="panduan"){
				tx="判断题";
			}else if(childData.tx=="jianda"){
				tx="简答题";
			}
			gdQsnHtml+='<tr class="yd_'+qindex+'" title="'+childData.title+'" tx="'+childData.tx+'"><th colspan="3" align="left">'+cindex+'.'+tx+':'+childData.title+' <input type="hidden" id="yd_'+cindex+'" value="'+childData.daan+'"/></th></tr>';
			// 单选
			if(childData.tx=="danxuan" && "xx" in childData){
				gdQsnHtml += '<tr class="yudu" tx="danxuan"><td width="720"><ol>';
				var xxdata=childData.xx;
				for(var xxNum in xxdata){
					if(typeof(ksdaan)!="undefined"&&xxNum==ksdaan){
						gdQsnHtml +='<li indexid='+qindex+'_'+cindex+'_'+xxNum+' >';
						gdQsnHtml +='<input name="danxuan_'+qindex+'_'+cindex+'_xx" checked="checked" stId="'+qsnData.qsnid+'" value="'+xxNum+'" type="radio" id="danxuan_'+qindex+'_'+cindex+'_'+xxNum+'_xx" onclick="choose(this)" class="inputStyle"/>';
						gdQsnHtml +=xxdata[xxNum].xx+'</li>';
					}else{
						gdQsnHtml +='<li indexid='+qindex+'_'+cindex+'_'+xxNum+' >';
						gdQsnHtml +='<input name="danxuan_'+qindex+'_'+cindex+'_xx" stId="'+qsnData.qsnid+'" value="'+xxNum+'" type="radio" id="danxuan_'+qindex+'_'+cindex+'_'+xxNum+'_xx" onclick="choose(this)" class="inputStyle"/>';
						gdQsnHtml +=xxdata[xxNum].xx+'</li>';
					}
				}
				gdQsnHtml += '</ol></td></tr>';
			}
			// 多选
			if(childData.tx=="duoxuan" && "xx" in childData){
				var daanArray="";
				if(typeof(ksdaan)!="undefined"){
					daanArray=ksdaan.split(",");
				}
				gdQsnHtml += '<tr class="yudu" tx="duoxuan"><td width="720"><ol>';
				var xxdata=childData.xx;
				for(var xxNum in xxdata){
					if(daanArray.indexOf(xxNum+"") > -1){
						gdQsnHtml +='<li indexid='+qindex+'_'+cindex+'_'+xxNum+' >';
						gdQsnHtml +='<input name="duoxuan_'+qindex+'_'+cindex+'_xx" checked="checked" stId="'+qsnData.qsnid+'" value="'+xxNum+'" type="checkbox" id="duoxuan_'+qindex+'_'+cindex+'_xx" onclick="choose(this)" class="inputStyle"/>';
						gdQsnHtml +=xxdata[xxNum].xx+'</li>';
					}else{
						gdQsnHtml +='<li indexid='+qindex+'_'+cindex+'_'+xxNum+' >';
						gdQsnHtml +='<input name="duoxuan_'+qindex+'_'+cindex+'_xx" stId="'+qsnData.qsnid+'" value="'+xxNum+'" type="checkbox" id="duoxuan_'+qindex+'_'+cindex+'_xx" onclick="choose(this)" class="inputStyle"/>';
						gdQsnHtml +=xxdata[xxNum].xx+'</li>';
					}
				}
				gdQsnHtml += '</ol></td></tr>';
			}
			// 判断
			if(childData.tx=="panduan"){

				gdQsnHtml +='<tr class="yudu" tx="panduan"><td width="720"><ol>';
				if(typeof(ksdaan)!="undefined"&&ksdaan!=""){
					if(ksdaan == "1"){
						gdQsnHtml +='<li indexid='+qindex+'_'+cindex+'_1 >';
						gdQsnHtml +='<input name="panduan_'+qindex+'_'+cindex+'_daan" checked="checked" stId="'+qsnData.qsnid+'" value="1" type="radio" id="panduan_'+qindex+'_'+cindex+'_1_daan" onclick="choose(this)" class="inputStyle"/>';
						gdQsnHtml +='√</li>';
	
						gdQsnHtml +='<li indexid='+qindex+'_0 >';
						gdQsnHtml +='<input name="panduan_'+qindex+'_'+cindex+'_daan" stId="'+qsnData.qsnid+'" value="0" type="radio" id="panduan_'+qindex+'_'+cindex+'_0_daan" onclick="choose(this)" class="inputStyle"/>';
						gdQsnHtml +='×</li>';
					}else{
						gdQsnHtml +='<li indexid='+qindex+'_'+cindex+'_1 >';
						gdQsnHtml +='<input name="panduan_'+qindex+'_'+cindex+'_daan" stId="'+qsnData.qsnid+'" value="1" type="radio" id="panduan_'+qindex+'_'+cindex+'_1_daan" onclick="choose(this)" class="inputStyle"/>';
						gdQsnHtml +='√</li>';
	
						gdQsnHtml +='<li indexid='+qindex+'_0 >';
						gdQsnHtml +='<input name="panduan_'+qindex+'_'+cindex+'_daan" checked="checked" stId="'+qsnData.qsnid+'" value="0" type="radio" id="panduan_'+qindex+'_'+cindex+'_0_daan" onclick="choose(this)" class="inputStyle"/>';
						gdQsnHtml +='×</li>';
					}
				}else{
					gdQsnHtml +='<li indexid='+qindex+'_'+cindex+'_1 >';
					gdQsnHtml +='<input name="panduan_'+qindex+'_'+cindex+'_daan" stId="'+qsnData.qsnid+'" value="1" type="radio" id="panduan_'+qindex+'_'+cindex+'_1_daan" onclick="choose(this)" class="inputStyle"/>';
					gdQsnHtml +='√</li>';
					
					gdQsnHtml +='<li indexid='+qindex+'_0 >';
					gdQsnHtml +='<input name="panduan_'+qindex+'_'+cindex+'_daan" stId="'+qsnData.qsnid+'" value="0" type="radio" id="panduan_'+qindex+'_'+cindex+'_0_daan" onclick="choose(this)" class="inputStyle"/>';
					gdQsnHtml +='×</li>';
					gdQsnHtml += "</ol></td></tr>";
				}
			}
			// 简答
			if(childData.tx=="jianda"){
				gdQsnHtml += '<tr class="yudu" tx="jianda">';
				//gdQsnHtml +='<td width="40">&nbsp;</td>';
				if(typeof(ksdaan)!="undefined"){
					gdQsnHtml +='<td colspan="3"><textarea onchange="jianda(this)" class="jiandaInput" name="jianda_'+qindex+'_'+cindex+'"  stId="'+qsnData.qsnid+'" id="tabletextarea" cols="45" rows="5">'+ksdaan+'</textarea></td>';
				}else{
					gdQsnHtml +='<td colspan="3"><textarea onchange="jianda(this)" class="jiandaInput" name="jianda_'+qindex+'_'+cindex+'"  stId="'+qsnData.qsnid+'" id="tabletextarea" cols="45" rows="5"></textarea></td>';
				}
				//gdQsnHtml +='<td colspan="2"></td>';
				gdQsnHtml +='</tr>';
			}
		}
	}
	return gdQsnHtml;
}

/**
 * 保存试卷
 * 
 * @returns
 */
function saveShiJuan(){

	fmtExamDaAn();

	submit(0);

	saveTimer=setTimeout('saveShiJuan()',300000);
}

/**
 * 提交试卷
 * 
 * @returns
 */
function submitShiJuan(){
	fmtExamDaAn();

	submit(1);

	//时间停止
	stopTime();

	/*window.location.href=baseUrl +"/mta/F010/CourseInfo.html?uuid="+$("#kcUUid").val();*/
//	var ksUuid=$("#ksUuid").val();
//	$.ajax({
//		url:baseUrl + '/mta/F020/checkSubmitExam.html',
//		data:{ksUuid:ksUuid},
//		type: 'post',
//		dataType: 'json',
//		success:function(data){
//			
//		}
//	});
}
/**
 * 保存标识 1：交卷0：保存
 * 
 * @param oprateFlg
 */
function submit(oprateFlg){
	var id=$("#courseOrderId").val();
	var gdStr=$("#gdStr").val();
	var sjStr=$("#sjStr").val();
	var certJsonStr=$("#certJson").val();
	var cid=$("#cid").val();
	var credit=$("#credit").val();
	var passCondition=$("#passCondition").val();
	$.ajax({
		async:false,
		url:baseUrl+"/mta/F020/submitCourseExam.html",
		data:{id:id,gdStr:gdStr,sjStr:sjStr,oprateFlg:oprateFlg,okrate:okrate,certJson:certJsonStr,cid:cid,credit:credit,passCondition:passCondition},
		type: 'post',
		dataType: 'json',
		success:function(data){
			//得分
			totalScore=data.totalScore;
			jigeStatus=data.jigeStatus;
			if(data.status==1&&oprateFlg==1){
				successPop();
			}
			if(data.status==1&&oprateFlg==0){
				saveSuccessPop();
			}
		}
	});
}
function sure(){
	window.location.href=baseUrl +"/mta/F010/CourseInfo.html?uuid="+$("#kcUUid").val();
}
function fmtExamDaAn(){
	var gdStJsonArray=[];
	var sjStJsonArray=[];
	$(".shiti").each(function(i){
		// 随机 1:随机 ;0:固定
		var suiji=parseInt($(this).attr("suiji"));
		// 试题ID
		var sid=$(this).attr("shitiId");
		// 试题标题
		var title=$(this).find(".title").html();
		var jiexi=$(this).attr("jieda");
		// 试题分数
		var fen=$(this).attr("fen");
		// 试题类型
		var tx=$(this).attr("shitiType");
		var hiddenDate=$("#hidden_"+(i+1)).val();
		if(suiji==1){
			// 随机试题
			var sjStJson={};
			if(tx==1){
				var ksDaan=$("input[name='danxuan_"+(i+1)+"_xx']:checked").val();
				if(typeof(ksDaan) == "undefined"){
					ksDaan="";
				}
				// 单选题
				sjStJson={
					"sid":sid,// 试题ID
					"title":title,// 试题标题
					"jiexi":jiexi,// 试题解析
					"ksdaan":ksDaan,// 考生答案
					"daan":hiddenDate,// 答案
					"fen":fen,// 分数
					"tx":tx // 试题题型
				};
			}else if(tx==2){
				// 多选题
				var ksDaan="";
				$("input[name='duoxuan_"+(i+1)+"_xx']").each(function(){
					if($(this).is(":checked")){
						ksDaan+=$(this).val()+",";
					}
				});
				ksDaan=ksDaan.substring(0,ksDaan.lastIndexOf(","));
				sjStJson={
						"sid":sid,// 试题ID
						"title":title,// 试题标题
						"jiexi":jiexi,// 试题解析
						"ksdaan":ksDaan,// 考生答案
						"daan":hiddenDate,// 答案
						"fen":fen,// 分数
						"tx":tx // 试题题型
					};
				
			}else if(tx==3){
				// 判断题
				var ksDaan=$("input[name='panduan_"+(i+1)+"_daan']:checked").val();
				if(typeof(ksDaan) == "undefined"){
					ksDaan="";
				}
				sjStJson={
						"sid":sid,// 试题ID
						"title":title,// 试题标题
						"jiexi":jiexi,// 试题解析
						"ksdaan":ksDaan,// 考生答案
						"daan":hiddenDate,// 答案
						"fen":fen,// 分数
						"tx":tx // 试题题型
					};
			}else if(tx==4){
				// 填空题
				var kongJson={};
				$("input[name='tk_"+(i+1)+"']").each(function(k){
					var daan=$(this).val().replace(/\s/g, "");
					var key=(k+1)+"";
					var kong={"kong":daan};
					kongJson[key]=kong;
				});
				sjStJson={
						"sid":sid,// 试题ID
						"title":title,// 试题标题
						"jiexi":jiexi,// 试题解析
						"ksdaan":kongJson,// 考生答案
						"daan":hiddenDate,// 答案
						"fen":fen,// 分数
						"tx":tx // 试题题型
					};
			}else if(tx==5){
				// 简答题
				var ksdaan=$("textarea[name='jianda_"+(i+1)+"']").val();
				sjStJson={
						"sid":sid,// 试题ID
						"title":title,// 试题标题
						"jiexi":jiexi,// 试题解析
						"ksdaan":ksdaan,// 考生答案
						"daan":hiddenDate,// 答案
						"fen":fen,// 分数
						"tx":tx // 试题题型
					};
			}else if(tx==6){
				// 阅读理解题
				var childShiTiJsonArray={};
				var childShiTiJson={};
				$(".yd_"+(i+1)).each(function(y){
					var tx=$(this).attr("tx");
					var title=$(this).attr("title");
					var daan=$("#yd_"+(y+1)).val();
					childShiTiJson={};
					if(tx=="danxuan"){
						// 单选题
						var ksDaan=$("input[name='danxuan_"+(i+1)+"_"+(y+1)+"_xx']:checked").val();
						if(typeof(ksDaan) == "undefined"){
							ksDaan="";
						}
						childShiTiJson={"title":title,"tx":tx,"ksdaan":ksDaan,"daan":daan};
					}else if(tx=="duoxuan"){
						var ksDaan="";
						$("input[name='duoxuan_"+(i+1)+"_"+(y+1)+"_xx']").each(function(){
							if($(this).is(":checked")){
								ksDaan+=$(this).val()+",";
							}
						});
						ksDaan=ksDaan.substring(0,ksDaan.lastIndexOf(","));
						childShiTiJson={"title":title,"tx":tx,"ksdaan":ksDaan,"daan":daan};
					}else if(tx=="panduan"){
						var ksDaan=$("input[name='panduan_"+(i+1)+"_"+(y+1)+"_daan']:checked").val();
						if(typeof(ksDaan) == "undefined"){
							ksDaan="";
						}
						childShiTiJson={"title":title,"tx":tx,"ksdaan":ksDaan,"daan":daan};
					}else if(tx=="jianda"){
						var ksdaan=$("textarea[name='jianda_"+(i+1)+"_"+(y+1)+"']").val();
						childShiTiJson={"title":title,"tx":tx,"ksdaan":ksdaan,"daan":daan};
					}
					childShiTiJsonArray[(y+1)+""]=childShiTiJson;
				});
				sjStJson={
						"sid":sid,// 试题ID
						"title":title,// 试题标题
						"jiexi":jiexi,
						"children":childShiTiJsonArray,// 考生答案
						"fen":fen,// 分数
						"tx":tx // 试题题型
					};
			}
			// 随机试题
			sjStJsonArray.push(sjStJson);
		}else{
			// 固定试题
			var gdStJson={};
			if(tx==1){
				var ksDaan=$("input[name='danxuan_"+(i+1)+"_xx']:checked").val();
				if(typeof(ksDaan) == "undefined"){
					ksDaan="";
				}
				// 单选题
				gdStJson={
					"sid":sid,// 试题ID
					"title":title,// 试题标题
					"jiexi":jiexi,// 试题解析
					"ksdaan":ksDaan,// 考生答案
					"daan":hiddenDate,// 答案
					"fen":fen,// 分数
					"tx":tx // 试题题型
				};
			}else if(tx==2){
				// 多选题
				var ksDaan="";
				$("input[name='duoxuan_"+(i+1)+"_xx']").each(function(){
					if($(this).is(":checked")){
						ksDaan+=$(this).val()+",";
					}
				});
				ksDaan=ksDaan.substring(0,ksDaan.lastIndexOf(","));
				gdStJson={
						"sid":sid,// 试题ID
						"title":title,// 试题标题
						"jiexi":jiexi,// 试题解析
						"ksdaan":ksDaan,// 考生答案
						"daan":hiddenDate,// 答案
						"fen":fen,// 分数
						"tx":tx // 试题题型
					};
			}else if(tx==3){
				// 判断题
				var ksDaan=$("input[name='panduan_"+(i+1)+"_daan']:checked").val();
				if(typeof(ksDaan) == "undefined"){
					ksDaan="";
				}
				gdStJson={
						"sid":sid,// 试题ID
						"title":title,// 试题标题
						"jiexi":jiexi,// 试题解析
						"ksdaan":ksDaan,// 考生答案
						"daan":hiddenDate,// 答案
						"fen":fen,// 分数
						"tx":tx // 试题题型
					};
			}else if(tx==4){
				// 填空题
				var kongJson={};
				$("input[name='tk_"+(i+1)+"']").each(function(k){
					var daan=$(this).val().replace(/\s/g, "");
					var key=(k+1)+"";
					var kong={"kong":daan};
					kongJson[key]=kong;
				});
				gdStJson={
						"sid":sid,// 试题ID
						"title":title,// 试题标题
						"jiexi":jiexi,// 试题解析
						"ksdaan":kongJson,// 考生答案
						"daan":hiddenDate,// 答案
						"fen":fen,// 分数
						"tx":tx // 试题题型
					};
			}else if(tx==5){
				// 简答题
				var ksdaan=$("textarea[name='jianda_"+(i+1)+"']").val();
				gdStJson={
						"sid":sid,// 试题ID
						"title":title,// 试题标题
						"jiexi":jiexi,// 试题解析
						"ksdaan":ksdaan,// 考生答案
						"daan":hiddenDate,// 答案
						"fen":fen,// 分数
						"tx":tx // 试题题型
					};
			}else if(tx==6){
				// 阅读理解题
				var childShiTiJsonArray={};
				var childShiTiJson={};
				$(".yd_"+(i+1)).each(function(y){
					var tx=$(this).attr("tx");
					var title=$(this).attr("title");
					var daan=$("#yd_"+(y+1)).val();
					if(tx=="danxuan"){
						// 单选题
						var ksDaan=$("input[name='danxuan_"+(i+1)+"_"+(y+1)+"_xx']:checked").val();
						if(typeof(ksDaan) == "undefined"){
							ksDaan="";
						}
						childShiTiJson={"title":title,"tx":tx,"ksdaan":ksDaan,"daan":daan};
					}else if(tx=="duoxuan"){
						var ksDaan="";
						$("input[name='duoxuan_"+(i+1)+"_"+(y+1)+"_xx']").each(function(){
							if($(this).is(":checked")){
								ksDaan+=$(this).val()+",";
							}
						});
						ksDaan=ksDaan.substring(0,ksDaan.lastIndexOf(","));
						childShiTiJson={"title":title,"tx":tx,"ksdaan":ksDaan,"daan":daan};
					}else if(tx=="panduan"){
						var ksDaan=$("input[name='panduan_"+(i+1)+"_"+(y+1)+"_daan']:checked").val();
						if(typeof(ksDaan) == "undefined"){
							ksDaan="";
						}
						childShiTiJson={"title":title,"tx":tx,"ksdaan":ksDaan,"daan":daan};
					}else if(tx=="jianda"){
						var ksdaan=$("textarea[name='jianda_"+(i+1)+"_"+(y+1)+"']").val();
						childShiTiJson={"title":title,"tx":tx,"ksdaan":ksdaan,"daan":daan};
					}
					childShiTiJsonArray[(y+1)+""]=childShiTiJson;
				});
				gdStJson={
						"sid":sid,// 试题ID
						"title":title,// 试题标题
						"jiexi":jiexi,
						"children":childShiTiJsonArray,// 考生答案
						"fen":fen,// 分数
						"tx":tx // 试题题型
					};
			}
			gdStJsonArray.push(gdStJson);
		}
	});
	var gdStStr=JSON.stringify(gdStJsonArray);
	$("#gdStr").val(gdStStr);
	var sjStStr=JSON.stringify(sjStJsonArray);
	$("#sjStr").val(sjStStr);
}
// 定义倒计时函数
function count_down(){
	var int_day, int_hour, int_minute, int_second;
	var flag = false;
	time_distance = $("#time").val();
	time_distance -= 1;
	$("#time").val(time_distance);
	if(time_distance >= 0){
		flag = true;
		// 相减的差数换算成天数
		int_day = Math.floor(time_distance/86400);
		time_distance -= int_day * 86400;
		// 相减的差数换算成小时
		int_hour = Math.floor(time_distance/3600);
		time_distance -= int_hour * 3600;
		// 相减的差数换算成分钟
		int_minute = Math.floor(time_distance/60);  
		time_distance -= int_minute * 60; 
		// 相减的差数换算成秒数
		int_second = Math.floor(time_distance);
		
		// 判断小时小于10时，前面加0进行占位
		if(int_hour < 10){
			int_hour = "0" + int_hour;
		} 
		// 判断分钟小于10时，前面加0进行占位
		if(int_minute < 10){
			int_minute = "0" + int_minute;
		} 
		// 判断秒数小于10时，前面加0进行占位
		if(int_second < 10){
			int_second = "0" + int_second;
		}
		// 显示倒计时效果
		var tmSec = int_day + '天 ' + int_hour + '时 ' + int_minute + '分 ' + int_second + '秒';
		$("#countDown").html("交卷倒计时："+tmSec);
	}else{
		submitShiJuan();
	}
	if(flag){
		timeID = setTimeout("count_down()",1000);
	}
}
/**
 * 单选 多选 判断
 * 
 * @param obj
 */
function choose(obj){
	var tid=$(obj).attr("stId");
	if($(obj).attr("checked")==false){
		$("li[id='biao_"+tid+"']").removeClass("blue");
	}else{
		$("li[id='biao_"+tid+"']").addClass("blue");
	}
}
function tiankong(obj){
	var tid=$(obj).attr("stId");
	var flag = false;
	$(obj).parent().find(".kong").each(function(){
		if($(obj).val()!=""){
			flag = true;
		}
	});
	if(flag){
		$("li[id='biao_"+tid+"']").addClass("blue");
	}else{
		$("li[id='biao_"+tid+"']").removeClass("blue");
	}
}
// 简答题
function jianda(obj){
	var tid=$(obj).attr("stId");
	if($(obj).val()==""){
		$("li[id='biao_"+tid+"']").removeClass("blue");
	}else{
		$("li[id='biao_"+tid+"']").addClass("blue");
	}
}
// 添加标记
function add_biaoji(obj){
	var tid=$(obj).attr("stId");
	$(obj).attr("onclick","del_biaoji(this)");
	$("li[id='biao_"+tid+"']").addClass("org");
}
// 删除标记
function del_biaoji(obj){
	var tid=$(obj).attr("stId");
	$(obj).attr("onclick","add_biaoji(this)");
	$("li[id='biao_"+tid+"']").removeClass("org");
}
// 显示提交成功
function successPop() {
	//考试名称
	var examName=examData.examName;
	//总分
	var examTotalScore=examData.totalScore;
	//及格分
	var okrate=examData.okrate;
	// 浏览器可见区域的高度
	var wHeight=$(window).height();
	// 浏览器可见区域的宽度
	var dWidth=$(window).width();
	var popHeight= $("#chengjiDiv").height();
	var popWidth= $("#chengjiDiv").width();
	var height=(wHeight-popHeight)/2;
	var width=(dWidth-popWidth)/2;
	$("#chengjiDiv").css("left",width+"px");
	$("#chengjiDiv").show();
	//考试名称
	$("#examName").text("考试名称："+examName);
	//考试总分
	$("#totalScore").text("考试总分："+examTotalScore);
	$("#okrateScore").text("及格分："+okrate);
	$("#defen").text("我的得分："+totalScore);
	if(jigeStatus==0){
		$("#examDesc").text("抱歉！您未及格请点击确定按钮继续考试！");
	}else if(jigeStatus==1){
		$("#examDesc").text("恭喜您已经及格！");
	}else if(jigeStatus==2){
		$("#examDesc").text("恭喜您已及格并获得相应证书！");
	}
	//打开遮罩层
	show();
}
// 显示保存成功
function saveSuccessPop() {
	// 浏览器可见区域的高度
	var wHeight=$(window).height();
	// 浏览器可见区域的宽度
	var dWidth=$(window).width();
	var popHeight= $("#savePop").height();
	var popWidth= $("#savePop").width();
	var height=(wHeight-popHeight)/2;
	var width=(dWidth-popWidth)/2;
	$("#savePop").css("top",height+$(document).scrollTop());
	$("#savePop").css("left",width+"px");
	$("#savePop").show();
	setTimeout('close()', 2000);
}
function close(){
	$("#savePop").hide();
}
/**
 * 考试加载缓存
 */
function loading() {
	// 浏览器可见区域的高度
	var wHeight=$(window).height();
	// 浏览器可见区域的宽度
	var dWidth=$(window).width();
	var popHeight= $("#loading").height();
	var popWidth= $("#loading").width();
	var height=(wHeight-popHeight)/2;
	var width=(dWidth-popWidth)/2;
	$("#loading").css("top",height+$(document).scrollTop());
	$("#loading").css("left",width+"px");
	$("#loading").show();
}
/**
 * 逐题模式
 */
function zhuti(){
	$(".duanluo").hide();
	$(".shitiTable").hide();
	var did=$("#shiti_1").attr("did");
	$("#duanluo"+did).show();
	$("#shiti_1").show();
	$("#button").show();
	$("#up").hide();
}
/**
 * 上一题
 */
function up(){
	var idStr = $(".shitiTable:visible:first").attr("id");
	var id = parseInt(idStr.substring(6,idStr.lengh));
	if((id-1)==1){
		$("#up").hide();
	}
	$("#down").show();
	$("#shiti_"+id).hide();
	$("#shiti_"+(id-1)).show();
	var did=parseInt($("#shiti_"+(id-1)).attr("did"));
	$("#duanluo"+did).show();
	$("#duanluo"+(did+1)).hide();
}
/**
 * 下一题
 */
function down(){
	var idStr = $(".shitiTable:visible:last").attr("id");
	var id = parseInt(idStr.substring(6,idStr.lengh));
	if(id==shitiTotal-1){
		$("#down").hide();
	}
	$("#up").show();
	$("#shiti_"+id).hide();
	$("#shiti_"+(id+1)).show();
	var did=parseInt($("#shiti_"+(id+1)).attr("did"));
	$("#duanluo"+(did-1)).hide();
	$("#duanluo"+did).show();
}
function showQsn(qsnindex){
	if(pageModel==1){
		// 逐题模式
		$(".shitiTable").hide();
		$(".duanluo").hide();
		$("#shiti_"+qsnindex).show();
		var did=parseInt($("#shiti_"+(qsnindex+1)).attr("did"));
		$("#duanluo"+did).show();
		$("#up").show();
		$("#down").show();
		if(qsnindex==shitiTotal){
			$("#down").hide();
		}
		if(qsnindex==1){
			$("#up").hide();
		}
	}else{
		//由于提交及答题卡浮动所以锚点跳上一题，如果是阅读理解题则定位无法精确
		if(qsnindex > 1){
			location.hash='#dl_qsn_'+(qsnindex-1);
		}else{
			location.hash='#dl_qsn_1';
		}
	}
}
/** 
 * 删除数组中指定值 
 */
Array.prototype.remove=function(key){
var len = this.length;
	for(var i=0,n=0;i<len;i++){//把出了要删除的元素赋值给新数组    
		if(i!=key){
			this[n++]=this[i];  
		}else{
			console.log(i);//测试所用  
		}
	}
	this.length = n;
};

/**
 * 打开遮罩层
 */
function show() {
	$("body").append(mask);
	resize();
	mask.show();
}

/**
 * 关闭遮罩层
 */
function hide() {
	$(window).off("resize", calculateSize);
	mask.hide();
}
/**
 * 计算遮罩层的高度和宽度
 */
function calculateSize() {
	var b = document.documentElement.clientHeight ? document.documentElement : document.body,
	height = b.scrollHeight > b.clientHeight ? b.scrollHeight : b.clientHeight,
	width = b.scrollWidth > b.clientWidth ? b.scrollWidth : b.clientWidth;
	
	mask.css({height: height, width: width});
}
/**
 * 设置遮罩层的大小
 */
function resize() {
	calculateSize();
	$(window).on("resize", calculateSize);
}
//时间停止
function stopTime(){
	if(timeID != ''){
		clearTimeout(timeID);
	}
	if(time_distance!=0){
		$("#timer").val(time_distance);
	}
	//清理自动保存时间
	clearTimeout(saveTimer);
}