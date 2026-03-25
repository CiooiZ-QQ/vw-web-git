var segment = 'B', bodytype = 'SUV', fueltype = 'ALL';

bind_data_filter(); //绑定顶部筛选维度数据
bind_chart_bar_line(); //绑定左侧柱状折线图
bind_table_fueltype_top3brand(); //绑定右侧能源类型TOP3品牌表格

//绑定顶部筛选维度数据
function bind_data_filter() {
	axios_F1('a_vw_planning/get_filter_data', {}, 'get').then(response => {
		if (isNullOrEmpty(response.data) || isNullOrEmpty(response.data.Data) || response.data.StatusCode != 200) { layer.msg('error in data'); } else {
			var data_type_arrs = response.data.Data; //console.log('绑定顶部筛选维度数据', data_type_arrs);
			var html_select_segment = ``;
			data_type_arrs.segments.forEach(function(a,i){ html_select_segment += `<option value="${a}" ${a===segment?`selected`:``}>&nbsp;Segment:&nbsp;&nbsp;${a}</option>`; });
			$('#select-segment').html(html_select_segment); 
			var html_select_bodytype = ``;
			data_type_arrs.bodytypes.forEach(function(a,i){ html_select_bodytype += `<option value="${a}" ${a===bodytype?`selected`:``}>&nbsp;BodyType:&nbsp;&nbsp;${a}</option>`; });
			$('#select-bodytype').html(html_select_bodytype); 
			$('#select-fueltype').html(`<option value="ALL" selected}>&nbsp;FuelType:&nbsp;&nbsp;ALL</option>`); 
		}
	});
}

//绑定左侧柱状折线图
function bind_chart_bar_line() {
	axios_F1('a_vw_planning/get_chart_bar_line_data', { segment, bodytype, fueltype }, 'get').then(response => {
		if (isNullOrEmpty(response.data) || isNullOrEmpty(response.data.Data) || response.data.StatusCode != 200) { layer.msg('error in data'); } else {
			var data_chart_bar_line = response.data.Data; //console.log('绑定左侧柱状折线图', data_chart_bar_line);
			create_2_vw_planning_2_echart_bar_line('chart_bar_line', data_chart_bar_line, segment + ' ' + bodytype + ' ' + fueltype);
			//绑定左侧能源类型表格
			var html_table_fueltype_mkt = ``;
			data_chart_bar_line.legend.filter(f => f.toUpperCase() != 'TOTAL').forEach(function(a,i){
				let html_table_row = `<tr><td>${a} MKT</td>`;
				data_chart_bar_line.xfsc_sales[i].forEach(function(b){ html_table_row += `<td>${fprice(b.toFixed(0))}</td>`; });
				html_table_row += `</tr>`;
				html_table_fueltype_mkt = html_table_row + html_table_fueltype_mkt;
			});
			$('#table_fueltype_mkt tbody').html(html_table_fueltype_mkt);
		}
	});
}

//绑定右侧能源类型TOP3品牌表格
function bind_table_fueltype_top3brand() {
	axios_F1('a_vw_planning/get_table_fueltype_top3brand', { segment, bodytype, fueltype }, 'get').then(response => {
		if (isNullOrEmpty(response.data) || isNullOrEmpty(response.data.Data) || response.data.StatusCode != 200) { layer.msg('error in data'); } else {
			var data_table_fueltype_top3brand = response.data.Data; //console.log('绑定右侧能源类型TOP3品牌表格', data_table_fueltype_top3brand);
			// var head_lastms = data_table_fueltype_top3brand.head[0], head_ms = data_table_fueltype_top3brand.head[1];
			// $('#table_bev_top3 thead tr:last-child th:nth-child(2)').text(head_lastms); $('#table_bev_top3 thead tr:last-child th:nth-child(3)').text(head_ms);
			// $('#table_phev_top3 thead tr:last-child th:nth-child(2)').text(head_lastms); $('#table_phev_top3 thead tr:last-child th:nth-child(3)').text(head_ms);
			// $('#table_ice_top3 thead tr:last-child th:nth-child(2)').text(head_lastms); $('#table_ice_top3 thead tr:last-child th:nth-child(3)').text(head_ms);
			// var html_table_bev_top3brand = ``;
			// data_table_fueltype_top3brand.bev.forEach(function(a){ html_table_bev_top3brand += `<tr><td>${a.brand}</td><td>${toFloat2(a.lastms)}</td><td>${toFloat2(a.ms)}</td></tr>`; });
			// $('#table_bev_top3 tbody').html(html_table_bev_top3brand); 
			// var html_table_phev_top3brand = ``;
			// data_table_fueltype_top3brand.phev.forEach(function(a){ html_table_phev_top3brand += `<tr><td>${a.brand}</td><td>${toFloat2(a.lastms)}</td><td>${toFloat2(a.ms)}</td></tr>`; });
			// $('#table_phev_top3 tbody').html(html_table_phev_top3brand); 
			// var html_table_ice_top3brand = ``;
			// data_table_fueltype_top3brand.ice.forEach(function(a){ html_table_ice_top3brand += `<tr><td>${a.brand}</td><td>${toFloat2(a.lastms)}</td><td>${toFloat2(a.ms)}</td></tr>`; });
			// $('#table_ice_top3 tbody').html(html_table_ice_top3brand); 
			var head_ms = data_table_fueltype_top3brand.head[0], head_lastms = data_table_fueltype_top3brand.head[1];
			$('#table_bev_top3 thead tr:last-child th:nth-child(2)').text(head_ms); $('#table_bev_top3 thead tr:last-child th:nth-child(3)').text(head_lastms);
			$('#table_phev_top3 thead tr:last-child th:nth-child(2)').text(head_ms); $('#table_phev_top3 thead tr:last-child th:nth-child(3)').text(head_lastms);
			$('#table_ice_top3 thead tr:last-child th:nth-child(2)').text(head_ms); $('#table_ice_top3 thead tr:last-child th:nth-child(3)').text(head_lastms);
			var html_table_bev_top3brand = ``;
			data_table_fueltype_top3brand.bev.forEach(function(a){ html_table_bev_top3brand += `<tr><td>${a.brand}</td><td>${toFloat2(a.ms)}</td><td>${toFloat2(a.lastms)}</td></tr>`; });
			$('#table_bev_top3 tbody').html(html_table_bev_top3brand); 
			var html_table_phev_top3brand = ``;
			data_table_fueltype_top3brand.phev.forEach(function(a){ html_table_phev_top3brand += `<tr><td>${a.brand}</td><td>${toFloat2(a.ms)}</td><td>${toFloat2(a.lastms)}</td></tr>`; });
			$('#table_phev_top3 tbody').html(html_table_phev_top3brand); 
			var html_table_ice_top3brand = ``;
			data_table_fueltype_top3brand.ice.forEach(function(a){ html_table_ice_top3brand += `<tr><td>${a.brand}</td><td>${toFloat2(a.ms)}</td><td>${toFloat2(a.lastms)}</td></tr>`; });
			$('#table_ice_top3 tbody').html(html_table_ice_top3brand); 
		}
	});
}

//切换细分市场事件
$('#select-segment,#select-bodytype,#select-fueltype').on('change', function(){
	var select_id = $(this).attr('id');
	if (select_id === 'select-segment') segment = $(this).val();
	if (select_id === 'select-bodytype') bodytype = $(this).val();
	if (select_id === 'select-fueltype') fueltype = $(this).val();
    bind_chart_bar_line(); //绑定左侧柱状折线图
    bind_table_fueltype_top3brand(); //绑定右侧能源类型TOP3品牌表格
});

//页面大小改变事件
var resizeTimer;
window.addEventListener("resize", function() { 
	clearTimeout(resizeTimer); // 清除之前的定时器
	resizeTimer = setTimeout(() => { 
		//
	}, 200); 
});


