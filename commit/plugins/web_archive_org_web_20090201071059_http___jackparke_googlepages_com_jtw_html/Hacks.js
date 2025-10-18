// // My favorite hacks
// // This makes the tagging macro present a simple list without title
//{{{
config.macros.tagging.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
 var theList = createTiddlyElement(place,"ul");
 var title = "";
 if(tiddler instanceof Tiddler)
 title = tiddler.title;
 if(params[0])
 title = params[0];
 var tagged = store.getTaggedTiddlers(title);
 for(var t=0; t<tagged.length; t++)
 createTiddlyLink(createTiddlyElement(theList,"li"),tagged[t].title,true);
}
//}}}

// // Make the list of tags horizontal
//{{{
config.macros.tags.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
 if(params[0] && store.tiddlerExists(params[0]))
 tiddler = store.getTiddler(params[0]);
 for(var t=0; t<tiddler.tags.length;t++)
 createTagButton(createTiddlyElement(place,"span"),tiddler.tags[t],tiddler.title);
}
//}}}

// // Workarounds for SinglePageModePlugin
//{{{
onClickTagOpenAll = function(e) {
 var oldChkSinglePageMode = config.options.chkSinglePageMode;
 config.options.chkSinglePageMode = false;
 if (!e) var e = window.event;
 var tag = this.getAttribute("tag");
 var tagged = store.getTaggedTiddlers(tag);
 for(var t=tagged.length-1; t>=0; t--)
 story.displayTiddler(this,tagged[t].title,null,false,e.shiftKey || e.altKey);
 config.options.chkSinglePageMode = oldChkSinglePageMode;
 return(false);
}

// // Prevent scrolldown when viewing tiddlers
Story.prototype.displayTiddlerOld = Story.prototype.displayTiddler;
Story.prototype.displayTiddler = function(srcElement,title,template,animate,slowly) {
 this.displayTiddlerOld(srcElement,title,template,animate,slowly);
 if (config.options.chkSinglePageMode) window.scrollTo(0,0);
}

// // Enable search for SinglePageMode
Story.prototype.searchOld = Story.prototype.search;
Story.prototype.search = function(text,useCaseSensitive,useRegExp) {
 var oldChkSinglePageMode = config.options.chkSinglePageMode
 config.options.chkSinglePageMode = false;
 this.searchOld(text,useCaseSensitive,useRegExp);
 config.options.chkSinglePageMode = oldChkSinglePageMode;
 return(false);
}
//}}}

// // Fix for broken file import
//{{{
FileAdaptor.prototype.openHost = function(host,context,userParams,callback)
{
 this.host = host;
 if(!context)
  context = {};
 context.adaptor = this;
 context.callback = callback;
 context.userParams = userParams;
 var str = loadFile(host.replace(/file:\/\//,''),FileAdaptor.openHostCallback,context);
 if (str)
  FileAdaptor.openHostCallback(true,context,str,host,null)
 else
  return "Error loading file " + host;
 return true;
};
//}}}


// // Configurable Search Exclusion Tags
//{{{
TiddlyWiki.prototype.reverseLookup = function(lookupField,lookupValue,lookupMatch,sortField)
{
 if (lookupField=='tags' && lookupValue=='excludeSearch') lookupValue=config.options.txtExcludeSearch;
 var arrLookupValue = lookupValue.readBracketedList();
 var results = [];
 this.forEachTiddler(function(title,tiddler) {
  var f = !lookupMatch;
  for(var lookup=0; lookup<tiddler[lookupField].length; lookup++) {
   if(arrLookupValue.contains(tiddler[lookupField][lookup]))
    f = lookupMatch;
  }
  if(f)
   results.push(tiddler);
 });
 if(!sortField)
  sortField = "title";
 results.sort(function(a,b) {return a[sortField] < b[sortField] ? -1 : (a[sortField] == b[sortField] ? 0 : +1);});
 return results;
};
TiddlyWiki.prototype.search = function(searchRegExp,sortField,excludeTag)
{
 var candidates = this.reverseLookup("tags",excludeTag,false);
 var results = [];
 for(var t=0; t<candidates.length; t++) {
  if((candidates[t].title.search(searchRegExp) != -1) || (candidates[t].text.search(searchRegExp) != -1))
   results.push(candidates[t]);
 }
 if(!sortField)
  sortField = "title";
 results.sort(function(a,b) {return a[sortField] < b[sortField] ? -1 : (a[sortField] == b[sortField] ? 0 : +1);});
 if (results.length == 0 && excludeTag == 'excludeSearch')
  return this.search(searchRegExp,sortField,"");
 else
  return results;
};
//}}}
//{{{
config.commands.refreshTiddler = {
handler : function(event,src,title) {
 story.refreshTiddler(title,event.getAttribute("template"),true);
 return false;
},
text: "refresh",
tooltip: "Refresh this tiddler"
}
;
chkConfirmDelete=false;
//}}}