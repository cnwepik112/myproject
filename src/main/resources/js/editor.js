KindEditor.ready(function(K) {
	var options={
			minWidth : '700',
			minHeight :'200',
			resizeType:0,
			uploadJson : 'uploadImage.html?uploadPath=image',
			allowFileManager : false,
			items : [
					'bold','italic', 'underline', 'strikethrough', 'lineheight', 'removeformat','forecolor', 'hilitecolor', '|',
					'justifyleft', 'justifycenter', 'justifyright','justifyfull', 'insertorderedlist', 'insertunorderedlist',
					'indent','outdent', 'subscript','superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'table', 'hr',
					'image','media','link', 'unlink'
				],
		}
	KindEditor.create('#editor',options);
}); 