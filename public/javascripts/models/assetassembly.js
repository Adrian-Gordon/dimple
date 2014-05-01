var dimpleConsoleApp = dimpleConsoleApp || {};

//Project Model
dimpleConsoleApp.AssetAssembly=Backbone.Model.extend({
		urlRoot : '/api/v1/assetassemblies/',
		idAttribute:'assetassemblyid',
		defaults:{
			"userid":0,
			"assetassemblydescription":null,
			"latitude":0.0,
			"longitude":0.0,
			"utmloc":null,
			"layariconid":0,
			"layarimageurl":null,
			"summaryimageassetid":0
		}

	});