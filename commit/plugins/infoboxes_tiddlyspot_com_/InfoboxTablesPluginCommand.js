/***
|Name|[[InfoboxTablesPluginCommand]]|
|Source|http://infoboxes.tiddlyspot.com|
|Documentation|[[InfoboxTablesPluginCommandInfo]]|
|Version|1.0.1|
|Author|Kristjan Brezovnik|
|License|[[Creative Commons Attribution-Share Alike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]]<br/>[[ELS Design Studios Legal Statements|http://www.TiddlyTools.com/#LegalStatements]]|
|~CoreVersion|2.6.1|
|Requires|[[InfoboxTablesPlugin]]|
|Type|plugin|
|Description|Provides "infobox info" command for [[InfoboxTablesPlugin]].|

!Configuration
<<option chkInfoboxInfoEditToolbar>> Add/remove ~InfoboxInfo to/from default ~EditToolbar in the default [[ToolbarCommands]] shadow tiddler; requires refresh
<<option chkInfoboxInfoViewToolbar>> Add/remove ~InfoboxInfo to/from default~ViewToolbar in the default [[ToolbarCommands]] shadow tiddler; requires refresh

/***
!Code
***/
//{{{
if(!version.extensions.InfoboxTablesPlugin) { //Check if InfoboxTablesPlugin is installed
throw "InfoboxTablesPlugin is not installed!";
}
else {
//Ensure that the plugin is only installed once
if (!version.extensions.infoboxInfo) {
version.extensions.infoboxInfo = {installed: true};
version.extensions.infoboxInfo = {major: 1, minor: 0, revision: 1, date: new Date(2013,3,27)};

//Stylesheet
var infoStylesheet = store.getTiddler("InfoboxTablesInfoboxInfoStylesheet");
if (infoStylesheet === null) {
config.shadowTiddlers.InfoboxTablesInfoboxInfoStylesheet = 
"/***\nStylesheet\n***/\n/*{{{*/\n" + 
".InfoboxInfoButton {display: inline-block; position: relative; float: left; clear: both; padding: 1px; margin: 1px; font-size: 10px; line-height: 120%; border: 1px solid black; background: [[InfoboxTablesColorPalette::InfoboxTableBackground]];}\n" + 
".InfoboxNoInfo {display: none; width: 300px !important; font-weight: bold; border: solid 2px; border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px; padding: 5px 5px;} /* No Info */\n" + 
".InfoboxInfo2, .InfoboxInfo3 {vertical-align: top; font-size: 10px; white-space: nowrap; line-height: 80%; border: 1px solid black !important; border-collapse: collapse;} /* InfoboxInfo tables */\n" + 
".InfoboxInfo2 td, .InfoboxInfo3 td, .InfoboxInfo2 th, .InfoboxInfo3 th {border: 1px solid black !important; border-collapse: collapse !important;}\n" + 
".InfoboxInfo2 th, .InfoboxInfo3 th {background: darkgrey;}\n" + 
".InfoboxInfo2 caption, .InfoboxInfo3 caption {white-space: normal; text-align: left;  line-height: 120%;} /* InfoboxInfo captions */\n" + 
".InfoboxInfo2 td:last-child {display: none;}\n" + 
"/*}}}*/\n";
store.addNotification("InfoboxTablesInfoboxInfoStylesheet", refreshStyles);
}

//Add InfoboxInfo to EditToolbar and ViewToolbar
if (config.options.chkInfoboxInfoEditToolbar === undefined) {
config.options.chkInfoboxInfoEditToolbar = false;
}
if (config.options.chkInfoboxInfoViewToolbar === undefined) {
config.options.chkInfoboxInfoViewToolbar = false;
}

if ((config.options.chkInfoboxInfoEditToolbar === true) && !config.shadowTiddlers.ToolbarCommands.match("EditToolbar\\|infoboxInfo")) {
config.shadowTiddlers.ToolbarCommands = config.shadowTiddlers.ToolbarCommands.replace(/EditToolbar\|/, "EditToolbar\|infoboxInfo ");
}
if ((config.options.chkInfoboxInfoEditToolbar === false) && config.shadowTiddlers.ToolbarCommands.match("EditToolbar\\|infoboxInfo")) {
config.shadowTiddlers.ToolbarCommands = config.shadowTiddlers.ToolbarCommands.replace(/EditToolbar\|infoboxInfo /, "EditToolbar|");
}
if ((config.options.chkInfoboxInfoViewToolbar === true) && !config.shadowTiddlers.ToolbarCommands.match("ViewToolbar\\|infoboxInfo")) {
config.shadowTiddlers.ToolbarCommands = config.shadowTiddlers.ToolbarCommands.replace(/ViewToolbar\|/, "ViewToolbar\|infoboxInfo ");
}
if ((config.options.chkInfoboxInfoViewToolbar === false) && config.shadowTiddlers.ToolbarCommands.match("ViewToolbar\\|infoboxInfo")) {
config.shadowTiddlers.ToolbarCommands = config.shadowTiddlers.ToolbarCommands.replace(/ViewToolbar\|infoboxInfo /, "ViewToolbar|");
}

//InfoboxInfo command
config.commands.infoboxInfo = {
text: "infobox info",
tooltip: "Show details for infoboxes in the current tiddler"
};

config.commands.infoboxInfo.handler = function(event,src,title) {
config.commands.infoboxInfo.showPopup(src);
};

config.commands.infoboxInfo.showPopup = function(place) { //Show the popup

var tid;
var here = story.findContainingTiddler(place);
if (here) {
tid = store.getTiddler(here.getAttribute("tiddler"));
}

var title = tid.title;

var popupCommand = Popup.create(place);
if (!popupCommand) {
return;
}
addClass(popupCommand,"sticky");

var infoboxInfoDiv = createTiddlyElement(popupCommand, "div", "InfoboxInfoDiv"+title.replace(/[\W\s]/g, ""), "InfoboxOuterDivCommand");
infoboxInfoDiv.style.padding = "5px";

if (tid !== null) { //If the tiddler is not a shadow tiddler
if (tid.isTagged("article") && tid.text.match("infobox")) { //If the tiddler is an article and contains an infobox

var getinfoboxes = store.getTaggedTiddlers("infobox"); //Get all infoboxes
var infoboxarray = "";
var i;
for (i = 0; i < getinfoboxes.length; i++) { //Put the infoboxes into array
infoboxarray += getinfoboxes[i].title.replace(/Infobox_/g, "").replace(/_/g, " ") + ",";
}
var infoboxes = infoboxarray.split(",");
var table = "";
var infoboxcount = 0;
var j;
for (j = 0; j < infoboxes.length; j++) { //Go through all infoboxes
var comms = 0;
if (tid.text.match("Type:\""+infoboxes[j]+"\"")) { //If a tiddler contains an infobox
infoboxcount = infoboxcount + 1;
var info = store.getTiddlerText("Infobox_" + infoboxes[j].replace(/ /g, "_") + "##Content");
var note = store.getTiddlerText("Infobox_" + infoboxes[j].replace(/ /g, "_") + "##Notes");
if (note === undefined) {
note = "";
}
var infosplit = info.replace(/----\n/g, "").split("\n");
var desc, param, comm;
var out = "";
var k;
for (k = 0; k < infosplit.length; k++) { //Parse the infobox
if (infosplit[k].indexOf("Section-") !== -1) {
desc = "|{{Infobox"+infoboxes[j].replace(/ /g, "")+"Title{" + infosplit[k].replace(/Section-/g, "Section: ").replace(/ \(\([\w\s]*?\)\)| \*\*[\w\W\s]*?$/g, "") + "}}}|";
param = "|";
}
else {
desc = "|" + infosplit[k].replace(/Image-/g, "Image: ").replace(/Single-/g, "Single cell: ").replace(/Side1-/g, "Left Side: ").replace(/Side2-/g, "Right Side: ").replace(/ \(\([\w\s]*?\)\)| \*\*[\w\W\s]*?$/g, "") + "|";
if (infosplit[k].indexOf("\(\(") !== -1) {
param = "<nowiki>" + infosplit[k].replace(/^[\w\W\s]*?\(\(|\)\)[\w\W\s]*?$/g, "") + "</nowiki>|";
}
else {
param = "<nowiki>" + infosplit[k].replace(/ \*\*[\w\W\s]*?$/g, "").replace(/ /g, "_") + "</nowiki>|";
}
}
if (infosplit[k].indexOf("\*\*") !== -1) {
comm = infosplit[k].replace(/[\w\W\s]*?\*\*/g, "") + "|\n";
comms = comms + 1;
}
else {
comm = "|\n";
}
out += desc + param + comm;
} //End parse the infobox

if (comms === 0) { //If there are no comments
table += "!" + infoboxes[j] + " \n|!Description|!Parameter|\n"+ out + "|" + note + "|c\n|InfoboxInfo2|k\nsplitter" + infoboxes[j] + "splitter";
}
else { //If there are comments

table += "!" + infoboxes[j] + "\n|!Description|!Parameter|!Comment|\n"+ out + "|" + note + "|c\n|InfoboxInfo3|k\nsplitter" + infoboxes[j] + "splitter";
}

} //End if a tiddler contains the infobox
} //End go through all infoboxes
var tableSplit = table.split("splitter");
tableSplit.pop();

if (infoboxcount === 1) { //If there is only one infobox type, display the content
wikify("{{SmallText{This article contains the following infobox:}}}\n" + table.replace(/splitter[\w\W\s]+?splitter/g, ""), infoboxInfoDiv);
}
else { //If there are more infobox types, show a list
wikify("{{SmallText{This article contains the following infoboxes:}}}\n",infoboxInfoDiv);
var ButtonTitleSub;
var ButtonTooltipSub;
var x;
for (x = 0; x < tableSplit.length; x = x + 2) {
ButtonTitleSub = tableSplit[x+1];
ButtonTooltipSub = tableSplit[x+1];
var infoboxInfoButtonSub = createTiddlyButton(infoboxInfoDiv, ButtonTitleSub, ButtonTooltipSub, function() {config.commands.infoboxInfo.toggleInfoboxInfo(this.nextSibling,this);}, "InfoboxInfoButton", "InfoboxInfoButton"+tableSplit[x+1].replace(/ /g, ""));
infoboxInfoButtonSub.setAttribute("closedtext",ButtonTitleSub);
infoboxInfoButtonSub.setAttribute("closedtip",ButtonTooltipSub);
infoboxInfoButtonSub.setAttribute("openedtext",ButtonTitleSub);
infoboxInfoButtonSub.setAttribute("openedtip",ButtonTooltipSub);
var infoboxInfoDivSub = createTiddlyElement(infoboxInfoDiv, "div", "InfoboxInfoDivSub"+title.replace(/[\W\s]/g, "")+tableSplit[x+1].replace(/[\W\s]/g, ""), "InfoboxInnerDivCommand");
infoboxInfoDivSub.style.display = "none";
wikify(tableSplit[x], infoboxInfoDivSub);
}
}
} //End if the tiddler is an article and contains an infobox
else {
wikify("The tiddler is not an article.", infoboxInfoDiv);
}
} //End if the tiddler is not a shadow tiddler

Popup.show();
event.cancelBubble = true;
if (event.stopPropagation) {
event.stopPropagation();
return false;
}

}; //End show the popup

//Get content panel index
config.commands.infoboxInfo.panelIndex = function(panel) {
var panelIndex = 0;
while((panel = panel.previousSibling) !== null) {
panelIndex++;
}
return panelIndex;
};
//End get content panel index

//Toggle display of infoboxInfo popup
config.commands.infoboxInfo.toggleInfoboxInfo = function(panel,button) {
var panelIndex = config.commands.infoboxInfo.panelIndex(panel);
var i;
var siblings = panel.parentNode.childNodes.length;
for(i = 0; i < siblings; i++) {
if(i !== panelIndex) {
panel.parentNode.childNodes.item(i).style.display = "none";
}
}
if (panel.style.display === "none") {
panel.style.display = "block";
button.innerHTML = button.getAttribute("openedtext");
button.setAttribute("title",button.getAttribute("openedtip"));
if (window.adjustPopupPosition && panel.parentNode.parentNode.id === "popup") {
window.adjustPopupPosition(panel.parentNode.parentNode,button,panel);
}
} else {
panel.style.display = "none";
button.innerHTML = button.getAttribute("closedtext");
button.setAttribute("title",button.getAttribute("closedtip"));
//if (window.adjustPopupPosition && panel.parentNode.parentNode.id === "popup") {
//window.adjustPopupPosition(panel.parentNode.parentNode,button,panel);
//}
}
};
//End toggle display of infoboxInfo popup

//Modified from StickyPopupPlugin (http://www.TiddlyTools.com/#StickyPopupPlugin)
//ELS Design Studios Legal Statements (http://www.TiddlyTools.com/#LegalStatements) apply
//This was added to avoid having to install the StickyPopupPlugin
Popup.stickyPopupCommand = function(event) {
var e = event ? event : window.event;
var target = resolveTarget(e);
var pop = target;
while (pop) { //If in a sticky popup
if (hasClass(pop,"popup") && hasClass(pop,"sticky")) {
break;
}
else {
pop = pop.parentNode;
}
}
if (!pop) { //If not in sticky popup
Popup.onDocumentClick(event);
return true;
}
};
try {
removeEvent(document,"click",Popup.onDocumentClick);
}
catch(e) {}
try {
addEvent(document,"click",Popup.stickyPopupCommand);
}
catch(e) {}
//End modified from StickyPopupPlugin (http://www.TiddlyTools.com/#StickyPopupPlugin)

//Adjust the popup position for when there is more than one infobox type
if (window.adjustPopupPosition === undefined) {
window.adjustPopupPosition = function (place,button,panel) {
if (hasClass(panel, "InfoboxInnerDivCommand")) {
var rightEdge = document.body.offsetWidth - 1;
var panelWidth = place.offsetWidth;
//var left = 1442;
var left = 0;
if (findPosX(place) + panelWidth > rightEdge) {
left = rightEdge - panelWidth;
}
place.style.left = left + "px";
}
};
}
//End adjust the popup position for when there is more than one infobox type

} //End of install only once
}
//}}}