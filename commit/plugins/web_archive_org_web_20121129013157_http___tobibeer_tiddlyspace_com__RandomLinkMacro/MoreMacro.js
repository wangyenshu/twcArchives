//{{{
config.macros.more={
space:'@tobibeer',
lbl:'[[For more information click here...|%0]]%1',

handler:function(place,macroName,params,wikifier,paramString,theTiddler){
	var lnk=paramString;
	wikify(this.lbl.format([lnk,(lnk.indexOf('http:')>0?'':this.space)]),place);
}
}
//}}}