touch
==========
实现手机上tap,swipe事件

## 说明
* 在tap.js的基础上增加了swipe的功能
* tap.js 地址:https://github.com/alexgibson/tap.js

##使用方法

*html代码如下
<pre><code><script src="touch.js"></script></code></pre>

*js代码如下
<pre><code>
var el = document.getElementById('your el');
new Touch(el);

el.addEventListener('tap',onTap,false);
el.addEventListener('swipeleft',onSwipeleft,false);
el.addEventListener('swiperight',onSwipeRight,false);
function onTap(){//tap动作}
function onSwipeLeft(){//左滑}
function onSwipeRight(){//右滑}
</code></pre>

##基于zepto的touch模块,依赖zepto
* 暂时不支持绑定代理事件
* html代码如下
<pre><code>
	<script src="zepto.js"></script>
	<script src="zepto-touch.js"></script>
</pre></code>
*js代码如下
<pre><code>
	//绑定事件
	$(el).on('tap',function(){});
    $(el).on('swipeleft',function(){});
    $(el).on('swiperight',function(){});
    //解绑事件
    $(el).off('tap',function(){});
    $(el).off('swipeleft',function(){});
    $(el).off('swiperight',function(){});
</code></pre>