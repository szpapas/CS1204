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
                  //style.externalGraphic = '/assets/avator/'+icon;
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
                  style.fontColor = "blue";

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

        map.addLayers([gphy,gmap, gsat]);

        var xmdk_vectors = new OpenLayers.Layer.Vector("任务地块", {
            isBaseLayer: false,
            styleMap: styles
        });

        var xmdks_map = new OpenLayers.Layer.WMS("项目地块", host_url, 
          { layers: 'cs1204:xmdk', srs: 'EPSG:900913', transparent: true, format: format }, s_option8);
        map.addLayers([xmdks_map]);


        var markers = new OpenLayers.Layer.Vector("巡查点标记", {
                styleMap: new OpenLayers.StyleMap({
                    // Set the external graphic and background graphic images.
                    externalGraphic:   "/assets/marker-gold.png",
                    backgroundGraphic: "/assets/marker_shadow.png",

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
                opacity: 1,
                rendererOptions: {yOrdering: true}
        });

        var vectors = new OpenLayers.Layer.Vector("用户位置", {
            isBaseLayer: false,
            styleMap: styles
        });

        map.addLayers([xmdk_vectors, vectors, markers]);

        map.addControl(new OpenLayers.Control.LayerSwitcher());
        map.addControl(new OpenLayers.Control.MousePosition());
        
        var zoomLevel = 14;
        map.setCenter(new OpenLayers.LonLat(13433632.3955943,3715923.24566449), zoomLevel);
        
        var map_view = new Ext.Panel({
          id : 'task_track',
          autoScroll: true,
          xtype:"panel",
          width:600,
          height:600,
          style:'margin:0px 0px',
          layout:'fit',
          tbar:[{
            text:'刷新人员',
            handler : function() {
              showUserPosition(map,vectors);
            }
          }],
          items: [{
              xtype: 'mapcomponent',
              map: map
          }]
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
                title:"center",
                layout:"fit",
                items:[map_view]
              },{
                region:"east",
                title:"east",
                width:250,
                split:true,
                collapsible:true,
                titleCollapse:true
              }]
        });
      
      }
      win.show();
      return win;
  }
});

