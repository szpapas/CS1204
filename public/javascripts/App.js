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
      new MyDesktop.SatCheck(),
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
                  { name: '状态监视', iconCls: 'satcheck-shortcut',   module: 'satcheck' },
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
                text:'软件更新',
                iconCls:'settings',
                scope:this,
                handler:function(){
                   window.location = "/update/jWatch.1019.ipa";
                }             
            },{
                text:'使用帮助',
                iconCls:'settings',
                scope:this,
                handler:function(){
                   window.location = "/update/xc_help.doc";
                }             
            },{  
              text:'修改密码',
              iconCls:'key',
              scope:this,
              handler:function(){
                
                 var passPanel = new Ext.form.FormPanel({
                   id : 'password_panel_id',
                   autoScroll : true,
                   width:320,
                   height:150,
                   layout:'absolute',
                   items: [{ 
                       xtype: 'label',
                       text: '请输入新密码：',
                       x: 30,
                       y: 30
                     },{
                       xtype: 'textfield',
                       x: 130,
                       y: 30,
                       width: 150,
                       name: 'password',
                       inputType : 'password'
                     },{
                       xtype: 'label',
                       text: '请再次输入密码：',
                       x: 30,
                       y: 70
                     },{
                       xtype: 'textfield',
                       x: 130,
                       y: 70,
                       width: 150,
                       name: 'password_confirmation',
                       inputType : 'password'
                   }]
                 });

                 var passwdWin = new Ext.Window({
                   id : 'change_password_win',
                   iconCls : 'key',
                   title: '修改密码',
                   floating: true,
                   shadow: true,
                   draggable: true,
                   closable: true,
                   modal: true,
                   width: 330,
                   height: 200,
                   layout: 'fit',
                   plain: true,
                   items: passPanel,
                   buttons: [{
                     text: '确定',
                     handler: function() {
                       var myForm = Ext.getCmp('password_panel_id').getForm();
                       pars = myForm.getFieldValues();

                       new Ajax.Request("/desktop/change_password", { 
                         method: "POST",
                         parameters: pars,
                         onComplete:  function(request) {
                           if (request.responseText == 'Success') {
                             msg('成功', '密码修改成功.');
                             passwdWin.close();
                           } else {
                             msg('失败', '密码修改失败.');
                           }
                         }
                       });
                     }
                   }]

                 });
                 
                 passwdWin.show();
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

