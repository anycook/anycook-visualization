var bar = null;

$(document).ready(function(){
	$.ajaxSetup({ 
	    scriptCharset: "utf8" , 
	    contentType: "application/x-www-form-urlencoded; charset=utf8"
	});
	
	resizeContent();
	$(window).resize(resizeContent);
	
	var forcew = $("#force").width(),
    forceh = $("#force").height();
	
	var progressw = $("#progressbar").width(),
	progressh = $("#progressbar").height();
	$("#progressbar").css({marginLeft: forcew/2-progressw/2, marginTop: forceh/2-progressh/2});
	
	$.when(loadData(), loadCategories()).done(function(){
		//data has been loaded. init graphs HERE
		
		$("#progressbar").remove();
		makeIngredientMap();
		makeNodes();
		makeRecipeMap();
		makeLinks();
		initSearchBar();
		startForce();
		//resizeContent();
		drawPie();
		bar = new BarChart();
		bar.init();
		
	});
	
	
	

});

function resizeContent(){
	$("#force").width((($("#content").innerWidth()-$("aside").outerWidth(true)))-1)
		.height($(document).height()-85);
	
	$("#force>svg").width($("#force").width()).height($("#force").height());
	
	restartForce();
	
}

function initSearchBar(){
	var ingredientNames = getData("ingredientNames");
	$("#searchbar").autocomplete({
		source:ingredientNames
	});
}