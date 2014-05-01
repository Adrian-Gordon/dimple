var dimpleConsoleApp = dimpleConsoleApp || {};

//Project Model
dimpleConsoleApp.Asset=Backbone.Model.extend({
		urlRoot : '/api/v1/assets/',
		idAttribute:'assetid',
		defaults:{
			"assetdescription":null,
			"assettypeid":0,
			"rating":0,
			"posterassetid":0,
			"userid":0,
			"assetsubtypeid":0,
			"version":1.0
		}

	});