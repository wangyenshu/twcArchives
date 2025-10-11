/***
|''Name:''|TiddlerNotesPluginMod|
|''Description:''|Add notes to tiddlers without modifying the original content|
|''Author:''|Saq Imtiaz ( lewcid@gmail.com )|
|''Modder:''|Måns Mårtensson|
|''Source:''|http://tw.lewcid.org/#TiddlerNotesPlugin|
|''Code Repository:''|http://tw.lewcid.org/svn/plugins|
|''Version:''|2.1|
|''Date:''|26/10/07|
|''License:''|[[Creative Commons Attribution-ShareAlike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]]|
|''~CoreVersion:''|2.2.3|

!!Koncept:
*TiddlerNotesPlugin gør det muligt at tilføje noter til tiddlere, uden at redigere den originale tiddler. Det betyder at tiddlerens originale indhold ikke berøres, hvis du opdaterer den senere, vil du ikke miste dine noter af den grund. Noter gemmes i separate tiddlere, men kan læses og redigeres fra den originale tiddler.
*For en tiddler med titlen "~MitSlide", bliver noten gemt i en tiddler kaldet "~MitSlide-Noter" og får tagget "Noter". Endelsen og tagging af notetiddlere kan ændres efter behov. Du kan have een eller flere noter pr tiddler. Det er derfor f.eks. muligt, at have lærerens og elevens noter i den samme fil.
*Noter kan konfigureres til at starte tomme, eller på forhånd "fyldes" med indholdet af den originale tiddler.

!!Anvendelse:
*{{{<<notes>>}}} er den simpleste form.
* øvrige mulige parametre er:
**{{{heading:}}} overskriften til noteboksen
**{{{tag:}}} det tag der skal gives notetiddleren
**{{{suffix:}}} den endelse der skal bruges til at navngive notetiddleren
* et komplet makrokald kunne f.eks. se således ud: {{{<<notes heading:"Mine Noter" tag:"NoteTiddlere" suffix:"kommentarer">>}}}
* For at slippe for at skulle tilføje {{{<<notes>>}}} til alle tiddlere du vil skrive noter til, kan du tilføje makrokaldet til ViewTemplate tiddleren:
** under linien {{{<div class='viewer' macro='view text wikified'></div>}}} tilføjes følgende linie: <br> {{{<div class='viewer' macro='notes'></div>}}}
** Anvendt sammen med ~HideWhenPlugin eller ~TaggedTemplateTweak, kan du bestemme, at noter kun vises for tiddlere tagget med et bestemt tag.

!!Konfiguration
*<<option chkPrefillNotes>> Fyld noter med den originale tiddlers indhold.

!!Demo:
* [[MitSlide]]

***/
// /%
//!BEGIN-PLUGIN-CODE

if (!config.options.chkPrefillNotes)
	config.options.chkPrefillNotes = false;
	
function createTiddlyElement(theParent,theElement,theID,theClass,theText,attribs)
{
	var e = document.createElement(theElement);
	if(theClass != null)
		e.className = theClass;
	if(theID != null)
		e.setAttribute("id",theID);
	if(theText != null)
		e.appendChild(document.createTextNode(theText));
	if(attribs){
		for(var n in attribs){
			e.setAttribute(n,attribs[n]);
		}
	}
	if(theParent != null)
		theParent.appendChild(e);
	return e;
}

function createTiddlyButton(theParent,theText,theTooltip,theAction,theClass,theId,theAccessKey,attribs)
{
	var theButton = document.createElement("a");
	if(theAction) {
		theButton.onclick = theAction;
		theButton.setAttribute("href","javascript:;");
	}
	if(theTooltip)
		theButton.setAttribute("title",theTooltip);
	if(theText)
		theButton.appendChild(document.createTextNode(theText));
	if(theClass)
		theButton.className = theClass;
	else
		theButton.className = "button";
	if(theId)
		theButton.id = theId;
	if(attribs){
		for(var n in attribs){
			e.setAttribute(n,attribs[n]);
		}
	}
	if(theParent)
		theParent.appendChild(theButton);
	if(theAccessKey)
		theButton.setAttribute("accessKey",theAccessKey);
	return theButton;
}

config.macros.notes={
	
	cancelWarning: "Er du sikker på at du vil undlade at gemme dine ændringer af kommentarer til '%0'?",
	editLabel: "redigér note",
	editTitle: "dobbeltklik for at ændre",
	saveLabel: "gem note",
	saveTitle: "Dobbeltklik for at gemme",
	cancelLabel: "fortryd",
	heading: "Noter",
	suffix: "Noter",
	tag: "Noter",
	
	saveNotes: function(ev){
		e = ev? ev : window.event;
		var theTarget = resolveTarget(e);
		if (theTarget.nodeName.toLowerCase() == "textarea")
			return false;
		var title = story.findContainingTiddler(theTarget).getAttribute("tiddler");
		story.setDirty(title,false);
		var box = document.getElementById("notesContainer"+title);
		var textarea = document.getElementById("notesTextArea"+title);
		if(textarea.getAttribute("oldText")!=textarea.value && !hasClass(theTarget,"cancelNotesButton")){
			var suffix = box.getAttribute("suffix");
			var t = store.getTiddler(title+"-"+suffix);
var fields = t ? t.fields : {}; 
fields = jQuery.extend({}, config.defaultCustomFields, fields); 
store.saveTiddler(title+"-"+suffix,title+"-"+suffix,textarea.value,config.options.txtUserName,new Date(),t?t.tags:box.getAttribute("tag"), fields);
		}
		story.refreshTiddler(title,1,true);
		autoSaveChanges(true);
		return false;
	},
	
	editNotes: function(box,tiddler){
		removeChildren(box);
		story.setDirty(tiddler,true);
		box.title = this.saveTitle;
		box.ondblclick = this.saveNotes;
		createTiddlyButton(box,this.cancelLabel,this.cancelLabel,this.saveNotes,"cancelNotesButton");
		createTiddlyButton(box,this.saveLabel,this.saveLabel,this.saveNotes,"saveNotesButton");
		wikify("!!"+box.getAttribute("heading")+"\n",box);
		addClass(box,"editor");
		var wrapper1 = createTiddlyElement(null,"fieldset",null,"fieldsetFix");
		var wrapper2 = createTiddlyElement(wrapper1,"div");
		var e = createTiddlyElement(wrapper2,"textarea","notesTextArea"+tiddler);
		var v = store.getValue(tiddler+"-"+box.getAttribute("suffix"),"text");
		if(!v) 
			v = config.options.chkPrefillNotes? store.getValue(tiddler,"text"):'';
		e.value = v;
		e.setAttribute("oldText",v);
		var rows = 10;
		var lines = v.match(/\n/mg);
		var maxLines = Math.max(parseInt(config.options.txtMaxEditRows),5);
		if(lines != null && lines.length > rows)
			rows = lines.length + 5;
		rows = Math.min(rows,maxLines);
		e.setAttribute("rows",rows);
		box.appendChild(wrapper1);
	},
	
	editNotesButtonOnclick: function(e){
		var title = story.findContainingTiddler(this).getAttribute("tiddler");
		var box = document.getElementById("notesContainer"+title);
		config.macros.notes.editNotes(box,title);
		return false;
	},
	
	ondblclick : function(ev){
		e = ev? ev : window.event;
		var theTarget = resolveTarget(e);
		var title = story.findContainingTiddler(theTarget).getAttribute("tiddler");
		var box = document.getElementById("notesContainer"+title);
		config.macros.notes.editNotes(box,title);
		e.cancelBubble = true;
		if(e.stopPropagation) e.stopPropagation();
		return false;
	},
	
	handler : function(place,macroName,params,wikifier,paramString,tiddler){
		
		params = paramString.parseParams("anon",null,true,false,false);
		var heading = getParam(params,"heading",this.heading);
		var tag = getParam(params,"tag",this.tag);
		var suffix = getParam(params,"suffix",this.suffix);
		var box = createTiddlyElement(place,"div","notesContainer"+tiddler.title,"TiddlerNotes",null,{"source":tiddler.title,params:paramString,heading:heading,tag:tag,suffix:suffix});
		createTiddlyButton(box,this.editLabel,this.editLabel,this.editNotesButtonOnclick,"editNotesButton");
		wikify("!!"+heading+"\n",box);
		box.title=this.editTitle;
		box.ondblclick = this.ondblclick;
		wikify("<<tiddler [["+tiddler.title+"-"+suffix+"]]>>",box);
	}		
};

Story.prototype.old_notes_closeTiddler = Story.prototype.closeTiddler;
Story.prototype.closeTiddler = function(title,animate,unused){
	if(story.isDirty(title)) {
		if(!confirm(config.macros.notes.cancelWarning.format([title])))
			return false;
	}
	return this.old_notes_closeTiddler.apply(this,arguments);
}

setStylesheet(".TiddlerNotes {\n"+ " background:#eee;\n"+ " border:1px solid #ccc;\n"+ " padding:10px;\n"+ " margin:15px;\n"+ "}\n"+ "\n"+ ".cancelNotesButton,.editNotesButton, .saveNotesButton {\n"+ " float:right;\n"+ " border:1px solid #ccc;\n"+ " padding:2px 5px;\n"+ "}\n"+ "\n"+ ".saveNotesButton{\n"+ " margin-right:0.5em;\n"+ "}\n"+ "\n"+ ".TiddlerNotes.editor textarea{\n"+ " border:1px solid #ccc;\n"+ "}","NotesPluginStyles");
//!END-PLUGIN-CODE
// %/