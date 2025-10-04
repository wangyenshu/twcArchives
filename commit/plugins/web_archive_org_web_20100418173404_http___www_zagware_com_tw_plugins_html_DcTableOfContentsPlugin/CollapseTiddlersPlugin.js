/***
|Name|CollapseTiddlersPlugin|
|Created by|Bradley Meck|
|Location|http://gensoft.revhost.net/Collapse.html|

!History
* ELS 2/24/2006: added fallback to "CollapsedTemplate if "WebCollapsedTemplate" is not found
* ELS 2/6/2006: added check for 'readOnly' flag to use alternative "WebCollapsedTemplate"

***/

//{{{

version.extensions.ExtensionsPlugin = {
    major: 0, minor: 0, revision: 0,
    date: new Date(2006, 2, 24), 
    type: 'macro',
    source: "http://gensoft.revhost.net/Collapse.html"
};

config.commands.collapseTiddler = {
    text: "fold",
    tooltip: "Collapse this tiddler",
    handler: function(event, src, title) {
        var e = story.findContainingTiddler(src);
        if(e.getAttribute("template") != config.tiddlerTemplates[DEFAULT_EDIT_TEMPLATE]){
            var t = (readOnly && store.tiddlerExists("WebCollapsedTemplate")) ? "WebCollapsedTemplate" : "CollapsedTemplate";
            if (! store.tiddlerExists(t)) {
                alert("Can't find 'CollapsedTemplate'");
                return;
            }
            if(e.getAttribute("template") != t ){
                e.setAttribute("oldTemplate", e.getAttribute("template"));
                story.displayTiddler(null, title, t);
            }
        }
    }
}

config.commands.expandTiddler = {
    text: "unfold",
    tooltip: "Expand this tiddler",
    handler: function(event,src,title) {
        var e = story.findContainingTiddler(src);
        story.displayTiddler(null,title,e.getAttribute("oldTemplate"));
    }
}

config.macros.collapseAll = {
    handler: function(place,macroName,params,wikifier,paramString,tiddler) {
        createTiddlyButton(place,"Collapse All","",function(){
            story.forEachTiddler(function(title,tiddler){
            if(tiddler.getAttribute("template") != config.tiddlerTemplates[DEFAULT_EDIT_TEMPLATE])
                var t = (readOnly&&store.tiddlerExists("WebCollapsedTemplate"))?"WebCollapsedTemplate":"CollapsedTemplate";
                if (!store.tiddlerExists(t)) { alert("Can't find 'CollapsedTemplate'"); return; }
                story.displayTiddler(null,title,t);
            })
        })
    }
}

config.macros.expandAll = {
    handler: function(place,macroName,params,wikifier,paramString,tiddler) {
        createTiddlyButton(place,"Expand All","",function(){
            story.forEachTiddler(function(title,tiddler){
                var t = (readOnly&&store.tiddlerExists("WebCollapsedTemplate"))?"WebCollapsedTemplate":"CollapsedTemplate";
                if (!store.tiddlerExists(t)) { alert("Can't find 'CollapsedTemplate'"); return; }
                if(tiddler.getAttribute("template") == t) story.displayTiddler(null,title,tiddler.getAttribute("oldTemplate"));
            })
        })
    }
}

config.commands.collapseOthers = {
    text: "focus",
    tooltip: "Expand this tiddler and collapse all others",
    handler: function(event,src,title) {
        var e = story.findContainingTiddler(src);
        story.forEachTiddler(function(title,tiddler){
            if(tiddler.getAttribute("template") != config.tiddlerTemplates[DEFAULT_EDIT_TEMPLATE]){
                var t = (readOnly&&store.tiddlerExists("WebCollapsedTemplate"))?"WebCollapsedTemplate":"CollapsedTemplate";
                if (!store.tiddlerExists(t)) { alert("Can't find 'CollapsedTemplate'"); return; }
                if (e==tiddler) t=e.getAttribute("oldTemplate");
                //////////
                // ELS 2006.02.22 - removed this line.  if t==null, then the *current* view template, not the default "ViewTemplate", will be used.
                // if (!t||!t.length) t=!readOnly?"ViewTemplate":"WebViewTemplate";
                //////////
                story.displayTiddler(null,title,t);
            }
        })
    }
} 

//}}}
