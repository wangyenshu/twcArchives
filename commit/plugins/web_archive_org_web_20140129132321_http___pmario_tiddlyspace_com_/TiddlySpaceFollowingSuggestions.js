/***
|''Name''|TiddlySpaceFollowingSuggestions|
|''Version''|0.2.5dev|
|''Description''|Provides a following macro|
|''Author''|Jon Robson|
|''Requires''|TiddlySpaceFollowingPlugin|
|''License''|[[BSD|http://www.opensource.org/licenses/bsd-license.php]]|
!Usage

!Code
***/
//{{{
(function($) {

var tweb = config.extensions.tiddlyweb;
var tiddlyspace = config.extensions.tiddlyspace;
var followMacro = config.macros.followTiddlers;

var followSuggestions = config.macros.followSuggestions = {
	cache: {},
	handler: function(place, macroName, params) {
		// to do - limit results
		place = $('<div class="suggestions" />').appendTo(place)[0];
		var currentSpace = tiddlyspace.currentSpace.name;
		var user = params[0] || currentSpace;
		var pleaseWait = $("<div class='loading' />").text("please wait..").appendTo(place);
		tweb.getUserInfo(function(activeUser) {
			if(activeUser.name != tiddlyspace.currentSpace.name) {
				pleaseWait.hide();
				return;
			}
			followMacro.getFollowers(function(users) {
				// suggestions are followers of people that you follow that you don't follow
				var bags = followMacro._getFollowerBags(users);
				var _bags = [];
				for(var i = 0; i < bags.length; i++) {
					_bags.push("bag:%0".format([bags[i]]));
				}
				var bagString = _bags.join(" OR ");
				ajaxReq({
					beforeSend: followMacro.beforeSend,
					url: "/search?q=(%0)&select=title:!%1&select=title:!@%1".format([bagString, activeUser.name]),
					dataType: "json",
					success: function(tiddlers) {
						pleaseWait.hide();
						var suggestions = [];
						for(var i = 0; i < tiddlers.length; i++) {
							var tiddler = tiddlers[i];
							if(tiddler.tags.contains("follow")) {
								var title = tiddler.title;
								if(title.indexOf("@") === 0) {
									title = title.substr(1);
								}
								if(!users.contains(title)) {
									suggestions.pushUnique(title);
								}
							}
						}
						$(place).append("<div>suggestions:</div>");
						var suggestionArea = $("<div class='suggestionArea' />").appendTo(place)[0];
						var id = "more_%0".format([Math.random()]);
						var more = $("<div class='moreButton' />").text("more...").appendTo(place).attr("id", id);
						followSuggestions.cache[id] = suggestions;
						var limit = suggestions.length;
						more.click(function(ev) {
							var suggestions = config.macros.followSuggestions.cache[id];
							var newSuggestions = followSuggestions.suggest(place, suggestions, limit);
							config.macros.followSuggestions.cache[id] = newSuggestions;
						});
						followSuggestions.suggest(place, suggestions, limit);
					
					}
				});
			
			}, user);
		});
	},
	randomize: function(a, b) {
		if(Math.random() < Math.random()) {
			return -1;
		} else {
			return 1;
		}
	},
	suggest: function(place, suggestions, limit) {
		var currentSpace = tiddlyspace.currentSpace.name;
		suggestions = suggestions.sort(followSuggestions.randomize);
		var suggestionsArea = $(".suggestionArea", place)[0];
		if(suggestions.length === 0) {
			$("<span />").text("no suggestions..").appendTo(suggestionsArea);
			return;
		}
		limit = limit < suggestions.length ? limit : suggestions.length;
		for(var j = 0; j < limit; j++) {
			var link = $("<span />").appendTo(suggestionsArea)[0];
			var title = suggestions[j];
			var newTiddler = '@%0 <<newTiddler title:"@%0" fields:"server.workspace:bags/%1_public" tag:follow label:"follow">>\n'.format([title, currentSpace]);
			wikify(newTiddler, link);
		}
		var newSuggestions = suggestions.slice(limit, suggestions.length);
		var more = $(".moreButton", place);
		if(newSuggestions.length == 0) {
			more.remove();
		}
		return newSuggestions;
	}
};
})(jQuery);
//}}}