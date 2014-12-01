var dimpleConsoleApp = dimpleConsoleApp || {};

//Project Model
dimpleConsoleApp.Project=Backbone.Model.extend({
		//urlRoot : '/api/v1/projects/',
		idAttribute: "_id",
		urlRoot:'/api/v1/projects/',
		defaults:{
			projectTitle: "New Project",
			description: "A New dimple Project",
			bannerAsset:null,
			userid:0,
			assetAssemblies:[]
		}
		/*urlRoot: function(){
				console.log("urlRoot fn: " + JSON.stringify(this) + "id: " + this.get('id'));
		    
		      return '/api/v1/projects/' + this.get('_id');
		    
		  }*/

	});