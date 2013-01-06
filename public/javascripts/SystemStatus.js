
MyDesktop.SystemStatus = Ext.extend(Ext.app.Module, {

  id:'systemstatus',

  init : function(){
    this.launcher = {
      text: '系统监视',
      iconCls:'systemstatus',
      handler : this.createWindow,
      scope: this
    }
  },
  
  createWindow : function(){
    
      if (currentUser.qxcode == '巡查员') {
        msg('Message','权限不够. 请与管理员联系后再试！');
        return;
      }
    
      var desktop = this.app.getDesktop();

      function showUserPosition(map, vectorLayer) {
        
        if (vectorLayer.features.length > 0){
          while (vectorLayer.features.length > 0) {
            var vectorFeature = vectorLayer.features[0];
            vectorLayer.removeFeatures(vectorFeature);
          };
        };  
        
        pars = {};
        new Ajax.Request("/desktop/get_user_position", { 
          method: "POST",
          parameters: pars,
          onComplete:  function(request) {
            var features = [];
            if (request.responseText.length > 30) {           
              var places = eval("("+request.responseText+")");
              var x_end, y_end;

              for (var k=0; k < places.length; k++) {
                place = places[k];
                var pointText = place["lon_lat"]; //13470500 3683278

                if (pointText == null || pointText == "undefined") continue;

                var id =  place["id"];
                //var icon = place["icon"];
                var username = place['username'];
                ss = pointText.match(/POINT\(([-]*\d+.\d+)\s*([-]*\d+.\d+)\)/);
                var x0 = parseFloat(ss[1]);
                var y0 = parseFloat(ss[2]);
                
                var style = new OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                style.externalGraphic = '/images/chrome.png';
                style.backgroundXOffset = 0;
                style.backgroundYOffset = 0;
                style.graphicWidth = 32;
                style.graphicHeight = 32;
                style.graphicZIndex = MARKER_Z_INDEX;
                style.backgroundGraphicZIndex= SHADOW_Z_INDEX;
                style.fillOpacity = 0.8;
                style.fillColor = "#ee4400";
                //style.graphicName = "star",
                style.pointRadius = 8;
                
                style.fontSize   = "12px";
                style.fontFamily = "Courier New, monospace";
                style.fontWeight = "bold";
                style.labelAlign = "cm";            
                style.label = username;
                style.fontColor = "black";

                features.push(
                    new OpenLayers.Feature.Vector( new OpenLayers.Geometry.Point(x0, y0), {fid: id}, style )
                );    
              }
              vectorLayer.addFeatures(features);
            }
          }
        });                       

      };

      function showUserLines(map, vectorLayer, task_id) {
        
        if (vectorLayer.features.length > 0){
          while (vectorLayer.features.length > 0) {
            var vectorFeature = vectorLayer.features[0];
            vectorLayer.removeFeatures(vectorFeature);
          };
        };  
        
        
        pars = {task_id:task_id};

        new Ajax.Request("/desktop/get_task_position", {
          method: "POST",
          parameters: pars,
          onComplete:  function(request) {

            var features = [];                        
            var places = eval("("+request.responseText+")");

            for (var k=0; k < places.length; k++) {
              var place = places[k];
              
              var pointText = place["lon_lat"]; //13470500 3683278
              var session_id= place["session_id"];
              var xcsj = place['report_at'];

              if (pointText == null || pointText == "undefined") continue;
              
              var pointList = []; 
              
              var pts = pointText.replace("LINESTRING(",'').replace(")","").split(",");
              for (var kk=0; kk < pts.length; kk++) {
                var pt = pts[kk].split(" ");
                var x0 = parseFloat(pt[0]);
                var y0 = parseFloat(pt[1]);
                var point = new OpenLayers.Geometry.Point(x0, y0);
                pointList.push(point);
              }
              
              var linearRing = new OpenLayers.Geometry.LineString(pointList);

              style_line = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default','select']);
              style_line.fillColor = "blue";
              style_line.strokeColor = "blue";
              style_line.strokeWidth = 3;

              style_line.fontSize  = "12px";
              style_line.fontFamily = "Courier New, monospace";
              style_line.fontWeight = "bold";
              style_line.labelAlign = "rb";           
              //style_line.label = '巡查时间\n2012/08/27\n21:37:27';//+xcsj;
              style_line.label = '巡查时间\n'+xcsj;
              style_line.fontColor = "blue"; 

              var lineFeature = new OpenLayers.Feature.Vector( new OpenLayers.Geometry.MultiLineString([linearRing]), {fid: session_id}, style_line);
              vectorLayer.addFeatures([lineFeature]);
              
              //move to the center of line
              var cc = pts[pts.length/2].split(" ");

              var x0 = parseFloat(cc[0]);
              var y0 = parseFloat(cc[1]);

              var lonlat = new OpenLayers.LonLat(x0, y0);
              map.panTo(lonlat,{animate: false});
              
            } 
            
          }
        });

      };
      
      //Display multiple lines
      function showUserMultiLines(map, vectorLayer, task_ids) {
        
        if (vectorLayer.features.length > 0){
          while (vectorLayer.features.length > 0) {
            var vectorFeature = vectorLayer.features[0];
            vectorLayer.removeFeatures(vectorFeature);
          };
        };
        
        if (task_ids == "") return;
        
        pars = {task_id:task_ids};

        new Ajax.Request("/desktop/get_multi_taskline", {
          method: "POST",
          parameters: pars,
          onComplete:  function(request) {

            var features = [];                        
            var places = eval("("+request.responseText+")");
            
            var colors = ["blue", "green", "red", "purple"];

            for (var k=0; k < places.length; k++) {
              var place = places[k];
              var randomnumber=Math.floor(Math.random()*4);
              var draw_color = colors[randomnumber];
              
              var pointText = place["lon_lat"]; //13470500 3683278
              var session_id= place["session_id"];
              var xcsj = place['report_at'].split(' ').join("\n");
              if (pointText == null || pointText == "undefined") continue;
              
              var pointList = []; 
              
              var pts = pointText.replace("LINESTRING(",'').replace(")","").split(",");
              for (var kk=0; kk < pts.length; kk++) {
                var pt = pts[kk].split(" ");
                var x0 = parseFloat(pt[0]);
                var y0 = parseFloat(pt[1]);
                var point = new OpenLayers.Geometry.Point(x0, y0);
                pointList.push(point);
              }
              
              var linearRing = new OpenLayers.Geometry.LineString(pointList);

              style_line = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default','select']);
              style_line.fillColor = draw_color;
              style_line.strokeColor = draw_color;
              style_line.strokeWidth = 3;

              style_line.fontSize  = "12px";
              style_line.fontFamily = "Courier New, monospace";
              style_line.fontWeight = "bold";
              style_line.labelAlign = "rb";           
              style_line.label = '巡查时间\n'+xcsj;
              style_line.fontColor = draw_color; 

              var lineFeature = new OpenLayers.Feature.Vector( new OpenLayers.Geometry.MultiLineString([linearRing]), {fid: session_id}, style_line);
              vectorLayer.addFeatures([lineFeature]);
              
              if (k == 0) {
                var half_length = Math.floor(pts.length / 2);
                var cc = pts[half_length].split(" ");
                var x0 = parseFloat(cc[0]);
                var y0 = parseFloat(cc[1]);
                //move to the center of line
                var lonlat = new OpenLayers.LonLat(x0, y0);
                map.panTo(lonlat,{animate: false});
              }

            } 

          }
        });
        
      };

      function showUsersBufferedLines(map, vectorLayer, task_id) {
        
      };
      
      function showUserMultiBufferedLines(map, vectorLayer, task_ids) {
        
      };

      var win = desktop.getWindow('systemstatus');
      
      if(!win){
        
        var loopable=false;
        var loop_data=[];
        
        //路线回放功能
        function startCheck() {
          //initialize replay data
          
          var sn = Ext.getCmp('system_status_tree_panel').getSelectionModel().getSelectedNode();
          var ss = sn.id.split("|"); 
          if  ( ss.size() < 3 ) {
            alert("请先选择一个路线！");
            return;
          }
          
          var pars = {task_id:ss[0]};
          new Ajax.Request("/desktop/get_track_points", { 
            method: "POST",
              parameters: pars,
              onComplete:  function(request) {

                if (request.responseText != '') {
                  loop_data = request.responseText.split(",")

                  //create Feature
                  var vectorLayer = markers;
                  if (vectorLayer.features.length > 0){
                    while (vectorLayer.features.length > 0) {
                      var vectorFeature = vectorLayer.features[0];
                      vectorLayer.removeFeatures(vectorFeature);
                    };
                  };

                  var style = new OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                  style.externalGraphic = '/images/police_car.png';
                  style.backgroundXOffset = 0;
                  style.backgroundYOffset = -7;
                  style.graphicZIndex = MARKER_Z_INDEX;
                  style.backgroundGraphicZIndex= SHADOW_Z_INDEX;
                  style.fillOpacity = 1;
                  style.pointRadius = 20;
                  //vectorLayer.styleMap.styles.default.defaultStyle.externalGraphic = '/images/avatar/monkey.png';

                  var pts = loop_data[0].split(" ");
                  var x0 = parseFloat(pts[0]);
                  var y0 = parseFloat(pts[1]);

                  var feature = new OpenLayers.Feature.Vector( new OpenLayers.Geometry.Point(x0, y0), {fid: 20}, style )

                  vectorLayer.addFeatures([feature]);

                  //Start Move
                  if (!loopable) {
                    loopable = true;
                    loopCheck(0,loopable);
                  }
                }
              }
          });

        };

        function stopCheck() {
          loopable = false;
        };

        function loopCheck(sf,lp) {

          //if (loopCheck == false) return;

          if (lp) {
            //move to new position
            var pts = loop_data[sf].split(" ");

            var x0 = parseFloat(pts[0]);
            var y0 = parseFloat(pts[1]);

            var vectorLayer = markers;
            var vectorFeature = vectorLayer.features[0];

            vectorFeature.move(new OpenLayers.LonLat(x0, y0));

            //Set Delay
            sf = sf +1;
            if (sf==loop_data.length) {
              sf = 0;
              td = 5*1000  //60s 
            } else {
              td = 1*1000
            }

            var f = function() { loopCheck(sf,loopable); };
            var t = setTimeout(f,td);
          }
        };
        
        //maps here 
        var options = {
          projection: new OpenLayers.Projection('EPSG:900913'), units: "m", maxResolution: 152.87405654296876,
          maxExtent: new OpenLayers.Bounds(-2.003750834E7,-2.003750834E7,2.003750834E7,2.003750834E7) 
        };
        
        var map  = new OpenLayers.Map($('task_track'), options);
        
        var gmap = new OpenLayers.Layer.Google(
            "谷歌地图", // the default
            {numZoomLevels: 20}
        );
        var gsat = new OpenLayers.Layer.Google(
            "谷歌卫星图",
            {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
        );
        var gphy = new OpenLayers.Layer.Google(
            "谷歌地形图",
            {type: google.maps.MapTypeId.TERRAIN}
        );          

        //var sat = new OpenLayers.Layer.WMS("航拍地图", base_url,  
        //    { layers: 'wxgt:wx_image2', srs: 'EPSG:900913', transparent: true, format: format }, s_option8);

        map.addLayers([gmap, gphy, gsat]);

        var xmdks_map = new OpenLayers.Layer.WMS("项目地块", base_url, 
          { layers: 'cs1204:xmdk', srs: 'EPSG:900913', transparent: true, format: format }, s_option8);

        var dltb = new OpenLayers.Layer.WMS("二调数据", base_url, 
          { layers: 'cs1204:dltb', srs: 'EPSG:900913', transparent: true, format: format }, s_option8f);

        var dltb_m = new OpenLayers.Layer.WMS("二调数据2", base_url, 
            { layers: 'cs1204:dltb_m', srs: 'EPSG:900913', transparent: true, format: format }, s_option8);

        
        map.addLayers([dltb, dltb_m, xmdks_map]);
        
        //map.addLayers([dltb, dltb_m]);
        
        var xmdk_vectors = new OpenLayers.Layer.Vector("任务地块", {
            isBaseLayer: false,
            styleMap: styles
        });
        
        var markers = new OpenLayers.Layer.Vector("巡查车", {
                styleMap: new OpenLayers.StyleMap({
                    // Set the external graphic and background graphic images.
                    externalGraphic:   "/images/marker-gold.png",
                    backgroundGraphic: "/images/marker_shadow.png",

                    // Makes sure the background graphic is placed correctly relative
                    // to the external graphic.
                    backgroundXOffset: 0,
                    backgroundYOffset: -7,

                    // Set the z-indexes of both graphics to make sure the background
                    // graphics stay in the background (shadows on top of markers looks
                    // odd; let's not do that).
                    graphicZIndex: MARKER_Z_INDEX,
                    backgroundGraphicZIndex: SHADOW_Z_INDEX,

                    pointRadius: 10
                }),
                isBaseLayer: false,
                opacity: 0.8,
                rendererOptions: {yOrdering: true}
        });

        var vectors = new OpenLayers.Layer.Vector("用户位置", {
            isBaseLayer: false,
            styleMap: styles
        });

        var vectorLines = new OpenLayers.Layer.Vector("用户路线", {
            isBaseLayer: false,
            styleMap: styles
        });

        map.addLayers([xmdk_vectors,  vectorLines, vectors, markers]);
        
        var layserSwitch = new OpenLayers.Control.LayerSwitcher();
        
        map.events.register("changebaselayer", map, function (e) {
          //alert("visibility changed (" + e.layer.name + ")");
          if (e.layer.name == '谷歌卫星图') {
            map.getLayersByName('二调数据2')[0].setVisibility(false);
            map.getLayersByName('二调数据')[0].setVisibility(true);
          }else{
            map.getLayersByName('二调数据2')[0].setVisibility(true);
            map.getLayersByName('二调数据')[0].setVisibility(false);
          }
        });
        
        var map_view = new Ext.Panel({
          id : 'task_track',
          autoScroll: true,
          xtype:"panel",
          //width:780,
          height:600,
          style:'margin:0px 0px',
          layout:'fit',
          tbar:[{
            text:'刷新人员',
            iconCls : 'user16',
            handler : function() {
              showUserPosition(map,vectors);
            }
          },{
            text:'路线回放',
            iconCls : 'route16',
            handler : function() {
              startCheck();
            }
          }],
          items: [{
              xtype: 'gx_mappanel',
              map: map
          }]
        });
        
 
        var phone_store = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: '/desktop/get_phone_list'
            }),
            reader: new Ext.data.JsonReader({
              totalProperty: 'results', 
              root: 'rows',             
              fields: [
                {name: 'id',        type: 'integer'},
                {name: 'zt',        type: 'string'},
                {name: 'username',  type: 'string'},
                {name: 'lon_lat',   type: 'string'},
                {name: 'report_at',   type: 'date', dateFormat: 'Y-m-d H:i:s'}
              ]    
            }),
            sortInfo:{field: 'id', direction: "ASC"}
        });
        
        phone_store.load();
        
        function renderZt(val) {
            if (val == 't') {
              return '<img src="/images/people_16_online.png">';
            } else {
              return '<img src="/images/people_16_offline.png">';
            }
        };
        
        var phone_grid = new Ext.grid.GridPanel({
          id: 'phone_grid_id',
          store: phone_store,
          columns: [
            { header : 'id',  width : 75, sortable : true, dataIndex: 'id', hidden:true},
            { header : '',  width : 30, sortable : true, dataIndex: 'zt',  renderer:renderZt},
            { header : '人员',  width : 50, sortable : true, dataIndex: 'username'},
            { header : '时间',  width : 150, sortable : true, dataIndex: 'report_at', renderer: Ext.util.Format.dateRenderer('Y/m/d H:i:s')},
            { header : '手机',  width : 100, sortable : true, dataIndex: 'device', hidden:'true'}
            ],
          columnLines: true,
          layout:'fit',
          viewConfig: {
            stripeRows:true
          },
          tbar:[]
        });
        
        phone_grid.on('rowclick', function(grid, row, e){
          var data = grid.store.data.items[row].data;
          pointText = data.lon_lat;
          ss = pointText.match(/POINT\(([-]*\d+.\d+)\s*([-]*\d+.\d+)\)/);
          
          var x0 = parseFloat(ss[1]);
          var y0 = parseFloat(ss[2]);

          var lonlat = new OpenLayers.LonLat(x0, y0);
          map.panTo(lonlat,{animate: false});
        });
        
        var phone_panel = new Ext.Panel({
          id : 'phone_panel_id',
          autoScroll: true,
          xtype:"panel",
          width:250,
          height:600,
          style:'margin:0px 0px',
          layout:'fit',
          tbar:[{
            text:'在线人员',
            iconCls : 'user16',
            handler : function() {
              phone_store.baseParams.zt='执行';
              phone_store.load();
            }
          },{
            text:'全部人员',
            iconCls : 'user16',
            handler : function() {
              phone_store.baseParams.zt='全部';
              phone_store.load();
            }            
          }],
          items: [phone_grid]
        });
 

        var treePanel =  new Ext.tree.TreePanel({
          useArrows:true,
          animate:true,
          enableDD:true,
          singleExpand:true,
          id : 'system_status_tree_panel',
          checkModel: 'cascade',   
          onlyLeafCheckable: false,
          collapsible: true,
          collapseMode:'mini',
          rootVisible : false,
          loader: new Ext.tree.TreeLoader({
            dataUrl: '/desktop/get_phone_tree'
            //baseAttrs: { uiProvider: Ext.ux.TreeCheckNodeUI } 
          }),
          root: {
            nodeType: 'async',
            text: '常熟国土',
            draggable:false,
            id:'root'
          }
        });
        
        
        //treePanel.expandAll();
        
        treePanel.on('click', function(node, e){
          //e.preventDefault();
          //menu1.showAt(e.getXY());
          //var data = grid.store.data.items[row].data;
          var datas = node.id.split('|')
          
          if (datas.size() == 2) {
            var task_ids = ''
            
            /*
            pointText = datas[1];
            ss = pointText.match(/POINT\(([-]*\d+.\d+)\s*([-]*\d+.\d+)\)/);
            var x0 = parseFloat(ss[1]);
            var y0 = parseFloat(ss[2]);
            var lonlat = new OpenLayers.LonLat(x0, y0);
            map.panTo(lonlat,{animate: false});
            */
            
            node.eachChild(function(n) {
              if (n.attributes.checked) task_ids = task_ids + n.id.split('|')[0] + ',';
            });
            
            showUserMultiLines(map,vectorLines,task_ids);
            
          } else if (datas.size() == 3) {
            showUserLines(map,vectorLines,datas[0]);
          }
        });
        
        treePanel.on('checkchange', function(node, checked) {
            var datas = node.id.split('|');
            if (datas.size() == 2) {   //中间级别
              
              //node.childNodes.eachChild(function(n){
              //  n.set('checked', checked);
              //});
              
              node.eachChild(function(n) {
                  n.getUI().toggleCheck(checked);
              });
            }
        });
        
        
        win = desktop.createWindow({
            id: 'systemstatus',
            title:'系统监视',
            width:1050,
            height:550,
            x : 100,
            y : 30,
            maximized:true,
            iconCls: 'systemstatus',
            animCollapse:false,
            border: false,
            hideMode: 'offsets',
            layout: 'border',
            items:[{
                region:"center",
                layout:"fit",
                items:[map_view]
              },{
                region:"east",
                width:250,
                split:true,
                collapsible:true,
                titleCollapse:true,
                layout:"fit",
                items:[treePanel]
              }]
        });
      };
      
      
      map.addControl(layserSwitch);
      map.addControl(new OpenLayers.Control.MousePosition());
      var zoomLevel = 12;
      map.setCenter(new OpenLayers.LonLat(CENTER_LON,CENTER_LAT), zoomLevel);
      
      win.show();
      
      showUserPosition(map,vectors);
      
      return win;
  }
});

