/***
|''Name:''|saveClose |
|''Version:''|Revision: 1.1.1, 2006-04-10|
|''Source:''|http://knighjm.googlepages.com/knightnet-default-tw.html|
|''Author:''|[[Julian Knight]]|
|''Type:''|Toolbar Macro Extension|
|''Requires:''|TiddlyWiki 2.0.0 or higher|
!Description
Extends the TiddlyWiki commands for the toolbar macro by adding a button to save and then close the tiddler immediately.
It simply duplicates and mashes the code from the two pre-defined commands SaveTiddler and closeTiddler.
!History
|!2006-04-10 - 1.1.1|Minor improvements to versioning, no code changes, improve description and history|
|!2006-04-07 - 1.1|Amended "source" and move master copy to my Google web space|
|!2006-03-30 - 1.0|First release|
!Useage
Add to your EditTemplate, e.g.:
{{{
<!-- ********* -->
<div class='toolbar' macro='toolbar +saveTiddler saveClose -cancelTiddler deleteTiddler closeTiddler'></div>
}}}
It does a save followed by a close.

!Code
***/
//{{{
version.extensions.saveClose = {
 major: 1, minor: 1, revision: 1, date: new Date("Apr 10, 2006"), type: 'macro',
 source: 'http://knighjm.googlepages.com/knightnet-default-tw.html#saveClose'
};

config.commands.saveClose = {
 text: "save/close", tooltip: "Save then close this tiddler"
}

config.commands.saveClose.handler = function(event,src,title) {
 var newTitle = story.saveTiddler(title,event.shiftKey);
 story.closeTiddler(title,true,event.shiftKey || event.altKey);
 // story.displayTiddler(null,newTitle);
 return false;
}
//}}}
/***
This plugin is released under the "Do whatever you like at your own risk" license.
***/