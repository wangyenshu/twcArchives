//{{{
//macro to rename buttons

var cm=config.macros;
cm.rB={handler:function(place,macroName,params,wikifier,paramString,tiddler){
  if(place.lastChild&&place.lastChild.tagName!="BR"){
    var p1=params.shift().split("#");
    var name=p1[0];
    var id=p1[1];
    var title=params[0];
    el=place.lastChild;
    if(el.tagName&&el.tagName.toUpperCase()!="A")el=el.firstChild;
    el.firstChild.data=name;
    if(id)el.setAttribute('id',id);
    if(title)el.title=title;
  }
}}
//}}}