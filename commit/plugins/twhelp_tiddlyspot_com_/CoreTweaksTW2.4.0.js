/***
|Name|CoreTweaks|
|Source|http://www.TiddlyTools.com/#CoreTweaks|
|Version|n/a|
|Author|Eric Shulman - ELS Design Studios|
|License|http://www.TiddlyTools.com/#LegalStatements <br>and [[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|~CoreVersion|2.2.4|
|Type|plugin|
|Requires||
|Overrides|various|
|Description|a small collection of overrides to TW core functions|
This tiddler contains some quick tweaks and modifications to TW core functions to provide minor changes in standard features or behavior.  It is hoped that some of these tweaks may be incorporated into later versions of the TW core, so that these adjustments will be available without needing these add-on definitions. ''Note: the changes contained in this tiddler are generally applicable for the current version of TiddlyWiki (<<version>>)./% Please view [[CoreTweaksArchive]] for tweaks and modifications that may be used with earlier versions of TiddlyWiki.%/''

To install //all// of these tweaks, import (or copy/paste) this tiddler into your document.  To include only //some// of the tweaks, you can edit the imported tiddler to remove the tweaks that you don't want.  Alternatively, you could copy/paste a few selected tweaks from this tiddler into a tiddler that you create in your own document.  Be certain to tag that tiddler with<<tag systemConfig>> (i.e., a plugin tiddler) and then save-and-reload for the tweaks to take effect.
***/

// // {{block{
/***
!!!784 allow tiddler sections in TiddlyLinks to be used as anchor points for intra-tiddler scrolling.  
***/
// // {{groupbox small{
/***
http://trac.tiddlywiki.org/ticket/784 - OPEN
You can currently use the tiddler section syntax within the {{{<<tiddler>>}}} macro to //transclude// a subsection of one tiddler into another (e.g., {{{<<tiddler SomeTiddler##SomeSection>>}}}).  However, when the same section syntax is used in a TiddlyLink (e.g., {{{[[SomeTiddler##SomeSection]]}}}), the entire reference is treated as a link to a (non-existent) tiddler that includes the section reference in the tiddler title itself.

This tweak extends the TiddlyLink processing to separate the section reference from the tiddler name and use that reference to auto-scroll to the indicated section heading (if present) within that tiddler (i.e., the same behavior as {{{<a name="foo">}}} and {{{<a href="#foo">...</a>}}} HTML syntax).  
***/
//{{{
Story.prototype.scrollToSection = function(title,section) {
	if (!title||!section) return;
	var t=this.getTiddler(title); if (!t) return;
	var s=[];
	var h=t.getElementsByTagName("H1"); for (var i=0;i<h.length;i++) s.push(h[i]);
	var h=t.getElementsByTagName("H2"); for (var i=0;i<h.length;i++) s.push(h[i]);
	var h=t.getElementsByTagName("H3"); for (var i=0;i<h.length;i++) s.push(h[i]);
	var h=t.getElementsByTagName("H4"); for (var i=0;i<h.length;i++) s.push(h[i]);
	var h=t.getElementsByTagName("H5"); for (var i=0;i<h.length;i++) s.push(h[i]);
	var h=t.getElementsByTagName("H6"); for (var i=0;i<h.length;i++) s.push(h[i]);
	for (var i=0; i<s.length; i++) if (s[i].innerHTML.substr(0,section.length)==section)
		setTimeout("window.scrollTo(0,"+findPosY(s[i])+")",
			config.options.chkAnimate?config.animDuration+100:0);
}
window.createTiddlyLink_sectionanchor=window.createTiddlyLink;
window.createTiddlyLink=function(place,title) {
	var parts=title.split(config.textPrimitives.sectionSeparator);
	if (parts[0].length && parts[1]) arguments[1]=parts[0]; // trim section from tiddler title
	var btn=createTiddlyLink_sectionanchor.apply(this,arguments);
	btn.setAttribute('section',parts[1]); // save section
	return btn;
}
window.onClickTiddlerLink_sectionanchor=window.onClickTiddlerLink;
window.onClickTiddlerLink=function(ev) {
	var r=onClickTiddlerLink_sectionanchor.apply(this,arguments);
	var e=ev||window.event;	var target=resolveTarget(e); var title=null;
	while (target!=null && title==null) {
		title=target.getAttribute("tiddlyLink");
		section=target.getAttribute("section");
		target=target.parentNode;
	} 
	story.scrollToSection(title,section);
	return r;
}
Story.prototype.displayTiddler_sectionanchor=Story.prototype.displayTiddler;
Story.prototype.displayTiddler = function(srcElement,tiddler)
{
	var title=(tiddler instanceof Tiddler)?tiddler.title:tiddler;
	var parts=title.split(config.textPrimitives.sectionSeparator);
	if (parts[0].length && parts[1]) arguments[1]=parts[0]; // trim section from tiddler title
	this.displayTiddler_sectionanchor.apply(this,arguments);
	story.scrollToSection(parts[0],parts[1]);
}
//}}}
// // }}}}}}// // {{block{

/***
!!! Ticketed Tweaks
***/
// // {{groupbox small{
http://trac.tiddlywiki.org/ticket/675 - OPEN
// // This tweak adds a URL paramifier, "#recent:N", to automatically display the N most recently changed tiddlers.  N is, of course, an integer number.  If N=0 (or is not a numeric value), the regular [[DefaultTiddlers]] will be displayed.
//{{{
config.paramifiers.recent= {
	onstart: function(v) {
		var titles=[];
		var tids=store.getTiddlers("modified","excludeLists").reverse();
		for (var t=0; t<v && t<tids.length; t++) titles.push(tids[t].title);
		story.displayTiddlers(null,titles); 
	}
};
//}}}
// // }}}
// // {{groupbox small{
/***
http://trac.tiddlywiki.org/ticket/664 - OPEN
This tweak provides "loose" matching of tiddler titles so that text using variations of mixed-case and/or added/omitted spaces can still be used to create links enclosed in {{{[[...]]}}}.  This permits normal prose-style text to be easily linked to tiddler titles, without requiring use of the "pretty link" syntax.  For example:
{{{
[[CoreTweaks]], [[coreTweaks]], [[core tweaks]],
[[CORE TWEAKS]], [[CoRe TwEaKs]], [[coreTWEAKS]]
}}}

>[[CoreTweaks]], [[coreTweaks]], [[core tweaks]],
>[[CORE TWEAKS]], [[CoRe TwEaKs]], [[coreTWEAKS]]
Configuration:
><<option chkLooseLinks>> Allow case-folded and/or space-folded text to link to existing tiddler titles
>{{{usage: <<option chkLooseLinks>>}}}
***/
//{{{
if (!config.options.chkLooseLinks)
	config.options.chkLooseLinks=false; // default to standard behavior
window.caseFold_createTiddlyLink = window.createTiddlyLink;
window.createTiddlyLink = function(place,title,includeText,className) {
	var btn=window.caseFold_createTiddlyLink.apply(this,arguments); // create core link
	if (!config.options.chkLooseLinks) return btn;
	if (store.getTiddlerText(title)) return btn; // matching tiddler (or shadow) exists
	var target=title.toLowerCase().replace(/\s/g,"");
	var tids=store.getTiddlers("title");
	for (var t=0; t<tids.length; t++) {
		if (tids[t].title.toLowerCase().replace(/\s/g,"")==target) {
			var i=getTiddlyLinkInfo(tids[t].title,className);
			btn.setAttribute("tiddlyLink",tids[t].title);
			btn.title=i.subTitle;
			btn.className=i.classes;
			break;
		}
	}
	return btn;
}
//}}}
// // }}}
// // {{groupbox small{
// // http://trac.tiddlywiki.org/ticket/657 - OPEN
// // This tweak inserts an extra space element following each tab, allowing them to wrap onto multiple lines if needed.
//{{{
config.macros.tabs.handler = function(place,macroName,params)
{
	var cookie = params[0];
	var numTabs = (params.length-1)/3;
	var wrapper = createTiddlyElement(null,"div",null,"tabsetWrapper " + cookie);
	var tabset = createTiddlyElement(wrapper,"div",null,"tabset");
	tabset.setAttribute("cookie",cookie);
	var validTab = false;
	for(var t=0; t<numTabs; t++) {
		var label = params[t*3+1];
		var prompt = params[t*3+2];
		var content = params[t*3+3];
		var tab = createTiddlyButton(tabset,label,prompt,this.onClickTab,"tab tabUnselected");
		createTiddlyElement(tab,"span",null,null," ",{style:"font-size:0pt;line-height:0px"}); // ELS
		tab.setAttribute("tab",label);
		tab.setAttribute("content",content);
		tab.title = prompt;
		if(config.options[cookie] == label)
			validTab = true;
	}
	if(!validTab)
		config.options[cookie] = params[1];
	place.appendChild(wrapper);
	this.switchTab(tabset,config.options[cookie]);
};
//}}}
// // }}}
// // {{groupbox small{
// // http://trac.tiddlywiki.org/ticket/635 - FIXED (not yet released) http://trac.tiddlywiki.org/changeset/5116
// // When using backstage>import "browse" button, resulting URL is improperly formed with "file://" prefix instead of "file:///" prefix.  This causes errors when using Firefox 3 (beta) or when running under Windows Vista OS.
// // http://trac.tiddlywiki.org/ticket/638 - FIXED (not yet released) http://trac.tiddlywiki.org/changeset/5080
// // When entering text directly into path/file field, each keystroke is displayed and then discarded, preventing manual entry of path/file.
// // http://trac.tiddlywiki.org/ticket/639 - FIXED (not yet released) http://trac.tiddlywiki.org/changeset/5113
// // Pressing "enter" from URL or Browse input field immediately reloads the current document.  Instead, it should trigger the "open" button for the import wizard (if a URL has been entered)
//{{{
// #635 and #638
config.macros.importTiddlers.onBrowseChange = function(e)
{
	var wizard = new Wizard(this);
	var fileInput = wizard.getElement("txtPath");
	fileInput.value = config.macros.importTiddlers.getURLFromLocalPath(this.value); // #635
	var serverType = wizard.getElement("selTypes");
	serverType.value = "file";
	return true; // #638
};
// #635 - fixup local path/file to form absolute URL reference
config.macros.importTiddlers.getURLFromLocalPath = function(v)
{
	if (!v||!v.length) return v;
	v=v.replace(/\\/g,"/"); // use "/" for cross-platform consistency
	var t=v.split(":"); p=t[1]||t[0]; // remove drive letter (if any)
	if (t[1] && (t[0]=="http"||t[0]=="https"||t[0]=="file")) { // input is already a URL
		var u=v;
	} else if (p.substr(0,1)=="/") { // path is absolute, add protocol+domain+extra slash (if drive letter)
		var u=document.location.protocol+"//"+document.location.hostname+(t[1]?"/":"")+v;
	} else { // path is relative, add current document protocol+domain+path
		var c=document.location.href.replace(/\\/g,"/");
		var pos=c.lastIndexOf("/"); if (pos!=-1) c=c.substr(0,pos); // remove filename
		var u=c+"/"+p;
	}
	return u;
}
// #639 - prevent form action and click "open" button if ENTER is pressed
config.macros.importTiddlers.coreTweaks_restart = config.macros.importTiddlers.restart;
config.macros.importTiddlers.restart = function(wizard)
{
	config.macros.importTiddlers.coreTweaks_restart.apply(this,arguments);
	wizard.formElem.action="javascript:;"

	wizard.formElem.onsubmit=function() {
		if (this.txtPath.value.length)
			this.lastChild.firstChild.onclick();  // press "open" button
	}
};
//}}}
// // }}}
// // {{groupbox small{
// // http://trac.tiddlywiki.org/ticket/637 - OPEN
// // This tweak modifies the tooltip format that appears when you mouseover a link to a tiddler.  It adds an option to control the date format, as well as displaying the size of the tiddler (in bytes)
// //
// // Tiddler link tooltip format:
// // {{stretch{<<option txtTiddlerLinkTootip>>}}}
// // ^^where: %0=title, %1=username, %2=modification date, %3=size in bytes^^
// // Tiddler link tooltip date format:
// // {{stretch{<<option txtTiddlerLinkTooltipDate>>}}}
//{{{
config.messages.tiddlerLinkTooltip="%0 - %1, %2 (%3 bytes)";
config.messages.tiddlerLinkTooltipDate="DDD, MMM DDth YYYY 0hh12:0mm AM";

config.options.txtTiddlerLinkTootip=
	config.options.txtTiddlerLinkTootip||config.messages.tiddlerLinkTooltip;
config.options.txtTiddlerLinkTooltipDate=
	config.options.txtTiddlerLinkTooltipDate||config.messages.tiddlerLinkTooltipDate;

Tiddler.prototype.getSubtitle = function() {
	var modifier = this.modifier;
	if(!modifier) modifier = config.messages.subtitleUnknown;
	var modified = this.modified;
	if(modified) modified = modified.formatString(config.options.txtTiddlerLinkTooltipDate);
	else modified = config.messages.subtitleUnknown;
	return config.options.txtTiddlerLinkTootip.format([this.title,modifier,modified,this.text.length]);
};
//}}}
// // }}}
// // {{groupbox small{
// // http://trac.tiddlywiki.org/ticket/628 - OPEN
// // When invoking a macro that is not defined, this tweak prevents the display of the "error in macro... no such macro" message.  This is useful when rendering tiddler content or templates that reference macros that are defined by //optional// plugins that have not been installed in the current document.
// //
// // <<option chkHideMissingMacros>> hide "no such macro" error messages
//{{{
if (config.options.chkHideMissingMacros===undefined)
	config.options.chkHideMissingMacros=false;

window.coreTweaks_missingMacro_invokeMacro = window.invokeMacro;
window.invokeMacro = function(place,macro,params,wikifier,tiddler) {
	if (!config.macros[macro] || !config.macros[macro].handler)
		if (config.options.chkHideMissingMacros) return;
	window.coreTweaks_missingMacro_invokeMacro.apply(this,arguments);
}
//}}}
// // }}}
// // {{groupbox small{
// // http://trac.tiddlywiki.org/ticket/623 - FIXED (not yet released) http://trac.tiddlywiki.org/changeset/5143
/***
This tweak allows date format strings to contain backslash-quoted characters that bypass date format replacement.  This allows sequences such as "s\s", "m\m" or "a\m" to be used so that "ss", "mm" or "am" can appears as literal text within journal titles or other date-formatted values.

For example:

>{{{<<today "withhold less hummingbirds - YYYY.0MM.0DD 0hh:0mm:0ss">>}}}
>results in: <<today "withhold less hummingbirds - YYYY.0MM.0DD 0hh:0mm:0ss">>
while:
>{{{<<today "with\hold les\s hum\mingbirds - YYYY.0MM.0DD 0hh:0mm:0ss">>}}}
>results in: <<today "with\hold les\s hum\mingbirds - YYYY.0MM.0DD 0hh:0mm:0ss">>

***/
//{{{
Date.prototype.coreTweaks_formatString = Date.prototype.formatString;
Date.prototype.formatString = function(template) {
	var t = Date.prototype.coreTweaks_formatString.apply(this,arguments);
	t = t.replace(/\\/g,""); // strip backslashes used to quote formats
	return t;
};
//}}}
// // }}}
// // {{groupbox small{
// // http://trac.tiddlywiki.org/ticket/609 - OPEN (separators)
// // http://trac.tiddlywiki.org/ticket/610 - OPEN (wikify tiddler/slice/section content)
// // These tweaks extend the {{{<<toolbar>>}}} macro to permit use of "|" as separators, as well as recognizing references to tiddlernames, slices, or sections and rendering their content inline within the toolbar
// // ''see [[ToolbarCommands]] for examples of how these features can be used''
//{{{
merge(config.macros.toolbar,{
	separator: "|"
	});
config.macros.toolbar.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	for(var t=0; t<params.length; t++) {
		var c = params[t];
		switch(c) {
			case '|':  // ELS - SEPARATOR
			case '!':  // ELS - SEPARATOR (alternative for use in tiddler slices)
				createTiddlyText(place,this.separator); // ELS
				break; // ELS
			case '>':
				var btn = createTiddlyButton(place,this.moreLabel,this.morePrompt,config.macros.toolbar.onClickMore);
				addClass(btn,"moreCommand");
				var e = createTiddlyElement(place,"span",null,"moreCommand");
				e.style.display = "none";
				place = e;
				break;
			default:
				var theClass = "";
				switch(c.substr(0,1)) {
					case "+":
						theClass = "defaultCommand";
						c = c.substr(1);
						break;
					case "-":
						theClass = "cancelCommand";
						c = c.substr(1);
						break;
				}
				if(c in config.commands)
					this.createCommand(place,c,tiddler,theClass);
				else { // ELS - WIKIFY TIDDLER/SLICE/SECTION
					if (c.substr(0,1)=="~") c=c.substr(1); // ignore leading ~
					var txt=store.getTiddlerText(c);
					if (txt) {
						txt=txt.replace(/^\n*/,"").replace(/\n*$/,""); // trim any leading/trailing newlines
						txt=txt.replace(/^\{\{\{\n/,"").replace(/\n\}\}\}$/,""); // trim PRE format wrapper if any
						wikify(txt,createTiddlyElement(place,"span"),null,tiddler);
					}
				} // ELS - end WIKIFY CONTENT
				break;
		}
	}
};
//}}}
// // }}}
// // {{groupbox small{
// // http://trac.tiddlywiki.org/ticket/608 - OPEN
// // This tweak extends the {{{<<toolbar>>}}} macro to make the ">" (more) a //toggle// between more/less with the additional toolbar commands displayed on a separate line.
//{{{
merge(config.macros.toolbar,{
	moreLabel: 'more',
	morePrompt: "Show additional commands",
	lessLabel: 'less',
	lessPrompt: "Hide additional commands"

});
config.macros.toolbar.onClickMore = function(ev)
{
	var e = this.nextSibling;
	var showing=e.style.display=="block";
	e.style.display = showing?"none":"block";
	this.innerHTML=showing?config.macros.toolbar.moreLabel:config.macros.toolbar.lessLabel;
	this.title=showing?config.macros.toolbar.morePrompt:config.macros.toolbar.lessPrompt;
	return false;
};
//}}}
// // }}}
// // {{groupbox small{
// // http://trac.tiddlywiki.org/ticket/607 - OPEN
// // This tweak automatically sets the HREF for the 'permaview' sidebar command link so you can use the 'right click' context menu for faster, easier bookmarking.  Note that this does ''not'' automatically set the permaview in the browser's current location URL... it just sets the HREF on the command link.  You still have to click the link to apply the permaview.
//{{{
config.macros.permaview.handler = function(place)
{
	var btn=createTiddlyButton(place,this.label,this.prompt,this.onClick);
	addEvent(btn,"mouseover",this.setHREF);
	addEvent(btn,"focus",this.setHREF);
};
config.macros.permaview.setHREF = function(event){
	var links = [];
	story.forEachTiddler(function(title,element) {
		links.push(String.encodeTiddlyLink(title));
	});
	var newURL=document.location.href;
	var hashPos=newURL.indexOf("#");
	if (hashPos!=-1) newURL=newURL.substr(0,hashPos);
	this.href=newURL+"#"+encodeURIComponent(links.join(" "));
}
//}}}
// // }}}
// // {{groupbox small{
// // http://trac.tiddlywiki.org/ticket/529 - OPEN
// // This tweak hijacks the standard browser function, document.getElementById(), to work-around the case-INsensitivity error in Internet Explorer (all versions up to and including IE7) //''Note: This tweak is only applied when using IE, and only for lookups of rendered tiddler elements within the containing "tiddlerDisplay" element.''//
//{{{
if (config.browser.isIE) {
document.coreTweaks_coreGetElementById=document.getElementById;
document.getElementById=function(id) {
	var e=document.coreTweaks_coreGetElementById(id);
	if (!e || !e.parentNode || e.parentNode.id!="tiddlerDisplay") return e;
	for (var i=0; i<e.parentNode.childNodes.length; i++)
		if (id==e.parentNode.childNodes[i].id) return e.parentNode.childNodes[i];
	return null;
};
}
//}}}
// // }}}
// // {{groupbox small{
// // http://trac.tiddlywiki.org/ticket/471 - OPEN
// // This tweak HIJACKS the core's saveTiddler() function to automatically add a "creator" field to a tiddler when it is FIRST created. You can use {{{<<view creator>>}}} (or {{{<<view creator wikified>>}}} if you prefer) to show this value embedded directly within the tiddler content, or {{{<span macro="view creator"></span>}}} in the ViewTemplate and/or EditTemplate to display the creator value in each tiddler.  
//{{{
// hijack saveTiddler()
TiddlyWiki.prototype.CoreTweaks_creatorSaveTiddler=TiddlyWiki.prototype.saveTiddler;
TiddlyWiki.prototype.saveTiddler=function(title,newTitle,newBody,modifier,modified,tags,fields)
{
	var existing=store.tiddlerExists(title);
	var tiddler=this.CoreTweaks_creatorSaveTiddler.apply(this,arguments);
	if (!existing) store.setValue(title,"creator",config.options.txtUserName);
	return tiddler;
}
//}}}
// // }}}
// // {{groupbox small{
// // http://trac.tiddlywiki.org/ticket/458 - CLOSED: WON'T FIX
// // This tweak assigns a "permalink"-like HREF to internal Tiddler links (which normally do not have any HREF defined).  This permits the link's context menu (right-click) to include 'open link in another window/tab' command.  Based on a request from Dustin Spicuzza.
//{{{
window.coreTweaks_createTiddlyLink=window.createTiddlyLink;
window.createTiddlyLink=function(place,title,includeText,theClass,isStatic,linkedFromTiddler,noToggle)
{
	// create the core button, then add the HREF (to internal links only)
	var link=window.coreTweaks_createTiddlyLink.apply(this,arguments);
	if (!isStatic)
		link.href=document.location.href.split("#")[0]+"#"+encodeURIComponent(String.encodeTiddlyLink(title));
	return link;
}
//}}}
// // }}}
// // {{groupbox small{
// // http://trac.tiddlywiki.org/ticket/444 - OPEN
// // When invoking a macro, this tweak makes the current containing tiddler object and DOM rendering location available as global variables (window.tiddler and window.place, respectively).  These globals can then be used within "computed macro parameters" to retrieve tiddler-relative and/or DOM-relative values or perform tiddler-specific side-effect functionality.
//{{{
window.coreTweaks_invokeMacro = window.invokeMacro;
window.invokeMacro = function(place,macro,params,wikifier,tiddler) {
	var here=story.findContainingTiddler(place);
	window.tiddler=here?store.getTiddler(here.getAttribute("tiddler")):null;
	window.place=place;
	window.coreTweaks_invokeMacro.apply(this,arguments);
}
//}}}
// // }}}
// // {{groupbox small{
// // http://trac.tiddlywiki.org/ticket/401 - CLOSED: WON'T FIX
// // This tweak allows definition of an optional [[PageTitle]] tiddler that, when present, provides alternative text for display in the browser window's titlebar, instead of using the combined text content from [[SiteTitle]] and [[SiteSubtitle]] (which will still be displayed as usual in the TiddlyWiki document header area)
//{{{
window.coreTweaks_getPageTitle=window.getPageTitle;
window.getPageTitle=function() { 
	var txt=wikifyPlain("PageTitle"); if (txt.length) return txt;
	return window.coreTweaks_getPageTitle.apply(this,arguments);
}
store.addNotification("PageTitle",refreshPageTitle); // so title stays in sync with tiddler changes
//}}}
// // }}}
// // {{groupbox small{
// // http://trac.tiddlywiki.org/ticket/67 - OPEN
// // The "missing links" list includes items contained within "quoted" text (i.e., content that will not render as wiki-syntax, and so CANNOT create any tiddler links, even if the quoted text matches valid link syntax).  This tweak removes content contained between certain delimiters before scanning tiddler source for possible links.
/***
Delimiters include:
{{{
/%...%/
{{{...}}}

"""..."""
<nowiki>...</nowiki>
<html>...</html>
<script>...</script>
}}}
***/
//{{{
Tiddler.prototype.coreTweaks_changed = Tiddler.prototype.changed;
Tiddler.prototype.changed = function()
{
	var savedtext=this.text;
	// remove 'quoted' text before scanning tiddler source
	this.text=this.text.replace(/\/%((?:.|\n)*?)%\//g,""); // /%...%/
	this.text=this.text.replace(/\{{3}((?:.|\n)*?)\}{3}/g,""); // {{{...}}}
	this.text=this.text.replace(/"{3}((?:.|\n)*?)"{3}/g,""); // """..."""

	this.text=this.text.replace(/\<nowiki\>((?:.|\n)*?)\<\/nowiki\>/g,""); // <nowiki>...</nowiki>
	this.text=this.text.replace(/\<html\>((?:.|\n)*?)\<\/html\>/g,""); // <html>...</html>

	this.text=this.text.replace(/\<script((?:.|\n)*?)\<\/script\>/g,""); // <script>...</script>
	this.coreTweaks_changed.apply(this,arguments);
	// restore quoted text to tiddler source
	this.text=savedtext;
};
//}}}
// // }}}
/***
!!! Fixed in TW240
***/
// // {{groupbox small{
// // calculate version number for conditional inclusion of tweaks below...
//{{{
var ver=version.major+version.minor/10;
//}}}
// // }}}
// // {{groupbox small{
// // http://trac.tiddlywiki.org/ticket/578 - FIXED IN TW240
// // This tweak trims any leading whitespace/newline and the trailing newline from tiddler sections
//{{{
if (ver<2.4) {
TiddlyWiki.prototype.coreTweaks_getTiddlerText = TiddlyWiki.prototype.getTiddlerText;
TiddlyWiki.prototype.getTiddlerText = function(title,defaultText)
{
	var r=TiddlyWiki.prototype.coreTweaks_getTiddlerText.apply(this,arguments);
	if (r&&title.indexOf(config.textPrimitives.sectionSeparator)!=-1)
		r=r.replace(/^[ \t]*\n/,"").replace(/\n$/,""); // trim any leading/trailing newlines
	return r;
};
}
//}}}
// // }}}
// // {{groupbox small{
// // http://trac.tiddlywiki.org/ticket/541 - FIXED IN TW240
// // This tweak adds a conditional check to the core's 'open' paramifier, so that when the document is viewed in readOnly mode, non-existent tiddlers specified using a permalink/permaview (i.e. "#TiddlerName" in the document URL) will not be displayed as an empty tiddler (which shows the "double-click to create" default text).
//{{{
if (ver<2.4) {
config.paramifiers.open = { 
onstart: function(v) { 
		if(!readOnly || store.tiddlerExists(v) || store.isShadowTiddler(v)) 
			story.displayTiddler("bottom",v,null,false,null); 
	} 
}; 
}
//}}}
// // }}}
// // {{groupbox small{
// // http://trac.tiddlywiki.org/ticket/470 - FIXED IN TW240
// // This tweak lets you set an alternative initial focus field when editing a tiddler (default field is "text")
// // Enter initial focus field name: <<option txtEditorFocus>> (//usage:// {{{<<option txtEditorFocus>>}}})
//{{{
if (ver<2.4) {
config.commands.editTiddler.coreTweaks_handler = config.commands.editTiddler.handler;
config.commands.editTiddler.handler = function(event,src,title)
{
	if (config.options.txtEditorFocus==undefined) config.options.txtEditorFocus="text";
	this.coreTweaks_handler.apply(this,arguments);
	story.focusTiddler(title,config.options.txtEditorFocus);
	return false;
};
}
//}}}
// // }}}
// // {{groupbox small{
// // http://trac.tiddlywiki.org/ticket/468 - FIXED IN TW240
// // This tweak extends the core's {{{<<tag>>}}} macro to accept additional parameters for specifying alternative label and tooltip text for the tag popup "button" link (i.e., "`PrettyTags").  Based on a suggestion by ~PBee.
//{{{
// hijack tag handler()
if (ver<2.4) {
config.macros.tag.CoreTweaks_handler=config.macros.tag.handler;
config.macros.tag.handler = function(place,macroName,params)
{
	this.CoreTweaks_handler.apply(this,arguments);
	var btn=place.lastChild;
	if (params[1]) btn.innerHTML=params[1];
	if (params[2]) btn.title=params[2];
}
}
//}}}
// // }}}
// // {{groupbox small{
// // http://trac.tiddlywiki.org/ticket/320 - FIXED IN TW240
// // This tweak updates the core's forceReflow() function to fix a Firefox rendering problem, whereby the contents of the a tiddler editor text area can be incorrectly displayed (overlapping other content) when more than one tiddler is in edit mode.
//{{{
if (ver<2.4) {
function forceReflow()
{
	if(config.browser.isGecko) {
		setStylesheet("body {top:-0px;margin-top:0px;}");
		setTimeout('setStylesheet("")',1); // invoke async to bypass browser optimization
	}
}
}
//}}}
// // }}}
// // {{groupbox small{
// // http://trac.tiddlywiki.org/ticket/42 - FIXED IN TW240
// // This tweak adjusts the left position of a TW popup so that it won't overlap with the browser window's vertical scrollbar, when present.
//{{{
if (ver<2.4) {
Popup.place = function(root,popup,offset)
{
	if(!offset) var offset = {x:0, y:0};
	var rootLeft = findPosX(root);
	var rootTop = findPosY(root);
	var rootHeight = root.offsetHeight;
	var popupLeft = rootLeft + offset.x;
	var popupTop = rootTop + rootHeight + offset.y;
	var winWidth = findWindowWidth();
	if(popup.offsetWidth > winWidth*0.75)
		popup.style.width = winWidth*0.75 + "px";
	var popupWidth = popup.offsetWidth;
	// ELS: leave space for vertical scrollbar
	var scrollWidth=winWidth-document.body.offsetWidth;
	if(popupLeft+popupWidth > winWidth-scrollWidth-1)
		popupLeft = winWidth-popupWidth-scrollWidth-1;
	popup.style.left = popupLeft + "px";
	popup.style.top = popupTop + "px";
	popup.style.display = "block";
};
}
//}}}
// // }}}
/***
!!!Unticketed Tweaks
***/
// // {{groupbox small{
// // This tweak adds an optional 'sortby' parameter to the {{{<<tag tagname label tip sortby>>}}} macro, as well as the {{{<<allTags excludeTag sortby>>}}} macro used to generate the sidebar contents 'tags' list.  Specify the field on which the contents of each tag popup is to be sorted, with a "+" or "-" prefix to indicate ascending/descending order, respectively.

// // Example: {{{<<tag systemConfig "plugins" "list plugins by date, most recent first" "-modified">>}}}
// // Try it: <<tag systemConfig "plugins" "list plugins by date, most recent first" "-modified">>

// // Similarly, to change the sort order used by the popups from all tags shown in the sidebar contents, edit the [[TagTags]] shadow tiddler and enter: {{{<<allTags excludeLists -modified>>}}}

//{{{
// hijack tag handler() to add 'sortby' attribute to tag button
config.macros.tag.CoreTweaksSortTags_handler=config.macros.tag.handler;
config.macros.tag.handler = function(place,macroName,params)
{
	this.CoreTweaksSortTags_handler.apply(this,arguments);
	var btn=place.lastChild;
	if (params[3]) btn.setAttribute("sortby",params[3]);
}

// TWEAK <<allTags>> macro to add 'sortby' attribute to each tag button
var fn=config.macros.allTags.handler;
var lines=fn.toString().split("\n");
lines.splice(lines.length-2,0,['if(params[1]) btn.setAttribute("sortby",params[1]);']);
fn=lines.join("\n");
eval("config.macros.allTags.handler="+fn);

// TWEAK event handler for clicking on a tiddler tag to use 'sortby' attribute
var fn=onClickTag;
fn=fn.toString().replace(
	/store.getTaggedTiddlers\(tag\);/g,
	'store.getTaggedTiddlers(tag);'
	+'var sortby=this.getAttribute("sortby");'
	+'if(sortby&&sortby.length) store.sortTiddlers(tagged,sortby);'
);
eval(fn);
//}}}
// // }}}
// // {{groupbox small{
// // This HIJACK tweak pre-processes source content to convert "double-backslash-newline" into {{{<br>}}} before wikify(), so that literal newlines can be embedded in line-mode wiki syntax (e.g., tables, bullets, etc.).  Based on a suggestion from Sitaram Chamarty.
//{{{
window.coreWikify = wikify;
window.wikify = function(source,output,highlightRegExp,tiddler)
{
	if (source) arguments[0]=source.replace(/\\\\\n/mg,"<br>");
	coreWikify.apply(this,arguments);
}
//}}}
// // }}}