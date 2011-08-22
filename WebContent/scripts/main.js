$.ajaxSetup({ 
        scriptCharset: "utf8" , 
        contentType: "application/x-www-form-urlencoded; charset=utf8",
        async: false
}); 

var w = $(document).width(),
    h = $(document).height(),
    fill = d3.scale.category20(),
    activeD = null;

console.log(w + " " + h);

var vis = d3.select("#content")
	.append("svg:svg")
	.attr("width", w)
	.attr("height", h);

var force = d3.layout.force()
	.charge(-120)
	.linkDistance(0)
	.linkStrength(1)
	.size([w, h]);

var data = new Data();
data.init(start, function(percent){
	var value = Math.round(percent * 100);
	$("#percentage").text(value);
});



function start(){
	$("#percentage").text("");

force.nodes(data.nodestodraw)
	//.links(data.links)
	.start();

vis.style("opacity", 1e-6)
	.transition()
	.duration(1000)
	.style("opacity", 1);

force.on("tick", function() {
	 vis.selectAll("line.link")
	 .attr("x1", function(d) { return d.source.x; })
	  .attr("y1", function(d) { return d.source.y; })
	  .attr("x2", function(d) { return d.target.x; })
	  .attr("y2", function(d) { return d.target.y; });

	 vis.selectAll("g.node").attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
});

var node = vis.selectAll("g.node")
	.data(data.nodestodraw)
	.enter()
	.append("svg:g")
	.attr("class", "node")
	.call(force.drag);

node.append("svg:circle")
	.attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", function(d){
    	return 2+d.recipenum/2
    ;})
    .style("fill", function(d){
    	if(d.children.length>0)
    		return "#87A347";
    	return "#9fc054";});

/*var link = vis.selectAll("line.link").data(data.links)
	.enter().insert("svg:line", "g.node")
	.attr("class", "link")
	.style("stroke-width", function(d) { return 3;})
	.style("stroke", function(d){ return "black"; })
	.style("opacity", 0)
	.transition().style("opacity", function(d){ return 0.5;})
	.attr("x1", function(d) { return d.source.x; })
	.attr("y1", function(d) { return d.source.y; })
	.attr("x2", function(d) { return d.target.x; })
	.attr("y2", function(d) { return d.target.y; });
*/
}

