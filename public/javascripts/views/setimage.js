var dimpleConsoleApp = dimpleConsoleApp || {};
dimpleConsoleApp.SetImageView=Backbone.View.extend({
		 //el: $('#loggedinusername'),
		 template: _.template($('#set-image-template').html()),

		 defaults: {
  				pageNo: 1,
  				imagesPerPage:10,
  				pages:0,
  				listid:''
		},
      initialize: function(){
      	this.options = _.extend({}, this.defaults, this.options);
      	this.options.pages=Math.ceil(this.model.length / this.options.imagesPerPage);
        this.render();
      },
      render: function(){
        console.log("pageNo: " + this.options.pageNo +" imagesPerPage: " + this.options.imagesPerPage + " length:" + this.model.length + "pages: " + this.options.pages);
        this.$el.html(this.template(this.options));

        var startIndex=(this.options.pageNo -1)*this.options.imagesPerPage;
        var endIndex=startIndex+this.options.imagesPerPage;
        var target=this.options.target;
        var targetAttribute=this.options.targetAttribute;
        var targetEl=this.options.targetEl;

        console.log("render images " + startIndex + " to " + endIndex);
       	var subCollection=this.model.slice(startIndex,endIndex);
       	//console.log(JSON.stringify(subCollection));
        var listid='#' + this.options.listid;
       	$(this.options.imageListElementId).empty();
       	_.each(subCollection,function(model){
       		console.log("Go render: " + JSON.stringify(model) + "target: " + target + " targetAttribute: " + targetAttribute);

       		var imageView= new dimpleConsoleApp.SelectImageView({model:model,target:target,targetAttribute:targetAttribute,targetEl:targetEl});

       		var newel=imageView.render().el;
     		 //console.log("new el: " + JSON.stringify(newel));
      		$(listid).append(newel);
       	});
        
        
      },


      events: {
   
		"click .paginationnext": "incrementPage",
		"click .paginationprevious": "decrementPage",
		"click .paginationstart": "gotoFirstPage",
		"click .paginationend": "gotoLastPage",
       
	
        },
        incrementPage: function(event) {
    		
    		if(this.options.pageNo < this.options.pages){
    			this.options.pageNo=this.options.pageNo + 1;
    			
    			$(this.el).empty();
    			this.render();
    		}
    	
		},
		decrementPage: function(event) {
    		
    		if(this.options.pageNo > 1){
    			this.options.pageNo=this.options.pageNo - 1;
    			
    			$(this.el).empty();
    			this.render();
    		}
    	
		},
		gotoFirstPage: function(event) {
    		
    			this.options.pageNo=1;
    			
    			$(this.el).empty();
    			this.render();
    		
    	
		},
		gotoLastPage: function(event) {
    		
    			this.options.pageNo=this.options.pages;
    			
    			$(this.el).empty();
    			this.render();
    		
    	
		}
	});





