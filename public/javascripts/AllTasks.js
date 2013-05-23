//overall function for MyTask Processing
Ext.ux.Image = Ext.extend(Ext.BoxComponent, {

    url  : Ext.BLANK_IMAGE_URL,  //for initial src value

    autoEl: {
        tag: 'img',
        src: Ext.BLANK_IMAGE_URL,
        cls: 'tng-managed-image',
        style: "max-height: 100%; max-width: 100%"
    },

   initComponent : function(){
         Ext.ux.Image.superclass.initComponent.call(this);
         this.addEvents('load');
   },
 
//  Add our custom processing to the onRender phase.
//  We add a ‘load’ listener to our element.
    onRender: function() {
        Ext.ux.Image.superclass.onRender.apply(this, arguments);
        this.el.on('load', this.onLoad, this);
        if(this.url){
            this.setSrc(this.url);
        }
    },
 
    onLoad: function() {
        this.fireEvent('load', this);
    },
 
    setSrc: function(src) {
        this.el.dom.src = src;
    }
});

var show_images = function (url) {
  
  var panel_img = new Ext.ux.Image ({ id: 'imgPreview', url: url });
  
  var image_win = new Ext.Window({
    id : 'image_win',
    iconCls : 'add',
    title: '图像',
    floating: true,
    shadow: true,
    draggable: true,
    resizable :true,
    closable: true,
    modal: true,
    width: 600,
    height: 600,
    layout: 'fit',
    plain: true,
    items: [panel_img]
  });

  image_win.show();
  
  var maxWidth = 600; // Max width for the image
  var maxHeight = 600;    // Max height for the image
  var ratio = 0;  // Used for aspect ratio
  var width = Ext.getCmp('imgPreview').el.dom.naturalWidth;    // Current image width this.el.dom.height
  var height = Ext.getCmp('imgPreview').el.dom.naturalHeight;  // Current image height

  if(width > maxWidth){
      ratio = maxWidth / width;   // get ratio for scaling image
      height = height * ratio;    // Reset height to match scaled image
      width = width * ratio;    // Reset width to match scaled image
      Ext.getCmp('image_win').setWidth(width);
      Ext.getCmp('image_win').setHeight(height);
  }

  // Check if current height is larger than max
  if(height > maxHeight){
      ratio = maxHeight / height; // get ratio for scaling image
      width = width * ratio;    // Reset width to match scaled image
      Ext.getCmp('image_win').setWidth(width);
      Ext.getCmp('image_win').setHeight(maxHeight);
  }
} 

//=====
var view_xmdks = function(sys_grid_id) {
  var xmdks_grid = Ext.getCmp(sys_grid_id);
  var gsm =Ext.getCmp(sys_grid_id).getSelectionModel();
  
  
  var draw_marker = function(lon,lat) {
    markers.clearMarkers();

    var x0 = parseFloat(lon);
    var y0 = parseFloat(lat);

    var size = new OpenLayers.Size(16,26);
    var offset = new OpenLayers.Pixel(-(size.w/2), -20);
    var icon = new OpenLayers.Icon('/img/mobile-green.png',size,offset);
    var marker =new OpenLayers.Marker(new OpenLayers.LonLat(x0, y0));
    marker.id = data.gid;
    marker.icon = icon;
    //marker.events.register("mousedown", marker, function() { yt_click(); });
    markers.addMarker(marker);  //水库
    map.setCenter(new OpenLayers.LonLat(lon,lat), 17);
  };
  
  var draw_xmdks  = function(geom_string){
    
    if (xmdk_vectors.features.length > 0){
      while (xmdk_vectors.features.length > 0) {
        var vectorFeature = xmdk_vectors.features[0];
        xmdk_vectors.removeFeatures(vectorFeature);
      };
    };
    
    var geojson_format = new OpenLayers.Format.GeoJSON();
    xmdk_vectors.addFeatures(geojson_format.read(geom_string));
  };

  //====helper function
  var saveBasic = function() {
    
    var form = Ext.getCmp('xmdks-panel-id').getForm();
    var gid  = form.findField("gid") .getValue();
    var xmmc = form.findField("xmmc").getValue();
    var yddw = form.findField("yddw").getValue();
    var pzwh = form.findField("pzwh").getValue();
    var sfjs = form.findField("sfjs").getValue();
    var tdzl = form.findField("tdzl").getValue();
    var dkmj = form.findField("dkmj").getValue();
    var xzqh = form.findField("xzqh").getValue();
    
    pars = {gid:gid, xmmc:xmmc, yddw:yddw, pzwh:pzwh, sfjs:sfjs, tdzl:tdzl, dkmj:dkmj, xzqh:xzqh};
    new Ajax.Request("/desktop/save_xmdks_basic", { 
      method: "POST",
      parameters: pars,
      onComplete:  function(request) {
        if (request.responseText == 'Success') {
          alert ('保存成功！')
        }
      }
    });
    
  };
  
  var deleteXmdks = function() {
  };
  
  var saveExtXmdks = function() {
    var form = Ext.getCmp('xmdks-panel-id').getForm();

    var id       = form.findField("a_id").getValue();
    var xmmc     = form.findField("a_xmmc").getValue();
    var yddw     = form.findField("a_yddw").getValue();
    var zlwz     = form.findField("a_zlwz").getValue();
    var sffhztgh = form.findField("a_sffhztgh").getValue();
    var ydl      = form.findField("a_ydl").getValue();
    var lxsj     = Ext.util.Format.date(form.findField("a_lxsj").getValue(), 'Y-m-d');
    var lxpwh    = form.findField("a_lxpwh").getValue();
    var ghddsj   = Ext.util.Format.date(form.findField("a_ghddsj").getValue(), 'Y-m-d');
    var ghddh    = form.findField("a_ghddh").getValue();
    var zzysj    = Ext.util.Format.date(form.findField("a_zzysj").getValue(), 'Y-m-d');
    var zzypwh   = form.findField("a_zzypwh").getValue();
    var gdsj     = Ext.util.Format.date(form.findField("a_gdsj").getValue(), 'Y-m-d');
    var gdpwh    = form.findField("a_gdpwh").getValue();
    var pzyt     = form.findField("a_pzyt").getValue();
    var sjyt     = form.findField("a_sjyt").getValue();
    var pzmj     = form.findField("a_pzmj").getValue();
    var gdmj     = form.findField("a_gdmj").getValue();
    var dgsj     = Ext.util.Format.date(form.findField("a_dgsj").getValue(), 'Y-m-d');
    
    pars = {id:id,xmmc:xmmc,yddw:yddw,zlwz:zlwz,sffhztgh:sffhztgh,ydl:ydl,lxsj:lxsj,lxpwh:lxpwh,ghddsj:ghddsj,ghddh:ghddh,zzysj:zzysj,zzypwh:zzypwh,gdsj:gdsj,gdpwh:gdpwh,pzyt:pzyt,sjyt:sjyt,pzmj:pzmj,gdmj:gdmj,dgsj:dgsj};
    
    new Ajax.Request("/desktop/save_xmdks_extra", { 
      method: "POST",
      parameters: pars,
      onComplete:  function(request) {
        if (request.responseText == 'Success') {
          alert ('保存成功！')
        }
      }
    });
    
  };
  
  var refreshXcjl = function() {
    xcjl_store.load();
  };
  
  var saveXcjl = function() {
    var form = Ext.getCmp('xmdks-panel-id').getForm();
     
    var id         = form.findField("h_inspect_id").getValue();  
    var xcrq       = Ext.util.Format.date(form.findField("h_xcrq").getValue()); 
    var jszt       = form.findField("h_jszt").getValue(); 
    //var xkz        = form.findField("h_xkz").getValue(); 
    //var yjx        = form.findField("h_yjx").getValue(); 
    var sjyt       = form.findField("h_sjyt").getValue(); 
    var sfwf       = form.findField("h_sfwf").getValue(); 
    var sjzdmj     = form.findField("h_sjzdmj").getValue(); 
    var gdmj       = form.findField("h_gdmj").getValue(); 
    var wfmj       = form.findField("h_wfmj").getValue(); 
    var bz         = form.findField("h_bz").getValue();
    
    pars = {id:id,xcrq:xcrq,jszt:jszt,sjyt:sjyt,sfwf:sfwf,sjzdmj:sjzdmj,gdmj:gdmj,wfmj:wfmj,bz:bz};
    
    new Ajax.Request("/desktop/save_xcjl_basic", { 
      method: "POST",
      parameters: pars,
      onComplete:  function(request) {
        if (request.responseText == 'Success') {
          alert ('保存成功！')
        }
      }
    });
    
  };
  
  function loadXmdks(gsm) {
    
    Ext.getCmp('view_xmdk_win').setTitle('查看地块');
    
    var form = Ext.getCmp('xmdks-panel-id').getForm();
    data = gsm.selections.items[0]['data'];
    
    form.findField("gid" ).setValue(data.gid );
    form.findField("xmmc").setValue(data.xmmc);
    form.findField("yddw").setValue(data.yddw);
    form.findField("pzwh").setValue(data.pzwh);
    form.findField("sfjs").setValue(data.sfjs);
    form.findField("tdzl").setValue(data.tdzl);
    form.findField("dkmj").setValue(data.dkmj);
    form.findField("xzqh").setValue(data.xzqh);
    form.findField("tbmj").setValue(data.shape_area);
    form.findField("tbzc").setValue(data.shape_len);
    if (data.jlrq != null) form.findField("jlrq").setValue(new Date(data.jlrq));
    
    if (data.xz_tag != '是' || data.xz_tag == undefined) {
      form.findField("gid" ).setReadOnly(true);
      form.findField("xmmc").setReadOnly(true);
      form.findField("yddw").setReadOnly(true);
      form.findField("pzwh").setReadOnly(true);
      form.findField("sfjs").setReadOnly(true);
      form.findField("tdzl").setReadOnly(true);
      form.findField("dkmj").setReadOnly(true);
      form.findField("xzqh").setReadOnly(true);
      form.findField("tbmj").setReadOnly(true);
      form.findField("tbzc").setReadOnly(true);
      form.findField("jlrq").setReadOnly(true);
      Ext.getCmp('save-basic-42').hide();
    }
    
    // show other data
    //设置a_xmdks
    pars = {gid:data.gid};
    new Ajax.Request("/desktop/get_a_xmdks", { 
      method: "POST",
      parameters: pars,
      onComplete:  function(request) {
        var datas = eval("("+request.responseText+")");
        data = datas[0]

        var form = Ext.getCmp('xmdks-panel-id').getForm();

        form.findField("a_id").setValue(data.id);
        form.findField("a_xmmc").setValue(data.xmmc);
        form.findField("a_yddw").setValue(data.yddw);
        form.findField("a_zlwz").setValue(data.zlwz);
        form.findField("a_sffhztgh").setValue(data.sffhztgh);
        form.findField("a_ydl").setValue(data.ydl);
        if (data.lxsj != null) form.findField("a_lxsj").setValue(new Date(data.lxsj));
        form.findField("a_lxpwh").setValue(data.lxpwh);
        if (data.ghddsj != null) form.findField("a_ghddsj").setValue(new Date(data.ghddsj));
        form.findField("a_ghddh").setValue(data.ghddh);
        if (data.zzysj != null) form.findField("a_zzysj").setValue(new Date(data.zzysj));
        form.findField("a_zzypwh").setValue(data.zzypwh);
        if (data.gdsj != null) form.findField("a_gdsj").setValue(new Date(data.gdsj));
        form.findField("a_gdpwh").setValue(data.gdpwh);
        form.findField("a_pzyt").setValue(data.pzyt);
        form.findField("a_sjyt").setValue(data.sjyt);
        form.findField("a_pzmj").setValue(data.pzmj);
        form.findField("a_gdmj").setValue(data.gdmj);
        if (data.dgsj != null) form.findField("a_dgsj").setValue(new Date(data.dgsj));
        
        form.findField("a_xmmc").setReadOnly(true);  
      }  
    }); 
    
    ss = data.the_center.match(/POINT\(([-]*\d+\.*\d*)\s*([-]*\d+\.*\d*)\)/);
    draw_marker(parseFloat(ss[1]), parseFloat(ss[2]) ); 

    draw_xmdks(data.geom_string);
    
  };
  
  var showPrev = function() {
    gsm.selectPrevious();
    loadXmdks(gsm);
  };
  
  var showNext = function() {
    gsm.selectNext();
    loadXmdks(gsm);
  }
  
  //define- xmdk-inspects 
  var xcjl_store = new Ext.data.Store({
    proxy: new Ext.data.HttpProxy({
      url: '/desktop/get_xcjl_xmdk'
    }),
    reader: new Ext.data.JsonReader({
      totalProperty: 'results', 
      root: 'rows',             
      fields: [
        {name: 'id',       type: 'integer'},
        {name: 'xmdk_id',  type: 'integer'},
        {name: 'plan_id',  type: 'integer'},
        {name: 'xcrq',     type: 'date', dateFormat: 'Y-m-d H:i:s'},
        {name: 'jszt',     type: 'string'},
        //{name: 'xkz',      type: 'string'},
        //{name: 'yjx',      type: 'string'},
        {name: 'sjyt',     type: 'string'},
        {name: 'sfwf',     type: 'string'},
        {name: 'sjzdmj',     type: 'string'},
        {name: 'gdmj',     type: 'string'},
        {name: 'wfmj',     type: 'string'},
        {name: 'bz',       type: 'string'}
      ]    
    }),
    sortInfo:{field: 'id', direction: "ASC"}
  });
  
  var sm = new Ext.grid.CheckboxSelectionModel();
  var xcjl_grid = new Ext.grid.GridPanel({
    id: 'xcjl_grid_id',
    store: xcjl_store,
    height:170,
    columns: [
      sm,           
      { header : '巡查日期',  width : 150, sortable : true, dataIndex: 'xcrq', renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')},            
      { header : '建设状态',  width : 75, sortable : true, dataIndex: 'jszt'},
      { header : '实际用途',  width : 75, sortable : true, dataIndex: 'sjyt'},
      { header : '是否违法',  width : 50, sortable : true, dataIndex: 'sfwf'},
      { header : '实际占地面积',  width : 100, sortable : true, dataIndex: 'sjzdmj'},
      { header : '耕地面积',  width : 100, sortable : true, dataIndex: 'gdmj'},
      { header : '违法面积',  width : 100, sortable : true, dataIndex: 'wfmj'},
      { header : '备注',  width : 200, sortable : true, dataIndex: 'wfmj'}
    ],
    sm:sm, 
    columnLines: true,
    layout:'fit',
    viewConfig: {
      stripeRows:true,
    }
  });
  
  xcjl_grid.on('rowclick', function(grid, row, e){
    var data = grid.store.data.items[row].data;
    var form = Ext.getCmp('xmdks-panel-id').getForm();
    var xmmc = form.findField("xmmc").getValue();
    form.findField("h_xmmc").setValue(xmmc);
  
    form.findField("h_inspect_id").setValue(data.id);  
    if (data.xcrq != null) form.findField("h_xcrq").setValue(new Date(data.xcrq)); 
    form.findField("h_jszt").setValue(data.jszt); 
    //form.findField("h_xkz").setValue(data.xkz); 
    //form.findField("h_yjx").setValue(data.yjx); 
    form.findField("h_sjyt").setValue(data.sjyt); 
    form.findField("h_sfwf").setValue(data.sfwf); 
    form.findField("h_sjzdmj").setValue(data.sjzdmj); 
    form.findField("h_gdmj").setValue(data.gdmj); 
    form.findField("h_wfmj").setValue(data.wfmj); 
    form.findField("h_bz").setValue(data.bz); 

    form.findField("h_xmmc" ).setReadOnly(true);
    form.findField("h_xcrq" ).setReadOnly(true);
    
  });
  
  xcjl_store.on('load', function(){
    
    if (xcjl_store.data.items.length > 0) {
      
      var xcjl_grid = Ext.getCmp('xcjl_grid_id');
      //xcjl_grid.getSelectionModel().selectRow(0);

      var data = xcjl_grid.store.data.items[0]['data'];
      
      var form = Ext.getCmp('xmdks-panel-id').getForm();
      var xmmc = form.findField("xmmc").getValue();
      form.findField("h_xmmc").setValue(xmmc);
  
      form.findField("h_inspect_id").setValue(data.id);  
      if (data.xcrq != null ) form.findField("h_xcrq").setValue(new Date(data.xcrq)); 
      form.findField("h_jszt").setValue(data.jszt); 
      //form.findField("h_xkz").setValue(data.xkz); 
      //form.findField("h_yjx").setValue(data.yjx); 
      form.findField("h_sjyt").setValue(data.sjyt); 
      form.findField("h_sfwf").setValue(data.sfwf); 
      form.findField("h_sjzdmj").setValue(data.sjzdmj); 
      form.findField("h_gdmj").setValue(data.gdmj); 
      form.findField("h_wfmj").setValue(data.wfmj); 
      form.findField("h_bz").setValue(data.bz); 
      
      form.findField("h_xmmc" ).setReadOnly(true);
      form.findField("h_xcrq" ).setReadOnly(true);
      
    } else {
      console.log("no data loaded")
    }
  });
  
  var data = gsm.selections.items[0]['data'];
  xcjl_store.baseParams.xmdk_id = data.gid;
  xcjl_store.load();
  
  //var xmdk_panel_img = new Ext.ux.Image ({ id: 'imgPreview', url: Ext.BLANK_IMAGE_URL });
  
  //demo dataview for 
  var img_store = new Ext.data.Store({
    proxy: new Ext.data.HttpProxy({
        url: '/desktop/get_xcimage_json'
    }),
    reader: new Ext.data.JsonReader({
      totalProperty: 'results', 
      root: 'rows',             
      fields: [
        {name: 'id',    type: 'integer'},
        {name: 'yxmc',  type: 'string'},
        {name: 'rq',    type: 'string'},
        {name: 'bz',    type: 'string'},
        {name: 'tpjd',  type: 'string'}
        
      ]    
    }),
    sortInfo:{field: 'id', direction: "ASC"}
  });
  
  //load img_store
  img_store.baseParams = {xmdk_id:data.gid};
  img_store.load();
  
  //Data-Views
  var data_view = new Ext.DataView({
      itemSelector: 'div.thumb-wrap',
      width:300,
      height:300,
      style:'overflow:auto',
      multiSelect: false,
      plugins: new Ext.DataView.DragSelector({dragSafe:true}),
      store: img_store,
      overClass: 'x-view-over',
      tpl: new Ext.XTemplate(
          '<tpl for=".">',
          '<div class="thumb-wrap" id="{id}">',
          '<div class="thumb"><img src="/images/dady/xctx/{yxmc}" class="thumb-img"></div>',
          '<span>{rq}&nbsp;{bz}&nbsp;{tpjd}</span></div>',
          '</tpl>'
      ),
      listeners: {
        click: function(dv, index, node, e) {
          var data = img_store.getAt(index);
          if (typeof data == 'object') {
            //window.open('/images/dady/xctx/' + data.data.yxmc );
            show_images('/images/dady/xctx/' + data.data.yxmc.replace('-thumb', '').replace('jpg','JPG') ) ;
          }
        }
      }
  });
  
  
  
  //componets for map_view 
  var options = {
    projection: new OpenLayers.Projection('EPSG:900913'), units: "m", maxResolution: 152.87405654296876,
    maxExtent: new OpenLayers.Bounds(-2.003750834E7,-2.003750834E7,2.003750834E7,2.003750834E7) 
  };
  //Add markers 
  
  
  var map  = new OpenLayers.Map($('sat_check'), options);
  var gsat = new OpenLayers.Layer.Google( "谷歌卫星图", {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22} );
  var xmdk_vectors = new OpenLayers.Layer.Vector("任务地块", { isBaseLayer: false, styleMap: styles });
  var markers = new OpenLayers.Layer.Markers( "检查点" );

  map.addLayers([gsat,xmdk_vectors, markers]);
  
  var map_view = new Ext.Panel({
    id : 'sat_check',
    autoScroll: true,
    xtype:"panel",
    height:400,
    width:400,
    style:'margin:0px 0px',
    layout:'fit',
    items: [{
        xtype: 'gx_mappanel',
        map: map
    }]
  });
  
  var xmdksPanel = new Ext.form.FormPanel({
      xtype:"panel",
      id:'xmdks-panel-id',
      closable : true,
      closeAction: 'hide',
      layout: 'absolute',
      deferredRender : false,
      width:800,
      height:600,
      border: 'true',
      items:[{
          xtype:"tabpanel",
          activeTab:0,
          width:800,
          height:600,
          items :[{
              xtype:"panel",
              title:"基本信息",
              layout:"absolute",
              items:[{
                 name:"gid",  x:"0", y:"0", xtype:"textfield", hidden:true},
                {name:"xmmc", x:"100", y:"50", xtype:"textfield", width:200, height:30},
                {name:"yddw", x:"100", y:"90", xtype:"textfield", width:200, height:30},
                {name:"pzwh", x:"100", y:"130", xtype:"textfield", width:200, height:30},
                {name:"sfjs", x:"100", y:"170", xtype:"textfield", width:200, height:30},
                {name:"tdzl", x:"100", y:"210", xtype:"textfield", width:200, height:30},
                {name:"dkmj", x:"100", y:"250", xtype:"textfield", width:200, height:30},
                {name:"xzqh", x:"100", y:"290", xtype:"textfield", width:200, height:30},
                {name:"tbmj", x:"100", y:"330", xtype:"textfield", width:200, height:30},
                {name:"tbzc", x:"100", y:"370", xtype:"textfield", width:200, height:30},
                {name:"jlrq", x:"100", y:"410", xtype:"datefield", width:200, height:30, format:'Y-m-d'},
  
                {text:"项目名称", x:"15", y:"55",  xtype:"label"},
                {text:"用地单位", x:"15", y:"95",  xtype:"label"},
                {text:"配准文号", x:"15", y:"135", xtype:"label"},
                {text:"是否建设", x:"15", y:"175", xtype:"label"},
                {text:"土地坐落", x:"15", y:"215", xtype:"label"},
                {text:"地块面积", x:"15", y:"255", xtype:"label"},
                {text:"行政区划", x:"15", y:"295", xtype:"label"},
                {text:"图斑面积", x:"15", y:"335", xtype:"label"},
                {text:"图斑周长", x:"15", y:"375", xtype:"label"},
                {text:"创建日期", x:"15", y:"415", xtype:"label"},
  
                { xtype:"panel", name:"xmdk_pic", x:"320", y:"50", width:400, height:400, items:[map_view] },
                
                { xtype:"button",  x:"10",  y:"10",  height:30,  width:100,  text:"前一条", handler:showPrev },
                { xtype:"button",  x:"120",  y:"10",  height:30,  width:100,  text:"后一条", handler:showNext },
                
                { xtype:"button",  x:"500",  y:"10",  height:30,  width:100,  text:"删除", hidden:true }, 
                { xtype:"button",  x:"620",  y:"10",  height:30,  width:100,  id:'save-basic-42', iconCls:'save', text:"保存修改", handler: saveBasic
              }]
            },{ 
              xtype:"panel",
              title:"扩展信息",
              layout:"absolute",
              items:[{
                  xtype:'label', text:"项目名称",      x:"15" , y:"60"},
                { xtype:'label', text:"用地单位",      x:"355", y:"60"},
                { xtype:'label', text:"坐落位置",      x:"15", y:"90"},
                { xtype:'label', text:"土地利用整体规划",  x:"355", y:"90"},
                { xtype:'label', text:"原地类",       x:"15", y:"120"},
                { xtype:'label', text:"立项时间",      x:"15", y:"190"},
                { xtype:'label', text:"立项批文号",     x:"355", y:"190"},
                { xtype:'label', text:"规划定点时间",    x:"15", y:"220"},
                { xtype:'label', text:"规划定点批文号",   x:"355", y:"220"},
                { xtype:'label', text:"转征用时间",     x:"15", y:"250"},
                { xtype:'label', text:"转征用批文号",    x:"355", y:"250"},
                { xtype:'label', text:"供地时间",      x:"15", y:"280"},
                { xtype:'label', text:"批文号",       x:"355", y:"280"},
                { xtype:'label', text:"批准用途",      x:"15", y:"350"},
                { xtype:'label', text:"实际用途",      x:"355", y:"350"},
                { xtype:'label', text:"批准面积",      x:"15", y:"380"},
                { xtype:'label', text:"供地面积",      x:"355", y:"380"},
                { xtype:'label', text:"动工时间",      x:"15", y:"410"},
  
                { xtype:'label', text:"基本信息",      x:"15", y:"30", cls: 'x-form-item myBold'},
                { xtype:'label', text:"地块审批情况",    x:"15", y:"160", cls: 'x-form-item myBold'},
                { xtype:'label', text:"土地面积，用途",   x:"15", y:"320", cls: 'x-form-item myBold'},
        
                { name:"a_id",      x:"100", y:"60", xtype:"textfield", width:200},
                { name:"a_xmmc",    x:"100", y:"60", xtype:"textfield", width:200},
                { name:"a_yddw",    x:"480", y:"60", xtype:"textfield", width:200},
                { name:"a_zlwz",    x:"100", y:"90", xtype:"textfield", width:200},
                { name:"a_sffhztgh",x:"480", y:"90", xtype:"textfield", width:200},
                { name:"a_ydl",     x:"100", y:"120", xtype:"textfield", width:200},
  
                { name:"a_lxsj",   x:"100", y:"190", xtype:"datefield", width:200, format:'Y-m-d'},
                { name:"a_lxpwh",  x:"480", y:"190", xtype:"textfield", width:200},
                { name:"a_ghddsj", x:"100", y:"220", xtype:"datefield", width:200, format:'Y-m-d'},
                { name:"a_ghddh",  x:"480", y:"220", xtype:"textfield", width:200},
                { name:"a_zzysj",  x:"100", y:"250", xtype:"datefield", width:200, format:'Y-m-d'},
                { name:"a_zzypwh", x:"480", y:"250", xtype:"textfield", width:200},
                { name:"a_gdsj",   x:"100", y:"280", xtype:"datefield", width:200, format:'Y-m-d'},
                { name:"a_gdpwh",  x:"480", y:"280", xtype:"textfield", width:200},
  
                { name:"a_pzyt", x:"100", y:"350", xtype:"textfield", width:200},
                { name:"a_sjyt", x:"480", y:"350", xtype:"textfield", width:200},
                { name:"a_pzmj", x:"100", y:"380", xtype:"textfield", width:200},
                { name:"a_gdmj", x:"480", y:"380", xtype:"textfield", width:200},
                { name:"a_dgsj", x:"100", y:"410", xtype:"datefield", width:200, format:'Y-m-d'},
  
                { xtype:"panel", x:"10", y:"50", width:720 },
                { xtype:"panel", x:"10", y:"180", width:720 },
                { xtype:"panel", x:"10", y:"340", width:720 },
  
                { xtype:"button",  x:"500",  y:"10",  height:30,  width:100, iconCls:'delete', text:"删除", hidden:true, handler: deleteXmdks }, 
                { xtype:"button",  x:"620",  y:"10",  height:30,  width:100, iconCls:'save', text:"保存修改", handler : saveExtXmdks 
              }]
            },{
              xtype:"panel",
              title:"巡查历史",
              layout:"absolute",
              items:[{
                  xtype:"panel", x:"10", y:"10", width:700, height:175, items:[xcjl_grid], id:'panel-xcgl-grid', border:false},
                { xtype:"panel", x:"400",  y:"250", width:300, height:300, id:'panel-xctp', border:false, items:[data_view] },
                
                { xtype:"button", x:"400", y:"200", width:75, height:30, iconCls:'save', text:"保存修改",  handler : saveXcjl},
                { xtype:"button", x:"500", y:"200", width:75, height:30, iconCls:'refresh',text:"刷新",  handler : refreshXcjl},
  
                { xtype:"textfield", name:"h_inspect_id", x:"0", y:"200",hidden:true},
                { xtype:"textfield", name:"h_xmmc", x:"100", y:"200", width:250 },
                { xtype:"datefield", name:"h_xcrq", x:"100", y:"230", width:250, format:'Y-m-d H:i:s' },
                { xtype:"textfield", name:"h_jszt", x:"100", y:"260", width:250 },
                //{ xtype:"textfield", name:"h_xkz" , x:"100", y:"290", width:250 },
                //{ xtype:"textfield", name:"h_yjx" , x:"100", y:"320", width:250 },
                { xtype:"textfield", name:"h_sjyt", x:"100",  y:"290", width:250 },
                { xtype:"textfield", name:"h_sfwf", x:"100",  y:"320", width:250 },
                { xtype:"textfield", name:"h_sjzdmj", x:"100",y:"350", width:250 },
                { xtype:"textfield", name:"h_gdmj", x:"100",  y:"380", width:250 },
                { xtype:"textfield", name:"h_wfmj", x:"100",  y:"410", width:250 },
                { xtype:"textarea" , name:"h_bz",   x:"100",  y:"440", width:250, height:110},
                
  
                { xtype:"label", text:"项目名称", x:"15", y:"200"},
                { xtype:"label", text:"检查日期", x:"15", y:"230"},
                { xtype:"label", text:"建设状态", x:"15", y:"260"},
                //{ xtype:"label", text:"许可证" , x:"15", y:"290"},
                //{ xtype:"label", text:"永久性" , x:"15", y:"320"},
                { xtype:"label", text:"实际用途", x:"15",  y:"290"},
                { xtype:"label", text:"是否违法", x:"15",  y:"320"},
                { xtype:"label", text:"实际占地面积", x:"15",y:"350"},
                { xtype:"label", text:"耕地面积", x:"15",  y:"380"},
                { xtype:"label", text:"违法面积", x:"15",  y:"410"},
                { xtype:"label", text:"备注", x:"15",    y:"440"
              }]
          }]
      }]
  });  
  
  var xmdk_win = new Ext.Window({
    iconCls : 'add',
    id: 'view_xmdk_win',
    title: '查看地块',
    floating: true,
    shadow: true,
    draggable: true,
    resizable :false,
    closable: true,
    modal: true,
    width: 820,
    height: 625,
    layout: 'fit',
    plain: true,
    items:[xmdksPanel]
  });
  
  xmdk_win.show();
  xmdk_win.setZIndex(9020);
  
  Ext.getCmp('view_xmdk_win').setTitle('查看地块');
  
  var form = Ext.getCmp('xmdks-panel-id').getForm();
  data = gsm.selections.items[0]['data'];
  
  form.findField("gid" ).setValue(data.gid );
  form.findField("xmmc").setValue(data.xmmc);
  form.findField("yddw").setValue(data.yddw);
  form.findField("pzwh").setValue(data.pzwh);
  form.findField("sfjs").setValue(data.sfjs);
  form.findField("tdzl").setValue(data.tdzl);
  form.findField("dkmj").setValue(data.dkmj);
  form.findField("xzqh").setValue(data.xzqh);
  form.findField("tbmj").setValue(data.shape_area);
  form.findField("tbzc").setValue(data.shape_len);
  if (data.jlrq != null ) form.findField("jlrq").setValue(new Date(data.jlrq));
  
  if (data.xz_tag != '是' || data.xz_tag == undefined) {
    form.findField("gid" ).setReadOnly(true);
    form.findField("xmmc").setReadOnly(true);
    form.findField("yddw").setReadOnly(true);
    form.findField("pzwh").setReadOnly(true);
    form.findField("sfjs").setReadOnly(true);
    form.findField("tdzl").setReadOnly(true);
    form.findField("dkmj").setReadOnly(true);
    form.findField("xzqh").setReadOnly(true);
    form.findField("tbmj").setReadOnly(true);
    form.findField("tbzc").setReadOnly(true);
    form.findField("jlrq").setReadOnly(true);
    Ext.getCmp('save-basic-42').hide();
  }

  //设置a_xmdks
  pars = {gid:data.gid};
  new Ajax.Request("/desktop/get_a_xmdks", { 
    method: "POST",
    parameters: pars,
    onComplete:  function(request) {
      var datas = eval("("+request.responseText+")");
      data = datas[0]
      
      var form = Ext.getCmp('xmdks-panel-id').getForm();
      
      form.findField("a_id").setValue(data.id);
      form.findField("a_xmmc").setValue(data.xmmc);
      form.findField("a_yddw").setValue(data.yddw);
      form.findField("a_zlwz").setValue(data.zlwz);
      form.findField("a_sffhztgh").setValue(data.sffhztgh);
      form.findField("a_ydl").setValue(data.ydl);
      if (data.lxsj != null) form.findField("a_lxsj").setValue(new Date(data.lxsj));
      form.findField("a_lxpwh").setValue(data.lxpwh);
      if (data.ghddsj != null) form.findField("a_ghddsj").setValue(new Date(data.ghddsj));
      form.findField("a_ghddh").setValue(data.ghddh);
      if (data.zzysj != null) form.findField("a_zzysj").setValue(new Date(data.zzysj));
      form.findField("a_zzypwh").setValue(data.zzypwh);
      if (data.gdsj != null) form.findField("a_gdsj").setValue(new Date(data.gdsj));
      form.findField("a_gdpwh").setValue(data.gdpwh);
      form.findField("a_pzyt").setValue(data.pzyt);
      form.findField("a_sjyt").setValue(data.sjyt);
      form.findField("a_pzmj").setValue(data.pzmj);
      form.findField("a_gdmj").setValue(data.gdmj);
      if (data.dgsj != null) form.findField("a_dgsj").setValue(new Date(data.dgsj));
      
      form.findField("a_xmmc").setReadOnly(true);
      
    }  
  }); 
  
  // 设置地图
  ss = data.the_center.match(/POINT\(([-]*\d+\.*\d*)\s*([-]*\d+\.*\d*)\)/);
  draw_marker(parseFloat(ss[1]), parseFloat(ss[2]) ); 
  
  draw_xmdks(data.geom_string);
  //panel xmdk_pic
  //xmdk_panel_img.setSrc('/images/xctx/0_0_IMAGE_0011.JPG');
  
}

var delete_xmdks = function(sys_grid_id) {
   var xmdks_grid = Ext.getCmp(sys_grid_id);
   var gsm =Ext.getCmp(sys_grid_id).getSelectionModel();
   var items = gsm.selections.items;
   id_str = '';
   for (var i=0; i < items.length; i ++) {
     if (i==0) {
       id_str = id_str+items[i].data.gid;
     } else {
       id_str = id_str + ',' +items[i].data.gid ;
     }

   };
   pars = {id:id_str};
   new Ajax.Request("/desktop/delete_selected_xmdks", { 
     method: "POST",
     parameters: pars,
     onComplete:  function(request) {
       xmdks_grid.store.load();
     }
   });
};

// 修改任务窗口
var view_plans = function (sys_grid_id) {
  
  var xmdks_grid = Ext.getCmp(sys_grid_id);
  var gsm =Ext.getCmp(sys_grid_id).getSelectionModel();
  var data = gsm.selections.items[0]['data'];
  
  //设置图像
  var setImages = function(request) {

    var datas = eval("("+request.responseText+")");
    Ext.get('drop-img').update(datas['xctx']);
    Ext.get('drag-img').update(datas['kytx']);

    Ext.get('hsz-img').update('<div id="repair" class="availableLot repair"></div>')

    var overrides = {
        // Only called when element is dragged over the a dropzone with the same ddgroup
        onDragEnter : function(evtObj, targetElId) {
            // Colorize the drag target if the drag node's parent is not the same as the drop target
            if (targetElId != this.el.dom.parentNode.id) {
                this.el.addClass('dropOK');
            }
            else {
                // Remove the invitation
                this.onDragOut();
            }
        },
        // Only called when element is dragged out of a dropzone with the same ddgroup
        onDragOut : function(evtObj, targetElId) {
            this.el.removeClass('dropOK');
        },
        //Called when mousedown for a specific amount of time
        b4StartDrag : function() {
            if (!this.el) {
                this.el = Ext.get(this.getEl());
            }
            //this.el.highlight();
            //Cache the original XY Coordinates of the element, we'll use this later.
            this.originalXY = this.el.getXY();
        },
        // Called when element is dropped not anything other than a
        // dropzone with the same ddgroup
        onInvalidDrop : function() {
            this.invalidDrop = true;

        },
        endDrag : function() {
            if (this.invalidDrop === true) {
                this.el.removeClass('dropOK');

                var animCfgObj = {
                    easing   : 'elasticOut',
                    duration : 1,
                    scope    : this,
                    callback : function() {
                        this.el.dom.style.position = '';
                    }
                };
                this.el.moveTo(this.originalXY[0], this.originalXY[1], animCfgObj);
                delete this.invalidDrop;
            }

        },
        // Called upon successful drop of an element on a DDTarget with the same
        onDragDrop : function(evtObj, targetElId) {
            // Wrap the drop target element with Ext.Element
            var dropEl = Ext.get(targetElId);

            // Perform the node move only if the drag element's parent is not the same as the drop target
            if (this.el.dom.parentNode.id != targetElId) {

                // Move the element
                dropEl.appendChild(this.el);

                // Remove the drag invitation
                this.onDragOut(evtObj, targetElId);

                // Clear the styles
                this.el.dom.style.position ='';
                this.el.dom.style.top = '';
                this.el.dom.style.left = '';
            }
            else {
                // This was an invalid drop, lets call onInvalidDrop to initiate a repair
                this.onInvalidDrop();
            }
        }
    };

    // Configure the cars to be draggable
    var carElements = Ext.get('cars').select('div');
    Ext.each(carElements.elements, function(el) {
        var dd = new Ext.dd.DD(el, 'carsDDGroup', {
            isTarget  : false
        });
        Ext.apply(dd, overrides);
    });

    var rentedElements = Ext.get('rented').select('div');
    Ext.each(rentedElements.elements, function(el) {
        var dd = new Ext.dd.DD(el, 'rentedDDGroup', {
            isTarget  : false
        });
        Ext.apply(dd, overrides);
    });

    var repairElements = Ext.get('repair').select('div');
    Ext.each(repairElements.elements, function(el) {
        var dd = new Ext.dd.DD(el, 'repairDDGroup', {
            isTarget  : false
        });
        Ext.apply(dd, overrides);
    });

    var carsDDTarget    = new Ext.dd.DDTarget('cars','carsDDGroup');
    var rentedDDTarget  = new Ext.dd.DDTarget('rented', 'rentedDDGroup');
    var repairDDTarget  = new Ext.dd.DDTarget('repair', 'repairDDGroup');

    rentedDDTarget.addToGroup('carsDDGroup');
    carsDDTarget.addToGroup('rentedDDGroup');

    rentedDDTarget.addToGroup('repairDDGroup');
    repairDDTarget.addToGroup('rentedDDGroup');

    repairDDTarget.addToGroup('carsDDGroup');
    carsDDTarget.addToGroup('repairDDGroup');

  };
  
  // button 处理函数
  var saveBasic = function() {
    var form = Ext.getCmp('plan_panel_id').getForm();
    
    var plan_id = form.findField('plan_id').getValue();
    var xclx = form.findField('xclx').getValue();
    var xcry = form.findField('xcry').getValue();
    var xcnr = form.findField('xcnr').getValue();
    var xcjg = form.findField('xcjg').getValue();
    var clyj = form.findField('clyj').getValue();
    
    pars = {plan_id:plan_id, xclx:xclx, xcry:xcry, xcnr:xcnr, xcjg:xcjg, clyj:clyj};
    new Ajax.Request("/desktop/save_plan_basic", { 
      method: "POST",
      parameters: pars,
      onComplete:  function(request) {
        if (request.responseText == 'Success') {
          //plan_win.close();
          gsm.grid.store.load();
          //plan_store.load();
          alert ('保存成功！')
        } else {
          //msg('失败', '新增任务失败!');
        }
      }
    });
    
  }; 
  
  var refreshPhoto = function() {
    var form = Ext.getCmp('plan_panel_id').getForm();
    plan_id = form.findField('plan_id').getValue();
    
    pars = {id:plan_id};
    new Ajax.Request("/desktop/get_xcimage", { 
      method: "POST",
      parameters: pars,
      onComplete:  function(request) {
        setImages(request);
      }  
    });            
  }
  
  var addPhoto = function() {
      var fp = new Ext.FormPanel({
          fileUpload: true,
          width: 500,
          frame: true,
          autoHeight: true,
          bodyStyle: 'padding: 10px 10px 0 10px;',
          labelWidth: 50,
          defaults: {
              anchor: '95%',
              //allowBlank: false,
              msgTarget: 'side'
          },
          items: [{
              xtype: 'textfield',
              name: 'photo-desc',
              fieldLabel: '描述'
          },{
              xtype: 'fileuploadfield',
              id: 'form-file',
              emptyText: '选择一幅图像',
              fieldLabel: '图像',
              name: 'photo-path',
              buttonText: '',
              buttonCfg: {
                  iconCls: 'upload-icon'
              }
          }],
          buttons: [{
              text: '上传',
              handler: function(){
                  if(fp.getForm().isValid()){
                    fp.getForm().submit({
                        url: '/desktop/upload_file',
                        waitMsg: '文件上传中...',
                        success: function(form, action){
                          var isSuc = action.result.success; 
                          if (isSuc) {
                             msg('成功', '文件上传成功.');
                          } else { 
                            msg('失败', '文件上传失败.');
                          }
                        }, 
                        failure: function(){
                          msg('失败', '文件上传失败.');
                        }
                    });
                  }
              }
          },{
              text: '重置',
              handler: function(){
                  fp.getForm().reset();
              }
          }]
      });
      var yysc_win = new Ext.Window({
        iconCls : 'add',
        title: '影像上传',
        floating: true,
        shadow: true,
        draggable: true,
        closable: true,
        modal: true,
        width: 350,
        height: 140,
        layout: 'fit',
        plain: true,
        items:[fp]
      });
      yysc_win.show();
  }
  
  var savePhoto = function() {
    
    xcElements = Ext.get('cars').select('img');
    pp = '';
    Ext.each(xcElements.elements, function(el) {
      pp = pp + el.src + '|';
    });

    pars = {imgs:pp, id:gsm.selections.items[0].data.id};
    new Ajax.Request("/desktop/save_selected_photo", { 
      method: "POST",
      parameters: pars,
      onComplete:  function(request) {
        setImages(request);
      }
    });
  }
  
  var emptyHsz = function() {
    
    xcElements = Ext.get('repair').select('img');
    pp = '';
    Ext.each(xcElements.elements, function(el) {
      pp = pp + el.src + '|';
    });

    pars = {imgs:pp, id:gsm.selections.items[0].data.id};
    new Ajax.Request("/desktop/delete_selected_photo", { 
      method: "POST",
      parameters: pars,
      onComplete:  function(request) {
        setImages(request);
      }
    });
    
  }
  
  var saveXcdInfo = function() {
    var form = Ext.getCmp('plan_panel_id').getForm();
    var plan_id = form.findField('plan_id').getValue();
    var inspect_id = form.findField('x_inspect_id').getValue();
    
    var jszt = form.findField('x_jszt').getValue();
    //var xkz = form.findField('xkz' ).getValue();
    //var yjx = form.findField('yjx' ).getValue();
    var sjyt = form.findField('x_sjyt').getValue();
    var gdmj = form.findField('x_gdmj').getValue();
    var sfwf = form.findField('x_sfwf').getValue();
    var wfmj = form.findField('x_wfmj').getValue();
    var clyj = form.findField('x_clyj_3').getValue();
    
    pars = {inspect_id:inspect_id, jszt:jszt, sjyt:sjyt, gdmj:gdmj, sfwf:sfwf, wfmj:wfmj, clyj:clyj};
    new Ajax.Request("/desktop/save_inspect_basic", { 
      method: "POST",
      parameters: pars,
      onComplete:  function(request) {
        if (request.responseText == 'Success') {
          xcd_store.load();
          msg('成功', '保存成功！');
        } else {
        }
      }
    });
    
  }
  
  var addPhoto2 = function() {
    var fp = new Ext.FormPanel({
        fileUpload: true,
        width: 500,
        frame: true,
        autoHeight: true,
        bodyStyle: 'padding: 10px 10px 0 10px;',
        labelWidth: 50,
        defaults: {
            anchor: '95%',
            //allowBlank: false,
            msgTarget: 'side'
        },
        items: [{
            xtype: 'textfield',
            name: 'inspect_id',
            hidden: true
        },{
            xtype: 'textfield',
            name: 'photo-desc',
            fieldLabel: '描述'
        },{
            xtype: 'fileuploadfield',
            id: 'form-file',
            emptyText: '选择一幅图像',
            fieldLabel: '图像',
            name: 'photo-path',
            buttonText: '',
            buttonCfg: {
                iconCls: 'upload-icon'
            }
        }],
        buttons: [{
            text: '上传',
            handler: function(){
                var form = Ext.getCmp('plan_panel_id').getForm();
                var inspect_id = form.findField("inspect_id").getValue();
                fp.getForm().findField("inspect_id").setValue(inspect_id);
                
                if(fp.getForm().isValid()){
                  fp.getForm().submit({
                      url: '/desktop/upload_xmdks_file',
                      waitMsg: '文件上传中...',
                      success: function(form, action){
                        var isSuc = action.result.success; 
                        if (isSuc) {
                           msg('成功', '文件上传成功.');
                           //reload xcd
                           img_store.load();
                        } else { 
                          msg('失败', '文件上传失败.');
                        }
                      }, 
                      failure: function(){
                        msg('失败', '文件上传失败.');
                      }
                  });
                }
            }
        },{
            text: '重置',
            handler: function(){
                fp.getForm().reset();
            }
        }]
    });
    
    var yysc_win = new Ext.Window({
      iconCls : 'add',
      title: '影像上传',
      floating: true,
      shadow: true,
      draggable: true,
      closable: true,
      modal: true,
      width: 350,
      height: 140,
      layout: 'fit',
      plain: true,
      items:[fp]
    });
    
    yysc_win.show();
  }
  
  //store for xcd
  var xcd_store = new Ext.data.Store({
    proxy: new Ext.data.HttpProxy({
      url: '/desktop/get_xcd_xmdk'
    }),
    reader: new Ext.data.JsonReader({
      totalProperty: 'results', 
      root: 'rows',             
      fields: [
        {name: 'gid',    type: 'integer'},
        {name: 'xmmc',  type: 'string'}
      ]    
    }),
    sortInfo:{field: 'gid', direction: "ASC"}
  });
  
  var sm = new Ext.grid.CheckboxSelectionModel();
  var xcd_grid = new Ext.grid.GridPanel({
    id: 'xcd_grid_id',
    store: xcd_store,
    height:458,
    layout:'fit',
    columns: [           
      sm,
      { header : '编号',    width : 50, sortable : true, dataIndex: 'gid', hidden:'true'},            
      { header : '项目名称',  width : 80, sortable : true, dataIndex: 'xmmc'}
    ],
    sm:sm, 
    columnLines: true,
    viewConfig: {
      stripeRows:true,
    }
  });
  
  xcd_grid.on('rowclick', function(grid, row, e){
    var data = grid.store.data.items[row].data;

    var form = Ext.getCmp('plan_panel_id').getForm();
    form.findField("x_xmmc").setValue(data.xmmc);
    
    plan_id = form.findField('plan_id').getValue();
    pars = {xmdk_id:data.gid,plan_id:plan_id};
    
    new Ajax.Request("/desktop/get_inspect_data",{
      method: "POST",
      parameters : pars,
      onComplete: function(request) {
        data = eval('('+request.responseText+')')[0];

        var form = Ext.getCmp('plan_panel_id').getForm();
        form.findField("x_xcrq").setValue(data.xcrq);
        form.findField("x_jszt").setValue(data.jszt);
        //form.findField("xkz" ).setValue(data.xkz);
        //form.findField("yjx" ).setValue(data.yjx);
        form.findField("x_sjyt").setValue(data.sjyt);
        form.findField("x_gdmj").setValue(data.gdmj);
        form.findField("x_sfwf").setValue(data.sfwf);
        form.findField("x_wfmj").setValue(data.wfmj);
        form.findField("x_clyj_3").setValue(data.clyj);
        form.findField("x_inspect_id").setValue(data.id);
        
      }  
    });
    
    //load images 
    img_store.baseParams = {xmdk_id:data.gid,plan_id:plan_id};;
    img_store.load();
  
  });

  xcd_store.on('load', function(){
    
    if (xcd_store.data.items.length > 0) {
      
      var xcd_grid = Ext.getCmp('xcd_grid_id');
      //xcd_grid.getSelectionModel().selectRow(0);

      var data = xcd_grid.store.data.items[0]['data'];
      var form = Ext.getCmp('plan_panel_id').getForm();
      form.findField("x_xmmc").setValue(data.xmmc);
      
      // get inspect data
      plan_id = form.findField('plan_id').getValue();
      pars = {xmdk_id:data.gid,plan_id:plan_id};
      new Ajax.Request("/desktop/get_inspect_data",{ 
        method: "POST",
        parameters : pars,
        onComplete: function(request) {
          data = eval('('+request.responseText+')')[0];

          var form = Ext.getCmp('plan_panel_id').getForm();
          form.findField("x_xcrq").setValue(data.xcrq);
          form.findField("x_jszt").setValue(data.jszt);
          //form.findField("xkz" ).setValue(data.xkz);
          //form.findField("yjx" ).setValue(data.yjx);
          form.findField("x_sjyt").setValue(data.sjyt);
          form.findField("x_gdmj").setValue(data.gdmj);
          form.findField("x_sfwf").setValue(data.sfwf);
          form.findField("x_wfmj").setValue(data.wfmj);
          form.findField("x_clyj_3").setValue(data.clyj);
          form.findField("x_inspect_id").setValue(data.id);
        }  
      });
      // get inspect images 
      
    } else {
      console.log("no data loaded")
    }
  });

  //Data View for task
  //demo dataview for 
  var img_store = new Ext.data.Store({
    proxy: new Ext.data.HttpProxy({
        url: '/desktop/get_xcimage_json'
    }),
    reader: new Ext.data.JsonReader({
      totalProperty: 'results', 
      root: 'rows',             
      fields: [
        {name: 'id',    type: 'integer'},
        {name: 'yxmc',  type: 'string'},
        {name: 'rq',    type: 'string'},
        {name: 'bz',    type: 'string'},
        {name: 'tpjd',  type: 'string'}
      ]    
    }),
    sortInfo:{field: 'id', direction: "ASC"}
  });

  //
  img_store.baseParams = {plan_id:data.id};
  img_store.load();
  
  //Data-Views
  var data_view = new Ext.DataView({
      itemSelector: 'div.thumb-wrap',
      width:300,
      height:300,
      style:'overflow:auto',
      multiSelect: false,
      plugins: new Ext.DataView.DragSelector({dragSafe:true}),
      store: img_store,
      overClass: 'x-view-over',
      tpl: new Ext.XTemplate(
          '<tpl for=".">',
          '<div class="thumb-wrap" id="{id}">',
          '<div class="thumb"><img src="/images/dady/xctx/{yxmc}" class="thumb-img"></div>',
          '<span>{rq}&nbsp;{bz}&nbsp;{tpjd}</span></div>',
          '</tpl>'
      ),
      listeners: {
        click: function(dv, index, node, e) {
          var data = img_store.getAt(index);
          if (typeof data == 'object') {
            //window.open('/images/dady/xctx/' + data.data.yxmc ) ;
             show_images('/images/dady/xctx/' + data.data.yxmc.replace('-thumb', '').replace('jpg','JPG') ) ;
          }
        }
      }
  });
  
  // end of xcd_grid 


  //componets for map_view 
  var options = {
    projection: new OpenLayers.Projection('EPSG:900913'), units: "m", maxResolution: 152.87405654296876,
    maxExtent: new OpenLayers.Bounds(-2.003750834E7,-2.003750834E7,2.003750834E7,2.003750834E7) 
  };
  //Add markers 
  
  
  var map  = new OpenLayers.Map($('map_route'), options);
  var gmap = new OpenLayers.Layer.Google( "谷歌地图", { numZoomLevels: 18} );
  var xmdk_vectors = new OpenLayers.Layer.Vector("任务地块", { isBaseLayer: false, styleMap: styles });
  var markers = new OpenLayers.Layer.Markers( "检查点" );
  var geocoder = new google.maps.Geocoder();
  var infowindow = new google.maps.InfoWindow();

  map.addLayers([gmap, xmdk_vectors, markers]);
  
  map.events.register("click", map , function(e){
    //var opx = map.getLayerPxFromViewPortPx(e.xy) ;
    var ll1 = map.getLonLatFromPixel(e.xy);
    ll1.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"))
    
    var latlng = new google.maps.LatLng(ll1.lat, ll1.lon);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          
          var size = new OpenLayers.Size(21,25);
          var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
          var icon = new OpenLayers.Icon('/images/marker-blue.png',size,offset);

          ll1.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"))
          markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(ll1.lon, ll1.lat),icon));
          
          var form = Ext.getCmp('plan_panel_id').getForm();
          var xclx = form.findField('xclx').getValue();
          form.findField('xclx').setValue(xclx + '->' + results[0].address_components[1].short_name +  results[0].address_components[0].short_name);
          
          //infowindow.setContent(results[1].formatted_address);
          //infowindow.open(map, marker);
        } else {
          //alert('No results found');
        }
      } else {
        alert('Geocoder 失败: ' + status);
      }
    });
    
  });
  
  var map_view = new Ext.Panel({
    id : 'map_route',
    autoScroll: true,
    xtype:"panel",
    width:315,
    height:310,
    border:false,
    style:'margin:0px 0px',
    layout:'fit',
    items: [{
        xtype: 'gx_mappanel',
        map: map
    }]
  });
  

  var draw_task  = function(geom_string, bound_string){
    
    if (xmdk_vectors.features.length > 0){
      while (xmdk_vectors.features.length > 0) {
        var vectorFeature = xmdk_vectors.features[0];
        xmdk_vectors.removeFeatures(vectorFeature);
      };
    };
    
    if (geom_string != '') {
      var geojson_format = new OpenLayers.Format.GeoJSON();
      xmdk_vectors.addFeatures(geojson_format.read(geom_string));
      
      //var pts = geojson_format.read(bound_string);
      //BOX(13462257 3723907.25,13473980 3731119.25)
      var ss = bound_string.match(/BOX\((.*)\s(.*),(.*)\s(.*)\)/);
      var bounds = new OpenLayers.Bounds(ss[1],ss[2],ss[3],ss[4]);
  
      map.zoomToExtent (bounds);
      
    };
    
  };

  var planPanel = new Ext.form.FormPanel({
      xtype:"panel",
      id:'plan_panel_id',
      closable : true,
      layout: 'absolute',
      width:800,
      height:600,
      border: 'true',
      items:[{
          xtype:"tabpanel",
          deferredRender:false,
          activeTab:0,
          width:800,
          height:600,
          items :[{
            xtype:"panel",
            title:"基本信息",
            layout:"absolute", 
            items:[{
               xtype:"textfield", name:"plan_id", x:"0", y:"0",  width:0, height:0, hidden:true},
              { xtype:"label", text:"开始时间:", x:"25",  y:"15"  },
              { xtype:"label", text:"结束时间:", x:"225", y:"15"  },
              { xtype:"label", text:"巡查时间:", x:"25",  y:"45"  },
              { xtype:"label", text:"巡查人员:", x:"25",  y:"75"  },
              { xtype:"label", text:"巡查区域:", x:"25",  y:"105"  },
              { xtype:"label", text:"协查人员:", x:"25",  y:"135" },

              { xtype:"label", text:"巡查路线:", x:"25",  y:"165"  },
              { xtype:"label", text:"巡查内容:", x:"25",  y:"265" },
              { xtype:"label", text:"巡查结果:", x:"25",  y:"365" },
              { xtype:"label", text:"处理意见:", x:"25",  y:"465" },
              
              { xtype:"button",  iconCls:'save', x:"650", y:"10",  height:25,  width:75,  text:"&nbsp;保存", handler : saveBasic}, 
              
              
              { xtype:"textfield", name:"kssj", x:"100", y:"10",  width:100, height:25},
              { xtype:"textfield", name:"jssj", x:"300", y:"10",  width:100, height:25},
              { xtype:"textfield", name:"xcrq", x:"100", y:"40",  width:300, height:25},
              { xtype:"textfield", name:"username", x:"100", y:"70",  width:300, height:25},
              { xtype:"textfield", name:"xcqy", x:"100", y:"100",     width:300, height:25},
              { xtype:"textfield", name:"xcry", x:"100",  y:"130",     width:300, height:25},

              { xtype:"textarea",  name:"xclx", x:"100",  y:"160", width:300, height:90},
              { xtype:"textarea",  name:"xcnr", x:"100",  y:"260", width:300, height:90},
              { xtype:"textarea",  name:"xcjg", x:"100",  y:"360", width:625, height:90},
              { xtype:"textarea",  name:"clyj", x:"100",  y:"460", width:625, height:90},
              { xtype:"panel",     x:"410", y:"40", width:315, height:310, items:[map_view] 
              //{ xtype : 'box',  x: 425 , y: 60,  width: 300, height: 190, id: 'xclxt', autoEl: {tag: 'div', html:''} 
            }]                 
          },{
            xtype:"panel",
            title:"照片管理",
            layout:"absolute",
            items:[{
              
                xtype : 'box', id : 'drop-img',  border : true, x: 25 , y: 70,  width: 240, height: 445, name: 'xctx', autoEl: {tag: 'div', id : 'drop-img',html: ''} },
              { xtype : 'box', id : 'drag-img',  border : true, x: 285, y: 70,  width: 240, height: 445, name: 'kytx', autoEl: {tag: 'div', id : 'drag-img',html: ''} },
              { xtype : 'box', id : 'hsz-img' ,  border : true, x: 545, y: 70,  width: 240, height: 445, name: 'hsz' , autoEl: {tag: 'div', id : 'hsz-img' ,html: '' } },

              { xtype:"button",  x:"25",  y:"10",  height:30,  width:75,  iconCls:'add', text:"添加照片" , handler : addPhoto}, 
              { xtype:"button",  x:"115", y:"10",  height:30,  width:75,  iconCls:'refresh', text:"刷新图片" , handler : refreshPhoto}, 
              { xtype:"button",  x:"200", y:"10",  height:30,  width:75,  iconCls:'save', text:"保存"   , handler : savePhoto}, 
              { xtype:"button",  x:"700", y:"10",  height:30,  width:75,  iconCls:'delete3',text:"清空"   , handler : emptyHsz}, 
              

              { xtype:"label", text:"巡查照片:", x:"25",   y:"55" },
              { xtype:"label", text:"可用照片:", x:"285",  y:"55" },
              { xtype:"label", text:"回收站:",  x:"545",  y:"55"
            
            }]
          },{
            xtype:"panel",
            title:"巡查点",
            layout:"absolute",
            height:600,
            items:[{
                xtype:"textfield", name:"x_xmmc", x:"250", y:"45",   width:200, height:30},
              { xtype:"textfield", name:"x_xcrq", x:"250", y:"85",  width:200, height:30},
              { xtype:"textfield", name:"x_jszt", x:"250", y:"125",  width:200, height:30},
              //{ xtype:"textfield", name:"xkz" , x:"250", y:"165",  width:200, height:30},
              //{ xtype:"textfield", name:"yjx" , x:"250", y:"205",  width:200, height:30},
              { xtype:"textfield", name:"x_sjyt", x:"250", y:"165",  width:200, height:30},
              { xtype:"textfield", name:"x_gdmj", x:"250", y:"205",  width:200, height:30},
              { xtype:"textfield", name:"x_sfwf", x:"250", y:"245",  width:200, height:30},
              { xtype:"textfield", name:"x_wfmj", x:"250", y:"285",  width:200, height:30},
              { xtype:"textarea",  name:"x_clyj_3", x:"250", y:"405",  width:525, height:100},
              { xtype:"textarea",  name:"x_inspect_id", x:"0", y:"0",  hidden:'true'},
              

              { xtype:"label", text:"项目名称", x:"175", y:"50" },
              { xtype:"label", text:"检查日期", x:"175", y:"90"},
              { xtype:"label", text:"建设状态", x:"175", y:"130"},
              //{ xtype:"label", text:"许可证" , x:"175", y:"170"},
              //{ xtype:"label", text:"永久性" , x:"175", y:"210"},
              { xtype:"label", text:"实际用途", x:"175", y:"170"},
              { xtype:"label", text:"耕地面积", x:"175", y:"210"},
              { xtype:"label", text:"是否违法", x:"175", y:"250"},
              { xtype:"label", text:"违法面积", x:"175", y:"290"},
              
              { xtype:"label", text:"处理意见", x:"175", y:"410"},

              { xtype:"label", text:"巡查点列表", x:"25", y:"20"},
              { xtype:"label", text:"巡查照片",  x:"480", y:"20"},
              
              { xtype : 'panel',  x: 25 , y: 45,  width: 120, height: 470, id:'box-xcd-list', border:false, items:[xcd_grid]}, 
              { xtype : 'panel',  x: 470 , y: 45,  width: 300, height: 340, id:'box-xctp', items:[data_view]},
                
              { xtype:"button",  x:"690", y:"10",  height:30,  width:75,  iconCls:'add', text:"添加照片"  ,  handler : addPhoto2}, 
              { xtype:"button",  x:"175", y:"10",   height:30,  width:75,  iconCls:'save', text:"保存修改" ,  handler : saveXcdInfo
              
            }]
          }]
      }]
  });

  var plan_win = new Ext.Window({
    id : 'add_plan_win',
    iconCls : 'edit',
    title: '计划任务',
    floating: true,
    shadow: true,
    draggable: true,
    resizable :false,
    closable: true,
    modal: true,
    width: 820,
    height: 625,
    layout: 'fit',
    plain: true,
    items:[planPanel]
  });


  plan_win.show();
  plan_win.setZIndex(9020);

  if (gsm == undefined) {
    //Ext.getCmp('add_plan_win').setTitle('计划任务');
  } else {
    Ext.getCmp('add_plan_win').setTitle('修改任务');
    var form = Ext.getCmp('plan_panel_id').getForm();
    data = gsm.selections.items[0]['data'];
    
    form.findField('plan_id').setValue(data.id);
    form.findField('kssj').setValue(data.qrq);
    form.findField('jssj').setValue(data.zrq);
    form.findField('xclx').setValue(data.xclx);
    form.findField('xcry').setValue(data.xcry);
    form.findField('username').setValue(data.username);
    form.findField('xcqy').setValue(data.xcqy);
    form.findField('xcrq').setValue(data.xcrq);

    
    form.findField('xcnr').setValue(data.xcnr);
    form.findField('xcjg').setValue(data.xcjg);
    form.findField('clyj').setValue(data.clyj);
    
    
    form.findField("kssj" ).setReadOnly(true);
    form.findField("jssj").setReadOnly(true);
    form.findField("xcrq").setReadOnly(true);
    form.findField("username").setReadOnly(true);
    form.findField("xcqy").setReadOnly(true);
    
    form.findField("x_xmmc" ).setReadOnly(true);
    form.findField("x_xcrq").setReadOnly(true);
    
    

    //map.setCenter(new OpenLayers.LonLat(13370424.384,3693277.655), 14);
    
    draw_task(data.geom_string, data.boundary);
    
  };

  
  //设置巡查图像
  pars = {id:data.id};
  new Ajax.Request("/desktop/get_xcimage", { 
    method: "POST",
    parameters: pars,
    onComplete:  function(request) {
      setImages(request);
    }  
  }); 
  
  //设置巡查点
  xcd_store.baseParams = {plan_id:data.id};
  xcd_store.load();

             
};


function myTask(id) {
  switch (id) {
    case 1 : //已完成任务
    {
      var tabPanel = Ext.getCmp("mytask-tab");
      
      if (Ext.getCmp('mytask-tab1') == undefined) {
        
        //Helper funtions
        var view_plans_handler = function(){
          view_plans ('my_plan_grid_id');
        };

        var view_print_pdf     = function(){
          items = Ext.getCmp('my_plan_grid_id').getSelectionModel().selections.items;
          pars = {id:items[0].data.id};
          new Ajax.Request("/desktop/view_pdf", { 
            method: "POST",
            parameters: pars,
            onComplete:  function(request) {
              var new_url = request.responseText;
              window.open(new_url,'','height=500,width=800,top=150, left=100,scrollbars=yes,status=yes');
            }  
          });
        };
        
        var plan_store = new Ext.data.Store({
          proxy: new Ext.data.HttpProxy({
              url: '/desktop/get_plan'
          }),
          reader: new Ext.data.JsonReader({
            totalProperty: 'results', 
            root: 'rows',             
            fields: [
              {name: 'id',    type: 'integer'},
              {name: 'xcbh',  type: 'string'},
              {name: 'rwmc',  type: 'string'},
              {name: 'tbdw',  type: 'string'},
              {name: 'xcsj',  type: 'string'},
              {name: 'xclx',  type: 'string'},
              {name: 'xcry',  type: 'string'},
              {name: 'xcfs',  type: 'string'},
              {name: 'xcqy',  type: 'string'},
              {name: 'xcnr',  type: 'string'},
              {name: 'xcjg',  type: 'string'},
              {name: 'clyj',  type: 'string'},
              {name: 'qrq',   type: 'string'},
              {name: 'zrq',   type: 'string'},
              {name: 'xmdk',  type: 'string'},
              {name: 'tbr',   type: 'string'},
              {name: 'fzr',   type: 'string'},
              {name: 'bz',    type: 'string'},
              {name: 'zt',    type: 'string'},
              {name: 'username',  type: 'string'},
              {name: 'geom_string', type:'string'},
              {name: 'boundary', type:'string'},
              {name: 'xcrq',  type: 'string'}
            ]    
          }),
          sortInfo:{field: 'id', direction: "ASC"}
          
        });

        //load data
        plan_store.baseParams.zt = "全部";
        plan_store.baseParams.limit = "20";
        plan_store.baseParams.xcry = currentUser.username;

        var sm = new Ext.grid.CheckboxSelectionModel();
        var planGrid = new Ext.grid.GridPanel({
          id: 'my_plan_grid_id',
          store: plan_store,
          columns: [
            sm,
            { header : 'id',    width : 75, sortable : true, dataIndex: 'id', hidden:true},
            { header : '巡查编号',  width : 100, sortable : true, dataIndex: 'xcbh', hidden:true},
            { header : '任务名称',  width : 200, sortable : true, dataIndex: 'rwmc'},
            { header : '计划时间',  width : 75, sortable : true, dataIndex: 'qrq', renderer: Ext.util.Format.dateRenderer('Y-m-d')},
            { header : '巡查方式',  width : 75, sortable : true, dataIndex: 'xcfs'},
            { header : '填报单位',  width : 75, sortable : true, dataIndex: 'tbdw', hidden:true},
            { header : '巡查路线',  width : 75, sortable : true, dataIndex: 'xclx', hidden:true},
            { header : '巡查时间',  width : 75, sortable : true, dataIndex: 'xcrq'},
            { header : '巡查人员',  width : 75, sortable : true, dataIndex: 'xcry'},
            { header : '巡查区域',  width : 75, sortable : true, dataIndex: 'xcqy'},
            { header : '巡查内容',  width : 75, sortable : true, dataIndex: 'xcnr'},
            { header : '巡查结果',  width : 75, sortable : true, dataIndex: 'xcjg'},
            { header : '处理意见',  width : 75, sortable : true, dataIndex: 'clyj'},
            { header : '状态',    width : 75, sortable : true, dataIndex: 'zt'},
            { header : '备注',    width : 75,   sortable : true, dataIndex: 'bz'}
            ],
          sm:sm,  
          columnLines: true,
          layout:'fit',
          viewConfig: {
            stripeRows:true,
          },
          tbar:[{
              text : '修改任务',
              iconCls : 'edit',
              handler : view_plans_handler 
            },{    
              text : '打印预览',
              iconCls : 'detail',
              handler : view_print_pdf
            }, '-',
            '<span style=" font-size:12px;font-weight:600;color:#3366FF;">状态</span>:&nbsp;&nbsp;',
            {
              xtype: 'combo',
              width: 75,
              name: 'rwzt',
              id: 'rwzt_combo_id',
              store: rwzt_store,
              emptyText:'请选择',
              mode: 'local',
              minChars : 2,
              valueField:'text',
              displayField:'text',
              triggerAction:'all',
              listeners:{
                select:function(combo, records, index) {
                  var key = Ext.getCmp('rwzt_combo_id').getValue();
                  plan_store.baseParams.zt = key;
                  plan_store.load();
                }
              }
            },
            '<span style=" font-size:12px;font-weight:600;color:#3366FF;">巡查区域</span>:&nbsp;&nbsp;', { 
              xtype: 'combo',
              width: 75,
              store: xcqy_store,
              emptyText:'请选择',
              mode: 'local',
              minChars : 2,
              multiSelect: true,
              valueField:'text',
              displayField:'text',
              triggerAction:'all',
              listeners:{
                select:function(combo, records, index) {
                  var key = combo.getValue();
                  plan_store.baseParams.xcqy = key;
                  plan_store.load();
                }
              }
            },    
            '<span style=" font-size:12px;font-weight:600;color:#3366FF;">巡查方式</span>:&nbsp;&nbsp;', { 
              xtype: 'combo',
              width: 75,
              store: xcfs_store,
              emptyText:'请选择',
              mode: 'local',
              minChars : 2,
              multiSelect: true,
              valueField:'text',
              displayField:'text',
              triggerAction:'all',
              listeners:{
                select:function(combo, records, index) {
                  var key = combo.getValue();
                  plan_store.baseParams.xcfs = key;
                  plan_store.load();
                }
              }  
          }],
          bbar:['->',
            new Ext.PagingToolbar({
              store: plan_store,
              pageSize: 20,
              width : 350,
              border : false,
              displayInfo: true,
              displayMsg: '{0} - {1} of {2}',
              emptyMsg: "没有找到！",
              prependButtons: true
            })
          ]
        });
        
        plan_store.load();
        
        var xsTree = new Ext.tree.TreePanel({
            rootVisible:false,
            lines:false,
            title:'按单位部门',
            autoScroll:true,
            loader: new Ext.tree.TreeLoader({
              dataUrl: '/desktop/get_xstree_plan?username='+currentUser.username,     
              baseAttrs: { uiProvider: Ext.ux.TreeCheckNodeUI } 
            }),
            root: {
              nodeType: 'async',
              text: '人员',
              draggable:false,
              id:'root'
            }
        });

        xsTree.on("click", function(node,e) {
          e.stopEvent();
          node.select();
          if (node.isLeaf()) {
            var ss = node.id.split("|");
            plan_store.baseParams.xcry  = ss[1]
            plan_store.load();
          } 
        }, xsTree);
        
        var formPanel = new Ext.form.FormPanel({
          xtype:"panel",
          id:'mytask-tab1',
          //iconCls: 'tabs',
          closable : true,
          closeAction: 'hide',
          title:"任务管理",
          layout: 'fit',
          items:[{
        		layout:"border",
        		width:800,
        		height:600,
        		items:[{
        				region:"center", layout:"fit", border:false, width:500, height:600,items:[planGrid]},
        			{ region:"west",   layout:"fit", border:false, width:200, height:600,items:[xsTree]
        		}]
        	}]
        });


        tabPanel.add(formPanel);
        tabPanel.doLayout();
        
        tabPanel.setActiveTab(formPanel);
        
      } else {
        formPanel = Ext.getCmp('mytask-tab1');
        tabPanel.setActiveTab(formPanel);
      }
    } 
    break;
    case 2 : //统计汇总
    {
        var tabPanel = Ext.getCmp("mytask-tab");

        if (Ext.getCmp('mytask-tab2') == undefined) {
          
          var  render_time = function(value) {
            time = value/1000.0;
            var days = Math.floor(time / 1440 / 60);
            var hours = Math.floor((time - days * 1440 * 60) / 3600);
            var minutes = Math.floor((time - days * 1440 * 60 - hours * 3600) / 60);
            var seconds = (time - days * 1440 * 60 - hours * 3600 - minutes *60);
            var time_str = days +'天' +  hours+"时"+minutes +"分"+seconds+"秒" ;
            return time_str;
          };

          var  render_lc = function(value) {
            return parseInt(value)/1000.0 + '公里';
          };
          
          
          var chart1, chart2;
          
          var  chart1_store = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: '/desktop/get_chart_1'
            }),
            reader: new Ext.data.JsonReader({
              totalProperty: 'results', 
              root: 'rows',             
              fields: [
                {name: 'id',    type: 'integer'},
                {name: 'rwmc',  type: 'string'},
                {name: 'xclc',  type: 'int'},
                {name: 'xcsj',  type: 'int'}    ]    
            }),
            sortInfo:{field: 'id', direction: "ASC"}
          });
          
          chart1_store.baseParams.device = currentUser.iphone;
          chart1_store.load();
          
          var td = new Date();
          var date_str=td.getFullYear()+"年"+td.getMonth()+"月"+td.getDate()+"日";
          
          var chart1 = new Ext.ux.HighChart({
            height: 300,
            store : chart1_store,
            series:[{
              name: '巡查用时',
              type: 'column',
              yField: 'xcsj',
              color: '#A47D7C'    
            }],
            xField: 'rwmc',
            chartConfig: {
              chart: {
                marginRight: 100,
                marginBottom: 100,
                zoomType: 'x'
              },
              title: { text: '巡查时间统计', x: -20 },
              subtitle: { text: date_str , x: -20},
              xAxis: [{ 
                title: { text: '任务名称',  margin: 20}, 
                //labels: { rotation: 315, y: 35 },
                tickInterval: 2
              }],
              yAxis: { 
                title:    { text: '巡查时间'},
                //plotLines: [{ value: 0, width: 1, color: '#808080'}],
                type: 'datetime',
                lineColor: '#e7e7e7',
                alternateGridColor: '#f7f7f7',
                gridLineColor: '#e7e7e7',
                labels: {
                   enabled: true,
                   formatter: function() {
                     return parseInt(this.value)/3600.0/1000.0 + '小时';
                   }
                }
              },
              tooltip: {
                formatter: function() {
                  time = this.y/1000.0;
                  var days = Math.floor(time / 1440 / 60);
                  var hours = Math.floor((time - days * 1440 * 60) / 3600);
                  var minutes = Math.floor((time - days * 1440 * 60 - hours * 3600) / 60);
                  var seconds = (time - days * 1440 * 60 - hours * 3600 - minutes *60);
                  var time_str = days + '天' + hours+"时"+minutes +"分"+seconds+"秒" ;
                  
                  return '<b>'+ this.series.name +'</b><br/>'+
                  this.x +': '+ time_str;
                }
              },
              legend : {enabled:false},
              credits: {enabled:false}
            }
          });

          var chart2 = new Ext.ux.HighChart({
            height: 300,
            store : chart1_store,
            series:[{
              name: '巡查里程',
              type: 'column',
              yField: 'xclc',
              color: '#FF7D7C'    
            }],
            xField: 'rwmc',
            chartConfig: {
              chart: {
                marginRight: 100,
                marginBottom: 100,
                zoomType: 'x'
              },
              title: { text: '巡查里程统计', x: -20 },
              subtitle: { text: date_str, x: -20},
              xAxis: [{ 
                title: { text: '任务名称',  margin: 20}, 
                //labels: { rotation: 315, y: 35 },
                tickInterval: 3
              }],
              yAxis: { 
                title:    { text: '巡查里程'},
                //plotLines: [{ value: 0, width: 1, color: '#808080'}]
                lineColor: '#e7e7e7',
                alternateGridColor: '#f7f7f7',
                gridLineColor: '#e7e7e7',
                labels: {
                   enabled: true,
                   formatter: function() {
                     return parseInt(this.value)/1000.0+ '公里';
                   }
                }
              },
              tooltip: {
                formatter: function() {
                  return '<b>'+ this.series.name +'</b><br/>'+
                  this.x +': '+ this.y/1000.0 + '公里' ;
                }
              },
              legend : {enabled:false},
              credits: {enabled:false}
            }
          });

          var chart1_Grid = new Ext.grid.GridPanel({
            store: chart1_store,
            columns: [           
               { header : 'id',    width : 75, sortable : true, dataIndex: 'id', hidden:true},            
               { header : '任务名称',  width : 175, sortable : true, dataIndex: 'rwmc'},
               { header : '巡查时间',  width : 75, sortable : true, dataIndex: 'xcsj', renderer : render_time},
               { header : '巡查里程',  width : 75, sortable : true, dataIndex: 'xclc', renderer : render_lc}
            ], 
            columnLines: true,
            layout:'fit',
            viewConfig: {
              stripeRows:true,
            }
          });

          var  chart_m_store = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: '/desktop/get_chart_month'
            }),
            reader: new Ext.data.JsonReader({
              totalProperty: 'results', 
              root: 'rows',             
              fields: [
                {name: 's_rwmc',  type: 'string'},
                {name: 's_xclc',  type: 'int'},
                {name: 's_xcsj',  type: 'int'}    ]    
            }),
            sortInfo:{field: 's_rwmc', direction: "ASC"}
          });
          
          chart_m_store.baseParams.device = currentUser.iphone;
          chart_m_store.load();
          
          
          var chart_m1 = new Ext.ux.HighChart({
            height: 300,
            store : chart_m_store,
            series:[{
              name: '巡查用时',
              type: 'column',
              yField: 's_xcsj',
              color: '#A47D7C'    
            }],
            xField: 's_rwmc',
            chartConfig: {
              chart: {
                marginRight: 100,
                marginBottom: 100,
                zoomType: 'x'
              },
              title: { text: '巡查时间月度统计', x: -20 },
              subtitle: { text: date_str , x: -20},
              xAxis: [{ 
                title: { text: '月份名称',  margin: 20}, 
                //labels: { rotation: 315, y: 35 },
                tickInterval: 1
              }],
              yAxis: { 
                title:    { text: '巡查时间'},
                //plotLines: [{ value: 0, width: 1, color: '#808080'}],
                type: 'datetime',
                lineColor: '#e7e7e7',
                alternateGridColor: '#f7f7f7',
                gridLineColor: '#e7e7e7',
                labels: {
                   enabled: true,
                   formatter: function() {
                     return parseInt(this.value)/3600.0/1000.0 + '小时';
                   }
                }
              },
              tooltip: {
                formatter: function() {
                  time = this.y/1000.0;
                  var days = Math.floor(time / 1440 / 60);
                  var hours = Math.floor((time - days * 1440 * 60) / 3600);
                  var minutes = Math.floor((time - days * 1440 * 60 - hours * 3600) / 60);
                  var seconds = (time - days * 1440 * 60 - hours * 3600 - minutes *60);
                  var time_str = days + '天' + hours+"时"+minutes +"分"+seconds+"秒" ;
                  

                  return '<div class=\'tooltip\'><b>'+ this.series.name +'</b><br/>'+
                  this.x +': '+ time_str +'</div>';
                }
              },
              legend : {enabled:false},
              credits: {enabled:false}
            }
          });

          var chart_m2 = new Ext.ux.HighChart({
            height: 300,
            store : chart_m_store,
            series:[{
              name: '巡查里程',
              type: 'column',
              yField: 's_xclc',
              color: '#FF7D7C'    
            }],
            xField: 's_rwmc',
            chartConfig: {
              chart: {
                marginRight: 100,
                marginBottom: 100,
                zoomType: 'x'
              },
              title: { text: '巡查里程月度统计', x: -20 },
              subtitle: { text: date_str, x: -20},
              xAxis: [{ 
                title: { text: '月份名称',  margin: 20}, 
                //labels: { rotation: 315, y: 35 },
                tickInterval: 1
              }],
              yAxis: { 
                title:    { text: '巡查里程'},
                //plotLines: [{ value: 0, width: 1, color: '#808080'}]
                lineColor: '#e7e7e7',
                alternateGridColor: '#f7f7f7',
                gridLineColor: '#e7e7e7',
                labels: {
                   enabled: true,
                   formatter: function() {
                     return parseInt(this.value)/1000.0+ '公里';
                   }
                }
              },
              tooltip: {
                formatter: function() {
                  return '<div class=\'tooltip\'><b>'+ this.series.name +'</b><br/>'+
                  this.x +': '+ this.y/1000.0 + '公里'+'</div>' ;
                }
              },
              legend : {enabled:false},
              credits: {enabled:false}
            }
          });

          var chart_m1_Grid = new Ext.grid.GridPanel({
            store: chart_m_store,
            columns: [           
               { header : '任务名称',  width : 150, sortable : true, dataIndex: 's_rwmc'},
               { header : '巡查时间',  width : 100, sortable : true, dataIndex: 's_xcsj', renderer : render_time},
               { header : '巡查里程',  width : 100, sortable : true, dataIndex: 's_xclc', renderer : render_lc}
            ], 
            columnLines: true,
            layout:'fit',
            viewConfig: {
              stripeRows:true,
            }
          });
          
          
          var chart_q_store = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: '/desktop/get_chart_quarter'
            }),
            reader: new Ext.data.JsonReader({
              totalProperty: 'results', 
              root: 'rows',             
              fields: [
                {name: 's_rwmc',  type: 'string'},
                {name: 's_xclc',  type: 'int'},
                {name: 's_xcsj',  type: 'int'}    ]    
            }),
            sortInfo:{field: 's_rwmc', direction: "ASC"}
          });
          
          chart_q_store.baseParams.device = currentUser.iphone;
          chart_q_store.load();
          
          var chart_q1 = new Ext.ux.HighChart({
            height: 300,
            store : chart_q_store,
            series:[{
              name: '巡查用时',
              type: 'column',
              yField: 's_xcsj',
              color: '#A47D7C'    
            }],
            xField: 's_rwmc',
            chartConfig: {
              chart: {
                marginRight: 100,
                marginBottom: 100,
                zoomType: 'x'
              },
              title: { text: '巡查时间季度统计', x: -20 },
              subtitle: { text: date_str , x: -20},
              xAxis: [{ 
                title: { text: '季度名称',  margin: 20}, 
                //labels: { rotation: 315, y: 35 },
                tickInterval: 1
              }],
              yAxis: { 
                title:    { text: '巡查时间'},
                //plotLines: [{ value: 0, width: 1, color: '#808080'}],
                type: 'datetime',
                lineColor: '#e7e7e7',
                alternateGridColor: '#f7f7f7',
                gridLineColor: '#e7e7e7',
                labels: {
                   enabled: true,
                   formatter: function() {
                     return parseInt(this.value)/3600.0/1000.0 + '小时';
                   }
                }
              },
              tooltip: {
                formatter: function() {
                  time = this.y/1000.0;
                  var days = Math.floor(time / 1440 / 60);
                  var hours = Math.floor((time - days * 1440 * 60) / 3600);
                  var minutes = Math.floor((time - days * 1440 * 60 - hours * 3600) / 60);
                  var seconds = (time - days * 1440 * 60 - hours * 3600 - minutes *60);
                  var time_str = days + '天' + hours+"时"+minutes +"分"+seconds+"秒" ;
                  
                  return '<b>'+ this.series.name +'</b><br/>'+
                  this.x +': '+ time_str;
                }
              },
              legend : {enabled:false},
              credits: {enabled:false}
            }
          });

          var chart_q2 = new Ext.ux.HighChart({
            height: 300,
            store : chart_q_store,
            series:[{
              name: '巡查里程',
              type: 'column',
              yField: 's_xclc',
              color: '#FF7D7C'    
            }],
            xField: 's_rwmc',
            chartConfig: {
              chart: {
                marginRight: 100,
                marginBottom: 100,
                zoomType: 'x'
              },
              title: { text: '巡查里程季度统计', x: -20 },
              subtitle: { text: date_str, x: -20},
              xAxis: [{ 
                title: { text: '季度名称',  margin: 20}, 
                //labels: { rotation: 315, y: 35 },
                tickInterval: 1
              }],
              yAxis: { 
                title:    { text: '巡查里程'},
                //plotLines: [{ value: 0, width: 1, color: '#808080'}]
                lineColor: '#e7e7e7',
                alternateGridColor: '#f7f7f7',
                gridLineColor: '#e7e7e7',
                labels: {
                   enabled: true,
                   formatter: function() {
                     return parseInt(this.value)/1000.0+ '公里';
                   }
                }
              },
              tooltip: {
                formatter: function() {
                  return '<b>'+ this.series.name +'</b><br/>'+
                  this.x +': '+ this.y/1000.0 + '公里' ;
                }
              },
              legend : {enabled:false},
              credits: {enabled:false}
            }
          });
          
          var chart_q1_Grid = new Ext.grid.GridPanel({
            store: chart_q_store,
            columns: [           
               { header : '任务名称',  width : 150, sortable : true, dataIndex: 's_rwmc'},
               { header : '巡查时间',  width : 100, sortable : true, dataIndex: 's_xcsj', renderer : render_time},
               { header : '巡查里程',  width : 100, sortable : true, dataIndex: 's_xclc', renderer : render_lc}
            ], 
            columnLines: true,
            layout:'fit',
            viewConfig: {
              stripeRows:true,
            }
          });
          
          
          var chart_y_store = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: '/desktop/get_chart_year'
            }),
            reader: new Ext.data.JsonReader({
              totalProperty: 'results', 
              root: 'rows',             
              fields: [
                {name: 's_rwmc',  type: 'string'},
                {name: 's_xclc',  type: 'int'},
                {name: 's_xcsj',  type: 'int'}    ]    
            }),
            sortInfo:{field: 's_rwmc', direction: "ASC"}
          });
          
          chart_y_store.baseParams.device = currentUser.iphone;
          chart_y_store.load();
          
          
          var chart_y1 = new Ext.ux.HighChart({
            height: 300,
            store : chart_y_store,
            series:[{
              name: '巡查用时',
              type: 'column',
              yField: 's_xcsj',
              color: '#A47D7C'    
            }],
            xField: 's_rwmc',
            chartConfig: {
              chart: {
                marginRight: 100,
                marginBottom: 100,
                zoomType: 'x'
              },
              title: { text: '巡查时间年度统计', x: -20 },
              subtitle: { text: date_str , x: -20},
              xAxis: [{ 
                title: { text: '年度名称',  margin: 20}, 
                //labels: { rotation: 315, y: 35 },
                tickInterval: 1
              }],
              yAxis: { 
                title:    { text: '巡查时间'},
                //plotLines: [{ value: 0, width: 1, color: '#808080'}],
                type: 'datetime',
                lineColor: '#e7e7e7',
                alternateGridColor: '#f7f7f7',
                gridLineColor: '#e7e7e7',
                labels: {
                   enabled: true,
                   formatter: function() {
                     return parseInt(this.value)/3600.0/1000.0 + '小时';
                   }
                }
              },
              tooltip: {
                formatter: function() {
                  time = this.y/1000.0;
                  var days = Math.floor(time / 1440 / 60);
                  var hours = Math.floor((time - days * 1440 * 60) / 3600);
                  var minutes = Math.floor((time - days * 1440 * 60 - hours * 3600) / 60);
                  var seconds = (time - days * 1440 * 60 - hours * 3600 - minutes *60);
                  var time_str = days + '天' + hours+"时"+minutes +"分"+seconds+"秒" ;
                  
                  return '<b>'+ this.series.name +'</b><br/>'+
                  this.x +': '+ time_str;
                }
              },
              legend : {enabled:false},
              credits: {enabled:false}
            }
          });

          var chart_y2 = new Ext.ux.HighChart({
            height: 300,
            store : chart_y_store,
            series:[{
              name: '巡查里程',
              type: 'column',
              yField: 's_xclc',
              color: '#FF7D7C'    
            }],
            xField: 's_rwmc',
            chartConfig: {
              chart: {
                marginRight: 100,
                marginBottom: 100,
                zoomType: 'x'
              },
              title: { text: '巡查里程年度统计', x: -20 },
              subtitle: { text: date_str, x: -20},
              xAxis: [{ 
                title: { text: '年度名称',  margin: 20}, 
                //labels: { rotation: 315, y: 35 },
                tickInterval: 1
              }],
              yAxis: { 
                title:    { text: '巡查里程'},
                //plotLines: [{ value: 0, width: 1, color: '#808080'}]
                lineColor: '#e7e7e7',
                alternateGridColor: '#f7f7f7',
                gridLineColor: '#e7e7e7',
                labels: {
                   enabled: true,
                   formatter: function() {
                     return parseInt(this.value)/1000.0+ '公里';
                   }
                }
              },
              tooltip: {
                formatter: function() {
                  return '<b>'+ this.series.name +'</b><br/>'+
                  this.x +': '+ this.y/1000.0 + '公里' ;
                }
              },
              legend : {enabled:false},
              credits: {enabled:false}
            }
          });

          var chart_y1_Grid = new Ext.grid.GridPanel({
            store: chart_y_store,
            columns: [           
              { header : '任务名称',  width : 150, sortable : true, dataIndex: 's_rwmc'},
              { header : '巡查时间',  width : 100, sortable : true, dataIndex: 's_xcsj', renderer : render_time},
              { header : '巡查里程',  width : 100, sortable : true, dataIndex: 's_xclc', renderer : render_lc}
            ], 
            columnLines: true,
            layout:'fit',
            viewConfig: {
              stripeRows:true,
            }
          });
          
          
          var formPanel = new Ext.form.FormPanel({
            xtype:"panel",
            id:'mytask-tab2',
            //iconCls: 'tabs',
            closeAction: 'hide',
            closable : true,
            title:"统计汇总",
            layout: 'fit',
            items:[{
              layout:"border",
              id : 'chart_panel_id',
              width:850,
              items:[
                {
                  region:"center",
                  autoScroll: true,
                  id : "cp_center_id", 
                  layout:"fit",
                  items:[{
                      xtype:"tabpanel",
                      activeTab:0,
                      items:[{
                          xtype:"panel",
                          title:"基本报表",
                          layout:"fit",
                          items:[{
                            layout:"border",
                            items:[{
                              region:"center",
                              items:[chart1, chart2]
                            },{
                              region:"east",
                              layout:'fit',
                              width:350,
                              items:[chart1_Grid]
                            }]
                          }]
                        },{
                          xtype:"panel",
                          title:"月度报表",
                          layout:"fit",
                          items:[{
                            layout:"border",
                            items:[{
                              region:"center",
                              items:[chart_m1, chart_m2]
                            },{
                              region:"east",
                              layout:'fit',
                              width:350,
                              items:[chart_m1_Grid]
                            }]
                          }]
                        },{
                          xtype:"panel",
                          title:"季度报表",
                          layout:"fit",
                          items:[{
                            layout:"border",
                            items:[{
                              region:"center",
                              items:[chart_q1, chart_q2]
                            },{
                              region:"east",
                              layout:'fit',
                              width:350,
                              items:[chart_q1_Grid]
                            }]
                          }]
                        },{
                          xtype:"panel",
                          title:"年度报表",
                          layout:"fit",
                          items:[{
                            layout:"border",
                            items:[{
                              region:"center",
                              items:[chart_y1, chart_y2]
                            },{
                              region:"east",
                              layout:'fit',
                              width:350,
                              items:[chart_y1_Grid]
                            }]
                          }]
                        }]
                    }]
                }, // end of center
                {  
                  region:"west",
                  title:"",
                  width:200,
                  height:400,
                  hidden : true,
                  layout : 'absolute', 
                  items:[{
                    xtype: 'label',
                    text: '预设',
                    x: 10,
                    y: 10
                  },{
                    xtype:"combo",
                    fieldLabel:"Text",
                    name:"ys_combo",
                    x:10,
                    y:30,
                    width:150
                  },{
                    xtype: 'label',
                    text: '开始日期',
                    format:'Y-m-d',
                    x: 10,
                    y: 60
                  },{
                    xtype:"datefield",
                    name:"b_date",
                    x:10,
                    y:80,
                    width:150
                  },{
                    xtype: 'label',
                    text: '结束日期',
                    format:'Y-m-d',
                    x: 10,
                    y: 110
                  },{
                    xtype:"datefield",
                    name:"e_date",
                    x:10,
                    y:130,
                    width:150
                  },{
                    xtype: 'button',
                    text: '确定',
                    x: 10,
                    y: 180,
                    width:50,
                    handler:function(){

                    }
                  },{
                    xtype: 'button',
                    text: '重置',
                    x: 80,
                    y: 180,
                    width:50,
                    handler:function(){

                    }
                  }]  // end of west items
                }] // end of innter border
            }] // end of formPanel
          });

          tabPanel.add(formPanel);
          //tabPanel.doLayout();
          tabPanel.setActiveTab(formPanel);


        } else {
          formPanel = Ext.getCmp('mytask-tab2');
          tabPanel.setActiveTab(formPanel);
        }
        // end of chart
    }
    break;  
    case 3 : //最近任务
    {
      var tabPanel = Ext.getCmp("mytask-tab");
      
      if (Ext.getCmp('mytask-tab3') == undefined) {
        var formPanel = new Ext.form.FormPanel({
            xtype:"panel",
            id:'mytask-tab3',
            //iconCls: 'tabs',
            closable : true,
            title:"计划任务",
            layout: 'fit',
            items:[]
        });

        tabPanel.add(formPanel);
        tabPanel.doLayout();
        
        tabPanel.setActiveTab(formPanel);
      } else {
        formPanel = Ext.getCmp('mytask-tab3');
        tabPanel.setActiveTab(formPanel);
      }
    }
    break;
    case 51 :  //全局统计
    {
      var tabPanel = Ext.getCmp("mytask-tab");

      if (Ext.getCmp('mytask-tab51') == undefined) {
        
        var render_time = function(value) {
          time = value/1000.0;
          var days = Math.floor(time / 1440 / 60);
          var hours = Math.floor((time - days * 1440 * 60) / 3600);
          var minutes = Math.floor((time - days * 1440 * 60 - hours * 3600) / 60);
          var seconds = (time - days * 1440 * 60 - hours * 3600 - minutes *60);
          var time_str = days + '天' + hours+"时"+minutes +"分"+seconds+"秒" ;
          return time_str;
          //return "<b>" + time_str + "</b>";
        };

        var render_lc = function(value) {
          return parseInt(value)/1000.0 + '公里';
        };
        
        
        var chart1, chart2;
        
        var chart1_store = new Ext.data.Store({
          proxy: new Ext.data.HttpProxy({
              url: '/desktop/get_chart_51'
          }),
          reader: new Ext.data.JsonReader({
            totalProperty: 'results', 
            root: 'rows',             
            fields: [
              {name: 'device',  type: 'string'},
              {name: 'xcry',  type: 'string'},
              {name: 's_xclc',  type: 'int'},
              {name: 's_xcsj',  type: 'int'}
            ]
          }),
          sortInfo:{field: 's_xcsj', direction: "DESC"}
        });
        
        chart1_store.baseParams.device = currentUser.iphone;
        chart1_store.load();
        
        var td = new Date();
        var date_str=td.getFullYear()+"年"+td.getMonth()+"月"+td.getDate()+"日";
        
        var chart1 = new Ext.ux.HighChart({
          height: 300,
          store : chart1_store,
          series:[{
            name: '巡查用时',
            type: 'column',
            yField: 's_xcsj',
            color: '#A47D7C'    
          }],
          xField: 'xcry',
          chartConfig: {
            chart: {
              marginRight: 100,
              marginBottom: 100,
              zoomType: 'x'
            },
            title: { text: '巡查时间统计', x: -20 },
            subtitle: { text: date_str , x: -20},
            xAxis: [{ 
              title: { text: '巡查人员',  margin: 20}, 
              labels: { rotation: 315, y: 35 },
              tickInterval: 1
            }],
            yAxis: { 
              title:    { text: '巡查时间'},
              type: 'datetime',
              lineColor: '#e7e7e7',
              alternateGridColor: '#f7f7f7',
              gridLineColor: '#e7e7e7',
              labels: {
                 enabled: true,
                 formatter: function() {
                   return parseInt(this.value)/3600.0/1000.0 + '小时';
                 }
              }
            },
            tooltip: {
              formatter: function() {
                time = this.y/1000.0;
                var days = Math.floor(time / 1440 / 60);
                var hours = Math.floor((time - days * 1440 * 60) / 3600);
                var minutes = Math.floor((time - days * 1440 * 60 - hours * 3600) / 60);
                var seconds = (time - days * 1440 * 60 - hours * 3600 - minutes *60);
                var time_str = days + '天' + hours+"时"+minutes +"分"+seconds+"秒" ;
                
                return '<b>'+ this.series.name +'</b><br/>'+
                this.x +': '+ time_str;
              }
            },
            legend : {enabled:false},
            credits: {enabled:false}
          }
        });

        var chart2 = new Ext.ux.HighChart({
          height: 300,
          store : chart1_store,
          series:[{
            name: '巡查里程',
            type: 'column',
            yField: 's_xclc',
            color: '#FF7D7C'    
          }],
          xField: 'xcry',
          chartConfig: {
            chart: {
              marginRight: 100,
              marginBottom: 100,
              zoomType: 'x'
            },
            title: { text: '巡查里程统计', x: -20 },
            subtitle: { text: date_str, x: -20},
            xAxis: [{ 
              title: { text: '巡查人员',  margin: 20}, 
              labels: { rotation: 315, y: 35 },
              tickInterval: 1
            }],
            yAxis: { 
              title:    { text: '巡查里程'},
              //plotLines: [{ value: 0, width: 1, color: '#808080'}]
              lineColor: '#e7e7e7',
              alternateGridColor: '#f7f7f7',
              gridLineColor: '#e7e7e7',
              labels: {
                 enabled: true,
                 formatter: function() {
                   return parseInt(this.value)/1000.0+ '公里';
                 }
              }
            },
            tooltip: {
              formatter: function() {
                return '<b>'+ this.series.name +'</b><br/>'+
                this.x +': '+ this.y/1000.0 + '公里' ;
              }
            },
            legend : {enabled:false},
            credits: {enabled:false}
          }
        });

        var chart1_Grid = new Ext.grid.GridPanel({
          store: chart1_store,
          columns: [           
            { header : '巡查人员',  width : 150, sortable : true, dataIndex: 'xcry'},
            { header : '巡查时间',  width : 100, sortable : true, dataIndex: 's_xcsj', renderer : render_time},
            { header : '巡查里程',  width : 100, sortable : true, dataIndex: 's_xclc', renderer : render_lc}
          ], 
          columnLines: true,
          layout:'fit',
          viewConfig: {
            stripeRows:true,
          }
        });

        var  chart_m_store = new Ext.data.Store({
          proxy: new Ext.data.HttpProxy({
              url: '/desktop/get_chart_51_month'
          }),
          reader: new Ext.data.JsonReader({
            totalProperty: 'results', 
            root: 'rows',             
            fields: [
              {name: 'device',  type: 'string'},
              {name: 'xcry',  type: 'string'},
              {name: 's_xclc',  type: 'int'},
              {name: 's_xcsj',  type: 'int'}
            ]    
          }),
          sortInfo:{field: 's_xcsj', direction: "DESC"}
        });
        
        chart_m_store.baseParams.device = currentUser.iphone;
        chart_m_store.load();
        
        
        var chart_m1 = new Ext.ux.HighChart({
          height: 300,
          store : chart_m_store,
          series:[{
            name: '巡查用时',
            type: 'column',
            yField: 's_xcsj',
            color: '#A47D7C'    
          }],
          xField: 'xcry',
          chartConfig: {
            chart: {
              marginRight: 100,
              marginBottom: 100,
              zoomType: 'x'
            },
            title: { text: '巡查时间月度统计', x: -20 },
            subtitle: { text: date_str , x: -20},
            xAxis: [{ 
              title: { text: '巡查人员',  margin: 20}, 
              labels: { rotation: 315, y: 35 },
              tickInterval: 1
            }],
            yAxis: { 
              title:    { text: '巡查时间'},
              //plotLines: [{ value: 0, width: 1, color: '#808080'}],
              type: 'datetime',
              lineColor: '#e7e7e7',
              alternateGridColor: '#f7f7f7',
              gridLineColor: '#e7e7e7',
              labels: {
                 enabled: true,
                 formatter: function() {
                   return parseInt(this.value)/3600.0/1000.0 + '小时';
                 }
              }
            },
            tooltip: {
              formatter: function() {
                time = this.y/1000.0;
                var days = Math.floor(time / 1440 / 60);
                var hours = Math.floor((time - days * 1440 * 60) / 3600);
                var minutes = Math.floor((time - days * 1440 * 60 - hours * 3600) / 60);
                var seconds = (time - days * 1440 * 60 - hours * 3600 - minutes *60);
                var time_str = days + '天' + hours+"时"+minutes +"分"+seconds+"秒" ;
                

                return '<div class=\'tooltip\'><b>'+ this.series.name +'</b><br/>'+
                this.x +': '+ time_str +'</div>';
              }
            },
            legend : {enabled:false},
            credits: {enabled:false}
          }
        });

        var chart_m2 = new Ext.ux.HighChart({
          height: 300,
          store : chart_m_store,
          series:[{
            name: '巡查里程',
            type: 'column',
            yField: 's_xclc',
            color: '#FF7D7C'    
          }],
          xField: 'xcry',
          chartConfig: {
            chart: {
              marginRight: 100,
              marginBottom: 100,
              zoomType: 'x'
            },
            title: { text: '巡查里程月度统计', x: -20 },
            subtitle: { text: date_str, x: -20},
            xAxis: [{ 
              title: { text: '巡查人员',  margin: 20}, 
              labels: { rotation: 315, y: 35 },
              tickInterval: 1
            }],
            yAxis: { 
              title:    { text: '巡查里程'},
              //plotLines: [{ value: 0, width: 1, color: '#808080'}]
              lineColor: '#e7e7e7',
              alternateGridColor: '#f7f7f7',
              gridLineColor: '#e7e7e7',
              labels: {
                 enabled: true,
                 formatter: function() {
                   return parseInt(this.value)/1000.0+ '公里';
                 }
              }
            },
            tooltip: {
              formatter: function() {
                return '<div class=\'tooltip\'><b>'+ this.series.name +'</b><br/>'+
                this.x +': '+ this.y/1000.0 + '公里'+'</div>' ;
              }
            },
            legend : {enabled:false},
            credits: {enabled:false}
          }
        });

        var chart_m1_Grid = new Ext.grid.GridPanel({
          store: chart_m_store,
          columns: [           
             { header : '巡查人员',  width : 150, sortable : true, dataIndex: 'xcry'},
             { header : '巡查时间',  width : 100, sortable : true, dataIndex: 's_xcsj', renderer : render_time},
             { header : '巡查里程',  width : 100, sortable : true, dataIndex: 's_xclc', renderer : render_lc}
          ], 
          columnLines: true,
          layout:'fit',
          viewConfig: {
            stripeRows:true,
          }
        });
        
        
        var  chart_q_store = new Ext.data.Store({
          proxy: new Ext.data.HttpProxy({
              url: '/desktop/get_chart_51_quarter'
          }),
          reader: new Ext.data.JsonReader({
            totalProperty: 'results', 
            root: 'rows',             
            fields: [
              {name: 'device',  type: 'string'},
              {name: 'xcry',  type: 'string'},
              {name: 's_xclc',  type: 'int'},
              {name: 's_xcsj',  type: 'int'}
            ]    
          }),
          sortInfo:{field: 's_xcsj', direction: "DESC"}
        });
        
        chart_q_store.baseParams.device = currentUser.iphone;
        chart_q_store.load();
        
        
        var chart_q1 = new Ext.ux.HighChart({
          height: 300,
          store : chart_q_store,
          series:[{
            name: '巡查用时',
            type: 'column',
            yField: 's_xcsj',
            color: '#A47D7C'    
          }],
          xField: 'xcry',
          chartConfig: {
            chart: {
              marginRight: 100,
              marginBottom: 100,
              zoomType: 'x'
            },
            title: { text: '巡查时间季度统计', x: -20 },
            subtitle: { text: date_str , x: -20},
            xAxis: [{ 
              title: { text: '巡查人员',  margin: 20}, 
              labels: { rotation: 315, y: 35 },
              tickInterval: 1
            }],
            yAxis: { 
              title:    { text: '巡查时间'},
              //plotLines: [{ value: 0, width: 1, color: '#808080'}],
              type: 'datetime',
              lineColor: '#e7e7e7',
              alternateGridColor: '#f7f7f7',
              gridLineColor: '#e7e7e7',
              labels: {
                 enabled: true,
                 formatter: function() {
                   return parseInt(this.value)/3600.0/1000.0 + '小时';
                 }
              }
            },
            tooltip: {
              formatter: function() {
                time = this.y/1000.0;
                var days = Math.floor(time / 1440 / 60);
                var hours = Math.floor((time - days * 1440 * 60) / 3600);
                var minutes = Math.floor((time - days * 1440 * 60 - hours * 3600) / 60);
                var seconds = (time - days * 1440 * 60 - hours * 3600 - minutes *60);
                var time_str = days + '天' + hours+"时"+minutes +"分"+seconds+"秒" ;
                
                return '<b>'+ this.series.name +'</b><br/>'+
                this.x +': '+ time_str;
              }
            },
            legend : {enabled:false},
            credits: {enabled:false}
          }
        });

        var chart_q2 = new Ext.ux.HighChart({
          height: 300,
          store : chart_q_store,
          series:[{
            name: '巡查里程',
            type: 'column',
            yField: 's_xclc',
            color: '#FF7D7C'    
          }],
          xField: 'xcry',
          chartConfig: {
            chart: {
              marginRight: 100,
              marginBottom: 100,
              zoomType: 'x'
            },
            title: { text: '巡查里程季度统计', x: -20 },
            subtitle: { text: date_str, x: -20},
            xAxis: [{ 
              title: { text: '巡查人员',  margin: 20}, 
              labels: { rotation: 315, y: 35 },
              tickInterval: 1
            }],
            yAxis: { 
              title:    { text: '巡查里程'},
              //plotLines: [{ value: 0, width: 1, color: '#808080'}]
              lineColor: '#e7e7e7',
              alternateGridColor: '#f7f7f7',
              gridLineColor: '#e7e7e7',
              labels: {
                 enabled: true,
                 formatter: function() {
                   return parseInt(this.value)/1000.0+ '公里';
                 }
              }
            },
            tooltip: {
              formatter: function() {
                return '<b>'+ this.series.name +'</b><br/>'+
                this.x +': '+ this.y/1000.0 + '公里' ;
              }
            },
            legend : {enabled:false},
            credits: {enabled:false}
          }
        });
        
        var chart_q1_Grid = new Ext.grid.GridPanel({
          store: chart_q_store,
          columns: [           
             { header : '巡查人员',  width : 150, sortable : true, dataIndex: 'xcry'},
             { header : '巡查时间',  width : 100, sortable : true, dataIndex: 's_xcsj', renderer : render_time},
             { header : '巡查里程',  width : 100, sortable : true, dataIndex: 's_xclc', renderer : render_lc}
          ], 
          columnLines: true,
          layout:'fit',
          viewConfig: {
            stripeRows:true,
          }
        });
        
        
        var  chart_y_store = new Ext.data.Store({
          proxy: new Ext.data.HttpProxy({
              url: '/desktop/get_chart_51_year'
          }),
          reader: new Ext.data.JsonReader({
            totalProperty: 'results', 
            root: 'rows',             
            fields: [
              {name: 'device',  type: 'string'},
              {name: 'xcry',  type: 'string'},
              {name: 's_xclc',  type: 'int'},
              {name: 's_xcsj',  type: 'int'}
            ]    
          }),
          sortInfo:{field: 's_xcsj', direction: "DESC"}
        });
        
        chart_y_store.baseParams.device = currentUser.iphone;
        chart_y_store.load();
        
        var chart_y1 = new Ext.ux.HighChart({
          height: 300,
          store : chart_y_store,
          series:[{
            name: '巡查用时',
            type: 'column',
            yField: 's_xcsj',
            color: '#A47D7C'    
          }],
          xField: 'xcry',
          chartConfig: {
            chart: {
              marginRight: 100,
              marginBottom: 100,
              zoomType: 'x'
            },
            title: { text: '巡查时间年度统计', x: -20 },
            subtitle: { text: date_str , x: -20},
            xAxis: [{ 
              title: { text: '巡查人员',  margin: 20}, 
              labels: { rotation: 315, y: 35 },
              tickInterval: 1
            }],
            yAxis: { 
              title:    { text: '巡查时间'},
              type: 'datetime',
              lineColor: '#e7e7e7',
              alternateGridColor: '#f7f7f7',
              gridLineColor: '#e7e7e7',
              labels: {
                 enabled: true,
                 formatter: function() {
                   return parseInt(this.value/3600.0/1000.0) + '小时';
                 }
              }
            },
            tooltip: {
              formatter: function() {
                time = this.y/1000.0;
                var days = Math.floor(time / 1440 / 60);
                var hours = Math.floor((time - days * 1440 * 60) / 3600);
                var minutes = Math.floor((time - days * 1440 * 60 - hours * 3600) / 60);
                var seconds = (time - days * 1440 * 60 - hours * 3600 - minutes *60);
                var time_str = days + '天' + hours+"时"+minutes +"分"+seconds+"秒" ;
                
                return '<b>'+ this.series.name +'</b><br/>'+
                this.x +': '+ time_str;
              }
            },
            legend : {enabled:false},
            credits: {enabled:false}
          }
        });

        var chart_y2 = new Ext.ux.HighChart({
          height: 300,
          store : chart_y_store,
          series:[{
            name: '巡查里程',
            type: 'column',
            yField: 's_xclc',
            color: '#FF7D7C'    
          }],
          xField: 'xcry',
          chartConfig: {
            chart: {
              marginRight: 100,
              marginBottom: 100,
              zoomType: 'x'
            },
            title: { text: '巡查里程年度统计', x: -20 },
            subtitle: { text: date_str, x: -20},
            xAxis: [{ 
              title: { text: '巡查人员',  margin: 20}, 
              labels: { rotation: 315, y: 35 },
              tickInterval: 1
            }],
            yAxis: { 
              title:    { text: '巡查里程'},
              lineColor: '#e7e7e7',
              alternateGridColor: '#f7f7f7',
              gridLineColor: '#e7e7e7',
              labels: {
                 enabled: true,
                 formatter: function() {
                   return parseInt(this.value)/1000.0+ '公里';
                 }
              }
            },
            tooltip: {
              formatter: function() {
                return '<b>'+ this.series.name +'</b><br/>'+
                this.x +': '+ this.y/1000.0 + '公里' ;
              }
            },
            legend : {enabled:false},
            credits: {enabled:false}
          }
        });

        var chart_y1_Grid = new Ext.grid.GridPanel({
          store: chart_y_store,
          columns: [           
            { header : '巡查人员',  width : 150, sortable : true, dataIndex: 'xcry'},
            { header : '巡查时间',  width : 100, sortable : true, dataIndex: 's_xcsj', renderer : render_time},
            { header : '巡查里程',  width : 100, sortable : true, dataIndex: 's_xclc', renderer : render_lc}
          ], 
          columnLines: true,
          layout:'fit',
          viewConfig: {
            stripeRows:true,
          }
        });
        
        
        var formPanel = new Ext.form.FormPanel({
          xtype:"panel",
          id:'mytask-tab51',
          closeAction: 'hide',
          closable : true,
          title:"统计汇总",
          layout: 'fit',
          items:[{
            layout:"border",
            id : 'chart_panel_51_id',
            width:850,
            items:[
              {
                region:"center",
                autoScroll: true,
                id : "cp_center_51_id", 
                layout:"fit",
                items:[{
                    xtype:"tabpanel",
                    activeTab:0,
                    items:[{
                        xtype:"panel",
                        title:"基本报表",
                        layout:"fit",
                        items:[{
                          layout:"border",
                          items:[{
                            region:"center",
                            items:[chart1, chart2]
                          },{
                            region:"east",
                            layout:'fit',
                            width:350,
                            items:[chart1_Grid]
                          }]
                        }]
                      },{
                        xtype:"panel",
                        title:"本月报表",
                        layout:"fit",
                        items:[{
                          layout:"border",
                          items:[{
                            region:"center",
                            items:[chart_m1, chart_m2]
                          },{
                            region:"east",
                            layout:'fit',
                            width:350,
                            items:[chart_m1_Grid]
                          }]
                        }]
                      },{
                        xtype:"panel",
                        title:"本季报表",
                        layout:"fit",
                        items:[{
                          layout:"border",
                          items:[{
                            region:"center",
                            items:[chart_q1, chart_q2]
                          },{
                            region:"east",
                            layout:'fit',
                            width:350,
                            items:[chart_q1_Grid]
                          }]
                        }]
                      },{
                        xtype:"panel",
                        title:"本年报表",
                        layout:"fit",
                        items:[{
                          layout:"border",
                          items:[{
                            region:"center",
                            items:[chart_y1, chart_y2]
                          },{
                            region:"east",
                            layout:'fit',
                            width:350,
                            items:[chart_y1_Grid]
                          }]
                        }]
                      }]
                  }]
              }] // end of innter border
          }] // end of formPanel
        });

        tabPanel.add(formPanel);
        //tabPanel.doLayout();
        tabPanel.setActiveTab(formPanel);

      } else {
        formPanel = Ext.getCmp('mytask-tab51');
        tabPanel.setActiveTab(formPanel);
      }
     
    }
    break;
    case 54 : //巡查系统考核表
    {
      var tabPanel = Ext.getCmp("mytask-tab");
      if (Ext.getCmp('mytask-tab54') == undefined) {
        var  plan_store = new Ext.data.Store({
          proxy: new Ext.data.HttpProxy({
              url: '/desktop/get_khb'
          }),
          reader: new Ext.data.JsonReader({
            totalProperty: 'results', 
            root: 'rows',             
            fields: [
              {name: 'id',    type: 'integer'},
              {name: 'xczt',  type: 'string'},
              {name: 'xccs',  type: 'string'},
              {name: 'wcbl',  type: 'string'},
              {name: 'sbcs',  type: 'string'},
              {name: 'sbbl',  type: 'string'},
              {name: 'sjzl',  type: 'string'},
              {name: 'fjzl',  type: 'string'},
              {name: 'cjzs',  type: 'string'},
              {name: 'jcy',  type: 'string'}
            ]    
          }),
          sortInfo:{field: 'id', direction: "ASC"}
        });

        //load data
        //plan_store.baseParams.xcry = currentUser.username;

        var sm = new Ext.grid.CheckboxSelectionModel();
        var planGrid = new Ext.grid.GridPanel({
          id: 'my_plan_grid_id',
          store: plan_store,
          columns: [           
            { header : 'id',    width : 75, sortable : true, dataIndex: 'id', hidden:true},            
            { header : '巡查主体',  width : 75, sortable : true, dataIndex: 'xczt'},
            { header : '巡查次数',  width : 75, sortable : true, dataIndex: 'xccs'},
            { header : '完成比例（3分）',  width : 75, sortable : true, dataIndex: 'wcbl'},
            { header : '上报次数',  width : 75, sortable : true, dataIndex: 'sbcs'},
            { header : '上报比例（3分）',  width : 75, sortable : true, dataIndex: 'sbbl'},
            { header : '数据质量（2分）',  width : 75, sortable : true, dataIndex: 'sjzl'},
            { header : '附件质量（2分）',  width : 75, sortable : true, dataIndex: 'fjzl'},
            { header : '成绩指数',  width : 75, sortable : true, dataIndex: 'cjzs'},
            { header : '巡查员',  width : 75, sortable : true, dataIndex: 'jcy'}
            
            ], 
          columnLines: true,
          layout:'fit',
          viewConfig: {
            stripeRows:true,
          },
          tbar:[
			'&nbsp;&nbsp;<span style=" font-size:12px;font-weight:600;color:#3366FF;">统计月份(例：201303)</span>:&nbsp;&nbsp;',
			{
				xtype:'textfield',
				id:'tj_yf'									
			},
			{
	            text : '统计',
	            iconCls : 'query',
				tooltip:'请输入统计月份（例：201303）',
	            handler : function(){
	               	if (Ext.getCmp('tj_yf').getValue()==''){
						alert("请输入统计月份再统计。（例：201303）");											
					}else{
						if (Ext.getCmp('tj_yf').getValue().length==6){													
							insert_qx=getLastDay(Ext.getCmp('tj_yf').getValue().substr(0,4),Ext.getCmp('tj_yf').getValue().substr(4,2));
							plan_store.baseParams.rq=Ext.getCmp('tj_yf').getValue() + insert_qx;
							plan_store.load();	
						}else{
							alert("统计月份有问题。请重新输入后再统计。（例：201303）");
						}
																							
					}
				}
	        },
			{
              text : '导出报表',
              iconCls : 'add',
              //hidden : true,
              handler : function(){
                window.open('images/khb.xls','','height=500,width=800,top=150, left=100,scrollbars=yes,status=yes');
              } 
          }]
        });

        //plan_store.load();
        var formPanel = new Ext.form.FormPanel({
            xtype:"panel",
            id:'mytask-tab50',
            //iconCls: 'tabs',
            closable : true,
            closeAction: 'hide',
            title:"巡查系统考核表",
            layout: 'fit',
      
            items:[planGrid]
        });

        tabPanel.add(formPanel);
        tabPanel.doLayout();
        
        tabPanel.setActiveTab(formPanel);
      } else {
        formPanel = Ext.getCmp('mytask-tab50');
        tabPanel.setActiveTab(formPanel);
      }
    } 
    break;
    case 55 : //执法监察动态巡查违法用地统计表
    {
      var tabPanel = Ext.getCmp("mytask-tab");
      if (Ext.getCmp('mytask-tab55') == undefined) {
        var  plan_store = new Ext.data.Store({
          proxy: new Ext.data.HttpProxy({
              url: '/desktop/get_wfyd'
          }),
          reader: new Ext.data.JsonReader({
            totalProperty: 'results', 
            root: 'rows',             
            fields: [
              {name: 'id',    type: 'integer'},
              {name: 'xczt',  type: 'string'},
              {name: 'xcry',  type: 'string'},
              {name: 'xcsj',  type: 'string'},
              {name: 'xcqy',  type: 'string'},
              {name: 'xmmc',  type: 'string'},
              {name: 'xmzl',  type: 'string'},
              {name: 'lxpwh',  type: 'string'},
              {name: 'ghwh',  type: 'string'},
              {name: 'zzpwh',  type: 'string'},
              {name: 'gdpwh',  type: 'string'},
              {name: 'pzyt',  type: 'string'},
              {name: 'sjyt',  type: 'string'},
              {name: 'pzmj',  type: 'string'},
              {name: 'pzgd',  type: 'string'},
              {name: 'dgsj',  type: 'string'},
              {name: 'jsqk',  type: 'string'},
              {name: 'sjzd',  type: 'string'},
              {name: 'sjgd',  type: 'string'},
              {name: 'wfmj',  type: 'string'},
              {name: 'xcjg',  type: 'string'},
              {name: 'clyj',  type: 'string'}
            ]    
          }),
          sortInfo:{field: 'id', direction: "ASC"}
      });
      plan_store.baseParams.xcry = currentUser.username;
      //plan_store.load();
      var sm = new Ext.grid.CheckboxSelectionModel();
      var planGrid = new Ext.grid.GridPanel({
          id: 'my_plan_grid_id',
          store: plan_store,
          columns: [           
            { header : 'id',    width : 75, sortable : true, dataIndex: 'id', hidden:true},            
            { header : '巡查主体',  width : 75, sortable : true, dataIndex: 'xczt'},
            { header : '巡查人员',  width : 75, sortable : true, dataIndex: 'xcry'},
            { header : '巡查时间',  width : 75, sortable : true, dataIndex: 'xcsj'},
            { header : '巡查区域',  width : 75, sortable : true, dataIndex: 'xcqy'},
            { header : '项目名称',  width : 75, sortable : true, dataIndex: 'xmmc'},
            { header : '坐落位置',  width : 75, sortable : true, dataIndex: 'xmzl'},
            { header : '立项时间、批文号',  width : 75, sortable : true, dataIndex: 'lxpwh'},
            { header : '规划定点时间、文号',  width : 75, sortable : true, dataIndex: 'ghwh'},
            { header : '转征用时间、批文号',  width : 75, sortable : true, dataIndex: 'zzpwh'},
            { header : '供地时间、批文号',  width : 200, sortable : true, dataIndex: 'gdpwh'},
            { header : '批准用途',  width : 75, sortable : true, dataIndex: 'pzyt'},
            { header : '实际用途',  width : 75, sortable : true, dataIndex: 'sjyt'},
            { header : '批准面积(亩)',  width : 75, sortable : true, dataIndex: 'pzmj'},
            { header : '其中耕地(亩)',  width : 75, sortable : true, dataIndex: 'pzgd'},
            { header : '动工时间',  width : 75, sortable : true, dataIndex: 'dgsj'},
            { header : '建设状况',  width : 75, sortable : true, dataIndex: 'jsqk'},
            { header : '实际占地面积(亩)',  width : 75, sortable : true, dataIndex: 'sjzd'},
            { header : '其中耕地(亩)',  width : 75, sortable : true, dataIndex: 'sjgd'},
            { header : '违法面积',  width : 75, sortable : true, dataIndex: 'wfmj'},
            { header : '巡查结果',  width : 75, sortable : true, dataIndex: 'xcjg'},
            { header : '处理意见',  width : 75, sortable : true, dataIndex: 'clyj'}
            ], 
          columnLines: true,
          layout:'fit',
          viewConfig: {
            stripeRows:true,
          },
          tbar:[
			'&nbsp;&nbsp;<span style=" font-size:12px;font-weight:600;color:#3366FF;">统计月份(例：201303)</span>:&nbsp;&nbsp;',
			{
				xtype:'textfield',
				id:'wfyd_tj_yf'									
			},
			'<span style=" font-size:12px;font-weight:600;color:#3366FF;">巡查区域</span>:&nbsp;&nbsp;', { 
              xtype: 'combo',
              width: 75,
			  id:'wfyd_qy',
              store: xzqmc_store,
              emptyText:'请选择',
              mode: 'local',
              minChars : 2,
              multiSelect: true,
              valueField:'text',
              displayField:'text',
              triggerAction:'all'
            },
			{
	            text : '统计',
	            iconCls : 'query',
				tooltip:'请输入统计月份（例：201303）',
	            handler : function(){
	               	if (Ext.getCmp('wfyd_tj_yf').getValue()==''){
						alert("请输入统计月份再统计。（例：201303）");											
					}else{
						if (Ext.getCmp('wfyd_tj_yf').getValue().length==6){													
							insert_qx=getLastDay(Ext.getCmp('wfyd_tj_yf').getValue().substr(0,4),Ext.getCmp('wfyd_tj_yf').getValue().substr(4,2));
							plan_store.baseParams.rq=Ext.getCmp('wfyd_tj_yf').getValue() + insert_qx;
							plan_store.baseParams.xcqymc=Ext.getCmp('wfyd_qy').getValue();
							plan_store.load();	
						}else{
							alert("统计月份有问题。请重新输入后再统计。（例：201303）");
						}
																							
					}
				}
	        },{
              text : '导出报表',
              iconCls : 'add',
              //hidden : true,
              handler : function(){
                window.open('images/wfyd.xls','','height=500,width=800,top=150, left=100,scrollbars=yes,status=yes');
              } 
          }]
        });

        //plan_store.load();
        var formPanel = new Ext.form.FormPanel({
            xtype:"panel",
            id:'mytask-tab55',
            //iconCls: 'tabs',
            closable : true,
            closeAction: 'hide',
            title:"执法监察动态巡查违法用地统计表",
            layout: 'fit',
      
            items:[planGrid]
        });

        tabPanel.add(formPanel);
        tabPanel.doLayout();
        
        tabPanel.setActiveTab(formPanel);
      } else {
        formPanel = Ext.getCmp('mytask-tab51');
        tabPanel.setActiveTab(formPanel);
      }
    } 
    break;
    case 56 : //执法监察动态巡查原始记录表
    {
      
      var tabPanel = Ext.getCmp("mytask-tab");
      if (Ext.getCmp('mytask-tab56') == undefined) {
        var  plan_store = new Ext.data.Store({
          proxy: new Ext.data.HttpProxy({
              url: '/desktop/get_ysjl'
          }),
          reader: new Ext.data.JsonReader({
            totalProperty: 'results', 
            root: 'rows',             
            fields: [
              {name: 'id',    type: 'integer'},
              {name: 'xcsj',  type: 'string'},
              {name: 'xcry',  type: 'string'},
              {name: 'xcqy',  type: 'string'},
              {name: 'xmmc',  type: 'string'},
              {name: 'yddw',  type: 'string'},
              {name: 'xmzl',  type: 'string'},
              {name: 'sffhgh',  type: 'string'},
              {name: 'ydl',  type: 'string'},
              {name: 'lxpwh',  type: 'string'},
              {name: 'ghwh',  type: 'string'},
              {name: 'zzpwh',  type: 'string'},
              {name: 'gdpwh',  type: 'string'},
              {name: 'pzyt',  type: 'string'},
              {name: 'sjyt',  type: 'string'},
              {name: 'pzmj',  type: 'string'},
              {name: 'pzgd',  type: 'string'},
              {name: 'dgsj',  type: 'string'},
              {name: 'jsqk',  type: 'string'},
              {name: 'sjzd',  type: 'string'},
              {name: 'sjgd',  type: 'string'},
              {name: 'wfmj',  type: 'string'},
              {name: 'czqk',  type: 'string'},
              {name: 'bz',  type: 'string'}
            ]    
          }),
          sortInfo:{field: 'id', direction: "ASC"}
      });
      plan_store.baseParams.xcry = currentUser.username;
      //plan_store.load();
      var sm = new Ext.grid.CheckboxSelectionModel();
      var planGrid = new Ext.grid.GridPanel({
          id: 'my_plan_grid_id',
          store: plan_store,
          columns: [           
            { header : 'id',    width : 75, sortable : true, dataIndex: 'id', hidden:true},  
            { header : '巡查时间',  width : 75, sortable : true, dataIndex: 'xcsj'},          
            //{ header : '巡查主体',  width : 200, sortable : true, dataIndex: 'xczt'},
            { header : '巡查人员',  width : 75, sortable : true, dataIndex: 'xcry'},            
            { header : '巡查区域',  width : 75, sortable : true, dataIndex: 'xcqy'},
            { header : '项目名称',  width : 75, sortable : true, dataIndex: 'xmmc'},
            { header : '用地单位',  width : 75, sortable : true, dataIndex: 'yddw'},
            { header : '坐落位置',  width : 75, sortable : true, dataIndex: 'xmzl'},
            { header : '是否符合土地利用整体规划',  width : 75, sortable : true, dataIndex: 'sffhgh'},
            { header : '原地类',  width : 75, sortable : true, dataIndex: 'ydl'},
            { header : '立项时间、批文号',  width : 75, sortable : true, dataIndex: 'lxpwh'},
            { header : '规划定点时间、文号',  width : 75, sortable : true, dataIndex: 'ghwh'},
            { header : '转征用时间、批文号',  width : 75, sortable : true, dataIndex: 'zzpwh'},
            { header : '供地时间、批文号',  width : 200, sortable : true, dataIndex: 'gdpwh'},
            { header : '批准用途',  width : 75, sortable : true, dataIndex: 'pzyt'},
            { header : '实际用途',  width : 75, sortable : true, dataIndex: 'sjyt'},
            { header : '批准面积(亩)',  width : 75, sortable : true, dataIndex: 'pzmj'},
            { header : '其中耕地(亩)',  width : 75, sortable : true, dataIndex: 'pzgd'},
            { header : '动工时间',  width : 75, sortable : true, dataIndex: 'dgsj'},
            { header : '建设状况',  width : 75, sortable : true, dataIndex: 'jsqk'},
            { header : '实际占地面积(亩)',  width : 75, sortable : true, dataIndex: 'sjzd'},
            { header : '其中耕地(亩)',  width : 75, sortable : true, dataIndex: 'sjgd'},
            { header : '违法面积',  width : 75, sortable : true, dataIndex: 'wfmj'},
            { header : '处置情况',  width : 75, sortable : true, dataIndex: 'czqk'},
            { header : '备注',  width : 75, sortable : true, dataIndex: 'bz'}
            ], 
          columnLines: true,
          layout:'fit',
          viewConfig: {
            stripeRows:true,
          },
          tbar:[
			'&nbsp;&nbsp;<span style=" font-size:12px;font-weight:600;color:#3366FF;">统计月份(例：201303)</span>:&nbsp;&nbsp;',
			{
				xtype:'textfield',
				id:'ysjl_tj_yf'									
			},
			'<span style=" font-size:12px;font-weight:600;color:#3366FF;">巡查区域</span>:&nbsp;&nbsp;', { 
              xtype: 'combo',
              width: 75,
			  id:'ysjl_qy',
              store: xzqmc_store,
              emptyText:'请选择',
              mode: 'local',
              minChars : 2,
              multiSelect: true,
              valueField:'text',
              displayField:'text',
              triggerAction:'all'
            },
			{
	            text : '统计',
	            iconCls : 'query',
				tooltip:'请输入统计月份（例：201303）',
	            handler : function(){
	               	if (Ext.getCmp('ysjl_tj_yf').getValue()==''){
						alert("请输入统计月份再统计。（例：201303）");											
					}else{
						if (Ext.getCmp('ysjl_tj_yf').getValue().length==6){													
							insert_qx=getLastDay(Ext.getCmp('ysjl_tj_yf').getValue().substr(0,4),Ext.getCmp('ysjl_tj_yf').getValue().substr(4,2));
							plan_store.baseParams.rq=Ext.getCmp('ysjl_tj_yf').getValue() + insert_qx;
							plan_store.baseParams.xcqymc=Ext.getCmp('ysjl_qy').getValue();
							plan_store.load();	
						}else{
							alert("统计月份有问题。请重新输入后再统计。（例：201303）");
						}
																							
					}
				}
	        },{
              text : '导出报表',
              iconCls : 'add',
              //hidden : true,
              handler : function(){
                window.open('images/ysjl.xls','','height=500,width=800,top=150, left=100,scrollbars=yes,status=yes');
              } 
          }]
        });


        
  
        //plan_store.load();
        var formPanel = new Ext.form.FormPanel({
            xtype:"panel",
            id:'mytask-tab56',
            //iconCls: 'tabs',
            closable : true,
            closeAction: 'hide',
            title:"执法监察动态巡查原始记录表",
            layout: 'fit',
      
            items:[planGrid]
        });

        tabPanel.add(formPanel);
        tabPanel.doLayout();
        
        tabPanel.setActiveTab(formPanel);
      } else {
        formPanel = Ext.getCmp('mytask-tab52');
        tabPanel.setActiveTab(formPanel);
      }
      
    } 
    break;    
    case 41 :
    {
      var tabPanel = Ext.getCmp("mytask-tab");
      if (Ext.getCmp('mytask-tab41') == undefined) {
        
        //Helper functions
        var view_xmdk_handler = function(){
          view_xmdks('sys_xmdks_grid_41');
        };  
        
        var delete_xmdk_handler = function(){
          delete_xmdks('sys_xmdks_grid_41');
        };        
 
       
        //========Main Grid ============ 
        var  xmdks_store = new Ext.data.Store({
          proxy: new Ext.data.HttpProxy({
              url: '/desktop/get_xmdks_store'
          }),
          reader: new Ext.data.JsonReader({
            totalProperty: 'results', 
            root: 'rows',             
            fields: [
              {name: 'gid',    type: 'integer'},
              {name: 'xc_count',type: 'integer'},
              {name: 'xmmc',   type: 'string'},
              {name: 'pzwh',   type: 'string'},
              {name: 'sfjs',   type: 'string'},
              {name: 'yddw',   type: 'string'},
              {name: 'tdzl',   type: 'string'},
              {name: 'dkmj',   type: 'string'},
              {name: 'jlrq',   type: 'date', dateFormat: 'Y-m-d'},
              {name: 'xzqmc',  type: 'string'},
              {name: 'shape_area',  type: 'float'},
              {name: 'shape_len' ,  type: 'float'},
              {name: 'username'  ,  type: 'string'},
              {name: 'xz_tag'    ,  type: 'string'},
              {name: 'the_center',  type: 'string'},
              {name: 'geom_string',  type: 'string'},
              {name: 'gdqkid'    ,  type: 'string'}
            ]    
          }),
          sortInfo:{field: 'gid', direction: "ASC"}
        });
        
        var sm = new Ext.grid.CheckboxSelectionModel();
        var sysXmdksGrid = new Ext.grid.GridPanel({
          id: 'sys_xmdks_grid_41',
          store: xmdks_store,
          columns: [
            sm,
            { header : 'gid',    width : 75, sortable : true, dataIndex: 'gid', hidden:true},
            { header : '项目名称',   width : 200, sortable : true, dataIndex: 'xmmc'},
            { header : '巡查次数',   width : 75, sortable : true, dataIndex: 'xc_count'},
            { header : '批准文号',   width : 200, sortable : true, dataIndex: 'pzwh', hidden:true},
            { header : '是否建设',   width : 75, sortable : true,  dataIndex: 'sfjs', hidden:true},
            { header : '用地单位',   width : 150, sortable : true,  dataIndex: 'yddw'},
            { header : '土地坐落',   width : 75, sortable : true,  dataIndex: 'tdzl'},
            { header : '地块面积',   width : 75, sortable : true,  dataIndex: 'dkmj'},
            { header : '创建日期',   width : 75, sortable : true,  dataIndex: 'jlrq'},
            { header : '行政区名称',  width : 75, sortable : true,  dataIndex: 'xzqmc'},
            { header : '图班面积',   width : 75, sortable : true,  dataIndex: 'shape_area'},
            { header : '图斑周长',   width : 75, sortable : true,  dataIndex: 'shape_len'},
            { header : '创建人',    width : 75, sortable : true,  dataIndex: 'username', hidden:true},
            { header : '是否新增',   width : 75, sortable : true,  dataIndex: 'xz_tag', hidden:true},
            { header : '中心点',    width : 75, sortable : true,  dataIndex: 'the_center', hidden:true}
            ],                                                            
          sm:sm,  
          columnLines: true,
          layout:'fit',
          viewConfig: {
            stripeRows:true,
          },
          tbar:[{
              text : '查看详细', iconCls : 'edit', handler : view_xmdk_handler
            }, {
              text : '删除选择', iconCls : 'delete', handler : delete_xmdk_handler 
            }, '-',
            '<span style=" font-size:12px;font-weight:600;color:#3366FF;">巡查过滤</span>:&nbsp;&nbsp;', { 
              xtype: 'combo',
              width: 75,
              store: xcgl_store,
              emptyText:'请选择',
              mode: 'local',
              minChars : 2,
              multiSelect: true,
              valueField:'text',
              displayField:'text',
              triggerAction:'all',
              listeners:{
                select:function(combo, records, index) {
                  var key = combo.getValue();
                  xmdks_store.baseParams.xcgl = key;
                  xmdks_store.load();
                }
              }
            },'<span style=" font-size:12px;font-weight:600;color:#3366FF;">巡查区域</span>:&nbsp;&nbsp;', { 
              xtype: 'combo',
              width: 75,
              store: xcqy_store,
              emptyText:'请选择',
              mode: 'local',
              minChars : 2,
              multiSelect: true,
              valueField:'text',
              displayField:'text',
              triggerAction:'all',
              listeners:{
                select:function(combo, records, index) {
                  var key = combo.getValue();
                  xmdks_store.baseParams.xcqy = key;
                  xmdks_store.load();
                }
              }
            }],
          bbar:['->',
            new Ext.PagingToolbar({
              store: xmdks_store,
              pageSize: 20,
              width : 350,
              border : false,
              displayInfo: true,
              displayMsg: '{0} - {1} of {2}',
              emptyMsg: "没有找到！",
              prependButtons: true
            })
          ]
        });
        
        

        
        ///=============================
        // Load Store 
        xmdks_store.baseParams.xcqy   = "全部";
        xmdks_store.baseParams.xz_tag = '是'
        xmdks_store.baseParams.xcry   = currentUser.username;
        xmdks_store.baseParams.limit  = "20";
        xmdks_store.load();
        
        // 下属 区域 -- 人员
        var xsTree = new Ext.tree.TreePanel({
            rootVisible:false,
            lines:false,
            title:'按单位部门',
            autoScroll:true,
            loader: new Ext.tree.TreeLoader({
              dataUrl: '/desktop/get_xstree?username='+currentUser.username,     //基于currentUser的权限
              //dataUrl: '/desktop/get_xstree?username=金云平', 
              baseAttrs: { uiProvider: Ext.ux.TreeCheckNodeUI } 
            }),
            root: {
              nodeType: 'async',
              text: '人员',
              draggable:false,
              id:'root'
            }
        });

        xsTree.on("click", function(node,e) {
          e.stopEvent();
          node.select();
          if (node.isLeaf()) {
            var ss = node.id.split("|");
            xmdks_store.baseParams.xcqy      = ss[0]
            xmdks_store.baseParams.xcry      = ss[1]
            xmdks_store.load();
          } 
        }, xsTree);
        

        var formPanel = new Ext.form.FormPanel({
          xtype:"panel",
          id:'mytask-tab41',
          //iconCls: 'tabs',
          closable : true,
          closeAction: 'hide',
          title:"我的巡查地块",
          layout: 'fit',
          items:[{
        		layout:"border",
        		width:800,
        		height:600,
        		items:[{
        				region:"center", layout:"fit", border:false, width:500, height:600,items:[sysXmdksGrid]},
        			{ region:"west",   layout:"fit", border:false, width:200, height:600,items:[xsTree]
        		}]
        	}]
        });
        
        tabPanel.add(formPanel);
        tabPanel.doLayout();
        
        tabPanel.setActiveTab(formPanel);
      } else {
        formPanel = Ext.getCmp('mytask-tab41');
        tabPanel.setActiveTab(formPanel);
      }
      
    }
    break;
    case 42 : {
      var tabPanel = Ext.getCmp("mytask-tab");
      if (Ext.getCmp('mytask-tab42') == undefined) {
        
        //Helper functions
        var view_xmdk_handler = function(){
          view_xmdks('sys_xmdks_grid_42');
        }       
       
        //========Main Grid ============ 
        var  xmdks_store = new Ext.data.Store({
          proxy: new Ext.data.HttpProxy({
              url: '/desktop/get_xmdks_store'
          }),
          reader: new Ext.data.JsonReader({
            totalProperty: 'results', 
            root: 'rows',             
            fields: [
              {name: 'gid',    type: 'integer'},
              {name: 'xc_count',    type: 'integer'},
              {name: 'xmmc',   type: 'string'},
              {name: 'pzwh',   type: 'string'},
              {name: 'sfjs',   type: 'string'},
              {name: 'yddw',   type: 'string'},
              {name: 'tdzl',   type: 'string'},
              {name: 'dkmj',   type: 'string'},
              {name: 'jlrq',   type: 'date', dateFormat: 'Y-m-d'},
              {name: 'xzqmc',  type: 'string'},
              {name: 'shape_area',  type: 'float'},
              {name: 'shape_len' ,  type: 'float'},
              {name: 'username'  ,  type: 'string'},
              {name: 'xz_tag'    ,  type: 'string'},
              {name: 'the_center',  type: 'string'},
              {name: 'geom_string',  type: 'string'},
              {name: 'gdqkid'    ,  type: 'string'}
            ]    
          }),
          sortInfo:{field: 'gid', direction: "ASC"}
        });

        
        var sm = new Ext.grid.CheckboxSelectionModel();
        var sysXmdksGrid = new Ext.grid.GridPanel({
          id: 'sys_xmdks_grid_42',
          store: xmdks_store,
          columns: [
            sm,
            { header : 'gid',    width : 75, sortable : true, dataIndex: 'gid', hidden:true},
            { header : '项目名称',   width : 200, sortable : true, dataIndex: 'xmmc'},
            { header : '巡查次数',   width : 75, sortable : true, dataIndex: 'xc_count'},
            { header : '批准文号',   width : 200, sortable : true, dataIndex: 'pzwh', hidden:true},
            { header : '是否建设',   width : 75, sortable : true,  dataIndex: 'sfjs', hidden:true},
            { header : '用地单位',   width : 150, sortable : true,  dataIndex: 'yddw'},
            { header : '土地坐落',   width : 75, sortable : true,  dataIndex: 'tdzl'},
            { header : '地块面积',   width : 75, sortable : true,  dataIndex: 'dkmj'},
            { header : '创建日期',   width : 75, sortable : true,  dataIndex: 'jlrq'},
            { header : '行政区名称',  width : 75, sortable : true,  dataIndex: 'xzqmc'},
            { header : '图班面积',   width : 75, sortable : true,  dataIndex: 'shape_area'},
            { header : '图斑周长',   width : 75, sortable : true,  dataIndex: 'shape_len'},
            { header : '创建人',    width : 75, sortable : true,  dataIndex: 'username', hidden:true},
            { header : '是否新增',   width : 75, sortable : true,  dataIndex: 'xz_tag', hidden:true},
            { header : '中心点',    width : 75, sortable : true,  dataIndex: 'the_center', hidden:true}
            ],                                                            
          sm:sm,  
          columnLines: true,
          layout:'fit',
          viewConfig: {
            stripeRows:true,
          },
          tbar:[{
              text : '查看详细', iconCls : 'edit', handler : view_xmdk_handler
            }, '-',
            '<span style=" font-size:12px;font-weight:600;color:#3366FF;">巡查过滤</span>:&nbsp;&nbsp;', { 
              xtype: 'combo',
              width: 75,
              store: xcgl_store,
              emptyText:'请选择',
              mode: 'local',
              minChars : 2,
              multiSelect: true,
              valueField:'text',
              displayField:'text',
              triggerAction:'all',
              listeners:{
                select:function(combo, records, index) {
                  var key = combo.getValue();
                  xmdks_store.baseParams.xcgl = key;
                  xmdks_store.load();
                }
              }
            },'<span style=" font-size:12px;font-weight:600;color:#3366FF;">巡查区域</span>:&nbsp;&nbsp;', { 
              xtype: 'combo',
              width: 75,
              store: xcqy_store,
              emptyText:'请选择',
              mode: 'local',
              minChars : 2,
              multiSelect: true,
              valueField:'text',
              displayField:'text',
              triggerAction:'all',
              listeners:{
                select:function(combo, records, index) {
                  var key = combo.getValue();
                  xmdks_store.baseParams.xcqy = key;
                  xmdks_store.load();
                }
              }
            }],
          bbar:['->',
            new Ext.PagingToolbar({
              store: xmdks_store,
              pageSize: 20,
              width : 350,
              border : false,
              displayInfo: true,
              displayMsg: '{0} - {1} of {2}',
              emptyMsg: "没有找到！",
              prependButtons: true
            })
          ]
        });
        
        ///=============================
        // Load Store 
        xmdks_store.baseParams.xcqy   = "全部";
        xmdks_store.baseParams.username = currentUser.username;
        xmdks_store.baseParams.limit  = "20";
        xmdks_store.load();
        
        var formPanel = new Ext.form.FormPanel({
          xtype:"panel",
          id:'mytask-tab42',
          //iconCls: 'tabs',
          closable : true,
          closeAction: 'hide',
          title:"系统巡查地块",
          layout: 'fit',
          items:[sysXmdksGrid]
        });
        
        var xsTree = new Ext.tree.TreePanel({
            rootVisible:false,
            lines:false,
            title:'按单位部门',
            autoScroll:true,
            loader: new Ext.tree.TreeLoader({
              dataUrl: '/desktop/get_xstree?username='+currentUser.username,  
              baseAttrs: { uiProvider: Ext.ux.TreeCheckNodeUI } 
            }),
            root: {
              nodeType: 'async',
              text: '人员',
              draggable:false,
              id:'root'
            }
        });

        xsTree.on("click", function(node,e) {
          e.stopEvent();
          node.select();
          if (node.isLeaf()) {
            var ss = node.id.split("|");
            xmdks_store.baseParams.username  = currentUser.username;
            xmdks_store.baseParams.xcqy      = ss[0];
            xmdks_store.baseParams.xcry      = ss[1];
            xmdks_store.load();
          } else {
            var ss = node.id.split("|");
            xmdks_store.baseParams.username  = currentUser.username;
            xmdks_store.baseParams.xcqy      = ss[0];
            xmdks_store.baseParams.xcry      = "全部";
            xmdks_store.load();
          } 
        }, xsTree);
        
        var formPanel = new Ext.form.FormPanel({
          xtype:"panel",
          id:'mytask-tab42',
          //iconCls: 'tabs',
          closable : true,
          closeAction: 'hide',
          title:"系统巡查地块",
          layout: 'fit',
          items:[{
        		layout:"border",
        		width:800,
        		height:600,
        		items:[{
        				region:"center", layout:"fit", border:false, width:500, height:600,items:[sysXmdksGrid]},
        			{ region:"west",   layout:"fit", border:false, width:200, height:600,items:[xsTree]
        		}]
        	}]
        });
        
        
        tabPanel.add(formPanel);
        tabPanel.doLayout();
        
        tabPanel.setActiveTab(formPanel);
      } else {
        formPanel = Ext.getCmp('mytask-tab42');
        tabPanel.setActiveTab(formPanel);
      }
    }
    break;
    
    default:
    {
      alert("正在建设中。。。"+id);
    }
  }
};
