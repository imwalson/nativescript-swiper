var app = require('application');
var platformModule = require("platform");
var Observable = require("data/observable").Observable;
var frameModule = require("ui/frame");
var page;
var source;
var swiperContainer;
var swiperWrapper;
var screenWidth;
var n = 0;

function onPageNavigatedTo(args) {
    page = args.object;
    swiperContainer = page.getViewById("swiper-container");
    swiperWrapper = page.getViewById("swiper-wrapper");
    screenWidth = platformModule.screen.mainScreen.widthDIPs;
    source = new Observable();
    source.set("screenWidth", screenWidth);
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

exports.nextSlide = function (args) {
    swiperContainer.nextSlide(true);
}
exports.previousSlide = function (args) {
    swiperContainer.previousSlide(true);
}
exports.goToSlide2 = function (args) {
    swiperContainer.goToSlide(2,true);
}

exports.onBtnTap = function (args) {
    var SwiperSlide = require("nativescript-swiper").SwiperSlide;
    var newSwiperSlideItem = new SwiperSlide();
    newSwiperSlideItem.height = "100%";
    newSwiperSlideItem.backgroundColor = "#000";
    newSwiperSlideItem.verticalAlignment = "center";
    var LabelModule = require("ui/label");
    var label = new LabelModule.Label();
    label.text = "this is a new SwiperSlide item "+n+",tap to remove it";
    label.color = "#fff";
    label.verticalAlignment = "center";
    label.horizontalAlignment = "center";
    newSwiperSlideItem.addChild(label);
    n ++;
    swiperWrapper.addChild(newSwiperSlideItem);
    label.on('tap',function(args){
        swiperWrapper.removeChild(newSwiperSlideItem);
        n --;
    });

}