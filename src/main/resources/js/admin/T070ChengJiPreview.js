var allids="";
var dnandata;//固定答案
var rdaandata;//随机答案
$(function() {
	//加载试卷提示信息
	$.messager.progress({
		msg:'正在生成试卷，请稍后...',
		text:'loading'
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
	$.post(baseUrl +"/admin/T070/getMyShiJuanInfo.html",{id:id},function(data){
		loadSjDl(data);
	},"json");
	
});
var xuanX=["","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
function loadSjDl(data){
	dnandata=eval("("+data.dnandata+")");//固定答案
	rdaandata=eval("("+data.rdaandata+")");//随机答案
	
	//请求试卷信息
	/**
	 * 段落信息
	 * 1~N为对应段落数据，包含t:段落标题，ids：试题ID集合，fen：分值，t可以为空
	 * allids:全部固定试题ID，应用于编辑试卷。
	 */
	var dlData=eval("("+data.dDlmix+")");
	/**
	 * 随机选题
	 * 后台重组此数据，所以与数据库中不同
	 * fen：分值
	 * did：段落ID
	 * data：试题数据
	 */
	var xtData=eval("("+data.dXtmix+")");
	/**
	 * 试题数据
	 * index:段落试题索引 如：1_7258,1段落索引，7258试题ID
	 * data：试题数据
	 */
	var stData=eval("("+data.dShitimix+")");
	//试卷标题
	$("#sjTitle").html("<span style='text-align:center'>试卷名称： "+data.kstitle+"&nbsp&nbsp&nbsp&nbsp&nbsp考生姓名："+data.username+"&nbsp&nbsp&nbsp&nbsp&nbsp试卷总分："+data.totalsorce+"&nbsp&nbsp&nbsp&nbsp&nbsp考生得分："+data.sorce+"</span>");
	//保存所有试题ID
	allids=dlData.allids;
	//删除段落数据中所有试题ID
	delete dlData.allids;
	//段落索引
	var dlIndex=1;
	//HTML写入容器
	var C = $("#Container");
	//试题索引
	var qsnIndex=1;
	for(var index in dlData){
		//循环段落
		var dlTitle=dlData[dlIndex+""].t;
		if(dlTitle != "" && dlTitle != null){
			//如果段落标题不为空，则向C中追加段落标题
			var titleHtml="<div class=\"panel_qsn\" id=\"dl_"+dlIndex+"\">"+
				"<div style='float:left;width:80%'><h3>"+dlTitle+"</h3></div>"+
				"<div style='float:right;width:15%'><h3>（每题"+dlData[dlIndex+""].fen+"分）</h3></div>"+
				"<div class=\"clear\"></div>"+
				"</div>";
			C.append(titleHtml);
		}
		//段落KEY
		var key=dlIndex+"";
		//试题数据
		var qsnData=stData.data;
		//段落中的固定试题集合重组Array
		var idArray=dlData[dlIndex+""].ids.split(",");
		var num=1;
		for(var qsn in qsnData){
			var oldid=qsnData[qsn].qsnid+"";
			//循环所有试题数据
			if(idArray.indexOf(oldid)>-1){
				
				
				//如果试题ID是此段落试题则追加试题HTML
				var qsnHtml=loadQsnInfo(qsnIndex,qsnData[qsn],qsnData[qsn].fen,0);
				C.append(qsnHtml);
				qsnIndex++;
				if(num==idArray.length-1){
					num=1;
					break;
				}
				num++;
				//考虑试题不会重复则终止循环
				delete stData.data.qsn;
			}
		}
		/**
		 * 随机选题
		 * key是段落索引的字符串型，如果在随机试题数据中包含段落索引的key则代表此段落有随机选题
		 */
		if( key in xtData){
			/**
			 * 后台组成的随机试题数据
			 */
			var sjdata=xtData[key].data;
			//具体组成试题HTML方式与固定试题类似
			for(var i=0;i<sjdata.length;i++){
				var item=sjdata[i];
				var qsnHtml=loadQsnInfo(qsnIndex,item,xtData[key].fen,1);
				if(qsnIndex > 1 && key == item.did+""){
					//如果已加载试题数>1向上一道试题信息HTML后追加html
					$("#dl_qsn_"+(qsnIndex-1)).after(qsnHtml);
				}else{
					C.append(qsnHtml);
				}
				qsnIndex++;
			}
		}
		dlIndex++;
	}
	//试题信息加载完成关闭提示框
	$.messager.progress('close');
	//添加点击事件，点击radio或checkbox所在行选中对应控件
	$("a.li_a_span").click(function(){
		var item=$(this).children("input");
		var itemType=$(item).attr("type");
		if(itemType=="radio"){
			$(item).prop("checked",true);
			return;
		}
		if(itemType=="checkbox"){
			$(item).click();
			return;
		}
	});
}
function loadQsnInfo(qindex,qsnData,qsnfen,ststate){
	//试题标题
	var gdQsnHtml="<div class=\"panel_qsn\" id=\"dl_qsn_"+qindex+"\">"+
				"<div class=\"div_left\">"+
				"<span style=\"font-weight: bold;font-size:20pt !important;\">"+qindex+".</span>"+
				"<br/>"+
				"<span style=\"font-weight: bold;font-size:10pt !important;color:#9cc8f7;\">"+qsnfen+"分</span>"+
				"</div>"+
				"<div class=\"div_right\">"+
				"<div class=\"div_qsn_title\">"+qsnData.title+"</div>";
	var ksdaan;
	var qsnid=qsnData.qsnid;
	var daan;
	var tdes="";
	if(ststate==0 && qsnData.shititypeid<6){
		daan=qsnData.daan;
		for(var i=0;i<dnandata.length;i++){
			if(dnandata[i].sid==qsnid){
				ksdaan=dnandata[i].ksdaan;
				defen=dnandata[i].defen;
				if(qsnData.shititypeid==5){
					tdes=dnandata[i].tdes;
				}
				//dnandata.remove(i);
				break;
			}
			
		}		
	}else if(ststate==1 && qsnData.shititypeid<6){
		daan=qsnData.daan;
		for(var i=0;i<rdaandata.length;i++){
			if(rdaandata[i].sid==qsnid){
				defen=rdaandata[i].defen;
				ksdaan=rdaandata[i].ksdaan;
				//rdaandata.remove(i);
				break;
			}
		}	
	}
	//单选题
	if("xx" in qsnData && qsnData.shititypeid == 1){
		gdQsnHtml += "<div class=\"div_qsn_content\"><ol>";
		var xxdata=eval("("+qsnData.xx+")");
		var keys=[];
		for(var xxNum in xxdata){
			keys.push(xxNum);
		}
		keys.sort(function(a,b){
            return a-b}
		);
		for(var i=0; i<keys.length; i++){
			var xxNum=keys[i];
			gdQsnHtml +="<li indexid=\""+qindex+"_"+xxNum+"\" >" ;
			if(xxNum==ksdaan){
				//根据答案选中
				gdQsnHtml +="<a class=\"li_a_span\"><input type='radio' " +
					"id=\"danxuan_"+qindex+"_"+xxNum+"_xx\"" +
					" class=\"inputStyle\" " +
					"name=\"danxuan_"+qindex+"_xx\" checked=\"checked\"/>"+xxdata[xxNum].xx+"</a>";
			}else{
				gdQsnHtml +="<a class=\"li_a_span\"><input type='radio' " +
					"id=\"danxuan_"+qindex+"_"+xxNum+"_xx\"" +
					" class=\"inputStyle\" " +
					"name=\"danxuan_"+qindex+"_xx\"/>"+xxdata[xxNum].xx+"</a>";
			}
			gdQsnHtml +="</li>";
		}
		//gdQsnHtml+="问题id:"+qsnid;
		//gdQsnHtml+="正确答案:"+daan;
		//gdQsnHtml+="考生答案:"+ksdaan;
		//gdQsnHtml+="<div class=\"div_qsn_answer\">正确答案："+daan+"</div>";
		//gdQsnHtml+="<div class=\"div_qsn_answer\">正确答案："+xuanX[daan]+"</div>";
		gdQsnHtml += "</ol></div>";
	}
	//多选题
	if("xx" in qsnData && qsnData.shititypeid == 2){
		gdQsnHtml += "<div class=\"div_qsn_content\">"+
		"<ol>";
		var xxdata=eval("("+qsnData.xx+")");
		var keys=[];
		for(var xxNum in xxdata){
			keys.push(xxNum);
		}
		keys.sort(function(a,b){
            return a-b}
		);
		//var daanArray=qsnData.daan.split(",");
		var daanArray=ksdaan.split(",");
		for(var j =0;j<keys.length;j++){
			var xxNum=keys[j];
			// 解决 IE8 不识别indexOf 方法
			if (!Array.prototype.indexOf){
				Array.prototype.indexOf = function(elt /*, from*/){
				var len = this.length >>> 0;
				var from = Number(arguments[1]) || 0;
					from = (from < 0)? Math.ceil(from): Math.floor(from);
				if (from < 0)
					from += len;
				for (; from < len; from++){
					if (from in this &&this[from] === elt)
						return from;
				}
					return -1;
				};
			}
			//根据答案选中
			if(daanArray.indexOf(xxNum+"") > -1){
				gdQsnHtml +="<li indexid=\""+qindex+"_"+xxNum+"\" >" +
					"<a class=\"li_a_span\"><input type='checkbox' " +
					"id=\"duoxuan_"+qindex+"_"+xxNum+"_xx\"" +
					" class=\"inputStyle\" " +
					"name=\"duoxuan_"+qindex+"_xx\" checked=\"checked\"/>"+xxdata[xxNum].xx+"</a></li>";
			}else{
				gdQsnHtml +="<li indexid=\""+qindex+"_"+xxNum+"\" >" +
					"<a class=\"li_a_span\"><input type='checkbox' " +
					"id=\"duoxuan_"+qindex+"_"+xxNum+"_xx\"" +
					" class=\"inputStyle\" " +
					"name=\"duoxuan_"+qindex+"_xx\"/>"+xxdata[xxNum].xx+"</a></li>";
			}
		}
		gdQsnHtml += "</ol>"+
		"</div>";
	}
	//判断题
	if(qsnData.shititypeid == 3){
//		var daan=qsnData.daan;
		gdQsnHtml += "<div class=\"div_qsn_content\">"+
		"<ol>";
		if(ksdaan == "1"){
			gdQsnHtml +="<li indexid=\""+qindex+"_1\" >" +
						"<a class=\"li_a_span\"><input type='radio' " +
						"id=\"panduan_"+qindex+"_1_daan\"" +
						" class=\"inputStyle\" " +
						"name=\"panduan_"+qindex+"_daan\" checked=\"checked\"/>√</a></li>";
			gdQsnHtml +="<li indexid=\""+qindex+"_0\" >" +
						"<a class=\"li_a_span\"><input type='radio' " +
						"id=\"panduan_"+qindex+"_0_daan\"" +
						" class=\"inputStyle\" " +
						"name=\"panduan_"+qindex+"_daan\" />×</a></li>";
		}else if(ksdaan == "0"){
			gdQsnHtml +="<li indexid=\""+qindex+"_1\" >" +
						"<a class=\"li_a_span\"><input type='radio' " +
						"id=\"panduan_"+qindex+"_1_daan\"" +
						" class=\"inputStyle\" " +
						"name=\"panduan_"+qindex+"_daan\" />√</a></li>";
			gdQsnHtml +="<li indexid=\""+qindex+"_0\" >" +
						"<a class=\"li_a_span\"><input type='radio' " +
						"id=\"panduan_"+qindex+"_0_daan\"" +
						" class=\"inputStyle\" " +
						"name=\"panduan_"+qindex+"_daan\" checked=\"checked\"/>×</a></li>";
		}else{
			gdQsnHtml +="<li indexid=\""+qindex+"_1\" >" +
						"<a class=\"li_a_span\"><input type='radio' " +
						"id=\"panduan_"+qindex+"_1_daan\"" +
						" class=\"inputStyle\" " +
						"name=\"panduan_"+qindex+"_daan\" />√</a></li>";
			gdQsnHtml +="<li indexid=\""+qindex+"_0\" >" +
						"<a class=\"li_a_span\"><input type='radio' " +
						"id=\"panduan_"+qindex+"_0_daan\"" +
						" class=\"inputStyle\" " +
						"name=\"panduan_"+qindex+"_daan\"/>×</a></li>";
		}
		gdQsnHtml += "</ol>"+
		"</div>";
	}
	//填空题
	if(qsnData.shititypeid == 4){
		gdQsnHtml += "<div class=\"div_qsn_content\ style=\"font-size:10pt !important;\">";
		// var kongsData=eval("("+qsnData.daan+")");
		var kongsData=eval("("+qsnData.daan+")");
		var keys=[];
		for(var xxNum in kongsData){
			keys.push(xxNum);
		}
		keys.sort(function(a,b){
			return a-b}
		);
		for(var ki=1;ki< keys.length+1;ki++){
			var kongArray=kongsData[ki].kong.split("#");
			gdQsnHtml +="填空"+ki;
			for(var kai=0;kai<kongArray.length;kai++){
				if(kai==0){
					gdQsnHtml += "标准答案：<input type='text' class=\"input_user_info\" value=\""+kongArray[kai]+"\"/>";
				}else{
					gdQsnHtml += "备选答案"+kai+"：<input type='text' class=\"input_user_info\" value=\""+kongArray[kai]+"\"/>";
				}
				
			}
			gdQsnHtml += "<br/><br/>";
		}
		gdQsnHtml += "</div>";
	}
	//简答题
	if(qsnData.shititypeid == 5){
		gdQsnHtml += "<div class=\"div_qsn_answer\" style=\"font-size:10pt !important;margin-bottom:20px;\">" +
						"<div class=\"div_qsn_answer_left\">答案：</div>" +
						"<div class=\"div_qsn_answer_right\"><div class=\"div_qsn_answer_jx_right\">"+ksdaan+"</div></div>"+
						"<div class=\"clear\"></div>"+		
					"</div>";
	}
	//阅读理解
	if("data" in qsnData && qsnData.shititypeid == 6){
		/**
		 * 阅读理解子试题中试题数据
		 * tx：题型；daan：答案；title：试题标题；xx：选项；
		 */
		var childrenData;
		if(ststate==0){
			for(var i=0;i<dnandata.length;i++){
				if(dnandata[i].sid==qsnid){
					childrenData=dnandata[i].children;
					//dnandata.remove(i);
					break;
				}
			}		
		}else if(ststate==1){
			for(var i=0;i<rdaandata.length;i++){
				if(rdaandata[i].sid==qsnid){
					childrenData=rdaandata[i].children;
					//rdaandata.remove(i);
					break;
				}
			}	
		}
		var zhQsnData=eval("("+qsnData.data+")");
		for(var cindex in zhQsnData){
			
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
			gdQsnHtml += "<div class=\"div_qsn_zuhe_info\">"+
							"<div class=\"div_qsn_title\">"+
							cindex+"."+tx+":"+childData.title
							+"</div>";
			daan=childData.daan;
			ksdaan=childrenData[cindex].ksdaan;
			//单选
			if(childData.tx=="danxuan" && "xx" in childData){
				
				gdQsnHtml += "<div class=\"div_qsn_content\">"+
				"<ol>";
				defen = 0;
				if(typeof(childrenData[cindex].defen)!=="undefined"){
					defen=childrenData[cindex].defen;
				}
				var xxdata=childData.xx;
				var keys=[];
				for(var xxNum in xxdata){
					keys.push(xxNum);
				}
				keys.sort(function(a,b){
		            return a-b}
				);
				for(var i=0; i<keys.length; i++){
					xxNum = keys[i];
					gdQsnHtml +="<li indexid=\""+qindex+"_"+cindex+"_"+xxNum+"\" >" ;
					if(xxNum==ksdaan){
						gdQsnHtml +="<a class=\"li_a_span\"><input type='radio' " +
							"id=\"danxuan_"+qindex+"_"+cindex+"_"+xxNum+"_xx\"" +
							" class=\"inputStyle\" " +
							"name=\"danxuan_"+qindex+"_"+cindex+"_xx\" checked=\"checked\"/>"+xxdata[xxNum].xx+"</a>";
					}else{
						gdQsnHtml +="<a class=\"li_a_span\"><input type='radio' " +
							"id=\"danxuan_"+qindex+"_"+cindex+"_"+xxNum+"_xx\"" +
							" class=\"inputStyle\" " +
							"name=\"danxuan_"+qindex+"_"+cindex+"_xx\"/>"+xxdata[xxNum].xx+"</a>";
					}
					gdQsnHtml +="</li>";
				}
				gdQsnHtml+="<div class=\"div_qsn_answer\">本题得分："+defen+"</div>";
				gdQsnHtml+="<div class=\"div_qsn_answer\">正确答案："+xuanX[daan]+"</div>";
				
				
				gdQsnHtml += "</ol>"+
				"</div>";
			}
			//多选
			if(childData.tx=="duoxuan" && "xx" in childData){
				gdQsnHtml += "<div class=\"div_qsn_content\">"+
				"<ol>";
				defen = 0;
				if(typeof(childrenData[cindex].defen)!=="undefined"){
					defen=childrenData[cindex].defen;
				}
				var xxdata=childData.xx;
				var keys=[];
				for(var xxNum in xxdata){
					keys.push(xxNum);
				}
				keys.sort(function(a,b){
		            return a-b}
				);
				//var daanArray=childData.daan.split(",");
				var daanArray=ksdaan.split(",");
				for(var j =0;j<keys.length;j++){
					var xxNum=keys[j];
					// 解决 IE8 不识别indexOf 方法
					if (!Array.prototype.indexOf){
						Array.prototype.indexOf = function(elt /*, from*/){
						var len = this.length >>> 0;
						var from = Number(arguments[1]) || 0;
							from = (from < 0)? Math.ceil(from): Math.floor(from);
						if (from < 0)
							from += len;
						for (; from < len; from++){
							if (from in this &&this[from] === elt)
								return from;
						}
							return -1;
						};
					}
					if(daanArray.indexOf(xxNum+"") > -1){
						gdQsnHtml +="<li indexid=\""+qindex+"_"+cindex+"_"+xxNum+"\" >" +
							"<a class=\"li_a_span\"><input type='checkbox' " +
							"id=\"duoxuan_"+qindex+"_"+cindex+"_"+xxNum+"_xx\"" +
							" class=\"inputStyle\" " +
							"name=\"duoxuan_"+qindex+"_"+cindex+"_xx\" checked=\"checked\"/>"+xxdata[xxNum].xx+"</a></li>";
					}else{
						gdQsnHtml +="<li indexid=\""+qindex+"_"+cindex+"_"+xxNum+"\" >" +
							"<a class=\"li_a_span\"><input type='checkbox' " +
							"id=\"duoxuan_"+qindex+"_"+cindex+"_"+xxNum+"_xx\"" +
							" class=\"inputStyle\" " +
							"name=\"duoxuan_"+qindex+"_"+cindex+"_xx\"/>"+xxdata[xxNum].xx+"</a></li>";
					}
				}
				if(daan.length>1){
					var daansp=daan.split(",");
					gdQsnHtml+="<div class=\"div_qsn_answer\">本题得分："+defen+"</div>";
					//正确答案
					gdQsnHtml+="<div class=\"div_qsn_answer\">正确答案：";
					for(var i=0;i<daansp.length;i++){
						gdQsnHtml+=xuanX[daansp[i]]+",";
					}
					gdQsnHtml+="</div>";
				}else{
					gdQsnHtml+="<div class=\"div_qsn_answer\">本题得分："+defen+"</div>";
					gdQsnHtml+="<div class=\"div_qsn_answer\">正确答案："+xuanX[daan]+"</div>";
				}
				
				
				gdQsnHtml += "</ol>"+
				"</div>";
			}
			//判断
			if(childData.tx=="panduan"){
				daan=childData.daan;
				ksdaan=childrenData[cindex].ksdaan;
				defen = 0;
				if(typeof(childrenData[cindex].defen)!=="undefined"){
					defen=childrenData[cindex].defen;
				}
				gdQsnHtml += "<div class=\"div_qsn_content\">"+
				"<ol>";
				if(ksdaan == "1"){
					gdQsnHtml +="<li indexid=\""+qindex+"_"+cindex+"_1\" >" +
								"<a class=\"li_a_span\"><input type='radio' " +
								"id=\"panduan_"+qindex+"_"+cindex+"_1_daan\"" +
								" class=\"inputStyle\" " +
								"name=\"panduan_"+qindex+"_"+cindex+"_daan\" checked=\"checked\"/>√</a></li>";
					gdQsnHtml +="<li indexid=\""+qindex+"_"+cindex+"_0\" >" +
								"<a class=\"li_a_span\"><input type='radio' " +
								"id=\"panduan_"+qindex+"_"+cindex+"_0_daan\"" +
								" class=\"inputStyle\" " +
								"name=\"panduan_"+qindex+"_"+cindex+"_daan\" />×</a></li>";
				}else if(ksdaan == "0"){
					gdQsnHtml +="<li indexid=\""+qindex+"_"+cindex+"_1\" >" +
								"<a class=\"li_a_span\"><input type='radio' " +
								"id=\"panduan_"+qindex+"_"+cindex+"_1_daan\"" +
								" class=\"inputStyle\" " +
								"name=\"panduan_"+qindex+"_"+cindex+"_daan\" />√</a></li>";
					gdQsnHtml +="<li indexid=\""+qindex+"_"+cindex+"_0\" >" +
								"<a class=\"li_a_span\"><input type='radio' " +
								"id=\"panduan_"+qindex+"_"+cindex+"_0_daan\"" +
								" class=\"inputStyle\" " +
								"name=\"panduan_"+qindex+"_"+cindex+"_daan\" checked=\"checked\"/>×</a></li>";
				}else{
					gdQsnHtml +="<li indexid=\""+qindex+"_"+cindex+"_1\" >" +
								"<a class=\"li_a_span\"><input type='radio' " +
								"id=\"panduan_"+qindex+"_"+cindex+"_1_daan\"" +
								" class=\"inputStyle\" " +
								"name=\"panduan_"+qindex+"_"+cindex+"_daan\" />√</a></li>";
					gdQsnHtml +="<li indexid=\""+qindex+"_"+cindex+"_0\" >" +
								"<a class=\"li_a_span\"><input type='radio' " +
								"id=\"panduan_"+qindex+"_"+cindex+"_0_daan\"" +
								" class=\"inputStyle\" " +
								"name=\"panduan_"+qindex+"_"+cindex+"_daan\"/>×</a></li>";
				}
				//1对 0错
				gdQsnHtml+="<div class=\"div_qsn_answer\">本题得分："+defen+"</div>";
				gdQsnHtml+="<div class=\"div_qsn_answer\">正确答案：";
				if(daan==1){
					gdQsnHtml+="对";
				}else if(daan==0){
					gdQsnHtml+="错";
				}
				
				gdQsnHtml+="</div>";
				gdQsnHtml += "</ol>"+
				"</div>";
			}
			//简答
			if(childData.tx=="jianda"){
				ksdaan=childrenData[cindex].ksdaan;
				defen = "待评分";
				if(typeof(childrenData[cindex].defen)!=="undefined"){
					defen=childrenData[cindex].defen;
				}
				gdQsnHtml += "<div class=\"div_qsn_answer\" style=\"font-size:10pt !important;margin-bottom:20px;\">" +
								"<div class=\"div_qsn_answer_left\">答案：</div>" +
								"<div class=\"div_qsn_answer_right\"><div class=\"div_qsn_answer_jx_right\">"+ksdaan+"</div></div>"+
								"<div class=\"clear\"></div>"+		
							"</div>";
				gdQsnHtml+="<div class=\"div_qsn_answer\">本题得分："+defen+"</div>";
				gdQsnHtml+="<div class=\"div_qsn_answer\">正确答案：";
				gdQsnHtml+=daan;
				gdQsnHtml+="</div>";
			}
			gdQsnHtml += "</div>";
		}
	}
	if(qsnData.shititypeid != 6){
		gdQsnHtml+="<div class=\"div_qsn_answer\">本题得分："+defen+"分</div>";
	}
//	//正确答案
//	gdQsnHtml+="<div class=\"div_qsn_answer\">正确答案："+xuanX[daan]+"</div>";
	if(qsnData.shititypeid == 1){
		//正确答案
		gdQsnHtml+="<div class=\"div_qsn_answer\">正确答案："+xuanX[daan]+"</div>";
	}else if(qsnData.shititypeid == 2){
		var daansp=daan.split(",");
		//正确答案
		gdQsnHtml+="<div class=\"div_qsn_answer\">正确答案：";
		for(var i=0;i<daansp.length;i++){
			gdQsnHtml+=xuanX[daansp[i]]+",";
		}
		gdQsnHtml+="</div>";
	}else if(qsnData.shititypeid == 3){
		//1对 0错
		gdQsnHtml+="<div class=\"div_qsn_answer\">正确答案：";
		if(daan==1){
			gdQsnHtml+="对";
		}else if(daan==0){
			gdQsnHtml+="错";
		}
		gdQsnHtml+="</div>";
	}else if(qsnData.shititypeid == 4){
		var daData=eval("("+daan+")");
		gdQsnHtml+="<div class=\"div_qsn_answer\">正确答案：";
		for(var ki in daData){
			var kongArray=daData[ki].kong.split("#");
			gdQsnHtml +="填空"+ki;
			for(var kai=0;kai<kongArray.length;kai++){
				if(kai==0){
					gdQsnHtml += "标准答案："+kongArray[kai]+"&nbsp&nbsp&nbsp";
				}else{
					gdQsnHtml += "备选答案："+kongArray[kai]+"&nbsp&nbsp&nbsp";
				}
			}
		}
		gdQsnHtml+="</div>";
	}else if(qsnData.shititypeid == 5){
		gdQsnHtml+="<div class=\"div_qsn_answer\">正确答案：";
			gdQsnHtml+=daan;
		gdQsnHtml+="</div>";
	}
	
	//解析
	gdQsnHtml +="<div class=\"div_qsn_answer\">"+
					"<div class=\"div_qsn_answer_left\">答题解析：</div>" +
					"<div class=\"div_qsn_answer_jx_right\">"+qsnData.jieda+"</div>"+
				"</div>"+
				"<div class=\"clear\"></div>"+
			"</div>"+
				"<div class=\"clear\"></div>"+
			"</div>";
	return gdQsnHtml;
}