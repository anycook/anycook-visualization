$.ajaxSetup({ 
        scriptCharset: "utf8" , 
        contentType: "application/x-www-form-urlencoded; charset=utf8",
        async: false
}); 



function drawPie(name, num){
	
	
	d3.select('#pie').selectAll('svg').remove();
	
	var width = 250,
	height = 250,
	rad = 100,
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
		.attr("d", arc)
		.on("mouseover", function(d, i){
			var currentdata = null;
			for(var j in data.nodes){
				if(data.nodes[j].name == names[i]){
					currentdata = data.nodes[j];
					break;
					}
				}
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
		});
	
	arcs.append("svg:title")
		.text(function(d,i) { return names[i]; });
		
	arcs.append("svg:text")
	    .attr("transform", function(d) {
	    	return "translate(" + arc.centroid(d) + ")"; })
	    .attr("dy", ".35em")
	    .attr("text-anchor", "middle")
	    .attr("display", function(d) { 
	    	return d.value > .15 ? null : "none"; })
	    .text(function(d, i) {
	    	var currentAngle = d.endAngle-d.startAngle;
	    	if(currentAngle < Math.PI/8 && names[i]!=undefined)
	    		return names[i].substr(0,1);
	    	if(currentAngle < Math.PI/6 && names[i]!=undefined)
	    		return names[i].substr(0,2);
	    	if(currentAngle < Math.PI/4 && names[i]!=undefined)
	    		return names[i].substr(0,4);
	    	return names[i]; });
}




function accessor(data){
	return data.recipenum;
}