var app = require('application');
var view = require("ui/core/view");
var common = require("./nativescript-swiper-common");
var enums = require("ui/enums");
var utils = require("utils/utils");
var platformModule = require("platform");
var stack_layout_1 = require('ui/layouts/stack-layout');
global.moduleMerge(common, exports);

var SwiperWrapper = (function (_super) {
    __extends(SwiperWrapper, _super);
    function SwiperWrapper() {
        _super.call(this, arguments);
        this.orientation = "horizontal";
    }
    return SwiperWrapper;
}(stack_layout_1.StackLayout));
exports.SwiperWrapper = SwiperWrapper;

var SwiperSlide = (function (_super) {
    __extends(SwiperSlide, _super);
    function SwiperSlide() {
        _super.call(this, arguments);
        var _this = this;
        _this.width = platformModule.screen.mainScreen.widthDIPs;
    }

    return SwiperSlide;
}(stack_layout_1.StackLayout));
exports.SwiperSlide = SwiperSlide;

var UIScrollViewDelegateImpl = (function (_super) {
    __extends(UIScrollViewDelegateImpl, _super);
    function UIScrollViewDelegateImpl() {
        _super.apply(this, arguments);
    }
    UIScrollViewDelegateImpl.initWithOwner = function (owner) {
        var impl = UIScrollViewDelegateImpl.new();
        impl._owner = owner;
        impl._offsetX = 0;
        impl._currentIndex = 0;
        impl._slidesCount = 0;
        return impl;
    };
    // 开始滚动视图
    UIScrollViewDelegateImpl.prototype.scrollViewWillBeginDragging = function (sv) {
        //console.log("开始滚动视图");
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        if (owner) {
            var scrollableWidth = Math.max(0, sv.contentSize.width - sv.bounds.size.width);
            this._slidesCount = Math.round(scrollableWidth/platformModule.screen.mainScreen.widthDIPs) + 1;
            if(owner.horizontalOffset >= 0 && owner.horizontalOffset <= scrollableWidth){
                this._offsetX = owner.horizontalOffset;
            }else if(owner.horizontalOffset < 0){
                this._offsetX = 0;
            }else{
                this._offsetX = scrollableWidth;
            }
            this._currentIndex = Math.round(this._offsetX/platformModule.screen.mainScreen.widthDIPs);
            // pan start
            owner.notify({
                object: owner,
                eventName: "start",
                currentIndex: this._currentIndex,
                slidesCount: this._slidesCount
            });
        }
    };
    // 滚动视图减速完成，滚动将停止时，调用该方法。一次有效滑动，只执行一次。
    UIScrollViewDelegateImpl.prototype.scrollViewDidEndDecelerating = function (sv) {
        //console.log("滚动视图减速完成，滚动将停止");
        var owner = this._owner.get();
        //console.log(owner);
        if (!owner) {
            console.log("cannot find owner");
            return;
        }
        if (owner) {
            var lastIndex = this._currentIndex;
            //console.log("lastIndex:" + lastIndex);
            var scrollableWidth = Math.max(0, sv.contentSize.width - sv.bounds.size.width);
            this._slidesCount = Math.round(scrollableWidth/platformModule.screen.mainScreen.widthDIPs) + 1;
            if(owner.horizontalOffset >= 0 && owner.horizontalOffset <= scrollableWidth){
                this._offsetX = owner.horizontalOffset;
            }else if(owner.horizontalOffset < 0){
                this._offsetX = 0;
            }else{
                this._offsetX = scrollableWidth;
            }
            //console.log("_offsetX:" + this._offsetX);
            var newIndex = Math.round(this._offsetX/platformModule.screen.mainScreen.widthDIPs);
            //console.log("newIndex:" + newIndex);
            if(newIndex === lastIndex){ // index没有改变
                console.log("index 没有改变");
                owner.notify({
                    object: owner,
                    eventName: "cancell",
                    currentIndex: this._currentIndex,
                    slidesCount: this._slidesCount
                });
            }else{// index 有改变
                this._currentIndex = newIndex;
                console.log("index 有改变");
                owner.notify({
                    object: owner,
                    eventName: "change",
                    preIndex: lastIndex,
                    currentIndex: newIndex,
                    slidesCount: this._slidesCount
                });
                // 如果到了最后一个 slide
                if( (this._currentIndex + 1) === this._slidesCount){
                    owner.notify({
                        object: owner,
                        eventName: "finish",
                        currentIndex: newIndex,
                        slidesCount: this._slidesCount
                    });
                }
            }
        }
    };
    UIScrollViewDelegateImpl.ObjCProtocols = [UIScrollViewDelegate];
    return UIScrollViewDelegateImpl;
}(NSObject));
var SwiperContainer = (function (_super) {
    __extends(SwiperContainer, _super);
    function SwiperContainer() {
        _super.call(this);
        this.orientation = "horizontal";
        this._contentMeasuredWidth = 0;
        this._contentMeasuredHeight = 0;
        this._scroll = UIScrollView.new();
        this._scroll.showsHorizontalScrollIndicator = false; // 隐藏滚动条
        this._scroll.pagingEnabled = true; // 开启分页
        this._scroll.decelerationRate = 0.0; // 惯性加速度最小，滑动阻力最大
    }
    SwiperContainer.prototype.attachNative = function () {
        this._delegate = UIScrollViewDelegateImpl.initWithOwner(new WeakRef(this));
        this._scroll.delegate = this._delegate;
    };
    SwiperContainer.prototype.dettachNative = function () {
        this._scroll.delegate = null;
    };

    Object.defineProperty(SwiperContainer.prototype, "hasNext", {
        get: function () {
            return ( this.scrollableWidth === this.horizontalOffset ) ? false : true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SwiperContainer.prototype, "hasPrevious", {
        get: function () {
            return ( 0 === this.horizontalOffset ) ? false : true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SwiperContainer.prototype, "currentIndex", {
        get: function () {
            return Math.round(this.horizontalOffset/platformModule.screen.mainScreen.widthDIPs);
        },
        enumerable: true,
        configurable: true
    });
    //
    Object.defineProperty(SwiperContainer.prototype, "horizontalOffset", {
        get: function () {
            return this._scroll.contentOffset.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SwiperContainer.prototype, "verticalOffset", {
        get: function () {
            return this._scroll.contentOffset.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SwiperContainer.prototype, "scrollableWidth", {
        get: function () {
            if (this.orientation !== enums.Orientation.horizontal) {
                return 0;
            }
            return Math.max(0, this._scroll.contentSize.width - this._scroll.bounds.size.width);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SwiperContainer.prototype, "scrollableHeight", {
        get: function () {
            if (this.orientation !== enums.Orientation.vertical) {
                return 0;
            }
            return Math.max(0, this._scroll.contentSize.height - this._scroll.bounds.size.height);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SwiperContainer.prototype, "ios", {
        get: function () {
            return this._scroll;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SwiperContainer.prototype, "_nativeView", {
        get: function () {
            return this._scroll;
        },
        enumerable: true,
        configurable: true
    });

    SwiperContainer.prototype.nextSlide = function (animated) {
        var _this = this;
        if (!_this.hasNext) {
            console.log("has no next Slide");
        }else{
            _this.scrollToHorizontalOffset(_this.horizontalOffset + platformModule.screen.mainScreen.widthDIPs, animated);
        }
    };
    SwiperContainer.prototype.previousSlide = function (animated) {
        var _this = this;
        if (!_this.hasPrevious) {
            console.log("has no previous Slide");
        }else{
            _this.scrollToHorizontalOffset(_this.horizontalOffset - platformModule.screen.mainScreen.widthDIPs, animated);
        }
    };
    SwiperContainer.prototype.goToSlide = function (value,animated) {
        var _this = this;
        if( (value | 0) !== value ){
            console.log("index must be an integer");
            return;
        }
        if( value < 0 || value > Math.round(_this.scrollableWidth/platformModule.screen.mainScreen.widthDIPs) ){
            console.log("invalid index");
            return;
        }
        if( value === Math.round(_this.horizontalOffset/platformModule.screen.mainScreen.widthDIPs) ){
            console.log("already at slide " + value );
            return;
        }
        _this.scrollToHorizontalOffset( value * platformModule.screen.mainScreen.widthDIPs , animated);
        
    };
    SwiperContainer.prototype.refresh = function () {
        this.scrollToHorizontalOffset(0);
    };

    SwiperContainer.prototype.scrollToVerticalOffset = function (value, animated) {
        if (this.orientation === enums.Orientation.vertical) {
            var bounds = this._scroll.bounds.size;
            this._scroll.scrollRectToVisibleAnimated(CGRectMake(0, value, bounds.width, bounds.height), animated);
        }
    };
    SwiperContainer.prototype.scrollToHorizontalOffset = function (value, animated) {
        if (this.orientation === enums.Orientation.horizontal) {
            var bounds = this._scroll.bounds.size;
            this._scroll.scrollRectToVisibleAnimated(CGRectMake(value, 0, bounds.width, bounds.height), animated);
        }
    };
    SwiperContainer.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var density = utils.layout.getDisplayDensity();
        var child = this.layoutView;
        if (!child) {
            this._contentMeasuredWidth = this.minWidth * density;
            this._contentMeasuredHeight = this.minHeight * density;
        }
        else {
            var childSize;
            if (this.orientation === enums.Orientation.vertical) {
                childSize = view.View.measureChild(this, child, widthMeasureSpec, utils.layout.makeMeasureSpec(0, utils.layout.UNSPECIFIED));
            }
            else {
                childSize = view.View.measureChild(this, child, utils.layout.makeMeasureSpec(0, utils.layout.UNSPECIFIED), heightMeasureSpec);
            }
            this._scroll.contentSize = CGSizeMake(childSize.measuredWidth, childSize.measuredHeight);
            this._contentMeasuredWidth = Math.max(childSize.measuredWidth, this.minWidth * density);
            this._contentMeasuredHeight = Math.max(childSize.measuredHeight, this.minHeight * density);
        }
        var widthAndState = view.View.resolveSizeAndState(this._contentMeasuredWidth, width, widthMode, 0);
        var heightAndState = view.View.resolveSizeAndState(this._contentMeasuredHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    SwiperContainer.prototype.onLayout = function (left, top, right, bottom) {
        var width = (right - left);
        var height = (bottom - top);
        if (this.orientation === enums.Orientation.horizontal) {
            view.View.layoutChild(this, this.layoutView, 0, 0, Math.max(this._contentMeasuredWidth, width), height);
        }
        else {
            view.View.layoutChild(this, this.layoutView, 0, 0, width, Math.max(this._contentMeasuredHeight, height));
        }
    };
    return SwiperContainer;
}(common.SwiperContainer));
exports.SwiperContainer = SwiperContainer;
