$.extend($.fn.validatebox.defaults.rules, {  
    tel: {  
        validator: function(value, param){
            var partten = /^1[3,5,8]\d{9}$/;
            return partten.test(value);  
        },  
        message: '请填写正确的手机号！'  
    } ,
    num:{
        validator: function(value, param){
         var partten = /^[1-9]\d*|0$/;
         return partten.test(value);
        //return true;
         },  
        message: '请填写数字学分！'
    },
    oKNumber:{
    	validator: function(value, param){
    		var partten = /^[0-9]\d*$/;
    		return partten.test(value);  
    	},  
    	message: '请填写正整数！' 
    },    
    cishu:{
    	validator: function(value, param){
    		var partten = /^[1-9]\d*$/;
    		return partten.test(value);
    	},  
    	message: '请填写正确数字！'
    },
    startMinute:{
    	validator: function(value, param){
    		var partten = /^[0-9]\d*$/;
    		return partten.test(value);
    	},  
    	message: '请填写正确数字！'
    }, 
    pass:{
        validator: function(value, param){
            var password=$("#password").val();
            return password==value;
        },  
        message: '确认密码与密码不同，请重新输入！'
    },
    money:{
        validator: function(value, param){
            var partten = /^(([1-9]\d*)|0)(\.\d{1,2})?$/;
            return partten.test(value);  
        },  
        message: '请填写正确金额！' 
    },
    number:{
    	validator: function(value, param){
    		var partten = /^\d{1,3}(\.\d{1,2})?$/;
    		return partten.test(value);  
    	},  
    	message: '请填写正确数字！' 
    },
    jdfen:{
    	validator: function(value, param){
	    	var shitifen=param[0];
			shitifen = parseFloat(shitifen);
			return value <= shitifen;  
    	},  
    	message: '请填写正确分值，得分不能大于试题分数！' 
    },
    doublenum:{
        validator: function(value, param){
            var partten = /^(([0-9]\d*)|0)(\.\d{1,2})?$/;
            //return partten.test(value);  
            return true;
        },  
        message: '请填写正确数据！' 
    },
    loginName:{
        validator: function(value, param){
            var partten =/^[a-zA-Z0-9]{4,20}$/;
            return partten.test(value);  
        },  
        message: '请填写4-20位字母或数字！' 
    },
//    excel:{
//        validator: function(value, param){
//        	var partten ="^.*\.(?:xls)$";
//            return partten.test(value);  
//        },  
//        message: '请选择excel文件' 
//    },
    roleName:{
        validator: function(value, param){
        	// var partten =/^([\u4e00-\u9fa5]{2,10})|([A-Za-z0-9 ]{2,10})$/;
        	var partten =/^[0-9a-zA-Z\u4e00-\u9fa5]{2,50}$/;
            return partten.test(value);  
        },  
        message: '请填写2-50位字母、数字或汉字！' 
    },
    sutdyTimeNum:{
        validator: function(value, param){
            var partten = /^\d*(\.\d{1,2})?$/;
            return partten.test(value);
        },  
       message: '请填写正整数或保留两位小数的学时！'
     },
     coursewareName:{
    	 validator: function(value, param){
         	var partten =/^[0-9a-zA-Z\u4e00-\u9fa5]{2,50}$/;
             return partten.test(value);  
         },  
         message: '请填写2-50位字母、数字或汉字！' 
      },
      httpPath:{
    	  validator: function(value, param){
    		var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
				+ "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@  
				+ "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184  
				+ "|" // 允许IP和DOMAIN（域名） 
				+ "([0-9a-z_!~*'()-]+\.)*" // 域名- www.  
				+ "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名  
				+ "[a-z]{2,6})" // first level domain- .com or .museum  
				+ "(:[0-9]{1,4})?" // 端口- :80  
				+ "((/?)|" // a slash isn't required if there is no file name  
				+ "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";  
			var partten=new RegExp(strRegex);  
               return partten.test(value);  
           },  
           message: '请填写正确的网址！' 
    	  
      },
      messageTitleLength:{
     	 validator: function(value, param){
          	var partten =/^[0-9a-zA-Z\u4e00-\u9fa5]{2,50}$/;
              return partten.test(value);  
          },  
          message: '请填写2-50位字母、数字或汉字！' 
       },
       md: {  
           validator: function(value, param){  
            startTime2 = $(param[0]).datetimebox('getValue');   
            var d1 = new Date(startTime2.replace(/\-/g,'/'));
            var d2 = new Date(value.replace(/\-/g,'/'));
              /* var d1 = $.fn.datebox.defaults.parser(startTime2);  
               var d2 = $.fn.datebox.defaults.parser(value); */ 
               varify=d2>d1;  
               return varify;  
              
           },  
           message: '结束时间要大于开始时间！'  
       } 
     
});
$.extend($.fn.tabs.methods,{
    allTabs:function(jq){
        var tabs = $(jq).tabs('tabs');
        var all = [];
        all = $.map(tabs,function(n,i){
             return $(n).panel('options')
        });
        return all;
    },
    closeCurrent: function(jq){ // 关闭当前
        var currentTab = $(jq).tabs('getSelected'),
            currentTabIndex = $(jq).tabs('getTabIndex',currentTab);
         $(jq).tabs('close',currentTabIndex);
    },
    closeAll:function(jq){ //关闭全部
        var tabs = $(jq).tabs('allTabs');
        $.each(tabs,function(i,n){
            $(jq).tabs('close', n.title);
        });
    },
    closeOther:function(jq){ //关闭除当前标签页外的tab页
        var tabs =$(jq).tabs('allTabs');
        var currentTab = $(jq).tabs('getSelected'),
            currentTabIndex = $(jq).tabs('getTabIndex',currentTab);
 
        $.each(tabs,function(i,n){
            if(currentTabIndex != i && i != 0) {
                $(jq).tabs('close', n.title);
            }
        });
        var length =$(jq).tabs('allTabs').length;
        $(jq).tabs('select', length-1);
    },
    closeLeft:function(jq){ // 关闭当前页左侧tab页
        var tabs = $(jq).tabs('allTabs');
        var currentTab = $(jq).tabs('getSelected'),
            currentTabIndex = $(jq).tabs('getTabIndex',currentTab);
        var i = currentTabIndex-1;
 
        while(i > -1){
            $(jq).tabs('close', tabs[i].title);
            i--;
        }
    },
    closeRight: function(jq){ //// 关闭当前页右侧tab页
        var tabs = $(jq).tabs('allTabs');
        var currentTab = $(jq).tabs('getSelected'),
            currentTabIndex = $(jq).tabs('getTabIndex',currentTab);
        var i = currentTabIndex+ 1,len = tabs.length;
        while(i < len){
            $(jq).tabs('close', tabs[i].title);
            i++;
        }
    }
});
function   fmtLongDate(now)   {   
	var   year=now.getFullYear();
	var   month=now.getMonth()+1;   
	var   date=now.getDate();   
	var   hour=now.getHours();   
	var   minute=now.getMinutes();   
	var   second=now.getSeconds();   
	return year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;   
}
function   fmtShortDate(now)   {   
	var   year=now.getFullYear();
	var   month=now.getMonth()+1;   
	var   date=now.getDate();   
	return year+"-"+month+"-"+date;   
}
function msgShow(message){
	$.messager.show({
		closable:false,
		width:200,
		height:50,
		msg:"<div style='text-align:center;font-weight:bold'>"+message+"</div>",
		timeout:3000,
		showType:'slide'
	});
}
$.fn.datebox.defaults.formatter = function(date){//对于时间格式的转换  
    var y = date.getFullYear();  
    var m = fullnum(date.getMonth()+1);  
    var d = fullnum(date.getDate());  
    return y+'-'+m+'-'+d;  
};  
function fullnum(obj){//对于月小于10格式的转换,因为Timestamp转换必须是2013-01-04这种格式  
if(Number(obj) < 10){  
    return '0' + obj;  
}else{  
    return obj;  
}    } 
function   fmtShortDate(now)   {   
	var   year=now.getFullYear();
	var   month=now.getMonth()+1;   
	var   date=now.getDate();   
	return year+"-"+month+"-"+date;   
}