/**
 * @author M GL
 * 
 * @date 2015-8-5
 */

function myPage(myPage){
	var pageId = myPage;
	myPage = {
		firstPage : 1,
		getData : null,
		//页码
		pageNum : 1,
		//每页行数
		rows : 1,
		//数据总条数
		dataTotal : 0,
		//数据总页数
		total : 0,
		
		initPage : function(total){
			if(total != null && total != undefined){
				this.total = total;
			}else{
				this.total = Math.ceil(this.dataTotal/this.rows);
			}
			
			this.pageNum = 1;
			var html = "<li class='pageLiStyle' onclick='"+ pageId +".pageSelected(1)'>首页</li><li class='pageLiStyle' onclick="+ pageId +".pageTurn('up')>上一页</li><span></span><li onclick="+ pageId +".pageTurn('down') class='pageLiStyle'>下一页</li><li onclick='"+ pageId +".pageSelected("+ this.total +")' class='pageLiStyle'>尾页</li>";
			$("#"+ pageId).find("ul").empty();
			$("#"+ pageId).find("ul").append(html);
			this.addPage(this.firstPage);
			$("#"+ pageId).find("ul > span li").eq(this.pageNum-1).addClass("pageSelected");
		},
		
		pageSelected : function(objVal){
			if(this.total >= this.firstPage+6){
				if(objVal+3 > this.total){
					this.firstPage = this.total-6;
				}else if(objVal-3 <= 0){
					this.firstPage = 1;
				}else{
					this.firstPage = objVal-3;
				}
				this.addPage(this.firstPage);
			}
			$("#"+ pageId).find("ul > span").find(".pageSelected").removeClass("pageSelected");
			$("#"+ pageId).find("ul > span").find("li[value='"+ objVal +"']").addClass("pageSelected");
			if(this.getData != null){
				this.getData(objVal);
			}
			this.pageNum = objVal;
		},
		
		addPage : function(first){
			var pageTotal = this.total;
			$("#"+ pageId).find("ul > span").empty();
			var i = first;
			var liHtml = "";
			while(i <= pageTotal && i <= first+6){
				liHtml += "<li onclick='"+ pageId +".pageSelected("+ i +")' class='pageLiStyle' value='"+ i +"'><a>"+ i +"</a></li>";
				i += 1;
			}
			$("#"+ pageId).find("ul > span").append(liHtml);
		},
		
		pageTurn : function(turn){
			var selectedVal = this.pageNum;
			if(turn == 'up' && selectedVal > 1){
				this.pageSelected(selectedVal-1);
			}
			if(turn == 'down' && selectedVal < this.total){
				this.pageSelected(selectedVal+1);
			}
		}
	};
	return myPage;
};
