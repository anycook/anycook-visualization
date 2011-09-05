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
		
	/*$.each(datamap, function(k, v){
		if(v > thisObj.max)
			thisObj.max = v;
		dat.push({"amount" : v, "name" : k});
	});
	
	dat.sort(function(a, b){
		return b.amount - a.amount;
	}); */
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
		.attr("dy", ".35em")
		.text(function(d){
			return d.name;
		});
		
};


	
BarChart.prototype.redraw = function(name){
	var dat = [];
	this.max = 0;
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
		});
	}
};
