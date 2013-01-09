  
MyDesktop.LinksPanel = Ext.extend(Ext.Panel, {
    // configurables
    border:false,
    cls:'link-panel',
    links:[{
         text:'已完成任务',
         action:"myTask(1)"
    },{
         text:'计划任务',
         action:"myTask(2)"
    },{
         text:'最近任务',
         action:"myTask(3)"
    }],
    layout:'fit', 
    tpl:new Ext.XTemplate('<tpl for="links"><span><img src="/imgage/{icon}"></span><a class="examplelink" onclick="{action}" >{text}</a></tpl>'),
    // {{{
    afterRender:function() {
        MyDesktop.LinksPanel.superclass.afterRender.apply(this, arguments);
        this.tpl.overwrite(this.body, {links:this.links});
    } // e/o function afterRender
    // }}}
 
}); // e/o extend
 
// register xtype
Ext.reg('linkspanel', MyDesktop.LinksPanel);
// }}}


MyDesktop.MyTask = Ext.extend(Ext.app.Module, {

  id:'mytask',

  init : function(){
    this.launcher = {
      text: '我的任务',
      iconCls:'mytask',
      handler : this.createWindow,
      scope: this
    }
  },
  
  createWindow : function(){
  
      var desktop = this.app.getDesktop();
      var win = desktop.getWindow('mytask');
      
      if(!win){
         
         win = desktop.createWindow({
            id: 'mytask',
            title:'我的任务',
            width:800,
            height:550,
            maximized:true,
            x : 100,
            y : 30,
            iconCls: 'mytask',
            animCollapse:false,
            border: false,
            hideMode: 'offsets',
            layout:"border",
            items:[{
              region:"center",
              title:"任务窗口",
              layout: 'fit',
              items:[{
                  xtype:"tabpanel",
                  activeTab:0,
                  bodyStyle: 'padding: 5px;',
                  id : 'mytask-tab',
                  items:[]
                }]
              },{
                region:"west",
                title:currentUser.username+'的任务',
                width:200,
                split:true,
                collapsible:true,
                titleCollapse:true,
                layout: 'accordion',
                
                items:[{
                    title: '巡查任务',
                    iconCls : 'taskman',
                    id: 'panel1',
                    items :[{
                      layout : 'fit',
                      xtype:'panel',
                      width:200,
                      height:200,
                      border:false,
                      items: [{
                          // configurables
                          border:false,
                          cls:'link-panel',
                          links:[{
                               text:'任务管理',
                               id:"mytask_01",
                               icon:'date_task16.png',
                               action:"myTask(1)"
                          },{
                               text:'统计汇总',
                               icon:'chart_bar16.png',
                               id:"mytask_02",
                               action:"myTask(2)"
                          }
                      ],
                          layout:'fit', 
                          tpl:new Ext.XTemplate('<tpl for="links"><div id="{id}"><a class="examplelink" onclick="{action}" ><span><img src=/images/{icon}></img</span>&nbsp;&nbsp;{text}</a></div></tpl>'),  //
                          afterRender:function() {
                              MyDesktop.LinksPanel.superclass.afterRender.apply(this, arguments);
                              this.tpl.overwrite(this.body, {links:this.links});
                          } 
                      }]
                    }]
                },{
                    title: '卫片任务',
                    iconCls : 'saticon', 
                    id: 'panel2',
                    items: [{
                        // configurables
                        border:false,
                        cls:'link-panel',
                        links:[{
                             text:'任务管理',
                             icon:'date_task16.png',
                             id:"mytask_21",
                             action:"myTask(21)"
                        },{
                             text:'统计汇总',
                             icon:'chart_bar16.png',
                             id:"mytask_22",
                             action:"myTask(22)"
                        },{
                             text:'最近任务',
                             id:"mytask_23",
                             icon:'calendar16.png',
                             action:"myTask(23)"
                        }],
                        layout:'fit', 
                          tpl:new Ext.XTemplate('<tpl for="links"><div id="{link_id}"><a class="examplelink" onclick="{action}" ><span><img src=/images/{icon}></img</span>&nbsp;&nbsp;{text}</a></div></tpl>'),  //
                        afterRender:function() {
                            MyDesktop.LinksPanel.superclass.afterRender.apply(this, arguments);
                            this.tpl.overwrite(this.body, {links:this.links});
                        } 
                    }]
                },{
                    title: '照片管理',
                    iconCls : 'camera', 
                    id: 'panel3',
                    items: [{
                        // configurables
                        border:false,
                        cls:'link-panel',
                        links:[{
                             text:'照片上传',
                             id:"mytask_31",
                             action:"myTask(31)"
                        },{
                             text:'地图展示',
                             id:"mytask_32",
                             action:"myTask(32)"
                        },{
                             text:'照片统计',
                             id:"mytask_33",
                             action:"myTask(33)"
                        }],
                        layout:'fit', 
                        tpl:new Ext.XTemplate('<tpl for="links"><div id="{link_id}"><a class="examplelink" onclick="{action}" >{text}</a></div></tpl>'),  //
                        afterRender:function() {
                            MyDesktop.LinksPanel.superclass.afterRender.apply(this, arguments);
                            this.tpl.overwrite(this.body, {links:this.links});
                        } 
                    }]
                },{
                    title: '我的巡查点',
                    iconCls: 'pin',
                    id: 'panel4',
                    items: [{
                        // configurables
                        border:false,
                        cls:'link-panel',
                        links:[{
                             text:'新增巡查点',
                             id:"mytask_4",
                             action:"myTask(41)"
                        },{
                             text:'系统巡查点',
                             id:"mytask_5",
                             action:"myTask(42)"
                        },{
                             text:'巡查点统计',
                             id:"mytask_6",
                             action:"myTask(43)"
                        }],
                        layout:'fit', 
                        tpl:new Ext.XTemplate('<tpl for="links"><div id="{link_id}"><a class="examplelink" onclick="{action}" >{text}</a></div></tpl>'),  //
                        afterRender:function() {
                            MyDesktop.LinksPanel.superclass.afterRender.apply(this, arguments);
                            this.tpl.overwrite(this.body, {links:this.links});
                        } 
                    }]
                }]
            }]
          });
      };
      
      win.show();
      return win;
  }
});



//overall function for MyTask Processing
function myTask(id) {
  switch (id) {
    case 1 : //已完成任务
    {
      var tabPanel = Ext.getCmp("mytask-tab");
      if (Ext.getCmp('mytask-tab1') == undefined) {
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
      plan_store.baseParams.xcry = currentUser.username;
      //plan_store.load();
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
              hidden : true,
              handler : function(){
                //add_planwin();
                add_plan_wizard();
              }
            },{
              text : '修改任务',
              iconCls : 'edit',

              handler : function(){
                var gsm =Ext.getCmp('my_plan_grid_id').getSelectionModel();
                add_planwin(gsm);
              }
            },{
              text : '删除任务',
              iconCls : 'delete',
              hidden : true,
              handler : function(){
                items = Ext.getCmp('my_plan_grid_id').getSelectionModel().selections.items;
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
            },{
              text : '打印任务',
              iconCls : 'print',
              hidden : true,
              handler : function(){
                items = Ext.getCmp('my_plan_grid_id').getSelectionModel().selections.items;
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
  
        plan_store.load();
        var formPanel = new Ext.form.FormPanel({
            xtype:"panel",
            id:'mytask-tab1',
            //iconCls: 'tabs',
            closable : true,
      closeAction: 'hide',
            title:"任务管理",
            layout: 'fit',
      
            items:[planGrid]
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
    case 2 : //计划任务
    {
      var tabPanel = Ext.getCmp("mytask-tab");
      
      if (Ext.getCmp('mytask-tab2') == undefined) {
    var chart;
    //var time = (new Date()).getTime();
    chart = new Ext.ux.HighChart({
      id : 'high-chart',
      series:[{
          name: '巡查次数',
          type: 'spline',
          data: [1, 11, 20, 9, 7]      
        }//,
       // {
       //   name: '湿度2',
       //   type: 'spline',
       //   data: [22, 22, 22, 22, 22]
       // }
      ],      
      height: 300,
      width : 400,
      animShift: true,
      xField: 'time',
      chartConfig: {
        chart: {
         marginRight: 100,
         marginBottom: 100,
         zoomType: 'x'
       },
        title: { text: '巡查统计', x: -20 },
        subtitle: { text: '2012年11月26日', x: -20},
        xAxis: [{ 
          title: { text: '时间',  margin: 20}, 
          labels: { rotation: 315, y: 35 },
          type: 'datetime' 
        }],
        yAxis: { 
          title:    { text: '次数'},
          plotLines: [{ value: 0, width: 1, color: '#808080'}]
        },
       tooltip: {
          formatter: function() {
              return '<b>'+ this.series.name +'</b><br/>'+
              this.x +': '+ this.y;
          }
       },
       legend: {
           layout: 'vertical',
           align: 'right',
           verticalAlign: 'top',
           x: -10,
           y: 100,
           borderWidth: 0
       }
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
      tbar : [{
                 text:'切换',
                 handler : function() {
                   new Ajax.Request("/desktop/get_last_wd",{ 
                       method: "POST",
                       onComplete: function(request) {
                         var chart2 = Ext.getCmp('high-chart');
                         var data = eval(request.responseText);
                         chart2.removeSerie(0, true);
                         chart2.addSeries([{
                           type: 'spline',
                           name: '温度',
                           data: data
                         }]);             
                       }  
                   });
                 }
               },
        '<span style=" font-size:12px;font-weight:600;color:#3366FF;">统计方式</span>:&nbsp;&nbsp;', { 
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
          }
      ],
            items:[chart]
      //html:"sadfwef"
        });

        tabPanel.add(formPanel);
        //tabPanel.doLayout();
        
        tabPanel.setActiveTab(formPanel);
      } else {
        formPanel = Ext.getCmp('mytask-tab2');
        tabPanel.setActiveTab(formPanel);
      }
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
    default:
    {
      alert("正在建设中。。。"+id);
    }
  }
};

