$.ajaxSetup({ 
        scriptCharset: "utf8" , 
        contentType: "application/x-www-form-urlencoded; charset=utf8",
        async: false
}); 


var w = $(document).width(),
    h = $(document).height(),
    fill = d3.scale.category20(),
    nodes = [],
    links = [],
    linkArray = new Object(),
    recipeMax = [],
    activeD = null;

var vis = d3.select("#content")
  .append("svg:svg")
    .attr("width", w)
    .attr("height", h);

var force = d3.layout.force()
.charge(-120)
.linkDistance(500)
.nodes(nodes)
.links(links)
.linkStrength(0.1)
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

	 //vis.selectAll("g.node").attr("cx", function(d) { return d.x; })
	  //.attr("cy", function(d) { return d.y; });
	 vis.selectAll("g.node").attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
});


$.getJSON('http://graph.anycook.de/ingredient?parent&callback=?', function(json) {
	//var ingredients = new Array();
	var recipemap = new Object();
	$(json.ingredients).each(function(i, value){
		$.getJSON("http://graph.anycook.de/ingredient/"+value+"?children&callback=?", function(ingredient){
			nodes.push({"name":ingredient.name, "index":i, "recipenum": ingredient.recipenum});
			var index = nodes.length-1;
			for(var j in ingredient.recipes){
				var recipe = ingredient.recipes[j];
				var recipearray = recipemap[recipe];
				if(recipearray == null || recipearray== undefined){
					recipearray = new Array();
				}
				recipearray.push(index);
				recipemap[recipe] = recipearray;
			}
			//if(nodes.length%20 == 0 || nodes.length == json.ingredients.length)
			if(nodes.length == json.ingredients.length){
				 makeLinks(recipemap);
				 start();
			}
			
		}).error(function(){alert("error");});
	});
});

/*force.on("tick", function() {
	link.attr("x1", function(d) { return d.source.x; })
	  .attr("y1", function(d) { return d.source.y; })
	  .attr("x2", function(d) { return d.target.x; })
	  .attr("y2", function(d) { return d.target.y; });

	node.attr("cx", function(d) { return d.x; })
	  .attr("cy", function(d) { return d.y; });
	});*/

function makeLinks(recipemap){
	var recipeID = 0;
	//$(recipemap).each(function(recipe, recipearray){
	for(var recipe in recipemap){
		var recipearray = recipemap[recipe];
		for(var i = 0; i<recipearray.length-2; i++){
			for(var j = i+1; j<recipearray.length; j++){
				var found = false;
				for(var k in links){
					if(links[k].source == recipearray[i] && links[k].target == recipearray[j]
						|| links[k].target == recipearray[i] && links[k].source == recipearray[j]){
						var link = links[k];
						link.count++;
						link.names.push(recipe);
						links[k] = link;
						found=true;
						break;
					}
				}
				if(!found)
					links.push({"source":recipearray[i], "target":recipearray[j], "id" : recipeID, "names" : [recipe], "count":1});
				
			}
		}
		
		recipeID++;
	}
	
	for(var i in links){
		var sourceindex = links[i].source;
		if(linkArray[sourceindex] == null || linkArray[sourceindex] == undefined)
			linkArray[sourceindex] = new Array();
		
		linkArray[sourceindex].push(links[i]);
		
		var targetindex = links[i].target;
		if(linkArray[targetindex] == null || linkArray[targetindex] == undefined)
			linkArray[targetindex] = new Array();
		
		linkArray[targetindex].push(links[i]);		
	}
	
	
	for(var i in linkArray){
		recipeMax[i] = 0;
		for(var j in linkArray[i]){
			recipeMax[i] = Math.max(recipeMax[i], linkArray[i][j].count);
		}
	}
}

function start(){
	//var linkMap = new Object();
	

	//vis.selectAll("line.link").remove();
	var link = vis.selectAll("line.link");
      /*.data(links)
    .enter().insert("svg:line")
      .attr("class", "link")
      //.attr("class", function(d){return "link."+d.source.index+"."+d.target.index;})
      //.attr("class", function(d){return d.target.index;})
      .style("stroke-width", function(d) { return d.count;})//return Math.sqrt(d.value); })
      .style("stroke", function(d){ return "black"; })//return fill(d.id);
      .style("opacity", function(d){ return 1*(d.count/recipeMax);})
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })
      /*.on("mouseover", function(d, i){
    	  var $this = $(this);
    	  $this.css("stroke", "#ff0000");
    	  //$this.mouseLeave(function(){$this.css("stroke", "#000000");});
    	  
      })*/

	var node = vis.selectAll("g.node")
    .data(nodes)
    .enter().append("svg:g")
     .attr("class", "node")
     .on("mouseover", function(d, i){
	         link.data(linkArray[i])
	         .enter().insert("svg:line", "g.node")
	         .attr("class", "link")
	         .style("stroke-width", function(d) { return d.count;})//return Math.sqrt(d.value); })
	         .style("stroke", function(d){ return "black"; })
	         .style("opacity", 0)//return fill(d.id);
		      .transition().style("opacity", function(d){ return 0.9*(d.count/recipeMax[i]);})
		      .attr("x1", function(d) { return d.source.x; })
		      .attr("y1", function(d) { return d.source.y; })
		      .attr("x2", function(d) { return d.target.x; })
		      .attr("y2", function(d) { return d.target.y; });
      })
      .on("mouseout",function(d,i){
    	  
    	  vis.selectAll("line.link").transition().style("opacity", 0).remove();
      })
      .call(force.drag);
	
	
    node.append("svg:circle")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d){return 2+d.recipenum/2;})
      .style("fill", "#9fc054");
	
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
    	});
    

	link.append("svg:title")
	.text(function(d) { return d.names; });
	
	/*force.on("tick", function() {
		link.attr("x1", function(d) { return d.source.x; })
		  .attr("y1", function(d) { return d.source.y; })
		  .attr("x2", function(d) { return d.target.x; })
		  .attr("y2", function(d) { return d.target.y; });

		node.attr("cx", function(d) { return d.x; })
		  .attr("cy", function(d) { return d.y; });
		});*/
	
	force.start();
}