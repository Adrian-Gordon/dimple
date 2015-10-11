var dimpleConsoleApp = dimpleConsoleApp || {};


$(function(){
//Create instances

	 dimpleConsoleApp.allUserProjects = new dimpleConsoleApp.AllUserProjects();
     dimpleConsoleApp.allUserImageAssets=new dimpleConsoleApp.Assets([],{url:'/api/v1/assets/?userid=' + $.cookie("dimpleuserid") + '&assettypeid=3'});

	

	 dimpleConsoleApp.dimpleUser=new dimpleConsoleApp.DimpleUser({id:$.cookie("dimpleuserid")});

	 dimpleConsoleApp.loggedinUserView= new dimpleConsoleApp.LoggedinUserView({model:dimpleConsoleApp.dimpleUser,el: $('#loggedinusername')});

	dimpleConsoleApp.projectsView=new dimpleConsoleApp.ProjectsView({model:dimpleConsoleApp.allUserProjects,el:$('#newprojectdiv')});


//populate instances
	
	dimpleConsoleApp.dimpleUser.fetch().done(dimpleConsoleApp.renderLoggedinUserView);

	dimpleConsoleApp.allUserProjects.fetch().done(dimpleConsoleApp.renderAllUserProjectsView);
    dimpleConsoleApp.allUserImageAssets.fetch();
        
        

    

});

function createNewSimpleAsset(assetType,mimetype){

	//create the new model;
	var newAssetModel = new dimpleConsoleApp.Asset();
	newAssetModel.set('userid',$.cookie("dimpleuserid"));
	newAssetModel.set('version',1.0);
	newAssetModel.set('assetDescription','New ' + assetType + " Asset");
	switch(assetType){
		case 'text':newAssetModel.set('assetTypeId',0);
		break;
		case 'video':newAssetModel.set('assetTypeId',1);
		break;
		case 'audio':newAssetModel.set('assetTypeId',2);
		break;
		case 'image':newAssetModel.set('assetTypeId',3);
		break;
		case 'webcam':newAssetModel.set('assetTypeId',4);
		break;
		case 'action':newAssetModel.set('assetTypeId',7);
		break;

	};

	var presentations=[{
		mimetype:mimetype,
		languageCode:'en',
		data:""

	}];
	newAssetModel.set('presentations',presentations);


	newAssetModel.save(null,{
              success: function (model, response) {
                console.log("createNewSimpleAsset save success " + JSON.stringify(model) + " " + JSON.stringify(response));

                //get the accordion
				 var accEl=$('#currentprojectassets .assetsaccordion');

				//create a new AssemblyAccordion View
				  //create a new asset assembly accordion view

			      var newDiv=$("<div></div>");

			      var assemblyAccordionView =new dimpleConsoleApp.AssemblyAccordionView({model:model,el:newDiv});

			      //add the new div to this template
			      //var accEl=$(that.el).find('.accordion');
			      //console.log("Accel: " + accEl.html());
			      //$(this.el).find('.accordion').append(newDiv);

			      var newHeader=$(newDiv).find("h2");
			      var newContentsDiv=$(newDiv).find('.assetaccordioncontents');
			      $(accEl).append(newHeader);
			      $(accEl).append(newContentsDiv);

			      $(accEl).accordion("refresh");

			      //and add it to the project
			     // var parentEl=$(newDiv).closest('.caatemplate');
			      var aaidElid=$('.caatemplate').attr('id');
			      console.log("AA element id=" + aaid);
			      var aaid=aaidElid.replace('caa','');

			      //get the asset assembly
			      var assetAssemblyModel = new dimpleConsoleApp.AssetAssembly({_id:aaid});

		         // console.log("newProjectModel: " + JSON.stringify(newProjectModel));
		          assetAssemblyModel.fetch({
	                  error:function(aamodel,response){
	                      console.log("assetAssemblyModel.fetch error: " + JSON.stringify(response));
	                  },
	                  success: function(aamodel,response){
	                  	var textElements=aamodel.get('textElements');
	                  	console.log("AA Text Elements: " + JSON.stringify(textElements));
	                  	var assets=aamodel.get('assets');
	                  	console.log("AA assets: " + JSON.stringify(assets));

	                  	var newAAasset={
	                  		assetid:model.get("_id"),
	                  		index:0
	                  	}

	                  	assets.push(newAAasset);
	                  	aamodel.set('assets',assets);

	                  	aamodel.save();
	                    
	                  }

              	});



              },
              error: function (model, response) {
                console.log("createNewSimpleAsset save error: " + JSON.stringify(model) + " " + JSON.stringify(response));
             }
          });


	



}
  
