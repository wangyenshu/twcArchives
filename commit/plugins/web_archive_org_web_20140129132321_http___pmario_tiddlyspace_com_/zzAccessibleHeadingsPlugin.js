/***
|''Name''|AccessibleHeadingsPlugin|
|''Description''|formatter modifying TiddlyWiki's handling of headings|
|''Author:''|Pietsch Mario|
|''Version''|0.0.1|
|''Status''|@@experimental@@|
|''Source''||
|''Documentation''||
|''License''|[[Creative Commons Attribution-ShareAlike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]]|

!!!Description
<<<
This formatter modifies the way headings are rendered in ~TiddlyWiki markup.
Since screen readers need h1-h3 to identify the document structure, the tiddler content should start with h4. So {{{! heading}}} will create a {{{<h4>}}} HTML element

{{{
! h4
!! h5
!!! h6
!!!! h6
!!!!! h6
!!!!!! h6
}}}
! h4
!! h5
!!! h6
!!!! h6
!!!!! h6
!!!!!! h6
<<<

!!! Revision History
<<<

!!!!V0.0.1 (2012-02-08)
* initial alpha release
<<<

***/
//{{{
(function(formatters) { //# set up alias

	//remove one line break before heading.
	var heading = formatters[formatters.findByField("name", "heading")];
		merge( heading, {termRegExp: /(\n)/mg});

		heading.match = "^!{1,6}";
		heading.handler = function(w) {
			var level;
			level = (w.matchLength + 3 > 6)? 6 :  w.matchLength + 3;
			w.subWikifyTerm(createTiddlyElement(w.output,"h" + level), this.termRegExp);
		};

})(config.formatters); //# end of alias
//}}}