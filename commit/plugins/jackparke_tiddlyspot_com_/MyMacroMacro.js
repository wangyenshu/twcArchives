/***
|''Name:''|~MyMacroMacro|
|''Version:''|0.1.1|
|''Author:''|[[Jack]]|
|''Type:''|Macro|
!Description
Allows you to define named shortcuts to your own macros with parameters and simplifies calling them. The {{{<<defineMyMacro>>}}} statements should go in your MainMenu or some other tiddler which displayed at startup.
!Usage
{{{<<defineMyMacro shortName realMacroName realMacroParameters...>>}}}
{{{<<myMacro shortName>>}}}
!Example
{{{<<defineMyMacro csvPlugins tiddlerList tags:"Plugin,-Template" format:csv>>}}}
{{{<<myMacro csvPlugins>>}}}
<<defineMyMacro csvPlugins tiddlerList tags:"Plugin,-Template" format:csv>><<myMacro csvPlugins>>
{{{<<myMacro csvPlugins order:"-title">>}}}
<<myMacro csvPlugins order:"-title">>
!Code
***/
//{{{
version.extensions.myMacro = {major: 0, minor: 1, revision: 1, date: new Date("Apr 22, 2006")};

config.macros.defineMyMacro={macroList:{}}
config.macros.defineMyMacro.handler=function(place,macroName,params,wikifier,paramString,tiddler) {
 this.macroList[params[0]] = paramString.substr(params[0].length+1)
}

config.macros.myMacro={}
config.macros.myMacro.handler=function(place,macroName,params,wikifier,paramString,tiddler) {
 wikify("<<" + config.macros.defineMyMacro.macroList[params[0]] + paramString.substr(params[0].length) + ">>", place)
 applyHtmlMacros(place,tiddler)
}
//}}}