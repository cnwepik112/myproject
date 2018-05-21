/**
 * 证书添加js
 * 
 * @since 2015/06/29
 * @author Limeng
 */
$(function() {
	$('#addCertFrom').form({
		url : baseUrl + "/admin/Z010/addCert.html",
		onSubmit : function() {
			return $('#addCertFrom').form("validate");
		},
		success : function(data) {
			if (data > 0) {
				window.parent.closeTabByTitle("证书管理");
				window.parent.openTab("证书管理", baseUrl + "/admin/Z010/ManageCertificate.html");
				window.parent.closeTabByTitle("添加证书");
			} else if (data == 0) {
				msgShow("<span style='color:red'>该证书已存在！</span>");
			} else {
				msgShow("<span style='color:red'>未知错误！请稍后重试！</span>");
			}
		}
	});
	//本地上传加载上传的FileInput
	$('#uploadCoverFile').filebox({
		buttonText: '选择证书',
		onChange: function (newValue, oldValue) {
				var validateType=validateFileType(newValue);
				if(!validateType){
					msgShow("请上传gif、jpg、png格式的图片");
					return;
				}
				$('#uploadForm').submit();
			}
	});
	// 上传课程封面Form绑定
	$('#uploadForm').form({
		url : baseUrl + "/admin/C010/uploadCover.html",
		onSubmit : function() {
			return $('#uploadForm').form("validate");
		},
		success : function(data) {
			var obj = eval('(' + data + ')');
			if(obj.status=="success"){
				//上传成功
				$("#pic").val(obj.url);
				$("#certPic").attr("src",obj.url);
			}else if(obj.status=="typeError"){

				msgShow("上传类型错误");

			}else{
				msgShow("上传异常");
			}
		}
	});
	$('#dd').datebox({
		required:true
	}); 
});

function subAddCertForm(){
	$('#addCertFrom').submit();
	return false;
	
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
