var dimpleConsoleApp = dimpleConsoleApp || {};

//Project Model
dimpleConsoleApp.Asset=Backbone.Model.extend({
		urlRoot : '/api/v1/assets/',
		idAttribute:"_id",
		

	});