var LINK = location.href;
var url_json = JSON.parse(decodeURIComponent(getQueryString('json')));

//父页面弹窗颜色
function skin_f1(skin){
	if (skin == 1) {// 灰白色
	    return "";
	} else if (skin == 2) {// 墨绿色
	    return "layui-layer-molv";
	} else if (skin == 3) { // 蓝色
	    return "layui-layer-lan";
	} else if (!skin || skin == 4) {// 随机颜色
	    var skinArray = ["", "layui-layer-molv", "layui-layer-lan"];
	    return skinArray[Math.floor(Math.random() * skinArray.length)];
	}
};
function anim_f1(anim){
	let animArray = ["0", "1", "2", "3", "4", "5", "6"];
	if (animArray.indexOf(anim) > -1) { // 用户选择的动画
	    return anim;
	} else if (!anim || anim == 7) { // 随机动画
	    return Math.floor(Math.random() * animArray.length);
	}
};
var skin = localStorage.getItem("skin"); if(skin=='null'||skin==null) skin=1; skin = skin_f1(skin);
var anim = localStorage.getItem("anim"); if(anim=='null'||anim==null) anim='0'; anim = anim_f1(anim);

//axios异步请求方法
var axios_num=0;
var result = localStorage.getItem(g_accr_auth_token);
var headers={Authorization:'Bearer '+result};

//isParams='url',post传参放在url上，否则放在post传参放在body体上
function axios_F1(url, data,method='get',isParams='url') {
	axios_num++;
	if($('.load0').length==0  ){
		$("body").prepend(`<span class="load0 layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop" style="z-index: 999999 !important;  position: fixed;font-size: 3rem;color: #FFFFFF;left: 49%;top: 48%;"></span>` );
	};
	if (method=='get') {
		var params='params';
	} else {
		var params='data';
	};
	var json={
		method: method,
		//withCredentials: true, // 允许携带cookie
		//responseType: 'blob',
		dataType: "json",
		contentType: "application/json",
		url: g_req_url + url,
		// url: g_req_url + url + '?t='+Math.floor(Math.random()*10000).toString(),
		params: data,
		headers,
		// headers: {Authorization:'Bearer '+localStorage.getItem(g_accr_auth_token)},
	};
	if (method=='get'||isParams=='url1') {
		json.params=data;
		delete json.data;
	} else{
		json.data=data;
		delete json.params;
	};
	setTimeout(()=>{
		$('.load0').remove();
	},10000);
	return axios(json)
	.then(function(res){
		// debugger
		axios_num--;
		// console.log(res.data)
		if (axios_num==0) $('.load0').remove();
		//验证失败，401表示已在其他地方登录，434表示token已过期
		if (res.status==401||res.statusCode==401||res.data.statusCode==401||res.status==434||res.statusCode==434||res.data.statusCode==434) {
			if (location.href.indexOf('login.html') != -1) return;
			else parent.log_off();
		};
		return res;
	})
	.catch(function(error) { // 请求失败处理
		// debugger
		axios_num--;
		//console.log('error11',error);
		if (axios_num==0) $('.load0').remove();
		//验证失败，401表示已在其他地方登录，434表示token已过期
		if (error.toString().indexOf('401')!=-1 || error.toString().indexOf('434')!=-1) {
			if (location.href.indexOf('login.html') != -1) return;
			else parent.log_off();
		};
		if (axios_num==0) $('.load0').remove();
	});
		
};

//执行ajax公共方法
var ajax_F1 = function (url, data, type = 'get', async = true, success, error = null) {
	$.ajax({
        type: type,
        async: async, //异步请求
        url: g_req_url + url,
        data: data, //参数
        dataType: "json",     	//返回数据类型
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Authorization", "Bearer " + result);
            if ($('.load0').length == 0) $("body").prepend(`<span class="load0 layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop" style="z-index: 10000 !important; position: fixed; font-size: 3rem; color: #656565; left: 49%; top: 48%;"></span>`);
        },
        success: function (result) {
			success(result);
        },
        complete: function(){
			$('.load0').remove();
		}, error
   });
};

//导出文件GET方法
function export_get(url,params,name ){
	//headers['Content-Type']='application/json; application/octet-stream';
	//console.log('导出文件方法',url,params,name); 
	// return;
	axios_F1('Common/CheckToken').then(response=>{
		//通过接口验证是否处于登录状态
		axios_log(name.substring(0,name.indexOf('.')),name,"Export");//保存导出日志
		axios.get(
			  g_req_url + url,
			  {responseType: "arraybuffer",headers,params:params,},
			)
			.then((res) => {
				$('.load0').remove();
				if (res.status != 200) {
					layer.msg('Export Error !'); layer.closeAll('loading'); 
					return;
				}
				let blob = res.data;
				if (blob.byteLength < 200 && (new TextDecoder('utf-8')).decode(blob).indexOf('"statusCode":555') != -1) {
					layer.msg('暂无导出权限，请联系客服！'); layer.closeAll('loading'); 
					return;
				}
				console.log('导出文件方法',res );
				var b = new Blob([res.data], { type: "application/vnd.ms-excel" });
				// 根据传入的参数b创建一个指向该参数对象的URL
				var url = URL.createObjectURL(b);
				var link = document.createElement("a");
				// 导出的文件名
				let fileName = name;
				link.download = fileName;
				link.href = url;
				link.click();
				layer.closeAll('loading'); 
			})
			.catch(function(error) { // 请求失败处理
				layer.closeAll('loading'); 
				layer.msg('Export failure.'); 
				console.log(error);
			});
	});
};

//导出文件POST方法
function export_post(url,params,name,is_url=false ){
	axios_F1('Common/CheckToken').then(response=>{
		//通过接口验证是否处于登录状态
		if (is_url) {
			var json={
				method: 'post',
				responseType: 'arraybuffer',
				// responseType: 'blob',
				// dataType: "json",
				// contentType: "application/json",
				url: g_req_url + url,
				params: params,//参数在url上
				//data: params,
				headers,
			};
		} else{
			var json={
				method: 'post',
				responseType: 'arraybuffer',
				// responseType: 'blob',
				// dataType: "json",
				// contentType: "application/json",
				url: g_req_url + url,
				//params: params,
				data: params,
				headers,
			};
		};
		axios(json)
			.then((res) => {
				$('.load0').remove();
				if (res.status != 200) {
					layer.msg('Export Error !'); layer.closeAll('loading'); 
					return;
				}
				let blob = res.data;
				if (blob.byteLength < 200 && (new TextDecoder('utf-8')).decode(blob).indexOf('"statusCode":555') != -1) {
					layer.msg('暂无导出权限，请联系客服！'); layer.closeAll('loading'); 
					return;
				}
			  	console.log('导出文件方法',res );
				var b = new Blob([res.data], { type: "application/vnd.ms-excel" });
				// 根据传入的参数b创建一个指向该参数对象的URL
				var url = URL.createObjectURL(b);
				var link = document.createElement("a");
				// 导出的文件名
				let fileName = name;
				link.download = fileName;
				link.href = url;
				link.click();
				layer.closeAll('loading'); 
			});
	});
};

//对象数组去重
function json_arr(arr, uniId){
  const res = new Map();
  var x1= arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
  x1.sort((a,b)=>{return b.value-a.value  });
  return x1
}

//回车查询
$("body").keydown(function () {
	if (event.keyCode == "27") {//keyCode=27是esc键
		layer.closeAll();
	};
});

function closeAll_f1(){
	layer.closeAll();
	setTimeout(function(){
		$('.layui-layer-shade').remove();
		$('.layui-layer-move').remove();
	});
};

//背景颜色块动画
function bazaar_percent_F1(id) { 
	$(id).find('b').each(function(index, a) {
		//console.log(a)
		var w = $(this).attr('data-w');
		//console.log(200,w);
		if (w<=1) {
			w=(parseFloat(w)*100).toFixed(1)+'%'
		};
		if (parseFloat(w) < 0) {
			$(this).css('left', w);
			w = Math.abs(parseFloat(w)) + '%'
		};
		$(this).css('width', w);
	});
};

//返回undefined处理方法函数
function isUndefined(a){
	if (a == undefined || a == '-' || a.indexOf(NaN) != '-1') a = '';
	return a;
};

//千位符函数
function fprice(a,b='-') {
	if (a==undefined||a==null||a.length==0||a.toString()==''||a=='NaN'||isNaN(a)   ) {
		return b
	};
	if(a<0){var bool=true; a=Math.abs(a);  };
	var arr = new Array();
	var xiaoshu = ""; //用来记录参数小数数值包括小数点
	var zhengshu = ""; //用来记录参数录整数数值
	if (a < 1000) { //当参数小于1000的时候直接返回参数
		if(bool)return '-'+a;
		return a;
	} else {
		var t = a.toString(); //将整数转换成字符串
		if (t.indexOf('.') > 0) { //如果参数存在小数，则记录小数部分与整数部分
			var index = t.indexOf('.');
			xiaoshu = t.slice(index, t.length);
			zhengshu = t.slice(0, index);
		} else { //否则整数部分的值就等于参数的字符类型
			zhengshu = t;
		}
		var num = parseInt(zhengshu.length / 3); //判断需要插入千位分割符的个数

		var head = zhengshu.slice(0, zhengshu.length - num * 3);
		if (head.length > 0) { //如果head存在，则在head后面加个千位分隔符，
			head += ',';
		}
		var body = zhengshu.slice(zhengshu.length - num * 3, zhengshu.length);

		var arr2 = new Array();
		for (var i = 0; i < num; i++) {
			arr2.push(body.slice(i * 3, i * 3 + 3));
		}
		body = arr2.join(','); //将数组arr2通过join(',')   方法，拼接成一个以逗号为间隔的字符串

		zhengshu = head + body; //拼接整数部分
		var result = zhengshu + xiaoshu; //最后拼接整数和小数部分
		if(bool)return '-'+result;
		return result; //返回结果
	}
};

//json转url参数
function parseParam(param, key) {
	var paramStr = "";
	if (param instanceof String || param instanceof Number || param instanceof Boolean) {
		paramStr += "&" + key + "=" + encodeURIComponent(param);
	} else {
		$.each(param, function(i) {
			var k = key == null ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
			paramStr += '&' + parseParam(this, k);
		});
	}
	return paramStr.substr(1);
};

//返回数字是否是特殊值
function toFloat(obj, fixed = 1, value = '-'){
	if (obj===''||obj===null||obj===undefined||obj==='Infinity'||obj=='null'  ) {
		return value
	} else{
		return (parseFloat(obj)*100).toFixed(fixed);
	};
};
function toFloat2(obj, fixed = 1, value = '-'){
	if (obj===''||obj===null||obj===undefined||obj==='Infinity'||obj=='null'||obj=='-'  ) {
		return value
	}else if(obj=='NaN' ){
		return '-'
	} else{
		return (parseFloat(obj)*100).toFixed(fixed)+'%';
	};
};
function toFloat22(obj, fixed = 1, value = '-'){
	if (obj===''||obj===null||obj===undefined||obj==='Infinity'||obj=='null'||obj=='-'  ) {
		return value
	}else if(obj=='NaN' ){
		return '-'
	} else{
		return (parseFloat(obj)>=0?'+':'')+(parseFloat(obj)*100).toFixed(fixed)+'%';
	};
};
function toFloat3(obj, fixed = 1, value = '-'){
	if (obj===''||obj===null||obj===undefined||obj==='Infinity'||obj=='null'  ) {
		return value
	} else{
		return (parseFloat(obj)*100).toFixed(fixed)+' pts';
	};
};
function toFloat4(obj, fixed = 1, value = '-'){
	if (obj===''||obj===null||obj===undefined||obj==='Infinity'||obj=='null'  ) {
		return value
	} else{
		return (parseFloat(obj)).toFixed(fixed)+' pts';
	};
};
function toFloat5(obj, fixed = 1, value = '-'){
	if (obj===''||obj===null||obj===undefined||obj==='Infinity'||obj=='null'  ) {
		return value
	} else{
		return (parseFloat(obj)).toFixed(fixed)+' %';
	};
};
function  if_null(obj, value = '-'){
	if (obj==''||obj==null||obj==undefined||obj=='Infinity'||obj=='null'  ) {
		return value
	} else{
		return obj
	}
};

//返回数字转为百分比
function toPercent(obj, fixed = 1, value = '-'){
	var fnum = toFloat(obj,fixed,value);
	return (fnum == value ? fnum : fnum + '%')
};


//拿到url后面中文参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return decodeURI(r[2]);
	return null;
};

//JS 生成唯一字符串UUID
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
  
    var uuid = s.join("");
    return uuid;
};

function tishi_F1(code,title='Submit Successfully!') {//提示信息
	if(code==200)title=title;
	if(code==400)title='400';
	if(code==404)title='404';
	if(code==500)title='500';
	return title;
};

//拖动指定元素函数方法
function drag_doc_scroll(id){
	$(id).on('mousedown',function(e){
		var positionDiv = $(this).scrollLeft();
		var num=true;
		var startNum='',finishNum='',thisNum1=0;
		if(1 == e.which){
			$(window).mousemove(function(e){
				var x = e.pageX;
				if (num) {
					startNum=x;
					num=false;
				};
				finishNum=x;
				thisNum1=(startNum-finishNum);
				thisNum1=thisNum1+parseInt($(id).attr('num'  ) );
				//console.log('拖动table表格',thisNum1  );
				$(id).scrollLeft( thisNum1  );
			});
			return false;
		} else {
			$(window).off('mousemove');
		};
	});
	$(id).on('mouseup',function(){
		$(window).off('mousemove');
		$(id).attr('num',$(id).scrollLeft()  );
	});
};

function null_toFixed(a,b=2){
	if (a==undefined||a==null||a=='NaN'||isNaN(a)   ) {
		return '-'
	}else{
		return a.toFixed(b)
	};
};

function is_null(a,b=''){
	if (a===null||a===undefined||a.length==0||a.toString()=='') {
		return b
	} else{
		return a
	};
};

function isNullOrEmpty(obj){
	return (obj==undefined||obj==null||obj.length==0||obj.toString()=='');
};

function is_Number1(a){
	if (a<10&&a>0) {
		return '0'+a
	} else{
		return a
	}
};

//检查图片地址是否存在
function isHasImg(pathImg){
	// if (url.indexOf('蔚来') != -1) debugger
    var ImgObj = new Image();
    ImgObj.src= pathImg;
    var b = (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0));
	return b;
};


