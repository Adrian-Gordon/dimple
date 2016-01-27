var menuData;
var menuAsset;
var assetassemblyid;
var projectid;

function renderFooterMenu(asset,aaid,pid){

	console.log("renderfootermenu");
	assetassemblyid=aaid;
	 menuAsset=asset;
	 projectid=pid;
	menuData=asset.data;

	//menuStr="<div id='footerplaceholder'></div>";
    menuStr="";

	//var widthPercent=Math.floor(100/menuData.menuitems.length);
	var widthPercent=100/menuData.menuitems.length;

	for(var i=0;i<menuData.menuitems.length;i++){
		var menuItem=menuData.menuitems[i];
		menuStr+="<div class='menuitem' style='width:" + widthPercent + "%;background-color:" + menuItem.bgcolour + "'>" +"<div class='menuitemcontent' style='background-color:" + menuItem.bgcolour +"'><a class='" + menuItem.class+"' onclick='" + menuItem.onclickurl + "'>" + menuItem.title +"</a></div></div>";

	}
   
	$('#' + menuData.divid).append(menuStr);
	placeFooter();
	//$(document.body).append("<div id='footermenu' style='display:none'>" + menuStr + "</div>");
}

$(function(){
    $(window).resize(function(e){
    	console.log("Resized");
        placeFooter();
    });
   // placeFooter();
    // hide it before it's positioned
    $('#footermenu').css('display','inline');
});

function placeFooter() {    
    var windHeight = $(window).height();
    console.log("windheight: " + windHeight);
    var footerHeight = $('#footermenu').height();
    console.log('footerHeight: ' + footerHeight);
    var offset = parseInt(windHeight) - parseInt(footerHeight);
    $('#footermenu').css('top',offset);
    $("<div id='footerplaceholder'></div>").insertBefore($('#footermenu'));
    $('#footerplaceholder').css('height',footerHeight);
}

function menuPreviewAssetAssembly(assetassemblyid,projectid){
     //assetPresentationsPreviewWin.setURL(url);
     url= "../assemble?a=" + assetassemblyid + "&p=" + projectid;
    //alert(url);
  
    window.location=url;
}


