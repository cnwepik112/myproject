//资源库分类setting
		var settingzy = {
			async: {
				enable: true,
				url:"ZyClassify.html"
			},
			view: {
				addHoverDom: addHoverDomzy,
				removeHoverDom: removeHoverDomzy,
				selectedMulti: false
			},
			edit: {
				enable: true,
				editNameSelectAll: true,
				showRemoveBtn: showRemoveBtnzy,
				showRenameBtn: showRenameBtnzy,
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
				beforeDrag: beforeDragzy,
				beforeDrop: beforeDropzy,
				beforeEditName: beforeEditNamezy,
				beforeRemove: beforeRemovezy,
				beforeRename: beforeRenamezy,
				onRemove: onRemovezy,
				onRename: onRenamezy,
				onDrop: onDropzy
			}
		};

		var zNodes;
		var log, className = "dark";
		function beforeDragzy(treeId, treeNodes) {
			for (var i=0,l=treeNodes.length; i<l; i++) {
				if (treeNodes[i].drag === false) {
					return false;
				}
			}
			return true;
		}
		function showRemoveBtnzy(treeId, treeNode) {
			
			if(treeNode.level>0){
				return true;
			}else{
				return false;
			}
		}
		function showRenameBtnzy(treeId, treeNode) {
			if(treeNode.level>0){
				return true;
			}else{
				return false;
			}
		}
		function showLogzy(str) {
			if (!log) log = $("#log");
			log.append("<li class='"+className+"'>"+str+"</li>");
			if(log.children("li").length > 8) {
				log.get(0).removeChild(log.children("li")[0]);
			}
		}
		function getTimezy() {
			var now= new Date(),
			h=now.getHours(),
			m=now.getMinutes(),
			s=now.getSeconds(),
			ms=now.getMilliseconds();
			return (h+":"+m+":"+s+ " " +ms);
		}

		//移动用的方法
		//return true：可以操作移动
		function beforeDropzy(treeId, treeNodes, targetNode, moveType) {
			return true;
		}

		function removeHoverDomzy(treeId, treeNode) {
			$("#addBtn_"+treeNode.tId).unbind().remove();
		};

		//一.beforeEditNamezy
		//资源库分类-treeDemozy
		function beforeEditNamezy(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLogzy("[ "+getTimezy()+" beforeEditNamezy ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			var zTree = $.fn.zTree.getZTreeObj("treeDemozy");
			zTree.selectNode(treeNode);
			return true;
		}

		//二.添加节点
		//资源库分类-treeDemozy
		var newCount = 0;
		function addHoverDomzy(treeId, treeNode) {
			var sObj = $("#" + treeNode.tId + "_span");
			if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
			var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
				+ "' title='添加组' onfocus='this.blur();'></span>";
				sObj.after(addStr);
			var btn = $("#addBtn_"+treeNode.tId);
			if (btn) btn.bind("click", function(){
				$.post("Zyadd.html",{"classifyid":treeNode.id,"num":++newCount},function(data){
					var id = data;
					var zTree = $.fn.zTree.getZTreeObj("treeDemozy");
					zTree.addNodes(treeNode, {id:(id), classifyid:treeNode.id, name:"新建组"+newCount});
					msgShow("添加成功！");
					return false;
				});
			});
		};

		//三.修改节点之前
		//资源库分类-treeDemozy
		function beforeRenamezy(treeId, treeNode, newName, isCancel) {
			className = (className === "dark" ? "":"dark");
			showLogzy((isCancel ? "<span style='color:red'>":"") + "[ "+getTimezy()+
			" beforeRenamezy ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
			if (newName.length == 0) {
				alert("节点名称不能为空.");
				var zTree = $.fn.zTree.getZTreeObj("treeDemozy");
				setTimeout(function(){zTree.editName(treeNode)}, 10);
				return false;
			}
			return true;
		}
		
		//四.修改节点
		//资源库分类-treeDemozy
		function onRenamezy(e, treeId, treeNode, isCancel) {
			$.ajaxSetup({
				async:false
			});
			showLogzy((isCancel ? "<span style='color:red'>":"") + "[ "+getTimezy()+" onRenamezy ]&nbsp;&nbsp;&nbsp;&nbsp; "
			+ treeNode.name + (isCancel ? "</span>":""));
			$.post("Zyupd.html",{"classifyid":treeNode.id,"name":treeNode.name},function(data){
				if(data==null || data==''){
					alert("分类名字已存在！");
				}
				
				//ztree刷新
				var zTree = $.fn.zTree.getZTreeObj("treeDemozy");
				zTree.reAsyncChildNodes(null, "refresh");
				return false;
			});
			
		}
		
		//五.删除节点前
		//资源库分类-treeDemozy
		function beforeRemovezy(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLogzy("[ "+getTimezy()+" beforeRemovezy ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			var zTree = $.fn.zTree.getZTreeObj("treeDemozy");
			zTree.selectNode(treeNode);
			return confirm("确认删除 " + treeNode.name + " 吗？该资源库分类的子分类全部删除。");
		}
		
		//六.删除节点
		//资源库分类-treeDemozy
		function onRemovezy(e, treeId, treeNode) {
			$.ajaxSetup({
				async:false
			});
			$.post("Zydelete.html",{"classifyid":treeNode.id},function(data){
				showLogzy("[ "+getTimezy()+" onRemovezy ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
				msgShow("删除成功！");
			});
		}
		
		//七.移动节点
		//资源库分类-treeDemozy
		function onDropzy(event, treeId, treeNodes, targetNode, moveType, isCopy) {
			$.ajaxSetup({
				async:false
			});
			var tree = $.fn.zTree.getZTreeObj("treeDemozy");
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
			$.post("Zymove.html",{"groups":str},function(data){
					//var zTree = $.fn.zTree.getZTreeObj("treeDemo");
					//zTree.moveNode(nodes[0], nodes[1], "inner");
					//zTree.selectNode(treeNodes);
					//window.location.reload();
					//return true;
			});
		}
		
        $(function() { 
            $.fn.zTree.init($("#treeDemozy"), settingzy);
        });