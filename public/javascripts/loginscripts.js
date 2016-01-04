function setDivDisplayStyle(divid,style){
	document.getElementById(divid).style.display=style;
}

function showSignupDiv(){
	setDivDisplayStyle('dimple-signup-div','block');
	setDivDisplayStyle('dimple-login-div','none');

}


function checkLogin(){
var currentUser = Parse.User.current();
if (currentUser) {
    document.getElementById('dimple-signup-login-widget-div').style.display='none';
    document.getElementById('dimple-remaining-content-div').style.display='block';

    



	} 
}

function checkLoginAnonymous(asset,assetassemblyid,projectid){
	data=asset.data;
	//contentStr="<div class='avatartitle'>My Avatar</div><img id='avatar' src='></img><div class='avatartext'>Click to change me</div><div class='myname'><input id='screenname' type='text' placeholder='Your Name' /></div>";

	var commentsStr="<div id='openModal' class='modalDialog'>";
	commentsStr+="</div>";
	commentsStr+="		<div  class='login-comments' id='login-comments'>";
	commentsStr+="		<div id='login-comments-content'>";
	commentsStr+="			<div class='login-close-button'>";
    commentsStr+="	    		<img class='login-close-button-img'  src='https://cdn4.iconfinder.com/data/icons/miu/22/circle_close_delete-128.png')/>";
    commentsStr+="			</div>";
    //commentsStr+="		<div>";
	commentsStr+="		<div class='login-comment-comment'>";
    commentsStr+="		    <div class='login-comment-text'>";
    commentsStr+="		       <span class='login-comment-text-text' id='login-comment-text-text'>Before you begin. you can choose a monster avatar, and tell us your name";
    commentsStr+="					<div class='avatartitle'>My Avatar</div>"
    commentsStr+="					 <img id='avatar' src=''></img>";
    commentsStr+="								<div class='avatartext'>Click to change me</div>";
    commentsStr+="								<div class='myname'>";
    commentsStr+="									<input id='screenname' type='text' placeholder='Your Name' />";
    commentsStr+="								</div>";

    commentsStr+="       		</span>";
    commentsStr+="				<div class='login-action-button-div'><a id='userchangeok' class='login-action-button login-shadow login-animate login-blue'>OK</a></div>";
    commentsStr+="    		</div>";
    commentsStr+="		</div>";
    commentsStr+="	</div>";
	commentsStr+="	</div>";
	commentsStr+="	</div>";
	


	$('#' + asset.data.divid).append(commentsStr);

	$('#avatar').click(function(){

			var currentUser = Parse.User.current(); 
			if (currentUser) {
				var id=makeid(15);
				var url="../generateAvatar?userid=" + id;
						
						$.get(url).done(function(data){
				      
				      		console.log("avatarurl: " + JSON.stringify(data));
				      		currentUser.set("avatarurl",data.url);
				      		currentUser.save();
				      		$('#avatar').attr('src',data.url);


						}).fail(function(error) {
						    console.log( "error" + JSON.stringify(error));
						  });
			}

		});

	$('#screenname').on('input',function(){
		var currentUser = Parse.User.current(); 
			if (currentUser) {
				console.log('name:' + this.value);
				currentUser.set("screenname",this.value);
				currentUser.save();
			}

		});

	$('.login-close-button').on('click',function(){
			$('#parselogin').css({'display':'none'});
		})

	$('#userchangeok').on('click',function(){
			$('#parselogin').css({'display':'none'});
		})


	$.getScript("http://www.parsecdn.com/js/parse-1.2.13.min.js",function(){

		Parse.initialize("UBibVG5WBbXwa658BS1yVfCONmw3YKCRvpjx3wqy", "c7Ks1BrdmgWylo6wIP526DO67ne2E0HgD7TiYGPa");
		//console.log("call checkLoginAnonymous");
			//var remainingContentDiv=document.getElementById('dimple-remaining-content-div');
			var currentUser = Parse.User.current(); 
			if (currentUser) {//already logged in
								//show the content
				var avatarUrl=currentUser.get("avatarurl");
				var screenname=currentUser.get('screenname');
				$('#screenname').attr('value',screenname);
				$('#mescreenname').attr('value',screenname);
				console.log("anonymously logged in: " + currentUser.getUsername() + " " + JSON.stringify(currentUser));
				//remainingContentDiv.style.display='block';

				if(typeof avatarUrl=='undefined'){
			    	console.log("Go Get Avatarturl");

			    	var url="../generateAvatar?userid=" + currentUser.getUsername();
					
					$.get(url).done(function(data){
			      
			      		console.log("avatarurl: " + JSON.stringify(data));
			      		$('#avatar').attr('src',data.url);
			      		currentUser.set("avatarurl",data.url);
			      		currentUser.save();


					}).fail(function(error) {
					    console.log( "error" + JSON.stringify(error));
					  });
			    }
			    else{
			    	$('#avatar').attr('src',avatarUrl);
			    }
			}
			else{ //create a new dummy user

				var user = new Parse.User();
				var userid=makeid(15);
				user.set("username", userid);
				user.set("password", "pwanonymous");
				user.set("firstuse",true);


				var url="../generateAvatar?userid=" + userid;
					
					$.get(url).done(function(data){
			      
			      		console.log("avatarurl: " + JSON.stringify(data));
			      		user.set("avatarurl",data.url);
			      		$('#avatar').attr('src',data.url);
			      		user.signUp(null, {
				  			success: function(user) {
				    		// Hooray! Let them use the app now.
				    			
				    			//remainingContentDiv.style.display='block';
				    			//loginDiv.style.display='none';
				    			console.log("created new anon user : " + user.getUsername() + " " + JSON.stringify(user));
				    			$('#openModal').width($('#dimple-content').width());
				    			$('#openModal').height($( window ).height());
				    			//window.location='../assemble?a=1070&p=108';
				    			$('#parselogin').fadeIn('fast');//toggle();

				  			},
				  			error: function(user, error) {
				    			// Show the error message somewhere and let the user try again.
				    			//if(error.code==202){
				    				//msgspan.innerText=error.message;
				    				//msgspan.style.display='block';
									
								//}
								console.log("error: " + JSON.stringify(error))
				 		 	}
						});


					}).fail(function(error) {
					    console.log( "error" + JSON.stringify(error));
					  });
		 
				/*user.signUp(null, {
		  			success: function(user) {
		    		// Hooray! Let them use the app now.
		    			
		    			//remainingContentDiv.style.display='block';
		    			//loginDiv.style.display='none';
		    			console.log("created new anon user : " + user.getUsername() + " " + JSON.stringify(user));

		  			},
		  			error: function(user, error) {
		    			// Show the error message somewhere and let the user try again.
		    			//if(error.code==202){
		    				//msgspan.innerText=error.message;
		    				//msgspan.style.display='block';
							
						//}
						console.log("error: " + JSON.stringify(error))
		 		 	}
				});*/


				

			}


	});

	
}

function parseLogin(){
	var name=document.getElementById('dimple-login-name-input').value;
	var pw=document.getElementById('dimple-login-password-input').value;
	var msgspan=document.getElementById('dimple-login-message');
	var remainingContentDiv=document.getElementById('dimple-remaining-content-div');
	var loginDiv=document.getElementById('dimple-signup-login-widget-div');

	document.getElementById('dimple-login-name').style.color='black';
	document.getElementById('dimple-login-password').style.color='black';

	msgspan.style.display='none';

	//console.log("parseSignup: " + name + " " + pw + " " + confirmpw);
	if(name==""){
		msgspan.style.display='block';
		msgspan.innerText="please enter your name";
		document.getElementById('dimple-login-name').style.color='red';
	}
	else if(pw==""){
		msgspan.style.display='block';
		msgspan.innerText="please enter your password";
		document.getElementById('dimple-login-pw').style.color='red';
	}
	else{
		msgspan.style.display='none';
		msgspan.innerText="";
		

		Parse.User.logIn(name, pw, {
  				success: function(user) {
    				// Do stuff after successful login.
    				remainingContentDiv.style.display='block';
    				loginDiv.style.display='none';
 				 },
  				error: function(user, error) {
   					 // The login failed. Check error to see why.
   					 msgspan.innerText=error.message;
    				msgspan.style.display='block';
  				}
		});
	}

}

function parseSignup(){
	var name=document.getElementById('dimple-signup-name-input').value;
	var pw=document.getElementById('dimple-signup-pw-input').value;
	var confirmpw=document.getElementById('dimple-signup-pw-confirm-input').value;
	var msgspan=document.getElementById('dimple-signup-message');
	var remainingContentDiv=document.getElementById('dimple-remaining-content-div');
	var loginDiv=document.getElementById('dimple-signup-login-widget-div');

	document.getElementById('dimple-signup-name').style.color='black';
	document.getElementById('dimple-signup-pw').style.color='black';
	document.getElementById('dimple-signup-pw-confirm').style.color='black';
	msgspan.style.display='none';

	//console.log("parseSignup: " + name + " " + pw + " " + confirmpw);
	if(name==""){
		msgspan.style.display='block';
		msgspan.innerText="please enter your name";
		document.getElementById('dimple-signup-name').style.color='red';
	}
	else if(pw==""){
		msgspan.style.display='block';
		msgspan.innerText="please enter your password";
		document.getElementById('dimple-signup-pw').style.color='red';
	}
	else if(confirmpw==""){
		msgspan.style.display='block';
		msgspan.innerText="please confirm your password";
		document.getElementById('dimple-signup-pw-confirm').style.color='red';
	}
	else if(pw != confirmpw){
		msgspan.style.display='block';
		msgspan.innerText="confirm password does not match password";
		document.getElementById('dimple-signup-pw-confirm').style.color='red';
	}

	else{
		msgspan.style.display='none';
		msgspan.innerText="";
		//now try to register with parse
		var user = new Parse.User();
		user.set("username", name);
		user.set("password", pw);
 
		user.signUp(null, {
  			success: function(user) {
    		// Hooray! Let them use the app now.
    			remainingContentDiv.style.display='block';
    			loginDiv.style.display='none';

  			},
  			error: function(user, error) {
    			// Show the error message somewhere and let the user try again.
    			//if(error.code==202){
    				msgspan.innerText=error.message;
    				msgspan.style.display='block';
					
				//}
 		 	}
		});
	}

}

function makeid(n)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < n; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}



