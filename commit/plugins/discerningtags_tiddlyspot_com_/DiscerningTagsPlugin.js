/***
| Name:|DiscerningTagsPlugin|
| Description:|Make the tag chooser ignore tags that are themselves tagged with 'excludeLists'|
| Version:|1.0|
| Date:|02-Nov-2006|
| Source:|http://discerningtags.tiddlyspot.com/|
| Author:|Daniel Baird <danielbaird@gmail.com>|
| CoreVersion:|2.1.x|
For instructions on how to install plugins, see here:
http://twfaq.tiddlyspot.com/#%5B%5BHow%20do%20I%20install%20a%20plugin%3F%5D%5D
***/
//{{{
config.macros.tagChooser.onClick = function(e) {
	if(!e) var e = window.event;
	var lingo = config.views.editor.tagChooser;
	var popup = Popup.create(this);
	var tags = store.getTags();
	if(tags.length == 0)
		createTiddlyText(createTiddlyElement(popup,"li"),lingo.popupNone);
	for(var t=0; t<tags.length; t++)
		{
		var tagTiddler = store.getTiddler(tags[t][0]);
		if (!(tagTiddler && tagTiddler.isTagged('excludeLists')))
			{
			var theTag = createTiddlyButton(createTiddlyElement(popup,"li"),tags[t][0],lingo.tagTooltip.format([tags[t][0]]),config.macros.tagChooser.onTagClick);
			theTag.setAttribute("tag",tags[t][0]);
			theTag.setAttribute("tiddler", this.getAttribute("tiddler"));
			}
		}
	Popup.show(popup,false);
	e.cancelBubble = true;
	if(e.stopPropagation) e.stopPropagation();
	return(false);
}
//}}}