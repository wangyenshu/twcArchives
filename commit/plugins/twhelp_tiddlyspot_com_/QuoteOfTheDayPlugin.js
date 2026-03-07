/***
|''Name:''|QuoteOfTheDayPlugin|
|''Source:''|http://www.TiddlyTools.com/#QuoteOfTheDayPlugin|
|''Author:''|Eric Shulman - ELS Design Studios|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|''~CoreVersion:''|2.0.10|

Display a randomly selected "quote of the day"

!!!!!Usage
<<<
{{{<<QOTD //tiddlername//>>}}}
Put your quotations into a tiddler (called //tiddlername//).  Separate each quote by a horizontal rule (use "----" on a line by itself).  Each time the macro is rendered it will display a different quotation, selected at random from the specified tiddler.
<<<
!!!!!Example
<<<

{{{<<QOTD Quotations>>}}}
<<QOTD Quotations>>
<<<
!!!!!Installation
<<<
import (or copy/paste) the following tiddlers into your document:
''QuoteOfTheDayPlugin'' (tagged with <<tag systemConfig>>)
^^documentation and javascript for QuoteOfTheDay handling^^
<<<
!!!!!Revision History
<<<
''2005.10.21 [1.0.0]''
Initial Release
<<<
!!!!!Credits

<<<
This feature was developed by EricShulman from [[ELS Design Studios|http:/www.elsdesign.com]].
Based on a suggestion by M.Russula
<<<
!!!!!Code
***/
//{{{
version.extensions.QOTD = {major: 1, minor: 0, revision: 0, date: new Date(2005,10,21)};
config.macros.QOTD = {};
config.macros.QOTD.handler= function(place,macroName,params) {
	var txt=store.getTiddlerText(params[0]); if (!txt) return;
	var quotes=txt.split("\n----\n");
	// then, get a random index number between 0 and N-1 and wikify that text
	wikify(quotes[Math.floor(Math.random()*quotes.length)],place);
}
//}}}