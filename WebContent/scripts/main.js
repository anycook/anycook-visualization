$(document).ready(loadApplication);

function loadApplication(){
	$.ajaxSetup({ 
        scriptCharset: "utf8" , 
        contentType: "application/x-www-form-urlencoded; charset=utf8",
        async: "false"
    }); 	
	

	var data = [];
	var labels = [];
	$.getJSON('http://graph.anycook.de/ingredient?callback=?', function(json){
		for(index in json.ingredients){
			data[index] = index;
			labels.push(json.ingredients[index]);
		}
		
		console.log(labels);
		console.log(data);
		
		var w = 1000;
		var h = 1000;
		//var x = d3.scale.ordinal().domain(data).rangePoints([0, w/2], 1);
		//var y = d3.scale.ordinal().domain(data).rangePoints([0, h], 2);
		
		
		var svg = d3.select("#content").append("svg:svg")
			.attr("width", w)
			.attr("height", h);
		
		var row = -20;
		
		var circle = svg.selectAll("circle")
		    .data(data)
		    .enter().append("svg:circle")
		    .style("fill", "steelblue")
		    .attr("cy",function(y, i){
		    	if(i%20 == 0)
		    		row+=50 ;
		    	return row
		    	})
		    .attr("cx",function(y, i){
		    	return ((i) * 50)%1000;
		    	
		    })
		    .attr("r", function(d){
		    	return Math.log(d)*3;
		    });
		  circle.append("svg:text")
		    .attr("text-anchor", "middle")
		    .attr("dy", ".3em")
		    .text(function(d,i){
		    	return labels[i];
		    });
		
	});
	
	//var data2 = [32,70, 57, 112];
	
	
	
}