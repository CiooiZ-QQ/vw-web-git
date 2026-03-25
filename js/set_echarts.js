
//定义各类型图表颜色数组
var color_bar_Arr = ["#586770","#00B0F0"];
var color_fueltype_Arr = ['#cfd4da','#99d1cd','#007770','transparent']; //分别代表：ICE、PHEV、BEV、ALL
var color_line_Arr= ['#C2FE06', '#27ae60', '#0082D6', '#f39c12', '#2c3e50', '#8e44ad', '#d35400', '#c0392b','#bdc3c7', '#7f8c8d', '#C0C5CB'];
//随机生成颜色方法
const createColor = function () {
    var r = Math.floor(Math.random() * 256); //随机生成256以内r值
    var g = Math.floor(Math.random() * 256); //随机生成256以内g值
    var b = Math.floor(Math.random() * 256); //随机生成256以内b值
    return `rgb(${r},${g},${b})`; //返回rgb(r,g,b)格式颜色
};
//补充颜色数组不少于30项
for (let i = 0; i < 30; i++) {
	color_bar_Arr.push(createColor());
	color_line_Arr.push(createColor());
};

// 创建防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//home功能echart_bar柱状图
function create_2_home_2_echart_bar(id = 'echart_bar', data, myChart = null){
	// debugger;
	// console.log('home功能echart_bar柱状图：', id, data, myChart);
	if (isNullOrEmpty(data)) return;
	if (myChart == null) myChart = echarts.init(document.getElementById(id));
	myChart.setOption({}, true); myChart.resize();
	
	var series = [];
	for (let i = 0; i < data.series.length; i++) {
		series.push({
			type: 'bar', barWidth: '30%', barMaxWidth: 50, barGap: '0',
			name: data.legend[i], data: data.series[i],
			label: { 
				show: true, position: 'top', 
				color: '#fff', fontSize: 14, fontFamily: 'VWTextOffice_Regular', 
				formatter: function(data) { return toFloat2(data.value); } 
			},
			emphasis: { focus: 'series' }
		});
	};
	
	var option = {
		color: color_bar_Arr,
		legend: {
			show: true, data: data.legend, top: 8, left: 0, itemGap: 16,
			textStyle: { color: '#ccc', fontSize: 14, fontFamily: 'VWTextOffice_Regular' }, 
			pageIconSize: 14, itemHeight: 8, itemWidth: 20
		},
		grid: { left: 0, right: 0, top: 0, bottom: 0, containLabel: true },
		xAxis: {
			data: data.xaxis, axisTick: { show: false }, //x轴刻度线
			axisLabel: {
			    interval: 0, align: 'center', lineHeight: 18, color: '#ccc', fontFamily: 'VWTextOffice_Regular', 
			    formatter: function(value) { return value.substring(0,value.lastIndexOf(' ')) + '\n' + value.substring(value.lastIndexOf(' ') + 1); }
			}
		},
		yAxis: { show: false, axisLabel: { show: false } },
		series
	};
		
	myChart.setOption(option, true);
	// window.addEventListener("resize", function() { setTimeout(() => { if(myChart) myChart.resize(); }, 300); });
	var resizeObserver = new ResizeObserver(debounce(function(entries) { entries.forEach(entry => { if (myChart) { myChart.setOption(option, true); myChart.resize(); } }); }, 300));
	resizeObserver.observe(document.getElementById(id)); //拖拽改变图表容器大小时刷新图表
}


//a-nev-market功能echart_left柱状图
function create_2_nev_market_2_echart_left(id = 'echart_left', data, datatype, myChart = null){
	// debugger;
	// console.log('a-nev-market功能echart_left柱状图：', id, data, datatype, myChart);
	if (isNullOrEmpty(data)) return;
	if (myChart == null) myChart = echarts.init(document.getElementById(id));
	myChart.setOption({}, true); myChart.resize();
	
	var series = [], max_val = 0, isbigsize = ($('#'+id).width() >= 600);
	if (datatype.endsWith('ALL')) {
		data.legend.forEach(function(a,i){
			let istotal = (a.toUpperCase() === 'TOTAL'), color = color_fueltype_Arr[i];
			color = (a.toUpperCase() === 'ICE' ? color_fueltype_Arr[0] : (a.toUpperCase() === 'PHEV' ? color_fueltype_Arr[1] : (a.toUpperCase() === 'BEV' ? color_fueltype_Arr[2] : 'transparent')));
			series.push({
				type: 'bar', barWidth: '50%', barMaxWidth: 80, barGap: '-100%', stack: (istotal ? '' : 'show'), 
				name: a, data: data.share[i],
				label: { 
					show: true, position: (istotal ? 'top' : 'inside'), color: (istotal || a.toUpperCase() === 'BEV' ? '#FFFFFF' : '#000000'), 
					fontSize: (isbigsize ? 16 : 14), fontFamily: 'VWTextOffice_Bold', lineHeight: 20, 
					formatter: function(params) { return params.value >= 0.08 ? (fprice(data.sales[params.seriesIndex][params.dataIndex].toFixed(0)) + (istotal ? '' : '\n(' + toFloat2(params.value,0) + ')')) : ''; } 
				},
				itemStyle: { 
					color, borderColor: '#000000', borderWidth: 0.0, 
					shadowColor: 'rgba(255,255,255,0.1)', shadowBlur: 10, shadowOffsetY: 5 ,
				}, 
				emphasis: { focus: 'series' }, zlevel: (istotal ? 2 : 3)
			});
		});
		data.legend.filter(f => f.toUpperCase() != 'TOTAL').forEach(function(a,i){
			let ser_hide_data = [];
			data.share[i].forEach(function(b,j){ if (j === 0) { ser_hide_data.push(b); } else { ser_hide_data.push(null); } });
			series.push({
				type: 'bar', barWidth: '50%', barMaxWidth: 80, barGap: '-100%', stack: 'hide', 
				name: a, data: ser_hide_data,
				label: { 
					show: true, position: 'left', color: '#FFFFFF', 
					fontSize: (isbigsize ? 16 : 14), fontFamily: 'VWTextOffice_Bold',
					formatter: function(params) { return a + '   '; }
				},
				itemStyle: { color: 'transparent' }, zlevel: 1
			});
		});
	} else {
		max_val = Math.max.apply(Math, data.sales[0]);
		series.push({
			type: 'bar', barWidth: '50%', barMaxWidth: 80, 
			name: data.legend[0], data: data.sales[0],
			label: { 
				show: true, position: 'top', color: '#FFFFFF', 
				fontSize: (isbigsize ? 16 : 14), fontFamily: 'VWTextOffice_Bold', lineHeight: 20, 
				formatter: function(params) { return fprice(data.sales[0][params.dataIndex].toFixed(0)); } 
			},
			itemStyle: { 
				color: (datatype.endsWith('PHEV') ? color_fueltype_Arr[1] : color_fueltype_Arr[2]), borderColor: '#000000', borderWidth: 0.5, 
				shadowColor: 'rgba(255,255,255,0.1)', shadowBlur: 10, shadowOffsetY: 5 ,
			}, 
			emphasis: { focus: 'series' }, zlevel: 3
		});
	}
	
	var this_y_val = 0;
	var option = {
		legend: {
			show: false, data: (datatype.endsWith('ALL') ? data.legend.slice(0, -1) : data.legend), top: 0, left: 'center', itemGap: 16, 
			textStyle: { color: '#FFFFFF', fontSize: 14, fontFamily: 'VWTextOffice_Bold' }, 
			pageIconSize: 14, itemHeight: 8, itemWidth: 20
		},
		grid: { left: 30, right: 0, top: 0, bottom: 0, containLabel: true },
		tooltip: {
		    trigger: (datatype.endsWith('ALL') ? 'axis' : 'item'), confine: true, //是否将 tooltip 框限制在图表的区域内  trigger: axis、item、none
			extraCssText: 'box-shadow: 0 0 12px rgba(100,100,100,0.6)', // 额外附加到浮层的 css 样式
			backgroundColor: 'rgba(30,30,30,0.95)', borderColor: 'rgba(30,30,30,0.95)',
			textStyle: { color: '#eee', fontWeight: 400, fontSize: 13, fontFamily: 'VWTextOffice_Regular' }, padding: [10, 18],
			axisPointer: {
			   type: "cross", crossStyle: { opacity: 0 },
			   label: { show:false, formatter: function (params) { if (params.seriesData.length === 0) this_y_val = params.value; } }
		    },
			formatter: function(params) { //console.log(111111, params);
				if (datatype.endsWith('ALL')) {
					var html = '', num = 0, b = true;
					params.filter(f => f.seriesName.toUpperCase() != 'TOTAL' && f.color != 'transparent').forEach(function(a) {
						num += a.value; let active = '';
						if (num > this_y_val && b) { active = 'active'; b = false }
						html = `<p class="${active}"><span>${a.marker}<span class="seriesname">${a.seriesName}&nbsp;:&nbsp;</span></span>
							<span>${isNullOrEmpty(a.value) ? '-' : fprice(data.sales[a.seriesIndex][a.dataIndex].toFixed(0)) + ' (' + toFloat2(a.value) + ')'}</span></p>` + html;
					});
					return '<h3 class="tooltip-title">' + datatype.replace('ALL','').trim() + ' - ' + params[0].axisValue + '</h3><div class="tooltip-content">' + html + '</div>';
				} else {
					var html = `<p style="justify-content: flex-start; color: #fff;"><span class="seriesname">Sales Volume&nbsp;:&nbsp;</span><span>${fprice(data.sales[0][params.dataIndex].toFixed(0))}</span></p>
								<p style="justify-content: flex-start; color: #fff;"><span class="seriesname">%Sales Volume&nbsp;:&nbsp;</span><span>${toFloat2(data.share[0][params.dataIndex])}</span></p>`;
					if (data.brands.length > 0) {
						var brands = data.brands.filter(f => f.xaxis === params.name);
						html += `<h3>Top 5 Brands</h3><table><thead><th width="50">Rank</th><th width="120">Brand</th><th width="80">Volumn (k)</th><th width="80">M.S.</th></thead><tbody>`;
						brands.forEach(function(a){ html += `<tr class="${['VW','Jetta'].indexOf(a.name)>-1?'isben':''}"><td>${a.rank}</td><td>${a.name}</td><td>${fprice(a.volumn.toFixed(1))}</td><td>${toFloat2(a.ms)}</td></tr>`; });
						html += `</tbody></table>`;
					}
					if (data.models.length > 0) {
						var models = data.models.filter(f => f.xaxis === params.name);
						html += `<h3>Top 5 Models</h3><table><thead><th width="50">Rank</th><th width="120">Model</th><th width="80">Volumn (k)</th><th width="80">M.S.</th></thead><tbody>`;
						models.forEach(function(a){ html += `<tr><td>${a.rank}</td><td>${a.name}</td><td>${fprice(a.volumn.toFixed(1))}</td><td>${toFloat2(a.ms)}</td></tr>`; });
						html += `</tbody></table>`;
					}
					return '<h3 class="tooltip-title">' + datatype.replace('ALL','').trim() + ' - ' + params.name + '</h3><div class="tooltip-content">' + html + '</div>';
				}
			}
		},
		xAxis: {
			data: data.xaxis, axisTick: { show: false }, axisLine: { lineStyle: { color: '#FFFFFF' } }, 
			axisLabel: { interval: 0, align: 'center', color: '#FFFFFF', fontSize: (isbigsize ? 16 : 14), fontFamily: 'VWTextOffice_Bold' },
			zlevel: 3
		},
		yAxis: { show: false, axisLabel: { show: false }, min: 0.0, max: (datatype.endsWith('ALL') ? 1.05 : max_val * 1.05) },
		series
	};
		
	myChart.setOption(option, true);
	// window.addEventListener("resize", function() { setTimeout(() => { if(myChart) {
	// 	var isbigsize = ($('#'+id).width() >= 600);
	// 	option.xAxis.axisLabel.fontSize = (isbigsize ? 16 : 14);
	// 	option.series.forEach(function(a){ a.label.fontSize = (isbigsize ? 16 : 14); });
	// 	myChart.setOption(option, true); 
	// 	myChart.resize(); 
	// } }, 300); });
	var resizeObserver = new ResizeObserver(debounce(function(entries) { entries.forEach(entry => { if (myChart) { 
		var isbigsize = ($('#'+id).width() >= 600);
		option.xAxis.axisLabel.fontSize = (isbigsize ? 16 : 14);
		option.series.forEach(function(a){ a.label.fontSize = (isbigsize ? 16 : 14); });
		myChart.setOption(option, true); 
		myChart.resize(); 
	} }); }, 300));
	resizeObserver.observe(document.getElementById(id)); //拖拽改变图表容器大小时刷新图表
}


//a-nev-market功能echart_right柱状图
function create_2_nev_market_2_echart_right(id = 'echart_right', data, datatype, myChart = null){
	// debugger;
	// console.log('a-nev-market功能echart_right柱状图：', id, data, datatype, myChart);
	if (isNullOrEmpty(data)) return;
	if (myChart == null) myChart = echarts.init(document.getElementById(id));
	myChart.setOption({}, true); myChart.resize();
	
	var series = [], isbigsize = ($('#'+id).width() >= 600);
	data.legend.forEach(function(a,i){
		let istotal = (a.toUpperCase() === 'TOTAL'), is_vw = (!isNullOrEmpty(data.legend_vw) && data.legend_vw.indexOf(a) > -1);
		series.push({
			type: 'bar', barWidth: '50%', barMaxWidth: 80, barGap: '-100%', stack: (istotal ? '' : 'show'), 
			name: a, data: data.share[i],
			label: { 
				show: true, position: (istotal ? 'top' : 'inside'), color: ((datatype.endsWith('ALL') || !is_vw) ? '#FFFFFF' : '#000000'), 
				fontSize: (isbigsize ? 16 : 14), fontFamily: 'VWTextOffice_Bold', lineHeight: 20, 
				formatter: function(params) { return params.value >= 0.08 ? (fprice(data.sales[params.seriesIndex][params.dataIndex].toFixed(0)) + (istotal ? '' : '\n(' + toFloat2(params.value,0) + ')')) : ''; } 
			},
			itemStyle: { 
				color: (datatype.endsWith('ALL') ? '#364D6E' : (is_vw ? '#C2FE06' : '#1A1A2E')), borderColor: '#FFFFFF', borderWidth: 0.5, 
				shadowColor: 'rgba(255,255,255,0.1)', shadowBlur: 10, shadowOffsetY: 5 
			}, 
			emphasis: { focus: 'series' }, zlevel: (istotal ? 2 : 3)
		});
	});
	data.legend.filter(f => f.toUpperCase() != 'TOTAL').forEach(function(a,i){
		let ser_hide_data = [];
		data.share[i].forEach(function(b,j){ if (j === 0) { ser_hide_data.push(b); } else { ser_hide_data.push(null); } });
		series.push({
			type: 'bar', barWidth: '50%', barMaxWidth: 80, barGap: '-100%', stack: 'hide', 
			name: a, data: ser_hide_data,
			label: { 
				show: (data.share[i][0] > 0.01), position: 'left', color: '#FFFFFF', 
				fontSize: (isbigsize ? 16 : 14), fontFamily: 'VWTextOffice_Bold',
				formatter: function(params) { return a + '   '; }
			},
			itemStyle: { color: 'transparent' }, zlevel: 1
		});
	});
	
	var this_y_val = 0;
	var option = {
		legend: {
			show: false, data: data.legend.slice(0, -1), top: 0, left: 'center', itemGap: 16, 
			textStyle: { color: '#FFFFFF', fontSize: 14, fontFamily: 'VWTextOffice_Bold' }, 
			pageIconSize: 14, itemHeight: 8, itemWidth: 8, type: 'scroll'
		},
		grid: { left: (isbigsize ? 72 : 60), right: 0, top: 0, bottom: 0, containLabel: true },
		tooltip: {
		    trigger: 'axis', confine: true, //是否将 tooltip 框限制在图表的区域内 
			extraCssText: 'box-shadow: 0 0 12px rgba(100,100,100,0.6)', // 额外附加到浮层的 css 样式
			backgroundColor: 'rgba(30,30,30,0.95)', borderColor: 'rgba(30,30,30,0.95)',
			textStyle: { color: '#eee', fontWeight: 400, fontSize: 13, fontFamily: 'VWTextOffice_Regular' }, padding: [10, 18],
			axisPointer: {
			   type: "cross", crossStyle: { opacity: 0 },
			   label: { show:false, formatter: function (params) { if (params.seriesData.length === 0) this_y_val = params.value; } }
		    },
			formatter: function(params) { //console.log(111111, params);
				var html = '', num = 0, b = true;
				params.filter(f => f.seriesName.toUpperCase() != 'TOTAL' && f.color != 'transparent').forEach(function(a) {
					if (!isNullOrEmpty(a.value)) { num += a.value; } let active = '';
					if (num > this_y_val && b) { active = 'active'; b = false }
					html = `<p class="${active}"><span>${a.marker.replace('"></span>','border:1px solid #FFFFFF;"></span>')}<span class="seriesname">${a.seriesName}&nbsp;:&nbsp;</span></span>
						<span>${isNullOrEmpty(a.value) ? '-' : fprice(data.sales[a.seriesIndex][a.dataIndex].toFixed(1)) + ' (' + toFloat2(a.value) + ')'}</span></p>` + html;
				});
				return '<h3 class="tooltip-title">' + datatype.replace('ALL','').trim() + ' - ' + params[0].axisValue + '</h3><div class="tooltip-content">' + html + '</div>';
			}
		},
		xAxis: {
			data: data.xaxis, axisTick: { show: false }, axisLine: { lineStyle: { color: '#FFFFFF' } }, 
			axisLabel: { interval: 0, align: 'center', color: '#FFFFFF', fontSize: (isbigsize ? 16 : 14), fontFamily: 'VWTextOffice_Bold' },
			zlevel: 3
		},
		yAxis: { show: false, axisLabel: { show: false }, min: 0.0, max: 1.05 },
		series
	};
		
	myChart.setOption(option, true);
	// window.addEventListener("resize", function() { setTimeout(() => { if(myChart) {
	// 	var isbigsize = ($('#'+id).width() >= 600);
	// 	option.grid.left = (isbigsize ? 72 : 60);
	// 	option.xAxis.axisLabel.fontSize = (isbigsize ? 16 : 14);
	// 	option.series.forEach(function(a){ a.label.fontSize = (isbigsize ? 16 : 14); });
	// 	myChart.setOption(option, true); 
	// 	myChart.resize(); 
	// } }, 300); });
	var resizeObserver = new ResizeObserver(debounce(function(entries) { entries.forEach(entry => { if (myChart) { 
		var isbigsize = ($('#'+id).width() >= 600);
		option.grid.left = (isbigsize ? 72 : 60);
		option.xAxis.axisLabel.fontSize = (isbigsize ? 16 : 14);
		option.series.forEach(function(a){ a.label.fontSize = (isbigsize ? 16 : 14); });
		myChart.setOption(option, true); 
		myChart.resize(); 
	} }); }, 300));
	resizeObserver.observe(document.getElementById(id)); //拖拽改变图表容器大小时刷新图表
}


//a-vw-planning功能echart_bar_line柱状折线图
function create_2_vw_planning_2_echart_bar_line(id = 'chart_bar_line', data, datatype, myChart = null){
	// debugger;
	// console.log('a-vw-planning功能echart_bar_line柱状折线图：', id, data, datatype, myChart);
	if (isNullOrEmpty(data)) return;
	if (myChart == null) myChart = echarts.init(document.getElementById(id));
	myChart.setOption({}, true); myChart.resize();
	
	var series = [], max_val = 0, isbigsize = ($('#'+id).width() >= 600);
	data.legend.forEach(function(a,i){
		let val = Math.max.apply(Math, data.share[i]); if (val > max_val) max_val = val;
		let istotal = (a.toUpperCase() === 'TOTAL');
		series.push({
			type: 'bar', barWidth: '50%', barMaxWidth: 80, barGap: '-100%', stack: (istotal ? '' : 'show'), 
			name: a, data: data.share[i],
			label: { 
				show: true, position: (istotal ? 'top' : 'inside'), color: (istotal || a.toUpperCase() === 'BEV' ? '#FFFFFF' : '#000000'), 
				fontSize: (isbigsize ? 16 : 14), fontFamily: 'VWTextOffice_Bold', lineHeight: 16, 
				padding: 2, backgroundColor: color_fueltype_Arr[i], //offset: [(i === 1 ? 20 : (i === 2 ? -20 : 0)), 0], 
				// formatter: function(params) { return (istotal ? fprice(data.sales[params.seriesIndex][params.dataIndex].toFixed(0)) : toFloat2(params.value,1)); } 
				formatter: function(params) { return fprice(data.sales[params.seriesIndex][params.dataIndex].toFixed(0)) + (istotal ? '' : ' (' + toFloat2(params.value,0) + ')'); } 
			},
			itemStyle: { 
				color: color_fueltype_Arr[i], borderColor: '#000000', borderWidth: 0.0, 
				shadowColor: 'rgba(255,255,255,0.1)', shadowBlur: 10, shadowOffsetY: 5 ,
			}, 
			emphasis: { focus: 'series' }, zlevel: (istotal ? 2 : 3)
		});
	});
	
	var hide_data = [], min_num = data.share[data.share.length - 1][0] * 1.0 / 5;
	data.legend.filter(f => f.toUpperCase() != 'TOTAL').forEach(function(a,i){
		let ser_hide_data = [];
		data.share[i].forEach(function(b,j){ if (j === 0) { ser_hide_data.push(b); } else { ser_hide_data.push(null); } });
		if (i % 2 != 0 && ser_hide_data[0] < min_num) { let diff_val = min_num - ser_hide_data[0]; ser_hide_data[0] = min_num; hide_data[i - 1][0] = hide_data[i - 1][0] - diff_val; }
		hide_data.push(ser_hide_data);
	}); //这段处理是为了避免值太小导致文字重叠
	data.legend.filter(f => f.toUpperCase() != 'TOTAL').forEach(function(a,i){
		series.push({
			type: 'bar', barWidth: '50%', barMaxWidth: 80, barGap: '-100%', stack: 'hide', 
			name: a, data: hide_data[i],
			label: { 
				show: true, position: 'left', color: '#FFFFFF', 
				fontSize: (isbigsize ? 16 : 14), fontFamily: 'VWTextOffice_Bold',
				formatter: function(params) { return 'VW ' + a + '   '; }
				// formatter: function(params) { return segment + ' ' + bodytype + ' ' + a + '   '; }
			},
			itemStyle: { color: 'transparent' }, zlevel: 1
		});
	});
	
	var max_val2 = 0.0, color_index = 0;
	data.brand.forEach(function(a,i){
		let val = Math.max.apply(Math, data.brandms[i]); if (val > max_val2) max_val2 = val;
		if (a.toUpperCase() != 'VW') color_index++;
		let color = (a.toUpperCase() === 'VW' ? color_line_Arr[0] : color_line_Arr[color_index]);
		series.push({
			type: 'line', yAxisIndex: 1, smooth: false, 
			name: a, data: data.brandms[i], symbol: 'circle', symbolSize: 4,
			label: { 
				show: true, position: 'top', color, 
				fontSize: (isbigsize ? 16 : 14), fontFamily: 'VWTextOffice_Regular', distance: 0, 
				formatter: function(params) { return toFloat2(params.value); } 
			},
			itemStyle: { color, borderColor: '#1C273B', borderWidth: 8, borderType‌: 'solid' },
			lineStyle: { color, width: 2 }, 
			emphasis: { focus: 'series' }, zlevel: 5
		});
		let ser_hide_data = [];
		data.brandms[i].forEach(function(b,j){ if (j === 0) { ser_hide_data.push(b); } else { ser_hide_data.push(null); } });
		series.push({
			type: 'line', yAxisIndex: 1, smooth: false, 
			name: a, data: ser_hide_data, symbol: 'circle', symbolSize: 0, 
			label: { 
				show: true, position: 'left', color, 
				fontSize: (isbigsize ? 16 : 14), fontFamily: 'VWTextOffice_Bold', distance: 50, 
				formatter: function(params) { return params.seriesName; }
			},
			itemStyle: { color: 'transparent' }, lineStyle: { color: 'transparent' }, zlevel: 4
		});
	});
	
	var this_y_val = 0;
	var option = {
		legend: {
			show: false, data: data.brand, top: 0, left: 'center', itemGap: 16, 
			textStyle: { color: '#FFFFFF', fontSize: 14, fontFamily: 'VWTextOffice_Bold' }, 
			pageIconSize: 14, itemHeight: 8, itemWidth: 20
		},
		grid: { left: '16.67%', right: 0, top: 0, bottom: 0, containLabel: true },
		xAxis: {
			data: data.xaxis, axisTick: { show: false }, axisLine: { lineStyle: { color: '#FFFFFF' } }, 
			axisLabel: { interval: 0, align: 'center', color: '#FFFFFF', fontSize: (isbigsize ? 16 : 14), fontFamily: 'VWTextOffice_Bold' },
			zlevel: 3
		},
		yAxis: [
			{ show: false, axisLabel: { show: false }, min: 0.0, max: max_val * 2 },
			{ show: false, axisLabel: { show: false }, min: -max_val2 * 0.9, max: max_val2 * 1.2 }
		],
		series
	};
		
	myChart.setOption(option, true);
	// window.addEventListener("resize", function() { setTimeout(() => { if(myChart) {
	// 	var isbigsize = ($('#'+id).width() >= 600);
	// 	option.xAxis.axisLabel.fontSize = (isbigsize ? 16 : 14);
	// 	option.series.forEach(function(a){ a.label.fontSize = (isbigsize ? 16 : 14); });
	// 	myChart.setOption(option, true); 
	// 	myChart.resize(); 
	// } }, 300); });
	var resizeObserver = new ResizeObserver(debounce(function(entries) { entries.forEach(entry => { if (myChart) { 
		var isbigsize = ($('#'+id).width() >= 600);
		option.xAxis.axisLabel.fontSize = (isbigsize ? 16 : 14);
		option.series.forEach(function(a){ a.label.fontSize = (isbigsize ? 16 : 14); });
		myChart.setOption(option, true); 
		myChart.resize(); 
	} }); }, 300));
	resizeObserver.observe(document.getElementById(id)); //拖拽改变图表容器大小时刷新图表
}


//a-segment-forecast功能echart_scatter气泡图
function create_2_segment_forecast_2_echart_scatter(id = 'echart_scatter', data, myChart = null){
	// debugger;
	// console.log('a-segment-forecast功能echart_scatter气泡图：', id, data, myChart);
	if (isNullOrEmpty(data)) return;
	if (myChart == null) myChart = echarts.init(document.getElementById(id));
	myChart.setOption({}, true); myChart.resize();
	
	var xfsc = segment + ' ' + bodytype + ' ' + fueltype; 
	var min_xaxis = 9999, max_xaxis = 0.0, min_yaxis = 9999, max_yaxis = 0.0, max_size = 0.0, p = 1.0;
	data.series.forEach(function(model){
		model.forEach(function(a,i){
			if (!isNaN(a[0]) && a[0] < min_xaxis) min_xaxis = a[0]; if (!isNaN(a[0]) && a[0] > max_xaxis) max_xaxis = a[0];
			if (!isNaN(a[1]) && a[1] < min_yaxis) min_yaxis = a[1]; if (!isNaN(a[1]) && a[1] > max_yaxis) max_yaxis = a[1];
			if (!isNaN(a[2]) && a[2] > max_size) max_size = a[2];
		});
	});
	max_size = Math.sqrt(max_size); p = (xfsc === 'A SUV BEV' ? 50 : 66) * 1.0 / max_size;
	
	//添加极限气泡进行扩容，避免气泡超出图表区域
	(data.legend).forEach(function(a,i){ 
		data.series[i].push([min_xaxis - (xfsc === 'A SUV BEV' ? 10 : 0), min_yaxis - (xfsc === 'A SUV PHEV' ? 10 : 0), 0, '', data.legend[i]]); 
		data.series[i].push([max_xaxis + 50, max_yaxis + 20, 0, '', data.legend[i]]); 
	});
	
	var series = [], color_scatter_Arr = ['#A9E3FF','#FFC000','#0082D6','#FFC000'];;
	(data.legend).forEach(function(a,i){
		if (a != 'New Model') {
			(data.series[i]).forEach(function(b){
				let scatter_size = Math.sqrt(b[2]) * p; if (a === 'VW' && data[2] === 10000) scatter_size = 20;
				if (scatter_size < 5 && scatter_size > 0) scatter_size = 5; //设置最小Size
				let have_mkt_date = (b[3].indexOf('(') != -1 && b[3].indexOf('/') != -1);
				series.push({
				    type: (a === 'VW' ? 'effectScatter' : 'scatter'), name: a, data: [b], //effectScatter
					symbol: (a === 'VW' ? 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAMAAADUivDaAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEgUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////0PhGZ8AAABgdFJOUwAMFDhAbY9QKRAGHd//u0YOge/XYg8q0M+HgDB4v5ANHp9YCPd9BaYoZC8HXRhI5wKSr3AywWinVEG3IB8LBK0iJsksLQHYM8eUdyc8WZvKw2CVl2EafKoSLo5pPwo6Tqh2QHcAAAAJcEhZcwAAFxEAABcRAcom8z8AAASzSURBVFhHlVdpQyNFEG1lSDaaWTHoCglRSGZXRDkMGjRx3fVYxduI97H+/3/hq1fVZyai70OYrr5eV72qbtxmPPPsVrXdAbrVnd5zZvwfeH67X2e4+8KOdf0n3HlxYBMz7L70sg24Dfde0Rl7+8Oq2nKjqjoYjtVUv/qaDfo3HN7l2KNJzwyKabfTiL25/8Asm7DzOheo664ZIo6tZ/CGGdpxwp0Ee2aJ6FhPXY/fNFML3kJ/c9DluJHZPE65eufsHL+7p2YscfE2esfHzu3J4JlZPS7F2Jy63hH+Dt4xa44H76KvI19zG51iKrvXV/I5ET7v0ZrjAis0E37qcK4WkJ5uJKp7n58ZcIrmzL4PZPhgai2Ch1tYY4k1Bh9YI0A8Obdvc92ltQRbYoiRHmFA/6E1DCcYkDBnAHetIZiJIQm0nGv8oTWIHlb1LAUqoyivU7YDS0DOum/fxCPsmQmau46tYazOM+dcwXeP7Rv4CM2lfSv07F5eU/rmwFqKKRycaOfjZLiBETiyhpdVCkb+E2u4T2VEoUbqwM9q0Yku6yc9+UxaJQ1OU4eprKD8BCq/+kRbn7NR0uAu6sHrTd2meOe+0FZBQ10ocRyxt1KzwUjUDfP+SVM3bbnJQIqaSlkJlMRuXTMnENFFW4lQlXfD3xRKYoaUZtC+lGxoo8HdZ22yMhKjJbJNmqj3yyyXPdQHE26Yplwg4RxOAh/1kHOwttHwlR9eayVBfw2d+0rP00ZDbYJcVoGEO2PX11yonQZtQKHtQEJSCcr4xpK4jYbpp1g5knDwJ9IZia8Vs4WGF1DbwmqjI7/1wtOePBOOK8GWtRQJCcmkxrnvJKYC7SrysQUpCYc67Nz3dW27sC/33GooyJSZkZB8du6HIN51GiouT1ORkVBfbEfprdG44fBs2ZwEInLNYPpKXNLQBAMSceYkoAushl9fIksaOlwQUiQn4SZ1fYNXDbkoChp8sJGJZBGRk5AmpP0Qo8IVktEwvVJymccDCUlE0SUeZypPIKNh9WIlf+xWKkjgEqSbfkyckdLQS7GyZTmtJIHVeY3+ZKWHSGiE2slluUtBQi7FFT9QtmJ5DjSmfL3KERlbmgoSUuTVbz+H6wAINLiWlkzygedLEmibjx6Xdu7JQKge6JXz6RoJtP174Zf0cWE0Kvn14WVsViWJIS4SL1t5gMRs1JH+PASfCgOKLJIQF8VZeErG20ppECFDfRG124uAh5IrbgcLxgeI0gDijqGWx0ly0rSQ3E/bgUZS8LwpDFoi5iG3BBdg2gRHGY30Ji5NPdxjg/xt9SsW7Zv/PY2UpgotmhbYMn8uOPcb3LHnM5Z75jdxkDshT/n0CalA9aj7dgWQRn4TU+VGogcOsaok+B32gcUMNGIRUUBeRmIJP2QP3Yg/0GN7g0a5C6q5kqjELW0cBH9K54yH6c68bwP2Oe1UnNKs+8HjUCjWN2uzA6ZD2WVQxiLFXygi2GSYBSNizmhf53pYw1N92izm5bje6op51k/lsgF/8zTw/3630iAvqzP/7/J5HuqNmMfERF3i3ordTSdsweFc1JPj+jJ/e9yOnclwNtYz9ceL4WpzmG5FdQt35/4BR0GbetJnP9IAAAAASUVORK5CYII=' : 'circle'),
				    symbolSize: function (data) { return scatter_size; }, rippleEffect: { scale: 2.5 },
					itemStyle: { shadowBlur: 10, shadowColor: 'rgba(255, 255, 255, 0.25)', shadowOffsetY: 5, borderWidth: 0.3, borderColor: '#000000' },
					label: { 
						show: (scatter_size > 0), position: ((scatter_size >= 50 && !have_mkt_date) ? 'inside' : 'right'), 
						color: (have_mkt_date ? '#FFC000' : (scatter_size >= 50 ? '#000000' : (a.indexOf('Comp') != -1 ? '#FFFFFF' : color_scatter_Arr[i]))),
						fontFamily: ((scatter_size >= 50 && !have_mkt_date) ? 'VWTextOffice_Bold' : 'VWTextOffice_Regular'),
						formatter: function(params) { return params.data[3]; }
					}
				});
			});
		} else {
			series.push({
			    type: 'scatter', name: a, data: data.series[i],
				symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAABDCAMAAADwFEhBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEUUExURQAAAP/AAP/AAP/BAP/AAP/AAP+/AP/BAP/AAP/VAP/BAP/AAP/AAP/AAP+/AP/AAP/AAP+/AP/AAP/AAP/BAP/AAP/CAP/AAP/AAP/BAP/OOv/ffv/ll//ssf/yyv/45P//+zUoAE47AGhOAIFhAMWUAP/IAP/AALWIAGlPAB4WAP///wAAAP/44v/llv/SSv/ba//55f/bbP/WWP/00v/WWf/JI//vv7mMABcSANHR0f/56P/RRpdyAICAgP/aaP/STC4uLhcXF0AwAKZ9AC0iAP/44eKxHeKyHYxsC1NTU0c6Eo2Hcv///f/zzv/ss//mmR0WABoUAJRvAKd9ANylALOHAPLFOWJTIpNvALeSI8WVANozdK8AAAAodFJOUwBBZX+Zsszl/wZSnemeY676VM67KadL7m6Q////////////////DrPlMwg3AAAACXBIWXMAABcRAAAXEQHKJvM/AAADgUlEQVRYR61Yd1/bMBR0tpIQwh5lFlpGHUaAMhIIhLKhi0Ln9/8e1ZNPy5Yd8yP315Pv7jmx9aQne/HIZHP5QrHESsVCPpfN4Gp6lCvVAWZjoFYpg02DwfoQjDaG6oNQ9MLwCCwujAxDlYTMKNRxGO31ZMbGoUzC+BjUTkxMQpaMyQnoHZiCpjem4IhgGgKJNzOzc/MLiwtvl5bfvcc1iWl4bKysgg6wtv7BBxqEjc0tMAFWV+AzYaXYbgojkogsvt/cASuwCp8B84/s7mljAIr5YO8jFITI3zEe5/6B9gWRyuH7B/tQcYQe7AQucxwetYTNMBIoJqJ9DB2H9YrH9Lw4CRs7RiyIUyj5PDEnm56dZ0pKoDiSwz+Dls9Y+DkyuMTYKcRdITaNHIrQv0TXjiqzY1J0zhuNc9y90+G+jhwoQj2TUWTwhnGB7beFthu+uRwooq3ejlwK1HrxSSg5TCP9kkjGAzjYSJBiEEN2EZESnDn8XXhYsLLVMWKXWtySWgLFYWIPHlanFGW5du4IcSC1jS5iG64hWqgrGLDmi3I04WIVnqOGeEvzAcJxiJBLQZXnkPvIpuIT60XGjU34Bow5uqHodDmu4ONzNYvo2uQRi0G0XjgovoEz6+UQ3aJEWvT2uncY8Pg8jriFM+flES1b90iuuSBehjPvFRAtaXHveiE0luAseEVE95zGM7sjbQuDLi9WN3EPZ9ErIXrgtPPm7nrheICz5CFgny1eloVADLEIJ1O/o/3iHAtwltTz+MKvGlrL6Cbm4Syq9/LV4gnhOEzMwVlQ8+ObZFPnmIUzr+bpjOatskDsIGbgzKl6ubF4gOLYermGM6vr9kqzqXJ8h4/2GLl+rIMW4hT1sg4fXz+8KuK16FbEY/ceRcQafDVzPX2UN0xVc9Z6qtb1H25jTL3Inkis6+b+IlgOLY3LYe8vep970uKe9aKaKnTwer/VWssoBggDIrzf6n3/+ShljqPIvq/7j8OwGGE44yH0uv8w+yDS9qyXE6jNPsjox34aUrK5cjj7sb70hWZ/+os/2IQ9KrY/tfrkZ/6KY2vud3yfbPfrF7wjgs/K0r18goLgOH5Y54Y/j449qvkXrIDj3BA9vwTNhKyXqzTnl+Rz1D9ck3Cfozj6cJ7ry7myL+dbjtefswmvP+8TXv/dgVCu1CLfP6ov+v4RIOV3GM/7D+y9pVaKZfHEAAAAAElFTkSuQmCC',
				symbolSize: function (data) { return (data[2] === 10000 ? 20 : Math.sqrt(data[2]) * p); }, 
				// itemStyle: { shadowBlur: 10, shadowColor: 'rgba(255, 255, 255, 0.25)', shadowOffsetY: 5, borderWidth: 0, borderColor: '#CCCCCC' },
				label: { 
					show: true, position: 'right', color: color_scatter_Arr[i], fontFamily: 'VWTextOffice_Regular',
					formatter: function(params) { return params.data[3]; }
				}
			});
		}
	});
	
	var option = {
		color: color_scatter_Arr,
		grid: { 
			show: true, left: 0, right: 15, top: 10, bottom: 0, containLabel: true, borderWidth: 0.2, borderColor: '#6A767D',
			backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.4, 0.7, // x, y, r - 圆心位置和半径，范围0-1
			[{offset: 0, color: 'rgba(255,255,255,0.05)'}, {offset: 0.5, color: 'rgba(255,255,255,0.03)'}, {offset: 1, color: 'rgba(255,255,255,0.01)'}])
		},
		legend: {
			show: true, data: data.legend, top: 17, right: 84, itemGap: 14, width: '50%', 
			textStyle: { color: '#FFFFFF', fontSize: 14, fontFamily: 'VWTextOffice_Bold' },
			pageIconSize: 14, itemHeight: 14, itemWidth: 14
		},
		toolbox: { top: 12, right: 20, feature: { dataZoom: { title: { zoom: 'Zoom Region', back: 'Zoom Restore' }, iconStyle: { borderColor: '#C2FE06' } } } },
		tooltip: {
		    trigger: 'item', confine: true, //是否将 tooltip 框限制在图表的区域内
			extraCssText: 'box-shadow: 0 0 12px rgba(100,100,100,0.6)', // 额外附加到浮层的 css 样式
			backgroundColor: 'rgba(30,30,30,0.95)', borderColor: 'rgba(30,30,30,0.95)',
			textStyle: { color: '#eee', fontWeight: 400, fontSize: 13, fontFamily: 'VWTextOffice_Regular' }, padding: [10, 18],
			formatter: function(params) { // console.log(11,params)
				var marker = `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${color_scatter_Arr[data.legend.indexOf(params.data[4])]};"></span>`;
				var model = data.models.filter(f => f.ShowName == params.data[3] && f.LEN == params.data[0] && f.WTP2 == params.data[1]); if (!isNullOrEmpty(model)) model = model[0];
				var percent_text = ``; 
				if (!isNullOrEmpty(model.MS)) {
					percent_text = toFloat2(model.MS);
					if (!isNullOrEmpty(model.LastMS)) percent_text += (' ' + toFloat22(model.MS - model.LastMS).replace('+','↑').replace('-','↓'));
				}
				return `<div class="tooltip-title">${params.data[3]}</div>
					<div class="tooltip-content">
					${marker} ${data.xaxis} : ${fprice(params.data[0])}<br>
					${marker} ${data.yaxis} : ${fprice(params.data[1].toFixed(1))}<br>
					${(model.Legend == 'New Model' && params.data[2] === 10000) ? '' : (marker + ' ' + data.size + ' : ' + fprice(params.data[2]) + '<br>')}
					${percent_text == '' ? '' : (marker + ' M.S. : ' + percent_text)}
					</div>`;
			}
		},
		xAxis: {
			name: data.xaxis, scale: true, type: 'value', splitNumber: 10,
			nameTextStyle: { color: '#FFFFFF', padding: [0, 0, 8, -100], verticalAlign: 'bottom', fontSize: 14, fontFamily: 'VWTextOffice_Bold' },
			axisTick: { show: true }, splitLine: { lineStyle: { showMaxLine: false, color: 'rgba(255,255,255,0.05)' } }, 
			axisLabel: { show: true, color: '#FFFFFF', fontFamily: 'VWTextOffice_Regular', formatter: function(value) { return fprice(value); } },
		},
		yAxis: {
			name: data.yaxis, scale: true, type: 'value', splitNumber: 8, 
			nameTextStyle: { color: '#FFFFFF', padding: [0, 0, -42, 125], fontSize: 14, fontFamily: 'VWTextOffice_Bold' },
			axisTick: { show: true }, splitLine: { lineStyle: { showMaxLine: false, color: 'rgba(255,255,255,0.05)' } }, 
			axisLabel: { show: true, color: '#FFFFFF', fontFamily: 'VWTextOffice_Regular', formatter: function(value) { return fprice(value); } },
		},
		series
	};
		
	myChart.setOption(option, true);
	// window.addEventListener("resize", function() { setTimeout(() => { if(myChart) myChart.resize(); }, 300); });
	var resizeObserver = new ResizeObserver(debounce(function(entries) { entries.forEach(entry => { if (myChart) { myChart.resize(); } }); }, 300));
	resizeObserver.observe(document.getElementById(id)); //拖拽改变图表容器大小时刷新图表
}


//a-model-ms-forecast功能echart_scatter_line气泡趋势线图
function create_2_model_ms_forecast_2_echart_scatter_line(id = 'chart_scatter_line', data, myChart = null){
	// debugger;
	// console.log('a-model-ms-forecast功能echart_scatter_line气泡趋势线图：', id, data, myChart);
	if (isNullOrEmpty(data)) return;
	if (myChart == null) myChart = echarts.init(document.getElementById(id));
	myChart.setOption({}, true); myChart.resize();
	
	var min_xaxis = 5.0, max_xaxis = 0.0, min_yaxis = 1.0, max_yaxis = 0.0, isbigsize = ($('#'+id).width() >= 600);
	data.series.forEach(function(a,i){
		if (!isNaN(a[0]) && a[0] < min_xaxis) min_xaxis = a[0]; if (!isNaN(a[0]) && a[0] > max_xaxis) max_xaxis = a[0];
		if (!isNaN(a[1]) && a[1] < min_yaxis) min_yaxis = a[1]; if (!isNaN(a[1]) && a[1] > max_yaxis) max_yaxis = a[1];
	});
	
	// 生成趋势线两个端点数据
	var sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
	data.series.forEach(([x, y]) => { sumX += x; sumY += y; sumXY += x * y; sumX2 += x * x; });
	var n = data.series.length;
	var k = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
	var b = (sumY - k * sumX) / n;
	var minX = Math.min(...data.series.map(d => d[0]));
	var maxX = Math.max(...data.series.map(d => d[0]));
	var trendlineData = [ [minX, k * minX + b], [maxX, k * maxX + b] ];
	
	//添加极限气泡进行扩容，避免气泡超出图表区域
	data.series.push([min_xaxis - 0.03, 0 - 0.01, data.legend[0], '']);
	data.series.push([max_xaxis + 0.03, max_yaxis + 0.01, data.legend[0], '']);
	
	var legend = [], series = [], color_scatter_Arr = ['#00B0F0','#FFC000'];
	data.series.forEach(function(a, j){
		if (legend.indexOf(a[2]) === -1) legend.push(a[2]); let i = legend.indexOf(a[2]);
		series.push({
			type: 'scatter', name: a[2], data: [a], symbol: 'diamond', symbolSize: (a[3] != '' ? 10 : 0),
			itemStyle: { 
				color: color_scatter_Arr[i], borderWidth: 0.0, borderColor: '#FFFFFF', 
				shadowBlur: 10, shadowColor: 'rgba(255, 255, 255, 0.25)', shadowOffsetY: 3
			},
			label: { 
				show: (a[3] != ''), color: (i > 0 ? color_scatter_Arr[i] : '#FFFFFF'), 
				position: (k * a[0] + b >= a[1] ? [50, (j % 2 == 0 ? 20 : 40)] : [-50, (j % 2 == 0 ? -20 : -40)]), 
				fontSize: 12, fontFamily: (a[2].toUpperCase() === 'VW' ? 'VWTextOffice_Bold' : 'VWTextOffice_Bold'), 
				formatter: function(params) { return params.data[3] + ', ' + toFloat2(params.data[1],0); }
			},
			labelLine: { show: true, length2: 15, lineStyle: { width: 1, color: '#FFFFFF', type: 'dotted' } }, zlevel: 3 
		});
	});
	
	//添加趋势线
	series.push({
		type: 'line', data: trendlineData, symbol: 'none',
		lineStyle: { color: '#FFFFFF', type: 'solid', width: 1 },
		tooltip: { show: false }, zlevel: 1 
	});
	
	var option = {
		color: color_scatter_Arr,
		grid: { 
			show: true, left: 0, right: 15, top: 10, bottom: 0, containLabel: true, borderWidth: 0.0, borderColor: '#6A767D',
			backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.4, 0.7, // x, y, r - 圆心位置和半径，范围0-1
			[{offset: 0, color: 'rgba(255,255,255,0.05)'}, {offset: 0.5, color: 'rgba(255,255,255,0.03)'}, {offset: 1, color: 'rgba(255,255,255,0.01)'}])
		},
		legend: {
			show: false, data: legend, top: 17, left: 'center', itemGap: 30, width: '80%', 
			textStyle: { color: '#FFFFFF', fontSize: 14, fontFamily: 'VWTextOffice_Bold' },
			pageIconSize: 14, itemHeight: 14, itemWidth: 14
		},
		toolbox: { top: 12, right: 20, feature: { dataZoom: { title: { zoom: 'Zoom Region', back: 'Zoom Restore' }, iconStyle: { borderColor: '#C2FE06' } } } },
		tooltip: {
		    trigger: 'item', confine: true, //是否将 tooltip 框限制在图表的区域内
			extraCssText: 'box-shadow: 0 0 12px rgba(100,100,100,0.6)', // 额外附加到浮层的 css 样式
			backgroundColor: 'rgba(30,30,30,0.95)', borderColor: 'rgba(30,30,30,0.95)',
			textStyle: { color: '#eee', fontWeight: 400, fontSize: 13, fontFamily: 'VWTextOffice_Regular' }, padding: [10, 18],
			formatter: function(params) {  //console.log(11,params)
				return `<div class="tooltip-title">${params.data[3]}</div>
					<div class="tooltip-content">
					${params.marker} ${data.xaxis} : ${(params.data[0]).toFixed(2,true)}<br>
					${params.marker} ${data.yaxis} : ${toFloat2(params.data[1])}<br>
					</div>`;
			}
		},
		xAxis: {
			name: data.xaxis, scale: true, type: 'value', splitNumber: Math.ceil((max_xaxis - 2.0) / 0.1) + 1,
			nameTextStyle: { color: '#FFFFFF', padding: [0, 0, 8, -166], verticalAlign: 'bottom', fontSize: 14, fontFamily: 'VWTextOffice_Bold' },
			axisTick: { show: true }, splitLine: { lineStyle: { showMaxLine: false, color: 'rgba(255,255,255,0.05)' } }, 
			axisLabel: { show: true, color: '#FFFFFF', fontFamily: 'VWTextOffice_Regular', margin: 16, formatter: function(value) { return value.toFixed(2,true); } },
			axisLine: { onZero: false }, position: 'bottom'
		},
		yAxis: {
			name: data.yaxis, scale: true, type: 'value', splitNumber: 8, 
			nameTextStyle: { color: '#FFFFFF', padding: [0, 0, -42, 60], fontSize: 14, fontFamily: 'VWTextOffice_Bold' },
			axisTick: { show: true }, splitLine: { lineStyle: { showMaxLine: false, color: 'rgba(255,255,255,0.05)' } }, 
			axisLabel: { show: true, color: '#FFFFFF', fontFamily: 'VWTextOffice_Regular', margin: 16, formatter: function(value) { return toFloat2(value); } },
		},
		series
	};
		
	myChart.setOption(option, true);
	// window.addEventListener("resize", function() { setTimeout(() => { if(myChart) {
	// 	var isbigsize = ($('#'+id).width() >= 600);
	// 	option.xAxis.splitNumber = Math.ceil((max_xaxis - 2.0) / (isbigsize ? 0.1 : 0.2)) + 1;
	// 	myChart.setOption(option, true); 
	// 	myChart.resize(); 
	// } }, 300); });
	var resizeObserver = new ResizeObserver(debounce(function(entries) { entries.forEach(entry => { if (myChart) { 
		var isbigsize = ($('#'+id).width() >= 600);
		option.xAxis.splitNumber = Math.ceil((max_xaxis - 2.0) / (isbigsize ? 0.1 : 0.2)) + 1;
		myChart.setOption(option, true); 
		myChart.resize(); 
	} }); }, 300));
	resizeObserver.observe(document.getElementById(id)); //拖拽改变图表容器大小时刷新图表
}






