/***
|''Name:''|Based on CollapseTiddlersPlugin|
|''Source:''|http://gensoft.revhost.net/Collapse.html|
|''Author:''|Bradley Meck|
|''License:''|unknown|
|''~CoreVersion:''|2.0.10|

|JOS 9/14/2006: changed text for 'collapse all' and 'expand all' to lower-case (consistency's sake); cleanned-up syntax (readability's sake) |
|JOS 9/14/2006: removed "WebCollapsedTemplate" altogether; added compat code for topOfPageMode; added tool tips for collapseAll and expandAll |
|ELS 2/24/2006: added fallback to "CollapsedTemplate if "WebCollapsedTemplate" is not found |
|ELS 2/6/2006: added check for 'readOnly' flag to use alternative "WebCollapsedTemplate" |
***/
//{{{
config.commands.collapseTiddler = {
  text: "fold",
  tooltip: "Collapse this tiddler",
  handler: function(event,src,title){
    var e = story.findContainingTiddler(src);
    var t = "CollapsedTemplate";
    if (!store.tiddlerExists(t)) { alert("Can't find 'CollapsedTemplate'"); return; }
    if (config.options.chkTopOfPageMode!=undefined) {
      var pm=config.options.chkTopOfPageMode;
      config.options.chkTopOfPageMode=false;
    }
    if(e.getAttribute("template") != config.tiddlerTemplates[DEFAULT_EDIT_TEMPLATE]){
      if(e.getAttribute("template") != t ){
        e.setAttribute("oldTemplate",e.getAttribute("template"));
        story.displayTiddler(null,title,t);
      }
    }
    if (config.options.chkTopOfPageMode!=undefined) config.options.chkTopOfPageMode=pm;
  }
}

config.commands.expandTiddler = {
  text: "unfold",
  tooltip: "Expand this tiddler",
  handler: function(event,src,title){
    if (config.options.chkTopOfPageMode!=undefined) {
      var pm=config.options.chkTopOfPageMode;
      config.options.chkTopOfPageMode=false;
    }
    var e = story.findContainingTiddler(src);
    story.displayTiddler(null,title,e.getAttribute("oldTemplate"));
    if (config.options.chkTopOfPageMode!=undefined) config.options.chkTopOfPageMode=pm;
  }
}

config.macros.collapseAll = {
  handler: function(place,macroName,params,wikifier,paramString,tiddler){
    createTiddlyButton(place,"collapse all","Collapse all tiddlers",function(){
                         var t = "CollapsedTemplate";
                         if (!store.tiddlerExists(t)) { alert("Can't find 'CollapsedTemplate'"); return; }
                         if (config.options.chkTopOfPageMode!=undefined) {
                           var pm=config.options.chkTopOfPageMode;
                           config.options.chkTopOfPageMode=false;
                         }
                         story.forEachTiddler(function(title,tiddler){
                                                if(tiddler.getAttribute("template") != config.tiddlerTemplates[DEFAULT_EDIT_TEMPLATE])
                                                  story.displayTiddler(null,title,t);
                                              })
                           if (config.options.chkTopOfPageMode!=undefined) config.options.chkTopOfPageMode=pm;
                       })
  }
}

config.macros.expandAll = {
  handler: function(place,macroName,params,wikifier,paramString,tiddler){
    createTiddlyButton(place,"expand all","",function(){
                         var t = "CollapsedTemplate";
                         if (!store.tiddlerExists(t)) { alert("Can't find 'CollapsedTemplate'"); return; }
                         if (config.options.chkTopOfPageMode!=undefined) {
                           var pm=config.options.chkTopOfPageMode;
                           config.options.chkTopOfPageMode=false;
                         }
                         story.forEachTiddler(function(title,tiddler){
                                                if(tiddler.getAttribute("template") == t) story.displayTiddler(null,title,tiddler.getAttribute("oldTemplate"));
                                              })
                           if (config.options.chkTopOfPageMode!=undefined) config.options.chkTopOfPageMode=pm;
                       })
  }
}

config.commands.collapseOthers = {
  text: "focus",
  tooltip: "Expand this tiddler and collapse all others",
  handler: function(event,src,title){
    var e = story.findContainingTiddler(src);
    var t = "CollapsedTemplate";
    if (!store.tiddlerExists(t)) { alert("Can't find 'CollapsedTemplate'"); return; }
    if (config.options.chkTopOfPageMode!=undefined) {
      var pm=config.options.chkTopOfPageMode;
      config.options.chkTopOfPageMode=false;
    }
    story.forEachTiddler(function(title,tiddler){
                           if(tiddler.getAttribute("template") != config.tiddlerTemplates[DEFAULT_EDIT_TEMPLATE]){
                             if (tiddler!=e) story.displayTiddler(null,title,t);
                           }
                         })
    if (config.options.chkTopOfPageMode!=undefined) config.options.chkTopOfPageMode=pm;
  }
}
//}}}
