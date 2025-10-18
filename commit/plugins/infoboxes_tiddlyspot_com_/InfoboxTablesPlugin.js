/***
|Name|[[InfoboxTablesPlugin]]|
|Source|http://infoboxes.tiddlyspot.com|
|Documentation|[[InfoboxTablesPluginInfo]]|
|Version|2.2.2|
|Author|Kristjan Brezovnik|
|License|[[Creative Commons Attribution-Share Alike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]]|
|~CoreVersion|2.6.3|
|Requires||
|Type|plugin|
|Description|Provides customizable infoboxes for different types of articles.|

!Configuration
<<option chkHideInfoboxes>> Hide the infoboxes when opening a tiddler
<<option chkSaveMode>> When editing the table, save the macro so each parameter is in its own line (default) or so that the entire macro is a single line
<<option chkSavePrompt>> Prompt if you really want to save

!Code
***/
//{{{
//Ensure that the plugin is only installed once
if (!version.extensions.InfoboxTablesPlugin) {
version.extensions.InfoboxTablesPlugin = {installed: true};
version.extensions.InfoboxTablesPlugin = {major: 2, minor: 2, revision: 1, date: new Date(2013,4,22)};
//}}}

/***
!!Generic Color Palette
***/
//{{{
var palette = store.getTiddler("InfoboxTablesColorPalette");
if (palette === null) {
config.shadowTiddlers.InfoboxTablesColorPalette = 
"/***\nGeneric Color Palette\n***/\n/*{{{*/\n" + 
"InfoboxTableBackground: whitesmoke\n" + 
"InfoboxTableTopColor: whitesmoke\n" + 
"InfoboxTypeError: red\n" + 
"/*}}}*/\n/***\nTemplate-Specific Color Palette\n***/\n/*{{{*/\n";
}
//}}}

/***
!!Generic Stylesheet
***/
//{{{
var stylesheet = store.getTiddler("InfoboxTablesStylesheet");
if (stylesheet === null) {
config.shadowTiddlers.InfoboxTablesStylesheet = 
"/***\nGeneric Stylesheet\n***/\n/*{{{*/\n" + 
".InfoboxTable {width: 300px !important; margin: 0px 1px !important; border-collapse: separate !important; border: none 0px !important; border-spacing: 0px !important;}\n" + 
".InfoboxTableHeader, .InfoboxTableFooter {width: 300px !important; font-size: 10px; font-weight: bold; background: [[InfoboxTablesColorPalette::InfoboxTableBackground]];}\n" + 
".InfoboxTableHeader {border-radius: 10px 10px 0px 0px; -moz-border-radius: 10px 10px 0px 0px; -webkit-border-radius: 10px 10px 0px 0px;} /* Header table */\n" + 
".InfoboxTableFooter {border-radius: 0px 0px 10px 10px; -moz-border-radius: 0px 0px 10px 10px; -webkit-border-radius: 0px 0px 10px 10px;} /* Footer table */\n" + 
".InfoboxTableTop, .InfoboxTableBottom {width: 300px !important; border: none 0px; text-align: center; font-size: 16px; line-height: 120%;}\n" + 
".InfoboxTableTop {font-size: 14px; line-height: 120%; border-radius: 10px 10px 0px 0px; -moz-border-radius: 10px 10px 0px 0px; -webkit-border-radius: 10px 10px 0px 0px;} /* Header row */\n" + 
".InfoboxTableBottom {line-height: 80%; border-radius: 0px 0px 10px 10px; -moz-border-radius: 0px 0px 10px 10px; -webkit-border-radius: 0px 0px 10px 10px;} /* Footer row */\n" + 
".InfoboxSection {width: 300px !important; border: none 0px; font-weight: bold;} /* Section header row */\n" + 
".InfoboxRow {display: table-row;} /* Content row */\n" + 
".InfoboxCellLeft, .InfoboxCellRight, .InfoboxCellEqual, .InfoboxCellImage {border: 1px solid; vertical-align: top !important; background: [[InfoboxTablesColorPalette::InfoboxTableBackground]]; word-wrap: break-word !important; word-break: hyphenate !important;}\n" + 
".InfoboxCellLeft {width: 100px !important; max-width: 90px !important;}\n" + 
".InfoboxCellRight {width: 200px !important; max-width: 190px !important;}\n" + 
".InfoboxCellEqual {width: 150px !important; max-width: 140px !important;}\n" + 
".InfoboxCellImage, .InfoboxCellSingle {width: 300px !important;}\n" + 
".InfoboxCellImage {text-align: center;}\n" + 
".InfoboxCellSingle {text-align: left;}\n" + 
"img.InfoboxImage {max-width: 290px !important;} /* Image max width must be less than cell width */\n" + 
".InfoboxOuterDiv, .InfoboxInnerDiv {display: block; position: relative; float: right; clear: both;}\n" + 
".SmallButton {display: inline; position: relative; float: right;}\n" + 
".InfoboxOuterDiv {z-index: 10; padding: 0.5em; margin: 0px;}\n" + 
".InfoboxOuterDivCommand, .InfoboxInnerDivCommand {display: inline-block; position: relative; clear: both;}\n" + 
".SmallButton {border: 1px solid black!important; background: [[InfoboxTablesColorPalette::InfoboxTableBackground]]!important; padding: 1px; margin: 1px;}\n" + 
".SmallButton, .SmallText,.InfoboxCellLeft, .InfoboxCellRight, .InfoboxCellEqual, .InfoboxCellImage, .InfoboxSection {font-size: 10px; line-height: 120%;}\n" + 
".InfoboxNoInfo {display: none; width: 300px !important; font-weight: bold; border: solid 2px; border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px; padding: 5px 5px;} /* No Info */\n" + 
".InfoboxError {width: 300px !important; font-weight: bold; border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px; padding: 5px 5px; float: right;} /* Error */\n" + 
".InfoboxTypeError {width: 300px; background: [[InfoboxTablesColorPalette::InfoboxTypeError]]; font-weight: bold; border: solid 5px; border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px; padding: 5px 5px; float: right;} /* Type Error */\n" + 
".TypeErrorEditMode {background: [[InfoboxTablesColorPalette::InfoboxTypeError]];}\n" + 
".InfoboxEditTextarea {height: 20px; width: 99% !important; border: 1px solid black !important; padding: 0px !important; margin: 0px !important; overflow: auto; overflow-y: scroll !important; resize: vertical !important;} /* Textarea on the edit panel*/\n" + 
".InfoboxEditTextareaOnfocus {height: 200px; width: 97% !important;}\n" + 
".InfoboxEditTextareaOnblur {height: 16px; width: 97% !important;}\n" + 
".EqualEditParamName {display: none;}\n" + 
".EditComment {display: none;}\n" + 
"/*}}}*/\n/***\nTemplate-Specific Stylesheet\n***/\n/*{{{*/\n";
store.addNotification("InfoboxTablesStylesheet", refreshStyles);
}
//}}}

/***
!!Template-Specific Color Palette, Stylesheet
***/
//{{{
var list = store.getTaggedTiddlers("infobox");
var listTitle, listColors, listColorsText, listColorsTitle, listColorsSubtitle, paramListInfo, paramListInfoParsed;
var i, j;
var validTypes = "";
for (i = 0; i < list.length; i++) {
listTitle = list[i].title.replace(/Infobox|_| /g, "");
validTypes += list[i].title.replace(/Infobox_/, "").replace(/_/g, " ") + ", ";
listColorsText = store.getTiddlerText(list[i].title + "::Text");
listColorsTitle = store.getTiddlerText(list[i].title + "::Title");
listColorsSubtitle = store.getTiddlerText(list[i].title + "::Subtitle");
if (listColorsText === null) {
listColorsText = "black";
}
if (listColorsTitle === null) {
listColorsTitle = "white";
}
if (listColorsSubtitle === null) {
listColorsSubtitle = "white";
}
//Color Palette
if (palette === null) {
config.shadowTiddlers.InfoboxTablesColorPalette += 
"Infobox" + listTitle + "Text: " + listColorsText + "\n" + 
"Infobox" + listTitle + "Title: " + listColorsTitle + "\n" + 
"Infobox" + listTitle + "Subtitle: " + listColorsSubtitle + "\n";
}
//Stylesheet
if (stylesheet === null) {
config.shadowTiddlers.InfoboxTablesStylesheet += 
".Infobox" + listTitle + "Title {background: [[InfoboxTablesColorPalette::Infobox" + listTitle + "Title]]; color: [[InfoboxTablesColorPalette::Infobox" + listTitle + "Text]];}\n" + 
".Infobox" + listTitle + "Subtitle {background: [[InfoboxTablesColorPalette::Infobox" + listTitle + "Subtitle]]; color: [[InfoboxTablesColorPalette::Infobox" + listTitle + "Text]];}\n" + 
".NoInfo" + listTitle + " {background: [[InfoboxTablesColorPalette::Infobox" + listTitle + "Title]]; color: [[InfoboxTablesColorPalette::Infobox" + listTitle + "Text]];}\n" + 
".Infobox" + listTitle + "Error {background: [[InfoboxTablesColorPalette::InfoboxTypeError]]; color: [[InfoboxTablesColorPalette::Infobox" + listTitle + "Text]]; border: solid 5px [[InfoboxTablesColorPalette::Infobox" + listTitle + "Title]];}\n";
store.addNotification("InfoboxTablesStylesheet", refreshStyles);
}
}
if (palette === null) {
config.shadowTiddlers.InfoboxTablesColorPalette += "/*}}}*/\n";
}
if (stylesheet === null) {
config.shadowTiddlers.InfoboxTablesStylesheet += "/*}}}*/\n";
}
//}}}

/***
!!Infobox Macro
***/
//{{{
config.macros.infobox = {};
config.macros.infobox.handler = function (place,macroName,params,wikifier,paramString,tiddler) {

params = paramString.parseParams(null, null, true);

var Type = getParam(params, 'Type', 'unknown');
var Title = getParam(params, 'Title', tiddler.title);
var InstanceID = getParam(params, 'InstanceID', 'DefaultID');
var TypeX = Type.replace(/[\s]/g, "");
var TitleX = Title.replace(/[\W\s]/g, "");
var InstanceIDX = InstanceID.replace(/[\W\s]/g, "");
var TTIX = TypeX + TitleX + InstanceIDX;

//Decide if the infoboxes should be displayed by default or not
if (config.options.chkHideInfoboxes === undefined) {
config.options.chkHideInfoboxes = false;
}
if (config.options.chkSaveMode === undefined) {
config.options.chkSaveMode = true;
}
if (config.options.chkSavePrompt === undefined) {
config.options.chkSavePrompt = true;
}

var noEdit = "false";

//Create the outer container
var infoboxDiv = createTiddlyElement(place, "div", "InfoboxOuterDiv"+TTIX, "InfoboxOuterDiv");

var saveButton, editButton, deleteButton, toggleButton, infoboxTableDiv, infoboxTableEditDiv;

//Set initial values for the toggle button
var closedtext = "show";
var closedtip = "show";
var openedtext = "hide";
var openedtip = "hide";
var toggleButtonTitle, toggleButtonTooltip;
var hideInfoboxes = config.options.chkHideInfoboxes;
if (hideInfoboxes === true) {
toggleButtonTitle = (hideInfoboxes === true ? closedtext : openedtext);
toggleButtonTooltip = (hideInfoboxes === true ? closedtip : openedtip);
}
else {
toggleButtonTitle = (hideInfoboxes === false ? openedtext : closedtext);
toggleButtonTooltip = (hideInfoboxes === false ? openedtip : closedtip);
}

//Create the toggle button
toggleButton = createTiddlyButton(infoboxDiv, toggleButtonTitle, toggleButtonTooltip, function() {config.macros.infobox.toggleInfobox(editButton,toggleButton,infoboxTableDiv);}, "SmallButton", "SmallButton"+TTIX);
toggleButton.style.display = "block";
toggleButton.setAttribute("closedtext",closedtext);
toggleButton.setAttribute("closedtip",closedtip);
toggleButton.setAttribute("openedtext",openedtext);
toggleButton.setAttribute("openedtip",openedtip);

//Create the delete button
deleteButton = createTiddlyButton(infoboxDiv, "delete", "delete infobox", function() {config.macros.infobox.deleteInfobox(Type,Title,InstanceID);}, "SmallButton", "SmallButtonSave"+TTIX);
deleteButton.style.display = "none";

//Set initial values for the edit/cancel button
var edittext = "edit";
var edittip = "edit infobox";
var canceltext = "cancel";
var canceltip = "cancel edit";

//Create the edit/cancel button
editButton = createTiddlyButton(infoboxDiv, "edit", "edit infobox", function() {config.macros.infobox.editInfobox(saveButton,editButton,deleteButton,toggleButton,infoboxTableDiv,infoboxTableEditDiv,Title,noEdit);}, "SmallButton", "SmallButtonEdit"+TTIX);
if (hideInfoboxes === true) {
editButton.style.display = "none";
}
else {
editButton.style.display = "block";
}
editButton.setAttribute("edittext",edittext);
editButton.setAttribute("edittip",edittip);
editButton.setAttribute("canceltext",canceltext);
editButton.setAttribute("canceltip",canceltip);

//Create the save button
saveButton = createTiddlyButton(infoboxDiv, "save", "save infobox", function() {config.macros.infobox.saveInfobox(saveButton,editButton,deleteButton,toggleButton,infoboxTableDiv,infoboxTableEditDiv,Type,Title,InstanceID);}, "SmallButton", "SmallButtonSave"+TTIX);
saveButton.style.display = "none";

//Create the container for the table
infoboxTableDiv = createTiddlyElement(infoboxDiv, "div", "InfoboxInnerDiv"+TTIX, "InfoboxInnerDiv");
if (hideInfoboxes === true) {
infoboxTableDiv.style.display = "none";
}
else {
infoboxTableDiv.style.display = "block";
}

//Create container for the edit table
infoboxTableEditDiv = createTiddlyElement(infoboxDiv, "div", "InfoboxEditInnerDiv"+TTIX, "InfoboxInnerDiv");
infoboxTableEditDiv.style.display = "none";

//Cancel edit by pressing escape
infoboxDiv.onkeyup = function(e) {
if (e.keyCode === 27) {
config.macros.infobox.editInfobox(saveButton,editButton,deleteButton,toggleButton,infoboxTableDiv,infoboxTableEditDiv,Title,noEdit);
}
};

//Output for beginning of table
var start = "<html><div id=\"DivContainer" + TTIX + "\"><table id=\"Header" + TTIX + "\" class=\"InfoboxTable InfoboxTableHeader\"><tr id=\"Title" + TTIX + "\"><td class=\"InfoboxTableTop Infobox" + TypeX + "Title\" colspan=\"2\">" + Title + "</td></tr>";
//Output for content of table
var out = "";
//Output for end of table
var end = "</table><table id=\"Footer" + TTIX + "\" class=\"InfoboxTable InfoboxTableFooter\"><tr id=\"Info" + TTIX + "\"><td class=\"InfoboxTableBottom Infobox" + TypeX + "Title\" colspan=\"2\">&nbsp;</td></tr></table></div><div id=\"NoInfo" + TTIX + "\" class=\"InfoboxNoInfo NoInfo" + TypeX + "\">No information available.</div></html>{{SmallButton{[[View template|Infobox_" + Type.replace(/ /g, "_") + "]]}}}";

//Output for beginning of edit table
var startEdit = "<html><div id=\"EditDivContainer" + TTIX + "\"><table id=\"EditHeader" + TTIX + "\" class=\"InfoboxTable\"><tr><td class=\"InfoboxSection Infobox" + TypeX + "Subtitle\" colspan=\"2\">Infobox Head</td></tr><tr id=\"EditType" + TTIX + "\"><td class=\"InfoboxCellLeft\">Type</td><td class=\"InfoboxCellRight\">" + Type + "</td></tr><tr id=\"EditTitle" + TTIX + "\"><td class=\"InfoboxCellLeft\">Title</td><td class=\"InfoboxCellRight\"><textarea id=\"EditTextareaTitle" + TTIX + "\" class=\"InfoboxEditTextarea\" onfocus=\"this.className = 'InfoboxEditTextareaOnfocus';\" onblur=\"this.className = 'InfoboxEditTextareaOnblur'; this.defaultValue = this.value;\">" + Title + "</textarea></td></tr><tr id=\"EditInstanceID" + TTIX + "\"><td class=\"InfoboxCellLeft\">Instance ID</td><td class=\"InfoboxCellRight\"><textarea id=\"EditTextareaInstanceID" + TTIX + "\" class=\"InfoboxEditTextarea\" onfocus=\"this.className = 'InfoboxEditTextareaOnfocus';\" onblur=\"this.className = 'InfoboxEditTextareaOnblur'; this.defaultValue = this.value;\">" + InstanceID + "</textarea></td></tr><tr><td class=\"InfoboxSection Infobox" + TypeX + "Subtitle\" colspan=\"2\">Infobox Content</td></tr>";
//Output for content of edit table
var outEdit = "";
//Output for end of edit table
var endEdit = "</table></div></html>";

//If Type is missing
if (Type === "unknown" || Type === null || Type.length === 0) {
wikify("{{InfoboxTypeError{\nType is mandatory! Allowed types are: " + validTypes.replace(/, $/, "") + "\nEdit mode is not available.}}}", infoboxTableDiv);
noEdit = "true";
return;
}
//If Type is wrong
else if (validTypes.indexOf(Type) === -1) {
wikify("{{InfoboxTypeError{\nYou entered a non-existent type! Allowed types are: " + validTypes.replace(/, $/, "") + "\nEdit mode is not available.}}}", infoboxTableDiv);
noEdit = "true";
return;
}
//If Type is okay
else if (validTypes.indexOf(Type) !== -1) {

//Check how many instances of the same type there are in a tiddler
var instanceCheck = store.getTiddlerText(tiddler.title);
var instanceInfobox = instanceCheck.match(/<<infobox/g); //Find all instances of the macro in the tiddler
if (instanceInfobox.length > 1) { //If there is more than one instance
var instanceInfoboxType = instanceCheck.match(/<<infobox[\w\W\s]*?Type:"[\w\s]*?"[\w\W\s]*?>>/g); //Get all infoboxes
var instanceInfoboxTypeResultEmpty = [];
var instanceInfoboxTypeResult = [];
var l;
for (l = 0; l < instanceInfoboxType.length; l++) {
if ((instanceInfoboxType[l].match("Type:\"" + Type + "\"") !== -1) && (InstanceID === "DefaultID" || InstanceID === null || InstanceID.length === 0) && (instanceInfoboxType[l].indexOf("\""+Type+"\"") !== -1)) { //If the infobox matches the type and does not have an InstanceID parameter, put it into array
instanceInfoboxTypeResultEmpty.push(instanceInfoboxType[l]);
}
if ((instanceInfoboxType[l].match("Type:\"" + Type + "\"") !== -1) && !(InstanceID === "DefaultID" || InstanceID === null || InstanceID.length === 0) && (instanceInfoboxType[l].indexOf("\""+Type+"\"") !== -1)) { //If the infobox matches the type and has an InstanceID parameter, put it into array
instanceInfoboxTypeResult.push(instanceInfoboxType[l]);
}
}

if (instanceInfoboxTypeResultEmpty.length > 1) { //If there is more than one infobox without the InstanceID parameter
var instanceIDCount = 0;
var m;
for (m = 0; m < instanceInfoboxTypeResultEmpty.length; m++) { //Count the number or missing InstanceID parameters
if (instanceInfoboxTypeResultEmpty[m].match(/InstanceID:"[\w\s]*?"/g) !== null) {
instanceIDCount = instanceIDCount + 1;
}
}

if (instanceInfoboxType.length > instanceIDCount) { //If there are more infoboxes than InstanceID parameters per type
if (InstanceID === "DefaultID" || InstanceID === null || InstanceID.length === 0) { //Display error message for all infoboxes without an InstanceID parameter
wikify("{{InfoboxError Infobox" + TypeX + "Error{\nThere are ''" + instanceInfoboxTypeResultEmpty.length + "'' infoboxes of ''\"" + Type + "\"'' type, but ''" + instanceIDCount + "'' ~IDs. This infobox does not have an ''~InstanceID'' parameter.<br/>When using more than one infobox of the same type, you need to add ''~InstanceID'' parameter to all of them. This parameter can be a random ''alphanumeric'' string and must be different for each infobox of the same type.\nEdit mode is not available.}}}", infoboxTableDiv);
noEdit = "true";
return;
}
}
} //End missing instanceID check

//Check for duplicate InstanceID parameters for a type
var instanceIDs = [];
var instanceIDMatch;
var n;
if (instanceInfoboxTypeResult.length > 1) { //If there is more than one infobox with the InstanceID parameter
for (n = 0; n < instanceInfoboxTypeResult.length; n++) { //Count the number or InstanceID parameters
if ((instanceInfoboxTypeResult[n].match(/InstanceID:"[\w\s]*?"/g) !== null) && !(InstanceID === "DefaultID" || InstanceID === null || InstanceID.length === 0)) {
instanceIDMatch = instanceInfoboxTypeResult[n].match(/InstanceID:"[\w\s]*?"/g);
instanceIDs.push(instanceIDMatch);
}
}
var instanceIDsSorted = instanceIDs.sort();
var duplicateIDs = [];
var o;
for (o = 0; o < instanceIDsSorted.length - 1; o++) { //Find the duplicates
if (instanceIDsSorted[o].toString() === instanceIDsSorted[o+1].toString()) {
duplicateIDs.push(instanceIDsSorted[o]);
}
}
if (duplicateIDs.length > 0) {
wikify("{{InfoboxError Infobox" + TypeX + "Error{\nThis infobox has the same ''~InstanceID'' parameter (''\"" + InstanceID + "\"'') as another infobox of the same type (''\"" + Type + "\"'').<br/>Infoboxes of the same type must have ''unique ~IDs''.\nEdit mode is not available.}}}", infoboxTableDiv);
noEdit = "true";
return;
}
} //End duplicate check
} //End of checks when there's more than one instance

//Begin parsing parameters for output
noEdit = "false";
var paramList = store.getTiddlerText("Infobox_"+ Type.replace(/[\s]/g, "_") + "##Content");
var paramListParsed = paramList.replace(/----\n/g, "").replace(/ /g, "_").split("\n"); //Get parameters
var paramCount = 0;
var param;
var k;
for (k = 0; k < paramListParsed.length; k++) {
if (paramListParsed[k].indexOf("((") !== -1) { //Params when there is a shorthand definition
param = getParam(params, paramListParsed[k].replace(/^[\W\w\s]*?\(\(|\)\)[\W\w\s]*?$/g, ""), 'unknown');
}
else { //Params when there is no shorthand definition
param = getParam(params, paramListParsed[k].replace(/_\*\*[\W\w\s]*?$/g, ""), 'unknown');
}

//Output for section titles
if (paramListParsed[k].indexOf("Section-") !== -1) {
out += "</table><table id=\"SectionTable" + TTIX + paramListParsed[k].replace(/Section-|_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"InfoboxTable\"><tr id=\"SectionHeader" + TTIX + paramListParsed[k].replace(/Section-|_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\"><td class=\"InfoboxSection Infobox" + TypeX + "Subtitle\" colspan=\"2\">" + paramListParsed[k].replace(/Section-|_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "").replace(/_/g, " ") + "</td></tr>";
outEdit += "</table><table id=\"EditSectionTable" + TTIX + paramListParsed[k].replace(/Section-|_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"InfoboxTable\"><tr id=\"EditSectionHeader" + TTIX + paramListParsed[k].replace(/Section-|_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\"><td class=\"InfoboxSection Infobox" + TypeX + "Subtitle\" colspan=\"2\">" + paramListParsed[k].replace(/Section-|_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "").replace(/_/g, " ") + "</td></tr>";
}
//Output for images
else if (paramListParsed[k].indexOf("Image-") !== -1) {
out += "<tr id=\"" + TTIX + paramListParsed[k].replace(/Image-|_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"InfoboxRow\"><td class=\"InfoboxCellImage\" colspan=\"2\"><a href=\"" + param + "\"><img src=\"" + param + "\" alt=\"" + param + "\" title=\"" + param + "\" class=\"InfoboxImage\"/></a></td></tr>";
outEdit += "<tr id=\"Edit" + TTIX + paramListParsed[k].replace(/Image-|_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"InfoboxRow\"><td class=\"InfoboxCellLeft\">Image: " + paramListParsed[k].replace(/_/g, " ").replace(/Image-| \(\([\w\s]*?\)\)| \*\*[\w\W\s]*?$/g, "") + "</td><td class=\"InfoboxCellRight\"><span id=\"EditComment" + TTIX + paramListParsed[k].replace(/Image-|_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"EditComment\">" + paramListParsed[k].replace(/Image-[\w\W\s]*?\*\*/g, "").replace(/_/g, " ").replace(/Image-[\w\W\s]*?$/g, "No comment available.") + "</span><textarea id=\"EditTextarea" + TTIX + paramListParsed[k].replace(/Image-|_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"InfoboxEditTextarea\" onfocus=\"this.className = 'InfoboxEditTextareaOnfocus'; this.previousSibling.style.display = 'block';\" onblur=\"this.className = 'InfoboxEditTextareaOnblur'; this.defaultValue = this.value; this.previousSibling.style.display = 'none';\">" + param + "</textarea></td></tr>";
}
//Output for single cells
else if (paramListParsed[k].indexOf("Single-") !== -1) {
out += "<tr id=\"" + TTIX + paramListParsed[k].replace(/Single-|_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"InfoboxRow\"><td class=\"InfoboxCellSingle\" colspan=\"2\">" + param + "</td></tr>";
outEdit += "<tr id=\"Edit" + TTIX + paramListParsed[k].replace(/Single-|_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"InfoboxRow\"><td class=\"InfoboxCellLeft\">Single: " + paramListParsed[k].replace(/_/g, " ").replace(/Single-| \(\([\w\s]*?\)\)| \*\*[\w\W\s]*?$/g, "") + "</td><td class=\"InfoboxCellRight\"><span id=\"EditComment" + TTIX + paramListParsed[k].replace(/Single-|_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"EditComment\">" + paramListParsed[k].replace(/Single-[\w\W\s]*?\*\*/g, "").replace(/_/g, " ").replace(/Single-[\w\W\s]*?$/g, "No comment available.") + "</span><textarea id=\"EditTextarea" + TTIX + paramListParsed[k].replace(/Single-|_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"InfoboxEditTextarea\" onfocus=\"this.className = 'InfoboxEditTextareaOnfocus'; this.previousSibling.style.display = 'block';\" onblur=\"this.className = 'InfoboxEditTextareaOnblur'; this.defaultValue = this.value; this.previousSibling.style.display = 'none';\">" + param + "</textarea></td></tr>";
}
//Start output if using sides (left cell)
else if (paramListParsed[k].indexOf("Side1-") !== -1) {
out += "<tr id=\"Content" + TTIX + paramListParsed[k-1].replace(/Section-|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"InfoboxRow\"><td class=\"InfoboxCellEqual\">" + param + "</td>";
outEdit += "<tr id=\"EditContent" + TTIX + paramListParsed[k-1].replace(/Section-|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"InfoboxRow\"><td class=\"InfoboxCellEqual\"><span id=\"EqualEditParam" + TTIX + paramListParsed[k].replace(/_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"EqualEditParamName\">" + paramListParsed[k].replace(/_/g, " ").replace(/ \(\([\w\s]*?\)\)| \*\*[\w\W\s]*?$/g, "") + "</span><span id=\"EditComment" + TTIX + paramListParsed[k].replace(/Side1-|_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"EditComment\">" + paramListParsed[k].replace(/Side1-[\w\W\s]*?\*\*/g, "").replace(/_/g, " ").replace(/Side1-[\w\W\s]*?$/g, "No comment available.") + "</span><textarea id=\"EditTextarea" + TTIX + paramListParsed[k].replace(/_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"InfoboxEditTextarea\" onfocus=\"this.className = 'InfoboxEditTextareaOnfocus'; this.previousSibling.style.display = 'block';\" onblur=\"this.className = 'InfoboxEditTextareaOnblur'; this.defaultValue = this.value; this.previousSibling.style.display = 'none';\">" + param + "</textarea></td>";
}
//End output if using sides (right cell)
else if (paramListParsed[k].indexOf("Side2-") !== -1) {
out += "<td class=\"InfoboxCellEqual\">" + param + "</td></tr>";
outEdit += "<td class=\"InfoboxCellEqual\"><span id=\"EqualEditParam" + TTIX + paramListParsed[k].replace(/_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"EqualEditParamName\">" + paramListParsed[k].replace(/_/g, " ").replace(/ \(\([\w\s]*?\)\)| \*\*[\w\W\s]*?$/g, "") + "</span><span id=\"EditComment" + TTIX + paramListParsed[k].replace(/Side2-|_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"EditComment\">" + paramListParsed[k].replace(/Side2-[\w\W\s]*?\*\*/g, "").replace(/_/g, " ").replace(/Side2-[\w\W\s]*?$/g, "No comment available.") + "</span><textarea id=\"EditTextarea" + TTIX + paramListParsed[k].replace(/_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"InfoboxEditTextarea\" onfocus=\"this.className = 'InfoboxEditTextareaOnfocus'; this.previousSibling.style.display = 'block';\" onblur=\"this.className = 'InfoboxEditTextareaOnblur'; this.defaultValue = this.value; this.previousSibling.style.display = 'none';\">" + param + "</textarea></td></tr>";
}
//Normal output
else {
out += "<tr id=\"" + TTIX + paramListParsed[k].replace(/_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"InfoboxRow\"><td class=\"InfoboxCellLeft\">" + paramListParsed[k].replace(/_/g, " ").replace(/ \(\([\w\s]*?\)\)| \*\*[\w\W\s]*?$/g, "") + "</td><td class=\"InfoboxCellRight\">" + param + "</td></tr>";
outEdit += "<tr id=\"Edit" + TTIX + paramListParsed[k].replace(/_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"InfoboxRow\"><td class=\"InfoboxCellLeft\">" + paramListParsed[k].replace(/_/g, " ").replace(/ \(\([\w\s]*?\)\)| \*\*[\w\W\s]*?$/g, "") + "</td><td class=\"InfoboxCellRight\"><span id=\"EditComment" + TTIX + paramListParsed[k].replace(/_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"EditComment\">" + paramListParsed[k].replace(/^/, "dummy").replace(/dummy[\w\W\s]*?\*\*/g, "").replace(/_/g, " ").replace(/dummy[\w\W\s]*?$/g, "No comment available.") + "</span><textarea id=\"EditTextarea" + TTIX + paramListParsed[k].replace(/_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + "\" class=\"InfoboxEditTextarea\" onfocus=\"this.className = 'InfoboxEditTextareaOnfocus'; this.previousSibling.style.display = 'block';\" onblur=\"this.className = 'InfoboxEditTextareaOnblur'; this.defaultValue = this.value; this.previousSibling.style.display = 'none';\">" + param + "</textarea></td></tr>";
}

//Hide lines with no information
if ((param === "unknown") && (paramListParsed[k].indexOf("Section-") === -1)) {
setStylesheet("#" + TTIX + paramListParsed[k].replace(/Image-|Single-|_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + " {display: none !important;}", "InfoboxContentRows" + TTIX + paramListParsed[k].replace(/Image-|Single-|\(\([\w\s]*?\)\)|\*\*[\w\W\s]*?$| /g, ""));
} else {
setStylesheet("#" + TTIX + paramListParsed[k].replace(/Image-|Single-|_\(\([\w\s]*?\)\)|_\*\*[\w\W\s]*?$/g, "") + " {display: table-row;}", "InfoboxContentRows" + TTIX + paramListParsed[k].replace(/Image-|Single-|\(\([\w\s]*?\)\)|\*\*[\w\W\s]*?| /g, ""));
}

//Hide the whole table if all parameters are unknown
if (param === "unknown") { //First count how many params are unknown
paramCount = paramCount + 1;
}
if (paramCount === paramListParsed.length) { //If all params are unknown
setStylesheet("#DivContainer" + TTIX + " {display: none;}", "InfoboxTable" + TTIX);
setStylesheet("#NoInfo" + TTIX + " {display: block;}", "NoInfo" + TTIX);
} else {
setStylesheet("#DivContainer" + TTIX + " {display: block;}", "InfoboxTable" + TTIX);
setStylesheet("#NoInfo" + TTIX + " {display: none;}", "NoInfo" + TTIX);
}
} //End parsing of parameters for output

//Hide section title if all params in the section are unknown (requires extra parsing of parameters by sections)
var section = paramList.replace(/Section-[\w\W\s]*?/g, "").replace(/ /g, "_").split("\n----\n"); //Get sections
var sectionParsed, sectionParams;
var sectionParamCount = 0;
var p, q;
if (section.length > 1) {
for (p = 0; p < section.length; p++) {
sectionParsed = section[p].split("\n"); //Split sections into parameters
for (q = 0; q < sectionParsed.length; q++) { //Parse the parameters
if (sectionParsed[q].indexOf("((") !== -1) { //Params when there is a shorthand definition
sectionParams = getParam(params, sectionParsed[q].replace(/^[\W\w\s]*?\(\(|\)\)[\W\w\s]*?$/g, ""), 'unknown');
}
else { //Params when there is no shorthand definition
sectionParams = getParam(params, sectionParsed[q].replace(/_\*\*[\W\w\s]*?$/g, ""), 'unknown');
}
if (sectionParams === "unknown") { //Count how many parameters in the section are unknown
sectionParamCount = sectionParamCount + 1;
}
}

if (sectionParamCount === sectionParsed.length) {
setStylesheet("#SectionTable" + TTIX + sectionParsed[0].replace(/Section-|_\*\*[\w\W\s]*?$/g, "") + " {display: none;}", "InfoboxSection" + TTIX + sectionParsed[0].replace(/Section-|_\*\*[\w\W\s]*?$/g, ""));
} else {
setStylesheet("#SectionTable" + TTIX + sectionParsed[0].replace(/Section-|_\*\*[\w\W\s]*?$/g, "") + " {display: block;}", "InfoboxSection" + TTIX + sectionParsed[0].replace(/Section-|_\*\*[\w\W\s]*?$/g, ""));
}
sectionParamCount = 0; //Reset the count for the next section
}
}

//Final output
wikify(start + out + end, infoboxTableDiv);
wikify(startEdit + outEdit + endEdit, infoboxTableEditDiv);
} //End if Type is okay

}; //End of Infobox macro

//Toggle display of infoboxes
config.macros.infobox.toggleInfobox = function(editButton,toggleButton,place) {
var hideInfoboxes = config.options.chkHideInfoboxes;
if (hideInfoboxes === true) {
if (place.style.display === "block"){
place.style.display = "none";
editButton.style.display = "none";
toggleButton.innerHTML = toggleButton.getAttribute("closedtext");
toggleButton.setAttribute("title",toggleButton.getAttribute("closedtip"));
} else {
place.style.display = "block";
editButton.style.display = "block";
toggleButton.innerHTML = toggleButton.getAttribute("openedtext");
toggleButton.setAttribute("title",toggleButton.getAttribute("openedtip"));
}
} else {
if (place.style.display === "none") {
place.style.display = "block";
editButton.style.display = "block";
toggleButton.innerHTML = toggleButton.getAttribute("openedtext");
toggleButton.setAttribute("title",toggleButton.getAttribute("openedtip"));
} else {
place.style.display = "none";
editButton.style.display = "none";
toggleButton.innerHTML = toggleButton.getAttribute("closedtext");
toggleButton.setAttribute("title",toggleButton.getAttribute("closedtip"));
}
}
};
//End toggle display of infoboxes

//Edit infoboxes
config.macros.infobox.editInfobox = function(saveButton,editButton,deleteButton,toggleButton,place,placeEdit,tiddler,noEdit) {
if (noEdit === "false") {
if (place.style.display === "block"){
deleteButton.style.display = "block";
saveButton.style.display = "block";
toggleButton.style.display = "none";
place.style.display = "none";
placeEdit.style.display = "block";
editButton.innerHTML = editButton.getAttribute("canceltext");
editButton.setAttribute("title",editButton.getAttribute("canceltip"));
}
else {
deleteButton.style.display = "none";
saveButton.style.display = "none";
toggleButton.style.display = "block";
place.style.display = "block";
placeEdit.style.display = "none";
editButton.innerHTML = editButton.getAttribute("edittext");
editButton.setAttribute("title",editButton.getAttribute("edittip"));
story.refreshTiddler(tiddler, null, true);
}
}
};
//End edit infoboxes

//Delete infoboxes
config.macros.infobox.deleteInfobox = function(type,title,instance) {
var confirmDelete = confirm("Do you really want to delete this infobox?\nTitle: \""+title+"\"\nType: \""+type+"\"\nInstance ID: \""+instance+"\"");
if (confirmDelete === true) {
//Get macro
var articleText = store.getTiddlerText(title); //Get article text
var macros = articleText.match(/<<infobox[\w\W\s]*?Type:"[\w\s]*?"[\w\W\s]*?>>/g); //Get all macros
var i;
var targetMacro;
for (i = 0; i < macros.length; i++) { //Get the correct macro
var macroType = "Type:\""+type+"\"";
if (macros[i].match(macroType)) {
if (macros[i].match(instance)) {
var macroInstancID = "InstanceID:\""+instance+"\"";
if (macros[i].match(macroInstancID)) {
targetMacro = macros[i];
}
}
else {
targetMacro = macros[i];
}
}
}

//Delete
var tid = store.getTiddler(title);
var tags = tid.tags;
var oldText;
var oldTextCheck = articleText.match(targetMacro+"\n");
if (oldTextCheck === null) {
oldText = targetMacro;
}
else {
oldText = targetMacro+"\n";
}
var newText = articleText.replace(oldText, "");
store.saveTiddler(title,title,newText,config.options.txtUserName,new Date(),tags); 
autoSaveChanges(null,[tiddler]);
story.displayTiddler(null,title); 
}
else {
return;
}
};
//End delete infoboxes

//Save infoboxes
config.macros.infobox.saveInfobox = function(saveButton,editButton,deleteButton,toggleButton,place,placeEdit,type,title,instance) {
var savePrompt = config.options.chkSavePrompt;
var doSave;
if (savePrompt === true) {
var confirmSave = confirm("Do you really want to save changes to this infobox?\nTitle: \""+title+"\"\nType: \""+type+"\"\nInstance ID: \""+instance+"\"");
if (confirmSave === true) {
doSave = true;
}
else {
doSave = false;
}
}
else {
doSave = true;
}

if (doSave === true) {
//Get the rendered content
var macroContent = placeEdit.innerHTML.replace(/<td[^>]*?colspan[^>]*?>[\w\W\s]*?<\/td>|<span[^>]*?EditComment[^>]*?>[\w\W\s]*?<\/span>|<span>|<\/span>/g, "").replace(/<\/textarea>/g, "\"\n").replace(/<textarea [\w\W\s]*?>/g, ":\"").replace(/<td[^>]*?>Type<\/td>/g, "Type:\"").replace(/<td[^>]*?>Title<\/td>/g, "\"\nTitle").replace(/<[\w\W\s]*?>|<\/[\w\W\s]*?>/g, "").replace(/Image: /g, "Image-").replace(/Single: /g, "Single-").replace(/Instance ID/g, "InstanceID"); //The "span" tags need to be removed, because they are added by HTMLFormattingPlugin, which is why comments and double cell columns are removed first

//Get the correct macro
var articleText = store.getTiddlerText(title); //Get article text
var macros = articleText.match(/<<infobox[\w\W\s]*?Type:"[\w\s]*?"[\w\W\s]*?>>/g);
var i;
var targetMacro;
for (i = 0; i < macros.length; i++) {
var macroType = "Type:\""+type+"\"";
if (macros[i].match(macroType)) {
if (macros[i].match(instance)) {
var macroInstancID = "InstanceID:\""+instance+"\"";
if (macros[i].match(macroInstancID)) {
targetMacro = macros[i];
}
}
else {
targetMacro = macros[i];
}
}
}

//Remove sections from the rendered content
var template = "Infobox_" + type.replace(/ /g, "_"); //Get template name
var templateText = store.getTiddlerText(template + "##Content"); //Get template definition
var templateSection = templateText.match(/Section-[\w\W\s]*?\n/g); //Get sections
var templateSectionCleaned = [];
var sectionCleaned, targetMacroSectionsReplace;
var j;
for (j = 0; j < templateSection.length; j++) {
sectionCleaned = templateSection[j].replace(/Section-| \*\*[\w\W\s]*?\n/g, ""); //Clean up sections
targetMacroSectionsReplace = sectionCleaned+"\"\\n";
if (macroContent.match(sectionCleaned)) {
templateSectionCleaned.push(targetMacroSectionsReplace); //Add all containd sections to array
}
}
var templateSectionCleanedString = new RegExp(templateSectionCleaned.toString().replace(/,/g, "|"), "g"); //Convert the array to string to be used in regexp
var macroContentSectionsCleaned = macroContent.replace(templateSectionCleanedString, ""); //Remove the sections from the macro

//Remove unknown parameters from the rendered content
var templateParams = templateText.replace(/----\n|Section-[\w\W\s]*?\n/g, "").replace(/ \*\*[\w\W\s]*?\n/g, "\n").split("\n"); //Get parameters
var templateParamsCleaned = [];
var shorthands = [];
var paramsCleaned, targetMacroParamsReplaceUnknown, targetMacroParamsReplaceEmpty, longhand, shorthand;
var k;
for (k = 0; k < templateParams.length; k++) { //Clean up parameters
if (templateParams[k].indexOf("((") !== -1) { //Get shorthand definitions for later
longhand = templateParams[k].replace(/Image-|Single-|Side1-|Side2-| \(\([\W\w\s]*?$/g, "");
shorthand = templateParams[k].replace(/^[\W\w\s]*?\(\(|\)\)[\W\w\s]*?$/g, "");
shorthands.push(longhand);
shorthands.push(shorthand);
}
paramsCleaned = templateParams[k].replace(/ \(\([\W\w\s]*?$|\n/g, ""); //Remove shorthand definitions and comments

targetMacroParamsReplaceUnknown = paramsCleaned+":\"unknown\"\\n";
if (macroContent.match(targetMacroParamsReplaceUnknown)) {
templateParamsCleaned.push(targetMacroParamsReplaceUnknown); //Add all contained unknown params to array
}
targetMacroParamsReplaceEmpty = paramsCleaned+":\"\"\\n";
if (macroContent.match(targetMacroParamsReplaceEmpty)) {
templateParamsCleaned.push(targetMacroParamsReplaceEmpty); //Add all contained empty params to array
}
}
var templateParamsCleanedString = new RegExp(templateParamsCleaned.toString().replace(/,/g, "|"), "g"); //Convert the array to string to be used in regexp
var macroContentParamsCleaned = macroContentSectionsCleaned.replace(templateParamsCleanedString, ""); //Remove the unknown params from the macro

//Replace longhand parameters with shorthands
var macroContentParamsCleanedSplit = macroContentParamsCleaned.split("\n"); //Convert macro string to array
var macroContentShorthandsArray = [];
var m, n;
var macroContentParamsClean, shorthandReplacement;
for (m = 0; m < macroContentParamsCleanedSplit.length; m++) { //Find out which parameters have shorthand definition
macroContentParamsClean = macroContentParamsCleanedSplit[m].replace(/Image-|Single-|Side1-|Side2-|:"[\w\W\s]*?"/g, "");
shorthandReplacement = "none";
for (n = 0; n < shorthands.length; n = n + 2) {
if (macroContentParamsClean === shorthands[n]) {
shorthandReplacement = macroContentParamsCleanedSplit[m].replace(/Image-|Single-|Side1-|Side2-/g, "").replace(shorthands[n], shorthands[n+1]); //Replace longhand parameters with shorthands
}
}
if (shorthandReplacement === "none") {
shorthandReplacement = macroContentParamsCleanedSplit[m];
}
macroContentShorthandsArray.push(shorthandReplacement); //Add all parameters to array
}

var macroContentShorthands = macroContentShorthandsArray.toString().replace(/",/g, "\"\n"); //Convert the array back to string

//Remove instance ID
var removeInstanceID = macroContentShorthands.replace(/InstanceID:"DefaultID"\n/, "");

//Remove title from the rendered content if it's the tiddler title and it isn't already in the macro
var defaultTitle = "Title:\""+title+"\"";
var removeTitleRE = defaultTitle+"\n";
var removeTitle;
if (!targetMacro.match(defaultTitle)) {
removeTitle = removeInstanceID.replace(removeTitleRE, "");
}
else {
removeTitle = removeInstanceID;
}

//Replace spaces in params with underscores
var matchSpaces = removeTitle.match(/^[\w\W\s]*?:|\n[\w\W\s]*?:/g); //Get the parameter names
var matchContent = removeTitle.match(/"[\w\W\s]*?"/g); //Get the parameter values
var replaceSpaces = [];
var l;
for (l = 0; l < matchSpaces.length; l++) {
replaceSpaces.push(matchSpaces[l].replace(/ /g, "_") + matchContent[l]); //Rejoin the parameter names and values
}
var noSpaces = replaceSpaces.toString().replace(/,/g, "");

//Add start and end macro code
var fullCode = "<<infobox\n" + noSpaces + "\n>>";
var addCode;
var saveMode = config.options.chkSaveMode;
if (saveMode === true) {
addCode = fullCode;
}
else {
addCode = fullCode.replace(/[\s]*?\n|\n[\s]*?|\n/g, " ").replace(/ >>/, ">>");
}

//Save
var tid = store.getTiddler(title);
var tags = tid.tags;
var newText = articleText.replace(targetMacro, addCode);
store.saveTiddler(title,title,newText,config.options.txtUserName,new Date(),tags); 
autoSaveChanges(null,[tiddler]);
story.displayTiddler(null,title); 

//Toggle display
editButton.style.display = "block";
deleteButton.style.display = "none";
saveButton.style.display = "none";
toggleButton.style.display = "block";
place.style.display = "block";
placeEdit.style.display = "none";
}
else {
return;
}
};
//End save of infoboxes
//}}}

//{{{
} //End of install only once
//}}}