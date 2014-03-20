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
          var frm=$('#uploadbannerimageform');
          var model=this.model;
          $.ajax({
            type: frm.attr('method'),
            url: frm.attr('action'),
            data: frm.serialize(),
            success: function (data) {
                console.log("uploaded from url: " + data);
                
                var rval = eval('(' + data + ')');
               //console.log("url now: " + rval.url);
               $('#dlgcurrentbannerimg').attr('src',rval.url);
              // model.bannerassetid=rval.bannerassetid;
               model.set({bannerassetid:rval.bannerassetid});
               model.save();
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

