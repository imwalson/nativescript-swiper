var app = require("application");
var observableModule = require("data/observable");
var platformModule = require("platform");
var enums = require("ui/enums");
var frameModule = require("ui/frame");
var page;
var source;
var swiperContainer;
var swiperWrapper;
var tabIndicators;

exports.onPageNavigatedTo = function(args){ 
    page = args.object;
    swiperContainer = page.getViewById("swiper-container"); 
    swiperWrapper = page.getViewById("swiper-wrapper");
    source = new observableModule.Observable();
    source.set("indicatorX", 0); 
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
// change indicators when swiper scroll
exports.onScroll = function(args) {
    source.set("indicatorX", args.scrollX/args.slidesCount); 
}

// change tab title color when slide changed index
exports.onChanged = function(args) {
    var index = args.currentIndex;
    source.set("tabIndex", index); 
}

// change slide index when tap tab titles
exports.switchTab = function(args) {
    var view = args.object;
    var idx = view.get("data-index");
    if(idx == source.get("tabIndex")){
        return;
    }
    source.set("tabIndex", idx); 
    swiperContainer.goToSlide(idx,true);
}

