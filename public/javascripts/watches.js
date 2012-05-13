var currentUser={};
var tree_id=0;
var user_id="";

var base_url = "http://218.4.152.78:8080/geoserver/wms";
var host_url = "http://218.4.152.78:8080/geoserver/cs1204/wms";

new Ajax.Request("/desktop/get_userid", { 
  method: "POST",
  onComplete:  function(request) {
    user_id=request.responseText;
  }
});

var msg = function(title, msg){
    Ext.Msg.show({
        title: title,
        msg: msg,
        minWidth: 300,
        modal: true,
        icon: Ext.Msg.WARNING,
        buttons: Ext.Msg.OK
    });
};

//Simple Store

var rwzt_data = [
  ['0','全部'],
  ['1','计划'],
  ['2','执行'],
  ['3','完成'],
  ['4','归档']
];

var rwzt_store = new Ext.data.SimpleStore({
  fields: ['value', 'text'],
  data : rwzt_data
});

var xcqy_data = [
  ['0' ,'全部'],
  ['9' ,'尚湖镇'],
  ['10','辛庄镇'],
  ['5' ,'古里镇'],
  ['6' ,'沙家浜镇'],
  ['1' ,'虞山镇'],
  ['11','虞山林场'],
  ['3' ,'海虞镇'],
  ['4' ,'碧溪镇'],
  ['2' ,'梅李镇'],
  ['7' ,'支塘镇'],
  ['8' ,'董浜镇'],
  ['12','沿江分局'],
  ['13', '东南分局']
];


var xcqy_store = new Ext.data.SimpleStore({
  fields: ['value', 'text'],
  data : xcqy_data
});

var xzqmc_data = [
  ['0' ,'全部'],
  ['9' ,'尚湖镇'],
  ['10','辛庄镇'],
  ['5' ,'古里镇'],
  ['6' ,'沙家浜镇'],
  ['1' ,'虞山镇'],
  ['11','虞山林场'],
  ['3' ,'海虞镇'],
  ['4' ,'碧溪镇'],
  ['2' ,'梅李镇'],
  ['7' ,'支塘镇'],
  ['8' ,'董浜镇'],
  ['12','沿江分局'],
  ['13', '东南分局']
];


var xzqmc_store = new Ext.data.SimpleStore({
  fields: ['value', 'text'],
  data : xzqmc_data
});


var xcfs_data = [
  ['1' ,'综合巡查'],
  ['2' ,'定点巡查']
];


var xcfs_store = new Ext.data.SimpleStore({
  fields: ['value', 'text'],
  data : xcfs_data
});


var nd_data = [
  ['2011' ,'2011年'],
  ['2012' ,'2012年'],
  ['2013' ,'2013年'],
  ['2014' ,'2014年'],
  ['2015' ,'2015年'],
  ['2016' ,'2016年'],
  ['2017' ,'2017年'],
  ['2018' ,'2018年']
];


var nd_store = new Ext.data.SimpleStore({
  fields: ['value', 'text'],
  data : nd_data
});


var week_data = [
  ['1' ,'第1周'],
  ['2' ,'第2周'],
  ['3' ,'第3周'],
  ['4' ,'第4周'],
  ['5' ,'第5周'],
  ['6' ,'第6周'],
  ['7' ,'第7周'],
  ['8' ,'第8周'],
  ['9' ,'第9周'],
  ['10' ,'第10周'],
  ['11' ,'第11周'],
  ['12' ,'第12周'],
  ['13' ,'第13周'],
  ['14' ,'第14周'],
  ['15' ,'第15周'],
  ['16' ,'第16周'],
  ['17' ,'第17周'],
  ['18' ,'第18周'],
  ['19' ,'第19周'],
  ['20' ,'第20周'],
  ['21' ,'第21周'],
  ['22' ,'第22周'],
  ['23' ,'第23周'],
  ['24' ,'第24周'],
  ['25' ,'第25周'],
  ['26' ,'第26周'],
  ['27' ,'第27周'],
  ['28' ,'第28周'],
  ['29' ,'第29周'],
  ['30' ,'第30周'],
  ['31' ,'第31周'],
  ['32' ,'第32周'],
  ['33' ,'第33周'],
  ['34' ,'第34周'],
  ['35' ,'第35周'],
  ['36' ,'第36周'],
  ['37' ,'第37周'],
  ['38' ,'第38周'],
  ['39' ,'第39周'],
  ['40' ,'第40周'],
  ['41' ,'第41周'],
  ['42' ,'第42周'],
  ['43' ,'第43周'],
  ['44' ,'第44周'],
  ['45' ,'第45周'],
  ['46' ,'第46周'],
  ['47' ,'第47周'],
  ['48' ,'第48周'],
  ['49' ,'第49周'],
  ['50' ,'第50周'],
  ['51' ,'第51周'],
  ['52' ,'第52周']
];


var week_store = new Ext.data.SimpleStore({
  fields: ['value', 'text'],
  data : week_data
});

var pd_data = [
  ['1','1周1次'],
  ['2','2周1次'],
  ['3','1月1次'],
];


var pd_store = new Ext.data.SimpleStore({
  fields: ['value', 'text'],
  data : pd_data
});

//======
var format = "image/png";

var SHADOW_Z_INDEX = 10;
var MARKER_Z_INDEX = 11;

var s_option0 =  { opacity: 1,    visibility: false, isBaseLayer: true};
var s_option1 =  { opacity: 1,    visibility: false, isBaseLayer: false};
var s_option2 =  { opacity: 1,    visibility: true, isBaseLayer: false};

var s_option3t =   { opacity: 0.3,  visibility: true, isBaseLayer: false};
var s_option3f =   { opacity: 0.3,  visibility: true, isBaseLayer: false};
var s_option5t =   { opacity: 0.5,  visibility: true, isBaseLayer: false};
var s_option5f =   { opacity: 0.5,  visibility: false, isBaseLayer: false};
var s_option5 =  { opacity: 0.5,  visibility: false,  isBaseLayer: false, displayInLayerSwitcher: false} ;
var s_option6 =  { opacity: 0.6,  visibility: true,  isBaseLayer: false};
var s_option8 =  { opacity: 0.8,  visibility: true,  isBaseLayer: false};
var s_option8f =   { opacity: 0.8,  visibility: false,  isBaseLayer: false};


var styles = new OpenLayers.StyleMap({
     "default": new OpenLayers.Style(null, {
         rules: [
             new OpenLayers.Rule({
                 symbolizer: {
                     "Point": {
                         pointRadius: 5,
                         graphicName: "square",
                         fillColor: "white",
                         fillOpacity: 0.25,
                         strokeWidth: 1,
                         strokeOpacity: 1,
                         strokeColor: "#333333"
                     },
                     "Line": {
                         strokeWidth: 3,
                         strokeOpacity: 1,
                         //strokeColor: "#666666"
                        strokeColor: "#FF0000"
                     }
                 }
             })
         ]
     }),
     "select": new OpenLayers.Style({
         strokeColor: "#00ccff",
         strokeWidth: 4
     }),
     "temporary": new OpenLayers.Style(null, {
         rules: [
             new OpenLayers.Rule({
                 symbolizer: {
                     "Point": {
                         pointRadius: 5,
                         graphicName: "square",
                         fillColor: "white",
                         fillOpacity: 0.25,
                         strokeWidth: 1,
                         strokeOpacity: 1,
                         strokeColor: "#333333"
                     },
                     "Line": {
                         strokeWidth: 3,
                         strokeOpacity: 1,
                         strokeColor: "#00ccff"
                     }
                 }
             })
         ]
     })
});

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
                text:'软件更新',
                iconCls:'settings',
                scope:this,
                handler:function(){
                   window.location = "/update/iphone_new.zip";
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

MyDesktop.AccordionWindow = Ext.extend(Ext.app.Module, {
    id:'acc-win',
    init : function(){
        this.launcher = {
            text: '联系人',
            iconCls:'accordion',
            handler : this.createWindow,
            scope: this
        }
    },

    createWindow : function(){
      
      /*
      if (currentUser.prev_code[18] != 't') {
          //Ext.Msg.alert('Message','权限不够. 请与管理员联系后再试！');
          msg('Message','权限不够. 请与管理员联系后再试！');
          return;
      }
      */
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('acc-win');
        if(!win){
            win = desktop.createWindow({
                id: 'acc-win',
                title: '联系人',
                width:250,
                height:400,
                x : 100,
                y : 150,
                iconCls: 'accordion',
                shim:false,
                animCollapse:false,
                constrainHeader:true,

                tbar:[{
                    tooltip:'增加',
                    iconCls:'user-add'
                },' ',{
                    tooltip:'删除',
                    iconCls:'user-delete'
                },'->',
                new Ext.form.TextField({
                  id : 'fiter-user',
                  width:100,
                  enableKeyEvents: true
                }),' ', {
                  text: '查找',
                  iconCls :'search',
                  handler : function(){
                    var tree = Ext.getCmp('yg-tree');
                    tree.body.mask('Loading', 'x-mask-loading');
                    tree.loader.baseParams = { yg_id:currentUser.id, filter: Ext.getCmp('fiter-user').getValue()},
                    tree.root.reload();
                    tree.root.collapse(true, false);
                    setTimeout(function(){ 
                        tree.body.unmask();
                        tree.root.expand(true, true);
                    }, 1000);                   
                  }
                }],

                layout:'accordion',
                border:false,
                layoutConfig: {
                    animate:false
                },

                items: [
                    new Ext.tree.TreePanel({
                        id:'yg-tree',
                        title: '员工',
                        rootVisible:false,
                        lines:false,
                        autoScroll:true,
                        tools:[{
                            id:'refresh',
                            on:{
                                click: function(){
                                    var tree = Ext.getCmp('yg-tree');
                                    tree.body.mask('Loading', 'x-mask-loading');
                                    tree.root.reload();
                                    tree.root.collapse(true, false);
                                    setTimeout(function(){ // mimic a server call
                                        tree.body.unmask();
                                        tree.root.expand(true, true);
                                    }, 1000);
                                }
                            }
                        }],
                        loader: new Ext.tree.TreeLoader({
                          dataUrl: '/desktop/get_ygtree',
                          baseAttrs: { uiProvider: Ext.ux.TreeCheckNodeUI } 
                        }),
                        root: {
                          nodeType: 'async',
                          text: '联系人',
                          draggable:false,
                          id:'root'
                        }
                    })
                ]
            });
            
            win.on('activate', function(p){
              //p.items.items[2].autoLoad.params = 'id='+currentUser.id;
              //msg('Click','You clicked on "查地图".');
            });
        };

        
        
        var send_message =function() {
          var sms_win = new Ext.Window({
              title: '发送短信',
              floating: true,
              shadow: true,
              draggable: true,
              closable: true,
              resizable: false,
              modal: true,
              width: 330,
              height: 300,
              layout: 'fit',
              plain: true,
              items: [{
                xtype:"form",
                layout: 'absolute',
                id : 'sms_msg_form',
                items: [{
                        xtype: 'label',
                        text: '接收人',
                        x: 20,
                        y: 10
                    },
                    {
                        xtype: 'label',
                        text: '短信内容',
                        x: 10,
                        y: 40
                    },
                    {
                        xtype: 'textfield',
                        x: 70,
                        y: 10,
                        width: 230,
                        name: 'receiver'
                        
                    },
                    {
                        xtype: 'textarea',
                        x: 70,
                        y: 40,
                        width: 230,
                        height: 170,
                        name: 'sms_text',
                        value: "\n/"+currentUser.username
                }],
                buttons:[{
                  text: '发送',
                  handler: function(){
                    var pars = Ext.getCmp("sms_msg_form").getForm().getValues();
                    //pars['sms_text'] = encodeURIComponent(pars['sms_text']);
                    new Ajax.Request("/desktop/send_sms", { 
                      method: "POST",
                      parameters: pars,
                      onComplete:  function(request) {
                        sms_win.close();
                      }
                    });
                  }
                },{
                  text: '取消',
                  handler: function(){
                    sms_win.close();
                  }
                }]
              }]
          });

          var node = Ext.getCmp('acc-win').layout.activeItem.selModel.selNode;
          var ss = node.id.split("|")
          
          Ext.getCmp('sms_msg_form').items.items[2].setValue(ss[2]);
          
          sms_win.on("activate",function(e){
            this.toFront()
          });

          sms_win.show();

        };
        
        var view_detail = function() {
          var detail_win = new Ext.Window({
            title: '详细情况',
            floating: true,
            shadow: true,
            draggable: true,
            closable: true,
            resizable: false,
            modal: true,
            width: 330,
            height: 300,
            layout: 'fit',
            plain: true,
            items: [{
              xtype:"form",
              layout: 'absolute',
              id : 'view_detail_form',
              items: [{
                      xtype: 'label',
                      text: '姓名',
                      x: 20,
                      y: 10
                  },
                  {
                      xtype: 'label',
                      text: '部门',
                      x: 20,
                      y: 40
                  },
                  {
                      xtype: 'label',
                      text: '办公电话',
                      x: 20,
                      y: 70
                  },
                  {
                      xtype: 'label',
                      text: 'iPhone',
                      x: 20,
                      y: 100
                  },
                  {
                      xtype: 'label',
                      text: '邮件',
                      x: 20,
                      y: 130
                  },
                  {
                      xtype: 'textfield',
                      x: 70,
                      y: 10,
                      width: 230,
                  },
                  {
                      xtype: 'textfield',
                      x: 70,
                      y: 40,
                      width: 230,
                  },
                  {
                      xtype: 'textfield',
                      x: 70,
                      y: 70,
                      width: 230,
                  },
                  {
                      xtype: 'textfield',
                      x: 70,
                      y: 100,
                      width: 230,
                  },
                  {
                      xtype: 'textfield',
                      x: 70,
                      y: 130,
                      width: 230,
              }]
            }],         
            buttons:[{
              text: '关闭',
              handler: function(){
                detail_win.close();
              }
            }]
            
          });

          var node = Ext.getCmp('acc-win').layout.activeItem.selModel.selNode;
          var ss = node.id.split("|");  //业务部|王娅红|13862616066
          
          var pars = {name:ss[1]};
          new Ajax.Request("/desktop/get_detail_user", { 
            method: "POST",
            parameters: pars,
            onComplete:  function(request) {
              var user = eval("("+request.responseText+")");
              Ext.getCmp('view_detail_form').items.items[5].setValue(user.username);
              Ext.getCmp('view_detail_form').items.items[6].setValue(user.bm);
              Ext.getCmp('view_detail_form').items.items[7].setValue(user.bgdh);
              Ext.getCmp('view_detail_form').items.items[8].setValue(user.iphone);
              Ext.getCmp('view_detail_form').items.items[9].setValue(user.email);
              detail_win.show();
            }
          });
          
        };


        var view_kh_detail = function() {
            var track_win = new Ext.Window({
                title: '客户信息',
                floating: true,
                shadow: true,
                draggable: true,
                closable: true,
                modal: true,
                width: 518,
                height: 395,
                layout: 'fit',
                plain: true,
                items: [{
                  xtype:"form",
                  id : 'lx_customer_add_form',
                  width: 518,
                  height: 395,
                  padding: 10,
                  layout: 'absolute',
                  items:[{
                      xtype: 'tabpanel',
                      deferredRender: false,
                      activeTab: 0,
                      width: 500,
                      height: 320,
                      items: [
                          {
                              xtype: 'panel',
                              title: '客户信息',
                              layout: 'absolute',
                              width: 536,
                              height: 409,
                              items: [
                                  {
                                      xtype: 'textfield',
                                      hidden : true,
                                      name : 'id'
                                  },
                                  {
                                      xtype: 'label',
                                      text: '客户编号',
                                      x: 20,
                                      y: 10
                                  },
                                  {
                                      xtype: 'label',
                                      text: '联系人',
                                      x: 20,
                                      y: 40
                                  },
                                  {
                                      xtype: 'label',
                                      text: '职位',
                                      x: 20,
                                      y: 70
                                  },
                                  {
                                      xtype: 'label',
                                      text: '行业',
                                      x: 20,
                                      y: 100
                                  },
                                  {
                                      xtype: 'label',
                                      text: '移动电话',
                                      x: 20,
                                      y: 130
                                  },
                                  {
                                      xtype: 'label',
                                      text: 'iPhone',
                                      x: 20,
                                      y: 160
                                  },
                                  {
                                      xtype: 'label',
                                      text: '小灵通',
                                      x: 20,
                                      y: 190
                                  },
                                  {
                                      xtype: 'label',
                                      text: '家庭电话',
                                      x: 20,
                                      y: 220
                                  },
                                  {
                                      xtype: 'label',
                                      text: '其他电话',
                                      x: 20,
                                      y: 250
                                  },
                                  {
                                      xtype: 'label',
                                      text: '客户类别',
                                      x: 260,
                                      y: 10
                                  },
                                  {
                                      xtype: 'label',
                                      text: '电子邮件',
                                      x: 260,
                                      y: 40
                                  },
                                  {
                                      xtype: 'label',
                                      text: '生日',
                                      x: 260,
                                      y: 70
                                  },
                                  {
                                      xtype: 'label',
                                      text: '个人爱好',
                                      x: 260,
                                      y: 100
                                  },
                                  {
                                      xtype: 'label',
                                      text: '子女情况',
                                      x: 260,
                                      y: 130
                                  },
                                  {
                                      xtype: 'label',
                                      text: '家庭地址',
                                      x: 260,
                                      y: 160
                                  },
                                  {
                                      xtype: 'label',
                                      text: '备注',
                                      x: 260,
                                      y: 190
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 80,
                                      y: 10,
                                      width: 150,
                                      name: 'khbh'
                                  },
                                  {
                                      xtype: 'combo',
                                      x: 320,
                                      y: 10,
                                      width: 150,
                                      name: 'khlb',
                                      store: khlb_store,
                                      emptyText:'',
                                      mode: 'remote',
                                      minChars : 2,
                                      valueField:'value',
                                      displayField:'value',
                                      triggerAction:'all'
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 80,
                                      y: 40,
                                      width: 150,
                                      name: 'lxr'
                                  },
                                  {
                                      xtype: 'combo',
                                      x: 80,
                                      y: 70,
                                      width: 150,
                                      name: 'zw',
                                      store: zwbh_store,
                                      emptyText:'',
                                      mode: 'remote',
                                      minChars : 2,
                                      valueField:'value',
                                      displayField:'value',
                                      triggerAction:'all'                 
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 80,
                                      y: 100,
                                      width: 150,
                                      name: 'hy'
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 80,
                                      y: 130,
                                      width: 150,
                                      name: 'mobile'
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 80,
                                      y: 160,
                                      width: 150,
                                      name: 'iphone'
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 80,
                                      y: 190,
                                      width: 150,
                                      name: 'linktone'
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 80,
                                      y: 220,
                                      width: 150,
                                      name: 'jtdh1'
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 80,
                                      y: 250,
                                      width: 150,
                                      name: 'jtdh2'
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 320,
                                      y: 40,
                                      width: 150,
                                      name: 'email'
                                  },
                                  {
                                      xtype: 'datefield',
                                      x: 320,
                                      y: 70,
                                      width: 150,
                                      format: 'Y-m-d',
                                      name: 'birthday'
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 320,
                                      y: 100,
                                      width: 150,
                                      name: 'hobby'
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 320,
                                      y: 130,
                                      width: 150,
                                      name: 'children'
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 320,
                                      y: 160,
                                      width: 150,
                                      name: 'jtdz'
                                  },
                                  {
                                      xtype: 'textarea',
                                      x: 320,
                                      y: 190,
                                      width: 150,
                                      anchor: '',
                                      height: 80,
                                      name: 'bz'
                                  }
                              ]
                          },
                          {
                              xtype: 'panel',
                              title: '公司信息',
                              layout: 'absolute',
                              items: [
                                  {
                                      xtype: 'label',
                                      text: '公司名称',
                                      x: 20,
                                      y: 10
                                  },
                                  {
                                      xtype: 'label',
                                      text: '公司规模',
                                      x: 20,
                                      y: 40
                                  },
                                  {
                                      xtype: 'label',
                                      text: '公司全名',
                                      x: 20,
                                      y: 70
                                  },
                                  {
                                      xtype: 'label',
                                      text: '电话1',
                                      x: 20,
                                      y: 100
                                  },
                                  {
                                      xtype: 'label',
                                      text: '电话2',
                                      x: 20,
                                      y: 130
                                  },
                                  {
                                      xtype: 'label',
                                      text: '传真',
                                      x: 20,
                                      y: 160
                                  },
                                  {
                                      xtype: 'label',
                                      text: '网址',
                                      x: 20,
                                      y: 190
                                  },
                                  {
                                      xtype: 'label',
                                      text: '地址',
                                      x: 20,
                                      y: 220
                                  },
                                  {
                                      xtype: 'label',
                                      text: '邮编',
                                      x: 20,
                                      y: 250
                                  },
                                  {
                                      xtype: 'label',
                                      text: '开户银行',
                                      x: 260,
                                      y: 10
                                  },
                                  {
                                      xtype: 'label',
                                      text: '银行账号',
                                      x: 260,
                                      y: 40
                                  },
                                  {
                                      xtype: 'label',
                                      text: '税务登记号',
                                      x: 260,
                                      y: 70
                                  },
                                  {
                                      xtype: 'label',
                                      text: '所有制类型',
                                      x: 260,
                                      y: 100
                                  },
                                  {
                                      xtype: 'label',
                                      text: '客户级别',
                                      x: 260,
                                      y: 130
                                  },
                                  {
                                      xtype: 'label',
                                      text: '金土地内评',
                                      x: 260,
                                      y: 160
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 80,
                                      y: 10,
                                      width: 150,
                                      name: 'gsmc'
                                  },
                                  {
                                      xtype: 'combo',
                                      x: 80,
                                      y: 40,
                                      width: 150,
                                      name: 'gsgm',
                                      store: gsgm_store,
                                      emptyText:'',
                                      mode: 'remote',
                                      minChars : 2,
                                      valueField:'value',
                                      displayField:'value',
                                      triggerAction:'all'
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 80,
                                      y: 70,
                                      width: 150,
                                      name: 'gsqm'
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 80,
                                      y: 100,
                                      width: 150,
                                      name: 'bgdh1'
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 80,
                                      y: 130,
                                      width: 150,
                                      name: 'bgdh2'
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 80,
                                      y: 160,
                                      width: 150,
                                      name: 'bgcz'
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 80,
                                      y: 190,
                                      width: 150,
                                      name: 'gsweb'
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 80,
                                      y: 220,
                                      width: 150,
                                      name: 'address'
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 80,
                                      y: 250,
                                      width: 150,
                                      name: 'zip'
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 330,
                                      y: 10,
                                      width: 150,
                                      name: 'khyh'
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 330,
                                      y: 40,
                                      width: 150,
                                      name: 'yhzh'
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 330,
                                      y: 70,
                                      width: 150,
                                      name: 'swdjh'
                                  },
                                  {
                                      xtype: 'combo',
                                      x: 330,
                                      y: 100,
                                      width: 150,
                                      name: 'syzlx',
                                      store: syzlx_store,
                                      emptyText:'',
                                      mode: 'remote',
                                      minChars : 2,
                                      valueField:'value',
                                      displayField:'value',
                                      triggerAction:'all'                 
                                  },
                                  {
                                      xtype: 'combo',
                                      x: 330,
                                      y: 130,
                                      width: 150,
                                      name: 'khjb',
                                      store: khjb_store,
                                      emptyText:'',
                                      mode: 'remote',
                                      minChars : 2,
                                      valueField:'value',
                                      displayField:'value',
                                      triggerAction:'all'                 
                                  },
                                  {
                                      xtype: 'textfield',
                                      x: 330,
                                      y: 160,
                                      width: 150,
                                      name: 'jtdnp'
                                  }
                              ]
                          }
                      ]
                  }],
                  buttons:[{
                    text: '保存',
                    handler: function(){
                      var pars = Ext.getCmp("lx_customer_add_form").getForm().getValues();
                      new Ajax.Request("/desktop/update_customer", { 
                        method: "POST",
                        parameters: pars,
                        onComplete:  function(request) {
                          //track_win.close();
                        }
                      });
                    }
                  },{
                    text: '取消',
                    handler: function(){
                      track_win.close();
                    }
                  }]
                }]
            });

            var node = Ext.getCmp('acc-win').layout.activeItem.selModel.selNode;
            var ss = node.id.split("|");  //业务部|王娅红|13862616066

            var pars = {khxx_id:ss[1]};
            new Ajax.Request("/desktop/set_customer", { 
              method: "POST",
              parameters: pars,
              onComplete:  function(request) {
                var users = eval("("+request.responseText+")");
                if (users.size() > 0) {
                  Ext.getCmp("lx_customer_add_form").getForm().setValues(users[0].users);
                } 
              }
            });
            track_win.show();           
          };
        
        var yg_menu = new Ext.menu.Menu({
          id : 'yg_menu',
          items:[{
            text:'发送短信',
            handler: send_message
          },{
            text:'查看详细',
            handler: view_detail
          }]
        });
        
        var yg_tree = Ext.getCmp('yg-tree');
        yg_tree.on("contextmenu", function(node,e) {
          //e.preventDefault();
          e.stopEvent();
          node.select();
          yg_menu.showAt(e.getXY());
        }, yg_tree);
        
        yg_tree.on("click", function(node,e) {
          //e.preventDefault();
          e.stopEvent();
          node.select();
          //yg_menu.showAt(e.getXY());
          if (Ext.getCmp('view_detail_form') != undefined) {
            var node = Ext.getCmp('acc-win').layout.activeItem.selModel.selNode;
            var ss = node.id.split("|");  //业务部|王娅红|13862616066

            var pars = {name:ss[1]};
            new Ajax.Request("/desktop/get_detail_user", { 
              method: "POST",
              parameters: pars,
              onComplete:  function(request) {
                var user = eval("("+request.responseText+")");
                Ext.getCmp('view_detail_form').items.items[5].setValue(user.username);
                Ext.getCmp('view_detail_form').items.items[6].setValue(user.bm);
                Ext.getCmp('view_detail_form').items.items[7].setValue(user.bgdh);
                Ext.getCmp('view_detail_form').items.items[8].setValue(user.iphone);
                Ext.getCmp('view_detail_form').items.items[9].setValue(user.email);

              }
            });
          }
        }, yg_tree);


        yg_tree.on("dblClick", function(node,e) {
          //e.preventDefault();
          e.stopEvent();
          node.select();
          
          if (node.leaf) {
             if (Ext.getCmp('view_detail_form') == undefined) {
               view_detail();
             }
          }
        }, yg_tree);
        
        win.show();
    }
});

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
          var myData = [
              ['3m Co',                               71.72, 0.02,  0.03,  '9/1 12:00am'],
              ['Alcoa Inc',                           29.01, 0.42,  1.47,  '9/1 12:00am'],
              ['Altria Group Inc',                    83.81, 0.28,  0.34,  '9/1 12:00am'],
              ['American Express Company',            52.55, 0.01,  0.02,  '9/1 12:00am'],
              ['American International Group, Inc.',  64.13, 0.31,  0.49,  '9/1 12:00am'],
              ['AT&T Inc.',                           31.61, -0.48, -1.54, '9/1 12:00am'],
              ['Boeing Co.',                          75.43, 0.53,  0.71,  '9/1 12:00am'],
              ['Caterpillar Inc.',                    67.27, 0.92,  1.39,  '9/1 12:00am'],
              ['Citigroup, Inc.',                     49.37, 0.02,  0.04,  '9/1 12:00am'],
              ['E.I. du Pont de Nemours and Company', 40.48, 0.51,  1.28,  '9/1 12:00am'],
              ['Exxon Mobil Corp',                    68.1,  -0.43, -0.64, '9/1 12:00am'],
              ['General Electric Company',            34.14, -0.08, -0.23, '9/1 12:00am'],
              ['General Motors Corporation',          30.27, 1.09,  3.74,  '9/1 12:00am'],
              ['Hewlett-Packard Co.',                 36.53, -0.03, -0.08, '9/1 12:00am'],
              ['Honeywell Intl Inc',                  38.77, 0.05,  0.13,  '9/1 12:00am'],
              ['Intel Corporation',                   19.88, 0.31,  1.58,  '9/1 12:00am'],
              ['International Business Machines',     81.41, 0.44,  0.54,  '9/1 12:00am'],
              ['Johnson & Johnson',                   64.72, 0.06,  0.09,  '9/1 12:00am'],
              ['JP Morgan & Chase & Co',              45.73, 0.07,  0.15,  '9/1 12:00am'],
              ['McDonald\'s Corporation',             36.76, 0.86,  2.40,  '9/1 12:00am'],
              ['Merck & Co., Inc.',                   40.96, 0.41,  1.01,  '9/1 12:00am'],
              ['Microsoft Corporation',               25.84, 0.14,  0.54,  '9/1 12:00am'],
              ['Pfizer Inc',                          27.96, 0.4,   1.45,  '9/1 12:00am'],
              ['The Coca-Cola Company',               45.07, 0.26,  0.58,  '9/1 12:00am'],
              ['The Home Depot, Inc.',                34.64, 0.35,  1.02,  '9/1 12:00am'],
              ['The Procter & Gamble Company',        61.91, 0.01,  0.02,  '9/1 12:00am'],
              ['United Technologies Corporation',     63.26, 0.55,  0.88,  '9/1 12:00am'],
              ['Verizon Communications',              35.57, 0.39,  1.11,  '9/1 12:00am'],            
              ['Wal-Mart Stores, Inc.',               45.45, 0.73,  1.63,  '9/1 12:00am']
          ];
          
          /**
            * Custom function used for column renderer
            * @param {Object} val
            */
           function change(val) {
               if (val > 0) {
                   return '<span style="color:green;">' + val + '</span>';
               } else if (val < 0) {
                   return '<span style="color:red;">' + val + '</span>';
               }
               return val;
           }

           /**
            * Custom function used for column renderer
            * @param {Object} val
            */
           function pctChange(val) {
               if (val > 0) {
                   return '<span style="color:green;">' + val + '%</span>';
               } else if (val < 0) {
                   return '<span style="color:red;">' + val + '%</span>';
               }
               return val;
           }

           // create the data store
           var store = new Ext.data.ArrayStore({
               fields: [
                  {name: 'company'},
                  {name: 'price',      type: 'float'},
                  {name: 'change',     type: 'float'},
                  {name: 'pctChange',  type: 'float'},
                  {name: 'lastChange', type: 'date', dateFormat: 'n/j h:ia'}
               ]
           });

           // manually load local data
           store.loadData(myData);

           // create the Grid
           var reportPanel = new Ext.grid.GridPanel({
               store: store,
               columns: [
                   {
                       id       :'company',
                       header   : 'Company', 
                       width    : 160, 
                       sortable : true, 
                       dataIndex: 'company'
                   },
                   {
                       header   : 'Price', 
                       width    : 75, 
                       sortable : true, 
                       renderer : 'usMoney', 
                       dataIndex: 'price'
                   },
                   {
                       header   : 'Change', 
                       width    : 75, 
                       sortable : true, 
                       renderer : change, 
                       dataIndex: 'change'
                   },
                   {
                       header   : '% Change', 
                       width    : 75, 
                       sortable : true, 
                       renderer : pctChange, 
                       dataIndex: 'pctChange'
                   },
                   {
                       header   : 'Last Updated', 
                       width    : 85, 
                       sortable : true, 
                       renderer : Ext.util.Format.dateRenderer('m/d/Y'), 
                       dataIndex: 'lastChange'
                   },
                   {
                       xtype: 'actioncolumn',
                       width: 50,
                       items: [{
                           icon   : '../shared/icons/fam/delete.gif',  // Use a URL in the icon config
                           tooltip: 'Sell stock',
                           handler: function(grid, rowIndex, colIndex) {
                               var rec = store.getAt(rowIndex);
                               alert("Sell " + rec.get('company'));
                           }
                       }, {
                           getClass: function(v, meta, rec) {          // Or return a class from a function
                               if (rec.get('change') < 0) {
                                   this.items[1].tooltip = 'Do not buy!';
                                   return 'alert-col';
                               } else {
                                   this.items[1].tooltip = 'Buy stock';
                                   return 'buy-col';
                               }
                           },
                           handler: function(grid, rowIndex, colIndex) {
                               var rec = store.getAt(rowIndex);
                               alert("Buy " + rec.get('company'));
                           }
                       }]
                   }
               ],
               stripeRows: true,
               autoExpandColumn: 'company',
               height: 350,
               width: 600,
               title: 'Array Grid',
               // config options for stateful behavior
               stateful: true,
               stateId: 'grid'
           });
          
          
          win = desktop.createWindow({
              id: 'reportman',
              title:'统计报表',
              width:1200,
              height:600,
              iconCls: 'reportman',
              animCollapse:false,
              border: false,
              hideMode: 'offsets',
              layout: 'fit',
              items: reportPanel 
          });
      }
      win.show();
      return win;
  }
});

MyDesktop.SystemMan = Ext.extend(Ext.app.Module, {

  id:'systemman',

  init : function(){
    this.launcher = {
      text: '系统管理',
      iconCls:'systemman',
      handler : this.createWindow,
      scope: this
    }
  },
  
  createWindow : function(){
      var desktop = this.app.getDesktop();
      var win = desktop.getWindow('reportman');
      if(!win){
          win = desktop.createWindow({
              id: 'systemman',
              title:'系统管理',
              width:600,
              height:400,
              iconCls: 'systemman',
              animCollapse:false,
              border: false,
              //defaultFocus: 'notepad-editor', EXTJSIV-1300

              // IE has a bug where it will keep the iframe's background visible when the window
              // is set to visibility:hidden. Hiding the window via position offsets instead gets
              // around this bug.
              hideMode: 'offsets',

              layout: 'fit',
              items: [
                  {
                      xtype: 'htmleditor',
                      //xtype: 'textarea',
                      id: 'notepad-editor',
                      value: [
                          'Some <b>rich</b> <font color="red">text</font> goes <u>here</u><br>',
                          'Give it a try!'
                      ].join('')
                  }
              ]
          });
      }
      win.show();
      return win;
  }
});

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
                  emptyText:'请选择',
                  mode: 'local',
                  minChars : 2,
                  multiSelect: true,
                  valueField:'text',
                  value:"2周1次",
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
                        { header : '行政区',   width : 75, sortable : true, dataIndex: 'xzqmc'},
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
          
          var planGrid = new Ext.grid.GridPanel({
            id: 'plan_grid_id',
            store: plan_store,
            columns: [
              sm,
              { header : 'id',    width : 75, sortable : true, dataIndex: 'id', hidden:true},
              { header : '巡查编号',  width : 100, sortable : true, dataIndex: 'xcbh'},
              { header : '计划时间',  width : 75, sortable : true, dataIndex: 'qrq', renderer: Ext.util.Format.dateRenderer('Y-m-d')},
              { header : '巡查方式',  width : 75, sortable : true, dataIndex: 'xcfs'},
              { header : '填报单位',  width : 75, sortable : true, dataIndex: 'tbdw'},
              { header : '巡查路线',  width : 75, sortable : true, dataIndex: 'xclx'},
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
              },{
                text : '全部任务',
                iconCls : 'delete',
                handler : function(){
                  pars = {id:"all"};
                  new Ajax.Request("/desktop/delete_all_plan", { 
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
                  new Ajax.Request("/desktop/print_selected_plan", { 
                    method: "POST",
                    parameters: pars,
                    onComplete:  function(request) {
                      
                    }
                  });
                }
              },{
                text : '详细内容',
                iconCls : 'detail',
                handler : function(){

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
            bbar:[
              new Ext.PagingToolbar({
                store: plan_store,
                pageSize: 25,
                width : 350,
                border : false,
                displayInfo: true,
                displayMsg: '{0} - {1} of {2}',
                emptyMsg: "没有找到！",
                prependButtons: true
              })
            ]
          });

          win = desktop.createWindow({
              id: 'taskman',
              title:'任务管理',
              width:800,
              height:500,
              iconCls: 'taskman',
              animCollapse:false,
              border: false,
              hideMode: 'offsets',
              layout: 'fit',
              items: planGrid
          });
        }
        win.show();
        return win;
    }

});

MyDesktop.SystemStatus = Ext.extend(Ext.app.Module, {

  id:'systemstatus',

  init : function(){
    this.launcher = {
      text: '系统监视',
      iconCls:'systemstatus',
      handler : this.createWindow,
      scope: this
    }
  },
  
  createWindow : function(){
      var desktop = this.app.getDesktop();
      var win = desktop.getWindow('systemstatus');
      if(!win){
        
        function showUserPosition(map, vectorLayer) {
          
          if (vectorLayer.features.length > 0){
            while (vectorLayer.features.length > 0) {
              var vectorFeature = vectorLayer.features[0];
              vectorLayer.removeFeatures(vectorFeature);
            };
          };  
          
          pars = {};
          new Ajax.Request("/desktop/get_task_position", { 
            method: "POST",
            parameters: pars,
            onComplete:  function(request) {
              //"[{\"report_at\":\"2012-05-03 17:46:19\",\"device\":\" 8618621361840\",\"astext\":\"POINT(13439889.5503971 3723340.88865353)\",\"username\":\"\\u9ad8\\u98de\",\"id\":184}]"
              //[{"users":{"lon_lat":"13470500 3683278","id":32,"icon":"monkey.png","color":"#800000"}}]
              var features = [];
              if (request.responseText.length > 30) {           
                var places = eval("("+request.responseText+")");
                var x_end, y_end;

                for (var k=0; k < places.length; k++) {
                  place = places[k];
                  var pointText = place["lon_lat"]; //13470500 3683278

                  if (pointText == null || pointText == undefined) continue;

                  var id =  place["id"];
                  //var icon = place["icon"];
                  var username = place['username'];
                  ss = pointText.match(/POINT\((\d+.\d+)\s*(\d+.\d+)\)/);
                  var x0 = parseFloat(ss[1]);
                  var y0 = parseFloat(ss[2]);
                  
                  var style = new OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                  style.externalGraphic = '/images/chrome.png';
                  style.backgroundXOffset = 0;
                  style.backgroundYOffset = 0;
                  style.graphicWidth = 32;
                  style.graphicHeight = 32;
                  style.graphicZIndex = MARKER_Z_INDEX;
                  style.backgroundGraphicZIndex= SHADOW_Z_INDEX;
                  style.fillOpacity = 0.8;
                  style.fillColor = "#ee4400";
                  //style.graphicName = "star",
                  style.pointRadius = 8;
                  
                  style.fontSize   = "12px";
                  style.fontFamily = "Courier New, monospace";
                  style.fontWeight = "bold";
                  style.labelAlign = "cm";            
                  style.label = username;
                  style.fontColor = "black";

                  features.push(
                      new OpenLayers.Feature.Vector( new OpenLayers.Geometry.Point(x0, y0), {fid: id}, style )
                  );    
                }
                vectorLayer.addFeatures(features);
              }
            }
          });                       
        };
        
        //maps here 
        var options = {
          projection: new OpenLayers.Projection('EPSG:900913'), units: "m", maxResolution: 152.87405654296876,
          maxExtent: new OpenLayers.Bounds(-2.003750834E7,-2.003750834E7,2.003750834E7,2.003750834E7) 
        };
        
        var map  = new OpenLayers.Map($('task_track'), options);
        //var gsat = new OpenLayers.Layer.Google("谷歌卫星图", {type: G_HYBRID_MAP, "sphericalMercator": true,  opacity: 1, numZoomLevels: 20});
        //var gmap = new OpenLayers.Layer.Google("谷歌地图", {type: G_NORMAL_MAP, "sphericalMercator": true,   opacity: 1, numZoomLevels: 20});
        
        var gmap = new OpenLayers.Layer.Google(
            "谷歌地图", // the default
            {numZoomLevels: 20}
        );
        var gsat = new OpenLayers.Layer.Google(
            "谷歌卫星图",
            {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
        );
        var gphy = new OpenLayers.Layer.Google(
            "谷歌地形图",
            {type: google.maps.MapTypeId.TERRAIN}
        );

        map.addLayers([gmap, gphy, gsat]);

        var xmdks_map = new OpenLayers.Layer.WMS("项目地块", base_url, 
          { layers: 'cs1204:xmdk', srs: 'EPSG:900913', transparent: true, format: format }, s_option8);

        var dltb = new OpenLayers.Layer.WMS("二调数据", base_url, 
          { layers: 'cs1204:dltb', srs: 'EPSG:900913', transparent: true, format: format }, s_option8f);

        var dltb_m = new OpenLayers.Layer.WMS("二调数据2", base_url, 
            { layers: 'cs1204:dltb_m', srs: 'EPSG:900913', transparent: true, format: format }, s_option8);

        
        map.addLayers([dltb, dltb_m, xmdks_map]);

        var xmdk_vectors = new OpenLayers.Layer.Vector("任务地块", {
            isBaseLayer: false,
            styleMap: styles
        });
        
        var markers = new OpenLayers.Layer.Vector("巡查点标记", {
                styleMap: new OpenLayers.StyleMap({
                    // Set the external graphic and background graphic images.
                    externalGraphic:   "/images/marker-gold.png",
                    backgroundGraphic: "/images/marker_shadow.png",

                    // Makes sure the background graphic is placed correctly relative
                    // to the external graphic.
                    backgroundXOffset: 0,
                    backgroundYOffset: -7,

                    // Set the z-indexes of both graphics to make sure the background
                    // graphics stay in the background (shadows on top of markers looks
                    // odd; let's not do that).
                    graphicZIndex: MARKER_Z_INDEX,
                    backgroundGraphicZIndex: SHADOW_Z_INDEX,

                    pointRadius: 10
                }),
                isBaseLayer: false,
                opacity: 0.8,
                rendererOptions: {yOrdering: true}
        });

        var vectors = new OpenLayers.Layer.Vector("用户位置", {
            isBaseLayer: false,
            styleMap: styles
        });

        map.addLayers([xmdk_vectors, vectors, markers]);
        
        var layserSwitch = new OpenLayers.Control.LayerSwitcher();
        
        map.events.register("changebaselayer", map, function (e) {
          //alert("visibility changed (" + e.layer.name + ")");
          if (e.layer.name == '谷歌卫星图') {
            map.getLayersByName('二调数据2')[0].setVisibility(false);
            map.getLayersByName('二调数据')[0].setVisibility(true);
          }else{
            map.getLayersByName('二调数据2')[0].setVisibility(true);
            map.getLayersByName('二调数据')[0].setVisibility(false);
          }
        });
        
        
        /*
        var mapPanel = new GeoExt.MapPanel({
            title: "GeoExt MapPanel",
            stateId: "mappanel",
            height: 400,
            width: 600,
            map: map,
            center: new OpenLayers.LonLat(5, 45),
            zoom: 4,
            // getState and applyState are overloaded so panel size
            // can be stored and restored
            getState: function() {
                var state = GeoExt.MapPanel.prototype.getState.apply(this);
                state.width = this.getSize().width;
                state.height = this.getSize().height;
                return state;
            },
            applyState: function(state) {
                GeoExt.MapPanel.prototype.applyState.apply(this, arguments);
                this.width = state.width;
                this.height = state.height;
            }
        });
        */
        
        var map_view = new Ext.Panel({
          id : 'task_track',
          autoScroll: true,
          xtype:"panel",
          width:500,
          height:500,
          style:'margin:0px 0px',
          layout:'fit',
          tbar:[{
            text:'刷新人员',
            handler : function() {
              showUserPosition(map,vectors);
            }
          }],
          items: [{
              //xtype: 'mapcomponent',
              xtype: 'gx_mappanel',
              map: map
          }]
        });
        
        var phone_store = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: '/desktop/get_phone_list'
            }),
            reader: new Ext.data.JsonReader({
              totalProperty: 'results', 
              root: 'rows',             
              fields: [
                {name: 'id',        type: 'integer'},
                {name: 'username',  type: 'string'},
                {name: 'device',    type: 'string'},
                {name: 'lon_lat',   type: 'string'},
                {name: 'report_at',   type: 'date', dateFormat: 'Y-m-d H:i:s'}
              ]    
            }),
            sortInfo:{field: 'id', direction: "ASC"}
        });
        
        phone_store.load();
        
        var phone_grid = new Ext.grid.GridPanel({
          id: 'phone_grid_id',
          store: phone_store,
          columns: [
            //sm,
            { header : 'id',  width : 75, sortable : true, dataIndex: 'id', hidden:true},
            { header : '人员',  width : 50, sortable : true, dataIndex: 'username'},
            { header : '电话',  width : 100, sortable : true, dataIndex: 'device'},
            { header : '时间',  width : 100, sortable : true, dataIndex: 'report_at', renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')},
            ],
          //sm:sm,  
          columnLines: true,
          layout:'fit',
          viewConfig: {
            stripeRows:true,
          },
          tbar:[]
        });
        
        phone_grid.on('rowclick', function(grid, row, e){
          var data = grid.store.data.items[row].data;
          pointText = data.lon_lat;
          ss = pointText.match(/POINT\((\d+.\d+)\s*(\d+.\d+)\)/);
          var x0 = parseFloat(ss[1]);
          var y0 = parseFloat(ss[2]);

          var lonlat = new OpenLayers.LonLat(x0, y0);
          map.panTo(lonlat,{animate: false});
        });
        
        var phone_panel = new Ext.Panel({
          id : 'phone_panel_id',
          autoScroll: true,
          xtype:"panel",
          width:250,
          height:500,
          style:'margin:0px 0px',
          layout:'fit',
          tbar:[{
            text:'刷新人员',
            handler : function() {
              phone_store.load();
            }
          }],
          items: [phone_grid]
        });
        
        
        win = desktop.createWindow({
            id: 'systemstatus',
            title:'系统监视',
            width:850,
            height:600,
            iconCls: 'systemstatus',
            animCollapse:false,
            border: false,
            hideMode: 'offsets',
            layout: 'border',
            items:[{
                region:"center",
                layout:"fit",
                items:[map_view]
              },{
                region:"east",
                //title:"east",
                width:250,
                split:true,
                collapsible:true,
                titleCollapse:true,
                layout:"fit",
                items:[phone_panel]
              }]
        });
      };
      
      
      map.addControl(layserSwitch);
      map.addControl(new OpenLayers.Control.MousePosition());
      var zoomLevel = 14;
      map.setCenter(new OpenLayers.LonLat(13433632.3955943,3715923.24566449), zoomLevel);
      
      win.show();
      showUserPosition(map,vectors);
      return win;
  }
});

