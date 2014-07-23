var dimpleConsoleApp = dimpleConsoleApp || {};

//Project Model
dimpleConsoleApp.Project=Backbone.Model.extend({
		//urlRoot : '/api/v1/projects/',
		idAttribute: "_id",
		urlRoot:'/api/v1/projects/'
		/*urlRoot: function(){
				console.log("urlRoot fn: " + JSON.stringify(this) + "id: " + this.get('id'));
		    
		      return '/api/v1/projects/' + this.get('_id');
		    
		  }*/

	});