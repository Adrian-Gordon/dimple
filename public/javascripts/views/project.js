var dimpleConsoleApp = dimpleConsoleApp || {};

//View of an individual project in the left hand nav menu

  dimpleConsoleApp.ProjectView = Backbone.View.extend({
      //tagName:'tr',
      initialize : function (options) {
        this.options = options || {};
        },

      template: _.template($('#project-item-template').html()),
       events: {
    //    "change input": "change",
		            "click .smallcrossbuttonred": "deleteProject",
                "click .edit": "editProject",
                "click .showproject":"showProject"

	//	"click .delete": "deleteWine"
        },
      deleteProject: function() {
		
    		 this.model.destroy({
    		 	success: function() {
    		 		//console.log('Product deleted successfully');
                                    //console.log("allUserProjects now: " + JSON.stringify(dimpleConsoleApp.allUserProjects));
    		 		
    		 	}
    		 });
    		return false;
	   },
      editProject:function(){
          //console.log("edit project");
          dimpleConsoleApp.projectDetailsView=new dimpleConsoleApp.ProjectDetailsView({model:this.model,el:$('#projectdialog')});
    	$('#projectdialog').show();
      },

      showProject:function(){
          //console.log("Show Project: " + JSON.stringify(this.model.get("assetAssemblies")));



           //set the right click listener to add a new asset assembly to the current project
          var clickFnBody="addAssetAssemblyToProject(" + this.model.get('_id') + ",event.latLng.lat(),event.latLng.lng(),true);";
          setMapClickListener(clickFnBody);
           
           while(simplePOIArray.length){
            var marker=simplePOIArray.pop();
            marker.closemarker.setMap(null);
            marker.setMap(null);
            
           }

           //reload, in case we've added stuff

           this.model.fetch({
              error:function(model,response){
                  console.log("Project model fetch Error: " + JSON.stringify(response));
              },

              success:function(model,response){

                     var assemblies=model.get("assetAssemblies");
                      var n =assemblies.length;
                      for(i in assemblies){
                        
                        var assetAssembly=assemblies[i];
                        console.log('go render ' + JSON.stringify(assetAssembly));
                        var userid=model.get("userid");
                        var projectid=model.get("_id")
                        var aaid=assetAssembly.assetAssemblyId;

                        var aaModel=new dimpleConsoleApp.AssetAssembly({id:aaid});

                        var fn= function(aaModel,projectid,userid,i){

                              aaModel.fetch().done(function(){
                                var marker=addSimplePOI(aaModel,projectid,userid,i);//.assetAssemblyDescription,assetAssembly.location[1],assetAssembly.location[0],assetAssembly._id,this.model.get("_id"));
                                marker.listimageid=i;
                                simplePOIArray.push(marker);
                                showSimpleMarker(marker);
                                n--;
                                if(n==0)setSimpleBounds();
                              });
                        }(aaModel,projectid,userid,i);

                        //var marker=addSimplePOI(aaModel,this.model.get("_id"),this.model.get('userid'),i);//.assetAssemblyDescription,assetAssembly.location[1],assetAssembly.location[0],assetAssembly._id,this.model.get("_id"));
                        //  marker.listimageid=i;
                         // simplePOIArray.push(marker);
                      
                    }


                }

           });



         
      
         // showSimpleMarkers();
          //setSimpleBounds();
      },
      render: function(){
        
       var extendedObj=this.model.toJSON();
       extendedObj.index=this.options.index;
       extendedObj.oddoreven=this.options.oddoreven;
       //console.log("render project view, model: " + JSON.stringify(extendedObj));
       
       var templatehtml=this.template(extendedObj);
       //console.log(templatehtml);
        this.$el.html(templatehtml);
        //console.log("this.$el=" + this.$el.html());
        return(this);
      },

     addAssetAssemblyToProject; function(projectid,latitude,longitude,visible){



       var assetAssembly=new Object();
        assetAssembly._id=assembly.assetassemblyid;
        assetAssembly.assetAssemblyDescription=assembly.assetassemblydescription;
        assetAssembly.icon=assembly.layariconid;
        assetAssembly.layarImageUrl=assembly.layarimageurl;
        assetAssembly.imageAsset=assembly.summaryimageassetid;
        assetAssembly.visible=assembly.visible;
        assetAssembly.assets=new Array();
        assetAssembly.textElements=new Array();
        assetAssembly.location=[assembly.longitude,assembly.latitude];


       
        var assetAssemblyModel=AssetAssemblyModel(assetAssembly);


        var fnx1=function(aaid,aaModel){
        AssetAssemblyModel.findOne({_id:aaid},function(err,doc){
            if(doc){
              //console.log("save assetAssemblyModel 1: " + JSON.stringify(doc) + " already exists");

            }
            else{
              aaModel.save(function(err,doc){
                 if(err)console.log("save assetAssemblyModel err: " + err);
              if(doc){
                //console.log("saved assetAssemblyModel 1: " + JSON.stringify(doc));
              }

              });

            }

        });
      }(assembly.assetassemblyid,assetAssemblyModel);

          //   console.log("add new AA to project " + projectid + "at "  + latitude + " " + longitude);
          //var url="AddAssetAssembly?title=en|New+POI&description=New+Simple+POI&latitude=" + latitude + "&longitude=" + longitude + "&projectid=" + projectid +"&visible=" + visible + "&callback=processAddSimpleAssemblyResponse";
        //executeAjaxRequest(url);
      }
  });


