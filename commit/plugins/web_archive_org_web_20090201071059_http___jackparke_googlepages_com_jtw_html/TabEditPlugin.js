/***
|Name|TabEditPlugin|
|Created by|SaqImtiaz|
|Location|http://lewcid.googlepages.com/lewcid.html#TabEditPlugin|
|Version|0.32|
|Requires|~TW2.x|

!Description
Makes editing of tabs easier.

!Usage
*Double click a tab to edit the source tiddler
*Double click outside the tabset to edit the containing tiddler. 

!Demo
TestTabs

!History
*28-04-06, v0.32 - fixed previous bug fix!
*27-04-06, v0.31 - fixed conflicts with tabs created using PartTiddler.
*26-04-06, v0.30 - first public release

***/

//{{{

//tab on double click event handler
Story.prototype.onTabDblClick = function(e){
 if (!e) var e = window.event;
 var theTarget = resolveTarget(e);
 var title= this.getAttribute("source");
 if ((version.extensions.PartTiddlerPlugin)&&(title.indexOf("/")!=-1))
 {if (!oldFetchTiddler.call(this, [title]))
 {return false;}} 
 story.displayTiddler(theTarget,title,2,false,null)
 e.cancelBubble = true;
 if (e.stopPropagation) e.stopPropagation();
 return false;
 }

config.macros.tabs.switchTab = function(tabset,tab)
{
 var cookie = tabset.getAttribute("cookie");
 var theTab = null
 var nodes = tabset.childNodes;
 for(var t=0; t<nodes.length; t++)
 if(nodes[t].getAttribute && nodes[t].getAttribute("tab") == tab)
 {
 theTab = nodes[t];
 theTab.className = "tab tabSelected";
 }
 else
 nodes[t].className = "tab tabUnselected"
 if(theTab)
 {
 if(tabset.nextSibling && tabset.nextSibling.className == "tabContents")
 tabset.parentNode.removeChild(tabset.nextSibling);
 var tabContent = createTiddlyElement(null,"div",null,"tabContents",null);
 tabset.parentNode.insertBefore(tabContent,tabset.nextSibling);
 var contentTitle = theTab.getAttribute("content");

 //set source attribute equal to title of tiddler displayed in tab
 tabContent.setAttribute("source",contentTitle);
 //add dbl click event
 tabContent.ondblclick = story.onTabDblClick;

 wikify(store.getTiddlerText(contentTitle),tabContent,null,store.getTiddler(contentTitle));
 if(cookie)
 {
 config.options[cookie] = tab;
 saveOptionCookie(cookie);
 }
 }
}

//}}}