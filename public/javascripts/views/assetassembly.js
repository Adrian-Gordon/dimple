

var dimpleConsoleApp = dimpleConsoleApp || {};

//View of an individual project in the left hand nav menu

  dimpleConsoleApp.AssetAssemblyView = Backbone.View.extend({
      //tagName:'tr',
      initialize : function (options) {
        this.options = options || {};
        console.log("dimpleConsoleApp.AssetAssemblyView model:" + JSON.stringify(this.model));
        console.log("dimpleConsoleApp.AssetAssemblyView projectid: " + this.options.projectid);
        var that=this;
        this.project= new dimpleConsoleApp.Project({_id:this.options.projectid});


        //get the 'visible' property of this asset assembly in this project
        this.project.fetch({success: function(model,response,options){
                    console.log("AAs:" + JSON.stringify(model.get('assetAssemblies')));
                    var results = model.get('assetAssemblies').filter(function (entry) { return entry.assetAssemblyId === that.model.get("_id"); });
                    console.log("results: " + JSON.stringify(results));
                    if(results[0])that.visible=results[0].visible;
                    that.render();
                    }});
  
       
        },

      template: _.template($('#current-asset-assembly-template').html()),
       events: {
        "change input": "change",
		    "click .smallcrossbuttonred": "deleteAssetAssembly",
        "click .button":'saveAll',
        "click .stdiv.usermenudownarrow":"toggleShowSummaryText",
        "click .stdiv.usermenuuparrow":"toggleShowSummaryText",
        "click .sidiv.usermenudownarrow":"toggleShowSummaryImage",
        "click .sidiv.usermenuuparrow":"toggleShowSummaryImage",
        "click .summaryimage":"setSummaryImage",
               

	//	"click .delete": "deleteWine"
        },

        saveAll: function(){
          this.project.save(null,
            {sucess:function(model,response){

                    },
            error:function(err){

            }
          

          });


          this.model.save(null,
            {sucess:function(model,response){

                    },
            error:function(err){

            }
          

          });
        },


      deleteAssetAssembly: function() {
		
    		 
	   },
     change: function(event) {
        var target = event.target;
        console.log('changing ' + target.id + ' from: ' + target.defaultValue + ' to: ' + target.value);

        //change to visible
        if(target.id=='cpisvisible'){

          var isChecked=$("#cpisvisible").is(':checked');
          console.log('isChecked: ' + isChecked);
          var assetAssemblies=this.project.get('assetAssemblies');
          var index;
          for(index=0;index<assetAssemblies.length;index++){
            var aa=assetAssemblies[index];
            if (aa.assetAssemblyId==this.model.get('_id'))break;
          }
          console.log("Index=" + index);
          if(isChecked){
              assetAssemblies[index].visible=true;
          }
          else{
            assetAssemblies[index].visible=false;

          }

          this.project.set('assetAssemblies',assetAssemblies);
        }
        else if(target.id=='cpsubtitle'){
           

            var textElements=this.model.get('textElements');
            textElements[0].subtitle=target.value;

            this.model.set('textElements',textElements);

        }
        else if(target.id=='cptitle'){
            var textElements=this.model.get('textElements');
            textElements[0].title=target.value;

            this.model.set('textElements',textElements);

        }
        else if(target.id=='cpst1'){
          var textElements=this.model.get('textElements');
            textElements[0].summarytext1=target.value;

            this.model.set('textElements',textElements);

        }
        else if(target.id=='cpst2'){
          var textElements=this.model.get('textElements');
            textElements[0].summarytext2=target.value;

            this.model.set('textElements',textElements);

        }
        else if(target.id=='cpst3'){
          var textElements=this.model.get('textElements');
            textElements[0].summarytext3=target.value;

            this.model.set('textElements',textElements);

        }
        else if(target.id=='cpst4'){
          var textElements=this.model.get('textElements');
            textElements[0].summarytext4=target.value;

            this.model.set('textElements',textElements);

        }


    


         //this.model.set(change);
    },
     toggleShowSummaryText: function(){
     // alert('toggleit');
      $('div.stdiv').toggleClass('usermenudownarrow usermenuuparrow');
      $('tr.strow').toggleClass('strowinvisible strowvisible');
      


     },
     toggleShowSummaryImage: function(){
     // alert('toggleit');
      $('div.sidiv').toggleClass('usermenudownarrow usermenuuparrow');
      $('tr.sirow').toggleClass('sirowinvisible sirowvisible');
      


     },
     setSummaryImage: function(){

      var summaryImageAsset=new dimpleConsoleApp.Asset({"_id": this.model.get('imageAsset')});
      var model=this.model;
      var targetView=this;
      var thisEl=this.el;
      summaryImageAsset.fetch().done(function(){
        //var setImageEl=$(thisEl).find('.setsummaryimagediv');
        var setImageEl=$('#summaryimageanddescriptiondiv');

        var imageAndDescriptionView = new dimpleConsoleApp.ImageAndDescriptionView({el:setImageEl,model:summaryImageAsset,targetModel:model,targetAttribute:'imageAsset',targetView:targetView});//targetModel is a project here,targetAttribute is it's bannerAsset, targetView: this - the view on which resetImageDisplay is to be called when the image is changed
        $('#choosesummaryimage').dialog("open");

      });

      

     },
     resetImageDisplay: function(){
     

      $(this.el).find('.summaryimage').attr('src','/SelectImageAP?assetid=' + this.model.get('imageAsset'));

     },
    
      render: function(){
        var that=this;
        
      var extended={};

      var p={projectid:this.options.projectid};
     
      var v={visible:this.visible};
       console.log("v: " + JSON.stringify(v));
      _.extend(extended,this.model.toJSON(),p,v);
      console.log("extended: " + JSON.stringify(extended));
       
       //var templatehtml=this.template(_.extend({},this.model.toJSON(),{projectid:this.project._id},{visible:this.visible}));
       var templatehtml=this.template(extended);
       //console.log(templatehtml);
        this.$el.html(templatehtml);
        //console.log("this.$el=" + this.$el.html());

         var accEl=$(this.el).find('.assetsaccordion');

         
         // $(accEl).accordion();//{ 
         // header:'h2',
         // collapsible: true,
          //heightStyle: "content"
        //});

          //$(accEl).html("<h2>stuff1</h2><div></div><h2>stuff2</h2><div></div><h2>stuff3</h2><div></div>");
       //$(accEl).accordion();


        var assets=this.model.get('assets');

        var count=assets.length;

        for(var i=0;i<assets.length;i++){
          var asset=assets[i];

          var assetid=asset.assetid;

          //get the asset

        
           var theAsset= new dimpleConsoleApp.Asset({_id:assetid});

           theAsset.fetch({success: function(asset,response,options){
              //console.log("found asset: " + JSON.stringify(asset));
              //create a new div
              //var newDiv=document.createElement('div');
              //var newHeader=$("<h3> a header</h3>");
              //var newDiv=$("<div>some content</div>");

              //create a new asset assembly accordion view

              var newDiv=$("<div></div>");

              var assemblyAccordionView =new dimpleConsoleApp.AssemblyAccordionView({model:asset,el:newDiv});

              //add the new div to this template
              //var accEl=$(that.el).find('.accordion');
              //console.log("Accel: " + accEl.html());
              //$(this.el).find('.accordion').append(newDiv);

              var newHeader=$(newDiv).find("h2");
              var newContentsDiv=$(newDiv).find('.assetaccordioncontents');
              $(accEl).append(newHeader);
              $(accEl).append(newContentsDiv);
              //console.log("Accel now: " + accEl.html());
              count--;
              if(count==0){
                $(accEl).accordion({header:'h2',active:false,collapsible:true, clearStyle:true,heightStyle:"content"}).sortable({axis:"y",handle:"h2",stop:function(event,ui){accordionSort(event,ui)}}); 
              }


           }});
          //create a new div element

         




        }
        //$(accEl).accordion();
         //$(accEl).accordion({header:'h2',active:false,collapsible:true, clearStyle:true}).sortable({axis:"y",handle:"h2",stop:function(event,ui){accordionSort(event,ui)}}); 

        

        return(this);
      },
      accordionSort:function(event,ui){

      }

   });


