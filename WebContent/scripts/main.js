$(document).ready(function(){
	$.ajaxSetup({ 
	    scriptCharset: "utf8" , 
	    contentType: "application/x-www-form-urlencoded; charset=utf8"
	});
	
	
	$.when(loadData()).done(function(){
		//data has been loaded. init graphs HERE
		
		$("#progressbar").remove();
		makeIngredientMap();
		makeNodes();
		makeRecipeMap();
		console.log("recipeMap:", getData("recipeMap"));
		drawPie();
	});

});