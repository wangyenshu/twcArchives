/*{{{*/

version.extensions.InlineJavascriptPlugin= {major: 1, minor: 9, revision: 5, date: new Date(2009,4,11)};

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
			if (src) { // external script library
				var script = document.createElement("script"); script.src = src;
				document.body.appendChild(script); document.body.removeChild(script);
			}
			if (code) { // inline code
				if (show) // display source in tiddler
					wikify("{{{\n"+lookaheadMatch[0]+"\n}}}\n",w.output);
				if (label) { // create 'onclick' command link
					var link=createTiddlyElement(w.output,"a",null,"tiddlyLinkExisting",wikifyPlainText(label));
					var fixup=code.replace(/document.write\s*\(/gi,'place.bufferedHTML+=(');
					link.code="function _out(place,tiddler){"+fixup+"\n};_out(this,this.tiddler);"
					link.tiddler=w.tiddler;
					link.onclick=function(){
						this.bufferedHTML="";
						try{ var r=eval(this.code);
							if(this.bufferedHTML.length || (typeof(r)==="string")&&r.length)
								var s=this.parentNode.insertBefore(document.createElement("span"),this.nextSibling);
							if(this.bufferedHTML.length)
								s.innerHTML=this.bufferedHTML;
							if((typeof(r)==="string")&&r.length) {
								wikify(r,s,null,this.tiddler);
								return false;
							} else return r!==undefined?r:false;
						} catch(e){alert(e.description||e.toString());return false;}
					};
					link.setAttribute("title",tip||"");
					var URIcode='javascript:void(eval(decodeURIComponent(%22(function(){try{';
					URIcode+=encodeURIComponent(encodeURIComponent(code.replace(/\n/g,' ')));
					URIcode+='}catch(e){alert(e.description||e.toString())}})()%22)))';
					link.setAttribute("href",URIcode);
					link.style.cursor="pointer";
					if (key) link.accessKey=key.substr(0,1); // single character only
				}
				else { // run script immediately
					var fixup=code.replace(/document.write\s*\(/gi,'place.innerHTML+=(');
					var c="function _out(place,tiddler){"+fixup+"\n};_out(w.output,w.tiddler);";
					try	 { var out=eval(c); }
					catch(e) { out=e.description?e.description:e.toString(); }
					if (out && out.length) wikify(out,w.output,w.highlightRegExp,w.tiddler);
				}
			}
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
		}
	}
} )

/*}}}*/