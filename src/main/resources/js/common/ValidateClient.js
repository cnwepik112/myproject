/*==================================================================*/
/*  function: trim(field.value)
/*	删除前导、后续空格
/*==================================================================*/
 function trim(strText){

  while (strText.substring(0,1) == ' ')
    strText = strText.substring(1, strText.length);
  while (strText.substring(strText.length-1,strText.length) == ' ')
    strText = strText.substring(0, strText.length-1);
  return strText;
 }
/* ================================================================== */
/*
 * function: isEmpty(field) /* 判断input text 是否为空。 /* return: true or false
 * /*==================================================================
 */
function isEmpty(name)
{
    var str=trim(name);
    if( str.length == 0 || str == null)
		return true;
	else
		return false;
}
/* ================================================================== */
/*
 * function: isLongerThan(field, len) /* 判断input text 的长度是否大于len. /* return:
 * true or false
 * /*==================================================================
 */
function isLongerThan(name, len) {
	var str=trim(document.forms[1].item(name).value);
	if(!isEmpty(name)){
	  if (str.length < len) {
        return false;
      }
      else {
        return true;
      }
   }
}
/* ================================================================== */
/*
 * function: isShorterThan(field, len) /* 判断input text 的长度是否小于len. /* return:
 * true or false
 * /*==================================================================
 */
function isShorterThan(name, len) {
	var str=trim(document.forms[1].item(name).value);
	if(!isEmpty(name)){
	  if (str.length > len) {
        return false;
      }
      else {
        return true;
     }
   }
}
/* ================================================================== */
/*
 * function isEqualThan(field, len) 判断input text 的长度是否等于len. return: true or
 * false /*==================================================================
 */
function isEqualThan(name, len) {
	var str=trim(document.forms[1].item(name).value);
	if(!isEmpty(name)){
	  if (str.length == len) {
        return false;
      }
      else {
        return true;
      }
   }
}
/* ================================================================== */
/*
 * function isEmail(field) 判断input text 的是否是email. return: true or false
 * /*==================================================================
 */
// 校验Email
function isEmail (name) {
	 var theStr=trim(document.forms[1].item(name).value);
	 if(!isEmpty(name)){
	 var atIndex = theStr.indexOf('@');
	 var dotIndex = theStr.indexOf('.', atIndex);
	 var flag = true;
	 theSub = theStr.substring(0, dotIndex+1)
	
	 if ((atIndex < 1)||(atIndex != theStr.lastIndexOf('@'))||(dotIndex < atIndex + 2)||(theStr.length <= theSub.length))
	 { alert("请输入正确的Email");
	   document.forms[1].item(name).value="";
	   document.forms[1].item(name).focus;
	   return false;  }
	 else { return(true); }
}}
/* ================================================================== */
/*
 * function isNumber(field){ 判断input text 的是否是数字. return: true or false
 * field允许为空 ==================================================================
 */
function isNumber(name){
  var theMask='0123456789';
  var Err = false;
  if(!isEmpty(name)){
  var str=document.forms[1].item(name).value;
  var str=trim(str);
  for(i=0;i<str.length;i++){
    if(theMask.indexOf(str.charAt(i))==-1){
      Err = true;
      break;
    }
  }   }
  return !Err;
}



/* ================================================================== */
/*
 * function isReal(field) 判断 input text 是否是实数 return false or true
 * /*==================================================================
 */
function isReal(name)
	{
	var str=trim(document.forms[1].item(name).value);
	var flag = true;

	if(str.length == 0 || str == null )
	{
		flag = false;
	}
	else
	{
		var str1="",str2="";
		var intdot ;
		intdot = str.indexOf('.');

		if (intdot >= 0)
		{
			str1 = str.substring(0,intdot);
			str2 = str.substring(intdot + 1,str.length);

			// /////////////////////////////////////////////////
			var mxx="0123456789";
			for(var i=0; i<str1.length; i++){
				charcode = str1.charAt(i);
				if( (mxx.indexOf(charcode)) < 0 )
					return false;
			}
			for( i=0; i<str2.length; i++){
				charcode = str2.charAt(i);
				if( (mxx.indexOf(charcode)) < 0 )
					return false;
			}
			// ////////////////////////////
		}
		else
		{
			var mxx="0123456789";
			for(var i=0; i<str.length; i++){
				charcode = str.charAt(i);
				if( (mxx.indexOf(charcode)) < 0 )
					return false;
			}
		}
	}
	return flag;
}

// 检测精度
// str : 字符串 left : 整数部分位数 right : 小数部分位数
function Precision(str,left,right){
  var str=str;
  var dot;
  var intPart;
  var decPart;
  var err=true;
  dot = str.indexOf('.');
  if(dot==-1){
    intPart = str.substring(0, str.length);
    if(intPart.length>left){
      err=false;
    }}
  if(dot!=-1){
    intPart = str.substring(0, dot);
    decPart = str.substring(dot+1);
    if((intPart.length>left)||(decPart.length>right)){
     err=false;
    }}
    return err;
}

/* ================================================================== */
/*
 * function validaterq (field,min,max) 判断数字的取值范围！ 用法：onchange="return
 * validaterq(this,min,max)"
 * /*==================================================================
 */
function between (title,name,min,max){
    var str=trim(document.forms[1].item(name).value);
    var num=new Number(str);
    if(!isEmpty(name)){
    if ((isNumber(name)==false)||(num<min)||(num>max)){
      alert(title+"所添的不是数字或不在合法取值范围之内！"+"(合法值"+min+"-"+max+")");
	  document.forms[1].item(name).value="";
	  document.forms[1].item(name).focus();
      return false;
     }  }
     return true;
}

/* ================================================================== */
/*
 * 校验客户端的输入字符的真实长度（数字为1位汉字为2位）
 * /*==================================================================
 */
function len(title,name,len){
    var reallength=0;
    if(!isEmpty(name)){
    var str=trim(document.forms[1].item(name).value);
    for (i=0;i<str.length;i++)
    {
  		if(str.charAt(i)<' '|| str.charAt(i)>'~')
  		{
  			reallength=reallength+2;
  		}
  		else
  		{
  		    reallength=reallength+1;
  		}
    }

    if (reallength>len)
    {
      alert(title+"字段的长度不能超过"+len+"个字符！或"+ Math.round(len/2)+"个汉字！,您现在输入了"+reallength+"个字符");
      // document.forms[1].item(name).value="";
      document.forms[1].item(name).focus();
      return false;
    }else{
     return true;
    }   }
    return true;

}


// 校验邮政编码
function zipCode(name){
var err=true;
var zip=trim(document.forms[1].item(name).value);
var pattern=/^[0-9]{6}$/;
if(!isEmpty(name)){
  if(!pattern.test(zip)){
    err=false;
    alert("邮政编码输入错误");
    // document.forms[1].item(name).value="";
    // document.forms[1].item(name).focus();
    // return;
  }else
    if(parseInt(zip)<10000||parseInt(zip)>850000){
       err=false;
       alert("邮政编码输入错误");
       // document.forms[1].item(name).value="";
       // document.forms[1].item(name).focus();
       // return;
   }else{
   // return true;
   }
  }
  if(!err){
    document.forms[1].item(name).value="";
    document.forms[1].item(name).focus();
  }
  return err;
}


/* ================================================================== */
// 校验电话号码

function phoneCode(name){
var phone=trim(document.forms[1].item(name).value);
if(!isEmpty(name)){
var reg=/(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/;
if(!reg.test(phone)){
  alert("电话号码输入错误！");
  document.forms[1].item(name).value="";
  document.forms[1].item(name).focus();
  return false;
}}
 return true;
}




/* ================================================================== */
// 校验传真号码
function faxCode(name){
var fax=trim(document.forms[1].item(name).value);
if(!isEmpty(name)){
var reg=/(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)/;
if(!reg.test(fax)){
  alert("传真输入错误！");
  document.forms[1].item(name).value="";
  document.forms[1].item(name).focus();
  return false;
}}
  return true;
}

function space(title,name){
  var str=document.forms[1].item(name).value
  for ( i = 1; i < str.length; i++ ) {
		var c = str.charAt(i);
        if(c==" "){
		  alert(title+"不允许输入空格");
	      // document.forms[1].item(name).value="";
	      // document.forms[1].item(name).focus();
		  return false;
		  break;
		}
     }
 return true;
 }




