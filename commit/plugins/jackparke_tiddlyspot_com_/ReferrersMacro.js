/***
|''Name:''|ReferrersMacro|
|''Version:''|2.0 (2-Mar-2006)|
|''Author:''|[[Jack]]|
|''Type:''|Macro|
!Description
Display a list of tiddlers linking to this plugin.
!Usage
{{{<<referrers>>}}}
!Revision History
* Original by [[Jack]] 2-Mar-2006
!To Do
* List non-explicit links (e.g. from tagging macro)

!Code
***/
//{{{
version.extensions.referrers = {major: 2, minor: 0, revision: 0, date: new Date("Mar 2, 2006")};

config.macros.referrers = {};
config.macros.referrers.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
 var tiddlers = store.getReferringTiddlers(tiddler.title);
 var theList = createTiddlyElement(place,"ul");
 for(var t=0; t<tiddlers.length; t++)
 if (!params[0] || tiddlers[t].tags.contains(params[0]))
 createTiddlyLink(createTiddlyElement(theList,"li"),tiddlers[t].title,true);
}
//}}}