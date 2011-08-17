$.ajaxSetup({ 
        scriptCharset: "utf8" , 
        contentType: "application/x-www-form-urlencoded; charset=utf8",
        async: false
}); 


var w = 400,
    h = 400,
    r = Math.min(w, h) / 2,
    color = d3.scale.category20c(),
    ingredients = [],
    names = [],
    total = 0,
    donut = d3.layout.pie().sort(null),
    arc = d3.svg.arc().innerRadius(0).outerRadius(r),
    currentStart = 0;



/*var vis = d3.select("#content")
  .append("svg:svg")
    .attr("width", w)
    .attr("height", h)
     .append("svg:g")
    .attr("transform", "translate("+w/2+","+h/2+")");



var arc = d3.svg.arc()
 .startAngle(function(d) {return currentStart;})
     .endAngle(function(d) { 
    	 currentStart =  ((pie.endAngle-pie.startAngle)*d.size)/total;
    	 return currentStart;})
     .innerRadius(function(d) { return 0; })
    .outerRadius(function(d) { return r; });*/
$.getJSON('http://graph.anycook.de/ingredient/Gemüse?callback=?', function(json) {
	//json.x = 0;
	/*json.size = json.recipenum;
	total+=json.size;
	//json.dx = json.recipenum;
	var children= json.children;
	json.children = [];
	ingredients.push(json);*/
	ingredients.push(json.recipenum);
	names.push(json.name);
	//x = json.dx;
	$(json.children).each(function(i, value){
		$.getJSON("http://graph.anycook.de/ingredient/"+value+"?children&callback=?",function(childjson){
			/*childjson.size = childjson.recipenum;
			total += childjson.size;
			childjson.children = [];
			ingredients.push(childjson);*/
			ingredients.push(childjson.recipenum);
			names.push(childjson.name);
			//if(ingredients.length+1 == children.length){
				//var data = d3.range(ingredients.length).map(ingredients);
			if(ingredients.length == json.children.length+1 ){
				var vis = d3.select("body")
				.append("svg:svg")
				  .data([ingredients])
				  .attr("width", w)
				  .attr("height", h);
				var arcs = vis.selectAll("g.arc")
				.data(donut)
				.enter().append("svg:g")
				.attr("class", "arc")
				.attr("transform", "translate(" + r + "," + r + ")");
	
				arcs.append("svg:path")
				.attr("fill", function(d, i) { return color(i); })
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
				
				/*var pie = d3.layout.pie(ingredients)
				     .sort(null)
			    //.size([2 * Math.PI, r * r])
			    .value(function(d) { return d; });
				
				 var path = vis.data(ingredients)
				 .selectAll("path")
			        .data(pie)
			      .enter().append("svg:path")
			        .attr("display", function(d) { return 1; }) // hide inner ring
			        .attr("d", arc)
			        .attr("fill-rule", "evenodd")
			        .style("stroke", "#fff")
			        .style("fill", function(d) { return color(d.name); });
			        //.each(stash)*/
			
		});
	});
	 /*var path = vis.data([json]).selectAll("path")
	        .data(partition.nodes)
	      .enter().append("svg:path")
	        .attr("display", function(d) { return 1; }) // hide inner ring
	        .attr("d", arc)
	        .attr("fill-rule", "evenodd")
	        .style("stroke", "#fff")
	        .style("fill", function(d) { return color(d.name); });
	        //.each(stash)*/
});



function accessor(data){
	return data.recipenum;
}