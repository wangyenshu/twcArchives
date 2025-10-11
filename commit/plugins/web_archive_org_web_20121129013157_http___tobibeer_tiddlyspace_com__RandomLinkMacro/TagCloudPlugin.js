/***
|''Name''|TiddlyTagCloudPlugin|
|''Author''|Jon Robson|
|''Version''|0.3.11|
!Usage
{{{ <<tagcloud>> }}} creates a tag cloud of all content.
!Parameters
exclude: name a tag you want to exclude from the tag cloud.
filter: provide a filter to run the tag cloud on a subset of tiddlers see SiteInfo@filters and [[filters syntax]]@docs
threshold:2 - will ignore any tags that occur less than 2 times.
sortOrder: <-,+,""> - sort the resulting tags in descending, ascending or no order
***/
//{{{
(function($) {
var stylesheet = "StyleSheetTagCloud";
config.shadowTiddlers[stylesheet] = ['.tagcloudTag { display: inline-block; border : none; margin-right: 8px; '].join("\n");
store.addNotification(stylesheet, refreshStyles);

var macro = config.macros.tagcloud = {
	locale: {
		tooltip: "see the %0 occurrences of %1"
	},
	cache: {},
	options: {
		fontSize: {
			small: 10,
			large: 48,
		},
		threshold: 1,
		sortOrder: "+"
	},
	_cleanup: function() {
		for(var i in macro.cache) {
			if($(i).length === 0) {
				delete macro.cache[i];
			}
		}
	},
	handler: function(place, macroName, params, wikifier, paramString, tiddler) {
		var id = "tagcloud"+Math.random();
		var container = $("<div />").attr("params", paramString).addClass("tagcloud").
				attr("id", id).appendTo(place)[0];
		macro.refresh(container);
	},
	refresh: function(container) {
		macro._cleanup();
		var tags, tag;
		var locale = macro.locale;
		var paramString = $(container).attr("params");
		var args = paramString.parseParams("anon")[0];
		var exclude = args.exclude || [];
		var tiddlers = args.filter ? store.filterTiddlers(args.filter[0]) : store.getTiddlers();
		var count = {};
		var lookup = {};
		var options = macro.options;
		var threshold = args.threshold ? parseInt(args.threshold[0], 10) : options.threshold;
		for(var i = 0; i < tiddlers.length; i++) {
			var tiddler = tiddlers[i];
			tags = tiddler.tags;
			for(var j = 0; j < tags.length; j++) {
				tag = tags[j];
				if(!exclude.contains(tag)) {
					lookup[tag] = lookup[tag] || [];
					lookup[tag].push(tiddler);
					if(!count[tag]) {
						count[tag] = 1;
					} else {
						count[tag] += 1;
					}
				}
			}
		}
		tags = [];
		var largest, smallest, c;
		for(var k in count) {
			tags.push(k);
			if(count[k] < threshold) {
				delete count[k];
			}
		}
		var sort = options.sortOrder;
		tags = tags.sort(function(i, j) {
			if(sort == "+") {
				return i < j ? -1 : 1;
			} else if(sort == "-") {
				return i < j ? 1 : -1;
			} else {
				return 0;
			}
		});
		for(var l in count) {
			if(true) {
				c = count[l];
				if(!largest) {
					largest = c;
				} else if(c > largest) {
					largest = c;
				}
				if(!smallest) {
					smallest = c;
				} else if(c < smallest) {
					smallest = c;
				}
			}
		}
		var id = $(container).attr("id");
		macro.cache[id] = lookup;
		for(var l = 0; l < tags.length; l++) {
			var tag = tags[l];
			if(true) {
				c = count[tag];
				if(c) {
					var size = macro.determineFontSize({ largest: largest, smallest:smallest, occurrences: c });
					var btn = createTagButton(container,"[_tagcloud[%0-:-%1]]".format(id, tag),
						null,tag,locale.tooltip.format(c, tag));
					$(btn).addClass("tagcloudTag").attr("tag", tag).css({ "font-size": size + "px" }).
						addClass("button size%0".format(size)).click(function(ev) {
							var tag = $(ev.target).attr("tag");
							window.setTimeout(function() {
								var items = $(".popup li a");
								var lastLink = items[items.length - 1];
								$(lastLink).text("Open tag " + tag).attr("tiddlylink", tag);
							}, 10);
						});
						// the last line is rather hacky but gets the required result of making it possible to open the tag
				}
			}
		}
	},
	determineFontSize: function(args) {
		var options = macro.options;
		var deltaFontSize = options.fontSize.large - options.fontSize.small;
		var delta = args.occurrences / (args.largest - args.smallest + 1);
		return options.fontSize.small + parseInt(delta * deltaFontSize, 10);
	}
};

config.filters._tagcloud = function(results, match) {
 var args = match[3] ? match[3].split("-:-") : false;
	if(args) {
		var id = args[0];
		var lookup = macro.cache[id] || {};
		var tag = args[1];
		var tiddlers = lookup[tag] || [];
		return tiddlers;
	} else {
		return [];
	}
};

})(jQuery);
//}}}
