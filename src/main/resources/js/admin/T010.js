$(function() {
	creatGrid();
	$('#searchclassify').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		onHidePanel : getChildren,//获取子节点
		panelMinWidth:200,
		panelMaxWidth:300,
		panelMaxHeight:200,
		url : baseUrl + '/admin/B010/findQsnClassifyAddALL.html',
		required : false
	});
	$('#searchshititype').combobox({
		url :baseUrl + '/admin/B010/findQsnTypeAddAll.html',
		editable : false,
		required : false,
		panelMinWidth:200,
		panelMaxWidth:300,
		panelMaxHeight:200,
		valueField : 'sttypeid',
		textField : 'name'
	});
	$('#searchlevel').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		panelMinWidth:200,
		panelMaxWidth:300,
		panelMaxHeight:200,
		url : baseUrl + '/admin/B010/findQsnLevelAddALL.html',
		required : false
	});
	$('#searchknowledge').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		onHidePanel : getChildrenKnowledge,//获取子节点
		panelMinWidth:200,
		panelMaxWidth:300,
		panelMaxHeight:200,
		url : baseUrl + '/admin/B010/findQsnKnowledgeAddALL.html',
		required : false
	});
	$('#excelForm').form({
		url : "exportUserExcel.html",
		success : function(data) {
			$.messager.alert('提示',data,'info');
		}
	});
	$('#showQsnInfoDig').dialog({
		// iconCls:'icon-save',
		fit:true,
		title : '试题预览',
		width:1000,
		height:600,
		toolbar:'#tbdia',
		closed : true,
		closable:false,
		modal : true,
		draggable:false,
		shadow : false,
		onClose:function(){
			$("#Container").html("");
		}
		
	});
	$('#wordForm').form({
		url : "exportQsnWord.html"
	});
});
var classifyids="";//全局变量
function getChildren() {
	var grouptree =  $('#searchclassify').combotree('tree');//对应combotreeID
	var n = grouptree.tree('getSelected');
	var ids=n.id;
	var items=n.children;
	if(items!=null){
		var children = grouptree.tree('getChildren', n.target);
		for(var i=0;i<children.length;i++){
			var item=children[i];
			ids=ids+","+item.id;
		}
	}
	classifyids=ids;//赋值给全局变量 记录所选分类全部ID
}
var knowledgeclassifyids="";//全局变量
function getChildrenKnowledge() {
	var grouptree =  $('#searchknowledge').combotree('tree');//对应combotreeID
	var n = grouptree.tree('getSelected');
	var ids=n.id;
	var items=n.children;
	if(items!=null){
		var children = grouptree.tree('getChildren', n.target);
		for(var i=0;i<children.length;i++){
			var item=children[i];
			ids=ids+","+item.id;
		}
	}
	knowledgeclassifyids=ids;//赋值给全局变量 记录所选分类全部ID
}
/**
 * easyUi dataGrid注册方式说明，防止二次渲染 class注册方式一般是为了初始化属性，js方式则属性和事件都可初始化
 * 但是不管是class方式还是js方式注册组件，每次注册，只要被设置过url属性就会做请求。
 * 所以在不可避免要使用js方式注册的情况下，索性就不要使用class方式注册了。
 */
function creatGrid() {
	$('#itemlist').datagrid(
		{
			fit : true,// 设置为true时铺满它所在的容器.
			fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
			nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
			striped : true,// 设置为true将交替显示行背景。
			collapsible : true,// 定义是否显示可折叠按钮。
			singleSelect : false,// 设置为true将只允许选择一行。
			border : false,
			remoteSort : false,// 定义是否通过远程服务器对数据排序。
			pagination : true,// 分页组件是否显示
			pageNumber : 1,// 起始页
			pageSize : 10,// 每页显示的记录条数，默认为10
			pageList : [ 10, 20, 50 ,100,300,500],// 每页显示多少行
			rownumbers : true,// 行号
			url : baseUrl + '/admin/T010/findQsnList.html',
			toolbar : '#tbar',
			frozenColumns : [ [ {
				field : 'select',
				title : '选择',
				width : 50,
				checkbox : true
			} ] ],
			columns : [ [ {
				field : 'title',
				title : '题目',
				width : 200,
				fixed : true,
				align : 'left',
				sortable : true,
				sorter : datasort,
				formatter:titleLength
			}, {
				field : 'classifyname',
				title : '试题分类',
				width : 80,
				sortable : true,
				sorter : datasort,
				align : 'left'
			}, {
				field : 'shititypename',
				title : '试题类型',
				width : 80,
				sortable : true,
				sorter : datasort,
				align : 'left'
			}, {
				field : 'levelname',
				title : '试题难度',
				width : 80,
				sortable : true,
				sorter : datasort,
				align : 'left'
			}, {
				field : 'knowledgename',
				title : '试题知识点',
				width : 80,
				sortable : true,
				sorter : datasort,
				align : 'left'
			}, {
				field : 'insdate',
				title : '创建时间',
				width : 80,
				align : 'center',
				sortable : true,
				sorter : datasort,
				formatter : fmdate
			}, {
				field : 'username',
				title : '创建人',
				width : 80,
				align : 'center',
				sortable : true,
				sorter : datasort
			},{
				field : 'manage',
				title : '操作',
				align : 'center',
				width : 150,
				formatter : fmup
			} ] ],
			// 当数据载入成功时触发。
			onLoadSuccess : function(data) {
				$('.edit_qsn').linkbutton({
					iconCls : 'icon-edit',
					plain : true
				});
				$('.see_qsn').linkbutton({
					iconCls : 'icon-search',
					plain : true
				});
				$('.see_qsn_none').linkbutton({
					disabled:true,
					iconCls : 'icon-search',
					plain : true
				});
				$('.drop_qsn').linkbutton({
					iconCls : 'icon-no',
					plain : true
				});
			}
		});

}
function titleLength(value, rowData, rowIndex){
	var strArray=value.split("<img");
	var res=value;
	if(strArray.length > 0){
		for(var i=0;i<strArray.length;i++){
			var str=strArray[i];
			if(str.indexOf("src")>0){
				str=str.substr(0,str.indexOf("/>")+2);
				var imgStr="<img"+str;
				res=res.replace(imgStr,"[图片文件]");
			}
		}
	}
	var spanArray = value.split("<span");
	if (spanArray.length > 0){
		for (var i=0;i<spanArray.length;i++){
			var str = spanArray[i];
			if (str.indexOf("style")>0){
				str=str.substr(0,str.indexOf(">")+1);
				var spanStr = "<span"+str;
				res=res.replace(spanStr,"");
			}
		}
	}
	var vArray=res.split("<video");
	if(vArray.length > 0){
		for(var i=0;i<vArray.length;i++){
			var str=vArray[i];
			if(str.indexOf("/video")>0){
				str=str.substr(0,str.indexOf("</video>")+8);
				var vStr="<video"+str;
				res=res.replace(vStr,"[影音文件]");
			}
		}
	}
	var wvArray = res.split("<embed");
	if(wvArray.length > 0){
		for(var i=0;i<wvArray.length;i++){
			var str=wvArray[i];
			if(str.indexOf("type")>0){
				str=str.substr(0,str.indexOf("/>")+2);
				var vStr="<embed"+str;
				res=res.replace(vStr,"[影音文件]");
			}
		}
	}
	if(res.length>15){
		return res.substr(0,15);
	}
	return res;
}
// 打开编辑窗口
function openUpdWin(id,qsnType) {
	if(qsnType==1){
		window.parent.closeTabByTitle("编辑试题-单选题");
		window.parent.openTab("编辑试题-单选题", baseUrl+"/admin/T010/editQsn.html?type=upd&qsnid="+id);
		window.parent.closeTabByTitle("试题管理");
		return;
	}else if(qsnType==2){
		window.parent.closeTabByTitle("编辑试题-不定项选择题");
		window.parent.openTab("编辑试题-不定项选择题", baseUrl+"/admin/T010/editSelectQsn.html?type=upd&qsnid="+id);
		window.parent.closeTabByTitle("试题管理");
		return;
	}else if(qsnType==3){
		window.parent.closeTabByTitle("编辑试题-判断题");
		window.parent.openTab("编辑试题-判断题", baseUrl+"/admin/T010/editJudgeQsn.html?type=upd&qsnid="+id);
		window.parent.closeTabByTitle("试题管理");
		return;
	}else if(qsnType==4){
		window.parent.closeTabByTitle("编辑试题-填空题");
		window.parent.openTab("编辑试题-填空题", baseUrl+"/admin/T010/editInBlankQsn.html?type=upd&qsnid="+id);
		window.parent.closeTabByTitle("试题管理");
		return;
	}else if(qsnType==5){
		window.parent.closeTabByTitle("编辑试题-简答题");
		window.parent.openTab("编辑试题-简答题", baseUrl+"/admin/T010/editShortAnswerQsn.html?type=upd&qsnid="+id);
		window.parent.closeTabByTitle("试题管理");
		return;
	}else if(qsnType==6){
		window.parent.closeTabByTitle("编辑试题-阅读理解");
		window.parent.openTab("编辑试题-阅读理解", baseUrl+"/admin/T010/editReadQsn.html?type=upd&qsnid="+id);
		window.parent.closeTabByTitle("试题管理");
		return;
	}
	
}

function fmup(value, rowData, rowIndex) {
	var id = rowData.qsnid;
	var str = "<a onclick='openUpdWin(" + id + ","+rowData.shititypeid+")' class='edit_qsn'>编辑</a>";

		str += "<a onclick='showQsnInfo(" + id + ","+rowData.shititypeid+")' class='see_qsn'>预览</a>";
	
		str += "<a onclick='delQsnById(" + id + ");' class='drop_qsn' >删除</a>";
	return str;
}
// 排序
function datasort(a, b) {
	return (a > b ? 1 : -1);
}

// 日期转换
function fmdate(value, rowData, rowIndex) {
	// fmtLongDate--common.js
	if (value != null && value != '') {
		return fmtLongDate(new Date(value));
	}
	return "";
}

// 删除试题提示
function delQsnMessage() {
	
	$.messager.confirm('删除提示', '确定要删除选中试题?', function(r) {
		if (r) {
			delQsn();
		}else{
			$('#itemlist').datagrid('clearSelections');
		}
	});
}
// 删除试题
function delQsn() {
	var items_id = new Array();
	var items = $('#itemlist').datagrid('getSelections');
	if (items.length <= 0) {
		$.messager.alert('提示', '请选择要删除的试题', 'info');
		return;
	}
	// 获取选中试题的ID，并组成集合
	for ( var i = 0; i < items.length; i++) {
		items_id.push(items[i].qsnid);
	}
	$.post(baseUrl + '/admin/T010/updQsnDel.html', {
		qids : items_id
	}, function(data) {
		if (data > 0) {
			msgShow('删除成功!');
			reloadGrid();
		} else {
			msgShow('删除失败，请稍后重试');
			reloadGrid();
		}
	}, "json");
}
//删除试题
function delQsnById(qsnid) {
	var items_id = new Array();
	items_id.push(qsnid);
	$.messager.confirm('删除提示', '确定要删除选中试题?', function(r) {
		if (r) {
			$.post(baseUrl + '/admin/T010/updQsnDel.html', {
				qids : items_id
			}, function(data) {
				if (data > 0) {
					msgShow('删除成功!');
					reloadGrid();
				} else {
					msgShow('删除失败，请稍后重试');
					reloadGrid();
				}
			}, "json");
		}else{
			$('#itemlist').datagrid('clearSelections');
		}
	});
}
function editQsn() {
	window.parent.openTab("添加试题", baseUrl+"/admin/T010/editQsn.html?type=add&qsnid=0");
	window.parent.closeTabByTitle("试题管理");
}
//刷新
function reloadGrid() {
	$('#itemlist').datagrid('clearSelections');
	$('#itemlist').datagrid('reload');
}
// 查询
function seachQsnByParam() {
	var param = {
		title : '',
		shititypeid : 0,
		knowledgeid : 0,
		classifyid : 0,
		levelid : 0
	};

	var search_title = $("#searchtitle").val();
	var search_shititypeid = $('#searchshititype').combotree('getValue');
	var search_knowledgeid = knowledgeclassifyids;
	var search_classifyid = classifyids;
	//alert(classifyids);
	var search_levelid = $('#searchlevel').combotree('getValue');
	
	param.title = search_title;
	param.shititypeid = search_shititypeid;
	param.knowledgeid = search_knowledgeid;
	param.classifyid = search_classifyid;
	param.levelid = search_levelid;

	// 导出word
	$("#wordtitle").val(search_title);
	$("#wordclasstype").val(search_classifyid);
	$("#wordtype").val(search_shititypeid);
	$("#wordlevel").val(search_levelid);
	$("#wordknowledge").val(search_knowledgeid);

	$('#itemlist').datagrid('load', param);
}
// 导出Excel
function exportExcel() {
	$('#excelForm').submit();
	return false;
}
var code=["","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
//预览
function showQsnInfo(qid,typeId){
	var url="";
	var stType="";
	if(typeId==1){
		url=baseUrl+ "/admin/T010/findRadioQsn.html";
		stType="单选题";
	}else if(typeId==2){
		url=baseUrl+ "/admin/T010/findSelectQsn.html";
		stType="不定项选择题";
	}else if(typeId==3){
		url=baseUrl+ "/admin/T010/findJudgeQsn.html";
		stType="判断题";
	}else if(typeId==4){
		url=baseUrl+ "/admin/T010/findInBlankQsn.html";
		stType="填空题";
	}else if(typeId==5){
		url=baseUrl+ "/admin/T010/findShortAnswerQsn.html";
		stType="简答题";
	}else{
		url=baseUrl+ "/admin/T010/findReadQsn.html";
		stType="阅读理解";
	}
	if(typeId != 1 && typeId != 2 && typeId != 3){
		$('#qsnXx').hide();
	}else{
		$('#qsnXx').show();
	}
	$.post(url,{qsnid:qid},function(resultData){
		$('#showQsnInfoDig').dialog("open");
		var gdQsnHtml="<div class=\"panel_qsn\">"+
		"<div class=\"div_left\" style='width:10%'>"+
		"<span style=\"font-weight: bold;font-size:10pt !important;\">"+stType+"</span>"+
		"</div>"+
		"<div class=\"div_right\">"+
		"<div class=\"div_qsn_title\">"+resultData.title+"</div>";
		//单选题
		if("xx" in resultData && resultData.shititypeid == 1){
		var daan=resultData.daan;
		gdQsnHtml += "<div class=\"div_qsn_content\"><ol>";
		var xxdata=eval("("+resultData.xx+")");
		var keys=[];
		for(var xxNum in xxdata){
			keys.push(xxNum);
		}
		keys.sort(function(a,b){
			return a-b});
		for(var i=0; i<keys.length; i++){
			var xxNum=keys[i];
			gdQsnHtml +="<li >" ;
			if(xxNum==daan){
				//根据答案选中
				gdQsnHtml +="<a class=\"li_a_span\"><input type='radio' " +
					" class=\"inputStyle\" " +
					" checked=\"checked\" name=\"danxuan\"/>"+xxdata[xxNum].xx+"</a>";
			}else{
				gdQsnHtml +="<a class=\"li_a_span\"><input type='radio' " +
					" class=\"inputStyle\" " +
					"name=\"danxuan\"/>"+xxdata[xxNum].xx+"</a>";
			}
			gdQsnHtml +="</li>";
		}
		gdQsnHtml += "</ol></div>";
		}
		//多选题
		if("xx" in resultData && resultData.shititypeid == 2){
		gdQsnHtml += "<div class=\"div_qsn_content\">"+
		"<ol>";
		var xxdata=eval("("+resultData.xx+")");
		var keys=[];
		for(var xxNum in xxdata){
			keys.push(xxNum);
		}
		keys.sort(function(a,b){
            return a-b}
		);
		var daanArray=resultData.daan.split(",");
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
				gdQsnHtml +="<li>" +
				"<a class=\"li_a_span\"><input type='checkbox' " +
				" class=\"inputStyle\" " +
				"checked=\"checked\"/>"+xxdata[xxNum].xx+"</a></li>";
			}else{
				gdQsnHtml +="<li >" +
				"<a class=\"li_a_span\"><input type='checkbox' " +
				" class=\"inputStyle\" " +
				"/>"+xxdata[xxNum].xx+"</a></li>";
			}
		}
		gdQsnHtml += "</ol>"+
		"</div>";
		}
		//判断题
		if(resultData.shititypeid == 3){
		var daan=resultData.daan;
		gdQsnHtml += "<div class=\"div_qsn_content\">"+
		"<ul>";
		if(daan == "1"){
			gdQsnHtml +="<li >" +
						"<a class=\"li_a_span\"><input type='radio' " +
						" class=\"inputStyle\" " +
						"checked=\"checked\" name=\"danxuan\"/>√</a></li>";
			gdQsnHtml +="<li>" +
						"<a class=\"li_a_span\"><input type='radio' " +
						
						" class=\"inputStyle\" " +
						" name=\"danxuan\"/>×</a></li>";
		}else{
			gdQsnHtml +="<li >" +
						"<a class=\"li_a_span\"><input type='radio' " +
						" class=\"inputStyle\" " +
						" name=\"danxuan\"/>√</a></li>";
			gdQsnHtml +="<li >" +
						"<a class=\"li_a_span\"><input type='radio' " +
						" class=\"inputStyle\" " +
						" checked=\"checked\" name=\"danxuan\"/>×</a></li>";
		}
		gdQsnHtml += "</ul>"+
		"</div>";
		}
		//填空题
		if(resultData.shititypeid == 4){
		gdQsnHtml += "<div class=\"div_qsn_content\ style=\"font-size:10pt !important;\">";
		var kongsData=eval("("+resultData.kongs+")");
		
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
		if(resultData.shititypeid == 5){
		gdQsnHtml += "<div class=\"div_qsn_answer\" style=\"font-size:10pt !important;margin-bottom:20px;\">" +
						"<div class=\"div_qsn_answer_left\">答案：</div>" +
						"<div class=\"div_qsn_answer_right\"><textarea class=\"textarea_style\">"+resultData.daan+"</textarea></div>"+
						"<div class=\"clear\"></div>"+		
					"</div>";
		}
		//阅读理解
		if("data" in resultData && resultData.shititypeid == 6){
		/**
		 * 阅读理解子试题中试题数据
		 * tx：题型；daan：答案；title：试题标题；xx：选项；
		 */
			var zhQsnData=eval("("+resultData.data+")");
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
								tx+":"+childData.title
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
			            return a-b;}
					);
					for(var i=0; i<keys.length; i++){
						xxNum = keys[i];
						gdQsnHtml +="<li>" ;
//						alert(xxNum+"||"+daan);
						if(xxNum==daan){
							gdQsnHtml +="<a class=\"li_a_span\"><input type='radio' " +
								" class=\"inputStyle\" " +
								" checked=\"checked\" name=\"danxuan_"+cindex+"\"/>"+xxdata[xxNum].xx+"</a>";
						}else{
							gdQsnHtml +="<a class=\"li_a_span\"><input type='radio' " +
								" class=\"inputStyle\" " +
								" name=\"danxuan_"+cindex+"\"/>"+xxdata[xxNum].xx+"</a>";
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
							gdQsnHtml +="<li>" +
								"<a class=\"li_a_span\"><input type='checkbox' " +
								" class=\"inputStyle\" " +
								" checked=\"checked\"/>"+xxdata[xxNum].xx+"</a></li>";
						}else{
							gdQsnHtml +="<li>" +
								"<a class=\"li_a_span\"><input type='checkbox' " +
								" class=\"inputStyle\" " +
								"/>"+xxdata[xxNum].xx+"</a></li>";
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
						gdQsnHtml +="<li>" +
									"<a class=\"li_a_span\"><input type='radio' " +
									" class=\"inputStyle\" " +
									" checked=\"checked\" name=\"danxuan\"/>√</a></li>";
						gdQsnHtml +="<li>" +
									"<a class=\"li_a_span\"><input type='radio' " +
									" class=\"inputStyle\" " +
									" name=\"danxuan\"/>×</a></li>";
					}else{
						gdQsnHtml +="<li>" +
									"<a class=\"li_a_span\"><input type='radio' " +
									" class=\"inputStyle\" " +
									" name=\"danxuan\"/>√</a></li>";
						gdQsnHtml +="<li>" +
									"<a class=\"li_a_span\"><input type='radio' " +
									" class=\"inputStyle\" " +
									" checked=\"checked\" name=\"danxuan\"/>×</a></li>";
					}
					gdQsnHtml += "</ul>"+
					"</div>";
				}
				//简答
				if(childData.tx=="jianda"){
					gdQsnHtml += "<div class=\"div_qsn_answer\" style=\"font-size:10pt !important;margin-bottom:20px;\">" +
									"<div class=\"div_qsn_answer_left\">答案：</div>" +
									"<div class=\"div_qsn_answer_right\"><textarea class=\"textarea_style\">"+childData.daan+"</textarea></div>"+
									"<div class=\"clear\"></div>"+		
								"</div>";
				}
				gdQsnHtml += "</div>";
			}
		}
		//解析
		gdQsnHtml +="<div class=\"div_qsn_answer\">"+
					"<div class=\"div_qsn_answer_left\">答题解析：</div>" +
					"<div class=\"div_qsn_answer_jx_right\">"+resultData.jieda+"</div>"+
				"</div>"+
				"<div class=\"clear\"></div>"+
			"</div>"+
				"<div class=\"clear\"></div>"+
			"</div>";
		$("#Container").html(gdQsnHtml);
	},"json");
}
function closeQsnInfoDia(){
	$('#showQsnInfoDig').dialog("close");
}
// 导出试题
function exportWord(){
	$('#wordForm').submit();
	return false;
}
