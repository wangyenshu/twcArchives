/***
| Name:|''dropTagging''|
| Created by:|SaqImtiaz|
| Location:|http://lewcid.googlepages.com/lewcid.html|
| Version:|0.1 (06-Apr-2006)|
| Requires:|~TW2.07|

!About
*provides a drop down list of tiddlers tagged with the specified tag, a replacement for the core tagging macro.

!Demonstration
*[[Saq]]
''I recommend using either tagAdder or monkeyTagger, with dropTags and dropTagging in the toolbar:''
Examples:
#: tagAdder & dropTags: TagToolbarTest1
#: monkeyTagger & dropTags: TagToolbarTest2

!Usage
{{{<<dropTagging>>}}} for tiddlers tagged by current tiddler/tag
{{{<<dropTagging 'Saq'>>}}} for tiddlers tagged by the tag 'Saq' <<dropTagging 'Saq'>>
{{{<<dropTagging 'Saq' 'custom label'>>}}} for tiddlers tagged by the tag 'Saq' with a custom label. <<dropTagging 'Saq' 'custom label'>>

!Installation:
*Copy this tiddler to your TW with the systemConfig tag
* copy the following to your ViewTemplate:
#either {{{<div class='tagging' macro='dropTagging'></div>}}} to add next to or replace tagging macro, or
#{{{<div class='toolbar' >
<span style="padding-right:1.75em;" macro='dropTagging''></span>
<span macro='toolbar -closeTiddler closeOthers +editTiddler permalink references jump'></span>
</div>}}}(adjust padding to taste)

!To Do
*tweak popup css to optimize placement and colors.
*''optimize code to use core onClickTag function, can cut code size by half!''

!Code
***/
//{{{
config.macros.dropTagging={};
config.macros.dropTagging.dropdownchar = (document.all?"▼":"▾"); // the fat one is the only one that works in IE
//config.macros.dropTagging.dropdownchar = "▼"; // uncomment previous line and comment this for smaller version in FF
config.macros.dropTagging.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
 var arrow=': '+ config.macros.dropTagging.dropdownchar;
 if(params[0] && store.tiddlerExists(params[0]))
 tiddler = store.getTiddler(params[0]);



 var droptagginglabel= (params[1] && params[1] !='.')? params[1]: 'tagging'+arrow;
 var droptaggingtooltip="tiddlers tagged with '"+tiddler.title+"'";
 
 if(params[0] && store.tiddlerExists(params[0]))
 tiddler = store.getTiddler(params[0]);
 var tagged = store.getTaggedTiddlers(tiddler.title);

 if(tagged.length==0)
 return false; 
 
 var droptagging = function(e)
 { if (!e) var e = window.event;
 var popup = Popup.create(this);
 


 for(var t=0; t<tagged.length; t++)
 createTiddlyLink(createTiddlyElement(popup,"li"),tagged[t].title,true);

 Popup.show(popup,false);
 e.cancelBubble = true;
 if (e.stopPropagation)
 e.stopPropagation();
 return(false);
 };
 
var createdropperButton = function(place){
var sp = createTiddlyElement(place,"span",null,"taggingdropbutton");
var theDropDownBtn = createTiddlyButton(sp,droptagginglabel,droptaggingtooltip,droptagging);
 };
createdropperButton(place);
};

setStylesheet(
 ".toolbar .taggingdropbutton {margin-right:0em; border:0px solid #eee; padding:0px; padding-right:0px; padding-left:0px; }\n"+
 ".taggingdropbutton a.button {padding:2px; padding-left:2px; padding-right:2px;}\n"+
// ".taggingdropbutton {font-size:150%;}\n"+
".popup .highlight{background: #fe8; color:#000;}\n"+
 "",
"DropTaggingStyles");

//}}}