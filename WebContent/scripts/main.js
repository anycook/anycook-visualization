$(document).ready(function(){
	$.ajaxSetup({ 
	    scriptCharset: "utf8" , 
	    contentType: "application/x-www-form-urlencoded; charset=utf8"
	});
	
	resizeContent();
	$(window).resize(resizeContent);
	
	var forcew = $("#force").width(),
    forceh = $(document).height()-105;
	
	$("#force").css("height", forceh);
	var progressw = $("#progressbar").width(),
	progressh = $("#progressbar").height();
	$("#progressbar").css({marginLeft: forcew/2-progressw/2, marginTop: forceh/2-progressh/2});
	
	
	
	$.when(loadData()).done(function(){
		//data has been loaded. init graphs HERE
		
		$("#progressbar").remove();
		makeIngredientMap();
		makeNodes();
		makeRecipeMap();
		makeLinks();
		drawPie();
		startForce();
		//resizeContent();
	});
	
	
	

});

function resizeContent(){
	$("#force").width((($("#content").innerWidth()-$("aside").outerWidth(true)))-1);
}