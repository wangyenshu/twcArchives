/***
|''Name:''|~PopupMacro|
|''Author:''|Saq Imtiaz (mod: Tobias Beer)|
|''Version:''|1.1 (2009-11-08)|
|''Description:''|Create popups with custom content|
|''Source:''|http://tbGTD.tiddlyspot.com/#PopupMacro|
|''Documentation:''|http://tw.lewcid.org/#PopupMacroDocs|
|''Requires:''|TW Version 2.0.8 or better|
@@mod for [[tbGTD|http://tbgtd.tiddlyspot.com]] - removed styles and code cleanup@@
!Code
***/
//{{{
config.macros.popup={
err1:'missing macro parameters',
err2:'missing label or content parameter',
arrow:document.all?" ▼":" ▾",
handler:function(place,macroName,params,wikifier,paramString,theTiddler){
var cls,id,lbl,src,click;
if(!params[0]||!params[1]){createTiddlyError(place,this.err1,this.err2);return false;}
lbl=params[0];
src=(params[1]).replace(/\$\)\)/g,">>");
id=params[2]?params[2]:'nestedpopup';
cls='popup popupmacro'+(params[3]?' ' +params[3]:'');
click=function(e){
	var btn,nest,p,tgt;
	e=e||window.event;
	tgt=resolveTarget(e);
	nest=!isNested(tgt);
	id=nest?id:'popup';
	if(nest&&Popup.stack.length>1)Popup.removeFrom(1);
	else if(!nest&&Popup.stack.length>0)Popup.removeFrom(0);
	p=createTiddlyElement(document.body,"ol",id,cls,null);
	Popup.stack.push({root:this,popup:p});
	wikify(src,p);
	Popup.show(p,true);e.cancelBubble=true;if(e.stopPropagation)e.stopPropagation();return false;
}
btn=createTiddlyButton(place,lbl+this.arrow,lbl,click,null);
}
}
window.isNested=function(el){
	var c=document.getElementById("contentWrapper");
	while(el!=null){if(el==c)return true;el=el.parentNode;}return false;
}
setStylesheet('#nestedpopup {margin-left:1em;}','PopupMacroStyles');
//}}}