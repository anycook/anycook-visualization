var vis,
	force;

function startForce(){
	var w = $("#force").width(),
    h = $("#force").height();
	
	var nodes = getData("nodes");
	var links = getData("links");
	
	
	vis = d3.select("#force").append("svg:svg")
    .attr("width", w)
    .attr("height", h);
	
	/*vis.append("svg:rect")
    .attr("width", w)
    .attr("height", h);*/
	
	
	force = d3.layout.force()
	.nodes(nodes)
    .links(links)
	.charge(-30)
	.linkDistance(500)
	.linkStrength(function(link){
		if(link.target.parentName==undefined && link.source.parentName==undefined)
			return Math.log(link.count)/10;
		return 0;})
	.gravity(0.2)
	//.theta(0.01)	
    .size([w, h]);
	
	force.on("tick", function() {
		var w = $("#force").width();
		var h = $("#force").height();
		vis.selectAll("g.node").attr("transform", function(d) {
			if(d.parentName != undefined){
				updateChildrenPositions(d.name);
				return "translate(" + d.x+ "," + d.y + ")";;
			}
			
			var x = d.x;
			var r = getRadius(d.recipenum);
			if(x<r) 
				x = r;
			else if(x>w-r) 
				x = w-r;
			
			var y = d.y;
			if(y<r) 
				y = r;
			else if(y>h-r) 
				y = h-r;
			
			d.x = x;
			d.y = y;
			
			updateChildrenPositions(d.name);
			
			return "translate(" + x+ "," + y + ")"; });
		
		vis.selectAll("line.link")
			.attr("x1", function(d) {return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });
		
		
	});
	restartForce();
	
	function updateChildrenPositions(ingredient){
		var ingmap = getData("ingredientMap");
		var nodeindex = ingmap[ingredient].index;
		var node = nodes[nodeindex];
		var noderadius = getRadius(node.recipenum);
		var radiusse = [];
		var maxradius = 0;
		for(var i in node.children){
			var child = node.children[i];
			var radius = getRadius(child.recipenum);
			radiusse[i] = radius;
			if(maxradius < radius)
				maxradius = radius;
		}
		
		for(var i in node.children){
			var angle = (2*Math.PI / node.children.length) * i;
			
			var child = node.children[i];
			var childnode = nodes[child.index];
			childnode.x = node.x + ( noderadius + maxradius + 50 )* Math.cos(angle);
			childnode.y = node.y + ( noderadius + maxradius + 50 ) * Math.sin(angle);
		}
	}
}

function restartForce(){
	if(force==undefined) return;
	//var vis = d3.select("#force svg:svg");
	var nodestodraw = getData("nodestodraw");
	var links = getData("links");
	force.links(links);
	
	var node = vis.selectAll("g.node")
	.data(nodestodraw)
	.enter()
	.append("svg:g")
	.attr("class", "node")
	 .on("click", clickIngredient)
	.call(force.drag);
	
	node.append("svg:circle")
    .attr("r", function(d){
    	return getRadius(d.recipenum);
    })
    /*.style("fill", function(d){
    	if(d.childrennum>0)
    		return "#87A347";
    	return "#9fc054";})*/
    .on("click", function(d, i){
    	//data.showChildrenOf(d.name);
    });

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
    });
	
	vis.selectAll("g.node").on("mouseover", drawLinks)
	.on("mouseout", mouseOutLinks);

	/*vis.selectAll("line.link")
	  .data(links)
	  .enter().insert("svg:line", "circle.node")
	  .attr("class", "link")
	  .attr("x1", function(d) { return d.source.x; })
	  .attr("y1", function(d) { return d.source.y; })
	  .attr("x2", function(d) { return d.target.x; })
	  .attr("y2", function(d) { return d.target.y; });
	
	vis.selectAll("circle.node")
	  .data(nodes)
	  .enter().insert("svg:circle", "circle.cursor")
	  .attr("class", "node")
	  .attr("cx", function(d) { return d.x; })
	  .attr("cy", function(d) { return d.y; })
	  .attr("r", 5)
	  .call(force.drag);*/
	
	  force.start();
		
}

function clickIngredient(ingredient, i){
	if(d3.select(this).classed("active")){
		d3.select(".active").classed("active", false);    		
		drawPie(ingredient.parentName);
		removeChilds(ingredient);
	}
	else{
		d3.select(".active").classed("active", false); 
		d3.select(this).classed("active", true);
		drawPie(ingredient.name);
		drawLinks(ingredient, i);
		addChilds(ingredient);
	}
		
	//restartForce();
}

function drawLinks(ingredient, i){
	var linkMap = getData("linkMap");
	var recipeMax = getData("recipeMax");	
	var links = linkMap[ingredient.index];
	
	if(links==undefined) return;
	vis.selectAll("line.link").data(links)
	.enter().insert("svg:line", "g.node")
	.attr("class", "link")
	.style("stroke-width", function(d) { return d.count;})
	.style("stroke", function(d){ return "black"; })
	.style("opacity", 0).transition(100)
	.style("opacity", function(link){
		var max =  recipeMax[ingredient.index];
		return 0.8*(link.count/max);
	})
	.attr("x1", function(d) { return d.source.x; })
	.attr("y1", function(d) { return d.source.y; })
	.attr("x2", function(d) { return d.target.x; })
	.attr("y2", function(d) { return d.target.y; });
}

function mouseOutLinks(ingredient, i){
	vis.selectAll("line.link").style("opacity", 0).remove();
		
}
function getRadius(recipenum){
	return 2+recipenum/2;
}

function addChilds(ingredient){
	var nodestodraw = getData("nodestodraw");
	//var ingredientMap = getData("ingredientMap");
	for(var i in ingredient.children){
		nodestodraw.push(ingredient.children[i]);
	}
	setData("nodestodraw", nodestodraw);
	makeRecipeMap();
	makeLinks();
	restartForce();
}

function removeChilds(ingredient){
	var nodestodraw = getData("nodestodraw");
	
	var newNodestodraw = [];
	var ingredientname = ingredient.name;
	for(var i in nodestodraw){
		var parentName = nodestodraw[i].parentName;
		if(parentName != ingredientname)
			newNodestodraw.push(nodestodraw[i]);
	}
	
	setData("nodestodraw", newNodestodraw);
	makeRecipeMap();
	makeLinks();
	restartForce();
}