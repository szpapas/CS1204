  
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
                    id: 'mt-panel1',
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
                    id: 'mt-panel2',
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
                    id: 'mt-panel3',
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
                    title: '巡查点管理',
                    iconCls: 'pin',
                    id: 'mt-panel4',
                    items: [{
                        // configurables
                        border:false,
                        cls:'link-panel',
                        links:[{
                             text:'我的巡查点',
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

