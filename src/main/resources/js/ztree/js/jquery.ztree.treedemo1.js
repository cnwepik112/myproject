//试题分类setting
		var setting1 = {
			async: {
				enable: true,
				url:"StClassify.html"
			},
			view: {
				addHoverDom: addHoverDom1,
				removeHoverDom: removeHoverDom1,
				dblClickExpand: false,
				showLine: true,
				selectedMulti: false
			},
			edit: {
				enable: true,
				editNameSelectAll: true,
				showRemoveBtn: showRemoveBtn1,
				showRenameBtn: showRenameBtn1,
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
				beforeDrag: beforeDrag1,
				beforeDrop: beforeDrop1,
				beforeEditName: beforeEditName1,
				beforeRemove: beforeRemove1,
				beforeRename: beforeRename1,
				onRemove: onRemove1,
				onRename: onRename1,
				onDrop: onDrop1
			}
		};

		var zNodes;
		var log, className = "dark";
		function beforeDrag1(treeId, treeNodes) {
			for (var i=0,l=treeNodes.length; i<l; i++) {
				if (treeNodes[i].drag === false) {
					return false;
				}
			}
			return true;
		}

		function showRemoveBtn1(treeId, treeNode) {
			
			if(treeNode.level>0){
				return true;
			}else{
				return false;
			}
		}
		function showRenameBtn1(treeId, treeNode) {
			if(treeNode.level>0){
				return true;
			}else{
				return false;
			}
		}
		function showLog1(str) {
			if (!log) log = $("#log");
			log.append("<li class='"+className+"'>"+str+"</li>");
			if(log.children("li").length > 8) {
				log.get(0).removeChild(log.children("li")[0]);
			}
		}
		function getTime1() {
			var now= new Date(),
			h=now.getHours(),
			m=now.getMinutes(),
			s=now.getSeconds(),
			ms=now.getMilliseconds();
			return (h+":"+m+":"+s+ " " +ms);
		}

		//移动用的方法
		//return true：可以操作移动
		function beforeDrop1(treeId, treeNodes, targetNode, moveType) {
			return true;
		}

		function removeHoverDom1(treeId, treeNode) {
			$("#addBtn_"+treeNode.tId).unbind().remove();
		};

		//一.beforeEditName1
		//试题分类-treeDemo1
		function beforeEditName1(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLog1("[ "+getTime1()+" beforeEditName1 ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
			zTree.selectNode(treeNode);
			return true;
		}

		//二.添加节点
		//试题分类-treeDemo1
		var newCount = 0;
		function addHoverDom1(treeId, treeNode) {
			var sObj = $("#" + treeNode.tId + "_span");
			if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
			var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
				+ "' title='添加组' onfocus='this.blur();'></span>";
				sObj.after(addStr);
			var btn = $("#addBtn_"+treeNode.tId);
			if (btn) btn.bind("click", function(){
				$.post("Stadd.html",{"classifyid":treeNode.id,"num":++newCount},function(data){
					var id = data;
					var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
					zTree.addNodes(treeNode, {id:(id), classifyid:treeNode.id, name:"新建组"+newCount});
					msgShow("添加成功！");
					return false;
				});
			});
		};

		//三.修改节点之前
		//试题分类-treeDemo1
		function beforeRename1(treeId, treeNode, newName, isCancel) {
			className = (className === "dark" ? "":"dark");
			showLog1((isCancel ? "<span style='color:red'>":"") + "[ "+getTime1()+
			" beforeRename1 ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
			if (newName.length == 0) {
				alert("节点名称不能为空.");
				var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
				setTimeout(function(){zTree.editName(treeNode)}, 10);
				return false;
			}
			return true;
		}

		//四.修改节点
		//试题分类-treeDemo1
		function onRename1(e, treeId, treeNode, isCancel) {
			$.ajaxSetup({
				async:false
			});
			showLog1((isCancel ? "<span style='color:red'>":"") + "[ "+getTime1()+" onRename1 ]&nbsp;&nbsp;&nbsp;&nbsp; "
			+ treeNode.name + (isCancel ? "</span>":""));
			$.post("Stupd.html",{"classifyid":treeNode.id,"name":treeNode.name},function(data){
				if(data==null || data==''){
					alert("分类名字已存在！");
				}
				
				//ztree刷新
				var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
				//zTree.reAsyncChildNodes(null, "refresh");
				return false;
			});
		}

		//五.删除节点前
		//试题分类-treeDemo1
		function beforeRemove1(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLog1("[ "+getTime1()+" beforeRemove1 ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
			zTree.selectNode(treeNode);
			return confirm("确认删除  " + treeNode.name + " 吗？该试题分类的子类将全部删除。");
		}

		//六.删除节点
		//试题分类-treeDemo1
		function onRemove1(e, treeId, treeNode) {
			$.ajaxSetup({
				async:false
			});
			$.post("Stdelete.html",{"classifyid":treeNode.id},function(data){
				showLog1("[ "+getTime1()+" onRemove1 ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
				msgShow("删除成功！");
			});
		}

		//七.移动节点
		//试题分类-treeDemo1
		function onDrop1(event, treeId, treeNodes, targetNode, moveType, isCopy) {
			$.ajaxSetup({
				async:false
			});
			var tree = $.fn.zTree.getZTreeObj("treeDemo1");
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
			$.post("Stmove.html",{"groups":str},function(data){
			});
		}
		
		$(function() { 
			$.fn.zTree.init($("#treeDemo1"), setting1);
		});