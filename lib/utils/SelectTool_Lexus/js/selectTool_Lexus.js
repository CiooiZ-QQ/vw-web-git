
var typelist = new Array();
var g_setdata = null;
var g_doctcontainer = null;
var g_selectedids = [];
var g_vsntype = "在产";
var g_vsndata = null;

//提交已选维度
var commitselector = function () {
	//console.log(g_setdata.selecttype + ' | ' + JSON.stringify(g_setdata.selectedItem));
    if (g_doctcontainer) {
    	if (g_doctcontainer.parent()) g_doctcontainer.parent().hide(); //这个操作要根据前端功能来定
    	//if (g_doctcontainer.parent()) g_doctcontainer.parent().animate({ left: '-100%' }, "slow");
    }
};

//生成选择器DIV
//selecttype：新的维度类型
//setdata: 现有的setdata
//doctcontainer：选择器容器
var initSelector = function (selecttype, setdata, doctcontainer) {
	//console.log(JSON.stringify(setdata));
	
	if (selecttype == undefined || selecttype == null || selecttype == '' ||  selecttype.toUpperCase() == "ALL") return;
	if (setdata == undefined || setdata == null || setdata == {}) return;
	if (doctcontainer == undefined || doctcontainer == null) return;
	
	//将后期需要处理的数据缓存到全局变量
	if (setdata.multiselect) g_setdata = JSON.parse(JSON.stringify(setdata)); //注意这里是复制一个setdata出来
	else g_setdata = setdata;
	selecttype = selecttype.toUpperCase(); //转大写，减少误传错误
	if (!g_setdata.multiselect) g_setdata.selectedItem = []; //单选模式先清空已选维度(selectedItem)
	if (selecttype != g_setdata.selecttype.toUpperCase()) { //改变维度类型(selecttype)后，会先清空已选维度(selectedItem)
		g_setdata.selecttype = selecttype;
		g_setdata.selectedItem = [];
	}
	//else return;
	g_doctcontainer = doctcontainer;
	g_selectedids = [];
	if (g_setdata.selectedItem && g_setdata.selectedItem.length > 0) {
		for (var i = 0, j = g_setdata.selectedItem.length; i < j; i++) {
			g_selectedids.push(g_setdata.selectedItem[i].key.toString());
		}
	}
	
	//添加静态元素标签
	doctcontainer.html('');	
	doctcontainer.html('<div class="selector_all">' +
			'<div class="selector_header">' +
				'<span id="STYLE">A级别</span>' +
				'<span id="SUB_SEG">C级别</span>' +
				'<span id="FUEL">能源</span>' +
				'<span id="OEM">厂商</span>' +
				'<span id="BRD">品牌</span>' +
				'<span id="SUB_CAR">&gt;&nbsp;&nbsp;&nbsp;车型</span>' +
				'<span id="TYPE">&gt;&nbsp;&nbsp;&nbsp;TYPE</span>' +
				'<span id="VSN">&gt;&nbsp;&nbsp;&nbsp;型号</span>' +
				'<input type="button" id="selector_ok" value="确 定" hidden="true" style="width: 60px;" />' +
			'</div>' +
			'<div class="selector_content" id="selector_STYLE"><label class="lbl_load">正在加载A级别...</label></div>' + 
			'<div class="selector_content" id="selector_SUB_SEG"><label class="lbl_load">正在加载C级别...</label></div>' + 
			'<div class="selector_content" id="selector_FUEL"><label class="lbl_load">正在加载能源...</label></div>' + 
			'<div class="selector_content" id="selector_OEM"><label class="lbl_load">正在加载厂商...</label></div>' + 
			'<div class="selector_content" id="selector_BRD"><label class="lbl_load">正在加载品牌...</label></div>' + 
			'<div class="selector_content" id="selector_SUB_CAR"><label class="lbl_load">正在加载车型...</label></div>' + 
			'<div class="selector_content" id="selector_TYPE"><label class="lbl_load">正在加载TYPE...</label></div>' + 
			'<div class="selector_content" id="selector_VSN"><label class="lbl_load">正在加载型号...</label></div>' +
			'<div id="divletter"></div>' +
			'</div>');
	
	//点击头部导航隐藏显示各容器
	$('.selector_header span').click(function () {
		hideAllContents();
		switch(this.id) {
			case "OEM":
				$('#OEM').show();
				$('#selector_OEM').show();
				$('#divletter').show();
				break;
			case "BRD":
				$('#BRD').show();
				$('#selector_BRD').show();
				$('#divletter').show();
				break;
			case "SUB_CAR":
				$('#BRD').show();
				$('#SUB_CAR').show();
				$('#selector_SUB_CAR').show();
				break;
			case "TYPE":
				$('#BRD').show();
				$('#SUB_CAR').show();
				$('#TYPE').show();
				$('#selector_TYPE').show();
				break;
			case "VSN":
				$('#BRD').show();
				$('#SUB_CAR').show();
				$('#VSN').show();
				$('#selector_VSN').show();
				break;
		};
	});
	
	//点击确认按钮
	$('#selector_ok').click(function () {
		//console.log('a');
		//$(this).hide();
		commitselector();
	});
	
	//根据维度类型加载匹配的选择列表
	if (selecttype == "STYLE") initSelector_STYLE();
	if (selecttype == "SUB_SEG") initSelector_SUB_SEG();
	if (selecttype == "FUEL") initSelector_FUEL();
	if (selecttype == "BRD" || selecttype == "SUB_CAR" || selecttype == "TYPE" || selecttype == "VSN")  initSelector_BRD();
};

//加载A级别
var initSelector_STYLE = function () {
	$('#STYLE').show();
	$('#selector_STYLE').show();
	var urlstring = (g_setdata.datatype.toUpperCase() == 'PV' ? 'PCCommon/GetPVStyleList' : 'PCCommon/GetStyleList');
	ajax(urlstring, {}, function(result) {
		if (!result) return;
      	//console.log(JSON.stringify(result));
      	
      	var doc = $('#selector_STYLE');
    	var appendhtml = '<div><ul style="padding-left: ' + (g_setdata.multiselect ? '55' : '30') + 'px;">'; 
    	for (var i = 0, j = result.length; i < j; i++) {
        	appendhtml += '<li style="height: 24px;" value="' + result[i].styleid + '"  data-isselect="' + (g_selectedids.contains(result[i].styleid.toString()) ? '1' : '0') + '">' 
        		+ (g_setdata.multiselect ? '<img style="top: 10px;" src="../img/select_' + (g_selectedids.contains(result[i].styleid.toString()) ? 'on' : 'off') + '.png" />' : '') 
        		+ '<span style="line-height: 24px;">' +result[i].style + '</span></li>';
        }
    	appendhtml += '</ul></div>';
        doc.html(appendhtml);
        
        //添加品牌点击事件，跳转品牌对应车型列表
        $("#selector_STYLE div ul li").click(function(){
        	var id = this.value;
        	var name = $(this).children('span:first').html();
        	if (this.dataset.isselect == 0 && !g_selectedids.contains(id.toString())) {
				this.dataset.isselect = 1;
				g_selectedids.push(id.toString());
				g_setdata.selectedItem.push({"key": id, "value": name});
			} 
			else if (g_setdata.multiselect && this.dataset.isselect == 1 && g_selectedids.contains(id.toString())) {
				this.dataset.isselect = 0;
				for (var i = 0, j = g_selectedids.length; i < j; i++) {
					if (g_selectedids[i] == id.toString()) {
						g_selectedids.splice(i, 1);
						for (var m = g_setdata.selectedItem.length - 1; m >= 0; m--) {
							if (g_setdata.selectedItem[m].key.toString() == id.toString()) {
								g_setdata.selectedItem.splice(m, 1);
							}
						}
						break;
					}
				}
			}
			$(this).children('img:first').attr('src','../img/select_' + (this.dataset.isselect == 1 ? 'on' : 'off') + '.png'); 
			if (g_setdata.multiselect) $('#selector_ok').show();
			else commitselector();
        });
    });
}

//加载C级别
var initSelector_SUB_SEG = function () {
	$('#SUB_SEG').show();
	$('#selector_SUB_SEG').show();
	var urlstring = (g_setdata.datatype.toUpperCase() == 'PV' ? 'PCCommon/getPVsubseglist' : 'PCCommon/GetSubSeg');
	ajax(urlstring, {}, function(result) {
		if (!result) return;
      	//console.log(JSON.stringify(result));
      	
      	var doc = $('#selector_SUB_SEG');
    	var appendhtml = '<div><ul style="padding-left: ' + (g_setdata.multiselect ? '55' : '30') + 'px;">'; 
    	for (var i = 0, j = result.length; i < j; i++) {
        	appendhtml += '<li style="height: 24px;" value="' + result[i].subsegid + '"  data-isselect="' + (g_selectedids.contains(result[i].subsegid.toString()) ? '1' : '0') + '">' 
        		+ (g_setdata.multiselect ? '<img style="top: 10px;" src="../img/select_' + (g_selectedids.contains(result[i].subsegid.toString()) ? 'on' : 'off') + '.png" />' : '') 
        		+ '<span style="line-height: 24px;">' +result[i].subseg + '</span></li>';
        }
    	appendhtml += '</ul></div>';
        doc.html(appendhtml);
        
        //添加品牌点击事件，跳转品牌对应车型列表
        $("#selector_SUB_SEG div ul li").click(function(){
        	var id = this.value;
        	var name = $(this).children('span:first').html();
        	if (this.dataset.isselect == 0 && !g_selectedids.contains(id.toString())) {
				this.dataset.isselect = 1;
				g_selectedids.push(id.toString());
				g_setdata.selectedItem.push({"key": id, "value": name});
			} 
			else if (g_setdata.multiselect && this.dataset.isselect == 1 && g_selectedids.contains(id.toString())) {
				this.dataset.isselect = 0;
				for (var i = 0, j = g_selectedids.length; i < j; i++) {
					if (g_selectedids[i] == id.toString()) {
						g_selectedids.splice(i, 1);
						for (var m = g_setdata.selectedItem.length - 1; m >= 0; m--) {
							if (g_setdata.selectedItem[m].key.toString() == id.toString()) {
								g_setdata.selectedItem.splice(m, 1);
							}
						}
						break;
					}
				}
			}
			$(this).children('img:first').attr('src','../img/select_' + (this.dataset.isselect == 1 ? 'on' : 'off') + '.png'); 
			if (g_setdata.multiselect) $('#selector_ok').show();
			else commitselector();
        });
    });
}

//加载能源
var initSelector_FUEL = function () {
	$('#FUEL').show();
	$('#selector_FUEL').show();
	var urlstring = (g_setdata.datatype.toUpperCase() == 'PV' ? 'PCCommon/GetPVFueltypeList' : 'PCCommon/GetFueltypeList');
	ajax(urlstring, {}, function(result) {
		if (!result) return;
      	//console.log(JSON.stringify(result));
      	
      	var doc = $('#selector_FUEL');
    	var appendhtml = '<div><ul style="padding-left: ' + (g_setdata.multiselect ? '55' : '30') + 'px;">'; 
    	for (var i = 0, j = result.length; i < j; i++) {
        	appendhtml += '<li style="height: 24px;" value="' + result[i].fuelid + '"  data-isselect="' + (g_selectedids.contains(result[i].fuelid.toString()) ? '1' : '0') + '">' 
        		+ (g_setdata.multiselect ? '<img style="top: 10px;" src="../img/select_' + (g_selectedids.contains(result[i].fuelid.toString()) ? 'on' : 'off') + '.png" />' : '') 
        		+ '<span style="line-height: 24px;">' +result[i].fuel + '</span></li>';
        }
    	appendhtml += '</ul></div>';
        doc.html(appendhtml);
        
        //添加品牌点击事件，跳转品牌对应车型列表
        $("#selector_FUEL div ul li").click(function(){
        	var id = this.value;
        	var name = $(this).children('span:first').html();
        	if (this.dataset.isselect == 0 && !g_selectedids.contains(id.toString())) {
				this.dataset.isselect = 1;
				g_selectedids.push(id.toString());
				g_setdata.selectedItem.push({"key": id, "value": name});
			} 
			else if (g_setdata.multiselect && this.dataset.isselect == 1 && g_selectedids.contains(id.toString())) {
				this.dataset.isselect = 0;
				for (var i = 0, j = g_selectedids.length; i < j; i++) {
					if (g_selectedids[i] == id.toString()) {
						g_selectedids.splice(i, 1);
						for (var m = g_setdata.selectedItem.length - 1; m >= 0; m--) {
							if (g_setdata.selectedItem[m].key.toString() == id.toString()) {
								g_setdata.selectedItem.splice(m, 1);
							}
						}
						break;
					}
				}
			}
			$(this).children('img:first').attr('src','../img/select_' + (this.dataset.isselect == 1 ? 'on' : 'off') + '.png'); 
			if (g_setdata.multiselect) $('#selector_ok').show();
			else commitselector();
        });
    });
}

//加载品牌
var initSelector_BRD = function () {
	$('#BRD').show();
	$('#selector_BRD').show();
	$('#divletter').hide();
	var urlstring = (g_setdata.datatype.toUpperCase() == 'PV' ? 'PCCommon/getPVBrdlist' : 'PCCommon/getBrdlist');
	ajax(urlstring, {}, function(result) {
		if (!result) return;
      	console.log(result);
    	
    	var letterlist = [];
    	for (var i = 0, j = result.length; i < j; i++) {
    		if (!letterlist.contains(result[i].letter)) letterlist.push(result[i].letter);
    	}
    	
    	var docletter = $('#divletter');
    	var appendhtmlletter = ''; 
    	for (var i = 0, j = letterlist.length; i < j; i++) {
    		appendhtmlletter += '<label style="">' + letterlist[i] + '</label>';
    	}
    	docletter.html(appendhtmlletter);
    	docletter.css('top',((((g_doctcontainer.height() - (20*letterlist.length)) / 2) <= 50 ? '50' : (g_doctcontainer.height() - (20*letterlist.length)) / 2).toString()) + 'px');
    	docletter.show();
    	
    	var doc = $('#selector_BRD');
    	var appendhtml = ''; 
    	var isshowcheckbox = (g_setdata.selecttype.toUpperCase() == "BRD" && g_setdata.multiselect);
    	for (var i = 0, j = letterlist.length; i < j; i++) {
        	appendhtml += '<h3 style="padding: 5px 12px;">' + letterlist[i] + '</h3>';
        	appendhtml += '<div><ul style="padding-left: ' + (isshowcheckbox ? '55' : '30') + 'px;">';
        	for (var k = 0, m = result.length; k < m; k++) {
        		if (letterlist[i] == result[k].letter) {
        			appendhtml += '<li style="height: 24px;" value="' + result[k].brdid + '"  data-isselect="' + (g_selectedids.contains(result[k].brdid.toString()) ? '1' : '0') + '">' 
        				+ (isshowcheckbox ? '<img style="top: 10px;" src="../img/select_' + (g_selectedids.contains(result[k].brdid.toString()) ? 'on' : 'off') + '.png" />' : '') 
        				+ '<span style="line-height: 24px;">' +result[k].brd + '</span>' 
        				+ '</li>';
        		}
        	}
        	appendhtml += '</ul></div>';
        }
        doc.html(appendhtml);
        
        //添加首字母滚动定位事件
    	$('#divletter label').click(function(){
    		var letter = $(this).html();
    		$('#selector_BRD').children('h3').each(function(){
    			if (letter == $(this).html()) {
    				$("#selector_BRD").animate({
						// scrollTop: $(this).offset().top - 30
						scrollTop: this.offsetTop
					});
    			}
    		});
    	});
    	
        //添加品牌点击事件，跳转品牌对应车型列表
        $("#selector_BRD div ul li").click(function(){
        	var id = this.value;
        	var name = $(this).children('span:first').html();
        	if (g_setdata.selecttype.toUpperCase() == "BRD") {
        		if (this.dataset.isselect == 0 && !g_selectedids.contains(id.toString())) {
    				this.dataset.isselect = 1;
    				g_selectedids.push(id.toString());
    				g_setdata.selectedItem.push({"key": id, "value": name});
    			} 
    			else if (g_setdata.multiselect && this.dataset.isselect == 1 && g_selectedids.contains(id.toString())) {
    				this.dataset.isselect = 0;
    				for (var i = 0, j = g_selectedids.length; i < j; i++) {
    					if (g_selectedids[i] == id.toString()) {
    						g_selectedids.splice(i, 1);
    						for (var m = g_setdata.selectedItem.length - 1; m >= 0; m--) {
    							if (g_setdata.selectedItem[m].key.toString() == id.toString()) {
    								g_setdata.selectedItem.splice(m, 1);
    							}
    						}
    						break;
    					}
    				}
    			}
    			$(this).children('img:first').attr('src','../img/select_' + (this.dataset.isselect == 1 ? 'on' : 'off') + '.png'); 
    			if (g_setdata.multiselect) $('#selector_ok').show();
				else commitselector();
        	} 
        	else {
	        	initSelector_SUB_CAR(id, name); //加载车型
        	}
        });
    });
}

//加载车型
var initSelector_SUB_CAR = function (id, name) {
	$('#SUB_CAR').show();
	$('#selector_OEM').hide();
	$('#selector_BRD').hide();
	$('#divletter').hide();
	$('#selector_SUB_CAR').html('<label class="lbl_load">正在加载车型...</label>');
	$('#selector_SUB_CAR').show();
	$('#selector_TYPE').hide();
	$('#selector_VSN').hide();
	ajax('PCCommon/GetSubCarList', {
		brdid: id
	}, function(result) {
		if (!result) return;
      	//console.log(JSON.stringify(result));
    	
    	var doc = $('#selector_SUB_CAR');
    	var appendhtml = ''; 
    	var isshowcheckbox = (g_setdata.selecttype.toUpperCase() == "SUB_CAR" && g_setdata.multiselect);
    	for (var i = 0, j = result.length; i < j; i++) {
        	appendhtml += '<h3 style="padding: 5px 12px;" data-id="' + result[i].oemid + '">' + result[i].oem + '</h3>';
        	appendhtml += '<div><ul style="padding-left: ' + (isshowcheckbox ? '55' : '35') + 'px;">';
        	for (var k = 0, m = result[i].list.length; k < m; k++) {
        		appendhtml += '<li value="' + result[i].list[k].carid + '"  data-isselect="' + (g_selectedids.contains(result[i].list[k].carid.toString()) ? '1' : '0') + '">' 
        			+ (isshowcheckbox ? '<img src="../img/select_' + (g_selectedids.contains(result[i].list[k].carid.toString()) ? 'on' : 'off') + '.png" />' : '') 
        			+ '<span>' + result[i].list[k].car + '</span>' 
	        		+ '<label class="br">' + result[i].list[k].price + '</label>'
        			+ '</li>';
        	}
        	appendhtml += '</ul></div>';
        }
        doc.html(appendhtml);
    	
        //添加品牌点击事件，跳转品牌对应车型列表
        $("#selector_SUB_CAR div ul li").click(function(){
        	var id = this.value;
        	var name = $(this).children('span:first').html();
        	if (g_setdata.selecttype.toUpperCase() == "SUB_CAR") {
        		if (this.dataset.isselect == 0 && !g_selectedids.contains(id.toString())) {
    				this.dataset.isselect = 1;
    				g_selectedids.push(id.toString());
    				g_setdata.selectedItem.push({"key": id, "value": name});
    			} 
    			else if (g_setdata.multiselect && this.dataset.isselect == 1 && g_selectedids.contains(id.toString())) {
    				this.dataset.isselect = 0;
    				for (var i = 0, j = g_selectedids.length; i < j; i++) {
    					if (g_selectedids[i] == id.toString()) {
    						g_selectedids.splice(i, 1);
    						for (var m = g_setdata.selectedItem.length - 1; m >= 0; m--) {
    							if (g_setdata.selectedItem[m].key.toString() == id.toString()) {
    								g_setdata.selectedItem.splice(m, 1);
    							}
    						}
    						break;
    					}
    				}
    			}
    			$(this).children('img:first').attr('src','../img/select_' + (this.dataset.isselect == 1 ? 'on' : 'off') + '.png'); 
    			if (g_setdata.multiselect) $('#selector_ok').show();
				else commitselector();
        	} 
        	else {
	        	if (g_setdata.selecttype.toUpperCase() == "TYPE") initSelector_TYPE(id, name); //加载TYPE
	        	else if (g_setdata.selecttype.toUpperCase() == "VSN") initSelector_VSN(id, name); //加载型号
        	}
        });
    });
}

//加载TYPE
var initSelector_TYPE = function (id, name) {
	$('#TYPE').show();
	$('#selector_OEM').hide();
	$('#selector_BRD').hide();
	$('#divletter').hide();
	$('#selector_SUB_CAR').hide();
	$('#selector_TYPE').html('<label class="lbl_load">正在加载TYPE...</label>');
	$('#selector_TYPE').show();
	$('#selector_VSN').hide();
	ajax('PCCommon/GetTypeListwithsubcar', {
		subcarid: id
	}, function(result) {
		if (!result) return;
      	//console.log(JSON.stringify(result));
    	
    	var doc = $('#selector_TYPE');
    	var appendhtml = ''; 
    	for (var i = 0, j = result.length; i < j; i++) {
        	appendhtml += '<h3 style="padding: 5px 12px;" data-id="' + result[i].carid + '">' + result[i].car + '</h3>';
        	appendhtml += '<div><ul style="padding-left: ' + (g_setdata.multiselect ? '55' : '35') + 'px;">';
        	for (var k = 0, m = result[i].list.length; k < m; k++) {
        		appendhtml += '<li value="' + result[i].list[k].typeid + '"  data-isselect="' + (g_selectedids.contains(result[i].list[k].typeid.toString()) ? '1' : '0') + '">' 
        			+ (g_setdata.multiselect ? '<img src="../img/select_' + (g_selectedids.contains(result[i].list[k].typeid.toString()) ? 'on' : 'off') + '.png" />' : '') 
        			+ '<span>' + result[i].list[k].type + '</span>' 
	        		+ '<label class="br">' + result[i].list[k].price + '</label>'
        			+ '</li>';
        	}
        	appendhtml += '</ul></div>';
        }
        doc.html(appendhtml);
    	
        //添加品牌点击事件，跳转品牌对应车型列表
        $("#selector_TYPE div ul li").click(function(){
        	var id = this.value;
        	var name = $(this).children('span:first').html();
        	if (this.dataset.isselect == 0 && !g_selectedids.contains(id.toString())) {
				this.dataset.isselect = 1;
				g_selectedids.push(id.toString());
				g_setdata.selectedItem.push({"key": id, "value": name});
			} 
			else if (g_setdata.multiselect && this.dataset.isselect == 1 && g_selectedids.contains(id.toString())) {
				this.dataset.isselect = 0;
				for (var i = 0, j = g_selectedids.length; i < j; i++) {
					if (g_selectedids[i] == id.toString()) {
						g_selectedids.splice(i, 1);
						for (var m = g_setdata.selectedItem.length - 1; m >= 0; m--) {
							if (g_setdata.selectedItem[m].key.toString() == id.toString()) {
								g_setdata.selectedItem.splice(m, 1);
							}
						}
						break;
					}
				}
			}
			$(this).children('img:first').attr('src','../img/select_' + (this.dataset.isselect == 1 ? 'on' : 'off') + '.png'); 
			if (g_setdata.multiselect) $('#selector_ok').show();
			else commitselector();
        });
    });
}

//加载型号
var initSelector_VSN = function (id, name) {
	$('#VSN').show();
	$('#selector_OEM').hide();
	$('#selector_BRD').hide();
	$('#divletter').hide();
	$('#selector_SUB_CAR').hide();
	$('#selector_TYPE').hide();
	$('#selector_VSN').html('<label class="lbl_load">正在加载型号...</label>');
	$('#selector_VSN').show();
    g_vsntype = '在产';
    g_vsndata = null;
	ajax('PCCommon/GetVsnList', {
		subcarid: id
	}, function(result) {
		if (!result) return;
		g_vsndata = result;
      	//console.log(JSON.stringify(result));
      	
    	var doc = $('#selector_VSN');
    	doc.html('<h3 style="position: relative;" data-id="' + result.SUB_CAR_ID + '">'
				+ '<span class="subcar" style="margin-left: 10px;">' + result.BRD + ' ' + result.SUB_CAR + '</span>'
				+ '<label id="onvsn" class="active" style="right: 50px;">在产</label>'
				+ '<label id="offvsn">停产</label></h3>'
			+ '<div><ul id="vsnlist" style="position: relative; padding-left: ' + (g_setdata.multiselect ? '55' : '35') + 'px;"></ul></div>');
		
		bindvsn(); //绑定型号列表
		
		//型号选择页在产停产切换事件
        $('#selector_VSN h3 label').click(function(){        	
        	if (g_setdata.selecttype.toUpperCase() != "VSN") return;
        	var typename = $(this).html();
    		if (g_vsntype == typename) return;
        	$('#onvsn').removeClass("active");
        	$('#offvsn').removeClass("active");
            $(this).addClass("active");
            g_vsntype = typename;            
            bindvsn();
    	});
    });
}

//绑定型号列表
var bindvsn = function () {
	if (!g_vsndata) return;
	var vsnlist = (g_vsntype == "在产" ? g_vsndata.ONMKT : g_vsndata.OFFMKT);
	var doc = $('#vsnlist');
	var appendhtml = '';     	
	for (var i = 0, j = vsnlist.length; i < j; i++) {
    	appendhtml += '<li value="' + vsnlist[i].VSN_ID + '" data-isselect="' + (g_selectedids.contains(vsnlist[i].VSN_ID.toString()) ? '1' : '0') + '">'
    		+ (g_setdata.multiselect ? '<img src="../img/select_' + (g_selectedids.contains(vsnlist[i].VSN_ID.toString()) ? 'on' : 'off') + '.png" />' : '') 
    		+ '<span style="font-size: ' + (vsnlist[i].VSN.length > 30 ? '12' : '14') + 'px;">' + vsnlist[i].VSN + '</span>'
    		+ '<label class="mix">' + (vsnlist[i].MIX ?  (vsnlist[i].MIX*100.0).toFixed(1) + '' : '0.0') + '%</label>'
    		+ '<label class="msrp">' + (vsnlist[i].MSRP ? sliceDecimal(vsnlist[i].MSRP) : '-') + '</label>'
    		+ '<label class="tp">' + (vsnlist[i].TP ? sliceDecimal(vsnlist[i].TP) : '-') + '</label>'
    		+ '</li>';
    }
    doc.html(appendhtml);
    
	//添加品牌点击事件，跳转品牌对应车型列表
    $("#vsnlist li").click(function(){
    	var id = this.value;
    	var name = $(this).children('span:first').html();
    	if (this.dataset.isselect == 0 && !g_selectedids.contains(id.toString())) {
			this.dataset.isselect = 1;
			g_selectedids.push(id.toString());
			g_setdata.selectedItem.push({"key": id, "value": g_vsndata.BRD + ' ' + g_vsndata.SUB_CAR + ' ' + name});
		} 
		else if (g_setdata.multiselect && this.dataset.isselect == 1 && g_selectedids.contains(id.toString())) {
			this.dataset.isselect = 0;
			for (var i = 0, j = g_selectedids.length; i < j; i++) {
				if (g_selectedids[i] == id.toString()) {
					g_selectedids.splice(i, 1);
					for (var m = g_setdata.selectedItem.length - 1; m >= 0; m--) {
						if (g_setdata.selectedItem[m].key.toString() == id.toString()) {
							g_setdata.selectedItem.splice(m, 1);
						}
					}
					break;
				}
			}
		}
		$(this).children('img:first').attr('src','../img/select_' + (this.dataset.isselect == 1 ? 'on' : 'off') + '.png'); 
		if (g_setdata.multiselect) $('#selector_ok').show();
		else commitselector();
    });
}

//隐藏所有选择器容器
var hideAllContents = function () {
	//$('#OEM').hide();
	$('#BRD').hide();
	$('#SUB_CAR').hide();
	$('#TYPE').hide();
	$('#VSN').hide();
	$('#selector_OEM').hide();
	$('#selector_BRD').hide();
	$('#divletter').hide();
	$('#selector_SUB_CAR').hide();
	$('#selector_TYPE').hide();
	$('#selector_VSN').hide();
};

//执行ajax公共方法
var ajax = function (urlstring, data, success) {
	console.log(g_setdata)
	jQuery.support.cors = true;
	$.ajax({
        type: "get",
        async: true, //异步请求
        url: g_setdata.requrl + urlstring,
        data: data, //参数
        dataType: "json", 
        header: {
        	'content-type': 'application/json',
        	'userid': g_setdata.userid,
        	'sessionkey': g_setdata.sessionkey,
        },
        success: function (result) {
            success(result);
        }
   });
};

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

//千分位用逗号分隔
var sliceDecimal = function (num){
    if(num)
    {
        if(''==num || isNaN(num)){return 'Not a Number ! ';}
        num = num + '';
        var sign = num.indexOf('-')> 0 ? '-' : '';
        var cents = num.indexOf('.')> 0 ? num.substr(num.indexOf('.')) : '';
        cents = cents.length>1 ? cents : '' ;
        num = num.indexOf('.')>0 ? num.substring(0,(num.indexOf('.'))) : num ;
        if('' == cents){ if(num.length>1 && '0' == num.substr(0,1)){return 'Not a Number ! ';}}
        else{if(num.length>1 && '0' == num.substr(0,1)){return 'Not a Number ! ';}}
        for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
        {
            num = num.substring(0,num.length-(4*i+3))+','+num.substring(num.length-(4*i+3));
        }
        return (sign + num + cents);    
    }
};





















