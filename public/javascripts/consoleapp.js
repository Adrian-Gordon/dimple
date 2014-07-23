var dimpleConsoleApp = dimpleConsoleApp || {};


$(function(){
//Create instances

	 dimpleConsoleApp.allUserProjects = new dimpleConsoleApp.AllUserProjects();
     dimpleConsoleApp.allUserImageAssets=new dimpleConsoleApp.Assets([],{url:'/api/v1/assets/?userid=' + $.cookie("dimpleuserid") + '&assettypeid=3'});

	

	 dimpleConsoleApp.dimpleUser=new dimpleConsoleApp.DimpleUser({id:$.cookie("dimpleuserid")});

	 dimpleConsoleApp.loggedinUserView= new dimpleConsoleApp.LoggedinUserView({model:dimpleConsoleApp.dimpleUser,el: $('#loggedinusername')});

	dimpleConsoleApp.projectsView=new dimpleConsoleApp.ProjectsView({model:dimpleConsoleApp.allUserProjects,el:$('#newprojectdiv')});


//populate instances
	
	dimpleConsoleApp.dimpleUser.fetch().done(dimpleConsoleApp.renderLoggedinUserView);

	dimpleConsoleApp.allUserProjects.fetch().done(dimpleConsoleApp.renderAllUserProjectsView);
    dimpleConsoleApp.allUserImageAssets.fetch();
        
        
/*
        var newProjectModel=new dimpleConsoleApp.Project({_id:1});
     newProjectModel.fetch({
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
                   console.log("About to append new el: " + JSON.stringify(newel));
                    $('#projlist').append(newel);
                  }

              }
      );
*/
    

});
  
