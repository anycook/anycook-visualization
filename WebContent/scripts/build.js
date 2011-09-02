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
	var ingredientMap = getData("ingredientMap");
	for(var key in ingredientMap){
		nodes.push(ingredientMap[key]);
	}
	setData("nodes",nodes);
}

function makeLinks(){
	var recipeID = 0;
	
	for(var recipe in this.recipemap){
		var recipearray = this.recipemap[recipe];
		for(var i = 0; i<recipearray.length-2; i++){
				var index1 = recipearray[i];
				if($.inArray(this.nodes[index1],this.nodestodraw) == -1)
					continue;
			for(var j = i+1; j<recipearray.length; j++){
				var found = false;
				var index2 = recipearray[j];
				if($.inArray(this.nodes[index2],this.nodestodraw) == -1)
					continue;
				
				for(var k in this.links){						
					if(this.links[k].source == index1
						&& this.links[k].target == index2
						|| this.links[k].target == index1 
						&& this.links[k].source == index2){
							var link = this.links[k];
							link.count++;
							link.names.push(recipe);
							this.links[k] = link;
							found=true;
							break;
					}
				}
				if(!found){
					this.links.push({"source":recipearray[i], "target":recipearray[j], "id" : recipeID, "names" : [recipe], "count":1});
				}
			}
		}
		recipeID++;
		
		for(var i in this.links){
			var sourceindex = this.links[i].source;
			if(this.linkmap[sourceindex] == null || this.linkmap[sourceindex] == undefined)
				this.linkmap[sourceindex] = new Array();
			
			if($.inArray(this.links[i], this.linkmap[sourceindex])==-1)
				this.linkmap[sourceindex].push(this.links[i]);
			
			var targetindex = this.links[i].target;
			if(this.linkmap[targetindex] == null || this.linkmap[targetindex] == undefined)
				this.linkmap[targetindex] = new Array();
			
			if($.inArray(this.links[i], this.linkmap[sourceindex])==-1)
				this.linkmap[targetindex].push(this.links[i]);		
		}
		
		
		for(var i in this.linkmap){
			this.recipemax[i] = 0;
			for(var j in this.linkmap[i]){
				this.recipemax[i] = Math.max(this.recipemax[i], this.linkmap[i][j].count);
			}
		}
	}
	
	console.log("finished making links");
};

function buildrecipemap(){
	var ingredients = getData("ingredients");
	var recipemap = [];
	for(var i in ingredients){
		
	}
}

function addtorecipemap(recipemap, ingredient){
	
}