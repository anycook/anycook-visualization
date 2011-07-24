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
    activeLinks = [],
    recipeMax = 0,
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

	 vis.selectAll("circle.node").attr("cx", function(d) { return d.x; })
	  .attr("cy", function(d) { return d.y; });
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
				 restart();
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
						recipeMax = Math.max(recipeMax, link.count);
						break;
					}
				}
				if(!found)
					links.push({"source":recipearray[i], "target":recipearray[j], "id" : recipeID, "names" : [recipe], "count":1});
				
			}
		}
		
		recipeID++;
	}
}

function restart(){
	//var linkMap = new Object();
	

	var link = vis.selectAll("line.link")
      .data(links)
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
    	  
      })*/;

	var node = vis.selectAll("circle.node")
      .data(nodes)
    .enter().insert("svg:circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d){return 2+d.recipenum/2;})
      .style("fill", "steelblue")
      .call(force.drag)
      .text(function(d) { return d.name; });
      /*.on("mouseover", function(d, i){
    	  //activeLinks = [];
    	 $("."+i).fadeOut();
    	  //restart();
      })
      .on("mouseout",function(d,i){
    	  //activeLinks = [];
    	  //restart();
      })*/;
	
	node.append("svg:title")
	.text(function(d) { return d.name; });

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