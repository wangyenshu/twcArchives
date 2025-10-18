/***
| ''Name'' |NewFromTemplateMacro|
| ''Version'' |0.3|
| ''Source'' |[[Rich Carrillo|http://www.kultofbubb.net/tiddlywiki/]]|
| ''Author'' |[[RichCarrillo|RichCarrillo@gmail.com]]|
| ''Type'' |Macro|
| ''Required'' |TiddlyWiki 2.0+|
| ''License'' ||

!Revision History
|20060113|0.1|First release|
|20060116|0.2|Added the ability to pass the templateTag as an optional first parameter.|
|20060116|0.3|Bunch of little code tweaks trying to figure out why it was breaking in IE. Fixed it.|

!Description
Using this macro will create a pop-up that lists anything tagged with TiddlerTemplates. Choosing an item off this list will create a new Tiddler. This new Tiddler will have the same contents as the template. The title will be NEW<template title> and it's tags will be the same as the template, but with the TiddlerTemplates tag stripped off.
!Installation
Import (or copy the contents of) this Tiddler into your Wiki.
Tag it with systemConfg, Save and Refresh.

!Syntax
|{{{<<newFromTemplate>>}}}| If the macro is started without any parameters, the templateTag of "TiddlerTemplates" will be used|
|{{{<<newFromTemplate [yourTemplateTag]>>}}}| Optionally, you can provide a tag name. Any tiddlers with that tag will appear on the pop-up menu as templates|

I've included some example templates. Copy over all Tiddlers tagged with TiddlerTemplates to get you started.

!Example
<<newFromTemplate PluginTemplate>>

!Credits
Most of this code is adaptions of TiddlyWiki core functions. I took a close look at PopupMacro and WikiBar's Templater Add-on for help.

!Roadmap - ToDo list
*Let users pass the button label, tooltip and template tag as parameters.
*Create a standalone button (no popup) that is keyed directly to a template tiddler
*Make copying over of Tags and Title optional (like in WikiBar templates)
*More error catching and reporting
*Use named parameters
*Combine with NewHere in some way. Maybe make this into a toolbar command so it's more like NewHereFromTemplate. I'd like to be able to be in a Project tiddler and have a "New Task Here" or "New Reminder Here" type of commands available.

!Code
***/
//{{{
// default settings
config.macros.newFromTemplate = 
{
 label: "New",
 tooltip: "Create a tiddler from a Template",
 templateTag: "TiddlerTemplates"
}

config.macros.newFromTemplate.handler = function(place,macroName,params) {
 var onClickTemplateButton = function(event) {

 if (!event) var event = window.event;
 var tag = this.getAttribute("tag");
 
 // error out if no tiddlers are tagged as temlates
 var templateList = store.getTaggedTiddlers(tag);
 if(!templateList) {
 displayMessage('No templates found! Add the tag '+tag+' to a tiddler you would like to use as a template');
 return;
 }
 
 var popup = Popup.create(templateButton);
 
 // pull the titles out of the tiddlers retured by getTaggedTiddlers
 var templateTitles = [];
 var li,r;
 for(r=0;r<templateList.length;r++)
 if(templateList[r].title != templateTitles){
 templateTitles.push(templateList[r].title);}
 
 // for each one of the titles create a new TiddlyButton inthe popup
 for(r=0; r<templateTitles.length; r++) {
 var itemTitle = templateTitles[r].match(/(.+)Template$/)?templateTitles[r].match(/(.+)Template$/)[1]:templateTitles[r];
 var templateListItem = createTiddlyButton(createTiddlyElement(popup,"li"),itemTitle,null,onClickTemplateTitle);
 templateListItem.setAttribute("templateTitle",templateTitles[r]);
 templateListItem.setAttribute("templateTag",tag);
 }
 
 Popup.show(popup,true);
 event.cancelBubble = true;
 if (event.stopPropagation) event.stopPropagation();
 
 return false;
 }

 var onClickTemplateTitle = function(event) {
 var title = this.getAttribute("templateTitle");
 var templateTag = this.getAttribute("templateTag");
 
 // get the template and extract its info
 var template = store.getTiddler(title);
 var newTitle = 'New'+template.title;
 var newTags = template.getTags();
 var newText = template.text;
 
 // create new tiddler
 story.displayTiddler(null,newTitle,DEFAULT_EDIT_TEMPLATE);
 
 // grab the new Tiddlers text edit box
 var tiddlerTextArea = getTiddlerEditField(newTitle,"text");
 var tiddlerTagArea = getTiddlerEditField(newTitle,"tags");
 
 // Stuff template info into newly created tiddler
 tiddlerTextArea.value=newText;
 tiddlerTagArea.value=newTags;
 story.setTiddlerTag(newTitle,templateTag,-1);
 story.focusTiddler(newTitle,"text");
 return false;
 }

 var getTiddlerEditField = function(title,field) {
 var tiddler = document.getElementById(story.idPrefix + title);
 if(tiddler != null) {
 var children = tiddler.getElementsByTagName("*")
 var e = null;
 for (var t=0; t<children.length; t++) {
 var c = children[t];
 if(c.tagName.toLowerCase() == "input" || c.tagName.toLowerCase() == "textarea") {
 if(!e) e = c;
 if(c.getAttribute("edit") == field) e = c;
 }
 }
 if(e) return e;
 }
 }

 var templateTag;
 if (params[0])
 templateTag=params[0];
 else
 templateTag=this.templateTag;

 var templateButton = createTiddlyButton(place,this.label,this.tooltip,onClickTemplateButton);
 templateButton.setAttribute("tag",templateTag);
}

//}}}