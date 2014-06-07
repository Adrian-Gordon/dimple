var dimpleConsoleApp = dimpleConsoleApp || {};

//View of an individual project in the left hand nav menu

  dimpleConsoleApp.ProjectView = Backbone.View.extend({
      tagName:'tr',
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
           simplePOIArray=new Array();
          var assemblies=this.model.get("assetAssemblies");
          for(i in assemblies){

            var assetAssembly=assemblies[i];
            console.log('go render ' + JSON.stringify(assetAssembly));
            var marker=addSimplePOI(assetAssembly,this.model.get("_id"),i);//.assetAssemblyDescription,assetAssembly.location[1],assetAssembly.location[0],assetAssembly._id,this.model.get("_id"));
              marker.listimageid=i;
              simplePOIArray.push(marker);
          }
          showSimpleMarkers();
          setSimpleBounds();
      },
      render: function(){
       // console.log("render project view, model: " + JSON.stringify(this.model));
       var extendedObj=this.model.toJSON();
       extendedObj.index=this.options.index;
       extendedObj.oddoreven=this.options.oddoreven;
       
       var templatehtml=this.template(extendedObj);
       //console.log(templatehtml);
        this.$el.html(templatehtml);
       // console.log("this.$el=" + this.$el.html());
        return(this);
      }
  });


