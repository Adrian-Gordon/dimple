var dimpleConsoleApp = dimpleConsoleApp || {};
dimpleConsoleApp.SelectImageView=Backbone.View.extend({
		 
		 tagName: 'div',
		 template: _.template($('#select-image-template').html()),

		 
      initialize: function(){
      	//console.log("SelectImageView model: " + JSON.stringify(this.model));
        this.render();
      },
      render: function(){
       
        //console.log("SelectImageView model: " + JSON.stringify(this.model));
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



          //console.log("imageChosen " + this.model.get('_id'));
        
          this.options.targetModel.set(this.options.targetAttribute,this.model.get('_id'));

          //console.log(JSON.stringify(this.options.targetModel) + ' ' + this.options.targetAttribute + ' is now set to : ' + this.options.targetModel.get(this.options.targetAttribute));


          //set the model of the target view, and tell it to render itself

          if(this.options.targetView){
              this.options.targetView.model=this.model; 
              this.options.targetView.resetImageDisplay();
          }

          //set the target El, if any

         // if(this.options.targetEl){
          //  $('#'+this.options.targetEl).attr('src','/SelectImageAP?assetid=' + this.model.get('_id') +'&maxwidth=800' );
          //  console.log("Have set target");

             //$('#dlgcurrentbannerimg').attr('src','/SelectImageAP?assetid=' + this.model.get('assetid') +'&maxwidth=800');
         // }
        
      
    }
        
	});





