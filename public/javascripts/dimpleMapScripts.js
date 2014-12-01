
var POIArray=new Array();
var dimpleMap;
var markerImages;//new Array(28);

var badgeurls=null;

//for a plan
var dimplePlanImageWidth=0;
var dimplePlanImageHeight=0;


function initializeSimpleDimpleMap(latitude,longitude,zoomLevel,iconSize) {
 
  var nMarkers=markerImageUrls.length;
  markerImages=new Array(nMarkers);
  for(var i=0;i<nMarkers;i++){
    markerImages[i]= new google.maps.MarkerImage(markerImageUrls[i],new google.maps.Size(iconSize,iconSize),new google.maps.Point(0,0),new google.maps.Point(iconSize/2,iconSize),new google.maps.Size(iconSize,iconSize));   
    //  markerImages[i]= new google.maps.MarkerImage(markerImageUrls[i],new google.maps.Size(35,35),new google.maps.Point(0,0),new google.maps.Point(17,35),new google.maps.Size(35,35));   

  
    }
    
      //for a plan
    var planImgElement=document.getElementById('dimple_plan_image');
    if(planImgElement != null){
        dimplePlanImageWidth=planImgElement.width;
        dimplePlanImageHeight=planImgElement.height;
       // alert("width: " + dimplePlanImageWidth + " height:" +dimplePlanImageHeight);

}  

    var myLatLng = new google.maps.LatLng(latitude, longitude);
    var myOptions = {
      zoom: zoomLevel,
      center: myLatLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
     dimpleMap = new google.maps.Map(document.getElementById("dimple_map_canvas"),
        myOptions);
	
}

//var gbucount=0;
function getBadgeUrls(appname,latitude,longitude,projectid,distance){
      var url="../DimpleCMS/GetBadgeUrls?projectid=" + projectid +"&latitude=" + latitude + "&longitude=" + longitude + "&distance="+distance +"&appname=" + appname + "&callback=setBadgeUrls" + "&count=" + new Date().getTime();
 //alert("getBadgeUrls: " + url);
       var http_request= new XMLHttpRequest();
     http_request.open("GET",url,true);
     http_request.onreadystatechange=function(){
         // if(http_request.readyState==4) alert(http_request.readyState + " " + http_request.status);
        // alert("ready state: " + http_request.readyState + " " + http_request.status + " " + http_request.statusText);
           //var el=document.getElementById('testdiv');
            // el.innerHTML="<b>" + http_request.status  + "</b>";
            if(http_request.readyState==4 && http_request.status==200){
            //  alert(http_request.responseText);
               //el.innerHTML="<b>" + http_request.status + " " + http_request.responseText + "</b>";
                eval(http_request.responseText);
            }
     };
     http_request.send(null);
}



function setBadgeUrls(jsonObject){
    var projectid=jsonObject.projectid;
     var latitude=jsonObject.latitude;
    var longitude=jsonObject.longitude;
    var distance = jsonObject.distance;
 
    badgeurls=jsonObject.badgeurls;
       //alert("setBadgeUrls, length:" + badgeurls.length);
    getDimplePOIs(latitude,longitude,projectid,distance);

}

function getRollcall(appname){
        var url="../DimpleCMS/GetRollcall?appname=" + appname + "&callback=renderRollcall" + "&count=" + new Date().getTime();
 //alert("getBadgeUrls: " + url);
       var http_request= new XMLHttpRequest();
     http_request.open("GET",url,true);
     http_request.onreadystatechange=function(){
         // if(http_request.readyState==4) alert(http_request.readyState + " " + http_request.status);
        // alert("ready state: " + http_request.readyState + " " + http_request.status + " " + http_request.statusText);
           //var el=document.getElementById('testdiv');
            // el.innerHTML="<b>" + http_request.status  + "</b>";
            if(http_request.readyState==4 && http_request.status==200){
            //  alert(http_request.responseText);
               //el.innerHTML="<b>" + http_request.status + " " + http_request.responseText + "</b>";
                eval(http_request.responseText);
            }
     };
     http_request.send(null);
}

function renderRollcall(jsonObject){
    var badges=jsonObject.progressbadges;
      var ulElement=document.getElementById("rollcallul");
      ulElement.innerHTML=""; //clear existing content
    for(var i=0;i<badges.length;i++){
        var date=badges[i].date;
        var username=badges[i].username;
        var badgeurl=badges[i].badgeurl;
        var timeAgoString=timeAgo(date);
        var task=badges[i].task;
        var tasklink=badges[i].tasklink;
        var taskurl=badges[i].taskurl;
      //  alert("timeAgo: " + timeAgoString);
        
        
          var li=document.createElement("LI");
            li.className="result";
            var theHTML="<div class=\"avatar\"><img width='50px' src=\"" + badgeurl + "\"></img></div>";
            theHTML+="<div class=\"msg\"><a>" + username + "</a><span class=\"msgtxt\">&nbsp;earned this badge " + task +"&nbsp;<a href=\""+taskurl + "\">"+ tasklink + "</a></span></div>";
            theHTML+="<div class=\"info\"><a>" + timeAgoString + "</a></div>";
            li.innerHTML=theHTML;
            ulElement.appendChild(li);
        
        
        
  
    /*  var newRow=document.createElement("TR");
      
      var td1= document.createElement("TD");
      td1.innerHTML=date;
      newRow.appendChild(td1);
      
      var td2= document.createElement("TD");
      td2.innerHTML=username + " earned:";
      newRow.appendChild(td2);
      
       var td3= document.createElement("TD");
      td3.innerHTML= "<img src='" + badgeurl + "' width='30px'></img>";
      newRow.appendChild(td3);
      
       var td4= document.createElement("TD");
      td4.innerHTML="Well done " + username;
      newRow.appendChild(td4);
      
     //   newRow.appendChild(td2);
      
      
         tableElement.appendChild(newRow);*/
         }

}

 var browser = function() {
      var ua = navigator.userAgent;
      return {
        ie: ua.match(/MSIE\s([^;]*)/)
      };
    }();

 /**
      * relative time calculator
      * @param {string} twitter date string returned from Twitter API
      * @return {string} relative time like "2 minutes ago"
      */
    function timeAgo(dateString) {
      var rightNow = new Date();
      var then = new Date(dateString);

      if (browser.ie) {
        // IE can't parse these crazy Ruby dates
        then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
      }

      var diff = rightNow - then;

      var second = 1000,
          minute = second * 60,
          hour = minute * 60,
          day = hour * 24,
          week = day * 7;

      if (isNaN(diff) || diff < 0) {
     return "right now"; // return blank string if unknown
      }
      else if(diff < 0){
     return "right now";
  }

      if (diff < second * 2) {
        // within 2 seconds
        return "right now";
      }

      if (diff < minute) {
        return Math.floor(diff / second) + " seconds ago";
      }

      if (diff < minute * 2) {
        return "about 1 minute ago";
      }

      if (diff < hour) {
        return Math.floor(diff / minute) + " minutes ago";
      }

      if (diff < hour * 2) {
        return "about 1 hour ago";
      }

      if (diff < day) {
        return  Math.floor(diff / hour) + " hours ago";
      }

      if (diff > day && diff < day * 2) {
        return "yesterday";
      }

      if (diff < day * 365) {
        return Math.floor(diff / day) + " days ago";
      }

      else {
        return "over a year ago";
      }

    };

function getDimplePOIs(latitude,longitude,projectid,distance){
    var url="../DimpleCMS/GetAssemblies?projectid=" + projectid +"&latitude=" + latitude + "&longitude=" + longitude + "&distance="+distance + "&callback=renderDimplePOIs";
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

function getAllDimplePOIs(projectid,iconsize){
    var url="../DimpleCMS/GetAllProjectAssemblies?projectid=" + projectid + "&callback=renderDimplePOIs_v1&iconsize=" + iconsize;
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



function renderDimplePOIs(jsonObject){
    //alert("renderDimplePOIs " + jsonObject);
            var response=jsonObject.response;
    var projectid=jsonObject.projectid;
  
   // alert(response);
    if(response=="OK"){ //session has timed out - go to login page
        //alert("REspopnse is OK");
        hideDimpleMarkers();
       var n=jsonObject.assemblies.length;
       POIArray=new Array(n);
       //alert(n + " asset assemblies");
       
       //sort by layariconid
       var sortedAssemblies =jsonObject.assemblies.sort(function(a,b){return(a.layariconid - b.layariconid)});
       
       
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
        POIArray[i]=addDimplePOI(assetassemblytitle,latitude,longitude,assetassemblyid,layariconid,projectid);
        }
        showDimpleMarkers();
     
   }
     else if(response=="ERROR"){
        
            var errorcode=jsonObject.errorcode;
             //alert(errorcode);
            var errordescription=jsonObject.errordescription;
            var errordetail=jsonObject.errordetail;
          
                Dialog.alert("Error:" + errorcode + "<br>" + errordescription + "<br>details:<br>" + errordetail ,{width:300,height:100,okLabel: "OK",className: "mac_os_x"});

        
        }

}


function renderDimplePOIs_v1(jsonObject){
     var iconSize=jsonObject.iconsize; //get from elsewhere
     console.log("iconSize" + iconSize);
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
       
       
          var minLat=0.0;
        var minLng=0.0;
        var maxLat=0.0;
        var maxLng=0.0;
        for(var i=0;i< sortedAssemblies.length;i++){
           
            var lat= sortedAssemblies[i].latitude;
            var lng= sortedAssemblies[i].longitude
            if(i==0){
                maxLat=minLat=lat;
                minLng=maxLng=lng;
            }
            if(lat > maxLat)maxLat=lat;
            if(lat < minLat)minLat=lat;
            if(lng > maxLng)maxLng=lng;
            if(lng< minLng)minLng=lng;
        }
        console.log("minLat: "  + minLat + " min Long: " + minLng + " maxLat: " + maxLat + " maxLong: " + maxLng)
        
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
    markerImages[i]= new google.maps.MarkerImage(markerImageUrls[i],new google.maps.Size(iconSize,iconSize),new google.maps.Point(0,0),new google.maps.Point(iconSize/2,iconSize),new google.maps.Size(iconSize,iconSize));   
    //  markerImages[i]= new google.maps.MarkerImage(markerImageUrls[i],new google.maps.Size(35,35),new google.maps.Point(0,0),new google.maps.Point(17,35),new google.maps.Size(35,35));   

  
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
     zoom: 10,
      center: myLatLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
     dimpleMap = new google.maps.Map(document.getElementById("dimple_map_canvas"),
        myOptions);
       
       //dimpleMap.fitBounds(bounds);
       
       
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
        POIArray[i]=addDimplePOI(assetassemblytitle,latitude,longitude,assetassemblyid,layariconid,projectid);
        }
       showDimpleMarkers();
     
   }
     else if(response=="ERROR"){
        
            var errorcode=jsonObject.errorcode;
             //alert(errorcode);
            var errordescription=jsonObject.errordescription;
            var errordetail=jsonObject.errordetail;
          
                Dialog.alert("Error:" + errorcode + "<br>" + errordescription + "<br>details:<br>" + errordetail ,{width:300,height:100,okLabel: "OK",className: "mac_os_x"});

        
        }

}

 function addDimplePOI(label,lat,lon,assetassemblyid,layariconid,projectid){
     //check to see if we have a badge - for treasure hunt maps
     var badgeurl=null;
     if(badgeurls != null){
        for(var i=0;i<badgeurls.length;i++){
                if(badgeurls[i].assetassemblyid==assetassemblyid){
                    badgeurl=badgeurls[i].badgeurl;
                   // alert("badgeurl for: " + assetassemblyid + " is " +badgeurl);
                    break;
                }
            }
    }
    var markerImageUrl;
    var marker;
     if(badgeurl!= null) {
         markerImageUrl=badgeurl;
         marker=new google.maps.Marker({position:new google.maps.LatLng(lat, lon),icon:new google.maps.MarkerImage(badgeurl,new google.maps.Size(80,80),new google.maps.Point(0,0),new google.maps.Point(40,80),new google.maps.Size(80,80))});
         }
     else {
        markerImageUrl=markerImageUrls[layariconid];
        marker=new google.maps.Marker({position:new google.maps.LatLng(lat, lon),icon:markerImages[layariconid]});
        }
     
     
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
      var newRow=document.createElement("TR");
   //  newRow.paddingBottom="20px";
      var td1= document.createElement("TD");
    //  td1.verticalAlign="middle";
      td1.innerHTML="<a   onclick='previewAssetAssembly(" + assetassemblyid + "," + projectid + ");'><IMG    src='" + markerImageUrl + "' ></IMG><h2 style=\"display:inline\">" + label + "</h2></a>";
   //    var td2= document.createElement("TD");
   //alert(td1.innerHTML);
   //  td2.innerHTML="<h2 style=\"align:bottom\">" + label + "</h2>";
    
      newRow.appendChild(td1);
     //   newRow.appendChild(td2);
      
      
         tableElement.appendChild(newRow);
      
         var planImgElement=document.getElementById('dimple_plan_image');
    if(planImgElement != null){
        
        var posxpercentS="markerPlanPositions.e" +assetassemblyid +".xpercent";
          var posypercentS="markerPlanPositions.e" +assetassemblyid +".ypercent";
       // alert("posxpercentS: " + posxpercentS);
        var posxpercent=eval(posxpercentS);
        var posypercent=eval(posypercentS);
       // alert("posxpercent: " + posxpercent);
      // alert("posxpercent: " + markerPlanPositions.e164.xpercent);
        
       var dp =document.getElementById('dimple_plan');
       
      var aElement=document.createElement("a");
      aElement.onclick=Function("previewAssetAssembly(" + assetassemblyid + "," + projectid + ");");
      
       var planimgElement=document.createElement("IMG");
       planimgElement.src=markerImageUrl;
       var w=dimplePlanImageWidth/10;
       var xpos=dimplePlanImageWidth/(100/posxpercent );
       var ypos=dimplePlanImageHeight/(100/posypercent );
       planimgElement.style.width=w +"px";
        planimgElement.style.position="absolute";
         planimgElement.style.top=ypos;
          planimgElement.style.left=xpos;
        
       aElement.appendChild(planimgElement);
          dp.appendChild(aElement);

    }  
      
      
      
       //alert(styleMarker2.styleIcon.text);
        return(marker);    
 }
 
 function previewAssetAssembly(assetassemblyid,projectid){
     //assetPresentationsPreviewWin.setURL(url);
    var url=null;
    if(projectid==undefined) url= "../DimpleCMS/AssembleAssets?assetassemblyid=" + assetassemblyid +"&return=html";
    
    else url= "../DimpleCMS/AssembleAssets?assetassemblyid=" + assetassemblyid + "&projectid=" + projectid +"&return=html";
    //alert(url);
  
    window.location=url;
}
 
 function showDimpleMarkers(){
    //alert("Length: "  + POIArray.length);
     for(var i=0;i< POIArray.length;i++){
       //  alert(POIArray[i]);
         POIArray[i].setMap(null);
    }

    //alert("showMarkers: " + windowid);
      //alert("new window length: " + assemblyWindowsPOIArray[windowid].length);
      var minLat=0.0;
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
    }
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
