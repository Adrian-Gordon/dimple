var dimpleConsoleApp = dimpleConsoleApp || {};

//View of an individual project in the left hand nav menu

  dimpleConsoleApp.AssemblyAccordionView = Backbone.View.extend({
  	 initialize : function (options) {
  	 	console.log("AssemblyAccordionView model: " + JSON.stringify(this.model));
  	 	this.render();

  	 },

  	template: _.template($('#asset-template').html()),

  	render: function(){
  		 var templatehtml=this.template(this.model.toJSON());
       console.log("AssemblyAccordionView " + templatehtml);
        this.$el.html(templatehtml);

        //render the asset editor
        if(this.model.get("assetTypeId")==0){
          console.log("It's text");
          var contentsEl=$(this.el).find('.assetaccordioncontents');
          var assetView=new dimpleConsoleApp.TextAssetView({model:this.model,el:contentsEl});
          
        }
        else if(this.model.get("assetTypeId")==3){//its an image
          console.log("It's an image accordion element");
           var contentsEl=$(this.el).find('.assetaccordioncontents');
           //var assetView=new dimpleConsoleApp.ImageAndDescriptionView({el:contentsEl,model:bannerAsset,targetModel:model,targetAttribute:'bannerAsset',targetView:targetView});//targetModel is a project here,targetAttribute is it's bannerAsset, targetView: this - the view on which resetImageDisplay is to be called when the image is changed
           var assetView=new dimpleConsoleApp.ImageAndDescriptionView({el:contentsEl,model:this.model,targetModel:this.model});//targetModel is a project here,targetAttribute is it's bannerAsset, targetView: this - the view on which resetImageDisplay is to be called when the image is changed


        }

  	}




  });