var proggyProjectid;
var proggyAAid;
var proggyAssetid;
var proggyAsset;

var bgOriginalHeight;
var bgOriginalLeft;

function renderProggy(asset,aaid,pid){

	proggyAsset=asset;
	console.log('Proggy asset: ' + JSON.stringify(asset));
	proggyProjectid=pid;
	proggyAAid=aaid;
	proggyAssetid=asset.asset._id;

	var data=asset.data;
	var bgimageUrl=data.bgimgurl;
	$('#' + data.divid).append("<img id='proggybgimg' class='proggybgimg' src='" + bgimageUrl +"' /><div id='shrink'><img src='/images/arrow-shrink-icon.png' /></div><div id='grow'><img src='/images/magnify-icon.png' /></div>");

	$('#proggybgimg').load(function(){
		console.log("pieces: " + JSON.stringify(data.pieces));
		for(var i=0;i<data.pieces.length;i++){
			var piece=data.pieces[i];
			renderProggyPiece(data,piece);
		}
	});
	/*console.log("pieces: " + JSON.stringify(data.pieces));
	for(var i=0;i<data.pieces.length;i++){
		var piece=data.pieces[i];
		renderProggyPiece(data,piece);
	}*/
	var commentsStr="<div style='display:none;' class='comments' id='comments'>";
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

	$('#shrink').on('click',function(){
		shrinkToFit();

	});
	$('#grow').on('click',function(){
		grow();

	});
}


function renderProggyPiece(data,piece){

	var bgHeight=$('#proggybgimg').height();
	var bgWidth=$('#proggybgimg').width();

	var absentUrl=piece.imgurlabsent;
	var presentUrl=piece.imgurlpresent;


	var src;

	if(checkProgress(proggyProjectid,piece.assetassemblyid,piece.assetid)){
		console.log("checkProgress returns true");
		src=presentUrl;
	}
	else{
		src=absentUrl;
		console.log("checkProgress returns false");
	}
	var iconimageurl=piece.iconimageurl;


	var top=piece.icontop *bgHeight;
	var left=piece.iconleft*bgWidth;

	var iconheight=piece.iconsize*bgHeight;
	console.log("bgHeight: " + bgHeight + " bgWidth: " + bgWidth + " top: " + top + " left: " + left);

	$('#' + data.divid).append("<div class='proggypiece'><img src='" + src + "'/></div>");
	$('#' + data.divid).append("<div id='proggypiece-" + piece.assetassemblyid + "-" + piece.assetid + "' onclick=\"" +piece.onclickcallback + "(this," + piece.assetid + ",'" + iconimageurl +"')\" style='top:" + top + "px;left:" + left + "px' class='iconimage'><img src='" + iconimageurl + "' style='height:" + iconheight +"px'/></div>");



}

function reRenderProggyPieceIcon(data,piece){
	var bgHeight=$('#proggybgimg').height();
	var bgWidth=$('#proggybgimg').width();
	var top=piece.icontop *bgHeight;
	var left=piece.iconleft*bgWidth;
	var iconsize=piece.iconsize;
	console.log("bgHeight: " + bgHeight + " bgWidth: " + bgWidth + " top: " + top + " left: " + left + " iconsize: " + iconsize);
	$('#proggypiece-'+ piece.assetassemblyid + "-" + piece.assetid ).css({'top':top,'left':left});
	$('#proggypiece-'+ piece.assetassemblyid + "-" + piece.assetid  + " img").height(bgHeight *iconsize);

}

/*function renderProggyPiece(data,piece){

	if(checkProgress(proggyProjectid,piece.assetassemblyid,piece.assetid)){
		console.log("renderProggyPiece Success ");
	  	var src=piece.imgurlpresent;
	  	var iconimageurl=piece.iconimageurl;
		var top=piece.icontop;
		var left=piece.iconleft;
		$('#' + data.divid).append("<div class='proggypiece'><img src='" + src + "'/></div>");
		$('#' + data.divid).append("<div onclick=\"" +piece.onclickcallback + "(this," + piece.assetid + ",'" + iconimageurl +"')\" style='top:" + top + ";left:" + left + "' class='iconimage'><img src='" + iconimageurl + "'/></div>");


	}
	else{
			console.log("renderProggyPiece Failure ");
		  	var src=piece.imgurlabsent;
		  	var iconimageurl=piece.iconimageurl;
			var top=piece.icontop;
			var left=piece.iconleft;
			$('#' + data.divid).append("<div class='proggypiece'><img src='" + src + "'/></div>");
			$('#' + data.divid).append("<div onclick=\"" +piece.onclickcallback + "(this," + piece.assetid + ",'" + iconimageurl +"')\" style='top:" + top + ";left:" + left + "' class='iconimage'><img src='" + iconimageurl + "'/></div>");


	}

	checkProgress(proggyProjectid,
				  piece.assetassemblyid,
				  piece.assetid,
				  function(){
				  	console.log("Success Callback");
				  	var src=piece.imgurlpresent;
				  	var iconimageurl=piece.iconimageurl;
					var top=piece.icontop;
					var left=piece.iconleft;
					$('#' + data.divid).append("<div class='proggypiece'><img src='" + src + "'/></div>");
					$('#' + data.divid).append("<div onclick=\"" +piece.onclickcallback + "(this," + piece.assetid + ",'" + iconimageurl +"')\" style='top:" + top + ";left:" + left + "' class='iconimage'><img src='" + iconimageurl + "'/></div>");


				  },
				  function(){
				  	console.log("Failure Callback");
				  	var src=piece.imgurlabsent;
				  	var iconimageurl=piece.iconimageurl;
					var top=piece.icontop;
					var left=piece.iconleft;
					$('#' + data.divid).append("<div class='proggypiece'><img src='" + src + "'/></div>");
					$('#' + data.divid).append("<div onclick=\"" +piece.onclickcallback + "(this," + piece.assetid + ",'" + iconimageurl +"')\" style='top:" + top + ";left:" + left + "' class='iconimage'><img src='" + iconimageurl + "'/></div>");


				  });


}*/






function crossingGuardCallback(el,assetid,iconurl){
	var pos=$(el).position();

	console.log("el pos: " + pos.left + " " + pos.top);

	var centreLeft=pos.left + ($(el).width() / 2);//of icon image

	console.log("centreLeft: " + centreLeft);

	var commentWidth=$('#comments').width();
	var beforeWidth=27;

	var left=centreLeft-(commentWidth /2);

	console.log("left: " + left);
	var cbPos=(commentWidth/2) -(beforeWidth/2);

	var shift=0;
	if(left < 0){
		shift=left;
		left=0;

	}

	cbPos=cbPos+shift;

	//var left=pos.left -($(el).width() / 2) -10 ;

	//if(left < 0){
	//	left=0;
	//}

	//var diff=0;
	//var cbPos=150 - ($(el).width() /2)//half of 47 (width of component)

	//var cbLeft=$('#commentbefore').position().left;

	//if(left< 0){
	//	 diff=0-left;
	//	left=0;
	//	 cbPos=cbPos-diff;
	//}

	var top=pos.top + $(el).height() + 10;

	$('#comment-img-img').attr('src',iconurl);
	$('#comment-user-username').text("The Lollipop Man");
	var text;
	if(checkProgress(proggyProjectid,1050,10082)){
		text="You already got a weather report from the Lollipop Man.<br><br> <a href='/assemble/?a=1050&p=108'>Get the latest one</a>"
	}
	else{
		text="Get a weather report from the Lollipop Man. <br><br>Show him on the <a href='/assemble/?a=1060&p=108&clon=-1.576464492827654&clat=54.98500918273556&z=17&sib=1050'>Map</a>"
	}
	$('#comment-text-text').html(text);

	$('#comments').css({'left':left +'px','top':top + 'px'});
	$('#commentbefore').css({'left': cbPos + 'px'})

	$('#comments').css({'display':'block'});

}

function rosetteCallback(el,assetid,iconurl){
	var pos=$(el).position();

	console.log("el pos: " + pos.left + " " + pos.top);

	var centreLeft=pos.left + ($(el).width() / 2);//of icon image

	console.log("centreLeft: " + centreLeft);

	var commentWidth=$('#comments').width();
	//var beforeWidth=27;
	var beforeWidth=$('.comments-before-up').width();

	var left=centreLeft-(commentWidth /2);

	console.log("left: " + left);
	var cbPos=(commentWidth/2) -(beforeWidth/2);

	var shift=0;
	if(left < 0){
		shift=left;
		left=0;

	}

	cbPos=cbPos+shift;

	//var left=pos.left -($(el).width() / 2) -10 ;

	//if(left < 0){
	//	left=0;
	//}

	//var diff=0;
	//var cbPos=150 - ($(el).width() /2)//half of 47 (width of component)

	//var cbLeft=$('#commentbefore').position().left;

	//if(left< 0){
	//	 diff=0-left;
	//	left=0;
	//	 cbPos=cbPos-diff;
	//}

	var top=pos.top + $(el).height() + 10;

	$('#comment-img-img').attr('src',iconurl);
	$('#comment-user-username').text("The Suffragette Colours");
	var text;
	if(checkProgress(proggyProjectid,1055,10116)){
		text="You already know the colours of the Suffragette movement<br><br> <a href='/assemble/?a=1055&p=108'>Show them on a Rosette</a>"
	}
	else{
		text="Do you know the colours of the Suffragette Movement? <a href='/assemble/?a=1055&p=108'>Find out</a>";
	}
	$('#comment-text-text').html(text);

	$('#comments').css({'left':left +'px','top':top + 'px'});
	$('#commentbefore').css({'left': cbPos + 'px'})

	$('#comments').css({'display':'block'});

}

function chimneysCallback(el,assetid,iconurl){
	var pos=$(el).position();

	console.log("el pos: " + pos.left + " " + pos.top);

	var centreLeft=pos.left + ($(el).width() / 2);//of icon image

	console.log("centreLeft: " + centreLeft);

	var commentWidth=$('#comments').width();
	var beforeWidth=27;

	var left=centreLeft-(commentWidth /2);

	console.log("left: " + left);
	var cbPos=(commentWidth/2) -(beforeWidth/2);

	var shift=0;
	if(left < 0){
		shift=left;
		left=0;

	}

	cbPos=cbPos+shift;

	//var left=pos.left -($(el).width() / 2) -10 ;

	//if(left < 0){
	//	left=0;
	//}

	//var diff=0;
	//var cbPos=150 - ($(el).width() /2)//half of 47 (width of component)

	//var cbLeft=$('#commentbefore').position().left;

	//if(left< 0){
	//	 diff=0-left;
	//	left=0;
	//	 cbPos=cbPos-diff;
	//}

	var top=pos.top + $(el).height() + 10;

	$('#comment-img-img').attr('src',iconurl);
	$('#comment-user-username').text("The School Chimneys");
	var text;
	if(checkProgress(proggyProjectid,1049,10122)){
		text="You already know where the school chimneys go<br><br> <a href='/assemble/?a=1049&p=108'>See them here</a>"
	}
	else{
		text="Do you know where the chimneys go?"
	}
	$('#comment-text-text').html(text);

	$('#comments').css({'left':left +'px','top':top + 'px'});
	$('#commentbefore').css({'left': cbPos + 'px'})

	$('#comments').css({'display':'block'});

}

function sweetshopCallback(el,assetid,iconurl){
	var pos=$(el).position();

	console.log("el pos: " + pos.left + " " + pos.top);

	var centreLeft=pos.left + ($(el).width() / 2);//of icon image

	console.log("centreLeft: " + centreLeft);

	var commentWidth=$('#comments').width();
	var imgWidth=$('#proggybgimg').width();
	var beforeWidth=27;

	var left=centreLeft-(commentWidth /2);

	console.log("left: " + left);
	var cbPos=(commentWidth/2) -(beforeWidth/2);

	var shift=0;
	if(left < 0){
		shift=left;
		left=0;

	}

	if(left > (imgWidth-commentWidth)){
		shift=left -(imgWidth-commentWidth);
		left=imgWidth-commentWidth;

	}

	cbPos=cbPos+shift;
	console.log("cbpos: " + cbPos);

	//var left=pos.left -($(el).width() / 2) -10 ;

	//if(left < 0){
	//	left=0;
	//}

	//var diff=0;
	//var cbPos=150 - ($(el).width() /2)//half of 47 (width of component)

	//var cbLeft=$('#commentbefore').position().left;

	//if(left< 0){
	//	 diff=0-left;
	//	left=0;
	//	 cbPos=cbPos-diff;
	//}

	var top=pos.top + $(el).height() + 10;

	$('#comment-img-img').attr('src',iconurl);
	$('#comment-user-username').text("Clough's Sweet Shop");
	var text;
	if(checkProgress(proggyProjectid,1029,10119)){
		text="You already know your old fashioned sweets<br><br> <a href='/assemble/?a=1029&p=108'>See them here</a>"
	}
	else{
		text="How well do you know your old fashioned sweeties?"
	}
	$('#comment-text-text').html(text);

	$('#comments').css({'left':left +'px','top':top + 'px'});
	$('#commentbefore').css({'left': cbPos + 'px'})

	$('#comments').css({'display':'block'});

}

function shoeTreeCallback(el,assetid,iconurl){
	var pos=$(el).position();

	console.log("el pos: " + pos.left + " " + pos.top);

	var centreLeft=pos.left + ($(el).width() / 2);//of icon image

	console.log("centreLeft: " + centreLeft);

	var commentWidth=$('#comments').width();
	var commentHeight=$('#comments').height();
	var imgWidth=$('#proggybgimg').width();
	var imgHeight=$('#proggybgimg').height();
	var beforeWidth=27;

	var left=centreLeft-(commentWidth /2);

	console.log("left: " + left);
	var cbPos=(commentWidth/2) -(beforeWidth/2);

	var shift=0;
	if(left < 0){
		shift=left;
		left=0;

	}

	if(left > (imgWidth-commentWidth)){
		shift=left -(imgWidth-commentWidth);
		left=imgWidth-commentWidth;

	}

	cbPos=cbPos+shift;
	console.log("cbpos: " + cbPos);

	//var left=pos.left -($(el).width() / 2) -10 ;

	//if(left < 0){
	//	left=0;
	//}

	//var diff=0;
	//var cbPos=150 - ($(el).width() /2)//half of 47 (width of component)

	//var cbLeft=$('#commentbefore').position().left;

	//if(left< 0){
	//	 diff=0-left;
	//	left=0;
	//	 cbPos=cbPos-diff;
	//}

	var top=pos.top + $(el).height() + 10;

	if((top+commentHeight) >imgHeight){
		top=imgHeight - commentHeight-7;

	}

	$('#comment-img-img').attr('src',iconurl);
	$('#comment-user-username').text("The Shoe Tree");
	var text;
	if(checkProgress(proggyProjectid,1036,10043)){
		text="Your shoes are already in the Shoe Tree<br><br> <a href=''>See them here</a>"
	}
	else{
		text="Launch your shoes into the Shoe Tree<br><br><a href='/assemble/?a=1036&p=108&clon=-1.586969532072544&clat=54.98502899769934&z=17&sib=1036'>Show it on the Map</a>"
	}
	$('#comment-text-text').html(text);

	$('#comments').css({'left':left +'px','top':top + 'px'});
	$('#commentbefore').css({'left': cbPos + 'px'})

	$('#comments').css({'display':'block'});

}



function shrinkToFit(){
	$('#comments').css({'display':'none'});
	bgOriginalHeight=$('#proggybgimg').height();
	bgOriginalLeft=$('#proggymat').position().left;

	$('#shrink').css({'display':'none'});
	$('#grow').css({'display':'block'});

	var windowHeight=$(window).height();

	var headerHeight=$('#pageheader').height();
	var menuHeight=$('#footermenu').height();

	var availableHeight=windowHeight-headerHeight-menuHeight;




	$('#proggymat .proggybgimg').height(availableHeight);
	$('#proggymat .proggybgimg').css('width','auto');
	$('#proggymat').css('width','auto');

	$('.proggypiece img').height(availableHeight);
	$('.proggypiece img').css('width','auto');

	var divWidth=$('#dimple-content').width();
	var imgWidth=$('#proggymat .proggybgimg').width();
	 var left=(divWidth-imgWidth)/2;
	console.log("shrink left: " + left);
	 $('#proggymat').css({'left':left + 'px'});
	//$('.proggypiece').css({'left':left + 'px'});

	//re-position the icons
	for(var i=0;i<proggyAsset.data.pieces.length;i++){
			var piece=proggyAsset.data.pieces[i];
			reRenderProggyPieceIcon(proggyAsset.data,piece);
		}

}

function grow(){
	$('#comments').css({'display':'none'});
	$('#shrink').css({'display':'block'});
	$('#grow').css({'display':'none'});
	$('#proggybgimg').height(bgOriginalHeight);
	$('.proggypiece img').height(bgOriginalHeight);
	$('#proggymat').css({'left':bgOriginalLeft + 'px'});
	$('#proggymat').css('width','100%');
	//re-position the icons
	for(var i=0;i<proggyAsset.data.pieces.length;i++){
			var piece=proggyAsset.data.pieces[i];
			reRenderProggyPieceIcon(proggyAsset.data,piece);
		}
}




