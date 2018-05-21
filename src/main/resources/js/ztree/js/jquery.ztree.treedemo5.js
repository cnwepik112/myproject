	//考试分类setting
		var setting5 = {
			async: {
				enable: true,
				url:"KsClassify.html"
			},
			view: {
				addHoverDom: addHoverDom5,
				removeHoverDom: removeHoverDom5,
				dblClickExpand: false,
				showLine: true,
				selectedMulti: false
			},
			edit: {
				enable: true,
				editNameSelectAll: true,
				showRemoveBtn: showRemoveBtn5,
				showRenameBtn: showRenameBtn5,
				removeTitle:"删除",
				renameTitle:"重命名",
				drag: {
					isCopy: true,
					isMove: true,
					prev: true,
					next: true,
					inner: true
				},
				renameTitle:"重命名",
				//Ztree拖拽
				drag: {
					isCopy:true,
					isMove:true,
					prev: true,
					next: true,
					inner: true
				}
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			callback: {
				beforeDrag: beforeDrag5,
				beforeDrop: beforeDrop5,
				beforeEditName: beforeEditName5,
				beforeRemove: beforeRemove5,
				beforeRename: beforeRename5,
				onRemove: onRemove5,
				onRename: onRename5,
				onDrop: onDrop5
			}
		};

		var zNodes;
		var log, className = "dark";
		function beforeDrag5(treeId, treeNodes) {
			for (var i=0,l=treeNodes.length; i<l; i++) {
				if (treeNodes[i].drag === false) {
					return false;
				}
			}
			return true;
		}
		function showRemoveBtn5(treeId, treeNode) {
			
			if(treeNode.level>0){
				return true;
			}else{
				return false;
			}
		}
		function showRenameBtn5(treeId, treeNode) {
			if(treeNode.level>0){
				return true;
			}else{
				return false;
			}
		}
		function showLog5(str) {
			if (!log) log = $("#log");
			log.append("<li class='"+className+"'>"+str+"</li>");
			if(log.children("li").length > 8) {
				log.get(0).removeChild(log.children("li")[0]);
			}
		}
		function getTime5() {
			var now= new Date(),
			h=now.getHours(),
			m=now.getMinutes(),
			s=now.getSeconds(),
			ms=now.getMilliseconds();
			return (h+":"+m+":"+s+ " " +ms);
		}

		//移动用的方法
		//return true：可以操作移动
		function beforeDrop5(treeId, treeNodes, targetNode, moveType) {
			return true;
		}

		function removeHoverDom5(treeId, treeNode) {
			$("#addBtn_"+treeNode.tId).unbind().remove();
		};

		//一.beforeEditName5
		//考试分类-treeDemo5
		function beforeEditName5(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLog5("[ "+getTime5()+" beforeEditName5 ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			var zTree = $.fn.zTree.getZTreeObj("treeDemo5");
			zTree.selectNode(treeNode);
			return true;
		}

		//二.添加节点
		//考试分类-treeDemo5
		var newCount = 0;
		function addHoverDom5(treeId, treeNode) {
			var sObj = $("#" + treeNode.tId + "_span");
			if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
			var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
				+ "' title='添加组' onfocus='this.blur();'></span>";
				sObj.after(addStr);
			var btn = $("#addBtn_"+treeNode.tId);
			if (btn) btn.bind("click", function(){
				$.post("Ksadd.html",{"sjclassifyid":treeNode.id,"num":++newCount},function(data){
					var id = data;
					var zTree = $.fn.zTree.getZTreeObj("treeDemo5");
					zTree.addNodes(treeNode, {id:(id), sjclassifyid:treeNode.id, name:"新建组"+newCount});
					msgShow("添加成功！");
					return false;
				});
			});
		};

		//三.修改节点之前
		//考试分类-treeDemo5
		function beforeRename5(treeId, treeNode, newName, isCancel) {
			className = (className === "dark" ? "":"dark");
			showLog5((isCancel ? "<span style='color:red'>":"") + "[ "+getTime5()+
			" beforeRename5 ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
			if (newName.length == 0) {
				alert("节点名称不能为空.");
				var zTree = $.fn.zTree.getZTreeObj("treeDemo5");
				setTimeout(function(){zTree.editName(treeNode)}, 10);
				return false;
			}
			return true;
		}

		//四.修改节点
		//考试分类-treeDemo5
		function onRename5(e, treeId, treeNode, isCancel) {
			$.ajaxSetup({
				async:false
			});
			showLog5((isCancel ? "<span style='color:red'>":"") + "[ "+getTime5()+" onRename5 ]&nbsp;&nbsp;&nbsp;&nbsp; "
			+ treeNode.name + (isCancel ? "</span>":""));
			$.post("Ksupd.html",{"sjclassifyid":treeNode.id,"name":treeNode.name},function(data){
				if(data==null || data==''){
					alert("分类名字已存在！");
				}
				
				//ztree刷新
				var zTree = $.fn.zTree.getZTreeObj("treeDemo5");
				//zTree.reAsyncChildNodes(null, "refresh");
				return false;
			});
		}

		//五.删除节点前
		//考试分类-treeDemo5
		function beforeRemove5(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLog5("[ "+getTime5()+" beforeRemove5 ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			var zTree = $.fn.zTree.getZTreeObj("treeDemo5");
			zTree.selectNode(treeNode);
			return confirm("确认删除 " + treeNode.name + " 吗？该考试分类的子分类将全部删除。");
		}

		//六.删除节点
		//考试分类-treeDemo5
		function onRemove5(e, treeId, treeNode) {
			$.ajaxSetup({
				async:false
			});
			$.post("Ksdelete.html",{"sjclassifyid":treeNode.id},function(data){
				showLog5("[ "+getTime5()+" onRemove5 ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
				msgShow("删除成功！");
			});
		}

		//七.移动节点
		//考试分类-treeDemo5
		function onDrop5(event, treeId, treeNodes, targetNode, moveType, isCopy) {
			$.ajaxSetup({
				async:false
			});
			var tree = $.fn.zTree.getZTreeObj("treeDemo5");
			var nodes = tree.transformToArray(tree.getNodes());
			var str = "";
			for(var obj in nodes)
			{
				var id = nodes[obj]['id'];
				var pid = nodes[obj]['pId'];
				var name = nodes[obj]['name'];
				if(id == 0) continue;
				var temp = "";
				temp += id+"*";
				temp += pid+"*";
				temp += name+"#";
				str += temp;
			}
			$.post("Ksmove.html",{"groups":str},function(data){
			});
		}
		
		$(function() { 
			$.fn.zTree.init($("#treeDemo5"), setting5);
		});