var dimpleConsoleApp=dimpleConsoleApp || {};

dimpleConsoleApp.TextAssetView=Backbone.View.extend({

	initialize:function(options){
		this.render();

	},

	template: _.template($('#text-asset-template').html()),
     events: {
                  "change textarea" : "changedata",
                  "change input": 'changetext'
                  
    
        },

        changedata: function(event) {
        var target = event.target;
        console.log('changing ' + target.id + ' from: ' + target.defaultValue + ' to: ' + target.value);
    
        var presentations=this.model.get("presentations");

        presentations[0].data=target.value;
        // var change = {};
        // change[target.name] = target.value;
         //console.log("change: " + JSON.stringify(change));
         this.model.set('presentations',presentations);
         this.model.save();
        },
        changetext:function(event){
            var target=event.target;
            var value=target.value;
            var captions=this.model.get('captions');
            if(typeof captions == 'undefined'){
                captions={};
            }
            captions['en']=value;
            this.model.set('captions',captions);
            this.model.save();

        },

	render:function(){
		var templatehtml=this.template(this.model.toJSON());
		console.log("model: " + JSON.stringify(this.model));
       console.log("TextAssetView " + templatehtml);
        this.$el.html(templatehtml);

        var textAreaId="#htmledit-textarea-" + this.model.get("_id");

        var presentations=this.model.get("presentations");
       

        console.log("textAreaId: " + textAreaId );

        if(presentations[0].mimetype=="text/html"){
            setTimeout(function(){
            	//var editor=new wysihtml5.Editor(textAreaId,{toolbar:toolbarId,parserRules:wysihtml5ParserRules,stylesheets:['styles/editor.css']});
            	$(textAreaId).jqte({fsize:false,format:false,remove:false,source:false,sub:false,strike:false,sup:false,color:false});//[0].execCommand('inserthtml','Here is some dynamic text');

            	//$(textAreaId).val('<strong>testing</strong>').blur();
            	//$editor.updateFrame();


            },1000);
        }

        //var editor=new wysihtml5.Editor(textAreaId,{toolbar:toolbarId,parserRules:wysihtml5ParserRules});

	}
	
});