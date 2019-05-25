/**
 * Firebase Report custom event JS
 * 
 */

function init_csvToJson(){
	var csv = $('#csv').val();
	var arrayOfLine = csv.split('\n');
	var resultJson = {};
	var title = '';
	var arraName = '';
	var jsonArrayStr = '';

	$.each(arrayOfLine, function(index, item) {
		// #으로 시작 하면 해당 영역의 타이틀
		if (item.startsWith('#')) {
			title = item;
			resultJson[title] = {};
			return;
		}

		var itemStr = item + '\n';
		// 줄바꿈이 되어 있으면 새로운 Array가 있거나, 다른영역
		if (jsonArrayStr == '' && item.length > 0) {
			arraName = item;
		}

		// 줄바꿈이 있으면 Array영역이 끝난것으로 CSV를 JSON으로 포맷팅 처리 
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
	return resultJson;
}

function init_tagChart(resultJson){
	var labeldata = [];
	var chrtdata = [];

	var cdata = resultJson['# tag #']['# tag # N일,이벤트 수'];
	for (var i = 0; i < cdata.length; i++) {
		var cdataVal = cdata[i];
		labeldata.push(parseInt(cdataVal['N일']));
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
}

function init_tagTable(resultJson){
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
}

function init_eventLocationChart(resultJson){
	var vectorChartData = resultJson['# 이벤트 위치 #']['# 이벤트 위치 # 국가 ID,이벤트 수'];
	var vectorChartJsObj = {};
	for (var i = 0; i < vectorChartData.length; i++) {
		var cdataVal = vectorChartData[i];
		vectorChartJsObj[cdataVal['국가 ID'].toLowerCase()] = cdataVal['이벤트 수'] 
	}
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
	});
}

function init_tagTree(resultJson){
	var tagTreeData = resultJson['# tag #']['# tag # 맞춤 매개변수,이벤트 수,사용자'];

	var tagTreeShuitArr = [];
	for (var i = 0; i < tagTreeData.length; i++) {
		tagTreeShuitArr.push( tagTreeData[i]['맞춤 매개변수'] );
	}
	var tagTreeJson = []
	tagTreeShuitArr.forEach(function (item, index, array) {
	    var keys = item.split(':'),
	    last = keys.pop();

	keys.reduce(function (r, k) {
	    if (!r[k]) {
	        r[k] = { _: [] };
	        r._.push({ text: k, children: r[k]._ });
	    }
	    return r[k];
	}, this)._.push({ text: last });
	}, { _: tagTreeJson });

	$('#tagTree').jstree({
		'core' : {
			'data' : tagTreeJson
		},
	    "checkbox": {
	        "keep_selected_style": false
	    },
	        "plugins": ["checkbox"]
	});

}

function makeSerchTagTable(resultJson){
	$('#searchTagTable').DataTable().destroy();
	var selectTagDeptVal = []; 
	var node=$('#tagTree').jstree("get_selected", true);
	$.each(node, function (i, item) {
		selectTagDeptVal.push($('#tagTree').jstree().get_path(node[i], ':'));
	   });
	var searchTagTableData = resultJson['# tag #']['# tag # 맞춤 매개변수,이벤트 수,사용자'];
	var searchedTagTableData = [];
	
	$.each(searchTagTableData, function (i, item) {
		
		var suiteVal = item['맞춤 매개변수'];
		if(selectTagDeptVal.includes(suiteVal)){
			
			searchedTagTableData.push(item);
		}
	   });
	
	$('#searchTagTable').DataTable({
		data : searchedTagTableData,
		columns : [ {
			"data" : "맞춤 매개변수"
		}, {
			"data" : "이벤트 수"
		}, {
			"data" : "사용자"
		} ],
		searching: false,
		drawCallback: function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // Remove the formatting to get integer data for summation
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
 
            totalEvent = api
                .column( 1 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
 
            totalUser = api
            .column( 2 )
            .data()
            .reduce( function (a, b) {
                return intVal(a) + intVal(b);
            }, 0 );

            $('#sumEvent').text('이벤트 합계  : '+ totalEvent);
            $('#sumUser').text('사용자 합계  : '+ totalUser);
        }
	});
}

$(document).ready(function() {
	
	// CSV to JSON object
	var importCsvToJsonObj = init_csvToJson();
	// tag 그래프 생성
	init_tagChart(importCsvToJsonObj);
	// tag 테이블 생성
	init_tagTable(importCsvToJsonObj);
	// tag 트리 생성
	init_tagTree(importCsvToJsonObj);
	// 이벤트위치 그래프 생성
	//init_eventLocationChart(importCsvToJsonObj);
	
	$('#allText').click(function() {
		// tag tree에서 선택한 테이블 생성
		makeSerchTagTable(importCsvToJsonObj);
	});
});
