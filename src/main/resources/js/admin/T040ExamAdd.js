var flagShiJuan = 0;
var flagCertificates = 0;
var ids = '';
var idc = '';
var userGroupFlg = 0;
var addUserFlg = 0;
var totalScore = '';

$(function() {
	if(selectSjid != 0){
		ids+=selectSjid+",";
		$.post(baseUrl + "/admin/T040/findExamPapersSelected.html",{"ids":ids},function(data){
			//设置显示总分
			$("#totalsorce").html(data[0].totalsorce + " 分");
			//试卷grid加载本地数据
			$("#shijuanManage").datagrid("loadData",data);
			//总分赋值
			totalScore=data[0].totalsorce;
		},"json");
	}
	$("#userSignupFlg").click(function() {
		if ($(this).is(":checked")) {
			$("#tab").tabs("select", 0);
			$('#tab').tabs('getTab', '用户/组').panel('options').tab.hide();
		} else {
			$('#tab').tabs('getTab', '用户/组').panel('options').tab.show();
		}
	});
	// 考试分类
	$('#examClassify').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,// 不可编辑
		url : baseUrl + '/admin/B010/findKaoShiClass.html',
		required : true
	});
	// 用户组分类
	$('#userGroupComboxTree').combotree({
		multiple : false,
		panelMinWidth : 200,
		panelMaxWidth : 300,
		panelMaxHeight : 200,
		lines : true,
		editable : false,
		url : baseUrl + '/admin/U030/findGroupAddALL.html',
		required : false,
		onHidePanel : getChildren
	});
	// 职位分类
	$('#positionCombox').combobox({
		url : baseUrl +'/admin/U060/findPosition.html',
		panelHeight : 60,
		valueField : 'positionid',
		textField : 'name'
	});
	// 上传课程封面Form绑定
	$('#uploadForm').form({
		url : baseUrl + "/admin/C010/uploadCover.html",
		success : function(data) {
			var obj = eval('(' + data + ')');
			if (obj.status == "success") {
				// 上传成功
				$("#cover").val(obj.url);
				$("#coverPic").attr("src", obj.url);
				// msgShow("上传成功");
			} else if (obj.status == "typeError") {
				msgShow("上传类型错误");
			} else {
				msgShow("上传异常");
			}
		}
	});
	// 初始化文件上传框
	$("#uploadCoverFile").filebox({
		buttonText : "选择封面",
		onChange : function(newValue, oldValue) {
			var validateType = validateFileType(newValue);
			if (!validateType) {
				msgShow("请上传gif、jpg、jepg、png格式的图片");
				return;
			}
			$('#uploadForm').submit();
		}
	});
	// 添加考试Form绑定
	$('#addExamForm').form(
			{
				success : function(data) {
					if (data) {
						// 添加成功
						alert("添加成功");
						window.parent.closeTabByTitle("考试管理");
						window.parent.openTab("考试管理", baseUrl
								+ '/admin/T040/examManage.html');
						window.parent.closeTabByTitle("添加考试");
					} else {
						alert("添加失败！");
					}
				}
			});
	// 用户列表
	$("#addedUserList").datagrid({
		url : baseUrl + "/admin/T040/findSelectedUser.html",
		queryParams : {
			'ksid' : $("#ksid").val()
		}
	});
	
	$("#seach_Cer").on("click",function(event){
        var name = $("#cer_name").val();
        var number = $("#cer_num").val();
        var issueAgency = $("#cer_ent").val();
        var begintm = $("#cer_begintm").datebox("getValue");
        var endtm = $("#cer_endtm").datebox("getValue");
        
        $("#addCertificates_table").datagrid({
            queryParams : {
                'name' : name,
                'number' : number,
                'issueAgency' : issueAgency,
                'begintm' : begintm,
                'endtm' : endtm
            }
        });
    });
    $("#seach_Shijuan").on("click",function(event){
        //var sjClassifyId = $("#sjClassify").combobox("getValue");
    	var sjClassifyId = sjclassifyids;
        var title = $("#shijuan_title").val();
        var insUserName = $("#shijuan_user").val();
        
        $("#addShiJuan_table").datagrid({
            queryParams : {
                'sjClassifyId' : sjClassifyId,
                'title' : title,
                'insUserName' : insUserName
            }
        });
    });
});

// 添加试卷 初始化添加试卷列表
function addShiJuan() {
	if (flagShiJuan == 0) {
		var rows = $("#shijuanManage").datagrid("getRows");
		for ( var i in rows) {
			ids += rows[i].sjid + ',';
		}
		ids = ids.substring(0, ids.length - 1);
		// 初始化试卷分类
		$('#sjClassify').combotree({
			multiple : false,
			checkbox : false,
			lines : true,
			animate : true,
			editable : false,// 不可编辑
			onHidePanel : getChildrensjClassify,//获取子节点
			url : baseUrl + '/admin/B010/findShiJuanClassAddALL.html',
			required : false
		});
		// 初始化试卷添加表格
		$("#addShiJuan_table").datagrid({
			url : baseUrl + '/admin/C010/findExamPapers.html',
			queryParams : {
				'shijuanIds' : ids
			},
			rownumbers : true,
			singleSelect : false,
			fitColumns : true,
			pagination : true,// 分页组件是否显示
			pageSize : 10,// 每页显示的记录条数，默认为10
			pageList : [ 10, 20, 50 ],// 每页显示多少行
			columns : [ [ {
				field : 'ck',
				checkbox : true
			}, {
				field : 'title',
				title : '试卷名称',
				width : 280,
				align : 'center'
			}, {
				field : 'classifyName',
				title : '试卷分类',
				width : 120,
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
			}, {
				field : 'manage',
				title : '预览',
				width : 80,
				align : 'center',
				formatter : fmup
			} ] ],
			onLoadSuccess : iconSee
		});
		flagShiJuan = 1;
	}
	$('#addShiJuan').window('open');
}
var sjclassifyids="";//全局变量
function getChildrensjClassify() {
	var grouptree =  $('#sjClassify').combotree('tree');//对应combotreeID
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
	sjclassifyids=ids;//赋值给全局变量 记录所选分类全部ID
}

// 添加试卷保存
function saveShiJuan() {
	var sjRow = $("#shijuanManage").datagrid("getRows");
	var rows = $("#addShiJuan_table").datagrid("getSelections");

	totalScore = 0;
	if (sjRow.length > 0) {
		totalScore = sjRow[0].totalsorce;
	} else if (rows.length > 0) {
		totalScore = rows[0].totalsorce;
	}

	if (ids != '') {
		ids += ',';
	}

	for ( var i in rows) {
		if (totalScore != rows[i].totalsorce) {
			alert("试卷总分不一致！");
			return;
		}
	}
	$("#totalsorce").html(totalScore + " 分");
	for ( var i in rows) {
		$("#shijuanManage").datagrid("appendRow", rows[i]);
		ids += rows[i].sjid + ',';
	}
	$('#addShiJuan').window('close');
	ids = ids.substring(0, ids.length - 1);
	$("#addShiJuan_table").datagrid({
		queryParams : {
			'shijuanIds' : ids
		}
	});
}

// 从考试中删除试卷
function delShiJuan() {
	var rows = $("#shijuanManage").datagrid("getSelections");
	for ( var i in rows) {
		var index = $("#shijuanManage").datagrid("getRowIndex", rows[i]);
		$("#shijuanManage").datagrid("deleteRow", index);
	}
	var rowShiJuan = $("#shijuanManage").datagrid("getRows");
	ids = '';
	for ( var i in rowShiJuan) {
		ids += rowShiJuan[i].sjid + ',';
	}
	ids = ids.substring(0, ids.length - 1);
	if (flagShiJuan == 1) {
		$("#addShiJuan_table").datagrid({
			queryParams : {
				'shijuanIds' : ids
			}
		});
	}
}

function addCertificates() {
	if (flagCertificates == 0) {
		var rows = $("#certificatesManage").datagrid("getRows");
		for ( var i in rows) {
			idc += rows[i].certId + ',';
		}
		idc = idc.substring(0, idc.length - 1);
		// 初始化证书添加表格
		$("#addCertificates_table").datagrid({
			url : baseUrl + '/admin/C010/findCertificates.html',
			queryParams : {
				'certIds' : idc
			},
			rownumbers : true,
			singleSelect : false,
			fitColumns : true,
			pagination : true,// 分页组件是否显示
			pageSize : 10,// 每页显示的记录条数，默认为10
			pageList : [ 10, 20, 50 ],// 每页显示多少行
			columns : [ [ {
				field : 'ck',
				checkbox : true
			}, {
				field : 'name',
				title : '证书名称',
				width : 240,
				align : 'center'
			}, {
				field : 'number',
				title : '证书编号',
				width : 120,
				align : 'right'
			}, {
				field : 'issueAgency',
				title : '发证机构',
				width : 120,
				align : 'right'
			}, {
				field : 'expiryDate',
				title : '证件有效期',
				width : 80,
				align : 'right'
			}, {
				field : 'issueDate',
				title : '发证时间',
				width : 120,
				align : 'right'
			} ] ]
		});
		flagCertificates = 1;
	}
	$('#addCertificates').window('open');
}

function saveCertificates() {
	var rows = $("#addCertificates_table").datagrid("getSelections");
	if (idc != '') {
		idc += ',';
	}
	for ( var i in rows) {
		$("#certificatesManage").datagrid("appendRow", rows[i]);
		idc += rows[i].certId + ',';
	}
	$('#addCertificates').window('close');
	idc = idc.substring(0, idc.length - 1);
	$("#addCertificates_table").datagrid({
		queryParams : {
			'certIds' : idc
		}
	});
}

function delCertificates() {
	var rows = $("#certificatesManage").datagrid("getSelections");
	for ( var i in rows) {
		var index = $("#certificatesManage").datagrid("getRowIndex", rows[i]);
		$("#certificatesManage").datagrid("deleteRow", index);
	}
	var rowCertificates = $("#certificatesManage").datagrid("getRows");
	idc = '';
	for ( var i in rowCertificates) {
		idc += rowCertificates[i].certId + ',';
	}
	idc = idc.substring(0, idc.length - 1);
	if (flagCertificates == 1) {
		$("#addCertificates_table").datagrid({
			queryParams : {
				'certIds' : idc
			}
		});
	}
}

/**
 * 验证文件类型
 * 
 * @param fileName
 * @returns {Boolean}
 */
function validateFileType(fileName) {
	// 获取文件的扩展名
	var dotNdx = fileName.lastIndexOf('.');
	// 扩展名变成小写
	var exetendName = fileName.slice(dotNdx + 1).toLowerCase();
	// 定义返回值
	var checkType = false;
	// 判断类型
	checkType = exetendName == "png" || exetendName == "jpg"
			|| exetendName == "gif" || exetendName == "jepg";
	// 返回文件类型的验证值
	return checkType;
}

function saveExam() {
    if(totalScore == ''){
        alert("请添加试卷！");
        return;
    }
	if (totalScore < $("#okrate").val()) {
		alert("及格分不能大于总分！");
		return;
	} else if ($("#okrate").val() == 0) {
		alert("及格分不能为0！");
		return;
	}
	// 答卷时长
	var totalTm = parseInt($("input[name='totaltm']").val());
	// 开始考试多少分钟后禁止考生参加
	var disableexam = parseInt($("input[name='disableexam']").val());
	// 开始考试 多少 分钟内禁止考生交卷
	var disablesubmit = parseInt($("input[name='disablesubmit']").val());
	if (disablesubmit > totalTm) {
		// 开始考试多少分钟后禁止考生参加
		alert("禁止考生参加开始考试的分钟的设置不能超过答卷时长！");
		return;
	}
	if (disableexam > totalTm) {
		// 开始考试 多少 分钟内禁止考生交卷
		alert("禁止考生交卷开始考试的分钟的设置不能超过答卷时长！");
		return;
	}

	// 设置考试控制值
	if ($("#userSignupFlg").is(":checked")) {
		$("input[name='usersignupflg']").val("1");
	}
	if ($("#passingAgainFlg").is(":checked")) {
		$("input[name='passingagainflg']").val("1");
	}
	if ($("#qsnRandomFlg").is(":checked")) {
		$("input[name='qsnrandomflg']").val("1");
	}
	if ($("#publishAnswerFlg").is(":checked")) {
		$("input[name='publishanswerflg']").val("1");
	}
	if ($("#isResultRank").is(":checked")) {
		$("input[name='isresultrank']").val("1");
	}
	if ($("#optionChaosFlg").is(":checked")) {
        $("input[name='optionChaosFlg']").val("1");
    }

	// 设置关联试卷id
	var shijuan = $("#shijuanManage").datagrid("getRows");
	var sjid = '';
	for ( var i in shijuan) {
		sjid += shijuan[i].sjid + ",";
	}
	if (sjid == '') {
		alert("试卷不能为空！");
		return;
	}
	sjid = sjid.substring(0, sjid.length - 1);
	$("#sjid").val(sjid);

	// 设置关联证书id
	var certificates = $("#certificatesManage").datagrid("getRows");
	var cerId = '';
	for ( var i in certificates) {
		cerId += certificates[i].certId + ",";
	}
	cerId = cerId.substring(0, cerId.length - 1);
	$("#cerId").val(cerId);

	// 设置用户id
	var rowsUser = $("#addedUserList").datagrid("getRows");
	var userId = '';
	for ( var i in rowsUser) {
		userId += rowsUser[i].userid + ",";
	}
	// 不需要报名
	if (userId == '' && !$("#userSignupFlg").is(":checked")) {
		alert("考生不能为空！");
		return;
	}
	userId = userId.substring(0, userId.length - 1);
	$("#userIds").val(userId);

	$("#addExamForm").submit();

}

// 创建未添加用户列表
function createAddUserDialog() {
	if (addUserFlg == 0) {
		$('#unAddUserList').datagrid({
			fit : true,// 设置为true时铺满它所在的容器.
			fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
			nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
			striped : true,// 设置为true将交替显示行背景。
			collapsible : true,// 定义是否显示可折叠按钮。
			singleSelect : false,// 设置为true将只允许选择一行。
			idField : 'userid',
			border : false,
			remoteSort : false,// 定义是否通过远程服务器对数据排序。
			rownumbers : true,// 行号
			pagination : true,// 分页组件是否显示
			pageSize : 10,// 每页显示的记录条数，默认为10
			pageList : [ 10, 20, 50 ],// 每页显示多少行
			url : baseUrl + '/admin/U010/findUserForLearn.html',
			frozenColumns : [ [ {
				field : 'select',
				title : '选择',
				width : 50,
				checkbox : true
			} ] ],
			columns : [ [ {
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
			} , {
				field : 'examcard',
				title : '学历',
				width : 80,
				align : 'left',
				sortable : true
			} ] ]
		});
		addUserFlg = 1;
	}
	seachUserByParam();
	$('#usersDia').window('open');
}

// 查询用户
function seachUserByParam() {
	var rows = $("#addedUserList").datagrid("getRows");
	var useridstr = "";
	for ( var i = 0; i < rows.length; i++) {
		useridstr += "," + rows[i].userid;
	}
	var treeItems=$('#userGroupTree').tree('getChecked');
	var groupidstr="";
	for(var i=0;i<treeItems.length;i++){
		if(treeItems[i].id != 0){
			groupidstr+=","+treeItems[i].id;
		}
	}
	
	var ingroupids = $('#ingroupids').val();
	if(ingroupids != "" && ingroupids != null){
		groupidstr=","+ingroupids;
	}
	groupidstr =groupidstr+","+classifyids;
	var param = {
		username : '',
		examcard : '',
		positionid : 0,
		userids : useridstr,
		groupids:groupidstr
		//groupids:''
	};

	var search_username = $("#userLike").val();
	var search_examcard = $("#examCardLike").val();
	var search_groupids = classifyids;
	var search_positionid = $('#positionCombox').combobox('getValue');
	param.username = search_username;
	param.examcard = search_examcard;
	param.positionid = search_positionid;
	param.groupids = search_groupids;

	$('#unAddUserList').datagrid('load', param);
}

// 创建用户组dialog
function createUserGroupDiaDialog() {
	if (userGroupFlg == 0) {
		// 用户组分类
		$('#userGroupTree').tree({
			checkbox : true,
			lines : true,
			animate : false,
			cascadeCheck : false,
			onCheck : checkTreeNode,
			url : baseUrl + '/admin/U030/findGroupAddALL.html'
		});
	}
	userGroupFlg = 1;
	$("#updGroupIdsDia").window('open');
}

// 按用户组检索用户
function searchGroupUsers() {
	var items = $('#userGroupTree').tree('getChecked');
	var groupidstr = "";
	for ( var i = 0; i < items.length; i++) {
		if (items[i].id != 0) {
			groupidstr += "," + items[i].id;
		}
	}
	groupids = groupidstr;
	$('#addedUserList').datagrid({
		url : baseUrl + '/admin/U010/findUserForLearn.html',
		queryParams : {
			groupids : groupidstr
		}
	});
	$('#updGroupIdsDia').dialog("close");
}

// 删除用户
function deleteUser() {
	var rows = $('#addedUserList').datagrid("getSelections");
	for ( var i in rows) {
		var index = $("#addedUserList").datagrid("getRowIndex", rows[i]);
		$("#addedUserList").datagrid("deleteRow", index);
	}
}

// 添加用户
function addUsersTOAddedGrid() {
	var rows = $('#unAddUserList').datagrid("getSelections");
	for ( var i = 0; i < rows.length; i++) {
		// var index=$('#unAddUserList').datagrid("getRowIndex",rows[i]);
		$('#addedUserList').datagrid("appendRow", rows[i]);
		// $('#unAddUserList').datagrid("deleteRow",index);
	}
	$('#unAddUserList').datagrid("clearSelections");
	seachUserByParam();
}
function fmup(value, rowData, rowIndex) {
	var id = rowData.sjid;
	var str = "<a onclick='showSj(" + id + ")' class='see_qsn'>预览</a>";
	return str;
}
function showSj(id) {
	window.parent.closeTabByTitle("试卷预览");
	window.parent.openTab("试卷预览", baseUrl + "/admin/T030/previewSj.html?sjid="
			+ id);
}
function iconSee() {
	$('.see_qsn').linkbutton({
		iconCls : 'icon-search',
		plain : true
	});
}
/**
 * 改变成绩发布时间发布方式 考试成绩发布时间模式发生改变时触发此方法
 */
function changeTimeValidate(obj) {
	var item = $(obj);
	if (item.val() == "1") {
		$("#resultPublishTime").datetimebox({
			required : true
		});
		// $("#resultPublishTime").datetimebox('setValue',CurentTime());
	} else {
		$("#resultPublishTime").datetimebox({
			required : false
		});
	}
}
// 得到当前时间字符串，格式为：YYYY-MM-DD HH:MM:SS
function CurentTime() {
	var now = new Date();

	var year = now.getFullYear(); // 年
	var month = now.getMonth() + 1; // 月
	var day = now.getDate(); // 日

	var hh = now.getHours(); // 时
	var mm = now.getMinutes(); // 分
	var ss = now.getSeconds(); // 秒

	var clock = year + "-";

	if (month < 10)
		clock += "0";
	clock += month + "-";

	if (day < 10)
		clock += "0";
	clock += day + " ";

	if (hh < 10)
		clock += "0";
	clock += hh + ":";

	if (mm < 10)
		clock += '0';
	clock += mm + ":";

	if (ss < 10)
		clock += '0';
	clock += ss;

	return (clock);
}
//实现选中子节点不关联父节点，选中父节点选中子节点
function checkTreeNode(node, checked) {
	if (checked) {
		if (node.children != null) {
			var children = $('#userGroupTree').tree('getChildren', node.target);
			for ( var i = 0; i < children.length; i++) {
				$('#userGroupTree').tree('check', children[i].target);
			}
		}
	}
}
var classifyids="";//全局变量
function getChildren() {
	var grouptree =  $('#userGroupComboxTree').combotree('tree');//对应combotreeID
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
/*function getChildren() {
	var grouptree = $('#userGroupComboxTree').combotree('tree');
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
	$("#ingroupids").val(ids);
}*/