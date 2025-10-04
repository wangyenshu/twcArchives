/***
|Synopsis|Replace strings with others|
|Author|[[Conal Elliott|http://conal.net]]|
|Version|1.0.2|
|Creation date|2007-01-27|
!Description
Automatically replace strings with others.  The replacement string gets wikified as well, allowing for cascading rewrites.  (No check for cycles, so watch out.)  If you want to use a string that has a replacement rule, prefix it with a backslash.
 
Some possible uses:
* Abbreviations 
* Fill in math symbols, e.g., //a -> b//, //g . f//, and //\ x -> x+x//.
* You tell me.
!Example
//{{{
config.macros.rewrite.declare(
  [ ["->", "&rarr;"]
  , ["csid", "chronosynclasticinfidibulum"]
  , ["@(.*?)@", "{{haskell{$1}}}"]
  ]
);
//}}}
Then the string "csid" would get rewritten but "\csid" would not.

Note in the last rule that right-hand-sides may substitute captured text.
!To do
* Use these rewrites in displaying [[Haskell code|literate Haskell plugin]].  How?  Idea: make a second formatters list, filtering for the ones that contain a special field.  Temporarily replace the main formatters before calling subWikify, and then restore.
* Get the rewrite rules from a table in a tiddler, maybe from a table.  Allow updating the list without having to reload the TW, and still keep it efficient.  How to get the rules to look good when rendered? 
* Regular expression replacement.
!History
* Version 1.0.2
** Left-hand-sides can capture text to be substituted on right-hand-sides.  Much more powerful than before.
!Code
***/
//{{{
version.extensions.rewrite = {major: 1, minor: 0, revision: 2, date: new Date(2007,1,27)};

config.macros.rewrite = {};

config.macros.rewrite.declare = function (rewrites) {
    var rewrite = function (from,to) {
 	var fromReg = new RegExp(from,"gm");
	// Make sure "from" pattern doesn't remember matches, or we'll
        // mess up the handling of formatters.  Turn "(" into "(?:".  What
        // about escaped open paren?  Rewrite them away first and then
        // back last.
	var fromNoGrab =
	  from.replace(/\\\(/g,"Q####Q")
	      .replace(/\((?!\?\:)/g,"(?:")
              .replace(/Q####Q/g,"\\(");
	//alert("from == "+from+", fromNoGrab == "+fromNoGrab);
	config.formatters.push(
	{
	    name: "noRewrite"+fromNoGrab,
	    match: "\\\\"+fromNoGrab,
	    handler: function (w) {
	        w.outputText(w.output,w.matchStart+1,w.nextMatch);
	    }
	});
	config.formatters.push(
	{
	    name: "rewrite"+fromNoGrab,
	    match: fromNoGrab,
	    handler: function (w) {
	      var newStr = w.matchText.replace(fromReg,to);
	      //alert("Matched "+w.matchText+
	      //      ". Substituting "+to+" for "+from+" gives "+newStr);
	      if (newStr == w.matchText)
	        alert("Breaking rewrite cycle");
              else
 		wikify(newStr,w.output,null,w.tiddler);
	    }
	});
    }
    for (var i=0; i<rewrites.length; i++)
        rewrite(rewrites[i][0],rewrites[i][1]);
}
//}}}
