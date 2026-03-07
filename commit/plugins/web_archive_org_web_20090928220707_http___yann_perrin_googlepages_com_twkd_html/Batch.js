/***
|!''Name:''|!''Batch''|
|''Description:''|this framework allows you to easily create macros that work on the dislayed tiddlers|
|''Version:''|0.1.0|
|''Date:''|24/01/2007|
|''Source:''|http://yann.perrin.googlepages.com/twkd.html#Batch|
|''Author:''|[[Yann Perrin|YannPerrin]]|
|''License:''|[[BSD open source license]]|
|''~CoreVersion:''|2.x|
|''Browser:''|Firefox 1.0.4+; Firefox 1.5; InternetExplorer 6.0|
***/
//{{{
if (!window.TWkd) window.TWkd={context:{}};
if (!TWkd.Batch)
 TWkd.Batch = function (macroName,label,prompt,labelIfParam,promptIfParam,action,showWhenReadOnly,ask) {
	if (showWhenReadOnly == undefined) showWhenReadOnly = true;
	this.macroName = macroName;
	this.label  = label;
	this.prompt = prompt;
	this.labelIfParam = labelIfParam;
	this.promptIfParam = promptIfParam;
	this.action = action;
	this.showWhenReadOnly = showWhenReadOnly;
	this.ask = ask;
	this.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
		if ((!readOnly)||(this.showWhenReadOnly)) {
			if (params[0]) {
				var Btn = createTiddlyButton(place,this.labelIfParam.format(params),this.promptIfParam.format(params),this.operation);
				Btn.setAttribute("param",params[0]);
			 } else {
				var Btn = createTiddlyButton(place,this.label,this.prompt,this.operation);
				Btn.setAttribute("ask",this.ask);
			}
			Btn.setAttribute("macroName",  this.macroName);
		}
	}
	this.operation = function() {
		var macroName = this.getAttribute("macroName");
		var param = this.getAttribute("param");
		if ((!param)&&(this.getAttribute("ask")!=undefined)) var param=window.prompt(this.getAttribute("ask"));
		story.forEachTiddler(function(title) {
			var tiddler = store.getTiddler(title);
			if(tiddler) {
				config.macros[macroName].action(tiddler,param);
			}
		});
		store.notifyAll();
		if(config.options.chkAutoSave)
			saveChanges(true);
		return(false);
	}
}
//}}}