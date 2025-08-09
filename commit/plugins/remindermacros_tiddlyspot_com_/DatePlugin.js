/***
|Name|DatePlugin|
|Source|http://www.TiddlyTools.com/#DatePlugin|
|Documentation|http://www.TiddlyTools.com/#DatePluginInfo|
|Version|2.7.0|
|Author|Eric Shulman - ELS Design Studios|
|License|http://www.TiddlyTools.com/#LegalStatements <br>and [[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|~CoreVersion|2.1|
|Type|plugin|
|Requires||
|Overrides||
|Description|formatted dates plus popup menu with 'journal' link, changes and (optional) reminders|
There are quite a few calendar generators, reminders, to-do lists, 'dated tiddlers' journals, blog-makers and GTD-like schedule managers that have been built around TW.  While they all have different purposes, and vary in format, interaction, and style, in one way or another each of these plugins displays and/or uses date-based information to make finding, accessing and managing relevant tiddlers easier.  This plugin provides a general approach to embedding dates and date-based links/menus within tiddler content.
!!!!!Documentation
>see [[DatePluginInfo]]
!!!!!Configuration
>see [[DatePluginConfig]]
!!!!!Revisions
<<<
2008.03.08 [2.7.0] in addModifiedsToPopup(), if a tiddler was created on the specified date, don't list it in the 'changed' section of the popup.  Based on a request from Kashgarinn.
|please see [[DatePluginInfo]] for additional revision details|
2005.10.30 [0.9.0] pre-release
<<<
!!!!!Code
***/
//{{{
version.extensions.date = {major: 2, minor: 7, revision: 0, date: new Date(2008,3,8)};

config.macros.date = {
	format: "YYYY.0MM.0DD", // default date display format
	linkformat: "YYYY.0MM.0DD", // 'dated tiddler' link format
	linkedbg: "#babb1e", // "babble"
	todaybg: "#ffab1e", // "fable"
	weekendbg: "#c0c0c0", // "cocoa"
	holidaybg: "#ffaace", // "face"
	createdbg: "#bbeeff", // "beef"
	modifiedsbg: "#bbeeff", // "beef"
	remindersbg: "#c0ffee", // "coffee"
	holidays: [ "01/01", "07/04", "07/24", "11/24" ], // NewYearsDay, IndependenceDay(US), Eric's Birthday (hooray!), Thanksgiving(US)
	weekend: [ 1,0,0,0,0,0,1 ] // [ day index values: sun=0, mon=1, tue=2, wed=3, thu=4, fri=5, sat=6 ]
};

config.macros.date.handler = function(place,macroName,params)
{
	// do we want to see a link, a popup, or just a formatted date?
	var mode="display";
	if (params[0]=="display") { mode=params[0]; params.shift(); }
	if (params[0]=="popup") { mode=params[0]; params.shift(); }
	if (params[0]=="link") { mode=params[0]; params.shift(); }
	// get the date
	var now = new Date();
	var date = now;
	if (!params[0] || params[0]=="today")
		{ params.shift(); }
	else if (params[0]=="filedate")
		{ date=new Date(document.lastModified); params.shift(); }
	else if (params[0]=="tiddler")
		{ date=store.getTiddler(story.findContainingTiddler(place).id.substr(7)).modified; params.shift(); }
	else if (params[0].substr(0,8)=="tiddler:")
		{ var t; if ((t=store.getTiddler(params[0].substr(8)))) date=t.modified; params.shift(); }
	else {
		var y = eval(params.shift().replace(/Y/ig,(now.getYear()<1900)?now.getYear()+1900:now.getYear()));
		var m = eval(params.shift().replace(/M/ig,now.getMonth()+1));
		var d = eval(params.shift().replace(/D/ig,now.getDate()+0));
		date = new Date(y,m-1,d);
	}
	// date format with optional custom override
	var format=this.format; if (params[0]) format=params.shift();
	var linkformat=this.linkformat; if (params[0]) linkformat=params.shift();
	showDate(place,date,mode,format,linkformat);
}

window.showDate=showDate;
function showDate(place,date,mode,format,linkformat,autostyle,weekend)
{
	if (!mode) mode="display";
	if (!format) format=config.macros.date.format;
	if (!linkformat) linkformat=config.macros.date.linkformat;
	if (!autostyle) autostyle=false;

	// format the date output
	var title = date.formatString(format);
	var linkto = date.formatString(linkformat);

	// just show the formatted output
	if (mode=="display") { place.appendChild(document.createTextNode(title)); return; }

	// link to a 'dated tiddler'
	var link = createTiddlyLink(place, linkto, false);
	link.appendChild(document.createTextNode(title));
	link.title = linkto;
	link.date = date;
	link.format = format;
	link.linkformat = linkformat;

	// if using a popup menu, replace click handler for dated tiddler link
	// with handler for popup and make link text non-italic (i.e., an 'existing link' look)
	if (mode=="popup") {
		link.onclick = onClickDatePopup;
		link.style.fontStyle="normal";
	}
	// format the popup link to show what kind of info it contains (for use with calendar generators)
	if (autostyle) setDateStyle(place,link,weekend);
}
//}}}

//{{{
// NOTE: This function provides default logic for setting the date style when displayed in a calendar
// To customize the date style logic, please see[[DatePluginConfig]]
function setDateStyle(place,link,weekend) {
	// alias variable names for code readability
	var date=link.date;
	var fmt=link.linkformat;
	var linkto=date.formatString(fmt);
	var cmd=config.macros.date;

	if ((weekend!==undefined?weekend:isWeekend(date))&&(cmd.weekendbg!=""))
		{ place.style.background = cmd.weekendbg; }
	if (hasModifieds(date)||hasCreateds(date)||hasTagged(date,fmt))
		{ link.style.fontStyle="normal"; link.style.fontWeight="bold"; }
	if (hasReminders(date))
		{ link.style.textDecoration="underline"; }
	if (isToday(date))
		{ link.style.border="1px solid black"; }
	if (isHoliday(date)&&(cmd.holidaybg!=""))
		{ place.style.background = cmd.holidaybg; }
	if (hasCreateds(date)&&(cmd.createdbg!=""))
		{ place.style.background = cmd.createdbg; }
	if (hasModifieds(date)&&(cmd.modifiedsbg!=""))
		{ place.style.background = cmd.modifiedsbg; }
	if ((hasTagged(date,fmt)||store.tiddlerExists(linkto))&&(cmd.linkedbg!=""))
		{ place.style.background = cmd.linkedbg; }
	if (hasReminders(date)&&(cmd.remindersbg!=""))
		{ place.style.background = cmd.remindersbg; }
	if (isToday(date)&&(cmd.todaybg!=""))
		{ place.style.background = cmd.todaybg; }
}
//}}}

//{{{
function isToday(date) // returns true if date is today
	{ var now=new Date(); return ((now-date>=0) && (now-date<86400000)); }

function isWeekend(date) // returns true if date is a weekend
	{ return (config.macros.date.weekend[date.getDay()]); }

function isHoliday(date) // returns true if date is a holiday
{
	var longHoliday = date.formatString("0MM/0DD/YYYY");
	var shortHoliday = date.formatString("0MM/0DD");
	for(var i = 0; i < config.macros.date.holidays.length; i++) {
		var holiday=config.macros.date.holidays[i];
		if (holiday==longHoliday||holiday==shortHoliday) return true;
	}
	return false;
}
//}}}

//{{{
// Event handler for clicking on a day popup
function onClickDatePopup(e)
{
	if (!e) var e = window.event;
	var theTarget = resolveTarget(e);
	var popup = Popup.create(this);
	if(popup) {
		// always show dated tiddler link (or just date, if readOnly) at the top...
		if (!readOnly || store.tiddlerExists(this.date.formatString(this.linkformat)))
			createTiddlyLink(popup,this.date.formatString(this.linkformat),true);
		else
			createTiddlyText(popup,this.date.formatString(this.linkformat));
		if (!config.options.chkDatePopupHideCreated)
			addCreatedsToPopup(popup,this.date,this.format);
		if (!config.options.chkDatePopupHideChanged)
			addModifiedsToPopup(popup,this.date,this.format);
		if (!config.options.chkDatePopupHideTagged)
			addTaggedToPopup(popup,this.date,this.linkformat);
		if (!config.options.chkDatePopupHideReminders)
			addRemindersToPopup(popup,this.date,this.linkformat);
	}
	Popup.show(popup,false);
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	return(false);
}
//}}}

//{{{
function indexCreateds() // build list of tiddlers, hash indexed by creation date
{
	var createds= { };
	var tiddlers = store.getTiddlers("title","excludeLists");
	for (var t = 0; t < tiddlers.length; t++) {
		var date = tiddlers[t].created.formatString("YYYY0MM0DD")
		if (!createds[date])
			createds[date]=new Array();
		createds[date].push(tiddlers[t].title);
	}
	return createds;
}
function hasCreateds(date) // returns true if date has created tiddlers
{
	if (!config.macros.date.createds) config.macros.date.createds=indexCreateds();
	return (config.macros.date.createds[date.formatString("YYYY0MM0DD")]!=undefined);
}

function addCreatedsToPopup(popup,when,format)
{
	var force=(store.isDirty() && when.formatString("YYYY0MM0DD")==new Date().formatString("YYYY0MM0DD"));
	if (force || !config.macros.date.createds) config.macros.date.createds=indexCreateds();
	var indent=String.fromCharCode(160)+String.fromCharCode(160);
	var createds = config.macros.date.createds[when.formatString("YYYY0MM0DD")];
	if (createds) {
		createds.sort();
		var e=createTiddlyElement(popup,"div",null,null,"created ("+createds.length+")");
		for(var t=0; t<createds.length; t++) {
			var link=createTiddlyLink(popup,createds[t],false);
			link.appendChild(document.createTextNode(indent+createds[t]));
			createTiddlyElement(popup,"br",null,null,null);
		}
	}
}
//}}}

//{{{
function indexModifieds() // build list of tiddlers, hash indexed by modification date
{
	var modifieds= { };
	var tiddlers = store.getTiddlers("title","excludeLists");
	for (var t = 0; t < tiddlers.length; t++) {
		var date = tiddlers[t].modified.formatString("YYYY0MM0DD")
		if (!modifieds[date])
			modifieds[date]=new Array();
		modifieds[date].push(tiddlers[t].title);
	}
	return modifieds;
}
function hasModifieds(date) // returns true if date has modified tiddlers
{
	if (!config.macros.date.modifieds) config.macros.date.modifieds = indexModifieds();
	return (config.macros.date.modifieds[date.formatString("YYYY0MM0DD")]!=undefined);
}

function addModifiedsToPopup(popup,when,format)
{
	var date=when.formatString("YYYY0MM0DD");
	var force=(store.isDirty() && date==new Date().formatString("YYYY0MM0DD"));
	if (force || !config.macros.date.modifieds) config.macros.date.modifieds=indexModifieds();
	var indent=String.fromCharCode(160)+String.fromCharCode(160);
	var mods = config.macros.date.modifieds[date];
	if (mods) {
		// if a tiddler was created on this date, don't list it in the 'changed' section
		if (config.macros.date.createds && config.macros.date.createds[date]) {
			var temp=[];
			for(var t=0; t<mods.length; t++)
				if (!config.macros.date.createds[date].contains(mods[t]))
					temp.push(mods[t]);
			mods=temp;
		}
		mods.sort();
		var e=createTiddlyElement(popup,"div",null,null,"changed ("+mods.length+")");
		for(var t=0; t<mods.length; t++) {
			var link=createTiddlyLink(popup,mods[t],false);
			link.appendChild(document.createTextNode(indent+mods[t]));
			createTiddlyElement(popup,"br",null,null,null);
		}
	}
}
//}}}

//{{{
function hasTagged(date,format) // returns true if date is tagging other tiddlers
{
	return store.getTaggedTiddlers(date.formatString(format)).length>0;
}

function addTaggedToPopup(popup,when,format)
{
	var indent=String.fromCharCode(160)+String.fromCharCode(160);
	var tagged=store.getTaggedTiddlers(when.formatString(format));
	if (tagged.length) var e=createTiddlyElement(popup,"div",null,null,"tagged ("+tagged.length+")");
	for(var t=0; t<tagged.length; t++) {
		var link=createTiddlyLink(popup,tagged[t].title,false);
		link.appendChild(document.createTextNode(indent+tagged[t].title));
		createTiddlyElement(popup,"br",null,null,null);
	}
}
//}}}

//{{{
function indexReminders(date,leadtime) // build list of tiddlers with reminders, hash indexed by reminder date
{
	var reminders = { };
	if(window.findTiddlersWithReminders!=undefined) { // reminder plugin is installed
		// DEBUG var starttime=new Date();
		var t = findTiddlersWithReminders(date, [0,leadtime], null, null, 1);
		for(var i=0; i<t.length; i++) reminders[t[i].matchedDate]=true;
		// DEBUG var out="Found "+t.length+" reminders in "+((new Date())-starttime+1)+"ms\n";
		// DEBUG out+="startdate: "+date.toLocaleDateString()+"\n"+"leadtime: "+leadtime+" days\n\n";
		// DEBUG for(var i=0; i<t.length; i++) { out+=t[i].matchedDate.toLocaleDateString()+" "+t[i].params.title+"\n"; }
		// DEBUG alert(out);
	}
	return reminders;
}

function hasReminders(date) // returns true if date has reminders
{
	if (window.reminderCacheForCalendar)
		return window.reminderCacheForCalendar[date]; // use calendar cache
	if (!config.macros.date.reminders)
		config.macros.date.reminders = indexReminders(date,90); // create a 90-day leadtime reminder cache
	return (config.macros.date.reminders[date]);
}

function addRemindersToPopup(popup,when,format)
{
	if(window.findTiddlersWithReminders==undefined) return; // reminder plugin not installed

	var indent = String.fromCharCode(160)+String.fromCharCode(160);
	var reminders=findTiddlersWithReminders(when, [0,31],null,null,1);
	createTiddlyElement(popup,"div",null,null,"reminders ("+(reminders.length||"none")+")");
	for(var t=0; t<reminders.length; t++) {
		link = createTiddlyLink(popup,reminders[t].tiddler,false);
		var diff=reminders[t].diff;
		diff=(diff<1)?"Today":((diff==1)?"Tomorrow":diff+" days");
		var txt=(reminders[t].params["title"])?reminders[t].params["title"]:reminders[t].tiddler;
		link.appendChild(document.createTextNode(indent+diff+" - "+txt));
		createTiddlyElement(popup,"br",null,null,null);
	}
	if (readOnly) return;	// omit "new reminder..." link
	var link = createTiddlyLink(popup,indent+"new reminder...",true); createTiddlyElement(popup,"br");
	var title = when.formatString(format);
	link.title="add a reminder to '"+title+"'";
	link.onclick = function() {
		// show tiddler editor
		story.displayTiddler(null, title, 2, null, null, false, false);
		// find body 'textarea'
		var c =document.getElementById("tiddler" + title).getElementsByTagName("*");
		for (var i=0; i<c.length; i++) if ((c[i].tagName.toLowerCase()=="textarea") && (c[i].getAttribute("edit")=="text")) break;
		// append reminder macro to tiddler content
		if (i<c.length) {
			if (store.tiddlerExists(title)) c[i].value+="\n"; else c[i].value="";
			c[i].value += "<<reminder";
			c[i].value += " day:"+when.getDate();
			c[i].value += " month:"+(when.getMonth()+1);
			c[i].value += " year:"+when.getFullYear();
			c[i].value += ' title:"Enter a title" >>';
		}
	};
}
//}}}