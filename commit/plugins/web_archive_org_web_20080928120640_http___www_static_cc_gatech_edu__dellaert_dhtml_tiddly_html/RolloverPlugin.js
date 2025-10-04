/***
|Name|RolloverPlugin|
|Created by|[[Frank Dellaert|http://www.cc.gatech.edu/~dellaert]]|
|Location|http://www.cc.gatech.edu/~dellaert/#RolloverPlugin|
|Version|1.0|
!!!Description
A TiddlyWikiMacro that inserts an image with a rollover backup image. It takes three mandatory arguments:
* a ''unique'' name to identify the img tag. If not unique, none of the rollover macros will work.
* the default image
* the secondary image
and two optional arguments:
* the url the image points to when clicked. If not given, the second image will be the target.
* optional arguments passed to the image tag
!!!Example
Using less than three arguments does nothing:
{{{<<rollover a b>>}}}
<<rollover a b>>
Exactly three arguments links to the second image:
{{{<<rollover three http://www.cc.gatech.edu/~dellaert/4d-cities/images/Atlanta/4D-strip.jpg http://www.cc.gatech.edu/~dellaert/4d-cities/../images/Atlanta/4D-strip-big.jpg>>}}}
<<rollover three http://www.cc.gatech.edu/~dellaert/4d-cities/images/Atlanta/4D-strip.jpg http://www.cc.gatech.edu/~dellaert/4d-cities/images/Atlanta/4D-strip-big.jpg>>
The two optional arguments:
{{{<<rollover four http://www.cc.gatech.edu/~dellaert/4d-cities/images/Atlanta/4D-strip.jpg http://www.cc.gatech.edu/~dellaert/4d-cities/../images/Atlanta/4D-strip-big.jpg http://4d-cities.cc.gatech.edu "align=right">>}}}
<<rollover four http://www.cc.gatech.edu/~dellaert/4d-cities/images/Atlanta/4D-strip.jpg http://www.cc.gatech.edu/~dellaert/4d-cities/images/Atlanta/4D-strip-big.jpg http://4d-cities.cc.gatech.edu "align=right">>

!!!Installation
Import (or copy/paste) this tiddler into your document: and tag it with "systemConfig"
!!!Code
***/
//{{{
config.macros.rollover = {};
config.macros.rollover.handler= function(place,macroName,params) {
   if (params.length<3) return;
   var name = params[0];
   var img1 = params[1];
   var img2 = params[2];
   var url = (params.length==3) ? img2 : params[3];
   var options = (params.length>=5) ? params[4] : "";
   wikify("<html><a target = '_blank' href='"+url+"' onmouseout=\"document."+name+".src='"+img1+"'\" onmouseover=\"document."+name+".src='"+img2+"'\"> <img "+options+" name='"+name+"' src="+img1+"></a></html>",place)
}
//}}}
