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
		makeChildrenMap();
		initSearchBar();
		startForce();
		//resizeContent();
		drawPie();
		bar = new BarChart();
		bar.init();
		$("#searchbar").fadeIn(100);
		
	});
	
	$("#popuplayer").click(function(){
		$("#popuplayer").fadeOut(500);
		$("#popup").fadeOut(500);
	});
	
	

});

function resizeContent(){
	$("#force").width((($("#content").innerWidth()-$("aside").outerWidth(true)))-1)
		.height($(document).height()-85);
	
	$("#force>svg").width($("#force").width()).height($("#force").height());
	
	
//	var barheight = $(document).height()-($("header").outerHeight()+$("#piesection").outerHeight());
//	$("#barsection").height(barheight);
	
	restartForce();
	
}

function initSearchBar(){
	var ingredientNames = getData("ingredientNames");
	$("#searchbar").autocomplete({
		source:ingredientNames,
		autoFocus:true,
		select:function(event, ui){
			$("#searchbar").val("");
			var text = ui.item.value;
			activateIngredient(text);
		}
		
	});
}

function activateIngredient(ingredientName){
	var ingredientMap = getData("ingredientMap");
	var nodestodraw = getData("nodestodraw");
	var ingredient = ingredientMap[ingredientName];

	if($.inArray(ingredient, nodestodraw) == -1){
		var parent =  ingredientMap[ingredient.parentName];
		var parents = [parent];
		while($.inArray(parent, nodestodraw) == -1){
			parent = ingredientMap[parent.parentName];
			parents.push(parent);
		}
		
		while(parents.length > 0){
			var parent = parents.pop();
			parent.active = true;
			addChilds(parent, parent.index);			
		}
		//drawCircles();
	}
	
	if(ingredient.active){
		makeActive(ingredient);
	}else{
		var i = ingredient.index;
		showIngredient(ingredient, i);
		ingredient.active = true;
	}	
	drawPie(ingredientName);
	bar.redraw(ingredientName);
	
}

function deactivateIngredient(ingredientName){
	var ingredient = getData("ingredientMap")[ingredientName];
	var i = ingredient.index;
	
	ingredient.active = false;
	drawPie(ingredient.parentName);
	bar.redraw(ingredient.parentName);
	hideIngredient(ingredient, i);
	
		
	
	//hideIngredient(ingredient, i);
	
	//ingredient.active = false;
}