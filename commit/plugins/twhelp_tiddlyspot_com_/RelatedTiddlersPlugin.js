/***
|Name|RelatedTiddlersPlugin|
|Source|http://www.TiddlyTools.com/#RelatedTiddlersPlugin|
|Version|1.1.5|
|Author|Eric Shulman - ELS Design Studios|
|License|http://www.TiddlyTools.com/#LegalStatements <<br>>and [[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|~CoreVersion|2.1|
|Type|plugin|
|Requires||
|Overrides||
|Description|starting from a selected tiddler, display a list and/or tree of linked or transcluded tiddlers|

!!!!!Usage
<<<
//{{{
<<relatedTiddlers TiddlerName hidecontrols "exclude list">>
//}}}
where:
*TiddlerName (optional)<br>sets the initial "root" to the specified tiddler (and hides the 'select a tiddler' form controls).  You can use keyword 'here' to specify the current tiddler.
*'hidecontrols' (optional) or 'showcontrols' (default)<br>keyword value to suppress display of 'select tiddler' droplist and buttons.
*"exclude list" (optional)<br>space-separated list of tiddlers whose links should not be followed.  use quotes or double-square brackets to ensure list is processed as a single parameter

<<<
!!!!!Configuration
<<<
<<option chkRelatedTiddlersZoom>> enable autosizing of tree display //(aka, "zoom" or "shrink-and-grow")//
don't follow links contained in these tiddlers: <<option txtRelatedTiddlersExclude>>
<<<
!!!!!Examples
<<<
{{smallform{<<relatedTiddlers>>}}}

<<<
!!!!!Installation
<<<
import (or copy/paste) the following tiddlers into your document:
RelatedTiddlersPlugin, InlineJavascriptPlugin, NestedSlidersPlugin, StyleSheetShortcuts
<<<
!!!!!Revision History
<<<
''2007.07.08 [1.1.5]'' extensive code cleanup
''2007.07.08 [1.1.0]'' converted from inline script
''2007.06.29 [1.0.0]'' started (as inline script)
<<<
!!!!!Credits
<<<
This feature was developed by Eric L. Shulman
<<<
!!!!!Code
***/
//{{{
version.extensions.RelatedTiddlersPlugin={major: 1, minor: 1, revision: 5, date: new Date(2007,7,8)};

// initialize 'autozoom' and 'exclude' tree options (defaults are not to zoom, and to follow all links)
if (config.options.chkRelatedTiddlersZoom===undefined)
	config.options.chkRelatedTiddlersZoom=false;
if (config.options.txtRelatedTiddlersExclude===undefined)
	config.options.txtRelatedTiddlersExclude='GettingStarted DefaultTiddlers SiteNews Download';
if (config.options.chkRelatedTiddlersShowList===undefined)
	config.options.chkRelatedTiddlersShowList=true;
if (config.options.chkRelatedTiddlersShowTree===undefined)
	config.options.chkRelatedTiddlersShowTree=false;

config.macros.relatedTiddlers={
	handler: function(place,macroName,params,wikifier,paramString,tiddler) {

		// create form with unique DOM element ID (using current timestamp)... permits multiple form instances
		var now=new Date().getTime();
		var span=createTiddlyElement(place,"span");
		span.innerHTML=this.form.format(["relatedTiddlers_form"+now]);
		var form=span.getElementsByTagName("form")[0]; // find form that we just created
		var target=createTiddlyElement(span,"div"); // create target block in which generated output will be placed

		// initialize droplist contents (all tiddlers)
		var tids=store.getTiddlers('title','excludeLists');
		for (i=0; i<tids.length; i++) form.list.options[form.list.options.length]=new Option(tids[i].title,tids[i].title,false,false);

		// initialize exclude field (space-separated list)
		if (config.options.txtRelatedTiddlersExclude) form.exclude.value=config.options.txtRelatedTiddlersExclude;

		// set starting tiddler, form display, and/or exclude list from macro params (if present) and then show the results!
		var root="";
		var hide=false;
		var exclude=config.options.txtRelatedTiddlersExclude;
		if (params[0]) root=params[0]; // TiddlerName
		if (params[1]) hide=(params[1].toLowerCase()=="hidecontrols"); // keyword: "hidecontrols" or "showcontrols" (default)
		if (params[2]) exclude=params[2]; // list of tiddlers whose links should not be followed
		if (root=="here") { var tid=story.findContainingTiddler(place); if (tid) root=tid.getAttribute("tiddler"); }
		if (store.tiddlerExists(root)) {
			// NOTE:  don't hide form when running IE, where putting initial focus on hidden form creates an error
			if (!config.browser.isIE) form.style.display=hide?"none":"block"; // show/hide the controls
			form.list.value=root; // set the root
			form.exclude.value=exclude; // set 'exclude' field
			form.get.click(); // DISPLAY INITIAL RESULTS (if tiddler is selected)
		}
	},
	form:
		"<form id='%0' action='javascript:;' style='display:inline;margin:0;padding:0;' onsubmit='return false'><!-- \
		--><span class='fine' style='float:left;width:39.5%;'><i>find all tiddlers related to:</i></span><!-- \
		--><span class='fine' style='float:left;'><i>exclude links contained in:</i></span><!-- \
		--><div style='clear:both'><!-- \
		--><select name=list size=1 style='width:39.5%' onchange='this.form.get.click()'><!-- \
		--><option value=''>select a tiddler...</option><!-- \
		--></select><!-- \
		--><input type='text' option='txtRelatedTiddlersExclude' name='exclude' value='' style='width:40%' \
			title='enter the names of tiddlers whose links should NOT be followed' \
			onkeyup='if (event.keyCode==13) { this.blur(); this.form.get.click(); }'  \
			onchange='config.options[this.getAttribute(\"option\")]=this.value;saveOptionCookie(this.getAttribute(\"option\"));'><!-- \
		--><input type=button name=get value='get related' style='width:10%'  \
			onclick='config.macros.relatedTiddlers.show(this.form,this.form.nextSibling);'><!-- \
		--><input type=button name=done value='done' disabled style='width:10%'  \
			onclick='this.form.list.selectedIndex=0; this.form.get.click();'><!-- \
		--></div><!-- \
		--></form>",
	styles:
		".relatedTiddlers blockquote \
			{ border-left:1px dotted #999; margin:0 25px; padding-left:.5em; font-size:%0%; line-height:115%; } \
		.relatedTiddlers .borderleft \
			{ margin:0; padding:0; margin-left:1em; border-left:1px dotted #999; padding-left:.5em; } \
		.relatedTiddlers .fourcolumns \
			{ display:block; -moz-column-count:4; -moz-column-gap:1em; -moz-column-width:25%} \
		.relatedTiddlers a \
			{ font-weight:normal; } \
		.relatedTiddlers .bold, .relatedTiddlers .bold a \
			{ font-weight:bold; } \
		.relatedTiddlers .floatright \
			{ float:right; } \
		.relatedTiddlers .clear \
			{ clear:both; }	",
	toggle:
		"{{floatright{<html><a href='javascript:;' class='button' title='show/hide tiddler selection droplist and buttons' \
		onclick='var here=story.findContainingTiddler(this); var tid=here?here.getAttribute(\"tiddler\"):\"\"; \
			var f=document.getElementById(\"%0\"); var hide=(f.style.display!=\"none\"); \
			f.style.display=hide?\"none\":\"inline\"; this.innerHTML=hide?\"show form\":\"hide form\"; return false;'>%1</a></html>}}}",
	treecheck:
		"{{floatright{@@display:none;<<option chkRelatedTiddlersShowTree>>@@<html><a href='javascript:;' class='button' onclick='this.parentNode.previousSibling.firstChild.click(); return false;'>tree view</a></html>}}}",
	tree:
		"{{clear{\n----\n}}} \
		{{floatright small{<<option chkRelatedTiddlersZoom>>autosize tree display}}} \
		{{%0{\n%1}}}",
	listcheck:
		"{{floatright{@@display:none;<<option chkRelatedTiddlersShowList>>@@<html><a href='javascript:;' class='button' onclick='this.parentNode.previousSibling.firstChild.click(); return false;'>list view</a></html>}}}",
	list:
		"{{clear{\n----\n}}} \
		{{fine{\n''tiddlers containing links to'' [[%0]]\n}}} \
		{{small fourcolumns borderleft{\n%1}}} \
		{{fine{\n''tiddlers linked from or included by'' [[%0]]\n}}} \
		{{borderleft{\n \
			{{fine{\n''bold''=//direct links//, plain=//indirect links//, ''...''=//links not followed//}}} \
			{{small fourcolumns{\n%2}}} \
		}}}",
	skipped:
		"<html><span title='links from %0 have NOT been followed'>...</span></html>",
	mouseover: function(ev) {
		this.saveSize=this.style.fontSize;
		this.style.fontSize='100%';
		this.style.borderLeftStyle='solid';
	},
	mouseout: function(ev) {
		this.style.fontSize=this.saveSize;
		this.style.borderLeftStyle='dotted';
	},
	findRelatedTiddlers: function(tid,tids,treeout,level,exclude) { // recursively build list of related tids 
		// get related tiddlers  (links and includes FROM the root tiddler) and generate listview/treeview output
		var t=store.getTiddler(tid);
		if (!t || tids.contains(tid)) return tids; // tiddler already in results (or missing tiddler)
		tids.push(t.title); // add tiddler to results
		var skip=exclude && exclude.contains(tid);
		treeout.text+=level+"[["+tid+"]]"+(skip?this.skipped.format([tid]):"")+"\n";
		if (skip) return tids; // tiddler is pruned... don't follow excluded links
		// gather child links and sort for breadth-first traversal of the tree
		if (!t.linksUpdated) t.changed();
		var children=[];
		for (var i=0; i<t.links.length; i++) {
			if (t.links[i]==tid) continue; // exclude self
			var c=store.getTiddler(t.links[i]); if (!c) continue; // exclude missing tiddlers
			if (!c.linksUpdated) c.changed();
			children.push({tid:c.title,count:c.links.length}); 
		}
		children.sort(function (a,b){if(a.count==b.count)return(0);else return(a.count<b.count)?+1:-1;});
		for (var i=0; i<children.length; i++)
			tids=this.findRelatedTiddlers(children[i].tid,tids,treeout,level+">",exclude);
		return tids;
	},
	show: function(form,target) {
		removeChildren(target); form.done.disabled=true; // clear any existing output and disable 'done' button
		var start=form.list.value; if (!start.length) return; // get selected starting tiddler.  If blank value (heading), do nothing

		// get related tiddlers and generate blockquote-indented tree output
		var tids=[]; var treeview={text:""}; var level="";
		var exclude=config.options.txtRelatedTiddlersExclude.readBracketedList();
		var tids=this.findRelatedTiddlers(start,tids,treeview,level,exclude);
		tids.shift(); // remove self from list
		tids.sort(); // sort titles alphabetically

		// generate list output
		var tid=store.getTiddler(start);
		var relsview=""; for (t=0; t<tids.length; t++) {
			relsview+=tid.links.contains(tids[t])?("{{bold{[["+tids[t]+"]]}}}"):("[["+tids[t]+"]]");
			if (exclude && exclude.contains(tids[t])) relsview+=this.skipped.format([tids[t]]);
			relsview+="\n";
		}
	
		// get references TO the root tiddler, add to related tiddlers and generate refsview output
		var refs=[]; var referers=store.getReferringTiddlers(start);
		for(var r=0; r<referers.length; r++)
			if(referers[r].title!=start && !referers[r].tags.contains("excludeLists")) refs.push(referers[r].title);
		var refcount=refs.length; var relcount=tids.length; // remember individual counts
		for (var r=0; r<refs.length; r++) tids.pushUnique(refs[r]); // combine lists without duplicates
		var total=tids.length; // get combined total
		var refsview="[["+refs.sort().join("]]\n[[")+"]]\n";
	
		// set custom blockquote styles for treeview
		setStylesheet(this.styles.format([config.options.chkRelatedTiddlersZoom?80:100]),'relatedTiddlers_styles');

		// assemble and render output
		var summary=(total?(total+" tiddler"+(total==1?" is":"s are")):"There are no tiddlers")+" related to: [["+start+"]]";
		var list=this.list.format([start,refsview,relsview.length?relsview:"//no related tiddlers//"]);
		var tree=this.tree.format([config.options.chkRelatedTiddlersZoom?"normal":"small",treeview.text]);
		var hide=this.toggle.format([form.id,(form.style.display=='none'?'show form':'hide form')]);
		var sep="{{floatright{ | }}}";
		var showList=total && config.options.chkRelatedTiddlersShowList;
		var showTree=relcount && config.options.chkRelatedTiddlersShowTree;
		var out="{{relatedTiddlers{"+hide+(relcount?sep+this.treecheck:"")+(total?sep+this.listcheck:"")+summary+(showList?list:"")+(showTree?tree:"")+"}}}";
		wikify(out,target);
		form.done.disabled=false; // enable 'done' button

		// add mouseover/mouseout handling to blockquotes (for autosizing)
		var blocks=target.getElementsByTagName("blockquote");
		for (var b=0; b<blocks.length; b++)
			{ blocks[b].onmouseover=this.mouseover; blocks[b].onmouseout=this.mouseout; }

		// add side-effect to checkboxes so that display is refreshed when a checkbox state is changed
		var checks=target.getElementsByTagName("input");
		for (var c=0; c<checks.length; c++) {
			if (checks[c].type.toLowerCase()!="checkbox") continue;
			checks[c].coreClick=checks[c].onclick; // save standard click handler
			checks[c].formID=form.id; // link checkbox with correponding form
			checks[c].onclick=function() { this.coreClick.apply(this,arguments); document.getElementById(this.formID).get.click(); }
		}
	}
}
//}}}