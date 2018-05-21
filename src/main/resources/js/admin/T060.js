$(function() {
	creatGrid();
	creatUserGrid();
});

/**
 * easyUi dataGrid注册方式说明，防止二次渲染 class注册方式一般是为了初始化属性，js方式则属性和事件都可初始化
 * 但是不管是class方式还是js方式注册组件，每次注册，只要被设置过url属性就会做请求。
 * 所以在不可避免要使用js方式注册的情况下，索性就不要使用class方式注册了。
 */
function creatGrid() {
	$('#itemlist').datagrid(
		{
			fit : true,// 设置为true时铺满它所在的容器.
			//fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
			nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
			striped : true,// 设置为true将交替显示行背景。
			collapsible : true,// 定义是否显示可折叠按钮。
			singleSelect : true,// 设置为true将只允许选择一行。
			border : false,
			remoteSort : false,// 定义是否通过远程服务器对数据排序。
			pagination : true,// 分页组件是否显示
			pageNumber : 1,// 起始页
			pageSize : 10,// 每页显示的记录条数，默认为10
			pageList : [ 10, 20, 50 ],// 每页显示多少行
			rownumbers : true,// 行号
			idField : 'ksid',
			url : baseUrl + '/admin/T060/findEvaluationList.html',
			columns : [ [ {
				field : 'ksname',
				title : '考试名称',
				width : 200,
				fixed : true,
				align : 'left',
				sortable : true,
				sorter : datasort,
				formatter:titleLength
			},{
				field : 'begintm',
				title : '开始时间',
				width : 140,
				align : 'center',
				sortable : true,
				sorter : datasort,
				formatter : fmdate
			},{
				field : 'endtm',
				title : '结束时间',
				width : 140,
				align : 'center',
				sortable : true,
				sorter : datasort,
				formatter : fmdate
			},{
				field : 'manage',
				title : '操作',
				align : 'center',
				width : 100,
				formatter : fmup
			} ] ],
			// 当数据载入成功时触发。
			onLoadSuccess : function(data) {
				$('.select_qsn').linkbutton({
					iconCls : 'icon-ok',
					plain : true
				});
				if(selectIndex > 0){
					$('#itemlist').datagrid('selectRecord',selectIndex);
					var row=$('#itemlist').datagrid('getSelected');
					if(row.exammanual == 2){
						$('#itemlist1').datagrid('hideColumn','username');
					}else{
						$('#itemlist1').datagrid('showColumn','username');
					}
				}
			},
			onSelect:function(index,row){
				$('#itemlist1').datagrid({
					url: baseUrl + '/admin/T060/findEvaluationUserList.html',
					queryParams:{
						ksid:row.ksid
					}
				});
				if(row.exammanual == 2){
					$('#itemlist1').datagrid('hideColumn','username');
				}else{
					$('#itemlist1').datagrid('showColumn','username');
				}
			}
		});

}
function creatUserGrid() {
	$('#itemlist1').datagrid(
		{
			fit : true,// 设置为true时铺满它所在的容器.
			//fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
			nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
			striped : true,// 设置为true将交替显示行背景。
			collapsible : true,// 定义是否显示可折叠按钮。
			singleSelect : true,// 设置为true将只允许选择一行。
			border : false,
			remoteSort : false,// 定义是否通过远程服务器对数据排序。
			pagination : true,// 分页组件是否显示
			pageNumber : 1,// 起始页
			pageSize : 10,// 每页显示的记录条数，默认为10
			pageList : [ 10, 20, 50 ],// 每页显示多少行
			rownumbers : true,// 行号
			columns : [ [ {
				field : 'username',
				title : '考生姓名',
				width : 100,
				fixed : true,
				align : 'left',
				sortable : true,
				sorter : datasort,
				formatter:titleLength
			},{
				field : 'sjtitle',
				title : '试卷名称',
				width : 200,
				fixed : true,
				align : 'left',
				sortable : true,
				sorter : datasort,
				formatter:titleLength
			},{
				field : 'totalsorce',
				title : '总分',
				width : 60,
				align : 'right',
				sortable : true,
				sorter : datasort
			},{
				field : 'okrate',
				title : '及格分',
				width : 60,
				align : 'right',
				sortable : true,
				sorter : datasort
			},{
				field : 'manage',
				title : '操作',
				align : 'center',
				width : 100,
				formatter : fmuserup
			} ] ],
			// 当数据载入成功时触发。
			onLoadSuccess : function(data) {
				$('.edit_qsn').linkbutton({
					iconCls : 'icon-edit',
					plain : true
				});
			}
		});

}
function titleLength(value, rowData, rowIndex){
	if(value.length>15){
		return value.substr(0,15);
	}
	return value;
}
function fmReview(value, rowData, rowIndex){
	if(value){
		return "已审核";
	}
	return "未审核";
}

function fmup(value, rowData, rowIndex) {
	var id = rowData.ksid;
	var str = "<a onclick='findKsUser(" + id +","+rowData.exammanual+")' class='select_qsn'>选择</a>";
	return str;
}
function fmuserup(value, rowData, rowIndex) {
	var ksid = rowData.id;
	var state=rowData.state;
	var str ="";
	if(state > 3){
		str = "<a onclick='editKsUser("+ksid+")' class='edit_qsn'>评分</a>";
	}else{
		str = "考试中...";
	}
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


// 查询
function seachSjByParam() {
	var param = {
		title : ''
	};

	var search_title = $("#searchtitle").val();
	
	param.title = search_title;
	
	$('#itemlist').datagrid('load', param);
}
//编辑试卷
function findKsUser(id,exammanual){
	$('#itemlist1').datagrid({
		url: baseUrl + '/admin/T060/findEvaluationUserList.html',
		queryParams:{
			ksid:id
		}
	});
//	,
//	onLoadSuccess:function(){
		if(exammanual == 2){
			$('#itemlist1').datagrid('hideColumn','username');
		}else{
			$('#itemlist1').datagrid('showColumn','username');
		}
//	}
}
function editKsUser(ksid){
	window.parent.closeTabByTitle("人工评分");
	window.parent.openTab("人工评分", baseUrl+"/admin/T060/evaluationEdit.html?id="+ksid);
}