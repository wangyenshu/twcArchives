/***
|Name|HaloscanMacro|
|Created by|JimSpeth|
|Location|http://end.com/~speth/HaloscanMacro.html|
|Version|1.1.0|
|Requires|~TW2.x|

!Description
Comment and trackback support for TiddlyWiki (via Haloscan).

!History
* 16-Feb-06, version 1.1.0, drastic changes, now uses settings from haloscan account config
* 31-Jan-06, version 1.0.1, fixed display of counts for default tiddlers
* 30-Jan-06, version 1.0, initial release

!Examples
|!Source|!Output|h
|{{{<<haloscan comments>>}}}|<<haloscan comments>>|
|{{{<<haloscan trackbacks>>}}}|<<haloscan trackbacks>>|

!Installation
Register for a [[Haloscan|http://www.haloscan.com]] account.  It's free and painless.
Install the HaloscanMacro in a new tiddler with a tag of systemConfig (save and reload to activate).
In the macro configuration code (below), change //YourName// to your Haloscan account name.
Use the macro somewhere in a tiddler (see ViewTemplate for an example).

!Settings
You can adjust various options for your account in the member configuration area of Haloscan's web site.  The macro will use these settings when formatting the links.

!Code
***/
//{{{

/* Set account to your Haloscan account name and idPrefix to a prefix unique to TiddlyWiki for this account. */
config.macros.haloscan = {account: "conal", idPrefix: "Conal's Journal", baseURL: "http://www.haloscan.com/load/"};

var haloscanLoaded = 0;
config.macros.haloscan.load = function ()
{
    if (haloscanLoaded == 1)
        return;
    
    account = config.macros.haloscan.account;
    if (!account || (account == "YourName"))
        account = store.getTiddlerText("SiteTitle");
    
    var el = document.createElement('script');
    el.language = 'JavaScript'; 
    el.type = 'text/javascript'; 
    el.src = config.macros.haloscan.baseURL + account;
    document.documentElement.childNodes[0].appendChild(el);
    
    haloscanLoaded = 1;
}
config.macros.haloscan.load();

/* this totally clobbers document.write, i hope that's ok */
var safeWrite = function(s)
{
    document.written = s;
    return s;
};
document.write = safeWrite;

config.macros.haloscan.refreshDefaultTiddlers = function ()
{
    var start = store.getTiddlerText("DefaultTiddlers");
    if (start)
    {
        var titles = start.readBracketedList();
        for (var t=titles.length-1; t>=0; t--)
            story.refreshTiddler(titles[t], DEFAULT_VIEW_TEMPLATE, 1);
    }
}

var haloscanRefreshed = 0;
config.macros.haloscan.handler = function (place, macroName, params, wikifier, paramString, tiddler)
{
    if (typeof HaloScan == 'undefined')
    {
        if (haloscanRefreshed == 0)
        {
            setTimeout("config.macros.haloscan.refreshDefaultTiddlers()", 1);
            haloscanRefreshed = 1;
        }
        return;
    }
    
    var id = story.findContainingTiddler(place).id.substr(7);
    // conal: commenting out the next two lines makes comment-finding work when the tiddler title contains hyphens.  The 
    // Haloscan and HaloscanTB functions already do this replacement.  I don't know why removing the redundant replace helps.
    // var hs_search = new RegExp('\\W','gi');
    // id = id.replace(hs_search,"_");
    // conal: Prepend idPrefix to make sure different TWs get different comment ids.
    id = config.macros.haloscan.idPrefix + ' tiddler ' + id
    
    account = config.macros.haloscan.account;
    if (!account || (account == "YourName"))
        account = store.getTiddlerText("SiteTitle");
    
    var haloscanError = function (msg)
    {
        createTiddlyError(place, config.messages.macroError.format(["HaloscanMacro"]), config.messages.macroErrorDetails.format(["HaloscanMacro", msg]));
    }
    
    if (params.length == 1)
    {
        if (params[0] == "comments")
        {
            postCount(id);
            commentsLabel = document.written;
            commentsPrompt = "Comments on this tiddler";
            var commentsHandler = function(e) { HaloScan(id); return false; };
            var commentsButton = createTiddlyButton(place, commentsLabel, commentsPrompt, commentsHandler);
        }
        else if (params[0] == "trackbacks")
        {
            postCountTB(id);
            trackbacksLabel = document.written;
            trackbacksPrompt = "Trackbacks for this tiddler";
            var trackbacksHandler = function(e) { HaloScanTB(id); return false; };
            var trackbackButton = createTiddlyButton(place, trackbacksLabel, trackbacksPrompt, trackbacksHandler);
        }
        else
            haloscanError("unknown parameter: " + params[0]);
    }
    else if (params.length == 0)
        haloscanError("missing parameter");
    else
        haloscanError("bad parameter count");
}

//}}}
