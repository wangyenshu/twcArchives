/***
|!''Name:''|!''TemplatedTagTools''|
|''Description:''|this plugin replace the content of the tag popup with the one from TagToolTemplate (a new shadowTiddler).<<br>>It allows for quick and easy modification of this popup content (including some [[batchTagTools]] macros for example)|
|''Version:''|0.1.0|
|''Date:''|17/01/2007|
|''Source:''|http://yann.perrin.googlepages.com/twkd.html#TemplatedTagTools|
|''Author:''|[[Yann Perrin|YannPerrin]]|
|''License:''|[[BSD open source license]]|
|''~CoreVersion:''|2.x|
|''Browser:''|Firefox 1.0.4+; Firefox 1.5; InternetExplorer 6.0|
***/
//{{{
function onClickTag(e)
{
 if (!e) var e = window.event;
 var theTarget = resolveTarget(e);
 var popup = Popup.create(this);
 var tag = this.getAttribute("tag");
 var title = this.getAttribute("tiddler");
 if(popup && tag) {
 wikify('<<tiddler TagToolTemplate with:"'+tag+'">>',popup);
 }
 Popup.show(popup,false);
 e.cancelBubble = true;
 if (e.stopPropagation) e.stopPropagation();
 return(false);
}
//}}}
//{{{
config.macros.openAll = {};
config.macros.openAll.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
 var lingo = config.views.wikified.tag;
 var openAll = createTiddlyButton(place,lingo.openAllText.format(params),lingo.openAllTooltip,onClickTagOpenAll);
 openAll.setAttribute("tag",params[0]);
}
//}}}
////definition de TagToolTemplate
//{{{
config.shadowTiddlers.TagToolTemplate = "[[Open tag '$1'|$1]]\n<<openAll $1>>\n<<tagging $1>><<newTiddler label:\"New $1 Tiddler\" tag:\"$1\">>";
//}}}