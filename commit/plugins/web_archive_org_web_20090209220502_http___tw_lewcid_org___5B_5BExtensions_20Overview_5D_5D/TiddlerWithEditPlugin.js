/***

|Name|TiddlerWithEditPlugin|
|Created by|SaqImtiaz|
|Location|http://tw.lewcid.org/#TiddlerWithEditPlugin|
|Version|0.2|
|Requires|~TW2.x|
!Description:
Adds 'doubleclick to edit source' capabilites to the core {{{<<tiddler>>}}} macro.

!Notes:
*because of the rewrite, only clicking on actual embedded text opens the source tiddler for editing. Clicking on any white space opens the containing tiddler for editing.

!History
*29-04-06, version 0.2, rewritten after input from Udo.
*28-04-06, version 0.1, working.

!Code
***/
//{{{
config.macros.tiddler.onTiddlerMacroDblClick = function(e){
        if (!e) var e = window.event;
        var theTarget = resolveTarget(e);
        var title= this.getAttribute("source");
        if ((version.extensions.PartTiddlerPlugin)&&(title.indexOf("/")!=-1))
                 {if (!oldFetchTiddler.call(this, [title]))
                              {title=title.slice(0,title.lastIndexOf("/"))}}   
        story.displayTiddler(theTarget,title,2,false,null)
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
        return false;
        }

var oldTiddlerHandler=config.macros.tiddler.handler;
config.macros.tiddler.handler = function(place,macroName,params){
        oldTiddlerHandler.apply(this,arguments);
        place.lastChild.setAttribute("source",params[0]);
        place.lastChild.ondblclick = this.onTiddlerMacroDblClick;
}
//}}}