var dimpleConsoleApp = dimpleConsoleApp || {};
dimpleConsoleApp.ImageAndDescriptionView=Backbone.View.extend({
     defaults: {
          project:''
    },
		 //el: $('#loggedinusername'),
		 template: _.template($('#image-and-description-template').html()),

		 
      initialize: function(options){
        console.log('options: ' + JSON.stringify(options.targetModel));
        this.options=options;
        //this.options = _.extend({}, this.defaults, this.options);
        console.log("options: " + JSON.stringify(this.options));
        console.log("ImageAndDescriptionView initialize model:" + JSON.stringify(this.model));
      	
        this.render();
     },
      render: function(){
        //console.log("ImageAndDescriptionView model: " + JSON.stringify(this.model));
        //console.log("render EnterImageUrlView: " + this.template(this.model.toJSON()));
        //console.log("el contents: " + $(this.el).html());
        console.log(" ImageAndDescriptionView el: " + this.el);
        console.log("IADView: targetModel: " + JSON.stringify(this.options.targetModel));
        $(this.el).html(this.template( this.model != null? this.model.toJSON(): null));

        var enterImageEl=$(this.el).find('.enterimageurldiv');

        var enterImageUrlView=new dimpleConsoleApp.EnterImageUrlView({el:enterImageEl,model:this.model,targetModel:this.options.targetModel,targetAttribute:this.options.targetAttribute,targetView:this});


        var uploadImageEl=$(this.el).find('.uploadlocalimagediv');
        var uploadLocalImageView=new dimpleConsoleApp.UploadLocalImageView({el:uploadImageEl,model:this.model,targetModel:this.options.targetModel,targetAttribute:this.options.targetAttribute,targetView:this});

        var setImageEl=$(this.el).find('.setimgiddiv');
        var setImageView=new dimpleConsoleApp.SetImageView({model:dimpleConsoleApp.allUserImageAssets,el:setImageEl,pageNo:1,imagesPerPage:5,targetModel:this.options.targetModel,targetAttribute:this.options.targetAttribute,targetView:this});


        var accordionEl=$(this.el).find('.imgaccordion');

        //$( "#banneraccordion" ).accordion({
       $( accordionEl ).accordion({ 
          collapsible: true,
          heightStyle: "content"
        });

        //this.$el.html(this.template(this.model));
         //console.log("el contents: " + $(this.el).html());

        //$('#enterimageurldiv').html("<h2>Here</h2>");
        
      },

      resetImageDisplay: function(){

          //get the image
          $(this.el).find('.dlgimg').attr("src",'/SelectImageAP?assetid=' + this.model.get('_id'));
          //and its description
          $(this.el).find('.dlglabel').attr("value",this.model.get('assetDescription'));

      },


      events: {
                  "change input" : "change",
                  "click button" : "save"
	
        },

        change: function(event) {
        var target = event.target;
        console.log('changing ' + target.id + ' from: ' + target.defaultValue + ' to: ' + target.value);
    
         var change = {};
         change[target.name] = target.value;
         this.model.set(change);
        },

        save: function(event){
         // console.log("ImageAndDescriptionView go save " + JSON.stringify(this.options.targetModel));
         // this.model.save();
          this.model.save({
              success: function (model, response) {
                console.log("ImageAndDescriptionView save success " + JSON.stringify(model) + " " + JSON.stringify(response));
              },
              error: function (model, response) {
                console.log("ImageAndDescriptionView save error: " + JSON.stringify(model) + " " + JSON.stringify(response));
             }
          });

          this.options.targetModel.save({
            success: function(model,response){
                console.log("image and descitpiom targetModel save success" + JSON.stringify(model) + " " + JSON.stringify(response));
            },

            error: function(model, response){
               console.log("image and description targetModel save error " + JSON.stringify(model) + " " + JSON.stringify(response));

            }
          });

          if(typeof this.options.targetView=='undefined'){
            this.resetImageDisplay()
          }
          else {
            this.resetImageDisplay();
            this.options.targetView.resetImageDisplay();
          }
        }
    

        
        
	});




