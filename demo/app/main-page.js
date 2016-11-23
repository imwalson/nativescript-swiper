var app = require('application');
var platformModule = require("platform");
var Observable = require("data/observable").Observable;
var frameModule = require("ui/frame");
var page;


function onPageNavigatedTo(args) {
    page = args.object;   
}
exports.onPageNavigatedTo = onPageNavigatedTo;

exports.goto = function (args) {
    var nav = args.object.get("nav");
    frameModule.topmost().navigate(nav);
}

