// Start with the map page
window.location.replace(window.location.href.split("#")[0] + "#mappage");

var selectedFeature = null;

$(document).ready(function() {
  
    // fix height of content
    function fixContentHeight() {
        var footer = $("div[data-role='footer']:visible"),
            content = $("div[data-role='content']:visible:visible"),
            viewHeight = $(window).height(),
            contentHeight = viewHeight - footer.outerHeight();

        if ((content.outerHeight() + footer.outerHeight()) !== viewHeight) {
            contentHeight -= (content.outerHeight() - content.height() + 1);
            content.height(contentHeight);
        }

        if (window.map && window.map instanceof OpenLayers.Map) {
            map.updateSize();
        } else {
            // initialize map
            init(function(feature) { 
                
                if (navigator.userAgent.match(/iPad/) == null){  
                  //显示xmdks Features的特性
                  selectedFeature = feature; 
                  $.mobile.changePage("#popup", { transition: "slide"});
                  var xz_tag = selectedFeature.attributes['是否新增'];
                  if(xz_tag.length > 0){
                    $("#popup-grid").show();
                  } else {
                    $("#popup-grid").hide();
                  }
                }else {
                  selectedFeature = feature;
                  username = $.trim($("input[name='user_id']").val());
                  gid = selectedFeature.attributes['地块编号']
                  $(location).attr('href','/map/show_xmdks?username='+username+'&gid='+gid);
                }  
            });
            initLayerList();
        }
        
        navigator.geolocation.getCurrentPosition (function (pos)
        {
            var lat = pos.coords.latitude;
            var lon = pos.coords.longitude;
            var newPoint =  new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
            map.panTo(newPoint);
        });
        
    };
    
    $(window).bind("orientationchange resize pageshow", fixContentHeight);
    document.body.onload = fixContentHeight;

    // Map zoom  
    $("#plus").click(function(){
        map.zoomIn();
    });
    $("#minus").click(function(){
        map.zoomOut();
    });
    
    $("#locate").click(function(){
        var control = map.getControlsBy("id", "locate-control")[0];
        if (control.active) {
            control.getCurrentLocation();
        } else {
            control.activate();
        }
    });
    
    $("#layer").click(function(){
        var control = map.getControlsBy("id", "locate-control")[0];
        var gmap = map.getLayersByName('谷歌地图')[0];
        var gsat = map.getLayersByName('谷歌卫星')[0];
        gmap.setVisibility(!gmap.visibility);
        gsat.setVisibility(!gsat.visibility);
    });
    
    $("#xmdk").click(function(){
        var control = map.getControlsBy("id", "locate-control")[0];
        var layer = map.getLayersByName('项目地块')[0]
        layer.setVisibility(!layer.visibility);
        if (layer.visibility) {
          //$('#xmdk').val("项目地块").button('refresh');
          $('#xmdk').buttonMarkup({theme: "a"}).button('refresh');
        } else {
          //$('#xmdk').val("项目地块").button('refresh');
          $('#xmdk').buttonMarkup({theme: "b"}).button('refresh');
        }  
    });
    
    $("#myxmdk").click(function(){
        var control = map.getControlsBy("id", "locate-control")[0];
        var layer = map.getLayersByName('我的地块')[0]
        layer.setVisibility(!layer.visibility);
        if (layer.visibility) {
          $('#myxmdk').buttonMarkup({theme: "a"}).button('refresh');
        } else {
          $('#myxmdk').buttonMarkup({theme: "b"}).button('refresh');
        }
    });
    
    $('#popup').live('pageshow',function(event, ui){
        var li = "<li data-role=\"list-divider\" data-divider-theme=\"a\">地块属性显示<span class=\"ui-li-aside\"></span></li>";
        for(var attr in selectedFeature.attributes){
            li += "<li><p style='width:25%;float:left'>" + attr + ":</p><p style='width:75%;float:right'>" 
               + selectedFeature.attributes[attr] + "</p></li>";
        }
        $("ul#details-list").empty().append(li).listview("refresh");
    });
    

    $('#searchpage').live('pageshow',function(event, ui){
        $('#query').bind('change', function(e){
            $('#search_results').empty();
            if ($('#query')[0].value === '') {
                return;
            }
            $.mobile.showPageLoadingMsg();

            // Prevent form send
            e.preventDefault();

            var searchUrl = 'http://ws.geonames.org/searchJSON?featureClass=P&maxRows=10';
            searchUrl += '&name_startsWith=' + $('#query')[0].value;
            $.getJSON(searchUrl, function(data) {
                $.each(data.geonames, function() {
                    var place = this;
                    $('<li>')
                        .hide()
                        .append($('<h2 />', {
                            text: place.name
                        }))
                        .append($('<p />', {
                            html: '<b>' + place.countryName + '</b> ' + place.fcodeName
                        }))
                        .appendTo('#search_results')
                        .click(function() {
                            $.mobile.changePage('#mappage');
                            var lonlat = new OpenLayers.LonLat(place.lng, place.lat);
                            map.setCenter(lonlat.transform(gg, sm), 10);
                        })
                        .show();
                });
                $('#search_results').listview('refresh');
                $.mobile.hidePageLoadingMsg();
            });
        });
        // only listen to the first event triggered
        $('#searchpage').die('pageshow', arguments.callee);
    })
    
    
    $("#saveXmdk").click(function() {
      
      var vectors = map.getLayersByName('测量图层')[0];
      if (vectors.features.length > 0) {
        var area = vectors.features[0].geometry.getArea();
        var length = vectors.features[0].geometry.getLength();
        var geom = vectors.features[0].geometry.toString();
      } else {
        var area = '';
        var length = '';
        var geom = '';
      }
      
      var gid   = $.trim($("input[name='gid']").val());
      var username = $.trim($("input[name='username']").val());
      var xmmc  = $.trim($("input[name='xmmc']").val());
      var pzwh  = $.trim($("input[name='pzwh']").val());
      var sfjs  = $.trim($("input[name='sfjs']").val());
      var yddw  = $.trim($("input[name='yddw']").val());
      var tdzl  = $.trim($("input[name='tdzl']").val());
      var dkmj  = $.trim($("input[name='dkmj']").val());
      //var jlrq  = $.trim($("input[name='jlrq']").val());
      var xzqmc = $.trim($("input[name='xzqmc']").val());
      var dkh   = $.trim($("input[name='dkh']").val());
      var tfh   = $.trim($("input[name='tfh']").val());

      if(xmmc.length > 0){
          $.ajax({
            type: "POST",
            url: "/map/save_xz_xmdk",
            data: ({gid:gid, username:username, xmmc:xmmc, pzwh:pzwh, sfjs:sfjs, yddw:yddw, tdzl:tdzl, dkmj:dkmj,xzqmc:xzqmc, dkh:dkh, tfh:tfh, shape_area:area, shape_len:length, geom:geom}),
            cache: false,
            dataType: "text",
            success: function(data){
              var username = $.trim($("input[name='user_id']").val());
              $(location).attr('href','/map/measure?username='+username);
            }
          });
       };
       
    });
    
    $("#modifyXmdk2").click(function() {
        $.mobile.changePage("#new_xmdk_id", "pop"); 
        //selectedFeature
        $("input[name='gid']").val(selectedFeature.attributes['地块编号']);
        $("input[name='xmmc']").val(selectedFeature.attributes['项目名称']);
        $("input[name='pzwh']").val(selectedFeature.attributes['批准文号']);
        $("input[name='sfjs']").val(selectedFeature.attributes['是否建设']);
        $("input[name='yddw']").val(selectedFeature.attributes['用地单位']);
        $("input[name='tdzl']").val(selectedFeature.attributes['土地坐落']);
        $("input[name='dkmj']").val(selectedFeature.attributes['地块面积']);
        $("input[name='xzqmc']").val(selectedFeature.attributes['行政区名称']);
        $("input[name='shape_area']").val(selectedFeature.attributes['图班面积']);
        $("input[name='shape_len']").val(selectedFeature.attributes['图班周长']);
        $("input[name='dkh']").val(selectedFeature.attributes['地块号']);
        $("input[name='tfh']").val(selectedFeature.attributes['图幅号']);
        $("input[name='xz_tag']").val(selectedFeature.attributes['是否新增']);
    });  
    

  	$("#deleteXmdk").click(function() {
			$.mobile.changePage("#sure", "pop");
		});
    
  	$("#deleteXmdk2").click(function() {
			$.mobile.changePage("#sure", "pop");
		});	
    
    $('#sureXmdk').click(function() {
       var gid =selectedFeature.attributes['地块编号'];
       var xz_tag = selectedFeature.attributes['是否新增'];
       if(xz_tag.length > 0){
          $.ajax({
            type: "POST",
            url: "/map/delete_xz_xmdk",
            data: ({gid:gid}),
            cache: false,
            dataType: "text",
            success: function(data){
              if (data == 'Success') {
                var username = $.trim($("input[name='user_id']").val());
                $(location).attr('href','/map/measure?username='+username);
              } else {
                alert("改项目地块被引用，不能删除！")
                var username = $.trim($("input[name='user_id']").val());
                $(location).attr('href','/map/measure?username='+username);
              }
            }
          });
       } else {
          alert ('不能删除');
       } 
    }); 
    
});

function initLayerList() {
    $('#layerspage').page();
    $('<li>', {
            "data-role": "list-divider",
            text: "基本图层"
        })
        .appendTo('#layerslist');
    var baseLayers = map.getLayersBy("isBaseLayer", true);
    $.each(baseLayers, function() {
        addLayerToList(this);
    });

    $('<li>', {
            "data-role": "list-divider",
            text: "覆盖图层"
        })
        .appendTo('#layerslist');
    var overlayLayers = map.getLayersBy("isBaseLayer", false);
    $.each(overlayLayers, function() {
        addLayerToList(this);
    });
    $('#layerslist').listview('refresh');
    
    map.events.register("addlayer", this, function(e) {
       // addLayerToList(e.layer);
    });
}

function addLayerToList(layer) {
    var item = $('<li>', {
            "data-icon": "check",
            "class": layer.visibility ? "checked" : ""
        })
        .append($('<a />', {
            text: layer.name
        })
            .click(function() {
                $.mobile.changePage('#mappage');
                if (layer.isBaseLayer) {
                    layer.map.setBaseLayer(layer);
                } else {
                    layer.setVisibility(!layer.getVisibility());
                }
            })
        )
        .appendTo('#layerslist');
    layer.events.on({
        'visibilitychanged': function() {
            $(item).toggleClass('checked');
        }
    });
}
