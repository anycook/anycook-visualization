// class Data
$.ajaxSetup({ 
    scriptCharset: "utf8" , 
    contentType: "application/x-www-form-urlencoded; charset=utf8",
    async: false
}); 

function Data(){
	this.nodes = new Array();
	this.nodestodraw = new Array();
	this.links = new Array();
	this.total = 0;
	this.recipemap = new Object();
	this.callback = null;
	this.progress = null;
	this.linkArray = new Object();
	this.recipeMax = new Array();
}

Data.prototype.init = function(callback, progress){
	this.progress = progress;
	this.callback = callback;
	var thisObj = this;
	$.ajax({
		  url: "http://graph.anycook.de/ingredient&callback=?",
		  dataType: 'json',
		  async :false,
		  success: function(data){
			  thisObj.total = data.total;
			  console.log("total number of ingredients:"+thisObj.total);
			  thisObj.makeNodes();
		  }
	});
};

Data.prototype.makeNodes = function(){
	thisObj = this;
	$.getJSON('http://graph.anycook.de/ingredient?parent&callback=?', function(json) {
		$(json.ingredients).each(function(i, value){
			$.getJSON("http://graph.anycook.de/ingredient/"+value+"?children&callback=?", function(ingredient){
				var index = thisObj.nodes.length;
				ingredient.index = index;
				ingredient.depth = 0;
				//console.log(index);
				thisObj.nodes.push(ingredient);
				thisObj.updateRecipeMap(ingredient);
				thisObj.addChildren(ingredient, 1);
				thisObj.checkReady();
				
			
			}).error(function(){alert("error");});
		});
	});

};

Data.prototype.checkReady = function(){
	var thisObj = this;
	if(thisObj.nodes.length == thisObj.total-2){
		console.log("ready loading data");
		
		$(thisObj.nodes).each(function(i, value){
			if(value.depth == 0)
				thisObj.nodestodraw.push(value);
		});
		thisObj.makeLinks();
	}
	else{
		thisObj.progress(thisObj.nodes.length / (thisObj.total-2));
	}
};

Data.prototype.addChildren = function(ingredient, depth){
	$(ingredient.children).each(function(i, child){
		depth += 1;
		$.getJSON("http://graph.anycook.de/ingredient/"+child+"?children&callback=?", function(chingredient){
			chingredient.index = thisObj.nodes.length;
			chingredient.parentindex = ingredient.index;
			chingredient.parentname = ingredient.name;
			chingredient.draw = false;
			chingredient.depth = depth;
			
			thisObj.nodes.push(chingredient);
			thisObj.updateRecipeMap(chingredient, depth);
			
			if(chingredient.children.length>0)
				thisObj.addChildren(chingredient);
			thisObj.checkReady();
		});				
	});
};

Data.prototype.updateRecipeMap = function(ingredient){
	thisObj = this;
	for(var j in ingredient.recipes){
		var recipe = ingredient.recipes[j];
		var recipearray = thisObj.recipemap[recipe];
		if(recipearray == null || recipearray== undefined){
			recipearray = new Array();
		}
		recipearray.push(ingredient.index);
		thisObj.recipemap[recipe] = recipearray;
	}
};

Data.prototype.makeLinks = function(){
	var recipeID = 0;
	
	for(var recipe in this.recipemap){
		var recipearray = this.recipemap[recipe];
		for(var i = 0; i<recipearray.length-2; i++){
			for(var j = i+1; j<recipearray.length; j++){
				var found = false;
				for(var k in this.links){
					if(this.links[k].source == recipearray[i] 
						&& this.links[k].target == recipearray[j]
						|| this.links[k].target == recipearray[i] 
						&& this.links[k].source == recipearray[j]){
							var link = this.links[k];
							link.count++;
							link.names.push(recipe);
							this.links[k] = link;
							found=true;
							break;
					}
				}
				if(!found)
					this.links.push({"source":recipearray[i], "target":recipearray[j], "id" : recipeID, "names" : [recipe], "count":1});
				
			}
		}
		recipeID++;
		
		/*for(var i in this.links){
			var sourceindex = this.links[i].source;
			if(this.linkArray[sourceindex] == null || this.linkArray[sourceindex] == undefined)
				this.linkArray[sourceindex] = new Array();
			
			this.linkArray[sourceindex].push(this.links[i]);
			
			var targetindex = this.links[i].target;
			if(this.linkArray[targetindex] == null || this.linkArray[targetindex] == undefined)
				this.linkArray[targetindex] = new Array();
			
			this.linkArray[targetindex].push(this.links[i]);		
		}
		
		
		for(var i in this.linkArray){
			this.recipeMax[i] = 0;
			for(var j in this.linkArray[i]){
				this.recipeMax[i] = Math.max(this.recipeMax[i], this.linkArray[i][j].count);
			}
		}*/
	}
	
	console.log("finished making links");
	this.callback();
};