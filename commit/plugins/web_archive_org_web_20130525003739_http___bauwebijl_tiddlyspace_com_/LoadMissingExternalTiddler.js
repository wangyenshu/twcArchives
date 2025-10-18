/***
|''Name''|LoadMissingExternalTiddler|
|''Version''|0.1.0|
|''Author''|Jon Robson|
***/
//{{{
var _loadMissing = Story.prototype.loadMissingTiddler;
Story.prototype.loadMissingTiddler = function(title,fields,callback) {
	var matches = title.match(/([^\*]*) \*\(@([^\)]*)\)\*/);
	if(matches && matches.length > 0) {
		var sTitle = matches[1];
		var space = matches[2];		config.extensions.tiddlyspace.displayServerTiddler(story.getTiddler(title),
			sTitle, "bags/%0_public".format(space));
	} else {
	_loadMissing.apply(this, arguments)
	}
};
//}}}
