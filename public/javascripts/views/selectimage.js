var dimpleConsoleApp = dimpleConsoleApp || {};
dimpleConsoleApp.SelectImageView=Backbone.View.extend({
		 
		 tagName: 'div',
		 template: _.template($('#select-image-template').html()),

		 
      initialize: function(){
      	
        this.render();
      },
      render: function(){
       
        this.$el.html(this.template(this.model.toJSON()));

        return(this);
       	
        
        
      },


      events: {
          "click .paginatedSetImage":"imageChosen"
   
		/*"click .paginationnext": "incrementPage",
		"click .paginationprevious": "decrementPage",
		"click .paginationstart": "gotoFirstPage",
		"click .paginationend": "gotoLastPage",*/
       
	
        },
        imageChosen: function(event) {
          console.log("imageChosen " + this.model.get('assetid'));
        
          this.options.target.set(this.options.targetAttribute,this.model.get('assetid'));

          console.log(this.options.target + ' ' + this.options.targetAttribute + ' is now set to : ' + this.options.target.get(this.options.targetAttribute));

          //set the target El, if any

          if(this.options.targetEl){
            $('#'+this.options.targetEl).attr('src','/SelectImageAP?assetid=' + this.model.get('assetid') +'&maxwidth=800' );
            console.log("Have set target");

             //$('#dlgcurrentbannerimg').attr('src','/SelectImageAP?assetid=' + this.model.get('assetid') +'&maxwidth=800');
          }
        
      
    }
        
	});





