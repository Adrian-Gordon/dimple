var assetId;
var assetassemblyid;
var projectid;
var listAsset;

function renderList(asset,aaid,pid){
	assetId=asset.asset._id;
	assetassemblyid=aaid;
	listAsset=asset;
	projectid=pid;


	var url="/GetAllProjectAssemblies?projectid=108";
		
		$.get(url).done(function(data){
      //alert('got data');
			//google.maps.event.addDomListener(window, 'load', function(){alert('loaded');renderDimplePOIs(data);});
			//console.log("Data: " + JSON.stringify(data));
			var contentStr="<div id='poitable'>";

			


			var projectAssemblies=data.assemblies;
			for(var i=0;i<projectAssemblies.length;i++){
				var assembly=projectAssemblies[i];
				 var aaid=assembly.assetassemblyid;
				 var latitude=assembly.latitude;
				 var longitude=assembly.longitude;
				 var title=assembly.assetassemblytitle;
				 var iconid=assembly.layariconid;

				 var iconImageUrl=listAsset.data.markers[iconid];

				 if(typeof latitude !== 'undefined' && typeof longitude !== 'undefined'){
				 	console.log("AA: " + aaid + " " + title +" lat: " + latitude + " long: " + longitude);
				 	contentStr+="<div><a onclick='previewAssetAssembly(" + aaid + "," + projectid + ");'><img src='" + iconImageUrl +"' /></a><h2 onclick='previewAssetAssembly(" + assetassemblyid + "," + projectid + ");'>" + title + "</h2></div>";
				 }
			}

			contentStr+="</div>";//poitable

			$('#' + listAsset.data.divid).append(contentStr);
			
			

		}).fail(function(error) {
		    console.log( "error" + JSON.stringify(error));
		  });

}

function previewAssetAssembly(assetassemblyid,projectid){
     //assetPresentationsPreviewWin.setURL(url);
     url= "../assemble?a=" + assetassemblyid + "&p=" + projectid;
    //alert(url);
  
    window.location=url;
}