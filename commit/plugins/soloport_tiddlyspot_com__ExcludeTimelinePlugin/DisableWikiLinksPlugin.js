/***
|''Name:''|DisableWikiLinksPlugin|
|''Source:''|http://www.TiddlyTools.com/#DisableWikiLinksPlugin|
|''Author:''|Eric Shulman - ELS Design Studios|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|''~CoreVersion:''|2.0.10|

This plugin allows you to disable TiddlyWiki's automatic WikiWord linking behavior, so that WikiWords embedded in tiddler content will be rendered as regular text, instead of being automatically converted to tiddler links.  To create a tiddler link when automatic linking is disabled, you must enclose the link text within {{{[[...]]}}}.  Note: WikiWords contained in default ''shadow'' tiddlers will still be automatically linked.  An additional checkbox option lets you disable these automatic links as well, though this is not recommended, since it can make it more difficult to access some TiddlyWiki standard default content (such as AdvancedOptions or SideBarTabs)

!!!!!Configuration
<<<
Self-contained control panel:
<<option chkDisableWikiLinks>> Disable automatic WikiWord tiddler links
<<option chkDontDisableShadowWikiLinks>> ... except in shadow tiddler content
<<<
!!!!!Installation
<<<
import (or copy/paste) the following tiddlers into your document:
''DisableWikiLinksPlugin'' (tagged with <<tag systemConfig>>)
<<<
!!!!!Revision History
<<<
''2006.05.24 [1.1.0]'' added option to NOT bypass automatic wikiword links when displaying default shadow content (default is to auto-link shadow content)
''2006.02.05 [1.0.1]'' wrapped wikifier hijack in init function to eliminate globals and avoid FireFox 1.5.0.1 crash bug when referencing globals
''2005.12.09 [1.0.0]'' initial release
<<<
!!!!!Credits
<<<
This feature was developed by EricShulman from [[ELS Design Studios|http:/www.elsdesign.com]]
<<<
!!!!!Code
***/
//{{{
version.extensions.disableWikiLinks= {major: 1, minor: 1, revision: 0, date: new Date(2006,5,24)};

if (config.options.chkDisableWikiLinks==undefined) config.options.chkDisableWikiLinks= false;
if (config.options.chkDontDisableShadowWikiLinks==undefined) config.options.chkDontDisableShadowWikiLinks=true;

// find the formatter for wikiLink and replace handler with 'pass-thru' rendering
initDisableWikiLinksFormatter();
function initDisableWikiLinksFormatter() {
	for (var i=0; i<config.formatters.length && config.formatters[i].name!="wikiLink"; i++);
	config.formatters[i].coreHandler=config.formatters[i].handler;
	config.formatters[i].handler=function(w) {
		// if not enabled, just do standard WikiWord link formatting
		var skipShadow=(config.options.chkDontDisableShadowWikiLinks && w.tiddler &&  store.isShadowTiddler(w.tiddler.title) && !store.tiddlerExists(w.tiddler.title));
		if (!config.options.chkDisableWikiLinks || skipShadow) return this.coreHandler(w);
		// supress any leading "~" (if present)
		var skip=(w.matchText.substr(0,1)==config.textPrimitives.unWikiLink)?1:0;
		w.outputText(w.output,w.matchStart+skip,w.nextMatch)
	}
}
//}}}
