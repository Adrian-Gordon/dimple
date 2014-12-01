function playSound(id,url){
var thissounddiv=document.getElementById('audiodiv' + id);
thissounddiv.innerHTML="<embed  id='audio"+ id + "' src='" + url + "' autostart='true' autoplay='true' enablejavascript='true' width=0 height=0></embed>"
}

function toggleDimpleTextElement(elementid1,elementid2,onoroff){
var contentElement1=document.getElementById(elementid1);
var contentElement2=document.getElementById(elementid2);
if(onoroff=='on'){
contentElement1.style.display='none';
contentElement2.style.display='block';
}
else{
contentElement1.style.display='block';
contentElement2.style.display='none';
}
}

