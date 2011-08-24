$.ajaxSetup({ 
        scriptCharset: "utf8" , 
        contentType: "application/x-www-form-urlencoded; charset=utf8",
        async: false
}); 



function drawPie(name, num){
	
	
	d3.select('#pie').selectAll('svg').remove();
	
	var width = 400,
	height = 400,
	rad = Math.min(w, h) / 2,
	color = d3.scale.category20c(),
	ingredients = [],
	names = [],
	donut = d3.layout.pie().sort(null),
	arc = d3.svg.arc().innerRadius(0).outerRadius(rad);

	var vis = d3.select("#pie")
		.append("svg:svg")
		.data([ingredients])
		.attr("width", width)
		.attr("height", height);
	
	names.push(name);
	ingredients.push(num);
	for(var i in data.nodes){
		var value = data.nodes[i];
		if(value.parentname == name){
			names.push(value.name);
			ingredients.push(value.recipenum);
		}
	}
	
	var arcs = vis.selectAll("g.arc")
	.data(donut)
	.enter().append("svg:g")
	.attr("class", "arc")
	.attr("transform", "translate(" + rad + "," + rad + ")");
	
	arcs.append("svg:path")
		.attr("fill", function(d, i) { 
			return color(names[i]); 
			})
		.attr("d", arc);
		
	arcs.append("svg:text")
	    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
	    .attr("dy", ".35em")
	    .attr("text-anchor", "middle")
	    .attr("display", function(d) { 
	    	return d.value > .15 ? null : "none"; })
	    .text(function(d, i) { 
	    	return names[i]; });
}




function accessor(data){
	return data.recipenum;
}