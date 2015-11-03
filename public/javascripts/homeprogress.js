if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun/*, thisArg*/) {
    'use strict';

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}


function renderHomeProgress(asset,aaid,pid){
	console.log("Render Home Progress" + JSON.stringify(dimpleUserProgress));
	var assemblies=[];
	var assets=[];
  if(typeof dimpleUserProgress !== 'undefined'){
    	for(var i=0;i<dimpleUserProgress.length;i++){
    		var dup=dimpleUserProgress[i];
    		console.log("apname: " + dup.appname);
    		console.log("dup: " + JSON.stringify(dup));
    		if(dup.get('appname')=='project108'){
    			if(assemblies.indexOf(dup.get('assetassemblyid'))== -1){
    				console.log("push assemblies " + dup.get('assetassemblyid'));
    				assemblies.push(dup.get('assetassemblyid'));
    			}
    			if(assets.indexOf(dup.get('assetid'))==-1){
    				console.log("push assets: " + dup.get('assetid'));
    				assets.push(dup.get('assetid'));
    			}
    		}

    	}
  }

	var poisCount=assemblies.length;
	var poisPlural='s';

	var assetsCount=assets.length;
	var assetsPlural='s';

	var contentStr="<div class='text-item'><span>Your Progress:&nbsp;</span><span>So far you have visited " + poisCount +" Point" +poisPlural+ " of Interest and sucessfully completed " + assetsCount +" Task" + assetsPlural + "</span></div>" ;

	console.log("contentStr: " + contentStr);
	$('#' + asset.data.divid).append(contentStr);




}


