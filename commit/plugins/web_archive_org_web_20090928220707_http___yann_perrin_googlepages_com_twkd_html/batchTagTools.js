/***
|!''Name:''|!''batchTagTools''|
|''Description:''|These macros are designed to work on the displayed tiddlers tagged with the chosen tag<<br>>.You can see them in action in the tag tab from the content section of TWkd|
|''Version:''|0.1.0|
|''Date:''|27/01/2007|
|''Source:''|http://yann.perrin.googlepages.com/twkd.html#batchTagTools|
|''Author:''|[[Yann Perrin|YannPerrin]]|
|''License:''|[[BSD open source license]]|
|''~CoreVersion:''|2.x|
|''Browser:''|Firefox 1.0.4+; Firefox 1.5; InternetExplorer 6.0|
|''Requires:''|@@color:red;''Batch''@@|
***/
//{{{
config.macros.closeTagged = new TWkd.Batch ("closeTagged", "Close Tagged", "Close Tiddlers tagged with the chosen tag", "Close '%0' Tiddlers", "Close Tiddlers tagged with '%0'", function(tiddler,tag) { if ((!tag)||(tiddler.tags.contains(tag))) story.closeTiddler(tiddler.title,true,false); }, true, "Please enter the tag of your choice");
//}}}
//{{{
config.macros.keepTagged = new TWkd.Batch ("keepTagged",  "Keep Tagged","Close Tiddlers that are not tagged with the chosen tag", "Keep '%0' Tiddlers", "Close Tiddlers that are not tagged with '%0'", function(tiddler,tag) { if ((!tag)||(!tiddler.tags.contains(tag))) story.closeTiddler(tiddler.title,true,false); }, true, "Please enter the tag of your choice");
//}}}
//{{{
config.macros.tagDisplayed = new TWkd.Batch ("tagDisplayed", "New Tag",	"Tag displayed Tiddlers with the chosen tag", "Tag as '%0'", "Tag displayed Tiddlers with '%0'", function(tiddler,tag) { if (!tiddler.isTagged(tag)) { tiddler.tags.push(tag); story.refreshTiddler(tiddler.title,false,true); store.setDirty(true); } },  false, "Please enter the tag of your choice");
//}}}
//{{{
config.macros.untagDisplayed = new TWkd.Batch ("untagDisplayed", "Remove Tag", "remove the chosen tag from displayed Tiddlers", "Remove '%0' Tag", "Remove the '%0' tag from displayed Tiddlers", function(tiddler,tag) { if (tiddler.isTagged(tag)) { tiddler.tags.splice(tiddler.tags.find(tag),1); story.refreshTiddler(tiddler.title,false,true); store.setDirty(true); } }, false, "Please enter the tag of your choice");
//}}}
//{{{
config.macros.deleteTagged = new TWkd.Batch("deleteTagged", "Delete Tagged", "Delete displayed tiddlers tagged with the chosen tag", "Delete '%0' Tiddlers", "Delete diplayed Tiddlers tagged with '%0'", function(tiddler,tag) { if ((!tag)||(tiddler.tags.contains(tag))) {store.removeTiddler(tiddler.title); story.closeTiddler(tiddler.title,true,false); }}, false, "Please enter the tag of your choice");
//}}}