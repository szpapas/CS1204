MyDesktop.WqltCheck = Ext.extend(Ext.app.Module, {

  id:'wqltcheck',

  init : function(){
    this.launcher = {
      text: '万顷良田项目',
      iconCls:'wqltcheck',
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

      var win = desktop.getWindow('wqltcheck');
      
      if(!win){
        
        var loopable=false;
        var loop_data=[];
        
        var options = {
          projection: new OpenLayers.Projection('EPSG:900913'), units: "m", maxResolution: 152.87405654296876,
          maxExtent: new OpenLayers.Bounds(-2.003750834E7,-2.003750834E7,2.003750834E7,2.003750834E7) 
        };
        
        var markers;
        
        var map  = new OpenLayers.Map($('wqlt_check'), options);
        
        var gmap = new OpenLayers.Layer.Google(
            "谷歌地图", // the default
            {numZoomLevels: 20}
        );
        
        var gsat = new OpenLayers.Layer.Google(
            "谷歌卫星图",
            {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
        );

        map.addLayers([gsat,gmap]);

        var wqlt_vectors = new OpenLayers.Layer.Vector("良田项目", {
            isBaseLayer: false,
            styleMap: styles
        });

        //Add markers 
        markers = new OpenLayers.Layer.Markers( "项目点" );

        map.addLayers([wqlt_vectors,markers]);
        
        var layserSwitch = new OpenLayers.Control.LayerSwitcher();
        
        var map_view = new Ext.Panel({
          id : 'wqlt_check',
          autoScroll: true,
          xtype:"panel",
          //width:780,
          height:600,
          style:'margin:0px 0px',
          layout:'fit',
          tbar:[],
          items: [{
              xtype: 'gx_mappanel',
              map: map
          }]
        });
        
        //id, xh, pzwh, sfjs, xzqmc, the_center
        var wqlt_store = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: '/desktop/get_wqlt_list'
            }),
            reader: new Ext.data.JsonReader({
              totalProperty: 'results', 
              root: 'rows',             
              fields: [
                {name: 'gid',        type: 'integer'},
                {name: 'xh',        type: 'string'},
                {name: 'xmmc',      type: 'string'},
                {name: 'xzqmc',     type: 'string'},
                {name: 'geom_string', type:'string'},
                {name: 'area',     type:'string'},
                {name: 'the_center',type: 'string'}
              ]    
            }),
            sortInfo:{field: 'gid', direction: "ASC"}
        });
        
        wqlt_store.load();
        
        
        var draw_markers = function() {
          markers.clearMarkers();
          var items = Ext.getCmp('wqlt_grid_id').store.data.items;
          for (var i=0; i < items.length; i ++) {
            var data = items[i]['data'];
            ss = data.the_center.match(/POINT\(([-]*\d+.\d+)\s*([-]*\d+.\d+)\)/);
            var x0 = parseFloat(ss[1]);
            var y0 = parseFloat(ss[2]);
            
            var size = new OpenLayers.Size(70,50);
            var offset = new OpenLayers.Pixel(-(size.w/2), -60);
            var icon = new OpenLayers.Icon('/images/wqlt/popup_'+ data.gid+'.png?'+Math.random()*100000000,size,offset);
            var marker =new OpenLayers.Marker(new OpenLayers.LonLat(x0, y0));
            marker.id = data.gid;
            marker.icon = icon;
            markers.addMarker(marker);  //水库
          };
        };
        
        var draw_wqlt  = function(){

          if (wqlt_vectors.features.length > 0){
            while (wqlt_vectors.features.length > 0) {
              var vectorFeature = wqlt_vectors.features[0];
              wqlt_vectors.removeFeatures(vectorFeature);
            };
          };

          var items = wqlt_store.data.items;
          for (var i=0; i < items.length; i++) {
            var data = items[i]['data'];
            var geom_string = data.geom_string;
            var geojson_format = new OpenLayers.Format.GeoJSON();
            wqlt_vectors.addFeatures(geojson_format.read(geom_string));

          };
        };
        
        
        wqlt_store.on('load', function(){
            draw_markers();
            draw_wqlt();
        });
        
        
        function renderZt(val) {
            if (val == '未建设') {
              return '<span style="color:#000090">'+val+'</span>';
            } else {
              return '<span style="color:#FF0000">'+val+'</span>';
            }
        };
        
        var wqlt_grid = new Ext.grid.GridPanel({
          id: 'wqlt_grid_id',
          store: wqlt_store,
          columns: [
            { header : 'id',    width : 75, sortable : true, dataIndex: 'gid', hidden:true},
            { header : '编号',    width : 50, sortable : true, dataIndex: 'xh'},
            { header : '项目名称',  width : 120, sortable : true, dataIndex: 'xmmc'},
            { header : '行政区划',  width : 80, sortable : true, dataIndex: 'xzqmc'}
            ],
          columnLines: true,
          layout:'fit',
          viewConfig: {
            stripeRows:true
          },
          tbar:[]
        });
        
        wqlt_grid.on('rowclick', function(grid, row, e){
          var data = grid.store.data.items[row].data;
          pointText = data.the_center;
          ss = pointText.match(/POINT\(([-]*\d+.\d+)\s*([-]*\d+.\d+)\)/);
          
          var x0 = parseFloat(ss[1]);
          var y0 = parseFloat(ss[2]);

          var lonlat = new OpenLayers.LonLat(x0, y0);
          map.panTo(lonlat,{animate: false});
          
          var desc = "<div style='margin:10px; font-size:18px'>" + data.xmmc + "&nbsp;示范基地</div><div style='margin:10px; font-size:18px'>面积："+ data.area+"亩</div>"
          Ext.getCmp('xmms_id').el.dom.innerHTML = desc; 
        });
        
        var wqlt_panel = new Ext.Panel({
          id : 'wqlt_panel_id',
          autoScroll: true,
          xtype:"panel",
          width:150,
          height:600,
          style:'margin:0px 0px',
          layout:'fit',
          tbar:[
            '<span style=" font-size:12px;font-weight:600;color:#3366FF;">项目查询</span>:&nbsp;&nbsp;',
            {
              xtype:'textfield',id:'search_box_id'
            },
            {
            text:'查找',
            iconCls : 'search',
            handler : function() {
              //phone_store.baseParams.zt='执行';
              //phone_store.load();
            }
          }],
          items: [wqlt_grid]
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
            id: 'wqltcheck',
            title:'万顷良田',
            width:1050,
            height:550,
            x : 100,
            y : 30,
            iconCls: 'wqltcheck',
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
                width:300,
                split:true,
                collapsible:true,
                titleCollapse:true,
                layout:"fit",
                items:{
                layout:"border",
                items:[{
                    region:"center",
                    width:300,
                    layout:"fit",
                    items:[wqlt_panel]
                  },{
                    region:"south",
                    title:"项目描述",
                    id : 'xmms_id',
                    collapsible:true,
                    titleCollapse:true,
                    split:true,
                    layout:"fit",
                    height:300,
                    html:"<div style='margin:10px; font-size:18px'>雷巷村示范基地</div><div style='margin:10px; font-size:18px'>面积：56亩</div>"
                    //items:[imageDataView]
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

