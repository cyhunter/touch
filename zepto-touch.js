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

    function Touch(el) {
        el = typeof el === 'object' ? el : document.getElementById(el);
        this.element = el;
        this.moved = false; //flags if the finger has moved
        this.moveDirection = '';//moved direction
        this.startX = 0; //starting x coordinate
        this.startY = 0; //starting y coordinate
        this.hasTouchEventOccured = false; //flag touch event
        el.addEventListener('touchstart', this, false);
        el.addEventListener('touchmove', this, false);
        el.addEventListener('touchend', this, false);
        el.addEventListener('touchcancel', this, false);
    }

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
    
    Touch.prototype.start = function (e) {
        if (e.type === 'touchstart') {
            this.hasTouchEventOccured = true;
        }
        this.moved = false;
        this.startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        this.startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    };

    Touch.prototype.move = function (e) {
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
    };

    Touch.prototype.end = function (e) {
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
    };

    Touch.prototype.cancel = function (e) {
        this.hasTouchEventOccured = false;
        this.moved = false;
        this.startX = 0;
        this.startY = 0;
    };

    Touch.prototype.destroy = function () {
        var el = this.element;
        el.removeEventListener('touchstart', this, false);
        el.removeEventListener('touchmove', this, false);
        el.removeEventListener('touchend', this, false);
        el.removeEventListener('touchcancel', this, false);
        this.element = null;
    };

    Touch.prototype.handleEvent = function (e) {
        switch (e.type) {
        case 'touchstart': this.start(e); break;
        case 'touchmove': this.move(e); break;
        case 'touchend': this.end(e); break;
        case 'touchcancel': this.cancel(e); break;
        }
    };
    
    var oldBind = $.fn.on;
	$.fn.on = function( evt ){
		if( /(^| )(tap|swipe)( |$)/.test( evt ) ){
			new Touch( this[0] );
		}
		return oldBind.apply( this, arguments );
	};
 
})(Zepto);

