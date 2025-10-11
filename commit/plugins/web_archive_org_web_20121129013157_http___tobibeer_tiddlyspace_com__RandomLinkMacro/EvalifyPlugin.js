/***
|''Name''|EvalifyPlugin|
|''Description''|a simple macro to wikify evaled output|
|''Version''|1.0|
|''Type''|macro|
|''Author''|[[TobiasBeer]]|
|''Source''|http://evalify.tiddlyspace.com|
|''Documentation''|http://tobibeer.tiddlyspace.com/#Evalify|
|''License''|[[Creative Commons Attribution-Share Alike 3.0|http://creativecommons.org/licenses/by-sa/3.0/]]|
***/
//{{{
config.macros.evalify={handler:function(place,macroName,params,wikifier,paramString,tiddler){
  var out=eval(params.shift());
  var el=params.shift();
  if(el)el=document.getElementById(el);
  el=el?el:place;
  if(out)wikify(out,el);
}}
//}}}