/***
|''Name''|AddNowCommand|
|''Description''|Opens a tiddler in edit mode and adds "Date and Time" at the end of the text.|
|''Authors''|see Related to|
|''Version''|0.0.3|
|''Date''|2011-06-10|
|''Status''|@@beta@@|
|''Source''|http://hoster.peermore.com/recipes/TeamWork/tiddlers.wiki#AddNowCommand|
|''License''|BSD|
|''CoreVersion''|2.5|
|''Related to''|http://groups.google.com/group/tiddlywiki/browse_thread/thread/9f3fb012e80fdc4|
|''Keywords''|toolbar command add date time edit|
!!!Description
<<<
To use this new toolbar command you have to add {{{addNow}}} to ToolbarCommands tiddler
eg:
{{{
|~ViewToolbar|tagSearch addNow +editTiddler  ...
}}}
<<<
!!!Date Format
<<<
Possible date formats can be seen at [[TiddlyWiki.org|http://tiddlywiki.org/#%5b%5bDate%20Formats%5d%5d]]

To change the date format add the following line to a tiddler eg: [[zzConfig]] tagged systemConfig
//{{{
config.commands.addNow.dateFormat = 'YYYY-0MM-0DD 0hh:0mm';
//}}}
To change the insert {{{mode}}} add:
//{{{
config.commands.addNow.mode = 'post';
//}}}
To change the {{{selectedText}}} in mode = 'pre' add:
//{{{
config.commands.addNow.selectedText = 'your text here';
//}}}

<<<
!!!Code
***/
//{{{
// http://stackoverflow.com/questions/499126/jquery-set-cursor-position-in-text-area/841121#841121
// $('#elem').selectRange(3,5);
jQuery.fn.selectRange = function(start, end) {
    return this.each(function() {
        if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};

config.commands.addNow = {
	text: "addNow",
	tooltip: "Edit tiddler and add [Date & Time]!",
	selectedText: "insert text",

	mode: 'pre',	// 'pre' or 'post'
	spacingText: '\n\n----\n',
	insertText: '[%0]\n',

	dateFormat: 'YYYY-0MM-0DD 0hh:0mm',

	isEnabled: function(tiddler) {
		return (!readOnly && !tiddler.isTagged('systemConfig'));
	}
};

config.commands.addNow.handler = function(event,src,title)
{
	config.commands.editTiddler.handler.call(this,event,src,title); 

	var text = jQuery(story.getTiddler(title)).find('textarea[edit=text]');
	var spacer = text.val() ? this.spacingText : '' ;
	var dynText = this.insertText.format([new Date().formatString(this.dateFormat)]);
	
	if (this.mode == 'post') {
		text.val(text.val() + spacer + dynText);
	}
	else {
		text.val(dynText + this.selectedText + spacer + text.val() );
		jQuery(text).selectRange(dynText.length, dynText.length + this.selectedText.length);
	}
	return false;
};
//}}}