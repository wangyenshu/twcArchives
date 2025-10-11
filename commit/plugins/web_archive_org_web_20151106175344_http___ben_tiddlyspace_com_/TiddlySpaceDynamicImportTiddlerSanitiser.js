/***
|''Description''|Sanitisation for dynamically pulling tiddlers into your space and displaying them (you do this when using the following mechanism)|
!Usage
This hijacks the wikifier and replaces the handler function of the HTML and CSS formatters with custom ones if the tiddler being wikified is not local to the space. It does this by taking the tiddler reference in the Wikifier constructor and comparing the fields against the current space name. You don't have to do anything, it just works. Obviously though, it only works if you pass a tiddler into the wikifier when you create it, so if you have code that just calls wikify(), then be careful, as you're still potentially vulnerable.

Current behaviour is that it strips (potentially) unsafe HTML out before rendering it. This includes all attributes, classes and ids, etc. It also removes inline CSS, leaving just the text.

It uses the html sanitizer from the Caja project (see http://code.google.com/p/google-caja/wiki/JsHtmlSanitizer for more on this).
!Code
***/
//{{{
(function($) {
var tiddlyspace = config.extensions.tiddlyspace;

var _subWikify = Wikifier.prototype.subWikify;

var replaceFunctions = {
	html: function(w) {
		var sanitizedHTML, sanitizedEl;
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			sanitizedHTML = html_sanitize(lookaheadMatch[1], function(value) {
				return (/^https?:\/\//.test(value)) ? value : null;
			});
			$('<span class="sanitized" />')
				.html(sanitizedHTML)
				.appendTo(w.output);
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		}
	},
	customFormat: function(w) {
		switch(w.matchText) {
			case '@@':
				var e = createTiddlyElement(w.output, 'span');
				var styles = config.formatterHelpers.inlineCssHelper(w);
				if (styles.length == 0) {
					e.className = 'marked';
				} // don't apply the styles
				w.subWikifyTerm(e, /(@@)/mg);
				break;
			case '{{':
				var lookaheadRegExp = /\{\{[\s]*([\w]+[\s\w]*)[\s]*\{(\n?)/mg;
				lookaheadRegExp.lastIndex = w.matchStart;
				var lookaheadMatch = lookaheadRegExp.exec(w.source);
				if(lookaheadMatch) {
					w.nextMatch = lookaheadRegExp.lastIndex;
					e = createTiddlyElement(w.output,lookaheadMatch[2] == "\n" ?
						"div" : "span",null,lookaheadMatch[1]);
					w.subWikifyTerm(e,/(\}\}\})/mg);
				}
				break;
		}
	}
};

Wikifier.prototype.subWikify = function(output, terminator) {
	var tid = this.tiddler,
		spaceName = tiddlyspace.currentSpace.name,
		tidSpace, recipeName, stripped;
	try {
		recipeName = tid.fields['server.recipe'] ||
			tid.fields['server.workspace'];
		tidSpace = tiddlyspace.resolveSpaceName(recipeName);
		if (tidSpace !== spaceName) {
			stripped = stripHTML(tid, this.formatter);
		}
	} catch(e) {
		// do nothing. There's no tiddler, so assume it's safe (?!?!?)
	}

	_subWikify.apply(this, arguments);

	if (stripped) {
		// change back to the original function
		unstripHTML(stripped, this.formatter);
	}
};

var stripHTML = function(tid, formatter) {
	var popped = {}, _handler;
	for (var i=0; i< formatter.formatters.length; i++) {
		var f = formatter.formatters[i];
		if (replaceFunctions[f.name]) {
			_handler = f.handler;
			popped[f.name] = _handler;
			f.handler = replaceFunctions[f.name];
		}
	};

	return popped;
};

var unstripHTML = function(stripped, formatter) {
	for (var i=0; i< formatter.formatters.length; i++) {
		var f = formatter.formatters[i];
		if (stripped[f.name]) {
			f.handler = stripped[f.name];
		}
	};
};

})(jQuery);
//}}}
/***
!html-sanitizer
***/
//{{{
var html=function(){function i(d){d=f(d);if(b.hasOwnProperty(d))return b[d];var a=d.match(c);if(a)return String.fromCharCode(parseInt(a[1],10));else if(a=d.match(n))return String.fromCharCode(parseInt(a[1],16));return""}function g(d,a){return i(a)}function j(a){return a.replace(l,g)}function a(a){return a.replace(q,"&amp;$1").replace(o,"&lt;").replace(p,"&gt;")}var f;f=function(a){return a.toLowerCase()};var b={lt:"<",gt:">",amp:"&",nbsp:"\u00a0",quot:'"',apos:"'"},c=/^#(\d+)$/,n=/^#x([0-9A-Fa-f]+)$/,
h=/\0/g,l=/&(#\d+|#x[0-9A-Fa-f]+|\w+);/g,k=/&/g,q=/&([^a-z#]|#(?:[^0-9x]|x(?:[^0-9a-f]|$)|$)|$)/gi,o=/</g,p=/>/g,r=/\"/g,s=/\=/g,t=RegExp("^\\s*(?:(?:([a-z][a-z-]*)(\\s*=\\s*(\"[^\"]*\"|'[^']*'|(?=[a-z][a-z-]*\\s*=)|[^>\"'\\s]*))?)|(/?>)|.[^a-z\\s>]*)","i"),u=RegExp("^(?:&(\\#[0-9]+|\\#[x][0-9a-f]+|\\w+);|<\!--[\\s\\S]*?--\>|<!\\w[^>]*>|<\\?[^>*]*>|<(/)?([a-z][a-z0-9]*)|([^<&>]+)|([<&>]))","i");return{normalizeRCData:a,escapeAttrib:function(a){return a.replace(k,"&amp;").replace(o,"&lt;").replace(p,
"&gt;").replace(r,"&#34;").replace(s,"&#61;")},unescapeEntities:j,makeSaxParser:function(d){return function(b,c){var b=String(b),g=null,m=!1,n=[],i=void 0,k=void 0,l=void 0;for(d.startDoc&&d.startDoc(c);b;){var e=b.match(m?t:u),b=b.substring(e[0].length);if(m)if(e[1]){var o=f(e[1]);if(e[2]){e=e[3];switch(e.charCodeAt(0)){case 34:case 39:e=e.substring(1,e.length-1)}e=j(e.replace(h,""))}else e=o;n.push(o,e)}else{if(e[4]){k!==void 0&&(l?d.startTag&&d.startTag(i,n,c):d.endTag&&d.endTag(i,c));if(l&&k&
(html4.eflags.CDATA|html4.eflags.RCDATA)){g=g===null?f(b):g.substring(g.length-b.length);m=g.indexOf("</"+i);if(m<0)m=b.length;k&html4.eflags.CDATA?d.cdata&&d.cdata(b.substring(0,m),c):d.rcdata&&d.rcdata(a(b.substring(0,m)),c);b=b.substring(m)}i=k=l=void 0;n.length=0;m=!1}}else if(e[1])d.pcdata&&d.pcdata(e[0],c);else if(e[3])l=!e[2],m=!0,i=f(e[3]),k=html4.ELEMENTS.hasOwnProperty(i)?html4.ELEMENTS[i]:void 0;else if(e[4])d.pcdata&&d.pcdata(e[4],c);else if(e[5]&&d.pcdata)switch(e[5]){case "<":d.pcdata("&lt;",
c);break;case ">":d.pcdata("&gt;",c);break;default:d.pcdata("&amp;",c)}}d.endDoc&&d.endDoc(c)}}}}();
html.makeHtmlSanitizer=function(i){var g,j;return html.makeSaxParser({startDoc:function(){g=[];j=!1},startTag:function(a,f,b){if(!j&&html4.ELEMENTS.hasOwnProperty(a)){var c=html4.ELEMENTS[a];if(!(c&html4.eflags.FOLDABLE))if(c&html4.eflags.UNSAFE)j=!(c&html4.eflags.EMPTY);else if(f=i(a,f)){c&html4.eflags.EMPTY||g.push(a);b.push("<",a);a=0;for(c=f.length;a<c;a+=2){var n=f[a],h=f[a+1];h!==null&&h!==void 0&&b.push(" ",n,'="',html.escapeAttrib(h),'"')}b.push(">")}}},endTag:function(a,f){if(j)j=!1;else if(html4.ELEMENTS.hasOwnProperty(a)){var b=
html4.ELEMENTS[a];if(!(b&(html4.eflags.UNSAFE|html4.eflags.EMPTY|html4.eflags.FOLDABLE))){if(b&html4.eflags.OPTIONAL_ENDTAG)for(b=g.length;--b>=0;){var c=g[b];if(c===a)break;if(!(html4.ELEMENTS[c]&html4.eflags.OPTIONAL_ENDTAG))return}else for(b=g.length;--b>=0;)if(g[b]===a)break;if(!(b<0)){for(var i=g.length;--i>b;)c=g[i],html4.ELEMENTS[c]&html4.eflags.OPTIONAL_ENDTAG||f.push("</",c,">");g.length=b;f.push("</",a,">")}}}},pcdata:function(a,f){j||f.push(a)},rcdata:function(a,f){j||f.push(a)},cdata:function(a,
f){j||f.push(a)},endDoc:function(a){for(var f=g.length;--f>=0;)a.push("</",g[f],">");g.length=0}})};
function html_sanitize(i,g,j){var a=[];html.makeHtmlSanitizer(function(a,b){for(var c=0;c<b.length;c+=2){var i=b[c],h=b[c+1],l=null,k;if((k=a+"::"+i,html4.ATTRIBS.hasOwnProperty(k))||(k="*::"+i,html4.ATTRIBS.hasOwnProperty(k)))l=html4.ATTRIBS[k];if(l!==null)switch(l){case html4.atype.NONE:break;case html4.atype.SCRIPT:case html4.atype.STYLE:h=null;break;case html4.atype.ID:case html4.atype.IDREF:case html4.atype.IDREFS:case html4.atype.GLOBAL_NAME:case html4.atype.LOCAL_NAME:case html4.atype.CLASSES:h=j?
j(h):h;break;case html4.atype.URI:h=g&&g(h);break;case html4.atype.URI_FRAGMENT:h&&"#"===h.charAt(0)?(h=j?j(h):h)&&(h="#"+h):h=null;break;default:h=null}else h=null;b[c+1]=h}return b})(i,a);return a.join("")}
var html4={atype:{NONE:0,URI:1,URI_FRAGMENT:11,SCRIPT:2,STYLE:3,ID:4,IDREF:5,IDREFS:6,GLOBAL_NAME:7,LOCAL_NAME:8,CLASSES:9,FRAME_TARGET:10},ATTRIBS:{"*::class":9,"*::dir":0,"*::id":4,"*::lang":0,"*::onclick":2,"*::ondblclick":2,"*::onkeydown":2,"*::onkeypress":2,"*::onkeyup":2,"*::onload":2,"*::onmousedown":2,"*::onmousemove":2,"*::onmouseout":2,"*::onmouseover":2,"*::onmouseup":2,"*::style":3,"*::title":0,"a::accesskey":0,"a::coords":0,"a::href":1,"a::hreflang":0,"a::name":7,"a::onblur":2,"a::onfocus":2,
"a::rel":0,"a::rev":0,"a::shape":0,"a::tabindex":0,"a::target":10,"a::type":0,"area::accesskey":0,"area::alt":0,"area::coords":0,"area::href":1,"area::nohref":0,"area::onblur":2,"area::onfocus":2,"area::shape":0,"area::tabindex":0,"area::target":10,"bdo::dir":0,"blockquote::cite":1,"br::clear":0,"button::accesskey":0,"button::disabled":0,"button::name":8,"button::onblur":2,"button::onfocus":2,"button::tabindex":0,"button::type":0,"button::value":0,"canvas::height":0,"canvas::width":0,"caption::align":0,
"col::align":0,"col::char":0,"col::charoff":0,"col::span":0,"col::valign":0,"col::width":0,"colgroup::align":0,"colgroup::char":0,"colgroup::charoff":0,"colgroup::span":0,"colgroup::valign":0,"colgroup::width":0,"del::cite":1,"del::datetime":0,"dir::compact":0,"div::align":0,"dl::compact":0,"font::color":0,"font::face":0,"font::size":0,"form::accept":0,"form::action":1,"form::autocomplete":0,"form::enctype":0,"form::method":0,"form::name":7,"form::onreset":2,"form::onsubmit":2,"form::target":10,"h1::align":0,
"h2::align":0,"h3::align":0,"h4::align":0,"h5::align":0,"h6::align":0,"hr::align":0,"hr::noshade":0,"hr::size":0,"hr::width":0,"iframe::align":0,"iframe::frameborder":0,"iframe::height":0,"iframe::marginheight":0,"iframe::marginwidth":0,"iframe::width":0,"img::align":0,"img::alt":0,"img::border":0,"img::height":0,"img::hspace":0,"img::ismap":0,"img::name":7,"img::src":1,"img::usemap":11,"img::vspace":0,"img::width":0,"input::accept":0,"input::accesskey":0,"input::align":0,"input::alt":0,"input::autocomplete":0,
"input::checked":0,"input::disabled":0,"input::ismap":0,"input::maxlength":0,"input::name":8,"input::onblur":2,"input::onchange":2,"input::onfocus":2,"input::onselect":2,"input::readonly":0,"input::size":0,"input::src":1,"input::tabindex":0,"input::type":0,"input::usemap":11,"input::value":0,"ins::cite":1,"ins::datetime":0,"label::accesskey":0,"label::for":5,"label::onblur":2,"label::onfocus":2,"legend::accesskey":0,"legend::align":0,"li::type":0,"li::value":0,"map::name":7,"menu::compact":0,"ol::compact":0,
"ol::start":0,"ol::type":0,"optgroup::disabled":0,"optgroup::label":0,"option::disabled":0,"option::label":0,"option::selected":0,"option::value":0,"p::align":0,"pre::width":0,"q::cite":1,"select::disabled":0,"select::multiple":0,"select::name":8,"select::onblur":2,"select::onchange":2,"select::onfocus":2,"select::size":0,"select::tabindex":0,"table::align":0,"table::bgcolor":0,"table::border":0,"table::cellpadding":0,"table::cellspacing":0,"table::frame":0,"table::rules":0,"table::summary":0,"table::width":0,
"tbody::align":0,"tbody::char":0,"tbody::charoff":0,"tbody::valign":0,"td::abbr":0,"td::align":0,"td::axis":0,"td::bgcolor":0,"td::char":0,"td::charoff":0,"td::colspan":0,"td::headers":6,"td::height":0,"td::nowrap":0,"td::rowspan":0,"td::scope":0,"td::valign":0,"td::width":0,"textarea::accesskey":0,"textarea::cols":0,"textarea::disabled":0,"textarea::name":8,"textarea::onblur":2,"textarea::onchange":2,"textarea::onfocus":2,"textarea::onselect":2,"textarea::readonly":0,"textarea::rows":0,"textarea::tabindex":0,
"tfoot::align":0,"tfoot::char":0,"tfoot::charoff":0,"tfoot::valign":0,"th::abbr":0,"th::align":0,"th::axis":0,"th::bgcolor":0,"th::char":0,"th::charoff":0,"th::colspan":0,"th::headers":6,"th::height":0,"th::nowrap":0,"th::rowspan":0,"th::scope":0,"th::valign":0,"th::width":0,"thead::align":0,"thead::char":0,"thead::charoff":0,"thead::valign":0,"tr::align":0,"tr::bgcolor":0,"tr::char":0,"tr::charoff":0,"tr::valign":0,"ul::compact":0,"ul::type":0},eflags:{OPTIONAL_ENDTAG:1,EMPTY:2,CDATA:4,RCDATA:8,
UNSAFE:16,FOLDABLE:32,SCRIPT:64,STYLE:128},ELEMENTS:{a:0,abbr:0,acronym:0,address:0,applet:16,area:2,b:0,base:18,basefont:18,bdo:0,big:0,blockquote:0,body:49,br:2,button:0,canvas:0,caption:0,center:0,cite:0,code:0,col:2,colgroup:1,dd:1,del:0,dfn:0,dir:0,div:0,dl:0,dt:1,em:0,fieldset:0,font:0,form:0,frame:18,frameset:16,h1:0,h2:0,h3:0,h4:0,h5:0,h6:0,head:49,hr:2,html:49,i:0,iframe:4,img:2,input:2,ins:0,isindex:18,kbd:0,label:0,legend:0,li:1,link:18,map:0,menu:0,meta:18,nobr:0,noframes:20,noscript:20,
object:16,ol:0,optgroup:0,option:1,p:1,param:18,pre:0,q:0,s:0,samp:0,script:84,select:0,small:0,span:0,strike:0,strong:0,style:148,sub:0,sup:0,table:0,tbody:1,td:1,textarea:8,tfoot:1,th:1,thead:1,title:24,tr:1,tt:0,u:0,ul:0,"var":0},ueffects:{NOT_LOADED:0,SAME_DOCUMENT:1,NEW_DOCUMENT:2},URIEFFECTS:{"a::href":2,"area::href":2,"blockquote::cite":0,"body::background":1,"del::cite":0,"form::action":2,"img::src":1,"input::src":1,"ins::cite":0,"q::cite":0},ltypes:{UNSANDBOXED:2,SANDBOXED:1,DATA:0},LOADERTYPES:{"a::href":2,
"area::href":2,"blockquote::cite":2,"body::background":1,"del::cite":2,"form::action":2,"img::src":1,"input::src":1,"ins::cite":2,"q::cite":2}};
//}}}
