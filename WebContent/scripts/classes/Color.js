function DataColor(){
	this.colors = [];
	this.highlightcolors = [];
	this.pointer = 0;
	this.hpointer = 0;
}

DataColor.prototype.init = function(){
	var i;
	for(i=182; i<256; i += 7 ){
		var colorgreen = "#"+ d2h(i*0.81) +d2h(i) + d2h(i*0.43);
		this.colors.push(colorgreen);
		console.log(i*0.81 +" "+ i +" "+ i*0.43);
	}
	
	i -= 7;
	var r = i * 0.81,
	g = i,
	b = i * 0.43;
	
	for(i = 200; i<256; i=i+5){
		var colorred = "#"+ d2h(i)  + d2h(i * 0.15) + "00";
		this.highlightcolors.push(colorred);
	}
	
	
	
	for(i = 1; i<11; i+=1){
		console.log("bla"+r+" "+g+" "+b);
		r += 4.8;
		g += g*0.0/g;
		b += 15;
		var colorgray = "#"+ d2h(r)  + d2h(g) + d2h(b);
		this.colors.push(colorgray);
	}
	
	console.log(this.colors);
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

function d2h(d){
	d = Math.round(d);
	return d.toString(16);
}

function h2d(h){
	return parseInt(h,16);
}