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

(function($) {
    
    'use strict';
    var _Touch = function(el){
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

            start : function (e) {
                if (e.type === 'touchstart') {
                    this.hasTouchEventOccured = true;
                }
                this.moved = false;
                this.startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
                this.startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            },

            move : function (e) {
                //if finger moves more than 10px flag to cancel
                // 移动大于10px的时候认为移动了
                if (Math.abs(e.touches[0].clientX - this.startX) > 10 || Math.abs(e.touches[0].clientY - this.startY) > 10) {
                    if(e.touches[0].clientX - this.startX > 0){
                        this.moveDirection = 'right';
                    }
                    if(e.touches[0].clientX - this.startX < 0){
                        this.moveDirection = 'left';
                    }
                    this.moved = true;
                }
            },

            end : function (e) {
                var evt;
                if (this.hasTouchEventOccured) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.hasTouchEventOccured = false;
                    //return;
                }

                if (!this.moved) {
                    evt = createCustomEvent('tap');
                }else{
                    if(this.moveDirection == 'left'){
                        evt = createCustomEvent('swipeleft');
                    }else{
                        evt = createCustomEvent('swiperight');
                    }
                }
                // dispatchEvent returns false if any handler calls preventDefault,
                if (!e.target.dispatchEvent(evt)) {
                    // in which case we want to prevent clicks from firing.
                    e.preventDefault();
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
                    case 'touchcancel': this.cancel(e); break;
                }
            }
        };
        return touch;
         
    };
    var Touch = function(el){
        var func = _Touch(el);
        el.addEventListener('touchstart', func, false);
        el.addEventListener('touchmove', func, false);
        el.addEventListener('touchend', func, false);
        el.addEventListener('touchcancel', func, false);
    };
    var unTouch = function(el){
        _Touch(el).destroy();
    };
    var oldBind = $.fn.on,
        oldUnBind = $.fn.off,
        onArray = [];//对于相同的el只绑定一次
    $.fn.on = function( evt ){

        if( /(^| )(tap|swipeleft|swiperight)( |$)/.test( evt ) ){
            if(onArray.length == 0){
                for(var i=0;i<this.length;i++){
                    onArray.push(this[i]);
                    Touch(this[i]);
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
                        Touch(this[i]);
                    }
                }
            }
        }
        return oldBind.apply( this, arguments );
    };
    $.fn.off = function( evt ){
        if( /(^| )(tap|swipeleft|swiperight)( |$)/.test( evt ) ){
            for(var i=0; i<this.length; i++){
                unTouch( this[i] );
            }
        }
        return oldUnBind.apply( this, arguments );
    };
 
})(Zepto);
