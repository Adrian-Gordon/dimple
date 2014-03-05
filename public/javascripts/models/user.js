var dimpleConsoleApp = dimpleConsoleApp || {};

dimpleConsoleApp.DimpleUser = Backbone.Model.extend({
    	urlRoot: '/api/v1/users/',
  		idAttribute:'userid',
  		
	});