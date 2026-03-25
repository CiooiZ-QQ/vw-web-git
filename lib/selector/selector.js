
//根据data生成头部已选HTML内容
function getSelectorHTML(data) {
	let top_html = '';
	
	
	
};

//根据data生成按钮已选文本内容
function getSelectorBtnTxt(data) {
	let btntxt = ''; //( Brand : 1   Body : 1   Fuel : 1 )
	if (isValidArray(data.vsn)) btntxt = 'VSN : ' + data.vsn.length;
	else if (isValidArray(data.type)) btntxt = 'TYPE : ' + data.type.length;
	else if (isValidArray(data.model)) btntxt = 'Model : ' + data.model.length;
	else {
		if (isValidArray(data.brand)) btntxt = 'Brand : ' + data.brand.length + ' & ';
		if (isValidArray(data.body)) {
			if (isBodyOrSegment(data)) btntxt += 'Body : ' + data.body.length + ' & ';
			else {
				let num = 0;
				data.segment.forEach(function(a){
					if (a.checked) num++;
				})
				btntxt += 'Segment : ' + num + ' & ';
			}
		}
		if (isValidArray(data.fuel)) btntxt += 'Fuel : ' + data.fuel.length + ' & ';
		btntxt = '' ? '' : btntxt.substring(0, btntxt.length - 3);
	}
	return btntxt == '' ? '' : '( ' + btntxt + ' )';
};

//根据data生成接口参数内容
function getSelectorApiParams(data) {
	let typenames = '', typeids = '';
	if (isValidArray(data.vsn)) typenames = 'VSN', typeids = getStrByArrKey(data.vsn);
	else if (isValidArray(data.type)) typenames = 'TYPE', typeids = getStrByArrKey(data.type);
	else if (isValidArray(data.model)) typenames = 'Model', typeids = getStrByArrKey(data.model);
	else {
		if (isValidArray(data.brand)) typenames = 'Brand' + '|', typeids = getStrByArrKey(data.brand) + '|';
		if (isValidArray(data.body)) {
			if (isBodyOrSegment(data)) typenames += 'Body' + '|', typeids += getStrByArrKey(data.body) + '|';
			else typenames += 'Segment' + '|', typeids += getStrByArrKey(data.segment, true) + '|';
		}
		if (isValidArray(data.fuel)) typenames += 'Fuel' + '|', typeids += getStrByArrKey(data.fuel) + '|';
		typenames = '' ? '' : typenames.substring(0, typenames.length - 1);
		typeids = '' ? '' : typeids.substring(0, typeids.length - 1);
	}
	return {typenames:typenames,typeids:typeids};
};

//特殊处理data的Body和Segment
function isBodyOrSegment(data){
	let isbody = true;
	if (isValidArray(data.body)) {
		data.body.forEach(function(a){
			data.segment.forEach(function(b){
				if (b.value.startsWith(a.value) && (b.checked == undefined || !b.checked)) isbody = false;
			});
		});
	}
	return isbody;
};

//判断对象是否有效值
function isValidArray(obj){
	return (obj != undefined && obj != null && obj.length > 0)
};

//判断对象是否有效值
function isValidValue(obj){
	return (obj != undefined && obj != null && obj.toString() != '')
};

//拼接数组key属性为逗号隔开的字符串
function getStrByArrKey(arr, ischeck = false){
	let str = '';
	if (!isValidArray(arr)) return str;
	arr.forEach(function(a){
		if (ischeck) {
			if(isValidValue(a.key) && a.checked) str += a.key.toString() + ',';
		} else {
			if(isValidValue(a.key)) str += a.key.toString() + ',';
		}
		
	});
	return (str == '' ? '' : str.substring(0, str.length - 1));
};