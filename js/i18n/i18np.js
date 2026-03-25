layui.define(function(exports) {

	"use strict";
	var i18np = {};
	i18np.loadProperties = function() {
		var _lanpath = localStorage.getItem(g_accr_language_path);
		var _lantype = localStorage.getItem(g_accr_language_type);
		console.log('langpath', (_lanpath ? _lanpath : '') + 'js/i18n/bundle')
		console.log('language',  (_lantype ? _lantype : (g_language_type ? g_language_type : 'en')));
		//jQuery.i18n.properties实现的原理就是，根据name后面的值，加上浏览器的语言简码，再加上.properties找到对应的资源文件。
		//这个过程是自动的，只需要进行下面的配置即可。
		$.i18n.properties({
			name: 'Message', //属性文件名     命名格式： 文件名_国家代号.properties
			path: (_lanpath ? _lanpath : '') + 'js/i18n/bundle', //注意这里路径是你属性文件的所在文件夹
			mode: 'map',
			language: (_lantype ? _lantype : (g_language_type ? g_language_type : 'en')), //这就是国家代号 name+language刚好组成属性文件名：strings+zh -> strings_zh.properties
			callback: function() {
				try {
					//初始化页面元素
					$('[data-i18n-placeholder]').each(function() {
						$(this).attr('placeholder', i18np.prop($(this).data('i18n-placeholder')));
					});
					$('[data-i18n-text]').each(function() {
						//如果text里面还有html需要过滤掉
						var html = $(this).html();
						var reg = /<(.*)>/;
						if (reg.test(html)) {
							var htmlValue = reg.exec(html)[0];
							$(this).html(htmlValue + i18np.prop($(this).data('i18n-text')));
						} else {
							// $(this).text($.i18n.prop($(this).data('i18n-text')));
							$(this).text(i18np.prop($(this).data('i18n-text')));
						}
					});
					$('[data-i18n-value]').each(function() {
						$(this).val(i18np.prop($(this).data('i18n-value')));
					});
					$('[data-i18n-title]').each(function() {
						$(this).val(i18np.prop($(this).data('i18n-title')));
					});
				} catch (ex) {
					console.log('语言设置异常', ex)
				}
			}
		});
	};

	i18np.prop = function(i18nKey) {
		try {
			return $.i18n.prop(i18nKey);
		} catch (ex) {
			return i18nKey.replace('Web22-','');
		}
	};

	exports("i18np", i18np);
});

//------------------------------更新语言版本功能方法------------------------------

function g_initlang(path) {
	localStorage.setItem(g_accr_language_path, (path ? path : ''));
	var _lantype = localStorage.getItem(g_accr_language_type);
	if (_lantype == null) localStorage.setItem(g_accr_language_type, (g_language_type ? g_language_type : 'en')); //初始设定语言版本 英文:en | 中文:zh
	g_loadlang(); //更新当前页面语言版本内容
}

function g_loadlang() {
	layui.use(["i18np"], function() {
		var i18np = layui.i18np;
		g_loadi18n();
		i18np.loadProperties();
	});
}

function g_loadi18n() {
	var text = $("#languageStatus").text();
	if (localStorage.getItem(g_accr_language_type) == "zh") text = "中文";
	else if (localStorage.getItem(g_accr_language_type) == "en") text = "English";
	$("#languageStatus").text(text);
}

function g_loadsucai_title(title) {
	if (localStorage.getItem(g_accr_language_type) == "zh") {
		title = title.replace('Repository', '资源库').replace('Chart Tools', '资源库');
		title = title.replace('Console', '工作台').replace('Platform', '工作台');
		title = title.replace('Generate Report', '生成报告');
	}
	return title;
}
