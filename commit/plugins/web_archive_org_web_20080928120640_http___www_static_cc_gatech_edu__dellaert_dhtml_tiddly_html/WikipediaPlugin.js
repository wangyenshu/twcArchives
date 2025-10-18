/***
|Name|WikipediaPlugin|
|Created by|[[Frank Dellaert|http://www.cc.gatech.edu/~dellaert]]|
|Location|http://www.cc.gatech.edu/~dellaert/#WikipediaPlugin|
|Version|1.0.1|
!!!Description
A TiddlyWikiMacro to easily create a link to a [[Wikipedia|http://en.wikipedia.org]] entry.
!!!Example
{{{<<wikipedia Bibtex>>}}}
<<wikipedia Bibtex>>
!!!Installation
Import (or copy/paste) this tiddler into your document: and tag it with "systemConfig"
!!!Code
***/
//{{{
config.macros.wikipedia = {};
config.macros.wikipedia.handler= function(place,macroName,params) {
   var key=params[0];
   wikify("[["+key+"|http://en.wikipedia.org/wiki/"+key+"]]",place)
}
//}}}
