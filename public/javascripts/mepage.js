function renderMePage(asset,aaid,pid){

	var currentUser = Parse.User.current();
	console.log("renderMe curentUser: " + JSON.stringify(currentUser));
	//console.log("avatarurl: " + JSON.stringify(currentUser.avatarurl));
	
	if (currentUser) {
		Parse.User.current().fetch();
		currentUser=Parse.User.current();
		var avatarUrl=currentUser.get('avatarurl');
		var screenname=currentUser.get('screenname');
		//screenname='Ade';
		console.log("avatarurl: " + avatarUrl);
		var contentStr;
		if(typeof screenname !== 'undefined')
		 	contentStr="<div class='avatartitle'>My Avatar</div><img id='avatar' src='" + avatarUrl +"''></img><div class='avatartext'>Click to change me</div><div class='myname'><input id='screenname' type='text' placeholder='Your Name' value='" + screenname + "'/></div>";
		 else
		 	contentStr="<div class='avatartitle'>My Avatar</div><img id='avatar' src='" + avatarUrl +"''></img><div class='avatartext'>Click to change me</div><div class='myname'><input id='screenname' type='text' placeholder='Your Name' /></div>";

		$('#' + asset.data.divid).append(contentStr);

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
			console.log('name:' + this.value);
			currentUser.set("screenname",this.value);
			currentUser.save();

		});

		

	}
}