var segment = 'B', bodytype = 'SUV', fueltype = 'BEV', datetype = new Date().getFullYear().toString();
var data_table_model = [];

bind_data_filter(); //绑定顶部筛选维度数据

//绑定顶部筛选维度数据
function bind_data_filter() {
	axios_F1('a_segment_forecast/get_filter_data', {}, 'get').then(response => {
		if (isNullOrEmpty(response.data) || isNullOrEmpty(response.data.Data) || response.data.StatusCode != 200) { layer.msg('error in data'); } else {
			var data_type_arrs = response.data.Data; //console.log('绑定顶部筛选维度数据', data_type_arrs);
			var html_select_segment = ``;
			data_type_arrs.segments.forEach(function(a,i){ html_select_segment += `<option value="${a}" ${a===segment?`selected`:``}>&nbsp;Segment:&nbsp;&nbsp;${a}</option>`; });
			$('#select-segment').html(html_select_segment); 
			var html_select_bodytype = ``;
			data_type_arrs.bodytypes.forEach(function(a,i){ html_select_bodytype += `<option value="${a}" ${a===bodytype?`selected`:``}>&nbsp;BodyType:&nbsp;&nbsp;${a}</option>`; });
			$('#select-bodytype').html(html_select_bodytype); 
			var html_select_fueltype = ``;
			data_type_arrs.fueltypes.forEach(function(a,i){ html_select_fueltype += `<option value="${a}" ${a===fueltype?`selected`:``}>&nbsp;FuelType:&nbsp;&nbsp;${a}</option>`; });
			$('#select-fueltype').html(html_select_fueltype); 
			var html_select_datetype = ``, html_select_datetype2 = ``;
			data_type_arrs.datetypes.forEach(function(a,i){ 
				if (i === 0) datetype = a.toString();
				html_select_datetype += `<span class="${a==datetype?`active`:``}">${a}</span>`; 
				html_select_datetype2 += `<option value="${a}" ${a===datetype?`selected`:``}>&nbsp;Year-YTD:&nbsp;&nbsp;${a}</option>`;
			});
			$('#select-year').html(html_select_datetype); $('#select-year2').html(html_select_datetype2);
			$('#table_rank thead th:nth-child(3)').text(data_type_arrs.lastmonth.indexOf('Dec') > -1 ? data_type_arrs.lastmonth.substring(0,4) + ' FY' : data_type_arrs.lastmonth);
			$('#table_rank thead th:nth-child(4)').text((parseInt(data_type_arrs.lastmonth.substring(0,4)) - 1).toString());
			bind_xfsc_models(); //绑定细分市场的车型排名表和气泡图
		}
	});
}

//绑定细分市场的车型排名表和气泡图
function bind_xfsc_models() {
	axios_F1('a_segment_forecast/get_xfsc_models_data', { segment, bodytype, fueltype, datetype }, 'get').then(response => {
		if (isNullOrEmpty(response.data) || isNullOrEmpty(response.data.Data) || response.data.StatusCode != 200) { layer.msg('error in data'); } else {
			data_table_model = response.data.Data; //console.log('绑定细分市场的车型排名表和气泡图', data_table_model);
			bind_ben_models(); //绑定细分市场本品车型指标卡
			bind_table_rank(); //绑定细分市场车型销量排名表格
			bind_chart_scatter(); //绑定细分市场车型气泡图表
		}
	});
}

//绑定细分市场本品车型指标卡
function bind_ben_models() {
	var html_ben_models = ``;
	var data_ben_models = data_table_model.filter(f => f.Legend.toUpperCase().trim() == 'VW');
	data_ben_models.forEach(function(a){ 
		let percent_text = '&nbsp;', percent_class = 'percent-rise', have_volumn = (a.IS_NEW == null && !isNullOrEmpty(a.Volumn));
		if (a.IS_NEW != null) percent_text = 'MS 0.0%';
		else if (!isNullOrEmpty(a.MS)) {
			percent_text = 'MS ' + toFloat2(a.MS);
			if (!isNullOrEmpty(a.LastMS)) {
				percent_text += (' ' + toFloat22(a.MS - a.LastMS).replace('+','↑').replace('-','↓'));
				if (a.MS < a.LastMS) percent_class = 'percent-fall';
			}
		}
		html_ben_models += `<div class="select-card"><div class="set-card">
			<h4>${a.Model}</h4>
			<h2><label class="${have_volumn?'counter':''}" data-counter-time="500" data-counter-delay="50">${have_volumn?(a.Volumn*1.0/1000).toFixed(1):'-'}</label>&nbsp;${have_volumn?'K':''}</h2>
			<span class="${percent_class}">${percent_text}</span>
		</div></div>`;
	});
	for (var i = 8 - data_ben_models.length; i > 0; i--) {
		html_ben_models += `<div class="select-card ${(data_ben_models.length<=4&&i<=4)?`null-card`:``}"><div class="set-card"><h4>&nbsp;</h4><h2>&nbsp;</h2><span class="percent-rise">&nbsp;</span></div></div>`;
	}
	$('#ben-models').html(html_ben_models); 
	$('#ben-models .counter').countUp(); //初始化数字动画
}

//绑定细分市场车型销量排名表格
function bind_table_rank() {
	var data_ben_models = data_table_model.filter(f => f.Rank > 15 && f.IS_NEW === null && f.MS != null && f.Legend.toUpperCase().trim() === 'VW');
	var data_table_rank = data_table_model.filter(f => f.Rank <= 15 && f.IS_NEW === null && f.MS != null);
	if (data_ben_models.length > 0) {
		let benlength = data_ben_models.length;
		data_table_rank = data_table_rank.concat(data_ben_models); 
		for (var i = data_table_rank.length - 1; i >= 0; i--) {
			if (data_table_rank[i].Legend.toUpperCase().trim() != 'VW' && benlength > 0) { data_table_rank.splice(i,1); benlength--; }
			if (benlength == 0) break;
		}
	}
	// console.log('绑定细分市场车型销量排名表格', data_table_rank);
	var html_table_rank = ``;
	data_table_rank.forEach(function(a,i){
		html_table_rank += `<tr>
			<td>${a.Rank}</td><td>${a.Model}</td>
			<td><div class="rankbar ${a.Legend.indexOf('Core')>-1?'corecomp':''}" data-value="${a.Volumn}">&nbsp;</div><span>${(a.Volumn*1.0/1000).toFixed(1)}</span></td>
			<td><img alt="" src="../img/${isNullOrEmpty(a.LastMS)?`arrow-star`:(toFloat2(a.MS)>=toFloat2(a.LastMS)?`arrow-up`:`arrow-down`)}.png" /><span>${toFloat2(a.MS)}</span></td>
			<td>${toFloat2(a.LastMS)}</td>
		</tr>`;
	});
	$('#table_rank tbody').html(html_table_rank); 
	bind_animate_rank(); //动态加载销量排名柱子
}

//绑定细分市场车型气泡图表
function bind_chart_scatter() {
	var legend = ['Comp.','Core Comp.','VW','New Model'], series = [];
	legend.forEach(function(a){
		let subseries = [], models = data_table_model.filter(f => f.Legend == a && !isNullOrEmpty(f.WTP2) && !isNullOrEmpty(f.LEN));
		models.forEach(function(b){
			subseries.push([b.LEN, b.WTP2, (isNullOrEmpty(b.Volumn) ? 10000 : b.Volumn), b.ShowName, a]);
		});
		series.push(subseries);
	});
	var data_chart_scatter = { title: '气泡图', xaxis: 'Length (mm)', yaxis: 'WTP2 in ’000 RMB', size: 'Volumn', legend, series, models: data_table_model };
	create_2_segment_forecast_2_echart_scatter('echart_scatter', data_chart_scatter);
}

//动态加载销量排名柱子
function bind_animate_rank() {
	var tabwidth = $('#table_rank').width(), ms_width = 0.7, font_size = 14;
	if (tabwidth < 500 && tabwidth >= 450) { ms_width = 0.6; font_size = 14; }
	if (tabwidth < 450 && tabwidth >= 400) { ms_width = 0.4; font_size = 13; }
	if (tabwidth < 400 && tabwidth >= 350) { ms_width = 0.2; font_size = 12; }
	if (tabwidth < 350) { ms_width = 0.1; font_size = 12; }
	$('#table_rank tbody tr td').css('font-size', font_size + 'px').find('.rankbar').css('height', font_size + 'px');
	var maxwidth = $('#table_rank tbody tr td:nth-child(3)').eq(0).width() * ms_width;
	var maxvalue = parseFloat($('#table_rank tbody .rankbar:first-child').attr('data-value'));
	$('#table_rank tbody .rankbar').each(function(){ $(this).animate({ width: (parseFloat($(this).attr('data-value')) * 1.0 / maxvalue * maxwidth + 1) + 'px' }, 500); });
}

//页面大小改变事件
var resizeTimer;
window.addEventListener("resize", function() { 
	clearTimeout(resizeTimer); // 清除之前的定时器
	resizeTimer = setTimeout(() => { 
		bind_animate_rank(); //动态加载销量排名柱子
	}, 200); 
});

//切换细分市场事件
$('#select-segment,#select-bodytype,#select-fueltype').on('change', function(){
	var select_id = $(this).attr('id');
	if (select_id === 'select-segment') segment = $(this).val();
	if (select_id === 'select-bodytype') bodytype = $(this).val();
	if (select_id === 'select-fueltype') fueltype = $(this).val();
    bind_xfsc_models(); //绑定细分市场的车型排名表和气泡图
});

//切换年份事件
$('#select-year').on('click','span',function(){
	if (datetype != $(this).text()) {
		$(this).addClass('active').siblings().removeClass('active');
		datetype = $(this).text();
		$('#select-year2').val(datetype).trigger('change');
	}
});

//切换年份事件
$('#select-year2').on('change', function(){
    datetype = $(this).val();
	$('#select-year span').removeClass('active');
	$(`#select-year span:contains('${datetype}')`).addClass('active');
	// if (datetype.length === 4) $(`#select-year span:contains('${datetype}')`).addClass('active');
	// else $(`#select-year span:first-child`).text(datetype).addClass('active');
    bind_xfsc_models(); //绑定细分市场的车型排名表和气泡图
});

{ //加载带单月的日期范围
	var gg = '加载带单月的日期范围';
	// //加载带单月的日期范围：HTML代码
	// <div class="hide" id="select-year3"><ul></ul></div>
	
	// //加载带单月的日期范围：CSS代码
	// #select-year span:first-child::after { content: '\e6a4'; font-family: 'iconfont-cz' !important; font-size: 16px; color: #FFFFFF; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); pointer-events: none; }
	// #select-year2 { display: none; min-width: 222px; }
	// #select-year3 { position: absolute; border: 1px solid #767676; min-width: 180px; background-color: #384153; padding: 0; z-index: 1000; }
	// #select-year3 ul { list-style: none; padding: 0; }
	// #select-year3 li { padding-left: 8px; font-size: 1.1rem; font-family: VWTextOffice_Bold; cursor: pointer; }
	// #select-year3 li:hover, #select-year3 .active { background-color: #1E90FF; }
	
	// //加载带单月的日期范围：JS代码 - 初始加载
	// var html_select_year = ``, html_select_year2 = ``, html_select_year3 = ``;
	// if (!isNullOrEmpty(data_type_arrs.months)) datetype = data_type_arrs.months[0];
	// data_type_arrs.years.forEach(function(a,i){ 
	// 	let havemonth = (parseInt(datetype.substring(0,4)) === a);
	// 	html_select_year += `<span class="${havemonth?`active`:``}" style="${havemonth?`padding-right: 36px;`:``}">${havemonth?datetype:a}</span>`; 
	// 	if (havemonth) { 
	// 		data_type_arrs.months.forEach(function(b){ 
	// 			html_select_year2 += `<option value="${b}" ${b===datetype?`selected`:``}>&nbsp;${b.indexOf('YTD') != -1 ? `Year-YTD` : `YearMonth`}:&nbsp;&nbsp;${b}</option>`; 
	// 			html_select_year3 += `<li data-value="${b}">${b}</li>`; 
	// 		}); 
	// 	} else html_select_year2 += `<option value="${a}">&nbsp;Year-YTD:&nbsp;&nbsp;${a}</option>`;
	// });
	// $('#select-year').html(html_select_year); $('#select-year2').html(html_select_year2);  $('#select-year3 ul').html(html_select_year3);
	
	// //加载带单月的日期范围：JS代码 - 事件管理
	// //鼠标悬浮显示悬浮层
	// $('#select-year span:first-child').hover(function(){
	// 	$(`#select-year3 li:contains('${$(this).text()}')`).addClass('active').siblings().removeClass('active');
	// 	$('#select-year3').css({ left: $(this).offset().left - 8, top: $(this).offset().top + $(this).height() + 1 }).removeClass('hide');
	// }, function(){ $('#select-year3').addClass('hide'); });
	// //鼠标移入悬浮层区域时，防止隐藏
	// $('#select-year3').hover(function(){ $(this).removeClass('hide'); }, function(){ $(this).addClass('hide'); });
	// //点击悬浮层中的选项
	// $('#select-year3 li').hover(function(){ $(this).addClass('active').siblings().removeClass('active'); });
	// $('#select-year3 li').click(function(){
	// 	var selectedValue = $(this).data('value');
	// 	$('#select-year3').addClass('hide');
	// 	$('#select-year span:first-child').text(selectedValue);
	// 	$('#select-year span:first-child').trigger('click');
	// });
}


