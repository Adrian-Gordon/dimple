function reportCorrect(qelement,badgeurl,caurl,projectid,task,tasklink,assetassemblyid,assetindex,correctanswerindex){
	
	var trNode=qelement.parentNode.parentNode;
	//console.log("childnodes length: " +trNode.childNodes.length);

	//console.log(trNode.innerHTML);
	//for(var x=0;x<trNode.childNodes.length;x++){
	//	console.log(trNode.childNodes[x]);
	//}

	//var badgeholderimgEl=document.getElementById('badgeimg'+id);

	
	//var badgeholderimgEl=trNode.childNodes[2].childNodes[0];

	var currentUser = Parse.User.current();
	
	

	var badgeholdertdel=document.getElementById('badgeholder'+assetindex);	
	var badgeholderimgEl=badgeholdertdel.childNodes[0];

	badgeholderimgEl.src=badgeurl;

	//var responseImgEl=document.getElementById('responseimg'+id);
	//var responseImgEl=trNode.childNodes[0].childNodes[0];
	var responseImgEl=document.getElementById('responseimg'+assetindex);	
	responseImgEl.src=caurl;
	responseImgEl.style.visibility='visible';
	var congratsSpanEl=document.getElementById('congratsspan'+assetindex);
	//var congratsSpanEl=trNode.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
	congratsSpanEl.style.visibility='visible';
	//call notifyAATaskCompleted
	//var taskurl="../DimpleCMS/AssembleAssets?assetassemblyid=167&projectid=18&return=html";

	if (currentUser) {
		console.log("User is logged in");

		

		//does the user have the badge already

		var progress = Parse.Object.extend("dimplecontentuserprogress");
		var query = new Parse.Query(progress);
		query.equalTo("owner", currentUser);
		query.find({
  			success: function(results) {
	    		console.log("Successfully retrieved " + results.length + " scores.");
    				// Do something with the returned Parse.Object values
    				var hasBadge=false;
    			for (var i = 0; i < results.length; i++) { 
      				var object = results[i];
      				if((object.get('appname')===('project' + projectid))&&(object.get('assetassemblyid')===assetassemblyid)&&(object.get('completed')===true)){
      					
      					hasBadge=true;
      					break;
      				}
      				
    			}
    			if(hasBadge){
    				console.log("We already have the badge");
    			}
    			else{
    				console.log("We don't already have the badge");
    				var DimpleContentUserProgress = Parse.Object.extend("dimplecontentuserprogress");
    				var dimplecontentuserprogress = new DimpleContentUserProgress();

					//dimplecontentuserprogress.set("user", currentUser);
					var relation=dimplecontentuserprogress.relation("owner");
					relation.add(currentUser);
					dimplecontentuserprogress.set("appname","project" + projectid);
					dimplecontentuserprogress.set("assetassemblyid",assetassemblyid);
					dimplecontentuserprogress.set("iconid",0);
					dimplecontentuserprogress.set("completed",true);
					dimplecontentuserprogress.set("badgeurl",badgeurl);
					dimplecontentuserprogress.set("correctanswerurl",caurl);
					dimplecontentuserprogress.set("assetindex",assetindex);

					dimplecontentuserprogress.set("timestamp",new Date());
					dimplecontentuserprogress.set("task",task);
					dimplecontentuserprogress.set("tasklink",tasklink);
					//dimplecontentuserprogress.set("taskurl",taskurl);
					dimplecontentuserprogress.set("correctanswerindex",correctanswerindex);

					

					dimplecontentuserprogress.save(null, {
						success: function(dimplecontentuserprogress) {
				   		 // Execute any logic that should take place after the object is saved.
				   		 console.log('New object created with objectId: ' + dimplecontentuserprogress.id);
				   		},
				   		error: function(dimplecontentuserprogress, error) {
				   	 		// Execute any logic that should take place if the save fails.
	    		// error is a Parse.Error with an error code and description.
					    		console.log('Failed to create new object, with error code: ' + error.description);
				    	}
				    });


				}
			},
			error: function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
			});

	

		/*
    var url="../DimpleCMS/taskCompleted?assetassemblyid=" +assetassemblyid + "&appname=project" + projectid +"&iconid=0" +"&badgeurl=" +badgeurl + "&task=" + task + "&tasklink=" + tasklink +"&projectid=" + projectid + "&correctanswerindex=" + correctanswerindex;
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
		//alert("NotifyAATaskCompleted response:" + http_request.responseText);
                eval(http_request.responseText);
            }
     };
     http_request.send(null);
     */
 	}
	
}

function reportIncorrect(qelement,iaurl,dburl,assetindex){
	//console.log("reportIncorrect: " + assetindex);
	var trNode=qelement.parentNode.parentNode;
	
	//var badgeholderimgEl=trNode.childNodes[2].childNodes[0];
	//var badgeholderimgEl=document.getElementById('badgeimg'+id);

	var badgeholdertdel=document.getElementById('badgeholder'+assetindex);	
	var badgeholderimgEl=badgeholdertdel.childNodes[0];

	badgeholderimgEl.src=dburl;
	//var responseImgEl=trNode.childNodes[0].childNodes[0];
	//var responseImgEl=document.getElementById('responseimg'+id);

	var responseImgEl=document.getElementById('responseimg'+assetindex);
	responseImgEl.src=iaurl;
	responseImgEl.style.visibility='visible';
	var congratsSpanEl=document.getElementById('congratsspan'+assetindex);
	//var congratsSpanEl=trNode.parentNode.parentNode.parentNode.childNodes[2].childNodes[0];
	congratsSpanEl.style.visibility='hidden';
}

function checkIfUserHasBadge(app,assetassemblyid,assetindex,caUrl){
var currentUser = Parse.User.current();
if (currentUser) {
		console.log("User is logged in");

		

		//does the user have the badge already

		var progress = Parse.Object.extend("dimplecontentuserprogress");
		var query = new Parse.Query(progress);
		query.equalTo("owner", currentUser);
		query.find({
  			success: function(results) {
	    		console.log("Successfully retrieved " + results.length + " scores.");
    				// Do something with the returned Parse.Object values
    				var hasBadge=false;
    				var object;
    			for (var i = 0; i < results.length; i++) { 
      				 object = results[i];
      				if((object.get('appname')===app)&&(object.get('assetassemblyid')===assetassemblyid)&&(object.get('completed')===true)){
      					
      					hasBadge=true;
      					break;
      				}
      				
    			}
    			if(hasBadge){
    				console.log("We already have the badge");

    				hasBadgeResponse(object);

    			}
    			else{
    				console.log("We don't already have the badge");
    				


				}
			},
			error: function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
			});
}

	/*
	 var url="../DimpleCMS/isTaskCompleted?assetassemblyid=" +assetassemblyid + "&appname=" + app + "&assetindex=" + assetindex +"&correctanswerurl=" + caUrl  + "&callback=hasBadgeResponse" ;
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
		//alert("NotifyAATaskCompleted response:" + http_request.responseText);
                eval(http_request.responseText);
            }
     };
     http_request.send(null);
     */
}

function hasBadgeResponse(jsonObject){
	var hasbadge=jsonObject.get('completed');
	var badgeUrl=jsonObject.get('badgeurl');
	var assetindex=jsonObject.get('assetindex');
	var caUrl=jsonObject.get('correctanswerurl');
	var caIndex = jsonObject.get('correctanswerindex');

	
	//alert("has badge: " + hasbadge);
	if(hasbadge){
			var badgeholdertdel=document.getElementById('badgeholder'+assetindex);	
			var badgeholderimgEl=badgeholdertdel.childNodes[0];
			//var badgeholderimgEl=document.getElementById('badgeimg');
			badgeholderimgEl.src=badgeUrl;

			//var responseImgEl=document.getElementById('responseimg');
			var responseImgEl=document.getElementById('responseimg'+assetindex);
			//responseImgEl.src="http://d3ox1gfjdlf15b.cloudfront.net/DeneTreasureHunt/tick.png";
			responseImgEl.src=caUrl;
			responseImgEl.style.visibility='visible';
			var congratsSpanEl=document.getElementById('congratsspan'+assetindex);
			congratsSpanEl.innerHTML="You already have this Badge. Well done!";
			congratsSpanEl.style.visibility='visible';

			var correctAnswerRb=document.getElementById("radio" + assetindex + "-" + caIndex);
			correctAnswerRb.checked=true;
			//var r2=document.getElementById('radio2');
			//r2.checked='true';


		
	}
}
