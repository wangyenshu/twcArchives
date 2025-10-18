/***
|Name|HelloWorldMacro|
|Created by|SimonBaird|
|Location|http://simonbaird.com/mptw/#HelloWorldMacro|
|Version|1.0.3|
|Requires|~TW2.x|
!Description
It's a Hello World TiddlyWiki macro.

!History
* 03-Mar-06, version 1.0.3, added version.extensions data
* 13-Jan-06, version 1.0.2, added shout macro example
* 11-Jan-06, version 1.0.1, updated for ~TW2.0

!Examples
|!Source|!Output|h
|{{{<<helloWorld dude>>}}}|<<helloWorld dude>>|
|{{{<<helloWorld 'to everyone'>>}}}|<<helloWorld 'to everyone'>>|
(You can use (single or double) quotes or double square brackets for params with spaces)

!Notes
This is intended to help you get started with customising your TW. To make the macro work you have to give this tiddler a tag of systemConfig then save and reload. To learn more about customising Tiddlywiki you can look at other people's plugins or click View, Source in your browser and start reading. :)

!Code
***/
//{{{

// this part is not actually required but useful to other people using your plugin
version.extensions.HelloWorldMacro = { major: 1, minor: 0, revision: 3, date: new Date(2006,3,3),
	source: "http://simonbaird.com/mptw/#HelloWorldMacro"
};

config.macros.helloWorld = {};
config.macros.helloWorld.handler = function (place,macroName,params,wikifier,paramString,tiddler) {
	var who = params.length > 0 ? params[0] : "world";
	wikify("Hello //" + who + "// from the '" + macroName + "' macro in tiddler [[" + tiddler.title + "]].", place);
}

// a one liner...
config.macros.shout = { handler: function(place,name,params) { wikify("//''@@font-size:5em;color:#696;"+ params[0] + "!@@''//", place); } };


//}}}

/***

!Another example
{{{<<shout Yeah>>}}}

<<shout Yeah>>

***/
