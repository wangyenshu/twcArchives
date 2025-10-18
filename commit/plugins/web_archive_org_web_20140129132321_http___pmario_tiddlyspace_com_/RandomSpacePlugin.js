/***
|''Name''|RandomSpacePlugin|
|''Description''|To aid space discovery in TiddlySpace|
|''Requires''|TiddlySpaceConfig ImageMacroPlugin|
|''Version''|0.7.0|
!StyleSheet
.randomSpace {
	width: 20em;
	text-align: center;
}
.randomSpace .siteIcon, .randomSpace .label, .randomSpace .description  {
	text-align: center;
	display: block;
}
.randomSpace .description {
	border: solid 1px black;
}

.randomSpace .anotherLink {
}

***/
//{{{
(function($) {
var tiddler = {title: "RandomSpacePlugin"};
var name = "StyleSheetRandomSpace";
config.shadowTiddlers[name] = store.getTiddlerText(tiddler.title +
     "##StyleSheet");
store.addNotification(name, refreshStyles);
	
var tweb = config.extensions.tiddlyweb;
var tiddlyspace = config.extensions.tiddlyspace;
var imageMacro = config.macros.image;

var macro = config.macros.RandomSpace = {
	_cache: [],
	_cacheSiteInfo: {},
	handler: function(place, macroName, params) { 
		var options = {
			limit: params[0] || 1
		};
		macro.renderRandomSpace(place, options);
	},

	chooseSpaceAndRender: function(place, options) {
		$(place).empty();
		var tiddlers = macro._cache;
		var i = macro.randomIndex(tiddlers);
		var tiddler = tiddlers[i];
		var bag = tiddler.bag;
		macro.renderSiteInfo(place, bag, options);
	},
	renderRandomSpace: function(place, options) {
		var container = $("<div />").addClass("randomSpace").text("please wait... ").appendTo(place)[0];
		var limit = options.limit;
		if(macro._cache.length > 0) {
			macro.chooseSpaceAndRender(container, options);
		} else {
			ajaxReq({
				dataType: "json",
				beforeSend: function(xhr) {
					xhr.setRequestHeader("X-ControlView", "false");
				},
				url:"/search?q=title:SiteInfo",
				success: function(tiddlers) {
					var cache = [];
					for(var i=0; i < tiddlers.length; i++) {
						var tiddler = tiddlers[i];
						if(tiddler.bag.indexOf("_private") == -1) {
							cache.push(tiddler);
						}
					}
					macro._cache = cache;
					macro.chooseSpaceAndRender(container, options);
				},
				error: function() {
					$(container).empty();
				}
			});
		}
	},
	renderSiteInfo: function(place, bag, options) {
		var container = $("<div class='space' />").appendTo(place);
		var space = bag.replace("_public", "");
		tweb.getStatus(function(status) {
			var host = status.server_host;
			var avatar =  tiddlyspace.getAvatar(host, { name: space });
			var image = $("<div class='siteIcon' />").appendTo(container);
			imageMacro.renderImage(image, avatar, { width:48, height: 48 });
			var url = tiddlyspace.getHost(host, space);
			$("<a />").addClass("label").attr("href", url).text(space).appendTo(container);
			var info = $('<div class="description" />').text("loading info... ").appendTo(container);
			if(macro._cacheSiteInfo[bag]) {
				var tiddler = macro._cacheSiteInfo[bag];
				info.empty();
				wikify(tiddler.text, info[0]);
			} else {
				ajaxReq({
					url: "/bags/%0/tiddlers/SiteInfo".format([bag]),
					dataType: "json",
					beforeSend: function(xhr) {
						xhr.setRequestHeader("X-ControlView", "false");
					},
					success: function(tiddler) {
						info.empty();
						macro._cacheSiteInfo[bag] = tiddler;
						wikify(tiddler.text, info[0]);
					}
				});
			}
			$("<a />").addClass("anotherLink").attr("href", "javascript:;").text("click for another").click(function(ev) {
					$(place).empty();
					macro.renderRandomSpace(place, options);
				}).appendTo(container);
		});
	},
	randomIndex: function(list) {
		return Math.round((list.length - 1) * Math.random());
	}
}
})(jQuery);
//}}}