var dimpleConsoleApp = dimpleConsoleApp || {};

//Collection of all Projects for the current user
	dimpleConsoleApp.AllUserProjects=Backbone.Collection.extend({
 			 model: dimpleConsoleApp.Project,
  			url: '/api/v1/users/' + $.cookie("dimpleuserid") + "/projects/"
	});