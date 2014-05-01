var dimpleConsoleApp = dimpleConsoleApp || {};
dimpleConsoleApp.ImageAndDescriptionView=Backbone.View.extend({
		 //el: $('#loggedinusername'),
		 template: _.template($('#image-and-description-template').html()),

		 
      initialize: function(){
      	
        this.render();
     },
      render: function(){
        console.log("model: " + JSON.stringify(this.model));
        //console.log("render EnterImageUrlView: " + this.template(this.model.toJSON()));
        //console.log("el contents: " + $(this.el).html());
        console.log("el: " + this.el);
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
          this.model.save();
        }
    

        
        
	});




