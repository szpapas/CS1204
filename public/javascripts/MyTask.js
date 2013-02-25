  
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
                    hidden : true,
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
                    hidden : true,
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
                    hidden : true,
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
                },{
                    title: '统计报表',
                    iconCls: 'pin',
                    id: 'panel5',
                    items: [{
                        // configurables
                        border:false,
                        cls:'link-panel',
                        links:[{
                             text:'巡查系统考核表',
                             id:"mytask_51",
                             action:"myTask(51)"
                        },{
                             text:'巡查违法用地统计表',
                             id:"mytask_52",
                             action:"myTask(52)"
                        },{
                             text:'原始记录表',
                             id:"mytask_53",
                             action:"myTask(53)"
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
              text : '修改任务',
              iconCls : 'edit',
              handler : function(){
                var gsm =Ext.getCmp('my_plan_grid_id').getSelectionModel();
                add_planwin(gsm);
              }
            },{
              text : '地块详细',
              iconCls : 'tdsd-icon',
              handler : function(){
                var gsm =Ext.getCmp('my_plan_grid_id').getSelectionModel();
                edit_xmdk(gsm);
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
          
          var planPanel = new Ext.form.FormPanel({
            id : 'plan_panel_id',
            autoScroll : true,
            width:850,
            height:410,
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
                    xtype: 'label',
                    text: '开始时间',
                    x: 10,
                    y: 20
                },
                {
                    xtype: 'datefield',
                    id : 'qrq-field-id',
                    x: 70,
                    y: 20,
                    width: 120,
                    name: 'qrq',
                    format: 'Y-m-d'
                },
                {
                    xtype: 'label',
                    text: '结束时间',
                    x: 200,
                    y: 20
                },
                {
                    xtype: 'datefield',
                    id : 'zrq-field-id',
                    x: 260,
                    y: 20,
                    width: 120,
                    name: 'zrq',
                    format: 'Y-m-d' 
                },
                {
                    xtype: 'label',
                    text: '巡查人员',
                    x: 10,
                    y: 50
                },
                {
                    xtype: 'textarea',
                    id : 'xcry_field_id',
                    x: 70,
                    y: 50,
                    width: 320,
                    height: 20,
                    name: 'xcry'
                },
                {
                    xtype: 'label',
                    text: '巡查路线',
                    x: 10,
                    y: 80
                },
                {
                    xtype: 'textarea',
                    x: 70,
                    y: 80,
                    width: 320,
                    height: 20,
                    name: 'xclx'
                },
                {
                    xtype: 'label',
                    text: '巡查地块',
                    x: 10,
                    y: 110
                },
                {
                    xtype: 'textarea',
                    id : 'xmdk_field_id',
                    x: 70,
                    y: 110,
                    width: 320,
                    height: 20,
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
                    width: 320,
                    height: 80,
                    name: 'xcnr'
                },
                {
                    xtype: 'label',
                    text: '巡查结果',
                    x: 10,
                    y: 230
                },
                {
                    xtype: 'textarea',
                    x: 70,
                    y: 230,
                    width: 320,
                    height: 80,
                    name: 'xcjg'
                },
                {
                    xtype: 'label',
                    text: '处理意见',
                    x: 10,
                    y: 320
                },
                {
                    xtype: 'textarea',
                    x: 70,
                    y: 320,
                    width: 320,
                    height: 70,
                    name: 'clyj'
                },
                {
                    xtype: 'label',
                    text: '巡查图像',
                    x: 400,
                    y: 20
                },
                {
                    xtype: 'button',
                    text: '保存',
                    x: 480,
                    y: 15,
                    handler : function() {
                      xcElements = Ext.get('cars').select('img');
                      pp = '';
                      Ext.each(xcElements.elements, function(el) {
                        pp = pp + el.src + '|';
                      });

                      //alert (pp);
                      
                      pars = {imgs:pp, id:gsm.selections.items[0].data.id};
                      new Ajax.Request("/desktop/save_selected_photo", { 
                        method: "POST",
                        parameters: pars,
                        onComplete:  function(request) {
                          setImages(request);
                        }
                      });
                    }
                },                  
                {
                    xtype : 'box',
                    id : 'drop-img',
                    border : true,
                    x: 400,
                    y: 40,
                    width: 120,
                    height: 320,
                    name: 'xctx',
                    autoEl: {tag: 'div', id: 'drop-img', html: '已有照片'}
                },
                {
                    xtype: 'label',
                    text: '可用影像',
                    x: 540,
                    y: 20
                },
                {
                    xtype : 'box',
                    id : 'drag-img',
                    border : true,
                    x: 540,
                    y: 40,
                    width: 120,
                    height: 320,
                    name: 'kytx',
                    autoEl: {tag: 'div', id: 'drag-img', html: '可用影像'}
                },
                {
                    xtype: 'label',
                    text: '回收站',
                    x: 670,
                    y: 20
                },
                {
                    xtype: 'button',
                    text: '清空',
                    x: 720,
                    y: 15,
                    handler : function() {
                      
                      xcElements = Ext.get('repair').select('img');
                      pp = '';
                      Ext.each(xcElements.elements, function(el) {
                        pp = pp + el.src + '|';
                      });

                      //alert (pp);
                      
                      pars = {imgs:pp, id:gsm.selections.items[0].data.id};
                      new Ajax.Request("/desktop/delete_selected_photo", { 
                        method: "POST",
                        parameters: pars,
                        onComplete:  function(request) {
                          setImages(request);
                        }
                      });
                      
                    }
                },
                {
                    xtype : 'box',
                    id : 'hsz-img',
                    border : true,
                    x: 670,
                    y: 40,
                    width: 120,
                    height: 320,
                    name: 'hsz',
                    autoEl: {tag: 'div', id: 'hsz-img', html: '回收站'}
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
                          items:[xmdkGrid]
                        
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
                text : '影像上传',
                iconCls : 'upload-icon',
                handler : function() {
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
                    id : 'yysc_win',
                    iconCls : 'add',
                    title: '影像上传',
                    floating: true,
                    shadow: true,
                    draggable: true,
                    closable: true,
                    modal: true,
                    width: 350,
                    height: 140,
                    //x : 700,
                    //y : 180,
                    layout: 'fit',
                    plain: true,
                    items:[fp]
                  });

                  yysc_win.show();
                  
                }
                
              },'-',
              {
                text : '刷新',
                handler : function(){
                  
                  pars = {id:gsm.selections.items[0].data.id};
                  new Ajax.Request("/desktop/get_xcimage", { 
                    method: "POST",
                    parameters: pars,
                    onComplete:  function(request) {
                      setImages(request);
                    }  
                  });            
                  
                }
              },
              {
                text : '人员设定',
                hidden : true,
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
                
                //xctx
                xcElements = Ext.get('cars').select('img');
                
                xctx = '';
                Ext.each(xcElements.elements, function(el) {
                  xctx = xctx + el.src + '|';
                });
                
                //alert (xctx);
                
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
          
          
          pars = {id:gsm.selections.items[0].data.id};
          new Ajax.Request("/desktop/get_xcimage", { 
            method: "POST",
            parameters: pars,
            onComplete:  function(request) {
              setImages(request);
            }  
          });            
          
        };
        
        
        
         var  xg_store = new Ext.data.Store({
           proxy: new Ext.data.HttpProxy({
               url: '/desktop/get_xg'
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
        
        xg_store.on('load', function(){
          if (xg_store.data.items.length > 0) {
            var gsm = xgGrid.getSelectionModel();
            gsm.selectFirstRow();
            
            var data = xgGrid.store.data.items[0].data;
            pars = {gid:data.gid};
            new Ajax.Request("/desktop/get_plan_xmdks",{ 
                method: "POST",
                parameters : pars,
                onComplete: function(request) {
                  //alert ('get_xmdk_list called!');
                  Ext.getCmp('pp_center_id').el.dom.innerHTML = request.responseText;
                }  
            });
            
          } else {
            Ext.getCmp('pp_center_id').el.dom.innerHTML = '';
          }
        });
        
        var xgGrid = new Ext.grid.GridPanel({
            id: 'xg_grid_id',
            store: xg_store,
            columns: [           
            { header : '编号',    width : 50, sortable : true, dataIndex: 'gid'},            
            { header : '项目名称',  width : 150, sortable : true, dataIndex: 'xmmc'}
          ], 
            columnLines: true,
            layout:'fit',
            viewConfig: {
            stripeRows:true,
            }
        });
        
        xgGrid.on('rowclick', function(grid, row, e){
          var data = grid.store.data.items[row].data;
          pars = {gid:data.gid};
          new Ajax.Request("/desktop/get_plan_xmdks",{ 
              method: "POST",
              parameters : pars,
              onComplete: function(request) {
                //alert ('get_xmdk_list called!');
                Ext.getCmp('pp_center_id').el.dom.innerHTML = request.responseText;
              }  
          });
        });
        
        var edit_xmdk = function (gsm) {
          
          if (Ext.getCmp('xmdk_win_id') != undefined) {
            xmdk_win = Ext.getCmp('xmdk_win_id');
          } else {
          
            var xmdkPanel = new Ext.form.FormPanel({
              //id : 'plan_panel_id',
              autoScroll : true,
              width:850,
              height:410,
              layout:"border",
              items:[{
                  region:"west",
                  title:"",
                  id : "pp_west_id",
                  width:200,
                  height:400,
                  layout:'fit',
                  items:[xgGrid]
                },{
                  id : "pp_center_id", 
                  region:"center",
                  html:""
              }]
            });
            
            var xmdk_win = new Ext.Window({
              id : 'xmdk_win_id',
              iconCls : 'tdsd-icon',
              title: '地块详情',
              floating: true,
              shadow: true,
              draggable: true,
              closable: true,
              closeAction: 'hide',
              modal: true,
              width: 815,
              height: 500,
              layout: 'fit',
              plain: true,
              items:xmdkPanel,
              tbar:[],
              buttons:[{
                 text: '确定',
                 handler:function() {
                   xmdk_win.hide();
                 }
              }]
            });
          }
          
          if (gsm == undefined ) {
            
          } else {
            
            var item = gsm.selections.items[0];
            xg_store.baseParams = {plan_id:gsm.selections.items[0].data.id};
            xg_store.load();
          };
          
          xmdk_win.show();
          xmdk_win.setZIndex(9021);
          
        };
        
        
        // Load Store 
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
          
          var chart1, chart2;
          chart1 = new Ext.ux.HighChart({
            id : 'hc-chart1',
    
            height: 300,
           // width : 400,
           // animShift: true,
           // xField: 'time',
            chartConfig: {
              series:[{
                name: '巡查用时',
                type: 'spline',
                data: [1, 11, 20, 9, 7]      
              }],
              chart: {
                marginRight: 100,
                marginBottom: 100,
                zoomType: 'x'
              },
              title: { text: '巡查统计', x: -20 },
              subtitle: { text: '2012年11月26日', x: -20},
              xAxis: [{ 
                title: { text: '时间',  margin: 20}, 
                //labels: { rotation: 315, y: 35 },
                categories:['Jan 2008', 'Feb', 'Mar', 'Apr', 'May']
                //tickInterval: 3
                //type: 'datetime' 
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
              legend : {enabled:false},
              credits: {enabled:false}
              /*
              legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -10,
                y: 100,
                borderWidth: 0
              }
              */
            }
          });

          chart2 = new Ext.ux.HighChart({
            id : 'hc-chart2',
    
            height: 300,
           // width : 400,
           // animShift: true,
           // xField: 'time',
            chartConfig: {
              series:[{
                name: '巡查用时',
                type: 'spline',
                data: [1, 11, 20, 9, 7]      
              }],
              chart: {
                marginRight: 100,
                marginBottom: 100,
                zoomType: 'x'
              },
              title: { text: '巡查统计', x: -20 },
              subtitle: { text: '2012年11月26日', x: -20},
              xAxis: [{ 
                title: { text: '时间',  margin: 20}, 
                //labels: { rotation: 315, y: 35 },
                categories:['Jan 2008', 'Feb', 'Mar', 'Apr', 'May']
                //tickInterval: 3
                //type: 'datetime' 
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
              legend : {enabled:false},
              credits: {enabled:false}
            }
          });


          var chartPanel = new Ext.form.FormPanel({
            id : 'chart_panel_id',
            autoScroll : true,
            width:850,
            //height:410,
            layout:"border",
            items:[{
                region:"west",
                title:"",
                id : "cp_west_id",
                width:200,
                height:400,
                layout:'absolute',
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
                }]
              },{
                id : "cp_center_id", 
                region:"center",
                //layout:'fit',
                autoScroll: true, 
                items:[chart1, chart2]
            }]
          });

          var formPanel = new Ext.form.FormPanel({
            xtype:"panel",
            id:'mytask-tab2',
            //iconCls: 'tabs',
            closeAction: 'hide',
            closable : true,
            title:"统计汇总",
            layout: 'fit',
            items:[chartPanel],
            tbar : [{
                text:'切换',
                hidden  : true,
                handler : function() {
                  new Ajax.Request("/desktop/get_last_wd",{ 
                    method: "POST",
                      onComplete: function(request) {
                        var chart2 = Ext.getCmp('hc-chart1');
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
               }]
          });

          tabPanel.add(formPanel);
          //tabPanel.doLayout();
          tabPanel.setActiveTab(formPanel);


        } else {
          formPanel = Ext.getCmp('mytask-tab2');
          tabPanel.setActiveTab(formPanel);
        }
        // end of chart 
        var pars = {}
        new Ajax.Request("/desktop/get_my_chart",{ 
            method: "POST",
            parameters : pars,
            onComplete: function(request) {
              //alert ('get_xmdk_list called!');
              //Ext.getCmp('cp_center_id').el.dom.innerHTML = request.responseText;
            }  
        });
        
        
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
    case 51 : //巡查系统考核表
    {
      var tabPanel = Ext.getCmp("mytask-tab");
      if (Ext.getCmp('mytask-tab50') == undefined) {
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
      plan_store.baseParams.xcry = currentUser.username;

      var sm = new Ext.grid.CheckboxSelectionModel();
      var planGrid = new Ext.grid.GridPanel({
          id: 'my_plan_grid_id',
          store: plan_store,
          columns: [           
            { header : 'id',    width : 75, sortable : true, dataIndex: 'id', hidden:true},            
            { header : '巡查主体',  width : 200, sortable : true, dataIndex: 'xczt'},
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
          tbar:[{
              text : '导出报表',
              iconCls : 'add',
              //hidden : true,
              handler : function(){
                window.open('images/khb.xls','','height=500,width=800,top=150, left=100,scrollbars=yes,status=yes');
              } 
          }]
        });

        plan_store.load();
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
    case 52 : //执法监察动态巡查违法用地统计表
    {
      var tabPanel = Ext.getCmp("mytask-tab");
      if (Ext.getCmp('mytask-tab51') == undefined) {
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
            { header : '巡查主体',  width : 200, sortable : true, dataIndex: 'xczt'},
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
          tbar:[{
              text : '导出报表',
              iconCls : 'add',
              //hidden : true,
              handler : function(){
                window.open('images/wfyd.xls','','height=500,width=800,top=150, left=100,scrollbars=yes,status=yes');
              } 
          }]
        });

        plan_store.load();
        var formPanel = new Ext.form.FormPanel({
            xtype:"panel",
            id:'mytask-tab51',
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
    case 53 : //执法监察动态巡查原始记录表
    {
      var tabPanel = Ext.getCmp("mytask-tab");
      if (Ext.getCmp('mytask-tab52') == undefined) {
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
          tbar:[{
              text : '导出报表',
              iconCls : 'add',
              //hidden : true,
              handler : function(){
                window.open('images/ysjl.xls','','height=500,width=800,top=150, left=100,scrollbars=yes,status=yes');
              } 
          }]
        });


        
  
        plan_store.load();
        var formPanel = new Ext.form.FormPanel({
            xtype:"panel",
            id:'mytask-tab52',
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
    break;    default:
    {
      alert("正在建设中。。。"+id);
    }
  }
};

