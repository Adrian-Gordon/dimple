function reportProgress(projectid,assetassemblyid,assetid,completed){


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
    				var hasCompleted=false;
    			for (var i = 0; i < results.length; i++) { 
      				var object = results[i];
      				if((object.get('appname')===('project' + projectid))&&(object.get('assetassemblyid')===assetassemblyid)&&(object.get('assetid')==assetid)&&(object.get('completed')===true)){
      					
      					hasCompleted=true;
      					break;
      				}
      				
    			}
    			if(hasCompleted){
    				console.log("We have already completed the task");
    			}
    			else{
    				console.log("We haven't already completed the task");
    				var DimpleContentUserProgress = Parse.Object.extend("dimplecontentuserprogress");
    				var dimplecontentuserprogress = new DimpleContentUserProgress();

					//dimplecontentuserprogress.set("user", currentUser);
					var relation=dimplecontentuserprogress.relation("owner");
					relation.add(currentUser);
					dimplecontentuserprogress.set("appname","project" + projectid);
					dimplecontentuserprogress.set("assetassemblyid",assetassemblyid);
					dimplecontentuserprogress.set("assetid",assetid);
					
					dimplecontentuserprogress.set("completed",true);
					

					dimplecontentuserprogress.set("timestamp",new Date());
					

					

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

	

		
 	}
	
}