/***
| Name:|HideWhenPlugin|
| Description:|Allows conditional inclusion/exclusion in templates|
| Version:|6.9.3|
| Date:|30-Sep-2006|
| Source:|http://mptw.tiddlyspot.com/#HideWhenPlugin|
| Author:|Simon Baird <simon.baird@gmail.com>|
For use in ViewTemplate and EditTemplate. Eg
{{{<div macro="showWhen tiddler.tags.contains('Task')">[[TaskToolbar]]</div>}}}
{{{<div macro="showWhen tiddler.modifier == 'BartSimpson'"><img src="bart.gif"/></div>}}}
***/
//{{{
merge(config.macros,{

 hideWhen: { handler: function (place,macroName,params,wikifier,paramString,tiddler) {
 if (eval(paramString)) {
 removeChildren(place);
 place.parentNode.removeChild(place);
 }
 }},

 showWhen: { handler: function (place,macroName,params,wikifier,paramString,tiddler) {
 config.macros.hideWhen.handler(place,macroName,params,wikifier,'!('+paramString+')',tiddler);
 }}

});

//}}}

