var map; 
var mapOnclickListener=null;//current onclick listener for the map
var directionDisplay;
var directionsService;
var rightClickListener=null; //the listener for right click events on the map
var simplePOIArray=new Array();
var path=new google.maps.MVCArray();
var poly = new google.maps.Polyline({
    strokeWeight: 3,
    strokeColor: '#66cc33',
    strokeOpacity:1.0
    
});
var markers = []; //waypoint markers

var showPOIs=true;



function initializeMap() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsService = new google.maps.DirectionsService();
    var myLatLng = new google.maps.LatLng(54.777136, -1.575487);
    var myOptions = {
        zoom: 7,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl:true
    };
    
    map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);

    map.poiMarkers=new Array();
    
    poly.setMap(map);
    poly.setPath(path);
    
    // google.maps.event.addListener(map,'click',addPointToPath);
    
    // google.maps.event.addListener(map,'rightclick',function(event){alert("right click lat: " + event.latLng.lat() + " " +  event.latLng.lng() + " " + currentProject)});
    //setMapRightclickListener("alert(\"right click lat: \" + event.latLng.lat() + \" \" +  event.latLng.lng() + \" \" + currentProject)");
    // directionsDisplay.setMap(map);
    
    //var styleMaker2 = new StyledMarker({styleIcon:new StyledIcon(StyledIconTypes.BUBBLE,{color:"ffffff",text:"I'm a marker!"}),position:new google.maps.LatLng(54.777136, -1.575487),map:map});
    //google.maps.event.addListener(styleMaker2,'click',function(){alert("clickedit");});
    //var styleMaker1 = new StyledMarker({styleIcon:new StyledIcon(StyledIconTypes.MARKER,{color:"00ff00",text:"A"}),position:myLatLng,map:map});
    //var styleMaker3 = new StyledMarker({styleIcon:new StyledIcon(StyledIconTypes.MARKER,{color:"0000ff"}),position:new google.maps.LatLng(37.263477473067, -121.880502070713),map:map});
    
    //google.maps.event.addListener(map,'click',function(event){alert(event.latLng.lat() + " " + event.latLng.lng())});
}

function setMapRightclickListener(body){
    if(rightClickListener != null){
        google.maps.event.removeListener(rightClickListener); //remove existing listener, if there is one
        
    }
    var fn= new Function("event",body);
    rightClickListener=google.maps.event.addListener(map,'rightclick',fn);
    
}

function setMapClickListener(body){
    if(mapOnclickListener != null){
        google.maps.event.removeListener(mapOnclickListener); //remove existing listener, if there is one
        
    }
    var fn= new Function("event",body);
    mapOnclickListener=google.maps.event.addListener(map,'click',fn);
    
}



function mapRouteSteps(jsonObject) {
    var steps=jsonObject.steps;
    var n=steps.length;
    var startStep=steps[0];
    var endStep=steps[n-1];
    
    var start = new google.maps.LatLng(startStep.latitude,startStep.longitude,true); 
    var end = new google.maps.LatLng(endStep.latitude,endStep.longitude,true); 
    
    var waypts = [];
    
    for(var i=0;i< (n-1);i++){
        var ith=steps[i];
        waypts.push({
            location: new google.maps.LatLng(ith.latitude,ith.longitude,true),
            stopover:false
        });
    }
    
    
    var request = {
        origin: start, 
        destination: end,
        waypoints: waypts,
        optimizeWaypoints: false,
        travelMode: google.maps.DirectionsTravelMode.WALKING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setMap(null);
            directionsDisplay.setDirections(response);
            directionsDisplay.setMap(map);
            /*   var route = response.routes[0];
            var summaryPanel = document.getElementById("directions_panel");
            summaryPanel.innerHTML = "";
            // For each route, display summary information.
            for (var i = 0; i < route.legs.length; i++) {
            var routeSegment = i+1;
            summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";
            summaryPanel.innerHTML += route.legs[i].start_address + " to ";
            summaryPanel.innerHTML += route.legs[i].end_address + "<br />";
            summaryPanel.innerHTML += route.legs[i].distance.text + "<br /><br />";
            }*/
        }
    });
}

function clearRouteDisplay(){
    directionsDisplay.setMap(null);
}

var geocoder = new google.maps.Geocoder();

function geocode(opts) {
    function geocodeResult(response, status) {
        if (status == google.maps.GeocoderStatus.OK && response[0]) {
            document.getElementById("search").value = response[0].formatted_address;
            map.fitBounds(response[0].geometry.viewport);
        } else {
        alert("Sorry, " + status);
    }
} // trim leading and trailing space with capable browsers
if(opts.address && opts.address.trim)opts.address = opts.address.trim(); 
if(opts.address || opts.latLng)geocoder.geocode(opts, geocodeResult); // no empty request
}

//function addSimplePOI(label,lat,lon,assetassembly,projectid,index){
function addSimplePOI(assetAssembly,projectid,userid,index){
    //  alert("add poi " + showPOIs);
    console.log("addSimplePoi: " + JSON.stringify(assetAssembly));
    console.log("location: " + JSON.stringify(assetAssembly.get('location')));
    assetAssembly.set('latitude',assetAssembly.get('location')[1]);
    assetAssembly.set('longitude',assetAssembly.get('location')[0]);
    var colour="66cc33";
    if(!showPOIs)colour="b3b3b3";
    //  var newstyledicon=new StyledIcon(StyledIconTypes.BUBBLE,{color:colour,text:label},lat,lon,(index*100)+1);
    //console.log("newstyledicon: " + JSON.stringify(newstyledicon));
    //      var styleMarker2 = new StyledMarker({position:new google.maps.LatLng(lat, lon),draggable:true,raiseOnDrag:false});
    //      styleMarker2.setStyledIcon(newstyledicon);
    


    var iconUrl="http://chart.apis.google.com/chart?chst=d_bubble_text_small&chld=bb|" + assetAssembly.get('textElements')[0].title + "  |" + colour + "|000000";
    //  var imgUrl="http://chart.apis.google.com/chart?chst=d_bubble_text_small&chld=bb|" + assembly.assetassemblytitle + "   |66cc33|000000";
    
      console.log("iconUrl: " + iconUrl);
    var lat=assetAssembly.get('location')[1];
    var lon=assetAssembly.get('location')[0];

    console.log("addSimplePOI: " +  lat + " " +  lon);
    
  
        var styleMarker2= new google.maps.Marker({position:new google.maps.LatLng(lat, lon),draggable:true,raiseOnDrag:false});
        map.poiMarkers.push(styleMarker2);
          styleMarker2.setOptions ({icon:{url:iconUrl,anchor:new google.maps.Point(0,42)}});
        styleMarker2.index=index;
        styleMarker2.oldlat=assetAssembly.get('location')[1];
        styleMarker2.oldlon=assetAssembly.get('location')[0];
        styleMarker2.projectid=projectid;
        styleMarker2.userid=userid;
        styleMarker2.assetassemblyid=assetAssembly.get('_id');
        styleMarker2.assetassembly=assetAssembly;
        styleMarker2.action=null;
        styleMarker2.setZIndex(index * 100);
        
       // console.log("marker for index:" + index + " zindex= " + styleMarker2.getZIndex());
        //styleMarker2.styleIcon.set("color","#b3b3b3");
        
        google.maps.event.clearListeners(styleMarker2,'click');
        google.maps.event.clearListeners(styleMarker2,'dragend');
        
        
        
        if(showPOIs) {
         //   console.log("addSimplePOI Visible: " + assetassembly.visible + "label: " + label);
            google.maps.event.addListener(styleMarker2,'click',new Function("showAssetAssembly("+projectid + "," + assetAssembly.get('_id') + ");"));
            google.maps.event.addListener(styleMarker2, 'dragend', function() {
                ///console.log("Add simple poi dragend POIs");
                
             //   console.log("dragend stylemarker zindex: " + styleMarker2.getZIndex() + " closemaerker zindex: " + styleMarker2.closemarker.getZIndex());
                 styleMarker2.closemarker.setZIndex(styleMarker2.getZIndex() + 1);
                var newLat=styleMarker2.getPosition().lat();
                var newLon=styleMarker2.getPosition().lng();
                styleMarker2.assetassembly.move=true;

                var newLocation=[newLon,newLat];
                styleMarker2.assetassembly.set('location',newLocation);//[1]=newLat;

                console.log("assembly isNew?: " + styleMarker2.assetassembly.isNew());
                styleMarker2.assetassembly.save();
               // styleMarker2.assetassembly.location[0]=newLon;
                styleMarker2.action="move";

                //now go save it
                //find the user
              /*  UserModel.findOne({_id:styleMarker2.userid},function(err,user){
                        var project=user.projects.id(styleMarker2.projectid);
                        console.log("updatePOI position, Project: " + JSON.stringify(project));
                       
                        user.save(function(err){
                          //console.log(" updateUserProject err: " + err);
                          console.log(" updateUserProject Project position: " + JSON.stringify(user));
                         
                        })
                 });*/


                unsavedMove=true;
                for (var i = 0, I = markers.length; i < I && markers[i] != styleMarker2; ++i);
                path.setAt(i, styleMarker2.getPosition());
                poly.setPath(path);
            }
        );
        
    
   
     google.maps.event.addListener(styleMarker2, 'dragstart', function() {
                ///console.log("Add simple poi dragend POIs");
                styleMarker2.closemarker.setZIndex(1000000000);
                //console.log("dragstart stylemarker zindex: " + styleMarker2.getZIndex() + " closemaerker zindex: " + styleMarker2.closemarker.getZIndex());
   }); 
    }
    else {
        google.maps.event.addListener(styleMarker2,'click',function(event){addPOItoPath(this.index,event)});
        
        google.maps.event.addListener(styleMarker2, 'dragend', function(event) {
            //    console.log("Add simple poi dragend route");
            var newLat=this.getPosition().lat();
            var newLon=this.getPosition().lng();
            var newLocation=[newLon,newLat];
            this.assetassembly.set('location',newLocation);
            this.assetassembly.move=true;
            //save the assetassembly
            this.assetassembly.save();
            //this.assetassembly.location[1]=newLat;
            //this.assetassembly.location[0]=newLon;
            this.action="move";
            unsavedMove=true;
            for (var i = 0, I = markers.length; i < I && markers[i] != this; ++i);
            if(markers[i]==this){
                path.setAt(i, event.latLng);
                poly.setPath(path);
            }
            
        }
    );
    
    }
       
    var image_ = document.createElement('img');
    image_.src=iconUrl;
    
    //get the image width/height
    google.maps.event.addDomListenerOnce(image_, 'load', function() {
        var w = image_.width;
        var h=image_.height;
//        console.log(iconUrl + " width: " + w + " height: " + h);
     //   styleMarker2.setOptions ({icon:{url:iconUrl,anchor:new google.maps.Point(0,h)}});
        
        
        if(styleMarker2.closemarker==null){
            
           // var image_ = document.createElement('img');
       //     image_.src=iconUrl;
            
                console.log("styleMarker2.assetassembly: " + JSON.stringify(styleMarker2.assetassembly));
                
                var newIcon={url:"images/simple-dimple-ui-icons-red.png",size:new google.maps.Size(16,16),origin:new google.maps.Point(32,192),anchor:new google.maps.Point(17-w,h-2)};//17-w
                var closeMarker2 = new google.maps.Marker({icon:newIcon,position:new google.maps.LatLng(styleMarker2.assetassembly.get('location')[1], styleMarker2.assetassembly.get('location')[0]),draggable:true,raiseOnDrag:false});
                //   console.log("Create a close Marker");
                google.maps.event.addListener(closeMarker2,'click',function(event){simpleDeleteMapPOI(this)});
                
                closeMarker2.setZIndex((index * 100) +1);
//                 console.log("close marker for index:" + index + " zindex= " + closeMarker2.getZIndex());
               // closeMarker2.setZIndex(10000000000);
                if((styleMarker2.assetassembly.get('location')[1]==0)&&(styleMarker2.assetassembly.get('location')[0]==0));
                else closeMarker2.setMap(map);
                styleMarker2.closemarker=closeMarker2;
                
                closeMarker2.bindTo('position', styleMarker2);
                // closeMarker2.bindTo('visible', me.styledmarker);
                closeMarker2.styledmarker=styleMarker2;
          

            }
          
          
        });
        
    
    
    return(styleMarker2);    
    
    
    
    

//var labelLength=label.length;


 




}

function showcoord(ar){
    for(var i=0;i<ar.length;i++){
        console.log("coord" + i + " " +ar[i]);
    }
}

function addPointToPath(event) {
    path.insertAt(path.length, event.latLng);
    // alert("path.length:" + path.length);
    var marker = new google.maps.Marker({
        position: event.latLng,
        map: map,
        draggable: true
    });
    marker.isPOI=false;
    markers.push(marker);
    marker.setTitle("#" + path.length);
    
    google.maps.event.addListener(marker, 'click', function() {
        marker.setMap(null);
        for (var i = 0, I = markers.length; i < I && markers[i] != marker; ++i);
        markers.splice(i, 1);
        path.removeAt(i);
        
        marker.index=null;
    }
);

google.maps.event.addListener(marker, 'dragend', function() {
    for (var i = 0, I = markers.length; i < I && markers[i] != marker; ++i);
    path.setAt(i, marker.getPosition());
}
);
poly.setPath(path);
}

function addPOItoPath(index, event){
    
    //alert("addPOItoPath:" + index + " " + event.latLng.toString());
    
    var marker=simplePOIArray[index];  
    if(!contains(markers,marker)){
        marker.isPOI=true;
        path.insertAt(path.length, event.latLng);
        markers.push(marker);
        google.maps.event.clearListeners(marker,'click');
        google.maps.event.clearListeners(marker,'dragend');
        
        //remove next time it is clicked
        google.maps.event.addListener(marker, 'click', function() {
            //marker.setMap(null);
            for (var i = 0, I = markers.length; i < I && markers[i] != marker; ++i);
            markers.splice(i, 1);
            path.removeAt(i);
            
            //  marker.index=null;
            
            //clear and reset the listeners, to add to the path again
            google.maps.event.clearListeners(marker,'click');
            google.maps.event.clearListeners(marker,'dragend');
            google.maps.event.addListener(marker,'click',function(event){addPOItoPath(this.index,event)});
            /*     google.maps.event.addListener(marker,'click',function(event){addPOItoPath(this.index,event)});
            //and add the appropriate dragend lsitener here
            google.maps.event.addListener(marker, 'dragend', function() {
            for (var i = 0, I = markers.length; i < I && markers[i] != marker; ++i);
            path.setAt(i, marker.getPosition());
            });
            */
            
        }
    );
    
    google.maps.event.addListener(marker, 'dragend', function(event) {
        console.log("addpoito path dragend");
        var newLat=this.getPosition().lat();
        var newLon=this.getPosition().lng();
        this.assetassembly.move=true;
        this.assetassembly.latitude=newLat;
        this.assetassembly.longitude=newLon;
        this.action="move";
        unsavedMove=true;
        var x;
        for ( x = 0; x < markers.length && markers[x] != this; x++);
        //alert('dragend, x:' + x);
        if(markers[x]==this){
            path.setAt(x, event.latLng);
            poly.setPath(path);
        }
        
    });
}
}

function contains(a,obj){
    for(var i=0;i<a.length;i++){
        if(a[i]==obj)return(true);
        
    }
    return(false);
}



//http://mridey.com/2011/05/label-overlay-example-for-google-maps.html

// Define the overlay, derived from google.maps.OverlayView
function Label(opt_options) {
    // Initialization
    this.setValues(opt_options);
    
    
    // Label specific
    var span = this.span_ = document.createElement('div');
    span.style.cssText = 'position: relative; left: -50%; top: -8px; ' +
    'white-space: nowrap;  ' +
    'padding: 2px; ';
    
    
    var div = this.div_ = document.createElement('div');
    div.appendChild(span);
    div.style.cssText = 'position: absolute; display: none';
};
Label.prototype = new google.maps.OverlayView;


// Implement onAdd
Label.prototype.onAdd = function() {
    var pane = this.getPanes().overlayImage;
    pane.appendChild(this.div_);
    console.log("Add label");
    
    // Ensures the label is redrawn if the text or position is changed.
    var me = this;
    this.listeners_ = [
        google.maps.event.addListener(this, 'position_changed', function() { console.log('position changed');me.draw(); }),
        google.maps.event.addListener(this, 'visible_changed', function() { console.log('visible changed');me.draw(); }),
        google.maps.event.addListener(this, 'clickable_changed', function() { console.log('clickable changed');me.draw(); }),
        google.maps.event.addListener(this, 'text_changed', function() { console.log('text changed');me.draw(); }),
        google.maps.event.addListener(this, 'zindex_changed', function() {console.log('zindex changed'); me.draw(); }),
        /*  google.maps.event.addDomListener(this.div_, 'click', function() {
        console.log("label clickable :" + me.get('clickable'));
        if (me.get('clickable')) {
        google.maps.event.trigger(me, 'click');
        }
        })*/
    ];
};


// Implement onRemove
Label.prototype.onRemove = function() {
    this.div_.parentNode.removeChild(this.div_);
    
    
    // Label is removed from the map, stop updating its position/text.
    for (var i = 0, I = this.listeners_.length; i < I; ++i) {
        google.maps.event.removeListener(this.listeners_[i]);
    }
};


// Implement draw
Label.prototype.draw = function() {
    var projection = this.getProjection();
    var position = projection.fromLatLngToDivPixel(this.get('position'));
    
    var xOffset=0;
    if(this.marker.styleIcon.shape!=undefined)xOffset=this.marker.styleIcon.shape.coord[10] -9 + 40;
    var yOffset=-36;
    
    console.log("xoffset:" + xOffset);
    
    var div = this.div_;
    div.style.left = position.x +xOffset+ 'px';
    div.style.top = position.y +yOffset+ 'px';
    
    
    var visible = this.get('visible');
    div.style.display = visible ? 'block' : 'none';
    
    
    var clickable = this.get('clickable');
    this.span_.style.cursor = clickable ? 'pointer' : '';
    
    
    var zIndex = this.get('zIndex');
    console.log("zindex: " + zIndex);
    div.style.zIndex = zIndex + 100;
    //div.style.zIndex=100000000;
    
    
    //  this.span_.innerHTML = this.get('text').toString();
    //this.span_.innerHTML="<a class=\"smallcrossbuttonred\"></a>";
    this.span_.innerHTML="<div><img style=\"position:absolute;top:0;left:0\" src=\"images/bubbleend.png\"></img><a onclick=\"markerDeleteButtonClicked(event);\"style=\"position:absolute;left:6px;top:4px;cursor:pointer;\" class=\"smallcrossbuttonred\"></a></div>";
    // this.span_.innerHTML="</img><a onclick=\"markerDeleteButtonClicked(event);\"style=\"position:absolute;left:0px;top:4px;cursor:pointer;\" class=\"smallcrossbuttonred\"></a>";
    
};

function markerDeleteButtonClicked(event){
    console.log("Delete Button Clicked");
    if(event.stopPropagation){
        event.stopPropagation();
    }
    else if(window.event){
        window.event.cancelBubble;
    }
}


function simpleDeleteMapPOI(deleteMarker){
    
    var parentMarker=deleteMarker.styledmarker;
    var index=parentMarker.index;
    
    // remove it from the path
    if(contains(markers,parentMarker)){
        for (var x = 0, I = markers.length; x < I && markers[x] != parentMarker; ++x);
        markers.splice(x, 1);
        path.removeAt(x);
    }
    
    
    deleteMarker.setMap(null);
    parentMarker.setMap(null);
    simplePOIArray[index].action="delete";
    unsavedSimpleEdits=true;
   // if(currentMarker==parentMarker){    //we're looking at this POI
        //simpleDeletePOI();
        //defer this for now - to do with showing the content
        
   // }
    //and hide it on the list
  //  var tbodyEl=document.getElementById('poilistbody');
    //tbodyEl.deleteRow(index);
  //  tbodyEl.childNodes[index].style.display="none";

    parentMarker.assetassembly.destroy();
    
    
}

function showSimpleMarkers(){
    console.log("show simple markers");
    for(var i=0;i< simplePOIArray.length;i++){
        simplePOIArray[i].setMap(null);
        //  if(simplePOIArray[i].styleIcon.closemarker)simplePOIArray[i].styleIcon.closemarker.setMap(null);
         if(simplePOIArray[i].closemarker)simplePOIArray[i].closemarker.setMap(null);
    }
  //  alert("showSimpleMarkers");
    //alert("showMarkers: " + windowid);
    //alert("new window length: " + assemblyWindowsPOIArray[windowid].length);
    for(var i=0;i< simplePOIArray.length;i++){
        var latitude=simplePOIArray[i].getPosition().lat();
        var longitude=simplePOIArray[i].getPosition().lng();
        console.log("showSimpleMarkers " + latitude + " " + longitude);
        if((latitude == 0)&&(longitude == 0)){
         //   console.log("its 0,0");
            
        }
        else if(simplePOIArray[i].action != "delete"){
            //console.log("its not");
           simplePOIArray[i].setMap(map);
           console.log("showSimpleMarkers set map " + i);
           
                 if(simplePOIArray[i].closemarker)  {
                     //console.log("its there")
                     simplePOIArray[i].closemarker.setMap(map);
                     }
                     
                   //  else console.log("its not")
           }
           
           //alert("showSimpleMArkers" + i);
        
    }
    //  currentAssembliesWindowId=windowid;
    
}

function showSimpleMarker(marker){
    marker.setMap(null);
        //  if(simplePOIArray[i].styleIcon.closemarker)simplePOIArray[i].styleIcon.closemarker.setMap(null);
    if(marker.closemarker)marker.closemarker.setMap(null);
    var latitude=marker.getPosition().lat();
    var longitude=marker.getPosition().lng();
    console.log("showSimpleMarker " + latitude + " " + longitude);
    if((latitude == 0)&&(longitude == 0)){
     //   console.log("its 0,0");
        
    }
    else if(marker.action != "delete"){
        //console.log("its not");
       marker.setMap(map);
       console.log("showSimpleMarker set map " );
       
             if(marker.closemarker)  {
                 //console.log("its there")
                 marker.closemarker.setMap(map);
                 }
                 
               //  else console.log("its not")
       }

}

function setSimpleBounds(){
    // alert("setbounds: " + windowid + "current: " + currentAssembliesWindowId +  " force: " + force);
    
    var minLat=360.0;
    var minLng=360.0;
    var maxLat=-360.0;
    var maxLng=-360.0;
    for(var i=0;i< simplePOIArray.length;i++){
      
        var lat= simplePOIArray[i].getPosition().lat();
        var lng= simplePOIArray[i].getPosition().lng();
     //   console.log("setSimpleBounds" + lat + " " + lng);
        if((lat==0)&&(lng==0)){
          //  console.log("its 0 0");
        }
        else{ //console.log("its not");
        
        simplePOIArray[i].setMap(map);
        }
        
     //   if(i==0){
      //      maxLat=minLat=lat;
      //      minLng=maxLng=lng;
     //   }
     if((lat != 0)||(lng !=0)){
        if(lat > maxLat)maxLat=lat;
        if(lat < minLat)minLat=lat;
        if(lng > maxLng)maxLng=lng;
        if(lng< minLng)minLng=lng;
        }
    }
    //alert("minLat: "  + minLat + " min Long: " + minLng + " maxLat: " + maxLat + " maxLong: " + maxLng)
    
    var sw=new  google.maps.LatLng(minLat,minLng,true);
    var ne=new  google.maps.LatLng(maxLat,maxLng,true);
    
    var bounds = new  google.maps.LatLngBounds(sw,ne);
    //fit map to bounds if required
    if( simplePOIArray.length > 0)map.fitBounds(bounds);
    
}


