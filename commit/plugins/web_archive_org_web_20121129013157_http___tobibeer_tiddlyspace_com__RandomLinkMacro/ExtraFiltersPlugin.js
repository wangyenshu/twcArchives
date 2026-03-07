/*!**
|''Name''|ExtraFilters|
|''Author''|Jon Robson|
|''Version''|0.6.8|
|''Status''|@@experimental@@|
|''Requires''|TiddlySpaceFilters ImageMacroPlugin|
|''CodeRepository''|<...>|
|''License''|[[BSD|http://www.opensource.org/licenses/bsd-license.php]]|
!Notes
* Updates shadow tiddlers to known TiddlySpace shadow tiddlers
* adds the following filters 
{{{
[is[tiddler]] - allows you to match all tiddlers - useful for applying the isnot filter (see later)
[is[image]] - returns only image tiddlers (e.g. png, jpeg, gif etc..)
[is[shadow]] - returns if the tiddler is a known shadow tiddler
[is[svg]] - returns only svg tiddlers
[is[tagged]] - returns tiddlers with tags
[isnot[image]] - filters result of previous filters for ones that are not images
[notag[<tag>]] - filters result of previous filters for ones without a tag
[nofield[<field>]] - check for absence of field or field value in previous filters
[has[<field or attribute>]] - match tiddlers which have a field or attribute set.
[and[<filter expression>]] - e.g.[and[tag:foo]] checks all tiddlers from previous filters for a tag foo.
[nobag[foo]] - removes any tiddlers previously returned by a previous filter that belong to the given bag
[is[open]]
[startsWith[title,Foo]] returns all tiddlers who's titles start with Foo.

}}}
***/
//{{{
(function($) {
var _display = Story.prototype.displayTiddler;
Story.prototype.displayTiddler = function() {
	var res =  _display.apply(this, arguments);
	$("[macroName=list]").each(function(i, el) {
		config.macros.list.refresh(el);
	});
	return res;
};
var _close = Story.prototype.closeTiddler;
Story.prototype.closeTiddler = function() {
	var res =  _close.apply(this, arguments);
	$("[macroName=list]").each(function(i, el) {
		config.macros.list.refresh(el);
	});
	return res;
};

config.shadowTiddlers.SiteIcon = "";
config.shadowTiddlers.SiteInfo = "";
config.shadowTiddlers.SystemSettings = "";
config.shadowTiddlers[config.extensions.tiddlyspace.currentSpace.name + "SetupFlag"] = "";

config.filterHelpers["is"].image = config.macros.image.isImageTiddler;
config.filterHelpers["is"].svg = config.macros.image.isSVGTiddler;
config.filterHelpers["is"].tiddler = function(tiddler) {
	return tiddler ? true : false;
}
config.filterHelpers["is"].open = function(tiddler) {
	return story.getTiddler(tiddler.title) ? true : false;
}
config.filterHelpers["is"].shadow = function(tiddler) {
	return tiddler && tiddler.title && tiddler.title in config.shadowTiddlers ? true : false;
}
config.filterHelpers["is"].tagged = function(tiddler) {
	return tiddler && tiddler.tags.length > 0 ? true : false;
};
config.filterHelpers["is"].external = function(tiddler) {
	var endsWith = config.extensions.BinaryTiddlersPlugin.endsWith;
	var fields = tiddler.fields;
	var bag = fields["server.bag"] || "";
	var local = config.filterHelpers["is"].local(tiddler);
	if(!local && endsWith(bag, "_public") || bag.indexOf("_") === -1) {
		return true;
	} else {
		return false;
	}
};

config.filterHelpers["is"].privateAndExternal = function(tiddler) {
	var endsWith = config.extensions.BinaryTiddlersPlugin.endsWith;
	var fields = tiddler.fields;
	var bag = fields["server.bag"] || "";
	return !config.filterHelpers["is"].local(tiddler) && endsWith(bag, "_private");
};

config.filters.isnot = function(candidates, match) {
	var type = match[3];
	var results = [];
	for (var i = 0; i < candidates.length; i++) {
		var tiddler = candidates[i];
		var helper = config.filterHelpers.is[type];
		if(helper && !helper(tiddler)) {
			results.pushUnique(tiddler);
		}
	}
	return results;
};

config.filters.nobag = function(results, match) {
	var bag = match[3];
	var newResults = [];
  for(var i = 0; i < results.length; i++) {
    var tiddler = results[i];
    if(tiddler.fields["server.bag"] !== bag) {
      newResults.push(tiddler);
    }
  }
  return newResults;
};

config.filters.linksTo = function(results, match) {
	var name = match[3];
	results = this.getTiddlers();
  var newResults = [];
  for(var i = 0; i < results.length; i++) {
    var tiddler = results[i];
    var links = tiddler.getLinks("title", "excludeLists");
    if(links.contains(name)) {
      newResults.push(tiddler);
    }
  }
  return newResults;
};

config.filters.notag = function(results, match) {
  var tag = match[3];
  var newResults = [];
  for(var i = 0; i < results.length; i++) {
    var tiddler = results[i];
    if(!tiddler.tags.contains(tag)) {
      newResults.push(tiddler);
    }
  }
  return newResults;
};
config.filters.nofield = function(results, match) {
  var fieldname = match[3];
  var newResults = [];
  for(var i = 0; i < results.length; i++) {
    var tiddler = results[i];
    if(!tiddler.fields[fieldname]) {
      newResults.push(tiddler);
    }
  }
  return newResults;
};

config.filters.and = function(results, match) {
	var args = match[3].split(":");
	var negationMode = false;
	var handler = args[0];
	if(handler.indexOf("!") === 0) {
		handler = handler.substr(1);
		negationMode = true;
	}
	var value = args[1];
	if(config.filters[handler]) {
		var titles = [];
		var matches = config.filters[handler].call(this, [], [null, null, handler, value]); // note some filters require second argument :(
		for(var i = 0; i < matches.length; i++) {
			titles.push(matches[i].title);
		}
		var newResults = [];
		for(var i = 0; i < results.length; i++) {
			var tid = results[i];
			if(!negationMode && titles.contains(tid.title)) {
				newResults.push(tid);
			} else if(negationMode && !titles.contains(tid.title)) {
				newResults.push(tid);
			}
		}
		return newResults;
	} else {
		return results;
	}
};

config.filters.has = function(results, match) {
	var field = match[3];
	var results = [];
	this.forEachTiddler(function(title, tid) {
		if(tid[field] || tid.fields[field]) {
			results.push(tid);
		}
	});
	return results;
};

config.filters.startsWith = function(results, match) {
	var args = match[3].split(",");
	var field, str;
	if(args.length === 1) {
		field = "title";
		str = args[0]
	} else {
		field = args[0];
		str = args[1];
	}
	var newResults = [];
	// use this to keep the current store context
	this.forEachTiddler(function(i, tid) {
		var val = this.getValue(tid, field);
		if(val && val.indexOf(str) === 0) {
			newResults.push(tid);
		}
	})
	return newResults;
}

var scanMacro = config.macros.tsScan;
config.filterHelpers.loadingTiddler = new Tiddler("Loading...");
config.filterHelpers.loadingTiddler.text = "loading...";
config.filterHelpers.loadingTiddler.fields["msg.loading"] = "loading...";
config.filterHelpers.url = {};
config.filters.url = function(results, match) {
	var url = match[3];
	var tiddlers = config.filterHelpers.url[url];
	if(tiddlers) {
		return tiddlers;
	} else if(!status) {
		config.filterHelpers.url[url] = [ config.filterHelpers.loadingTiddler ];
		$.ajax({type:"get", url: url, dataType: "json", success: function(jstiddlers) {
			var tiddlers = scanMacro._tiddlerfy(jstiddlers, {});
			config.filterHelpers.url[url] = tiddlers;
			refreshDisplay();
		}, error: function() {
			displayMessage("unable to connect to %0".format(url));
		}
		});
	}
	return config.filterHelpers.url[url];
};

}(jQuery));
//}}}
