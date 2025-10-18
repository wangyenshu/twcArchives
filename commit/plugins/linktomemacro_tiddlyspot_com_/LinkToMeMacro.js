/***
|Author:|Simon Baird|
|URL:|http://linktomemacro.tiddlyspot.com/|
As suggested by Peter Lindsay on 17-Nov-2006. Example usage:
{{{<<linkToMe>>, <<linkToMe 'right click here to download'>>}}}
<<linkToMe>>, <<linkToMe 'right click here to download'>>
***/
//{{{
merge(config.macros,{
	linkToMe: { handler: function(place,macroName,params,wikifier,paramString,tiddler) {
		wikify('<html><a href="'+window.location.href+'">'+(params[0]?params[0]:window.location.href)+'</a></html>',place,null,tiddler);
	}}
});
//}}}