function renderMePage(asset,aaid,pid){

	var currentUser = Parse.User.current();
	console.log("renderMe curentUser: " + JSON.stringify(currentUser));
	//console.log("avatarurl: " + JSON.stringify(currentUser.avatarurl));
	
	if (currentUser) {
		Parse.User.current().fetch();
		currentUser=Parse.User.current();
		var avatarUrl=currentUser.get('avatarurl');
		var screenname=currentUser.get('screenname');
		var isFirstUse=currentUser.get('firstuse');
		//screenname='Ade';
		console.log("avatarurl: " + avatarUrl);
	/*	var contentStr;
		if(typeof screenname !== 'undefined')
		 	contentStr="<div class='avatartitle'>My Avatar</div><img id='avatar' src='" + avatarUrl +"''></img><div class='avatartext'>Click to change me</div><div class='myname'><input id='screenname' type='text' placeholder='Your Name' value='" + screenname + "'/></div>";
		 else
		 	contentStr="<div class='avatartitle'>My Avatar</div><img id='avatar' src='" + avatarUrl +"''></img><div class='avatartext'>Click to change me</div><div class='myname'><input id='screenname' type='text' placeholder='Your Name' /></div>";
	
		*/
		var contentStr="		    <div class='comment-text'>";
		contentStr+="		       		<span class='comment-text-text' id='comment-text-text'>You can choose a monster avatar, and tell us your name";
		contentStr+="						<div class='avatartitle'>My Avatar</div>"
		contentStr+="					 		<img class='avatar' id='meavatar' src='" + avatarUrl +"'></img>";
		contentStr+="								<div class='avatartext'>Click to change me</div>";
		contentStr+="						<div class='avatartitle'>My Name:&nbsp;<span id='screennamespan'>" + screenname + "</span></div>"
		contentStr+="								<div class='myname'>";
		if(typeof screenname !== 'undefined')
			contentStr+="									<input id='mescreenname' type='text' placeholder='Your Name' value='" + screenname + "'/>";
		else
			contentStr+="									<input id='mescreenname' type='text' placeholder='Your Name' />";
		contentStr+="								</div>";
		contentStr+="				<div class='mepage-action-button-div'><a id='mepageuserchangeok' class='mepage-action-button mepage-shadow login-animate mepage-blue'>OK</a></div>";
  
		contentStr+="       			</span>";
		contentStr+="    			</div>";
		



		$('#' + asset.data.divid).append(contentStr);

		/*if((typeof isFirstUse == 'undefined')||(isFirstUse==true)){
			alert('this is first use');
			currentUser.set("firstuse",false);
			currentUser.save();
		}*/

		$('#meavatar').click(function(){

			var currentUser = Parse.User.current(); 
			console.log("currentUser: " + JSON.stringify(currentUser));
			if (currentUser) {
				var id=makeid(15);
				var url="../generateAvatar?userid=" + id;
						
						$.get(url).done(function(data){
				      
				      		console.log("avatarurl: " + JSON.stringify(data));
				      		currentUser.set("avatarurl",data.url);
				      		currentUser.save();
				      		$('#meavatar').attr('src',data.url);


						}).fail(function(error) {
						    console.log( "error" + JSON.stringify(error));
						  });
			}

		});

		$('#mescreenname').on('input',function(){
			console.log('name:' + this.value);
			currentUser.set("screenname",this.value);
			currentUser.save();

		});

		$('#mepageuserchangeok').click(function(){

			var currentUser = Parse.User.current(); 
			console.log("setting screenname to " + currentUser.get("screenname"));
			$('#screennamespan').text(currentUser.get("screenname"));
			//currentUser.save();

		});

		

	}
}

function previewAssetAssembly(assetassemblyid,projectid){
     //assetPresentationsPreviewWin.setURL(url);
     url= "../assemble?a=" + assetassemblyid + "&p=" + projectid;
    //alert(url);
  
    window.location=url;
}

