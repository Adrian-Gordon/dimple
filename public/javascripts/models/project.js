var dimpleConsoleApp = dimpleConsoleApp || {};

//Project Model
dimpleConsoleApp.Project=Backbone.Model.extend({
		idAttribute:'projectid',
		defaults:{
			"projectid":null,
			"title":"",
			"description":"",
			"startdate":null,
			"enddate":null,
			"bannerassetid":0,
			"stylesid":1
		}

	});