var markerImageUrls;
var markerImageUrlsPresent;
var mapdivid;
var dimpleMap;
var infobox;
var ALLMARKERS={};

var commentsStr="<div class='infobox-wrapper' style='display:none'>";
    commentsStr+="<div class='comments' id='comments'>";
    //commentsStr+="    <div class='comments-before-up' id='commentbefore'></div>";
    commentsStr+="    <div id='comments-content'>";
    //commentsStr+="      <div class='close-button'>";
      //commentsStr+="          <img class='close-button-img'  src='https://cdn4.iconfinder.com/data/icons/miu/22/circle_close_delete-128.png' />";
      //commentsStr+="      </div>";
      //commentsStr+="    <div>";
      commentsStr+="    <div class='comment-img'>";
    commentsStr+="      <img id='comment-img-img' class='comment-img-img' src='http://i.guim.co.uk/media/w-620/h--/q-95/a54bca62f9acf91b80813fa68b271c563e8614c0/0_0_3294_1977/1000.jpg' />";
    commentsStr+="    </div>";
    commentsStr+="    <div class='comment-comment'>";
      commentsStr+="        <div class='comment-user'>";
      commentsStr+="             <span class='comment-user-username' id='comment-user-username'>J Bowe";
      commentsStr+="             </span>";
      commentsStr+="        </div>";
      commentsStr+="        <div class='comment-text'>";
      commentsStr+="           <span class='comment-text-text' id='comment-text-text'>This is the message";
      commentsStr+="          </span>";
      commentsStr+="        </div>";
      commentsStr+="    </div>";
      commentsStr+="    <div class='disclosure-button'>";
      commentsStr+="    <img src='/images/detaildisclosure.png'>";
      commentsStr+="      </div>";
      commentsStr+="  </div>";
    commentsStr+="  </div>";
    commentsStr+="  </div>";//infobox-wrapper



function renderMap(asset,aaid,pid){

	$(document).ready(function(){
		var assetdata=asset.data;
		markerImageUrls=assetdata.markers;
    markerImageUrlsPresent=assetdata.markerspresent;
		mapdivid=assetdata.divid;

    $('#' + mapdivid).css('height',window.innerHeight);

		




	$('#dimple-content').append(commentsStr);
/*
	 infobox = new InfoBox({
         content: document.getElementById("comments"),
         disableAutoPan: false,
         maxWidth: 300,
         pixelOffset: new google.maps.Size(-140, 0),
         zIndex: null,
         boxStyle: {
            background: "url('/images/map-marker-up-grey.png') no-repeat",
            opacity: 1.0,
            width: "300px"
        },
        closeBoxMargin: "12px 4px 2px 2px",
        closeBoxURL: "/images/circle_close_delete-20.png",
        infoBoxClearance: new google.maps.Size(1, 1)
    });*/


		//var url="../GetAllProjectAssemblies?projectid=" + pid + "&callback=renderDimplePOIs&iconsize=" + assetdata.iconsize;
		var url="../GetAllProjectAssemblies?projectid=" + pid + "&iconsize=" + assetdata.iconsize;
		console.log("GO DO MAP");
		$.get(url).done(function(data){
      //alert('got data');
			//google.maps.event.addDomListener(window, 'load', function(){alert('loaded');renderDimplePOIs(data);});
			renderDimplePOIs(data);

		}).fail(function(error) {
		    console.log( "error" + JSON.stringify(error));
		  });

	});
	
	
}

function renderDimplePOIs(jsonObject){
     var iconSize=jsonObject.iconsize; //get from elsewhere
    // console.log("iconSize" + iconSize);
    //console.log("renderDimplePOIs " + JSON.stringify(jsonObject));
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
       //console.log('sorted: ' + JSON.stringify(sortedAssemblies));
       //find the first non-zero zero elememnt
       var startIndex;
       for(var i=0;i< sortedAssemblies.length;i++){
            var lat= sortedAssemblies[i].latitude;
            var lng= sortedAssemblies[i].longitude
            if((typeof lat !== 'undefined')&&(typeof lng !== 'undefined')&&(lat!=0)&&(lng != 0)){
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
            //console.log('lat: ' + lat + 'lon: ' + lng);
            if(typeof lat !== 'undefined' && typeof lng !== 'undefined'){
              if(i==startIndex){
                  maxLat=minLat=lat;
                  minLng=maxLng=lng;
              }
              if(lat > maxLat)maxLat=lat;
              if(lat < minLat)minLat=lat;
              if(lng > maxLng)maxLng=lng;
              if(lng< minLng)minLng=lng;
            }
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
  markerPresentImages=new Array(nMarkers);

  for(var i=0;i<nMarkers;i++){
      
      var size1=new google.maps.Size(iconSize * 1.0,iconSize *1.0);
      var size2=new google.maps.Size(iconSize,iconSize);
     // var imageUrl="http://d3ox1gfjdlf15b.cloudfront.net/mapmarkers/campustrails/PurpleCircle_1.png"
      
   markerImages[i]= new google.maps.MarkerImage(markerImageUrls[i],size1,new google.maps.Point(0,0),new google.maps.Point(iconSize/2,iconSize/2),size2);//,new google.maps.Size(0,0),null,null,new google.maps.Size(iconSize,iconSize));   
   
  markerPresentImages[i]=new google.maps.MarkerImage(markerImageUrlsPresent[i],size1,new google.maps.Point(0,0),new google.maps.Point(iconSize/2,iconSize/2),size2);//,new google.maps.Size(0,0),null,null,new google.maps.Size(iconSize,iconSize));   
 
     //markerImages[i]= new google.maps.MarkerImage(imageUrl,size1,new google.maps.Point(0,0),new google.maps.Point(iconSize/2,iconSize/2),size2);//,new google.maps.Size(0,0),null,null,new google.maps.Size(iconSize,iconSize));   

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

	var myLatLng;
	var clat=getUrlVars()["clat"];
	var clon=getUrlVars()["clon"];
  var zS=getUrlVars()["z"];
  var zoom;
  if(typeof zS =='undefined')zoom=17;
  else zoom=parseInt(getUrlVars()["z"]);
  console.log("Zoom: " + zoom);

	console.log("clat: " + clat + " clon: " + clon);

  var sib=getUrlVars()["sib"];

     if(typeof clat == 'undefined' || typeof clon=='undefined'){
     		myLatLng = new google.maps.LatLng(centreLat, centreLon);
     }
     else{

     	myLatLng = new google.maps.LatLng(clat, clon);
     }
    var myOptions = {
      zoom:17,
      center: myLatLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
     dimpleMap = new google.maps.Map(document.getElementById('dimplemap'),
        myOptions);

     
       
       //dimpleMap.fitBounds(bounds);
       
        var umsize1=new google.maps.Size(iconSize * 0.66,iconSize *0.66);
      var umsize2=new google.maps.Size(iconSize*0.66,iconSize*0.66);
      
       
        trackingMarkerImg= new google.maps.MarkerImage('../images/TrackingDot.png',umsize1,new google.maps.Point(0,0),new google.maps.Point(iconSize*0.66/2,iconSize*0.66/2),umsize1);//,new google.maps.Size(0,0),null,null,new google.maps.Size(iconSize,iconSize));   
		//trackingMarkerImg= new google.maps.MarkerImage("http://d3ox1gfjdlf15b.cloudfront.net/mapmarkers/campustrails/PurpleCircle_1.png",umsize1,new google.maps.Point(0,0),new google.maps.Point(iconSize*0.66/2,iconSize*0.66/2),umsize1);//,new google.maps.Size(0,0),null,null,new google.maps.Size(iconSize,iconSize));   

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
           var minzoom=sortedAssemblies[i].minzoom;
            
            //add marker
            var markerObj=addDimplePOI(assetassemblytitle,latitude,longitude,assetassemblyid,layariconid,projectid,n-i,sortedAssemblies[i],minzoom);
            POIArray[i]=markerObj;
        }
        
      
      
      // dimpleMap.panTo(myLatLng);

       if(typeof zS !='undefined'){
          dimpleMap.setZoom(zoom);
       }
       else{
         dimpleMap.fitBounds(bounds);
       }
       dimpleMap.panTo(myLatLng);

       google.maps.event.addListener(dimpleMap, 'zoom_changed', function() {
         showDimpleMarkers();
      });

       
        showDimpleMarkers();

       if(typeof sib !== 'undefined'){
          var markerToShow=ALLMARKERS[sib];
          google.maps.event.trigger(markerToShow,'click');

       }

     
   }
     else if(response=="ERROR"){
        
            var errorcode=jsonObject.errorcode;
             //alert(errorcode);
            var errordescription=jsonObject.errordescription;
            var errordetail=jsonObject.errordetail;
          
                Dialog.alert("Error:" + errorcode + "<br>" + errordescription + "<br>details:<br>" + errordetail ,{width:300,height:100,okLabel: "OK",className: "mac_os_x"});

        
        }

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
                         if((typeof userMarker !== 'undefined')&&(userMarker !=null))userMarker.setPosition(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
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

function addDimplePOI(label,lat,lon,assetassemblyid,layariconid,projectid,i,assembly,minzoom){
   if((lat != 0)&&(lon != 0)){
    var markerImageUrl;
    var marker;
    var icon; //the icon to use - depending on user progress

    if(checkProgress(projectid,assetassemblyid,null)){
      console.log("checkProgress returns true");
      icon=markerPresentImages[layariconid];
    }
    else{
      icon=markerImages[layariconid];
      console.log("checkProgress returns false");
    }



   console.log("addDimplePOI, label: " + label + " assetassemblyid: " + assetassemblyid + " layariconid: " + layariconid );
        //markerImageUrl=markerImageUrls[layariconid];
        marker=new google.maps.Marker({position:new google.maps.LatLng(lat, lon),icon:icon});
       // trackingMarkerImg;
        //marker=new google.maps.Marker({position:new google.maps.LatLng(lat, lon),icon:markerImageUrl});
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
         marker.assetassembly=assembly;
         marker.minzoom=minzoom;
        // google.maps.event.addListener(marker,'click',new Function("previewAssetAssembly(" + assetassemblyid + "," + projectid +");"));

        ALLMARKERS[assetassemblyid]=marker;
        google.maps.event.addListener(marker, 'click', function() {

            var title=this.assetassembly.assetassemblytitle ;//+ " " + this.assetassembly.assetassemblyid;
            if(typeof title =='undefined'){
              title="";
            }
            var text=this.assetassembly.summarytext1;
            if(typeof text =='undefined'){
              text=""
            }
            var imageurl=this.assetassembly.summaryimageurl;
            if(typeof imageurl=='undefined'){
              imageurl="";
            }

            console.log("title: " + title + " text: " + text + " image: " + imageurl);

            var box=document.getElementById('comments');
            console.log("box at this point: " +box);
          if(box==null){
            $('#dimple-content').append(commentsStr); //recreate the box
            box=document.getElementById('comments');
          }

          console.log("BOX is now: " + box);


            $('#comment-user-username').text(title);
            $('#comment-text-text').text(text);
            $('#comment-img-img').attr('src',imageurl);

            $('.disclosure-button').click(function(){
            // alert('clicked');
              previewAssetAssembly(assetassemblyid,projectid);
             })

/*  

            var commentsStr="<div class='infobox-wrapper'>";
            commentsStr+="<div style='height:100px;width: 300px !important;' class='comments' >";
            //commentsStr+="    <div class='comments-before-up' id='commentbefore'></div>";
            commentsStr+="    <div id='comments-content'>";
            //commentsStr+="      <div class='close-button'>";
              //commentsStr+="          <img class='close-button-img'  src='https://cdn4.iconfinder.com/data/icons/miu/22/circle_close_delete-128.png' />";
              //commentsStr+="      </div>";
              //commentsStr+="    <div>";
              commentsStr+="    <div class='comment-img'>";
           // commentsStr+="      <img id='comment-img-img' class='comment-img-img' src='http://i.guim.co.uk/media/w-620/h--/q-95/a54bca62f9acf91b80813fa68b271c563e8614c0/0_0_3294_1977/1000.jpg' />";
            commentsStr+="      <img id='comment-img-img' class='comment-img-img' src='" + imageurl +"' />";
            commentsStr+="    </div>";
            commentsStr+="    <div class='comment-comment'>";
              commentsStr+="        <div class='comment-user'>";
              commentsStr+="             <span class='comment-user-username' id='comment-user-username'>" + title;
              commentsStr+="             </span>";
              commentsStr+="        </div>";
              commentsStr+="        <div class='comment-text'>";
              commentsStr+="           <span class='comment-text-text' id='comment-text-text'>" + text;
              commentsStr+="          </span>";
              commentsStr+="        </div>";
              commentsStr+="    </div>";
              commentsStr+="    <div id='disclosure-button' class='disclosure-button' onclick='previewAssetAssembly(" + this.assetassemblyid +"," + projectid +")'>";
             // commentsStr+="    <img src='/images/detaildisclosure.png' onclick='previewAssetAssembly(" + this.assetassemblyid +"," + projectid +")'/>";
              commentsStr+="    <img class='disclosure-button-img' src='/images/detaildisclosure.png' />";
              commentsStr+="      </div>";
              commentsStr+="  </div>";
            commentsStr+="  </div>";
            commentsStr+="  </div>";//infobox-wrapper

            console.log(commentsStr);
            //var boxText = document.createElement("div");
          // boxText.innerHTML=commentsStr;
         var boxText=$("<div>");
          //$(boxText).appendTo('body');
          $(boxText).html(commentsStr);

          //var db=document.getElementById('disclosure-button');
          var db=$('#comment-image-image');

          $('.disclosure-button-img').click(function(){
            alert('clicked');
          })
          console.log("db: " + db);*/
          // google.maps.event.addDomListener(db, 'click', showAlert);


          //var box=document.getElementById('comments');

          console.log("BOX: " + box);
             if(typeof infobox !== 'undefined'){
                 infobox.close();
                 infobox=null;
              }

              var bwidth=$('.comments').width();
              
             infobox = new InfoBox({
               content: box,
               disableAutoPan: false,
               maxWidth: 300,
               pixelOffset: new google.maps.Size(-140, 0),
               zIndex: 900000000,
               boxStyle: {
                  background: "url('/images/map-marker-up-grey.png') no-repeat",
                  opacity: 1.0,
                  width: bwidth + "px"
              },
              closeBoxMargin: "12px 4px 2px 2px",
              closeBoxURL: "https://cdn4.iconfinder.com/data/icons/miu/22/circle_close_delete-128.png",
              infoBoxClearance: new google.maps.Size(1, 1)
          });

          
        	infobox.open(dimpleMap, this);
          
        	//map.panTo(loc);
          
    	});

    //  var tableElement=document.getElementById("poitable");
     // var newRow=document.createElement("TR");
   //  newRow.paddingBottom="20px";
     // var td1= document.createElement("div");
     // td1.style.width="60%";
    //  td1.className="class_name";
    //  td1.style.backgroundImage="url('" + markerImageUrl; + "')";

// if(deviceId.indexOf("msie")!=-1){
//      td1.innerHTML="<a  style=\"float:left\" onclick='previewAssetAssembly(" + assetassemblyid + "," + projectid + ");'><IMG    src='" + markerImageUrl + "' ></IMG></a><h2 style=\"display:table-cell;vertical-align:middle;line-height:70px;\" onclick='previewAssetAssembly(" + assetassemblyid + "," + projectid + ");'>" + label + "</h2>";

 //}
// else      

 	//td1.innerHTML="<a  onclick='previewAssetAssembly(" + assetassemblyid + "," + projectid + ");'><IMG    src='" + markerImageUrl + "' ></IMG></a><h2 style=\"display:table-cell;vertical-align:middle\" onclick='previewAssetAssembly(" + assetassemblyid + "," + projectid + ");'>" + label + "</h2>";
 //  td1.innerHTML="<IMG    src='" + markerImageUrl + "' ></IMG>";
     // var td2= document.createElement("TD");
   //alert(td1.innerHTML);
    // td2.innerHTML="<h2 style=\"align:bottom\">" + label + "</h2>";
    
     // tableElement.appendChild(td1);
     //   newRow.appendChild(td2);
      
      
    //     tableElement.appendChild(newRow);
      
      
      
      
      
       //alert(styleMarker2.styleIcon.text);
        return(marker);    
        }
        else return(null);
 }

 

 function showDimpleMarkers(){
    var z=dimpleMap.getZoom();
    //alert("Length: "  + POIArray.length);
     for(var i=0;i< POIArray.length;i++){
       //  alert(POIArray[i]);
         if(POIArray[i] != null){
            if((z >= POIArray[i].minzoom)|(POIArray[i].minzoom==15)){
              POIArray[i].setMap(dimpleMap);
            }
           else POIArray[i].setMap(null);
         }
         //if(POIArray[i] != null)markerManager.addMarker(POIArray[i],17);
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

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function previewAssetAssembly(assetassemblyid,projectid){
     //assetPresentationsPreviewWin.setURL(url);
     url= "../assemble?a=" + assetassemblyid + "&p=" + projectid;
    //alert(url);
  
    window.location=url;
}




