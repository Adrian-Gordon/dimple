var dimpleConsoleApp = dimpleConsoleApp || {};

//Collection of all Projects for the current user
	dimpleConsoleApp.Assets=Backbone.Collection.extend({
 			 model: dimpleConsoleApp.Asset
  			//url: '/api/v1/users/' + $.cookie("dimpleuserid") + "/projects/"
	});