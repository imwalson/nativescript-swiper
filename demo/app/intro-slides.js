var app = require('application');
var platformModule = require("platform");
var Observable = require("data/observable").Observable;
var frameModule = require("ui/frame");
var page;
var source;
var swiperContainer;
var swiperWrapper;
var screenWidth;

function onPageNavigatedTo(args) {
    page = args.object;
    swiperContainer = page.getViewById("swiper-container");
    swiperWrapper = page.getViewById("swiper-wrapper");
    screenWidth = platformModule.screen.mainScreen.widthDIPs;
    source = new Observable();
    source.set("activeIndex", 0);
    page.bindingContext = source;
    //handles application orientation change
    app.on(app.orientationChangedEvent, function (args) {
        setTimeout(function() {
            swiperWrapper.eachLayoutChild(function(slide){
                slide.width = platformModule.screen.mainScreen.widthDIPs;
                swiperContainer.refresh();
            })
        }, 10);
    })
    
}
exports.onPageNavigatedTo = onPageNavigatedTo;

exports.onChanged = function (args) {
    console.log("onChanged,preIndex" + args.preIndex + "，currentIndex：" + args.currentIndex + "，slidesCount：" + args.slidesCount);
    source.set("activeIndex", args.currentIndex);
}
exports.onCancelled = function (args) {
    console.log("onCancelled,currentIndex：" + args.currentIndex + "，slidesCount：" + args.slidesCount);
}
exports.onStart = function (args) {
    console.log("onStart,currentIndex：" + args.currentIndex + "，slidesCount：" + args.slidesCount);
}
exports.onFinished = function (args) {
    console.log("onFinished,currentIndex：" + args.currentIndex + "，slidesCount：" + args.slidesCount);
}
