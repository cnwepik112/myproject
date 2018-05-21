var shiJuanFirstLoadflg=0;
var accessoriesFirstLoadflg=0;
var certificatesFirstLoadFlg=0;
var chapterNo=1;
var sectionObj="";
var imgStr="";
var userGroupFlg = 0;
var addUserFlg = 0;
$(function() {
//	$("input[name='publicclass']").click(function(){
//		var val=$('input:radio[name="publicclass"]:checked').val();
//		if(parseInt(val)==0){
//			$("#tab").tabs("select", 0);
//			$('#tab').tabs('getTab','用户/组').panel('options').tab.hide();
//		}else{
//			$('#tab').tabs('getTab','用户/组').panel('options').tab.show();
//		}
//	});
	createAddUserDialog();
	createUserGroupDiaDialog();
	// 试卷已选择列表
	creatSelectExamPaperGrid();
	// 附件已选择列表
	creatSelectedAccessoriesGrid();
	// 证书已选择列表
	creatSelectedCertificatesGrid();

	// 课程分类
	$('#courseClassifyCombox').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,// 不可编辑
		url : baseUrl + '/admin/B020/findCourseClassify.html',
		required : true
	});
	//讲师列表
	$('#lecturerCombox').combobox({
		url : baseUrl + '/admin/findLecturer.html',
		editable : false,
		required : true,
		panelHeight : 70,
		valueField : 'lecturerid',
		textField : 'name'
	});
	//角色分类
	$('#roleCombox').combobox({
		url : baseUrl + '/admin/U040/findALLRole.html',
		editable : false,
		required : true,
		panelHeight : 60,
		valueField : 'roleid',
		textField : 'name',
		onChange: function(){
			findUsersByCondition();
		}
	});
	// 职位分类
	$('#positionCombox').combobox({
		url : baseUrl + '/admin/findPosition.html',
		editable : false,
		required : false,
		panelHeight : 60,
		valueField : 'positionid',
		textField : 'name',
		onChange: function(){
			findUsersByCondition();
		}
	});
	//用户组分类
	$('#userGroupComboxTree').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		url : baseUrl + '/admin/U030/findAllGroup.html',
		onChange: function(){
			findUsersByCondition();
		}
	});
	// 试卷分类
	$('#shijuanClassifyCombox').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,// 不可编辑
		url : baseUrl + '/admin/B010/findSjClass.html',
		required : false
	});
	// 附件分类
	$('#accessoriesClassifyCombox').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,// 不可编辑
		url : baseUrl + '/admin/B020/findAccessoriesClassifyTree.html',
		required : false
	});
	//本地上传加载上传的FileInput
	$('#uploadCoverFile').filebox({
		buttonText: '选择封面',
		onChange: function (newValue, oldValue) {
				var validateType=validateFileType(newValue);
				if(!validateType){
					msgShow("请上传gif、jpg、png格式的图片");
					return;
				}
				$('#uploadForm').submit();
			}
	});
	//添加表单加载验证
	$('#addForm').form({
		url : "addCourse.html",
		onSubmit : function() {
			var flg=$("#examName").validatebox("isValid");
			if(!flg){
				$("#tab").tabs("select",2);
				$("#examName").focus();
				return false;
			}
			return $('#addForm').form("validate");
		},
		success : function(data) {
			if(data>0){
				$.messager.confirm('提示', '添加课程成功！', function(r) {
					if (r) {
						window.parent.closeTabByTitle("课程管理");
						window.parent.openTab("课程管理", "admin/C010ManageCourse.html");
						window.parent.closeTabByTitle("添加课程");
					}
				});
			}
		}
	});
	//用户组树形选择(多个)
	$('#userGroup').combotree({
		multiple : true,
		checkbox : true,
		lines : true,
		animate : false,
		cascadeCheck : false,
		editable : true,
		url : baseUrl + '/admin/U030/findGroupAddALL.html',
		required : false,
		onHidePanel:function(){
			var ids=$('#userGroup').combotree("getValues");
			$("#groupids").val(ids);
		},
		onCheck : checkTreeNode
	});
	//课件分类下拉列表
	$('#courseClassifyCombx').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,//不可编辑
		url : baseUrl + '/admin/B020/findCoursewareClassifyTree.html',
		required : false
	});
	// 上传课程封面Form绑定
	$('#uploadForm').form({
		url : "uploadCourseCover.html",
		onSubmit : function() {
			return $('#uploadForm').form("validate");
		},
		success : function(data) {
			var obj = eval('(' + data + ')');
			if(obj.status=="success"){
				//上传成功
				$("#cover").val(obj.url);
				$("#coverPic").attr("src",obj.url);

			}else if(obj.status=="typeError"){

				msgShow("上传类型错误");

			}else{
				msgShow("上传异常");
			}
		}
	});
	//需要人工评卷
	$("#needManualScore").click(function(){
		var isChecked = $(this).attr("checked");
		if(isChecked){
			$(this).parent().next().show();
		}else{
			$(this).parent().next().hide();
		}
	});
	
	//添加章
	$("#addChapterBtn").click(function(){
		chapterNo++;
		var sectionNo=1;
		var chapterHtml='<div>';
			chapterHtml+='<div class="formItem borderDotted chapter">';
			chapterHtml+='<div style="margin-left:25px;" class="formField">';
			chapterHtml+='<span style="font-size: 13px;" class="chapterName">第'+chapterNo+'章：</span>';
			chapterHtml+='<input name="chapter" type="text" class="easyui-validatebox input_course" style="width:350px;height:28px;"/>';
			chapterHtml+='<a style="margin-left:20px;" id="'+chapterNo+'" onclick="addSection(this)" class="addSectionBtn" >添加节</a>';
			chapterHtml+='<a class="delSectionBtn" onclick="delChapter(this)">删除</a>';
			chapterHtml+='</div>';
			chapterHtml+='</div>';
			chapterHtml+='<div id="section_'+chapterNo+'_1" sectionId='+sectionNo+' class="formItem moseoverYellow borderDotted section">';
			chapterHtml+='<div style="margin-left:50px;" class="formField">';
			chapterHtml+='<span style="font-size: 13px;" class="sectionName">第1节：</span>';
			chapterHtml+='<input name="chapter'+chapterNo+'_section" type="text" class="easyui-validatebox input_course" style="width:350px;height:28px;"/>';
			chapterHtml+='<a style="margin-left:20px;" cid="section_'+chapterNo+'_1" onclick="openCoursewareWin(this);" class="addCoursewarBtn">添加课件</a>';
//			chapterHtml+='<a class="delSectionBtn" onclick="delSection(this)">删除</a>';
			chapterHtml+='</div>';
			chapterHtml+='<div class="courseware"></div>';
			chapterHtml+='</div>';
			chapterHtml+='</div>';
			$(".chapter:last").parent().after(chapterHtml);
			$('.addSectionBtn,.addCoursewarBtn').linkbutton({
				iconCls : 'icon-add',
				plain:true
			});
			$('.delSectionBtn').linkbutton({
				iconCls : 'icon-no',
				plain:true
			});
			$("input[name='chapter"+chapterNo+"_section']").validatebox({
				required: true
			});
	});
});
function addSection(obj){
		//添加节
		var chapterIndex=obj.id;
		var sectionNo=parseInt($(obj).parent().parent().parent().find(".section:last").attr("sectionId"));
	/*	if(isNaN(sectionNo)){
			sectionNo=1;
		}*/
		sectionNo++;
		var sectionHtml='<div id="section_'+chapterIndex+'_'+sectionNo+'" class="formItem moseoverYellow borderDotted section">';
		sectionHtml+='<div style="margin-left:50px;" class="formField">';
		sectionHtml+='<span style="font-size: 13px;" class="sectionName">第'+sectionNo+'节：</span>';
		sectionHtml+='<input name="chapter'+chapterIndex+'_section" type="text" class="easyui-validatebox input_course" style="width:350px;height:28px;"/>';
		sectionHtml+='<a style="margin-left:20px;" cid="section_'+chapterIndex+'_'+sectionNo+'" onclick="openCoursewareWin(this);" class="addCoursewarBtn">添加课件</a>';
		sectionHtml+='<a class="delSectionBtn" onclick="delSection(this)">删除</a>';
		sectionHtml+='</div>';
		sectionHtml+='<div class="courseware"></div>';
		sectionHtml+='</div>';
		$(obj).parent().parent().parent().find(".section:last").after(sectionHtml);
		$(obj).parent().parent().parent().find(".section:last").attr("sectionId",sectionNo);
		$('.addSectionBtn,.addCoursewarBtn').linkbutton({
			iconCls : 'icon-add',
			plain:true
		});
		$('.delSectionBtn').linkbutton({
			iconCls : 'icon-no',
			plain:true
		}); 
		$("input[name='chapter"+chapterIndex+"_section']").validatebox({
			required: true
		});
}
//试卷列表
function creatExamPaperGrid() {
	$('#examPaperList').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		rownumbers:true,// 行号
		border : false,
		singleSelect:false,// 设置为true将只允许选择一行。
		pagination : true,// 分页组件是否显示
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50 ],// 每页显示多少行
		url : 'findExamPapers.html',
		toolbar : '#ebar',
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			checkbox : true
		} ] ],
		columns : [ [ {
			field : 'title',
			title : '试卷名称',
			width : 120,
			align : 'center'
		}, {
			field : 'classifyName',
			title : '试卷分类',
			width : 80,
			align : 'center'
		}, {
			field : 'totalsorce',
			title : '试卷总分',
			width : 50,
			align : 'center'
		}, {
			field : 'totalshiti',
			title : '试题数量',
			width : 50,
			align : 'center'
		}, {
			field : 'review',
			title : '审核状态',
			width : 80,
			align : 'center'
		}, {
			field : 'insUserId',
			title : '创建人',
			width : 80,
			align : 'center'
		}, {
			field : 'insDate',
			title : '创建时间',
			width : 80,
			align : 'center'
		}] ]
	});
}
//试卷列表
function creatSelectExamPaperGrid() {
	$('#selectExamPaperList').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		rownumbers : true,// 行号
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			checkbox : true
		} ] ],
		columns : [ [ {
			field : 'title',
			title : '试卷名称',
			width : 100,
			align : 'center'
		}, {
			field : 'classifyName',
			title : '试卷分类',
			width : 80,
			align : 'center'
		}, {
			field : 'totalsorce',
			title : '试卷总分',
			width : 80,
			align : 'right'
		}, {
			field : 'totalshiti',
			title : '试题数量',
			width : 80,
			align : 'right'
		}] ]
	});
}
//附件列表
function creatUnSelectedAccessoriesGrid() {
	$('#unSelectedAccessoriesList').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		rownumbers:true,// 行号
		idField:"courseAccessoriesId",
		border : false,
		singleSelect:false,// 设置为true将只允许选择一行。
		pagination : true,// 分页组件是否显示
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50 ],// 每页显示多少行
		url : 'findAccessories.html',
		toolbar : '#abar',
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			checkbox : true
		} ] ],
		columns : [ [ {
			field : 'accessoriesName',
			title : '附件名称',
			width : 120,
			align : 'center'
		}, {
			field : 'type',
			title : '类型',
			width : 80,
			align : 'center'
		}, {
			field : 'classifyName',
			title : '附件分类',
			width : 100,
			align : 'center'
		}, {
			field : 'userName',
			title : '创建人',
			width : 80,
			align : 'center'
		}, {
			field : 'updDate',
			title : '更新时间',
			width : 80,
			align : 'center'
		}] ]
	});
}
//附件列表
function creatSelectedAccessoriesGrid() {
	$('#selectedAccessoriesList').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		rownumbers : true,// 行号
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			checkbox : true
		} ] ],
		columns : [ [ {
			field : 'accessoriesName',
			title : '附件名称',
			width : 80,
			align : 'center'
		}, {
			field : 'type',
			title : '类型',
			width : 80,
			align : 'center'
		}, {
			field : 'classifyName',
			title : '附件分类',
			width : 200,
			align : 'center'
		}, {
			field : 'userName',
			title : '创建人',
			width : 80,
			align : 'center'
		}, {
			field : 'updDate',
			title : '更新时间',
			width : 80,
			align : 'center'
		}] ]
	});
}
//证书列表未选择
function creatUnSelectedCertificatesGrid() {
	$('#unSelectedCertificatesList').datagrid({
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		rownumbers:true,// 行号
		idField:"certId",
		border : false,
		singleSelect:false,// 设置为true将只允许选择一行。
		pagination : true,// 分页组件是否显示
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50 ],// 每页显示多少行
		url : 'findCertificates.html',
		toolbar : '#cbar',
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			checkbox : true
		} ] ],
		columns : [ [ {
			field : 'number',
			title : '证书编号',
			width : 80,
			align : 'center'
		}, {
			field : 'name',
			title : '证书名称',
			width : 80,
			align : 'center'
		}, {
			field : 'issueAgency',
			title : '证书发放机构',
			width : 200,
			align : 'center'
		}, {
			field : 'issueDate',
			title : '证书发放时间',
			width : 80,
			align : 'center'
		}, {
			field : 'expiryDate',
			title : '证书有效时长',
			width : 80,
			align : 'center'
		}] ]
	});
}

///证书列表已选择
function creatSelectedCertificatesGrid() {
	$('#selectedCertificatesList').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		rownumbers : true,// 行号
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			checkbox : true
		} ] ],
		columns : [ [ {
			field : 'number',
			title : '证书编号',
			width : 80,
			align : 'center'
		}, {
			field : 'name',
			title : '证书名称',
			width : 80,
			align : 'center'
		}, {
			field : 'issueAgency',
			title : '证书发放机构',
			width : 200,
			align : 'center'
		}, {
			field : 'issueDate',
			title : '证书发放时间',
			width : 80,
			align : 'center'
		}, {
			field : 'expiryDate',
			title : '证书有效时长',
			width : 80,
			align : 'center'
		}] ]
	});
}

///课件列表
function creatCoursewareGrid(ids) {
	$('#coursewareList')
			.datagrid({
					fit : true,// 设置为true时铺满它所在的容器.
					fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
					rownumbers:true,// 行号
					border : false,
					singleSelect:false,// 设置为true将只允许选择一行。
					pagination : true,// 分页组件是否显示
					pageSize : 10,// 每页显示的记录条数，默认为10
					pageList : [ 10, 20, 50 ],// 每页显示多少行
					url : 'findAllCoursewares.html?coursewareIds='+ids,
					toolbar : '#coursewareBar',
					frozenColumns : [ [ {
						field : 'select',
						title : '选择',
						width : 50,
						checkbox : true
					} ] ],
					columns : [ [ {
						field : 'coursewareName',
						title : '课件名称',
						width : 80,
						sortable : true,
						sorter : datasort,
						halign: 'center',
						align : 'left'
					}, {
						field : 'type',
						title : '类型',
						width : 80,
						sortable : true,
						sorter : datasort,
						halign: 'center',
						align : 'left'
					}, {
						field : 'classifyName',
						title : '课件分类',
						width : 80,
						sortable : true,
						sorter : datasort,
						halign: 'center',
						align : 'left'
					}, {
						field : 'timelength',
						title : '学时（分）',
						width : 80,
						sortable : true,
						sorter : datasort,
						halign: 'center',
						align : 'right'

					}, {
						field : 'userName',
						title : '创建人',
						width : 80,
						sortable : true,
						sorter : datasort,
						halign: 'center',
						align : 'left'
					}, {
						field : 'updDate',
						title : '更新时间',
						width : 80,
						sortable : true,
						sorter : datasort,
						halign: 'center',
						align : 'center'
					}] ]
				});

}
//排序
function datasort(a, b) {
	return (a > b ? 1 : -1);
}
//格式化日期
function fmdate(value, rowData, rowIndex) {
	if (value != null && value != '') {
		return fmtLongDate(new Date(value));
	}
	return "";
}
/**
 * 添加课件Form
 */
function addCourseForm(){
	fmtExamJson();
	fmtAccessoriesJson();
	fmtCertificatesJson();
	var flg =fmtCourseJson();
//	fmtUserJson();
	if(flg){
		//课件
		$("#addForm").submit();
	}
	
}

//根据条件查询用户
function findUsersByCondition(){
	// 用户组
	var groupId = $("input:hidden[name='groupid']").val();
	//职位ID
	var positionId = $("input:hidden[name='positionid']").val();
	$('#unAddUserList').datagrid('load', {
		groupid : groupId,
		positionid : positionId
	});
}
//根据条件查询试卷
function findShiJuanByCondition(){
	// 试卷分类
	var sjClassifyId = $("input:hidden[name='sjclassifyid']").val();
	// 试卷名称
	var sjName = $("input:text[name='title']").val();
	// 创建人
	var createUserName = $("input:text[name='insuserid']").val();
	$('#examPaperList').datagrid('load', {
		sjClassifyId : sjClassifyId,
		title : sjName,
		insUserId : createUserName
	});
}
//根据条件查询附件
function findAccessoriesByCondition(){
	// 附件分类
	var sjClassifyId = $("#accessoriesClassifyCombox").combotree("getValue");
	// 附件名称
	var accessoriesName = $("#accessoriesName").val();
	// 创建人
	var createUserName = $("input:text[name='userName']").val();
	$('#unSelectedAccessoriesList').datagrid('load', {
		classifyid : sjClassifyId,
		accessoriesName : accessoriesName,
		username : createUserName
	});
}
//根据条件查询证书
function findCertificatesByCondition(){
	var name=$("#name").val();
	var number=$("#number").val();
	var issueAgency=$("#issueAgency").val();
	var issueDate1 = $('#startDate').datebox('getValue');
	var issueDate2 = $('#endDate').datebox('getValue');
	$('#unSelectedCertificatesList').datagrid('load', {
		name : name,
		number : number,
		issueAgency : issueAgency,
		issueDate1:issueDate1,
		issueDate2:issueDate2
	});
}
//打开试卷窗口
function openExamShiJuanWin(){
	if(shiJuanFirstLoadflg==0){
		creatExamPaperGrid();
		shiJuanFirstLoadflg=1;
	}else{
		// 试卷未选择列表
		var idAttr="";
		var addedItems = $('#selectExamPaperList').datagrid('getRows');
		// 获取选中消息的ID，并组成集合
		for ( var i = 0; i < addedItems.length; i++) {
			idAttr+=addedItems[i].sjid+",";
		}
		idAttr=idAttr.substring(0,idAttr.lastIndexOf(","));

		$("#examPaperList").datagrid("load",{shijuanIds:idAttr});
	}
	$('#chooseExamPaperWin').window('open');
}
//打开附件窗口
function openAccessoriesWin(){
	
	if(accessoriesFirstLoadflg==0){

		creatUnSelectedAccessoriesGrid();

		accessoriesFirstLoadflg=1;
	}else{
		var idAttr="";
		var addedItems = $('#selectedAccessoriesList').datagrid('getRows');
		// 获取选中消息的ID，并组成集合
		for ( var i = 0; i < addedItems.length; i++) {
			idAttr+=addedItems[i].courseAccessoriesId+",";
		}
		idAttr=idAttr.substring(0,idAttr.lastIndexOf(","));

		$("#unSelectedAccessoriesList").datagrid("load",{courseAccessoriesIds:idAttr});
	}
	// 附件未选择列表
	$('#chooseAccessoriesWin').window('open');
}
//打开证书窗口
function openCertificatesWin(){

	if(certificatesFirstLoadFlg==0){

		
		creatUnSelectedCertificatesGrid();

		certificatesFirstLoadFlg=1;

	}else{

		var idAttr="";

		var addedItems = $('#selectedCertificatesList').datagrid('getRows');

		// 获取选中消息的ID，并组成集合
		for ( var i = 0; i < addedItems.length; i++) {

			idAttr+=addedItems[i].certId+",";
		}
		idAttr=idAttr.substring(0,idAttr.lastIndexOf(","));

		$("#unSelectedCertificatesList").datagrid("load",{certIds:idAttr});
	}
	// 证书未选择列表
	$('#chooseCertificateWin').window('open');
}

//打开课件窗口
function openCoursewareWin(obj){
	var coursewareIds="";
	$("input[name='coursewareId']").each(function(){
		var coursewareId=$(this).val();
		coursewareIds+=coursewareId+",";
	});
	var ids=coursewareIds.substring(0,coursewareIds.lastIndexOf(","));
	sectionObj=$(obj);
	creatCoursewareGrid(ids);
	// 课件未选择列表
	$('#chooseCoursewarePop').window('open');
}

//保存试卷
function saveExamShiJuan(){
	var totalScore="";
	var items = $('#examPaperList').datagrid('getSelections');
	if(validateTotalScoreIsSame()){
		// 添加的试卷的总分数是一样的场合

		for(var i=0;i<items.length;i++){

			$('#selectExamPaperList').datagrid('appendRow',items[i]);

			totalScore=items[i].totalsorce;

			var index=$('#examPaperList').datagrid('getRowIndex',items[i]);

			$('#examPaperList').datagrid('deleteRow',index);
		}
		$("#totalScore").text(totalScore);

		$('#chooseExamPaperWin').window('close');
	}
}
//删除试卷
function delExamShiJuan(){
	var items = $('#selectExamPaperList').datagrid('getSelections');
	for(var i=0;i<items.length;i++){
		$('#examPaperList').datagrid('appendRow',items[i]);
		var index=$('#selectExamPaperList').datagrid('getRowIndex',items[i]);
		$('#selectExamPaperList').datagrid('deleteRow',index);
	}
}
//保存附件
function saveAccessories(){
	var items = $('#unSelectedAccessoriesList').datagrid('getSelections');
	for(var i=0;i<items.length;){
		$('#selectedAccessoriesList').datagrid('appendRow',items[i]);
		var index=$('#unSelectedAccessoriesList').datagrid('getRowIndex',items[i]);
		$('#unSelectedAccessoriesList').datagrid('deleteRow',index);
	}
	$('#chooseAccessoriesWin').window('close');
}
//删除附件
function delAccessories(){
	var items = $('#selectedAccessoriesList').datagrid('getSelections');
	for(var i=0;i<items.length;i++){
		$('#unSelectedAccessoriesList').datagrid('appendRow',items[i]);
		var index=$('#selectedAccessoriesList').datagrid('getRowIndex',items[i]);
		$('#selectedAccessoriesList').datagrid('deleteRow',index);
	}
}
//保存证书
function saveCertificates(){
	var items = $('#unSelectedCertificatesList').datagrid('getSelections');
	for(var i=0;i<items.length;){
		$('#selectedCertificatesList').datagrid('appendRow',items[i]);
		var index=$('#unSelectedCertificatesList').datagrid('getRowIndex',items[i]);
		$('#unSelectedCertificatesList').datagrid('deleteRow',index);
	}
	$('#chooseCertificateWin').window('close');
}
//删除附件
function delCertificates(){
	var items = $('#selectedCertificatesList').datagrid('getSelections');
	for(var i=0;i<items.length;i++){
		$('#unSelectedCertificatesList').datagrid('appendRow',items[i]);
		var index=$('#selectedCertificatesList').datagrid('getRowIndex',items[i]);
		$('#selectedCertificatesList').datagrid('deleteRow',index);
	}
}
//保存课件
function saveCourseware(){
	var id=sectionObj.attr("cid");
	var items=$('#coursewareList').datagrid('getSelections');
	if(items.length==0){
		$.messager.alert('提示', "请选择课件", 'info');
		return;
	}
	if( typeof($("#"+id).find(".courseware").children().html())=="undefined"){
		var courseStr='<h3>课件</h3>';
		courseStr+='<div class="courseware" style="border:1 solid;width:530px;">';
		courseStr+='<div style="width:100%;padding:0px;"><table cellspacing="0" cellpadding="0" border="0" style="width:510px;border-bottom: 1px solid #ccc;">';
//		courseStr+='<table cellspacing="0" cellpadding="0" border="0">';
//		courseStr+='<thead style="width:510px;display:block">';
		courseStr+='<tr>';
		courseStr+='<td width="100px">课件类型</td>';//类型
		courseStr+='<td width="150px">课件名称</td>';//课件名称
		courseStr+='<td width="60px">文件大小</td>';//文件大小
		courseStr+='<td width="94px">上传日期</td>';//上传日期
		courseStr+='<td width="60px">操作</td>';
		courseStr+='</tr>';
//		courseStr+='</thead>';
		courseStr+='</table></div>';
//		courseStr+='<tbody id="'+id+'_tbody" style="width:510px;display:block;height:135px;line-height:135px;overflow: auto;">';
		courseStr+='<div style="width:100%;height:135px;overflow-y: auto;"><table id="'+id+'_tbody" style="width:510px;">';
//		courseStr+='</tbody>';
		courseStr+='</table></div>';
		courseStr+='</div>';
		$("#"+id).find(".courseware").attr("style","margin-left:100px;height:230px;width:530px;margin-top:50px; border: 1px solid #ccc;padding:10px;");
		$("#"+id).find(".courseware").html(courseStr);
	}
	var course="";
	for(var i=0;i<items.length;i++){
		fmtImg(items[i].type);
		course+='<tr>';
		course+='<td width="100px"><input name="coursewareTime" value="'+items[i].timelength+'" type="hidden"/><input name="coursewareId" value="'+items[i].coursewareId+'" type="hidden"/><input name="'+id+'_coursewareId" value="'+items[i].coursewareId+'" type="hidden"/><img width="37" height="34" src="'+imgStr+'" /></td>';
		course+='<td width="150px">'+items[i].coursewareName+'</td>';
		course+='<td width="60px">'+items[i].fileSize+'</td>';
		course+='<td width="94px">'+items[i].updDate+'</td>';
		course+='<td width="60px"><a class="delCoursewareBtn" onclick="delCourseware(this)">删除</a></td>';
		course+='</tr>';
	}
	$("#"+id+'_tbody').append(course);
	//计算学时
	calculateStudyTime();
	$('#chooseCoursewarePop').window('close');
	$('.delCoursewareBtn').linkbutton({
		iconCls : 'icon-no',
		plain:true
	});
}
//删除课件
function delCourseware(obj){
	$(obj).parent().parent().remove();
	//计算学时
	calculateStudyTime();
}
//删除节
function delSection(obj){
	$(obj).parent().parent().remove();
	$(obj).parent().find(".sectionName").each(function(i){
		$(this).text("第"+(i+1)+"节");
	});
	//计算学时
	calculateStudyTime();
}
//删除章
function delChapter(obj){
	$(obj).parent().parent().parent().remove();
	$(".chapterName").each(function(i){
		$(this).text("第"+(i+1)+"章");
		chapterNo=(i+1);
	});
	//计算学时
	calculateStudyTime();
}
//实现选中子节点不关联父节点，选中父节点选中子节点
function checkTreeNode(node, checked) {
	if (checked) {
		if (node.children != null) {
			var children = $('#userGroup').combotree('tree').tree('getChildren', node.target);
			for ( var i = 0; i < children.length; i++) {
				$('#userGroup').combotree('tree').tree('check', children[i].target);
			}
		}
	}
}
/**
 * 验证文件类型
 * 
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
	checkType = exetendName=="png"||exetendName=="jpg"||exetendName=="gif";

	//返回文件类型的验证值
	return checkType;
}
/**
 * 验证选择试卷的分数是否一样
 * 
 * @returns {Boolean}
 */
function validateTotalScoreIsSame(){
	var items = $('#examPaperList').datagrid('getSelections');
	var selectedItems = $('#selectExamPaperList').datagrid("getRows");
	var flg=true;
	if(selectedItems.length==0){
		//没有选试卷
			if(items.length>1){
				//选择多条
				for(var i=0;i<items.length;i++){
					if(i!=items.length-1){
						if(items[i].totalsorce!=items[i+1].totalsorce){
							flg=false;
							$.messager.alert('提示', "请选择相同的分数", 'info');
							return flg;
						}
					}
				}
			}else{
				//选择1条
				flg=true;
				return flg;
			}
		
	}else{
		if(flg){
			for(var i=0;i<items.length;i++){
				for(var j=0;j<selectedItems.length;j++){
					//选择多条
					if(selectedItems[j].totalsorce!=items[i].totalsorce){
						flg=false;
						$.messager.alert('提示', "请选择相同的分数", 'info');
						return flg;
					}
					
				}
			}
		}
	}
	return flg;
}

//选择用户
function selectedUsers(){
	var items_uid = new Array();
	var userItems = $('#addedUserList').datagrid('getRows');
	// 获取选中用户的ID和姓名，并组成集合
	for ( var i = 0; i < userItems.length; i++) {
		items_uid.push(userItems[i].userid);
	}
	$("#userIds").val(items_uid);
}

//课件Json
function fmtCourseJson(){
	var flg=true;
	var courseJsonAttr=[];
	var sectionJson={};
	var sectionJsonAttr=[];
	var coursewareAttr=[];
	var coursewareJson={};
	$("input[name='chapter']").each(function(i){
		if(!flg){
			return flg;
		}
		//章
		var chapterName=$(this).val();
		if(chapterName==""){
			$.messager.alert('提示', "请填写第"+(i+1)+"章的名称", 'info');
			flg=false;
			return flg;
		}
		sectionJson={};
		sectionJsonAttr=[];
		$("input[name='chapter"+(i+1)+"_section']").each(function(j){
			//节
			var sectionName =$(this).val();

			if(sectionName==""){
				$.messager.alert('提示', "请填写第"+(i+1)+"章第"+(j+1)+"节的名称", 'info');
				flg=false;
				return flg;
			}
			coursewareAttr=[];
			$("input[name='section_"+(i+1)+"_"+(j+1)+"_coursewareId']").each(function(c){
				//课件

				var coursewareId=parseInt($(this).val());

				coursewareAttr.push(coursewareId);

				var coursewareIdStr=$(this).val();

				coursewareJson[coursewareIdStr]=0;

			});

			sectionJson[j]={"sectionName":sectionName,"kejian":coursewareAttr};

			sectionJsonAttr.push(sectionJson[j]);


			if(coursewareAttr.length==0){
				$.messager.alert('提示', "请填写第"+(i+1)+"章第"+(j+1)+"节的课件", 'info');
				flg=false;
				return flg;
			}
		});

		courseJsonAttr[i]={"chapterName":chapterName,"section":sectionJsonAttr};
	});

	var coursewareCount=0;
	$("input[name='coursewareId']").each(function(){
		coursewareCount++;
	});
	$("#coursewareCount").val(coursewareCount);
	var jsonStr=JSON.stringify(courseJsonAttr);
	$("#courseConfig").val(jsonStr);
	var jsonOrderStr=JSON.stringify(coursewareJson);
	$("#courseOrderConfig").val(jsonOrderStr);
	return flg;
}

function fmtUserJson(){
	var coursewareJsonStr=eval("("+$("#courseOrderConfig").val()+")");
	var userJson={};
	//设置用户id
	var rowsUser = $("#addedUserList").datagrid("getRows");
	var userId = '';
	for(var i in rowsUser){
		var uid=rowsUser[i].userid;
		userId +=uid+ ",";
		userJson[uid]=coursewareJsonStr;
	}
	var jsonStr=JSON.stringify(userJson);
	$("#courseOrderConfig").val(jsonStr);
	userId = userId.substring(0,userId.lastIndexOf(","));
	$("#userIds").val(userId);
}
//考试
function fmtExamJson(){
	// 考试名称
	var examName=$("#examName").val();
	var jsonStr="";
	if($.trim(examName)!=""){
		// 考试总分
		var totalScore=$("#totalScore").text();
		// 及格分数
		var okrate=$("#okrate").val();
		// 答卷时长
		var totalTm=$("#totalTm").val();
		// 答题模式
		var pageSize=$("#pageSize").val();
		// 考试次数
		var maxTimes=$("#maxTimes").val();
		// 及格后不能再考
		var passingAgainFlg=$("input[name='passingAgainFlg']").attr("checked")==true?1:0;
		// 试题和选项乱序
		var qsnRandomFlg=$("input[name='qsnRandomFlg']").attr("checked")==true?1:0;
		// 交卷后立刻发布
		var releaseFlg=$("input[name='releaseFlg']").attr("checked")==true?1:0;
		// 发布后允许查看试卷和答案
		//var publishAnswerFlg=$("input[name='publishAnswerFlg']").attr("checked")==true?1:0;
		var shijuan=[];
		var shijuanItems = $('#selectExamPaperList').datagrid('getRows');
		if(shijuanItems.length>0){
			$("#examName").validatebox({required:true}).validatebox("enableValidation");
		}else{
			$("#examName").validatebox("disableValidation");
		}
		// 获取选中用户的ID和姓名，并组成集合
		for ( var i = 0; i < shijuanItems.length; i++) {
			shijuan.push(shijuanItems[i].sjid);
		}
		var examJson={
				"examName":examName,
				"totalScore":totalScore,
				"okrate":okrate,
				"totalTm":totalTm,
				"pageSize":pageSize,
				"maxTimes":maxTimes,
				"passingAgainFlg":passingAgainFlg,
				"qsnRandomFlg":qsnRandomFlg,
				"releaseFlg":releaseFlg,
				//"publishAnswerFlg":publishAnswerFlg,
				"shijuan":shijuan
			};
		jsonStr=JSON.stringify(examJson);
	}
	$("#examConfig").val(jsonStr);
}

//附件Json
function fmtAccessoriesJson(){
	var accessoriesIdAttr=[];
	var accessoriesItems = $('#selectedAccessoriesList').datagrid('getRows');
	// 获取选中用户的ID和姓名，并组成集合
	for ( var i = 0; i < accessoriesItems.length; i++) {
		accessoriesIdAttr.push(accessoriesItems[i].courseAccessoriesId);
	}
	var jsonStr=JSON.stringify(accessoriesIdAttr);
	$("#accessoriesConfig").val(jsonStr);
}

//证书Json
function fmtCertificatesJson(){
	var certificatesIdAttr=[];
	var certificatesItems = $('#selectedCertificatesList').datagrid('getRows');
	// 获取选中用户的ID和姓名，并组成集合
	for ( var i = 0; i < certificatesItems.length; i++) {
		certificatesIdAttr.push(certificatesItems[i].certId);
	}
	var jsonStr=JSON.stringify(certificatesIdAttr);
	$("#certificatesConfig").val(jsonStr);
}
function findCourseware(){
	//课件名称
	var coursewareName=$("#coursewareName").val();
	//课件分类
	var coursewareClassify=$("#courseClassifyCombx").combotree("getValue");
	//学时（分）开始
	var studyTimeStart=$("#periodStart").datebox("getValue");
	//学时（分）结束
	var studyTimeEnd=$("#periodEnd").datebox("getValue");
	var dateStart=$("#updateTimeStart").next().find(".textbox-value").val();
	var dateEnd=$("#updateTimeEnd").next().find(".textbox-value").val();
	$('#coursewareList').datagrid('load', {    
		coursewareName: coursewareName,
		classifyid:coursewareClassify,
		timeLengthStart:studyTimeStart,
		timeLengthEnd:studyTimeEnd,
		dateStart:dateStart,
		dateEnd:dateEnd
	});
}
/**
 * 验证文件类型
 * 
 * @param fileName
 * @returns {Boolean}
 */
function fmtImg(fileType){
	//判断类型
	switch(fileType)
	{
	case 'FLV':// FLV
		imgStr="../resources/images/icon/icon_fl.png";
		break;
	case 'MP4':// MP4
		imgStr="../resources/images/icon/icon_mp4.png";
		break;
	case 'SWF':// SWF
		imgStr="../resources/images/icon/icon_swf.png";
		break;
	case 'MP3':// MP3
		imgStr="../resources/images/icon/icon_mp3.png";
		break;
	case '图片':// PIC
		imgStr="../resources/images/icon/icon_pic.png";
		break;
	case 'PDF':// PDF
		imgStr="../resources/images/icon/icon_pdf.png";
		break;
	case 'WORD':// WORD
		imgStr="../resources/images/icon/icon_word.png";
		break;
	default:// EXCEL
		imgStr="../resources/images/icon/icon_excel.png";
	}
}
//创建未添加用户列表
function createAddUserDialog() {
	$('#unAddUserList').datagrid({
		fit : true,// 设置为true时铺满它所在的容器.
		fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
		nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
		striped : true,// 设置为true将交替显示行背景。
		collapsible : true,// 定义是否显示可折叠按钮。
		singleSelect : false,// 设置为true将只允许选择一行。
		idField:'userid',
		border : false,
		remoteSort : false,// 定义是否通过远程服务器对数据排序。
		rownumbers : true,// 行号
		pagination : true,// 分页组件是否显示
		pageSize : 10,// 每页显示的记录条数，默认为10
		pageList : [ 10, 20, 50 ],// 每页显示多少行
		url:baseUrl + '/admin/U010/findUserForLearn.html',
		frozenColumns : [ [ {
			field : 'select',
			title : '选择',
			width : 50,
			checkbox : true
		} ] ],
		columns : [ [  {
			field : 'username',
			title : '用户名',
			width : 80,
			sortable : true,
			align : 'left'
		}, {
			field : 'realname',
			title : '真实姓名',
			width : 80,
			sortable : true,
			align : 'left'
		}, {
			field : 'nickname',
			title : '昵称',
			width : 80,
			sortable : true,
			align : 'left'
		}, {
			field : 'rolename',
			title : '角色',
			width : 80,
			align : 'left',
			sortable : true
		}, {
			field : 'groupname',
			title : '所属用户组',
			width : 80,
			align : 'left',
			sortable : true
		}, {
			field : 'positionname',
			title : '职位',
			width : 80,
			align : 'left',
			sortable : true
		} ] ]
	});
}

//创建用户组dialog
function createUserGroupDiaDialog(){
	if(userGroupFlg == 0){
		//用户组分类
		$('#userGroupTree').tree({
			checkbox : true,
			lines : true,
			animate : false,
			cascadeCheck : false,
			url : baseUrl + '/admin/U030/findGroupAddALL.html',
			onCheck : checkTreeNode
		});
	}
	userGroupFlg = 1;
}
//添加用户
function addUsersTOAddedGrid(){
	var rows=$('#unAddUserList').datagrid("getSelections");
	for(var i=0;i<rows.length;i++){
//		var index=$('#unAddUserList').datagrid("getRowIndex",rows[i]);
		$('#addedUserList').datagrid("appendRow",rows[i]);
//		$('#unAddUserList').datagrid("deleteRow",index);
	}
	$('#unAddUserList').datagrid("unselectAll");
	seachUserByParam();
}
//按用户组检索用户
function searchGroupUsers(){
	var items=$('#userGroupTree').tree('getChecked');
	var groupidstr="";
	for(var i=0;i<items.length;i++){
		if(items[i].id != 0){
			groupidstr+=","+items[i].id;
		}
	}
	groupids = groupidstr;
	$('#addedUserList').datagrid({
		url:baseUrl + '/admin/U010/findUserForLearn.html',
		queryParams:{
			groupids:groupidstr
		}
	});
	$('#updGroupIdsDia').dialog("close");
}
//删除用户
function deleteUser(){
	var rows = $('#addedUserList').datagrid("getSelections");
	for(var i in rows){
		var index = $("#addedUserList").datagrid("getRowIndex",rows[i]);
		$("#addedUserList").datagrid("deleteRow",index);
	}
}
//查询用户
function seachUserByParam() {
	var rows = $("#addedUserList").datagrid("getRows");
	var useridstr="";
	for(var i=0;i<rows.length;i++){
		useridstr+=","+rows[i].userid;
	}
	var treeItems=$('#userGroupTree').tree('getChecked');
	var groupidstr="";
	for(var i=0;i<treeItems.length;i++){
		if(treeItems[i].id != 0){
			groupidstr+=","+treeItems[i].id;
		}
	}
	var param = {
			username : '',
			groupid : 0,
			positionid:0,
			userids:useridstr
		};
	
	var search_username = $("#userLike").val();
	var search_groupid = $('#userGroupComboxTree').combotree('getValue');
	var search_positionid=$('#positionCombox').combobox('getValue');
	param.username = search_username;
	param.groupid = search_groupid;
	param.positionid = search_positionid;

	$('#unAddUserList').datagrid('load', param);
}
/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accAdd(arg1, arg2) {
	var r1, r2, m, c;
	try {
		r1 = arg1.toString().split(".")[1].length;
	}catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	}catch (e) {
		r2 = 0;
	}
	c = Math.abs(r1 - r2);
	m = Math.pow(10, Math.max(r1, r2));
	if (c > 0) {
		var cm = Math.pow(10, c);
		if (r1 > r2) {
			arg1 = Number(arg1.toString().replace(".", ""));
			arg2 = Number(arg2.toString().replace(".", "")) * cm;
		} else {
			arg1 = Number(arg1.toString().replace(".", "")) * cm;
			arg2 = Number(arg2.toString().replace(".", ""));
		}
	} else {
		arg1 = Number(arg1.toString().replace(".", ""));
		arg2 = Number(arg2.toString().replace(".", ""));
	}
	return (arg1 + arg2) / m;
}

//给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function (arg) {
	return accAdd(arg, this);
};
//打开用户dialog
function openUsersDlg(){
	var items=$('#addedUserList').datagrid("getRows");
	var useridstr="";
	for(var i=0;i<items.length;i++){
		useridstr+=","+items[i].userid;
	}
	var treeItems=$('#userGroupTree').tree('getChildren');
	var groupidstr="";
	for(var i=0;i<treeItems.length;i++){
		if(treeItems[i].id != 0){
			groupidstr+=","+treeItems[i].id;
		}
	}
	//加载权限下非选中用户
	$('#unAddUserList').datagrid("load",{userids:useridstr,groupids:groupidstr});
	$('#usersDia').dialog("open");
}
//打开用户组dialog
function openGroupDlg(){
	$('#updGroupIdsDia').dialog("open");
}
/**
 * 计算学时
 */
function calculateStudyTime(){
	//计算课程总数
	var courseTotalTime=0;
	$("input[name='coursewareTime']").each(function(){
		courseTotalTime=courseTotalTime.add($(this).val());
	});
	$("#courseTotalTime").text(courseTotalTime.toFixed(2));
	$("#courseTotalTimeHidden").val(courseTotalTime);
}