	//试卷分类setting
		var setting4 = {
			async: {
				enable: true,
				url:"SjClassify.html"
			},
			view: {
				addHoverDom: addHoverDom4,
				removeHoverDom: removeHoverDom4,
				dblClickExpand: false,
				showLine: true,
				selectedMulti: false
			},
			edit: {
				enable: true,
				editNameSelectAll: true,
				showRemoveBtn: showRemoveBtn4,
				showRenameBtn: showRenameBtn4,
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
				beforeDrag: beforeDrag4,
				beforeDrop: beforeDrop4,
				beforeEditName: beforeEditName4,
				beforeRemove: beforeRemove4,
				beforeRename: beforeRename4,
				onRemove: onRemove4,
				onRename: onRename4,
				onDrop: onDrop4
			}
		};

		var zNodes;
		var log, className = "dark";
		function beforeDrag4(treeId, treeNodes) {
			for (var i=0,l=treeNodes.length; i<l; i++) {
				if (treeNodes[i].drag === false) {
					return false;
				}
			}
			return true;
		}
		function showRemoveBtn4(treeId, treeNode) {
			
			if(treeNode.level>0){
				return true;
			}else{
				return false;
			}
			
		}
		function showRenameBtn4(treeId, treeNode) {
			if(treeNode.level>0){
				return true;
			}else{
				return false;
			}
		}
		function showLog4(str) {
			if (!log) log = $("#log");
			log.append("<li class='"+className+"'>"+str+"</li>");
			if(log.children("li").length > 8) {
				log.get(0).removeChild(log.children("li")[0]);
			}
		}
		function getTime4() {
			var now= new Date(),
			h=now.getHours(),
			m=now.getMinutes(),
			s=now.getSeconds(),
			ms=now.getMilliseconds();
			return (h+":"+m+":"+s+ " " +ms);
		}

		//移动用的方法
		//return true：可以操作移动
		function beforeDrop4(treeId, treeNodes, targetNode, moveType) {
			return true;
		}
	
		function removeHoverDom4(treeId, treeNode) {
			$("#addBtn_"+treeNode.tId).unbind().remove();
		};

		//一.beforeEditName4
		//试卷分类-treeDemo4
		function beforeEditName4(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLog4("[ "+getTime4()+" beforeEditName4 ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
			zTree.selectNode(treeNode);
			return true;
		}

		//二.添加节点
		//试卷分类-treeDemo4
		var newCount = 0;
		function addHoverDom4(treeId, treeNode) {
			var sObj = $("#" + treeNode.tId + "_span");
			if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
			var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
				+ "' title='添加组' onfocus='this.blur();'></span>";
				sObj.after(addStr);
			var btn = $("#addBtn_"+treeNode.tId);
			if (btn) btn.bind("click", function(){
				$.post("Sjadd.html",{"sjclassifyid":treeNode.id,"num":++newCount},function(data){
					var id = data;
					var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
					zTree.addNodes(treeNode, {id:(id), sjclassifyid:treeNode.id, name:"新建组"+newCount});
					msgShow("添加成功！");
					return false;
				});
			});
		};

		//三.修改节点之前
		//试卷分类-treeDemo4
		function beforeRename4(treeId, treeNode, newName, isCancel) {
			className = (className === "dark" ? "":"dark");
			showLog4((isCancel ? "<span style='color:red'>":"") + "[ "+getTime4()+
			" beforeRename4 ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
			if (newName.length == 0) {
				alert("节点名称不能为空.");
				var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
				setTimeout(function(){zTree.editName(treeNode)}, 10);
				return false;
			}
			return true;
		}

		//四.修改节点
		//试卷分类-treeDemo4
		function onRename4(e, treeId, treeNode, isCancel) {
			$.ajaxSetup({
				async:false
			});
			showLog4((isCancel ? "<span style='color:red'>":"") + "[ "+getTime4()+" onRename4 ]&nbsp;&nbsp;&nbsp;&nbsp; "
			+ treeNode.name + (isCancel ? "</span>":""));
			$.post("Sjupd.html",{"sjclassifyid":treeNode.id,"name":treeNode.name},function(data){
				if(data==null || data==''){
					alert("分类名字已存在！");
				}
				
				//ztree刷新
				var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
				//zTree.reAsyncChildNodes(null, "refresh");
				return false;
			});
		}

		//五.删除节点前
		//试卷分类-treeDemo4
		function beforeRemove4(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLog4("[ "+getTime4()+" beforeRemove4 ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
			zTree.selectNode(treeNode);
			return confirm("确认删除 " + treeNode.name + " 吗？该试卷分类的子分类将全部删除。");
		}

		//六.删除节点
		//试卷分类-treeDemo4
		function onRemove4(e, treeId, treeNode) {
			$.ajaxSetup({
				async:false
			});
			$.post("Sjdelete.html",{"sjclassifyid":treeNode.id},function(data){
				showLog4("[ "+getTime4()+" onRemove4 ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
				msgShow("删除成功！");
			});
		}

		//七.移动节点
		//试卷分类-treeDemo4
		function onDrop4(event, treeId, treeNodes, targetNode, moveType, isCopy) {
			$.ajaxSetup({
				async:false
			});
			var tree = $.fn.zTree.getZTreeObj("treeDemo4");
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
			$.post("Sjmove.html",{"groups":str},function(data){
			});
		}
		
		$(function() { 
			$.fn.zTree.init($("#treeDemo4"), setting4);
		});