/***
|''Name''|LineBreakHack|
|''Description''|formatter modifying TiddlyWiki's handling of line breaks, in front and after headings, lists and quots|
|''Author:''|Pietsch Mario|
|''Version''|0.3.1|
|''Status''|stable|
|''Source''|http://line-break-hack.tiddlyspace.com/#LineBreakHack|
|''Documentation''|http://line-break-hack-info.tiddlyspace.com/#LineBreakHackInfo|
|''License''|[[Creative Commons Attribution-ShareAlike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]]|

!!!Description
<<<
This formatter modifies the way line breaks in ~TiddlyWiki markup are rendered;
Linebreaks for headings, list, quotes are changed.
<<<

!!! Revision History
<<<

!!!! V0.3.1 (2012-01-17)
* Removed the "paragraph" lineBreak because it creates quirks with inter TiddlySpace transclusion. 
* Two linebreaks now produce two lines again.

!!!!V0.3 (2010-09-29)
*Two linebreaks now produce one empty line. 
**Have a look at {{{lineBreak.match}}}
<<<

***/
//{{{
(function(formatters) { //# set up alias

	// modify line-break formatter to find more than one \n
//	var lineBreak = formatters[formatters.findByField("name", "lineBreak")];
//	lineBreak.match = "\\n+|<br ?/?>";
//	lineBreak.match = "\\n{1,2}|<br ?/?>";


	//remove one line break before heading.
	var heading = formatters[formatters.findByField("name", "heading")];
		merge( heading, {termRegExp: /(\n+)/mg});

		heading.match = "^\n?!{1,6}";
		heading.handler = function(w) {
			if (w.matchText[0]=='\n') w.matchLength = w.matchLength - 1;
			w.subWikifyTerm(createTiddlyElement(w.output,"h" + w.matchLength), this.termRegExp);
		};
	
	for (var i=0; i<formatters.length; i++) {
		if (formatters[i].name == "list") {
			merge( formatters[i], {termRegExp: /(\n{1,2})/mg});
		}

		if (formatters[i].name == "quoteByBlock") {
			merge( formatters[i], {termRegExp: /(^<<<(\n{1,2}|$))/mg});
		}

		if (formatters[i].name == "quoteByLine") {
			merge( formatters[i], {termRegExp: /(\n{1,2})/mg});
			break;
		} // if ..
	} // for ..


})(config.formatters); //# end of alias
//}}}