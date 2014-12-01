
var POIArray=new Array();
var dimpleMap;
var markerImages;//new Array(28);

var badgeurls=null;

//for a plan
var dimplePlanImageWidth=0;
var dimplePlanImageHeight=0;

  var userMarker;
   var trackingMarkerImg;
   
   var deviceId;
//var trackingMarkerImg= new google.maps.MarkerImage('images/TrackingDot.png',new google.maps.Size(30 * 1.0,30 *1.0),new google.maps.Point(0,0),new google.maps.Point(15,15),new google.maps.Size(30,30));//,new google.maps.Size(0,0),null,null,new google.maps.Size(iconSize,iconSize));   
//var trackingMarkerImg=new google.maps.MarkerImage(markerImageUrls[0],new google.maps.Size(40 * 1.0,40 *1.0),new google.maps.Point(0,0),new google.maps.Point(40/2,40/2),new google.maps.Size(40,40));

function setDeviceId(did){
    deviceId=did;
}

function showUserLocation(){
    if (navigator.geolocation) 
{
	navigator.geolocation.getCurrentPosition( 
 
		function (position) {  
 
		// Did we get the position correctly?
		// alert (position.coords.latitude);
 
		// To see everything available in the position.coords array:
		// for (key in position.coords) {alert(key)}
//                console.log("dimpleMap:" + dimpleMap);
	//	alert("latitude: " + position.coords.latitude + " longitude: " + position.coords.longitude);
                 userMarker=new google.maps.Marker({position:new google.maps.LatLng(position.coords.latitude, position.coords.longitude),map:dimpleMap,icon:trackingMarkerImg});
                   // userMarker.setMap(dimpleMap);
             }, 
		// next function is the error callback
		function (error)
		{
			switch(error.code) 
			{
				case error.TIMEOUT:
					console.log ('Timeout');
					break;
				case error.POSITION_UNAVAILABLE:
					console.log ('Position unavailable');
					break;
				case error.PERMISSION_DENIED:
					console.log ('Permission denied');
					break;
				case error.UNKNOWN_ERROR:
					console.log ('Unknown error');
					break;
			}
		}
		);
                 
                 var watchid=navigator.geolocation.watchPosition(
                     function(position){
                         if(userMarker !=null)userMarker.setPosition(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
                       //  alert("Position now: " + position.coords.latitude + " " + position.coords.longitude);
                        },
                     function (error)
		{
			switch(error.code) 
			{
				case error.TIMEOUT:
					console.log ('Timeout');
					break;
				case error.POSITION_UNAVAILABLE:
					console.log ('Position unavailable');
					break;
				case error.PERMISSION_DENIED:
					console.log ('Permission denied');
					break;
				case error.UNKNOWN_ERROR:
					console.log ('Unknown error');
					break;
			}
		},
                 {'enableHighAccuracy':true,'timeout':10000,'maximumAge':20000}
                 );
	}

else {
}
}


function getAllDimplePOIs(projectid,iconsize){
    var url="../GetAllProjectAssemblies?projectid=" + projectid + "&callback=renderDimplePOIs_v1&iconsize=" + iconsize;
 //alert("getDimplePOIs " + url);
       var http_request= new XMLHttpRequest();
     http_request.open("GET",url,true);
     http_request.onreadystatechange=function(){
         // if(http_request.readyState==4) alert(http_request.readyState + " " + http_request.status);
        // alert("ready state: " + http_request.readyState + " " + http_request.status + " " + http_request.statusText);
           //var el=document.getElementById('testdiv');
            // el.innerHTML="<b>" + http_request.status  + "</b>";
            if(http_request.readyState==4 && http_request.status==200){
              
               //el.innerHTML="<b>" + http_request.status + " " + http_request.responseText + "</b>";
                eval(http_request.responseText);
            }
     };
     http_request.send(null);
//  alert(url);
 //alert("Render POIs");
   //   bObj = new JSONscriptRequest(url);
    // Build the dynamic script tag
   // bObj.buildScriptTag();
    // Add the script tag to the page
   // bObj.addScriptTag();
}




function renderDimplePOIs_v1(jsonObject){
     var iconSize=jsonObject.iconsize; //get from elsewhere
//     console.log("iconSize" + iconSize);
    //alert("renderDimplePOIs " + jsonObject);
            var response=jsonObject.response;
    var projectid=jsonObject.projectid;
   // alert(response);
    if(response=="OK"){ //session has timed out - go to login page
        //alert("REspopnse is OK");
      //  hideDimpleMarkers();
       var n=jsonObject.assemblies.length;
       POIArray=new Array(n);
       //alert(n + " asset assemblies");
       
       //sort by layariconid
       var sortedAssemblies =jsonObject.assemblies.sort(function(a,b){return(a.layariconid - b.layariconid)});
       
       //find the first non-zero zero elememnt
       var startIndex;
       for(var i=0;i< sortedAssemblies.length;i++){
            var lat= sortedAssemblies[i].latitude;
            var lng= sortedAssemblies[i].longitude
            if((lat!=0)&&(lng != 0)){
                startIndex=i;
                break;
            }
           }
       
       
          var minLat=0.0;
        var minLng=0.0;
        var maxLat=0.0;
        var maxLng=0.0;
        for(var i=startIndex;i< sortedAssemblies.length;i++){
           
            var lat= sortedAssemblies[i].latitude;
            var lng= sortedAssemblies[i].longitude;
            if(i==startIndex){
                maxLat=minLat=lat;
                minLng=maxLng=lng;
            }
            if(lat > maxLat)maxLat=lat;
            if(lat < minLat)minLat=lat;
            if(lng > maxLng)maxLng=lng;
            if(lng< minLng)minLng=lng;
        }
       // console.log("minLat: "  + minLat + " min Long: " + minLng + " maxLat: " + maxLat + " maxLong: " + maxLng)
        
        var centreLat=minLat +( (maxLat - minLat)/2);
        var centreLon=minLng +((maxLng-minLng)/2);
        
        
        
        var sw=new  google.maps.LatLng(minLat,minLng,true);
        var ne=new  google.maps.LatLng(maxLat,maxLng,true);
        
        var bounds = new  google.maps.LatLngBounds(sw,ne);
        //fit map to bounds if required
       
       //initiaise the map
       
        var nMarkers=markerImageUrls.length;
  markerImages=new Array(nMarkers);

  for(var i=0;i<nMarkers;i++){
      
      var size1=new google.maps.Size(iconSize * 1.0,iconSize *1.0);
      var size2=new google.maps.Size(iconSize,iconSize);
      
    markerImages[i]= new google.maps.MarkerImage(markerImageUrls[i],size1,new google.maps.Point(0,0),new google.maps.Point(iconSize/2,iconSize/2),size2);//,new google.maps.Size(0,0),null,null,new google.maps.Size(iconSize,iconSize));   
    //  markerImages[i]= new google.maps.MarkerImage(markerImageUrls[i],new google.maps.Size(35,35),new google.maps.Point(0,0),new google.maps.Point(17,35),new google.maps.Size(35,35));   

/*    markerImages[i]= new google.maps.MarkerImage(markerImageUrls[i],
                                    new google.maps.Size(200,200), //iconSize
                                    new google.maps.Point(0,0),
                                    new google.maps.Point(iconSize/2,iconSize/2));   
*/
    }
    
      //for a plan
    var planImgElement=document.getElementById('dimple_plan_image');
    if(planImgElement != null){
        dimplePlanImageWidth=planImgElement.width;
        dimplePlanImageHeight=planImgElement.height;
       // alert("width: " + dimplePlanImageWidth + " height:" +dimplePlanImageHeight);

}  

    var myLatLng = new google.maps.LatLng(centreLat, centreLon);
    var myOptions = {
     zoom: 17,
      center: myLatLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
     dimpleMap = new google.maps.Map(document.getElementById("dimple_map_canvas"),
        myOptions);
       
       //dimpleMap.fitBounds(bounds);
       
        var umsize1=new google.maps.Size(iconSize * 0.66,iconSize *0.66);
      var umsize2=new google.maps.Size(iconSize*0.66,iconSize*0.66);
       
        trackingMarkerImg= new google.maps.MarkerImage('images/TrackingDot.png',umsize1,new google.maps.Point(0,0),new google.maps.Point(iconSize*0.66/2,iconSize*0.66/2),umsize1);//,new google.maps.Size(0,0),null,null,new google.maps.Size(iconSize,iconSize));   

       showUserLocation();
         for(var i=0;i<n;i++){
        var longitude=sortedAssemblies[i].longitude;
        var latitude=sortedAssemblies[i].latitude;
        //alert("longitude: " + longitude + "latitude: " + latitude);
        var layariconid=sortedAssemblies[i].layariconid;
        
        assetassemblytitle=sortedAssemblies[i].assetassemblytitle;
        assetassemblysubtitle=sortedAssemblies[i].assetassemblysubtitle;
        assetassemblydescription=sortedAssemblies[i].assetassemblydescription;
     
       var assetassemblyid=sortedAssemblies[i].assetassemblyid;
        
        //add marker
        var markerObj=addDimplePOI(assetassemblytitle,latitude,longitude,assetassemblyid,layariconid,projectid,n-i);
        POIArray[i]=markerObj;
        }
        
       showDimpleMarkers();
       dimpleMap.fitBounds(bounds);
     
   }
     else if(response=="ERROR"){
        
            var errorcode=jsonObject.errorcode;
             //alert(errorcode);
            var errordescription=jsonObject.errordescription;
            var errordetail=jsonObject.errordetail;
          
                Dialog.alert("Error:" + errorcode + "<br>" + errordescription + "<br>details:<br>" + errordetail ,{width:300,height:100,okLabel: "OK",className: "mac_os_x"});

        
        }

}

 function addDimplePOI(label,lat,lon,assetassemblyid,layariconid,projectid,i){
   if((lat != 0)&&(lon != 0)){
    var markerImageUrl;
    var marker;
   
        markerImageUrl=markerImageUrls[layariconid];
        marker=new google.maps.Marker({position:new google.maps.LatLng(lat, lon),icon:markerImages[layariconid]});
        marker.setZIndex(i*1000);
        
       // console.log("Marker zindex: " + marker.getZIndex());
     
     
    // var image= new google.maps.MarkerImage("images/police-officer-icon55-focus.png",new google.maps.Size(35,35),new google.maps.Point(0,0),new google.maps.Point(17,35),new google.maps.Size(35,35));
     
    // var marker=markerImages[layariconid-1];
     //alert(layariconid);
    // var marker=new google.maps.Marker({position:new google.maps.LatLng(lat, lon),icon:markerImages[layariconid]});
   
    
     
      //var styleMarker2 = new StyledMarker({styleIcon:new StyledIcon(StyledIconTypes.BUBBLE,{color:"ffffff",text:label}),position:new google.maps.LatLng(lat, lon),draggable:true});
	//styleMarker2.oldlat=lat;
      //   styleMarker2.oldlon=lon;
         marker.assetassemblyid=assetassemblyid;
         google.maps.event.addListener(marker,'click',new Function("previewAssetAssembly(" + assetassemblyid + "," + projectid +");"));
      var tableElement=document.getElementById("poitable");
     // var newRow=document.createElement("TR");
   //  newRow.paddingBottom="20px";
      var td1= document.createElement("div");
     // td1.style.width="60%";
    //  td1.className="class_name";
    //  td1.style.backgroundImage="url('" + markerImageUrl; + "')";
 if(deviceId.indexOf("msie")!=-1){
      td1.innerHTML="<a  style=\"float:left\" onclick='previewAssetAssembly(" + assetassemblyid + "," + projectid + ");'><IMG    src='" + markerImageUrl + "' ></IMG></a><h2 style=\"display:table-cell;vertical-align:middle;line-height:70px;\" onclick='previewAssetAssembly(" + assetassemblyid + "," + projectid + ");'>" + label + "</h2>";

 }
 else      td1.innerHTML="<a  onclick='previewAssetAssembly(" + assetassemblyid + "," + projectid + ");'><IMG    src='" + markerImageUrl + "' ></IMG></a><h2 style=\"display:table-cell;vertical-align:middle\" onclick='previewAssetAssembly(" + assetassemblyid + "," + projectid + ");'>" + label + "</h2>";
 //  td1.innerHTML="<IMG    src='" + markerImageUrl + "' ></IMG>";
     // var td2= document.createElement("TD");
   //alert(td1.innerHTML);
    // td2.innerHTML="<h2 style=\"align:bottom\">" + label + "</h2>";
    
      tableElement.appendChild(td1);
     //   newRow.appendChild(td2);
      
      
    //     tableElement.appendChild(newRow);
      
      
      
      
      
       //alert(styleMarker2.styleIcon.text);
        return(marker);    
        }
        else return(null);
 }
 
 function previewAssetAssembly(assetassemblyid,projectid){
     //assetPresentationsPreviewWin.setURL(url);
    var url=null;
    if(projectid==undefined) url= "../AssembleAssets?assetassemblyid=" + assetassemblyid +"&return=html";
    
    else url= "../AssembleAssets?assetassemblyid=" + assetassemblyid + "&projectid=" + projectid +"&return=html";
    //alert(url);
  
    window.location=url;
}
 
 function showDimpleMarkers(){
    //alert("Length: "  + POIArray.length);
     for(var i=0;i< POIArray.length;i++){
       //  alert(POIArray[i]);
         if(POIArray[i] != null)POIArray[i].setMap(dimpleMap);
    }

    //alert("showMarkers: " + windowid);
      //alert("new window length: " + assemblyWindowsPOIArray[windowid].length);
/*      var minLat=0.0;
      var minLng=0.0;
      var maxLat=0.0;
      var maxLng=0.0;
    for(var i=0;i< POIArray.length;i++){
         POIArray[i].setMap(dimpleMap);
         var lat= POIArray[i].getPosition().lat();
         var lng=POIArray[i].getPosition().lng();
         if(i==0){
            maxLat=minLat=lat;
            minLng=maxLng=lng;
        }
         if(lat > maxLat)maxLat=lat;
         if(lat < minLat)minLat=lat;
         if(lng > maxLng)maxLng=lng;
         if(lng< minLng)minLng=lng;
    }*/
    //alert("minLat: "  + minLat + " min Long: " + minLng + " maxLat: " + maxLat + " maxLong: " + maxLng)
    
  //  var sw=new  google.maps.LatLng(minLat,minLng,true);
   // var ne=new  google.maps.LatLng(maxLat,maxLng,true);
    
   // var bounds = new  google.maps.LatLngBounds(sw,ne);
  // if( POIArray.length > 0)direMap.fitBounds(bounds);
  
        
}

function hideDimpleMarkers(){
    //alert("showMarkers: " + windowid + " current:" + currentAssembliesWindowId);
  
    //alert("showMarkers: " + windowid);
      //alert("hide markers length: " + assemblyWindowsPOIArray[windowid].length);
    for(var i=0;i< POIArray.length;i++){
        POIArray[i].setMap(null);
    }
  
        
}
