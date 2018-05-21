//试题难度分类setting
		var setting2 = {
			async: {
				enable: true,
				url:"StnClassify.html"
			},
			view: {
				addHoverDom: addHoverDom2,
				removeHoverDom: removeHoverDom2,
				dblClickExpand: false,
				showLine: true,
				selectedMulti: false
			},
			edit: {
				enable: true,
				editNameSelectAll: true,
				showRemoveBtn: showRemoveBtn2,
				showRenameBtn: showRenameBtn2,
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
				beforeDrag: beforeDrag2,
				beforeDrop: beforeDrop2,
				beforeEditName: beforeEditName2,
				beforeRemove: beforeRemove2,
				beforeRename: beforeRename2,
				onRemove: onRemove2,
				onRename: onRename2,
				onDrop: onDrop2
			}
		};

		var zNodes;
		var log, className = "dark";
		function beforeDrag2(treeId, treeNodes) {
			for (var i=0,l=treeNodes.length; i<l; i++) {
				if (treeNodes[i].drag === false) {
					return false;
				}
			}
			return true;
		}
		function showRemoveBtn2(treeId, treeNode) {
			
			if(treeNode.level>0){
				return true;
			}else{
				return false;
			}
		}
		function showRenameBtn2(treeId, treeNode) {
			if(treeNode.level>0){
				return true;
			}else{
				return false;
			}
		}
		function showLog2(str) {
			if (!log) log = $("#log");
			log.append("<li class='"+className+"'>"+str+"</li>");
			if(log.children("li").length > 8) {
				log.get(0).removeChild(log.children("li")[0]);
			}
		}
		function getTime2() {
			var now= new Date(),
			h=now.getHours(),
			m=now.getMinutes(),
			s=now.getSeconds(),
			ms=now.getMilliseconds();
			return (h+":"+m+":"+s+ " " +ms);
		}

		//移动用的方法
		//return true：可以操作移动
		function beforeDrop2(treeId, treeNodes, targetNode, moveType) {
			return true;
		}

		function removeHoverDom2(treeId, treeNode) {
			$("#addBtn_"+treeNode.tId).unbind().remove();
		};

		//一.beforeEditName2
		//试题难度分类-treeDemo2
		function beforeEditName2(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLog2("[ "+getTime2()+" beforeEditName2 ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			var zTree = $.fn.zTree.getZTreeObj("treeDemo2");
			zTree.selectNode(treeNode);
			return true;
		}

		//二.添加节点
		//试题难度分类-treeDemo2
		var newCount = 0;
		function addHoverDom2(treeId, treeNode) {
			var sObj = $("#" + treeNode.tId + "_span");
			if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
			var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
				+ "' title='添加组' onfocus='this.blur();'></span>";
				sObj.after(addStr);
			var btn = $("#addBtn_"+treeNode.tId);
			if (btn) btn.bind("click", function(){
				$.post("Stnadd.html",{"levelid":treeNode.id,"num":++newCount},function(data){
					var id = data;
					var zTree = $.fn.zTree.getZTreeObj("treeDemo2");
					zTree.addNodes(treeNode, {id:(id), levelid:treeNode.id, name:"新建组"+newCount});
					msgShow("添加成功！");
					return false;
				});
			});
		};

		//三.修改节点之前
		//试题难度分类-treeDemo2
		function beforeRename2(treeId, treeNode, newName, isCancel) {
			className = (className === "dark" ? "":"dark");
			showLog2((isCancel ? "<span style='color:red'>":"") + "[ "+getTime2()+
			" beforeRename2 ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
			if (newName.length == 0) {
				alert("节点名称不能为空.");
				var zTree = $.fn.zTree.getZTreeObj("treeDemo2");
				setTimeout(function(){zTree.editName(treeNode)}, 10);
				return false;
			}
			return true;
		}

		//四.修改节点
		//试题难度分类-treeDemo2
		function onRename2(e, treeId, treeNode, isCancel) {
			$.ajaxSetup({
				async:false
			});
			showLog2((isCancel ? "<span style='color:red'>":"") + "[ "+getTime2()+" onRename2 ]&nbsp;&nbsp;&nbsp;&nbsp; "
			+ treeNode.name + (isCancel ? "</span>":""));
			$.post("Stnupd.html",{"levelid":treeNode.id,"name":treeNode.name},function(data){
				if(data==null || data==''){
					alert("分类名字已存在！");
				}
				
				//ztree刷新
				var zTree = $.fn.zTree.getZTreeObj("treeDemo2");
				//zTree.reAsyncChildNodes(null, "refresh");
				return false;
			});
		}

		//五.删除节点前
		//试题难度分类-treeDemo2
		function beforeRemove2(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLog2("[ "+getTime2()+" beforeRemove2 ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			var zTree = $.fn.zTree.getZTreeObj("treeDemo2");
			zTree.selectNode(treeNode);
			return confirm("确认删除" + treeNode.name + " 吗？该试题难度的子难度将全部删除。");
		}

		//六.删除节点
		//试题难度分类-treeDemo2
		function onRemove2(e, treeId, treeNode) {
			$.ajaxSetup({
				async:false
			});
			$.post("Stndelete.html",{"levelid":treeNode.id},function(data){
				showLog2("[ "+getTime2()+" onRemove2 ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
				msgShow("删除成功！");
			});
		}

		//七.移动节点
		//试题难度分类-treeDemo2
		function onDrop2(event, treeId, treeNodes, targetNode, moveType, isCopy) {
			$.ajaxSetup({
				async:false
			});
			var tree = $.fn.zTree.getZTreeObj("treeDemo2");
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
			$.post("Stnmove.html",{"groups":str},function(data){
			});
		}
		
		$(function() { 
			$.fn.zTree.init($("#treeDemo2"), setting2);
		});