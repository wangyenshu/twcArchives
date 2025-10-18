/***

|Name|TiddlerWithEditPlugin|
|Created by|SaqImtiaz|
|Location|http://lewcid.googlepages.com/lewcid.html#TiddlerWithEditPlugin|
|Version|0.1|
|Requires|~TW2.x|
!Description:
Adds 'doubleclick to edit source' capabilites to the core {{{<<tiddler>>}}} macro.

!History
*28-04-06: version 0.1: working.

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

config.macros.tiddler.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
 params = paramString.parseParams("name",null,true,false,true);
 var names = params[0]["name"];
 var tiddlerName = names[0];
 var className = names[1] ? names[1] : null;
 var args = params[0]["with"];
 var wrapper = createTiddlyElement(place,"span",null,className);
 wrapper.ondblclick = this.onTiddlerMacroDblClick; 
 if(!args) {
  wrapper.setAttribute("refresh","content");
  wrapper.setAttribute("tiddler",tiddlerName);
 }
 var text = store.getTiddlerText(tiddlerName);
 if(text) {
  var stack = config.macros.tiddler.tiddlerStack;
  if(stack.indexOf(tiddlerName) !== -1)
   return;
  stack.push(tiddlerName);
  try {
   var n = args ? Math.min(args.length,9) : 0;
   for(var i=0; i<n; i++) {
    var placeholderRE = new RegExp("\\$" + (i + 1),"mg");
    text = text.replace(placeholderRE,args[i]);
   }
   config.macros.tiddler.renderText(wrapper,text,tiddlerName,params);
  } finally {
   stack.pop();
  }
 }
};

config.macros.tiddler.tiddlerStack = [];
//}}}