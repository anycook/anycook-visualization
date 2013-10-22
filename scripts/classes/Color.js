function DataColor(){
	this.colors = [];
	this.grayscale = [];
	this.sigmoidgrayscales = [];
	this.highlightcolors = [];
	this.pointer = 0;
	this.hpointer = 1;
	this.gpointer = 0;
	this.sgpointer = 0;
}

DataColor.prototype.init = function(){
	var i;
	for(i=205; i<256; i += 29.2 ){
		for(var j = 175; j>29 ; j -= 35){
			var color = "#"+ d2h(j) +d2h(i) + d2h(29);
			this.colors.push(color);
			color = "#"+ d2h(i) +d2h(j) + d2h(29);
			this.colors.push(color);
			color = "#"+ d2h(i) +d2h(29) + d2h(j);
			this.colors.push(color);
		}
	}
	
	/*i -= 14.6;
	var r = i * 0.81,
	g = i,
	b = i * 0.43;
	*/
	
	for(i = 200; i<256; i=i+5){
		var colorred = "#"+ d2h(i)  + d2h(i * 0.15) + "00";
		this.highlightcolors.push(colorred);
	}
	
	for(i = 80; i<250; i+=10){
		var colorvalue = d2h(i);
		var colorgray = "#"+ colorvalue  + colorvalue + colorvalue;
		this.grayscale.push(colorgray);
	}
	
	
	
	for(i = 80; i<250; i+=3){
		var value = 250/(1+Math.exp(-3*Math.log(i)+14));
		var colorvalue = d2h(Math.round(value));
		var colorgray = "#"+ colorvalue  + colorvalue + colorvalue;
		this.sigmoidgrayscales.push(colorgray);
	}
};

DataColor.prototype.getNextColor = function(){
	var color =  this.colors[this.pointer];
	this.pointer +=1;
	if(this.pointer == this.colors.length)
		this.pointer = 0;
	return color;
};

DataColor.prototype.getNextHighlightColor = function(){
	var color =  this.highlightcolors[this.hpointer];
	this.hpointer +=1;
	if(this.hpointer == this.highlightcolors.length)
		this.hpointer = 0;
	return color;
};

DataColor.prototype.getNextGrayscale = function(){
	var color =  this.grayscale[this.gpointer];
	this.gpointer +=1;
	if(this.gpointer == this.grayscale.length)
		this.gpointer = 0;
	return color;
};

DataColor.prototype.getNextSigmoidGrayscale = function(){
	var color =  this.sigmoidgrayscales[this.sgpointer];
	this.sgpointer +=1;
	if(this.sgpointer == this.sigmoidgrayscales.length)
		this.sgpointer = 0;
	return color;
};

function d2h(d){
	d = Math.round(d);
	return d.toString(16);
}

function h2d(h){
	return parseInt(h,16);
}