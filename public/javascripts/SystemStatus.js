/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

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
      var win = desktop.getWindow('systemstatus');
      if(!win){
        
        function showUserPosition(map, vectorLayer) {
          
          if (vectorLayer.features.length > 0){
            while (vectorLayer.features.length > 0) {
              var vectorFeature = vectorLayer.features[0];
              vectorLayer.removeFeatures(vectorFeature);
            };
          };  
          
          pars = {};
          new Ajax.Request("/desktop/get_task_position", { 
            method: "POST",
            parameters: pars,
            onComplete:  function(request) {
              //"[{\"report_at\":\"2012-05-03 17:46:19\",\"device\":\" 8618621361840\",\"astext\":\"POINT(13439889.5503971 3723340.88865353)\",\"username\":\"\\u9ad8\\u98de\",\"id\":184}]"
              //[{"users":{"lon_lat":"13470500 3683278","id":32,"icon":"monkey.png","color":"#800000"}}]
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
                  ss = pointText.match(/POINT\((\d+.\d+)\s*(\d+.\d+)\)/);
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
        
        //maps here 
        var options = {
          projection: new OpenLayers.Projection('EPSG:900913'), units: "m", maxResolution: 152.87405654296876,
          maxExtent: new OpenLayers.Bounds(-2.003750834E7,-2.003750834E7,2.003750834E7,2.003750834E7) 
        };
        
        var map  = new OpenLayers.Map($('task_track'), options);
        //var gsat = new OpenLayers.Layer.Google("谷歌卫星图", {type: G_HYBRID_MAP, "sphericalMercator": true,  opacity: 1, numZoomLevels: 20});
        //var gmap = new OpenLayers.Layer.Google("谷歌地图", {type: G_NORMAL_MAP, "sphericalMercator": true,   opacity: 1, numZoomLevels: 20});
        
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

        map.addLayers([gmap, gphy, gsat]);

        var xmdks_map = new OpenLayers.Layer.WMS("项目地块", base_url, 
          { layers: 'cs1204:xmdk', srs: 'EPSG:900913', transparent: true, format: format }, s_option8);

        var dltb = new OpenLayers.Layer.WMS("二调数据", base_url, 
          { layers: 'cs1204:dltb', srs: 'EPSG:900913', transparent: true, format: format }, s_option8f);

        var dltb_m = new OpenLayers.Layer.WMS("二调数据2", base_url, 
            { layers: 'cs1204:dltb_m', srs: 'EPSG:900913', transparent: true, format: format }, s_option8);

        
        map.addLayers([dltb, dltb_m, xmdks_map]);

        var xmdk_vectors = new OpenLayers.Layer.Vector("任务地块", {
            isBaseLayer: false,
            styleMap: styles
        });
        
        var markers = new OpenLayers.Layer.Vector("巡查点标记", {
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

        map.addLayers([xmdk_vectors, vectors, markers]);
        
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
        
        
        /*
        var mapPanel = new GeoExt.MapPanel({
            title: "GeoExt MapPanel",
            stateId: "mappanel",
            height: 400,
            width: 600,
            map: map,
            center: new OpenLayers.LonLat(5, 45),
            zoom: 4,
            // getState and applyState are overloaded so panel size
            // can be stored and restored
            getState: function() {
                var state = GeoExt.MapPanel.prototype.getState.apply(this);
                state.width = this.getSize().width;
                state.height = this.getSize().height;
                return state;
            },
            applyState: function(state) {
                GeoExt.MapPanel.prototype.applyState.apply(this, arguments);
                this.width = state.width;
                this.height = state.height;
            }
        });
        */
        
        var map_view = new Ext.Panel({
          id : 'task_track',
          autoScroll: true,
          xtype:"panel",
          width:500,
          height:500,
          style:'margin:0px 0px',
          layout:'fit',
          tbar:[{
            text:'刷新人员',
            handler : function() {
              showUserPosition(map,vectors);
            }
          }],
          items: [{
              //xtype: 'mapcomponent',
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
                {name: 'username',  type: 'string'},
                {name: 'device',    type: 'string'},
                {name: 'lon_lat',   type: 'string'},
                {name: 'report_at',   type: 'date', dateFormat: 'Y-m-d H:i:s'}
              ]    
            }),
            sortInfo:{field: 'id', direction: "ASC"}
        });
        
        phone_store.load();
        
        var phone_grid = new Ext.grid.GridPanel({
          id: 'phone_grid_id',
          store: phone_store,
          columns: [
            //sm,
            { header : 'id',  width : 75, sortable : true, dataIndex: 'id', hidden:true},
            { header : '人员',  width : 50, sortable : true, dataIndex: 'username'},
            { header : '电话',  width : 100, sortable : true, dataIndex: 'device'},
            { header : '时间',  width : 100, sortable : true, dataIndex: 'report_at', renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')},
            ],
          //sm:sm,  
          columnLines: true,
          layout:'fit',
          viewConfig: {
            stripeRows:true,
          },
          tbar:[]
        });
        
        phone_grid.on('rowclick', function(grid, row, e){
          var data = grid.store.data.items[row].data;
          pointText = data.lon_lat;
          ss = pointText.match(/POINT\((\d+.\d+)\s*(\d+.\d+)\)/);
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
          height:500,
          style:'margin:0px 0px',
          layout:'fit',
          tbar:[{
            text:'刷新人员',
            handler : function() {
              phone_store.load();
            }
          }],
          items: [phone_grid]
        });
        
        
        win = desktop.createWindow({
            id: 'systemstatus',
            title:'系统监视',
            width:850,
            height:600,
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
                //title:"east",
                width:250,
                split:true,
                collapsible:true,
                titleCollapse:true,
                layout:"fit",
                items:[phone_panel]
              }]
        });
      };
      
      
      map.addControl(layserSwitch);
      map.addControl(new OpenLayers.Control.MousePosition());
      var zoomLevel = 14;
      map.setCenter(new OpenLayers.LonLat(13433632.3955943,3715923.24566449), zoomLevel);
      
      win.show();
      showUserPosition(map,vectors);
      return win;
  }
});

