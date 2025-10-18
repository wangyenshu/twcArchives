/***
|Name|JumpToTopMacro|
|Created by|SaqImtiaz|
|Location|http://tw.lewcid.org/#JumpToTopMacro|
|Version|1.0|
|Requires|~TW2.x|
!Description:
Provides a toolbar command and a macro, that create a button for quickly jumping to the top of your TW.
Handy to place in the tiddler toolbar (edit the ViewTemplate)

Note: You can add an extra toolbar to the bottom of tiddlers as well with buttons of your choice, to allow easy access to the buttons/commands in it.

!Demo:
{{{<<top>>}}}<<top>>

!Installation:
Copy the contents of this tiddler to your TW, tag with systemConfig, save and reload your TW.

!History:
*23-07-06: ver 1.0

!Code
***/
//{{{
config.macros.top={};
config.macros.top.handler=function(place,macroName)
{
               createTiddlyButton(place,"^","jump to top",this.onclick);
}
config.macros.top.onclick=function()
{
               window.scrollTo(0,0);
};

config.commands.top =
{
               text:" ^ ",
               tooltip:"jump to top"
};

config.commands.top.handler = function(event,src,title)
{
               window.scrollTo(0,0);
}
//}}}