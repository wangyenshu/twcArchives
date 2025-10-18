/***
|''Name''|MySpacesPlugin|
|''Author''|Jon Robson|
|''Version''|0.2.4|
|''Requires''|ImageMacroPlugin|
|''Description''|An attempt to make it easier to organise your spaces|
|''License''|[[BSD|http://www.opensource.org/licenses/bsd-license.php]]|
!Code
***/
//{{{

(function($) {

var macro = config.macros.MySpaces = {
	spaces: {},
	handler: function(place) {
		place = $("<div class='spacePlace' />").appendTo(place);
		$("<div />").text("Filter spaces by tag:").appendTo(place);
		var filterer = $("<div class='filterArea' />").appendTo(place);
		var container = $("<div />").appendTo(place);
		$("<a />").text("reset").click(function(ev) {
			ev.preventDefault();
			$("a", ".filterArea").removeClass("active");
			macro.activeTags = [];
			macro.hideWithoutActiveTag(place);
		}).appendTo(container);
		
		var showSiteInfo = function(ev) {
			var target = ev.target;
			ev.preventDefault();
			ev.stopPropagation();
			var popup = Popup.create(target,"div");
			var icon = $(target).parents().filter(".icon");
			var spaceName = icon.attr("name");
			var space = macro.spaces[spaceName];
			//console.log(spaceName, space, macro.spaces);
			var content = $("<div class='spaceInfo' />")[0];
			if(space && space.tiddler) {
				wikify(space.tiddler.text, content);
		  } else {
				$(content).text("No SiteInfo tiddler for this site.");
			}
			$(popup).append(content);

			Popup.show();
			return false;
		};
		
		var spacePlace = $("<div class='myspaces' />").appendTo(place)[0];
		$("<div />").addClass("myspaceclear").appendTo(spacePlace);
		ajaxReq({url:"/spaces?mine=1", dataType:"json", success: function(r) {
			var bags = [];
			r = r.sort(function(a, b) {
				return a.name < b.name ? 1 : -1;
			});

			for(var i=0; i < r.length; i++) {
				var space = r[i];
				var name = space.name;
				var container = $("<div class='space'/>").attr("name", name).
					prependTo(spacePlace)
				var imageContainer = $("<div class='icon' />").attr("name", name).
  				click(function(ev) {
  					showSiteInfo(ev);
  				}).appendTo(container);
				var publicBag = "%0_public".format([name]);
				bags.push(publicBag);
				var imageURI = "http://tiddlyspace.gir.dk/bags/%0/tiddlers/SiteIcon".format([publicBag]);
				config.macros.image.renderImage(imageContainer, imageURI, {width:48, height:48});
				macro.spaces[name] = space;
				$("<a class='label' />").attr("href",space.uri).text(name).appendTo(container);
			}
			macro.findSiteInfo(place, bags);
		 }});
		
	},
	findSiteInfo: function(place, bags) {
		$.ajax({
			beforeSend: function(xhr) {
				xhr.setRequestHeader("X-ControlView", "false");
			},
			dataType: "json",
			url: '/search?q=ftitle:SiteInfo (bag:%0) &fat=y'.format([bags.join(" OR bag:")]),
			success: function(tiddlers) {
				var tags = [];
				for(var i=0; i < tiddlers.length; i++) {
					var tiddler = tiddlers[i];
					tiddler.fields.doNotSave = "true";
					var space = tiddler.bag.replace("_public", "");
					tiddler.title = "SiteInfo [%0]".format([space]);
					var tiddlerTags = tiddler.tags;
					for(var j=0; j < tiddlerTags.length; j++) {
						tags.pushUnique(tiddlerTags[j]);
					}
					if(macro.spaces[space]) {
						macro.spaces[space].tiddler = tiddler;
					}
				}
				tags = tags.sort();
				var filterer = $(".filterArea", place);
				for(var i=0; i < tags.length; i++) {
					$('<a href="#" />').text(tags[i]).click(function(ev) {
						ev.preventDefault();
						var target = $(ev.target);
						var tag = target.text();
						if(target.hasClass("active")) {
							target.removeClass("active");
							var oldTags = macro.activeTags;
							var newTags = [];
							for(var i=0; i < oldTags.length; i++) {
								var activeTag = oldTags[i];
								if(activeTag != tag) {
									newTags.push(activeTag);
								}
							}
							macro.activeTags = newTags;
						} else {
							target.addClass("active");
							macro.activeTags.push(tag);
						}
						macro.hideWithoutActiveTag(place);
					}).appendTo(filterer);
				}
				
			}
		})
	},
	activeTags: [],
	hideWithoutActiveTag: function(place) {
		$(".space", place).show(); // reset a previous search
		var activeTags = macro.activeTags;
		$(".space", place).each(function(i, el) {
			var name = $(el).attr("name");
			var space = macro.spaces[name];
			if(space) {
				if(space.tiddler) {
					var tags = space.tiddler.tags;
					for(var i=0; i < activeTags.length; i++) {
						var activeTag = activeTags[i];
						if(!tags.contains(activeTag)) {
							$(el).hide();
						}
					}
				} else if(activeTags.length > 0) {
					$(el).hide();
				}
			} 
		});
	}
};
	
var css = [".myspaces .space {\nfloat: left;}", ".space .label {text-align: center;}", 
	".filterArea {word-wrap:break-word;}",
	".myspaceclear { clear: both }",
	".filterArea a {margin-right: 5px;}",
	".icon {width: 6em; height:48px; text-align:center;}",
	".filterArea .active {background-color: [[ColorPalette::PrimaryPale]]; color: [[ColorPalette::PrimaryDark]];}",
	".myspaces .space {", "height:6em;margin:0.4em;text-align:center;width:6em;word-wrap:break-word;","}"];
config.shadowTiddlers.StyleSheetMySpaces = css.join("");
store.addNotification("StyleSheetMySpaces", refreshStyles);

})(jQuery);
//}}}