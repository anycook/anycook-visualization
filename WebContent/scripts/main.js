$(document).ready(loadApplication);

function loadApplication(){
	$.ajaxSetup({ 
        scriptCharset: "utf8" , 
        contentType: "application/x-www-form-urlencoded; charset=utf8",
        async: "false"
    }); 	
	

	var data = [];
	var lables = [];
	$.getJSON('http://graph.anycook.de/ingredient?callback=?', function(json){
		for(index in json.ingredients){
			data[index] = index;
			lables.push(json.ingredients[index]);
		}
	});
	
	//var data2 = [32,70, 57, 112];
	
	console.log(lables);
	console.log(data);
	
	var w = 800;
	var h = 400;
	var x = d3.scale.ordinal().domain(data).rangePoints([0, w], 1);
	var y = d3.scale.ordinal().domain(data).rangePoints([0, h], 2);
	
	
	var svg = d3.select("#content").append("svg:svg")
		.attr("width", w)
		.attr("height", h);
	
	var circle = svg.selectAll("circle")
	    .data(data)
	    .enter().append("svg:circle")
	    .style("fill", "steelblue")
	    .attr("cy",x)
	    .attr("cx",y)
	    .attr("r", function(d){
	    	return d;
	    });
	
}