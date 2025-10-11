/***
|''Name''|GooglePlusButtonPlugin|
|''Version''|0.1.0|
|''Description''|"+1 a tiddler on Google+|
|''Status''|unstable|
|''Source''||
|''CoreVersion''|2.6.1|
|''Requires''|TiddlyWeb|
!Usage
Call the {{{<<plusone>>}}} macro without any parameters inside a tiddler
to generate a +1 button for that tiddler.

Ideally, add it to your ViewTemplate, or PageTemplate somewhere.
!Code
***/
//{{{
(function($) {
var gp = config.macros.plusone = {};

var gTag = '<g:plusone annotation="inline" href="%0"></g:plusone>';

var generateScript = function() {
	var po = document.createElement('script');
	po.id = 'googleplusscript';
	po.type = 'text/javascript'; po.async = true;
	po.src = 'https://apis.google.com/js/plusone.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(po, s);
};

gp.handler = function(place, macroName, params) {
	var tid = story.findContainingTiddler(place);
	var title = (params[0] === 'space') ? '' : $(tid).attr('tiddler') || '';
	var url = "%0/%1".format(config.defaultCustomFields["server.host"],
		encodeURIComponent(title));

	console.log(gTag.format(url));

	$(place).append(gTag.format(url));
	generateScript();
};
})(jQuery);
//}}}
