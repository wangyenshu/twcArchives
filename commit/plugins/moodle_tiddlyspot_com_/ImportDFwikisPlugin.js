/***
|''Name:''|ImportDFwikisPlugin|
|''Author:''|[[Oriol Nieto|http://enochrooted.blogspot.com/]] , [[Alejandro Moreno|http://vdemarvvv.blogspot.com/]], Dídac Calventus & [[Ludo( Marc Alier)|http://www.lsi.upc.edu/~malier/]]|
|''Another production of:''|[[dfwikiteam|http://morfeo.upc.es/crom/]] [[Universitat Politècnica de Catalunya|http://www.upc.edu]]|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/ as described in the license document http://www.lsi.upc.edu/~malier/tidlywikimoodledfwikimport.html#%5B%5BLicense%20And%20Legal%20Aspects%5D%5D]]|
|''~CoreVersion:''|2.1.2|
|''~PluglinVersion:''|1.4|
|''Download latest version from''|http://www.lsi.upc.edu/~malier/tidlywikimoodledfwikimport.html#ImportDFwikisPlugin|
|''Moodle wiki server side files and docs''|http://morfeo.upc.edu/crom|

<<importDFwikis inline>>

This plugin lets you import pages of dfwikis from a moodle 1.6.X with the nwiki module installed.

It's ''strongly recommended'' that you use ''Firefox'' (or any netscape based navigator) instead of IE in order to avoid security problems.

If anyway you want to use IE, you'll have to turn down all security parameters.

You can import pages using an interactive control panel, selecting the wiki and then the page to import, or typing the complete URL of the wiki page, both methods with prompting for skip, rename, merge or replace actions when importing pages that match existing tiddler titles. Generates a detailed report of import 'history' in ImportedTiddlers.
You can import immediately (without panel interaction) the page you want typping the complete URL that appears in your browser while viewing this page in your moodle installation (direct import use always the ImportTiddlersToDFwikisPluglin parser and ''only works with wikis without groups'').
You can enable or disable the use of the ImportTiddlersToDFwikisPluglin parser. If you disable that option, is recommended to have installed previously the [[MediaWikiFotmatterPluglin|http://martinswiki.com/prereleases.html#MediaWikiFormatterPlugin]] and the [[HTMLFormattingPluglin|http://www.TiddlyTools.com/#HTMLFormattingPlugin]] to visualize correctly the imported content.

IMPORTANT: Don't disable/enable the ImportTiddlersToDFwikisPluglin parser after clicking "open pages". Enable/Disable it at the beginning of the interactive process.

! credits 
This plugin is a derivative of http://www.TiddlyTools.com/#ImportTiddlersPlugin, created by Eric L.Shulman and/or ELS Design Studios, and is subject to all terms and conditions as described in http://www.TiddlyTools.com/#LegalStatements as well as all other terms and conditions as described in this document.

!!!!! Test site
You can test this plugin getting wiki pages from our server http://morfeo.upc.edu/crom as Guest user

!!!!!Interactive interface
<<<
{{{<<importDFwikis>>}}}
creates "import dfwikis" link. click to show/hide import control panel

{{{<<importDFwikis inline>>}}}
creates import control panel directly in tiddler content



There are two ways available in this pluglin to import dfwikis.

1. Introducing the complete URL of the page wiki you're going to import.
2. Using the interactive process.

If you want to use the first method you only have to type the complete URL of the wiki you want to import, your username and password in moodle and click ''[import now!]''

If you want to import using the second method follow the instructions written below.
Type the source of your moodle installation in you server, your username and your password and press ''[open wikis]'' to get a list of all the existent wikis in your moodles installation with the appropiate access restricctions.
Then select the wiki that you want to import from and press ''[open pages]'' to get a list of the pages included in the wiki.
Select one or more pages from the listbox (hold CTRL or SHIFT while clicking to add/remove the highlight from individual list items). You can press ''[select all]'' to quickly highlight all pages titles in the list. Use the ''[-]'', ''[+]'', or ''[=]'' links to adjust the listbox size so you can view more (or less) pages titles at one time. When you have chosen the pages you want to import and entered any extra tags, press ''[import]'' to begin copying them to the current TiddlyWiki document.

''select: all, new, changes, or differences''

You can click on ''all'', ''new'', ''changes'', or ''differences'' to automatically select a subset of pages from the list. This makes it very quick and easy to find and import just the updated pages you are interested in:
>''"all"'' selects ALL pages from the import source document, even if they have not been changed.
>''"new"'' selects only pages that are found in the import source wiki, but do not yet exist in the destination document
>''"changes"'' selects only pages that exist in both documents but that are newer in the source wiki
>''"differences"'' selects all new and existing pages that are different from the destination document (even if destination pages is newer)

''Import Tagging:''

Pages that have been imported and transformed in Tiddlers can be automatically tagged, so they will be easier to find later on, after they have been added to your document. New tags are entered into the "add tags" input field, and then //added// to the existing tags for each tiddler as it is imported.

''Skip, Rename, Merge, or Replace:''

When importing a page whose title is identical to one that already exists, the import process pauses and the page title is displayed in an input field, along with four push buttons: ''[skip]'', ''[rename]'', ''[merge]'' and ''[replace]''.

To bypass importing this page, press ''[skip]''. To import the page with a different name (so that both the tiddlers will exist when the import is done), enter a new title in the input field and then press ''[rename]''. Press ''[merge]'' to combine the content from both pages into a single tiddler. Press ''[replace]'' to overwrite the existing page with the imported one, discarding the previous tiddler content.

//Note: if both the title ''and'' modification date/////time match, the imported page is assumed to be identical to the existing one, and will be automatically skipped (i.e., not imported) without asking.//

''Import Report History''

When pages are imported, a report is generated into ImportedTiddlers, indicating when the latest import was performed, the number of pages successfully imported, from what location, and by whom. It also includes a list with the title, date and author of each tiddler that was imported.

When the import process is completed, the ImportedTiddlers report is automatically displayed for your review. If more pages are subsequently imported, a new report is //added// to ImportedTiddlers, above the previous report (i.e., at the top of the tiddler), so that a reverse-chronological history of imports is maintained.

If a cumulative record is not desired, the ImportedTiddlers report may be deleted at any time. A new ImportedTiddlers report will be created the next time pages are imported.

Note: You can prevent the ImportedTiddlers report from being generated for any given import activity by clearing the "create a report" checkbox before beginning the import processing.


''label:text'' and ''prompt:text''
>defines link text and tooltip (prompt) that can be clicked to trigger the load tiddler processing. If a label is NOT provided, then no link is created and loadDFwikis() is executed whenever the containing tiddler is rendered.
''filter'' (optional) determines which tiddlers will be automatically selected for importing. Use one of the following keywords:
>''"all"'' retrieves ALL tiddlers from the import source document, even if they have not been changed.
>''"new"'' retrieves only tiddlers that are found in the import source document, but do not yet exist in the destination document
>''"changes"'' retrieves only tiddlers that exist in both documents for which the import source tiddler is newer than the existing tiddler
>''"updates"'' retrieves both ''new'' and ''changed'' tiddlers (this is the default action when none is specified)
>''"tiddler:~TiddlerName"'' retrieves only the specific tiddler named in the parameter.
>''"tag:text"'' retrieves only the tiddlers tagged with the indicated text.
''source'' (required) is the location of the imported document. It can be either a local document path/filename in whatever format your system requires, or a remote web location (starting with "http://" or "https://")
>use the keyword ''ask'' to prompt for a source location whenever the macro is invoked
''"quiet"'' (optional)
>supresses all status message during the import processing (e.g., "opening local file...", "found NN tiddlers..." etc). Note that if ANY tiddlers are actualy imported, a final information message will still be displayed (along with the ImportedTiddlers report), even when 'quiet' is specified. This ensures that changes to your document cannot occur without any visible indication at all.
''"confirm"'' (optional)
>adds interactive confirmation. A browser message box (OK/Cancel) is displayed for each tiddler that will be imported, so that you can manually bypass any tiddlers that you do not want to import.
<<<
!!!!!Installation
<<<
1. copy/paste the following tiddlers into your document:
 ''ImportDFwikisPlugin'' (tagged with <<tag systemConfig>>)

2. Use ''ImportTiddlersPluglin''

create/edit ''SideBarOptions'': (sidebar menu items) 
^^Add "< < ImportDFwikis > >" macro^^

<<<
!!!!!Revision History
<<<
''2006.12.09 [1.4]'' 
* Compatible with wiki with groups
''2006.11.27 [1.3]'' 
* Enable/Disable the ImportDfwikisPluglin parser
''2006.11.01 [1.2]'' 
* ISO 8859 1Wikis compatible with UTF-8 Tiddlywikis.
* More accessible interface. Guest enable/disable. Direct import enable/disable. Tags text clarified.
''2006.11.01 [1.1]'' 
* Import wikipage from URL 
* Access control implemented. Username and Password protection and logging into Moodle server.
''2006.10.22 [1.0]'' 
* Demonstration release. Only imports from wikis opened to guest user in the Moodle Server
<<<

!!!!!Code
***/
// // ''MACRO DEFINITION''
//{{{
// Version
version.extensions.importDFwikis = {major: 3, minor: 0, revision: 8, date: new Date(2006,10,12)};

// IE needs explicit global scoping for functions/vars called from browser events
window.onClickImportDFwikiButton=onClickImportDFwikiButton;
window.refreshImportDFwikiList=refreshImportDFwikiList;

// default cookie/option values
if (!config.options.chkimportDFwikiReport) config.options.chkimportDFwikiReport=true;

config.macros.importDFwikis = { };
config.macros.importDFwikis = {
 label: "import dfwikis",
 prompt: "Copy dfwikis from another document",
 foundMsg: "Found %0 items in %1",
 countMsg: "%0 items selected for import",
 importedMsg: "Imported %0 of %1 items from %2",
 src: "", // URL of moodle to import (retrieved from MoodleSource tiddler)
 inbound: null, // hash-indexed array of items from other document
 newTags: "", // text of tags added to imported items
 addTags: true, // add new tags to imported items
 listsize: 8, // # of lines to show in imported tiddler list
 importTags: true, // include tags from remote source document when importing a tiddler
 keepTags: true, // retain existing tags when replacing a tiddler
 index: -1, // current processing index in import list
 sort: "", // sort order for imported tiddler listbox
 parser: 1
};

config.macros.importDFwikis.handler = function(place,macroName,params) {
 if (!config.macros.loadDFwikis.handler)
 return;
 if (!params[0]) // LINK TO FLOATING PANEL
 createTiddlyButton(place,this.label,this.prompt,onClickImportDFwikiMenu);
 else if (params[0]=="inline") {// // INLINE TIDDLER CONTENT
 createImportDFwikiPanel(place);
 document.getElementById("dfwikiPanel").style.position="static";
 document.getElementById("dfwikiPanel").style.display="block";
 }
 else config.macros.loadDFwikis.handler(place,macroName,params); // FALLBACK: PASS TO loadDFwikis
}
//}}}

// // ''INTERFACE DEFINITION''

// // Handle link click to create/show/hide control panel
//{{{
function onClickImportDFwikiMenu(e)
{
 if (!e) var e = window.event;
 var parent=resolveTarget(e).parentNode;
 var panel = document.getElementById("dfwikiPanel");
 if (panel==undefined || panel.parentNode!=parent)
 panel=createImportDFwikiPanel(parent);
 var isOpen = panel.style.display=="block";
 if(config.options.chkAnimate)
 anim.startAnimating(new Slider(panel,!isOpen,e.shiftKey || e.altKey,"none"));
 else
 panel.style.display = isOpen ? "none" : "block" ;
 e.cancelBubble = true;
 if (e.stopPropagation) e.stopPropagation();
 return(false);
}
//}}}

// // Create control panel: HTML, CSS
//{{{
function createImportDFwikiPanel(place) {
 var panel=document.getElementById("dfwikiPanel");
 if (panel) { panel.parentNode.removeChild(panel); }
 setStylesheet(config.macros.importDFwikis.css,"importDFwikis");
 panel=createTiddlyElement(place,"span","dfwikiPanel",null,null)
 panel.innerHTML=config.macros.importDFwikis.html;
 refreshImportDFwikiList();
 var siteURL=store.getTiddlerText("MoodleSource"); if (!siteURL) siteURL="";
 document.getElementById("importSourceURL").value=siteURL;
 config.macros.importDFwikis.src=siteURL;
 return panel;
}
//}}}

// // CSS
//{{{
config.macros.importDFwikis.css = '\
#dfwikiPanel {\
 display: none; position:absolute; z-index:11; width:35em; right:105%; top:3em;\
 background-color: #eee; color:#000; font-size: 8pt; line-height:110%;\
 border:1px solid black; border-bottom-width: 3px; border-right-width: 3px;\
 padding: 0.5em; margin:0em; -moz-border-radius:1em;\
}\
#dfwikiPanel a, #dfwikiPanel td a { color:#009; display:inline; margin:0px; padding:1px; }\
#dfwikiPanel table { width:100%; border:0px; padding:0px; margin:0px; font-size:8pt; line-height:110%; background:transparent; }\
#dfwikiPanel tr { border:0px;padding:0px;margin:0px; background:transparent; }\
#dfwikiPanel td { color:#000; border:0px;padding:0px;margin:0px; background:transparent; }\
#dfwikiPanel select { width:98%;margin:0px;font-size:8pt;line-height:110%;}\
#dfwikiPanel input { width:98%;padding:0px;margin:0px;font-size:8pt;line-height:110%}\
#dfwikiPanel input#importSourceURL { width:75%;padding:1px;margin:0px;font-size:8pt;line-height:110%}\
#dfwikiPanel input#moodleUserName { width:90%;padding:0px;margin-right:8px;font-size:8pt;line-height:110%}\
#dfwikiPanel input#moodlePwd { width:90%;padding:0px;margin:0px;font-size:8pt;line-height:110%}\
#dfwikiPanel .box { border:1px solid black; padding:3px; margin-bottom:5px; background:#f8f8f8; -moz-border-radius:5px;}\
#dfwikiPanel .topline { border-top:2px solid black; padding-top:3px; margin-bottom:5px; }\
#dfwikiPanel .rad { width:auto; }\
#dfwikiPanel .chk { width:auto; margin:1px;border:0; }\
#dfwikiPanel .btn { width:auto; }\
#dfwikiPanel .btn1 { width:98%; }\
#dfwikiPanel .btn2 { width:48%; }\
#dfwikiPanel .btn3 { width:32%; }\
#dfwikiPanel .btn4 { width:24%; }\
#dfwikiPanel .btn5 { width:19%; }\
#dfwikiPanel .ImportDFwikiButton { padding: 0em; margin: 0px; font-size:8pt; }\
#dfwikiPanel .importListButton { padding:0em 0.25em 0em 0.25em; color: #000000; display:inline }\
#importCollisionDFwikiPanel { display:none; margin:0.5em 0em 0em 0em; }\
#importNonDirectPanelUp { display:block; margin:0em 0em 0em 0em; }\
#importNonDirectPanelDown { display:block; margin:0em 0em 0em 0em; }\
';
//}}}

// // HTML 
//{{{
config.macros.importDFwikis.html = '\
<!-- source and report -->\
<table><tr><td align=left>\
 import from a moodle based web\
</td><td align=right>\
 <input type=checkbox class="chk" id="chkimportDFwikiReport" checked\
 onClick="config.options[\'chkimportDFwikiReport\']=this.checked;"> create a report\
</td></tr></table>\
<!--panel-->\
\
<!-- import from http server -->\
<div id="importHTTPPanel" style="display:block;margin-bottom:5px;margin-top:5px;padding-top:3px;border-top:1px solid #999;text-align: center;">\
<table><tr><td align=left>\
 remote moodle URL:<br>\
</td><td align=right>\
</td></tr></table>\
<input type="text" id="importSourceURL" onfocus="this.select()" value="SiteUrl"\
 onKeyUp="config.macros.importDFwikis.src=this.value"\
 onChange="config.macros.importDFwikis.src=this.value;">\
<input type=button id="importImmediately" class="ImportDFwikiButton" style="width:23%" value="import now!" disabled\
 onclick="onClickImportDFwikiButton(this)">\
<table cellpadding="0" cellspacing="0"><tr><td width="40%" align=left>\
 username<br>\
 <input type="text" id="moodleUserName" onfocus="this.select()" value="" size="10"\
 onKeyUp=""\
 onChange="">\
</td><td width="40%" align=left>\
 password<br>\
 <input type="password" id="moodlePwd" onfocus="this.select()" value="" size="10"\
 onKeyUp=""\
 onChange="">\
</td><td width="20%" align=center>\
 developed by\
</td></tr></table>\
<table cellpadding="0" cellspacing="0"><tr><td width="45%" align=left>\
 <input type="checkbox" class="chk" id="guestLoginCheck" \
 onClick="enableGuestLogin()">login as guest<br>\
 <input type="checkbox" class="chk" id="useParserCheck" checked \
 onClick="useParser()">use ImportDFwikis parser<br>\
</td><td width="35%" align=left>\
 <input type="checkbox" class="chk" id="importImmediatelyCheck" \
 onClick="enableDisableImportImmediately()"> enable direct import<br>\
</td><td width="20%" align=center>\
 <a href="http://morfeo.upc.es/crom/">\
 <img src="http://img294.imageshack.us/img294/8712/dfwikiteamie8.jpg">\
 </a>\
</td></tr></table>\
</div><!--panel-->\
\
<div id="importNonDirectPanelUp">\
<table><tr><td align=left>\
 select:\
 <a href="JavaScript:;" id="importSelectAll"\
 onclick="onClickImportDFwikiButton(this)" title="select all tiddlers">\
 &nbsp;all&nbsp;</a>\
 <a href="JavaScript:;" id="importSelectNew"\
 onclick="onClickImportDFwikiButton(this)" title="select tiddlers not already in destination document">\
 &nbsp;added&nbsp;</a> \
 <a href="JavaScript:;" id="importSelectChanges"\
 onclick="onClickImportDFwikiButton(this)" title="select tiddlers that have been updated in source document">\
 &nbsp;changes&nbsp;</a> \
 <a href="JavaScript:;" id="importSelectDifferences"\
 onclick="onClickImportDFwikiButton(this)" title="select tiddlers that have been added or are different from existing tiddlers">\
 &nbsp;differences&nbsp;</a> \
 <a href="JavaScript:;" id="importToggleFilter"\
 onclick="onClickImportDFwikiButton(this)" title="show/hide selection filter">\
 &nbsp;filter&nbsp;</a> \
</td><td align=right>\
 <a href="JavaScript:;" id="importListSmaller"\
 onclick="onClickImportDFwikiButton(this)" title="reduce list size">\
 &nbsp;&#150;&nbsp;</a>\
 <a href="JavaScript:;" id="importListLarger"\
 onclick="onClickImportDFwikiButton(this)" title="increase list size">\
 &nbsp;+&nbsp;</a>\
 <a href="JavaScript:;" id="importListMaximize"\
 onclick="onClickImportDFwikiButton(this)" title="maximize/restore list size">\
 &nbsp;=&nbsp;</a>\
</td></tr></table></div>\
<select id="importList" size=8 multiple\
 onchange="setTimeout(\'refreshImportDFwikiList(\'+this.selectedIndex+\')\',1)">\
 <!-- NOTE: delay refresh so list is updated AFTER onchange event is handled -->\
</select>\
tags:<br>\
<input type=text id="txtNewTags" size=15 onKeyUp="config.macros.importDFwikis.newTags=this.value" autocomplete=off>\
<div id="importNonDirectPanelDown">\
<div align=center>\
 <input type=button id="importOpenWikis" class="ImportDFwikiButton" style="width:23%" value="open wikis"\
 onclick="onClickImportDFwikiButton(this)">\
 <input type=button id="importOpenPages" class="ImportDFwikiButton" style="width:23%" value="open pages" disabled="true"\
 onclick="onClickImportDFwikiButton(this)">\
 <input type=button id="importStart" class="ImportDFwikiButton" style="width:23%" value="import" disabled="true"\
 onclick="onClickImportDFwikiButton(this)">\
 <input type=button id="importClose" class="ImportDFwikiButton" style="width:23%" value="close"\
 onclick="onClickImportDFwikiButton(this)">\
</div>\
</div>\
<div id="importCollisionDFwikiPanel">\
 tiddler already exists:\
 <input type=text id="importNewTitle" size=15 autocomplete=off">\
 <div align=center>\
 <input type=button id="importSkip" class="ImportDFwikiButton" style="width:23%" value="skip"\
 onclick="onClickImportDFwikiButton(this)">\
 <input type=button id="importRename" class="ImportDFwikiButton" style="width:23%" value="rename"\
 onclick="onClickImportDFwikiButton(this)">\
 <input type=button id="importMerge" class="ImportDFwikiButton" style="width:23%" value="merge"\
 onclick="onClickImportDFwikiButton(this)">\
 <input type=button id="importReplace" class="ImportDFwikiButton" style="width:23%" value="replace"\
 onclick="onClickImportDFwikiButton(this)">\
 </div>\
</div>\
';
//}}}

// // Control interactions
//{{{
function useParser()
{
 if (config.macros.importDFwikis.parser==1) config.macros.importDFwikis.parser=0;
 else config.macros.importDFwikis.parser=1;
} 

function enableDisableImportImmediately() 
{
 if(!document.getElementById('importImmediatelyCheck').checked)
 {
 document.getElementById('importImmediately').disabled=true;
 document.getElementById('importNonDirectPanelUp').style.display='block';
 document.getElementById('importNonDirectPanelDown').style.display='block';
 }

 else
 {
 document.getElementById('importImmediately').disabled=false;
 document.getElementById('importNonDirectPanelUp').style.display='none';
 document.getElementById('importNonDirectPanelDown').style.display='none';
 }
}

function enableGuestLogin() 
{
 if(document.getElementById('guestLoginCheck').checked)
 {
 document.getElementById('moodleUserName').value="guest";
 document.getElementById('moodleUserName').disabled=true;
 document.getElementById('moodlePwd').value="guest";
 document.getElementById('moodlePwd').disabled=true;
 }

 else
 {
 document.getElementById('moodleUserName').disabled=false;
 document.getElementById('moodlePwd').disabled=false;
 }
}

function onClickImportDFwikiButton(which)
{
 // DEBUG alert(which.id);
 var theList = document.getElementById('importList');
 if (!theList) return;
 var thePanel = document.getElementById('dfwikiPanel');
 var theCollisionPanel = document.getElementById('importCollisionDFwikiPanel');
 var theNewTitle = document.getElementById('importNewTitle');
 var count=0;
 switch (which.id)
 {
 case 'fileImportSource':
 case 'importImmediately':
 config.macros.importDFwikis.inbound=null; // clear the imported tiddler buffer
 refreshImportDFwikiList(); // reset/resize the listbox
 if (config.macros.importDFwikis.src=="") break;
 src_backup=config.macros.importDFwikis.src; //backup of the original source
 
 // This sentences erase the group info. If you want to have the groups info just delete the sentences below.
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
 var erase_till=config.macros.importDFwikis.src.lastIndexOf("&gid");
 if (erase_till=="-1") erase_till=config.macros.importDFwikis.src.length;
 var erased_group_src=config.macros.importDFwikis.src.substr(0,erase_till);
 config.macros.importDFwikis.src=erased_group_src
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
 var src_backup_without_groups = config.macros.importDFwikis.src; //backup of the original source without groups
 var lastIndex=config.macros.importDFwikis.src.lastIndexOf("/mod/wiki/view.php?"); 
 var source=config.macros.importDFwikis.src.substr(0,lastIndex); //we need this source to connect with the webservice
 var restant=src_backup_without_groups.length - source.length - 19; //19 are the chars in "/mod/wiki/view.php?"
 var parameters=src_backup_without_groups.substr(-restant,restant);
 var number_of_parameters = 0;
 for (var i=0; i<parameters.length; i++)
 {
 if (parameters.charAt(i)=="=") number_of_parameters++;
 }
 if (number_of_parameters=="1")
 {
 //Put the course-->id in the URL as "id"
 lastIndex=parameters.lastIndexOf("=");
 restant=parameters.length - lastIndex;
 var id=parameters.substr(-restant+1,restant);
 config.macros.importDFwikis.src=source+"/mod/wiki/webservicelib.php?sel=urlManagement&id="+id;
 config.macros.importDFwikis.src += attachMD5(calculateMD5()); 
 }
 else if (number_of_parameters=="2")
 {
 //Put the course-->id in the URL as "id" and the pagename as "page"
 lastIndex=parameters.lastIndexOf("=");
 restant=parameters.length - lastIndex;
 var page=parameters.substr(-restant+1,restant);
 lastIndex=parameters.lastIndexOf("&page=");
 parameters=parameters.substr(0,lastIndex);
 lastIndex=parameters.lastIndexOf("=");
 restant=parameters.length - lastIndex;
 var id=parameters.substr(-restant+1,restant);
 config.macros.importDFwikis.src=source+"/mod/wiki/webservicelib.php?sel=urlManagement&id="+id+"&page="+page;
 config.macros.importDFwikis.src += attachMD5(calculateMD5());
 }
 else if (number_of_parameters=="3")
 {
 //Put the course-->id in the URL as "id" and the pagename as "page". It's a filter for the "name parameter
 //http://localhost/moodle16/mod/wiki/view.php?id=11&name=dfwikipage&page=Segunda+Wiki1
 lastIndex=parameters.lastIndexOf("=");
 restant=parameters.length - lastIndex;
 var page=parameters.substr(-restant+1,restant);
 lastIndex=parameters.lastIndexOf("&name=");
 parameters=parameters.substr(0,lastIndex);
 lastIndex=parameters.lastIndexOf("=");
 restant=parameters.length - lastIndex;
 var id=parameters.substr(-restant+1,restant);
 config.macros.importDFwikis.src=source+"/mod/wiki/webservicelib.php?sel=urlManagement&id="+id+"&page="+page;
 config.macros.importDFwikis.src += attachMD5(calculateMD5());
 } 
 loadRemoteItem(config.macros.importDFwikis.src, function(src,txt) {
 var wiki = readItemsFromHTML(txt);
 config.macros.importDFwikis.inbound=wiki;
 window.refreshImportDFwikiList();
 importDFwikiReport();
 config.macros.importDFwikis.index=0;
 config.macros.importDFwikis.index=importDFwikisImmediately(-1);
 importDFwikiStopped(); 
 });
 config.macros.importDFwikis.src=src_backup
 break;
 case 'importOpenWikis': // load import source into hidden frame
 importDFwikiReport(); // if an import was in progress, generate a report
 config.macros.importDFwikis.inbound=null; // clear the imported tiddler buffer
 refreshImportDFwikiList(); // reset/resize the listbox
 if (config.macros.importDFwikis.src=="") break;
 var src_backup = config.macros.importDFwikis.src;
 config.macros.importDFwikis.src=src_backup+((src_backup.charAt(src_backup.length-1)!="/")?'/':'')+"mod/wiki/webservicelib.php?sel=exportAllWikis";
 config.macros.importDFwikis.src += attachMD5(calculateMD5());
 // Load document into hidden iframe so we can read it's DOM and fill the list
 loadRemoteItem(config.macros.importDFwikis.src, function(src,txt) {
 var tiddlers = readItemsFromHTML(txt);
 var count=tiddlers?tiddlers.length:0;
 if (tiddlers.length!=0) document.getElementById('importOpenPages').disabled = false;
 displayMessage(config.macros.importDFwikis.foundMsg.format([count,src]));
 config.macros.importDFwikis.inbound=tiddlers;
 window.refreshImportDFwikiList();
 });
 config.macros.importDFwikis.src=src_backup;
 break;
 case 'importOpenPages': // load import source into hidden frame
 importDFwikiReport(); // if an import was in progress, generate a report
 //config.macros.importDFwikis.inbound=null; // clear the imported tiddler buffer
 //refreshImportDFwikiList(); // reset/resize the listbox
 if (config.macros.importDFwikis.src=="") break;
 config.macros.importDFwikis.index=0;
 //config.macros.importDFwikis.index=importDFwikis(0);
 var src_backup = config.macros.importDFwikis.src;
 config.macros.importDFwikis.src=src_backup+((src_backup.charAt(src_backup.length-1)!="/")?'/':'')+"mod/wiki/webservicelib.php?sel=exportWikiPages&wiki="+getWikiName(0)+"&parser="+config.macros.importDFwikis.parser;
 config.macros.importDFwikis.src += attachMD5(calculateMD5());
 // Load document into hidden iframe so we can read it's DOM and fill the list
 loadRemoteItem(config.macros.importDFwikis.src, function(src,txt) {
 var tiddlers = readItemsFromHTML(txt);
 var count=tiddlers?tiddlers.length:0;
 if (tiddlers.length!=0) document.getElementById('importStart').disabled = false;
 displayMessage(config.macros.importDFwikis.foundMsg.format([count,src]));
 config.macros.importDFwikis.inbound=tiddlers;
 window.refreshImportDFwikiList();
 });
 config.macros.importDFwikis.src=src_backup;
 break;
 case 'importSelectAll': // select all tiddler list items (i.e., not headings)
 importDFwikiReport(); // if an import was in progress, generate a report
 for (var t=0,count=0; t < theList.options.length; t++) {
 if (theList.options[t].value=="") continue;
 theList.options[t].selected=true;
 count++;
 }
 clearMessage(); displayMessage(config.macros.importDFwikis.countMsg.format([count]));
 break;
 case 'importSelectNew': // select tiddlers not in current document
 importDFwikiReport(); // if an import was in progress, generate a report
 for (var t=0,count=0; t < theList.options.length; t++) {
 theList.options[t].selected=false;
 if (theList.options[t].value=="") continue;
 theList.options[t].selected=!store.tiddlerExists(theList.options[t].value);
 count+=theList.options[t].selected?1:0;
 }
 clearMessage(); displayMessage(config.macros.importDFwikis.countMsg.format([count]));
 break;
 case 'importSelectChanges': // select tiddlers that are updated from existing tiddlers
 importDFwikiReport(); // if an import was in progress, generate a report
 for (var t=0,count=0; t < theList.options.length; t++) {
 theList.options[t].selected=false;
 if (theList.options[t].value==""||!store.tiddlerExists(theList.options[t].value)) continue;
 for (var i=0; i<config.macros.importDFwikis.inbound.length; i++) // find matching inbound tiddler
 { var inbound=config.macros.importDFwikis.inbound[i]; if (inbound.title==theList.options[t].value) break; }
 theList.options[t].selected=(inbound.modified-store.getTiddler(theList.options[t].value).modified>0); // updated tiddler
 count+=theList.options[t].selected?1:0;
 }
 clearMessage(); displayMessage(config.macros.importDFwikis.countMsg.format([count]));
 break;
 case 'importSelectDifferences': // select tiddlers that are new or different from existing tiddlers
 importDFwikiReport(); // if an import was in progress, generate a report
 for (var t=0,count=0; t < theList.options.length; t++) {
 theList.options[t].selected=false;
 if (theList.options[t].value=="") continue;
 if (!store.tiddlerExists(theList.options[t].value)) { theList.options[t].selected=true; count++; continue; }
 for (var i=0; i<config.macros.importDFwikis.inbound.length; i++) // find matching inbound tiddler
 { var inbound=config.macros.importDFwikis.inbound[i]; if (inbound.title==theList.options[t].value) break; }
 theList.options[t].selected=(inbound.modified-store.getTiddler(theList.options[t].value).modified!=0); // changed tiddler
 count+=theList.options[t].selected?1:0;
 }
 clearMessage(); displayMessage(config.macros.importDFwikis.countMsg.format([count]));
 break;
 case 'importToggleFilter': // show/hide filter
 case 'importFilter': // apply filter
 alert("coming soon!");
 break;
 case 'importStart': // initiate the import processing
 importDFwikiReport(); // if an import was in progress, generate a report
 config.macros.importDFwikis.index=0;
 config.macros.importDFwikis.index=importDFwikis(-1);
 importDFwikiStopped();
 break;
 case 'importClose': // unload imported tiddlers or hide the import control panel
 // if imported tiddlers not loaded, close the import control panel
 if (!config.macros.importDFwikis.inbound) { thePanel.style.display='none'; break; }
 importDFwikiReport(); // if an import was in progress, generate a report
 config.macros.importDFwikis.inbound=null; // clear the imported tiddler buffer
 refreshImportDFwikiList(); // reset/resize the listbox
 break;
 case 'importSkip': // don't import the tiddler
 var theItem = theList.options[config.macros.importDFwikis.index];
 for (var j=0;j<config.macros.importDFwikis.inbound.length;j++)
 if (config.macros.importDFwikis.inbound[j].title==theItem.value) break;
 var theImported = config.macros.importDFwikis.inbound[j];
 theImported.status='skipped after asking'; // mark item as skipped
 theCollisionPanel.style.display='none';
 config.macros.importDFwikis.index=importDFwikis(config.macros.importDFwikis.index+1); // resume with NEXT item
 importDFwikiStopped();
 break;
 case 'importRename': // change name of imported tiddler
 var theItem = theList.options[config.macros.importDFwikis.index];
 for (var j=0;j<config.macros.importDFwikis.inbound.length;j++)
 if (config.macros.importDFwikis.inbound[j].title==theItem.value) break;
 var theImported = config.macros.importDFwikis.inbound[j];
 theImported.status = 'renamed from '+theImported.title; // mark item as renamed
 theImported.set(theNewTitle.value,null,null,null,null); // change the tiddler title
 theItem.value = theNewTitle.value; // change the listbox item text
 theItem.text = theNewTitle.value; // change the listbox item text
 theCollisionPanel.style.display='none';
 config.macros.importDFwikis.index=importDFwikis(config.macros.importDFwikis.index); // resume with THIS item
 importDFwikiStopped();
 break;
 case 'importMerge': // join existing and imported tiddler content
 var theItem = theList.options[config.macros.importDFwikis.index];
 for (var j=0;j<config.macros.importDFwikis.inbound.length;j++)
 if (config.macros.importDFwikis.inbound[j].title==theItem.value) break;
 var theImported = config.macros.importDFwikis.inbound[j];
 var theExisting = store.getTiddler(theItem.value);
 var theText = theExisting.text+'\n----\n^^merged from: ';
 theText +='[['+config.macros.importDFwikis.src+'#'+theItem.value+'|'+config.macros.importDFwikis.src+'#'+theItem.value+']]^^\n';
 theText +='^^'+theImported.modified.toLocaleString()+' by '+theImported.modifier+'^^\n'+theImported.text;
 var theDate = new Date();
 var theTags = theExisting.getTags()+' '+theImported.getTags();
 theImported.set(null,theText,null,theDate,theTags);
 theImported.status = 'merged with '+theExisting.title; // mark item as merged
 theImported.status += ' - '+theExisting.modified.formatString("MM/DD/YYYY 0hh:0mm:0ss");
 theImported.status += ' by '+theExisting.modifier;
 theCollisionPanel.style.display='none';
 config.macros.importDFwikis.index=importDFwikis(config.macros.importDFwikis.index); // resume with this item
 importDFwikiStopped();
 break;
 case 'importReplace': // substitute imported tiddler for existing tiddler
 var theItem = theList.options[config.macros.importDFwikis.index];
 for (j=0;j<config.macros.importDFwikis.inbound.length;j++)
 if (config.macros.importDFwikis.inbound[j].title==theItem.value) break;
 var theImported = config.macros.importDFwikis.inbound[j];
 var theExisting = store.getTiddler(theItem.value);
 theImported.status = 'replaces '+theExisting.title; // mark item for replace
 theImported.status += ' - '+theExisting.modified.formatString("MM/DD/YYYY 0hh:0mm:0ss");
 theImported.status += ' by '+theExisting.modifier;
 theCollisionPanel.style.display='none';
 config.macros.importDFwikis.index=importDFwikis(config.macros.importDFwikis.index); // resume with THIS item
 importDFwikiStopped();
 break;
 case 'importListSmaller': // decrease current listbox size, minimum=5
 if (theList.options.length==1) break;
 theList.size-=(theList.size>5)?1:0;
 config.macros.importDFwikis.listsize=theList.size;
 break;
 case 'importListLarger': // increase current listbox size, maximum=number of items in list
 if (theList.options.length==1) break;
 theList.size+=(theList.size<theList.options.length)?1:0;
 config.macros.importDFwikis.listsize=theList.size;
 break;
 case 'importListMaximize': // toggle listbox size between current and maximum
 if (theList.options.length==1) break;
 theList.size=(theList.size==theList.options.length)?config.macros.importDFwikis.listsize:theList.options.length;
 break;
 }
}
//}}}

// // refresh listbox
//{{{
function refreshImportDFwikiList(selectedIndex)
{
 var theList = document.getElementById("importList");
 if (!theList) return;
 // if nothing to show, reset list content and size
 if (!config.macros.importDFwikis.inbound) 
 {
 while (theList.length > 0) { theList.options[0] = null; }
 theList.options[0]=new Option('please open moodle URL...',"",false,false);
 theList.size=config.macros.importDFwikis.listsize;
 document.getElementById('importOpenPages').disabled = true;
 document.getElementById('importStart').disabled = true;
 return;
 }
 // get the sort order
 if (!selectedIndex) selectedIndex=0;
 if (selectedIndex==0) config.macros.importDFwikis.sort='title'; // hidden heading

 // get the alphasorted list of tiddlers (optionally, filter out unchanged tiddlers)
 var tiddlers=config.macros.importDFwikis.inbound;
 if (tiddlers[0].text == 'error'){ // If wrong user or password don't show open wiki pages button or import button
 document.getElementById('importOpenPages').disabled = true;
 document.getElementById('importStart').disabled = true;
 }
 tiddlers.sort(function (a,b) {if(a['title'] == b['title']) return(0); else return (a['title'] < b['title']) ? -1 : +1; });
 // clear current list contents
 while (theList.length > 0) { theList.options[0] = null; }
 // add heading and control items to list
 var i=0;
 var indent=String.fromCharCode(160)+String.fromCharCode(160);

 for(var t = 0; t < tiddlers.length; t++)
 theList.options[i++] = new Option(tiddlers[t].title,tiddlers[t].title,false,false);

 theList.selectedIndex=selectedIndex; // select current control item
 if (theList.size<config.macros.importDFwikis.listsize) theList.size=config.macros.importDFwikis.listsize;
 if (theList.size>theList.options.length) theList.size=theList.options.length;
}
//}}}

// // Security functions
//{{{
/*****************************************************************************
 * md5.js
 *
 * A JavaScript implementation derived from the RSA Data Security, Inc. MD5
 * Message-Digest Algorithm. See http://cw.oaktree.co.uk/site/legal.html for
 * details.
 *
 * Copyright (C) Paul Johnston 1999 - 2000. Distributed under the LGPL.
 *****************************************************************************/

/* to convert strings to a list of ascii values */
var sAscii = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ"
var sAscii = sAscii + "[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

/* convert integer to hex string */
var sHex = "0123456789ABCDEF";
function hex(i)
{
 h = "";
 for(j = 0; j <= 3; j++)
 {
 h += sHex.charAt((i >> (j * 8 + 4)) & 0x0F) +
 sHex.charAt((i >> (j * 8)) & 0x0F);
 }
 return h;
}

/* add, handling overflows correctly */
function add(x, y)
{
 return ((x&0x7FFFFFFF) + (y&0x7FFFFFFF)) ^ (x&0x80000000) ^ (y&0x80000000);
}

/* MD5 rounds functions */
function R1(A, B, C, D, X, S, T)
{
 q = add(add(A, (B & C) | ((~B) & D)), add(X, T));
 return add((q << S) | (q >>> (32 - S)), B);
}

function R2(A, B, C, D, X, S, T)
{
 q = add(add(A, (B & D) | (C & (~D))), add(X, T));
 return add((q << S) | (q >>> (32 - S)), B);
}

function R3(A, B, C, D, X, S, T)
{
 q = add(add(A, B ^ C ^ D), add(X, T));
 return add((q << S) | (q >>> (32 - S)), B);
}

function R4(A, B, C, D, X, S, T)
{
 q = add(add(A, C ^ (B | (~D))), add(X, T));
 return add((q << S) | (q >>> (32 - S)), B);
}

/* main entry point */
function calcMD5(sInp) {

 /* Calculate length in machine words, including padding */
 wLen = (((sInp.length + 8) >> 6) + 1) << 4;
 var X = new Array(wLen);

 /* Convert string to array of words */
 j = 4;
 for (i = 0; (i * 4) < sInp.length; i++)
 {
 X[i] = 0;
 for (j = 0; (j < 4) && ((j + i * 4) < sInp.length); j++)
 {
 X[i] += (sAscii.indexOf(sInp.charAt((i * 4) + j)) + 32) << (j * 8);
 }
 }

 /* Append padding bits and length */
 if (j == 4)
 {
 X[i++] = 0x80;
 }
 else
 {
 X[i - 1] += 0x80 << (j * 8);
 }
 for(; i < wLen; i++) { X[i] = 0; }
 X[wLen - 2] = sInp.length * 8;

 /* hard coded initial values */
 a = 0x67452301;
 b = 0xefcdab89;
 c = 0x98badcfe;
 d = 0x10325476;

 /* Process each 16 word block in turn */
 for (i = 0; i < wLen; i += 16) {
 aO = a;
 bO = b;
 cO = c;
 dO = d;

 a = R1(a, b, c, d, X[i+ 0], 7 , 0xd76aa478);
 d = R1(d, a, b, c, X[i+ 1], 12, 0xe8c7b756);
 c = R1(c, d, a, b, X[i+ 2], 17, 0x242070db);
 b = R1(b, c, d, a, X[i+ 3], 22, 0xc1bdceee);
 a = R1(a, b, c, d, X[i+ 4], 7 , 0xf57c0faf);
 d = R1(d, a, b, c, X[i+ 5], 12, 0x4787c62a);
 c = R1(c, d, a, b, X[i+ 6], 17, 0xa8304613);
 b = R1(b, c, d, a, X[i+ 7], 22, 0xfd469501);
 a = R1(a, b, c, d, X[i+ 8], 7 , 0x698098d8);
 d = R1(d, a, b, c, X[i+ 9], 12, 0x8b44f7af);
 c = R1(c, d, a, b, X[i+10], 17, 0xffff5bb1);
 b = R1(b, c, d, a, X[i+11], 22, 0x895cd7be);
 a = R1(a, b, c, d, X[i+12], 7 , 0x6b901122);
 d = R1(d, a, b, c, X[i+13], 12, 0xfd987193);
 c = R1(c, d, a, b, X[i+14], 17, 0xa679438e);
 b = R1(b, c, d, a, X[i+15], 22, 0x49b40821);

 a = R2(a, b, c, d, X[i+ 1], 5 , 0xf61e2562);
 d = R2(d, a, b, c, X[i+ 6], 9 , 0xc040b340);
 c = R2(c, d, a, b, X[i+11], 14, 0x265e5a51);
 b = R2(b, c, d, a, X[i+ 0], 20, 0xe9b6c7aa);
 a = R2(a, b, c, d, X[i+ 5], 5 , 0xd62f105d);
 d = R2(d, a, b, c, X[i+10], 9 , 0x2441453);
 c = R2(c, d, a, b, X[i+15], 14, 0xd8a1e681);
 b = R2(b, c, d, a, X[i+ 4], 20, 0xe7d3fbc8);
 a = R2(a, b, c, d, X[i+ 9], 5 , 0x21e1cde6);
 d = R2(d, a, b, c, X[i+14], 9 , 0xc33707d6);
 c = R2(c, d, a, b, X[i+ 3], 14, 0xf4d50d87);
 b = R2(b, c, d, a, X[i+ 8], 20, 0x455a14ed);
 a = R2(a, b, c, d, X[i+13], 5 , 0xa9e3e905);
 d = R2(d, a, b, c, X[i+ 2], 9 , 0xfcefa3f8);
 c = R2(c, d, a, b, X[i+ 7], 14, 0x676f02d9);
 b = R2(b, c, d, a, X[i+12], 20, 0x8d2a4c8a);

 a = R3(a, b, c, d, X[i+ 5], 4 , 0xfffa3942);
 d = R3(d, a, b, c, X[i+ 8], 11, 0x8771f681);
 c = R3(c, d, a, b, X[i+11], 16, 0x6d9d6122);
 b = R3(b, c, d, a, X[i+14], 23, 0xfde5380c);
 a = R3(a, b, c, d, X[i+ 1], 4 , 0xa4beea44);
 d = R3(d, a, b, c, X[i+ 4], 11, 0x4bdecfa9);
 c = R3(c, d, a, b, X[i+ 7], 16, 0xf6bb4b60);
 b = R3(b, c, d, a, X[i+10], 23, 0xbebfbc70);
 a = R3(a, b, c, d, X[i+13], 4 , 0x289b7ec6);
 d = R3(d, a, b, c, X[i+ 0], 11, 0xeaa127fa);
 c = R3(c, d, a, b, X[i+ 3], 16, 0xd4ef3085);
 b = R3(b, c, d, a, X[i+ 6], 23, 0x4881d05);
 a = R3(a, b, c, d, X[i+ 9], 4 , 0xd9d4d039);
 d = R3(d, a, b, c, X[i+12], 11, 0xe6db99e5);
 c = R3(c, d, a, b, X[i+15], 16, 0x1fa27cf8);
 b = R3(b, c, d, a, X[i+ 2], 23, 0xc4ac5665);

 a = R4(a, b, c, d, X[i+ 0], 6 , 0xf4292244);
 d = R4(d, a, b, c, X[i+ 7], 10, 0x432aff97);
 c = R4(c, d, a, b, X[i+14], 15, 0xab9423a7);
 b = R4(b, c, d, a, X[i+ 5], 21, 0xfc93a039);
 a = R4(a, b, c, d, X[i+12], 6 , 0x655b59c3);
 d = R4(d, a, b, c, X[i+ 3], 10, 0x8f0ccc92);
 c = R4(c, d, a, b, X[i+10], 15, 0xffeff47d);
 b = R4(b, c, d, a, X[i+ 1], 21, 0x85845dd1);
 a = R4(a, b, c, d, X[i+ 8], 6 , 0x6fa87e4f);
 d = R4(d, a, b, c, X[i+15], 10, 0xfe2ce6e0);
 c = R4(c, d, a, b, X[i+ 6], 15, 0xa3014314);
 b = R4(b, c, d, a, X[i+13], 21, 0x4e0811a1);
 a = R4(a, b, c, d, X[i+ 4], 6 , 0xf7537e82);
 d = R4(d, a, b, c, X[i+11], 10, 0xbd3af235);
 c = R4(c, d, a, b, X[i+ 2], 15, 0x2ad7d2bb);
 b = R4(b, c, d, a, X[i+ 9], 21, 0xeb86d391);

 a = add(a, aO);
 b = add(b, bO);
 c = add(c, cO);
 d = add(d, dO);
 }
 return hex(a) + hex(b) + hex(c) + hex(d);
}

function calculateMD5() 
{
 var pw = document.getElementById("moodlePwd").value;
 return(calcMD5(pw));
}

function attachMD5(hash) 
{
 var getUrl = "&user="+document.getElementById("moodleUserName").value;
 getUrl += "&pwd="+hash.toLowerCase();
 return getUrl;
}
//}}}

// // re-entrant processing for handling import with interactive collision prompting
//{{{
function importDFwikis(startIndex)
{
 if (!config.macros.importDFwikis.inbound) return -1;

 var theList = document.getElementById('importList');
 if (!theList) return;
 var t;
 // if starting new import, reset import status flags
 if (startIndex==-1)
 for (var t=0;t<config.macros.importDFwikis.inbound.length;t++)
 config.macros.importDFwikis.inbound[t].status="";
 startIndex=0;
 for (var i=startIndex; i<theList.options.length; i++)
 {
 // if list item is not selected or is a heading (i.e., has no value), skip it
 if ((!theList.options[i].selected) || ((t=theList.options[i].value)==""))
 continue;
 for (var j=0;j<config.macros.importDFwikis.inbound.length;j++)
 if (config.macros.importDFwikis.inbound[j].title==t) break;
 var inbound = config.macros.importDFwikis.inbound[j];
 var theExisting = store.getTiddler(inbound.title);
 // avoid redundant import for tiddlers that are listed multiple times (when 'by tags')
 if (inbound.status=="added")
 continue;
 // don't import the "ImportedTiddlers" history from the other document...
 if (inbound.title=='ImportedTiddlers')
 continue;
 // if tiddler exists and import not marked for replace or merge, stop importing
 if (theExisting && (inbound.status.substr(0,7)!="replace") && (inbound.status.substr(0,5)!="merge"))
 return i;
 // assemble tags (remote + existing + added)
 var newTags = "";
 if (config.macros.importDFwikis.importTags)
 newTags+=inbound.getTags() // import remote tags
 if (config.macros.importDFwikis.keepTags && theExisting)
 newTags+=" "+theExisting.getTags(); // keep existing tags
 if (config.macros.importDFwikis.addTags && config.macros.importDFwikis.newTags.trim().length)
 newTags+=" "+config.macros.importDFwikis.newTags; // add new tags
 inbound.set(null,null,null,null,newTags.trim());
 // set the status to 'added' (if not already set by the 'ask the user' UI)
 inbound.status=(inbound.status=="")?'added':inbound.status;
 inbound.modified = new Date();
 inbound.created = new Date();
 // do the import!
 // OLD: store.addTiddler(in); store.setDirty(true);
 store.saveTiddler(inbound.title, inbound.title, inbound.text, inbound.modifier, inbound.modified, inbound.tags);
 store.fetchTiddler(inbound.title).created = inbound.created; // force creation date to imported value
 }
 return(-1); // signals that we really finished the entire list
}

function importDFwikisImmediately(startIndex, sync)
{
 if (!config.macros.importDFwikis.inbound) return -1;
 var theList = document.getElementById('importList');
 if (!theList) return;
 var t;
 // if starting new import, reset import status flags
 if (startIndex==-1)
 for (var t=0;t<config.macros.importDFwikis.inbound.length;t++)
 config.macros.importDFwikis.inbound[t].status="";
 startIndex=0;
 for (var i=startIndex; i<theList.options.length; i++)
 {
 // if list item is not selected or is a heading (i.e., has no value), skip it
 /*if ((!theList.options[i].selected) || ((t=theList.options[i].value)==""))
 continue;*/
 if ((t=theList.options[i].value)=="") 
 {
 continue;
 }
 for (var j=0;j<config.macros.importDFwikis.inbound.length;j++)
 if (config.macros.importDFwikis.inbound[j].title==t) break;
 var inbound = config.macros.importDFwikis.inbound[j];
 var theExisting = store.getTiddler(inbound.title);
 // avoid redundant import for tiddlers that are listed multiple times (when 'by tags')
 if (inbound.status=="added")
 continue;
 // don't import the "ImportedTiddlers" history from the other document...
 if (inbound.title=='ImportedTiddlers')
 continue;
 // if it's an error tiddler don't store it
 if (inbound.modifier=="yes")
 break;
 // if tiddler exists and import not marked for replace or merge, stop importing
 if (!sync && theExisting && (inbound.status.substr(0,7)!="replace") && (inbound.status.substr(0,5)!="merge"))
 return i;
 // assemble tags (remote + existing + added)
 var newTags = "";
 if (config.macros.importDFwikis.importTags)
 newTags+=inbound.getTags() // import remote tags
 if (config.macros.importDFwikis.keepTags && theExisting)
 newTags+=" "+theExisting.getTags(); // keep existing tags
 if (config.macros.importDFwikis.addTags && config.macros.importDFwikis.newTags.trim().length)
 newTags+=" "+config.macros.importDFwikis.newTags; // add new tags
 inbound.set(null,null,null,null,newTags.trim());
 // set the status to 'added' (if not already set by the 'ask the user' UI)
 inbound.status=(inbound.status=="")?'added':inbound.status; 
 inbound.modified = new Date();
 inbound.created = new Date();
 // do the import!
 // OLD: store.addTiddler(in); store.setDirty(true);
 store.saveTiddler(inbound.title, inbound.title, inbound.text, inbound.modifier, inbound.modified, inbound.tags);
 store.fetchTiddler(inbound.title).created = inbound.created; // force creation date to imported value
 }
 return(-1); // signals that we really finished the entire list
}

function getWikiName(startIndex)
{
 if (!config.macros.importDFwikis.inbound) return -1;

 var theList = document.getElementById('importList');
 if (!theList) return "merda";
 var t;
 // if starting new import, reset import status flags
 if (startIndex==0)
 for (var t=0;t<config.macros.importDFwikis.inbound.length;t++)
 config.macros.importDFwikis.inbound[t].status="";
 for (var i=startIndex; i<theList.options.length; i++)
 {
 // if list item is not selected or is a heading (i.e., has no value), skip it
 if ((!theList.options[i].selected) || ((t=theList.options[i].value)==""))
 continue;
 for (var j=0;j<config.macros.importDFwikis.inbound.length;j++)
 if (config.macros.importDFwikis.inbound[j].title==t) break;
 var inbound = config.macros.importDFwikis.inbound[j];
 return(inbound.text);
 }
 //return(-1); // signals that we really finished the entire list
}
//}}}

//{{{
function importDFwikiStopped()
{
 var theList = document.getElementById('importList');
 var theNewTitle = document.getElementById('importNewTitle');
 if (!theList) return;
 if (config.macros.importDFwikis.index==-1)
 importDFwikiReport(); // import finished... generate the report
 else
 {
 // DEBUG alert('import stopped at: '+config.macros.importDFwikis.index);
 // import collision... show the collision panel and set the title edit field
 document.getElementById('importCollisionDFwikiPanel').style.display='block';
 theNewTitle.value=theList.options[config.macros.importDFwikis.index].value;
 }
}
//}}}

// // ''REPORT GENERATOR''
//{{{
function importDFwikiReport(quiet)
{
 if (!config.macros.importDFwikis.inbound) return;
 // DEBUG alert('importDFwikiReport: start');

 // if import was not completed, the collision panel will still be open... close it now.
 var panel=document.getElementById('importCollisionDFwikiPanel'); if (panel) panel.style.display='none';

 // get the alphasorted list of tiddlers
 var tiddlers = config.macros.importDFwikis.inbound;
 // gather the statistics
 var count=0;
 for (var t=0; t<tiddlers.length; t++)
 if (tiddlers[t].status && tiddlers[t].status.trim().length && tiddlers[t].status.substr(0,7)!="skipped") count++;

 // generate a report
 if (count && config.options.chkimportDFwikiReport) {
 // get/create the report tiddler
 var theReport = store.getTiddler('ImportedTiddlers');
 if (!theReport) { theReport= new Tiddler(); theReport.title = 'ImportedTiddlers'; theReport.text = ""; }
 // format the report content
 var now = new Date();
 var newText = "On "+now.toLocaleString()+", "+config.options.txtUserName
 newText +=" imported "+count+" tiddler"+(count==1?"":"s")+" from\n[["+config.macros.importDFwikis.src+"|"+config.macros.importDFwikis.src+"]]:\n";
 if (config.macros.importDFwikis.addTags && config.macros.importDFwikis.newTags.trim().length)
 newText += "imported tiddlers were tagged with: \""+config.macros.importDFwikis.newTags+"\"\n";
 newText += "<<<\n";
 for (var t=0; t<tiddlers.length; t++) if (tiddlers[t].status) newText += "#[["+tiddlers[t].title+"]] - "+tiddlers[t].status+"\n";
 newText += "<<<\n";
// 20060918 ELS: DON'T ADD "discard" BUTTON TO REPORT
// newText += "<html><input type=\"button\" href=\"javascript:;\" ";
// newText += "onclick=\"story.closeTiddler('"+theReport.title+"'); store.deleteTiddler('"+theReport.title+"');\" ";
// newText += "value=\"discard report\"></html>";
 // update the ImportedTiddlers content and show the tiddler
 theReport.text = newText+((theReport.text!="")?'\n----\n':"")+theReport.text;
 theReport.modifier = config.options.txtUserName;
 theReport.modified = new Date();
 // OLD: store.addTiddler(theReport);
 store.saveTiddler(theReport.title, theReport.title, theReport.text, theReport.modifier, theReport.modified, theReport.tags);
 if (!quiet) { story.displayTiddler(null,theReport.title,1,null,null,false); story.refreshTiddler(theReport.title,1,true); }
 }

 // reset status flags
 for (var t=0; t<config.macros.importDFwikis.inbound.length; t++) config.macros.importDFwikis.inbound[t].status="";

 // refresh display if tiddlers have been loaded
 if (count) { store.setDirty(true); store.notifyAll(); }

 // always show final message when tiddlers were actually loaded
 if (count) displayMessage(config.macros.importDFwikis.importedMsg.format([count,tiddlers.length,config.macros.importDFwikis.src]));
}
//}}}

/***
!!!!!TW 2.1beta Core Code Candidate
//The following section is a preliminary 'code candidate' for incorporation of non-interactive 'load tiddlers' functionality into TW2.1beta. //
***/
//{{{
// default cookie/option values
if (!config.options.chkimportDFwikiReport) config.options.chkimportDFwikiReport=true;

config.macros.loadDFwikis = {
 label: "",
 prompt: "add/update tiddlers from '%0'",
 askMsg: "Please enter a local path/filename or a remote URL",
 openMsg: "Opening %0",
 openErrMsg: "Could not open %0 - error=%1",
 readMsg: "Read %0 bytes from %1",
 foundMsg: "Found %0 tiddlers in %1",
 nochangeMsg: "'%0' is up-to-date... skipped.",
 loadedMsg: "Loaded %0 of %1 tiddlers from %2"
};

config.macros.loadDFwikis.handler = function(place,macroName,params) {
 var label=(params[0] && params[0].substr(0,6)=='label:')?params.shift().substr(6):this.label;
 var prompt=(params[0] && params[0].substr(0,7)=='prompt:')?params.shift().substr(7):this.prompt;
 var filter="updates";
 if (params[0] && (params[0]=='all' || params[0]=='new' || params[0]=='changes' || params[0]=='updates'
 || params[0].substr(0,8)=='tiddler:' || params[0].substr(0,4)=='tag:'))
 filter=params.shift();
 var src=params.shift(); if (!src || !src.length) return; // filename is required
 var quiet=(params[0]=="quiet"); if (quiet) params.shift();
 var ask=(params[0]=="confirm"); if (ask) params.shift();
 var force=(params[0]=="force"); if (force) params.shift();
 if (label.trim().length) {
 // link triggers load tiddlers from another file/URL and then applies filtering rules to add/replace tiddlers in the store
 createTiddlyButton(place,label.format([src]),prompt.format([src]), function() {
 if (src=="ask") src=prompt(config.macros.loadDFwikis.askMsg);
 loadRemoteItem(src,loadDFwikis,quiet,ask,filter,force);
 })
 }
 else {
 // load tiddlers from another file/URL and then apply filtering rules to add/replace tiddlers in the store
 if (src=="ask") src=prompt(config.macros.loadDFwikis.askMsg);
 loadRemoteItem(src,loadDFwikis,quiet,ask,filter,force);
 }
}

function loadDFwikis(src,html,quiet,ask,filter,force)
{
 var tiddlers = readItemsFromHTML(html);
 var count=tiddlers?tiddlers.length:0;
 if (!quiet) displayMessage(config.macros.loadDFwikis.foundMsg.format([count,src]));
 var count=0;
 if (tiddlers) for (var t=0;t<tiddlers.length;t++) {
 var inbound = tiddlers[t];
 var theExisting = store.getTiddler(inbound.title);
 if (inbound.title=='ImportedTiddlers')
 continue; // skip "ImportedTiddlers" history from the other document...

 // apply the all/new/changes/updates filter (if any)
 if (filter && filter!="all") {
 if ((filter=="new") && theExisting) // skip existing tiddlers
 continue;
 if ((filter=="changes") && !theExisting) // skip new tiddlers
 continue;
 if ((filter.substr(0,4)=="tag:") && inbound.tags.find(filter.substr(4))==null) // must match specific tag value
 continue;
 if ((filter.substr(0,8)=="tiddler:") && inbound.title!=filter.substr(8)) // must match specific tiddler name
 continue;
 if (!force && store.tiddlerExists(inbound.title) && ((theExisting.modified.getTime()-inbound.modified.getTime())>=0))
 { if (!quiet) displayMessage(config.macros.loadDFwikis.nochangeMsg.format([inbound.title])); continue; }
 }
 // get confirmation if required
 if (ask && !confirm((theExisting?"Update":"Add")+" tiddler '"+inbound.title+"'\nfrom "+src))
 { tiddlers[t].status="skipped - cancelled by user"; continue; }
 // DO IT!
 // OLD: store.addTiddler(in);
 store.saveTiddler(inbound.title, inbound.title, inbound.text, inbound.modifier, inbound.modified, inbound.tags);
 store.fetchTiddler(inbound.title).created = inbound.created; // force creation date to imported value
 tiddlers[t].status=theExisting?"updated":"added"
 count++;
 }
 if (count) {
 // refresh display
 store.setDirty(true);
 store.notifyAll();
 // generate a report
 if (config.options.chkimportDFwikiReport) {
 // get/create the report tiddler
 var theReport = store.getTiddler('ImportedTiddlers');
 if (!theReport) { theReport= new Tiddler(); theReport.title = 'ImportedTiddlers'; theReport.text = ""; }
 // format the report content
 var now = new Date();
 var newText = "On "+now.toLocaleString()+", "+config.options.txtUserName+" loaded "+count+" tiddlers from\n[["+src+"|"+src+"]]:\n";
 newText += "<<<\n";
 for (var t=0; t<tiddlers.length; t++) if (tiddlers[t].status) newText += "#[["+tiddlers[t].title+"]] - "+tiddlers[t].status+"\n";
 newText += "<<<\n";
 // update the ImportedTiddlers content and show the tiddler
 theReport.text = newText+((theReport.text!="")?'\n----\n':"")+theReport.text;
 theReport.modifier = config.options.txtUserName;
 theReport.modified = new Date();
 // OLD: store.addTiddler(theReport);
 store.saveTiddler(theReport.title, theReport.title, theReport.text, theReport.modifier, theReport.modified, theReport.tags);
 if (!quiet) { story.displayTiddler(null,theReport.title,1,null,null,false); story.refreshTiddler(theReport.title,1,true); }
 }
 }
 // always show final message when tiddlers were actually loaded
 if (!quiet||count) displayMessage(config.macros.loadDFwikis.loadedMsg.format([count,tiddlers.length,src]));
}

function loadRemoteItem(src,callback,quiet,ask,filter,force) {
 if (src==undefined || !src.length) return null; // filename is required
 if (!quiet) clearMessage();
 if (!quiet) displayMessage(config.macros.loadDFwikis.openMsg.format([src]));
 if (src.substr(0,4)!="http" && src.substr(0,4)!="file") { // if not a URL, fallback to read from local filesystem
 var txt=loadFile(src);
 if ((txt==null)||(txt==false)) // file didn't load
 { if (!quiet) displayMessage(config.macros.loadDFwikis.openErrMsg.format([src,"(unknown)"])); }
 else {
 if (!quiet) displayMessage(config.macros.loadDFwikis.readMsg.format([txt.length,src]));
 if (callback) callback(src,convertUTF8ToUnicode(txt),quiet,ask,filter,force);
 }
 }
 else {
 var x; // get an request object
 try {x = new XMLHttpRequest()} // moz
 catch(e) {
 try {x = new ActiveXObject("Msxml2.XMLHTTP")} // IE 6
 catch (e) {
 try {x = new ActiveXObject("Microsoft.XMLHTTP")} // IE 5
 catch (e) { return }
 }
 }
 // setup callback function to handle server response(s)
 x.onreadystatechange = function() {
 if (x.readyState == 4) {
 if (x.status==0 || x.status == 200) {
 if (!quiet) displayMessage(config.macros.loadDFwikis.readMsg.format([x.responseText.length,src]));
 if (callback) callback(src,x.responseText,quiet,ask,filter,force);
 }
 else {
 if (!quiet) displayMessage(config.macros.loadDFwikis.openErrMsg.format([src,x.status]));
 }
 }
 }
 // get privileges to read another document's DOM via http:// or file:// (moz-only)
 if (typeof(netscape)!="undefined") {
 try { netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead"); }
 catch (e) { if (!quiet) displayMessage(e.description?e.description:e.toString()); }
 }
 // send the HTTP request
 try {
 var url=src+(src.indexOf('?')<0?'?':'&')+'nocache='+Math.random();
 x.open("GET",src,true);
 if (x.overrideMimeType) x.overrideMimeType('text/html');
 x.send(null);
 }
 catch (e) {
 if (!quiet) {
 displayMessage(config.macros.loadDFwikis.openErrMsg.format([src,"(unknown)"]));
 displayMessage(e.description?e.description:e.toString());
 }
 }
 }
}

function readItemsFromHTML(html)
{
 // extract store area from html 
 var start=html.indexOf('<div id="storeArea">');
 var end=html.indexOf("<!--POST-BODY-START--"+">",start);
 if (end==-1) var end=html.indexOf("</body"+">",start); // backward-compatibility for older documents
 var sa="<html><body>"+html.substring(start,end)+"</body></html>";

 // load html into iframe document
 var f=document.getElementById("loaderFrame"); if (f) document.body.removeChild(f);
 f=document.createElement("iframe"); f.id="loaderFrame";
 f.style.width="0px"; f.style.height="0px"; f.style.border="0px";
 document.body.appendChild(f);
 var d=f.document;
 if (f.contentDocument) d=f.contentDocument; // For NS6
 else if (f.contentWindow) d=f.contentWindow.document; // For IE5.5 and IE6
 d.open(); d.writeln(sa); d.close();

 // read tiddler DIVs from storeArea DOM element 
 var sa = d.getElementById("storeArea");
 if (!sa) return null;
 sa.normalize();
 var nodes = sa.childNodes;
 if (!nodes || !nodes.length) return null;
 var tiddlers = [];
 for(var t = 0; t < nodes.length; t++) {
 var title = null;
 if(nodes[t].getAttribute)
 title = nodes[t].getAttribute("tiddler");
 if(!title && nodes[t].id && (nodes[t].id.substr(0,5) == "store"))
 title = nodes[t].id.substr(5);
 if(title && title != "")
 tiddlers.push((new Tiddler()).loadFromDiv(nodes[t],title));
 }
 return tiddlers;
}
//}}}