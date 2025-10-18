/***
|Name|OpenTiddlersMacro|
|Created by|SaqImtiaz|
|Location|http://tw.lewcid.org/#OpenTiddlersMacro|
|Version|0.2 |
|Requires|~TW2.08+|
!Description:
*Allows creation of tiddlyLinks that open multiple tiddlers.
*Also useful for creating links to shadowTiddlers, which if normally created are not in bold.

!Usage
{{{<<openTiddlers text:"TextForLink" tiddlers:"Tiddler1 Tiddler2 [[Tiddler with spaces]] Tiddler4">>}}}

!Example:
{{{<<openTiddlers text:"This link opens multiple tiddlers" tiddlers:"Project Saq">>}}}
<<openTiddlers text:"This link opens multiple tiddlers" tiddlers:"Project Saq">>

!History
*30-04-06, version 0.2, modifed and rename following feedback from Eric.
*29-04-06, version 0.1, working.

!To Do:
*option to close other tiddlers
*option to open in edit template

!Code
***/
//{{{
window.onClickMultiLink= function(e){
                         story.displayTiddlers(this,this.getAttribute("tiddlerstring").readBracketedList());
                         return(false);
}

config.macros.openTiddlers={};
config.macros.openTiddlers.handler = function(place,macroName,params,wikifier,paramString,tiddler){
                           var nAV = paramString.parseParams('test', null, true);
                           var text = nAV[0].text[0];
                           var tiddlerstring = nAV[0].tiddlers[0];
                           var btn= createTiddlyButton(place,text,null,onClickMultiLink,"tiddlyLinkExisting");
                           btn.setAttribute("tiddlerstring",tiddlerstring);
}
//}}}