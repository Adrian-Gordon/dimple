

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
            dimpleConsoleApp.allUserProjects.fetch().done(dimpleConsoleApp.renderAllUserProjectsView);
    		 		
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

          dimpleConsoleApp.currentProjectView=this;

           //set the right click listener to add a new asset assembly to the current project
          var clickFnBody="dimpleConsoleApp.currentProjectView.addNewAssetAssemblyToProject(" + this.model.get('_id') + ",event.latLng.lat(),event.latLng.lng(),true);";
          //var clickFnBody="console.log('dcapp fn: ' + dimpleConsoleApp.currentProjectView.addAssetAssemblyToProject);"
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
                     console.log("assemblies: " + JSON.stringify(assemblies));
                      var n =Object.keys(assemblies).length;
                      var count=0;
                      for(aaid in assemblies){

                        count++;
                        //console.log("i: " + i);
                       // var assetAssembly=assemblies[i];
                        //console.log('go render ' + JSON.stringify(assetAssembly));
                        var userid=model.get("userid");
                        var projectid=model.get("_id")
                        //var aaid=assetAssembly.assetAssemblyId;

                        var aaModel=new dimpleConsoleApp.AssetAssembly({_id:aaid});

                        var fn= function(aaModel,projectid,userid,i){

                              aaModel.fetch().done(function(){
                                var marker=addSimplePOI(aaModel,projectid,userid,i);//.assetAssemblyDescription,assetAssembly.location[1],assetAssembly.location[0],assetAssembly._id,this.model.get("_id"));
                                marker.listimageid=i;
                                simplePOIArray.push(marker);
                                showSimpleMarker(marker);
                                n--;
                                if(n==0)setSimpleBounds();
                                
                              });
                        }(aaModel,projectid,userid,count);

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
        //console.log("options: " + JSON.stringify(this.options));
       var extendedObj=this.model.toJSON();
       extendedObj.index=this.options.index;
       extendedObj.oddoreven=this.options.oddoreven;
      // console.log("render project view, model: " + JSON.stringify(extendedObj));
       
       var templatehtml=this.template(extendedObj);
       //console.log('templatehtml: '+templatehtml);
        this.$el.html(templatehtml);
        //console.log("this.$el=" + this.$el.html());
        return(this);
      },

     addNewAssetAssemblyToProject: function(projectid,latitude,longitude,visible){

        //create the new AssetAssembly

       /* var newAssetAssembly=new models.AssetAssemblyModel({
              assetAssemblyDescription:'New POI',
              icon:null,
              layarImageUrl:null,
              imageAsset:null,
              textElements:[],
              assets:[],
              location:[longitude,latitude]


            });

           newAssetAssembly.save(function (err) {
                 if (err) console.log("Add AssetAssembly error:" + err);
                 console.log("Saved new AssetAssembly: " + JSON.stringify(newAssetAssembly));
                 res.end(JSON.stringify(newAssetAssembly));
           });*/


      //create the new assetAssembly

       var assetAssembly=new Object();
       // assetAssembly._id=assembly.assetassemblyid;
        assetAssembly.assetAssemblyDescription="New POI";
        assetAssembly.icon=null;
        assetAssembly.layarImageUrl=null;
        assetAssembly.imageAsset=null;
        assetAssembly.visible=visible;
        assetAssembly.assets=[];
        assetAssembly.textElements={'en':{'title':'New POI','subtitle':''}};
        //assetAssembly.assetAssemblyDescription="New POI";
        assetAssembly.location=[longitude,latitude];


        var assetAssemblyModel=new dimpleConsoleApp.AssetAssembly(assetAssembly);

        assetAssemblyModel.save(null,
                  {success: function(aamodel,response){
                             var newAaId=aamodel.get('_id');

                              console.log("newAaId: " + newAaId);

                              var project= new dimpleConsoleApp.Project({_id:projectid});
                              project.fetch({success: function(model,response,options){

                                  var projectAssemblies=project.get('assetAssemblies');
                                  console.log("Project assemblies start: " + JSON.stringify(projectAssemblies));
                                  projectAssemblies[''+ newAaId]=visible;//cast to string
                                  console.log("Project assemblies now: " + JSON.stringify(projectAssemblies));
                                  project.set({'assetAssemblies':projectAssemblies});
                                  var userid=project.get('userid');
                                  var i=Object.keys(project.get('assetAssemblies')).length ;

                                 /* var i=project.get('assetAssemblies').length +1; //index of next one
                                  var userid=project.get('userid');
                                   var newAssembly={
                                        assetAssemblyId:newAaId,
                                        visible:visible
                                    };

                                    project.set({ 'assetAssemblies' : project.get('assetAssemblies').concat(newAssembly)});
                                  */


                                    project.save();

                                    //now show the new POI

                                    var marker=addSimplePOI(aamodel,projectid,userid,i);//.assetAssemblyDescription,assetAssembly.location[1],assetAssembly.location[0],assetAssembly._id,this.model.get("_id"));
                                    marker.listimageid=i;
                                    simplePOIArray.push(marker);
                                    showSimpleMarker(marker);

                              }});
                             

                            },
                    error: function(err){
                      console.log("addNewAssetAssemblyToProject assetAssemblyModel.save error" + err);
                    }}
        );

        
       
      //  var assetAssemblyModel=dimpleConsoleApp.AssetAssembly(assetAssembly);
      //  assetAssemblyModel.save();


      /*  var fnx1=function(aaid,aaModel){
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
      }(assembly.assetassemblyid,assetAssemblyModel);*/

          //   console.log("add new AA to project " + projectid + "at "  + latitude + " " + longitude);
          //var url="AddAssetAssembly?title=en|New+POI&description=New+Simple+POI&latitude=" + latitude + "&longitude=" + longitude + "&projectid=" + projectid +"&visible=" + visible + "&callback=processAddSimpleAssemblyResponse";
        //executeAjaxRequest(url);
      }
  });


