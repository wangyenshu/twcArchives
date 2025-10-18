/***
|''Name''|NewTaggedCommand|
|''Description''|Creates a new tiddler, and tags it with it's parents title!|
|''Authors''|PMario|
|''Version''|0.1.1|
|''Date''|2011-07-20|
|''Status''|@@beta@@|
|''Source''|http://hoster.peermore.com/recipes/TeamWork/tiddlers.wiki#NewTaggedCommand|
|''License''|BSD|
|''CoreVersion''|2.5|
|''Keywords''|toolbar command add new tagged tiddler|
!!!Description
<<<
To use this new toolbar command you have to add {{{newTagged}}} to ToolbarCommands tiddler
eg:
{{{
|~ViewToolbar| +editTiddler newTagged ...
}}}
<<<
!!!Change the button text
<<<
If you want to change the buttons text from "newTagged" to eg "+", you need to create at tiddler [[zzConfig]] and tag it "systemConfig" and insert the following line.
//{{{
config.commands.newTagged.text = "+";
//}}}
<<<
!!!Code
***/
//{{{

config.commands.newTagged = {
	text: "nyHer",
	tooltip: "Opret en ny tiddler og tag den med denne tiddlers titel!",

	isEnabled: function(tiddler) {
		return !readOnly;
	}
};

config.commands.newTagged.handler = function(event,src,title)
{
	var newTitle = config.macros.newTiddler.title;
	story.displayTiddler(null, newTitle);
	config.commands.editTiddler.handler.call(this,event,src,newTitle); 
	story.setTiddlerTag(newTitle, title, +1);
	return false;
};
//}}}