var segment = 'B', bodytype = 'SUV', fueltype = 'BEV', datetype = new Date().getFullYear().toString();
var brand = '', model = '';
var data_type_arrs = null
var data_score_arrs = null;
var data_model_arrs = null;
var data_select_model = null;

bind_data_filter(); //绑定顶部筛选维度数据
bind_data_scores(); //绑定各类型评分项数据

//绑定顶部筛选维度数据
function bind_data_filter() {
	axios_F1('a_model_assessment/get_filter_data', {}, 'get').then(response => {
		if (isNullOrEmpty(response.data) || isNullOrEmpty(response.data.Data) || response.data.StatusCode != 200) { layer.msg('error in data'); } else {
			data_type_arrs = response.data.Data; //console.log('绑定顶部筛选维度数据', data_type_arrs);
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
			$('#table_rank thead th:nth-child(4)').html('MS' + ($('#table_rank').width() >=  400 ? ' ' : '<br>') + data_type_arrs.lastmonth);
		}
	});
}

//绑定各类型评分项数据
function bind_data_scores() {
	axios_F1('a_model_assessment/get_score_items_data', {}, 'get').then(response => {
		if (isNullOrEmpty(response.data) || isNullOrEmpty(response.data.Data) || response.data.StatusCode != 200) { layer.msg('error in data'); } else {
			data_score_arrs = response.data.Data; //console.log('绑定各类型评分项数据', data_score_arrs);
			var arr_brand_scores = data_score_arrs.filter(f => f.ScoreType === 'Brand');
			var html_brand_scores = ``; $('.content-main-item-list[data-type="brand"]').html(''); 
			arr_brand_scores.forEach(function(a,i){ html_brand_scores += `<p data-id="${a.ScoreID}"><span>${a.ScoreName}</span><input type="text" value="0" disabled /></p>`; });
			$('.content-main-item-list[data-type="brand"]').html(html_brand_scores); 
			var arr_price_scores = data_score_arrs.filter(f => f.ScoreType === 'Price');
			var html_price_scores = ``; $('.content-main-item-list[data-type="price"]').html(''); 
			arr_price_scores.forEach(function(a,i){ html_price_scores += `<p data-id="${a.ScoreID}"><span>${a.ScoreName}</span><input type="text" value="0" disabled /></p>`; });
			$('.content-main-item-list[data-type="price"]').html(html_price_scores); 
			var arr_product_scores = data_score_arrs.filter(f => f.ScoreType === 'Product');
			var html_product_scores = ``; $('.content-main-item-list[data-type="product"]').html(''); 
			arr_product_scores.forEach(function(a,i){ html_product_scores += `<p data-id="${a.ScoreID}"><span>${a.ScoreName}</span><input type="text" value="0" disabled /></p>`; });
			$('.content-main-item-list[data-type="product"]').html(html_product_scores); 
			var arr_service_scores = data_score_arrs.filter(f => f.ScoreType === 'Service');
			var html_service_scores = ``; $('.content-main-item-list[data-type="service"]').html(''); 
			arr_service_scores.forEach(function(a,i){ html_service_scores += `<p data-id="${a.ScoreID}"><span>${a.ScoreName}</span><input type="text" value="0" disabled /></p>`; });
			$('.content-main-item-list[data-type="service"]').html(html_service_scores); 
			bind_brand_models(); //绑定细分市场品牌车型数据
		}
	});
}

//绑定细分市场品牌车型数据
function bind_brand_models() {
	axios_F1('a_model_assessment/get_brand_models_data', { segment, bodytype, fueltype }, 'get').then(response => {
		if (isNullOrEmpty(response.data) || isNullOrEmpty(response.data.Data) || response.data.StatusCode != 200) { layer.msg('error in data'); } else {
			data_model_arrs = response.data.Data; //console.log('绑定细分市场品牌车型数据', data_model_arrs);
			var arr_brands = processArray(data_model_arrs, 'Brand');
			if (arr_brands.length > 0) brand = (arr_brands.indexOf(brand) > -1 ? brand : (arr_brands.indexOf('VW') > -1 ? 'VW' : arr_brands[0]));
			var arr_models = processArray(data_model_arrs.filter(f => f.Brand === brand), 'Model');
			if (arr_models.length > 0) model = (arr_models.indexOf(model) > -1 ? model : arr_models[0]);;
			var html_select_brands = ``; $('#select-brands').html(''); 
			arr_brands.forEach(function(a,i){ html_select_brands += `<option value="${a}" ${a===brand?`selected`:``}>&nbsp;Brand:&nbsp;&nbsp;${a}</option>`; });
			$('#select-brands').html(html_select_brands); 
			var html_select_models = ``; $('#select-models').html(''); 
			arr_models.forEach(function(a,i){ html_select_models += `<option value="${a}" ${a===model?`selected`:``}>&nbsp;Model:&nbsp;&nbsp;${a}</option>`; });
			$('#select-models').html(html_select_models); 
			bind_select_models(); //绑定指定车型的评分和排名
		}
	});
}

//绑定指定车型的评分和排名
function bind_select_models() {
	axios_F1('a_model_assessment/get_select_model_data', { segment, bodytype, fueltype, datetype, brand, model }, 'get').then(response => {
	// axios_F1('a_model_assessment/get_select_model_data', { segment: 'B', bodytype: 'SUV', fueltype: 'BEV', datetype: '2025', brand: 'VW', model: 'B SUV BEV 5s CN' }, 'get').then(response => {
		if (isNullOrEmpty(response.data) || isNullOrEmpty(response.data.Data) || response.data.StatusCode != 200) { layer.msg('error in data'); } else {
			data_select_model = response.data.Data; //console.log('绑定指定车型的评分和排名', data_select_model);
			if (!isNullOrEmpty(data_select_model.modeldata)) {
				$('.content-main-item-list p').each(function(i,a){
					var scoreid = $(this).attr('data-id'); var doc_ipt = $(this).find('input').eq(0);
					if (isNullOrEmpty(data_select_model.modeldata['ScoreID_' + scoreid])) doc_ipt.val(0);
					else doc_ipt.val(data_select_model.modeldata['ScoreID_' + scoreid].toFixed(0));
				});
				$('#score_brand').text(data_select_model.modeldata.BrandScore.toFixed(2));
				$('#score_price').text(data_select_model.modeldata.PriceScore.toFixed(2));
				$('#score_product').text(data_select_model.modeldata.ProductScore.toFixed(2));
				$('#score_service').text(data_select_model.modeldata.ServiceScore.toFixed(2));
				$('#score_sum').text(data_select_model.modeldata.Score.toFixed(2));
			}
			if (!isNullOrEmpty(data_select_model.rankdata)) {
				var html_rank_rows = ``; $('#table_rank tbody').html('');
				data_select_model.rankdata.forEach(function(a,i){ 
					$('#table_rank tbody').append(`<tr class="${a.IsSelect?'selected':''}"> // data-aos="fade-up" data-aos-delay="${i*50}"
						<td>${a.Rank}</td><td>${a.Model}</td><td>${a.Score.toFixed(2)}</td>
						<td><div class="rankbar ${a.IsSelect?'selectedbar':''}" data-value="${a.MS}"></div>${toFloat2(a.MS)}</td>
						</tr>`); 
				});
				bind_animate_rank(); //动态加载销量排名柱子
			}
		}
	});
}

//动态加载销量排名柱子
function bind_animate_rank() {
	var tabwidth = $('#table_rank').width(), ms_width = 0.6, font_size = 14;
	if (tabwidth < 450 && tabwidth >= 350) { ms_width = 0.5; font_size = 14; }
	if (tabwidth < 350 && tabwidth >= 300) { ms_width = 0.3; font_size = 14; }
	if (tabwidth < 300) { ms_width = 0.1; font_size = 12; }
	$('#table_rank thead th:nth-child(4)').html('MS' + (tabwidth >=  400 ? ' ' : '<br>') + data_type_arrs.lastmonth);
	$('#table_rank tbody tr td').css('font-size', font_size + 'px').find('.rankbar').css('height', font_size + 'px');
	var maxwidth = $('#table_rank tbody tr td:nth-child(4)').eq(0).width() * ms_width;
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
    bind_brand_models(); //绑定细分市场品牌车型数据
});

//切换品牌事件
$('#select-brands').on('change', function(){
	brand = $(this).val();
	var arr_models = processArray(data_model_arrs.filter(f => f.Brand === brand), 'Model');
	if (arr_models.length > 0) model = arr_models[0];
	var html_select_models = ``; $('#select-models').html(''); 
	arr_models.forEach(function(a,i){ html_select_models += `<option value="${a}" ${a===model?`selected`:``}>&nbsp;Model:&nbsp;&nbsp;${a}</option>`; });
	$('#select-models').html(html_select_models); 
    bind_select_models(); //绑定指定车型的评分和排名
});

//切换车型事件
$('#select-models').on('change', function(){
	model = $(this).val();
    bind_select_models(); //绑定指定车型的评分和排名
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
    bind_select_models(); //绑定指定车型的评分和排名
});

//重新绑定车型权重分数(还原)
var num_transform = 360; $('#reset_score').css('transform','rotate(-'+num_transform+'deg)');
$('#reset_score').click(function(){
	num_transform+=360;
	$(this).css('transform','rotate(-'+num_transform+'deg)');
	// bind_car_score(); //绑定车型权重分数
});


	