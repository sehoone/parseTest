/**
 * 
 */
var csv = $('#csv').val();
var arrayOfLine = csv.split('\n');
var resultJson = {};
var title = '';
var arraName = '';
var jsonArrayStr = '';

$.each(arrayOfLine, function(index, item) {
	if (item.startsWith('#')) {
		title = item;
		resultJson[title] = {};
		return;
	}
	;

	var itemStr = item + '\n';
	if (jsonArrayStr == '' && item.length > 0) {
		arraName = item;
	}

	if (itemStr.length == 1) {
		resultJson[title][title + ' ' + arraName] = CSVJSON.csv2json(
				jsonArrayStr, {
					parseNumbers : true
				});
		jsonArrayStr = '';
		return;
	}
	jsonArrayStr += itemStr;

});

var labeldata = [];
var chrtdata = [];

var cdata = resultJson['# tag #']['# tag # N일,이벤트 수'];
for (var i = 0; i < cdata.length; i++) {
	var cdataVal = cdata[i];
	labeldata.push(cdataVal['N일']);
	chrtdata.push(cdataVal['이벤트 수']);
}

var ctx = document.getElementById("lineChart");
var lineChart = new Chart(ctx, {
	type : 'line',
	data : {
		labels : labeldata,
		datasets : [ {
			label : "tag",
			backgroundColor : "rgba(38, 185, 154, 0.31)",
			borderColor : "rgba(38, 185, 154, 0.7)",
			pointBorderColor : "rgba(38, 185, 154, 0.7)",
			pointBackgroundColor : "rgba(38, 185, 154, 0.7)",
			pointHoverBackgroundColor : "#fff",
			pointHoverBorderColor : "rgba(220,220,220,1)",
			pointBorderWidth : 1,
			data : chrtdata
		} ]
	},
});

var tagTableData = resultJson['# tag #']['# tag # 맞춤 매개변수,이벤트 수,사용자'];
$('#tagTable').DataTable({
	data : tagTableData,
	columns : [ {
		"data" : "맞춤 매개변수"
	}, {
		"data" : "이벤트 수"
	}, {
		"data" : "사용자"
	} ]
});


var vectorChartData = resultJson['# 이벤트 위치 #']['# 이벤트 위치 # 국가 ID,이벤트 수'];
console.log('vectorChartData' + JSON.stringify(vectorChartData, null, 2));
var vectorChartJsObj = {};
for (var i = 0; i < vectorChartData.length; i++) {
	var cdataVal = vectorChartData[i];
	console.log('cdataVal' + JSON.stringify(cdataVal, null, 2));
	vectorChartJsObj[cdataVal['국가 ID'].toLowerCase()] = cdataVal['이벤트 수'] 
}
console.log('vectorChartJsObj' + JSON.stringify(vectorChartJsObj, null, 2));
$('#world-map-gdp').vectorMap({
	
	map: 'world_en',
	backgroundColor: null,
	color: '#ffffff',
	hoverOpacity: 0.7,
	selectedColor: '#666666',
	enableZoom: true,
	//showTooltip: true,
	values: vectorChartJsObj,
	scaleColors: ['#E6F2F0', '#149B7E'],
	normalizeFunction: 'polynomial',
	onRegionTipShow: function(element, code, region){
		element.html(element.html()+' (eventCnt - '+vectorChartJsObj[code]+')');
	  }
/*
        map: 'world_mill',
        series: {
          regions: [{
            values: vectorChartJsObj,
            scale: ['#C8EEFF', '#0071A4'],
            normalizeFunction: 'polynomial'
          }]
        },
        onRegionTipShow: function(e, el, code){
          el.html(el.html()+' (GDP - '+vectorChartJsObj[code]+')');
        }*/
});
