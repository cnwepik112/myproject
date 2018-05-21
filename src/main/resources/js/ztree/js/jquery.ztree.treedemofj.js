	//课程附件分类setting
		var settingfj = {
			async: {
				enable: true,
				url:"FjClassify.html"
			},
			view: {
				addHoverDom: addHoverDomfj,
				removeHoverDom: removeHoverDomfj,
				selectedMulti: false
			},
			edit: {
				enable: true,
				editNameSelectAll: true,
				showRemoveBtn: showRemoveBtnfj,
				showRenameBtn: showRenameBtnfj,
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
				beforeDrag: beforeDragfj,
				beforeDrop: beforeDropfj,
				beforeEditName: beforeEditNamefj,
				beforeRemove: beforeRemovefj,
				beforeRename: beforeRenamefj,
				onRemove: onRemovefj,
				onRename: onRenamefj,
				onDrop: onDropfj
			}
		};

		var zNodes;
		var log, className = "dark";
		function beforeDragfj(treeId, treeNodes) {
			for (var i=0,l=treeNodes.length; i<l; i++) {
				if (treeNodes[i].drag === false) {
					return false;
				}
			}
			return true;
		}
		function showRemoveBtnfj(treeId, treeNode) {
			if(treeNode.level>0){
				return true;
			}else{
				return false;
			}
		}
		function showRenameBtnfj(treeId, treeNode) {
			if(treeNode.level>0){
				return true;
			}else{
				return false;
			}
		}
		function showLogfj(str) {
			if (!log) log = $("#log");
			log.append("<li class='"+className+"'>"+str+"</li>");
			if(log.children("li").length > 8) {
				log.get(0).removeChild(log.children("li")[0]);
			}
		}
		function getTimefj() {
			var now= new Date(),
			h=now.getHours(),
			m=now.getMinutes(),
			s=now.getSeconds(),
			ms=now.getMilliseconds();
			return (h+":"+m+":"+s+ " " +ms);
		}

		//移动用的方法
		//return true：可以操作移动
		function beforeDropfj(treeId, treeNodes, targetNode, moveType) {
			return true;
		}

		function removeHoverDomfj(treeId, treeNode) {
			$("#addBtn_"+treeNode.tId).unbind().remove();
		};

		//一.beforeEditNamefj
		//课程附件分类-treeDemofj
		function beforeEditNamefj(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLogfj("[ "+getTimefj()+" beforeEditNamefj ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			var zTree = $.fn.zTree.getZTreeObj("treeDemofj");
			zTree.selectNode(treeNode);
			return true;
		}

		//二.添加节点
		//课程附件分类-treeDemofj
		var newCount = 0;
		function addHoverDomfj(treeId, treeNode) {
			var sObj = $("#" + treeNode.tId + "_span");
			if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
			var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
				+ "' title='添加组' onfocus='this.blur();'></span>";
				sObj.after(addStr);
			var btn = $("#addBtn_"+treeNode.tId);
			if (btn) btn.bind("click", function(){
				$.post("Fjadd.html",{"classifyid":treeNode.id,"num":++newCount},function(data){
					var id = data;
					var zTree = $.fn.zTree.getZTreeObj("treeDemofj");
					zTree.addNodes(treeNode, {id:(id), classifyid:treeNode.id, name:"新建组"+newCount});
					msgShow("添加成功！");
					return false;
				});
			});
		};

		//三.修改节点之前
		//课程附件分类-treeDemofj
		function beforeRenamefj(treeId, treeNode, newName, isCancel) {
			className = (className === "dark" ? "":"dark");
			showLogfj((isCancel ? "<span style='color:red'>":"") + "[ "+getTimefj()+
			" beforeRenamefj ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
			if (newName.length == 0) {
				alert("节点名称不能为空.");
				var zTree = $.fn.zTree.getZTreeObj("treeDemofj");
				setTimeout(function(){zTree.editName(treeNode)}, 10);
				return false;
			}
			return true;
		}

		//四.修改节点
		//课程附件分类-treeDemofj
		function onRenamefj(e, treeId, treeNode, isCancel) {
			$.ajaxSetup({
				async:false
			});
			showLogfj((isCancel ? "<span style='color:red'>":"") + "[ "+getTimefj()+" onRenamefj ]&nbsp;&nbsp;&nbsp;&nbsp; "
			+ treeNode.name + (isCancel ? "</span>":""));
			$.post("Fjupd.html",{"classifyid":treeNode.id,"name":treeNode.name},function(data){
				if(data==null || data==''){
					alert("分类名字已存在！");
				}
				
				//ztree刷新
				var zTree = $.fn.zTree.getZTreeObj("treeDemofj");
				zTree.reAsyncChildNodes(null, "refresh");
				return false;
			});
		}

		//五.删除节点前
		//课程附件分类-treeDemofj
		function beforeRemovefj(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLogfj("[ "+getTimefj()+" beforeRemovefj ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			var zTree = $.fn.zTree.getZTreeObj("treeDemofj");
			zTree.selectNode(treeNode);
			return confirm("确认删除 " + treeNode.name + " 吗？该课程附件分类的子分类将全部删除。");
		}

		//六.删除节点
		//课程附件分类-treeDemofj
		function onRemovefj(e, treeId, treeNode) {
			$.ajaxSetup({
				async:false
			});
			$.post("Fjdelete.html",{"classifyid":treeNode.id},function(data){
				showLogfj("[ "+getTimefj()+" onRemovefj ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
				msgShow("删除成功！");
			});
		}

		//七.移动节点
		//课程附件分类-treeDemofj
		function onDropfj(event, treeId, treeNodes, targetNode, moveType, isCopy) {
			$.ajaxSetup({
				async:false
			});
			var tree = $.fn.zTree.getZTreeObj("treeDemofj");
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
			$.post("Fjmove.html",{"groups":str},function(data){
			});
		}
		
        $(function() { 
            $.fn.zTree.init($("#treeDemofj"), settingfj);
        });