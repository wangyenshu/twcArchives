/***
|Name:|HideWhenPlugin|
|Description:|Allows conditional inclusion/exclusion in templates|
|Version:|4.0.0|
|Date:|2010-09-09|
|Author:|Simon Baird, Tobias Beer|
|Source:|http://mptw.tiddlyspot.com/#HideWhenPlugin|
|License:|http://mptw.tiddlyspot.com/#TheBSDLicense|
For use in ViewTemplate and EditTemplate. Example usage:
{{{<div macro="showWhenTagged Task">[[TaskToolbar]]</div>}}}
{{{<div macro="showWhen tiddler.modifier == 'BartSimpson'"><img src="bart.gif"/></div>}}}
***/
//{{{

window.hideWhenLastTest = false;

window.removeElementWhen = function(test,place) {
	window.hideWhenLastTest = test;
	if(test){
		removeChildren(place);
		place.parentNode.removeChild(place);
	}
};

(function(){
var s,show=false,f,fs={
	When:'eval(paramString)',
	WhenTagged:'tiddler.tags.containsAll(params)',
	WhenTaggedAny:'tiddler.tags.containsAny(params)',
	WhenTaggedAll:'tiddler.tags.containsAll(params)',
	WhenExists:'store.tiddlerExists(params[0]) || store.isShadowTiddler(params[0])',
	TitleIs:'tiddler.title == params[0]',
	'"else"':'!window.hideWhenLastTest'
}
for(var f in fs){
	do{
		s=f=='"else"'?'':(show?'show':'hide');
		eval('merge(config.macros,{\n'+s+f+':{\n'+
			'handler:function(place,macroName,params,wikifier,paramString,tiddler){\n'+
				'removeElementWhen('+(show?'!':'')+fs[f]+',place);\n'+
			'}}});');
		show=!show&&s!='';
	}while(show);
}
})();
//}}}