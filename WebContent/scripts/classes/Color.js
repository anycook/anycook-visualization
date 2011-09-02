function DataColor(){
	this.colors = [];
	this.pointer = 0;
}

DataColor.prototype.init = function(){
	var colorvalue = 182;
	for(var i=0; i<10; ++i ){
		colorvalue += 7;
		var colorgreen = "#"+ d2h(colorvalue*0.81) + "" +d2h(colorvalue) + "" + d2h(colorvalue*0.43);
		this.colors.push(colorgreen);
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


function d2h(d){
	d = Math.round(d);
	return d.toString(16);
}

function h2d(h){
	return parseInt(h,16);
}