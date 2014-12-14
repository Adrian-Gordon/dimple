var dimpleConsoleApp = dimpleConsoleApp || {};
dimpleConsoleApp.SetImageView=Backbone.View.extend({
		 //el: $('#loggedinusername'),
		 template: _.template($('#set-image-template').html()),

		 defaults: {
  				pageNo: 1,
  				imagesPerPage:10,
  				pages:0,
  				listid:'',
          searchCriteria:'',
          originalModel:''
		},
      initialize: function(){
      	this.options = _.extend({}, this.defaults, this.options);
      	this.options.pages=Math.ceil(this.model.length / this.options.imagesPerPage);
        this.originalModel=this.model;
        this.render();
      },
      render: function(){
        //console.log("pageNo: " + this.options.pageNo +" imagesPerPage: " + this.options.imagesPerPage + " length:" + this.model.length + "pages: " + this.options.pages);
        this.$el.html(this.template(this.options));

        var startIndex=(this.options.pageNo -1)*this.options.imagesPerPage;
        var endIndex=startIndex+this.options.imagesPerPage;
        var targetModel=this.options.targetModel;
        var targetAttribute=this.options.targetAttribute;
        var targetView=this.options.targetView;

        //console.log("render images " + startIndex + " to " + endIndex);
       	var subCollection=this.model.slice(startIndex,endIndex);
       	//console.log(JSON.stringify(subCollection));
        //var listid='#' + this.options.listid;

        var listid=this.$el.find('.imagelist');
//       	$(this.options.imageListElementId).empty();
       	_.each(subCollection,function(model){
       		//console.log("Go render: " + JSON.stringify(model) + "targetModel: " + targetModel + " targetAttribute: " + targetAttribute);

       		var imageView= new dimpleConsoleApp.SelectImageView({model:model,targetModel:targetModel,targetAttribute:targetAttribute,targetView:targetView});

       		var newel=imageView.render().el;
     		 //console.log("new el: " + JSON.stringify(newel));
      		$(listid).append(newel);
       	});
        
        
      },


      events: {
        "change input": "changeSearchCriteria",
        "click .searchbutton": "search",
   
		   "click .paginationnext": "incrementPage",
		   "click .paginationprevious": "decrementPage",
		   "click .paginationstart": "gotoFirstPage",
		   "click .paginationend": "gotoLastPage",
       
	
        },

        changeSearchCriteria: function(event){
          var target = event.target;
          this.searchCriteria=target.value;
          //console.log("search crieteria: " + this.searchCriteria);

        },


        search: function(event){
          var searchExp=this.searchCriteria;
          var found=this.originalModel.filter(function(aModel){
              var rExp=new RegExp(searchExp,"i");
              var description=aModel.get('assetDescription');
             // console.log("testing " + description + " against " + rExp + " returns: " + rExp.test(description));
              return rExp.test(aModel.get('assetDescription'));
          });
         // console.log("found: " + JSON.stringify(found));

          this.model=found;
          this.options.pages=Math.ceil(this.model.length / this.options.imagesPerPage);
          this.render();

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





