/***
|Name|FileDropPluginConfig|
|Source|http://www.TiddlyTools.com/#FileDropPluginConfig|
|Version|1.5.1|
|Author|Eric Shulman - ELS Design Studios|
|License|http://www.TiddlyTools.com/#LegalStatements <br>and [[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|~CoreVersion|2.1|
|Type|plugin|
|Requires|FileDropPlugin, AttachFilePlugin|
|Overrides||
|Options|##Configuration|
|Description|Adds drag-and-drop handlers for creating binary attachments or directory lists|

__TiddlyTools FileDrop+AttachFile extended handler:__
* use just filename instead of whole path as tiddler title
* check for existing tiddler and prompt for new name
* handle folder drops (drops each file or creates a file list in a tiddler)
* use AttachFilePlugin if MIME type is not text/plain
* autotag created tiddlers (e.g., "temporary", "dropped", etc.)
* option to suppress automatic display of newly created tiddlers
* suspend/resume notifications when handling multiple files (performance improvement)
!!!!!Configuration
<<<
<<option chkFileDropTrimFilename>> Omit file extensions from tiddler titles when creating new tiddlers
&nbsp;&nbsp;{{{usage: <<option chkFileDropTrimFilename>> }}}
<<option chkFileDropDisplay>> Automatically display newly created tiddlers
&nbsp;&nbsp;{{{usage: <<option chkFileDropDisplay>> }}}
Tag newly created tiddlers with: <<option txtFileDropTags>>
&nbsp;&nbsp;{{{usage: <<option txtFileDropTags>>}}}

__FileDrop+AttachFile configuration options:__
<<option chkFileDropAttachLocalLink>> Include reference to local path/filename
&nbsp;&nbsp;{{{usage: <<option chkFileDropAttachLocalLink>> }}}
<<option chkFileDropAttachEncodeData>> Include binary file data as encoded "base64" text
&nbsp;&nbsp;{{{usage: <<option chkFileDropAttachEncodeData>> }}}
...only if file is smaller than: <<option txtFileDropAttachDataLimit>> bytes
&nbsp;&nbsp;{{{usage: <<option txtFileDropAttachDataLimit>>}}}

See [[FileDropPlugin]] for more documentation on handler implementation specifics, including sample code for default drop handlers.
<<<
!!!!!Revisions
<<<
2008.08.11 [1.5.1] added chkFileDropAttachLocalLink option to allow suppression of local path/file link
2007.01.01 [0.9.9] initial release with extensions for AttachFilePlugin
<<<
!!!!!Code
***/
//{{{
if (config.options.chkFileDropAttachEncodeData==undefined)
	config.options.chkFileDropAttachEncodeData=true;
if (config.options.chkFileDropAttachLocalLink==undefined)
	config.options.chkFileDropAttachLocalLink=true;
if (config.options.txtFileDropAttachDataLimit==undefined)
	config.options.txtFileDropAttachDataLimit=32768;
if (config.options.txtFileDropTags==undefined)
	config.options.txtFileDropTags="";
if (config.options.chkFileDropDisplay==undefined)
	config.options.chkFileDropDisplay=true;
if (config.options.chkFileDropTrimFilename==undefined)
	config.options.chkFileDropTrimFilename=false;

config.macros.fileDrop.addEventListener("application/x-moz-file",function(nsiFile)
{
	var header="Index of %0\n^^(as of %1)^^\n|!filename| !size | !modified |\n";
	var item="|[[%0|%1]]| %2|%3|\n";
	var footer="Total of %0 bytes in %1 files\n";

	var now=new Date();
	var files=[nsiFile];
	if (nsiFile.isDirectory()) {
		var folder=nsiFile.directoryEntries;
		var files=[];
		while (folder.hasMoreElements()) {
			var f=folder.getNext().QueryInterface(Components.interfaces.nsILocalFile);
			if (f instanceof Components.interfaces.nsILocalFile && !f.isDirectory()) files.push(f);
		}
		var msg=nsiFile.path.replace(/\\/g,"/")+"\n\n";
		msg+="contains "+files.length+" files... ";
		msg+="select OK to attach all files or CANCEL to create a list...";
		if (!confirm(msg)) { // create a list in a tiddler
			var title=nsiFile.leafName; // tiddler name is last directory name in path
			while (title && title.length && store.tiddlerExists(title)) {
				if (confirm(config.messages.overwriteWarning.format([title]))) break; // use existing title
				title=prompt("Please enter a different tiddler title for this file",nsiFile.path.replace(/\\/g,"/"));
			}
			if (!title || !title.length) return true; // aborted by user... we're done!
			var text=header.format([nsiFile.path.replace(/\\/g,"/"),now.toLocaleString()]);
			var total=0;
			for (var i=0; i<files.length; i++) { var f=files[i];
				var name=f.leafName;
				if (config.options.chkFileDropTrimFilename)
					{ var p=name.split("."); if (p.length>1) p.pop(); name=p.join("."); }
				var path="file:///"+f.path.replace(/\\/g,"/");
				var size=f.fileSize; total+=size;
				var when=new Date(f.lastModifiedTime).formatString("YYYY.0MM.0DD 0hh:0mm:0ss");
				text+=item.format([name,path,size,when]);
			}
			text+=footer.format([total,files.length]);
			var newtags=config.options.txtFileDropTags?config.options.txtFileDropTags.readBracketedList():[];
			store.saveTiddler(null,title,text,config.options.txtUserName,now,newtags);
			if (config.options.chkFileDropDisplay) story.displayTiddler(null,title);
			return true;
		}
	}
	if (files.length>1) store.suspendNotifications();
	for (i=0; i<files.length; i++) {
		var file=files[i];
		if (file.isDirectory()) continue; // skip over nested directories
		var type="text/plain";
		var title=file.leafName; // tiddler name is file name
		if (config.options.chkFileDropTrimFilename)
			{ var p=title.split("."); if (p.length>1) p.pop(); title=p.join("."); }
		var path=file.path;
		var size=file.fileSize;
		while (title && title.length && store.tiddlerExists(title)) {
			if (confirm(config.messages.overwriteWarning.format([title]))) break; // use existing title
			title=prompt("Please enter a different tiddler title for this file",path.replace(/\\/g,"/"));
		}
		if (!title || !title.length) continue; // cancelled by user... skip this file
		if (config.macros.attach) {
			type=config.macros.attach.getMIMEType(file.leafName,"");
			if (!type.length)
				type=prompt("Unrecognized file type.  Please enter a MIME type for this file","text/plain");
			if (!type||!type.length) continue; // cancelled by user... skip this file
		}
		var newtags=config.options.txtFileDropTags?config.options.txtFileDropTags.readBracketedList():[];
		if (type=="text/plain")
			store.saveTiddler(null,title,loadFile(path),config.options.txtUserName,now,newtags);
		else {
			// only encode data if enabled and file is smaller than limit.  Default is 32768 (32K) bytes.
			var embed=config.options.chkFileDropAttachEncodeData
				&& file.fileSize<config.options.txtFileDropAttachDataLimit;
			newtags.push("attachment"); newtags.push("excludeMissing");
			var localfile="";
			if (config.options.chkFileDropAttachLocalLink) {
				// if file is in current document folder,
				// remove path prefix and use relative reference
				var localfile=path;
				var h=document.location.href;
				folder=getLocalPath(decodeURIComponent(h.substr(0,h.lastIndexOf("/")+1)));
				if (localfile.substr(0,folder.length)==folder)
					localfile='./'+localfile.substr(folder.length);
			}
			config.macros.attach.createAttachmentTiddler(path,
				now.formatString(config.macros.timeline.dateFormat),
				"attached by FileDropPlugin", newtags,
				title, embed, config.options.chkFileDropAttachLocalLink, false,
				localfile, "", type,!config.options.chkFileDropDisplay);
		}
		if (config.options.chkFileDropDisplay) story.displayTiddler(null,title);
	}
	if (files.length>1) { store.resumeNotifications(); store.notifyAll(); }
	if (window.FFDEBUG) console.log(new Date()-now);
	return true;
})
//}}}