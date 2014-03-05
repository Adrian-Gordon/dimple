function toggleShowSetBannerOptions(idtoshow,divtoshow){

	console.log("toggleShowSetBannerOptions " + idtoshow + " " + divtoshow);

	$('#choosebanner .setbanneruparrow').toggleClass('setbanneruparrow setbannerdownarrow');
	$('#choosebanner .choosebannershow').toggleClass('choosebannershow choosebannerhide');

	$(divtoshow).toggleClass('choosebannerhide choosebannershow');

	$(idtoshow).toggleClass('setbannerdownarrow setbanneruparrow');

	//$(divtoshow).removeClass('choosebannerhide').addClass('choosebannershow');
	//$(divtoshow).html("Hee Hoo Har");
	
}