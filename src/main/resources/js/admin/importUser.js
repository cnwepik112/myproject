$(function() {
	$('#importUserForm').form({
		url : baseUrl + "/admin/U010/addUserFromExcel.html",
		onSubmit : function() {
			var file = $("#filePath").filebox("getValue");
			var num = file.lastIndexOf(".");
			var extname = file.substring(num + 1);
			if (extname != "xls" && extname != "xlsx") {
				alert("请选择xls或xlsx文件!");
				return false;
			}
			if($('#importUserForm').form("validate")){
				$.messager.progress({
					msg:'正在上传，请稍后...',text:'loading'});
			}
			
			return $('#importUserForm').form("validate");
		},
		success : function(data) {
			$("#rowerror").html("");
			$("#namerepeat").html("");
			$("#resNum").html("");
			$("#positionError").html("");
			var jsonData=eval('('+data+')');
			if (jsonData.error != -1) {
				$("#resNum").html(jsonData.res+"条记录。");
				if(jsonData.rowError.length>0){
					var rowItems=jsonData.rowError;
					var rownum="";
					for(var i=0;i<rowItems.length;i++){
						if(i==0){
							rownum+=rowItems[i];
						}else{
							rownum+=","+rowItems[i];
						}
					}
					$("#rowerror").html("第  <span style='color:red'>"+rownum+"</span> 条数据有误，请重新添加！");
				}
				if(jsonData.nameRepeat.length>0){
					var nameItems=jsonData.nameRepeat;
					var names="";
					for(var i=0;i<nameItems.length;i++){
						if(i==0){
							names+=nameItems[i];
						}else{
							names+=","+nameItems[i];
						}
					}
					$("#namerepeat").html("用户名  <span style='color:red'>"+names+"</span> 重复，请重新添加！");
				}
				if(jsonData.positionError.length>0){
					var rowItems=jsonData.positionError;
					var rownum="";
					for(var i=0;i<rowItems.length;i++){
						if(i==0){
							rownum+=rowItems[i];
						}else{
							rownum+=","+rowItems[i];
						}
					}
					$("#positionError").html("第  <span style='color:red'>"+rownum+"</span> 条数据职位有误，请重新添加！");
				}
				$.messager.progress('close');
			}else{
				msgShow("<span style='color:red'>上传失败，请稍后重试！</span>");
			}
			if (typeof(jsonData.message)!= "undefined" && jsonData.message!=''){
				alert(jsonData.message);
				return;
			}
		}
	});
	$('#userRole').combobox({
		url : baseUrl + '/admin/U040/findALLRole.html',
		editable : false,
		required : true,
		panelHeight : 60,
		valueField : 'roleid',
		textField : 'name'
	});

	$('#userGroup').combotree({
		multiple : false,
		checkbox : false,
		lines : true,
		animate : true,
		editable : false,
		url : baseUrl + '/admin/U030/findAllGroup.html',
		required : true
	});

});

function userFormSubmit() {
	$('#importUserForm').submit();
	return false;
}
