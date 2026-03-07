//{{{

// Event handler for clicking on a tiddler tag
function window.onClickTag(e)
{
 if (!e) var e = window.event;
 var theTarget = resolveTarget(e);
 var popup = Popup.create(this);
 var tag = this.getAttribute("tag");
 var title = this.getAttribute("tiddler");
 if(popup && tag)
 {
 var tagged = store.getTaggedTiddlers(tag);
 var titles = [];
 var li,r;
 for(r=0;r<tagged.length;r++)
 if(tagged[r].title != title)
 titles.push(tagged[r].title);
 var lingo = config.views.wikified.tag;
 if(titles.length > 0)
 {
 var openAll = createTiddlyButton(createTiddlyElement(popup,"li"),lingo.openAllText.format([tag]),lingo.openAllTooltip,onClickTagOpenAll);
 openAll.setAttribute("tag",tag);
 createTiddlyElement(createTiddlyElement(popup,"li",null,"listBreak"),"div");
 for(r=0; r<titles.length; r++)
 {
 createTiddlyLink(createTiddlyElement(popup,"li"),titles[r],true);
 }
 }
 else
 createTiddlyText(createTiddlyElement(popup,"li",null,"disabled"),lingo.popupNone.format([tag]));
 createTiddlyElement(createTiddlyElement(popup,"li",null,"listBreak"),"div");
 var h = createTiddlyLink(createTiddlyElement(popup,"li"),tag,false);
 createTiddlyText(h,lingo.openTag.format([tag]));
 }
 Popup.show(popup,false);
 e.cancelBubble = true;
 if (e.stopPropagation) e.stopPropagation();
 return(false);
}
//}}}

/***
A small re-write of the tags and tagging macros

!Usage
{{{<<tags>>}}}

!Code
***/
//{{{
config.macros.tags.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
 var pParams = paramString.parseParams("anon",null,true,false,true);
 var separator = getParam(pParams,"separator"," ");
 var title = getParam(pParams,"anon",null);

 if(title && store.tiddlerExists(title))
 tiddler = store.getTiddler(title);

 var lingo = config.views.wikified.tag;
 var prompt = tiddler.tags.length == 0 ? lingo.labelNoTags : lingo.labelTags;

 var theList = createTiddlyElement(place,"ul");
 createTiddlyElement(theList,"li",null,"listTitle",prompt.format([tiddler.title]));
 for(var t=0; t<tiddler.tags.length; t++)
 {
 if (t > 0) theList.appendChild(document.createTextNode(separator));
 createTagButton(createTiddlyElement(theList,"li"),tiddler.tags[t],tiddler.title);
 }
}

config.macros.tagging.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
 var pParams = paramString.parseParams("anon",null,true,false,true);
 var separator = getParam(pParams,"separator"," ");
 var title = "";
 if(tiddler instanceof Tiddler)
 title = tiddler.title;
 title = getParam(pParams,"anon",title);

 var tagged = store.getTaggedTiddlers(title);
 var prompt = tagged.length == 0 ? this.labelNotTag : this.label;

 var theList = createTiddlyElement(place,"ul");
 theList.setAttribute("title",this.tooltip.format([title]));
 createTiddlyElement(theList,"li",null,"listTitle",prompt.format([title]));
 for(var t=0; t<tagged.length; t++)
 {
 if (t > 0) theList.appendChild(document.createTextNode(separator));
 createTiddlyLink(createTiddlyElement(theList,"li"),tagged[t].title,true);
 }
};
//}}}