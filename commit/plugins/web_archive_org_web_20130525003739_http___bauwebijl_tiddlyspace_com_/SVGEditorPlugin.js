/***
|Name|SVGEditorPlugin|
|Description|Provides gui editing for svg files using svg-edit|
|Version|0.1.4|
***/
//{{{
(function($){

var _saveTiddler = TiddlyWiki.prototype.saveTiddler;
TiddlyWiki.prototype.saveTiddler = function(title, newTitle, newBody, modifier,
		modified, tags, fields, clearChangeCount, created, creator) {
	var el = $(story.findContainingTiddler(story.getTiddler(title)));
	var iframe = fields && fields._iframe ? document.getElementById(fields._iframe) : $("iframe", el)[0];
	if(iframe) {
		newBody = config.macros.svgedit.save(iframe);
	}
	return _saveTiddler.apply(this, [title, newTitle, newBody, modifier,
		modified, tags, fields, clearChangeCount, created, creator]);
};
var _edit = config.macros.edit.handler;
config.macros.edit.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
	var field = params[0];
	var isSVGTiddler = tiddler && tiddler.fields["server.content-type"] && tiddler.fields["server.content-type"] == "image/svg+xml";
	var ctx = this;
	if(field == "text") {
		window.setTimeout(function() {
			var el = story.findContainingTiddler(place);
			isSVGTiddler = isSVGTiddler || $("[edit='server.content-type']", el).length > 0;
			if(isSVGTiddler) {
				config.macros.svgedit.render(place, tiddler);
			} else {
				_edit(place,macroName,params,wikifier,paramString,tiddler);
			}
		},  10);
	} else {
		_edit.apply(this, arguments);
	}
}
var macro = config.macros.svgedit = {
	handler: function(place, macroName, params, wikifier, paramString, tiddler){
		macro.render(place);
	},
	save: function(iframe) {
		var frameId = $(iframe).attr("id");
		var el = story.findContainingTiddler(iframe);
		var frame = window[frameId] || window.frames[frameId];
                var source = frame.svgCanvas.getSvgString();
		$("[edit=text]", el).val(source);
		return source;
	},
	id: function() {
		var last = this._id;
		last = last ? last + 1 : 1;
		this._id = last;
		return last;
	},
	render: function(place, tiddler) {
		var frameId = macro.id();
		var iframe = document.createElement("iframe");
		var src = "svg-editor";
		if(tiddler) {
		 src = "svg-editor?resource=/bags/%0/tiddlers/%1".format([tiddler.fields["server.bag"], tiddler.title]);
		}
		iframe.src = src;
		var width = $(place).width() || 750;
		var height = 400;
		iframe.setAttribute("width", width);
		iframe.setAttribute("height", height);
		iframe.setAttribute("edit-type", "svg-editing");
		var id = "svgeditor-%0".format([frameId]);
		iframe.setAttribute("id", id);
		iframe.setAttribute("name", id);
		$(place).append(iframe);
		if(!tiddler) {
			macro.saveAsButton(place, id);
		} else {
			$("<input />").attr("type", "hidden").attr("edit", "_iframe").val(id).appendTo(place);
			$("<input />").attr("type", "hidden").attr("edit", "text").appendTo(place);
			$("<input />").attr("type", "hidden").attr("edit", "server.content-type").val("image/svg+xml").appendTo(place);
		}
	},
	saveAsButton: function(place, frameId) {
		$("<button />").text("save as").click(function(e){
			var title = prompt("Please enter a name to save this tiddler as");
			if(title) {
				var newTiddler = new Tiddler(title);
				newTiddler.text = window.frames[frameId].svgCanvas.getSvgString();
				newTiddler.fields = {};
				merge(newTiddler.fields, config.defaultCustomFields);
				newTiddler.fields["server.content-type"] = "image/svg+xml";
				newTiddler = store.saveTiddler(newTiddler);
				autoSaveChanges(null, [newTiddler]);
			}
		}).appendTo(place);
	}
}
})(jQuery);
//}}}