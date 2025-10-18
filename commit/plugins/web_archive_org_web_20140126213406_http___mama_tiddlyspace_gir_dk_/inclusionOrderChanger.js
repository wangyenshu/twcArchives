/***
|''Name''|InclusionOrderChanger|
|''Version''|0.2|
|''Status''|beta|
|''Author''|Colm Britton|
|''Description''|Allows you to drag around the list of included spaces to change the casade order|
|''Requires''|TiddlySpaceInclusion jquery-ui-1.8.1.custom|
|''Source''||

!!Description
It is common to include numerous spaces and then realise that the order in which you include them is incorrect. At which point you had to uninclude the spaces and then reinclude them in the desired order. This seemed unintuitive to me. And cumbersome. So I created this plugin which allows you to change the order quickly and simply by dragging the items of the included space list about

It is still in the early stages of development but it does work on standard include lists 
!!Usage
Using {{{<<imageTagger>>}}} uses the macro in the default form. It will create a button that upon clicking will add the tag "image" to all image tiddlers  (.jpg, .png, .svg)
To use this plugin you need three things
#This plugin
#The jquery UI plugin
#The tweaked TiddlyspaceInclusion plugin (this only has this line - config.macros.inclusionOrderChanger.enableSort(); - added)

Then when you open up the backstage and navigate to the includes tab you should be able to use it.
Currently 2 alert books will appear if the order has been changed successfully. One for you public recipe and one for your private recipe

!!To Do

!Code
***/
//{{{

(function($){
		
var tweb = config.extensions.tiddlyweb;
var currentSpace = config.extensions.tiddlyspace.currentSpace.name;

var macro = config.macros.inclusionOrderChanger = {
	locale: {
		listError: "error retrieving spaces included in space %0: %1"
	},
	putCB: function(){
			alert('successfully changed recipe order');
		},
	putEB: function(xhr, error, exc) {
			displayMessage(macro.locale.listError.format([currentSpace, error]));
		},
	
	enableSort: function(){
		if(!readOnly){
			jQuery('.TiddlySpaceInclusion ul').sortable({
    			stop: function(event, ui) {
        			var out = [];
        			jQuery('.TiddlySpaceInclusion ul li a').not('.deleteButton').each(function() {
            			out.push(jQuery(this).text());
        			});
					for(var i=0;i<out.length;i++){
						out[i] = out[i]+"_public";
					}
					out.unshift("system", "tiddlyspace");
					out.push(currentSpace+"_public");
					macro.changeRecipe(out);
    			}
			});
		}
	},

	changeRecipe: function(out){
		var recipe = new tiddlyweb.Recipe(currentSpace + "_public", tweb.host);
		recipe.get(function(recipe, status, xhr) {
			for(var i=0;i<out.length;i++){
				recipe.recipe[i] = [out[i], ""];
			}
			//console.log("Last: "+recipe.recipe);
			recipe.put(macro.putCB, macro.putEB);
		}, function(xhr, error, exc) {
			displayMessage(macro.locale.listError.format([currentSpace, error]));
		});
		var pri_recipe = new tiddlyweb.Recipe(currentSpace + "_private", tweb.host);
		pri_recipe.get(function(recipe, status, xhr) {
			for(var i=0;i<out.length;i++){
				pri_recipe.recipe[i] = [out[i], ""];
			}
			pri_recipe.recipe.push([currentSpace+"_private", ""]);
			//console.log("Last: "+pri_recipe.recipe);
			pri_recipe.put(macro.putCB, macro.putEB);
		}, function(xhr, error, exc) {
			displayMessage(macro.locale.listError.format([currentSpace, error]));
		});
	}
};
	
})(jQuery);

//}}}