function makePieData(name){
	var ingredients = [],
	names = [],
	parent = undefined;
	
	
	if(name == undefined){
		var ingrdata = getData("ingredients");
		for(var i in ingrdata){
			var ingredient = ingrdata[i];
			if(ingredients.length == 0){
				names.push(ingredient.name);
				ingredients.push(ingredient.recipenum);
				continue;
			}
			for(index in ingredients){
				index = parseInt(index);
				var nextindex = index + 1;
				if(ingredients[index]<=ingredient.recipenum
						&& (ingredients[nextindex]>ingredient.recipenum 
								|| ingredients[nextindex] == undefined)
						|| ingredients[nextindex] == undefined){
					ingredients.splice(index, 0, ingredient.recipenum);
					names.splice(index, 0, ingredient.name);
					break;
				}
			}
		}
	}
	else{
		var ingredientMap = getData("ingredientMap");
		var value = ingredientMap[name];
		parent = value.parentname;
		
		names.push(name);
		ingredients.push(value.recipenum);
		
		for(var i in value.children){
			var child = value.children[i];
			for(index in ingredients){
				index = parseInt(index);
				var nextindex = index + 1;
				if(ingredients[index]<=child.recipenum
						&& (ingredients[nextindex]>child.recipenum 
								|| ingredients[nextindex] == undefined)
						|| ingredients[nextindex] == undefined){
					ingredients.splice(index, 0, child.recipenum);
					names.splice(index, 0, child.name);
					break;
				}
			}
		}
	}
	
	var swaps = -1;
	while(swaps !=0){
		swaps = 0;
		for(var i in ingredients){
			i = parseInt(i);
			j = i + 1;
			var tmp;
			if(ingredients[i]<ingredients[j]){
				tmp = ingredients[j];
				ingredients[j] = ingredients[i];
				ingredients[i] = tmp;
				tmp = names[j];
				names[j] = names[i];
				names[i] = tmp;
				swaps += 1;
			}
		}
	}
	
	return {"names":names, "ingredients": ingredients, "parentname": parent};
}



function drawPie(name){
	
	var colors = new DataColor();
	colors.init();
	
	d3.select('#pie').selectAll('svg').remove();
	
	var piedata = makePieData(name);
	
	ingredients = piedata.ingredients;
	names = piedata.names;
	
	var width = 250,
	height = 250,
	rad = 125,
	donut = d3.layout.pie(),
	arc = d3.svg.arc().innerRadius(0).outerRadius(rad),
	center = [width/2,height/2];

	var vis = d3.select("#pie")
		.append("svg:svg")
		.data([ingredients])
		.attr("width", width)
		.attr("height", height);
	
	vis.style("opacity", 0.25)
		.transition()
		.duration(1000)
		.style("opacity", 1);
	
	var arcs = vis.selectAll("g.arc")
		.data(donut)
		.enter().append("svg:g")
		.attr("class", "arc")
		.attr("transform", "translate(" + rad + "," + rad + ")");
	
	arcs.append("svg:path")
		.attr("fill", function(d, i) {
			if(names[i]==name)
				return colors.getNextHighlightColor();
			return colors.getNextColor();
			})
		.attr("stroke", "white")
		.attr("stroke-width", function(d, i){
			var angle = (d.endAngle - d.startAngle) * (180/Math.PI);
			if(angle < 10)
				return "0px";
			if(angle < 45)
				return "0.5px";
			return "1px";
		})
		.attr("d", arc)
		.on("mouseover", function(d, i){
			var ingredientMap = getData("ingredientMap");
			var currentdata = ingredientMap[names[i]];
			var infotext = "<p>"+currentdata.name+"</p><table>";
			if(currentdata.parentname != undefined)
						infotext += "<tr><td>Überzutat</td><td>"+currentdata.parentname+"</td></tr>";
			infotext += "<tr><td>Anzahl Rezepte</td><td>"+currentdata.recipenum+"</td></tr>";
			infotext += "<tr><td>Anzahl Unterzutat</td><td>"+currentdata.children.length+"</td></tr>";
			infotext += "</table>";
			$("#pieselection").html(infotext);
			})			
		.on("mouseout", function(d,i){
			$("#pieselection").text("");
		})
		.on("click", function(d,i){
			if(i==0 && name != undefined)
				drawPie(piedata.parentname);
			else
				drawPie(names[i], ingredients[i]);
		});
	
	arcs.append("svg:title")
		.text(function(d,i) { return names[i]; });
		
	arcs.append("svg:text")
	    .attr("transform", function(d) {
	    	var totalangle = (d.endAngle - d.startAngle)*(180/Math.PI);
	    	var point = arc.centroid(d);
	    	
	    	if( totalangle > 50)
	    		return "translate(" + point[0] * 1.25 +","+ point[1] * 1.25 + ")";
	    	
	    	var helppoint = [width, height/2];
	    	var b = [helppoint[0]-center[0], helppoint[1]-center[1]];
	    	var angle = (Math.atan2(point[1], point[0])-Math.atan2(b[1], b[0]))*(180/Math.PI);
	    	
	    	if(angle > -90 && angle < 90)
	    		return "translate(" + point[0] * 1.25 +","+ point[1] * 1.25 + ") rotate("+angle+",0,0)";
	    	return "translate(" + point[0] * 1.25 +","+ point[1] * 1.25 + ") rotate("+angle+",0,0) rotate(180,0,0)"; 
	    	})
	    .attr("dy", ".35em")
	    .attr("text-anchor", "middle")
	    .attr("display", function(d) { 
	    	return d.value > .15 ? null : "none"; })
	    .text(function(d, i) {
	    	var currentAngle = d.endAngle-d.startAngle;
	    	if(currentAngle < Math.PI/16 || names[i]==undefined)
	    		return '';
	    	if(names[i].length>12)
	    		return names[i].substr(0,9)+"...";
	    	return names[i]; });
}


function accessor(data){
	return data.recipenum;
}
