
var data_seg_list = [
	{ id: 1, name: 'A NB BEV', value: 603000, yoychange: 0.37109234 },
	{ id: 2, name: 'A NB PHEV', value: 734000, yoychange: -0.08099234 },
	{ id: 3, name: 'A SUV BEV', value: 1123000, yoychange: 0.37509234 },
	{ id: 4, name: 'A SUV PHEV', value: 1009000, yoychange: 0.15599234 },
	{ id: 5, name: 'B NB BEV', value: 752000, yoychange: 0.18309234 },
	{ id: 6, name: 'B NB PHEV', value: 280000, yoychange: 0.28339234 },
	{ id: 7, name: 'B SUV BEV', value: 719000, yoychange: 0.23609234 },
	{ id: 8, name: 'B SUV PHEV', value: 907000, yoychange: 0.17799234 }
];
var data_chart_bar = {
	legend: ['2024.9 YTD','2025.9 YTD'],
	xaxis: ['A NB BEV','A NB PHEV','A SUV BEV','A SUV PHEV','B NB BEV','B NB PHEV','B SUV BEV','B SUV PHEV'],
	series: [
		[0.0612764454847485,0.111267429443726,0.11387810675132,0.121739425118258,0.0886103205708123,0.0304281971000005,0.0811567810739283,0.107413612311352],
		[0.0680611241881976,0.082849281599799,0.12683346982671,0.113958365734276,0.0848862349951869,0.0316227555535075,0.0812505527219672,0.102447404869420]
	]
};
var data_table_rank = [
	{id:1,name:'BYD',value:1751.045,share:0.285,lastshare:0.357},
	{id:2,name:'Tesla',value:432.704,share:0.071,lastshare:0.09},
	{id:3,name:'Yinhe',value:353.572,share:0.058,lastshare:0.03},
	{id:4,name:'Leapmotor',value:317.463,share:0.052,lastshare:0.025},
	{id:5,name:'Xpeng',value:271.391,share:0.044,lastshare:0.015},
	{id:6,name:'Mi Auto',value:266.722,share:0.043,lastshare:0.014},
	{id:7,name:'Li Auto',value:243.986,share:0.04,lastshare:0.052},
	{id:8,name:'Shenlan',value:178.676,share:0.029,lastshare:0.022},
	{id:9,name:'Aito',value:175.982,share:0.029,lastshare:0.035},
	{id:10,name:'Aion',value:171.809,share:0.028,lastshare:0.049},
	{id:11,name:'LYNK&CO',value:129.256,share:0.021,lastshare:0.018},
	{id:12,name:'Qiyuan',value:124.167,share:0.02,lastshare:0.021},
	{id:13,name:'Chery',value:108.107,share:0.018,lastshare:0.012},
	{id:14,name:'Fangchengbao',value:95.88,share:0.016,lastshare:0.006},
	{id:29,name:'VW',value:41.109,share:0.007,lastshare:0.015}
];

// //获取数据
// axios_F1('Common/CheckToken', {}, 'get').then(response => {
// 	if (isNullOrEmpty(response.data) || isNullOrEmpty(response.data.Data) || response.data.StatusCode != 200) layer.msg('error in data'); 
// 	else {
// 		var data = response.data.Data;
// 		console.log('数据', data);
// 	}
// });

bind_seg_list(); //绑定细分市场数据指标卡
bind_chart_bar(); //绑定细分市场份额柱状图
bind_table_rank(); //绑定品牌销量排名表格

//绑定细分市场数据指标卡
function bind_seg_list() {
	var html_seg_list = ``;
	data_seg_list.forEach(function(a){ 
		html_seg_list += `<div class="select-card"><div class="set-card">
			<h4>${a.name}</h4>
			<h2><label class="counter" data-counter-time="1000" data-counter-delay="50">${(a.value*1.0/1000).toFixed(0)}</label>&nbsp;K</h2>
			<span class="${parseFloat(a.yoychange)>=0?`percent-rise`:`percent-fall`}">${toFloat22(a.yoychange)}</span>
		</div></div>`;
	});
	$('#seg-list').html(html_seg_list); 
	$('#seg-list .counter').countUp(); //初始化数字动画
}

//绑定细分市场份额柱状图
function bind_chart_bar() {
	create_2_home_2_echart_bar('echart_bar', data_chart_bar);
}

//绑定品牌销量排名表格
function bind_table_rank() {
	$('#table_rank thead th:nth-child(3)').text(data_chart_bar.legend[1]);
	$('#table_rank thead th:nth-child(4)').text(data_chart_bar.legend[0].substring(0,4));
	var html_table_rank = ``;
	data_table_rank.forEach(function(a,i){
		html_table_rank += `<tr>
			<td>${a.id}</td><td>${a.name}</td>
			<td><div class="rankbar" data-value="${a.value}">&nbsp;</div><span>${(a.value*1.0/1000).toFixed(1)}</span></td>
			<td><img alt="" src="../img/${toFloat2(a.share)>=toFloat2(a.lastshare)?`arrow-up`:`arrow-down`}.png" /><span>${toFloat2(a.share)}</span></td>
			<td>${toFloat2(a.lastshare)}</td>
		</tr>`;
	});
	$('#table_rank tbody').html(html_table_rank); 
	bind_animate_rank(); //动态加载销量排名柱子
}

//动态加载销量排名柱子
function bind_animate_rank() {
	var tabwidth = $('#table_rank').width(), ms_width = 0.6;
	if (tabwidth < 450 && tabwidth >= 400) ms_width = 0.5;
	if (tabwidth < 400 && tabwidth >= 350) ms_width = 0.2;
	if (tabwidth < 350) ms_width = 0.1;
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


	