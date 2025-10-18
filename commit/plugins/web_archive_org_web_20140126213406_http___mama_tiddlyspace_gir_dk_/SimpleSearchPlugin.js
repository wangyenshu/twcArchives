/***
|''Name''|SimpleSearchPlugin|
|''Description''|displays search results as a simple list of matching tiddlers|
|''Authors''|FND|
|''Version''|0.4.1|
|''Status''|stable|
|''Source''|http://devpad.tiddlyspot.com/#SimpleSearchPlugin|
|''CodeRepository''|http://svn.tiddlywiki.org/Trunk/contributors/FND/plugins/SimpleSearchPlugin.js|
|''License''|[[Creative Commons Attribution-ShareAlike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]]|
|''Keywords''|search|
!Code
***/
//{{{
if(!version.extensions.SimpleSearchPlugin) { //# ensure that the plugin is only installed once
version.extensions.SimpleSearchPlugin = { installed: true };

if(!config.extensions) { config.extensions = {}; }

config.extensions.SimpleSearchPlugin = {
	heading: "Søge Resultster",
	containerId: "searchResults",
	btnCloseLabel: "luk",
	btnCloseTooltip: "dismiss search results",
	btnCloseId: "search_close",
	btnOpenLabel: "åbn alle",
	btnOpenTooltip: "open all search results",
	btnOpenId: "search_open",

	displayResults: function(matches, query) {
		story.refreshAllTiddlers(true); // update highlighting within story tiddlers
		var el = document.getElementById(this.containerId);
		query = '"""' + query + '"""'; // prevent WikiLinks
		if(el) {
			removeChildren(el);
		} else { //# fallback: use displayArea as parent
			var container = document.getElementById("displayArea");
			el = document.createElement("div");
			el.id = this.containerId;
			el = container.insertBefore(el, container.firstChild);
		}
		var msg = "!" + this.heading + "\n";
		if(matches.length > 0) {
			msg += "''" + config.macros.search.successMsg.format([matches.length.toString(), query]) + ":''\n";
			this.results = [];
			for(var i = 0 ; i < matches.length; i++) {
				this.results.push(matches[i].title);
				msg += "* [[" + matches[i].title + "]]\n";
			}
		} else {
			msg += "''" + config.macros.search.failureMsg.format([query]) + "''"; // XXX: do not use bold here!?
		}
		createTiddlyButton(el, this.btnCloseLabel, this.btnCloseTooltip, config.extensions.SimpleSearchPlugin.closeResults, "button", this.btnCloseId);
		if(matches.length > 0) { // XXX: redundant!?
			createTiddlyButton(el, this.btnOpenLabel, this.btnOpenTooltip, config.extensions.SimpleSearchPlugin.openAll, "button", this.btnOpenId);
		}
		wikify(msg, el);
	},

	closeResults: function() {
		var el = document.getElementById(config.extensions.SimpleSearchPlugin.containerId);
		removeNode(el);
		config.extensions.SimpleSearchPlugin.results = null;
		highlightHack = null;
	},

	openAll: function(ev) {
		story.displayTiddlers(null, config.extensions.SimpleSearchPlugin.results);
		return false;
	}
};

// override Story.search()
Story.prototype.search = function(text, useCaseSensitive, useRegExp) {
	highlightHack = new RegExp(useRegExp ? text : text.escapeRegExp(), useCaseSensitive ? "mg" : "img");
	var matches = store.search(highlightHack, null, "excludeSearch");
	var q = useRegExp ? "/" : "'";
	config.extensions.SimpleSearchPlugin.displayResults(matches, q + text + q);
};

// override TiddlyWiki.search() to sort by relevance
TiddlyWiki.prototype.search = function(searchRegExp, sortField, excludeTag, match) {
	var candidates = this.reverseLookup("tags", excludeTag, !!match);
	var primary = [];
	var secondary = [];
	var tertiary = [];
	for(var t = 0; t < candidates.length; t++) {
		if(candidates[t].title.search(searchRegExp) != -1) {
			primary.push(candidates[t]);
		} else if(candidates[t].tags.join(" ").search(searchRegExp) != -1) {
			secondary.push(candidates[t]);
		} else if(candidates[t].text.search(searchRegExp) != -1) {
			tertiary.push(candidates[t]);
		}
	}
	var results = primary.concat(secondary).concat(tertiary);
	if(sortField) {
		results.sort(function(a, b) {
			return a[sortField] < b[sortField] ? -1 : (a[sortField] == b[sortField] ? 0 : +1);
		});
	}
	return results;
};

} //# end of "install only once"
//}}}