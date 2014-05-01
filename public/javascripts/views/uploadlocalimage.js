var dimpleConsoleApp = dimpleConsoleApp || {};
dimpleConsoleApp.UploadLocalImageView=Backbone.View.extend({
		 //el: $('#loggedinusername'),
		 template: _.template($('#upload-local-image-template').html()),

		 
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
                  "click button" : "ajaxUploadFile"
	
        },

        /*uploadFromUrl: function(ev){
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

        },
        */

        //document.getElementById('files').addEventListener('change', function(e) {
         ajaxUploadFile: function(evt){
            //var file = this.files[0];
            //alert('file: ' + file);
             var model=this.model;
            var file=document.getElementById('bannerfile').files[0]
            var fd = new FormData();
            fd.append("afile", file);
            var xhr = new XMLHttpRequest();
            xhr.file = file; // not necessary if you create scopes like this
            xhr.addEventListener('progress', function(e) {
                var done = e.position || e.loaded, total = e.totalSize || e.total;
                console.log('xhr progress: ' + (Math.floor(done/total*1000)/10) + '%');
            }, false);
            if ( xhr.upload ) {
                xhr.upload.onprogress = function(e) {
                    var done = e.position || e.loaded, total = e.totalSize || e.total;
                    console.log('xhr.upload progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done/total*1000)/10) + '%');
                };
            }
            xhr.onreadystatechange = function(e) {
                if ( 4 == this.readyState ) {
                    console.log(['xhr upload complete', e]);
                    


                  var rval = eval('(' + xhr.responseText + ')');
                  //console.log("url now: " + rval.url);
                  $('#dlgcurrentbannerimg').attr('src',rval.url);
                  // model.bannerassetid=rval.bannerassetid;
                  model.set({bannerassetid:rval.assetid});
                  model.save();

                    //set the banner image
                   // console.log("retruned url=" + responseJson.url);
                   // $('#bannerimage').attr("src", responseJson.url);
                   // $('#bannerimage').load(function(){ $('#bannerimagediv').width(320);$('#bannerimage').width(320); });
                   // $('#emulatorbannerimage').attr("src", responseJson.url);
                   

                }
            };
            xhr.open('post', '/UploadLocalImage', true);
            xhr.send(fd);
            
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

