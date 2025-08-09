/***
|''Name:''|ResizeEditorPlugin|
|''Source:''|http://www.TiddlyTools.com/#ResizeEditorPlugin|
|''Author:''|Eric Shulman - ELS Design Studios|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|''~CoreVersion:''|2.0.10|

Adds toolbar commands for use in EditTemplate to permit on-the-fly adjustment of the tiddler editor text area height:
* ''autosizeTiddler'' - toggles the tiddler editor textarea height between standard height and "automatically fit the contents".
* ''resizeTiddler'' - prompts for number of lines of text to display
* ''decreaseTiddler'' - reduce text area height by 5 lines
* ''increaseTiddler'' - increase text area height by 5 lines

!!!!!Installation
<<<
import (or copy/paste) the following tiddlers into your document:
''ResizeEditorPlugin'' (tagged with <<tag systemConfig>>)

If you are using the default (shadow) EditTemplate, the plugin automatically updates the template to include all four commands in the editor toolbar.  If you have created a custom EditTemplate tiddler, you will need to manually add the desired toolbar commands (listed above) to your existing template definition.
<<<
!!!!!Revisions
<<<
''2006.10.18 [1.2.3]'' added decreaseEditor and increaseEditor commands
''2006.10.18 [1.2.2]'' onkeypress handling to redirect PGUP/PGDN to window.scrollByPages() (works in FF, but not yet in IE)
''2006.10.18 [1.2.1]'' fixed references to default string constants (oops!)
''2006.10.18 [1.2.0]'' renamed 'resizeEditor' to 'autosizeEditor' and added new 'resizeEditor' toolbar command to prompt for # of rows to display
''2006.10.02 [1.1.1]'' show checkbox in button label (when automatic resizing is enabled)
''2006.10.01 [1.1.0]'' added 'onkeyup' automatic fit-to-contents handling
''2006.09.30 [1.0.0]'' initial release
<<<
!!!!!Credits
>This feature was developed by EricShulman from [[ELS Design Studios|http://www.elsdesign.com]]
!!!!!Code
***/
//{{{
version.extensions.resizeEditor = {major: 1, minor: 2, revision: 3, date: new Date(2006,10,18)};

config.commands.autosizeEditor = {
	text: 'autosize',
	tooltip: 'adjust the editor height to fit the contents',
	text_alt: '<input type="checkbox" style="padding:0;margin:0;border:0;background:transparent;" checked>autosize',
	tooltip_alt: 'uncheck to reset the editor to the standard height',
	hideReadOnly: false,
	handler: function(event,src,title) {
		var here=story.findContainingTiddler(src); if (!here) return;
		var ta=here.getElementsByTagName('textarea'); if (!ta) return;
		for (i=0;i<ta.length;i++) {
			if (ta[i].maxed) {
				ta[i].style.height=ta[i].savedheight;
				ta[i].onkeyup=ta[i].savedkeyup;
				ta[i].onkeypress=ta[i].savedkeypress;
				src.innerHTML=config.commands.autosizeEditor.text;
				src.title=config.commands.autosizeEditor.tooltip;
			}
			else {
				if (!ta[i].savedheight) ta[i].savedheight=ta[i].style.height;
				if (!ta[i].savedkeyup) ta[i].savedkeyup=ta[i].onkeyup;
				if (!ta[i].savedkeypress) ta[i].savedkeyup=ta[i].onkeypress;
				// NOTE "-2" adjustment...  for top+bottom border width???
				ta[i].style.height=ta[i].scrollHeight-2+'px';
				ta[i].onkeypress=function(ev) {
					if (!ev) var ev=window.event; var e=resolveTarget(ev);
					if (ev.keyCode==33) { // PGUP
						if (window.scrollByPages) window.scrollByPages(-1);
						return false;
					}
					if (ev.keyCode==34) { // PGDN
						if (window.scrollByPages) window.scrollByPages(1);
						return false;
					}
					if (e.savedkeypress) e.savedkeypress();
				}
				ta[i].onkeyup=function(ev) {
					if (!ev) var ev=window.event; var e=resolveTarget(ev);
					e.style.height=e.scrollHeight-2+'px';
					if (e.savedkeyup) e.savedkeyup();
				}
				src.innerHTML=config.commands.autosizeEditor.text_alt;
				src.title=config.commands.autosizeEditor.tooltip_alt;
			}
			ta[i].maxed=!ta[i].maxed;
		}
		return false;
	}
};

config.commands.resizeEditor = {
	text: '=',
	tooltip: 'set the number of lines displayed in the editor',
	askmsg: 'Enter the number of lines of text to display',
	hideReadOnly: false,
	handler: function(event,src,title) {
		var here=story.findContainingTiddler(src); if (!here) return;
		var ta=here.getElementsByTagName('textarea'); if (!ta) return;
		// ask for new size, default to height of first text area in editor (usually only one text area)
		var newsize=prompt(config.commands.resizeEditor.askmsg,ta[0].rows);
		if (!newsize || newsize===0) return false; // cancelled by user
		for (i=0;i<ta.length;i++) ta[i].rows=newsize;
		return false;
	}
};

config.commands.increaseEditor = {
	text: '+',
	tooltip: 'increase the size of the editor',
	step: 5,
	hideReadOnly: false,
	handler: function(event,src,title) {
		var here=story.findContainingTiddler(src); if (!here) return;
		var ta=here.getElementsByTagName('textarea'); if (!ta) return;
		var step=config.commands.increaseEditor.step;
		for (i=0;i<ta.length;i++) ta[i].rows+=step;
		return false;
	}
};

config.commands.decreaseEditor = {
	text: '\u2013', // &endash;
	tooltip: 'decrease the size of the editor',
	step: 5,
	hideReadOnly: false,
	handler: function(event,src,title) {
		var here=story.findContainingTiddler(src); if (!here) return;
		var ta=here.getElementsByTagName('textarea'); if (!ta) return;
		var step=config.commands.increaseEditor.step;
		for (i=0;i<ta.length;i++) ta[i].rows=ta[i].rows>step?ta[i].rows-step:step;
		return false;
	}
};

// automatically tweak shadow EditTemplate to add "resizeEditor and autosizeEditor" (and "copyTiddler") to toolbar
config.shadowTiddlers.EditTemplate = "<div class='toolbar' macro='toolbar +saveTiddler -cancelTiddler copyTiddler deleteTiddler autosizeEditor increaseEditor decreaseEditor resizeEditor'></div>\n<div class='title' macro='view title'></div>\n<div class='editor' macro='edit title'></div>\n<div class='editor' macro='edit text'></div>\n<div class='editor' macro='edit tags'></div>\n<div class='editorFooter'>\n<span macro='message views.editor.tagPrompt'></span>\n<span macro='tagChooser'></span>\n</div>";

//}}}