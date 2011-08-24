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
	this.linkmap = new Object();
	this.recipemax = new Array();
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
	var thisObj = this;
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
		thisObj.makeLinks(0);
		this.callback();
	}
	else{
		thisObj.progress(thisObj.nodes.length / (thisObj.total-2));
	}
};

Data.prototype.addChildren = function(ingredient, depth){
	var thisObj = this;
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
	var thisObj = this;
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