var hasGreen=false;
var hasPurple=false;
var hasWhite=false;

var assetId;
var assetassemblyid;
var projectid;


function renderRosette(asset,aaid,pid){
	var coloursDivClass='visible';
	var msgClass='hidden'
	if(checkProgress(pid,aaid,asset.asset._id)){
		console.log('alrady know the rosette colours');
		hasGreen=true;
		hasPurple=true;
		hasWhite=true;
		coloursDivClass='hidden';
		msgClass='visible';

	}
	else{

	}

	assetId=asset.asset._id;
	assetassemblyid=aaid;
	 rosetteAsset=asset;
	 console.log("rosetteAsset: " + JSON.stringify(rosetteAsset));
	 projectid=pid;
	rosetteData=asset.data;
	rosetteHtml="<audio id='failAudio'><source src='/images/chilliroad/rosette/wrong.mp3' type='audio/mpeg'></audio>";
	rosetteHtml+="<audio id='succeedAudio'><source src='/images/chilliroad/rosette/correct.mp3' type='audio/mpeg'></audio>";
	rosetteHtml+="<div class='image-caption-above'>" + rosetteAsset.asset.captions.en +"</div>";
	 rosetteHtml+="<img id='rosetteimg' class='rosette' src='" + getRosetteSource(hasGreen,hasWhite,hasPurple) +"' />";
	rosetteHtml+="<div class='" +coloursDivClass +  "'><div class='rosetteRow'><div class='rosetteCell yellow' onclick='rosetteFail(this)'><img src='/images/chilliroad/rosette/cross2.png' /></div><div class='rosetteCell blue' onclick='rosetteFail(this)'><img src='/images/chilliroad/rosette/cross2.png' /></div><div class='rosetteCell white' onclick=\"rosetteSucceed(this,'white')\"><img src='/images/chilliroad/rosette/tick2.png' /></div><div class='rosetteCell green' onclick=\"rosetteSucceed(this,'green')\"><img src='/images/chilliroad/rosette/tick2.png' /></div></div>";
	rosetteHtml+="<div class='rosetteRow'><div class='rosetteCell orange' onclick='rosetteFail(this)'><img src='/images/chilliroad/rosette/cross2.png' /></div><div class='rosetteCell purple' onclick=\"rosetteSucceed(this,'purple')\"><img src='/images/chilliroad/rosette/tick2.png' /></div><div class='rosetteCell pink' onclick=\"rosetteFail(this,'pink')\"><img src='/images/chilliroad/rosette/cross2.png' /></div><div class='rosetteCell brown' onclick=\"rosetteFail(this)\"><img src='/images/chilliroad/rosette/cross2.png' /></div></div></div>";
	rosetteHtml+="<span id='congrats' class='"+msgClass +" image-caption-below'>You already successfully finished this task, Well done!</span>";
	rosetteHtml+="<div style='padding-bottom:20%'></div>";

	$('#' + rosetteData.divid).append(rosetteHtml);

}


function getRosetteSource(green,white,purple){

	var src='/images/chilliroad/rosette/rosette_';

	if(green){
		src+='green_'
	}
	else{
		src+='null_'
	}

	if(white){
		src+='white_'
	}
	else{
		src+='null_'
	}
	if(purple){
		src+='purple.png'
	}
	else{
		src+='null.png'
	}

	return(src);

}

function setRosetteSrc(src){
	$('#rosetteimg').attr('src',src);
}



function rosetteFail(el){
	$(el).find('img').css({'display':'block'});
	
	$('#failAudio')[0].play();
}

function rosetteSucceed(el,colour){
	$(el).find('img').css({'display':'block'});
	
	$('#succeedAudio')[0].play();

	if(colour=='purple'){
		hasPurple=true;
	}
	else if(colour=='white'){
		hasWhite=true;
	}
	else if(colour=='green'){
		hasGreen=true;
	}

	setRosetteSrc(getRosetteSource(hasGreen,hasWhite,hasPurple));

	//have we completed the task

	if(hasPurple && hasWhite && hasGreen){
		reportProgress(projectid,assetassemblyid,assetId,true);
	}
}

function previewAssetAssembly(assetassemblyid,projectid){
     //assetPresentationsPreviewWin.setURL(url);
     url= "../assemble?a=" + assetassemblyid + "&p=" + projectid;
    //alert(url);
  
    window.location=url;
}






