/***
|''Name:''|DeliciousTaggingPlugin|
|''Version:''|0.1|
|''Source''|http://jackparke.googlepages.com/jtw.html#DeliciousTaggingPlugin ([[del.icio.us|http://del.icio.us/post?url=http://jackparke.googlepages.com/jtw.html%DeliciousTaggingPlugin]])|
|''Author:''|[[Jack]]|
!Description
Allows easy 'del.icio.us'-like tagging in the EditTemplate by showing all tags as a list of link-buttons.
!Usage
Replace your the editorFooter div in your [[EditTemplate]] with the following:
{{{
<div class='editorFooter' macro='deliciousTagging'></div>
}}}
!Code
***/
//{{{
version.extensions.deliciousTagging = {major: 0, minor: 1, revision: 0, date: new Date("June 11, 2007")};

config.macros.deliciousTagging= {};

config.macros.deliciousTagging.onTagClick = function(e)
{
 if(!e) var e = window.event;
 var tag = this.getAttribute("tag");
 var title = this.getAttribute("tiddler");
 if(!readOnly)
  story.setTiddlerTag(title,tag,0);
 return false;
};

config.macros.deliciousTagging.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
 if(tiddler instanceof Tiddler) {
  var title = tiddler.title;
  if(!e) var e = window.event;
  var tags = store.getTags();
  var lingo = config.views.editor.tagChooser;
  for(var t=0; t<tags.length; t++) {
   var theTag = createTiddlyButton(place,tags[t][0],lingo.tagTooltip.format([tags[t][0]]),config.macros.deliciousTagging.onTagClick);
   theTag.setAttribute("tag",tags[t][0]);
   theTag.setAttribute("tiddler",tiddler.title);
   place.appendChild(document.createTextNode(" "));
  }
 }
};
//}}}