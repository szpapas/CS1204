MyDesktop.ReportMan = Ext.extend(Ext.app.Module, {

	id:'reportman',

	init : function(){
		this.launcher = {
			text: '统计报表',
			iconCls:'reportman',
			handler : this.createWindow,
			scope: this
		}
	},
	
  createWindow : function(){
      var desktop = this.app.getDesktop();
      var win = desktop.getWindow('reportman');
      if(!win){
        
        win = desktop.createWindow({
          id: 'reportman',
          title:'统计报表',
          width:800,
          height:550,
          maximized:true,
          x : 100,
          y : 30,
          iconCls: 'reportman',
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
              title:'统计',
              width:200,
              split:true,
              collapsible:true,
              titleCollapse:true,
              layout: 'accordion',                
              items:[{
                  title: '执法检察统计',
                    iconCls : 'taskman',
                    id: 'rp-panel1',
                    items :[{
                      layout : 'fit',
                      xtype:'panel',
                      width:200,
                      height:200,
                      border:false,
                      items: [{
                        border:false,
                        cls:'link-panel',
                        links:[
						{
                          text:'统计汇总',
                          id:"mytask_51",
                          icon:'chart_bar16.png',
                          action:"myTask(51)"
                        },{
                          text:'巡查系统考核表',
                          id:"mytask_51",
                          icon:'date_task16.png',
                          action:"myTask(54)"
                        },{
                          text:'违法用地统计',
                          icon:'chart_bar16.png',
                          id:"mytask_52",
                          action:"myTask(55)"
                        },{
                          text:'动态巡查原始记录统计',
                          icon:'calendar16.png',
                          id:"mytask_53",
                          action:"myTask(56)"
                      }],
                      layout:'fit', 
                      tpl:new Ext.XTemplate('<tpl for="links"><div id="{id}"><a class="examplelink" onclick="{action}" ><span><img src=/images/{icon}></img</span>&nbsp;&nbsp;{text}</a></div></tpl>'),  //
                      afterRender:function() {
                          MyDesktop.LinksPanel.superclass.afterRender.apply(this, arguments);
                          this.tpl.overwrite(this.body, {links:this.links});
                      } 
                    }]
                  }]
                },{
                  title: '按分类统计',
                  iconCls : 'saticon', 
                  id: 'rp-panel2',
                  items: []
              }]
          }]
        });
        
      };
      
      win.show();
      return win;


/*        
        var addReport = function (gsm) {

          var week_data = [
          	['1','第一周'],
            ['2','第二周'],
            ['3','第三周'],
            ['4','第四周']
          ];

          var week_store = new Ext.data.SimpleStore({
          	fields: ['value', 'text'],
          	data : week_data
          });
          
          var month_data = [
          	['1','一月'],
            ['2','二月'],
            ['3','三月'],
            ['4','四月'],
            ['5','五月'],
            ['6','六月'],
            ['7','七月'],
            ['8','八月'],
            ['9','九月'],
            ['10','十月'],
            ['11','十一月'],
            ['12','十二月']
          ];

          var month_store = new Ext.data.SimpleStore({
          	fields: ['value', 'text'],
          	data : month_data
          });

          var season_data = [
          	['1','第一季'],
            ['2','第二季'],
            ['3','第三季'],
            ['4','第四季']
          ];

          var season_store = new Ext.data.SimpleStore({
          	fields: ['value', 'text'],
          	data : season_data
          });
          
          
          var lb_data = [
          	['1','周报'],
            ['2','月报'],
            ['3','季报'],
            ['4','年报']
          ];

          var lb_store = new Ext.data.SimpleStore({
          	fields: ['value', 'text'],
          	data : lb_data
          });

          var rpPanel = new Ext.form.FormPanel({
            id : 'rp_panel_id',
            autoScroll : true,
            width:500,
            height:500,
            layout:'absolute',
            items: [
                { xtype: 'textfield', name : 'id', hidden: true },
                { xtype: 'label',     x: 10, y: 10, text: '年度'},
                { xtype: 'combo',     x: 70, y: 10, width: 200, name : 'nd', store:nd_store, emptyText:'请选择',mode: 'local', valueField:'text', displayField:'text',triggerAction:'all'},
                { xtype: 'label',     x: 10, y: 40, text: '类别'},
                { xtype: 'combo',     x: 70, y: 40, width: 200, name : 'lb', store:lb_store, emptyText:'请选择',mode: 'local', valueField:'text', displayField:'text', triggerAction:'all',listeners:{
                  select:function(combo, record, index) {
                    //var muForm =Ext.getCmp('mulu_panel_id').getForm();
                    //muForm.findField('qzh').setValue(record[0].data.id);
                    //Ext.Msg.alert('Error','Mel Gibson movies not allowed');
                    if (record.data.text != '周报'){
                      Ext.getCmp('xh_lid').setVisible(false);
                      Ext.getCmp('xh_id').setVisible(false);
                    } else {
                      Ext.getCmp('xh_lid').setVisible(true);
                      Ext.getCmp('xh_id').setVisible(true);
                    };
                    
                    if (record.data.text == '月报'){
                      Ext.getCmp('yf_lid').setText('第几月');
                      Ext.getCmp('yf_id').store=month_store;
                    } else if (record.data.text == '季报') {
                      Ext.getCmp('yf_lid').setText('第几季');
                      Ext.getCmp('yf_id').store=season_store;
                    };
                    
                  }
                }},
                { xtype: 'label',  id: 'yf_lid',   x: 10, y: 70, text: '月份'},
                { xtype: 'combo',  id: 'yf_id',    x: 70, y: 70, width: 200, name : 'yf', store:month_store, emptyText:'请选择',mode: 'local', valueField:'text', displayField:'text',triggerAction:'all'},
                { xtype: 'label',  id: 'xh_lid',   x: 10, y: 100, text: '第几周'},
                { xtype: 'combo',  id: 'xh_id',    x: 70, y: 100, width: 200, name : 'xh', store:week_store, emptyText:'请选择',mode: 'local', valueField:'text', displayField:'text',triggerAction:'all'},
                
                { xtype: 'label',     x: 10, y: 170, text: '报告内容'},
                { xtype: 'textarea',  x: 70, y: 170, width: 400, name : 'bgnr', height:230},
                { xtype: 'label',     x: 10, y: 410, text: '分局'},
                { xtype: 'combo',     x: 70, y: 410, width: 200, name : 'tbdw', store:xzqmc_store, emptyText:'请选择',mode: 'local', valueField:'text', displayField:'text',triggerAction:'all'}
            ]
          });

          var rp_win = Ext.getCmp('add_rp_win');

          if (rp_win == undefined) {
            rp_win = new Ext.Window({
              id : 'add_rp_win',
              iconCls : 'add',
              title: '新增报表',
              floating: true,
              shadow: true,
              draggable: true,
              closable: true,
              modal: false,
              width: 500,
              height: 550,
              x: 400,
              y: 30, 
              layout: 'fit',
              plain: true,
              items:rpPanel,
              buttons: [{
                text: '确定',
                handler: function() {
                  var myForm = Ext.getCmp('rp_panel_id').getForm();
                  pars = myForm.getFieldValues();
                  new Ajax.Request("/desktop/add_report", { 
                    method: "POST",
                    parameters: pars,
                    onComplete:  function(request) {
                      if (request.responseText == 'Success') {
                        rp_win.close();
                        rp_store.load();
                      } else {
                        //msg('失败', '新增任务失败!');
                      }
                    }
                  });
                }
              }]
            });
            rp_win.show();
          };

          if (gsm == undefined) {
            Ext.getCmp('add_rp_win').setTitle('新增报表');
          } else {
            Ext.getCmp('add_rp_win').setTitle('修改报表');
            Ext.getCmp('add_rp_win').setIconClass('edit');
            var myForm = Ext.getCmp('rp_panel_id').getForm();
            myForm.loadRecord(gsm.selections.items[0]);
          };
        };
          
        var  rp_store = new Ext.data.Store({
          proxy: new Ext.data.HttpProxy({
            url: '/desktop/get_report'
          }),

          reader: new Ext.data.JsonReader({
            totalProperty: 'results', 
            root: 'rows',             
            fields: [
              {name: 'id',   type: 'integer'},
              {name: 'lb',   type: 'string'},
              {name: 'nd',   type: 'string'},
              {name: 'yf',   type: 'string'},
              {name: 'xh',   type: 'string'},
              {name: 'tbr',  type: 'string'},
              {name: 'tbdw', type: 'string'},
              {name: 'bgnr', type: 'string'},
              {name: 'commit_at',  type: 'date', dateFormat: 'Y-m-d H:i:s'},
              {name: 'zt',  type: 'string'}
            ]    
          }),
          baseParams :  {search:''},
          sortInfo:{field: 'id', direction: "ASC"}
        });

        // manually load local data
        rp_store.baseParams.zt = "全部";
        rp_store.baseParams.limit = "20";
        rp_store.load();

        // create the Grid
        var sm = new Ext.grid.CheckboxSelectionModel();

        var reportPanel = new Ext.grid.GridPanel({
           store: rp_store,
           id : 'rp_grid_id',
           height : 500,
           columns: [
             sm,
             { header : 'id',    width : 75, sortable : true, dataIndex: 'id', hidden:true},
             { header : '类别',    width : 75, sortable : true, dataIndex: 'lb'},
             { header : '年度',    width : 75, sortable : true, dataIndex: 'nd'},
             { header : '月份',    width : 75, sortable : true, dataIndex: 'yf'},
             { header : '顺序号',   width : 75, sortable : true, dataIndex: 'xh'},
             { header : '填报人',   width : 75, sortable : true, dataIndex: 'tbr'},
             { header : '填报单位',  width : 75, sortable : true, dataIndex: 'tbdw'},
             { header : '提交日期',  width : 75, sortable : true, dataIndex: 'commit_at', renderer: Ext.util.Format.dateRenderer('Y-m-d')},
             { header : '状态',    width : 75, sortable : true, dataIndex: 'zt'}
           ],
           sm:sm,  
           columnLines: true,
           layout:'fit',
           viewConfig: {
             stripeRows:true,
           },
           tbar: [{
               text : '新增',
               iconCls :'add',
               handler : function() {
                 addReport();
               }
             },{
               text : '删除',
               iconCls :'delete',
               handler : function() {
                 items = Ext.getCmp('rp_grid_id').getSelectionModel().selections.items;
                 id_str = '';
                 for (var i=0; i < items.length; i ++) {
                   if (i==0) {
                     id_str = id_str+items[i].data.id 
                   } else {
                     id_str = id_str + ',' +items[i].data.id 
                   }
                 }
                 pars = {id:id_str};
                 new Ajax.Request("/desktop/delete_selected_report", { 
                   method: "POST",
                   parameters: pars,
                   onComplete:  function(request) {
                     rp_store.load();
                   }
                 });
               }
             },{
               text : '修改',
               iconCls :'edit',
               handler : function() {
                 var gsm =Ext.getCmp('rp_grid_id').getSelectionModel();
                 addReport(gsm);
               }               
     
             },{
               text : '提交',
               iconCls :'save',
               handler : function() {
                 items = Ext.getCmp('rp_grid_id').getSelectionModel().selections.items;
                 id_str = '';
                 for (var i=0; i < items.length; i ++) {
                   if (i==0) {
                     id_str = id_str+items[i].data.id 
                   } else {
                     id_str = id_str + ',' +items[i].data.id 
                   }
                 }
                 pars = {id:id_str};
                 new Ajax.Request("/desktop/commit_selected_report", { 
                   method: "POST",
                   parameters: pars,
                   onComplete:  function(request) {
                     rp_store.load();
                   }
                 });
               }               
           }],
           bbar:['->',
             new Ext.PagingToolbar({
               store: rp_store,
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

        var rpTree = new Ext.tree.TreePanel({
           id:'rp-tree',
           rootVisible:false,
           lines:false,
           autoScroll:true,
           title:'按部门',
           tools:[{
               id:'refresh',
               on:{
                   click: function(){
                       var tree = Ext.getCmp('rp-tree');
                       if (tree.title == '按时间') {
                         tree.setTitle('按部门');
                         rp_store.baseParams.lb = "bm";
                         rp_store.baseParams.limit = "20";
                       }else{
                         tree.setTitle('按时间');
                         rp_store.baseParams.lb = "time";
                         rp_store.baseParams.limit = "20";
                       };
               
                       tree.body.mask('Loading', 'x-mask-loading');
                       tree.root.reload();
                       //tree.root.collapse(true, false);
                       setTimeout(function(){ // mimic a server call
                           tree.body.unmask();
                           //tree.root.expand(true, true);
                       }, 1000);
                   }
               }
           }],
           loader: new Ext.tree.TreeLoader({
             dataUrl: '/desktop/get_rptree',
             baseAttrs: { uiProvider: Ext.ux.TreeCheckNodeUI } 
           }),
           root: {
             nodeType: 'async',
             text: '联系人',
             draggable:false,
             id:'root'
           }
        });

        rpTree.on("click", function(node,e) {
         e.stopEvent();
         node.select();
         if (node.isLeaf()) {
           rp_store.baseParams.filter = node.id;
           rp_store.load();
         } else {
           //var ss = node.id.split("|");
           //Ext.getCmp('xcqy_filter_id').setValue(node.id);
           rp_store.baseParams.filter = node.id;
           rp_store.load();
         }
        }, rpTree);
        
         //动态查询怕哪了
         
          var  dt_store = new Ext.data.Store({
              proxy: new Ext.data.HttpProxy({
                  url: '/desktop/get_dt_report'
              }),
              reader: new Ext.data.JsonReader({
                totalProperty: 'results', 
                root: 'rows',             
                fields: [
                  {name: 'xcqy',   type: 'string'},
                  {name: 'xclc',   type: 'integer'},
                  {name: 'xcys',   type: 'integer'},
                  {name: 'xmdkc',  type: 'integer'},
                  {name: 'photoc', type: 'integer'}
                ]    
              }),
              baseParams :  {tbdw:'',qrq:'', zrq:''},
              sortInfo:{field: 'xcqy', direction: "ASC"}
          });

          // manually load local data
          dt_store.baseParams.tbdw = "";
          dt_store.baseParams.qrq  = "";
          dt_store.baseParams.zrq  = "";
          dt_store.load();
          
         var dtReportPanel = new Ext.grid.GridPanel({
           store: dt_store,
           id : 'dt_report_id',
           height: 500,
           columns: [
             sm,
             { header : '巡查区域',    width : 75, sortable : true, dataIndex: 'xcqy'},
             { header : '巡查里程',    width : 75, sortable : true, dataIndex: 'xclc'},
             { header : '巡查用时',    width : 75, sortable : true, dataIndex: 'xcys'},
             { header : '巡查点数',   width : 75, sortable : true, dataIndex: 'xmdkc'},
             { header : '照片数',   width : 75, sortable : true, dataIndex: 'photoc'}
           ],
           sm:sm,  
           columnLines: true,
           layout:'fit',
           viewConfig: {
             stripeRows:true,
           },
           tbar: ['<span style=" font-size:12px;font-weight:600;color:#3366FF;">单位选择</span>:&nbsp;&nbsp;',
           { xtype: 'combo', width: 100, id: 'tbdw-id', name : 'tbdw', store:xzqmc_store, emptyText:'请选择',mode: 'local', valueField:'text', displayField:'text',triggerAction:'all'}
           ,'<span style=" font-size:12px;font-weight:600;color:#3366FF;">开始时间</span>:&nbsp;&nbsp;',
             {
               name:  'qrq',
               id : 'qrq-id',
               xtype: "datefield",
               format:"Y-m-d" 
             },'<span style=" font-size:12px;font-weight:600;color:#3366FF;">结束时间</span>:&nbsp;&nbsp;',{
               name: 'zrq',
               id : 'zrq-id',
               xtype:"datefield",
               format:"Y-m-d" 
             },{
               text : '查询',
               iconCls :'search',
               handler : function() {
                 var qrq = Ext.getCmp('qrq-id');
                 var zrq = Ext.getCmp('zrq-id');
                 var tbdw = Ext.getCmp('tbdw-id');
                 
                 dt_store.baseParams.tbdw = tbdw.getRawValue();
                 dt_store.baseParams.qrq  = qrq.getValue();
                 dt_store.baseParams.zrq  = zrq.getValue();
                 dt_store.load();
                 
               }
             }]
         });  
          
*/


  }
});

