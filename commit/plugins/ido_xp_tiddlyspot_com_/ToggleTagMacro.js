/***
Examples:

|Code|Description|Example|h
|{{{<<toggleTag>>}}}|Toggles the default tag (checked) in this tiddler|<<toggleTag>>|
|{{{<<toggleTag TagName>>}}}|Toggles the TagName tag in this tiddler|<<toggleTag TagName>>|
|{{{<<toggleTag TagName TiddlerName>>}}}|Toggles the TagName tag in the TiddlerName tiddler|<<toggleTag TagName TiddlerName>>|
|{{{<<toggleTag TagName TiddlerName nolabel>>Click me}}}|Same but hide the label|<<toggleTag TagName TiddlerName nolabel>>Click me|
(Note if TiddlerName doesn't exist it will be silently created)

!Known issues
* Doesn't smoothly handle the case where you toggle a tag in a tiddler that is current open for editing. Should it stick the tag in the edit box?

!Code
***/
//{{{


// This function contributed by Eric Shulman
function toggleTag(title,tag) {
 var t=store.getTiddler(title); if (!t || !t.tags) return;
 if (t.tags.find(tag)==null) t.tags.push(tag)
 else t.tags.splice(t.tags.find(tag),1)
}

// This function contributed by Eric Shulman
function isTagged(title,tag) {
 var t=store.getTiddler(title); if (!t) return false;
 return (t.tags.find(tag)!=null);
}

config.macros.toggleTag = {};
config.views.wikified.toggleTag = {fulllabel: "[[%0]] [[%1]]", shortlabel: "[[%0]]", nolabel: "" };

config.macros.toggleTag.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
 if(tiddler instanceof Tiddler) {
 var tag = (params[0] && params[0] != '.') ? params[0] : "checked";
 var title = (params[1] && params[1] != '.') ? params[1] : tiddler.title;
 var hidelabel = params[2]?true:false;

 var onclick = function(e) {
 if (!e) var e = window.event;
 if (!store.getTiddler(title))
 store.saveTiddler(title,title,"",config.options.txtUserName,new Date(),null);
 toggleTag(title,tag);

 store.setDirty(true); // so TW knows it has to save now

 story.forEachTiddler(function(title,element) {
   if (element.getAttribute("dirty") != "true") 
     story.refreshTiddler(title,false,true);
 });

 return false;
 };

 var lingo = config.views.wikified.toggleTag;

 // this part also contributed by Eric Shulman
 var c = document.createElement("input");
 c.setAttribute("type","checkbox");
 c.onclick=onclick;
 place.appendChild(c);
 c.checked=isTagged(title,tag);

 if (!hidelabel) {
 var label = (title!=tiddler.title)?lingo.fulllabel:lingo.shortlabel;
 wikify(label.format([tag,title]),place);
 }
 }
}

//}}}
