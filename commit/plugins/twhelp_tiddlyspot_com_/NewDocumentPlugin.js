/***
|Name|NewDocumentPlugin|
|Source|http://www.TiddlyTools.com/#NewDocumentPlugin|
|Version|1.7.0|
|Author|Eric Shulman - ELS Design Studios|
|License|http://www.TiddlyTools.com/#LegalStatements <br>and [[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|~CoreVersion|2.1|
|Type|plugin|
|Requires||
|Overrides||
|Description|Quickly create new TiddlyWiki documents from your existing document, with just one click|

Use the {{{<<newDocument>>}}} macro to place a "new document" link into your sidebar/mainmenu/any tiddler (wherever you like).  Select this command to automatically create a "new.html" document containing a specific set of tagged tiddlers.  Optional parameters let you specify an alternate path/filename for the new file, or different tags to match.  You can also indicate "ask" for either parameter, which will  trigger a prompt for input when the command is selected.

!!!!!Usage

<<<
{{{<<newDocument label:text prompt:text filename tag tag tag...>>}}}
{{{<<newDocument label:text prompt:text filename all>>}}}
{{{<<newDocument label:text prompt:text filename snap ID>>}}}
{{{<<newDocument label:text prompt:text filename snap here>>}}}
{{{<<newDocument label:text prompt:text nofile print ID>>}}}
{{{<<newDocument label:text prompt:text nofile print here>>}}}
 where:
* ''label:text'' defines //optional// alternative link text (replaces default "new document" display)
* ''prompt:text'' defines //optional// alternative tooltip text for 'mouseover' prompting (replaces default hard-coded tooltip text)
* ''filename'' is any local path-and-filename.  If no parameters are provided, the default is to create the file "new.html" in the current directory.  If a filename is provided without a path (i.e., there is no "/" in the input), then the current directory is also assumed.  Otherwise, this parameter is expected to contain the complete path and filename needed to write the file to your local hard disk.  If ''ask'' is used in place of the filename parameter then, when the command link is selected, a message box will be automatically displayed so you can select/enter the path and filename.
* ''tag tag tag...'' is a list of one or more space-separated tags (use quotes or {{{[[]]}}} around tags that contain spaces).  The new document will include all tiddlers that match at least one of the tags in the list.  The default is to include tiddlers tagged with <<tag includeNew>>.    The special value ''all'' may be used to match every tiddler (even those without tags).   If ''ask'' is used in place of the tags then, when the command link is selected, a message box will be automatically displayed so you can enter the desired tags at that time.
* When you use the keyword ''snap'' in place of the tags, you can generate a file containing the //rendered//  CSS-and-HTML that is currently being displayed in browser.  By default, the snapshop uses the 'contentWrapper' DOM element ID to automatically include all the TiddlyWiki elements, such as the sidebars and header, in addition to the center 'story' column containing the tiddler content.
* When you use the keyword ''print'' in place of the tags, a snapshot is generated, but the contents are not written to a file.  Instead, they are displayed in a separate browser tab/window, and the print dialog for that tab/window is automatically invoked.
* You can limit the snapshot to capture only a portion of the rendered TiddlyWiki elements by specifiying an optional alternate DOM element ID, such as "displayArea" (the entire center 'story' column) or even just a single tiddler (e.g., "tidderMyTiddlerTitle", assuming that "MyTiddlerTitle" is currently displayed).  Only the portions of the document that are contained //within// the specified DOM element will be transcribed to the resulting snapshot file.  If ''ask'' is used in place of a DOM element ID, you will be prompted to enter the ID (default is "contentWrapper") when the snapshot is being taken.  This allows you to easily enter the ID of any currently displayed tiddler to make quick snapshots of specific tiddlers.  If ''here'' is used in place of a DOM element ID, the current tiddler id is used.

Note: as of version 1.4.0 of this plugin, support for selecting tiddlers by using tag *expressions* has been replaced with simpler, more efficient "containsAny()" logic.  To create new ~TiddlyWiki documents that contain only those tiddlers selected with advanced AND/OR/NOT Boolean expressions, you can use the filtering features provided by the ExportTiddlersPlugin (see www.TiddlyTools.com/#ExportTiddlersPlugin).

<<<
!!!!!Examples:
<<<
{{{<<newDocument>>}}}
equivalent to {{{<<newDocument new.htm includeNew systemTiddlers>>}}}
creates default "new.html" containing tiddlers tagged with either<<tag includeNew>>or<<tag systemTiddlers>>
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

{{{<<newDocument ask snap here>>}}}
generates snapshot of this tiddler ONLY, prompts for path/file
try it: <<newDocument ask snap here>>

{{{<<newDocument ask print here>>}}}
prints a snapshot of this tiddler ONLY
try it: <<newDocument nofile print here>>

<<<
!!!!!Installation
<<<
Import (or copy/paste) the following tiddlers into your document:
''NewDocumentPlugin'' (tagged with <<tag systemConfig>>)

<<<
!!!!!Revision History
<<<
''2007.12.04 [*.*.*]'' update for TW2.3.0: replaced deprecated core functions, regexps, and macros
''2007.03.30 [1.7.0]'' added support for "print" param as alternative for "snap".  When "print" is used, the filename is ignored and ouput is directed to another browser tab/window, where the print dialog is then automatically triggered.
''2007.03.30 [1.6.1]'' added support for "here" keyword for current tiddler elementID and "prompt:text" param for specifying tooltip text
''2007.02.12 [1.6.0]'' in onClickNewDocument(), reset HTML source 'markup'
''2006.10.23 [1.5.1]'' in onClickNewDocument(), get saved parameter value for snapID instead of using default "contentWrapper" (oops!)
''2006.10.18 [1.5.0]'' new optional param for 'snap'... specify alternative DOM element ID (default is still "contentWrapper").  Based on a suggestion from Xavier Verges.
''2006.08.03 [1.4.3]'' in promptForFilename(), for IE (WinXP only), added handling for UserAccounts.CommonDialog
''2006.07.29 [1.4.2]'' in onClickNewDocument(), okmsg display is now linked to newly created file
''2006.07.24 [1.4.1]'' in promptForFilename(), check for nsIFilePicker.returnCancel to allow nsIFilePicker.returnOK **OR** nsIFilePicker.returnReplace to be processed.
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
version.extensions.newDocument = {major: 1, minor: 7, revision: 0, date: new Date(2007,3,30)};

config.macros.newDocument = {
	newlabel: "new document",
	newprompt: "Create a new TiddlyWiki 'starter' document",
	newdefault: "new.html",
	allparam: "all",
	saveaslabel: "save as...",
	saveasprompt: "Save current TiddlyWiki to a different file",
	printparam: "print",
	snapparam: "snap",
	snaplabel: "create a snapshot",
	snapprompt: "Create a 'snapshot' of the current TiddlyWiki display",
	snapdefault: "snapshot.html",
	snapID: "contentWrapper",
	snapIDprompt: "Please enter a DOM element ID for the desired content",
	snapIDerrmsg: "Unrecognized document element ID: '%0'",
	askparam: "ask",
	hereparam: "here",
	labelparam: "label:",
	promptparam: "prompt:",
	fileprompt: "Please enter a filename",
	filter: "includeNew",
	filterprompt: "Match one or more tags:\n(space-separated, use [[...]] around tags containing spaces)",
	filtererrmsg: "Error in tag filter '%0'",
	snapmsg: "Document snapshot written to %1",
	okmsg: "%0 tiddlers written to %1",
	failmsg: "An error occurred while creating %0"

};

config.macros.newDocument.handler = function(place,macroName,params) {

	var path=getLocalPath(document.location.href);
	var slashpos=path.lastIndexOf("/"); if (slashpos==-1) slashpos=path.lastIndexOf("\\"); 
	if (slashpos!=-1) path = path.substr(0,slashpos+1); // remove filename from path, leave the trailing slash

	if (params[0] && params[0].substr(0,config.macros.newDocument.labelparam.length)==config.macros.newDocument.labelparam)
		var label=params.shift().substr(config.macros.newDocument.labelparam.length)
	if (params[0] && params[0].substr(0,config.macros.newDocument.promptparam.length)==config.macros.newDocument.promptparam)
		var prompt=params.shift().substr(config.macros.newDocument.promptparam.length)
	var filename=params.shift(); if (!filename) filename=config.macros.newDocument.newdefault;
	if (params[0]==config.macros.newDocument.snapparam || params[0]==config.macros.newDocument.printparam) {
		var printmode=(params[0]==config.macros.newDocument.printparam);
		params.shift();
		if (!label) var label=config.macros.newDocument.snaplabel;
		if (!prompt) var prompt=config.macros.newDocument.snapprompt;
		var defaultfile=config.macros.newDocument.snapdefault;
		var snapID=config.macros.newDocument.snapID;// default to "contentWrapper"
		if (params[0]) var snapID=params.shift(); // alternate DOM element for snapshot
	}
	if (params[0]==config.macros.newDocument.allparam) {
		if (!label) var label=config.macros.newDocument.saveaslabel;
		if (!prompt) var prompt=config.macros.newDocument.saveasprompt;
		var defaultfile=getLocalPath(document.location.href);
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
	btn.snapID=snapID; // NULL unless snapshot is being taken
	btn.printmode=printmode;
	btn.filter=params.length?params:[config.macros.newDocument.filter]; 
}

// IE needs explicit global scoping for functions called by browser events
window.onClickNewDocument=function(e)
{
	if (!e) var e = window.event; var btn=resolveTarget(e);

	// assemble document content, write file, report result
	var okmsg=config.macros.newDocument.okmsg;
	var failmsg=config.macros.newDocument.failmsg;
	var count=0;
	var out="";
	if (btn.snapID) { // HTML+CSS snapshot
		var snapID=btn.snapID;
		if (btn.snapID==config.macros.newDocument.askparam)
			snapID=prompt(config.macros.newDocument.snapIDprompt,config.macros.newDocument.snapID);
		if (btn.snapID==config.macros.newDocument.hereparam)
			{ var here=story.findContainingTiddler(btn); if (here) snapID=here.id; }
		if (!document.getElementById(snapID)) { // if specified element does not exist
			if (snapID) // ID=null if prompt was cancelled by user
				displayMessage(config.macros.newDocument.snapIDerrmsg.format([snapID]));
			e.cancelBubble = true; if (e.stopPropagation) e.stopPropagation(); return(false);
		}
		var styles=document.getElementsByTagName("style");
		out+="<html>\n<head>\n<style>\n";
		for(var i=0; i < styles.length; i++)
			out +="/* stylesheet from tiddler:"+styles[i].getAttribute("id")+" */\n"+styles[i].innerHTML+"\n\n";
		out+="</style>\n</head>\n<body>\n\n"+document.getElementById(snapID).innerHTML+"\n\n</body>\n</html>";
		okmsg=config.macros.newDocument.snapmsg;
	} else { // TW starter document
		// get the TiddlyWiki core code source
		var sourcefile=getLocalPath(document.location.href);
		var source=loadFile(sourcefile);
		if(source==null) { alert(config.messages.cantSaveError); return null; }
		// reset existing HTML source markup
		source=updateMarkupBlock(source,"PRE-HEAD");
		source=updateMarkupBlock(source,"POST-HEAD");
		source=updateMarkupBlock(source,"PRE-BODY");
		source=updateMarkupBlock(source,"POST-BODY");
		// find store area
		var posOpeningDiv=source.indexOf(startSaveArea);
		var posClosingDiv=source.lastIndexOf(endSaveArea);
		if((posOpeningDiv==-1)||(posClosingDiv==-1)) { alert(config.messages.invalidFileError.format([sourcefile])); return; }
		// get the matching tiddler divs
		var match=btn.filter;
		if (match[0]==config.macros.newDocument.askparam) { // ask user for tags
			var newfilt=prompt(config.macros.newDocument.filterprompt,config.macros.newDocument.filter);
			if (!newfilt) return;  // cancelled by user
			match=newfilt.readMacroParams();
		}
		var storeAreaDivs=[];
		var tiddlers=store.getTiddlers('title');
		for (var i=0; i<tiddlers.length; i++)
			if (match[0]==config.macros.newDocument.allparam || (tiddlers[i].tags && tiddlers[i].tags.containsAny(match)) )
				storeAreaDivs.push(store.getSaver().externalizeTiddler(store,tiddlers[i]));
		out+=source.substr(0,posOpeningDiv+startSaveArea.length);
		out+=convertUnicodeToUTF8(storeAreaDivs.join("\n"))+"\n\t\t";
		out+=source.substr(posClosingDiv);
		count=storeAreaDivs.length;
	}
	if (btn.printmode) {
		var win=window.open("","_blank","");
		win.document.open();
		win.document.writeln(out);
		win.document.close();
		win.focus(); // bring to front
		win.print(); // trigger print dialog
	} else {
		// get output path/filename
		var filename=btn.file;
		if (filename==config.macros.newDocument.askparam)
			filename=promptForFilename(config.macros.newDocument.fileprompt,btn.path,btn.defaultfile);
		if (!filename) return; // cancelled by user
		// if specified file does not include a path, assemble fully qualified path and filename
		var slashpos=filename.lastIndexOf("/"); if (slashpos==-1) slashpos=filename.lastIndexOf("\\");
		if (slashpos==-1) filename=btn.path+filename;
		var ok=saveFile(filename,out);
		var msg=ok?okmsg.format([count,filename]):failmsg.format([filename]);
		var link=ok?"file:///"+filename.replace(/\\/g,'/'):""; // change local path to link text
		clearMessage(); displayMessage(msg,link);
	}
	e.cancelBubble = true; if (e.stopPropagation) e.stopPropagation(); return(false);
}
//}}}

//{{{
function promptForFilename(msg,path,file)
{
	if(window.Components) { // moz
		try {
			netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
			var nsIFilePicker = window.Components.interfaces.nsIFilePicker;
			var picker = Components.classes['@mozilla.org/filepicker;1'].createInstance(nsIFilePicker);
			picker.init(window, msg, nsIFilePicker.modeSave);
			var thispath = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
			thispath.initWithPath(path);
			picker.displayDirectory=thispath;
			picker.defaultExtension='html';
			picker.defaultString=file;
			picker.appendFilters(nsIFilePicker.filterAll|nsIFilePicker.filterText|nsIFilePicker.filterHTML);
			if (picker.show()!=nsIFilePicker.returnCancel) var result=picker.file.persistentDescriptor;
		}
		catch(e) { alert('error during local file access: '+e.toString()) }
	}
	else { // IE
		try { // XP only
			var s = new ActiveXObject('UserAccounts.CommonDialog');
			s.Filter='All files|*.*|Text files|*.txt|HTML files|*.htm;*.html|';
			s.FilterIndex=3; // default to HTML files;
			s.InitialDir=path;
			s.FileName=file;
			if (s.showOpen()) var result=s.FileName;
		}
		catch(e) { var result=prompt(msg,path+file); } // fallback for non-XP IE
	}
	return result;
}
//}}}