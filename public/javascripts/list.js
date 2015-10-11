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
			var contentStr="<div class='image-caption-above'>" + listAsset.asset.captions.en +"</div><div id='poitable'>";

			
			//presentations.sort(function(a,b){
            //    return(b.width - a.width);
           //});

			var projectAssemblies=data.assemblies.sort(function(a,b){
				return(a.assetassemblyid - b.assetassemblyid);
			});
			for(var i=0;i<projectAssemblies.length;i++){
				var assembly=projectAssemblies[i];
				 var aaid=assembly.assetassemblyid;
				 var latitude=assembly.latitude;
				 var longitude=assembly.longitude;
				 var title=assembly.assetassemblytitle;
				 var iconid=assembly.layariconid;
				 var visible=assembly.visible;

				 var iconImageUrl;//=listAsset.data.markers[iconid];

				 if(checkProgress(projectid,aaid,null)){
				      console.log("checkProgress returns true");
				      iconImageUrl=listAsset.data.markerspresent[iconid];
				      //icon=markerPresentImages[layariconid];
				  }
				  else{
				  		iconImageUrl=listAsset.data.markers[iconid];
				      //icon=markerImages[layariconid];
				      console.log("checkProgress returns false");
				  }

				 if(typeof latitude !== 'undefined' && typeof longitude !== 'undefined' && visible){
				 	console.log("AA: " + aaid + " " + title +" lat: " + latitude + " long: " + longitude);
				 	contentStr+="<div><a href='/assemble/?a=1060&p=108&clon=" + longitude +"&clat=" + latitude + "&z=17&sib="+aaid + "'><img src='" + iconImageUrl +"' /></a><h2 onclick='previewAssetAssembly(" + aaid + "," + projectid + ");'>" + title + "</h2></div>";
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