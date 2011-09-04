function drawBar(name){
	var w = 400,
		h = 400,
		x = d3.scale.linear().range([0, w]),
		y = d3.scale.linear().range([0, h - 40]);
	
	var svg = d3.select("#chart").append("svg:svg")
		.attr("width", w)
		.attr("height", h)
		.append("svg:g")
		.attr("transform", "translate(" + x(1) + "," + (h - 20) + ")scale(-1,-1)");
	
	var body = svg.append("svg:g")
		.attr("transform", "translate(0,0)");
	
	var rules = svg.append("svg:g");
}
  