var cannedWeather=[
	"",
	"its%20thundery%20right%20now ",
	"its%20drizzling%20right%20now",
	"there%20is%20light%20rain%20right%20now",
	"theres%20moderate%20rain%20right%20now",
	"its%20raining%20heavily",
	"theres%20freezing%20rain%20right%20now",
	"theres%20showery%20rain%20right%20now",
	"its%20snowing",
	"theres%20sleety%20snow%20falling",
	"there%20are%20snow%20showers",
	"its%20foggy%20here%20at%20the%20moment",
	"the%20sky%20is%20clear%20and%20cloudless",
	"its%20a%20bit%20cloudy%20right%20now",
	"the%20sky%20is%20overcast",
	"its%20feeling%20cold%20so%20wrap%20up%20warm",
	"its%20a%20bit%20cool",
	"its%20nice%20and%20warm",
	"its%20hot%20right%20now",
	"theres%20not%20much%20wind",
	"theres%20a%20gentle%20breeze",
	"theres%20a%20gentle%20breeze",
	"theres%20a%20%20breeze%20blowing",
	"theres%20a%20bit%20of%20a%20fresh%20breeze%20blowing",
	"its%20windy",
	"theres%20a%20gale%20blowing"

]




var soundSources=new Array();
var nextSoundSourceIndex=0;

var theWeather;
function renderLollipopMan(asset,aaid,pid){
	console.log("render lollipop man");

	var contentStr="<div><div class='lmleft'><img src='/images/chilliroad/lollipopman/lollipop_man.png' /><div id='weathericondiv'><img id='weathericon' style='width:80px'/></div></div></div><div><audio id='weatheraudioplayer'></audio></div>";

	$('#' + asset.data.divid).append(contentStr);

	//now get the weather


	var url="http://api.openweathermap.org/data/2.5/weather?lat=54.98500918273556&lon=-1.576464492827654&units=metric";
		console.log("GO Get Weather");
		$.get(url).done(function(data){
      //alert('got data');
			//google.maps.event.addDomListener(window, 'load', function(){alert('loaded');renderDimplePOIs(data);});
			renderWeather(data);

			
			$('#weathericondiv').click(function(o){ 
				nextSoundSourceIndex=0;
				_player=document.getElementById('weatheraudioplayer');

				_player.addEventListener('ended',playNext);

				_player.src=(soundSources[0]);
				//_player.src="http://translate.google.com/translate_tts?tl=en&q=its%20raining%20heavily"

				_player.play();
				reportProgress(pid,aaid,asset.asset._id,true)
				
			});

		}).fail(function(error) {
		    console.log( "error" + JSON.stringify(error));
		  });
}

function renderWeather(weather){
	theWeather=weather
	console.log("weather: " + JSON.stringify(weather));

	var weatherId=weather.weather[0].id;
	var iconId=weather.weather[0].icon;


	var iconUrl="http://openweathermap.org/img/w/" + iconId + ".png";


	var temperature=weather.main.temp;

	var windspeed=weather.wind.speed * 3.6;//for kph

	$('#weathericon').attr('src',iconUrl);
	$('#weathericondiv').toggle();

	var weatherIndex;

	if((weatherId >= 200)&&(weatherId <= 232)){ //thunder
		weatherIndex=1;
	}
	else if(weatherId <=321){	//drizzle
		weatherIndex=2;
	}
	else if(weatherId ==500){//light rain
		weatherIndex=3;
	}
	else if(weatherId ==501){//moderate rain
		weatherIndex=4;
	}
	else if((weatherId >= 502)&&(weatherId <= 504)){ //heavy rain
		weatherIndex=5;
	}
	else if(weatherId ==511){//freezing rain
		weatherIndex=6;
	}
	else if((weatherId >= 520)&&(weatherId <= 531)){ //showery rain
		weatherIndex=7;
	}
	else if((weatherId >= 600)&&(weatherId <= 602)){ //showery rain
		weatherIndex=8;
	}

	else if((weatherId >= 611)&&(weatherId <= 616)){ //sleety snow
		weatherIndex=9;
	}
	else if((weatherId >= 620)&&(weatherId <= 622)){ //ssnow showers
		weatherIndex=10;
	}
	else if((weatherId >= 701)&&(weatherId <= 781)){ //fog/mist
		weatherIndex=11;
	}
	else if(weatherId ==800){//clear sky
		weatherIndex=12;
	}
	else if((weatherId >= 801)&&(weatherId <= 803)){ //a bit cloudy
		weatherIndex=13;
	}
	else if(weatherId ==804){//overcast
		weatherIndex=14;
	}

	var temperatureIndex;

	if(temperature < 10){
		temperatureIndex=15;//cold
	}
	else if(temperature < 20){
		temperatureIndex=16;//cool
	}
	else if(temperature < 30){//warm
		temperatureIndex=17;
	}
	else {					//hot
		temperatureIndex=18;
	}

	var windIndex;

	if(windspeed <= 5){ //no/very little wind
		windIndex=19;
	}
	else if(windspeed <= 11){ //light breeze
		windIndex=20;
	}
	else if(windspeed <= 19){ //gentle breeze
		windIndex=21;
	}
	else if(windspeed <= 28){//a bit of a breeze
		windIndex=	22;
	}
	else if(windspeed <= 38){ //a fresh breeze
		windIndex=	23;
	}
	else if(windspeed <= 49){ //windy
		windIndex=24;
	}
	else if(windspeed > 49){ //a gale
		windIndex=25;
	}


	soundSources.push("http://translate.google.com/translate_tts?tl=en&q=" + cannedWeather[weatherIndex]);
	soundSources.push("http://translate.google.com/translate_tts?tl=en&q=" + cannedWeather[temperatureIndex]);
	soundSources.push("http://translate.google.com/translate_tts?tl=en&q=" + cannedWeather[windIndex]);


	//soundSources.push("../audio/weather/weather" + weatherIndex + ".mp3");
	//soundSources.push("../audio/weather/weather" + temperatureIndex +".mp3");
	//soundSources.push("../audio/weather/weather" + windIndex + ".mp3");

	/*soundSources.push("../audio/weather/weather1.mp3");
	soundSources.push("../audio/weather/weather2.mp3");
	soundSources.push("../audio/weather/weather3.mp3");*/

	console.log("soundSources: " + JSON.stringify(soundSources));
	/*var _player=document.getElementById('weatheraudioplayer');

	_player.src=("../audio/weather/weather1.mp3");

	_player.play();*/

}

function playNext(){

	console.log("Play next");
	if(nextSoundSourceIndex++ < soundSources.length){
		_player=document.getElementById('weatheraudioplayer');
		_player.src=(soundSources[nextSoundSourceIndex]);
		_player.play();
	}


}

function previewAssetAssembly(assetassemblyid,projectid){
     //assetPresentationsPreviewWin.setURL(url);
     url= "../assemble?a=" + assetassemblyid + "&p=" + projectid;
    //alert(url);
  
    window.location=url;
}




