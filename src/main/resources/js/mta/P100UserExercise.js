var allids="";
// 计时器Id
var shitiTotal=0;
var totalScore=0;
var uuid="";
var xuanX=["","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
$(function() {
	$(window).scroll(function () {
		if ($(window).scrollTop() > 200) {
			$(".testNyLeft").css({position:"fixed",top:"40px"});
			$(".testTop").css({position:"fixed",top:"-15px"});
		}else{
			$(".testNyLeft").css({position:"",top:""});
			$(".testTop").css({position:"",top:""});
		}
	});
	if (!Array.prototype.indexOf)
	{
	  Array.prototype.indexOf = function(elt /*, from*/)
	  {
	    var len = this.length >>> 0;

	    var from = Number(arguments[1]) || 0;
	    from = (from < 0)
	         ? Math.ceil(from)
	         : Math.floor(from);
	    if (from < 0)
	      from += len;

	    for (; from < len; from++)
	    {
	      if (from in this &&
	          this[from] === elt)
	        return from;
	    }
	    return -1;
	  };
	}
	$.ajax({
		url:baseUrl + '/mta/P100/findSjInfoById.html',
		data:{sid:sjId},
		type: 'post',
		dataType: 'json',
		success:function(data){
			loadSjDl(data);
		}
	});
});
function loadSjDl(data){
	// 请求试卷信息
	/**
	 * 段落信息 1~N为对应段落数据，包含t:段落标题，ids：试题ID集合，fen：分值，t可以为空 allids:全部固定试题ID，应用于编辑试卷。
	 */
	var dlData=eval("("+data.dDlmix+")");
	/**
	 * 随机选题 后台重组此数据，所以与数据库中不同 fen：分值 did：段落ID data：试题数据
	 */
	var xtData=eval("("+data.dXtmix+")");
	
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
//		X.find("h2:eq("+index+")").parent().append(stNumUlHtml);
		X.append(stNumUlHtml);
		var stNumHtml="";
		var shitiLength=idArray.length-1;
		for(var qsn in qsnData){
			var oldid=qsnData[qsn].qsnid+"";
			// 循环所有试题数据
			if(idArray.indexOf(oldid)>-1){
				// 如果试题ID是此段落试题则追加试题HTML
				var qsnHtml='<table class="shitiTable" id="shiti_'+qsnIndex+'" did="'+index+'" shitiId='+qsnData[qsn].qsnid+' border="0" cellpadding="0" cellspacing="0">';
				stNumHtml+='<li class="xuanxiangkaNumber_'+index+'" id="biao_'+qsnData[qsn].qsnid+'" style="border-top: 1px solid #ccc;"><a href="'+baseUrl+'/mta/P100/goExercise.html?eeUuid='+uuid+'#dl_qsn_'+qsnIndex+'">'+qsnIndex+'</a></li>';
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
				stNumHtml+='<li class="xuanxiangkaNumber_'+index+'" id="biao_'+item.qsnid+'" style="border-top: 1px solid #ccc;"><a href="'+baseUrl+'/mta/P100/goExercise.html?eeUuid='+uuid+'#dl_qsn_'+qsnIndex+'">'+qsnIndex+'</a></li>';
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
	// 试题标题
	var daan=qsnData.daan;
	var gdQsnHtml='<tr id="dl_qsn_'+qindex+'" suiji="0" jieda="'+qsnData.jieda+'" class="shiti" shitiId="'+qsnData.qsnid+'" fen="'+qsnfen+'" shitiType="'+qsnData.shititypeid+'"><th colspan="3" align="left">第'+qindex+'题:<span class="title">'+qsnData.title+'</span>（分值：'+qsnfen+'分） </th>'
	+'<th width="100"><input type="hidden" id="hidden_'+qindex+'" value=\''+daan+'\'/><a qind="'+qindex+'" onclick="add_biaoji(this)" class="biaoji" stId="'+qsnData.qsnid+'" href="javascript:;"><img src="resources/mta/images/seeAnswer.png" width="90" height="33" alt="标记" /></a></th></tr>';
	// 单选题
	if("xx" in qsnData && qsnData.shititypeid == 1){
		gdQsnHtml += '<tr><td width="720"><ol>';
		var xxdata=eval("("+qsnData.xx+")");
		var keys=[];
		for(var xxNum in xxdata){
			keys.push(xxNum);
		}
		keys.sort(function(a,b){
            return a-b;}
		);
		for(var i=0; i<keys.length; i++){
			xxNum = keys[i];
		//for(var xxNum in xxdata){
			gdQsnHtml +='<li indexid='+qindex+'_'+xxNum+' >';
			gdQsnHtml +='<input name="danxuan_'+qindex+'_xx" value="'+xxNum+'" stId="'+qsnData.qsnid+'" type="radio" id="danxuan_'+qindex+'_'+xxNum+'_xx" onclick="choose(this)" class="inputStyle"/>';
			gdQsnHtml +=xxdata[xxNum].xx+'</li>';
		}
		gdQsnHtml += '</ol></td></tr><tr id="qsn_daan_'+qsnData.qsnid+'" daan=\''+daan+'\' style="display:none;"><td><h4><img style="display:none" id="qsn_daan_'+qsnData.qsnid+'_right" width="16" height="16" src="resources/images/ok.png"/><img style="display:none" id="qsn_daan_'+qsnData.qsnid+'_wrong" width="16" height="16" src="resources/images/cancel.png"/><br/>正确答案：'+xuanX[parseInt(daan)]+'</h4></td></tr>';
	}
	// 多选题
	if("xx" in qsnData && qsnData.shititypeid == 2){
		var daanArray=daan.split(",");
		for(var ii=0;ii<daanArray.length;ii++){
			daanArray[ii]=xuanX[parseInt(daanArray[ii])];
		}
		gdQsnHtml += '<tr><td width="720"><ol>';
		var xxdata=eval("("+qsnData.xx+")");
		var keys=[];
		for(var xxNum in xxdata){
			keys.push(xxNum);
		}
		keys.sort(function(a,b){
            return a-b;}
		);
		for(var i=0; i<keys.length; i++){
			xxNum = keys[i];
		//for(var xxNum in xxdata){
			gdQsnHtml +='<li indexid='+qindex+'_'+xxNum+' >';
			gdQsnHtml +='<input name="duoxuan_'+qindex+'_xx" value="'+xxNum+'" stId="'+qsnData.qsnid+'" type="checkbox" id="duoxuan_'+qindex+'_'+xxNum+'_xx" onclick="choose(this)" class="inputStyle"/>';
			gdQsnHtml +=xxdata[xxNum].xx+'</li>';
		}
		gdQsnHtml += '</ol></td></tr>';
		gdQsnHtml +='<tr id="qsn_daan_'+qsnData.qsnid+'" daan=\''+daan+'\' style="display:none;"><td>'+
		'<h4><img style="display:none" id="qsn_daan_'+qsnData.qsnid+'_right" width="16" height="16" src="resources/images/ok.png"/>'+
		'<img style="display:none" id="qsn_daan_'+qsnData.qsnid+'_wrong" width="16" height="16" src="resources/images/cancel.png"/><br/>'+
		'正确答案：'+daanArray.join(",")+'</h4></td></tr>';
	}
	// 判断题
	if(qsnData.shititypeid == 3){
		var rdaan="对";
		if(daan==0){
			rdaan="错";
		}
		gdQsnHtml +='<tr><td width="720"><ol>';
		gdQsnHtml +='<li indexid='+qindex+'_1 >';
		gdQsnHtml +='<input name="panduan_'+qindex+'_daan" type="radio" value="1" stId="'+qsnData.qsnid+'" id="panduan_'+qindex+'_1_daan" onclick="choose(this)" class="inputStyle"/>';
		gdQsnHtml +='√</li>';

		gdQsnHtml +='<li indexid='+qindex+'_0 >';
		gdQsnHtml +='<input name="panduan_'+qindex+'_daan" type="radio" value="0" stId="'+qsnData.qsnid+'" id="panduan_'+qindex+'_0_daan" onclick="choose(this)" class="inputStyle"/>';
		gdQsnHtml +='×</li>';
		gdQsnHtml += "</ol></td></tr>";
		gdQsnHtml +='<tr id="qsn_daan_'+qsnData.qsnid+'" daan=\''+daan+'\' style="display:none;"><td>'+
		'<h4><img style="display:none" id="qsn_daan_'+qsnData.qsnid+'_right" width="16" height="16" src="resources/images/ok.png"/>'+
		'<img style="display:none" id="qsn_daan_'+qsnData.qsnid+'_wrong" width="16" height="16" src="resources/images/cancel.png"/><br/>'+
		'正确答案：'+rdaan+'</h4></td></tr>';
	}
	// 填空题
	if(qsnData.shititypeid == 4){
		var rdaan="";
		gdQsnHtml += '<tr><th colspan="3" align="left">';
		var kongsData=eval("("+qsnData.daan+")");
		for(var ki in kongsData){
			var kongArray=kongsData[ki].kong.split("#");
			gdQsnHtml +="空"+ki;
			for(var kai=0;kai<kongArray.length;kai++){
				if(kai==0){
					rdaan+="空"+ki+"正确答案:"+kongArray[kai]+"&nbsp;&nbsp;";
					gdQsnHtml += '<input type="text" stId="'+qsnData.qsnid+'" onchange="tiankong(this)" class="kong" name="tk_'+qindex+'" id="tabletextfield" />';
				}else{
				    if(kongArray[kai] != ''){
    					rdaan+="空"+ki+"备选答案:"+kongArray[kai]+"&nbsp;&nbsp;";
				    }
				}
			}
			rdaan+="<br/>";
		}
		gdQsnHtml += "<br/>";
		gdQsnHtml += '</th></tr>';
		gdQsnHtml +='<tr id="qsn_daan_'+qsnData.qsnid+'" daan=\''+daan+'\' style="display:none;"><td colspan="3">'+
		'<h4>'+rdaan+'</h4></td></tr>';
	}
	// 简答题
	if(qsnData.shititypeid == 5){
		gdQsnHtml += '<tr>';
		gdQsnHtml +='<td width="40">&nbsp;</td>';
		gdQsnHtml +='<td width="680"><textarea name="jianda_'+qindex+'" onchange="jianda(this)" class="jiandaInput" stId="'+qsnData.qsnid+'" id="tabletextarea" cols="45" rows="5"></textarea></td>';
		gdQsnHtml +='<td colspan="2"></td>';
		gdQsnHtml +='</tr>';
		gdQsnHtml +='<tr id="qsn_daan_'+qsnData.qsnid+'" daan=\''+daan+'\' style="display:none;"><td colspan="4">'+
		'<h4>正确答案：'+daan+'</h4></td></tr>';
	}
	// 阅读理解
	if("data" in qsnData && qsnData.shititypeid == 6){
		/**
		 * 阅读理解子试题中试题数据 tx：题型；daan：答案；title：试题标题；xx：选项；
		 */
		var zhQsnData=eval("("+qsnData.data+")");
		for(var cindex in zhQsnData){
			var childData=zhQsnData[cindex];
			var tx="";
			if(childData.tx=="danxuan"){
				tx="单选题";
			}else if(childData.tx=="duoxuan"){
				tx="不定项选择题";
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
				var keys=[];
				for(var xxNum in xxdata){
					keys.push(xxNum);
				}
				keys.sort(function(a,b){
		            return a-b;}
				);
				for(var i=0; i<keys.length; i++){
					xxNum = keys[i];
				//for(var xxNum in xxdata){
					gdQsnHtml +='<li indexid='+qindex+'_'+cindex+'_'+xxNum+' >';
					gdQsnHtml +='<input name="danxuan_'+qindex+'_'+cindex+'_xx" stId="'+qsnData.qsnid+'" value="'+xxNum+'" type="radio" id="danxuan_'+qindex+'_'+cindex+'_'+xxNum+'_xx" onclick="choose(this)" class="inputStyle"/>';
					gdQsnHtml +=xxdata[xxNum].xx+'</li>';
				}
				gdQsnHtml += '</ol></td></tr>';
				gdQsnHtml +='<tr name="qsn_daan_'+qsnData.qsnid+'"  style="display:none;"><td colspan="3">'+
				'<h4>正确答案：'+xuanX[parseInt(childData.daan)]+'</h4></td></tr>';
			}
			// 多选
			if(childData.tx=="duoxuan" && "xx" in childData){
				//var daanArray="";
				var daanArray=childData.daan.split(",");
				for(var ii=0;ii<daanArray.length;ii++){
					daanArray[ii]=xuanX[parseInt(daanArray[ii])];
				}
				gdQsnHtml += '<tr class="yudu" tx="duoxuan"><td width="720"><ol>';
				var xxdata=childData.xx;
				var keys=[];
				for(var xxNum in xxdata){
					keys.push(xxNum);
				}
				keys.sort(function(a,b){
		            return a-b;}
				);
				for(var i=0; i<keys.length; i++){
					xxNum = keys[i];
				//for(var xxNum in xxdata){
					gdQsnHtml +='<li indexid='+qindex+'_'+cindex+'_'+xxNum+' >';
					gdQsnHtml +='<input name="duoxuan_'+qindex+'_'+cindex+'_xx" stId="'+qsnData.qsnid+'" value="'+xxNum+'" type="checkbox" id="duoxuan_'+qindex+'_'+cindex+'_xx" onclick="choose(this)" class="inputStyle"/>';
					gdQsnHtml +=xxdata[xxNum].xx+'</li>';
				}
				gdQsnHtml += '</ol></td></tr>';
				gdQsnHtml +='<tr name="qsn_daan_'+qsnData.qsnid+'"  style="display:none;"><td colspan="3">'+
				'<h4>正确答案：'+daanArray.join(",")+'</h4></td></tr>';
			}
			// 判断
			if(childData.tx=="panduan"){
				var daan="对";
				if(childData.daan==0){
					daan="错";
				}
				gdQsnHtml +='<tr class="yudu" tx="panduan"><td width="720"><ol>';
				gdQsnHtml +='<li indexid='+qindex+'_'+cindex+'_1 >';
				gdQsnHtml +='<input name="panduan_'+qindex+'_'+cindex+'_daan" stId="'+qsnData.qsnid+'" value="1" type="radio" id="panduan_'+qindex+'_'+cindex+'_1_daan" onclick="choose(this)" class="inputStyle"/>';
				gdQsnHtml +='√</li>';
				
				gdQsnHtml +='<li indexid='+qindex+'_0 >';
				gdQsnHtml +='<input name="panduan_'+qindex+'_'+cindex+'_daan" stId="'+qsnData.qsnid+'" value="0" type="radio" id="panduan_'+qindex+'_'+cindex+'_0_daan" onclick="choose(this)" class="inputStyle"/>';
				gdQsnHtml +='×</li>';
				gdQsnHtml += "</ol></td></tr>";
				gdQsnHtml +='<tr name="qsn_daan_'+qsnData.qsnid+'"  style="display:none;"><td colspan="3">'+
				'<h4>正确答案：'+daan+'</h4></td></tr>';
			}
			// 简答
			if(childData.tx=="jianda"){
				gdQsnHtml += '<tr class="yudu" tx="jianda">';
				gdQsnHtml +='<td width="40">&nbsp;</td>';
				gdQsnHtml +='<td width="680"><textarea onchange="jianda(this)" class="jiandaInput" name="jianda_'+qindex+'_'+cindex+'"  stId="'+qsnData.qsnid+'" id="tabletextarea" cols="45" rows="5"></textarea></td>';
				gdQsnHtml +='<td colspan="2"></td>';
				gdQsnHtml +='</tr>';
				gdQsnHtml +='<tr name="qsn_daan_'+qsnData.qsnid+'"  style="display:none;"><td colspan="3">'+
				'<h4>正确答案：'+childData.daan+'</h4></td></tr>';
			}
		}
	}
	return gdQsnHtml;
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
	var qind=$(obj).attr("qind");
	$("li[id='biao_"+tid+"']").addClass("org");
	$("#qsn_daan_"+tid).show();
	var trObj=$(obj).parent().parent();
	var sttype=$(trObj).attr("shitiType");
	if(sttype==1){
		var answer=$("input[name=danxuan_"+qind+"_xx]:checked").val();
		var rightAnswer=$("#qsn_daan_"+tid).attr("daan");
		if(answer==rightAnswer){
			$('#qsn_daan_'+tid+'_wrong').hide();
			$('#qsn_daan_'+tid+'_right').show();
		}else{
			$('#qsn_daan_'+tid+'_right').hide();
			$('#qsn_daan_'+tid+'_wrong').show();
		}
		$("input[name=danxuan_"+qind+"_xx]").attr("disabled",true);
	}else if(sttype==2){
		var answerItems=$("input[name=duoxuan_"+qind+"_xx]:checked");
		var chk_value =[];    
		$(answerItems).each(function(){    
			chk_value.push($(this).val());    
		});
		var answer=chk_value.join(",");
		var rightAnswer=$("#qsn_daan_"+tid).attr("daan");
		if(answer==rightAnswer){
			$('#qsn_daan_'+tid+'_wrong').hide();
			$('#qsn_daan_'+tid+'_right').show();
		}else{
			$('#qsn_daan_'+tid+'_right').hide();
			$('#qsn_daan_'+tid+'_wrong').show();
		}
		$("input[name=duoxuan_"+qind+"_xx]").attr("disabled",true);
	}else if(sttype==3){
		var answer=$("input[name=panduan_"+qind+"_daan]:checked").val();
		var rightAnswer=$("#qsn_daan_"+tid).attr("daan");
		if(answer==rightAnswer){
			$('#qsn_daan_'+tid+'_wrong').hide();
			$('#qsn_daan_'+tid+'_right').show();
		}else{
			$('#qsn_daan_'+tid+'_right').hide();
			$('#qsn_daan_'+tid+'_wrong').show();
		}
		$("input[name=panduan_"+qind+"_daan]").attr("disabled",true);
	}else if(sttype==6){
		$("tr[name=qsn_daan_"+tid+"]").show();
	}
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

