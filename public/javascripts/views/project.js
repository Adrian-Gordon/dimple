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
                "click .edit": "editProject"
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


