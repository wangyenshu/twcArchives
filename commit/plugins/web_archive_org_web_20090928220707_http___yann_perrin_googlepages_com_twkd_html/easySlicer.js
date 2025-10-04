/***
|!''Name:''|!easySlicer|
|''Description:''|The slice command allows you to create microcontent tiddlers from bigger ones.<<br>>It turns selected text into a new independent tiddler, and replace it in the original tiddler with a reference to the newly created tiddler.|
|''Version:''|0.1.0|
|''Date:''|13/01/2007|
|''Source:''|[[TWkd|http://yann.perrin.googlepages.com/twkd.html#easySlicer]]|
|''Author:''|[[Yann Perrin|YannPerrin]]|
|''License:''|[[BSD open source license]]|
|''~CoreVersion:''|2.x|
|''Browser:''|Firefox 1.0.4+; Firefox 1.5; InternetExplorer 6.0|
|''Requires:''|@@color:red;''E.A.S.E''@@|
***/
//{{{
config.commands.slice = new TWkd.Ease('8<','divide tiddler into parts');
config.commands.slice.addMode({
	name:'tiddler',
	tooltip:'turns selection into a new tiddler and replace it with a macro diplaying the new tiddler content',
	operation:function(){
		var newtitle=config.commands.slice.askForTitle();
		if(!newtitle) {
			displayMessage(config.messages.Ease.cancel);
			return(false);
		}
		config.commands.slice.newTWkdLibTiddler(newtitle,TWkd.context.selection.content,TWkd.context.selection.source,true);
		config.commands.slice.putInPlace("<<tiddler "+newtitle+">>",TWkd.context.selection);
	}
});
config.commands.slice.addMode({
	name:'link',
	tooltip:'turns selection into a new tiddler and replace it with a link to the new tiddler',
	operation:function(){
		var newtitle=config.commands.slice.askForTitle();
		if(!newtitle) {
			displayMessage(config.messages.Ease.cancel);
			return(false);
		}
		config.commands.slice.newTWkdLibTiddler(newtitle,TWkd.context.selection.content,TWkd.context.selection.source,true);
		config.commands.slice.putInPlace("[["+newtitle+"]]",TWkd.context.selection);
	}
});
config.commands.slice.addMode({
	name:'slider',
	tooltip:'turns selection into a new tiddler and replace it with a slider containing the new tiddler',
	sliderTooltip:'content of ',
	operation:function(){
		var newtitle=config.commands.slice.askForTitle();
		if(!newtitle) {
			displayMessage(config.messages.Ease.cancel);
			return(false);
		}
		config.commands.slice.newTWkdLibTiddler(newtitle,TWkd.context.selection.content,TWkd.context.selection.source,true);
		config.commands.slice.putInPlace('<<slider chkSlice [['+newtitle+']] "'+newtitle+'" "'+this.sliderTooltip+newtitle+'">>',TWkd.context.selection);
	}
});
if (version.extensions.nestedSliders) {
config.commands.slice.addMode({
	name:'nestedslider',
	tooltip:'turns selection into a slider',
	operation:function(){
		var newtitle=config.commands.slice.askForTitle();
		if(!newtitle) {
			displayMessage(config.messages.Ease.cancel);
			return(false);
		}
		config.commands.slice.putInPlace("+++["+newtitle+"]\n"+TWkd.context.selection.content+"\n===",TWkd.context.selection);
	}
});
}
if (version.extensions.PartTiddlerPlugin) {
config.commands.slice.addMode({
	name:'part',
	tooltip:'turns selection into a part',
	operation:function(){
		var newtitle=config.commands.slice.askForTitle();
		if(!newtitle) {
			displayMessage(config.messages.Ease.cancel);
			return(false);
		}
		config.commands.slice.putInPlace("<part "+newtitle+">"+TWkd.context.selection.content+"</part>",TWkd.context.selection);
	}
});
}
//}}}
