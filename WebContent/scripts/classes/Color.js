function DataColor(){
	this.colors = [];
	this.highlightcolors = [];
	this.pointer = 0;
	this.hpointer = 1;
}

DataColor.prototype.init = function(){
	var i;
	for(i=182; i<256; i += 29.2 ){
		for(var j = i-30; j>80 ; j -= 40){
			var color = "#"+ d2h(j) +d2h(i) + d2h(80);
			this.colors.push(color);
			color = "#"+ d2h(i) +d2h(j) + d2h(80);
			this.colors.push(color);
			color = "#"+ d2h(i) +d2h(80) + d2h(j);
			this.colors.push(color);
		}
		
		
		
	}
	
	
	
	
	/*i -= 14.6;
	var r = i * 0.81,
	g = i,
	b = i * 0.43;
	
	for(i = 1; i<11; i+=1){
		r += 4.8;
		b += 14;
		console.log("bla"+r+" "+g+" "+b);
		var colorgray = "#"+ d2h(r-i*10)  + d2h(g-i*10) + d2h(b-i*10);
		this.colors.push(colorgray);
	}*/
	
	for(i = 200; i<256; i=i+5){
		var colorred = "#"+ d2h(i)  + d2h(i * 0.15) + "00";
		this.highlightcolors.push(colorred);
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