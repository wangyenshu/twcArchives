/***
| Name:|''dropTags''|
| Created by:|SaqImtiaz|
| Location:|http://lewcid.googlepages.com/lewcid.html|
| Version:|0.4 (06-Apr-2006)|
| Requires:|~TW2.07|

!About
*provides a drop down list of tags in the current tiddler, a replacement for the core tags macro.

!Demonstration
*DropTagsTest
''I recommend using either tagAdder or monkeyTagger, with dropTags and dropTagging in the toolbar:''
Examples:
#: tagAdder & dropTags: TagToolbarTest1
#: monkeyTagger & dropTags: TagToolbarTest2

!Usage
{{{<<dropTags>>}}} for <<dropTags>>
or {{{<<dropTags 'custom label'>>}}} for <<dropTags 'custom label'>>

!Installation:
*Copy this tiddler to your TW with the systemConfig tag
* copy the following to your ViewTemplate:
#either {{{<div class='tagged' macro='dropTags'></div>}}} to add to next to the tags macro in the viewer area, or
#{{{<div class='toolbar' >
<span style="padding-right:8.75em;" macro='dropTags "current tags: "+config.macros.dropTags.dropdownchar}}'></span>
<span macro='toolbar -closeTiddler closeOthers +editTiddler permalink references jump'></span>
</div>}}}

!To Do
*tweak popup css to optimize placement and colors.
*''optimize code to use core functions and reduce code size!''

!Code
***/
//{{{

//do we need this?
window.removeEvent(document,"click",Popup.onDocumentClick);

//hijack some core Popup functions
window.PopuponDocumentClick_droptag=window.Popup.onDocumentClick;
window.Popup.onDocumentClick = function(e)
{
 if (!e) var e = window.event;
 var target = resolveTarget(e);
 if(e.eventPhase == undefined)
 Popup.removeFrom(0);
 else if(e.eventPhase == Event.BUBBLING_PHASE || e.eventPhase ==Event.AT_TARGET)
 Popup.removeFrom(0);
 return true;
}

window.Popupremove_droptag = window.Popup.remove;
window.Popup.remove = function()
{

 if ((Popup.stack.length > 1)&&(document.getElementById("droptag")))
 {Popup.removeFrom(1);}
 else if(Popup.stack.length > 1)
 {Popup.removeFrom(0);};
}

//add eventlistener
window.addEvent(document,"click",Popup.onDocumentClick);


//start dropTags macro
config.macros.dropTags={};
//config.macros.dropTags.dropdownchar = (document.all?"?":"?"); // the fat one is the only one that works in IE
config.macros.dropTags.dropdownchar = "?"; // uncomment previous line and comment this for smaller version in FF
config.macros.dropTags.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
 var arrow=': '+ config.macros.dropTags.dropdownchar;
 var droptaglabel= (params[0] && params[0] !='.')? params[0]: 'tags'+arrow;
 var droptagtooltip="current tags for this tiddler";
 
 var droptag = function(e)
 { if (!e) var e = window.event;
 var popup = Popup.create(this);
 var lingo = config.views.wikified.tag;
 if (tiddler.tags.length==0)
 createTiddlyElement(popup,"li",null,"listTitle",lingo.labelNoTags);
 else
 for(var t=0; t<tiddler.tags.length; t++)
 {createTagButton(createTiddlyElement(popup,"li","droptag",null,null),tiddler.tags[t],tiddler.title);}
 Popup.show(popup,false);
 e.cancelBubble = true;
 if (e.stopPropagation)
 e.stopPropagation();
 return(false);
 };

 var createdropperButton = function(place){
 var sp = createTiddlyElement(place,"span",null,"tagdropbutton");
 var theDropDownBtn = createTiddlyButton(sp,droptaglabel,droptagtooltip,droptag);
 };
createdropperButton(place);

//createTiddlyButton(place,droptaglabel,droptaglabel,droptag);
};

setStylesheet(
 ".toolbar .tagdropbutton { margin-right:0em; border:0px solid #eee; padding:0px; padding-right:0px; padding-left:0px; }\n"+
 ".tagdropbutton a.button { padding:2px; padding-left:2px; padding-right:2px;}\n"+
// ".tagdropbutton {font-size:150%;}\n"+
".popup .highlight{background: #fe8; color:#000;}\n"+
 "",
"DropTagsStyles");
//}}}