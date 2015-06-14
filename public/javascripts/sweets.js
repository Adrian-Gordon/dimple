var assetId;
var assetassemblyid;
var projectid;
var currentRow=0;

var letterAllocations={
"A":[[0,7],[1,1],[1,4],[4,2]],
"B":[[3,3],[4,0],[4,6]],
"C":[[2,2],[4,3]],
"D":[],
"E":[[0,3],[0,6],[1,10],[4,10]],
"F":[],
"G":[[3,5]],
"H":[[0,5],[3,0]],
"I":[[1,7],[2,1]],
"J":[],
"K":[[4,4]],
"L":[[0,0],[1,9],[4,1],[4,8],[4,9]],
"M":[[1,3],[3,2]],
"N":[],
"O":[[0,1],[1,8],[2,4]],
"P":[[1,0]],
"Q":[],
"R":[[0,8],[1,2],[2,5]],
"S":[[0,10],[1,12],[3,6],[4,12]],
"T":[[0,9],[1,11],[2,3],[4,11]],
"U":[[3,1],[3,4],[4,7]],
"V":[[0,2],[1,6],[2,0],[2,8]],
"W":[],
"X":[],
"Y":[[2,6]],
"Z":[]

};

var imgsrcs=[
	'/images/chilliroad/sweetshop/loveheart.png',
	'/images/chilliroad/sweetshop/parma.jpg',
	'/images/chilliroad/sweetshop/victory-v.png',
	'/images/chilliroad/sweetshop/humbug.png',
	'/images/chilliroad/sweetshop/black_bullets.jpg'
];

function renderSweets(asset,aaid,pid){
	assetId=asset.asset._id;
	assetassemblyid=aaid;
	sweetsAsset=asset;
	
	 projectid=pid;
	sweetsData=asset.data;
	var progressDone=checkProgress(pid,aaid,asset.asset._id)
	var sweetsHtml="";
	if(progressDone){
		sweetsHtml+="<audio id='failAudio'><source src='/images/chilliroad/rosette/wrong.mp3' type='audio/mpeg'></audio>";
	sweetsHtml+="<audio id='succeedAudio'><source src='/images/chilliroad/rosette/correct.mp3' type='audio/mpeg'></audio>";
	sweetsHtml+="<div class='sweetsdiv'>";
	sweetsHtml+="<table>"
	sweetsHtml+="<tr id='sweets0' class='sweetsrow visible'>";
	sweetsHtml+="<td class='imagetd'><div class='sweetimgwrapper'><img class='sweetsimg' src='/images/chilliroad/sweetshop/loveheart.png'/></div></td>";
	sweetsHtml+="<td><span id='row0' class='sweetstext'>";
	sweetsHtml+="LOVE HEARTS";//LOVE HEARTS
	sweetsHtml+="</span></td>"
	sweetsHtml+="</tr>";//sweetsrow
	sweetsHtml+="<tr id='sweets1' class='sweetsrow visible'>";
	sweetsHtml+="<td class='imagetd'><div class='sweetimgwrapper'><img class='sweetsimg' src='/images/chilliroad/sweetshop/parma.jpg'/></div></td>";
	sweetsHtml+="<td><span id='row1' class='sweetstext'>";
	sweetsHtml+="PARMA VIOLETS";//PARMA VIOLETS
	sweetsHtml+="</span></td>"
	sweetsHtml+="</tr>";//sweetsrow
	sweetsHtml+="<tr id='sweets2' class='sweetsrow  visible'>";
	sweetsHtml+="<td class='imagetd'><div class='sweetimgwrapper'><img class='sweetsimg' src='/images/chilliroad/sweetshop/victory-v.png'/></div></td>";
	sweetsHtml+="<td><span id='row2' class='sweetstext'>";
	sweetsHtml+="VICTORY V";//VICTORY V
	sweetsHtml+="</span></td>"
	sweetsHtml+="</tr>";//sweetsrow
	sweetsHtml+="<tr id='sweets3' class='sweetsrow  visible'>";
	sweetsHtml+="<td class='imagetd'><div class='sweetimgwrapper'><img class='sweetsimg' src='/images/chilliroad/sweetshop/humbug.png'/></div></td>";
	sweetsHtml+="<td><span id='row3' class='sweetstext'>";
	sweetsHtml+="HUMBUGS";//HUMBUGS
	sweetsHtml+="</span></td>"
	sweetsHtml+="</tr>";//sweetsrow
	sweetsHtml+="<tr id='sweets4' class='sweetsrow  visible'>";
	sweetsHtml+="<td class='imagetd'><div class='sweetimgwrapper'><img class='sweetsimg' src='/images/chilliroad/sweetshop/black_bullets.jpg'/></div></td>";
	sweetsHtml+="<td><span id='row4' class='sweetstext'>";
	sweetsHtml+="BLACK BULLETS";//BLACK BULLETS
	sweetsHtml+="</span></td>"
	sweetsHtml+="</tr>";//sweetsrow
	sweetsHtml+="</table>";
	sweetsHtml+="</div>";//sweetsdiv
	}
	else{
	sweetsHtml+="<audio id='failAudio'><source src='/images/chilliroad/rosette/wrong.mp3' type='audio/mpeg'></audio>";
	sweetsHtml+="<audio id='succeedAudio'><source src='/images/chilliroad/rosette/correct.mp3' type='audio/mpeg'></audio>";
	sweetsHtml+="<div class='sweetsdiv'>";
	sweetsHtml+="<table>"
	sweetsHtml+="<tr id='sweets0' class='sweetsrow visible'>";
	sweetsHtml+="<td class='imagetd'><div class='sweetimgwrapper'><img  src='/images/chilliroad/sweetshop/question-mark.png'/></div></td>";
	sweetsHtml+="<td><span id='row0' class='sweetstext'>";
	sweetsHtml+="____ H_____";//LOVE HEARTS
	sweetsHtml+="</span></td>"
	sweetsHtml+="</tr>";//sweetsrow
	
	sweetsHtml+="<tr id='sweets1' class='sweetsrow invisible'>";
	sweetsHtml+="<td class='imagetd'><div class='sweetimgwrapper'><img class='sweetsimg' src='/images/chilliroad/sweetshop/question-mark.png'/></div></td>";
	sweetsHtml+="<td><span id='row1' class='sweetstext'>";
	sweetsHtml+="P____ _______";//PARMA VIOLETS
	sweetsHtml+="</span></td>"
	sweetsHtml+="</tr>";//sweetsrow
	sweetsHtml+="<tr id='sweets2' class='sweetsrow  invisible'>";
	sweetsHtml+="<td class='imagetd'><div class='sweetimgwrapper'><img class='sweetsimg' src='/images/chilliroad/sweetshop/question-mark.png'/></div></td>";
	sweetsHtml+="<td><span id='row2' class='sweetstext'>";
	sweetsHtml+="______Y _";//VICTORY V
	sweetsHtml+="</span></td>"
	sweetsHtml+="</tr>";//sweetsrow
	sweetsHtml+="<tr id='sweets3' class='sweetsrow  invisible'>";
	sweetsHtml+="<td class='imagetd'><div class='sweetimgwrapper'><img class='sweetsimg' src='/images/chilliroad/sweetshop/question-mark.png'/></div></td>";
	sweetsHtml+="<td><span id='row3' class='sweetstext'>";
	sweetsHtml+="___B___";//HUMBUGS
	sweetsHtml+="</span></td>"
	sweetsHtml+="</tr>";//sweetsrow
	sweetsHtml+="<tr id='sweets4' class='sweetsrow  invisible'>";
	sweetsHtml+="<td class='imagetd'><div class='sweetimgwrapper'><img class='sweetsimg' src='/images/chilliroad/sweetshop/question-mark.png'/></div></td>";
	sweetsHtml+="<td><span id='row4' class='sweetstext'>";
	sweetsHtml+="B____ B______";//BLACK BULLETS
	sweetsHtml+="</span></td>"
	sweetsHtml+="</tr>";//sweetsrow
	sweetsHtml+="</table>";
	sweetsHtml+="</div>";//sweetsdiv

	sweetsHtml+="<div id='donemessage' class='invisible'>";
	sweetsHtml+="<span>Well done, you got them all!</span>"
	sweetsHtml+="</div>";//donemessage
	}

	if(progressDone){
	sweetsHtml+="<div id='alreadydonemessage' class='visible'>";
	sweetsHtml+="<span>You already know all of these!</span>"
	sweetsHtml+="</div>";//donemessage
	}
	else{
		sweetsHtml+="<div id='keyboard' class=\"keyboard\">"
	    sweetsHtml+="<div class=\"keyboardRow\">   <span class=\"key\" onclick=\"reportLetterSuccess('Q')\">Q</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('W')\">W</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('E')\">E</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('R')\">R</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('T')\">T</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('Y')\">Y</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('U')\">U</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('I')\">I</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('O')\">O</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('P')\">P</span>"

	    sweetsHtml+="</div>"
	    sweetsHtml+="<div class=\"keyboardRow\">   <span class=\"key\" onclick=\"reportLetterSuccess('A')\">A</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('S')\">S</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('D')\">D</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('F')\">F</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('G')\">G</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('H')\">H</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('J')\">J</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('K')\">K</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('L')\">L</span>"

	    sweetsHtml+="</div>"
	    sweetsHtml+="<div class=\"keyboardRow\">   <span class=\"key\" onclick=\"reportLetterSuccess('Z')\">Z</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('X')\">X</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('C')\">C</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('V')\">V</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('B')\">B</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('N')\">N</span>"
	    sweetsHtml+="<span class=\"key\" onclick=\"reportLetterSuccess('M')\">M</span>"

	    sweetsHtml+="</div>"
	}

	$('#' + sweetsData.divid).append(sweetsHtml);

}

function previewAssetAssembly(assetassemblyid,projectid){
     //assetPresentationsPreviewWin.setURL(url);
     url= "../assemble?a=" + assetassemblyid + "&p=" + projectid;
    //alert(url);
  
    window.location=url;
}

function reportLetterSuccess(letter){
	var rows=letterAllocations[letter];
	var success=false;
	if(rows.length > 0){
		for(var i=0;i<rows.length;i++){
			var i1=rows[i][0];
			var i2=rows[i][1];

			if(i1==currentRow){
				console.log("successAt: " + i1 + " " + i2);
				var rowSpan=$('#row' + i1);
				var text=rowSpan.text();
				console.log("text is: " + text);
				text=setCharAt(text,i2,letter);
				console.log("text now: " + text);
				
				rowSpan.text(text);
				success=true;
			}

		}
		if(success){
			$('#succeedAudio')[0].play();
			var currentRowSpan=$('#row' + currentRow);
			var text=currentRowSpan.text();
			if(text.indexOf('_')==-1){ //all letters found

					//show the sweet image
					var imgsrc=imgsrcs[currentRow];
					$('#sweets' + currentRow + ' img').attr('src',imgsrc);
					currentRow++;
					$('#sweets' + currentRow).removeClass('invisible');
					$('#sweets' + currentRow).addClass('visible');
					if(currentRow == 5){
						//we've succeeded
						$('#keyboard').addClass('invisible');
						$('#donemessage').removeClass('invisible');
						$('#donemessage').addClass('visible');
						reportProgress(projectid,assetassemblyid,assetId,true);

					}
				}

		}
		else{
			$('#failAudio')[0].play();
		}
	}
	else{
		console.log("failed");
		$('#failAudio')[0].play();
	}

}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}




