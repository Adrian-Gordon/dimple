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

function checkLoginAnonymous(){
	//console.log("call checkLoginAnonymous");
	var remainingContentDiv=document.getElementById('dimple-remaining-content-div');
	var currentUser = Parse.User.current(); 
	if (currentUser) {//already logged in
						//show the content
		//console.log("anonymously logged in: " + currentUser.getUsername() + " " + JSON.stringify(currentUser));
		remainingContentDiv.style.display='block';
	}
	else{ //create a new dummy user

		var user = new Parse.User();
		user.set("username", makeid(15));
		user.set("password", "pwanonymous");
 
		user.signUp(null, {
  			success: function(user) {
    		// Hooray! Let them use the app now.
    			
    			remainingContentDiv.style.display='block';
    			//loginDiv.style.display='none';

  			},
  			error: function(user, error) {
    			// Show the error message somewhere and let the user try again.
    			//if(error.code==202){
    				//msgspan.innerText=error.message;
    				//msgspan.style.display='block';
					
				//}
 		 	}
		});


		

	}
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

