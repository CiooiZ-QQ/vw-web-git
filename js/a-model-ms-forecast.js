var segment = 'B', bodytype = 'SUV', fueltype = 'PHEV', datetype = new Date().getFullYear().toString();

bind_data_filter(); //绑定顶部筛选维度数据

//绑定顶部筛选维度数据
function bind_data_filter() {
	axios_F1('a_model_ms_forecast/get_filter_data', {}, 'get').then(response => {
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
			bind_chart_scatter_line(); //绑定气泡趋势线图
		}
	});
}

//绑定气泡趋势线图
function bind_chart_scatter_line() {
	axios_F1('a_model_ms_forecast/get_xfsc_models_data', { segment, bodytype, fueltype, datetype }, 'get').then(response => {
		if (isNullOrEmpty(response.data) || isNullOrEmpty(response.data.Data) || response.data.StatusCode != 200) { layer.msg('error in data'); } else {
			var data_table_model = response.data.Data; //console.log('绑定气泡趋势线图', data_table_model);
			var legend = ['','VW'], series = [];
			legend.forEach(function(a){
				let models = data_table_model.filter(f => f.IS_VW == a);
				models.forEach(function(b){
					if (isNullOrEmpty(b.Score) || isNullOrEmpty(b.MS)) return;
					series.push([b.Score, b.MS, a, b.Model]);
				});
			});
			var data_chart_scatter_line = { title: '气泡趋势线图', xaxis: 'Competitiveness Index', yaxis: 'MS%', legend, series };
			create_2_model_ms_forecast_2_echart_scatter_line('chart_scatter_line', data_chart_scatter_line);
		}
	});
}

//页面大小改变事件
var resizeTimer;
window.addEventListener("resize", function() { 
	clearTimeout(resizeTimer); // 清除之前的定时器
	resizeTimer = setTimeout(() => { 
		//
	}, 200); 
});

//切换细分市场事件
$('#select-segment,#select-bodytype,#select-fueltype').on('change', function(){
	var select_id = $(this).attr('id');
	if (select_id === 'select-segment') segment = $(this).val();
	if (select_id === 'select-bodytype') bodytype = $(this).val();
	if (select_id === 'select-fueltype') fueltype = $(this).val();
    bind_chart_scatter_line(); //绑定气泡趋势线图
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
    bind_chart_scatter_line(); //绑定气泡趋势线图
});


