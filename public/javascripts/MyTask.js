  
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
         
         /*
         var formPanel = new Ext.form.FormPanel({bla bla bla });
         var tabPanel = ....  ;
         tabPanel.add(formPanel);
         tabPanel.doLayout();
         */
         
         win = desktop.createWindow({
            id: 'mytask',
            title:'我的任务',
            width:800,
            height:550,
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
                title:"-",
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
                          },{
                               text:'最近任务',
                               icon:'calendar16.png',
                               id:"mytask_03",
                               action:"myTask(3)"
                          }],
                          layout:'fit', 
                          tpl:new Ext.XTemplate('<tpl for="links"><div id="{link_id}"><a class="examplelink" onclick="{action}" ><span><img src=/images/{icon}></img</span>&nbsp;&nbsp;{text}</a></div></tpl>'),  //
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
        var formPanel = new Ext.form.FormPanel({
            xtype:"panel",
            id:'mytask-tab1',
            iconCls: 'date_task',
            closable : true,
            title:"任务管理",
            layout: 'fit',
            items:[]
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
        var formPanel = new Ext.form.FormPanel({
            xtype:"panel",
            id:'mytask-tab2',
            iconCls: 'chart_bar',
            closable : true,
            title:"统计汇总",
            layout: 'fit',
            items:[]
        });

        tabPanel.add(formPanel);
        tabPanel.doLayout();
        
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

