var dimpleConsoleApp=dimpleConsoleApp || {};

dimpleConsoleApp.TextAssetView=Backbone.View.extend({

	initialize:function(options){
		this.render();

	},

	template: _.template($('#text-asset-template').html()),

	render:function(){
		var templatehtml=this.template(this.model.toJSON());
		console.log("model: " + JSON.stringify(this.model));
       console.log("TextAssetView " + templatehtml);
        this.$el.html(templatehtml);

        var textAreaId="#htmledit-textarea-" + this.model.get("_id");
       

        console.log("textAreaId: " + textAreaId );

        setTimeout(function(){
        	//var editor=new wysihtml5.Editor(textAreaId,{toolbar:toolbarId,parserRules:wysihtml5ParserRules,stylesheets:['styles/editor.css']});
        	$(textAreaId).jqte({fsize:false,format:false,remove:false,source:false,sub:false,strike:false,sup:false,color:false});//[0].execCommand('inserthtml','Here is some dynamic text');

        	//$(textAreaId).val('<strong>testing</strong>').blur();
        	//$editor.updateFrame();


        },1000)

        //var editor=new wysihtml5.Editor(textAreaId,{toolbar:toolbarId,parserRules:wysihtml5ParserRules});

	}
	
});