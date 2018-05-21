//课程分类setting
		var settingkc = {
			async: {
				enable: true,
				url:"KcClassify.html"
			},
			view: {
				addHoverDom: addHoverDomkc,
				removeHoverDom: removeHoverDomkc,
				selectedMulti: false
			},
			edit: {
				enable: true,
				editNameSelectAll: true,
				showRemoveBtn: showRemoveBtnkc,
				showRenameBtn: showRenameBtnkc,
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
				beforeDrag: beforeDragkc,
				beforeDrop: beforeDropkc,
				beforeEditName: beforeEditNamekc,
				beforeRemove: beforeRemovekc,
				beforeRename: beforeRenamekc,
				onRemove: onRemovekc,
				onRename: onRenamekc,
				onDrop: onDropkc
			}
		};

		var zNodes;
		var log, className = "dark";
		function beforeDragkc(treeId, treeNodes) {
			for (var i=0,l=treeNodes.length; i<l; i++) {
				if (treeNodes[i].drag === false) {
					return false;
				}
			}
			return true;
		}
		function showRemoveBtnkc(treeId, treeNode) {
			
			if(treeNode.level>0){
				return true;
			}else{
				return false;
			}
		}
		function showRenameBtnkc(treeId, treeNode) {
			if(treeNode.level>0){
				return true;
			}else{
				return false;
			}
		}
		function showLogkc(str) {
			if (!log) log = $("#log");
			log.append("<li class='"+className+"'>"+str+"</li>");
			if(log.children("li").length > 8) {
				log.get(0).removeChild(log.children("li")[0]);
			}
		}
		function getTimekc() {
			var now= new Date(),
			h=now.getHours(),
			m=now.getMinutes(),
			s=now.getSeconds(),
			ms=now.getMilliseconds();
			return (h+":"+m+":"+s+ " " +ms);
		}

		//移动用的方法
		//return true：可以操作移动
		function beforeDropkc(treeId, treeNodes, targetNode, moveType) {
			return true;
		}

		function removeHoverDomkc(treeId, treeNode) {
			$("#addBtn_"+treeNode.tId).unbind().remove();
		};

		//一.beforeEditNamekc
		//课程分类-treeDemokc
		function beforeEditNamekc(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLogkc("[ "+getTimekc()+" beforeEditNamekc ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			var zTree = $.fn.zTree.getZTreeObj("treeDemokc");
			zTree.selectNode(treeNode);
			return true;
		}

		//二.添加节点
		//课程分类-treeDemokc
		var newCount = 0;
		function addHoverDomkc(treeId, treeNode) {
			var sObj = $("#" + treeNode.tId + "_span");
			if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
			var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
				+ "' title='添加组' onfocus='this.blur();'></span>";
				sObj.after(addStr);
			var btn = $("#addBtn_"+treeNode.tId);
			if (btn) btn.bind("click", function(){
				$.post("Kcadd.html",{"classifyid":treeNode.id,"num":++newCount},function(data){
					var id = data;
					var zTree = $.fn.zTree.getZTreeObj("treeDemokc");
					zTree.addNodes(treeNode, {id:(id), classifyid:treeNode.id, name:"新建组"+newCount});
					msgShow("添加成功！");
					return false;
				});
			});
		};

		//三.修改节点之前
		//课程分类-treeDemokc
		function beforeRenamekc(treeId, treeNode, newName, isCancel) {
			className = (className === "dark" ? "":"dark");
			showLogkc((isCancel ? "<span style='color:red'>":"") + "[ "+getTimekc()+
			" beforeRenamekc ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
			if (newName.length == 0) {
				alert("节点名称不能为空.");
				var zTree = $.fn.zTree.getZTreeObj("treeDemokc");
				setTimeout(function(){zTree.editName(treeNode)}, 10);
				return false;
			}
			return true;
		}

		//四.修改节点
		//课程分类-treeDemokc
		function onRenamekc(e, treeId, treeNode, isCancel) {
			$.ajaxSetup({
				async:false
			});
			showLogkc((isCancel ? "<span style='color:red'>":"") + "[ "+getTimekc()+" onRenamekc ]&nbsp;&nbsp;&nbsp;&nbsp; "
			+ treeNode.name + (isCancel ? "</span>":""));
			$.post("Kcupd.html",{"classifyid":treeNode.id,"name":treeNode.name},function(data){
				if(data==null || data==''){
					alert("分类名字已存在！");
				}
				
				//ztree刷新
				var zTree = $.fn.zTree.getZTreeObj("treeDemokc");
				zTree.reAsyncChildNodes(null, "refresh");
				return false;
			});
		}

		//五.删除节点前
		//课程分类-treeDemokc
		function beforeRemovekc(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLogkc("[ "+getTimekc()+" beforeRemovekc ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
			var zTree = $.fn.zTree.getZTreeObj("treeDemokc");
			zTree.selectNode(treeNode);
			return confirm("确认删除  " + treeNode.name + " 吗？该课程分类的子分类将全部删除。");
		}

		//六.删除节点
		//课程分类-treeDemokc
		function onRemovekc(e, treeId, treeNode) {
			$.ajaxSetup({
				async:false
			});
			$.post("Kcdelete.html",{"classifyid":treeNode.id},function(data){
				showLogkc("[ "+getTimekc()+" onRemovekc ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
				msgShow("删除成功！");
			});
		}

		//七.移动节点
		//课程分类-treeDemokc
		function onDropkc(event, treeId, treeNodes, targetNode, moveType, isCopy) {
			$.ajaxSetup({
				async:false
			});
			var tree = $.fn.zTree.getZTreeObj("treeDemokc");
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
			$.post("Kcmove.html",{"groups":str},function(data){
			});
			
		}
		
        $(function() { 
            $.fn.zTree.init($("#treeDemokc"), settingkc);
        });