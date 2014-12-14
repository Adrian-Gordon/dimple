

var dimpleConsoleApp = dimpleConsoleApp || {};

 dimpleConsoleApp.projectIndex=1;
 dimpleConsoleApp.anchorclass='projanchoreven';

dimpleConsoleApp.ProjectsView = Backbone.View.extend({

	//el: $('.newproject'),
	
	template: _.template($('#projects-template').html()),

    //initialize: function() {
	//	this.render();
    //},
    
    
    initialize: function() {
                this.render();
		this.model.bind("reset", this.render, this); 	
		this.model.bind("add", function(project) {
                        
			//$('#projlist').append(new dimpleConsoleApp.ProjectView({model: project}).render().el);
                        //dimpleConsoleApp.renderAllUserProjectsView();//re-render
                        var view= new dimpleConsoleApp.ProjectView({model:project});
                        view.options={index: dimpleConsoleApp.projectIndex,oddoreven:dimpleConsoleApp.anchorclass};
                        dimpleConsoleApp.projectIndex++
                        if(dimpleConsoleApp.anchorclass==='projanchoreven')dimpleConsoleApp.anchorclass='projanchorodd';
                        else dimpleConsoleApp.anchorclass='projanchoreven';
                            var newel=view.render().$el;
                             $('#projlist').append(newel);
                        });
                 this.model.bind("destroy",function(project){
                     //console.log("destroy: "+ JSON.stringify(project));
                     //re-render the project list
                     dimpleConsoleApp.renderAllUserProjectsView();
                 });
    },

    render: function(eventName) {
		$(this.el).html(this.template());
		return this;
    },

    events: {
		"click .newproject": "newProject"
    },

    newProject: function(event) {
    	console.log("Add a new project, userid: " + $.cookie("dimpleuserid"));
    	 dimpleConsoleApp.projectDetailsView=new dimpleConsoleApp.ProjectDetailsView({model:new dimpleConsoleApp.Project({userid:$.cookie("dimpleuserid")}),el:$('#projectdialog')});
    	 console.log("go show projectdialog");
      $('#projectdialog').show();
		//if (app.wineView) app.wineView.close();
		//app.wineView = new WineView({model: new Wine()});
		//app.wineView.render();
		//return false;
	}
});

dimpleConsoleApp.renderAllUserProjectsView =  function(){
    //console.log("renderAllUserProjectsView allUserProjects: " + JSON.stringify(dimpleConsoleApp.allUserProjects));
    //iterate over all models in the collection
    $('#projlist').empty();
    var index=1;
    var anchorclass='projanchoreven';
   dimpleConsoleApp.allUserProjects.each(function(model){

   // console.log("input model: " + JSON.stringify(model));
    var trElement=$("<tr>").addClass(anchorclass);
    if(anchorclass==='projanchoreven')anchorclass='projanchorodd';
    else anchorclass='projanchoreven';
    $('#projlist').append(trElement);


      fn=function(model,trElement,index){
          var pid=model.get("_id");
         // console.log("PID: " + pid);
          var newProjectModel=new dimpleConsoleApp.Project({_id:pid});
         // console.log("newProjectModel: " + JSON.stringify(newProjectModel));
          newProjectModel.fetch({
                  error:function(pmodel,response){
                      console.log("newProjectModel.fetch error: " + JSON.stringify(response));
                  },
                  success: function(pmodel,response){
                   // console.log("newProjectModel.fetch success, response: " + JSON.stringify(response) + " model: " + JSON.stringify(pmodel));
                    var view= new dimpleConsoleApp.ProjectView({model:pmodel,el:trElement});
                    view.options={index: index};
                   
                    var newel=view.render().el;
                   //console.log("About to append new el: " + JSON.stringify(newel));
                    
                  }

              }
      );

      }(model,trElement,index);
       index++;




   //  console.log("Go render project model: " + JSON.stringify(model) + " id: " + model._id);
   //  var pid=model._id;
   // var pid=1;
  //   var newProjectModel=new dimpleConsoleApp.Project({_id:pid});
   /*  newProjectModel.fetch({
                  error:function(model,response){
                      console.log("newProjectModel.fetch error: " + response);
                  },
                  success: function(model,response){
                    console.log("newProjectModel.fetch success, response: " + JSON.stringify(response) + " model: " + JSON.stringify(model));
                    var view= new dimpleConsoleApp.ProjectView({model:model});
                    view.options={index: index,oddoreven:anchorclass};
                    index++;
                    if(anchorclass==='projanchoreven')anchorclass='projanchorodd';
                    else anchorclass='projanchoreven';
                    var newel=view.render().el;
                   //console.log("About to append new el: " + JSON.stringify(newel));
                    $('#projlist').append(newel);
                  }

              }
      );*/
      

    });

  }