config.commands.closeAll ={
text:"close all",
tooltip:"close all"};

config.commands.closeAll.handler = function(event,src,title)
{story.closeAllTiddlers();return false;}