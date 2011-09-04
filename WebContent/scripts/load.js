//data

function getData(fieldname){
	if(!$("body").data("data")){
		$("body").data("data", {		
			nodes: [],
			nodestodraw : [],
			links : [],
			total : 0,
			recipeMap : {},
			linkMap : {},
			recipeMax : [],
			ingredients : [], //ingredient object tree
			ingredientMap:{}, //ingredients by name
			ingredientNames:[], // just the names
			ingredientRecipeMap:{}
		});
	}
	
	if(fieldname == undefined)	
		return $("body").data("data");
	else
		return $("body").data("data")[fieldname];
}

function setData(optionskey, value){
	var data = getData();
	
	
	if(typeof optionskey == "string" && value != undefined)
		data[optionskey] = value;
	else if(typeof optionskey == "object")
		jQuery.extend(data, optionskey);	 
	$("body").data("data", data);
}


//ingredients

function getAllIngredients(){
	return $.getJSON("http://graph.anycook.de/ingredient&callback=?");
}

function getIngredients(ingredient){
	if(ingredient === undefined)
		return $.getJSON("http://graph.anycook.de/ingredient?parent&callback=?");
	else 
		return $.getJSON("http://graph.anycook.de/ingredient/"+ingredient+"?children&callback=?");
}

function addIngredient(name, depth){
	var dfd = $.Deferred();
	
	$.when(getIngredients(name)).then(function(json){
		var ingredient = {
				name:json.name, 
				children:[], 
				depth: depth, 
				recipes: json.recipes, 
				childrennum:json.children.length, 
				recipenum:json.recipenum};
		
		if(json.children.length == 0)
			dfd.resolve(ingredient);
		else{
			for(var i in json.children){
				$.when(addIngredient(json.children[i]), depth+1).done(function(children){
					children.parentname = name;
					ingredient.children.push(children);
					if(ingredient.children.length == json.children.length){
						
						dfd.resolve(ingredient);
					}
				});
			}
		}
	});
	return dfd.promise();
	
}

function loadData(){
	var dfd = $.Deferred();
	
	$.when(getAllIngredients()).done(function(all){
		var ingredients = [];
		$.when(getIngredients()).done(function(parents){
			$("#force progress").attr("max", parents.total);
			for(var i in parents.ingredients)
				$.when(addIngredient(parents.ingredients[i])).done(function(ingredient){
					ingredients.push(ingredient);
					$("#force progress").val(Number($("#force progress").val())+1);
					$("#percentage").text(Math.round((Number($("#force progress").val())/Number(parents.total))*100));
					if(ingredients.length == parents.total){
						setData({total : all.total, ingredients:ingredients, nodestodraw: ingredients});
						dfd.resolve(ingredients);
					}
				});			
		});
	});
	return  dfd.promise();
}

var index = 0;

//recipes


function loadRecipesByIngredient(ingredient){
	
	var ingredientRecipeMap = getData("ingredientRecipeMap");
	if(ingredientRecipeMap[ingredient] == undefined){
		var dfd = $.Deferred();
		
		
		var recipeData = [];
		var recipes = getData("ingredientMap")[ingredient].recipes;
		var $barprogress = $("#barsection progress").show();
		$barprogress.attr("max", recipes.length);
		var $progressspan = $("#barpercentage");
		for(var i in recipes){
			$.when(loadRecipe(recipes[i])).done(function(recipe){
				recipeData.push(recipe);
				
				$barprogress.val(recipeData.length);
				$progressspan.text(Math.round((recipes.length/recipeData.length)*100));
				if(recipeData.length == recipes.length){
					ingredientRecipeMap[ingredient] = recipeData;
					setData("ingredientRecipeMap", ingredientRecipeMap);
					$barprogress.hide();
					dfd.resolve(ingredientRecipeMap[ingredient]);
				}
			});
		}
		
		return dfd.promise();
		
	}
	return ingredientRecipeMap[ingredient];
	
}

function loadRecipe(recipeName){
	return $.getJSON("http://graph.anycook.de/recipe/"+recipeName+"?callback=?");	
}

