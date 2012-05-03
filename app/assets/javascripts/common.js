var currentUser={};
var tree_id=0;
var user_id="";

var base_url = "http://218.4.152.78:8080/geoserver/wms";
var host_url = "http://218.4.152.78:8080/geoserver/cs1204/wms";

new Ajax.Request("/desktop/get_userid", { 
	method: "POST",
	onComplete:	 function(request) {
		user_id=request.responseText;
	}
});

var msg = function(title, msg){
		Ext.Msg.show({
				title: title,
				msg: msg,
				minWidth: 300,
				modal: true,
				icon: Ext.Msg.WARNING,
				buttons: Ext.Msg.OK
		});
};

//Simple Store

var rwzt_data = [
  ['0','全部'],
	['1','计划'],
	['2','执行'],
	['3','完成'],
	['4','归档']
];

var rwzt_store = new Ext.data.SimpleStore({
	fields: ['value', 'text'],
	data : rwzt_data
});

var xcqy_data = [
  ['0' ,'全部'],
  ['9' ,'尚湖镇'],
  ['10','辛庄镇'],
  ['5' ,'古里镇'],
  ['6' ,'沙家浜镇'],
  ['1' ,'虞山镇'],
  ['11','虞山林场'],
  ['3' ,'海虞镇'],
  ['4' ,'碧溪镇'],
  ['2' ,'梅李镇'],
  ['7' ,'支塘镇'],
  ['8' ,'董浜镇']
];


var xcqy_store = new Ext.data.SimpleStore({
	fields: ['value', 'text'],
	data : xcqy_data
});

var xzqmc_data = [
  ['0' ,'全部'],
  ['9' ,'尚湖镇'],
  ['10','辛庄镇'],
  ['5' ,'古里镇'],
  ['6' ,'沙家浜镇'],
  ['1' ,'虞山镇'],
  ['11','虞山林场'],
  ['3' ,'海虞镇'],
  ['4' ,'碧溪镇'],
  ['2' ,'梅李镇'],
  ['7' ,'支塘镇'],
  ['8' ,'董浜镇'],
];


var xzqmc_store = new Ext.data.SimpleStore({
	fields: ['value', 'text'],
	data : xzqmc_data
});


var xcfs_data = [
  ['1' ,'综合巡查'],
  ['2' ,'定点巡查']
];


var xcfs_store = new Ext.data.SimpleStore({
	fields: ['value', 'text'],
	data : xcfs_data
});


var nd_data = [
  ['2011' ,'2011年'],
  ['2012' ,'2012年'],
  ['2013' ,'2013年'],
  ['2014' ,'2014年'],
  ['2015' ,'2015年'],
  ['2016' ,'2016年'],
  ['2017' ,'2017年'],
  ['2018' ,'2018年']
];


var nd_store = new Ext.data.SimpleStore({
	fields: ['value', 'text'],
	data : nd_data
});


var week_data = [
  ['1' ,'第1周'],
  ['2' ,'第2周'],
  ['3' ,'第3周'],
  ['4' ,'第4周'],
  ['5' ,'第5周'],
  ['6' ,'第6周'],
  ['7' ,'第7周'],
  ['8' ,'第8周'],
  ['9' ,'第9周'],
  ['10' ,'第10周'],
  ['11' ,'第11周'],
  ['12' ,'第12周'],
  ['13' ,'第13周'],
  ['14' ,'第14周'],
  ['15' ,'第15周'],
  ['16' ,'第16周'],
  ['17' ,'第17周'],
  ['18' ,'第18周'],
  ['19' ,'第19周'],
  ['20' ,'第20周'],
  ['21' ,'第21周'],
  ['22' ,'第22周'],
  ['23' ,'第23周'],
  ['24' ,'第24周'],
  ['25' ,'第25周'],
  ['26' ,'第26周'],
  ['27' ,'第27周'],
  ['28' ,'第28周'],
  ['29' ,'第29周'],
  ['30' ,'第30周'],
  ['31' ,'第31周'],
  ['32' ,'第32周'],
  ['33' ,'第33周'],
  ['34' ,'第34周'],
  ['35' ,'第35周'],
  ['36' ,'第36周'],
  ['37' ,'第37周'],
  ['38' ,'第38周'],
  ['39' ,'第39周'],
  ['40' ,'第40周'],
  ['41' ,'第41周'],
  ['42' ,'第42周'],
  ['43' ,'第43周'],
  ['44' ,'第44周'],
  ['45' ,'第45周'],
  ['46' ,'第46周'],
  ['47' ,'第47周'],
  ['48' ,'第48周'],
  ['49' ,'第49周'],
  ['50' ,'第50周'],
  ['51' ,'第51周'],
  ['52' ,'第52周']
];


var week_store = new Ext.data.SimpleStore({
	fields: ['value', 'text'],
	data : week_data
});

var pd_data = [
  ['1','1周1次'],
  ['2','2周1次'],
  ['3','1月1次'],
];


var pd_store = new Ext.data.SimpleStore({
	fields: ['value', 'text'],
	data : pd_data
});

//======
var format = "image/png";

var SHADOW_Z_INDEX = 10;
var MARKER_Z_INDEX = 11;

var s_option0 =	 { opacity: 1,	  visibility: false, isBaseLayer: true};
var s_option1 =	 { opacity: 1,	  visibility: false, isBaseLayer: false};
var s_option2 =	 { opacity: 1,	  visibility: true, isBaseLayer: false};

var s_option3t =	 { opacity: 0.3,	visibility: true, isBaseLayer: false};
var s_option3f =	 { opacity: 0.3,	visibility: true, isBaseLayer: false};
var s_option5t =	 { opacity: 0.5,	visibility: true, isBaseLayer: false};
var s_option5f =	 { opacity: 0.5,	visibility: false, isBaseLayer: false};
var s_option5 =	 { opacity: 0.5,	visibility: false,  isBaseLayer: false, displayInLayerSwitcher: false} ;
var s_option6 =	 { opacity: 0.6,	visibility: true,  isBaseLayer: false};
var s_option8 =	 { opacity: 0.8,	visibility: true,  isBaseLayer: false};


var styles = new OpenLayers.StyleMap({
		 "default": new OpenLayers.Style(null, {
				 rules: [
						 new OpenLayers.Rule({
								 symbolizer: {
										 "Point": {
												 pointRadius: 5,
												 graphicName: "square",
												 fillColor: "white",
												 fillOpacity: 0.25,
												 strokeWidth: 1,
												 strokeOpacity: 1,
												 strokeColor: "#333333"
										 },
										 "Line": {
												 strokeWidth: 3,
												 strokeOpacity: 1,
												 //strokeColor: "#666666"
												strokeColor: "#FF0000"
										 }
								 }
						 })
				 ]
		 }),
		 "select": new OpenLayers.Style({
				 strokeColor: "#00ccff",
				 strokeWidth: 4
		 }),
		 "temporary": new OpenLayers.Style(null, {
				 rules: [
						 new OpenLayers.Rule({
								 symbolizer: {
										 "Point": {
												 pointRadius: 5,
												 graphicName: "square",
												 fillColor: "white",
												 fillOpacity: 0.25,
												 strokeWidth: 1,
												 strokeOpacity: 1,
												 strokeColor: "#333333"
										 },
										 "Line": {
												 strokeWidth: 3,
												 strokeOpacity: 1,
												 strokeColor: "#00ccff"
										 }
								 }
						 })
				 ]
		 })
});


