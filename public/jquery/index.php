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

		<h3>背景</h3>
			<p>Jquery Mobile官方的日期选择器在它的文档中还处于实验阶段，而且也没有看到官方的论坛上有什么人在用。于是有人开发了日期选择框。我搜索后找到了两个结果一个是<a href="http://toddmhorst.wordpress.com/2010/12/30/android-like-date-picker-with-jquery-mobile-2/" rel="external"  target="_blank">Todd M. Horst编写的日期选择器</a>，另一个是<a href="jQuery-Mobile-DateBox" rel="external"  target="_blank">jQuery-Mobile-DateBox</a>在前者的基础上开发出来的。后者看着样子不错，有两个样式，一个是Android版的，一个是日历版的样式，可就是实际用起来不是很给力。我在Jquery Mobile中文社区发了篇文章<a href="http://www.jqmobile.org/thread-98-1-1.html" rel="external"  target="_blank">《jquery mobile时间选择器和日期选择器》</a>，很多朋友反映说后者根本不好用。我也试用了一下，发现在我的iPad上根本不能用。很自然，我的项目就采用了前者，后来发现也不是很如意。弹出层效果在iPad上，如果页面高度很高的情况下，弹出层仅覆盖页面的上半部分选择框在这部分的中间，并不是像在pc上一样，弹出在页面的当前位置上。于是我便有了修改弹出层效果的想法。</p>
		<h3>简介</h3>
				<p>jQuery Mobile日期选择器插件汉化整理版，对<a href="http://toddmhorst.wordpress.com/2010/12/30/android-like-date-picker-with-jquery-mobile-2/" rel="external"  target="_blank">Todd M. Horst编写的日期选择器</a>做了汉化和进一步封装。</p> 
				<ul>
					<li>对Todd M. Horst编写的日期选择器进行了封装，防止污染Javascript全局环境，避免命名冲突</li>
					<li>修改了它原有的弹出层效果，将原有的<a href="http://dev.iceburg.net/jquery/jqModal/" rel="external"  target="_blank">jqModal</a>效果换为<a href="http://dev.jtsage.com/jQM-SimpleDialog/" rel="external"  target="_blank">SimpleDialog效果</a>，使其更加绚丽，更加像原生的日期选择控件。</li> 
					<li>对原有的时间操作js文件(dFormat.js)进行了汉化，使其更加符合中文环境。</li> 
					<li>通过句柄函数实现了文本框和日期选择控件的关联，使得插件使用更加简便。</li>
				</ul>
		<div>
			<h3>使用方法</h3>
			1、引入css样式文件和js文件(注：注意这里js的加载顺序)
			<pre>
			<code> 
&lt;link rel=&quot;stylesheet&quot; href=&quot;./jquery.mobile.simpledialog.css&quot; type=&quot;text/css&quot;&gt;&lt;/link&gt;
&lt;link rel=&quot;stylesheet&quot; href=&quot;./datepicker.css&quot; type=&quot;text/css&quot;/&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;./dFormat.js&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;./datepicker.js&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;./jquery.mobile.simpledialog.js&quot;&gt;&lt;/script&gt;
			</code>
			</pre> 
			2、给页面添加必须的图层
			<pre>
			<code> 
&lt;div style=&quot;position:absolute; left:-9999px;&quot;&gt;&lt;a href=&quot;#&quot; id=&quot;setfoc&quot;&gt;&lt;/a&gt;&lt;/div&gt;
			</code>
			</pre> 
			3、为文本框绑定日期选择控件(注：dateId为文本框的id)
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
		
		<h3>示例</h3>
		<label for="date">日期选择实例：</label><input type="text" id="date"  name="date" value=""/>
		</div>
		<div>
			<h3>
			欢迎大家下载使用，下面有我的博客地址，大家可以给我留言。
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
					<li class="ui-block-a" ><a href="http://www.5niu.org/datepicker" rel="external"  target="_blank" id="home" data-icon="custom" data-theme="a" class="ui-btn ui-btn-icon-top ui-btn-hover-a ui-btn-up-a" ><span class="ui-btn-text">我的博客</span><span class="ui-icon ui-icon-custom"></span></a></li>
					<li class="ui-block-b"><a href="http://code.google.com/p/jquerymobile-datepicker-zh/" target="_blank" rel="external" id="publicar" data-icon="custom" data-theme="a" class="ui-btn ui-btn-icon-top ui-btn-up-a" data-rel="dialog" data-transition="pop"><span class="ui-btn-text">Google代码托管</span><span class="ui-icon ui-icon-custom"></span></a></li>
					<li class="ui-block-c"><a href="mailto:dgunzi@5niu.org" id="chat" data-icon="custom" data-theme="a" class="ui-btn ui-btn-up-a ui-btn-icon-top"  data-rel="dialog" data-transition="pop"><span class="ui-btn-text">联系我</span><span class="ui-icon ui-icon-custom"></span></a></li>			
				</ul>
			</div>
		</div>
</div>
</html>
