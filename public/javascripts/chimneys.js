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
	/*chimneysHtml="<audio id='failAudio'><source src='/audio/wrong.mp3' type='audio/mpeg'></audio>";
	chimneysHtml+="<audio id='succeedAudio'><source src='/images/chilliroad/rosette/correct.mp3' type='audio/mpeg'></audio>";
	chimneysHtml+="<div class='image-caption-above'>" + chimneysAsset.asset.captions.en +"</div>";
	chimneysHtml+="<div class='satellite'>";
	chimneysHtml+="<img src='/images/chilliroad/chimneys/satellite.png' />";*/

	if(!checkProgress(pid,aaid,asset.asset._id)){
		chimneysHtml="<audio id='failAudio'><source src='/audio/wrong.mp3' type='audio/mpeg'></audio>";
		chimneysHtml+="<audio id='succeedAudio'><source src='/images/chilliroad/rosette/correct.mp3' type='audio/mpeg'></audio>";
		chimneysHtml+="<div class='image-caption-above'>" + chimneysAsset.asset.captions.en +"</div>";
		chimneysHtml+="<div class='satellite'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/satellite.png' />";

		chimneysHtml+="<div id='letter0' class='numberCircle' onclick=\"chooses('A')\">A</div>";
		chimneysHtml+="<div id='letter1' class='numberCircle' onclick=\"chooses('B')\">B</div>";
		chimneysHtml+="<div id='letter2' class='numberCircle' onclick=\"chooses('C')\">C</div>";
		chimneysHtml+="<div id='letter3' class='numberCircle' onclick=\"chooses('D')\">D</div>";
		chimneysHtml+="<div id='letter4' class='numberCircle' onclick=\"chooses('E')\">E</div>";

		chimneysHtml+="<div id='chimg0' class='chimneyimgwrapper' >";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimney1_200.png' />";
		chimneysHtml+="</div>";
		chimneysHtml+="<div id='chimg1' class='chimneyimgwrapper'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimney3_200.png' />";
		chimneysHtml+="</div>";
		chimneysHtml+="<div id='chimg2' class='chimneyimgwrapper'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimney2_200.png' />";
		chimneysHtml+="</div>";
		chimneysHtml+="<div id='chimg3' class='chimneyimgwrapper'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimney5_200.png' />";
		chimneysHtml+="</div>";
		chimneysHtml+="<div id='chimg4' class='chimneyimgwrapper'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimney4_200.png' />";
		chimneysHtml+="</div>";
		chimneysHtml+="<div class='chimneyimages'>";
		chimneysHtml+="<div id='chimney0' class='chimney chimney1 chselected' onclick='selectChimney(0)'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimney1_200.png' />";
		chimneysHtml+="</div>";//chimney
		chimneysHtml+="<div id='chimney1' class='chimney chimney2' onclick='selectChimney(1)'>"
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimney3_200.png' />";
		chimneysHtml+="</div>";//chimney
		chimneysHtml+="<div id='chimney2' class='chimney chimney3' onclick='selectChimney(2)'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimney2_200.png' />";
		chimneysHtml+="</div>";//chimney
		chimneysHtml+="<div id='chimney3' class='chimney chimney4' onclick='selectChimney(3)'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimney5_200.png' />";
		chimneysHtml+="</div>";//chimney
		chimneysHtml+="<div id='chimney4' class='chimney chimney5' onclick='selectChimney(4)'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimney4_200.png' />";
		
		chimneysHtml+="</div>";//chimney

	chimneysHtml+="</div>"; //chimneyimages
	chimneysHtml+="</div>"; //satellite
	chimneysHtml+="<div id='alldonemessage' style='display:none'>";
	chimneysHtml+="<span>Great, you got them all!</span>"
		
	}
	else{

		chimneysHtml="<audio id='failAudio'><source src='/audio/wrong.mp3' type='audio/mpeg'></audio>";
		chimneysHtml+="<audio id='succeedAudio'><source src='/images/chilliroad/rosette/correct.mp3' type='audio/mpeg'></audio>";
		chimneysHtml+="<div class='satellite'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/satellite.png' />";
		chimneysHtml+="<div id='chimg0' class='chimneyimgwrapper'  style='display:block;top:18%;left:60%'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimney1_200.png' />";
		chimneysHtml+="</div>";
		chimneysHtml+="<div id='chimg1' class='chimneyimgwrapper' style='display:block;top:43%;left:35%'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimney3_200.png' />";
		chimneysHtml+="</div>";
		chimneysHtml+="<div id='chimg2' class='chimneyimgwrapper' style='display:block;top:62%;left:63%'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimney2_200.png' />";
		chimneysHtml+="</div>";
		chimneysHtml+="<div id='chimg3' class='chimneyimgwrapper' style='display:block;top:23%;left:10%'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimney5_200.png' />";
		chimneysHtml+="</div>";
		chimneysHtml+="<div id='chimg4' class='chimneyimgwrapper' style='display:block;top:48%;left:10%'>";
		chimneysHtml+="<img src='/images/chilliroad/chimneys/chimney4_200.png' />";
		chimneysHtml+="</div>";
		chimneysHtml+="<div id='alreadydonemessage' style='font-size:1.5em;margin-top:2%;'>";
		chimneysHtml+="<span >You already know all of these!</span>"
		chimneysHtml+="</div>";
		chimneysHtml+="</div>";//donemessage
		chimneysHtml+="</div>"; //satellite
	}

	


	
	
	//chimneysHtml+="</div>";//donemessage
	

	$('#' + chimneysData.divid).append(chimneysHtml);
	
}

function selectChimney(n){
	if(!chosenCorrectly[n]){
		$('#chimney' + selectedChimney).removeClass('chselected');
		$('#chimney' + n).addClass('chselected');
		selectedChimney=n;
	}


}


var correctChoices=['D','C','E','A','B'];
var chosenCorrectly=[false,false,false,false,false];
var targets=[['20%','60%',3],['45%','35%',2],['64%','63%',5],['25%','10%',0],['50%','10%',1]];

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
		for(var i=0;i<5;i++){
			if(!chosenCorrectly[i]){
				allCorrect=false;
				break;
			}
		}
		if(allCorrect){
			reportProgress(projectid,assetassemblyid,assetId,true);
			$('.chimneyimages').toggle();
			$('#alldonemessage').toggle();
		}
		$('#chimney' + selectedChimney).removeClass('chselected');
		$('#chimney' + selectedChimney).addClass('hidden');


		//make the next available one selected

		if(!allCorrect){
			
			var found=false;
			while(!found){
				selectedChimney++;
				if(selectedChimney > 4)
					selectedChimney=0;
				if(!chosenCorrectly[selectedChimney]){
					found=true;
				}

			}
			$('#chimney' + selectedChimney).addClass('chselected');


		}
	}
	else{
		$('#failAudio')[0].play();
	}

	


	}


}

function previewAssetAssembly(assetassemblyid,projectid){
     //assetPresentationsPreviewWin.setURL(url);
     url= "../assemble?a=" + assetassemblyid + "&p=" + projectid;
    //alert(url);
  
    window.location=url;
}
