var assetId;
var assetassemblyid;
var projectid;
var chimneysAsset;
var selectedChimney=0;

function renderChimneys(asset,aaid,pid){

	assetId=asset.asset._id;
	assetassemblyid=aaid;
	chimneysAsset=asset;
	
	projectid=pid;
	chimneysData=asset.data;
	chimneysHtml="<audio id='failAudio'><source src='/images/chilliroad/rosette/wrong.mp3' type='audio/mpeg'></audio>";
	chimneysHtml+="<audio id='succeedAudio'><source src='/images/chilliroad/rosette/correct.mp3' type='audio/mpeg'></audio>";
	chimneysHtml+="<div class='satellite'>";
	chimneysHtml+="<img src='/images/chilliroad/chimneys/satellite.png' />";

	if(!checkProgress(pid,aaid,asset.asset._id)){
		chimneysHtml+="<div id='letter0' class='numberCircle' onclick=\"chooses('A')\">A</div>";
		chimneysHtml+="<div id='letter1' class='numberCircle' onclick=\"chooses('B')\">B</div>";
		chimneysHtml+="<div id='letter2' class='numberCircle' onclick=\"chooses('C')\">C</div>";
		chimneysHtml+="<div id='letter3' class='numberCircle' onclick=\"chooses('D')\">D</div>";

		chimneysHtml+="<div id='chimg0' class='chimneyimgwrapper' >";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimneysx100.png' />";
		chimneysHtml+="</div>";
		chimneysHtml+="<div id='chimg1' class='chimneyimgwrapper'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimneysx100.png' />";
		chimneysHtml+="</div>";
		chimneysHtml+="<div id='chimg2' class='chimneyimgwrapper'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimneysx100.png' />";
		chimneysHtml+="</div>";
		chimneysHtml+="<div id='chimg3' class='chimneyimgwrapper'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimneysx100.png' />";
		chimneysHtml+="</div>";
		chimneysHtml+="<div class='chimneyimages'>";
		chimneysHtml+="<div id='chimney0' class='chimney chimney1 chselected' onclick='selectChimney(0)'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimneysx100.png' />";
		chimneysHtml+="</div>";//chimney
		chimneysHtml+="<div id='chimney1' class='chimney chimney2' onclick='selectChimney(1)'>"
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimneysx100.png' />";
		chimneysHtml+="</div>";//chimney
		chimneysHtml+="<div id='chimney2' class='chimney chimney3' onclick='selectChimney(2)'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimneysx100.png' />";
		chimneysHtml+="</div>";//chimney
		chimneysHtml+="<div id='chimney3' class='chimney chimney4' onclick='selectChimney(3)'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimneysx100.png' />";
		chimneysHtml+="</div>";//chimney

	chimneysHtml+="</div>"; //chimneyimages
	}
	else{
		chimneysHtml+="<div id='chimg0' class='chimneyimgwrapper'  style='display:block;top:45%;left:35%'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimneysx100.png' />";
		chimneysHtml+="</div>";
		chimneysHtml+="<div id='chimg1' class='chimneyimgwrapper' style='display:block;top:63%;left:64%'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimneysx100.png' />";
		chimneysHtml+="</div>";
		chimneysHtml+="<div id='chimg2' class='chimneyimgwrapper' style='display:block;top:10%;left:50%'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimneysx100.png' />";
		chimneysHtml+="</div>";
		chimneysHtml+="<div id='chimg3' class='chimneyimgwrapper' style='display:block;top:25%;left:10%'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimneysx100.png' />";
		chimneysHtml+="</div>";
		chimneysHtml+="<div id='alreadydonemessage' class='visible'>";
		chimneysHtml+="<span>You already know all of these!</span>"
		chimneysHtml+="</div>";//donemessage
	}

	


	chimneysHtml+="</div>"; //satellite
	

	$('#' + chimneysData.divid).append(chimneysHtml);
	
}

function selectChimney(n){
	if(!chosenCorrectly[n]){
		$('#chimney' + selectedChimney).removeClass('chselected');
		$('#chimney' + n).addClass('chselected');
		selectedChimney=n;
	}


}


var correctChoices=['C','D','B','A'];
var chosenCorrectly=[false,false,false,false];
var targets=[['45%','35%',2],['64%','63%',3],['50%','10%',1],['25%','10%',0]];

function chooses(letter){
	if(!chosenCorrectly[selectedChimney]){//haven't already done this

	if(correctChoices[selectedChimney]==letter){
		$('#succeedAudio')[0].play();

		//animate
		$('#chimg' + selectedChimney).toggle();
		$('#letter' + targets[selectedChimney][2]).toggle();
		$('#chimg' + selectedChimney).animate(
		{
			top:targets[selectedChimney][0],
			left:targets[selectedChimney][1]
		},750);


		chosenCorrectly[selectedChimney]=true;
		var allCorrect=true;
		for(var i=0;i<4;i++){
			if(!chosenCorrectly[i]){
				allCorrect=false;
				break;
			}
		}
		if(allCorrect){
			reportProgress(projectid,assetassemblyid,assetId,true);
		}
	}
	else{
		$('#failAudio')[0].play();
	}

	$('#chimney' + selectedChimney).removeClass('chselected');
	}


}

function previewAssetAssembly(assetassemblyid,projectid){
     //assetPresentationsPreviewWin.setURL(url);
     url= "../assemble?a=" + assetassemblyid + "&p=" + projectid;
    //alert(url);
  
    window.location=url;
}
