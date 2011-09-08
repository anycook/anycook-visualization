function BarChart(){
	this.chart = null;
	this.max = 0;
	this.colors = null;
	this.categories = [];
	this.categoryNames = [];
	this.h = 0;
	this.w = 0;
	this.x = null;
	this.y = null;
	this.ingredientname = null;
}

BarChart.prototype.init = function(){
	dat = [];
	this.max = 0;
	this.categories = getData("categories");
	this.categoryNames = getData("categoryNames");
	var thisObj = this;
	var datamap = {};
	for(var i in thisObj.categories){
		var category = thisObj.categories[i];
		datamap[category.name] = category.recipenum;
	}
	
	for(var i in thisObj.categoryNames){
		var category = thisObj.categoryNames[i];
		var value = datamap[category];			
		if(value != null){
			if(value > thisObj.max)
				thisObj.max = value;
			dat.push({"amount" : value, "name" : category});
		}				
		else
			dat.push({"amount" : 0, "name" : category});
	}

	var numCat = thisObj.categoryNames.length;
	thisObj.colors = new DataColor;
	thisObj.colors.init();
	thisObj.w = 400 / (numCat+1),
	thisObj.h = 200,
	thisObj.x = d3.scale.linear().domain([0,1]).range([0, thisObj.w]),
	thisObj.y = d3.scale.linear().domain([0,thisObj.max]).range([0, thisObj.h - 40]);
	
	
	thisObj.chart = d3.select("#bar")
		.append("svg:svg")
		.attr("class", "chart")
		.attr("width", thisObj.w * (numCat+1))
		.attr("height", thisObj.h+100);

	thisObj.chart.selectAll("rect")
		.data(dat)
		.enter().append("svg:rect")
		.attr("fill", function(d, i){
			return thisObj.colors.getNextGrayscale();
		})
		.attr("x", function(d, i) { 
			return thisObj.x(i) - .5; 
			})
		.attr("width", thisObj.w)
		.attr("height", 0)
		.on("click", function(d){
		 		thisObj.showRecipes(thisObj.ingredientname, d.name);
		 	})
		.transition()
		.duration(1000)
		.attr("y", function(d) { 
			return thisObj.h - thisObj.y(d.amount) - .5; 
			})
		.attr("height", function(d) { 
			return thisObj.y(d.amount); 
			});


	thisObj.chart.append("svg:line")
		.attr("x1", 0)
		.attr("x2", thisObj.w * dat.length)
		.attr("y1", thisObj.h - .5)
		.attr("y2", thisObj.h - .5)
		.attr("stroke", "#000");

	thisObj.chart.selectAll("text")
		.data(dat)
	    .enter().append("svg:text")
		.attr("transform", function(d, i) {
			return "translate("+(thisObj.x(i)+thisObj.w/2)+","+(thisObj.h+3)+") rotate(40,0,0)";
	    	})
	    .attr("dy", ".35em")
		.text(function(d){
			return d.name;
		});
	
	thisObj.chart
	.selectAll("text.amount")
	.data(dat).enter()
	.append("svg:text")
	.attr("class", "amount")
	.attr("transform", function(d, i) {
		var posy = thisObj.h - thisObj.y(d.amount) -5;
		return "translate("+(thisObj.x(i)+thisObj.w/2)+","+ posy +")";
    	})
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
	.attr("width", "33.3px")
	.text(function(d){			
			return d.amount;
	});
		
};


	
BarChart.prototype.redraw = function(name){
	var dat = [];
	this.max = 0;
	this.ingredientname = name;
	var thisObj = this;
	var datamap = {};
	
	if(name === undefined){
		for(var i in thisObj.categories){
			var category = thisObj.categories[i];
			datamap[category.name] = category.recipenum;
		}
		
		for(var i in thisObj.categoryNames){
			var category = thisObj.categoryNames[i];
			var value = datamap[category];			
			if(value != null){
				if(value > thisObj.max)
					thisObj.max = value;
				dat.push({"amount" : value, "name" : category});
			}				
			else
				dat.push({"amount" : 0, "name" : category});
		}
		
		thisObj.y = d3.scale.linear().domain([0,thisObj.max]).range([0, thisObj.h - 40]);
		
		thisObj.chart.selectAll("rect")
		 	.data(dat)
		 	.transition()
		 	.duration(1000)
		 	.attr("y", function(d) {
		 		return thisObj.h - thisObj.y(d.amount) - .5; 
		 		})
		 	.attr("height", function(d) { 
		 		return thisObj.y(d.amount); 
		 });
		
		thisObj.chart
		.selectAll("text.amount")
		.data(dat)
		.transition()
		.duration(1000)
		.attr("transform", function(d, i) {
			var posy = thisObj.h - thisObj.y(d.amount) -5;
			return "translate("+(thisObj.x(i)+thisObj.w/2)+","+ posy +")";
	    })
	    .text(function(d){
	    	return d.amount;
	    });
	}else{
		$.when(loadRecipesByIngredient(name)).done(function(recipes){
			for(var i in recipes){
				var recipe = recipes[i];
				if(datamap[recipe.categorie]==null)
					datamap[recipe.categorie] = 1;
				else
					datamap[recipe.categorie] += 1;
			}
			
			for(var i in thisObj.categoryNames){
				var category = thisObj.categoryNames[i];
				var value = datamap[category];			
				if(value != null){
					if(value > thisObj.max)
						thisObj.max = value;
					dat.push({"amount" : value, "name" : category});
				}				
				else
					dat.push({"amount" : 0, "name" : category});
			}
			
			thisObj.y = d3.scale.linear().domain([0,thisObj.max]).range([0, thisObj.h - 40]);
		
			thisObj.chart.selectAll("rect")
			 	.data(dat)
			 	.transition()
			 	.duration(1000)
			 	.attr("y", function(d) {
			 		return thisObj.h - thisObj.y(d.amount) - .5; 
			 		})
			 	.attr("height", function(d) { 
			 		return thisObj.y(d.amount); 
			 		});
			
			thisObj.chart
			.selectAll("text.amount")
			.data(dat)
			.transition()
			.duration(1000)
			.attr("transform", function(d, i) {
				var posy = thisObj.h - thisObj.y(d.amount) -5;
				return "translate("+(thisObj.x(i)+thisObj.w/2)+","+ posy +")";
		    })
		    .text(function(d){
		    	return d.amount;
		    });
			
			
		});
	}
};

BarChart.prototype.makeRecipeLinks = function(recipes, category){
	var p = $("#popup p").empty();
	for(var i in recipes){
		var recipename;
		if(typeof recipes[i] == "string" )
			recipename = recipes[i];
		else
			recipename = recipes[i].name;
		
		if(recipes[i].categorie == category)
			p.append("<a href=\"http://anycook.de/#!/recipe/"+recipename+"\" target=\"_blank\">"+
					"<img src = \"http://graph.anycook.de/recipe/"+recipename+"/image?type=small\">"+
					"<div>"+recipename+"</div></a>");
	}
};


BarChart.prototype.showRecipes = function(name, category){
	if(name == null){
		$("#popup h3").text("Alle Rezepte aus "+category);
		for(var i in this.categories){
			if(this.categories[i].name==category){
				this.makeRecipeLinks(this.categories[i].recipes);
				break;
			}
		}
		$("#popuplayer").fadeIn(500);
		$("#popup").fadeIn(500);
		return;
	}
	
	var thisObj = this;
	$.when(loadRecipesByIngredient(name)).done(function(recipes){
		$("#popup h3").text("Rezepte mit Zutat: \""+name+"\" aus "+category);
		thisObj.makeRecipeLinks(recipes, category);			
		$("#popuplayer").fadeIn(500);
		$("#popup").fadeIn(500);
	});
};
