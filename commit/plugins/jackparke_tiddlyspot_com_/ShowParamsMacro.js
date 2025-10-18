/***
|''Name:''|ShowParamsMacro|
|''Version:''|0.1|
|''Author:''|[[Jack]]|
|''Type:''|Macro|
!Description
Simply lists the parameters it is given. Used for testing named params.
!Usage
{{{<<showParams parameter1:"value1" parameter2:value2 anon>>}}}
<<showParams parameter1:"value1" parameter2:value2 anon>>
!Code
***/
//{{{
config.macros.showParams = {}
config.macros.showParams.handler=function(place,macroName,params,wikifier,paramString,tiddler) {
 var p = paramString.parseParams(null,null,true);
 var temp='|!Parameter|!Value|\n';
 for (var i=1; i<p.length; i++) {
 temp += '|' + p[i].name + '|' + (p[0][p[i].name]?p[0][p[i].name][0]:'') + '|\n'
 }
 wikify(temp, place)
}
//}}}