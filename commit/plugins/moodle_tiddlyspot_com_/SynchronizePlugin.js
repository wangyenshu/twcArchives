/***
|''Name:''|SynchronizePluglin|
|''Author:''|[[Oriol Nieto|http://enochrooted.blogspot.com/]] , [[Alejandro Moreno|http://vdemarvvv.blogspot.com/]] & [[Ludo( Marc Alier)|http://www.lsi.upc.edu/~malier/]]|
|''Another production of:''|[[dfwikiteam|http://morfeo.upc.es/crom/]] [[Universitat Politècnica de Catalunya|http://www.upc.edu]]|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/ as described in the license document http://www.lsi.upc.edu/~malier/tidlywikimoodledfwikimport.html#%5B%5BLicense%20And%20Legal%20Aspects%5D%5D]]|
|''~CoreVersion:''|2.1.2|
|''~PluglinVersion:''|1.1|
|''Moodle wiki server side files''|http://morfeo.upc.edu/crom|

This plugin lets you synchronize tiddlers with dfwiki pages of a moodle 1.6.X with the nwiki module installed.
This is, exporting or importing from a moodle server depending on the last modification date, just by pressing a button.

It's ''strongly recommended'' that you use ''Firefox'' (or any netscape based navigator) instead of IE in order to avoid security problems.

If anyway you want to use IE, you'll have to turn down all security parameters.

!!!!!Installation
<<<
Your [[ViewTemplate]] should have a line like this to make this plugin work (just add the word ''synchronize'' at the end of the macro string):

<div class='toolbar' macro='toolbar ... synchronize'></div>

You also have to have the [[ImportDFwikisPlugin]] and the [[ExportTiddlersToDFwikiPlugin]] installed on this tiddlywiki.
<<<
!!!!!Usage
<<<
You have to add the user and pwd information of your Moodle Server in the [[Synchronize Panel]]. 
You also have to add your Moodle URL in the [[MoodleSource]] tiddler.

Once done, just press the "synchronize" button that will appear on the right-upper corner of any tiddler to synchronize the tiddler with a wiki page ''with the same name'' of you Moodle Server.
<<<
!!!!!Inline interface (live)
<<<
To create the Syncrhonize Panel you can use the following Interactive Interface:

{{{<<sync>>}}}

<<sync>>
<<<
!!!!!Revision History
<<<
''2006.12.21 [1.1]''
IE6 and IE7 bug fixed
''2006.12.18 [1.0]''
First release
''2006.11.25 [0.0]''
development started
<<<
!!!!!Code
***/

//{{{
config.commands.synchronize= {
 text: 'synchronize',
 tooltip: 'synchronizes this tiddler with the Moodle wiki',
 text_alt: '<input type="checkbox" style="padding:0;margin:0;border:0;background:transparent;" checked>synchronize',
 tooltip_alt: 'uncheck to reset the editor to the standard height',
 hideReadOnly: false,
 tiddler: 'not set',
 course: 'not set',
 pageFound: false,
 course_it: 0,
 courses: [],
 wikis: [],
 handler: function(event,src,title) {
 // check if export and import plugins are installed
 if(!store.tiddlerExists("ImportDFwikisPlugin")){
 displayMessage("Error: ImportDFwikisPlugin Required!");
 return;
 }
 if(!store.tiddlerExists("ExportTiddlersToDFwikiPlugin")){
 displayMessage("Error: ExportTiddlersToDFwikiPlugin Required!");
 return;
 }

 // Get the user and pwd parameters
 if (!document.getElementById("syncMoodleName"))
 story.displayTiddler("bottom","SynchronizePanel",1,null,null,false);
 
 var user = document.getElementById("syncMoodleName").value;
 var pwd = document.getElementById("syncMoodlePwd").value;

 // We need to open our plugins:
 story.displayTiddler("bottom","ImportDFwikisPanel",1,null,null,false);
 story.displayTiddler("bottom","ExportTiddlersToDFwikiPanel",1,null,null,false);

 // For the Export Plugin:
 document.getElementById("exportID").value = user;
 document.getElementById("exportPW").value = pwd;
 // For the Import Plugin:
 document.getElementById("moodleUserName").value = user;
 document.getElementById("moodlePwd").value = pwd;
 if (user=="" || pwd==""){
 displayMessage("You must fill the user and pwd parameters in the Syncronize Panel!");
 return;
 }
 document.getElementById("exportMoodleServer").value = store.getTiddlerText("MoodleSource");
 var sync = true;
 config.commands.synchronize.tiddler = store.getTiddler(title);
 getMoodleInfo(sync); // Get the courses
 displayMessage("Synchronizing..."); 

 var tiddler = store.getTiddler(title);
 store.setTiddlerTag(title,true,"synchronized");
 setLastSyncTime(title, tiddler);
 
 document.getElementById("syncMoodleName").value = user;
 document.getElementById("syncMoodlePwd").value = pwd;

 return false;
 }
};

function setLastSyncTime(title, tiddler){
 tiddler.sync = new Date();
 store.getTiddler(title) = tiddler;
};

function continueSyncCourses(i){
 var IMPORT = 0;
 var EXPORT = 1;
 var courses = document.getElementById("exportDFwikiCourse").options;
 var found_courses = config.commands.synchronize.courses;
 var found_wikis = config.commands.synchronize.wikis;
 var sync = true;
 config.commands.synchronize.course_it = i;
 if (courses.length<=i){
 displayMessage("courses: "+config.commands.synchronize.courses.length+" wikis: "+ config.commands.synchronize.wikis.length);
 if (found_courses.length == 1 && found_wikis.length == 1){
 displayMessage("Good: found 1 wiki page named like this, let's synchronize!");
 var it = found_wikis[0].it;
 var wiki_id = found_wikis[0].id;
 var course_id = found_courses[0].id;
 var parser = found_wikis[0].parser;
 var import_or_export = found_wikis[0].impexp;
 var wiki_name = found_wikis[0].name;
 config.commands.synchronize.course = found_courses[0].name;
 if (import_or_export == IMPORT) importTiddlerSync(it, wiki_id, course_id, parser);
 else if (import_or_export == EXPORT) exportTiddlerSync(it, wiki_name);
 }
 else if (found_courses.length > 1 || found_wikis > 1){
 displayMessage("Found more than 1 wiki page named like this tiddler");
 }
 else{
 displayMessage("Wiki page not found on the moodle server. Create it first!");
 }
 config.commands.synchronize.courses = [];
 config.commands.synchronize.wikis = [];
 }
 else {
 config.commands.synchronize.course = courses[i].value;
 continueGettingMoodleInfo(courses[i].value, sync);
 }
};

function continueSyncWikis(i){
 var wikis = document.getElementById("exportDFwikiName").options;
 var tiddler = config.commands.synchronize.tiddler;
 var course = config.commands.synchronize.course;
 var found = false;
 
 if (wikis.length<=i){
 displayMessage("Tiddler not found in the course "+course);
 var j = config.commands.synchronize.course_it;
 continueSyncCourses(j+1);
 return; // The tiddler is not in this course
 }
 
 getPagesFromWiki(tiddler, wikis[i].value, course, i);
 return;
};

function getPagesFromWiki(tiddler, wiki, course, i){
 xmlHttp=GetXmlHttpObject();
 if (xmlHttp==null)
 {
 alert ("Browser does not support HTTP Request");
 return
 }
 var url=document.getElementById("exportMoodleServer").value;
 url+= ((url.charAt(url.length-1)!="/")?'/':'')+"mod/wiki/webservicelib.php";
 xmlHttp.onreadystatechange=stateGetFromWiki;
 if (typeof(netscape)!="undefined") 
 { // For moz-netscape, to access to a remote http:// or file://
 try { netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");}
 catch (e) { displayMessage(e.description?e.description:e.toString()); }
 }
 try 
 {
 xmlHttp.open("POST",url);
 xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Needed for the POST method
 if (xmlHttp.overrideMimeType) xmlHttp.overrideMimeType('text/xml');
 //displayMessage(tiddler.modified);
 xmlHttp.send("sel=getPagesFromWiki"+attachMD5Export(calculateMD5Export())+"&tiddlerTitle="+tiddler.title+"&tiddlerModified="+tiddler.modified+"&wiki="+wiki+"&course="+course+"&it="+i);
//displayMessage("sel=getPagesFromWiki"+attachMD5Export(calculateMD5Export())+"&tiddlerTitle="+tiddler.title+"&tiddlerModified="+tiddler.modified+"&wiki="+wiki+"&course="+course+"&it="+i);
 }
 catch (e) 
 {
 displayMessage(e.description?e.description:e.toString());
 }
};

function stateGetFromWiki(){
 if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete"){
 if (typeof(netscape)!="undefined") { // For moz-netscape, to access to a remote http:// or file://
 try { netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");}
 catch (e) { displayMessage(e.description?e.description:e.toString()); }
 }
 var xml = xmlHttp.responseXML;
 var response = xml.getElementsByTagName('response')[0];
 var msg = response.getElementsByTagName('msg')[0].firstChild.data;
 var it = parseInt(response.getElementsByTagName('it')[0].firstChild.data);
 
 displayMessage(msg);
 if (msg == "found"){
 config.commands.synchronize.pageFound = true;
 var wikis = document.getElementById("exportDFwikiName").options;
 var tiddler = config.commands.synchronize.tiddler;
 displayMessage("Wiki Page found!: "+tiddler.title);
 var import_or_export = response.getElementsByTagName('impexp')[0].firstChild.data;
 var wiki_id = response.getElementsByTagName('wikiid')[0].firstChild.data;
 var parser = response.getElementsByTagName('parser')[0].firstChild.data;
 var course_id = response.getElementsByTagName('courseid')[0].firstChild.data;
 // Store the course where we've found the wiki page
 var course = new Object();
 course.name = config.commands.synchronize.course;
 course.id = course_id;
 config.commands.synchronize.courses.push(course);
 // Store the wiki, its parser and iterator and imp/exp where we've found the wiki page
 var wikis = document.getElementById("exportDFwikiName").options;
 var wiki = new Object();
 wiki.name = wikis[it].value;
 wiki.id = wiki_id;
 wiki.parser = parser;
 wiki.it = it;
 wiki.impexp = import_or_export;
 config.commands.synchronize.wikis.push(wiki);
 displayMessage("found in the wiki: "+wikis[it].value+" course id:"+course_id+" wikiname"+wiki.name);
 // Keep searching
 continueSyncWikis(it+1); 
 }
 else{
 continueSyncWikis(it+1); 
 }
 }
};

function importTiddlerSync(it, wiki_id, course_id, parser){
 config.macros.importDFwikis.inbound=null; // clear the imported tiddler buffer
 refreshImportDFwikiList();
 var siteURL=store.getTiddlerText("MoodleSource"); if (!siteURL) siteURL="";
 document.getElementById("importSourceURL").value=siteURL;

 var wikis = document.getElementById("exportDFwikiName").options;
 var course = config.commands.synchronize.course;
 var tiddler = config.commands.synchronize.tiddler;

 config.macros.importDFwikis.index=0;
 config.macros.importDFwikis.src = siteURL;
 var src_backup = config.macros.importDFwikis.src;
 
 config.macros.importDFwikis.src = src_backup+((src_backup.charAt(src_backup.length-1)!="/")?'/':'');
 config.macros.importDFwikis.src += "mod/wiki/webservicelib.php?sel=urlManagement&courseid="+course_id+"&wikiid="+wiki_id+"&page="+tiddler.title;
 config.macros.importDFwikis.src += attachMD5(calculateMD5());
 loadRemoteItem(config.macros.importDFwikis.src, function(src,txt) {
 var wiki = readItemsFromHTML(txt);
 config.macros.importDFwikis.inbound=wiki;
 window.refreshImportDFwikiList();
 //importDFwikiReport();
 config.macros.importDFwikis.index=0;
 config.macros.importDFwikis.index=importDFwikisImmediately(-1, "true");
 //importDFwikiStopped(); 
 });
 config.macros.importDFwikis.src=src_backup;
 displayMessage("Successfully Synchronized!");
};

function exportTiddlerSync(it, wiki_name){
 var course = config.commands.synchronize.course;
 var tiddler = config.commands.synchronize.tiddler;
 addToSelect(wiki_name, "exportDFwikiName");
 document.getElementById("exportDFwikiName").value = wiki_name;
 document.getElementById("exportDFwikiCourse").value = course;
 exportToMoodle(tiddler.title, tiddler.modifier, tiddler.modified, tiddler.text, tiddler.tags);
 displayMessage("Successfully Synchronized!");
};

//}}}

// // Macros Definition 
//{{{
config.macros.sync = {
 notSynchronizedText: "(This tiddler has not been synchronized yet)",
 noPluginText: "There are no synchronized tiddlers",
 confirmDeleteText: "Are you sure you want to unsynchronize these tiddlers:\n\n%0",
 listViewTemplate : {
 columns: [
 {name: 'Selected', field: 'Selected', rowName: 'title', type: 'Selector'},
 {name: 'Title', field: 'title', tiddlerLink: 'title', title: "Title", type: 'TiddlerLink'}
 //{name: 'Forced', field: 'forced', title: "Forced", tag: 'systemConfigForce', type: 'TagCheckbox'},
 //{name: 'Disabled', field: 'disabled', title: "Disabled", tag: 'systemConfigDisable', type: 'TagCheckbox'},
 //{name: 'Executed', field: 'executed', title: "Loaded", type: 'Boolean', trueText: "Yes", falseText: "No"},
 //{name: 'Error', field: 'error', title: "Status", type: 'Boolean', trueText: "Error", falseText: "OK"},
 //{name: 'Log', field: 'log', title: "Log", type: 'StringList'}
 ],
 rowClasses: [
 {className: 'error', field: 'error'},
 {className: 'warning', field: 'warning'}
 ],
 actions: [
 {caption: "More actions...", name: ''},
 {caption: "Remove synchronized tag", name: 'remove'},
 {caption: "Delete these tiddlers forever", name: 'delete'}
 ]}
 };

config.macros.sync.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
 var panel=document.getElementById("syncPanel");
 if (panel) { panel.parentNode.removeChild(panel); }
 panel=createTiddlyElement(place,"span","syncPanel",null,null)
 panel.innerHTML=config.macros.sync.html;

 var e = createTiddlyElement(place,"div");
 e.setAttribute("refresh","macro");
 e.setAttribute("macroName","sync");
 e.setAttribute("params",paramString);
 this.refresh(e,paramString);
};

config.macros.sync.html = '\
<b>Moodle User Information</b><br>\
username: <input type="text" id="syncMoodleName" onfocus="this.select()" value="" size="10"\
 onKeyUp=""\
 onChange=""><br>\
password: <input type="password" id="syncMoodlePwd" onfocus="this.select()" value="" size="10"\
 onKeyUp=""\
 onChange=""><br><br><br>\
<b>Synchronized Tiddlers:</b>\
';

config.macros.sync.refresh = function(place,params)
{
 if(!store.tiddlerExists("ImportDFwikisPlugin")){
 displayMessage("Warning: ImportDFwikisPlugin Required for Syncrhonizing");
 }
 if(!store.tiddlerExists("ExportTiddlersToDFwikiPlugin")){
 displayMessage("Warning: ExportTiddlersToDFwikiPlugin Required for Syncrhonizing");
 }
 var selectedRows = [];
 ListView.forEachSelector(place,function(e,rowName) {
 if(e.checked)
 selectedRows.push(e.getAttribute("rowName"));
 });
 removeChildren(place);
 params = params.parseParams("anon");
 //var plugins = installedPlugins.slice(0);
 var plugins = [];
 var t,tiddler,p;
 var configTiddlers = store.getTaggedTiddlers("synchronized");
 for(t=0; t<configTiddlers.length; t++)
 {
 tiddler = configTiddlers[t];
 if(plugins.findByField("title",tiddler.title) == null)
 {
 p = getPluginInfo(tiddler);
 p.executed = false;
 //p.log.splice(0,0,this.notSynchronizedText);
 if (tiddler.sync) p.log.splice(0,0,tiddler.sync);
 else p.log.splice(0,0,this.notSynchronizedText);
 plugins.push(p);
 }
 }
 /*for(t=0; t<plugins.length; t++)
 {
 var p = plugins[t];
 p.forced = p.tiddler.isTagged("systemConfigForce");
 p.disabled = p.tiddler.isTagged("systemConfigDisable");
 p.Selected = selectedRows.find(plugins[t].title) != null;
 }*/
 if(plugins.length == 0)
 createTiddlyElement(place,"em",null,null,this.noPluginText);
 else
 ListView.create(place,plugins,this.listViewTemplate,this.onSelectCommand);
};

config.macros.sync.onSelectCommand = function(foo,command,rowNames)
{
 var t;
 switch(command)
 {
 case "remove":
 for(t=0; t<rowNames.length; t++)
 store.setTiddlerTag(rowNames[t],false,"synchronized");
 break;
 case "delete":
 if(rowNames.length > 0 && confirm(config.macros.sync.confirmDeleteText.format([rowNames.join(", ")])))
 {
 for(t=0; t<rowNames.length; t++)
 {
 store.removeTiddler(rowNames[t]);
 story.closeTiddler(rowNames[t],true,false);
 }
 }
 break;
 }
 if(config.options.chkAutoSave)
 saveChanges(true);
};
//}}}