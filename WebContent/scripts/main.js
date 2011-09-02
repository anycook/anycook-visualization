$(document).ready(function(){
	$.ajaxSetup({ 
	    scriptCharset: "utf8" , 
	    contentType: "application/x-www-form-urlencoded; charset=utf8"
	});
	
	
	
	var w = $(document).width()/2,
    h = $(document).height(),
    fill = d3.scale.category20();
	
	$.when(loadData()).done(function(){
		$("#progressbar").remove();
	});

});