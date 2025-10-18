/***
''NewDocumentPlugin for TiddlyWiki version 2.0''
^^author: Eric Shulman - ELS Design Studios
source: http://www.TiddlyTools.com/#NewDocumentPlugin
license: [[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]^^

Quickly create new TiddlyWiki documents from your existing document, with just one click!  Use the {{{<<newDocument>>}}} macro to place a "new document" link into your sidebar/mainmenu/any tiddler (wherever you like).  Select this command to automatically create a "new.html" document containing a specific set of tagged tiddlers.  Optional parameters let you specify an alternate path/filename for the new file, or different tags to match.  You can also indicate "ask" for either parameter, which will  trigger a prompt for input when the command is selected.

!!!!!Usage
<<<
{{{<<newDocument label:text filename tag tag tag...>>}}}
{{{<<newDocument label:text filename all>>}}}
{{{<<newDocument label:text filename snap>>}}}
 where:
* ''label:text'' defines //optional// alternative link text (replaces default "new document" display)
* ''filename'' is any local path-and-filename.  If no parameters are provided, the default is to create the file "new.htm" in the current directory.  If a filename is provided without a path (i.e., there is no "/" in the input), then the current directory is also assumed.  Otherwise, this parameter is expected to contain the complete path and filename needed to write the file to your local hard disk.  If ''ask'' is used in place of the filename parameter then, when the command link is selected, a message box will be automatically displayed so you can select/enter the path and filename.
* ''tag tag tag...'' is a list of one or more space-separated tags (use quotes or {{{[[]]}}} around tags that contain spaces).  The new document will include all tiddlers that match at least one of the tags in the list.  The default is to include tiddlers tagged with <<tag includeNew>>or<<tag systemTiddlers>>.    The special value ''all'' may be used to match every tiddler (even those without tags).   If ''ask'' is used in place of the tags then, when the command link is selected, a message box will be automatically displayed so you can enter the desired tags at that time.
* When the keyword ''snap'' is used in place of tags to match, the plugin generates a file containing the //rendered// CSS-and-HTML for all tiddlers currently displayed in the document.

Note: as of version 1.4.0 of this plugin, support for selecting tiddlers by using tag *expressions* has been replaced with simpler, more efficient "containsAny()" logic.  To create new ~TiddlyWiki documents that contain only those tiddlers selected with advanced AND/OR/NOT Boolean expressions, you can use the filtering features provided by the ExportTiddlersPlugin (see www.TiddlyTools.com/#ExportTiddlersPlugin).
<<<
!!!!!Examples:
<<<
{{{<<newDocument>>}}}
equivalent to {{{<<newDocument new.htm includeNew systemTiddlers>>}}}
creates default "new.htm" containing tiddlers tagged with either<<tag includeNew>>or<<tag systemTiddlers>>
try it: <<newDocument>>

{{{<<newDocument empty.html systemTiddlers>>}}}
creates "empty.html" containing only tiddlers tagged with<<tag systemTiddlers>>
//(reproduces old-style (pre 2.0.2) empty file)//
try it: <<newDocument empty.html systemTiddlers>>

{{{<<newDocument "label:create Import/Export starter" ask importexport>>}}}
save importexport tiddlers to a new file, prompts for path/file
try it: <<newDocument "label:create Import/Export starter" ask importexport>>

{{{<<newDocument ask ask>>}}}
prompts for path/file, prompts for tags to match
try it: <<newDocument ask ask>>

{{{<<newDocument ask all>>}}}
save all current TiddlyWiki contents to a new file, prompts for path/file
try it: <<newDocument ask all>>

{{{<<newDocument ask snap>>}}}
generates snapshot of currently displayed document, prompts for path/file
try it: <<newDocument ask snap>>

<<<
!!!!!Installation
<<<
Import (or copy/paste) the following tiddlers into your document:
''NewDocumentPlugin'' (tagged with <<tag systemConfig>>)
<<<
!!!!!Revision History
<<<
''2006.05.23 [1.4.0]'' due to very poor performance, support for tag *expressions* has been removed, in favor of a simpler "containsAny()" scan for tags.
''2006.04.09 [1.3.6]'' in onClickNewDocument, added call to convertUnicodeToUTF8() to better handle international characters.
''2006.03.15 [1.3.5]'' added nsIFilePicker() handler for selecting filename in moz-based browsers.  IE and other non-moz browsers still use simple prompt() dialog
''2006.03.15 [1.3.0]'' added "label:text" param for custom link text.  added special "all" filter parameter for "save as..." handling (writes all tiddlers to output file)
''2006.03.09 [1.2.0]'' added special "snap" filter parameter to generate and write "snapshot" files containing static HTML+CSS for currently rendered document.
''2006.02.24 [1.1.2]'' Fix incompatiblity with TW 2.0.5 by removing custom definition of getLocalPath() (which is now part of TW core)
''2006.02.03 [1.1.1]'' concatentate 'extra' params so that tag expressions don't have to be quoted.   moved all text to 'formatted' string definitions for easier translation.
''2006.02.03 [1.1.0]'' added support for tag EXPRESSIONS.  plus improved documentation and code cleanup
''2006.02.03 [1.0.0]'' Created.
<<<
!!!!!Credits
<<<
This feature was developed by EricShulman from [[ELS Design Studios|http:/www.elsdesign.com]]
<<<
!!!!!Code
***/
//{{{
version.extensions.newDocument = {major: 1, minor: 3, revision: 6, date: new Date(2006,4,9)};

config.macros.newDocument = {
	newlabel: "new document",
	newprompt: "Create a new TiddlyWiki 'starter' document",
	newdefault: "new.htm",
	allparam: "all",
	saveaslabel: "save as...",
	saveasprompt: "Save current TiddlyWiki to a different file",
	snapparam: "snap",
	snaplabel: "create a snapshot",
	snapprompt: "Create a 'snapshot' of the current TiddlyWiki display",
	snapdefault: "snapshot.htm",
	askparam: "ask",
	labelparam: "label:",
	fileprompt: "Please enter a filename",
	filter: "includeNew OR systemTiddlers",
	filterprompt: "Enter tag(s) to match (use AND, OR, NOT)",
	filtererrmsg: "Error in tag filter '%0'",
	snapmsg: "Document snapshot written to %0",
	okmsg: "%0 tiddlers written to %1",
	failmsg: "An error occurred while creating '%0'"
};

config.macros.newDocument.handler = function(place,macroName,params) {

	var path=getLocalPath(document.location.toString());
	var slashpos=path.lastIndexOf("/"); if (slashpos==-1) slashpos=path.lastIndexOf("\\"); 
	if (slashpos!=-1) path = path.substr(0,slashpos+1); // remove filename from path, leave the trailing slash

	if (params[0] && params[0].substr(0,config.macros.newDocument.labelparam.length)==config.macros.newDocument.labelparam)
		var label=params.shift().substr(config.macros.newDocument.labelparam.length)
	var filename=params.shift(); if (!filename) filename=config.macros.newDocument.newdefault;
	if (params[0]==config.macros.newDocument.snapparam) {
		if (!label) var label=config.macros.newDocument.snaplabel;
		var prompt=config.macros.newDocument.snapprompt;
		var defaultfile=config.macros.newDocument.snapdefault;
	}
	if (params[0]==config.macros.newDocument.allparam) {
		if (!label) var label=config.macros.newDocument.saveaslabel;
		var prompt=config.macros.newDocument.saveasprompt;
		var defaultfile=getLocalPath(document.location.toString());
		var slashpos=defaultfile.lastIndexOf("/"); if (slashpos==-1) slashpos=defaultfile.lastIndexOf("\\");
		if (slashpos!=-1) defaultfile=defaultfile.substr(slashpos+1); // get filename only
	}
	if (!prompt) var prompt=config.macros.newDocument.newprompt;
	if (!label) var label=config.macros.newDocument.newlabel;
	if (!defaultfile) var defaultfile=config.macros.newDocument.newdefault;

	var btn=createTiddlyButton(place,label,prompt,onClickNewDocument);
	btn.path=path;
	btn.file=filename;
	btn.defaultfile=defaultfile;
	btn.filter=params.length?params:[config.macros.newDocument.filter]; 
}

// IE needs explicit global scoping for functions called by browser events
window.onClickNewDocument=function(e)
{
	if (!e) var e = window.event; var btn=resolveTarget(e);

	// get output path/filename
	var filename=btn.file;
	if (filename==config.macros.newDocument.askparam)
		filename=promptForFilename(config.macros.newDocument.fileprompt,btn.path,btn.defaultfile);
	if (!filename) return; // cancelled by user
	// if specified file does not include a path, assemble fully qualified path and filename
	var slashpos=filename.lastIndexOf("/"); if (slashpos==-1) slashpos=filename.lastIndexOf("\\");
	if (slashpos==-1) filename=btn.path+filename;
	// assemble document content, write file, report result
	if (btn.filter[0]==config.macros.newDocument.snapparam) { // HTML+CSS snapshot
		var styles=document.getElementsByTagName("style");
		var out="<html>\n<head>\n<style>\n";
		for(var i=0; i < styles.length; i++) out +="/* stylesheet from tiddler:"+styles[i].getAttribute("id")+" */\n"+styles[i].innerHTML+"\n\n";
		out += "</style>\n</head>\n<body>\n\n"+document.getElementById("contentWrapper").innerHTML+"\n\n</body>\n</html>";
		var msg=saveFile(filename,out)
			?config.macros.newDocument.snapmsg.format([filename])
			:config.macros.newDocument.failmsg.format([filename]);
	} else { // TW starter document
		// get the TiddlyWiki core code source
		var sourcefile=getLocalPath(document.location.toString());
		var source=loadFile(sourcefile);
		if(source==null) { alert(config.messages.cantSaveError); return null; }
		var posOpeningDiv=source.indexOf(startSaveArea);
		var posClosingDiv=source.lastIndexOf(endSaveArea);
		if((posOpeningDiv==-1)||(posClosingDiv==-1)) { alert(config.messages.invalidFileError.format([sourcefile])); return; }
		// get the matching tiddler divs
		var match=btn.filter;
		if (match[0]==config.macros.newDocument.askparam)
			match=prompt(config.macros.newDocument.filterprompt,config.macros.newDocument.filter).readMacroParams();
		if (!match[0]) return; // cancelled by user
		var storeAreaDivs=[];
		var tiddlers=store.getTiddlers('title');
		for (var i=0; i<tiddlers.length; i++)
			if (match[0]==config.macros.newDocument.allparam || (tiddlers[i].tags && tiddlers[i].tags.containsAny(match)) )
				storeAreaDivs.push(tiddlers[i].saveToDiv());
		var out=source.substr(0,posOpeningDiv+startSaveArea.length)+convertUnicodeToUTF8(storeAreaDivs.join("\n"))+"\n\t\t"+source.substr(posClosingDiv);
		var msg=saveFile(filename,out)
			?config.macros.newDocument.okmsg.format([storeAreaDivs.length,filename])
			:config.macros.newDocument.failmsg.format([filename]);
	}
	clearMessage(); displayMessage(msg);
	e.cancelBubble = true; if (e.stopPropagation) e.stopPropagation(); return(false);
}
//}}}

//{{{
function promptForFilename(msg,path,file)
{
	if(!window.Components)
		return prompt(msg,path+file); // fallback for IE and other non-moz browsers
	try {
		netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
		var nsIFilePicker = window.Components.interfaces.nsIFilePicker;
		var picker = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
		picker.init(window, msg, nsIFilePicker.modeSave);
		var thispath = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		thispath.initWithPath(path);
		picker.displayDirectory=thispath;
		picker.defaultExtension="html";
		picker.defaultString=file;
		picker.appendFilters(nsIFilePicker.filterAll|nsIFilePicker.filterText|nsIFilePicker.filterHTML);
		var result = picker.show();
		if (result == nsIFilePicker.returnOK) return picker.file.persistentDescriptor;
	}
	catch(e) { alert('error during local file access: '+e.toString()) }
}
//}}}