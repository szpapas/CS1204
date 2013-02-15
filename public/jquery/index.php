<!DOCTYPE html> 
<html> 
<head> 
	<meta http-equiv="Content-Type" content="text/html; charset=gbk" /> 
	<title>jQueryMobile-datepicker-zh Demo</title>
	<link rel="stylesheet" href="http://code.jquery.com/mobile/1.0a4.1/jquery.mobile-1.0a4.1.min.css" />
	<link rel="stylesheet" href="./jquery.mobile.simpledialog.css" type="text/css"></link>
	<link rel="stylesheet" href="./datepicker.css" type="text/css"/>
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script> 
	<script type="text/javascript" src="http://code.jquery.com/mobile/1.0a4.1/jquery.mobile-1.0a4.1.min.js"></script>
	<script type="text/javascript" src="./dFormat.js"></script>
	<script type="text/javascript" src="./datepicker.js"></script>
	<script type="text/javascript" src="./jquery.mobile.simpledialog.js"></script>
	
</head>
<body>
<div style="position:absolute; left:-9999px;"><a href="#" id="setfoc"></a></div>
<div data-role="page" data-theme="a" id="main"> 
	<div data-role="header"> 
		<h1>jquerymobile-datepicker-zh(1.0a4.1 Base)</h1>
	</div>
	<div data-role="content" data-theme="c">
		<script type="text/javascript">
		$(document).ready(function () {
				(function(){$('#date').bind("tap", {curdatetext: "date"}, datepicker.handler);})(); 
		});
		</script>
		<h2>jquery-mobile-datepicker-zh</h2> 

		<h3>����</h3>
			<p>Jquery Mobile�ٷ�������ѡ�����������ĵ��л�����ʵ��׶Σ�����Ҳû�п����ٷ�����̳����ʲô�����á��������˿���������ѡ������������ҵ����������һ����<a href="http://toddmhorst.wordpress.com/2010/12/30/android-like-date-picker-with-jquery-mobile-2/" rel="external"  target="_blank">Todd M. Horst��д������ѡ����</a>����һ����<a href="jQuery-Mobile-DateBox" rel="external"  target="_blank">jQuery-Mobile-DateBox</a>��ǰ�ߵĻ����Ͽ��������ġ����߿������Ӳ�����������ʽ��һ����Android��ģ�һ�������������ʽ���ɾ���ʵ�����������Ǻܸ���������Jquery Mobile������������ƪ����<a href="http://www.jqmobile.org/thread-98-1-1.html" rel="external"  target="_blank">��jquery mobileʱ��ѡ����������ѡ������</a>���ܶ����ѷ�ӳ˵���߸��������á���Ҳ������һ�£��������ҵ�iPad�ϸ��������á�����Ȼ���ҵ���Ŀ�Ͳ�����ǰ�ߣ���������Ҳ���Ǻ����⡣������Ч����iPad�ϣ����ҳ��߶Ⱥܸߵ�����£������������ҳ����ϰ벿��ѡ������ⲿ�ֵ��м䣬����������pc��һ����������ҳ��ĵ�ǰλ���ϡ������ұ������޸ĵ�����Ч�����뷨��</p>
		<h3>���</h3>
				<p>jQuery Mobile����ѡ���������������棬��<a href="http://toddmhorst.wordpress.com/2010/12/30/android-like-date-picker-with-jquery-mobile-2/" rel="external"  target="_blank">Todd M. Horst��д������ѡ����</a>���˺����ͽ�һ����װ��</p> 
				<ul>
					<li>��Todd M. Horst��д������ѡ���������˷�װ����ֹ��ȾJavascriptȫ�ֻ���������������ͻ</li>
					<li>�޸�����ԭ�еĵ�����Ч������ԭ�е�<a href="http://dev.iceburg.net/jquery/jqModal/" rel="external"  target="_blank">jqModal</a>Ч����Ϊ<a href="http://dev.jtsage.com/jQM-SimpleDialog/" rel="external"  target="_blank">SimpleDialogЧ��</a>��ʹ�����Ѥ����������ԭ��������ѡ��ؼ���</li> 
					<li>��ԭ�е�ʱ�����js�ļ�(dFormat.js)�����˺�����ʹ����ӷ������Ļ�����</li> 
					<li>ͨ���������ʵ�����ı��������ѡ��ؼ��Ĺ�����ʹ�ò��ʹ�ø��Ӽ�㡣</li>
				</ul>
		<div>
			<h3>ʹ�÷���</h3>
			1������css��ʽ�ļ���js�ļ�(ע��ע������js�ļ���˳��)
			<pre>
			<code> 
&lt;link rel=&quot;stylesheet&quot; href=&quot;./jquery.mobile.simpledialog.css&quot; type=&quot;text/css&quot;&gt;&lt;/link&gt;
&lt;link rel=&quot;stylesheet&quot; href=&quot;./datepicker.css&quot; type=&quot;text/css&quot;/&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;./dFormat.js&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;./datepicker.js&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;./jquery.mobile.simpledialog.js&quot;&gt;&lt;/script&gt;
			</code>
			</pre> 
			2����ҳ����ӱ����ͼ��
			<pre>
			<code> 
&lt;div style=&quot;position:absolute; left:-9999px;&quot;&gt;&lt;a href=&quot;#&quot; id=&quot;setfoc&quot;&gt;&lt;/a&gt;&lt;/div&gt;
			</code>
			</pre> 
			3��Ϊ�ı��������ѡ��ؼ�(ע��dateIdΪ�ı����id)
			<pre>
			<code> 
&lt;script type=&quot;text/javascript&quot;&gt;
$(document).ready(function () {
		(function(){$(&#039;#dateId&#039;).bind(&quot;tap&quot;, {curdatetext: &quot;dateId&quot;}, datepicker.handler);})(); 
});
&lt;/script&gt;
			</code>
			</pre> 
		</div>
		<div>
		
		<h3>ʾ��</h3>
		<label for="date">����ѡ��ʵ����</label><input type="text" id="date"  name="date" value=""/>
		</div>
		<div>
			<h3>
			��ӭ�������ʹ�ã��������ҵĲ��͵�ַ����ҿ��Ը������ԡ�
			</h3>
		</div>
	</div>
	<style type="text/css">	
		.nav-glyphish-example .ui-btn .ui-btn-inner { padding-top: 40px !important; }
		.nav-glyphish-example .ui-btn .ui-icon { width: 30px!important; height: 30px!important; margin-left: -15px !important; box-shadow: none!important; -moz-box-shadow: none!important; -webkit-box-shadow: none!important; -webkit-border-radius: none !important; border-radius: none !important; }
		#home .ui-icon { background:  url(images/icons/home.png) 50% 50% no-repeat; background-size: 32px 32px; }
		#publicar .ui-icon { background:  url(images/icons/googlecode.png) 50% 50% no-repeat; background-size: 32px 32px; }
		#chat .ui-icon { background:  url(images/icons/contact.png) 50% 50% no-repeat; background-size: 32px 32px;  }
	</style>
		<div data-role="footer">
			<div data-role="navbar" class="nav-glyphish-example ui-navbar" data-grid="b" role="navigation">
				<ul class="ui-grid-a">
					<li class="ui-block-a" ><a href="http://www.5niu.org/datepicker" rel="external"  target="_blank" id="home" data-icon="custom" data-theme="a" class="ui-btn ui-btn-icon-top ui-btn-hover-a ui-btn-up-a" ><span class="ui-btn-text">�ҵĲ���</span><span class="ui-icon ui-icon-custom"></span></a></li>
					<li class="ui-block-b"><a href="http://code.google.com/p/jquerymobile-datepicker-zh/" target="_blank" rel="external" id="publicar" data-icon="custom" data-theme="a" class="ui-btn ui-btn-icon-top ui-btn-up-a" data-rel="dialog" data-transition="pop"><span class="ui-btn-text">Google�����й�</span><span class="ui-icon ui-icon-custom"></span></a></li>
					<li class="ui-block-c"><a href="mailto:dgunzi@5niu.org" id="chat" data-icon="custom" data-theme="a" class="ui-btn ui-btn-up-a ui-btn-icon-top"  data-rel="dialog" data-transition="pop"><span class="ui-btn-text">��ϵ��</span><span class="ui-icon ui-icon-custom"></span></a></li>			
				</ul>
			</div>
		</div>
</div>
</html>
