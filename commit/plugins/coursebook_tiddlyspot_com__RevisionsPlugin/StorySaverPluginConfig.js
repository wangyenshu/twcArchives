/***
! StorySaverPlugin

Try to override text for the popup. Remove the word story add section.
***/
//{{{
config.macros.openStory.label = "open: %0";
config.macros.openStory.popuplabel = "section";
config.macros.openStory.selectprompt = "select a section...";
config.macros.openStory.foldprompt = "fold story tiddlers when opening a section";
config.macros.openStory.closeprompt = "close other tiddlers when opening a section";

config.options.chkStoryAllowAdd = false;
//}}}