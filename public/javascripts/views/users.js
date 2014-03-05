var dimpleConsoleApp = dimpleConsoleApp || {};

dimpleConsoleApp.LoggedinUserView=Backbone.View.extend({
		 //el: $('#loggedinusername'),
		 template: _.template("<a id='loggedinusername-a' class='loggedinusername-1' onclick=\"toggleShowUserMenu();\"><%= who %></a>"),


      initialize: function(){
       // this.render();
      },
      render: function(){
        //console.log("model now: " + JSON.stringify(this.model) + " " + this.model.get('username'));
        //var contents=this.template({who: this.model.get('username')});
        //console.log("contents: " + contents);
        this.$el.html(this.template({who: this.model.get('username')}));
       // document.getElementById('loggedinusername').innerHTML=this.template({who: this.model.get('username')});
        //this.$el.html(this.template({who: this.model.get('username')}));
        //console.log("html: " + this.$el.html());
        //and show it
        $('#sdloggedindiv').show();
        
      }
	});

dimpleConsoleApp.renderLoggedinUserView=function(){
    dimpleConsoleApp.loggedinUserView.render();
   // console.log("dimpleUser: " + JSON.stringify(dimpleConsoleApp.dimpleUser));

  }



  