/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

// Sample desktop configuration

MyDesktop = new Ext.app.App({
	init :function(){
		Ext.QuickTips.init();

		new Ajax.Request("/desktop/get_user", { 
      method: "POST",
      onComplete:  function(request) {
        currentUser = eval("("+request.responseText+")");
        Ext.getCmp('start_memu_id').setTitle(currentUser.username);
      }
    });
		
	},

	getModules : function(){
		return [
			new MyDesktop.TaskMan(),
      new MyDesktop.SystemStatus(),
      new MyDesktop.ReportMan(),
      new MyDesktop.SystemMan(),
      new MyDesktop.AccordionWindow()
		];
	},

  getDesktopConfig: function () {
      //var me = this, ret = me.callParent();

      return Ext.apply(ret, {
          //cls: 'ux-desktop-black',

          contextMenuItems: [
              { text: '修改设置', handler: me.onSettings, scope: me }
          ],

          shortcuts: Ext.create('Ext.data.Store', {
              model: 'Ext.ux.desktop.ShortcutModel',
              data: [
                  { name: '任务管理', iconCls: 'taskman-shortcut',     module: 'taskman' },
                  { name: '状态监视', iconCls: 'cpu-shortcut',   module: 'systemstatus' },
                  { name: '统计报表', iconCls: 'reportman-shortcut',   module: 'reportman' },
                  { name: '系统管理', iconCls: 'systemman-shortcut',   module: 'systemman' }
              ]
          }),
          
          wallpaper: 'wallpapers/Blue-Sencha.jpg',
          wallpaperStretch: false
      });
  },

  // config for the start menu
	getStartConfig : function(){
			return {
					title: currentUser.username,
          iconCls: 'user',
          id : 'start_memu_id',
					toolItems: [{
							text:'修改密码',
							iconCls:'settings',
							scope:this,
							handler:function(){
								 window.location = "/change_password";
							}							
					},'-',{
							text:'退出',
							iconCls:'logout',
							scope:this,
							handler:function(){
								 Ext.Msg.confirm('退出', '确定要退出登录?', function(btn){
                   if (btn == 'yes') {
                      window.location = "/sign_out";         
                   }
                 });
							}
							
					}]
			};
	},
  
  getTaskbarConfig: function () {
      //var ret = this.callParent();

      return Ext.apply(ret, {
          quickStart: [
              { name: '亲朋好友', iconCls: 'accordion', module: 'acc-win' },
              { name: '任务管理', iconCls: 'taskman', module: 'taskman' }
          ],
          trayItems: [
              { xtype: 'trayclock', flex: 1 }
          ]
      });
  }
  
});

