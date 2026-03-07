/***
|Name|GotoPlugin|
|Source|http://www.TiddlyTools.com/#GotoPlugin|
|Documentation|http://www.TiddlyTools.com/#GotoPluginInfo|
|Version|1.6.1|
|Author|Eric Shulman - ELS Design Studios|
|License|http://www.TiddlyTools.com/#LegalStatements <br>and [[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|~CoreVersion|2.1|
|Type|plugin|
|Requires||
|Overrides||
|Description|view any tiddler by entering it's title - displays list of possible matches|
''View a tiddler by typing its title and pressing //enter//.''  As you type, a list of possible matches is displayed.  You can scroll-and-click (or use arrows+enter) to select/view a tiddler, or press //escape// to close the listbox to resume typing.  When the listbox is ''//not//'' being displayed, press //escape// to clear the current text input and start over.
!!!!!Documentation
>see [[GotoPluginInfo]]
!!!!!Revisions
<<<
2008.10.02 [1.6.1] for IE, wrap controls in a table.  Corrects placement of listbox so it is below input field.
|please see [[GotoPluginInfo]] for additional revision details|
2006.05.05 [0.0.0] started
<<<
!!!!!Code
***/
//{{{
version.extensions.GotoPlugin= {major: 1, minor: 6, revision: 1, date: new Date(2008,10,2)};

// automatically tweak shadow SideBarOptions to add <<gotoTiddler>> macro above <<search>>
config.shadowTiddlers.SideBarOptions=config.shadowTiddlers.SideBarOptions.replace(/<<search>>/,"{{button{goto}}}\n<<gotoTiddler>><<search>>");

config.macros.gotoTiddler= { 
	listMaxSize: 10,
	listHeading: 'Found %0 matching title%1...',
	searchItem: "Search for '%0'...",
	handler:
	function(place,macroName,params) {
		var quiet=(params[0] && params[0]=="quiet"); if (quiet) params.shift();
		var insert=(params[0] && params[0]=="insert"); if (insert) params.shift();
		var search=(params[0] && params[0]=="search"); if (search) params.shift();
		var instyle=params.shift(); if (!instyle) instyle="";
		var liststyle=params.shift(); if (!liststyle) liststyle="";
		var keyevent=window.event?"onkeydown":"onkeypress";

		var html=this.html;
		html=html.replace(/%keyevent%/g,keyevent);
		html=html.replace(/%search%/g,search);
		html=html.replace(/%insert%/g,insert);
		html=html.replace(/%quiet%/g,quiet);
		html=html.replace(/%instyle%/g,instyle);
		html=html.replace(/%liststyle%/g,liststyle);
		if (config.browser.isIE) html=this.IEtableFixup.format([html]);
		createTiddlyElement(place,"span").innerHTML=html;
	},

	html:
	'<form onsubmit="return false" style="display:inline;margin:0;padding:0">\
		<input name=gotoTiddler type=text autocomplete="off" accesskey="G" style="%instyle%"\
			title="enter a tiddler title"\
			onclick="this.form.list.style.display=\'none\';"\
			onfocus="this.select(); this.setAttribute(\'accesskey\',\'G\');"\
			%keyevent%="return config.macros.gotoTiddler.inputEscKeyHandler(event,this,this.form.list);"\
			onkeyup="return config.macros.gotoTiddler.inputKeyHandler(event,this,this.form.list,%quiet%,%insert%,%search%);">\
		<select name=list style="%liststyle%;display:none;position:absolute"\
			onchange="if (!this.selectedIndex) this.selectedIndex=1;"\
			onblur="this.style.display=\'none\';"\
			%keyevent%="return config.macros.gotoTiddler.selectKeyHandler(event,this,this.form.gotoTiddler,%insert%);"\
			onclick="return config.macros.gotoTiddler.processItem(this.value,this.form.gotoTiddler,this,%insert%);">\
		</select>\
	</form>',

	IEtableFixup:
	"<table style='width:100%;display:inline;padding:0;margin:0;border:0;'>\
		<tr style='padding:0;margin:0;border:0;'><td style='padding:0;margin:0;border:0;'>\
		%0</td></tr></table>",

	getItems:
	function(val) {
		if (!this.items.length || val.length<2) { // starting new search, refresh cached list of tiddlers/shadows/tags
			this.items=new Array();
			var tiddlers=store.getTiddlers("title","excludeLists");
			for(var t=0; t<tiddlers.length; t++) this.items.push(tiddlers[t].title);
			for (var t in config.shadowTiddlers) this.items.pushUnique(t);
			var tags=store.getTags();
			for(var t=0; t<tags.length; t++) this.items.pushUnique(tags[t][0]);
		}
		var found = [];
		var match=val.toLowerCase();
		for(var i=0; i<this.items.length; i++)
			if (this.items[i].toLowerCase().indexOf(match)!=-1) found.push(this.items[i]);
		return found;
	},
	items: [], // cached list of tiddlers/shadows/tags

	getItemSuffix:
	function(t) {
		if (store.tiddlerExists(t)) return "";  // tiddler
		if (store.isShadowTiddler(t)) return " (shadow)"; // shadow
		return " (tag)"; // tag 
	},

	keyProcessed:
	function(ev) { // utility function: exits handler and prevents browser from processing the keystroke
		ev.cancelBubble=true; // IE4+
		try{event.keyCode=0;}catch(e){}; // IE5
		if (window.event) ev.returnValue=false; // IE6
		if (ev.preventDefault) ev.preventDefault(); // moz/opera/konqueror
		if (ev.stopPropagation) ev.stopPropagation(); // all
		return false;
	},

	inputEscKeyHandler:
	function(event,here,list) {
		var key=event.keyCode;
		// escape... hide list (2nd esc=clears input)
		if (key==27) {
			if (list.style.display=="none")
				here.value=here.defaultValue;
			list.style.display="none";
			return this.keyProcessed(event);
		}
		return true; // key bubbles up
	},

	inputKeyHandler:
	function(event,here,list,quiet,insert,search) {
		var key=event.keyCode;
		// non-printing chars... bubble up, except: backspace=8, enter=13, space=32, down=40, delete=46
		if (key<48) switch(key) { case 8: case 13: case 32: case 40: case 46: break; default: return true; }
		// blank input... if down/enter... fall through (list all)... else, and hide list
		if (!here.value.length && !(key==40 || key==13))
			{ list.style.display="none"; return this.keyProcessed(event); }
		// find matching items...
		var found = this.getItems(here.value);
		// non-blank input... enter key... show/create tiddler
		if (key==13) return this.processItem(here.value,here,list,insert);
		// make sure list is shown (unless quiet option)
		list.style.display=!quiet?"block":"none";
		// down key... shows/moves to list...
		if (key==40)  { list.style.display="block"; list.focus(); }
		// if list is showing, fill it with found results...
		var indent='\xa0\xa0\xa0';
		if (list.style.display!="none") {
			while (list.length > 0) list.options[0]=null; // clear list
			found.sort(); // alpha by title
			var hdr=this.listHeading.format([found.length,found.length==1?"":"s"]);
			list.options[0]=new Option(hdr,"",false,false);
			for (var t=0; t<found.length; t++) list.options[list.length]=
				new Option(indent+found[t]+this.getItemSuffix(found[t]),found[t],false,false);
			if (search)
				list.options[list.length]=new Option(this.searchItem.format([here.value]),"*",false,false);
			list.size=(list.length<this.listMaxSize?list.length:this.listMaxSize); // resize list...
			list.selectedIndex=(key==40 || key==13)?1:0;
		}
		return true; // key bubbles up
	},

	selectKeyHandler:
	function(event,list,editfield,insert) {
		if (event.keyCode==27) // escape... hide list, move to edit field
			{ editfield.focus(); list.style.display="none"; return this.keyProcessed(event); }
		if (event.keyCode==13 && list.value.length) // enter... view selected item
			{ this.processItem(list.value,editfield,list,insert); return this.keyProcessed(event); }
		return true; // key bubbles up
	},

	processItem:
	function(title,here,list,insert) {
		if (!title.length) return;
		list.style.display='none';
		if (title=="*")	{ story.search(here.value); return false; } // do full-text search
		here.value=title;
		if (insert) {
			var tidElem=story.findContainingTiddler(here); if (!tidElem) { here.focus(); return false; }
			var e=story.getTiddlerField(tidElem.getAttribute("tiddler"),"text");
			if (!e||e.getAttribute("edit")!="text") return false;
			var txt=prompt(this.askForText,title); if (!txt||!txt.length) { here.focus(); return false; }
			e.focus(); // put focus on target field before setting selection
			replaceSelection(e,"[["+txt+"|"+title+"]]"); // insert selected tiddler as a PrettyLink
		}
		else
			story.displayTiddler(null,title); // show selected tiddler
		return false;
	},
	askForText: "Enter the text to display for this link"

}
//}}}