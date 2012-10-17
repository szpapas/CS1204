MyDesktop.TaskMan = Ext.extend(Ext.app.Module, {
    
    id:'taskman',
    init : function(){
      this.launcher = {
        text: '任务管理',
        iconCls:'taskman',
        handler : this.createWindow,
        scope: this
      }
    },
    
    createWindow : function(){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('taskman');
        if(!win){
          
          var  plan_store = new Ext.data.Store({
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
                  {name: 'qrq',   type: 'date', dateFormat: 'Y-m-d H:i:s'},
                  {name: 'zrq',   type: 'date', dateFormat: 'Y-m-d H:i:s'},
                  {name: 'xmdk',  type: 'string'},
                  {name: 'tbr',   type: 'string'},
                  {name: 'fzr',   type: 'string'},
                  {name: 'bz',    type: 'string'},
                  {name: 'zt',    type: 'string'},
                  {name: 'xcrq',  type: 'date', dateFormat: 'Y-m-d H:i:s'}
                ]    
              }),
              sortInfo:{field: 'id', direction: "ASC"}
          });
          
          //load data
          plan_store.baseParams.zt = "全部";
          plan_store.baseParams.limit = "20";
          plan_store.load();
          
          //plan add/edit windows
          var add_plan_wizard = function() {
            var wizPanel = new Ext.form.FormPanel({
              id : 'wizard_panel_id',
              autoScroll : true,
              width:800,
              height:400,
              layout:'absolute',
              items: [{ 
                  xtype: 'label',
                  text: '巡查方式',
                  x: 10,
                  y: 10
                },{
                  xtype: 'combo',
                  x: 100,
                  y: 10,
                  width: 150,
                  name: 'xcfs',
                  id: 'xcfs_combo_id',
                  store: xcfs_store,
                  emptyText:'请选择',
                  mode: 'local',
                  minChars : 2,
                  multiSelect: true,
                  valueField:'text',
                  value:"综合巡查",
                  displayField:'text',
                  triggerAction:'all',
                  listeners:{
                    select:function(combo, records, index) {
                      Ext.getCmp('xcqy_combo_id').setValue('全部');
                    }
                  }
                },{
                  xtype: 'label',
                  text: '巡查区域',
                  x: 10,
                  y: 40                 
                },{
                  xtype: 'combo',
                  x: 100,
                  y: 40,
                  width: 150,
                  name: 'xcqy',
                  id: 'xcqy_combo_id',
                  store: xcqy_store,
                  emptyText:'请选择',
                  mode: 'local',
                  minChars : 2,
                  multiSelect: true,
                  valueField:'text',
                  value:"尚湖镇",
                  displayField:'text',
                  triggerAction:'all',
                  listeners:{
                  }
                },{
                  xtype: 'label',
                  text: '巡查年份',
                  x: 10,
                  y: 70                 
                },{
                  xtype: 'combo',
                  x: 100,
                  y: 70,
                  width: 150,
                  name: 'nd',
                  id: 'nd_combo_id',
                  store: nd_store,
                  emptyText:'请选择',
                  mode: 'local',
                  minChars : 2,
                  multiSelect: true,
                  valueField:'value',
                  value:"2012",
                  displayField:'text',
                  triggerAction:'all',
                  listeners:{
                    //select:function(combo, records, index) {
                    //  plan_store.proxy.extraParams.filter=records[0].data.text;
                    //  plan_store.load();
                    //}
                  }
                },{
                  xtype: 'label',
                  text: '巡查频度',
                  hidden: true,
                  x: 10,
                  y: 100                 
                },{
                  xtype: 'combo',
                  x: 100,
                  y: 100,
                  width: 150,
                  name: 'pd',
                  id: 'pd_combo_id',
                  store: pd_store,
                  hidden: true,
                  emptyText:'请选择',
                  mode: 'local',
                  minChars : 2,
                  multiSelect: true,
                  valueField:'text',
                  value:"1周2次",
                  displayField:'text',
                  triggerAction:'all',
                  listeners:{
                    //select:function(combo, records, index) {
                    //  plan_store.proxy.extraParams.filter=records[0].data.text;
                    //  plan_store.load();
                    //}
                  }
              }]
            });

            var wizWin = new Ext.Window({
              id : 'add_wizard_win',
              iconCls : 'add',
              title: '计划任务',
              floating: true,
              shadow: true,
              draggable: true,
              closable: true,
              modal: true,
              width: 500,
              height: 300,
              layout: 'fit',
              plain: true,
              items: wizPanel,
              buttons: [{
                text: '确定',
                handler: function() {
                  var myForm = Ext.getCmp('wizard_panel_id').getForm();
                  pars = myForm.getFieldValues();
                  
                  new Ajax.Request("/desktop/add_plan_wiz", { 
                    method: "POST",
                    parameters: pars,
                    onComplete:  function(request) {
                      if (request.responseText == 'Success') {
                        wizWin.close();
                        plan_store.load();
                      } else {
                        //msg('失败', '新增任务失败!');
                        plan_store.load();
                      }
                    }
                  });
                }
              }]
              
            });

            wizWin.show();
          };
          
          var add_planwin = function (gsm) {
            
            var planPanel = new Ext.form.FormPanel({
              id : 'plan_panel_id',
              autoScroll : true,
              width:800,
              height:400,
              layout:'absolute',
              items: [
                  {
                    xtype: 'textfield',
                    name : 'id',
                    hidden: true
                  },
                  {
                    xtype: 'textfield',
                    name : 'xcbh',
                    hidden: true                    
                  },
                  {
                      xtype: 'datefield',
                      id : 'qrq-field-id',
                      x: 70,
                      y: 20,
                      width: 200,
                      name: 'qrq',
                      format: 'Y-m-d'
                  },
                  {
                      xtype: 'datefield',
                      id : 'zrq-field-id',
                      x: 70,
                      y: 50,
                      width: 200,
                      name: 'zrq',
                      format: 'Y-m-d' 
                  },
                  {
                      xtype: 'label',
                      text: '开始时间',
                      x: 10,
                      y: 20
                  },
                  {
                      xtype: 'label',
                      text: '结束时间',
                      x: 10,
                      y: 50
                  },
                  {
                      xtype: 'label',
                      text: '巡查路线',
                      x: 400,
                      y: 20
                  },
                  {
                      xtype: 'textarea',
                      x: 460,
                      y: 20,
                      width: 320,
                      height: 50,
                      name: 'xclx'
                  },
                  {
                      xtype: 'label',
                      text: '巡查人员',
                      x: 10,
                      y: 80
                  },
                  {
                      xtype: 'textarea',
                      id : 'xcry_field_id',
                      x: 70,
                      y: 80,
                      width: 320,
                      height: 50,
                      name: 'xcry'
                  },
                  {
                      xtype: 'label',
                      text: '巡查地块',
                      x: 400,
                      y: 80
                  },
                  {
                      xtype: 'textarea',
                      id : 'xmdk_field_id',
                      x: 460,
                      y: 80,
                      width: 320,
                      height: 50,
                      name: 'xmdk'
                  },
                  {
                      xtype: 'label',
                      text: '巡查内容',
                      x: 10,
                      y: 140
                  },
                  {
                      xtype: 'textarea',
                      x: 70,
                      y: 140,
                      width: 710,
                      height: 60,
                      name: 'xcnr'
                  },
                  {
                      xtype: 'label',
                      text: '巡查结果',
                      x: 10,
                      y: 210
                  },
                  {
                      xtype: 'textarea',
                      x: 70,
                      y: 210,
                      width: 710,
                      height: 60,
                      name: 'xcjg'
                  },
                  {
                      xtype: 'label',
                      text: '处理意见',
                      x: 10,
                      y: 280
                  },
                  {
                      xtype: 'textarea',
                      x: 70,
                      y: 280,
                      width: 710,
                      height: 60,
                      name: 'clyj'
                  }
              ]

            });

            var plan_win = new Ext.Window({
              id : 'add_plan_win',
              iconCls : 'add',
              title: '计划任务',
              floating: true,
              shadow: true,
              draggable: true,
              closable: true,
              modal: true,
              width: 815,
              height: 500,
              layout: 'fit',
              plain: true,
              items:planPanel,
              //'<span style=" font-size:12px;font-weight:600;color:#3366FF;">区域</span>:&nbsp;&nbsp;'
              tbar:['<span style=" font-size:12px;font-weight:600;color:#3366FF;">巡查方式</span>:&nbsp;&nbsp;', { 
                  xtype: 'combo',
                  width: 100,
                  name: 'xcfs',
                  id: 'xcfs_combo_id',
                  store: xcfs_store,
                  emptyText:'请选择',
                  mode: 'local',
                  minChars : 2,
                  multiSelect: true,
                  valueField:'text',
                  value:"综合巡查",
                  displayField:'text',
                  triggerAction:'all',
                  listeners:{
                    //select:function(combo, records, index) {
                    //  plan_store.proxy.extraParams.filter=records[0].data.text;
                    //  plan_store.load();
                    //}
                  }
                }, 
                '<span style=" font-size:12px;font-weight:600;color:#3366FF;">区域</span>:&nbsp;&nbsp;', { 
                  xtype: 'combo',
                  width: 100,
                  name: 'xcqy',
                  id: 'xcqy_combo_id',
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
                      //设定检查人员名单：
                      data = combo.getValue();
                      pars = {xcqy:data};
                      new Ajax.Request("/desktop/get_xzq_xcry", { 
                        method: "POST",
                        parameters: pars,
                        onComplete:  function(request) {
                          if (request.responseText.length > 0 && request.responseText.length < 500) {
                            Ext.getCmp('xcry_field_id').setValue(request.responseText);
                          }
                        }
                      });                      
                    }
                  }
                },'-',{  
                  text : '地块设定',
                  handler : function() {

                    //maps here 
                    var options = {
                      projection: new OpenLayers.Projection('EPSG:900913'), units: "m", maxResolution: 152.87405654296876,
                      maxExtent: new OpenLayers.Bounds(-2.003750834E7,-2.003750834E7,2.003750834E7,2.003750834E7) 
                    };

                    var map  = new OpenLayers.Map($('map_task'), options);
                    //var gsat = new OpenLayers.Layer.Google("谷歌卫星图", {type: G_SATELLITE_MAP, "sphericalMercator": true,   opacity: 1, numZoomLevels: 20});
                    //var gmap = new OpenLayers.Layer.Google("谷歌地图", {type: G_NORMAL_MAP, "sphericalMercator": true,   opacity: 1, numZoomLevels: 20});

                    var gmap = new OpenLayers.Layer.Google(
                        "谷歌地图", // the default
                        {numZoomLevels: 20}
                    );
                    var ghyb = new OpenLayers.Layer.Google(
                        "混合地图",
                        {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
                    );
                    var gsat = new OpenLayers.Layer.Google(
                        "谷歌卫星图",
                        {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
                    );

                    demolayer = new OpenLayers.Layer.WMS("cite:dltb","../service/wms",
                    {layers: 'cite:dltb', format: 'image/jpeg' },
                    { tileSize: new OpenLayers.Size(256,256)});
                    
                    map.addLayers([gsat, gmap, ghyb]);
                    
                    var zjzj_map = new OpenLayers.Layer.WMS("行政区划", host_url, 
                      { layers: 'cs1204:zjzj', srs: 'EPSG:2364', transparent: true, format: format }, s_option3t);

                    var dltb_line = new OpenLayers.Layer.WMS("地类图斑", host_url, 
                      { layers: 'cs1204:dltb', srs: 'EPSG:2364', transparent: true, format: format }, s_option5f);

                    var xmdk = new OpenLayers.Layer.WMS("项目地块", host_url, 
                        { layers: 'cs1204:xmdk', srs: 'EPSG:900913', transparent: true, format: format }, s_option8); 
                        
                    map.addLayers([zjzj_map, dltb_line, xmdk]);
                    
                    map.addControl(new OpenLayers.Control.Graticule({numPoints: 2, labelled: true,visible: true}));

                    map.addControl(new OpenLayers.Control.LayerSwitcher());
                    
                    var zoomLevel = 14;
                    map.setCenter(new OpenLayers.LonLat(13433632.3955943,3715923.24566449), zoomLevel);

                    var mapPanel = new Ext.Panel({
                      id : 'map_task',
                      title: '任务图',
                      autoScroll: true,
                      xtype:"panel",
                      width:800,
                      height:500,
                      style:'margin:0px 0px',
                      layout:'fit',
                      items: [{
                          xtype: 'mapcomponent',
                          map: map
                      }]
                    });
                    
                    
                    //xmdk grid
                    
                    var  xmdk_store = new Ext.data.Store({
                        proxy: new Ext.data.HttpProxy({
                            url: '/desktop/get_xmdk'
                        }),

                        reader: new Ext.data.JsonReader({
                          totalProperty: 'results', 
                          root: 'rows',             
                          fields: [
                            {name: 'gid',  type: 'integer'},
                            {name: 'xh',  type: 'string'},
                            {name: 'sfjs',  type: 'string'},
                            {name: 'xzqmc',  type: 'string'},
                            {name: 'the_center',  type: 'string'}
                          ]    
                        }),
                        baseParams :  {search:''},
                        sortInfo:{field: 'gid', direction: "ASC"}
                    });
                    
                    xmdk_store.load();
                    
                    var xmdkGrid = new Ext.grid.GridPanel({
                      id: 'xmdk_grid_id',
                      store: xmdk_store,
                      height : 320,
                      columns: [
                        { header : 'id',    width : 75, sortable : true, dataIndex: 'gid', hidden:true},
                        { header : '序号',    width : 75, sortable : true, dataIndex: 'xh'},
                        { header : '建设状态',  width : 75, sortable : true, dataIndex: 'sfjs'},
                        { header : '行政区',   width : 75, sortable : true, dataIndex: 'xzqmc'}
                        ],
                      columnLines: true,
                      layout: 'fit',
                      //height: 300,
                      border: false,
                      viewConfig: {
                        stripeRows:true
                      }
                    });
                    
                    xmdkGrid.on('rowclick', function(grid, row, e){
                      var data = grid.store.data.items[row].data;
                      var the_center = data.the_center;
                      ss = the_center.match(/POINT\((\d+.\d+)\s*(\d+.\d+)\)/);
                      lon = parseFloat(ss[1]);
                      lat = parseFloat(ss[2]);
                      var lonlat = new OpenLayers.LonLat(lon, lat);
                      map.panTo(lonlat,{animate: false});
                    });
                    
                    xmdkGrid.on('rowdblclick', function(grid, row, e){
                      var data = grid.store.data.items[row].data;
                     
                      var fld = Ext.getCmp('selected_xmdk_id');
                      var curVal = fld.getValue();
                      if (curVal=="") {
                        fld.setValue(data.xh);
                      } else {
                        if (curVal.indexOf(data.xh) == -1) {
                          fld.setValue(curVal + ',' + data.xh);
                        }  
                      }
                    });
                    
                    
                    var setPanel = new Ext.Panel({
                      id : 'set_panel',
                      autoScroll: true,
                      xtype:"panel",
                      width:250,
                      height:500,
                      padding: 10,
                      //style:'margin:0px 0px',
                      autoScroll: true,
                      layout: 'absolute',
                      items:[{
                          xtype: 'combo',
                          x: 10,
                          y: 10,
                          anchor: '100%',
                          id: 'xzqmc_combo_id',
                          store: xzqmc_store,
                          emptyText:'请选择',
                          mode: 'local',
                          minChars : 2,
                          valueField:'text',
                          displayField:'text',
                          triggerAction:'all',
                          listeners:{
                            select:function(combo, records, index) {
                              var key = Ext.getCmp('xzqmc_combo_id').getValue();
                              xmdk_store.baseParams = {search:key};
                              xmdk_store.load();

                              if (key != '' || key == '全部') {
                                pars = {xcqy:key};
                                new Ajax.Request("/desktop/get_xzq_center", { 
                                  method: "POST",
                                  parameters: pars,
                                  onComplete:  function(request) {
                                    if (request.responseText.length > 0) {
                                      ss = request.responseText.match(/POINT\((\d+.\d+)\s*(\d+.\d+)\)/);
                                      lon = parseFloat(ss[1]);
                                      lat = parseFloat(ss[2]);
                                      var lonlat = new OpenLayers.LonLat(lon, lat);
                                      map.panTo(lonlat,{animate: false});
                                    }
                                  }
                                });
                              }
                            
                            }
                          }
                        },
                        {
                            xtype: 'textarea',
                            id : 'selected_xmdk_id',
                            fieldLabel: 'Label',
                            anchor: '100%',
                            x: 10,
                            y: 40,
                            height : 50
                        },
                        {
                            xtype: 'panel',
                            x: 10,
                            y: 100,
                            height : 330,
                            width : 230,
                            layout : 'fit', 
                            items:xmdkGrid
                          
                      }]
                      
                    });

                    var dksd_win = new Ext.Window({
                      id : 'lxsd_win',
                      iconCls : 'add',
                      title: '地块设定',
                      floating: true,
                      shadow: true,
                      draggable: true,
                      closable: true,
                      modal: true,
                      width: 815,
                      height: 500,
                      plain: true,
                      layout:"border",
                      items:[{
                          region:"center",
                          layout:"fit",
                          items: mapPanel
                        },{
                          region:"east",
                          width:250,
                          title: '设置',
                          collapsible:true,
                          items:setPanel
                      }]
                    });
                    
                    var xcqy = Ext.getCmp('xcqy_combo_id').getValue();
                    if (xcqy != '') {
                      pars = {xcqy:xcqy};
                      new Ajax.Request("/desktop/get_xzq_center", { 
                        method: "POST",
                        parameters: pars,
                        onComplete:  function(request) {
                          if (request.responseText.length > 0) {
                            ss = request.responseText.match(/POINT\((\d+.\d+)\s*(\d+.\d+)\)/);
                            lon = parseFloat(ss[1]);
                            lat = parseFloat(ss[2]);
                            var lonlat = new OpenLayers.LonLat(lon, lat);
                            map.panTo(lonlat,{animate: false});
                          }
                        }
                      });
                    }
                    
                    dksd_win.on('beforeclose', function(p){
                      var fld_to = Ext.getCmp('xmdk_field_id');
                      var fld_from = Ext.getCmp('selected_xmdk_id');
                      fld_to.setValue(fld_from.getValue());
                    });
                    
                    
                    dksd_win.show();
                    
                  } 
                  
                   
                }, '-', {

                  text : '影像设定',
                  handle : function() {


                  }
                },'-',{
                  text : '人员设定',
                  handler : function() {
                    
                    var  user_store = new Ext.data.Store({
                        proxy: new Ext.data.HttpProxy({
                            url: '/desktop/get_user_bm'
                        }),

                        reader: new Ext.data.JsonReader({
                          totalProperty: 'results', 
                          root: 'rows',             
                          fields: [
                            {name: 'id',        type: 'integer'},
                            {name: 'username',  type: 'string'},
                            {name: 'bm',        type: 'string'}
                          ]    
                        }),
                        baseParams :  {bm:'',mc:''},
                        sortInfo:{field: 'id', direction: "ASC"}
                    });
                    
                    user_store.load();
                    
                    var userGrid = new Ext.grid.GridPanel({
                      id: 'user_grid_id',
                      store: user_store,
                      columns: [
                        { header : 'id',  width : 75, sortable : true, dataIndex: 'id', hidden:true},
                        { header : '姓名',  width : 100, sortable : true, dataIndex: 'username'},
                        { header : '部门',  width : 100, sortable : true, dataIndex: 'bm'}
                        ],
                      columnLines: true,
                      layout: 'fit',
                      height: 300,
                      border: false,
                      viewConfig: {
                        stripeRows:true
                      }
                    });
                    
                    userGrid.on('rowclick', function(grid, row, e){
                      var data = grid.store.data.items[row].data;
                      var fld = Ext.getCmp('xcry_field_id');
                      var curVal = fld.getValue();
                      if (curVal=="") {
                        fld.setValue(data.username);
                      } else {
                        if (curVal.indexOf(data.username) == -1)
                          fld.setValue(curVal + ',' + data.username);
                      }
                    });  
                    
                    var displayPanel = new Ext.form.FormPanel({
                        id : 'display_panel_id',
                        width: 250,
                        height: 320,
                        padding: 10,
                        autoScroll: true,
                        layout: 'absolute',
                        items: [
                          {
                              xtype: 'combo',
                              x: 10,
                              y: 10,
                              anchor: '100%',
                              id: 'xzqmc_combo_id',
                              store: xzqmc_store,
                              emptyText:'请选择',
                              mode: 'local',
                              minChars : 2,
                              valueField:'text',
                              displayField:'text',
                              triggerAction:'all',
                              listeners:{
                                select:function(combo, records, index) {
                                  var bm = Ext.getCmp('xzqmc_combo_id').getValue();
                                  var mc = Ext.getCmp('username_id').getValue();
                                  user_store.baseParams = {bm:bm, mc:mc};
                                  user_store.load();
                                }
                              }
                            },
                            {
                                xtype: 'textfield',
                                id : 'username_id',
                                fieldLabel: 'Label',
                                anchor: '100%',
                                x: 10,
                                y: 40,
                                listeners:{
                                   'render':function(c){
                                  　　　　c.getEl().on('keyup', function() {
                                          var bm = Ext.getCmp('xzqmc_combo_id').getValue();
                                          var mc = Ext.getCmp('username_id').getValue();
                                          user_store.baseParams = {bm:bm, mc:mc};
                                         user_store.load();  　　
                                      }, c);
                                   }
                                }
                            },
                            {
                                xtype: 'panel',
                                x: 10,
                                y: 70,
                                height : 300,
                                items:userGrid
                            }
                        ]
                    });
                    
                    var rysd_win = new Ext.Window({
                      id : 'rysd_win',
                      iconCls : 'add',
                      title: '人员设定',
                      floating: true,
                      shadow: true,
                      draggable: true,
                      closable: true,
                      modal: true,
                      width: 250,
                      height: 390,
                      x : 700,
                      y : 180,
                      layout: 'fit',
                      plain: true,
                      items:displayPanel
                    });

                    rysd_win.show();
                  }
              }],
              buttons: [{
                text: '确定',
                handler: function() {
                  var myForm = Ext.getCmp('plan_panel_id').getForm();
                  pars = myForm.getValues();
                  pars.xcqy=Ext.getCmp('xcqy_combo_id').getValue();
                  pars.xcfs=Ext.getCmp('xcfs_combo_id').getValue();
                  
                  new Ajax.Request("/desktop/add_plan", { 
                    method: "POST",
                    parameters: pars,
                    onComplete:  function(request) {
                      if (request.responseText == 'Success') {
                        plan_win.close();
                        plan_store.load();
                      } else {
                        //msg('失败', '新增任务失败!');
                      }
                    }
                  });

                }
              }]
            });

            
            if (gsm == undefined) {
              Ext.getCmp('add_plan_win').setTitle('计划任务');
            } else {
              Ext.getCmp('add_plan_win').setTitle('修改任务');
              var myForm = Ext.getCmp('plan_panel_id').getForm();
              myForm.loadRecord(gsm.selections.items[0]);
              
              data=gsm.selections.items[0].data;
              
              Ext.getCmp('xcfs_combo_id').setValue(data.xcfs);
              Ext.getCmp('xcqy_combo_id').setValue(data.xcqy);
              
            };

            plan_win.show();
            plan_win.setZIndex(9020);
          }
          
          var sm = new Ext.grid.CheckboxSelectionModel();
          
          var showDetail = function() {
             //msg('失败', '新增任务失败!');
             var size = Ext.getCmp('taskman').getSize();
             var detailWin = new Ext.Window({
               id : 'add_wizard_win',
               iconCls : 'add',
               title: '计划任务',
               floating: true,
               shadow: true,
               draggable: true,
               closable: true,
               modal: true,
               width: 500,
               height: size.height-5,
               layout: 'fit',
               plain: true,
               items : [{
                 xtype: 'panel',
                 autoScroll : true,
                 items : [{
                   xtype: 'panel',
                   id: 'myId',
                   autoEl: {},
                   html: '$0.00',
                   width: 90
                 }]
               }],
               tbar : [{
                 text : 'update',
                 handler : function(){

                   var canvas_string =
                   '<div id="wrapper">'
                   +' <div id="buttonWrapper">'
                   +' <input type="button" id="prev" value="<">'
                   +' <input type="button" id="plus" value="+">'
                   +' <input type="button" id="minus" value="—">'
                   +' <input type="button" id="next" value=">">'
                   +' </div>'
                   +' <canvas id="myCanvas" width="530" height="800">'
                   +' </canvas>'
                   +'</div>';

                   CanvasDemo.init();
                   
                 }
               }]
             });
             detailWin.show();
          };
          
          var planGrid = new Ext.grid.GridPanel({
            id: 'plan_grid_id',
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
              { header : '巡查时间',  width : 75, sortable : true, dataIndex: 'xcsj'},
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
                text : '新建任务',
                iconCls : 'add',
                handler : function(){
                  //add_planwin();
                  add_plan_wizard();
                }
              },{
                text : '修改任务',
                iconCls : 'edit',

                handler : function(){
                  var gsm =Ext.getCmp('plan_grid_id').getSelectionModel();
                  add_planwin(gsm);
                }
              },{
                text : '删除任务',
                iconCls : 'delete',
                handler : function(){
                  items = Ext.getCmp('plan_grid_id').getSelectionModel().selections.items;
                  id_str = '';
                  for (var i=0; i < items.length; i ++) {
                    if (i==0) {
                      id_str = id_str+items[i].data.id 
                    } else {
                      id_str = id_str + ',' +items[i].data.id 
                    }
                  }
                  pars = {id:id_str};
                  new Ajax.Request("/desktop/delete_selected_plan", { 
                    method: "POST",
                    parameters: pars,
                    onComplete:  function(request) {
                      plan_store.load();
                    }
                  });
                }                 
            //  },{
            //    text : '全部任务',
            //    iconCls : 'delete',
            //    handler : function(){
            //      
            //      pars = {id:"all"};
            //      new Ajax.Request("/desktop/delete_selected_plan", { 
            //        method: "POST",
            //        parameters: pars,
            //        onComplete:  function(request) {
            //          plan_store.load();
            //        }
            //      });
            //    }
              },{
                text : '打印任务',
                iconCls : 'print',
                hidden : true,
                handler : function(){
                  items = Ext.getCmp('plan_grid_id').getSelectionModel().selections.items;
                  id_str = '';
                  for (var i=0; i < items.length; i ++) {
                    if (i==0) {
                      id_str = id_str+items[i].data.id 
                    } else {
                      id_str = id_str + ',' +items[i].data.id 
                    }
                  }
                  pars = {id:items[0].data.id}
                  new Ajax.Request("/desktop/print_selected_plan", { 
                    method: "POST",
                    parameters: pars,
                    onComplete:  function(request) {

                      //var path = request.responseText;
                      var path = request.responseText;
                      var previewWin = Ext.getCmp('preview-win-id'); 
                      
                      if  (!previewWin) {
                        previewWin = new Ext.Window({
                          id : 'preview-win-id',
                          iconCls : 'detail',
                          title: '图像预览',
                          floating: true,
                          shadow: true,
                          draggable: true,
                          closable: true,
                          modal:  false,
                          width:  462,
                          height: 650,
                          layout: 'fit',
                          plain:  true,
                          tbar :[{
                              text: '打印图像',
                              handler : function() {
/*                                LODOP=getLodop(document.getElementById('LODOP'),document.getElementById('LODOP_EM'));   
                                LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_打印图片2");
                                //LODOP.ADD_PRINT_BARCODE(0,0,200,100,"Code39","*123ABC4567890*");
                                image_path = Ext.getCmp('preview_img').getEl().dom.src;
                                LODOP.ADD_PRINT_IMAGE(0,0,1000,1410,"<img border='0' src='"+image_path+"' width='100%' height='100%'/>");
                                LODOP.SET_PRINT_STYLEA(0,"Stretch",2);//(可变形)扩展缩放模式
                                LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT","Full-Page");
                                LODOP.PREVIEW();
*/                                
                              }
                            }],
                          items:[{
                            xtype: 'box', //或者xtype: 'component',
                            id: 'preview_img',
                            width: 462, //图片宽度
                            height: 600,
                            autoEl: {
                              tag: 'img',    //指定为img标签
                              alt: ''      //指定url路径
                            }
                          }]
                       
                        });
                      };
                      
                      previewWin.show();
                      if (path != undefined) { 
                        Ext.getCmp('preview_img').getEl().dom.src = path;
                      }
                      
                    }
                  });
                }
              },{    
                text : '详细内容',
                iconCls : 'detail',
                handler : function(){
                  items = Ext.getCmp('plan_grid_id').getSelectionModel().selections.items;
                  pars = {id:items[0].data.id};
                  new Ajax.Request("/desktop/view_pdf", { 
                    method: "POST",
                    parameters: pars,
                    onComplete:  function(request) {
                      var new_url = request.responseText;
                      window.open(new_url,'','height=500,width=800,top=150, left=100,scrollbars=yes,status=yes');
                    }  
                  });
                }
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
                id: 'xcqy_filter_id',
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
                    var key = Ext.getCmp('xcqy_filter_id').getValue();
                    plan_store.baseParams.xcqy = key;
                    plan_store.load();
                  }
                }
              },    
              '<span style=" font-size:12px;font-weight:600;color:#3366FF;">巡查方式</span>:&nbsp;&nbsp;', { 
                xtype: 'combo',
                width: 75,
                id: 'xcfs_filter_id',
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
                    var key = Ext.getCmp('xcfs_filter_id').getValue();
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
          
          //部门tree
          var bmTree = new Ext.tree.TreePanel({
              id:'bm-tree',
              rootVisible:false,
              lines:false,
              title:'按部门',
              autoScroll:true,
              tools:[{
                  id:'refresh',
                  on:{
                      click: function(){
                          var tree = Ext.getCmp('bm-tree');
                          tree.body.mask('Loading', 'x-mask-loading');
                          tree.root.reload();
                          //tree.root.collapse(true, false);
                          setTimeout(function(){ // mimic a server call
                              tree.body.unmask();
                              tree.root.expand(true, true);
                          }, 1000);
                      }
                  }
              }],
              loader: new Ext.tree.TreeLoader({
                dataUrl: '/desktop/get_bmtree',
                baseAttrs: { uiProvider: Ext.ux.TreeCheckNodeUI } 
              }),
              root: {
                nodeType: 'async',
                text: '联系人',
                draggable:false,
                id:'root'
              }
          });

          bmTree.on("click", function(node,e) {
            e.stopEvent();
            node.select();
            if (node.isLeaf()) {
              Ext.getCmp('xcqy_filter_id').setValue(node.id);
              plan_store.baseParams.xcqy = node.id;
              plan_store.load();
            } else {
              //var ss = node.id.split("|");
            }
          }, bmTree);
          
          
          win = desktop.createWindow({
              id: 'taskman',
              title:'任务管理',
              width:800,
              height:550,
              x : 100,
              y : 30,
              iconCls: 'taskman',
              animCollapse:false,
              border: false,
              hideMode: 'offsets',
              layout:"border",
              items:[{
                  region:"center",
                  title:"任务计划",
                  layout: 'fit',
                  items:[planGrid]
               },{
                 region:"west",
                 title:"部门",
                 width:200,
                 split:true,
                 collapsible:true,
                 titleCollapse:true,
                 layout:'fit',
                 items: [bmTree]
              }]
         });
        }
        win.show();
        return win;
    }

});