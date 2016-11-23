var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var enums = require("ui/enums");
var contentView = require("ui/content-view");
function isValidOrientation(value) {
    return value === enums.Orientation.vertical || value === enums.Orientation.horizontal;
}
exports.orientationProperty = new dependencyObservable.Property("orientation", "SwiperContainer", new proxy.PropertyMetadata(enums.Orientation.vertical, dependencyObservable.PropertyMetadataSettings.AffectsLayout, undefined, isValidOrientation));
var SwiperContainer = (function (_super) {
    __extends(SwiperContainer, _super);
    function SwiperContainer() {
        _super.apply(this, arguments);
        this._scrollChangeCount = 0;
    }
    Object.defineProperty(SwiperContainer.prototype, "orientation", {
        get: function () {
            return this._getValue(exports.orientationProperty);
        },
        set: function (value) {
            this._setValue(exports.orientationProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    SwiperContainer.prototype.addEventListener = function (arg, callback, thisArg) {
        _super.prototype.addEventListener.call(this, arg, callback, thisArg);
        if ( arg === SwiperContainer.scrollEvent || arg === SwiperContainer.startEvent || arg === SwiperContainer.finishEvent || arg === SwiperContainer.changeEvent || arg === SwiperContainer.cancellEvent) {
            this._scrollChangeCount++;
            this.attach();
        }
    };
    SwiperContainer.prototype.removeEventListener = function (arg, callback, thisArg) {
        _super.prototype.addEventListener.call(this, arg, callback, thisArg);
        if ( arg === SwiperContainer.scrollEvent || arg === SwiperContainer.startEvent || arg === SwiperContainer.finishEvent || arg === SwiperContainer.changeEvent || arg === SwiperContainer.cancellEvent) {
            this._scrollChangeCount--;
            this.dettach();
        }
    };
    SwiperContainer.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this.attach();
    };
    SwiperContainer.prototype.onUnloaded = function () {
        _super.prototype.onUnloaded.call(this);
        this.dettach();
    };
    SwiperContainer.prototype.attach = function () {
        if (this._scrollChangeCount > 0 && this.isLoaded) {
            this.attachNative();
        }
    };
    SwiperContainer.prototype.dettach = function () {
        if (this._scrollChangeCount === 0 && this.isLoaded) {
            this.dettachNative();
        }
    };
    SwiperContainer.prototype.attachNative = function () {
    };
    SwiperContainer.prototype.dettachNative = function () {
    };

    Object.defineProperty(SwiperContainer.prototype, "hasNext", {
        get: function () {
            return !!0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SwiperContainer.prototype, "hasPrevious", {
        get: function () {
            return !!0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SwiperContainer.prototype, "currentIndex", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    // scrollview 
    Object.defineProperty(SwiperContainer.prototype, "horizontalOffset", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SwiperContainer.prototype, "verticalOffset", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SwiperContainer.prototype, "scrollableWidth", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SwiperContainer.prototype, "scrollableHeight", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    SwiperContainer.prototype.scrollToVerticalOffset = function (value, animated) {
    };
    SwiperContainer.prototype.scrollToHorizontalOffset = function (value, animated) {
    };
    SwiperContainer.prototype.nextSlide = function (animated) {
    };
    SwiperContainer.prototype.previousSlide = function (animated) {
    };
    SwiperContainer.prototype.goToSlide = function (value,animated) {
    };
    SwiperContainer.prototype.refresh = function () {
    };

    SwiperContainer.startEvent = "start";
    SwiperContainer.cancellEvent = "cancell";
    SwiperContainer.changeEvent = "change";
    SwiperContainer.finishEvent = "finish";
    SwiperContainer.scrollEvent = "scroll";
    return SwiperContainer;
}(contentView.ContentView));
exports.SwiperContainer = SwiperContainer;
