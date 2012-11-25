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
         
         //var mTaskPanel = 
         
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
              title:"统计报表",
              layout: 'fit',
              items:[{
                  xtype:"tabpanel",
                  activeTab:0,
                  bodyStyle: 'padding: 5px;',
                  items:[{
                      xtype:"panel",
                      title:"周报月报",
                      layout: 'fit',
                    },{
                      xtype:"panel",
                      title:"动态查询",
                      layout: 'fit'
                    }]
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
                    html: 'Content'
                },{
                    title: '卫片检查',
                    iconCls : 'saticon', 
                    id: 'panel2',
                    html: 'Content'
                },{
                    title: '照片管理',
                    iconCls : 'camera', 
                    id: 'panel3',
                    html: 'Content'
                },{
                    title: '巡查点',
                    iconCls: 'pin',
                    id: 'panel4',
                    html: 'Content'
                }]
            }]
          });
      }
      win.show();
      return win;
  }
});

