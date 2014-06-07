var dimpleConsoleApp = dimpleConsoleApp || {};
dimpleConsoleApp.ImageAndDescriptionView=Backbone.View.extend({
     defaults: {
          project:''
    },
		 //el: $('#loggedinusername'),
		 template: _.template($('#image-and-description-template').html()),

		 
      initialize: function(){
        this.options = _.extend({}, this.defaults, this.options);
        console.log("ImageAndDescriptionView initialize model:" + JSON.stringify(this.model));
      	
        this.render();
     },
      render: function(){
        console.log("ImageAndDescriptionView model: " + JSON.stringify(this.model));
        //console.log("render EnterImageUrlView: " + this.template(this.model.toJSON()));
        //console.log("el contents: " + $(this.el).html());
        console.log(" ImageAndDescriptionView el: " + this.el);
        $(this.el).html(this.template(this.model.toJSON()));



        

        $( "#banneraccordion" ).accordion({
          collapsible: true,
          heightStyle: "content"
        });
        //this.$el.html(this.template(this.model));
         //console.log("el contents: " + $(this.el).html());

        //$('#enterimageurldiv').html("<h2>Here</h2>");
        
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
          console.log("ImageAndDescriptionView go save");
         // this.model.save();
          this.model.save({
              success: function (model, response) {
                console.log("ImageAndDescriptionView save success " + JSON.stringify(model) + " " + JSON.stringify(response));
              },
              error: function (model, response) {
                console.log("ImageAndDescriptionView save error: " + JSON.stringify(model) + " " + JSON.stringify(response));
             }
          });

          this.options.project.save({
            success: function(model,response){
                console.log("image and descitpiom project save success" + JSON.stringify(model) + " " + JSON.stringify(response));
            },

            error: function(model, response){
               console.log("image and descitpiom project save error " + JSON.stringify(model) + " " + JSON.stringify(response));

            }
          });
        }
    

        
        
	});




