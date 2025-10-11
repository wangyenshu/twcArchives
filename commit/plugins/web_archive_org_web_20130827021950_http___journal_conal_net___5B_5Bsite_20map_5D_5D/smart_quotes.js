/***
|Author|[[Conal Elliott|http://conal.net]]|
|Creation date|2006-12-31|
!Description
Turn regular quotes into "curly quotes".  Or backslashify to get \"straight quotes\".

You'll probably have to increase your browser's text size to see the difference.
!Use
{{{Turn regular quotes into "curly quotes".  Or backslashify to get \"straight quotes\".}}}
!Code
***/
//{{{
config.formatters.push(
{
    name: "dumbQuote",
    match: "\\\\\"",
    handler: function(w) {
	createTiddlyElement(w.output,"span").innerHTML = "\"";
    }
});
config.formatters.push(
{
    name: "smartQuote",
    match: "\"",
    // toggle flag and pick left or close quote
    wasLeft: false,  // mutable: whether last quote was an left quote
    nextSymbol: function (w) {
	this.wasLeft = !this.wasLeft;
	return this.wasLeft ? "&ldquo;":"&rdquo;";
    },
    // For robustness, reset the state every time we switch tiddlers.
    // Otherwise an odd number of quotes in one tiddler would throw off
    // all of the subsequently rendered ones.
    lastTiddler: null,  // mutable
    checkReset: function (tiddler) {
	if (this.lastTiddler != tiddler) {
	    this.wasLeft = false;
	    this.lastTiddler = tiddler;
	}
    },
    handler: function(w) {
	this.checkReset(w.tiddler);
	createTiddlyElement(w.output,"span").innerHTML = this.nextSymbol();
    }
});
//}}}
