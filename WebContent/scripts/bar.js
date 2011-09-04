function BarChart(){
	this.chart = null;
	this.max = 0;
	this.colors = null;
	this.categories = null;
	this.h = 0;
	this.w = 0;
	this.x = null;
	this.y = null;
}

BarChart.prototype.init = function(){
	dat = [];
	this.max = 0;
	this.categories = getData("categories");
	var thisObj = this;
	$.when(loadRecipesByIngredient("Fett")).done(function(recipes){
		var datamap = {};
		for(var i in recipes){
			var recipe = recipes[i];
			if(datamap[recipe.categorie]==null)
				datamap[recipe.categorie] = 1;
			else
				datamap[recipe.categorie] += 1;
		}
		
		$.each(datamap, function(k, v){
			if(v > thisObj.max)
				thisObj.max = v;
			dat.push({"amount" : v, "name" : k});
		});
		
		dat.sort(function(a, b){
			return b.amount - a.amount;
		});
		thisObj.colors = new DataColor;
		thisObj.colors.init();
		thisObj.w = 400 / 11,
		thisObj.h = 200,
		thisObj.x = d3.scale.linear().domain([0,1]).range([0, thisObj.w]),
		thisObj.y = d3.scale.linear().domain([0,thisObj.max]).range([0, thisObj.h - 40]);
		
		
		thisObj.chart = d3.select("#bar")
			.append("svg:svg")
			.attr("class", "chart")
			.attr("width", thisObj.w * 11)
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
			.transition()
			.duration(1000)
			.attr("y", function(d) { 
				return thisObj.h - thisObj.y(d.amount) - .5; 
				})
			.attr("width", thisObj.w)
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
		
	});
};


	
BarChart.prototype.redraw = function(name){
	var dat = [];
	var thisObj = this;
	$.when(loadRecipesByIngredient(name)).done(function(recipes){
		var datamap = {};
		for(var i in recipes){
			var recipe = recipes[i];
			if(datamap[recipe.categorie]==null)
				datamap[recipe.categorie] = 1;
			else
				datamap[recipe.categorie] += 1;
		}
		
		$.each(datamap, function(k, v){
			if(v > thisObj.max)
				thisObj.max = v;
			dat.push({"amount" : v, "name" : k});
		});
		
		dat.sort(function(a, b){
			return b.amount - a.amount;
		});
		
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
};
