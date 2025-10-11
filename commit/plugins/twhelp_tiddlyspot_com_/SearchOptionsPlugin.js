/***
|Name|SearchOptionsPlugin|
|Source|http://www.TiddlyTools.com/#SearchOptionsPlugin|
|Documentation|http://www.TiddlyTools.com/#SearchOptionsPluginInfo|
|Version|2.9.2|
|Author|Eric Shulman - ELS Design Studios|
|License|http://www.TiddlyTools.com/#LegalStatements <br>and [[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|~CoreVersion|2.1|
|Type|plugin|
|Requires||
|Overrides|Story.prototype.search, TiddlyWiki.prototype.search, config.macros.search.onKeyPress|
|Options|##Configuration|
|Description|extend core search function with additional user-configurable options|
Extend core search function with additional user-configurable options including selecting which data items to search, enabling/disabling incremental key-by-key searches, and generating a ''list of matching tiddler'' instead of immediately displaying all matches.  This plugin also adds syntax for rendering 'search links' within tiddler content to embed one-click searches using pre-defined 'hard-coded' search terms.
!!!!!Documentation
>see [[SearchOptionsPluginInfo]]
!!!!!Configuration
<<<
Search in:
<<option chkSearchTitles>> titles <<option chkSearchText>> text <<option chkSearchTags>> tags <<option chkSearchFields>> fields <<option chkSearchShadows>> shadows

<<option chkSearchList>> Show list of matches
<<option chkSearchListTiddler>> Write list to [[SearchResults]] tiddler
<<option chkIncrementalSearch>> Incremental (key-by-key) searching
<<option chkSearchTitlesFirst>> Show title matches first
<<option chkSearchByDate>> Sort matching tiddlers by date
<<<
!!!!!Revisions

<<<
2008.08.25 [2.9.2] added animation to #searchResults DIV.  Also, DIV is only auto-created if it does not exist ... and when closed, the DIV is simply hidden rather than removed.  This allows custom placement of search results report in the PageTemplate definition.
|please see [[SearchOptionsPluginInfo]] for additional revision details|
2005.10.18 [1.0.0] Initial Release
<<<
!!!!!Code
***/
//{{{
version.extensions.searchOptions = {major: 2, minor: 9, revision: 2, date: new Date(2008,8,25)};

if (config.options.chkSearchTitles===undefined) config.options.chkSearchTitles=true;
if (config.options.chkSearchText===undefined) config.options.chkSearchText=true;
if (config.options.chkSearchTags===undefined) config.options.chkSearchTags=true;
if (config.options.chkSearchFields===undefined) config.options.chkSearchFields=true;
if (config.options.chkSearchTitlesFirst===undefined) config.options.chkSearchTitlesFirst=true;
if (config.options.chkSearchList===undefined) config.options.chkSearchList=true;
if (config.options.chkSearchListTiddler===undefined) config.options.chkSearchListTiddler=false;
if (config.options.chkSearchByDate===undefined) config.options.chkSearchByDate=false;
if (config.options.chkIncrementalSearch===undefined) config.options.chkIncrementalSearch=true;
if (config.options.chkSearchShadows===undefined) config.options.chkSearchShadows=true;
if (config.macros.search.reportTitle==undefined)
	config.macros.search.reportTitle="SearchResults"; // note: not a cookie!
//}}}

//{{{
// searchLink formatter:
// syntax: [search[text to find]] OR [search[text to display|text to find]]
config.formatters.push( {
	name: "searchLink",
	match: "\\[search\\[",
	lookaheadRegExp: /\[search\[(.*?)(?:\|(.*?))?\]\]/mg,
	prompt: "search for: '%0'",
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			var label=lookaheadMatch[1];
			var text=lookaheadMatch[2]||label;
			var prompt=this.prompt.format([text]);
			var btn=createTiddlyButton(w.output,label,prompt,
				function(){story.search(this.getAttribute("searchText"))},"searchLink");
			btn.setAttribute("searchText",text);
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		}
	}
});
//}}}

//{{{
config.macros.search.searchOptions_onKeyPress = config.macros.search.onKeyPress;
config.macros.search.onKeyPress = function(e)
{
	if(!e) var e = window.event;
	if (config.options.chkIncrementalSearch || e.keyCode==13 || e.keyCode==10 || e.keyCode==27)
		config.macros.search.searchOptions_onKeyPress.apply(this,arguments);
}
//}}}

//{{{
Story.prototype.search = function(text,useCaseSensitive,useRegExp)
{
	highlightHack = new RegExp(useRegExp ? text : text.escapeRegExp(),useCaseSensitive ? "mg" : "img");
	var matches = store.search(highlightHack,config.options.chkSearchByDate?"modified":"title","excludeSearch");
	if (config.options.chkSearchByDate) matches=matches.reverse(); // most recent changes first
	var q = useRegExp ? "/" : "'";
	clearMessage();
	if (!matches.length) {
		if (config.options.chkSearchListTiddler) discardSearchResults();
		displayMessage(config.macros.search.failureMsg.format([q+text+q]));
	} else {
		if (config.options.chkSearchList||config.options.chkSearchListTiddler) 
			reportSearchResults(text,matches);
		else {
			var titles = []; for(var t=0; t<matches.length; t++) titles.push(matches[t].title);
			this.closeAllTiddlers(); story.displayTiddlers(null,titles);
			displayMessage(config.macros.search.successMsg.format([matches.length, q+text+q]));
		}
	}
	highlightHack = null;
}
//}}}

//{{{
TiddlyWiki.prototype.search = function(searchRegExp,sortField,excludeTag)
{
	var candidates = this.reverseLookup("tags",excludeTag,false,sortField);

	// scan for matching titles first...
	var results = [];
	if (config.options.chkSearchTitles) {
		for(var t=0; t<candidates.length; t++)
			if(candidates[t].title.search(searchRegExp)!=-1)
				results.push(candidates[t]);
		if (config.options.chkSearchShadows)
			for (var t in config.shadowTiddlers)
				if ((t.search(searchRegExp)!=-1) && !store.tiddlerExists(t))
					results.push((new Tiddler()).assign(t,config.shadowTiddlers[t]));
	}
	// then scan for matching text, tags, or field data
	for(var t=0; t<candidates.length; t++) {
		if (config.options.chkSearchText && candidates[t].text.search(searchRegExp)!=-1)
			results.pushUnique(candidates[t]);
		if (config.options.chkSearchTags && candidates[t].tags.join(" ").search(searchRegExp)!=-1)
			results.pushUnique(candidates[t]);
		if (config.options.chkSearchFields && store.forEachField!=undefined) // requires TW2.1 or above
			store.forEachField(candidates[t],
				function(tid,field,val) {
					if (val.search(searchRegExp)!=-1) results.pushUnique(candidates[t]);
				},
				true); // extended fields only
	}
	// then check for matching text in shadows
	if (config.options.chkSearchShadows)
		for (var t in config.shadowTiddlers)
			if ((config.shadowTiddlers[t].search(searchRegExp)!=-1) && !store.tiddlerExists(t))
				results.pushUnique((new Tiddler()).assign(t,config.shadowTiddlers[t]));

	// if not 'titles first', or sorting by modification date,  re-sort results to so titles, text, tag and field matches are mixed together
	if(!sortField) sortField = "title";
	var bySortField=function (a,b) {if(a[sortField] == b[sortField]) return(0); else return (a[sortField] < b[sortField]) ? -1 : +1; }
	if (!config.options.chkSearchTitlesFirst || config.options.chkSearchByDate) results.sort(bySortField);

	return results;
}
//}}}

//{{{
// SearchResults REPORT GENERATOR

// hijack core <<search>> macro to add "report" and "simple inline" output
config.macros.search.SOP_handler=config.macros.search.handler;
config.macros.search.handler = function(place,macroName,params)
{
	// if "report", use SearchOptionsPlugin report generator for inline output
	if (params[1]&&params[1].substr(0,6)=="report") {
		var keyword=params[0];
		var options=params[1].split("=")[1]; // split "report=option+option+..."

		var heading=params[2]?params[2].unescapeLineBreaks():"";
		var matches=store.search(new RegExp(keyword.escapeRegExp(),"img"),"title","excludeSearch");
		if (matches.length) wikify(heading+window.formatSearchResults(keyword,matches,options),place);
	} else if (params[1]) {
		var keyword=params[0];
		var heading=params[1]?params[1].unescapeLineBreaks():"";
		var seperator=params[2]?params[2].unescapeLineBreaks():", ";
		var matches=store.search(new RegExp(keyword.escapeRegExp(),"img"),"title","excludeSearch");
		if (matches.length) {
			var out=[];
			for (var m=0; m<matches.length; m++) out.push("[["+matches[m].title+"]]");
			wikify(heading+out.join(seperator),place);
		}
	} else
		config.macros.search.SOP_handler.apply(this,arguments);
};

if (!window.reportSearchResults) window.reportSearchResults=function(text,matches)
{
	// create/update the tiddler
	var body=window.formatSearchResults(text,matches);
	if (config.options.chkSearchListTiddler) {
		var title=config.macros.search.reportTitle;
		var who=config.options.txtUserName;
		var when=new Date();
		var tags="excludeLists excludeSearch temporary";
		var tiddler=store.getTiddler(title); if (!tiddler) tiddler=new Tiddler();
		tiddler.set(title,body,who,when,tags);
		store.addTiddler(tiddler);
		story.closeTiddler(title);
		story.displayTiddler(null,title);
		store.notify(title,true);
	} else {
		var sr=document.getElementById("searchResults");
		if (!sr) {
			sr=createTiddlyElement(null,"div","searchResults","tiddler");
			var da=document.getElementById("displayArea");
			da.insertBefore(sr,da.firstChild);
		}
		addClass(sr,"tiddler");
		sr.onmouseover = function(e){ addClass(this,"selected"); }
		sr.onmouseout = function(e){ removeClass(this,"selected"); }
		sr.style.zIndex = "1000";
		removeChildren(sr);
		if (config.macros.moveablePanel) wikify("<<moveablePanel>>",sr); /* see MoveablePanelPlugin */
		var tb=createTiddlyElement(sr,"div",null,"toolbar");
		var b=createTiddlyButton(tb, "open all", "open all matching tiddlers", function() {
				story.displayTiddlers(null,this.getAttribute("list").readBracketedList());
			},"button");
		var list=""; for(var t=0;t<matches.length;t++) list+='[['+matches[t].title+']] ';
		b.setAttribute("list",list);
		var b=createTiddlyButton(tb, "close", "dismiss search results", function() {
				var sr=document.getElementById("searchResults");
				if(!config.options.chkAnimate) {
					sr.style.display="none";
					removeChildren(sr);
				} else {
					var s=new Slider(sr,false,false,"children");
					anim.startAnimating(s);
				}
			}, "button");
		createTiddlyText(createTiddlyElement(sr,"div",null,"title"),"Search Results");
		wikify(body,createTiddlyElement(sr,"div",null,"viewer"));
		if (sr.style.display!="block") {
			if(!config.options.chkAnimate)
				sr.style.display="block";
			else {
				var s=new Slider(sr,true,false,"none");
				s.callback=function(e,p){e.style.overflow="visible";}
				anim.startAnimating(s);
			}
		}
		window.scrollTo(0,ensureVisible(sr));
	}
}

if (!window.formatSearchResults) window.formatSearchResults=function(text,matches,opt)
{
	var title=config.macros.search.reportTitle
	var q = config.options.chkRegExpSearch ? "/" : "'";
	var body="";
	if (!opt) var opt="all";
	var parts=opt.split("+");
	for (var i=0; i<parts.length; i++) { var p=parts[i].toLowerCase();
		if (p=="summary"||p=="all")
			body+=window.formatSearchResults_summary(text,matches);
		if (p=="list"||p=="all")
			body+=window.formatSearchResults_list(text,matches);
		if (p=="buttons"||p=="all")
			body+=window.formatSearchResults_buttons(text,matches);
		if (p=="again"||p=="all")
			body+=window.formatSearchResults_again(text,matches);
	}
	return body;
}

if (!window.formatSearchResults_summary) window.formatSearchResults_summary=function(text,matches)
{
	// summary: nn tiddlers found matching '...', options used
	var title=config.macros.search.reportTitle
	var q = config.options.chkRegExpSearch ? "/" : "'";
	var body="";
	body+="''"+config.macros.search.successMsg.format([matches.length,q+"{{{"+text+"}}}"+q])+"''\n";
	body+="^^//searched in:// ";
	body+=(config.options.chkSearchTitles?"''titles'' ":"");
	body+=(config.options.chkSearchText?"''text'' ":"");
	body+=(config.options.chkSearchTags?"''tags'' ":"");
	body+=(config.options.chkSearchFields?"''fields'' ":"");
	body+=(config.options.chkSearchShadows?"''shadows'' ":"");
	if (config.options.chkCaseSensitiveSearch||config.options.chkRegExpSearch) {
		body+=" //with options:// ";
		body+=(config.options.chkCaseSensitiveSearch?"''case sensitive'' ":"");
		body+=(config.options.chkRegExpSearch?"''text patterns'' ":"");
	}
	body+="^^\n";
	return body;
}

if (!window.formatSearchResults_list) window.formatSearchResults_list=function(text,matches)
{
	// bullet list of links to matching tiddlers
	var body="";
	for(var t=0;t<matches.length;t++) {
		var date=config.options.chkSearchByDate?(matches[t].modified.formatString('YYYY.0MM.0DD 0hh:0mm')+" "):"";
		body+="* "+date+"[["+matches[t].title+"]]\n";
	}
	return body;
}

if (!window.formatSearchResults_buttons) window.formatSearchResults_buttons=function(text,matches)
{
	// embed buttons only if writing SearchResults to tiddler
	if (!config.options.chkSearchListTiddler) return "";

	// open all matches button
	var body="";
	var title=config.macros.search.reportTitle;
	body+="@@diplay:block;<html><input type=\"button\" href=\"javascript:;\" ";
	body+="onclick=\"story.displayTiddlers(null,["

	for(var t=0;t<matches.length;t++)
		body+="'"+matches[t].title.replace(/\'/mg,"\\'")+"'"+((t<matches.length-1)?", ":"");
	body+="],1);\" accesskey=\"O\" value=\"open all matching tiddlers\"></html> ";

	// discard search results button
	body+="<html><input type=\"button\" href=\"javascript:;\" ";
	body+="onclick=\"discardSearchResults()\" value=\"discard "+title+"\"></html>";
	body+="@@\n";
	return body;
}

if (!window.formatSearchResults_again) window.formatSearchResults_again=function(text,matches)
{
	var title=config.macros.search.reportTitle
	var body="";
	// search again
	body+="!!!Search again:\n";
	body+="<<search \""+text+"\">>\n";
	body+="<<option chkSearchTitles>>titles ";
	body+="<<option chkSearchText>>text ";
	body+="<<option chkSearchTags>>tags";
	body+="<<option chkSearchFields>>fields";
	body+="<<option chkSearchShadows>>shadows";
	body+="<br>";
	body+="<<option chkCaseSensitiveSearch>>case-sensitive ";
	body+="<<option chkRegExpSearch>>text patterns";
	body+="<<option chkSearchByDate>>sort by date";
	body+="<br>";
	return body;
}


if (!window.discardSearchResults) window.discardSearchResults=function()
{
	// remove the tiddler
	story.closeTiddler(config.macros.search.reportTitle);
	store.deleteTiddler(config.macros.search.reportTitle);
	store.notify(config.macros.search.reportTitle,true);
}
//}}}