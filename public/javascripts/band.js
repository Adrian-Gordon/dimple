var assetId;
var assetassemblyid;
var projectid;
var bandAsset;
var bandData;
var soundUrl;
var audioState;
var selectedCount=0;
var _player;


var statuses=[
	{'status':'_gray','img':'tuba','styles':'padding-top:18px;width:75%','aaid':1057,'assetid':10128},
	{'status':'_gray','img':'guitar','styles':'padding-top:18px;width:75%','aaid':1040,'assetid':10146},
	{'status':'_gray','img':'drum','styles':'padding-top:10px','aaid':1030,'assetid':10143},
	{'status':'_gray','img':'saxophone','styles':'padding-top:10px','aaid':1034,'assetid':10140},
	{'status':'_gray','img':'pan','styles':'padding-top:18px;width:70%','aaid':1053,'assetid':10131},
	{'status':'_gray','img':'trumpet','styles':'padding-top:20px;width:73%','aaid':1026,'assetid':10138},
	{'status':'_gray','img':'clarinet','styles':'padding-top:11px;width:73%','aaid':1054,'assetid':10149}

]



function renderBand(asset,aaid,pid){
	assetId=asset.asset._id;
	assetassemblyid=aaid;
	bandAsset=asset;
	
	projectid=pid;
	bandData=asset.data;

	reportProgress(pid,aaid,asset.asset._id,true);
	//console.log("Aset: " + JSON.stringify(asset));

	//var bandHtml="<div id=\"center\"><span class='helper'><img src='/images/chilliroad/band/play_grey.png'/></span></div>";
	var bandHtml="<div class='image-caption-above'>" + asset.asset.captions.en +"</div>"
	 bandHtml+="<div id=\"container\">";
	
    bandHtml+="<div id=\"center\"><div id='loader'><img src='/images/loading.gif' /></div><span class='helper'><img id='centreimage' src='/images/chilliroad/band/play_gray.png' onclick='playpauseaudio()'/></span></div>";
	bandHtml+="</div>";

	bandHtml+="<audio id='audioplayer'></audio>"
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
    commentsStr+="		         <span class='comment-user-username' id='comment-user-username'>Oops!";
    commentsStr+="		         </span>";
    commentsStr+="    		</div>";
    commentsStr+="		    <div class='comment-text'>";
    commentsStr+="		       <span class='comment-text-text' id='comment-text-text'>You must collect this instrument before you can select it to listen";
    commentsStr+="       		</span>";
    commentsStr+="    		</div>";
    commentsStr+="		</div>";
    commentsStr+="	</div>";
	commentsStr+="	</div>";
	commentsStr+="	</div>";





	

	$('#' + bandData.divid).append(bandHtml);
	$('#' + bandData.divid).append(commentsStr);
	createFields();
	distributeFields();
	$('.close-button').on('click',function(){
			$('#comments').css({'display':'none'});
		});

	$('#audioplayer').on('ended',function(){
		
		$('#_player').load();
		audioState='play';
		$('#centreimage').attr('src','/images/chilliroad/band/play_selected.png');
	});

	$('#audioplayer').on('canplay canplaythrough',function(){
			$('#centreimage').css({"opacity":"1.0"})
			$('#loader').css({"display":"none"})

	});

	

}

function createFields() {
		var thisSelectedIndex=0;
	    $('.field').remove();
	    var container = $('#container');
	    for(var i = 0; i < 7; i++) {
	    	var imgFilename=statuses[i].img;
	    	var styles=statuses[i].styles;
	    	var status=statuses[i].status;
	    	var assetid=statuses[i].assetid;
	    	var aaid=statuses[i].aaid;
	    	if(assetid==assetId){ //this is the page for this asset
	    		statuses[i].status=status='_present';
	    		thisSelectedIndex=i;
	    		//selectInstrument(i);
	    	}
	    	else if((typeof assetid !== 'undefined')&&(checkProgress(projectid,aaid,assetid))) {
	    		statuses[i].status=status='_present';
	    	}

	        $("<div id='field" + i + "'class='field'><span class='helper'><img src='/images/chilliroad/band/" + imgFilename + status +".png' style='" + styles + "' onclick='selectInstrument(" + i + ")'/></span></div>").appendTo(container);
	    }
	    //console.log("thisSelectedIndex: " + thisSelectedIndex);
	    selectInstrument(thisSelectedIndex)
}

function distributeFields() {
    var radius = 170;
    var fields = $('.field'), container = $('#container'),
        width = container.width(), height = container.height(),
        angle = 19, step = (2*Math.PI) / fields.length;
    fields.each(function() {
        var x = Math.round(width/2 + radius * Math.cos(angle) - $(this).width()/2);
        var y = Math.round(height/2 + radius * Math.sin(angle) - $(this).height()/2);
        if(window.console) {
            console.log($(this).text(), x, y);
        }
        $(this).css({
            left: x + 'px',
            top: y + 'px'
        });
        angle += step;
    });
}

function selectInstrument(i){
	//alert(i + " clicked");
	var currentStatus=statuses[i].status;

	if(currentStatus == '_present'){
		statuses[i].status='_selected';
		var img=statuses[i].img;
		$('#field' + i +" img").attr('src','/images/chilliroad/band/' +img + statuses[i].status + ".png");
		$('#centreimage').attr('src','/images/chilliroad/band/play_selected.png');
		 soundUrl=buildSoundUrl();
		 audioState='play';
		 selectedCount++;

	}
	else if(currentStatus=='_selected'){
		statuses[i].status='_present';
		var img=statuses[i].img;
		$('#field' + i +" img").attr('src','/images/chilliroad/band/' +img + statuses[i].status + ".png");
		$('#centreimage').attr('src','/images/chilliroad/band/play_selected.png');
		 soundUrl=buildSoundUrl();
		 audioState='play';
		 selectedCount--;
	}
	else{
		audioState=undefined;
		var top=$('#field' + i).offset().top -($('#field' + i).height() /2);
		var left=$('#field' + i).offset().left-$('#comments').width();
		$('#comments').css({'left':left +'px','top':top + 'px'});
		$('#comments').css({'display':'block'});
	}

	if(selectedCount==0){
		audioState=undefined;
		$('#centreimage').attr('src','/images/chilliroad/band/play_gray.png');
	}

}

function buildSoundUrl(){

	var url="/audio/music/";
	for(var i=0;i<7;i++){
		if(statuses[i].status =='_selected'){
			url+="" + (i + 1);
		}
		else{
			url+="_";
		}
	}
	url+='.mp3';
	//console.log('Music url: ' + url);
	return(url);
}

function playpauseaudio(){
	if(audioState=='play'){
		audioState='pause';
		$('#centreimage').attr('src','/images/chilliroad/band/pause_selected.png');
		_player=document.getElementById('audioplayer');
		if(selectedCount > 0){
			_player.src=(soundUrl);
			$('#centreimage').css({"opacity":"0.5"})
			$('#loader').css({"display":"block"})
			_player.play();
		}

	}
	else if(audioState=='pause'){
		audioState='play';
		$('#centreimage').attr('src','/images/chilliroad/band/play_selected.png');
		_player.pause();
	}

}



