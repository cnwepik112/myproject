var allids="";
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
	$.post(baseUrl+"/admin/T030/previewSjInfoById.html",{sid:rsjid},function(data){
		loadSjDl(data);
	},"json");
	
});
function backT030(){
	window.parent.closeTabByTitle("试卷管理");
	window.parent.openTab("试卷管理", baseUrl+"/admin/T030/manageSj.html");
	window.parent.closeTabByTitle("试卷预览");
}
function addNewExam(){
	window.parent.closeTabByTitle("添加考试");
	window.parent.openTab("添加考试", baseUrl+"/admin/T040/addExamLoad.html?sjid="+rsjid);
	window.parent.closeTabByTitle("试卷预览");
}
function loadSjDl(data){
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
	var sjTitleHtml="试卷名称："+data.title+"<div style='float:right;margin-right:20px;'>";
	if(data.review){
		sjTitleHtml+="<a id='manage-exam' onclick='addNewExam();' style='width:120px;height:30px;margin-right:10px;'>发布新考试</a>";
	}
	sjTitleHtml+="<a id='manager-back' onclick='backT030();' style='width:120px;height:30px;'>返回试卷管理</a></div>";
	$("#sjTitle").html(sjTitleHtml);
	$("#manager-back").linkbutton({
		iconCls : 'icon-back'
	});
	$("#manage-exam").linkbutton({
		iconCls : 'icon-edit'
	});
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
				var qsnHtml=loadQsnInfo(qsnIndex,qsnData[qsn],qsnData[qsn].fen);
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
				var qsnHtml=loadQsnInfo(qsnIndex,item,xtData[key].fen);
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
function loadQsnInfo(qindex,qsnData,qsnfen){
	//试题标题
	var gdQsnHtml="<div class=\"panel_qsn\" id=\"dl_qsn_"+qindex+"\">"+
				"<div class=\"div_left\">"+
				"<span style=\"font-weight: bold;font-size:20pt !important;\">"+qindex+".</span>"+
				"<br/>"+
				"<span style=\"font-weight: bold;font-size:10pt !important;color:#9cc8f7;\">"+qsnfen+"分</span>"+
				"</div>"+
				"<div class=\"div_right\">"+
				"<div class=\"div_qsn_title\">"+qsnData.title+"</div>";
	//单选题
	
	if("xx" in qsnData && qsnData.shititypeid == 1){
		var daan=qsnData.daan;
		gdQsnHtml += "<div class=\"div_qsn_content\"><ol>";
		var xxdata=eval("("+qsnData.xx+")");
		var keys=[];
		for(var xxNum in xxdata){
			keys.push(xxNum);
		}
		keys.sort(function(a,b){
			return a-b;
		});
		for(var i=0; i<keys.length; i++){
			var xxNum=keys[i];
			gdQsnHtml +="<li indexid=\""+qindex+"_"+xxNum+"\" >" ;
			if(xxNum==daan){
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
		gdQsnHtml += "</ol></div>";
	}
	//多选题
	if("xx" in qsnData && qsnData.shititypeid == 2){
		gdQsnHtml += "<div class=\"div_qsn_content\">"+
		"<ol>";
		var xxdata=eval("("+qsnData.xx+")");
		var daanArray=qsnData.daan.split(",");
		var keys=[];
		for(var xxNum in xxdata){
			keys.push(xxNum);
		}
		keys.sort(function(a,b){
            return a-b}
		);
		var daanArray=qsnData.daan.split(",");
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
		var daan=qsnData.daan;
		gdQsnHtml += "<div class=\"div_qsn_content\">"+
		"<ul>";
		if(daan == "1"){
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
						"name=\"panduan_"+qindex+"_daan\" checked=\"checked\"/>×</a></li>";
		}
		gdQsnHtml += "</ul>"+
		"</div>";
	}
	//填空题
	if(qsnData.shititypeid == 4){
		gdQsnHtml += "<div class=\"div_qsn_content\ style=\"font-size:10pt !important;\">";
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
						"<div class=\"div_qsn_answer_right\"><div class=\"div_qsn_answer_jx_right\">"+qsnData.daan+"</div><div class=\"clear\"></div></div>"+
						"<div class=\"clear\"></div>"+		
					"</div>";
	}
	//阅读理解
	if("data" in qsnData && qsnData.shititypeid == 6){
		/**
		 * 阅读理解子试题中试题数据
		 * tx：题型；daan：答案；title：试题标题；xx：选项；
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
			gdQsnHtml += "<div class=\"div_qsn_zuhe_info\">"+
							"<div class=\"div_qsn_title\">"+
							cindex+"."+tx+":"+childData.title
							+"</div>";
			//单选
			if(childData.tx=="danxuan" && "xx" in childData){
				var daan=childData.daan;
				gdQsnHtml += "<div class=\"div_qsn_content\">"+
				"<ol>";
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
					if(xxNum==daan){
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
				gdQsnHtml += "</ol>"+
				"</div>";
			}
			//多选
			if(childData.tx=="duoxuan" && "xx" in childData){
				gdQsnHtml += "<div class=\"div_qsn_content\">"+
				"<ol>";
				var xxdata=childData.xx;
				var keys=[];
				for(var xxNum in xxdata){
					keys.push(xxNum);
				}
				keys.sort(function(a,b){
					return a-b}
				);
				var daanArray=childData.daan.split(",");
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
				gdQsnHtml += "</ol>"+
				"</div>";
			}
			//判断
			if(childData.tx=="panduan"){
				var daan=childData.daan;
				gdQsnHtml += "<div class=\"div_qsn_content\">"+
				"<ul>";
				if(daan == "1"){
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
								"name=\"panduan_"+qindex+"_"+cindex+"_daan\" checked=\"checked\"/>×</a></li>";
				}
				gdQsnHtml += "</ul>"+
				"</div>";
			}
			//简答
			if(childData.tx=="jianda"){
				gdQsnHtml += "<div class=\"div_qsn_answer\" style=\"font-size:10pt !important;margin-bottom:20px;\">" +
								"<div class=\"div_qsn_answer_left\">答案：</div>" +
								"<div class=\"div_qsn_answer_right\"><div class=\"div_qsn_answer_jx_right\">"+childData.daan+"</div><div class=\"clear\"></div></div>"+
								"<div class=\"clear\"></div>"+		
							"</div>";
			}
			gdQsnHtml += "</div>";
		}
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