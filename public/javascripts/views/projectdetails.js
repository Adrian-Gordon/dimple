var dimpleConsoleApp = dimpleConsoleApp || {};

dimpleConsoleApp.ProjectDetailsView = Backbone.View.extend({

    //el: $('#projectdialog'),
	
	template: _.template($('#project-details').html()),

    initialize: function() {
    	this.render();
	//	this.model.bind("change", this.render, this);
    },

    render: function(eventName) {
    	var that=this;
    	//console.log("template: " + this.template());//(this.model.toJSON()));
		//$(this.el).html(this.template());//(this.model.toJSON()));
		//this.$el.html(this.template());
               // console.log("eventName: " + JSON.stringify(eventName) + " model: " + JSON.stringify(this.model));
		$(this.el).html(this.template(this.model.toJSON()));


		//create the new image/description view

		//imageAndDescriptionView gets the Asset that is the image as its model

		//get the banner asset, if any

		console.log("Project Details model: " + JSON.stringify(this.model));

		var bannerAssetId=this.model.get('bannerAsset');

		var model=this.model;
		var targetView=this;
		if((typeof bannerAssetId !== 'undefined')&&(bannerAssetId != null)){
			var bannerAsset=new dimpleConsoleApp.Asset({"_id": this.model.get('bannerAsset')});
		
			bannerAsset.fetch().done(function(){
				console.log("banner Asset: " + JSON.stringify(bannerAsset));
				var imageAndDescriptionView = new dimpleConsoleApp.ImageAndDescriptionView({el:'#bannerimageanddescriptiondiv',model:bannerAsset,targetModel:model,targetAttribute:'bannerAsset',targetView:targetView});//targetModel is a project here,targetAttribute is it's bannerAsset, targetView: this - the view on which resetImageDisplay is to be called when the image is changed


		

				//var imageAndDescriptionView = new dimpleConsoleApp.ImageAndDescriptionView({el:'#imageanddescriptiondiv',model:this.model});

				
				//create the new enterimageurl view

				//var enterImageUrlView=new dimpleConsoleApp.EnterImageUrlView({el:'#enterimageurldiv',model:model});

				//create the new uploadImageView
				//var uploadLocalImageView=new dimpleConsoleApp.UploadLocalImageView({el:'#uploadlocalimagediv',model:model});

				//create the new paginated image view
				//this.setImageView=new dimpleConsoleApp.SetImageView({model:dimpleConsoleApp.allUserImageAssets,el:$('#setbanneriddiv')});
				//var setImageView=new dimpleConsoleApp.SetImageView({model:dimpleConsoleApp.allUserImageAssets,el:'#setbanneriddiv',pageNo:1,imagesPerPage:5,listid:'setprojectbannerlist',target:model,targetAttribute:'bannerAsset',targetEl:'dlgcurrentbannerimg',targetView:imageAndDescriptionView});

				return(that);
			});

		}
		else{

		

			//create a new bannerAsset model

			var newBannerAssetModel = new dimpleConsoleApp.Asset();
			newBannerAssetModel.set('userid',this.model.userid);
		
		
			console.log("banner Asset: " + JSON.stringify(newBannerAssetModel));
			var imageAndDescriptionView = new dimpleConsoleApp.ImageAndDescriptionView({el:'#bannerimageanddescriptiondiv',model:newBannerAssetModel,targetModel:model,targetAttribute:'bannerAsset',targetView:targetView});//targetModel is a project here,targetAttribute is it's bannerAsset, targetView: this - the view on which resetImageDisplay is to be called when the image is changed



			//var imageAndDescriptionView = new dimpleConsoleApp.ImageAndDescriptionView({el:'#bannerimageanddescriptiondiv',model:bannerAssetModel,project:model});


		

			//var imageAndDescriptionView = new dimpleConsoleApp.ImageAndDescriptionView({el:'#imageanddescriptiondiv',model:this.model});

			
			//create the new enterimageurl view

			//var enterImageUrlView=new dimpleConsoleApp.EnterImageUrlView({el:'#enterimageurldiv',model:model});

			//create the new uploadImageView
			//var uploadLocalImageView=new dimpleConsoleApp.UploadLocalImageView({el:'#uploadlocalimagediv',model:model});

			//create the new paginated image view
			//this.setImageView=new dimpleConsoleApp.SetImageView({model:dimpleConsoleApp.allUserImageAssets,el:$('#setbanneriddiv')});
			//var setImageView=new dimpleConsoleApp.SetImageView({model:dimpleConsoleApp.allUserImageAssets,el:'#setbanneriddiv',pageNo:1,imagesPerPage:5,listid:'setprojectbannerlist',target:model,targetAttribute:'bannerAsset',targetEl:'dlgcurrentbannerimg',targetView:imageAndDescriptionView});
			
			return (that);
		}
		

		
    },

    events: {
                "change input": "change",
                "change textarea": "change",
				"click .save": "saveProject",
                "click .smallcrossbutton":"close",
                "click .setbanner":"setBanner"
	//	"click .delete": "deleteWine"
    },
    resetImageDisplay: function(){
    	$('#projectbannerimg').attr('src','/SelectImageAP?assetid=' + this.model.get('bannerAsset'));

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
			//userid:$.cookie("dimpleuserid"),
			projectTitle: $('#projtitle').val(),
			description: $('#projdesc').val()
		});
		console.log("saveProject");
		//if it's new, add it to the collection, I guess
		
		 if (this.model.isNew()) {
		 	//this.model.save();
		 	dimpleConsoleApp.allUserProjects.create(this.model,{wait:true,success:function(resp){
		 		dimpleConsoleApp.renderAllUserProjectsView();
		 	}});

		 } else {
			this.model.save();
			dimpleConsoleApp.renderAllUserProjectsView();
		}
			//dimpleConsoleApp.renderAllUserProjectsView();
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
            //console.log("set banner");
            //this.paginatedImageCollection=new dimpleConsoleApp.ImageAssets(dimpleConsoleApp.allUserImageAssets);
            //console.log("length: " + dimpleConsoleApp.allUserImageAssets.length + " " + JSON.stringify(this.paginatedImageCollection));
            //this.paginatedImageCollection.bootstrap();
            
            
        },

	close: function() {
		$(this.el).unbind();
		$(this.el).empty();
	}
});
