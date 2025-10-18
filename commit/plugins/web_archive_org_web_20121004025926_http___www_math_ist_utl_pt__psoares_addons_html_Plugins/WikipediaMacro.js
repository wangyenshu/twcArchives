//{{{
config.macros.wikipedia = {};
config.macros.wikipedia.handler= function(place,macroName,params) {
	if(params.length==1){
		var key=params[0];
		var lang="en";
	} else {
		var key=params[1];
		var lang=params[0];
	}
	wikify("[["+key+"|http://"+lang+".wikipedia.org/wiki/"+key+"]]",place)
}
//}}}