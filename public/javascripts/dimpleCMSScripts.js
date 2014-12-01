var assetAssemblyView;

function toggleShowSetBannerOptions(idtoshow,divtoshow){

	console.log("toggleShowSetBannerOptions " + idtoshow + " " + divtoshow);

	$('#choosebanner .setbanneruparrow').toggleClass('setbanneruparrow setbannerdownarrow');
	$('#choosebanner .choosebannershow').toggleClass('choosebannershow choosebannerhide');

	$(divtoshow).toggleClass('choosebannerhide choosebannershow');

	$(idtoshow).toggleClass('setbannerdownarrow setbanneruparrow');

	//$(divtoshow).removeClass('choosebannerhide').addClass('choosebannershow');
	//$(divtoshow).html("Hee Hoo Har");
	
}

function showAssetAssembly(projectid,id){

	var assetAssemblyModel = new dimpleConsoleApp.AssetAssembly({_id:id});

         // console.log("newProjectModel: " + JSON.stringify(newProjectModel));
          assetAssemblyModel.fetch({
                  error:function(pmodel,response){
                      console.log("assetAssemblyModel.fetch error: " + JSON.stringify(response));
                  },
                  success: function(aamodel,response){
                   // console.log("newProjectModel.fetch success, response: " + JSON.stringify(response) + " model: " + JSON.stringify(pmodel));
                   if(assetAssemblyView){
                    assetAssemblyView.undelegateEvents();
                   }
                    assetAssemblyView= new dimpleConsoleApp.AssetAssemblyView({model:aamodel,el:$('#currentprojectassets'),projectid:projectid});
                    
                   //console.log("About to append new el: " + JSON.stringify(newel));
                    
                  }

              });
}