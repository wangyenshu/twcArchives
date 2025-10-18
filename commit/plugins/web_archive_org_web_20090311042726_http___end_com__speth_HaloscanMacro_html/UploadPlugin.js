/***


----
UploadPlugin, with [[store.php]] and [[.htaccess]] provide the @@upload@@ and the @@save to web@@ functions. See HowToUpload.
The french translation available as a separate tiddler UploadPluginMsgFR
----


***/

/***
|''Name:''|UploadPlugin|
|''Type:''|Plugin|
|''Version:''|3.0.1 (18-Jan-2006)|
|''Source:''|[[TiddlyWiki.BidiX.info|http://tiddlywiki.BidiX.info/#UploadPlugin]]|
|''Author:''|BidiX[at]BidiX.info|
|''Compatibility:''|TW1.2 & TW2|
!Usage : 
{{{
<<upload storeUrl [toFilename [backupDir]]>>
 storeUrl : the url of the store.php to POST the TiddlyWiki
 toFilename : the filename in the storeUrl directory
 backupDir : if present backup the previous toFilename file
 to the backupDir directory
}}}

Install the {{{<<upload ... >>}}} macro in SideBarOptions just below the {{{<<saveChanges>>}}} macro.

!Description
!!Plugin
*If the TiddlyWiki came from @@local disk@@ :
**{{{<<saveChanges>>}}} 
***display as ''save to disk''
***work as usual
**{{{<<upload ...>>}}}
***display as ''upload''
***after saving to disk, upload in the storeUrl directory.
*If the TiddlyWiki came from @@website@@ :
**{{{<<saveChanges>>}}} 
***print nothing
***has been disabled
**{{{<<upload ...>>}}}
***display as '''save to web''
***save in the storeUrl directory.
*If GenerateAnRssFeed is set :
**generate the content of the RSSFeed 
**upload the RssFile
**Caution : use the SiteUrl tiddler to specify url of the TiddlyWiki in the generated RssFile
*DisplayMessage
*Log upload in UploadLog
hint : if UploadLog is the first tiddler in the Timeline Tab, no tiddler has been updated since last upload.

!!store.php
*method GET
**display an information page
*method POST
**if toFilename already exists and backDir parameter specified
***rename toFilename to backupDir/toFilename.AAAAMMDD.HHSS.html
**copy temporaryUploadedFile to toFilename
** return status
!User manual
See HowToUpload
!Installation :
*Install the UploadPlugin as usual
*Upload the [[store.php]] file on your php aware webserver in your TiddlyWiki directory
*Protect your directory : 
**for Apache web server ([[for detail see Apache documentation|http://httpd.apache.org/docs/1.3/howto/htaccess.html]]) : 
***configure the [[.htaccess]] :
****Set the /full/path/from/root/to/your/.passwd file
****<limit xxx> :
*****For a private access to your TiddlyWiki directory set ''<limit GET POST>''
*****For a public access to your TiddlyWiki files, but a private uploading facility set ''<limit POST>''
***Upload [[.passwd]] and [[.htaccess]] files
**for other web servers see the appropriate documentation
*Configure an upload button, for example in the SideBarOptions
!Suppported Browser
*Firefox : Ok
*Internet Explorer : Ok
*Others : Not tested, please report status.

!Revision history
* v1.0.0 (17-Dec-2005)
** first public working version
*v1.0.1 (23-Dec-2005)
**reformatting code
*v1.0.2 (24-Dec-2005)
**Optional parameter toFilename
**Optional parameter backupDir
*v1.0.3 (26-Dec-2005)
**UploadLog tiddler
*v1.1.0 (27-Dec-2005)
**Upload RSS File
*V2.0.0 (3-Jan-2006)
**Save to web
**Compatibilty with TiddlyWiki 1.2.39 and TiddlyWiki 2.0.0 Beta 6
*V2.0.1 (8-Jan-2006)
**Compatibilty with TiddlyWiki 2.0.1
*V2.0.2 (8-Jan-2006)
**SiteTitle and SiteSubtitle in web page Title
*V3.0.0 (15-Jan-2006)
**Asynchronous upload
**Synchronous upload before unload of the page
**All strings extracted in macro config
**Compatibility checked with TW 2.0.2 & TW 1.2.39 for both FF 1.5 and IE 6
*V3.0.1 (18-Jan-2006)
**UTF8toUnicode conversion problem in Firefox

!Code
***/
//{{{
version.extensions.UploadPlugin = {major: 3, minor: 0, revision: 1, date: new Date(2006,1,18)};

//
// Upload Macro
//

config.macros.upload = {
 label: "upload", 
 saveLabel: "save to web", 
 prompt: "Save and Upload this TiddlyWiki in ", 
 accessKey: "U",
 formName: "UploadPlugin",
 contentType: "text/html;charset=UTF-8",
 defaultStoreScript: "store.php"
};

// only this config need to be translated
config.macros.upload.messages = {
 aboutToUpload: "About to upload TiddlyWiki to %0",
 errorDownloading: "Error downloading",
 errorUploadingContent: "Error uploading content",
 fileNotFound: "file to upload not found",
 fileNotUploaded: "File %0 NOT uploaded",
 label: "upload", 
 mainFileUploaded: "Main TiddlyWiki file uploaded to %0",
 prompt: "Save and Upload this TiddlyWiki in ", 
 urlParamMissing: "url param missing",
 rssFileNotUploaded: "RssFile %0 NOT uploaded",
 rssFileUploaded: "Rss File uploaded to %0",
 saveLabel: "save to web", 
 saveToDisk: "save to disk"
};

config.macros.upload.label = config.macros.upload.messages.label; 
config.macros.upload.saveLabel = config.macros.upload.messages.saveLabel; 
config.macros.upload.prompt = config.macros.upload.messages.prompt;


config.macros.upload.handler = function(place,macroName,params){
 var url;
 if (params[0]) {
 url = params[0];
 this.defaultStoreScript = basename(url);
 }
 else
 url = dirname(document.location.toString())+"/"+ this.defaultStoreScript;
 var toFilename=params[1];
 var backupDir=params[2];
 var label;
 if (document.location.toString().substr(0,5) == "http:")
 label = this.saveLabel;
 else
 label = this.label;
 createTiddlyButton(place, label, this.prompt+dirname(url), 
 function () {upload(url, toFilename, backupDir, true); return false;}, 
 null, null, this.accessKey);
};

//
// TiddlyWiki Core patches
//

// overwrite the saveChanges handler 
// configure no Macro instead of saveChanges Macro in case of http: access
config.macros.saveChanges.label = config.macros.upload.messages.saveToDisk;
config.macros.saveChanges.handler = function(place,macroName,params)
{
 if(!readOnly) {
 if (document.location.toString().substr(0,5) != "http:") 
 createTiddlyButton(place,this.label,this.prompt,function () {saveChanges(); return false;},null,null,this.accessKey);
 // else no TiddlyButton
 }
}

// Check if there is any unsaved changes before exiting
// if unsaved changes : saveOrUpload
//function checkUnsavedChanges()
checkUnsavedChanges = function ()
{
 if(store && store.dirty) {
 if(confirm(config.messages.unsavedChangesWarning))
 saveOrUpload(false); // Because called by <body onunload=... Upload must be synchronous
 }
}

//
// Utility functions 
//

function dirname(filePath)
{
 if ((lastpos = filePath.lastIndexOf("/")) != -1)
 return filePath.substring(0, lastpos);
 else
 return filePath.substring(0, filePath.lastIndexOf("\\"));
}

function basename(filePath)
{
 if ((lastpos = filePath.lastIndexOf("#")) != -1) 
 filePath = filePath.substring(0, lastpos);
 if ((lastpos = filePath.lastIndexOf("/")) != -1)
 return filePath.substring(lastpos + 1);
 else
 return filePath.substring(filePath.lastIndexOf("\\")+1);
}

// TiddlyWiki utilities

function getLocalPath() {
 //extract from the Jeremy's SaveFile 
 var originalPath = document.location.toString();
 // Check we were loaded from a file URL
 if(originalPath.substr(0,5) != "file:")
 {
 alert(config.messages.notFileUrlError);
 displayTiddler(null,"SaveChanges",0,null,null,false,false);
 return;
 }
 // Remove any location part of the URL
 var hashPos = originalPath.indexOf("#");
 if(hashPos != -1)
 originalPath = originalPath.substr(0,hashPos);
 // Convert to a native file format assuming
 // "file:///x:/path/path/path..." - pc local file --> "x:\path\path\path..."
 // "file://///server/share/path/path/path..." - FireFox pc network file --> "\\server\share\path\path\path..."
 // "file:///path/path/path..." - mac/unix local file --> "/path/path/path..."
 // "file://server/share/path/path/path..." - pc network file --> "\\server\share\path\path\path..."
 var localPath;
 if(originalPath.charAt(9) == ":") // pc local file
 localPath = unescape(originalPath.substr(8)).replace(new RegExp("/","g"),"\\");
 else if(originalPath.indexOf("file://///") == 0) // FireFox pc network file
 localPath = "\\\\" + unescape(originalPath.substr(10)).replace(new RegExp("/","g"),"\\");
 else if(originalPath.indexOf("file:///") == 0) // mac/unix local file
 localPath = unescape(originalPath.substr(7));
 else if(originalPath.indexOf("file:/") == 0) // mac/unix local file
 localPath = unescape(originalPath.substr(5));
 else // pc network file
 localPath = "\\\\" + unescape(originalPath.substr(7)).replace(new RegExp("/","g"),"\\");
 return localPath;
}

//
// LogUpload
//

function getLogUploadTiddler() {
 var tiddler;
 if (version.major < 2)
 tiddler = store.tiddlers['UploadLog'];
 else
 tiddler = store.getTiddler("UploadLog");
 if (!tiddler) 
 {
 tiddler = new Tiddler();
 tiddler.title = 'UploadLog';
 tiddler.text = "|!Date|!url|!toFilename|!backupDir|!user|!status|";
 if (version.major < 2)
 store.tiddlers['UploadLog'] = tiddler;
 else
 store.addTiddler(tiddler);
 }
 return tiddler;
}

function logUpload(url, toFilename, backupDir) 
{
 var tiddler = getLogUploadTiddler();
 var now = new Date();
 newText = "| ";
 //newText += now.toLocaleString() + " | ";
 
 newText += now.getDate()+"/"+(now.getMonth()+1)+"/"+now.getFullYear() + " ";
 newText += now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()+" | ";
 newText += "[["+basename(url)+"|"+url + "]] | ";
 newText += "[["+basename(toFilename) + "|" + dirname(url)+"/"+basename(toFilename) + "]] | ";
 newText += backupDir + " | ";
 newText += config.options.txtUserName + " |";

 tiddler.text = tiddler.text + "\n" + newText;
 tiddler.modifier = config.options.txtUserName;
 tiddler.modified = new Date();
 if (version.major < 2)
 store.tiddlers['UploadLog'] = tiddler;
 else
 store.addTiddler(tiddler);
 //displayTiddler(document.getElementById('sidebar'),"UploadLog",1,null,null,false);
 if (version.major < 2)
 store.notifyAll();
}

function logUploadStatusOk() 
{
 var tiddler = getLogUploadTiddler();
 newText = " ok |";
 tiddler.text = tiddler.text + newText;
 tiddler.modifier = config.options.txtUserName;
 tiddler.modified = new Date();
 if (version.major < 2)
 store.tiddlers['UploadLog'] = tiddler;
 else
 store.addTiddler(tiddler);
 //displayTiddler(document.getElementById('sidebar'),"UploadLog",1,null,null,false);
 if (version.major < 2)
 store.notifyAll();
 store.notify('UploadLog',true);
}

//
// download file before save it
// 

function download(uploadUrl, uploadToFilename, uploadBackupDir, asynchronous) {
 var request;
 try {
 request = new XMLHttpRequest();
 } 
 catch (e) { 
 request = new ActiveXObject("Msxml2.XMLHTTP"); 
 }
 try {
 if (url.substr(0,5) == "http:") {
 netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
 }
 else {
 netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
 }
 } catch (e) { }

 request.open("GET",document.location.toString(), asynchronous);
 if (asynchronous) {
 request.onreadystatechange = function () {
 if (request.readyState == 4) {
 if(request.status == 200) {
 uploadChangesFrom(uploadUrl, uploadToFilename, uploadBackupDir, request.responseText, asynchronous);
 }
 else
 alert(config.macros.upload.messages.errorDownloading.format([document.location.toString()]));
 }
 }
 }
 request.send(null);
 if (! asynchronous) {
 if(request.status == 200) {
 uploadChangesFrom(uploadUrl, uploadToFilename, uploadBackupDir, request.responseText, asynchronous);
 }
 else
 alert(config.macros.upload.messages.errorDownloading.format([document.location.toString()]));
 }

}

// saveOrUpload

function saveOrUpload(asynchronous) {
 if (document.location.toString().substr(0,5) == "http:") {
 // try a default synchronous upload
 url = dirname(document.location.toString())+"/"+ config.macros.upload.defaultStoreScript;
 upload(url, null, null, asynchronous);
 }
 else 
 saveChanges();
}

//
//Upload
//

function upload(url, toFilename, backupDir, asynchronous)
{
 clearMessage();
 // only for forcing the message to display
 if (version.major < 2)
 store.notifyAll();
 if (url == null) {
 alert(config.macros.upload.messages.urlParamMissing);
 return;
 }
 if (backupDir == null)
 backupDir = '';
 var toPath;
 if (toFilename)
 toPath = toFilename;
 else {
 toPath = basename(document.location.toString());
 }
 logUpload(url, toPath, backupDir);
 if (document.location.toString().substr(0,5) == "file:") {
 saveChanges();
 }
 displayMessage(config.macros.upload.messages.aboutToUpload.format([dirname(url)]), dirname(url));
 uploadChanges(url, toPath, backupDir, asynchronous);
 if(config.options.chkGenerateAnRssFeed) {
 //var rssContent = convertUnicodeToUTF8(generateRss());
 var rssContent = generateRss();
 var rssPath = toPath.substr(0,toPath.lastIndexOf(".")) + ".xml";
 uploadContent(url, rssContent, rssPath, '', asynchronous, function (responseText) {
 if (responseText.substring(0,1) != 0) {
 alert(responseText);
 displayMessage(config.macros.upload.messages.rssFileNotUploaded.format([rssPath]));
 }
 else {
 displayMessage(config.macros.upload.messages.rssFileUploaded.format([dirname(url)+"/"+basename(rssPath)]), dirname(url)+"/"+basename(rssPath));
 }
 // for debugging store.php uncomment last line
 //DEBUG alert(responseText);
 }
 );
 }
 return;
}

function uploadChanges(url, toFilename, backupDir, asynchronous)
{
 var original;
 if (document.location.toString().substr(0,5) == "http:") {
 original = download(url, toFilename, backupDir, asynchronous);
 return;
 }
 else {
 // standard way : Local file
 original = loadFile(getLocalPath());
 if(window.Components)
 // it's a mozilla browser
 try {
 netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
 var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
 .createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
 converter.charset = /* The character encoding you want, using UTF-8 here */ "UTF-8";
 original = converter.ConvertToUnicode(original);
 }
 catch(e) {
 }
 }
 //DEBUG alert(original);
 uploadChangesFrom(url, toFilename, backupDir, original, asynchronous);
}

function uploadChangesFrom(url, toFilename, backupDir, original, asynchronous)
{

 var startSaveArea = '<div id="' + 'storeArea">'; // Split up into two so that indexOf() of this source doesn't find it
 var endSaveArea = '</d' + 'iv>';
 // Locate the storeArea div's
 var posOpeningDiv = original.indexOf(startSaveArea);
 var posClosingDiv = original.lastIndexOf(endSaveArea);
 if((posOpeningDiv == -1) || (posClosingDiv == -1))
 {
 alert(config.messages.invalidFileError.format([document.location.toString()]));
 return;
 }
 // I think conversion is automatically done
 //var revised = original.substr(0,posOpeningDiv + startSaveArea.length) + 
 // convertUnicodeToUTF8(allTiddlersAsHtml()) + "\n\t\t" +
 // original.substr(posClosingDiv);
 
 var revised = original.substr(0,posOpeningDiv + startSaveArea.length) + 
 allTiddlersAsHtml() + "\n\t\t" +
 original.substr(posClosingDiv);

 // I think conversion is automatically done
 // var newSiteTitle = convertUnicodeToUTF8((getElementText("siteTitle") + " - " + getElementText("siteSubtitle")).htmlEncode());
 var newSiteTitle;
 if(version.major < 2){ //version is set in core TW code
 newSiteTitle = (getElementText("siteTitle") + " - " + getElementText("siteSubtitle")).htmlEncode();
 } else {
 newSiteTitle = (wikifyPlain ("SiteTitle") + " - " + wikifyPlain ("SiteSubtitle")).htmlEncode();
 }
 revised = revised.replace(new RegExp("<title>[^<]*</title>", "im"),"<title>"+ newSiteTitle +"</title>");
 var response = uploadContent(url, revised, toFilename, backupDir, asynchronous, function (responseText) {
 if (responseText.substring(0,1) != 0) {
 alert(responseText);
 displayMessage(config.macros.upload.messages.fileNotUploaded.format([getLocalPath()]));
 }
 else {
 displayMessage(config.macros.upload.messages.mainFileUploaded.format([dirname(url)+"/"+basename(toFilename)]), dirname(url)+"/"+basename(toFilename));
 logUploadStatusOk();
 store.setDirty(false);
 }
 // for debugging store.php uncomment last line
 //DEBUG alert(responseText);
 }
 );
}

function uploadContent(url, content, toPath, backupDir, asynchronous, callbackFn) {
 var boundary = "---------------------------"+"AaB03x";
 //Create XMLHttpRequest Object
 var request;
 try {
 request = new XMLHttpRequest();
 } 
 catch (e) { 
 request = new ActiveXObject("Msxml2.XMLHTTP"); 
 }
 try {
 // Needed for Mozilla if local file tries to access an http URL
 if (document.location.toString().substr(0,5) == "http:") {
 netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
 }
 else {
 netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
 }
 } catch (e) { }
 // compose headers data
 var sheader = "\r\n";
 sheader += "--" + boundary + "\r\nContent-disposition: form-data;name=\"" + config.macros.upload.formName +"\"\r\n\r\n";
 sheader += "backupDir="+backupDir+";user=" + config.options.txtUserName + "\r\n"; 
 sheader += "\r\n" + "--" + boundary + "\r\n";
 sheader += "Content-disposition: form-data;name=\"userfile\";filename=\""+toPath+"\"\r\n";
 sheader += "Content-Type: " + config.macros.upload.contentType + "\r\n";
 sheader += "Content-Length: " + content.length + "\r\n\r\n";
 // compose trailer data
 var strailer = new String();
 strailer = "\r\n--" + boundary + "--\r\n";
 var data;
 data = sheader + content + strailer;
 request.open("POST",url,asynchronous);
 if (asynchronous) {
 request.onreadystatechange = function () {
 if (request.readyState == 4) {
 if(request.status == 200)
 callbackFn(request.responseText);
 else
 alert(config.macros.upload.messages.errorUploadingContent);
 }
 };
 }
 request.setRequestHeader("Content-Length",data.length);
 request.setRequestHeader("Content-Type","multipart/form-data; boundary="+boundary);
 request.send(data); 
 if (! asynchronous) {
 if(request.status == 200)
 callbackFn(request.responseText);
 else
 alert(config.macros.upload.messages.errorUploadingContent);
 }

}

//}}}
