function getData(fieldname){
	if(!$("body").data("data")){
		$("body").data("data", {		
			nodes: [],
			nodestodraw : [],
			links : [],
			total : 0,
			recipeMap : {},
			linkMap : {},
			recipeMax : [],
			ingredients : [], //ingredient object tree
			ingredientMap:{}, //ingredients by name
			ingredientNames:[], // just the names
			ingredientRecipeMap:{},
			categoryNames:[], // array of category names
			categories: [], // array of category objects
			childrenMap: {}, // all childrennames for every ingredient
		});
	}
	
	if(fieldname == undefined)	
		return $("body").data("data");
	else
		return $("body").data("data")[fieldname];
}

function setData(optionskey, value){
	var data = getData();
	
	
	if(typeof optionskey == "string" && value != undefined)
		data[optionskey] = value;
	else if(typeof optionskey == "object")
		jQuery.extend(data, optionskey);	 
	$("body").data("data", data);
}