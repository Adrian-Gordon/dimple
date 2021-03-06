var shoetreeData;
var targetIndex;
var targetInterval;
var shoetreeAsset;
var assetassemblyid;
var projectid;


function renderShoeTree(asset,aaid,pid){
	assetassemblyid=aaid;
	 shoetreeAsset=asset;
	 console.log("shoetreeAsset: " + JSON.stringify(shoetreeAsset));
	 projectid=pid;
	shoetreeData=asset.data;
	$('#' + shoetreeData.divid).append("<img id='shoetreeimg' class='shoetreeimg' src='" + shoetreeData.treeimgsrc +"' /><div id='target'><img id='target' class='target' src='/images/target-logo.png'/></div>");
	
	var interactionsS="<div class='interactions'>";
	//interactionsS+="<a id='launch' style='display:none' class='action-button shadow animate blue'>Launch!</a>";
	//interactionsS+="<div class='upload' id='uploaddiv'>";
	//interactionsS+="<input type='button' class='uploadButton' value='Upload Your Shoes' />";

	//interactionsS+="<a id='choose' class='action-button shadow animate blue'>upload!</a>";
	
	//interactionsS+="<input type='file' name='upload' accept='image/*' id=fileUpload></input>";
	//interactionsS+="</div>";//upload
	interactionsS+="</div>";



	$('#' + shoetreeData.divid).append(interactionsS);
	
	//$('#' + data.divid).append("<div style='visibility:visible' id='shoeimgwrapper' class='shoeimgwrapper'><img src='/images/converse.jpg' /></div>");
	$('#' + shoetreeData.divid).append("<div><div style='visibility:visible' id='shoeimgwrapper' class='shoeimgwrapper'><img style='background-color:grey;opacity:0.5' id='shoeimg' src='/images/chilliroad/proggy/noun_high-heel_2213.png' /></div>");
	$('#' + shoetreeData.divid).append("<div style='visibility:hidden' id='msginputdiv'><input type='text' size='35' id='usermessage' placeholder='Leave a message with your shoes' /></div></div>"); 
	$('#' + shoetreeData.divid).append("<a id='launch' style='display:none' class='action-button shadow animate blue'>launch!</a>");
	$('#' + shoetreeData.divid).append("<div class='upload' id='uploaddiv'><a id='choose' class='action-button shadow animate blue'>upload!</a><input type='file' name='upload' accept='image/*' id=fileUpload></input></div>");

	//var commentsStr="<div style='display:none;height:100px;width: 300px !important;' class='comments' id='comments'>";
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
   	commentsStr+="		    	<img id='comment-user-avatar'></img>";
    commentsStr+="		         <span class='comment-user-username' id='comment-user-username'>";
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




	$('#' + shoetreeData.divid).append(commentsStr);
	//$('#' + shoetreeData.divid).append("<div class='comments-img'><img id='comments-img-img' class='comments-img-img' src='' /></div>");
	//$('#' + shoetreeData.divid).append("<div class='comments-user'><div class='comments-user-username'><span id='comments-username'></span></div><div class='comments-comment'><span id='comments-comment'></span></div></div>");
	//$('#' + shoetreeData.divid).append("</div>");
//$('#' + data.divid).append("<div><a onclick='launch()' class='action-button shadow animate blue'>Launch!</a></div>");
	//var treepos=$('#shoetreeimg').offset();
	//alert("offset: " + JSON.stringify(treepos));

	

	$('#shoetreeimg').load(function(){

		$('#launch').click(function(o){ 
			o.preventDefault(); 
			$('#msginputdiv').css({'visibility':'hidden'});
			launch();
		});

		$('#choose').click(function(o){
			o.preventDefault();
			$('#fileUpload').trigger('click');
		})

		var treewidth=$('#shoetreeimg').width();
		var treeheight=$('#shoetreeimg').height();

		var onepercentWidth=treewidth/100;
		var onepercentHeight=treeheight/100;


		//display existing shoies

		//console.log("treewidth: " + treewidth + " treeheight: " + treeheight + " 1% width= " + onepercentWidth + " 1% height: " +onepercentHeight);

		for(var i=0;i<shoetreeData.shoelocations.length;i++){

			std=shoetreeData.shoelocations[i];
			var x= std.x;
			var y= std.y;

			var top=onepercentHeight * y;
			var left=onepercentWidth * x;

			//console.log("x: " + x + " y: " + y + " top: " + top + " left: " + left);
			console.log("std.contents: " + JSON.stringify(std) + " std.contents.length: " + std.contents.length);
			var src;

			if((typeof std.contents !== 'undefined')&&(std.contents.length > 0)){
				src=std.contents[0].url;
			}
			else {
				src=undefined;
			}

			console.log("src: " + src +  " typeof src: " + typeof src);
			if(typeof src !== 'undefined'){
				$('#' + shoetreeData.divid).append("<div><div style='visibility:visible;top:" + top +"px;left:" + left+"px;margin-top:-20px;margin-left:-20px' class='shoeimgwrapper treeimgwrapper' id='sir" + i +"'><img src='" + src +"' /></div>");
			}


		}

		$('.close-button').on('click',function(){
			$('#comments').css({'display':'none'});
			$('#comment-user-avatar').attr('src','');
			$('#comment-user-username').html("");
		})

		$('.treeimgwrapper').on('click',treeImageClick);




		var shoeImageWrapperWidth=$('#shoeimgwrapper').width();
//<div style="visibility:visible;width:40px;height:40px;top:113.80000000000001px;left:160px;margin-top:-20px;margin-left:-20px" id="shoeimgwrapper" class="shoeimgwrapper">
		var showImageWrapperX=(treewidth/2) - (shoeImageWrapperWidth /2);

		$('#uploaddiv').css({'top': treeheight -20 +'px','left': (showImageWrapperX/2) -10+ 'px'});
		$('#launch').css({'top': treeheight -20 +'px','left': (showImageWrapperX/2) -10+ 'px'});
		$('#shoeimg').css({'opacity':1})
		//$('#choose').css({'top': treeheight + 40 +'px','left': (showImageWrapperX/2) -10 + 'px'});
		//$('#fileUpload').css({'top': treeheight + 40+'px','left': (showImageWrapperX/2) -10 + 'px'});
		$('#shoeimgwrapper').css({'top': treeheight -20 + 'px','left': showImageWrapperX + 'px','visibility':'visible'});
		$('#msginputdiv').css({'top': treeheight -13+'px','left': showImageWrapperX + 70 +'px'});

		$('#fileUpload').change(function(evt) {
			console.log("fileupload change");
		    $in = $(this);
		    //$in.next().html($in.val());
		    //$('#shoeimg').attr('src',$in.val());
		    var files=evt.target.files;
		    var f=files[0];

		    var reader = new FileReader();
         
            reader.onload = (function(theFile) {
            	console.log("reader.onload");
                return function(e) {
                  //document.getElementById('list').innerHTML = ['<img src="', e.target.result,'" title="', theFile.name, '" width="50" />'].join('');
                	$('#shoeimg').attr('src',e.target.result);
                	$('#uploaddiv').toggle();
                	$('#launch').toggle();
                	$('#msginputdiv').css({'visibility':'visible'});
                	console.log("go animate");
                	 targetInterval=setInterval(function(){
						animateTarget(shoetreeData.shoelocations,onepercentWidth,onepercentHeight);

					},2000)
                };
            })(f);
           
            reader.readAsDataURL(f);

		    
		});

		//console.log("treeheight: " + treeheight + " onepercentHeight:" + onepercentHeight);
		//var targetTop=(data.shoelocations[0].y * onepercentHeight);
		//var targetLeft=(data.shoelocations[0].x * onepercentWidth);

		//console.log("target top: " + targetTop + " left: " + targetLeft);

		//$('#target').css({"top": targetTop + 'px','left': targetLeft + 'px'});
		
		// targetInterval=setInterval(function(){
		//	animateTarget(data.shoelocations,onepercentWidth,onepercentHeight);

		//},2000)


		
	});


}

function treeImageClick(){

	var shid=$(this).attr('id').replace('sir','');


	std=shoetreeData.shoelocations[shid];
	var src=std.contents[0].url;
	var name=std.contents[0].user;

	//get the parse user

	var parseQuery=new Parse.Query(Parse.User);
	parseQuery.equalTo("username",name);
	parseQuery.find({
		success:function(u){
			console.log("parse query returns: " + JSON.stringify(u) + " " + u.length + " " + JSON.stringify(u[0]));

			if(u.length > 0){
				var avatarUrl=u[0].get('avatarurl');
				var screenname=u[0].get('screenname');
				console.log("screenname: " + screenname);
				$('#comment-user-username').text(screenname);
				$('#comment-user-avatar').attr('src',avatarUrl);
			}

		},

    	error: function (error) {
        //Show if no user was found to match
        console.log("error: " + JSON.stringify(error));
    	}
	})





	var msg=std.contents[0].message


	$('#comment-img-img').attr('src',src);
	//$('#comment-user-username').text(name);
	$('#comment-text-text').text(msg);

	var shoeImgHeight=$(this).outerHeight(true);
	var commentsWidth=$('#comments').width();	
	var thisX=$(this).position().left - (commentsWidth /2);
	var diff=0;
	//var cbPos=127;//150 - half of 47 (width of component)
	var cbPos=$('#comments').width()/2 - $('#commentbefore').width() /2;

	//var cbLeft=$('#commentbefore').position().left;

	if(thisX< 0){
		 diff=0-thisX;
		thisX=0;
		 cbPos=cbPos-diff;
	}
	else if((thisX + commentsWidth)>$('#shoetreeimg').width()){
		diff=(thisX + commentsWidth)-$('#shoetreeimg').width();
		cbPos=cbPos+diff;
		thisX=$('#shoetreeimg').width()-commentsWidth;

	}

	console.log('diff: ' + diff);
	var thisY=$(this).position().top + (shoeImgHeight / 2) + 10;

	var commentLeft=thisX;
	var commentTop=thisY;

	$('#comments').css({'left':commentLeft +'px','top':commentTop + 'px'});

	

	//console.log("cbLeft: " + cbLeft);
	// cbPos=cbLeft-diff;
	//$('#commentbefore').css({'left':cbPos +'px','top':commentTop + 'px'});
	$('#commentbefore').css({'left': cbPos + 'px'})

	$('#comments').css({'display':'block'});

	console.log("clicked shoe: " + shid + " " + thisX + " " + thisY + "diff: " + diff);

}


function animateTarget(locations,widthpercent,heightpercent){
	//choose a random position
	//$('#target').fadeOut();
	$('#target .target').css({'display':'block'});


	var found=false;

	while(!found){
		targetIndex=Math.floor((Math.random() * locations.length));
		if(typeof locations[targetIndex].contents[0] == 'undefined'){
			found=true;
		}

	}

	//targetIndex=Math.floor((Math.random() * locations.length));

	var x= locations[targetIndex].x;
	var y= locations[targetIndex].y;

	var top=heightpercent * y;
	var left=widthpercent * x;

	$('#target').css({"top": top + 'px','left': left + 'px'});


	$('#target').fadeIn(500,function(){
		$('#target').fadeOut(500);


	});

		



}

function launch(){

	targetXp=shoetreeData.shoelocations[targetIndex].x;
	targetYp=shoetreeData.shoelocations[targetIndex].y;

	var treewidth=$('#shoetreeimg').width();
	var treeheight=$('#shoetreeimg').height();

	var onepercentWidth=treewidth/100;
	var onepercentHeight=treeheight/100;

	var top=onepercentHeight * targetYp -80;
	var left=onepercentWidth * targetXp-60;

	clearInterval(targetInterval);

	$('#shoeimgwrapper').animate({
		top:top + 'px',
		left:left + 'px',
		width:'50px',
		height:'50px',
		

	},1000,function(){
		$('#shoeimgwrapper').animate({
			top:(top +80) + 'px',
			left:(left +60) + 'px',
			width:'40px',
			height:'40px',
			'margin-top':'-20px',
			'margin-left':'-20px'
		},750,function(){

			var src=$('#shoeimgwrapper img').attr('src');

			var leftPos=$('#shoeimgwrapper').position().left;
			var topPos=$('#shoeimgwrapper').position().top;

			$('#' + shoetreeData.divid).append("<div><div style='visibility:visible;top:" + topPos +"px;left:" + leftPos+"px;margin-top:-20px;margin-left:-20px' class='shoeimgwrapper treeimgwrapper' id='sir" + targetIndex +"'><img src='" + src +"' /></div>");

			$('#sir'+targetIndex).on('click',treeImageClick);
			$('#shoeimgwrapper').toggle();
			$('#launch').toggle();

			//now upload the file

			uploadShoe(1,'Shoetree Shoe','#fileUpload',targetIndex);

			//and tell parse what we have done: assetassemblyid and shoetreeAsset._id

			reportProgress(projectid,assetassemblyid,shoetreeAsset.asset._id,true)

		});

		
	});

	/*$('#shoeimgwrapper').css({"top": top + 'px','left': left + 'px','width':'50px','height':'50px'});
	$('#shoeimgwrapper').width('50px');
	$('#shoeimgwrapper').height('50px');*/



}

function uploadShoe(userid,description,elid,targetIndex){

	var file=$(elid)[0].files[0];
	var fd = new FormData();
    fd.append("afile", file);
    fd.append("userid",userid);
    fd.append("assetDescription",description);

    fd.append('username','culturehub');
    fd.append('apikey','abcdefghijklmnopqrstuvwxyz1234567890');
    console.log("FormData: " + JSON.stringify(fd));
    var xhr = new XMLHttpRequest();
    xhr.file = file; // not necessary if you create scopes like this
    xhr.addEventListener('progress', function(e) {
        var done = e.position || e.loaded, total = e.totalSize || e.total;
        console.log('xhr progress: ' + (Math.floor(done/total*1000)/10) + '%');
    }, false);
    if ( xhr.upload ) {
        xhr.upload.onprogress = function(e) {
            var done = e.position || e.loaded, total = e.total || e.total;
            console.log('xhr.upload progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done/total*1000)/10) + '%');
        };
    }
    xhr.onreadystatechange = function(e) {
        if ( 4 == this.readyState ) {
            console.log(['xhr upload complete', e]);
            


          var rval = eval('(' + xhr.responseText + ')');

          console.log("uploadShoe returns: " + JSON.stringify(rval));

          var newImageAssetId=rval.assetid;

         // var imageUrl='/SelectImageAP?assetid=' + newImageAssetId + "&maxwidth=50",
         // $.get(url).done(function(url){
      
				
		//	}

          var newContents={

          		url:'/SelectImageAP?assetid=' + newImageAssetId + "&maxwidth=50",
          		user:'placeholder user',
          		message:$('#usermessage').val()
      		}
           //add it to the tree data

           var currentUser = Parse.User.current(); 
			if (currentUser) {
				newContents.user=currentUser.get('username');
			}

          shoetreeData.shoelocations[targetIndex].contents.push(newContents);

          var originalAsset=shoetreeAsset.asset;

          console.log("originalAsset was: " + JSON.stringify(originalAsset));

          originalAsset.presentations[0].data=shoetreeData;


        // shoetreeAsset.data=shoetreeData;
        // shoetreeAsset.userid=1;
         originalAsset.username='culturehub';
        originalAsset.apikey='abcdefghijklmnopqrstuvwxyz1234567890';

         console.log("originalAsset now: " + JSON.stringify(originalAsset));

         $.ajax({
         	type:"PUT",
         	dataType:'json',
         	contentType: "application/json",
         	url:'/api/v1/assets/' + originalAsset._id,
         	data: JSON.stringify(originalAsset)
         });



        //targetModel.set(targetAttribute,rval.assetid);

       // console.log(JSON.stringify(targetModel) + ' ' + targetAttribute + ' is now set to : ' + targetModel.get(targetAttribute));

      //    if(targetView){

         // var newImageAsset=new dimpleConsoleApp.Asset({"_id": rval.assetid}); //get the newly created asset

         // newImageAsset.fetch().done(function(){



         //   targetView.model=newImageAsset; 
          //  targetView.resetImageDisplay();
         // });
       // }
           

        }
    };
    xhr.open('post', '/UploadLocalImage', true);
    xhr.send(fd);
}


