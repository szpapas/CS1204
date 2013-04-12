MyDesktop.SatCheck = Ext.extend(Ext.app.Module, {

  id:'satcheck',

  init : function(){
    this.launcher = {
      text: '卫片检查',
      iconCls:'satcheck',
      handler : this.createWindow,
      scope: this
    }
  },
  
  createWindow : function(){
       
      //var supportsDOMRanges = document.implementation.hasFeature("Range", "2.0"); 
       
      if (currentUser.qxcode == '巡查员') {
        msg('Message','权限不够. 请与管理员联系后再试！');
        return;
      }
    
      var desktop = this.app.getDesktop();

      var win = desktop.getWindow('satcheck');
      
      if(!win){
        
        var loopable=false;
        var loop_data=[];
        
        var options = {
          projection: new OpenLayers.Projection('EPSG:900913'), units: "m", maxResolution: 152.87405654296876,
          maxExtent: new OpenLayers.Bounds(-2.003750834E7,-2.003750834E7,2.003750834E7,2.003750834E7) 
        };
        
        var markers;
        
        var map  = new OpenLayers.Map($('sat_check'), options);
        
        var gmap = new OpenLayers.Layer.Google(
            "谷歌地图", // the default
            {numZoomLevels: 20}
        );
        
        var gsat = new OpenLayers.Layer.Google(
            "谷歌卫星图",
            {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
        );

        map.addLayers([gsat,gmap]);

        var dltb = new OpenLayers.Layer.WMS("二调数据", base_url, 
          { layers: 'cs1204:dltb', srs: 'EPSG:900913', transparent: true, format: format }, s_option8);

        var dltb_m = new OpenLayers.Layer.WMS("二调数据2", base_url, 
            { layers: 'cs1204:dltb_m', srs: 'EPSG:900913', transparent: true, format: format }, s_option8f);


        //var xmdk = new OpenLayers.Layer.WMS("检查地块", base_url, 
        //  { layers: 'cs1204:xmdk', srs: 'EPSG:900913', transparent: true, format: format }, s_option8);

        
        map.addLayers([dltb, dltb_m]);
        
        var xmdk_vectors = new OpenLayers.Layer.Vector("任务地块", {
            isBaseLayer: false,
            styleMap: styles
        });
        

        var vectors = new OpenLayers.Layer.Vector("检查项目", {
            isBaseLayer: false,
            styleMap: styles
        });

        var vectorLines = new OpenLayers.Layer.Vector("用户路线", {
            isBaseLayer: false,
            styleMap: styles
        });

        //Add markers 
        markers = new OpenLayers.Layer.Markers( "检查点" );


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
          id : 'sat_check',
          autoScroll: true,
          xtype:"panel",
          //width:780,
          height:600,
          style:'margin:0px 0px',
          layout:'fit',
          tbar:[{
            text:'二调图',
            iconCls : 'user16',
            handler : function() {
               var layer = map.getLayersByName('二调数据')[0];
               layer.setVisibility(!layer.visibility);
            }
          },{
            text:'查看照片',
            //iconCls : 'route16',
            handler : function() {
              items = Ext.getCmp('xmdk_grid_id').getSelectionModel().selections.items;
              if (items.size() == 0) {
                alert ("请先选择一个检查项目.");
              } else {
                pars = {id:items[0].data.gid};
                /*
                new Ajax.Request("/desktop/view_photos", { 
                  method: "POST",
                  parameters: pars,
                  onComplete:  function(request) {
                    var new_url = request.responseText;
                    window.open(new_url,'','height=300,width=800,top=150, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
                  }
                });
                */
                window.open("/desktop/viewphotos",'','height=600,width=800,top=150, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');                
              }
            }
          }],
          items: [{
              xtype: 'gx_mappanel',
              map: map
          }]
        });
        
        //id, xh, pzwh, sfjs, xzqmc, the_center
        var xmdk_store = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: '/desktop/get_xmdk_list'
            }),
            reader: new Ext.data.JsonReader({
              totalProperty: 'results', 
              root: 'rows',             
              fields: [
                {name: 'gid',        type: 'integer'},
                {name: 'xh',        type: 'string'},
                {name: 'pzwh',      type: 'string'},
                {name: 'sfjs',      type: 'string'},
                {name: 'xzqmc',     type: 'string'},
                {name: 'the_center',type: 'string'}
              ]    
            }),
            sortInfo:{field: 'gid', direction: "ASC"}
        });
        
        xmdk_store.load();
        
        
        var draw_wsd = function() {
          markers.clearMarkers();
          var items = Ext.getCmp('xmdk_grid_id').store.data.items;
          for (var i=0; i < items.length; i ++) {
            var data = items[i]['data'];
            ss = data.the_center.match(/POINT\(([-]*\d+.\d+)\s*([-]*\d+.\d+)\)/);
            var x0 = parseFloat(ss[1]);
            var y0 = parseFloat(ss[2]);
            
            var size = new OpenLayers.Size(70,50);
            var offset = new OpenLayers.Pixel(-(size.w/2), -60);
            var icon = new OpenLayers.Icon('/images/xmdk/popup_'+ data.gid+'.png?'+Math.random()*100000000,size,offset);
            var marker =new OpenLayers.Marker(new OpenLayers.LonLat(x0, y0));
            marker.id = data.gid;
            marker.icon = icon;
            //marker.events.register("mousedown", marker, function() { yt_click(); });
            markers.addMarker(marker);  //水库
          };
        };
        
        
        xmdk_store.on('load', function(){
            draw_wsd();
        });
        
        
        function renderZt(val) {
            if (val == '未建设') {
              return '<span style="color:#000090">'+val+'</span>';
            } else {
              return '<span style="color:#FF0000">'+val+'</span>';
            }
        };
        
        var xmdk_grid = new Ext.grid.GridPanel({
          id: 'xmdk_grid_id',
          store: xmdk_store,
          columns: [
            { header : 'id',    width : 75, sortable : true, dataIndex: 'gid', hidden:true},
            { header : '编号',    width : 80, sortable : true, dataIndex: 'xh'},
            { header : '批准文号',  width : 200, sortable : true, dataIndex: 'pzwh'},
            { header : '是否建设',  width : 80, sortable : true, dataIndex: 'sfjs', renderer : renderZt},
            { header : '行政区划',  width : 80, sortable : true, dataIndex: 'xzqmc'}
            ],
          columnLines: true,
          layout:'fit',
          viewConfig: {
            stripeRows:true
          },
          tbar:[]
        });
        
        xmdk_grid.on('rowclick', function(grid, row, e){
          var data = grid.store.data.items[row].data;
          pointText = data.the_center;
          ss = pointText.match(/POINT\(([-]*\d+.\d+)\s*([-]*\d+.\d+)\)/);
          
          var x0 = parseFloat(ss[1]);
          var y0 = parseFloat(ss[2]);

          var lonlat = new OpenLayers.LonLat(x0, y0);
          map.panTo(lonlat,{animate: false});
        });
        
        var xmdk_panel = new Ext.Panel({
          id : 'xmdk_panel_id',
          autoScroll: true,
          xtype:"panel",
          width:250,
          height:600,
          style:'margin:0px 0px',
          layout:'fit',
          tbar:[{
            text:'查找',
            iconCls : 'search',
            handler : function() {
              phone_store.baseParams.zt='执行';
              phone_store.load();
            }
          }],
          items: [xmdk_grid]
        });
        
        
        var imageStore = new Ext.data.JsonStore({
            url: '/desktop/getImages',
            root: 'images',
            fields: ['name', 'url', 
                    {name:'size', type: 'float'}, 
                    {name:'lastmod', type:'date', dateFormat:'timestamp'}
                    ]
        });
        imageStore.load();
        
        var imageTemplate = new Ext.XTemplate('<tpl for=".">',
            '<div class="thumb-wrap" id="{name}">',
            '<div class="thumb"><img src="/images/dady/xctx/{url}" title="{name}"></div>',
            '<span class="x-editable">{name}</span></div>',
        '</tpl>',
        '<div class="x-clear"></div>');

        // DataView for the Gallery
        var imageDataView = new Ext.DataView({
            tpl: imageTemplate,
            singleSelect: true,
            height: 300,
            overClass: 'x-item-over',
            itemSelector: 'div.thumb-wrap',
            loadingText: 'Loading Images...',
            emptyText: '<div style="padding:10px;">No images</div>',
            autoScroll : true,
            store: imageStore,
            listeners: {
                dblclick: function(dv, index, node, e ){
                  //alert("item " + node.name + "click!"); node.id is the url name 
                }
            }
        });
        
        win = desktop.createWindow({
            id: 'satcheck',
            title:'卫片检查',
            width:1050,
            height:550,
            x : 100,
            y : 30,
            iconCls: 'satcheck',
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
                width:450,
                split:true,
                collapsible:true,
                titleCollapse:true,
                layout:"fit",
                items:{
                layout:"border",
                items:[{
                    region:"center",
                    width:450,
                    layout:"fit",
                    items:[xmdk_panel]
                  },{
                    region:"south",
                    title:"检查图片",
                    collapsible:true,
                    titleCollapse:true,
                    split:true,
                    layout:"fit",
                    height:300,
                    
                    items:[imageDataView]
                  }]
                }
              }]
        });
      };
      
      
      
      map.addControl(layserSwitch);
      map.addControl(new OpenLayers.Control.MousePosition());
      var zoomLevel = 14;
      map.setCenter(new OpenLayers.LonLat(13433632.3955943,3715923.24566449), zoomLevel);
      
      win.show();

      
      return win;
  }
});

