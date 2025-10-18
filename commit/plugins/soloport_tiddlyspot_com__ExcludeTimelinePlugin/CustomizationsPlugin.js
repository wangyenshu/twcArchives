// // Override cookie settings
/*{{{*/
// personal preferences
if (config.options.txtUserName=="Jon Scully") {
	config.options.chkSaveBackups=false;
}
config.options.txtCalFirstDay=6;
config.options.txtCalStartOfWeekend=5;
config.options.chkDisableWikiLinks=true;
config.options.chkDontDisableShadowWikiLinks=true;
/*}}}*/
// // Date format customizations
/*{{{*/
merge(config.macros.timeline,{
	dateFormat: "MMM DD, YYYY"});
config.macros.calendar.tiddlerformat = "MMM DD, YYYY";
/*}}}*/
// // Remove initial text, {{{Type the text for 'New Tiddler'}}}, in a New Tiddler's text area
/*{{{*/
merge(config.views.editor,{
	tagPrompt: "Type tags separated with spaces, [[use double square brackets]] if necessary, or add existing",
	defaultText: ""});
/*}}}*/
// // Replace "new journal" with "today's journal"
/*{{{*/
merge(config.macros.newJournal,{
	label: "today's journal",
	prompt: "Create a new tiddler from the current date and time",
	accessKey: "J"});
/*}}}*/
// // Replace "close others" with "solo"
/*{{{*/
merge(config.commands.closeOthers,{
	text: "solo",
	tooltip: "Close all other tiddlers"});

/*}}}*/
// // Open tiddlers at top of page
/*{{{*/
Story.prototype.positionTiddler = function(srcElement)
{
	var before = document.getElementById(this.container).firstChild;
	if (typeof srcElement == "string" && srcElement == "bottom") before = null;
	return before;
}
/*}}}*/
// // Suppress animation when opening multiple tiddlers
/*{{{*/
Story.prototype.displayTiddlers = function(srcElement,titles,template,animate,slowly) {
	for(var t = titles.length-1;t>=0;t--)
		this.displayTiddler(srcElement,titles[t],template,false,false);
}
/*}}}*/
// // Timeout the messageArea and remove "close" link
/*{{{*/
function getMessageDiv() {
	var msgArea = document.getElementById("messageArea");
	if (!msgArea)
		return null;
// "close" link code was here (JOS) //
	msgArea.style.display = "block";
	setTimeout("clearMessage();",3000); // ms (JOS)
	return createTiddlyElement(msgArea,"div");
}
/*}}}*/
// // Open permalink or permaview URL in new window (e.g. or new tab)
/*{{{*/
config.commands.permalink.handler = function(event,src,title)
{
	var url = window.location.hash;
	if (window.location.hash.indexOf("#")!=-1)
		url = window.location.hash.substr(0,window.location.hash.indexOf("#"));
	var t = encodeURIComponent(String.encodeTiddlyLink(title));
	window.open(url+"#"+t);
	return false;
}

Story.prototype.permaView = function()
{
	var url = window.location.hash;
	if (window.location.hash.indexOf("#")!=-1)
		url = window.location.hash.substr(0,window.location.hash.indexOf("#"));
	var links = [];
	this.forEachTiddler(function(title,element) {
		links.push(String.encodeTiddlyLink(title));
		});
	var t = encodeURIComponent(links.join(" "));
	window.open(url+"#"+t);
}
/*}}}*/
// // Slider customizations
/*{{{*/
config.macros.slider.handler = function(place,macroName,params)
{
	/* support greater simplification:
	<<slider [[Slider Name]]>> becomes <<slider chkSliderSliderName [[Slider Name]] 'Slider Name' 'toggle open/close'>>
	params.4: cookie,tiddler,title,tooltip -- legacy
	params.3: tiddler,title,tooltip
	params.2: tiddler,title
	params.1: tiddler
	*/
	var tiddler,text,panel;
	if (params.length > 3) {
		tiddler = params[1];
		text = store.getTiddlerText(tiddler);
		panel = this.createSlider(place,params[0],params[2]+"...",params[3]);
	} else {
		tiddler = params[0];
		text = store.getTiddlerText(tiddler);
		var title,tooltip,btitle;
		if (params.length > 1)
			title = params[1];
		else title = tiddler;
		if (params.length > 2)
			tooltip = params[2];
		else tooltip = "toggle open/close";
		var a = tiddler.split(" ");
		cookie = "chkSlider"+a.join("");
		panel = this.createSlider(place,cookie,title,tooltip);
		var btn = createTiddlyButton(place,text?"»":"«","edit",this.onClickOpen);
		btn.setAttribute("newTitle",tiddler);
	}
	panel.setAttribute("refresh", "content");
	panel.setAttribute("tiddler", tiddler);
	if (!text) text = "* None";
	wikify(text,panel,null,store.getTiddler(tiddler));
}

config.macros.slider.onClickOpen = function(e) {
	var title = this.getAttribute("newTitle");
	var theTarget = resolveTarget(e);
	story.displayTiddler(theTarget,title,DEFAULT_EDIT_TEMPLATE);
}
/*}}}*/
