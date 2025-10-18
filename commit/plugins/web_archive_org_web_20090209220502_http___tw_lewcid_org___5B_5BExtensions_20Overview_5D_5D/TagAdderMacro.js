/***
| Name:|''tagAdder''|
| Created by:|SaqImtiaz|
| Location:|http://tw.lewcid.org/|
| Version:|0.61 (07 Apr-2006)|
| Requires:|~TW2.07|
!About
*provides a drop down list for toggling tags 
*you can specify which tags to list, and have multiple drop downs with different tag lists.

!Demonstration
<<tagAdder>>
{{{<<tagAdder>>}}}

''I recommend using either tagAdder or monkeyTagger, with dropTags and dropTagging in the toolbar:''


!Installation:
*Copy this tiddler to your TW with the systemConfig tag
* copy the following to your ViewTemplate:
#either {{{
<div class='tagged' macro='tagAdder'></div>
}}} to add to next to the tags macro in the viewer area, or
#{{{<div class='toolbar' >
<span style="padding-right:1.75em;" macro='tagAdder'></span>
<span macro='toolbar -closeTiddler closeOthers +editTiddler permalink references jump'></span></div>}}} to add to the toolbar.
(adjust padding to taste)

!Usage:
*by default {{{<<tagAdder>>}}} will display drop down list of all tags, with tags present on the tiddler grouped together.
*to sort alphabetically (ignoring the [x]), use {{{<<tagAdder 'nogroup'>>}}}
*to specify what tags to list, use {{{<<tagAdder 'group/nogroup' 'tiddler'>>}}} where tiddler is a tiddler that is tagged with the tags you want to list. (use one of either group or no group, not both!)
Eg: TagDataBase is my tiddler that is tagged with the tags I want to list, so I will use {{{<<tagAdder 'group' 'TagDataBase'>>}}}
 for a list like this: <<tagAdder 'group' 'TagDataBase'>>
*you can specify a custom label by giving the macro an additional parameter.
Eg: {{{<<tagAdder 'group' 'TagDataBase' 'custom label'>>}}} gives <<tagAdder 'group' 'TagDataBase' 'custom label'>>

!Tips:
*On the tiddler you want to use as your TagsDataBase, add {{{<<tagAdder>>}}} for a drop down list of all tags, so you can easily toggle tags on it!
*You can have as many TagDataBases as you like.

!Notes:
*use css to style to taste
*tags to be removed are preceded by [x]

!To Do:
*Combine with features of normal tags drop down list.(drop tag macro)
*TagsDB manager
*''add exclude tag feature''

!History
*07 Apr-2006, version 0.61
**fixed IE bug with not returning false 

!CODE
***/
//{{{

config.macros.tagAdder= {};
//config.macros.tagAdder.dropdownchar = (document.all?"▼":"▾"); // the fat one is the only one that works in IE
config.macros.tagAdder.dropdownchar = "▼"; // uncomment previous line and comment this for smaller version in FF
config.macros.tagAdder.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
 var arrow=': '+ config.macros.tagAdder.dropdownchar;
 var tAsort = (params[0] && params[0] !='.') ? params[0]: 'group';
 if (params[1]){var tAsource=params[1]};
 if ((tAsource)&&(!store.getTiddler(tAsource)))
 return false;
 var tAlabel= (params[2] && params[2] !='.')? params[2]: 'toggle tags'+arrow;
 var tAtooltip= (params[2] && params[2] !='.')? params[2]: 'toggle tags on this tiddler';

 if(tiddler instanceof Tiddler)
 {
 var title = tiddler.title;
 var lingo = config.views.editor.tagChooser;
 
 var ontagclick = function(e) {
 if (!e) var e = window.event;
 var tag = this.getAttribute("tag");

 var t=store.getTiddler(title);
 if (!t || !t.tags) return;
 if (t.tags.find(tag)==null)
 {t.tags.push(tag)}
 else
 {t.tags.splice(t.tags.find(tag),1)};
 story.saveTiddler(title);
 story.refreshTiddler(title,null,true);
 return false;
 };

 var onclick = function(e) {
 if (!e) var e = window.event;
 var popup = Popup.create(this);
 var t=store.getTiddler(title);
 if (!t) return false;
 var tagsarray = store.getTags();
 var tagsvalue=new Array();

 for (var i=0; i<tagsarray.length; i++){
 var thetagonly= (tagsarray[i][0]);
 tagsvalue.push(thetagonly);}

 if (tAsource)
 {var sourcetiddler=store.getTiddler(tAsource);
 var tagsvalue=sourcetiddler.tags;
 }
 var tagslabel=new Array();
 var tagssorted=new Array();

 for (var i=0;i<tagsvalue.length;i++){
 var temptag=(tagsvalue[i]);
 if (t.tags.find(temptag)==null)
 {var temptagx = '[ ] '+temptag;
 tagslabel.push(temptagx);
 tagssorted.push(temptag);
 }
 else
 {var temptagx ='[x] '+temptag;
 if (tAsort=='group'){
 tagslabel.unshift(temptagx);
 tagssorted.unshift(temptag);}
 else if (tAsort=='nogroup'){
 tagslabel.push(temptagx);
 tagssorted.push(temptag);} }
 ;}


 if(tagsvalue.length == 0)
 createTiddlyText(createTiddlyElement(popup,"li"),lingo.popupNone);
 for (var t=0; t<tagsvalue.length; t++)
 {
 var theTag = createTiddlyButton(createTiddlyElement(popup,"li"),tagslabel[t],"toggle '"+([tagssorted[t]])+"'",ontagclick);
 theTag.setAttribute("tag",tagssorted[t]);
 }
 Popup.show(popup,false);
 e.cancelBubble = true;
 if (e.stopPropagation) e.stopPropagation();
 return(false);
 };
 //createTiddlyButton(place,tAlabel,tAtooltip,onclick);
var createdropperButton = function(place){
var sp = createTiddlyElement(place,"span",null,"tagadderbutton");
var theDropDownBtn = createTiddlyButton(sp,tAlabel,tAtooltip,onclick);
};

createdropperButton(place);
}
};
setStylesheet(
 ".toolbar .tagadderbutton { margin-right:0em; border:0px solid #eee; padding:0px; padding-right:0px; padding-left:0px; }\n"+
 ".tagadderbutton a.button { padding:2px; padding-left:2px; padding-right:2px;}\n"+
// ".tagadderbutton {font-size:150%;}\n"+
 "",
"TagAdderStyles");

//}}}

