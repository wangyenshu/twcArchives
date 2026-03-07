/***
|''Name''|InclusionLookupPlugin|
|''Description''|Provides a form to display who is including your space.|
|''Version''|0.6.6|

***/
//{{{
(function($) {
var URL_TEMPLATE = window.location.hostname.split(".");
URL_TEMPLATE[0] = "%0"
URL_TEMPLATE = window.location.protocol + "//" + URL_TEMPLATE.join(".");
var tiddlyspace = config.extensions.tiddlyspace;
var endsWith = config.extensions.BinaryTiddlersPlugin.endsWith;
var macro = config.macros.inclusionLookup = {
	lookup: function(space, callback) {
		ajaxReq({
			url: "/recipes?select=rbag:%0_public".format([space]),
			dataType: "json",
			success: function(recipes) {
				var _recipes = [];
				for(var i = 0; i < recipes.length; i++) {
					var r = recipes[i];
					if(!endsWith(r, "_private") && r != "%0_public".format([space])) {
						_recipes.push(r);
					}
				}
				recipes = _recipes;
				callback(recipes);
			}
		});
	},handler: function(place, macroName, params) {
		var container = $("<div />").appendTo(place);
		$("<span />").text("Space name:").appendTo(container)
		$("<input />").attr("type", "text").appendTo(container);
		$("<button />").text("Lookup").click(function(ev) {
			var space = $("input", container).val();
			var results = $(".resultsArea",  container).empty().text("please wait...");
			macro.lookup(space, function(recipes) {
				results.empty();
				$("<div />").text("%0 spaces include the %1 space".format([recipes.length, space])).appendTo(results);
				var ul = $("<ul />").appendTo(results);
				for(var i = 0; i < recipes.length; i++) {
					var name = tiddlyspace.resolveSpaceName(recipes[i]);
					var li = $("<li />").appendTo(ul);
					var url = URL_TEMPLATE.format([name]);
					$("<a />").text(name).attr("href", url).appendTo(li);
				}
			})
			
		}).appendTo(container)
		var resultsArea = $("<div />").addClass("resultsArea").appendTo(container);
  }
};

config.macros.inclusionCount = {
	handler: function(place, macroName, params, wikifier, paramString, tiddler) {
		var space = params[0];
		var args = paramString.parseParams("anon")[0];
		var field = args.field ? args.field[0] : false;
		if(field) {
			space = tiddler[field] || tiddler.fields[field];
		}
		var prefix = args.prefix ? args.prefix[0] : "";
		var suffix = args.suffix ? args.suffix[0] : "";
		var span = $("<span />").appendTo(place);
		macro.lookup(space, function(recipes) {
			var count = recipes ? recipes.length : "0";
			if(tiddler) {
				tiddler.fields["inclusion.count"] = count;
			}
			span.text("%0 %1 %2".format([prefix, count, suffix]));
		})
	}
};

})(jQuery);
//}}}
