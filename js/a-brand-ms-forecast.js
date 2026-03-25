var segment = 'B', bodytype = 'SUV', fueltype = 'BEV';

bind_data_filter(); //绑定顶部筛选维度数据
bind_table_brand(); //绑定品牌份额预测表格
bind_table_new_model(); //绑定新车预测表格

//绑定顶部筛选维度数据
function bind_data_filter() {
	axios_F1('a_brand_ms_forecast/get_filter_data', {}, 'get').then(response => {
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
		}
	});
}

//绑定品牌份额预测表格
function bind_table_brand() {
	axios_F1('a_brand_ms_forecast/get_table_brand_data', { segment, bodytype, fueltype }, 'get').then(response => {
		if (isNullOrEmpty(response.data) || isNullOrEmpty(response.data.Data) || response.data.StatusCode != 200) { layer.msg('error in data'); } else {
			var data_table_brand = response.data.Data; //console.log('绑定品牌份额预测表格', data_table_brand);
			var data_forecast = data_table_brand.filter(f => f.forecast===1);
			$('#table_brand_top').text(`${data_forecast[0].head.substring(0,4)}-${data_forecast[data_forecast.length-1].head.substring(0,4)} Brand MS% Forecast`);
			var row_number = 0; data_table_brand.forEach(function(a){ if (a.list.length > row_number) { row_number = a.list.length; } });
			$('#table_brand thead').html('<tr><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th></tr>');
			$('#table_brand tbody').html(''); for (var i = 0; i < row_number; i++) { $('#table_brand tbody').append('<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'); }
			setTimeout(function(){
				data_table_brand.forEach(function(a,i){
					$(`#table_brand thead tr th:nth-child(${i+1})`).html(a.head).addClass(a.forecast===1?'forecast':'');
					a.list.forEach(function(b,j){
						let isbenpin = b.name.toUpperCase().trim().startsWith('VW');
						$(`#table_brand tbody tr:nth-child(${j+1}) td:nth-child(${i+1})`)
							.html(`<div><span>${b.rank}</span><span>${(isbenpin?'<i class="icon iconfont-cz icon-VW_nbdLogo_reg_darkblue_spot"></i>':'')+b.name}</span><span>${toFloat2(b.ms,(a.forecast===1?0:1))}</span></div>`)
							.addClass(isbenpin?'isbenpin':(a.forecast===1?'forecast':''));
					});
				});
			},300);
		}
	});
}

//绑定新车预测表格
function bind_table_new_model() {
	axios_F1('a_brand_ms_forecast/get_table_new_model_data', { segment, bodytype, fueltype }, 'get').then(response => {
		if (isNullOrEmpty(response.data) || isNullOrEmpty(response.data.Data) || response.data.StatusCode != 200) { layer.msg('error in data'); } else {
			var data_table_new_model = response.data.Data; //console.log('绑定新车预测表格', data_table_new_model);
			var data_forecast = data_table_new_model.filter(f => f.forecast===1);
			var new_model_num = 0, row_number = 0; 
			data_table_new_model.forEach(function(a){ if (a.forecast === 1) { new_model_num += a.num; } if (a.list.length > row_number) { row_number = a.list.length; } });
			$('#table_new_model_top').text(`${data_forecast[0].head.substring(0,4)}-${data_forecast[data_forecast.length-1].head.substring(0,4)} will launch＞${new_model_num} new models`);
			$('#table_new_model thead').html('<tr><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th></tr>');
			$('#table_new_model tbody').html(''); for (var i = 0; i < row_number; i++) { $('#table_new_model tbody').append('<tr data-rank="'+(i+1)+'"><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'); }
			// var dividerank = (row_number * 1.0 / 2).toFixed(0); $(`#table_new_model tbody tr[data-rank="${dividerank}"]`).css('border-top','1px solid #B6BFC5'); //添加表格内分割线
			$('#table_new_model tbody tr td').css('line-height', (segment + ' ' + bodytype + ' ' + fueltype === 'B SUV PHEV' ? '1.3' : '1.6') + 'rem');
			setTimeout(function(){
				data_table_new_model.forEach(function(a,i){
					$(`#table_new_model thead tr th:nth-child(${i+1})`).html(a.head+(a.forecast===1?'':'<span> (New Model*'+a.num+')</span>')).addClass(a.forecast===1?'forecast':'');
					a.list.forEach(function(b,j){
						let isbenpin = !isNullOrEmpty(b.logo.trim());
						$(`#table_new_model tbody tr[data-rank="${b.rank}"] td:nth-child(${i+1})`)
							.html((isbenpin?'<i class="icon iconfont-cz '+(b.logo.toUpperCase().trim().startsWith('VW')?'icon-VW_nbdLogo_reg_darkblue_spot':'icon-jetta-h')+'"></i>':'')+b.name)
							.addClass(isbenpin?'isbenpin':(a.forecast===1?'forecast':''));
					});
				});
				// $(`#table_new_model tbody tr td`).each(function(){ if ($(this).html() === '&nbsp;' || $(this).html() === '') { $(this).html('……'); } });
			},300);
		}
	});
}

//切换细分市场事件
$('#select-segment,#select-bodytype,#select-fueltype').on('change', function(){
	var select_id = $(this).attr('id');
	if (select_id === 'select-segment') segment = $(this).val();
	if (select_id === 'select-bodytype') bodytype = $(this).val();
	if (select_id === 'select-fueltype') fueltype = $(this).val();
    bind_table_brand(); //绑定品牌份额预测表格
    bind_table_new_model(); //绑定新车预测表格
});

//页面大小改变事件
var resizeTimer;
window.addEventListener("resize", function() { 
	clearTimeout(resizeTimer); // 清除之前的定时器
	resizeTimer = setTimeout(() => { 
		//
	}, 200); 
});

drag_doc_scroll('#table-content'); //设置指定ID元素容器可左右拖拽

	