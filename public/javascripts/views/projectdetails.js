var dimpleConsoleApp = dimpleConsoleApp || {};

dimpleConsoleApp.ProjectDetailsView = Backbone.View.extend({

    //el: $('#projectdialog'),
	
	template: _.template($('#project-details').html()),

    initialize: function() {
    	this.render();
	//	this.model.bind("change", this.render, this);
    },

    render: function(eventName) {
    	//console.log("template: " + this.template());//(this.model.toJSON()));
		//$(this.el).html(this.template());//(this.model.toJSON()));
		//this.$el.html(this.template());
               // console.log("eventName: " + JSON.stringify(eventName) + " model: " + JSON.stringify(this.model));
		$(this.el).html(this.template(this.model.toJSON()));



		//create the new paginated image view
		//this.setImageView=new dimpleConsoleApp.SetImageView({model:dimpleConsoleApp.allUserImageAssets,el:$('#setbanneriddiv')});
		var setImageView=new dimpleConsoleApp.SetImageView({model:dimpleConsoleApp.allUserImageAssets,el:'#setbanneriddiv',pageNo:1,imagesPerPage:5,listid:'setprojectbannerlist',target:this.model,targetAttribute:'bannerassetid',targetEl:'projectbannerimg'});

		return (this);
    },

    events: {
                "change input": "change",
                "change textarea": "change",
				"click .save": "saveProject",
                "click .smallcrossbutton":"close",
                "click .setbanner":"setBanner"
	//	"click .delete": "deleteWine"
    },

    change: function(event) {
        var target = event.target;
        console.log('changing ' + target.id + ' from: ' + target.defaultValue + ' to: ' + target.value);
		// You could change your model on the spot, like this:
         var change = {};
         change[target.name] = target.value;
         this.model.set(change);
    },

	saveProject: function() {
		this.model.set({
			userid:$.cookie("dimpleuserid"),
			title: $('#projtitle').val(),
			description: $('#projdesc').val()
		});
		console.log("saveProject");
		//if it's new, add it to the collection, I guess
		
		 if (this.model.isNew()) {
		 	dimpleConsoleApp.allUserProjects.create(this.model);
		 } else {
			this.model.save();
		}
                this.close(); 
		return false;
	},
	
	/*deleteProject: function() {
		
		 this.model.destroy({
		 	success: function() {
		 		console.log('Product deleted successfully');
		 		
		 	}
		 });
		return false;
	},*/
        
        setBanner: function(){
            console.log("set banner");
            this.paginatedImageCollection=new dimpleConsoleApp.ImageAssets(dimpleConsoleApp.allUserImageAssets);
            console.log("length: " + dimpleConsoleApp.allUserImageAssets.length + " " + JSON.stringify(this.paginatedImageCollection));
            //this.paginatedImageCollection.bootstrap();
            
            
        },

	close: function() {
		$(this.el).unbind();
		$(this.el).empty();
	}
});
