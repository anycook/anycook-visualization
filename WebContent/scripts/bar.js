function barChart(name){
	var dat = [];
	var max = 0;
	var colors = new DataColor;
	colors.init();
	
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
			if(v > max)
				max = v;
			dat.push({"amount" : v, "name" : k});
		});
		
		dat.sort(function(a, b){
			return b.amount - a.amount;
		});
		
		drawBar({"max" : max, "data" : dat});
	});
	
	function drawBar(alldata){
		var data = alldata.data;
		var max = alldata.max;
		
		d3.select('#bar').selectAll('svg').remove();
		
		var w = 400 / 11,
			h = 200,
			x = d3.scale.linear().domain([0,1]).range([0, w]),
			y = d3.scale.linear().domain([0,max]).range([0, h - 40]);
		
		var chart = d3.select("#bar")
			.append("svg:svg")
			.attr("class", "chart")
			.attr("width", w * data.length - 1)
			.attr("height", h);
	
		chart.selectAll("rect")
			.data(data)
			.enter().append("svg:rect")
			.attr("fill", function(d, i){
				return colors.getNextGrayscale();
			})
			.attr("x", function(d, i) { 
				return x(i) - .5; 
				})
			.transition()
        	.duration(1000)
			.attr("y", function(d) { 
				return h - y(d.amount) - .5; 
				})
			.attr("width", w)
			.attr("height", function(d) { 
				return y(d.amount); 
				});
		
		
		chart.append("svg:line")
			.attr("x1", 0)
			.attr("x2", w * data.length)
			.attr("y1", h - .5)
			.attr("y2", h - .5)
			.attr("stroke", "#000");
		
		chart.selectAll("text")
			.data(data)
		    .enter().append("svg:text")
			.attr("transform", function(d, i) {
				return "translate("+x(i)+",50) rotate(90,0,0)";
		    	})
			.attr("y", 100)
		    .attr("dy", ".35em")
			.attr("dy", ".35em")
			//.attr("text-anchor", "middle")
			.text(function(d){
				return d.name;
			});
	}
}