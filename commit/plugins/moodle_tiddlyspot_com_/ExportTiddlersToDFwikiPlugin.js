/***
|''Name:''|ExportTiddlersToDFwikisPlugin|
|''Author:''|[[Oriol Nieto|http://enochrooted.blogspot.com/]] , [[Alejandro Moreno|http://vdemarvvv.blogspot.com/]], Dídac Calventus & [[Ludo( Marc Alier)|http://www.lsi.upc.edu/~malier/]]|
|''Another production of:''|[[dfwikiteam|http://morfeo.upc.es/crom/]] [[Universitat Politècnica de Catalunya|http://www.upc.edu]]|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/ as described in the license document http://www.lsi.upc.edu/~malier/tidlywikimoodledfwikimport.html#%5B%5BLicense%20And%20Legal%20Aspects%5D%5D]]|
|''~CoreVersion:''|2.1.2|
|''~PluglinVersion:''|1.3|
|''Download latest version from''|http://moodle.tiddlyspot.com#ExportTiddlersToDFwikiPlugin|
|''Moodle wiki server side files''|http://morfeo.upc.edu/crom|
/***

This plugin lets you export tiddlers into dfwiki pages of a moodle 1.6.X with the nwiki module installed.
Log-in with your moodle username and pasword and click "get info" to begin the interactive process of exporting tiddlers.

You need to install the Moodle wiki server side files. You can find them in http://morfeo.upc.edu/crom.

It's ''strongly recommended'' that you use ''Firefox'' (or any netscape based navigator) instead of IE in order to avoid security problems.

If anyway you want to use IE, you'll have to turn down all security parameters.

!!!!!Inline interface (live)
<<<
<<exportDFwikis inline>>
<<<
!!!!!Credits 
<<<
This plugin is a derivative of http://www.TiddlyTools.com/#ExportTiddlersPlugin, created by Eric L.Shulman and/or ELS Design Studios, and is subject to all terms and conditions as described in http://www.TiddlyTools.com/#LegalStatements as well as all other terms and conditions as described in this document.
<<<
!!!!!Usage
<<<
Optional "special tiddlers" used by this plugin:
* MoodleSource^^
Indicates the source of the moodle distribution that you wanna export to.
default: //none//^^
<<<
!!!!!Revision History
<<<
''2006.12.09 [1.3]''
Added a new optional part of the panel compatible with wiki with groups.
''2006.11.27 [1.2]''
AJAX interaction is recieved in XML format (Solve some names problems).
''2006.11.15 [1.1]''
Improved and interactive interface.
''2006.11.15 [1.0]''
First release
''2006.11.09 [0.0]''
development started
<<<
!!!!!Code
***/
// // +++[version]
//{{{
version.extensions.exportDFwikis = {major: 2, minor: 2, revision: 3, date: new Date(2006,10,12)};
//}}}
// //===

// // +++[macro handler]
//{{{
config.macros.exportDFwikis = {
 label: "export tiddlers to moodle",
 prompt: "Copy selected tiddlers to a moodle",
 datetimefmt: "0MM/0DD/YYYY 0hh:0mm:0ss", // for "filter date/time" edit fields
 callNumber: "0",
 info: "",
 username: "",
 transition: "no" , //to select if we've to call the export function or the transaction event (groups->users)
 selectedWiki: "" ,
 selectedWikiGroups: "", //Wiki just before filling the users/groups select
 selectedGroup: "",
 selectedUser: "",
 selectedCourse: ""
 
};

config.macros.exportDFwikis.handler = function(place,macroName,params) {
 if (params[0]!="inline")
 { createTiddlyButton(place,this.label,this.prompt,onClickExportDFwikiMenu); return; }
 var panel=createExportDFwikiPanel(place);
 panel.style.position="static";
 panel.style.display="block";
}

function createExportDFwikiPanel(place) {
 var panel=document.getElementById("exportPanel");
 if (panel) { panel.parentNode.removeChild(panel); }
 setStylesheet(config.macros.exportDFwikis.css,"exportDFwikis");
 panel=createTiddlyElement(place,"span","exportPanel",null,null)
 panel.innerHTML=config.macros.exportDFwikis.html;
 exportInitFilter();
 refreshExportDFwikiList(0);
 var MoodleSource=store.getTiddlerText("MoodleSource"); if (!MoodleSource) MoodleSource="";
 document.getElementById("exportMoodleServer").value=MoodleSource;
 return panel;
}

function onClickExportDFwikiMenu(e)
{
 if (!e) var e = window.event;
 var parent=resolveTarget(e).parentNode;
 var panel = document.getElementById("exportPanel");
 if (panel==undefined || panel.parentNode!=parent)
 panel=createExportDFwikiPanel(parent);
 var isOpen = panel.style.display=="block";
 if(config.options.chkAnimate)
 anim.startAnimating(new Slider(panel,!isOpen,e.shiftKey || e.altKey,"none"));
 else
 panel.style.display = isOpen ? "none" : "block" ;
 if (panel.style.display!="none") refreshExportDFwikiList(0); // update list when panel is made visible
 e.cancelBubble = true;
 if (e.stopPropagation) e.stopPropagation();
 return(false);
}
//}}}
// //===

// // +++[Hijack saveChanges] diverts 'notFileUrlError' to display export control panel instead
//{{{
window.coreSaveDFwikiChanges=window.saveDFwikiChanges;
window.saveDFwikiChanges = function()
{
 if (document.location.protocol=="file:") { coreSaveDFwikiChanges(); return; }
 var e = window.event;
 var parent=e?resolveTarget(e).parentNode:document.body;
 var panel = document.getElementById("exportPanel");
 if (panel==undefined || panel.parentNode!=parent) panel=createExportDFwikiPanel(parent);
 if (parent==document.body) { panel.style.left="30%"; panel.style.top="30%"; }
 panel.style.display = "block" ;
}
//}}}
// //===

// // +++[IE needs explicit scoping] for functions called by browser events
//{{{
window.onClickExportDFwikiMenu=onClickExportDFwikiMenu;
window.onClickExportDFwikiButton=onClickExportDFwikiButton;
window.exportShowDFwikiFilterFields=exportShowDFwikiFilterFields;
window.refreshExportDFwikiList=refreshExportDFwikiList;
//}}}
// //===

// // +++[CSS] for floating export control panel
//{{{
config.macros.exportDFwikis.css = '\
#exportPanel {\
 display: none; position:absolute; z-index:12; width:35em; right:105%; top:6em;\
 background-color: #eee; color:#000; font-size: 8pt; line-height:110%;\
 border:1px solid black; border-bottom-width: 3px; border-right-width: 3px;\
 padding: 0.5em; margin:0em; -moz-border-radius:1em;\
}\
#exportPanel a, #exportPanel td a { color:#009; display:inline; margin:0px; padding:1px; }\
#exportPanel table { width:100%; border:0px; padding:0px; margin:0px; font-size:8pt; line-height:110%; background:transparent; }\
#exportPanel tr { border:0px;padding:0px;margin:0px; background:transparent; }\
#exportPanel td { color:#000; border:0px;padding:0px;margin:0px; background:transparent; }\
#exportPanel select { width:100%;margin:0px;font-size:8pt;line-height:110%;}\
#exportPanel input { width:100%;padding:0px;margin:0px;font-size:8pt;line-height:110%; }\
#exportPanel textarea { width:98%;padding:0px;margin:0px;overflow:auto;font-size:8pt; }\
#exportPanel .box { border:1px solid black; padding:3px; margin-bottom:5px; background:#f8f8f8; -moz-border-radius:5px; }\
#exportPanel .topline { border-top:2px solid black; padding-top:3px; margin-bottom:5px; }\
#exportPanel .rad { width:auto;border:0 }\
#exportPanel .chk { width:auto;border:0 }\
#exportPanel .btn { width:auto; }\
#exportPanel .btn1 { width:98%; }\
#exportPanel .btn1bis { width:90%; }\
#exportPanel .btn2 { width:48%; }\
#exportPanel .btn3 { width:32%; }\
#exportPanel .btn4 { width:24%; }\
#exportPanel .btn5 { width:19%; }\
#groupsPanel { display:none; margin:0.5em 0em 0em 0em; }\
';
//}}}
// //===

// // +++[HTML] for export control panel interface
//{{{
config.macros.exportDFwikis.html = '\
<!-- export to a moodle server -->\
<div id="exportDFwikiPanel" style="margin-top:5px;">\
moodle server<br>\
<table cellpadding="0" cellspacing="0"><td width="80%">\
 <input type="text" id="exportMoodleServer" onfocus="this.select()"><br>\
</td><td width="20%" align="right">\
<input type=button class="btn1bis" onclick="getMoodleInfo()"\
 id="getMoodleInfo" value="get info!">\
</td></table>\
<table cellpadding="0" cellspacing="0" width="40%"><td>\
 username<br>\
 <input type="text" id="exportID" onfocus="this.select()"><br>\
</td><td width="40%">\
 password<br>\
 <input type="password" id="exportPW" onfocus="this.select()"><br>\
</td><td width="20%" align="right">\
 <br>\
 developed by\
</td></table>\
<table cellpadding="0" cellspacing="0" width="40%"><td>\
 course<br>\
 <select id="exportDFwikiCourse" onfocus="this.select()" onchange="continueGettingMoodleInfo(this.value)" disabled><br>\
 </select>\
</td><td width="40%">\
 wiki name<br>\
 <select id="exportDFwikiName" onfocus="this.select()" onchange="config.macros.exportDFwikis.selectedWiki=this.value" disabled><br>\
 </select>\
</td><td width="20%" align="right">\
 <a href="http://morfeo.upc.es/crom/">\
 <img src="http://img294.imageshack.us/img294/8712/dfwikiteamie8.jpg">\
 </a>\
</td></table>\
</div><!--panel-->\
<div id="groupsPanel" style="margin-top:5px;margin-bottom:5px">\
 <table cellpadding="0" cellspacing="0" width="40%"><td>\
 group<br>\
 <select id="groupbox" onfocus="this.select()" onchange="transitionInfo(this.value)" disabled><br>\
 </select>\
 </td><td width="40%">\
 user<br>\
 <select id="userbox" onfocus="this.select()" onchange="config.macros.exportDFwikis.selectedUser=this.value" disabled><br>\
 </select>\
 </td><td width="20%" align="right">\
 <font color="green">\
 ¡¡ groups info !!\
 </font>\
</td></table>\
</div>\
\
<!-- list of tiddlers -->\
<table><tr align="left"><td>\
 select:\
 <a href="JavaScript:;" id="exportSelectChanges"\
 onclick="onClickExportDFwikiButton(this)" title="select tiddlers changed since last save">\
 &nbsp;changes&nbsp;</a> \
 <a href="JavaScript:;" id="exportSelectOpened"\
 onclick="onClickExportDFwikiButton(this)" title="select tiddlers currently being displayed">\
 &nbsp;opened&nbsp;</a> \
 <a href="JavaScript:;" id="exportToggleFilter"\
 onclick="onClickExportDFwikiButton(this)" title="show/hide selection filter">\
 &nbsp;filter&nbsp;</a> \
</td><td align="right">\
 <a href="JavaScript:;" id="exportListSmaller"\
 onclick="onClickExportDFwikiButton(this)" title="reduce list size">\
 &nbsp;&#150;&nbsp;</a>\
 <a href="JavaScript:;" id="exportListLarger"\
 onclick="onClickExportDFwikiButton(this)" title="increase list size">\
 &nbsp;+&nbsp;</a>\
</td></tr></table>\
<select id="exportList" multiple size="10" style="margin-bottom:5px;"\
 onchange="refreshExportDFwikiList(this.selectedIndex)">\
</select><br>\
</div><!--box-->\
\
<!-- selection filter -->\
<div id="exportFilterPanel" style="display:none">\
<table><tr align="left"><td>\
 selection filter\
</td><td align="right">\
 <a href="JavaScript:;" id="exportHideFilter"\
 onclick="onClickExportDFwikiButton(this)" title="hide selection filter">hide</a>\
</td></tr></table>\
<div class="box">\
<input type="checkbox" class="chk" id="exportFilterStart" value="1"\
 onclick="exportShowDFwikiFilterFields(this)"> starting date/time<br>\
<table cellpadding="0" cellspacing="0"><tr valign="center"><td width="50%">\
 <select size=1 id="exportFilterStartBy" onchange="exportShowDFwikiFilterFields(this);">\
 <option value="0">today</option>\
 <option value="1">yesterday</option>\
 <option value="7">a week ago</option>\
 <option value="30">a month ago</option>\
 <option value="site">SiteDate</option>\
 <option value="file">file date</option>\
 <option value="other">other (mm/dd/yyyy hh:mm)</option>\
 </select>\
</td><td width="50%">\
 <input type="text" id="exportStartDate" onfocus="this.select()"\
 onchange="document.getElementById(\'exportFilterStartBy\').value=\'other\';">\
</td></tr></table>\
<input type="checkbox" class="chk" id="exportFilterEnd" value="1"\
 onclick="exportShowDFwikiFilterFields(this)"> ending date/time<br>\
<table cellpadding="0" cellspacing="0"><tr valign="center"><td width="50%">\
 <select size=1 id="exportFilterEndBy" onchange="exportShowDFwikiFilterFields(this);">\
 <option value="0">today</option>\
 <option value="1">yesterday</option>\
 <option value="7">a week ago</option>\
 <option value="30">a month ago</option>\
 <option value="site">SiteDate</option>\
 <option value="file">file date</option>\
 <option value="other">other (mm/dd/yyyy hh:mm)</option>\
 </select>\
</td><td width="50%">\
 <input type="text" id="exportEndDate" onfocus="this.select()"\
 onchange="document.getElementById(\'exportFilterEndBy\').value=\'other\';">\
</td></tr></table>\
<input type="checkbox" class="chk" id=exportFilterTags value="1"\
 onclick="exportShowDFwikiFilterFields(this)"> match tags<br>\
<input type="text" id="exportTags" onfocus="this.select()">\
<input type="checkbox" class="chk" id=exportFilterText value="1"\
 onclick="exportShowDFwikiFilterFields(this)"> match titles/tiddler text<br>\
<input type="text" id="exportText" onfocus="this.select()">\
</div> <!--box-->\
</div> <!--panel-->\
\
<!-- action buttons -->\
<div style="text-align:center">\
<input type=button class="btn3" onclick="onClickExportDFwikiButton(this)"\
 id="exportFilter" value="apply filter">\
<input type=button class="btn3" onclick="onClickExportDFwikiButton(this)"\
 id="exportStart" value="export tiddlers">\
<input type=button class="btn3" onclick="onClickExportDFwikiButton(this)"\
 id="exportClose" value="close">\
</div><!--center-->\
';
//}}}
// //===

// // +++[continueInfo()]
//{{{
function continueInfo() {
 
 if (config.macros.exportDFwikis.info=="0")
 {
 displayMessage("Name or password incorrect");
 document.getElementById("exportDFwikiName").disabled=true;
 document.getElementById("exportDFwikiCourse").disabled=true; 
 removeSelect("exportDFwikiName");
 }
 else if (config.macros.exportDFwikis.info=="2")
 {
 displayMessage("Guests can't export content");
 document.getElementById("exportDFwikiName").disabled=true;
 document.getElementById("exportDFwikiCourse").disabled=true;
 removeSelect("exportDFwikiName");
 }
 else if (config.macros.exportDFwikis.info=="1")
 { 
 displayMessage("Name and password correct");
 document.getElementById("exportDFwikiName").disabled=true;
 document.getElementById("exportDFwikiCourse").disabled=false;
 removeSelect("exportDFwikiName");
 }
 else 
 {
 displayMessage("Impossible to connect");
 document.getElementById("exportDFwikiName").disabled=true;
 document.getElementById("exportDFwikiCourse").disabled=true; 
 removeSelect("exportDFwikiName");
 }
}
//}}}
// //===

// // +++[continueInfo()]
//{{{
function transitionInfo(group) {
 if (group!="choose a group...")
 {
 config.macros.exportDFwikis.selectedGroup=group;
 if(config.macros.exportDFwikis.transition=="yes")
 {
 document.getElementById("exportStart").disabled=false;
 exportDFwikis(); 
 }
 }
 else
 {
 displayMessage("Impossible to export: The user choose a group... doesn't exists");
 }
} 
//}}}
// //===

// // +++[exportInitFilter()]
//{{{
function exportInitFilter() {
 // start date
 document.getElementById("exportFilterStart").checked=false;
 document.getElementById("exportStartDate").value="";
 // end date
 document.getElementById("exportFilterEnd").checked=false;
 document.getElementById("exportEndDate").value="";
 // tags
 document.getElementById("exportFilterTags").checked=false;
 document.getElementById("exportTags").value="";
 // text
 document.getElementById("exportFilterText").checked=false;
 document.getElementById("exportText").value="";
 // show/hide filter input fields
 exportShowDFwikiFilterFields();
}
//}}}
// //===

// // +++[exportShowDFwikiFilterFields(which)]
//{{{
function exportShowDFwikiFilterFields(which) {
 var show;

 show=document.getElementById('exportFilterStart').checked;
 document.getElementById('exportFilterStartBy').style.display=show?"block":"none";
 document.getElementById('exportStartDate').style.display=show?"block":"none";
 var val=document.getElementById('exportFilterStartBy').value;
 document.getElementById('exportStartDate').value
 =getFilterDate(val,'exportStartDate').formatString(config.macros.exportDFwikis.datetimefmt);
 if (which && (which.id=='exportFilterStartBy') && (val=='other'))
 document.getElementById('exportStartDate').focus();

 show=document.getElementById('exportFilterEnd').checked;
 document.getElementById('exportFilterEndBy').style.display=show?"block":"none";
 document.getElementById('exportEndDate').style.display=show?"block":"none";
 var val=document.getElementById('exportFilterEndBy').value;
 document.getElementById('exportEndDate').value
 =getFilterDate(val,'exportEndDate').formatString(config.macros.exportDFwikis.datetimefmt);
 if (which && (which.id=='exportFilterEndBy') && (val=='other'))
 document.getElementById('exportEndDate').focus();

 show=document.getElementById('exportFilterTags').checked;
 document.getElementById('exportTags').style.display=show?"block":"none";

 show=document.getElementById('exportFilterText').checked;
 document.getElementById('exportText').style.display=show?"block":"none";
}
//}}}
// //===
// //===

// // +++[onClickExportDFwikiButton(which): control interactions]
//{{{
function onClickExportDFwikiButton(which)
{
 // DEBUG alert(which.id);
 var theList=document.getElementById('exportList'); if (!theList) return;
 var count = 0;
 var total = store.getTiddlers('title').length;
 switch (which.id)
 {
 case 'exportFilter':
 count=filterExportList();
 var panel=document.getElementById('exportFilterPanel');
 if (count==-1) { panel.style.display='block'; break; }
 document.getElementById("exportStart").disabled=(count==0);
 clearMessage(); displayMessage("filtered "+formatExportMessage(count,total));
 if (count==0) { alert("No tiddlers were selected"); panel.style.display='block'; }
 break;
 case 'exportStart':
 exportDFwikis();
 break;
 case 'exportHideFilter':
 case 'exportToggleFilter':
 var panel=document.getElementById('exportFilterPanel')
 panel.style.display=(panel.style.display=='block')?'none':'block';
 break;
 case 'exportSelectChanges':
 var lastmod=new Date(document.lastModified);
 for (var t = 0; t < theList.options.length; t++) {
 if (theList.options[t].value=="") continue;
 var tiddler=store.getTiddler(theList.options[t].value); if (!tiddler) continue;
 theList.options[t].selected=(tiddler.modified>lastmod);
 count += (tiddler.modified>lastmod)?1:0;
 }
 document.getElementById("exportStart").disabled=(count==0);
 clearMessage(); displayMessage(formatExportMessage(count,total));
 if (count==0) alert("There are no unsaved changes");
 break;
 case 'exportSelectOpened':
 for (var t = 0; t < theList.options.length; t++) theList.options[t].selected=false;
 var tiddlerDisplay = document.getElementById("tiddlerDisplay");
 for (var t=0;t<tiddlerDisplay.childNodes.length;t++) {
 var tiddler=tiddlerDisplay.childNodes[t].id.substr(7);
 for (var i = 0; i < theList.options.length; i++) {
 if (theList.options[i].value!=tiddler) continue;
 theList.options[i].selected=true; count++; break;
 }
 }
 document.getElementById("exportStart").disabled=(count==0);
 clearMessage(); displayMessage(formatExportMessage(count,total));
 if (count==0) alert("There are no tiddlers currently opened");
 break;
 case 'exportListSmaller': // decrease current listbox size
 var min=5;
 theList.size-=(theList.size>min)?1:0;
 break;
 case 'exportListLarger': // increase current listbox size
 var max=(theList.options.length>25)?theList.options.length:25;
 theList.size+=(theList.size<max)?1:0;
 break;
 case 'exportClose':
 document.getElementById('exportPanel').style.display='none';
 break;
 }
}
//}}}
// //===

// // +++[list display]
//{{{
 
function addToSelect(optionSelect,selectbox)
{
 var elOptNew = document.createElement('option');
 elOptNew.text = optionSelect;
 elOptNew.value = optionSelect;
 var elSel = document.getElementById(selectbox);

 try {
 elSel.add(elOptNew, null); // standards compliant; doesn't work in IE
 }
 catch(ex) {
 elSel.add(elOptNew); // IE only
 }
}

function removeSelect(selectbox)
{
 var elSel = document.getElementById(selectbox);
 var i;
 for (i = elSel.length - 1; i>=0; i--) {
 elSel.remove(i);
 }
}

function formatExportMessage(count,total)
{
 var txt=total+' tiddler'+((total!=1)?'s':'')+" - ";
 txt += (count==0)?"none":(count==total)?"all":count;
 txt += " selected for export";
 return txt;
}

function refreshExportDFwikiList(selectedIndex)
{
 var theList = document.getElementById("exportList");
 var sort;
 if (!theList) return;
 // get the sort order
 if (!selectedIndex) selectedIndex=0;
 if (selectedIndex==0) sort='modified';
 if (selectedIndex==1) sort='title';
 if (selectedIndex==2) sort='modified';
 if (selectedIndex==3) sort='modifier';

 // get the alphasorted list of tiddlers
 var tiddlers = store.getTiddlers('title');
 // unselect headings and count number of tiddlers actually selected
 var count=0;
 for (var i=0; i<theList.options.length; i++) {
 if (theList.options[i].value=="") theList.options[i].selected=false;
 count+=theList.options[i].selected?1:0;
 }
 // disable "export" button if no tiddlers selected
 document.getElementById("exportStart").disabled=(count==0);
 // update listbox heading to show selection count
 if (theList.options.length) { clearMessage(); displayMessage(formatExportMessage(count,tiddlers.length)); }

 // if a [command] item, reload list... otherwise, no further refresh needed
 if (selectedIndex>3) return;

 // clear current list contents
 while (theList.length > 0) { theList.options[0] = null; }
 // add heading and control items to list
 var i=0;
 var indent=String.fromCharCode(160)+String.fromCharCode(160);
 theList.options[i++]=
 new Option(tiddlers.length+" tiddlers in document", "",false,false);
 theList.options[i++]=
 new Option(((sort=="title" )?">":indent)+' [by title]', "",false,false);
 theList.options[i++]=
 new Option(((sort=="modified")?">":indent)+' [by date]', "",false,false);
 theList.options[i++]=
 new Option(((sort=="modifier")?">":indent)+' [by author]', "",false,false);
 // output the tiddler list
 switch(sort)
 {
 case "title":
 for(var t = 0; t < tiddlers.length; t++)
 theList.options[i++] = new Option(tiddlers[t].title,tiddlers[t].title,false,false);
 break;
 case "modifier":
 case "modified":
 var tiddlers = store.getTiddlers(sort);
 // sort descending for newest date first
 tiddlers.sort(function (a,b) {if(a[sort] == b[sort]) return(0); else return (a[sort] > b[sort]) ? -1 : +1; });
 var lastSection = "";
 for(var t = 0; t < tiddlers.length; t++)
 {
 var tiddler = tiddlers[t];
 var theSection = "";
 if (sort=="modified") theSection=tiddler.modified.toLocaleDateString();
 if (sort=="modifier") theSection=tiddler.modifier;
 if (theSection != lastSection)
 {
 theList.options[i++] = new Option(theSection,"",false,false);
 lastSection = theSection;
 }
 theList.options[i++] = new Option(indent+indent+tiddler.title,tiddler.title,false,false);
 }
 break;
 }
 theList.selectedIndex=selectedIndex; // select current control item
}
//}}}
// //===

// // +++[list filtering]
//{{{
function getFilterDate(val,id)
{
 var result=0;
 switch (val) {
 case 'site':
 var timestamp=store.getTiddlerText("SiteDate");
 if (!timestamp) timestamp=document.lastModified;
 result=new Date(timestamp);
 break;
 case 'file':
 result=new Date(document.lastModified);
 break;
 case 'other':
 result=new Date(document.getElementById(id).value);
 break;
 default: // today=0, yesterday=1, one week=7, two weeks=14, a month=31
 var now=new Date(); var tz=now.getTimezoneOffset()*60000; now-=tz;
 var oneday=86400000;
 if (id=='exportStartDate')
 result=new Date((Math.floor(now/oneday)-val)*oneday+tz);
 else
 result=new Date((Math.floor(now/oneday)-val+1)*oneday+tz-1);
 break;
 }
 // DEBUG alert('getFilterDate('+val+','+id+')=='+result+"\nnow="+now);
 return result;
}

function filterExportList()
{
 var theList = document.getElementById("exportList"); if (!theList) return -1;

 var filterStart=document.getElementById("exportFilterStart").checked;
 var val=document.getElementById("exportFilterStartBy").value;
 var startDate=getFilterDate(val,'exportStartDate');

 var filterEnd=document.getElementById("exportFilterEnd").checked;
 var val=document.getElementById("exportFilterEndBy").value;
 var endDate=getFilterDate(val,'exportEndDate');

 var filterTags=document.getElementById("exportFilterTags").checked;
 var tags=document.getElementById("exportTags").value;

 var filterText=document.getElementById("exportFilterText").checked;
 var text=document.getElementById("exportText").value;

 if (!(filterStart||filterEnd||filterTags||filterText)) {
 alert("Please set the selection filter");
 document.getElementById('exportFilterPanel').style.display="block";
 return -1;
 }
 if (filterStart&&filterEnd&&(startDate>endDate)) {
 var msg="starting date/time:\n"
 msg+=startDate.toLocaleString()+"\n";
 msg+="is later than ending date/time:\n"
 msg+=endDate.toLocaleString()
 alert(msg);
 return -1;
 }

 // scan list and select tiddlers that match all applicable criteria
 var total=0;
 var count=0;
 for (var i=0; i<theList.options.length; i++) {
 // get item, skip non-tiddler list items (section headings)
 var opt=theList.options[i]; if (opt.value=="") continue;
 // get tiddler, skip missing tiddlers (this should NOT happen)
 var tiddler=store.getTiddler(opt.value); if (!tiddler) continue; 
 var sel=true;
 if ( (filterStart && tiddler.modified<startDate)
 || (filterEnd && tiddler.modified>endDate)
 || (filterTags && !matchTags(tiddler,tags))
 || (filterText && (tiddler.text.indexOf(text)==-1) && (tiddler.title.indexOf(text)==-1)))
 sel=false;
 opt.selected=sel;
 count+=sel?1:0;
 total++;
 }
 return count;
}
//}}}

//{{{
function matchTags(tiddler,cond)
{
 if (!cond||!cond.trim().length) return false;

 // build a regex of all tags as a big-old regex that 
 // OR's the tags together (tag1|tag2|tag3...) in length order
 var tgs = store.getTags();
 if ( tgs.length == 0 ) return results ;
 var tags = tgs.sort( function(a,b){return (a[0].length<b[0].length)-(a[0].length>b[0].length);});
 var exp = "(" + tags.join("|") + ")" ;
 exp = exp.replace( /(,[\d]+)/g, "" ) ;
 var regex = new RegExp( exp, "ig" );

 // build a string such that an expression that looks like this: tag1 AND tag2 OR NOT tag3
 // turns into : /tag1/.test(...) && /tag2/.test(...) || ! /tag2/.test(...)
 cond = cond.replace( regex, "/$1\\|/.test(tiddlerTags)" );
 cond = cond.replace( /\sand\s/ig, " && " ) ;
 cond = cond.replace( /\sor\s/ig, " || " ) ;
 cond = cond.replace( /\s?not\s/ig, " ! " ) ;

 // if a boolean uses a tag that doesn't exist - it will get left alone 
 // (we only turn existing tags into actual tests).
 // replace anything that wasn't found as a tag, AND, OR, or NOT with the string "false"
 // if the tag doesn't exist then /tag/.test(...) will always return false.
 cond = cond.replace( /(\s|^)+[^\/\|&!][^\s]*/g, "false" ) ;

 // make a string of the tags in the tiddler and eval the 'cond' string against that string 
 // if it's TRUE then the tiddler qualifies!
 var tiddlerTags = (tiddler.tags?tiddler.tags.join("|"):"")+"|" ;
 try { if ( eval( cond ) ) return true; }
 catch( e ) { displayMessage("Error in tag filter '" + e + "'" ); }
 return false;
}
//}}}
// //===

// // +++[output data formatting]>

// // +++[exportDataToDFWiki()]
//{{{
function exportDataToDFWiki(theList)
{
 try{
 // scan export listbox and collect DIVs or XML for selected tiddler content
 var out=[];
 for (var i=0; i<theList.options.length; i++) {
 // get item, skip non-selected items and section headings
 var opt=theList.options[i]; 
 if (!opt.selected||(opt.value=="")) continue;
 // get tiddler, skip missing tiddlers (this should NOT happen)
 var thisTiddler=store.getTiddler(opt.value); 
 if (!thisTiddler) continue; 
 var tiddlerTitle=store.fetchTiddler(thisTiddler.title).title;
 var modifier=store.fetchTiddler(thisTiddler.title).modifier;
 var modified=store.fetchTiddler(thisTiddler.title).modified;
 var tiddlerContent=store.fetchTiddler(thisTiddler.title).text;
 var tags=store.fetchTiddler(thisTiddler.title).tags;

 out.push(convertUnicodeToUTF8(tiddlerTitle));
 out.push(convertUnicodeToUTF8(modifier));
 out.push(modified);
 out.push(convertUnicodeToUTF8(tiddlerContent));
 out.push(convertUnicodeToUTF8(tags));
 }
 return out;
 }
 catch (e) {
 displayMessage(e.description?e.description:e.toString());
 }
}
//}}}
// //===

// // +++[exportDFwikis(): output selected data to local or server]
//{{{
function exportDFwikis()
{
 var theList = document.getElementById("exportList"); if (!theList) return;

 // assemble output: 
 // [0]: tiddler name
 // [1]: modifier
 // [2]: time modified
 // [3]: tiddler content
 // [4]: tags
 var theData=exportDataToDFWiki(theList);
 var count=theData.length;
 /*displayMessage(theData[0]);
 displayMessage(theData[1]);
 displayMessage(theData[2]);
 displayMessage(theData[3]);
 */
 var i;
 for (i=0; i<count; i=i+5){
 var tiddlerName = theData[i+0];
 var modifier = theData[i+1];
 var modified = theData[i+2];
 var tiddlerContent = theData[i+3];
 var tag = theData[i+4];
 tiddlerContent=tiddlerContent.replace(/&/g, "&amp;").replace(/</g,"&lt;").replace(/>/g, "&gt;");
 tiddlerContent=tiddlerContent.replace(/&/g, "#|@");
 exportToMoodle(tiddlerName, modifier, modified, tiddlerContent,tag);
 }
 
 /*var out=[]; var txt=out.concat("",theData).join("\n");
 var msg="";

 var theTarget = document.getElementById("exportFilename").value.trim();
 if (!theTarget.length) msg = "A local path/filename is required\n";
 if (!msg && saveFile(theTarget,txt))
 msg=count+" tiddler"+((count!=1)?"s":"")+" exported to local file";
 else if (!msg)
 msg+="An error occurred while saving to "+theTarget;

 clearMessage(); displayMessage(msg,theTarget);*/
}
//}}}
// //===

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

function calculateMD5Export() 
{
 var pw = document.getElementById("exportPW").value;
 return(calcMD5(pw));
}

function attachMD5Export(hash) 
{
 config.macros.exportDFwikis.username=document.getElementById("exportID").value; 
 var getUrl = "&user="+document.getElementById("exportID").value;
 getUrl += "&pwd="+hash.toLowerCase();
 return getUrl;
}
//}}}

// // AJAX Functions
// // +++[GetXmlHttpObject(handler): gets the XMLhttp object]
//{{{
function GetXmlHttpObject(handler)
{ 
 var objXMLHttp=null;
 if (window.XMLHttpRequest)
 {
 objXMLHttp=new XMLHttpRequest();
 }
 else if (window.ActiveXObject)
 {
 objXMLHttp=new ActiveXObject("Microsoft.XMLHTTP");
 }
 return objXMLHttp;
}

function exportToMoodle(tiddlerName, modifier, modified, tiddlerContent, tag)
{
 if (config.macros.exportDFwikis.selectedWiki!="choose a wiki...")
 {
 if(config.macros.exportDFwikis.selectedUser!="choose an user...")
 {
 if (config.macros.exportDFwikis.callNumber!="0") //This only happen if we've to call this function more than 1 time
 {
 if (config.macros.exportDFwikis.selectedWikiGroups!=document.getElementById("exportDFwikiName").value)
 {
 displayMessage("The selected wiki has changed. Please log-in.");
 removeSelect("exportDFwikiCourse");
 removeSelect("exportDFwikiName");
 removeSelect("groupbox");
 removeSelect("userbox");
 document.getElementById("exportDFwikiName").disabled=true;
 document.getElementById("exportDFwikiCourse").disabled=true;
 document.getElementById("groupbox").disabled=true;
 document.getElementById("userbox").disabled=true;
 document.getElementById('groupsPanel').style.display='none';
 config.macros.exportDFwikis.callNumber="0"; 
 }
 else if (config.macros.exportDFwikis.selectedCourse!=document.getElementById("exportDFwikiCourse").value)
 {
 displayMessage("The selected course has changed. Please log-in.");
 removeSelect("exportDFwikiCourse");
 removeSelect("exportDFwikiName");
 removeSelect("groupbox");
 removeSelect("userbox");
 document.getElementById("exportDFwikiName").disabled=true;
 document.getElementById("exportDFwikiCourse").disabled=true;
 document.getElementById("groupbox").disabled=true;
 document.getElementById("userbox").disabled=true;
 document.getElementById('groupsPanel').style.display='none';
 config.macros.exportDFwikis.callNumber="0"; 
 } 
 }
 
 if (config.macros.exportDFwikis.username!=document.getElementById("exportID").value)
 {
 displayMessage("The user don't exists or has changed. Please log-in.");
 removeSelect("exportDFwikiCourse");
 removeSelect("exportDFwikiName");
 removeSelect("groupbox");
 removeSelect("userbox");
 document.getElementById("exportDFwikiName").disabled=true;
 document.getElementById("exportDFwikiCourse").disabled=true;
 document.getElementById("groupbox").disabled=true;
 document.getElementById("userbox").disabled=true;
 document.getElementById('groupsPanel').style.display='none';
 }
 else
 {
 xmlHttp=GetXmlHttpObject();
 if (xmlHttp==null)
 {
 alert ("Browser does not support HTTP Request");
 return
 }
 var url=document.getElementById("exportMoodleServer").value;
 url+= ((url.charAt(url.length-1)!="/")?'/':'')+"mod/wiki/webservicelib.php";
 var wikiName = document.getElementById("exportDFwikiName").value;
 var courseName = document.getElementById("exportDFwikiCourse").value;
 var call_number = config.macros.exportDFwikis.callNumber;
 var ownerName = config.macros.exportDFwikis.selectedUser;
 var groupName = config.macros.exportDFwikis.selectedGroup;
 xmlHttp.onreadystatechange=stateExportToMoodle;
 if (typeof(netscape)!="undefined") { // For moz-netscape, to access to a remote http:// or file://
 try { netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");}
 catch (e) { displayMessage(e.description?e.description:e.toString()); }
 }
 try 
 {
 xmlHttp.open("POST",url);
 xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Needed for the POST method
 if (xmlHttp.overrideMimeType) xmlHttp.overrideMimeType('text/xml');
 xmlHttp.send("sel=importTiddlers"+attachMD5Export(calculateMD5Export())+"&course="+courseName+"&wiki="+wikiName+"&tiddler_title="+tiddlerName+"&tag="+tag+"&tiddler_content="+tiddlerContent+"&call_number="+call_number+"&ownerName="+ownerName+"&groupName="+groupName);
 }
 catch (e) {
 displayMessage(e.description?e.description:e.toString());
 }
 } 
 }
 else
 {
 displayMessage("Impossible to export: The user choose an user... doesn't exists"); 
 }
 }
 else
 {
 displayMessage("Impossible to export: The wiki choose a wiki... doesn't exists");
 }
}

function getMoodleInfo(sync)
{ 
 //Remove the existent valors of the selects used before
 config.macros.exportDFwikis.callNumber="0";
 removeSelect("groupbox");
 removeSelect("userbox");
 removeSelect("exportDFwikiCourse");
 removeSelect("exportDFwikiName");
 document.getElementById("groupbox").disabled=true;
 document.getElementById("userbox").disabled=true;
 document.getElementById("exportDFwikiName").disabled=true;
 document.getElementById("exportDFwikiCourse").disabled=true;
 document.getElementById('groupsPanel').style.display='none';
 
 //AJAX interaction
 xmlHttp=GetXmlHttpObject();
 
 if (xmlHttp==null)
 {
 alert ("Browser does not support HTTP Request");
 return
 }
 var url=document.getElementById("exportMoodleServer").value;
 url+= ((url.charAt(url.length-1)!="/")?'/':'')+"mod/wiki/webservicelib.php";
 if (sync && sync==true) xmlHttp.onreadystatechange=stateGetMoodleInfoSync;
 else xmlHttp.onreadystatechange=stateGetMoodleInfo;
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
 xmlHttp.send("sel=getMoodleInfo"+attachMD5Export(calculateMD5Export()));
 }
 catch (e) 
 {
 displayMessage(e.description?e.description:e.toString());
 }
}

function continueGettingMoodleInfo(course_short, sync)
{
 if (course_short!="choose a course...")
 {
 if (config.macros.exportDFwikis.username!=document.getElementById("exportID").value)
 {
 displayMessage("The user has changed. Please log-in again.");
 removeSelect("exportDFwikiCourse");
 removeSelect("exportDFwikiName");
 document.getElementById("exportDFwikiName").disabled=true;
 document.getElementById("exportDFwikiCourse").disabled=true;
 }
 else
 {
 xmlHttp=GetXmlHttpObject();
 if (xmlHttp==null)
 {
 alert ("Browser does not support HTTP Request");
 return
 }
 var url=document.getElementById("exportMoodleServer").value;
 url+= ((url.charAt(url.length-1)!="/")?'/':'')+"mod/wiki/webservicelib.php";
 if (sync && sync==true) xmlHttp.onreadystatechange=statecontinueGettingMoodleInfoSync;
 else xmlHttp.onreadystatechange=statecontinueGettingMoodleInfo;
 if (typeof(netscape)!="undefined") 
 { // For moz-netscape, to access to a remote http:// or file://
 try { netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");}
 catch (e) { displayMessage(e.description?e.description:e.toString()); }
 }
 try {
 xmlHttp.open("POST",url);
 xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Needed for the POST method
 if (xmlHttp.overrideMimeType) xmlHttp.overrideMimeType('text/xml');
 xmlHttp.send("sel=continueGettingMoodleInfo"+attachMD5Export(calculateMD5Export())+"&course="+course_short);
 }
 catch (e) {
 displayMessage(e.description?e.description:e.toString());
 }
 } 
 }
}

function stateExportToMoodle() 
{
 if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete")
 { 
 if (typeof(netscape)!="undefined") { // For moz-netscape, to access to a remote http:// or file://
 try { netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");}
 catch (e) { displayMessage(e.description?e.description:e.toString()); }
 }
 var xml = xmlHttp.responseXML;
 var info =new Array(xml.getElementsByTagName('items').length);
 for (i = 0; i < xml.getElementsByTagName('items').length; i++)
 {
 var item = xml.getElementsByTagName('response')[0];
 var id = item.getElementsByTagName('items')[i].firstChild.data;
 info[i]=id;
 }
 
 //We save the current valors of selects and inputs to avoid in invalid accesses
 config.macros.exportDFwikis.username=document.getElementById("exportID").value;
 config.macros.exportDFwikis.selectedWikiGroups=document.getElementById("exportDFwikiName").value;
 config.macros.exportDFwikis.selectedCourse=document.getElementById("exportDFwikiCourse").value;
 
 var option=info[0];
 if (option=="0") //error
 {
 displayMessage(info[1]);
 document.getElementById('groupsPanel').style.display='none';
 removeSelect("groupbox");
 removeSelect("userbox");
 document.getElementById("groupbox").disabled=true;
 document.getElementById("userbox").disabled=true;
 config.macros.exportDFwikis.callNumber="0";
 config.macros.exportDFwikis.transition="no";
 }
 else if (option=="1") //warning
 {
 displayMessage(info[1]);
 displayMessage(info[2]);
 document.getElementById('groupsPanel').style.display='none';
 removeSelect("groupbox");
 removeSelect("userbox");
 document.getElementById("groupbox").disabled=true;
 document.getElementById("userbox").disabled=true;
 config.macros.exportDFwikis.callNumber="0";
 config.macros.exportDFwikis.transition="no"; 
 }
 else if (option=="2") //correct
 {
 displayMessage(info[1]);
 document.getElementById('groupsPanel').style.display='none';
 removeSelect("groupbox");
 removeSelect("userbox");
 document.getElementById("groupbox").disabled=true;
 document.getElementById("userbox").disabled=true;
 config.macros.exportDFwikis.callNumber="0";
 config.macros.exportDFwikis.transition="no";
 }
 else if (option=="3") //teacher gmode=0 & smode=1 or smode=2
 {
 document.getElementById('groupsPanel').style.display='block';
 displayMessage(info[1]);
 removeSelect("userbox");
 addToSelect("choose an user...","userbox");
 document.getElementById("userbox").disabled=false;
 for (i=2;i<info.length;i++)
 {
 addToSelect(info[i],"userbox");
 }
 config.macros.exportDFwikis.callNumber="2";
 }
 else if (option=="4")// teacher gmode={1,2} and smode=0
 {
 document.getElementById('groupsPanel').style.display='block';
 displayMessage(info[1]);
 removeSelect("groupbox");
 addToSelect("choose a group...","groupbox");
 document.getElementById("groupbox").disabled=false;
 for (i=2;i<info.length;i++)
 {
 addToSelect(info[i],"groupbox");
 }
 config.macros.exportDFwikis.callNumber="2"; 
 }
 else if (option=="5")//teacher in gmode={1,2} & smode={1,2}
 {
 document.getElementById('groupsPanel').style.display='block';
 displayMessage(info[1]);
 removeSelect("groupbox");
 addToSelect("choose a group...","groupbox");
 document.getElementById("groupbox").disabled=false;
 for (i=2;i<info.length;i++)
 {
 addToSelect(info[i],"groupbox");
 }
 config.macros.exportDFwikis.callNumber="1";
 config.macros.exportDFwikis.transition="yes";
 }
 else if (option=="6")//teacher continuing gmode={1,2} & smode={1,2}
 {
 document.getElementById('groupsPanel').style.display='block';
 displayMessage(info[1]);
 removeSelect("userbox");
 addToSelect("choose an user...","userbox");
 document.getElementById("userbox").disabled=false;
 for (i=2;i<info.length;i++)
 {
 addToSelect(info[i],"userbox");
 }
 config.macros.exportDFwikis.callNumber="2";
 }
 else if (option=="7")// student gmode={1,2} and smode=0
 {
 document.getElementById('groupsPanel').style.display='block';
 displayMessage(info[1]);
 removeSelect("groupbox");
 addToSelect("choose a group...","groupbox");
 document.getElementById("groupbox").disabled=false;
 for (i=2;i<info.length;i++)
 {
 addToSelect(info[i],"groupbox");
 }
 config.macros.exportDFwikis.callNumber="2"; 
 }
 else if (option=="8")// student gmode={1,2} and smode=1
 {
 document.getElementById('groupsPanel').style.display='block';
 displayMessage(info[1]);
 removeSelect("groupbox");
 addToSelect("choose a group...","groupbox");
 document.getElementById("groupbox").disabled=false;
 for (i=2;i<info.length;i++)
 {
 addToSelect(info[i],"groupbox");
 }
 config.macros.exportDFwikis.callNumber="2"; 
 }
 else if (option=="9")//teacher in gmode={1,2} & smode=1
 {
 document.getElementById('groupsPanel').style.display='block';
 displayMessage(info[1]);
 removeSelect("groupbox");
 addToSelect("choose a group...","groupbox");
 document.getElementById("groupbox").disabled=false;
 for (i=2;i<info.length;i++)
 {
 addToSelect(info[i],"groupbox");
 }
 config.macros.exportDFwikis.callNumber="1";
 config.macros.exportDFwikis.transition="yes";
 }
 else if (option=="10")//teacher continuing gmode={1,2} & smode=2
 {
 document.getElementById('groupsPanel').style.display='block';
 displayMessage(info[1]);
 removeSelect("userbox");
 addToSelect("choose an user...","userbox");
 document.getElementById("userbox").disabled=false;
 for (i=2;i<info.length;i++)
 {
 addToSelect(info[i],"userbox");
 }
 config.macros.exportDFwikis.callNumber="2";
 }
 } 
}

function stateGetMoodleInfo() 
{
 if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete")
 { 
 if (typeof(netscape)!="undefined") { // For moz-netscape, to access to a remote http:// or file://
 try { netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");}
 catch (e) { displayMessage(e.description?e.description:e.toString()); }
 }
 var xml = xmlHttp.responseXML;
 var info =new Array(xml.getElementsByTagName('items').length);
 for (i = 0; i < xml.getElementsByTagName('items').length; i++)
 {
 var item = xml.getElementsByTagName('response')[0];
 var id = item.getElementsByTagName('items')[i].firstChild.data;
 info[i]=id;
 }
 var option=info[0];
 config.macros.exportDFwikis.info=option;
 removeSelect("exportDFwikiCourse");
 if (option=="1")
 {
 addToSelect("choose a course...","exportDFwikiCourse");
 for (i=1;i<info.length;i++)
 {
 addToSelect(info[i],"exportDFwikiCourse");
 } 
 }
 continueInfo();
 } 
}

function stateGetMoodleInfoSync() 
{
 if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete")
 { 
 if (typeof(netscape)!="undefined") { // For moz-netscape, to access to a remote http:// or file://
 try { netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");}
 catch (e) { displayMessage(e.description?e.description:e.toString()); }
 }
 var xml = xmlHttp.responseXML;
 var info =new Array(xml.getElementsByTagName('items').length);
 for (i = 0; i < xml.getElementsByTagName('items').length; i++)
 {
 var item = xml.getElementsByTagName('response')[0];
 var id = item.getElementsByTagName('items')[i].firstChild.data;
 info[i]=id;
 }
 var option=info[0];
 config.macros.exportDFwikis.info=option;
 removeSelect("exportDFwikiCourse");
 if (option=="1")
 {
 addToSelect("choose a course...","exportDFwikiCourse");
 for (i=1;i<info.length;i++)
 {
 addToSelect(info[i],"exportDFwikiCourse");
 }
 
 }
 continueInfo();
 continueSyncCourses(1);
 } 
}

function statecontinueGettingMoodleInfo() 
{
 if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete")
 { 
 if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete")
 {
 if (typeof(netscape)!="undefined") 
 { // For moz-netscape, to access to a remote http:// or file://
 try { netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");}
 catch (e) { displayMessage(e.description?e.description:e.toString()); }
 }
 var xml = xmlHttp.responseXML;
 var info =new Array(xml.getElementsByTagName('items').length);
 for (i = 0; i < xml.getElementsByTagName('items').length; i++)
 {
 var item = xml.getElementsByTagName('response')[0];
 var id = item.getElementsByTagName('items')[i].firstChild.data;
 info[i]=id;
 }
 var option=info[0];
 config.macros.exportDFwikis.info=option;
 removeSelect("exportDFwikiName");
 if (option=="1")
 {
 addToSelect("choose a course...","exportDFwikiName");
 for (i=1;i<info.length;i++)
 {
 addToSelect(info[i],"exportDFwikiName");
 }
 document.getElementById("exportDFwikiName").disabled=false; 
 } 
 }
 } 
}

function statecontinueGettingMoodleInfoSync() 
{
 if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete")
 { 
 if (typeof(netscape)!="undefined") 
 { // For moz-netscape, to access to a remote http:// or file://
 try { netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");}
 catch (e) { displayMessage(e.description?e.description:e.toString()); }
 }
 var xml = xmlHttp.responseXML;
 var info =new Array(xml.getElementsByTagName('items').length);
 for (i = 0; i < xml.getElementsByTagName('items').length; i++)
 {
 var item = xml.getElementsByTagName('response')[0];
 var id = item.getElementsByTagName('items')[i].firstChild.data;
 info[i]=id;
 }
 var option=info[0];
 config.macros.exportDFwikis.info=option;
 removeSelect("exportDFwikiName");
 if (option=="1")
 {
 addToSelect("choose a wiki...","exportDFwikiName");
 for (i=1;i<info.length;i++)
 {
 addToSelect(info[i],"exportDFwikiName");
 }
 document.getElementById("exportDFwikiName").disabled=false; 
 } 
 continueSyncWikis(1);
 } 
}
//}}}
// //===