var currentUser={};
var tree_id=0;
var user_id="";

//var base_url = "http://10.5.6.23:8080/geoserver/wms";
//var host_url = "http://10.5.6.23:8080/geoserver/cs1204/wms";

//var base_url = "http://127.0.0.1:8080/geoserver/wms";
//var host_url = "http://127.0.0.1:8080/geoserver/cs1204/wms";

/*======================   常熟  ===========================

var base_url = "http://218.4.152.78:8080/geoserver/wms";
var host_url = "http://218.4.152.78:8080/geoserver/cs1204/wms";

var CENTER_LON = 13433632.3955943;
var CENTER_LAT = 3715923.24566449;

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
  ['8' ,'董浜镇'],
  ['12','沿江开发区'],
  ['13','东南开发区']
];

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
  ['12','沿江分局'],
  ['13', '东南分局']
];

/*------------------------------------------------------*/


/*======================   铜山  ===========================

var base_url = "http://papas2012.dyndns.org:8081/geoserver/wms";
var host_url = "http://papas2012.dyndns.org:8081/geoserver/cs1204/wms";

var CENTER_LON = 13066177.06;
var CENTER_LAT = 4046801.12;


var xcqy_data = [
  ['0' ,'全部'],
  ['1' ,'铜山区']
];  

var xzqmc_data = [
  ['0' ,'全部'],
  ['1' ,'铜山区']
];

/*------------------------------------------------------*/

/*======================   吴江 ===========================
// 吴江
var base_url = "http://221.224.5.253:8080/geoserver/wms";
var host_url = "http://221.224.5.253:8080/geoserver/cs1204/wms";


var CENTER_LON = 13429605.3955943;
var CENTER_LAT = 3652718.24566449;

var xcqy_data = [
  ['0' ,'全部'],
  ['1' ,'吴江区']
];  

var xzqmc_data = [
  ['0' ,'全部'],
  ['1' ,'吴江区']
];

/*------------------------------------------------------*/

/*======================   无锡 ===========================*/
// 
var CENTER_LON = 13399355.384;
var CENTER_LAT =  3709100.655;

var base_url = "http://192.168.106.129:8080/geoserver/wms";
var host_url = "http://192.168.106.129:8080/geoserver/cs1204/wms";

var xcqy_data = [
  ['0','全部'],
  ['1','崇安区'  ],
  ['2','南长区'  ],
  ['3','北塘区'  ],
  ['4','滨湖区'  ],
  ['5','无锡新区' ],
  ['6','惠山区'  ],
  ['7','锡山区'  ]
];

var xzqmc_data = [
  ['0','全部'],
  ['1', '崇安分局'  ],
  ['2', '南长分局'  ],
  ['3', '北塘分局'  ],
  ['4', '滨湖分局'  ],
  ['5', '新区分局' ],
  ['6', '惠山分局'  ],
  ['7', '锡山分局'  ]
];

/*------------------------------------------------------*/
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

var xcgl_data = [
  ['0','全部'],
  ['1','已巡查'  ],
  ['2','未巡查'  ],
];

var xcgl_store = new Ext.data.SimpleStore({
	fields: ['value', 'text'],
	data : xcgl_data
});

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


var xcqy_store = new Ext.data.SimpleStore({
	fields: ['value', 'text'],
	data : xcqy_data
});

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


var yd_data = [
  ['全部','全部'],
  ['1' ,'1月'],
  ['2' ,'2月'],
  ['3' ,'3月'],
  ['4' ,'4月'],
  ['5' ,'5月'],
  ['6' ,'6月'],
  ['7' ,'7月'],
  ['8' ,'8月'],
  ['9' ,'9月'],
  ['10' ,'10月'],
  ['11' ,'11月'],
  ['12' ,'12月']
];


var yd_store = new Ext.data.SimpleStore({
	fields: ['value', 'text'],
	data : yd_data
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
  ['0','1周2次'],
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
var s_option8f =	 { opacity: 0.8,	visibility: false,  isBaseLayer: false};


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



function getLastDay(year,month) {         
   var new_year = year;    //取当前的年份          
   var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）          
   if(month>12) {         
    new_month -=12;        //月份减          
    new_year++;            //年份增          
   }         
   var new_date = new Date(new_year,new_month,1);                //取当年当月中的第一天          
   return (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期          
}


function to_mu(area) {
  return (parseFloat(area)/666.666666).toFixed(2);
}

function to_km(length) {
  return (parseFloat(length)/1000.0).toFixed(2);
}

function to_pm(area) {
  return (parseFloat(area)*666.666666).toFixed(0);
}

