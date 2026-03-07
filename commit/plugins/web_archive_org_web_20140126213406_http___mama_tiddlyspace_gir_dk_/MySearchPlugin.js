/***
|''Name''|MySearchPlugin|
|''Description''|displays search results as a simple list of matching tiddlers. Allows you to define a filter to limit search results to a certain subset.|
|''Authors''|FND, Jon Robson|
|''Version''|0.3.0|
!Code
***/
if(typeof(config.options.txtSearchFilter) === 'undefined') {
	config.options.txtSearchFilter = "[is[local]]";
}
config.optionsDesc.txtSearchFilter = "Provide a filter to be run on any search query";

//{{{
if(!config.extensions) { config.extensions = {}; }

config.extensions.SimpleSearchPlugin = {
	heading: "Søgeresultater",
	containerId: "searchResults",
	btnCloseLabel: "luk",
	btnCloseTooltip: "ignorér søgeresultater",
	btnCloseId: "search_close",
	btnOpenLabel: "åbn alle",
	btnOpenTooltip: "åbn alle søgeresultater",
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
	var candidates = store.filterTiddlers(config.options.txtSearchFilter);
	var primary = [];
	var secondary = [];
	var tertiary = [];
	var quaternary = [];
	for(var t = 0; t < candidates.length; t++) {
		var tiddler = candidates[t];
		if(tiddler.title.search(searchRegExp) != -1) {
			primary.push(tiddler);
		} else if(tiddler.tags.join(" ").search(searchRegExp) != -1) {
			secondary.push(tiddler);
		} else if(tiddler.text.search(searchRegExp) != -1) {
			tertiary.push(tiddler);
		} else {
			for(var j in tiddler.fields) {
				if(tiddler.fields[j] && typeof(tiddler.fields[j]) === 'string' && tiddler.fields[j].search(searchRegExp) != -1) {
					quaternary.push(tiddler);
					break;
				}
			}
		}
	}
	var results = primary.concat(secondary).concat(tertiary).concat(quaternary);
	if(sortField) {
		results.sort(function(a, b) {
			return a[sortField] < b[sortField] ? -1 : (a[sortField] == b[sortField] ? 0 : +1);
		});
	}
	return results;
};
//}}}