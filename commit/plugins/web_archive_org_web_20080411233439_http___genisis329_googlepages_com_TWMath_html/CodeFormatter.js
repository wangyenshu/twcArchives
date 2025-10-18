config.formatters.push(
{
keywords : {
	"var":"blue",
	"try":"blue",
	"catch":"blue",
	"if":"blue",
	"else":"blue",
	"for":"blue",
	"while":"blue",
	"do":"blue",
	"function":"blue",
	"Function":"blue",
	"String":"blue",
	"Object":"blue",
	"RegExp":"blue",
	"Array":"blue",
	"Math":"blue",
	"Date":"blue",
	";":"blue",
	"+":"red",
	"-":"red",
	"*":"red",
	"/":"red",
	"%":"red",
	"^":"red",
	"&":"red",
	"|":"red",
	"!":"red",
	"~":"red",
	"=":"red",
	"<":"red",
	">":"red",
	"false":"DarkBlue",
	"true":"DarkBlue",
	"window":"DarkBlue",
	"document":"DarkBlue",
	"alert":"IndianRed",
	"eval":"IndianRed",
	"setInterval":"IndianRed",
	"setTimeout":"IndianRed",
	"toString":"IndianRed",
	"write":"IndianRed"
},
	match: "<[Cc][Oo][Dd][Ee]>\\n",
	lookahead: "<[Cc][Oo][Dd][Ee]>\\n((?:.|\\n)*?)\\n</[Cc][Oo][Dd][Ee]>",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source)
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart)
			{
			var e = createTiddlyElement(w.output,"pre");
			var str = lookaheadMatch[1];
var Reg = /(\/\/.*?$)|(\/\*(.|\n)*?\*\/)|[&#39;]{2}|(&#39;.*?[^\\]&#39;)|["]{2}|(".*?[^\\]")|\w+|[\s\n]+|./mg;
var parts = str.match(Reg);
for(var i = 0; i < parts.length; i++){
if(parts[i].match(/^[\s\n]/))parts[i] = parts[i].replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\n/g,"<br/>").replace(/\r/g,"");
else if(parts[i].match(/^(?:\/\/)|(?:\/\*)/))parts[i] = "<span style=\"color:green;\">"+parts[i].htmlEncode().replace(/\\n/g,"&lt;br/&gt;")+"</span>";
else if(parts[i].charAt(0)=="\""||parts[i].charAt(0)=="&#39;")parts[i] = "<span style=\"color:teal;\">"+parts[i].htmlEncode()+"</span>";
else if(this.keywords[parts[i]])parts[i] = "<span style=\"color:"+this.keywords[parts[i]]+";\">"+parts[i].htmlEncode()+"</span>";
}
e.innerHTML = parts.join("");
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			}
	}
}
);