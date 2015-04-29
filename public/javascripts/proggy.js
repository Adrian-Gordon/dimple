function renderProggy(asset,aaid,pid){
	var data=asset.data;
	var bgimageUrl=data.bgimgurl;
	$('#' + data.divid).append("<img id='proggybgimg' class='proggybgimg' src='" + bgimageUrl +"' />");
	console.log("pieces: " + JSON.stringify(data.pieces));
	for(var i=0;i<data.pieces.length;i++){
		var piece=data.pieces[i];
		renderProggyPiece(data,piece);
	}
	var commentsStr="<div style='display:none;height:100px;width: 300px !important;' class='comments' id='comments'>";
	commentsStr+="		<div class='comments-before-up' id='commentbefore'></div>";
	commentsStr+="		<div id='comments-content'>";
	commentsStr+="			<div class='close-button'>";
    commentsStr+="	    		<img class='close-button-img'  src='https://cdn4.iconfinder.com/data/icons/miu/22/circle_close_delete-128.png' />";
    commentsStr+="			</div>";
    //commentsStr+="		<div>";
    commentsStr+="		<div class='comment-img'>";
	commentsStr+="			<img id='comment-img-img' class='comment-img-img' src='http://i.guim.co.uk/media/w-620/h--/q-95/a54bca62f9acf91b80813fa68b271c563e8614c0/0_0_3294_1977/1000.jpg' />";
	commentsStr+="		</div>";
	commentsStr+="		<div class='comment-comment'>";
    commentsStr+="		    <div class='comment-user'>";
    commentsStr+="		         <span class='comment-user-username' id='comment-user-username'>J Bowe";
    commentsStr+="		         </span>";
    commentsStr+="    		</div>";
    commentsStr+="		    <div class='comment-text'>";
    commentsStr+="		       <span class='comment-text-text' id='comment-text-text'>This is the message";
    commentsStr+="       		</span>";
    commentsStr+="    		</div>";
    commentsStr+="		</div>";
    commentsStr+="	</div>";
	commentsStr+="	</div>";
	commentsStr+="	</div>";




	$('#' + data.divid).append(commentsStr);
	
	$('.close-button').on('click',function(){
			$('#comments').css({'display':'none'});
		})
}


function renderProggyPiece(data,piece){

	var absentUrl=piece.imgurlabsent;

	var src=absentUrl;
	var iconimageurl=piece.iconimageurl;
	var top=piece.icontop;
	var left=piece.iconleft;


	$('#' + data.divid).append("<div class='proggypiece'><img src='" + src + "'/></div>");
	$('#' + data.divid).append("<div onclick=\"" +piece.onclickcallback + "(this," + piece.assetid + ",'" + iconimageurl +"')\" style='top:" + top + ";left:" + left + "' class='iconimage'><img src='" + iconimageurl + "'/></div>");



}





function crossingGuardCallback(el,assetid,iconurl){
	var pos=$(el).position();

	var left=pos.left -($(el).width() / 2) -10 ;

	if(left < 0){
		left=0;
	}

	var diff=0;
	var cbPos=150 - ($(el).width() /2)//half of 47 (width of component)

	//var cbLeft=$('#commentbefore').position().left;

	if(left< 0){
		 diff=0-left;
		left=0;
		 cbPos=cbPos-diff;
	}

	var top=pos.top + $(el).height() + 10;

	$('#comment-img-img').attr('src',iconurl);
	$('#comment-user-username').text("The Lollipop Man");
	$('#comment-text-text').html("Get a weather forecast from the Lollipop Man. Show it on the <a>Map</a>");

	$('#comments').css({'left':left +'px','top':top + 'px'});
	$('#commentbefore').css({'left': cbPos + 'px'})

	$('#comments').css({'display':'block'});

}




