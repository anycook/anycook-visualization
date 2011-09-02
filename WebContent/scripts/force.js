function makeforce(nodestodraw, links){
	$("progress").remove();
	
	var vis = d3.select("#content")
		.append("svg:svg")
		.attr("width", w)
		.attr("height", h),	
	force = d3.layout.force()
		.charge(-120)
		.gravity(0.3)
		.linkDistance(400)
		.linkStrength(0)
		.size([w, h])
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
	
	vis.selectAll("g.node").attr("transform", function(d) { 
		return "translate(" + d.x + "," + d.y + ")"; });
	});
	

	force.nodes(nodestodraw)
		.links(links)
		.start();
	
	var node = vis.selectAll("g.node")
		.data(nodestodraw)
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
	    	return "#9fc054";})
	    .on("click", function(d, i){
	    	data.showChildrenOf(d.name);
	    });
	
	node.append("svg:title")
		.text(function(d) { return d.name; });
	
	node.append("svg:text")
	    .attr("class", "nodetext")
	    .attr("dx", function(d){
	    	var $this = $(this);
	    	var r = $this.siblings("circle")[0].r.baseVal.value;
	    	if(d.name.length < r / 3){
	    		return 0;
	    	}    		
	    	else return r + 2;
	    })
	    .attr("dy", ".35em")
	    .text(function(d) { return d.name; })
	    .attr("text-anchor", function(d){
	    	var $this = $(this);
	    	var r = $this.siblings("circle")[0].r.baseVal.value;
	    	if(d.name.length < r / 3)
	    		return "middle";
	    	return "left";
	    })
	    .on("click", function(d){
	    	drawPie(d.name, d.recipenum);
	    });
	
	node.on("mouseover", function(d, i){
		vis.selectAll("line.link").data(data.linkmap[i])
		.enter().insert("svg:line", "g.node")
		.attr("class", "link")
		.style("stroke-width", function(d) { return d.count;})
		.style("stroke", function(d){ return "black"; })
		.style("opacity", 0)
		.transition().style("opacity", function(d){ 
			 return 0.9*(d.count/data.recipemax[i]);})
		.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });
	})
	.on("mouseout",function(d,i){
    	  vis.selectAll("line.link").transition().style("opacity", 0).remove();
      });
	force.resume();
	
}