touch
=====

实现手机上tap,swipe事件

##说明
 *  在tap.js的基础上增加了swipe的功能
 *  tap.js 地址:https://github.com/alexgibson/tap.js

##使用方法
* html代码如下

```html
	<script src="touch.js"></script>
```
```
* js代码如下

```javascript
	var el = document.getElementById('your el');
	new Touch(el);

	el.addEventListener('tap',onTap,false);
	el.addEventListener('swipeleft',onSwipeleft,false);
	el.addEventListener('swiperight',onSwipeRight,false);
	function onTap(){//tap动作}
	function onSwipeLeft(){//左滑}
	function onSwipeRight(){//右滑}

```
##基于zepto的touch模块,依赖zepto
* 暂时不支持绑定代理事件
* html代码如下

```html
	<script src="zepto-touch.js"></script>
```
```
* js代码如下

```javascript

	$(el).on('tap',function(){});
	$(el).on('swipeleft',function(){});
	$(el).on('swiperight',function(){});
```