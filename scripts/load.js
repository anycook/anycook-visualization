//ingredients

function getAllIngredients(){
	return $.getJSON("http://graph.anycook.de/ingredient&callback=?");
}

function getIngredients(ingredient){
	if(ingredient === undefined)
		return $.getJSON("http://graph.anycook.de/ingredient?parent&callback=?");
	else 
		return $.getJSON("http://graph.anycook.de/ingredient/"+encodeURIComponent(ingredient.name)+"?children&callback=?");
}

function addIngredient(name){
	var dfd = $.Deferred();
	
	$.when(getIngredients(name)).then(function(json){
		var ingredient = {
				name:json.name, 
				children:[],
				parentName:json.parentName,
				recipes: json.recipes, 
				childrennum:json.children.length, 
				recipenum:json.recipenum,
				active:false};
		
		if(json.children.length == 0)
			dfd.resolve(ingredient);
		else{
			for(var i in json.children){
				$.when(addIngredient(json.children[i])).done(function(children){
					children.parentName = name;
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
	
	$.when($.anycook.graph.ingredient()).done(function(all){
		var ingredients = [];
		$.when(getIngredients()).done(function(parents){
			$("#force progress").attr("max", parents.total);
			for(var i in parents.ingredients)
				$.when(addIngredient(parents.ingredients[i])).done(function(ingredient){
					ingredients.push(ingredient);
					$("#force progress").val(Number($("#force progress").val())+1);
					$("#percentage").text(Math.round((Number($("#force progress").val())/Number(parents.total))*100));
					if(ingredients.length == parents.total){
						setData({total : all.total, ingredients:ingredients, nodestodraw: ingredients.slice()});
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
					$barprogress.val(0).attr("max", 1);
					$progressspan.text(0);
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

function loadCategory(categoryName){
	return $.getJSON("http://graph.anycook.de/category/"+categoryName+"?callback=?");
}

function loadCategories(){
	var dfd = $.Deferred();
	
	$.when($.getJSON("http://graph.anycook.de/category/?callback=?")).done(function(json){
		var categoryNames = json.categories;
		var categories = [];
		for(var i in categoryNames){
			$.when(loadCategory(categoryNames[i])).done(function(category){
				categories.push(category);
				if(categories.length == categoryNames.length){
					setData({categoryNames: categoryNames, categories: categories});
					dfd.resolve();
				}
			});
		}
		
	});
	
	return dfd.promise();
}

function makeChildrenMap(){
	var ingredientMap = getData("ingredientMap");
	var childrenMap = {};
	for(var ingredientName in ingredientMap){
		var children = getChildrenNames(ingredientMap[ingredientName]);
		children.splice(children.length-1, 1);
		childrenMap[ingredientName] = children;
	}
	setData("childrenMap", childrenMap);
}

function getChildrenNames(ingredient){
	var children = [];
	if(ingredient.children.length > 0){
		for(var c in ingredient.children){
			var newChildren = getChildrenNames(ingredient.children[c]);
			for(var i in newChildren)
				children.push(newChildren[i]);
		}
	}
	children.push(ingredient.name);
	
	return children;
	
}

