/***
|!''Name:''|!''Send''|
|''Description:''|this framework allows you to easily create macros that produce links referring to the current tiddler|
|''Version:''|0.2.0|
|''Date:''|22/03/2007|
|''Source:''|http://yann.perrin.googlepages.com/twkd.html#Send|
|''Author:''|[[Yann Perrin|YannPerrin]]|
|''License:''|[[BSD open source license]]|
|''~CoreVersion:''|2.x|
|''Browser:''|Firefox 1.0.4+; Firefox 1.5; InternetExplorer 6.0|
***/
//{{{
if (!window.TWkd) window.TWkd = {context:{}};
if (!TWkd.Send)  TWkd.Send = function (name,separator) {
	this.name = name;
	this.separator = separator;
	this.Destinations = [];
	this.addDestination = function(name,url,icon){
		this.Destinations.push({name:name,url:url,icon:icon});
	};
	this.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
		var here = window.story.findContainingTiddler(place).getAttribute("tiddler");
		var permalink = window.location.hash ? window.location.href.substr(0,window.location.href.lastIndexOf("#"))+"#[["+here+"]]" : window.location.href+"#[["+here+"]]";
		var links = [];
		for (var d=0; d<this.Destinations.length; d++) {
			var uri = this.Destinations[d].url.format([encodeURIComponent(permalink),encodeURIComponent(here)]);
			if (!this.Destinations[d].icon)
				links.push("[["+this.Destinations[d].name+"|"+uri+"]]");
			else
				links.push("[img["+this.Destinations[d].name+"|"+this.Destinations[d].icon+"]["+uri+"]]");
		}
		wikify(links.join(this.separator),place);
	};
	config.macros[name] = this;
};
//}}}