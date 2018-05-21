$(function() {
	//默认上传类型FLV
	$("li:first").addClass("selecthover");
	$("#typeVal").val(1);
	$("#uploadFlg").val(0);
	//默认指定路径显示
	$("#specifiedPath").show();
	//资源分类隐藏
	$(".resourceClassify").hide();
	$("#studyTime").attr("readonly","readonly");
	$("#studyTime").attr("onfocus","this.blur();");
	//课件类型选择
	$("li").click(function(){
		$("#typeVal").val(parseInt($(this).attr("id")));
		$(this).addClass("selecthover").siblings().removeClass("selecthover");
		$("#studyTime").val("");
		if($(this).attr("id")>0&&$(this).attr("id")<=2){
			$("#specifiedPath").show();
			if($("#uploadFlg").val()==0){
				$("#studyTime").attr("readonly","readonly");
				$("#studyTime").attr("onfocus","this.blur();");
			}
		}else{
			$("#uploadFlg").val(0);
			$("#fileRadio").attr("checked","checked");
			$("#specifiedPath").hide();
			if($("#uploadFlg").val()==0){
				$("#studyTime").removeAttr("onfocus");
				$("#studyTime").removeAttr("readonly");
			}
		}
	});

	//点击指定路径
	$("#fileRadioHttp").click(function(){
		if($(this).is(":checked")){
			$("#addressTextUrl").validatebox("enableValidation");
			$("#fileRadio").removeAttr("checked");
			$(this).next().removeAttr("disabled");
			$("#uploadFlg").val(1);
			if($("#typeVal").val()>2){
				$("#studyTime").removeAttr("onfocus");
				$("#studyTime").removeAttr("readonly");
			}
			if($("#typeVal").val()<=2){
				$("#studyTime").removeAttr("onfocus");
				$("#studyTime").removeAttr("readonly");
			}
			//$("#uploadFile").attr("data-options","disabled:true");
		}
	});

	//点击本地上传
	$("#fileRadio").click(function(){
		if($(this).is(":checked")){
			$("#fileRadioHttp").removeAttr("checked");
			$("#fileRadioHttp").next().attr("disabled","disabled");
			$("#addressTextUrl").validatebox("disableValidation");
			//$("#uploadFile").removeAttr("data-options");
			$("#uploadFlg").val(0);
			if($("#typeVal").val()<=2){
				$("#studyTime").attr("readonly","readonly");
				$("#studyTime").attr("onfocus","this.blur();");
			}
		}
	});

	//本地上传加载上传的FileInput
	$('#uploadFile').filebox({
		buttonText: '选择文件',
		prompt:'请选择文件...',
		onChange: function (newValue, oldValue) {
				var validateType=validateFileType(newValue);
				if(!validateType){
					msgShow("上传类型错误");
					$('#uploadFile').filebox("setValue","");
					return;
				}
				$('#uploadForm').submit();
			}
	});

	// 上传Form绑定
	$('#uploadForm').form({
		url : "uploadCourseware.html",
		onSubmit : function() {
			return $('#uploadForm').form("validate");
		},
		success : function(data) {

			var obj = eval('(' + data + ')');
			if(obj.status=="success"){
				//上传成功
				//加载进度
				loadProgress();
				$("#type").val(obj.type);
				$("#address").val(0);
				$("#size").val(obj.size);
				$("#url").val(obj.url);
				var typeVal=parseInt($("#typeVal").val());
				if(typeVal==1||typeVal==2||typeVal==3||typeVal==4){
					$("#studyTime").val(obj.timeLength);
				}
				if(typeVal==5){
					creatPicGrid();
					$('#uploadFile').next().find(".textbox-text").val("");
					var row1 =$('#picList').datagrid('getRows');
					var obj1 = eval('(' + obj.picContent + ')');
					var row = {};
					row.picPath=obj1.picPath;
					row.picName=obj1.picName;
					row.classifyName=obj1.classifyName;
					row.uploadTime=obj1.uploadTime;
					row1.push(row);
					$('#picList').datagrid("loadData",row1);
				}
				msgShow("上传成功");

			}else if(obj.status=="typeError"){

				msgShow("上传类型错误");

			}else if(obj.status=="conversionError"){
                msgShow("转换PDF时发生错误");
            }else{
				msgShow("上传异常");
			}
		}
	});
	$('#addcoursewareFrom').form({
		url : "insCourseware.html",
		onSubmit : function() {
			return $('#addcoursewareFrom').form("validate");
		},
		success : function(data) {
			if(data>0){
				$.messager.confirm('提示', '添加课件成功！', function(r) {
					if (r) {
						window.parent.closeTabByTitle("课件管理");
						window.parent.openTab("课件管理", "admin/C020ManageCourseware.html");
						window.parent.closeTabByTitle("添加课件");
					}
				});
			}
		}
	});
	//课件分类下拉列表
	$('#coursewareClassifyCombox').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,//不可编辑
		url : baseUrl + '/admin/B020/findAllCoursewareClassify.html',
		required : true
	});
	//资源分类下拉列表
	$('#resourceClassifyCombox').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,//不可编辑
		url : baseUrl + '/admin/B020/findAllResourceClassify.html',
		required : false
	});
	//是否共享到资源库下拉列表
	$('#shareResourceCombox').combobox({
		valueField: 'id',
		textField: 'label',
		data: [{
			label: '否',
			id: '0',
			selected:true
		},{
			label: '是',
			id: '1'
		}],
		onSelect: function(rec){
			if(rec.id==1){
				$(".resourceClassify").show();
				$('#resourceClassifyCombox').combotree({required : true});
			}else{
				$(".resourceClassify").hide();
				$('#resourceClassifyCombox').combotree({required : false});
			}
		}
	});
});

	/**
	 * easyUi dataGrid注册方式说明，防止二次渲染 class注册方式一般是为了初始化属性，js方式则属性和事件都可初始化
	 * 但是不管是class方式还是js方式注册组件，每次注册，只要被设置过url属性就会做请求。
	 * 所以在不可避免要使用js方式注册的情况下，索性就不要使用class方式注册了。
	 */
	function creatPicGrid() {
		$('#picList').datagrid(
			{
				fit : true,// 设置为true时铺满它所在的容器.
				fitColumns : true,// 设置为true将自动使列适应表格宽度以防止出现水平滚动
				nowrap : false,// 设置为true，当数据长度超出列宽时将会自动截取。
				striped : true,// 设置为true将交替显示行背景。
				border : false,
				remoteSort : false,// 定义是否通过远程服务器对数据排序。
				rownumbers : true,// 行号
				singleSelect:true,
				columns : [ [ {
					field : 'picPath',
					title : '图片',
					width : 80,
					align : 'center',
					formatter : fmimage
				}, {
					field : 'url',
					title : 'asfasfd',
					width : 100,
					align : 'center',
					hidden:true
				}, {
					field : 'picName',
					title : '图片名称',
					width : 80,
					align : 'center'
				}, {
					field : 'classifyName',
					title : '类型',
					width : 80,
					align : 'center'
				}, {
					field : 'sort',
					title : '排序',
					width : 80,
					align : 'center',
					formatter:sort
	
				}, {
					field : 'uploadTime',
					title : '上传时间',
					width : 80,
					align : 'center'
				} ] ],
				// 当数据载入成功时触发。
				onLoadSuccess : function(data) {
					$('.move_first').linkbutton({
						iconCls : 'icon-top',
						plain : true
					});
					$('.move_up').linkbutton({
						iconCls : 'icon-up',
						plain : true
					});
					$('.move_down').linkbutton({
						iconCls : 'icon-down',
						plain : true
					});
					$('.move_last').linkbutton({
						iconCls : 'icon-bottom',
						plain : true
					});
				}
			});
	}

	/**
	 * 加载进度
	 */
	function loadProgress(){
		var fd = new FormData();
		fd.append("uploadFile", document.getElementsByName("file")[0].files[0]);
		var xhr = new XMLHttpRequest();
		xhr.upload.addEventListener("progress", uploadProgress, false);
		xhr.addEventListener("load", uploadComplete, false);
		xhr.addEventListener("error", uploadFailed, false);
		xhr.addEventListener("abort", uploadCanceled, false);
		xhr.open("POST", "uploadCourseware.html");
		xhr.send(fd);
	}

	/**
	 * 添加课件Form
	 */
	function addCoursewareForm(){
		if(!$("#fileRadioHttp").is(":checked")){
			var typeVal=parseInt(document.getElementById('typeVal').value);
	
			if(typeVal==5){
	
				var rows =$('#picList').datagrid('getRows');
	
				$("#url").val(JSON.stringify(rows));
			}
	
			var url=$("#url").val();
	
			if(url==""){
				alert("请先上传文件");
				return;
			}
		}
		$("#addcoursewareFrom").submit();
	}

	/**
	 * 验证文件类型
	 * 
	 * @param fileName
	 * @returns {Boolean}
	 */
	function validateFileType(fileName){

		//选中的文件类型
		var typeVal=parseInt(document.getElementById('typeVal').value);

		//获取文件的扩展名
		var dotNdx = fileName.lastIndexOf('.');

		//扩展名变成小写
		var exetendName = fileName.slice(dotNdx + 1).toLowerCase();

		//定义返回值
		var checkType=false;

		//判断类型
		switch(typeVal)
		{
		case 1:// FLV
			checkType=(exetendName=="flv");
			break;
		case 2:// MP4
			checkType=exetendName=="mp4";
			break;
		case 3:// SWF
			checkType = exetendName=="swf";
			break;
		case 4:// MP3
			checkType = exetendName=="mp3";
			break;
		case 5:// PIC
			checkType = exetendName=="png"||exetendName=="jpg"||exetendName=="jpeg"||exetendName=="gif";
			break;
		case 6:// PDF
			checkType = exetendName=="pdf";
			break;
		case 7:// WORD
			checkType = exetendName=="doc"||exetendName=="docx";
			break;
		default:// EXCEL
			checkType = exetendName=="xls"||exetendName=="xlsx";
		}
		//返回文件类型的验证值
		return checkType;
	}

	/**
	 * 格式化图片
	 */
	function fmimage(value, rowData, rowIndex){
		return "<img src='"+value+"' style='width:50px;height:40px;border:1px solid #c3d9e0; margin:2px;'/>";
	}

	/**
	 * 格式化排序
	 */
	function sort(value,rowData,rowIndex){
		return	"<a href='javascript:moveFirstSort();' title='置顶' class='move_first'></a>" +
				"<a href='javascript:moveUpSort();' title='上移' class='move_up'></a>" +
				"<a href='javascript:moveDownSort();' title='下移' class='move_down'></a>" +
				"<a href='javascript:moveLastSort();' title='置底' class='move_last'></a>";
	}

	/**
	 * 向上排序
	 */
	function moveUpSort(){
		var rows =$('#picList').datagrid('getRows');
		var row=$('#picList').datagrid('getSelected');
		var index=$('#picList').datagrid('getRowIndex',row);
		if(index==0){
			msgShow("已经是第一个了");
			return;
		}
		var oldRow=rows[index-1];
		rows[index-1]=row;
		rows[index]=oldRow;
		$('#picList').datagrid('loadData',rows);
	}

	/**
	 * 向下排序
	 */
	function moveDownSort(){
		var rows =$('#picList').datagrid('getRows');
		var row=$('#picList').datagrid('getSelected');
		var index=$('#picList').datagrid('getRowIndex',row);
		if((rows.length-1)==index){
			msgShow("已经是最后一个了");
			return;
		}
		var oldRow=rows[index+1];
		rows[index+1]=row;
		rows[index]=oldRow;
		$('#picList').datagrid('loadData',rows);
	}

	/**
	 * 排序到第一个
	 */
	function moveFirstSort(){
		var rows =$('#picList').datagrid('getRows');
		var row=$('#picList').datagrid('getSelected');
		var index=$('#picList').datagrid('getRowIndex',row);
		if(index==0){
			msgShow("已经是第一个了");
			return;
		}
		var oldRow;
		for(var i=index-1;i>=0;i--){
			oldRow=rows[i];
			rows[i+1]=oldRow;
		}
		rows[0]=row;
		$('#picList').datagrid('loadData',rows);
	}

	/**
	 * 排序到最后一个
	 */
	function moveLastSort(){
		var rows =$('#picList').datagrid('getRows');
		var length=rows.length;
		var row=$('#picList').datagrid('getSelected');
		var index=$('#picList').datagrid('getRowIndex',row);
		if(length-1==index){
			msgShow("已经是最后一个了");
			return;
		}
		var oldRow;
		for(var i=index+1;i<=length;i++){
			oldRow=rows[i];
			rows[i-1]=oldRow;
		}
		rows[length-1]=row;
		$('#picList').datagrid('loadData',rows);
	}
	// 刷新
	function reloadGrid() {
		$('#picList').datagrid('load');
	}
	function uploadProgress(evt) {
		if (evt.lengthComputable) {
			var percentComplete = Math.round(evt.loaded * 100 / evt.total);
			$('#progressNumber').progressbar('setValue', percentComplete);
		}
		else {
			document.getElementById('progressNumber').innerHTML = '无法计算';
		}
	}
	function uploadComplete(evt) {
		//服务器返回数据
		//var message = evt.target.responseText;
	}
	function uploadFailed(evt) {
		msgShow("上传出错!");
	}
	function uploadCanceled(evt) {
		msgShow("上传已由用户或浏览器取消删除连接");
	}