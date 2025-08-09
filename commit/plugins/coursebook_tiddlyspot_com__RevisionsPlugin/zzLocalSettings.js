/***
See also [[StorySaverPluginConfig]].
***/
/***
! Implementing excludeOrphans

Add the functionality for an excludeOrphans tag similar to excludeMissing. When a tiddler is tagged with excludeOrphans, it won't be shown as an orphan even if there are no referrers to it. It's used to allow top level tiddlers (like story tiddlers) to be referenced by the result of a search rather thanhard coded into tiddlers.

Ideas from: [[Searching for excludeOrphans tag functionality|http://groups.google.com/group/TiddlyWiki/browse_thread/thread/39f7be322883586e/2a19fc0a30a6c3ee]].
***/
//{{{
var orig = TiddlyWiki.prototype.getOrphans;
TiddlyWiki.prototype.getOrphans = function() {
     var results = [];
     var orphans = orig.apply(this, arguments);

     for (var i=0;i<orphans.length;i++) {
       var title = orphans[i];
       var tiddler = store.getTiddler(title); 
       if(this.getReferringTiddlers(title).length == 0 &&
             !tiddler.isTagged("excludeLists") &&
             !tiddler.isTagged("excludeOrphans")) {
                        results.push(title);
         }
     }
     results.sort();
     return results;
}; 
//}}}

/***
! Set the shadow DefaultTiddlers for Coursebook

Set the Welcome tiddler as the default tiddlers when student coursebook opens.
Set a default Instructor main menu to suppress missing tiddler report when editing
coursebook with instructor/editing style sheet and macro definitions.
***/
//{{{
config.shadowTiddlers.DefaultTiddlers = "[[Welcome]]";
config.shadowTiddlers.InstructorMainMenu = "";
//}}}

/***
! Make Unsaved Changes active in the SideBarOptions

Add call to < <unsavedChanges command> > to sidebar right before saveChanges
***/
//{{{
config.shadowTiddlers.SideBarOptions=config.shadowTiddlers.SideBarOptions.replace('<<saveChanges>>','<<unsavedChanges command>><<saveChanges>>');
//}}}

/***
! Closing a tiddler moves back to tiddler that it was linked from

From http://groups.google.com/group/tiddlywiki/browse_thread/thread/05719eb737c9ae22/fa2cff7e65fa2cb8?#fa2cff7e65fa2cb8:
{{{
From: FND <F...@gmx.net>
Date: Thu, 03 Sep 2009 17:44:55 +0100
Local: Thurs, Sep 3 2009 12:44 pm 
Subject: Re: [tw] Re: Close tiddler and go back to the one which opened it? Any thoughts?
Reply | Reply to author | Forward | Print | Individual message | Show original | Report this message | Find messages by this author 
You could try this quick hack: 
--------------- 
}}}
***/
//{{{
(function() {

var _closeTiddler = config.commands.closeTiddler.handler;
config.commands.closeTiddler.handler = function(event, src, title) {
     var tiddlerElem = story.getTiddler(title);
     var origin = tiddlerElem.getAttribute("origin");
     origin = tiddlerElem ? story.getTiddler(origin) : null;
     var status = _closeTiddler.apply(this, arguments);
     if(origin) {
         if(config.options.chkAnimate) {
             anim.startAnimating(new Zoomer(title, tiddlerElem, origin),
                 new Scroller(origin));
         } else {
             window.scrollTo(0,ensureVisible(origin));
         }
     }
     return status;

};

var _onClickTiddlerLink = onClickTiddlerLink;
onClickTiddlerLink = function(ev) {
     var status = _onClickTiddlerLink.apply(this, arguments);
     var target = resolveTarget(ev || window.event);
     var link = target;
     do {
         title = link.getAttribute("tiddlyLink");
         link = link.parentNode;
     } while(title === null && link !== null);
     var el = story.getTiddler(title);
     var origin = story.findContainingTiddler(target);
     origin = origin ? origin.getAttribute("tiddler") : null;
     el.setAttribute("origin", origin);
     return status;

};
})();
//}}}

/***
! Set an off mode for the Tabs in the sidebar

***/
//{{{
config.shadowTiddlers.SideBarTabs=config.shadowTiddlers.SideBarTabs.replace('<<tabs txtMainTab','<<tabs txtMainTab "Off" "A blank tab" ""');

//}}}

/***
! Define isFirefox config.browser option

To determine if this is running within firefox.
***/
//{{{
config.browser.isFirefox = navigator.userAgent.indexOf('Firefox') != -1;
//}}}