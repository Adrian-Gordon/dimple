var dimpleConsoleApp = dimpleConsoleApp || {};
dimpleConsoleApp.EnterImageUrlView=Backbone.View.extend({
		 //el: $('#loggedinusername'),
		 template: _.template($('#enter-image-url-template').html()),

		 
      initialize: function(){
      	
        this.render();
      },
      render: function(){
        console.log("model: " + this.model.toJSON());
        //console.log("render EnterImageUrlView: " + this.template(this.model.toJSON()));
        //console.log("el contents: " + $(this.el).html());
        console.log("el: " + this.el);
        $(this.el).html(this.template(this.model.toJSON()));
        //this.$el.html(this.template(this.model));
         //console.log("el contents: " + $(this.el).html());

        //$('#enterimageurldiv').html("<h2>Here</h2>");
        
      },


      events: {
                  "click button" : "uploadFromUrl"
	
        },

        uploadFromUrl: function(ev){
          var targetModel=this.options.targetModel;
          var targetAttribute=this.options.targetAttribute;
          var targetView=this.options.targetView;
          var frm=$(this.el).parent();
          console.log("frm: " + frm)
          var model=this.model;
          console.log("serialize: " + frm.serialize());
          $.ajax({
            type: frm.attr('method'),
            url: frm.attr('action'),
            data: frm.serialize(),
            success: function (data) {
                console.log("uploaded from url: " + data);
                
                var rval = eval('(' + data + ')');



                targetModel.set(targetAttribute,rval.assetid);

                console.log(JSON.stringify(targetModel) + ' ' + targetAttribute + ' is now set to : ' + targetModel.get(targetAttribute));


                //set the model of the target view, and tell it to render itself

                if(targetView){

                  var newImageAsset=new dimpleConsoleApp.Asset({"_id": rval.assetid}); //get the newly created asset
    
                  newImageAsset.fetch().done(function(){



                    targetView.model=newImageAsset; 
                    targetView.resetImageDisplay();
                  });
                }






               //console.log("url now: " + rval.url);
               //$('#dlgcurrentbannerimg').attr('src',rval.url);
              // model.bannerassetid=rval.bannerassetid;
               //model.set({bannerAsset:rval.assetid});
               //model.save();
                //alert('ok');
            }
        });

        }
        
	});






/*var frm=$('#uploadbannerimageform');
      //console.log("Form: " + frm);
    $('#uploadbannerimageform').submit(function (ev) {
        console.log("Form submit");
       
        $.ajax({
            type: frm.attr('method'),
            url: frm.attr('action'),
            data: frm.serialize(),
            success: function (data) {
                console.log("uplaoded from url: " + data);
                
                var rval = eval('(' + data + ')');
               //console.log("url now: " + rval.url);
               $('#dlgcurrentbannerimg').attr('src',rval.url);
                //alert('ok');
            }
        });

        ev.preventDefault();
      });
*/

