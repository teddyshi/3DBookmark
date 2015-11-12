var carrierWidthInputHiddenId = 'templateForm:PANEL_POPUP_WINDOW:createCarrierPluginView:carrier_width';
var carrierHeightInputHiddenId = 'templateForm:PANEL_POPUP_WINDOW:createCarrierPluginView:carrier_height';
var pluginWidthInputHiddenId = 'templateForm:PANEL_POPUP_WINDOW:createCarrierPluginView:plugin_width';
var pluginHeightInputHiddenId = 'templateForm:PANEL_POPUP_WINDOW:createCarrierPluginView:plugin_height';
var pluginClientId = 'templateForm:PANEL_POPUP_WINDOW:createCarrierPluginView:createCarrierPlugin';
var detectLocked = false;
var carrierSizeRefreshingLocked = false;
var resizingDetect = function(carrierSizeFlush) {
    var pluginWidthInputHidden = document.getElementById(pluginWidthInputHiddenId);
    var pluginHeightInputHidden = document.getElementById(pluginHeightInputHiddenId);
    var oldPluginSize = {width:pluginWidthInputHidden.value,height:pluginHeightInputHidden.value};
    var oldCarrierSize = {width:document.getElementById(carrierWidthInputHiddenId).value,height: document.getElementById(carrierHeightInputHiddenId).value};
    var newCarrierSize = getCurrentCarrierSize(carrierSizeFlush);
    var tolerance = 0.05;
    var _plugin = document.getElementById(pluginClientId);
    if (!_plugin) {
        UCF_JsUtil.clearIntervalCall(resizingListener);
        resizingListener = null;
        return;
    }
    var _currentPluginWidth = _plugin.offsetWidth;
    var _currentPluginHeight = _plugin.offsetHeight;
    var newPluginSize = {width:_currentPluginWidth,height:_currentPluginHeight};
    var detectResult = {
        changed:false,
        oldCarrierSize:oldCarrierSize,
        newCarrierSize:newCarrierSize,
        oldPluginSize:oldPluginSize,
        newPluginSize:newPluginSize
    };
    var widthComparision = sizeCompare(_currentPluginWidth, oldPluginSize.width , tolerance);
    var heightComparision = sizeCompare(_currentPluginHeight, oldPluginSize.height , tolerance);
    if (widthComparision != 0 || heightComparision != 0) {
        detectResult.changed = true;
    } 
    if (detectResult.changed && !detectLocked) {
        pluginWidthInputHidden.value = _currentPluginWidth;
        pluginHeightInputHidden.value = _currentPluginHeight;
    }
    if (detectLocked) {
        detectResult.changed='locked';
    }
    return detectResult;
};
var sizeCompare = function( newValue, oldValue, tolerance) {
    var diff = newValue * 100 - oldValue * 100;
    if (Math.abs(diff / (oldValue * 100)) >= tolerance) {
        return newValue < oldValue ? -1:1;
    } else {
        return 0;
    }
};
var getCurrentCarrierSize = function(flush) {
    var _carrier = document.getElementById('templateForm:PANEL_POPUP_WINDOW:createCarrierPluginView:carrier_panel');
    if(!carrierSizeRefreshingLocked&&(!flush||true===flush)){
        document.getElementById(carrierWidthInputHiddenId).value = _carrier.offsetWidth;
        document.getElementById(carrierHeightInputHiddenId).value = _carrier.offsetHeight;
    }
    return {width:_carrier.offsetWidth,height:_carrier.offsetHeight};
};
var lockCarrierSizeRefreshing = function(time){
    carrierSizeRefreshingLocked = true;
    if(typeof time ==='number'){
        UCF_JsUtil.delayedCall(time, this, 'unLockCarrierSizeRefreshing', null);
    }
};

var unLockCarrierSizeRefreshing = function(){
    carrierSizeRefreshingLocked = false;
};

var notifyWhenResized = function() {
    var detectResult = resizingDetect(true);
    if ('locked' === detectResult.changed) {
        return;
    }
    if (true === detectResult.changed) {
        detectLocked = true;
        UCF_JsUtil.delayedCall(300, this, 'notifyWhenResizingStopped', [detectResult]);
    }
};
var resizingListener = UCF_JsUtil.intervalCall(200, this, 'notifyWhenResized');


var notifyWhenResizingStopped = function(originalDetectResult){
    if(!originalDetectResult)return;
    detectLocked = false;
    var finalDetectRes = resizingDetect(false);
    var resizingStopped = !finalDetectRes.changed;
    if (resizingStopped) {
        var _carrier = document.getElementById('templateForm:PANEL_POPUP_WINDOW:createCarrierPluginView:carrier_panel');
        var widthDiff = originalDetectResult.oldPluginSize.width - finalDetectRes.newPluginSize.width;
        var heightDiff = originalDetectResult.oldPluginSize.height - finalDetectRes.newPluginSize.height;
        if(widthDiff<0||heightDiff<0){
            getCurrentCarrierSize(true);  
        }else{
            lockCarrierSizeRefreshing(500);
            carrierWidth = originalDetectResult.oldCarrierSize.width-widthDiff;
            carrierHeight = originalDetectResult.oldCarrierSize.height-heightDiff;
            document.getElementById(carrierWidthInputHiddenId).value = carrierWidth;
            document.getElementById(carrierHeightInputHiddenId).value = carrierHeight;
        }
        processButtonPress('templateForm:PANEL_POPUP_WINDOW:createCarrierPluginView:informCarrierResizing', 150);
    } else {
        UCF_JsUtil.delayedCall(50, this, 'notifyWhenResizingStopped', null);
    }
};