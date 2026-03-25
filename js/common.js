
//全局公共参数
var g_req_url ="https://www.gzposition.com:5020/"; //在线生产环境
// var g_req_url ="https://localhost:5000/"; //本地调试环境
var g_req_url ="http://localhost:5005/"; //本地调试环境
var g_req_login_url = "pages/login.html"; //登录相对路径
var g_domain_name ="https://www.gzposition.com/vw/"; //浏览器地址
var g_domain_name_web = g_domain_name +"system/"; //浏览器地址
var g_language_type = 'en'; //初始设定语言版本 英文:en | 中文:zh

//本地浏览器缓存key
var g_accr_auth_menus = 'web25_tg_accr_auth_menus'; //缓存菜单信息
var g_accr_auth_token = 'web25_tg_accr_auth_token'; //缓存token
var g_accr_auth_usid = 'web25_tg_accr_auth_usid'; //缓存usid
var g_accr_login_info = 'web25_tg_accr_login_info'; //缓存用户信息
var g_accr_log_ip = 'web25_tg_accr_log_ip'; //缓存日志ip
var g_accr_language_type = 'web25_tg_accr_language_type'; //缓存语言版本
var g_accr_language_path = 'web25_tg_accr_language_path'; //缓存语音文件路径
var g_accr_data_filter = 'web25_tg_accr_data_filter'; //缓存筛选过滤公共数据
var g_f_localstorage_clear = function () { //清除localStorage缓存
	// localStorage.clear();
	localStorage.removeItem(g_accr_auth_menus);
	localStorage.removeItem(g_accr_auth_token);
	localStorage.removeItem(g_accr_auth_usid);
	localStorage.removeItem(g_accr_login_info);
	localStorage.removeItem(g_accr_log_ip);
	localStorage.removeItem(g_accr_language_path);
	localStorage.removeItem(g_accr_data_filter);
};

//非本地调式隐藏所有console.log
if (location.href.indexOf("/127.0.0.1") === -1 ) {
	var logDebug = false;
	console.log = (function(oriLogFunc) {
		return function() {
			if (logDebug) {
				oriLogFunc.apply(this, arguments);
			}
		}
	})(console.log);
};

//layui转义数据表格时间转义函数
 function g_cdf_time(cellval) {
     var date = new Date(parseInt(cellval.replace("/Date(", "").replace(")/", ""), 10));
     var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
     var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
     var dt = date.getFullYear() + "-" + month + "-" + currentDate;
     return dt;
 }
 
 //根据ID值获取标签
 var getdoc = function(id) {
 	return document.getElementById(id);
 };
 
 // 跳转已打开过的历史页面
 var gohistory = function(obj){
 	history.go(obj);
 };
 
 ///置顶
 function DoTop() {
 	window.scroll(0,0); // 屏幕回到最上角
 	//window.scrollBy(0,-30)  //屏幕上移30像素点
 };
 
 //接收一个值
 function oneValues() {
     var result;
     var url = window.location.search; //获取url中"?"符后的字串  
     if (url.indexOf("?") != -1) {
         result = url.substr(url.indexOf("=") + 1);
     }
     return result;
 }
 
 //接收多值
 function manyValues() {
     var url = window.location.search;
     if (url.indexOf("?") != -1) {
         var str = url.substr(1);
         strs = str.split("&");
         var key = new Array(strs.length);
         var value = new Array(strs.length);
         for (i = 0; i < strs.length; i++) {
             key[i] = strs[i].split("=")[0]
             value[i] = unescape(strs[i].split("=")[1]);
             //alert(key[i] + "=" + value[i]);
         }
     }
 }
 
 // 获取自定义范围以内的随机数
 var randomData = function(customnum) {
     return Math.round(Math.random()*customnum);
 };
 
//千分位用逗号分隔
var sliceDecimal = function (num, obj = ''){
	if (num==null||num==undefined||num.length==0||num.toString()=='')  return obj;
	if (num) {
		if(''==num || isNaN(num)){return '-';}
		num = num + '';
		var sign = num.indexOf('-')> 0 ? '-' : '';
		var cents = num.indexOf('.')> 0 ? num.substr(num.indexOf('.')) : '';
		cents = cents.length>1 ? cents : '' ;
		num = num.indexOf('.')>0 ? num.substring(0,(num.indexOf('.'))) : num ;
		if('' == cents){ if(num.length>1 && '0' == num.substr(0,1)){return '-';}}
		else{if(num.length>1 && '0' == num.substr(0,1)){return '-';}}
		for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++) {
			num = num.substring(0,num.length-(4*i+3))+','+num.substring(num.length-(4*i+3));
		}
		// return (sign + num + cents);
		return (sign + num + cents).replace('-,', '-'); //3,6,9位数的负数时需要特殊处理  
	} else { return num.toString(); }
};

 /**
     实现数组升序 
     数组变量.sort(compare_asc)
 **/
 var compare_asc = function (x, y) {//比较函数
     if (x < y) {
         return -1;
     } else if (x > y) {
         return 1;
     } else {
         return 0;
     }
 };
 
 /**
     实现数组降序
     数组变量.sort(compare_desc)
 **/
 var compare_desc = function (x, y) {
     if (x < y) {
         return 1;
     } else if (x > y) {
         return -1;
     } else {
         return 0;
     }
 };
 
//处理对象数组：提取指定属性 → 去重 → 排序
 var processArray = function (arr, prop, ascending = true) {
   // 1. 提取属性值并过滤无效项
   const values = arr.map(item => item?.[prop]).filter(val => val !== undefined && val !== null);
 
   // 2. 使用Set去重
   const uniqueValues = [...new Set(values)];
 
   // 3. 排序处理
   return uniqueValues.sort((a, b) => 
     ascending 
       ? a.toString().localeCompare(b.toString())
       : b.toString().localeCompare(a.toString())
   );
 }
 
 //给数组(Array)添加一个判断某元素是否存在的函数
 Array.prototype.contains = function (obj) {
   var i = this.length;
   while (i--) {
     if (this[i] === obj) {
       return true;
     }
   }
   return false;
 };
 
 if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (prefix){
   return this.slice(0, prefix.length) === prefix;
  };
 };
 
 if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function(suffix) {
   return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
 };
 
  //flag返回值为true则说明是电脑客户端
function computer_Client() {
    var userAgentInfo=navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod", "BlackBerry", "webOS");
    var flag=true;
    for(var v=0;v<Agents.length;v++) {
        if(userAgentInfo.indexOf(Agents[v])>0) {
            flag=false;
            break;
        }
    }
    return flag;
}

// 数组去重: 先将原数组排序，在与相邻的进行比较，如果不同则存入新数组。
function duplicate_removal_arr(arr) {
    var formArr = arr.sort(); // 对原数组进行排序
    var newArr=[formArr[0]];
    for (let i = 1; i < formArr.length; i++) {
        if (formArr[i]!==formArr[i-1]) {
            newArr.push(formArr[i]);
        }
    }
    return newArr
}

//获取guid(全球唯一标识符)
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

//十六进制转为RGB
function hex2Rgb(hex) { 
	var rgb = []; // 定义rgb数组
	if (/^\#[0-9A-F]{3}$/i.test(hex)) { //判断传入是否为#三位十六进制数
		let sixHex = '#';
		hex.replace(/[0-9A-F]/ig, function(kw) {
			sixHex += kw + kw; //把三位16进制数转化为六位
		});
		hex = sixHex; //保存回hex
	}
	if (/^#[0-9A-F]{6}$/i.test(hex)) { //判断传入是否为#六位十六进制数
		hex.replace(/[0-9A-F]{2}/ig, function(kw) {
			rgb.push(eval('0x' + kw)); //十六进制转化为十进制并存如数组
		});
		return `rgb(${rgb.join(',')})`; //输出RGB格式颜色
	} else {
		console.log(`Input ${hex} is wrong!`);
		return 'rgb(0,0,0)';
	}
}

//四舍五入函数
delete Number.prototype.toFixed; 
Number.prototype.toFixed = function (digits, isFillZero = true) {   
    var num = this;
	var result = (Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits)).toString();
	if (isFillZero && digits > 0) {
		if (result.indexOf('.') == -1) { result += '.';  }
		let have_digits = digits - (result.length - 1 - result.indexOf('.'));
		if (have_digits > 0) { for (let i = 0; i < have_digits; i++) { result += '0'; } }
	}
    return (result);
};

//替换字符串，原replaceAll在部分旧版本浏览器不支持
delete String.prototype.replaceAll; 
String.prototype.replaceAll = function(oldstr, newstr) {
    var str = this;
	var len = str.split(oldstr).length;
	for(var i = 0; i < len; i++) {
		str = str.replace(oldstr, newstr);
	}
    return str;
}
// String.prototype.replaceAll = function(FindText, RepText){
// 	var regExp = new RegExp(FindText, "g");
// 	return this.replace(regExp, RepText); 
// }

//获取字符串字节长度（判断当前字符是单字节还是双字节，然后统计字符串的字节长度）
String.prototype.byteLength = function() {
    var length = 0;
    Array.from(this).map(function(char){
        if (char.charCodeAt(0) > 255) {//字符编码大于255，说明是双字节字符
            length += 2;
        } else {
            length++;
        }
    });
    return length;
}

//获取指定日期格式字符串
Date.prototype.Format = function (fmt) { 
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"H+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

//添加日志方法
function Print_Log(m,mchid,mcontent) {
	layui.use(["element", "jquery", "table", "form", "laydate", "okLayer", "okUtils", "okMock"], function() {
		let table = layui.table;
		let form = layui.form;
		let laydate = layui.laydate;
		let okLayer = layui.okLayer;
		let okUtils = layui.okUtils;
		let okMock = layui.okMock;
		let $ = layui.jquery;
		okUtils.ajax(g_req_url + "SystemLog/SetLogData", "POST", JSON.stringify({
			menu: m,
			menu_chid: mchid,
			menu_content: mcontent,IP:localStorage.getItem(g_accr_log_ip)
		}), true, false).done(function(response) {
			var authdata = response
		}).fail(function(error) {
			console.log(error)
		});
		}
	)
};
function axios_log(m,mchid,mcontent){
	var data= {
		menu: m,
		menu_chid: mchid,
		menu_content: mcontent,IP:localStorage.getItem(g_accr_log_ip)
	};
	return axios({
		method: 'post',
		dataType: "json",
		contentType: "application/json",
		url: g_req_url + "SystemLog/SetLogData",
		data: data,
		headers,
	})
	.then(function(a){
		console.log(2222,a)
	})
	
};

//对最大值数据(echarts图表)进行特殊处理
function set_maxData_F1(id,data,max_num=1.5){
	(data.share[0]).forEach(function(a,b){
		if (a>max_num) {
			var new_num = max_num * (1 + Math.sqrt(a)*0.1);
			(data.share[0])[b]={
				value:new_num,
				symbol:'path://M470.016 976.896q-44.032 0-59.392-20.48t-15.36-65.536q0-20.48-0.512-64.512t-1.024-93.696-1.536-96.768-1.024-74.752q0-39.936-7.68-62.464t-35.328-21.504q-20.48 0-48.64-1.024t-49.664 0q-35.84 0-45.568-19.456t13.824-50.176q24.576-30.72 57.344-72.704t67.584-86.016 68.096-87.04 58.88-75.776q23.552-29.696 45.568-30.72t46.592 26.624q24.576 29.696 56.832 69.632t67.072 82.432 68.608 83.968 60.416 73.216q29.696 35.84 23.04 58.88t-43.52 23.04q-11.264 0-25.088 0.512t-29.184 1.024-30.208 1.024-27.136 0.512q-25.6 1.024-32.256 16.384t-5.632 41.984q0 29.696 0.512 77.824t1.024 100.352 1.536 101.376 1.024 79.872q0 13.312-2.048 27.648t-9.728 26.112-21.504 19.968-36.352 8.192q-27.648 0-52.736 0.512t-56.832 1.536z',//标记的图形
				symbolOffset:[0,-4],
				symbolSize:12
			};
			
		};
	});
	console.log(777,data );
	
};