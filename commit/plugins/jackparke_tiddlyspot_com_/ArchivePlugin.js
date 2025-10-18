/***
|''Name:''|ArchivePlugin|
|''Version:''|2.4.0 (2 Jun 2008)|
|''Source''|http://jackparke.googlepages.com/jtw.html#ArchivePlugin ([[del.icio.us|http://del.icio.us/post?url=http://jackparke.googlepages.com/jtw.html%23ArchivePlugin]])|
|''Author:''|[[Jack]]|
|''Type:''|Plugin|
!Description
The archive plugin allows you to store tiddler text outside of the tiddlywiki file.
Typically you would tag bulky tiddlers or those with infrequently needed content as "Archive" and these would
then be archived as separate html files in the sub folder called "archive".
!Usage
#Create a folder "archive" in the same folder as your tiddlywiki file.
#Install the Archive Plugin and reload your tiddlywiki
#Tag your bulky tiddlers with "Archive"
#Save your tiddlywiki file
!To Do
* Synchronize tiddler renames/deletions with file system
* Lazy loading of archived files via HTTP
!Code
***/
//{{{
version.extensions.ArchivePlugin = {major: 2, minor: 4, revision: 0, date: new Date("Jun 6, 2008")};
config.macros.ArchivePlugin = {};
config.macros.ArchivePlugin.init = function () {
 this.archivePath = getWikiPath('archive');
}

// Hijacking the built-in functions
TW21Saver.prototype.externalizeTiddler = function(store,tiddler)
{
	try {
		var extendedAttributes = "";
		var usePre = config.options.chkUsePreForStorage;
		store.forEachField(tiddler,
			function(tiddler,fieldName,value) {
				// don't store stuff from the temp namespace
				if(typeof value != "string")
					value = "";
				if (!fieldName.match(/^temp\./))
					extendedAttributes += ' %0="%1"'.format([fieldName,value.escapeLineBreaks().htmlEncode()]);
			},true);
		var created = tiddler.created.convertToYYYYMMDDHHMM();
		var modified = tiddler.modified.convertToYYYYMMDDHHMM();
		var vdate = version.date.convertToYYYYMMDDHHMM();
		var attributes = tiddler.modifier ? ' modifier="' + tiddler.modifier.htmlEncode() + '"' : "";
		attributes += (usePre && modified == created) ? "" : ' modified="' + modified +'"';
		attributes += (usePre && created == vdate) ? "" :' created="' + created + '"';
		var tags = tiddler.getTags();
		if(!usePre || tags)
			attributes += ' tags="' + tags.htmlEncode() + '"';
		return ('<div %0="%1"%2%3>%4</'+'div>').format([
				usePre ? "title" : "tiddler",
				tiddler.title.htmlEncode(),
				attributes,
				extendedAttributes,
				usePre ? "\n<pre>" + tiddler.saveMe() + "</pre>\n" : tiddler.escapeLineBreaks().htmlEncode()
			]);
	} catch (ex) {
		throw exceptionText(ex,config.messages.tiddlerSaveError.format([tiddler.title]));
	}
};

Tiddler.prototype.saveMe = function() {
 if (this.tags.indexOf('Archive') != -1) {
 // Save tiddler body to a file in the archive folder
 if (this.text) saveFile(config.macros.ArchivePlugin.archivePath + this.title.filenameEncode() + '.html', this.text)
 return '';
 }
 else
 return this.text.htmlEncode();
}

// This hijack ensures plugins can also be archived
var archivePlugin_getPluginInfo = getPluginInfo;
getPluginInfo = function(tiddler) {
alert(tiddler.title)
 tiddler.text = store.getValue(tiddler, 'text');
 return archivePlugin_getPluginInfo(tiddler);
}

TiddlyWiki.prototype.getValue = function(tiddler, fieldName) {
 var t = this.resolveTiddler(tiddler);
 if (!t)
 return undefined;

 fieldName = fieldName.toLowerCase();

 if (t.tags.indexOf('Archive')!=-1 && fieldName=='text' && t['text']=='') {
 try {
   var tmp = loadFile(config.macros.ArchivePlugin.archivePath + t.title.filenameEncode() + '.html');
   tmp = (tmp.charCodeAt(0) == 239 ? manualConvertUTF8ToUnicode(tmp) : tmp);
 } catch (e) {
   return ''; //alert("{{{Error: Unable to load file '" + config.macros.ArchivePlugin.archivePath + t.title.filenameEncode() + '.html' + "'}}}");
 }
return tmp;
 } else {
 var accessor = TiddlyWiki.standardFieldAccess[fieldName];
 if (accessor) {
 return accessor.get(t);
 }
 }
 
 return t.fields ? t.fields[fieldName] : undefined;
}

String.prototype.filenameEncode = function() {
 return(this.toLowerCase().replace(/[^a-z0-9_-]/g ,"_"));
}

function getWikiPath(folderName) {
 var originalPath = document.location.toString();
 if(originalPath.substr(0,5) != 'file:') {
 alert(config.messages.notFileUrlError);
 if(store.tiddlerExists(config.messages.saveInstructions))
 story.displayTiddler(null,config.messages.saveInstructions);
 return;
 }
 var localPath = getLocalPath(originalPath);
 var backSlash = localPath.lastIndexOf('\\') == -1 ? '/' : '\\';
 var dirPathPos = localPath.lastIndexOf(backSlash);
 var subPath = localPath.substr(0,dirPathPos) + backSlash + (folderName ? folderName + backSlash : '');
 return subPath;
}
// Deleting archive files
TiddlyWiki.prototype.archivePlugin_removeTiddler = TiddlyWiki.prototype.removeTiddler;
TiddlyWiki.prototype.removeTiddler = function(title) {
 var tiddler = store.getTiddler(title);
 var filePath = config.macros.ArchivePlugin.archivePath + title.filenameEncode() + '.html';
 if (tiddler.tags.indexOf('Archive') != -1) ieDeleteFile(filePath);
 this.archivePlugin_removeTiddler(title);
}
function ieDeleteFile(filePath) {
// IE Support only
 if (!config.browser.isIE) return false;
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
	} catch(ex) {return null;}
	try {
	 var file = fso.GetFile(filePath);
	 file.Delete();
	} catch(ex) {return null;}
	return true;
}
//}}}