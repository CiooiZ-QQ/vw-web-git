var segment = 'B', bodytype = 'SUV', fueltype = 'ALL';

bind_data_filter(); //绑定顶部筛选维度数据
bind_chart_left(); //绑定左侧细分市场销量柱状图
bind_chart_right(); //绑定右侧价格段份额堆积柱状图

//绑定顶部筛选维度数据
function bind_data_filter() {
	axios_F1('a_nev_market/get_filter_data', {}, 'get').then(response => {
		if (isNullOrEmpty(response.data) || isNullOrEmpty(response.data.Data) || response.data.StatusCode != 200) { layer.msg('error in data'); } else {
			var data_type_arrs = response.data.Data; //console.log('绑定顶部筛选维度数据', data_type_arrs);
			var html_select_segment = `<option value="ALL"}>&nbsp;Segment:&nbsp;&nbsp;ALL</option>`;
			data_type_arrs.segments.forEach(function(a,i){ html_select_segment += `<option value="${a}" ${a===segment?`selected`:``}>&nbsp;Segment:&nbsp;&nbsp;${a}</option>`; });
			$('#select-segment').html(html_select_segment); 
			var html_select_bodytype = `<option value="ALL"}>&nbsp;BodyType:&nbsp;&nbsp;ALL</option>`;
			data_type_arrs.bodytypes.forEach(function(a,i){ html_select_bodytype += `<option value="${a}" ${a===bodytype?`selected`:``}>&nbsp;BodyType:&nbsp;&nbsp;${a}</option>`; });
			$('#select-bodytype').html(html_select_bodytype); 
			var html_select_fueltype = `<option value="ALL" selected}>&nbsp;FuelType:&nbsp;&nbsp;ALL</option>`;
			data_type_arrs.fueltypes.forEach(function(a,i){ html_select_fueltype += `<option value="${a}" ${a===fueltype?`selected`:``}>&nbsp;FuelType:&nbsp;&nbsp;${a}</option>`; });
			$('#select-fueltype').html(html_select_fueltype); 
		}
	});
}

//绑定左侧细分市场销量柱状图
function bind_chart_left() {
	axios_F1('a_nev_market/get_chart_left_data', { segment, bodytype, fueltype }, 'get').then(response => {
		if (isNullOrEmpty(response.data) || isNullOrEmpty(response.data.Data) || response.data.StatusCode != 200) { layer.msg('error in data'); } else {
			var data_chart_left = response.data.Data; //console.log('绑定左侧细分市场销量柱状图', data_chart_left);
			create_2_nev_market_2_echart_left('echart_left', data_chart_left, segment + ' ' + bodytype + ' ' + fueltype);
		}
	});
}

//绑定右侧价格段份额堆积柱状图
function bind_chart_right() {
	axios_F1('a_nev_market/get_chart_right_data', { segment, bodytype, fueltype }, 'get').then(response => {
		if (isNullOrEmpty(response.data) || isNullOrEmpty(response.data.Data) || response.data.StatusCode != 200) { layer.msg('error in data'); } else {
			var data_chart_right = response.data.Data; //console.log('绑定右侧价格段份额堆积柱状图', data_chart_right);
			create_2_nev_market_2_echart_right('echart_right', data_chart_right, segment + ' ' + bodytype + ' ' + fueltype);
		}
	});
}

//切换细分市场事件
$('#select-segment,#select-bodytype,#select-fueltype').on('change', function(){
	var select_id = $(this).attr('id');
	if (select_id === 'select-segment') segment = $(this).val();
	if (select_id === 'select-bodytype') bodytype = $(this).val();
	if (select_id === 'select-fueltype') fueltype = $(this).val();
    bind_chart_left(); //绑定左侧细分市场销量柱状图
    bind_chart_right(); //绑定右侧价格段份额堆积柱状图
});

//页面大小改变事件
var resizeTimer;
window.addEventListener("resize", function() { 
	clearTimeout(resizeTimer); // 清除之前的定时器
	resizeTimer = setTimeout(() => { 
		//
	}, 200); 
});


