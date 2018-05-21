	//试题知识点分类setting
		var setting3 = {
			async: {
				enable: true,
				url:"StzClassify.html"
			},
			view: {
				addHoverDom: addHoverDom3,
				removeHoverDom: removeHoverDom3,
				dblClickExpand: false,
				showLine: true,
				selectedMulti: false
			},
			edit: {
				enable: true,
				editNameSelectAll: true,
				showRemoveBtn: showRemoveBtn3,
				showRenameBtn: showRenameBtn3,
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
				beforeDrag: beforeDrag3,
				beforeDrop: beforeDrop3,
				beforeEditName: beforeEditName3,
				beforeRemove: beforeRemove3,
				beforeRename: beforeRename3,
				onRemove: onRemove3,
				onRename: onRename3,
				onDrop: onDrop3
			}
		};

		var zNodes;
		var log, className = "dark";
		function beforeDrag3(treeId, treeNodes) {
			for (var i=0,l=treeNodes.length; i<l; i++) {
				if (treeNodes[i].drag === false) {
					return false;
				}
			}
			return true;
		}
		function showRemoveBtn3(treeId, treeNode) {
			
			if(treeNode.level>0){
				return true;
			}else{
				return false;
			}
		}
		function showRenameBtn3(treeId, treeNode) {
			if(treeNode.level>0){
				return true;
			}else{
				return false;
			}
		}
		function showLog3(str) {
			if (!log) log = $("#log");
			log.append("<li class='"+className+"'>"+str+"</li>");
			if(log.children("li").length > 8) {
				log.get(0).removeChild(log.children("li")[0]);
			}
		}
		function getTime3() {
			var now= new Date(),
			h=now.getHours(),
			m=now.getMinutes(),
			s=now.getSeconds(),
			ms=now.getMilliseconds();
			return (h+":"+m+":"+s+ " " +ms);
		}

		//移动用的方法
		//return true：可以操作移动
		function beforeDrop3(treeId, treeNodes, targetNode, moveType) {
			return true;
		}

		function removeHoverDom3(treeId, treeNode) {
			$("#addBtn_"+treeNode.tId).unbind().remove();
		};

		//一.beforeEditName3
		//试题知识点分类-treeDemo3
		function beforeEditName3(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLog3("[ "+getTime3()+" beforeEditName3 ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
			zTree.selectNode(treeNode);
			return true;
		}

		//二.添加节点
		//试题知识点分类-treeDemo3
		var newCount = 0;
		function addHoverDom3(treeId, treeNode) {
			var sObj = $("#" + treeNode.tId + "_span");
			if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
			var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
				+ "' title='添加组' onfocus='this.blur();'></span>";
				sObj.after(addStr);
			var btn = $("#addBtn_"+treeNode.tId);
			if (btn) btn.bind("click", function(){
				$.post("Stzadd.html",{"knowledgeid":treeNode.id,"num":++newCount},function(data){
					var id = data;
					var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
					zTree.addNodes(treeNode, {id:(id), knowledgeid:treeNode.id, name:"新建组"+newCount});
					msgShow("添加成功！");
					return false;
				});
			});
		};

		//三.修改节点之前
		//试题知识点分类-treeDemo3
		function beforeRename3(treeId, treeNode, newName, isCancel) {
			className = (className === "dark" ? "":"dark");
			showLog3((isCancel ? "<span style='color:red'>":"") + "[ "+getTime3()+
			" beforeRename3 ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
			if (newName.length == 0) {
				alert("节点名称不能为空.");
				var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
				setTimeout(function(){zTree.editName(treeNode)}, 10);
				return false;
			}
			return true;
		}

		//四.修改节点
		//试题知识点分类-treeDemo3
		function onRename3(e, treeId, treeNode, isCancel) {
			$.ajaxSetup({
				async:false
			});
			showLog3((isCancel ? "<span style='color:red'>":"") + "[ "+getTime3()+" onRename3 ]&nbsp;&nbsp;&nbsp;&nbsp; "
			+ treeNode.name + (isCancel ? "</span>":""));
			$.post("Stzupd.html",{"knowledgeid":treeNode.id,"name":treeNode.name},function(data){
				if(data==null || data==''){
					alert("分类名字已存在！");
				}
				
				//ztree刷新
				var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
				//zTree.reAsyncChildNodes(null, "refresh");
				return false;
			});
		}

		//五.删除节点前
		//试题知识点分类-treeDemo3
		function beforeRemove3(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLog3("[ "+getTime3()+" beforeRemove3 ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
			zTree.selectNode(treeNode);
			return confirm("确认删除 " + treeNode.name + " 吗？该知识点的子知识点将全部删除。");
		}

		//六.删除节点
		//试题知识点分类-treeDemo3
		function onRemove3(e, treeId, treeNode) {
			$.ajaxSetup({
				async:false
			});
			$.post("Stzdelete.html",{"knowledgeid":treeNode.id},function(data){
				showLog3("[ "+getTime3()+" onRemove3 ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
				msgShow("删除成功！");
			});
		}

		//七.移动节点
		//试题知识点分类-treeDemo3
		function onDrop3(event, treeId, treeNodes, targetNode, moveType, isCopy) {
			$.ajaxSetup({
				async:false
			});
			var tree = $.fn.zTree.getZTreeObj("treeDemo3");
			var nodes = tree.transformToArray(tree.getNodes());
			var str = "";
			for(var obj in nodes)
			{
				var id      = nodes[obj]['id'];
				var pid     = nodes[obj]['pId'];
				var name    = nodes[obj]['name'];
				if(id == 0) continue;
				var temp = "";
				temp += id+"*";
				temp += pid+"*";
				temp += name+"#";
				str += temp;
			}
			$.post("Stzmove.html",{"groups":str},function(data){
			});
		}
		
		$(function() { 
			$.fn.zTree.init($("#treeDemo3"), setting3);
		});