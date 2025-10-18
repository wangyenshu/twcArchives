/***
|''Name:''|Publish Macro|
|''Version:''|2.4.1 (2 July 2008)|
|''Source''|http://jackparke.googlepages.com/jtw.html#PublishMacro ([[del.icio.us|http://del.icio.us/post?url=http://jackparke.googlepages.com/jtw.html%23PublishMacro]])|
|''Author:''|[[Jack]]|
|''Type:''|Macro|
!Description
<<doPublish>> tiddlers tagged with these tags <<option txtPublishTags>> (comma seperated) as HTML pages to the subfolder 'publish' (you must create this). Use the [[PublishTemplateHead]] and [[PublishTemplateBody]] templates to style your pages and the [[PublishIndexTemplate]] to define an index page. For publishing individual tiddlers the [[PublishTemplateBodySingle]] template is used.
!Usage
To publish all tagged tiddlers:
{{{<<doPublish>>}}} <<doPublish>>
To publish a single tiddler, use the {{{<<publishTiddler>>}}} macro or add the "publishTiddler" command to your ViewTemplate
!Template placeholders
|!Placeholder|!Meaning|
|%0|Your SiteTitle "<<tiddler SiteTitle>>"|
|%1|The current tiddler title|
|%2|The rendered tiddler HTML|
|%3|CSV list of tags|
|%4|Tiddler modifier|
|%5|Tiddler modified date|
|%6|Tiddler creation date|
|%7|Tiddler wiki text|
!Revision History
* Original by [[Jack]] 24 May 2006
* Updated 2 Jan 2007
* Refactored 4 Jan 2007
* Small improvements
* Publish single tiddlers
* Template placeholder %7 for tiddler's wiki text

!Code
***/
//{{{
version.extensions.doPublish = {
 major: 2,
 minor: 4,
 revision: 1,
 date: new Date("July 2, 2008")
};
config.macros.doPublish = {
 label: "publish",
 prompt: "Publish Tiddlers as HTML files"
};
if (config.options.txtPublishTags == undefined) config.options.txtPublishTags = "Publish";
config.shadowTiddlers.PublishTemplateHead = '<title>%0 - %1</title>\n<link rel="stylesheet" type="text/css" href="style.css"/>\n<meta name="keywords" content="%3"/>'
config.shadowTiddlers.PublishTemplateBody = '<div class=\'viewer\' id=\'contentWrapper\'><small><a href=\"./publish/index.html\">Home</a> > %1</small><h1>%0</h1>\n<h2>%1</h2>\n%2\n<hr>Tags: %3\n<hr>%4, %5&nbsp;(created %6)\n</div>\n'
config.shadowTiddlers.PublishTemplateBodySingle = '<h1>%0</h1>\n<h2>%1</h2>\n%2\n<hr>Tags: %3\n<hr>%4, %5&nbsp;(created %6)\n</div>\n'
config.shadowTiddlers.PublishIndexTemplate = '<div class=\'viewer\' id=\'contentWrapper\'><small><a href="./publish/index.html">Home</a> > %1</small><h1>%0</h1><h2>%1</h2>\n<ul>%2\n</ul>\n<small>Published: %6</small>\n</div>\n';
config.macros.doPublish.handler = function(place)
 {
 if (!readOnly)
 createTiddlyButton(place, this.label, this.prompt, 
 function() {
  doPublish();
  return false;
 },
 null, null, this.accessKey);

}
config.macros.publishTiddler = {
 label : 'publish',
 prompt : 'Publish this tiddler as an HTML file.',
 handler : function(place,macroName,params,wikifier,paramString,tiddler)
 {
  var btn = createTiddlyButton(place, this.label, this.prompt, 
  function(e) {
   if(!e) var e = window.event;
   publishTiddler(this.getAttribute('tiddler'))
   return false;
  },
  null, null, this.accessKey);
  btn.setAttribute('tiddler', tiddler.title);
}}
config.commands.publishTiddler = {handler : function(event,src,title) {publishTiddler(title);},text: "publish", tooltip: "Publish this tiddler as HTML"};
function publishTiddler(title) {
 //debugger
 
 var PublishFolder = getWikiPath('publish');
 var place = document.getElementById(story.container)
 var HTMLTemplateHead = store.getTiddlerText("PublishTemplateHead");
 var HTMLTemplateBody = store.getTiddlerText("PublishTemplateBodySingle") || store.getTiddlerText("PublishTemplateBody");
 HTMLTemplateBody = renderTemplate(HTMLTemplateBody)
 HTMLTemplateBody = wiki2Web(HTMLTemplateBody);
 
 var tiddler = store.getTiddler(title);
 var tiddlerText = store.getValue(tiddler, 'text');
 var tiddlerHTML = wikifyStatic(tiddlerText);
 var HTML = '<html>\n\<head>\n' + HTMLTemplateHead + '\n</head>\n<body>\n' + HTMLTemplateBody + '\n</body>\n</html>';
 HTML = HTML.format([
  wikifyPlain("SiteTitle").htmlEncode(), 
  tiddler.title.htmlEncode(), 
  wiki2Web(tiddlerHTML), 
  tiddler.tags.join(", "), 
  tiddler.modifier, 
  tiddler.modified.toLocaleString(), 
  tiddler.created.toLocaleString(),
  tiddlerText
 ]);
 saveFile(PublishFolder + tiddler.title.filenameEncode() + ".html", HTML);
 //story.closeTiddler(tiddler.title);
 var indexWin = window.open((PublishFolder + title.filenameEncode() + ".html").replace(/\\/g, "/"), null);
 indexWin.focus();
}
function doPublish() {
 var savedTiddlers = [];
 var tiddlers = store.getTiddlers("title");
 var place = document.getElementById(story.container)
 var HTMLTemplateHead = store.getTiddlerText("PublishTemplateHead");
 var HTMLTemplateBody = store.getTiddlerText("PublishTemplateBody");
 HTMLTemplateBody = renderTemplate(HTMLTemplateBody)
 HTMLTemplateBody = wiki2Web(HTMLTemplateBody);

 var PublishTags = config.options.txtPublishTags || "publish";
 PublishTags = PublishTags.split(",")
 var PublishFolder = getWikiPath('publish');
 if (!PublishFolder) return;
 var indexFile = "";

 var indexFileTemplate = store.getTiddlerText("PublishIndexTemplate");
 // This does not allow <<myMacro>> but wants <div macro="myMacro">
 indexFileTemplate = renderTemplate(indexFileTemplate)
 // This option allows WIKI-syntax but is limited in it's HTML capabilities
 //indexFileTemplate = wikifyStatic(indexFileTemplate)

 for (var t = 0; t < tiddlers.length; t++) {
  var tiddler = tiddlers[t];
  if (tiddler.tags.containsAny(PublishTags)) {
   var tiddlerText = store.getValue(tiddler, 'text');
   var tiddlerHTML = wikifyStatic(tiddlerText);
   var HTML = '<html>\n\<head>\n' + HTMLTemplateHead + '\n</head>\n<body>\n' + HTMLTemplateBody + '\n</body>\n</html>';
   HTML = HTML.format([
   wikifyPlain("SiteTitle").htmlEncode(), 
   tiddler.title.htmlEncode(), 
   wiki2Web(tiddlerHTML), 
   tiddler.tags.join(", "), 
   tiddler.modifier, 
   tiddler.modified.toLocaleString(), 
   tiddler.created.toLocaleString(),
  tiddlerText
   ]);
   //saveFile(PublishFolder + tiddler.created.formatString("YYYY0MM0DD") + ".html", HTML);
   saveFile(PublishFolder + tiddler.title.filenameEncode() + ".html", HTML);
   indexFile += "<li><a href=\"" + tiddler.title.filenameEncode() + ".html" + "\" class=\"tiddlyLink tiddlyLinkExisting\">" + tiddler.title + "</a></li>\n";
   story.closeTiddler(tiddler.title);

  }

 }
 indexFileTemplate = '<html>\n\<head>\n' + HTMLTemplateHead + '\n</head>\n<body>\n' + indexFileTemplate + '\n</body>\n</html>';
 indexFileTemplate = indexFileTemplate.format([wikifyPlain("SiteTitle").htmlEncode(), wikifyPlain("SiteSubtitle").htmlEncode(), "%2", "", "", "", (new Date()).toLocaleString()])

 indexFile = indexFileTemplate.replace("%2", indexFile)
 indexFile = wiki2Web(indexFile);
 saveFile(PublishFolder + "index.html", indexFile)
 saveFile(PublishFolder + "style.css", store.getTiddlerText("StyleSheet") + store.getTiddlerText("StyleSheetLayout") + store.getTiddlerText("StyleSheetColors"))
 var indexWin = window.open("file://" + PublishFolder.replace(/\\/g, "/") + "index.html", null);
 indexWin.focus();

}

function renderTemplate(html) {
 var result = document.createElement("div");
 result.innerHTML = html;
 applyHtmlMacros(result, null);
 var temp = result.innerHTML;
 //result.parentNode.removeChild(result);
 return temp;

}

// Convert wikified text to html
function wiki2Web(wikiHTML) {
 //var regexpLinks = new RegExp("<a tiddlylink=.*?</a>", "img");
 var regexpLinks = /<a[^>]+tiddlylink\s*=\s*["']?\s*?([^ "'>]*)\s*["']?[^>]*>[^<]+<\/a>/img;
 var result = wikiHTML.match(regexpLinks);
 if (result) {
  for (i = 0; i < result.length; i++) {
   var className = result[i].match(/ class="(.*?)"/i) ? result[i].match(/ class="(.*?)"/i)[1] : "";
   var tiddlerName = result[i].match(/ tiddlylink="(.*?)"/i)[1]; 
   var url = tiddlerName.htmlDecode().filenameEncode() + ".html"; 
   var tiddlerLabel = result[i].match(/">(.*?)<\/a>/i)[1]; 
   if (!className.match(/tiddlyLinkNonExisting/i)) 
   wikiHTML = wikiHTML.myReplace(result[i], "<a class=\"" + className + "\" href=\"" + url + "\">" + tiddlerLabel + "</a>"); 
   else
   wikiHTML = wikiHTML.myReplace(result[i], "<a class=\"" + className + "\" title=\"Page does not exist\" href=\"#\">" + tiddlerName + "</a>");

  }
  wikiHTML = wikiHTML.replace(/ href="http:\/\//gi, " target=\"_blank\" href=\"http://");

 }
 return wikiHTML

}
function getWikiPath(folderName) {
 var originalPath = document.location.toString();
 if (originalPath.substr(0, 5) != 'file:') {
  alert(config.messages.notFileUrlError);
  if (store.tiddlerExists(config.messages.saveInstructions))
  story.displayTiddler(null, config.messages.saveInstructions);
  return;

 }
 var localPath = getLocalPath(originalPath);
 var backSlash = localPath.lastIndexOf('\\') == -1 ? '/': '\\';
 var dirPathPos = localPath.lastIndexOf(backSlash);
 var subPath = localPath.substr(0, dirPathPos) + backSlash + (folderName ? folderName + backSlash: '');
 return subPath;

}

// Replace without regex
String.prototype.myReplace = function(sea, rep) {
 var t1 = this.indexOf(sea);
 var t2 = parseInt(this.indexOf(sea)) + parseInt(sea.length);
 var t3 = this.length;
 return this.substring(0, t1) + rep + this.substring(t2, t3)

}
// Convert illegal characters to underscores
String.prototype.filenameEncode = function()
 {
 return (this.toLowerCase().replace(/[^a-z0-9_-]/g, "_"));

}
//}}}