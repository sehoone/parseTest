/**
 * 
 */

/*
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
*/

function init_csvToJson(){
	
}

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
/*
function getAllSelectedNodesText(jsTree) {
	   // this returns ids of all selected nodes
	   var selectedNodes = jsTree.jstree("get_selected"); 

	   var allText = [];

	   // Go through all selected nodes to get text (jquery)
	   $.each(selectedNodes, function (i, nodeId) {
	       var node = jsTree.jstree("get_node", nodeId);
	       allText.push(node.text); // Add text to array
	   });

	   return allText.join(); // This will join all entries with comma
	}

function getNodeById(id, node){
    var reduce = [].reduce;
    function runner(result, node){
        if(result || !node) return result;
        return node.id === id && node || //is this the proper node?
            runner(null, node.children) || //process this nodes children
            reduce.call(Object(node), runner, result);  //maybe this is some ArrayLike Structure
    }
    return runner(null, node);
}

function uiGetParents(loSelectedNode) {
    try {
        var loData = [];
        var lnLevel = loSelectedNode.node.parents.length;
        var lsSelectedID = loSelectedNode.node.id;
        var loParent = $("#" + lsSelectedID);
        var lsParents = loSelectedNode.node.text + ' >';
        for (var ln = 0; ln <= lnLevel - 1 ; ln++) {
            var loParent = loParent.parent().parent();
            if (loParent.children()[1] != undefined) {
                lsParents += loParent.children()[1].text + " > ";
                loData.push(loParent.children()[1].text);
            }
        }
        if (lsParents.length > 0) {
            lsParents = lsParents.substring(0, lsParents.length - 1);
        }
        //alert(lsParents);
        //alert(loData.reverse());
    }
    catch (err) {
        alert('Error in uiGetParents');
    }
}*/

$('#tagTree').jstree({
	'core' : {
		'data' : tagTreeJson
	},
    "checkbox": {
        "keep_selected_style": false
    },
        "plugins": ["checkbox"]
});


$(document).ready(function() {
	
	init_csvToJson();
	
	/*
	$('#tagTree').on('select_node.jstree', function (e, data) {
	    var loMainSelected = data;
	    uiGetParents(loMainSelected);
	});
	
	$('#tagTree').on('deselect_node.jstree', function (e, data) {
	    //var loMainSelected = data;
	    //uiGetParents(loMainSelected);
	});*/
	$('#allText').click(function() {
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
	 
	            // Total over all pages
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
 
	            $('#sumEvent').text('이벤트합계  : '+ totalEvent);
	            $('#sumUser').text('사용자합계  : '+ totalUser);
	        }
		});
	});
});
