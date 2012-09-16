/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

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

    if (currentUser.qxcode != '管理员') {
      msg('Message','权限不够. 请与管理员联系后再试！');
      return;
    }

    var desktop = this.app.getDesktop();
    var win = desktop.getWindow('systemman');
    if(!win){

      var addUser = function (gsm) {
        var qxcode_data = [
          ['0','管理员'],
        	['1','巡查员'],
        	['2','监察员']
        ];

        var qxcode_store = new Ext.data.SimpleStore({
        	fields: ['value', 'text'],
        	data : qxcode_data
        });
        
        var hide_data = [
        	['0','否'],
          ['1','是']
        ];

        var hide_store = new Ext.data.SimpleStore({
        	fields: ['value', 'text'],
        	data : hide_data
        });
        
        var userPanel = new Ext.form.FormPanel({
          id : 'user_panel_id',
          autoScroll : true,
          width:300,
          height:250,
          layout:'absolute',
          items: [
              { xtype: 'textfield', name : 'id',hidden: true },
              { xtype: 'label',     x: 10, y: 10, text: '姓名'},
              { xtype: 'textfield', x: 70, y: 10, width: 200, name : 'username'},
              { xtype: 'label',     x: 10, y: 40, text: '部门'},
              { xtype: 'textfield', x: 70, y: 40, width: 200, name : 'bm'},
              { xtype: 'label',     x: 10, y: 70, text: '办公电话'},
              { xtype: 'textfield', x: 70, y: 70, width: 200, name : 'bgdh'},
              { xtype: 'label',     x: 10, y: 100, text: '移动电话'},
              { xtype: 'textfield', x: 70, y: 100, width: 200, name : 'iphone'},
              { xtype: 'label',     x: 10, y: 130, text: '邮件'},
              { xtype: 'textfield', x: 70, y: 130, width: 200, name : 'email'},
              { xtype: 'label',     x: 10, y: 160, text: '角色'},
              { xtype: 'combo',     x: 70, y: 160, width: 200, name : 'qxcode', store:qxcode_store, emptyText:'请选择',mode: 'local', valueField:'text', displayField:'text',triggerAction:'all'},
              { xtype: 'label',     x: 10, y: 190, text: '隐藏'},
              { xtype: 'combo',     x: 70, y: 190, width: 200, name : 'hide', store:hide_store, emptyText:'请选择',mode: 'local', valueField:'value', displayField:'text',triggerAction:'all'}
          ]
        });
        
        var user_win = Ext.getCmp('add_user_win');
        
        if (user_win == undefined) {
          user_win = new Ext.Window({
            id : 'add_user_win',
            iconCls : 'add',
            title: '计划任务',
            floating: true,
            shadow: true,
            draggable: true,
            closable: true,
            modal: false,
            width: 300,
            height: 550,
            x: 900,
            y: 30, 
            layout: 'fit',
            plain: true,
            items:userPanel,
            buttons: [{
              text: '确定',
              handler: function() {
                var myForm = Ext.getCmp('user_panel_id').getForm();
                pars = myForm.getFieldValues();
                new Ajax.Request("/desktop/add_user", { 
                  method: "POST",
                  parameters: pars,
                  onComplete:  function(request) {
                    if (request.responseText == 'Success') {
                      user_win.close();
                      user_store.load();
                    } else {
                      //msg('失败', '新增任务失败!');
                    }
                  }
                });
              }
            }]
          });
          user_win.show();l
        };
        
        if (gsm == undefined) {
          Ext.getCmp('add_user_win').setTitle('新增用户');
        } else {
          Ext.getCmp('add_user_win').setTitle('修改用户');
          Ext.getCmp('add_user_win').setIconClass('edit');
          var myForm = Ext.getCmp('user_panel_id').getForm();
          myForm.loadRecord(gsm.selections.items[0]);
        };
      }
      
      var  user_store = new Ext.data.Store({
          proxy: new Ext.data.HttpProxy({
              url: '/desktop/get_user_grid'
          }),

          reader: new Ext.data.JsonReader({
            totalProperty: 'results', 
            root: 'rows',             
            fields: [
              {name: 'id',        type: 'integer'},
              {name: 'username',  type: 'string'},
              {name: 'bm',        type: 'string'},
              {name: 'bgdh',      type: 'string'},
              {name: 'iphone',    type: 'string'},
              {name: 'email',     type: 'string'},
              {name: 'qxcode',    type: 'string'},
              {name: 'hide',      type: 'string'}
            ]    
          }),
          baseParams :  {bm:'',mc:''},
          sortInfo:{field: 'id', direction: "ASC"}
      });
      
      user_store.load();
      
      var sm = new Ext.grid.CheckboxSelectionModel();
      
      function isHidden(val) {
          if (val == 0) {
              return '<span style="color:green;">否</span>';
          } else  {
              return '<span style="color:red;">是</span>';
          }
          return val;
      };
      
      var userGrid = new Ext.grid.GridPanel({
        id: 'sysman_user_grid_id',
        store: user_store,
        columns: [ sm,
          { header : 'id',    width : 75, sortable : true, dataIndex: 'id', hidden:true},
          { header : '姓名',    width : 100, sortable : true, dataIndex: 'username'},
          { header : '部门',    width : 100, sortable : true, dataIndex: 'bm'},
          { header : '办公电话',  width : 100, sortable : true, dataIndex: 'bgdh'},
          { header : '手机号',   width : 100, sortable : true, dataIndex: 'iphone'},
          { header : '邮件',    width : 100, sortable : true, dataIndex: 'email'},
          { header : '角色',    width : 100, sortable : true, dataIndex: 'qxcode'},
          { header : '是否隐藏',  width : 100, sortable : true, dataIndex: 'hide', renderer : isHidden}
          ],
        sm : sm,  
        columnLines: true,
        layout: 'fit',
        height: 300,
        border: false,
        viewConfig: {
          stripeRows:true
        }
      });
      
      //处理双击事件，打开点击窗口
      userGrid.addListener('rowdblclick',function(t,r,e){
				//var select = t.getSelectionModel().getSelections()[0].data;
				var gsm =Ext.getCmp('sysman_user_grid_id').getSelectionModel();
        addUser(gsm);
        //user_store.load();
			});
      
      userGrid.addListener('rowclick',function(t,r,e){
				var select = t.getSelectionModel().getSelections()[0].data;
        var form = Ext.getCmp('user_panel_id').form;
				form.findField('id').setValue(select['id']);
				form.findField('username' ).setValue(select['username']);
			});
      
      var userTree = new Ext.tree.TreePanel({
          id:'yh-tree',
          //title: '员工',
          rootVisible:false,
          lines:false,
          autoScroll:true,
          /*
          tools:[{
              id:'refresh',
              on:{
                  click: function(){
                      var tree = Ext.getCmp('yh-tree');
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
          */
          loader: new Ext.tree.TreeLoader({
            dataUrl: '/desktop/get_yhtree',
            baseAttrs: { uiProvider: Ext.ux.TreeCheckNodeUI } 
          }),
          root: {
            nodeType: 'async',
            text: '联系人',
            draggable:false,
            id:'root'
          }
      });
      
      userTree.on("click", function(node,e) {
        e.stopEvent();
        node.select();
        
        if (node.isLeaf()) {
          
        } else {
          var ss = node.id.split("|");
          user_store.baseParams = {filter: node.id};
          user_store.load();
        }
        
      }, userTree);
      
      var win = desktop.createWindow({
        id: 'systemman',
        title:'系统管理',
        width:800,
        height:550,
        x : 100,
        y : 30,
        iconCls: 'systemman',
        shim:false,
        animCollapse:false,
        border:false,
        //constrainHeader:true,
        layout:"border",
        items:[{
            region:"center",
            title:"人员设置",
            items:[{
              xtype:"tabpanel",
              activeTab:0,
              items:[{
                  xtype:"panel",
                  title:"用户管理",
                  layout:'fit',
                  height:500,
                  items:[userGrid],
                  tbar :[{
                      text:'新增用户',
                      iconCls:'add',
                      handler: function () {
                        addUser();
                        user_store.load();
                      }
                    },{
                      text:'修改用户',
                      iconCls:'edit',
                      handler: function () {
                        var gsm =Ext.getCmp('sysman_user_grid_id').getSelectionModel();
                        addUser(gsm);
                        user_store.load();
                      }             
                    },{
                      text:'删除用户',
                      iconCls:'delete',
                      handler : function(){
                        items = Ext.getCmp('sysman_user_grid_id').getSelectionModel().selections.items;
                        if (items.length > 0) {

                          Ext.Msg.confirm("确认", "删除所选用户,该操作不可恢复?", 
                            function(btn){
                              if (btn=='yes') {
                                id_str = '';
                                for (var i=0; i < items.length; i ++) {
                                  if (i==0) {
                                    id_str = id_str+items[i].data.id 
                                  } else {
                                    id_str = id_str + ',' +items[i].data.id 
                                  }
                                }
                                pars = {id:id_str};
                                new Ajax.Request("/desktop/delete_selected_user", { 
                                  method: "POST",
                                  parameters: pars,
                                  onComplete:  function(request) {
                                    user_store.load();
                                  }
                                });
                              }
                            }
                          );
                        } else {
                          Ext.Msg.alert('错误','请先选择用户！');
                        }

                      }                 
                    },{
                      text:'重设密码',
                      iconCls:'key',
                      handler : function(){
                        items = Ext.getCmp('sysman_user_grid_id').getSelectionModel().selections.items;
                        if (items.length > 0) {

                          Ext.Msg.confirm("确认", "重新设置用户为缺省密码?", 
                            function(btn){
                              if (btn=='yes') {
                                id_str = '';
                                for (var i=0; i < items.length; i ++) {
                                  if (i==0) {
                                    id_str = id_str+items[i].data.id 
                                  } else {
                                    id_str = id_str + ',' +items[i].data.id 
                                  }
                                }
                                pars = {id:id_str};
                                new Ajax.Request("/desktop/reset_password", { 
                                  method: "POST",
                                  parameters: pars,
                                  onComplete:  function(request) {
                                   Ext.Msg.alert("确认", "密码重设成功！");
                                  }
                                });
                              }
                            }
                          );

                        } else {
                          Ext.Msg.alert('错误','请先选择重新设置密码用户！');
                        }
                      }            
                  }]
                },{
                  xtype:"panel",
                  title:"角色管理",
                  items:[],
                  tbar:[]
                }]
            }]
          },{
            region:"west",
            title:"部门人员",
            width:200,
            split:true,
            collapsible:true,
            titleCollapse:true,
            layout:'fit',
            items: [userTree]
        }]

      });
    }
    win.show();
  }
  
});

