/***
|''Name:''|Definition Macro|
|''Version:''|0.1|
|''Source''|http://jackparke.googlepages.com/jtw.html#DefinitionMacro ([[del.icio.us|http://del.icio.us/post?url=http://jackparke.googlepages.com/jtw.html%23DefinitionMacro]])|
|''Author:''|[[Jack]]|
|''Type:''|Macro|
!Description
Allow definitions of glossary terms to be easily visible via mouseover
!Usage
{{{<<def MyTermTiddler>>}}}
Do you know what <<def EDM>> is?
!Revision History
* Original by [[Jack]] 24 May 2006

!Code
***/
//{{{
version.extensions.def = {major: 0, minor: 1, revision: 0, date: new Date("May 24, 2006")};

config.macros.def = {};
config.macros.def.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
 var text = store.getTiddlerText(params[0]);
 var wrapper = createTiddlyButton(place,params[0],text?"":"No definition available.",onClickTiddlerLink,"definition")
 var e = createTiddlyElement(wrapper,"span",null,null,text)
 wrapper.setAttribute("tiddlyLink", params[0])
}
config.macros.def.editMe = function(e) {
 var title = this.getAttribute("tiddlyLink");
 clearMessage();
 story.displayTiddler(null,title,DEFAULT_VIEW_TEMPLATE);
 story.focusTiddler(title,"text");
}
setStylesheet("a.definition {position:relative; z-index:24;} a.definition:hover {z-index:25;} a.definition span{display:none;} a.definition:hover span{display:block; position:absolute; top:2em; left:2em; width:15em; border:1px solid #ffd; background-color:#ffd; color:#000; text-align: center}");

//}}}