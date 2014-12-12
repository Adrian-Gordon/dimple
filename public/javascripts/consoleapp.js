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
        
        

    

});
  
