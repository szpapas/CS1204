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
										var tree = Ext.getCmp('kh-tree');
										tree.body.mask('Loading', 'x-mask-loading');
										tree.loader.baseParams = { yg_id:currentUser.id, filter: Ext.getCmp('fiter-user').getValue()},
										tree.root.reload();
										tree.root.collapse(true, false);
										setTimeout(function(){ // mimic a server call
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
											onComplete:	 function(request) {
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
					            text: '电话',
					            x: 20,
					            y: 70
					        },
					        {
					            xtype: 'label',
					            text: '家庭地址',
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
						onComplete:	 function(request) {
							var user = eval("("+request.responseText+")").users;
							Ext.getCmp('view_detail_form').items.items[5].setValue(user.login);
							Ext.getCmp('view_detail_form').items.items[6].setValue(user.bm);
							Ext.getCmp('view_detail_form').items.items[7].setValue(user.mobile);
							Ext.getCmp('view_detail_form').items.items[8].setValue(user.jtdz);
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
												onComplete:	 function(request) {
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
							onComplete:	 function(request) {
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
					if (Ext.getCmp('view_detail_form') != 'undefined') {
						var node = Ext.getCmp('acc-win').layout.activeItem.selModel.selNode;
						var ss = node.id.split("|");  //业务部|王娅红|13862616066

						var pars = {name:ss[1]};
						new Ajax.Request("/desktop/get_detail_user", { 
							method: "POST",
							parameters: pars,
							onComplete:	 function(request) {
								var user = eval("("+request.responseText+")").users;
								Ext.getCmp('view_detail_form').items.items[5].setValue(user.login);
								Ext.getCmp('view_detail_form').items.items[6].setValue(user.bm);
								Ext.getCmp('view_detail_form').items.items[7].setValue(user.mobile);
								Ext.getCmp('view_detail_form').items.items[8].setValue(user.jtdz);
								Ext.getCmp('view_detail_form').items.items[9].setValue(user.email);

							}
						});
					}
				}, yg_tree);
				
				win.show();
		}
});
