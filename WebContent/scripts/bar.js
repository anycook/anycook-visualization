function drawBar(name){
	var data = makeBarData(name);
	
	var w = 400,
		h = 400,
		x = d3.scale.linear().domain([0,1]).range([0, w]),
		y = d3.scale.linear().domain([0,100]).range([0, h - 40]);
	
	var chart = d3.select("#bar")
		.append("svg:svg")
		.attr("class", "chart")
		.attr("width", w * data.length - 1)
		.attr("height", h);

	chart.selectAll("rect")
		.data(data)
		.enter().append("svg:rect")
		.attr("x", function(d, i) { return x(i) - .5; })
		.attr("y", function(d) { return h - y(d.amount) - .5; })
		.attr("width", w)
		.attr("height", function(d) { return y(d.amount); });
	
	chart.append("svg:line")
		.attr("x1", 0)
		.attr("x2", w * data.length)
		.attr("y1", h - .5)
		.attr("y2", h - .5)
		.attr("stroke", "#000");
}
  