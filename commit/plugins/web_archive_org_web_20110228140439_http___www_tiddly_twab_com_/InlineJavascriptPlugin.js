/***
|Name|InlineJavascriptPlugin|
|Source|http://www.TiddlyTools.com/#InlineJavascriptPlugin|
|Documentation|http://www.TiddlyTools.com/#InlineJavascriptPluginInfo|
|Version|1.8.1|
|Author|Eric Shulman - ELS Design Studios|
|License|http://www.TiddlyTools.com/#LegalStatements <br>and [[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|~CoreVersion|2.1|
|Type|plugin|
|Requires||
|Overrides||
|Description|Insert Javascript executable code directly into your tiddler content.|
''Call directly into TW core utility routines, define new functions, calculate values, add dynamically-generated TiddlyWiki-formatted output'' into tiddler content, or perform any other programmatic actions each time the tiddler is rendered.
!!!!!Documentation
>see [[InlineJavascriptPluginInfo]]
!!!!!Revision History
<<<
2008.02.14 [1.8.1] added backward-compatibility for use of wikifyPlainText() in TW2.1.3 and earlier
2008.01.08 [*.*.*] plugin size reduction: documentation moved to ...Info and ...History tiddlers
2007.12.28 [1.8.0] added support for key="X" syntax to specify custom access key definitions
|please see [[InlineJavascriptPluginHistory]] for additional revision details|
2005.11.08 [1.0.0] initial release
<<<
!!!!!Code
***/
//{{{
version.extensions.inlineJavascript= {major: 1, minor: 8, revision: 1, date: new Date(2008,2,14)};

config.formatters.push( {
	name: "inlineJavascript",
	match: "\\<script",
	lookahead: "\\<script(?: src=\\\"((?:.|\\n)*?)\\\")?(?: label=\\\"((?:.|\\n)*?)\\\")?(?: title=\\\"((?:.|\\n)*?)\\\")?(?: key=\\\"((?:.|\\n)*?)\\\")?( show)?\\>((?:.|\\n)*?)\\</script\\>",

	handler: function(w) {
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source)
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			var src=lookaheadMatch[1];
			var label=lookaheadMatch[2];
			var tip=lookaheadMatch[3];
			var key=lookaheadMatch[4];
			var show=lookaheadMatch[5];
			var code=lookaheadMatch[6];
			if (src) { // load a script library
				// make script tag, set src, add to body to execute, then remove for cleanup
				var script = document.createElement("script"); script.src = src;
				document.body.appendChild(script); document.body.removeChild(script);
			}
			if (code) { // there is script code
				if (show) // show inline script code in tiddler output
					wikify("{{{\n"+lookaheadMatch[0]+"\n}}}\n",w.output);
				if (label) { // create a link to an 'onclick' script
					// add a link, define click handler, save code in link (pass 'place'), set link attributes
					var link=createTiddlyElement(w.output,"a",null,"tiddlyLinkExisting",wikifyPlainText(label));
					link.onclick=function(){try{return(eval(this.code))}catch(e){alert(e.description||e.toString())}}
					var fixup=code.replace(/document.write\s*\(/gi,'place.innerHTML+=(');
					link.code="function _out(place){"+fixup+"\n};_out(this);"
					link.setAttribute("title",tip||"");
					var URIcode='javascript:void(eval(decodeURIComponent(%22(function(){try{';
					URIcode+=encodeURIComponent(encodeURIComponent(code.replace(/\n/g,' ')));
					URIcode+='}catch(e){alert(e.description||e.toString())}})()%22)))';
					link.setAttribute("href",URIcode);
					link.style.cursor="pointer";
					if (key) link.accessKey=key.substr(0,1); // single character only
				}
				else { // run inline script code
					var fixup=code.replace(/document.write\s*\(/gi,'place.innerHTML+=(');
					var code="function _out(place){"+fixup+"\n};_out(w.output);"
					try { var out=eval(code); } catch(e) { out=e.description?e.description:e.toString(); }
					if (out && out.length) wikify(out,w.output,w.highlightRegExp,w.tiddler);
				}
			}
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
		}
	}
} )
//}}}

// // Backward-compatibility for TW2.1.x and earlier
//{{{
if (typeof(wikifyPlainText)=="undefined") function wikifyPlainText(text,limit,tiddler) {
	if(limit > 0) text = text.substr(0,limit);
	var wikifier = new Wikifier(text,formatter,null,tiddler);
	return wikifier.wikifyPlain();
}
//}}}