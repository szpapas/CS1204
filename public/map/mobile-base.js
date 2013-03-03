// API key for http://openlayers.org. Please get your own at
// http://bingmapsportal.com/ and use that instead.
var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";

// initialize map when page ready
var map;
var gg = new OpenLayers.Projection("EPSG:4326");
var sm = new OpenLayers.Projection("EPSG:900913");

var init = function (onSelectFeatureFunction) {

    var vector = new OpenLayers.Layer.Vector("标记图层", {});
    
    var vectors = new OpenLayers.Layer.Vector('测量图层', {
        styleMap: new OpenLayers.StyleMap({
            temporary: OpenLayers.Util.applyDefaults({
                pointRadius: 16
            }, OpenLayers.Feature.Vector.style.temporary)
        })
    });
    
    var toolbar = new OpenLayers.Control.Panel({
        displayClass: 'olControlEditingToolbar'
    });
    
    var DeleteFeature = OpenLayers.Class(OpenLayers.Control, {
        initialize: function(layer, options) {
            OpenLayers.Control.prototype.initialize.apply(this, [options]);
            this.layer = layer;
            this.handler = new OpenLayers.Handler.Feature(
                this, layer, {click: this.clickFeature}
            );
        },
        clickFeature: function(feature) {
            // if feature doesn't have a fid, destroy it
            if(feature.fid == undefined) {
                this.layer.destroyFeatures([feature]);
            } else {
                feature.state = OpenLayers.State.DELETE;
                this.layer.events.triggerEvent("afterfeaturemodified", {feature: feature});
                feature.renderIntent = "select";
                this.layer.drawFeature(feature);
            }
        },
        setMap: function(map) {
            this.handler.setMap(map);
            OpenLayers.Control.prototype.setMap.apply(this, arguments);
        },
        CLASS_NAME: "OpenLayers.Control.DeleteFeature"
    });
    
    
    var navigate = new OpenLayers.Control.Navigation({
        title: "移动地图"
    });

    var drawPoly = new OpenLayers.Control.DrawFeature(vectors, OpenLayers.Handler.Polygon, {
        title: "多边形",
        displayClass: "olControlDrawFeaturePolygon",
        handlerOptions: {multi: false}
    });

    var edit = new OpenLayers.Control.ModifyFeature(vectors, {
        title: "修改图形",
        displayClass: 'olControlDrawFeaturePath'
    });
    
    var del = new DeleteFeature(vectors, {
        title: "删除图形", 
        displayClass: "olControlDrawFeaturePoint" 
    });


    function numberWithCommas(x) {
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    function showTips( tips, height, time ){
      var windowWidth  = document.documentElement.clientWidth;
      var tipsDiv = '<div class="tipsClass">' + tips + '</div>';

      $( 'body' ).append( tipsDiv );
      $( 'div.tipsClass' ).css({
          'top'       : height + 'px',
          'left'      : '20px',
          'position'  : 'absolute',
          'padding'   : '3px 5px',
          'background': '#8FBC8F',
          'font-size' : '18px',
          'margin'    : '0 auto',
          'text-align': 'center',
          'width'     : 'auto',
          'color'     : '#fff',
          'opacity'   : '0.8'
      }).show();
      setTimeout( function(){$( 'div.tipsClass' ).remove();}, ( time * 1000 ) );
    };
    
    drawPoly.featureAdded = function(){
      console.log("Draw Feature added.");
      toolbar.activateControl(edit);
      
      //need hide 项目地图层
      map.getLayersByName('项目地块')[0].setVisibility(false);
      
      if (vectors.features.length > 0){
        var area = vectors.features[0].geometry.getArea()/666.67;
        var length = vectors.features[0].geometry.getLength()/1000.0;
        showTips( "面积："+numberWithCommas(area.toFixed(2)) + "亩 周长："+numberWithCommas(length.toFixed(2)) + '公里', 100, 5 );
      }

    };

    vectors.events.register("beforefeatureadded", vectors, function(e) {
      if (vectors.features.length > 0){
        vectors.removeAllFeatures();
      }
    });
    
    vectors.events.register("beforefeaturemodified", vectors, function  (e) {
      //dragFeature.deactivate();
      console.log("Draw Feature before modified.");
      if (vectors.features.length > 0){
        var area = vectors.features[0].geometry.getArea()/666.67;
        var length = vectors.features[0].geometry.getLength()/1000.0;
        showTips( "面积："+numberWithCommas(area.toFixed(2)) + "亩 周长："+numberWithCommas(length.toFixed(2)) + '公里', 100, 5 );
      }
    });

    vectors.events.register("afterfeaturemodified", vectors, function  (e) {
      //dragFeature.activate();
      console.log("Draw Feature modified.");
      //toolbar.activateControl(navigate);
      if (vectors.features.length > 0){
        var area = vectors.features[0].geometry.getArea()/666.67;
        var length = vectors.features[0].geometry.getLength()/1000.0;
        showTips( "面积："+numberWithCommas(area.toFixed(2)) + "亩 周长："+numberWithCommas(length.toFixed(2)) + '公里', 100, 5 );
      }
    });
    
    navigate.defaultClick = function(){
      map.getLayersByName('项目')[0].setVisibility(true);
    };
    
    
    var myButton = new OpenLayers.Control.Button({  
        title: "增加巡查点", displayClass: "myClass",trigger: function() {  
            var vectors = map.getLayersByName('测量图层')[0];
            if (vectors.features.length > 0) {
              $.mobile.changePage("#new_xmdk_id", "pop"); 
              $("input[name='gid']").val('');
              //$("input[name='username']").val('');
              $("input[name='xmmc']").val('');
              $("input[name='pzwh']").val('');
              $("input[name='sfjs']").val('');
              $("input[name='yddw']").val('');
              $("input[name='tdzl']").val('');
              $("input[name='dkmj']").val('');
              $("input[name='xzqmc']").val('');
              $("input[name='xmmc']").val('');
              $("input[name='xmmc']").val('');
              $("input[name='dkh']").val('');
              $("input[name='tfh']").val('');
              $("input[name='xz_tag']").val('是');
            } else {
              alert ("请先绘制图形状");
            }
            

        }  
    });
    
    toolbar.addControls([navigate, del, edit, drawPoly, myButton]);

    var sprintersLayer = new OpenLayers.Layer.Vector("项目地块", {
        styleMap: new OpenLayers.StyleMap({
            externalGraphic: "/img/mobile-green.png",
            graphicOpacity: 1.0,
            graphicWidth: 16,
            graphicHeight: 26,
            graphicYOffset: -26
        })
    });

    var myxmdkLayer = new OpenLayers.Layer.Vector("我的地块", {
        styleMap: new OpenLayers.StyleMap({
            externalGraphic: "/img/mobile-red.png",
            graphicOpacity: 1.0,
            graphicWidth: 16,
            graphicHeight: 26,
            graphicYOffset: -26
        })
    });
    
    

    var sprinters = getFeatures();
    var myxmdk = getMyXmdkFeature();

    var selectControl = new OpenLayers.Control.SelectFeature(sprintersLayer, {
        autoActivate:true,
        onSelect: onSelectFeatureFunction});

    var mySelectControl = new OpenLayers.Control.SelectFeature(myxmdkLayer, {
        autoActivate:true,
        onSelect: onSelectFeatureFunction});


    var geolocate = new OpenLayers.Control.Geolocate({
        id: 'locate-control',
        geolocationOptions: {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: 7000
        }
    });
    
    var gmap = new OpenLayers.Layer.Google("谷歌地图", {type: google.maps.MapTypeId.ROADMAP, "sphericalMercator": true,  opacity: 1, numZoomLevels: 20});
    var gsat = new OpenLayers.Layer.Google("谷歌卫星", {type: google.maps.MapTypeId.SATELLITE, "sphericalMercator": true,  opacity: 1, numZoomLevels: 20});
    
    
    // create map
    map = new OpenLayers.Map({
        div: "map",
        theme: null,
        projection: sm,
        numZoomLevels: 18,
        controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: { enableKinetic: true }
            }),
            toolbar,
            geolocate,
            selectControl,
            mySelectControl
        ],
        
        layers: [
            gmap, gsat,
            vector,
            vectors,
            sprintersLayer,
            myxmdkLayer
        ],
        center: new OpenLayers.LonLat(13410089, 3713641),
        zoom: 11
    });

    var style = {
        fillOpacity: 0.1,
        fillColor: '#000',
        strokeColor: '#f00',
        strokeOpacity: 0.6
    };
    geolocate.events.register("locationupdated", this, function(e) {
        vector.removeAllFeatures();
        vector.addFeatures([
            new OpenLayers.Feature.Vector(
                e.point,
                {},
                {
                    graphicName: 'cross',
                    strokeColor: '#f00',
                    strokeWidth: 2,
                    fillOpacity: 0,
                    pointRadius: 10
                }
            ),
            new OpenLayers.Feature.Vector(
                OpenLayers.Geometry.Polygon.createRegularPolygon(
                    new OpenLayers.Geometry.Point(e.point.x, e.point.y),
                    e.position.coords.accuracy / 2,
                    50,
                    0
                ),
                {},
                style
            )
        ]);
        map.panTo(vector.getCenter());
        //map.zoomToExtent(vector.getDataExtent());
    });

    function getFeatures() {
      pars = {};
      $.ajax({
        type: "POST",
        url: "/map/xmdk_feature",
        data: pars,
        cache: false,
        dataType: "text",
        success: function(data){
          if (data.length > 0) {
            var features = eval("("+data+")");
            var reader = new OpenLayers.Format.GeoJSON();
            var sprinters = reader.read(features);
            sprintersLayer.addFeatures(sprinters);
          }
        }
      });
    };
    
    function getMyXmdkFeature() {
      var username = $.trim($("input[name='user_id']").val());
      pars = {username:username};
      $.ajax({
        type: "POST",
        url: "/map/myxmdk_feature",
        data: pars,
        cache: false,
        dataType: "text",
        success: function(data){
          if (data.length > 0) {
            var features = eval("("+data+")");
            var reader = new OpenLayers.Format.GeoJSON();
            var sprinters = reader.read(features);
            myxmdkLayer.addFeatures(sprinters);
          }
        }
      });
    }

};
