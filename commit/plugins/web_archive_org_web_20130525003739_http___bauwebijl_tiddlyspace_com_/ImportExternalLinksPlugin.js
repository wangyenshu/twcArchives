/***
|''Name''|ImportExternalLinksPlugin|
|''Author''|Jon Robson|
|''Version''|0.1.3dev|
|''Requires''|TiddlySpaceConfig TiddlySpaceLinkPlugin|
|''Description''|Turns space links into ajax links so you don't have to leave the comfort of your own TiddlyWiki|
!Notes
this hides the editTiddler, cloneTiddler commands and the followTiddlers macro.
!Todo
It show also add a reply link
***/
//{{{
(function($){
var tiddlyspace = config.extensions.tiddlyspace;
_createSpaceLink = createSpaceLink;
if(_createSpaceLink) {
	createSpaceLink = function(place, spaceName, title, alt) {
		_createSpaceLink(place, spaceName, title, alt);
		if(title && spaceName != tiddlyspace.currentSpace.name) {
			$("a:last", place).click(function(ev) {
				tiddlyspace.displayServerTiddler(ev.target, title, "%0_public".format([spaceName]), function(el) {
					// TODO: the commands should disable themselves based on the meta information.
					$("[commandname=editTiddler], [commandname=cloneTiddler]", el).hide(); 
				});
				ev.preventDefault();
			})
		}
	};
}
})(jQuery);
//}}}