

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
                            var newel=view.render().el;
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
    	console.log("Add a new project");
    	 dimpleConsoleApp.projectDetailsView=new dimpleConsoleApp.ProjectDetailsView({model:new dimpleConsoleApp.Project(),el:$('#projectdialog')});
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
     // console.log("Go render model: " + JSON.stringify(model));
      var view= new dimpleConsoleApp.ProjectView({model:model});
      view.options={index: index,oddoreven:anchorclass};
      index++;
      if(anchorclass==='projanchoreven')anchorclass='projanchorodd';
      else anchorclass='projanchoreven';
      var newel=view.render().el;
     // console.log("new el: " + JSON.stringify(newel));
      $('#projlist').append(newel);

    });

  }