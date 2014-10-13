zepto-touch.js
==========
实现手机上tap,swipe事件

##基于zepto的touch模块zepto-touch.js,依赖zepto
* 事件绑定在对应的dom元素上
* 解决事件穿透问题
* touch事件对于的clientX等详细信息，在tap事件的e.detail中查看 例如：$('dom').on('tap',function(e){x = e.detail.clientX;//自行在e.detail中查看详细内容});
* 暂时不支持代理的方式绑定事件，后续加上


* html代码如下

```html
	<script src="zepto.js"></script>
	<script src="zepto-touch.js"></script>
```

* js代码如下

```javascript
	//绑定事件
	$(el).on('tap',function(){});
    $(el).on('swipeleft',function(){});
    $(el).on('swiperight',function(){});
    //解绑事件
    $(el).off('tap',function(){});
    $(el).off('swipeleft',function(){});
    $(el).off('swiperight',function(){});
```

touch
==========
实现手机上tap,swipe事件

## 说明
* 在tap.js的基础上增加了swipe的功能
* tap.js 地址:https://github.com/alexgibson/tap.js

##使用方法

* html代码如下

```html
    <script src="touch.js"></script>
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