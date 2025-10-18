/***
|Name|DisplayOpenTiddlersPlugin|
|Location|http://www.orst.edu/~woodswa/tiddlywikiplugs.html|
|Version|1.0|
|Author|Walt Woods|
|Requirements||

!Description
Displays similar to the popular BreadCrumbsPlugin by AlanHecht, this plugin instead keeps a list of currently open tiddlers.

!History
09-06-2009: JohnRouillard modified seperator between items on tiddler line.
08-06-2007: Initial version.

!Code
***/
//{{{
version.extensions.DisplayOpenTiddlers = {major: 1, minor: 0, revision: 0};

function addOpenTiddlerLine(title, element)
{
 if (title != openTiddlerClosing)
 {
  if (tiddlerLine != "")
   tiddlerLine += " &bull; ";
  tiddlerLine += "[[" + title + "]]";
 }
}

function refreshOpenTiddlersList()
{
 if (!document.getElementById("openTiddlers")) {
  var ta = document.createElement("div");
  ta.id = "openTiddlers";
  ta.style.visibility= "hidden";
  var targetArea = document.getElementById("tiddlerDisplay")||document.getElementById("storyDisplay");
  targetArea.parentNode.insertBefore(ta,targetArea);
 }

 var tiddlers = document.getElementById("openTiddlers");
 tiddlers.style.visibility = "visible";
 removeChildren(tiddlers);
 
 tiddlerLine = "";
 story.forEachTiddler(addOpenTiddlerLine);
 wikify(tiddlerLine,tiddlers)
}

Story.prototype.displayTiddlerDisplayOpenTiddlers = Story.prototype.displayTiddler;
Story.prototype.displayTiddler = function(srcElement,title,template,animate,slowly)
{
 this.displayTiddlerDisplayOpenTiddlers(srcElement,title,template,animate,slowly);
 openTiddlerClosing = "";
 refreshOpenTiddlersList();
}

Story.prototype.closeTiddlerDisplayOpenTiddlers = Story.prototype.closeTiddler;
Story.prototype.closeTiddler = function(title,animate,unused)
{
 this.closeTiddlerDisplayOpenTiddlers(title,animate,unused);
 openTiddlerClosing = title;
 refreshOpenTiddlersList();
}
//}}}