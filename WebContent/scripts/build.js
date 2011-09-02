function makeIngredientMap(ingredient){
	
	if(ingredient == undefined){
		var ingredients = getData("ingredients");
		
		var ingredientMap = {};
		for(var i in ingredients){
			jQuery.extend(ingredientMap, makeIngredientMap(ingredients[i]));
		}
		setData("ingredientMap", ingredientMap);
		
	}else{
		var ingredientMap = {};
		ingredientMap[ingredient.name] = ingredient;
		for(var i in ingredient.children){
			jQuery.extend(ingredientMap, makeIngredientMap(ingredient.children[i]));
		}
		
		return ingredientMap;
	}
}

function makeNodes(){
	var nodes = [];
	var ingredientNames = [];
	var ingredientMap = getData("ingredientMap");
	for(var key in ingredientMap){
		nodes.push(ingredientMap[key]);
		ingredientNames.push(key);
	}
	setData({nodes:nodes, ingredientNames:ingredientNames});
}

function makeRecipeMap(){
	var recipeMap = {};
	var nodestodraw = getData("nodestodraw");
	var nodes = getData("nodes");
	for(var i in nodes){
		if($.inArray(nodes[i], nodestodraw) != -1){
			var recipes = nodes[i].recipes;
			for(var j in recipes){
				var recipename = recipes[j];
				var ingredientarray = [];
				
				if(recipeMap[recipename] != undefined)
					ingredientarray = recipeMap[recipename];
				
				ingredientarray.push(Number(i));
				recipeMap[recipename] = ingredientarray;
			}
		}
	}
	
	setData("recipeMap", recipeMap);
}

function makeLinks(){
	var recipeID = 0;
	var recipeMap = getData("recipeMap");
	var links = [];
	var linkMap = {};
	var recipeMax = {};
	
	for(var recipe in recipeMap){
		var recipearray = recipeMap[recipe];
		for(var i = 0; i<recipearray.length-1; i++){
				var index1 = recipearray[i];
			for(var j = i+1; j<recipearray.length; j++){
				var found = false;
				var index2 = recipearray[j];
				
				for(var k in links){						
					if(links[k].source == index1&& links[k].target == index2
							|| links[k].target == index1 && links[k].source == index2){
							var link = links[k];
							link.count++;
							link.names.push(recipe);
							links[k] = link;
							found=true;
							break;
					}
				}
				if(!found){
					links.push({"source":recipearray[i], "target":recipearray[j], "id" : recipeID, "names" : [recipe], "count":1});
				}
			}
		}
		recipeID++;
		
		for(var i = 0; i<links.length; i++){
			var sourceindex = links[i].source;
			if(linkMap[sourceindex] == undefined)
				linkMap[sourceindex] = [];
			
			if($.inArray(links[i], linkMap[sourceindex])==-1)
				linkMap[sourceindex].push(links[i]);
			
			var targetindex = links[i].target;
			if( linkMap[targetindex] == undefined)
				linkMap[targetindex] = [];
			
			if($.inArray(links[i], linkMap[targetindex])==-1)
				linkMap[targetindex].push(links[i]);		
		}
		
		
		for(var i in linkMap){
			recipeMax[i] = 0;
			for(var j in linkMap[i]){
				recipeMax[i] = Math.max(recipeMax[i], linkMap[i][j].count);
			}
		}
	}
	setData({links:links, linkMap:linkMap, recipeMax:recipeMax});
};
