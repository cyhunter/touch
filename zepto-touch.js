/**CustomEvent polyfill https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent*/
(function () {
    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    };

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();

/**
 * 基于zepto的touch事件，事件只会绑定在特定的元素上，不会绑定到document上
 */
(function($) {
    'use strict';
    var t,x,y;
    var _Touch = function(el,evt){
        function createCustomEvent(touchName){
            var evt;
            if (window.CustomEvent) {
                evt = new window.CustomEvent(touchName, {
                    bubbles: true,
                    cancelable: true
                });
            } else {
                evt = document.createEvent('Event');
                evt.initEvent(touchName, true, true);
            }
            return evt;
        } 
        var touch = {
            el : typeof el === 'object' ? el : document.getElementById(el),
            element : el,
            moved : false, //flags if the finger has moved
            moveDirection : '',//moved direction
            startX : 0, //starting x coordinate
            startY : 0, //starting y coordinate
            hasTouchEventOccured : false, //flag touch event
            initEvt : evt,

            start : function (e) { 
                
                if (e.type === 'touchstart') {
                    this.hasTouchEventOccured = true;
                }
                this.moved = false;
                this.startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
                this.startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
                x = e.touches[0].clientX;
                y = e.touches[0].clientY;
                this.moveDirection = '';
            },

            move : function (e) {
                //if finger moves more than 30px flag to cancel
                // 移动大于30px的时候认为移动了
            
                if (Math.abs(e.touches[0].clientX - this.startX) > 30 || Math.abs(e.touches[0].clientY - this.startY) > 10) {
                    if(e.touches[0].clientX - this.startX > 0){
                        this.moveDirection = 'right';
                    }
                    if(e.touches[0].clientX - this.startX < 0){
                        this.moveDirection = 'left';
                    }
                    this.moved = true;
                   
                }
                x = e.touches[0].clientX;
                y = e.touches[0].clientY;
            },
            end : function (e) {
               
                var evt;
                if (this.hasTouchEventOccured) {

                    e.preventDefault();
                    //e.stopPropagation();不阻止冒泡，是为了让在父元素也能够获取到touchend事件
                    this.hasTouchEventOccured = false;
                    //return;
                }
              
                if (!this.moved) {
                    if(this.initEvt == 'tap'){
                        evt = createCustomEvent('tap');
                    }
                }else{
                    if(this.initEvt == 'swipeleft' || this.initEvt == 'swiperight'){
                        if(this.moveDirection == 'left'){
                            evt = createCustomEvent('swipeleft');
                        }else{
                            evt = createCustomEvent('swiperight');
                        }
                    }
                }
                // dispatchEvent returns false if any handler calls preventDefault,
                if (evt && !e.target.dispatchEvent(evt)) {
                    // in which case we want to prevent clicks from firing.
                    e.preventDefault();
                }
                //不支持preventDefault的机型，才会去click里面阻止click的原生行为
                if(!e.defaultPrevented){
                    t = new Date();
                }
            },
            cancel : function (e) {
              
                this.hasTouchEventOccured = false;
                this.moved = false;
                this.startX = 0;
                this.startY = 0;
            },
            destroy : function(){
                var el = this.element;
                el.removeEventListener('touchstart', this, false);
                el.removeEventListener('touchmove', this, false);
                el.removeEventListener('touchend', this, false);
                el.removeEventListener('touchcancel', this, false);
                this.element = null;
            },
            handleEvent : function(e){
                 switch (e.type) {
                    case 'touchstart': this.start(e); break;
                    case 'touchmove': this.move(e); break;
                    case 'touchend': this.end(e); break;
                    case 'touchcancel': this.end(e); break;// touchcancel == touchend
                }
            }
        };

        return touch;
         
    };
    var Touch = function(el,evt){
        var func = _Touch(el,evt);

        el.addEventListener('touchstart', func, false);
        el.addEventListener('touchmove', func, false);
        el.addEventListener('touchend', func, false);
        el.addEventListener('touchcancel', func, false);

    };
    var unTouch = function(el,evt){
        _Touch(el,evt).destroy();
    };
    var oldBind = $.fn.on,
        oldUnBind = $.fn.off,
        onArray = [];
    $.fn.on = function( evt ){
        
        if( /(^| )(tap|swipeleft|swiperight)( |$)/.test( evt ) ){ 
            //为了不在同一个dom上绑定多次touch方法，因为tap,swipe事件其实都是封装的相同的touchstart,touchmove,touchend事件
            if(onArray.length == 0){
                for(var i=0;i<this.length;i++){
                    onArray.push(this[i]);
                    Touch(this[i],evt);
                }
            }else{
                var length = onArray.length;
                for(var i=0; i<this.length;i++){
                    var tap = 0;
                    for(var j=0;j<length;j++){
                        if(this[i] == onArray[j]){
                            tap = 1;
                            break;
                        }
                    }
                    if(tap == 0){
                        onArray.push(this[i]);
                        Touch(this[i],evt);
                    }
                }
            }
        }
        return oldBind.apply( this, arguments );
    };
    $.fn.off = function( evt ){
        if( /(^| )(tap|swipeleft|swiperight)( |$)/.test( evt ) ){
            for(var i=0 ;i<this.length;i++){
               unTouch( this[i],evt );
            }
        }
        return oldUnBind.apply( this, arguments );
    };
    //去掉ghost click 详细见http://ariatemplates.com/blog/2014/05/ghost-clicks-in-mobile-browsers/
    window.addEventListener('click', function (e) {
        var time_threshold = 500,
            space_threshold = 100;
     
        if (new Date() - t <= time_threshold && Math.abs(e.clientX - x) <= space_threshold && Math.abs(e.clientY - y) <= space_threshold) {
            e.stopPropagation();
            e.preventDefault();
        }
    }, true);
}(Zepto));
