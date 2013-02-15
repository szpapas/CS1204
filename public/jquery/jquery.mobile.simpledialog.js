/*
 * jQuery Mobile Framework : plugin to provide a simple popup (modal) or jQMdialog (page) Dialog widget.
 * Copyright (c) JTSage
 * CC 3.0 Attribution.  May be relicensed without permission/notifcation.
 * 
 */
(function($, undefined ) {
  $.widget( "mobile.simpledialog", $.mobile.widget, {
	options: {
		pickPageTheme: 'b',
		pickPageInputTheme: 'e',
		pickPageButtonTheme: 'a',
		
		disabled: false,
		zindex: '500',
		
		prompt: 'Are you sure?', // or false.
		mode: 'string', // or 'string'
		allowReopen: true,
		useModal: true,
		forceInput: true,
		
		useDialogForceTrue: false,
		useDialogForceFalse: false,
		useDialog: false,
		isInit: false,
		sawOnce: false
	},
	open: function() {
		var self = this,
			o = this.options,
			docWinWidth = $(document).width(),
			docWinHeightOffset = $(window).scrollTop(),
			docWinHeight = $(window).height(),
			pickWinHeight = self.pickerContent.outerHeight(),
			pickWinWidth = self.pickerContent.innerWidth(),
			
			pickWinTop = docWinHeightOffset + ( docWinHeight / 2 )- ( pickWinHeight / 2),
			pickWinLeft = ( docWinWidth / 2) - ( pickWinWidth / 2),
			windowWidth = $(document).width();
					
		if ( (pickWinHeight + pickWinTop) > $(document).height() ) {
			pickWinTop = $(document).height() - (pickWinHeight + 2);
		}
		if ( pickWinTop < 45 ) { // Fix for popup ending up under header
			pickWinTop = 45;
		}
		
		if ( !o.disabled ) {
			if ( ( docWinWidth > 400 && !o.useDialogForceTrue ) || o.useDialogForceFalse ) {
				self.options.useDialog = false;
				if ( self.options.useModal ) {
					self.screen.fadeIn('slow');
				} else {
					self.screen.removeClass('ui-simpledialog-hidden');
				}
				self.pickerContent.addClass('ui-overlay-shadow');
				self.pickerHeader.show();
				self.pickerContent.css({'position': 'absolute', 'top': pickWinTop, 'left': pickWinLeft}).addClass('ui-overlay-shadow in').removeClass('ui-simpledialog-hidden');
			} else {
				self.options.useDialog = true;
				self.pickPageContent.append(self.pickerContent);
				self.pickerHeader.hide();
				self.pickerContent.removeClass('ui-overlay-shadow ui-simpledialog-hidden').css({'top': 'auto', 'left': 'auto', 'marginLeft': 'auto', 'marginRight': 'auto'});
				$.mobile.changePage(self.pickPage, 'pop', false, true);
			}
		}
	},
	close: function() {
		var self = this;
		
		if ( self.options.useDialog ) {
			$(self.pickPage).dialog('close');
			//$.mobile.changePage([self.pickPage,self.thisPage], 'pop', true, false);
			self.pickerContent.addClass('ui-simpledialog-hidden').removeAttr('style').css('zIndex', self.options.zindex);
			self.thisPage.append(self.pickerContent);
		} else {
			if ( self.options.useModal ) {
				self.screen.fadeOut('slow');
			} else {
				self.screen.addClass('ui-simpledialog-hidden');
			}
			self.pickerContent.addClass('ui-simpledialog-hidden').removeClass('in').removeAttr('style').css('zIndex', self.options.zindex);
		}
	},
	_create: function(){

		var self = this,
			o = $.extend(this.options, this.element.data('options')),
			caller = this.element;
		
		if ( o.isInit ) {
			if ( o.allowReopen ) {
				self.open(); 
			}
		} else { 
				
			var thisPage = $('.ui-page-active'),
				pickPage = $("<div data-role='dialog' class='ui-simpledialog-dialog' data-theme='" + o.pickPageTheme + "' >" +
							"<div data-role='header' data-backbtn='false' data-theme='a'>" +
								"<div class='ui-title'>"+o.prompt+"</div>"+
							"</div>"+
							"<div data-role='content'></div>"+
						"</div>")
						.appendTo( $.mobile.pageContainer )
						.page().css('minHeight', '0px').css('zIndex', o.zindex).addClass('pop'),
				pickPageContent = pickPage.find( ".ui-content" ),
				pickPageClose = pickPage.find( ".ui-header a").click(function(e) {
					e.preventDefault();
					e.stopImmediatePropagation();
					self.close();
					return false;
				});
			
			if ( o.prompt === false ) {
				pickPage.find('.ui-header').find('.ui-title').html("&nbsp;");
			}
			
			$.extend(self, {
				pickPage: pickPage,
				thisPage: thisPage,
				pickPageClose: pickPageClose,
				pickPageContent: pickPageContent,
				screen: screen,
				caller: caller
			});
			
			self._buildPage();
			self.options.isInit = true;
		}
		datepicker.windialog = this; 
	},
	_init: function() {
		if ( !this.options.sawOnce || this.options.allowReopen ) {
			this.options.sawOnce = true;
			this.open();
		}
	},
	_buildPage: function () {
		var self = this,
			o = self.options,
			pickerInput,
			pickerContent = $("<div>", { "class": 'ui-simpledialog-container ui-overlay-shadow ui-corner-all ui-simpledialog-hidden pop ui-body-'+o.pickPageTheme} ).css('zIndex', o.zindex),
			pickerHeader = $("").appendTo(pickerContent).find("h4");
			
		if ( o.prompt !== false ) {
			pickerHeader.html(o.prompt);
		} else {
			pickerHeader.parent().html();
		}
		
		if ( o.mode == 'string' ) {
			pickerInput = $('<div class="jqmWindow" id="dialog"><table class="datepickertable" cellpadding="0" cellspacing="0" border="0"><tr><td colspan="3"><div style="border-bottom:thin solid #fff;font-size:18px;margin-bottom:5px;padding:5px;height:50px;"><div style="float:left;margin-right:5px;"><img src="11-clock.png"/></div><div id="dStr" style="width:200px;float:left;font-size:16px;margin-top:3px;letter-spacing:1px;font-weight:lighter; font-family: Helvetica, Arial, sans-serif;"></div></div></td></tr><tr><td><table align="center" style="margin-top:5px;margin-bottom:5px;" cellpadding="0"  cellspacing="5" border="0"><tr><td><div id="pyear" role="main" class="ui-content ui-body-b ui-corner-top-2" data-role="content" style="text-align: center; width: 79px; padding: 5px 0px;margin:0px 2px;cursor:pointer;">+</div><input type="text" class="ui-shadow-inset ui-body-c" id="year" style="width:76px;padding:0px;height:38px;margin:0px 2px;" /><div id="myear" role="main" class="ui-content ui-body-b ui-corner-bottom-2" data-role="content" data-theme="a" style="text-align: center; width: 79px; padding: 5px 0px;margin:0px 2px;cursor:pointer;">-</div></td><td><div id="pmon"  role="main" class="ui-content ui-body-b ui-corner-top-2" data-role="content" style="text-align: center; width: 63px; padding: 5px 0px;margin:0px 2px;cursor:pointer;">+</div><input type="text" class="ui-shadow-inset ui-body-c" id="mon" style="width:60px;padding:0px;height:38px;margin:0px 2px;" /><div id="mmon" role="main" class="ui-content ui-body-b ui-corner-bottom-2" data-role="content" data-theme="a" style="text-align: center; width: 63px; padding: 5px 0px;margin:0px 2px 2px 2px;cursor:pointer;">-</div></td><td><div id="pday" role="main" class="ui-content ui-body-b ui-corner-top-2" data-role="content"  style="text-align: center; width: 63px; padding: 5px 0px;margin:0px 2px;cursor:pointer;">+</div><input type="text" class="ui-shadow-inset ui-body-c" id="day" style="width:60px;padding:0px;height:38px;margin:0px 2px;" /><div id="mday" role="main" class="ui-content ui-body-b ui-corner-bottom-2" data-role="content" data-theme="a" style="text-align: center; width: 63px; padding: 5px 0px;margin:0px 2px; cursor:pointer;">-</div></td></tr></table></td></tr><tr><td colspan="3" style="background-color:#a7a7a7;"><table width="100%"><tr><td width="50%"><div role="main" id="set" class="ui-content ui-body-b ui-corner-all-1" data-role="content" data-theme="a" style="font-size:20px;text-align: center; padding: 10px 0px;margin:2px;cursor:pointer;">确定</div></td><td><div role="main" id="close" class="ui-content ui-body-b ui-corner-all-1" data-role="content" data-theme="a" style="font-size:20px;text-align: center; padding: 10px 0px;margin:2px;cursor:pointer;">取消</div></td></tr></table></td></tr></table></div> ').appendTo(pickerContent);
		}
		
		//var pickerChoice = $("<div>", { "class":'ui-simpledialog-controls' }).appendTo(pickerContent);
			
		/*$.each(o.buttons, function(name, props) {
			props = $.isFunction( props ) ?
				{ click: props } : props;
			props = $.extend({
                text: name,
                theme: o.pickPageButtonTheme,
                icon: 'check',
                iconpos: 'left'
            }, props);
			$("<a href='#'>"+name+"</a>")
				.appendTo(pickerChoice)
				.buttonMarkup({theme: props.theme, icon: props.icon, iconpos: props.iconpos, corners: true, shadow: true})
				.unbind("click")
				.click(function() {
					if ( o.mode == 'string' ) { self.caller.attr('data-string', pickerInput.find('input').val()); }
					props.click.apply(self.element[0], arguments);
					self.close();
				});
		});*/

		
		
		pickerContent.appendTo(self.thisPage);
		
		var screen = $("<div>", {'class':'ui-simpledialog-screen ui-simpledialog-hidden'})
			.css({'z-index': o.zindex-1})
			.appendTo(self.thisPage)
			.bind("click", function(event){
				if ( !o.forceInput ) {
					self.close();
				}
				event.preventDefault();
			});
			
		if ( o.useModal ) {
			screen.addClass('ui-simpledialog-screen-modal');
		}
			
		$.extend(self, {
			pickerContent: pickerContent,
			pickerHeader: pickerHeader,
			screen: screen
		});
	},
	    
	disable: function(){
		this.options.disabled = true;
	},
	
	enable: function(){
		this.options.disabled = false;
	}
	
  });
	
	
})( jQuery );
