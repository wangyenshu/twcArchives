/***
|Name|TaskMacroPlugin|
|Author|<<extension TaskMacroPlugin author>>|
|Location|<<extension TaskMacroPlugin source>>|
|License|<<extension TaskMacroPlugin license>>|
|Version|<<extension TaskMacroPlugin versionAndDate>>|
!Description
A set of macros to help you keep track of time estimates for tasks.

Macros defined:
* {{{task}}}: Displays a task description and makes it easy to estimate and track the time spent on the task.
* {{{taskadder}}}: Displays text entry field to simplify the adding of tasks.
* {{{tasksum}}}: Displays a summary of tasks sandwiched between two calls to this macro.
* {{{extension}}}: A simple little macro that displays information about a TiddlyWiki plugin, and that will hopefully someday migrate to the TW core in some form.
Core overrides:
* {{{wikify}}}: when wikifying a tiddler's complete text, adds refresh information so the tiddler will be refreshed when it changes
* {{{config.refreshers}}}: have the built-in refreshers return true; also, add a new refresher ("fullContent") that redisplays a full tiddler whenever it or any nested tiddlers it shows are changed
* {{{refreshElements}}}: now checks the return value from the refresher and only short-circuits the recursion if the refresher returns true
!Plugin Information
***/
//{{{
version.extensions.TaskMacroPlugin = {
	major: 1, minor: 1, revision: 0,
	date: new Date(2006,5-1,13),
	author: "LukeBlanshard",
	source: "http://labwiki.sourceforge.net/#TaskMacroPlugin",
	license: "http://labwiki.sourceforge.net/#CopyrightAndLicense"
}
//}}}
/***
A little macro for pulling out extension info.  Use like {{{<<extension PluginName datum>>}}}, where {{{PluginName}}} is the name you used for {{{version.extensions}}} and {{{datum}}} is either {{{versionAndDate}}} or a property of the extension description object, such as {{{source}}}.
***/
//{{{
config.macros.extension = {
	handler: function( place, macroName, params, wikifier, paramString, tiddler ) {
		var info  = version.extensions[params[0]]
		var datum = params[1]
		switch (params[1]) {
		case 'versionAndDate':
			createTiddlyElement( place, "span", null, null,
				info.major+'.'+info.minor+'.'+info.revision+', '+info.date.formatString('DD MMM YYYY') )
			break;
		default:
			wikify( info[datum], place )
			break;
		}
	}
}
//}}}
/***
!Core Overrides
***/
//{{{
window.wikify_orig_TaskMacroPlugin = window.wikify
window.wikify = function(source,output,highlightRegExp,tiddler)
{
	if ( tiddler && tiddler.text === source )
		addDisplayDependency( output, tiddler.title )
	wikify_orig_TaskMacroPlugin.apply( this, arguments )
}
config.refreshers_orig_TaskMacroPlugin = config.refreshers
config.refreshers = {
	link: function() {
		config.refreshers_orig_TaskMacroPlugin.link.apply( this, arguments )
		return true
	},
	content: function() {
		config.refreshers_orig_TaskMacroPlugin.content.apply( this, arguments )
		return true
	},
	fullContent: function( e, changeList ) {
		var tiddlers = e.refreshTiddlers
		if ( changeList == null || tiddlers == null )
			return false
		for ( var i=0; i < tiddlers.length; ++i )
			if ( changeList.find(tiddlers[i]) != null ) {
				var title = tiddlers[0]
				story.refreshTiddler( title, null, true )
				return true
			}
		return false
	}
}
function refreshElements(root,changeList)
{
	var nodes = root.childNodes;
	for(var c=0; c<nodes.length; c++)
		{
		var e = nodes[c],type;
		if(e.getAttribute)
			type = e.getAttribute("refresh");
		else
			type = null;
		var refresher = config.refreshers[type];
		if ( ! refresher || ! refresher(e, changeList) )
			{
			if(e.hasChildNodes())
				refreshElements(e,changeList);
			}
		}
}
//}}}
/***
!Global Functions
***/
//{{{
// Add the tiddler whose title is given to the list of tiddlers whose
// changing will cause a refresh of the tiddler containing the given element.
function addDisplayDependency( element, title ) {
	while ( element && element.getAttribute ) {
		var idAttr = element.getAttribute("id"), tiddlerAttr = element.getAttribute("tiddler")
		if ( idAttr && tiddlerAttr && idAttr == story.idPrefix+tiddlerAttr ) {
			var list = element.refreshTiddlers
			if ( list == null ) {
				list = [tiddlerAttr]
				element.refreshTiddlers = list
				element.setAttribute( "refresh", "fullContent" )
			}
			list.pushUnique( title )
			return
		}
		element = element.parentNode
	}
}

// Lifted from Story.prototype.focusTiddler: just return the field instead of focusing it.
Story.prototype.findEditField = function( title, field )
{
	var tiddler = document.getElementById(this.idPrefix + title);
	if(tiddler != null)
		{
		var children = tiddler.getElementsByTagName("*")
		var e = null;
		for (var t=0; t<children.length; t++)
			{
			var c = children[t];
			if(c.tagName.toLowerCase() == "input" || c.tagName.toLowerCase() == "textarea")
				{
				if(!e)
					e = c;
				if(c.getAttribute("edit") == field)
					e = c;
				}
			}
		return e
		}
}

// Wraps the given event function in another function that handles the
// event in a standard way.
function wrapEventHandler( otherHandler ) {
	return function(e) {
		if (!e) var e = window.event
		e.cancelBubble = true
		if (e.stopPropagation) e.stopPropagation()
		return otherHandler( e )
	}
}
//}}}
/***
!Task Macro
Usage:
> {{{<<task orig cur spent>>description}}}
All of orig, cur, and spent are optional numbers of hours.  The description goes through the end of the line, and is wikified.
***/
//{{{
config.macros.task = {
	NASCENT:	0, // Task not yet estimated
	LIVE:		1, // Estimated but with time remaining
	DONE:		2, // Completed: no time remaining
	bullets:	["\u25cb", // nascent (open circle)
			 "\u25ba", // live (right arrow)
			 "\u25a0"],// done (black square)
	styles:		["nascent", "live", "done"],

	// Translatable text:
	lingo: {
		spentTooBig:	"Spent time %0 can't exceed current estimate %1",
		noNegative:	"Times may not be negative numbers",
		statusTips:	["Not yet estimated", "To do", "Done"], // Array indexed by state (NASCENT/LIVE/DONE)
		descClickTip:	" -- Double-click to edit task description",
		statusClickTip:	" -- Double-click to mark task complete",
		statusDoneTip:	" -- Double-click to adjust the time spent, to revive the task",
		origTip:	"Original estimate in hours",
		curTip:		"Current estimate in hours",
		curTip2:	"Estimate in hours", // For when orig == cur
		clickTip:	" -- Click to adjust",
		spentTip:	"Hours spent on this task",
		remTip:		"Hours remaining",
		curPrompt:	"Estimate this task in hours, or adjust the current estimate by starting with + or -.\n\nYou may optionally also set or adjust the time spent by putting a second number after the first.",
		spentPrompt:	"Enter the number of hours you've spent on this task, or adjust the current number by starting with + or -.\n\nYou may optionally also set or adjust the time remaining by putting a second number after the first.",
		remPrompt:	"Enter the number of hours it will take to finish this task, or adjust the current estimate by starting with + or -.\n\nYou may optionally also set or adjust the time spent by putting a second number after the first.",
		numbersOnly:	"Enter numbers only, please",
		notCurrent:	"The tiddler has been modified since it was displayed, please redisplay it before doing this."
	},

	// The macro handler
	handler: function( place, macroName, params, wikifier, paramString, tiddler )
	{
		var start = wikifier.matchStart, end = wikifier.nextMatch

		var origStr	= params.length > 0? params.shift() : "?"
		var orig	= +origStr // as a number
		var cur		= params.length > 1? +params.shift() : orig
		var spent	= params.length > 0? +params.shift() : 0
		if ( spent > cur )
			throw Error( this.lingo.spentTooBig.format([spent, cur]) )
		if ( orig < 0 || cur < 0 || spent < 0 )
			throw Error( this.lingo.noNegative )
		var rem		= cur - spent
		var state	= isNaN(orig+rem)? this.NASCENT : rem > 0? this.LIVE : this.DONE
		var table	= createTiddlyElement( place, "table", null, "task "+this.styles[state] )
		var tbody	= createTiddlyElement( table, "tbody" )
		var row		= createTiddlyElement( tbody, "tr" )
		var statusCell	= createTiddlyElement( row,   "td", null, "status", this.bullets[state] )
		var descCell	= createTiddlyElement( row,   "td", null, "description" )

		var origCell	= state==this.NASCENT || orig==cur? null
				: createTiddlyElement( row, "td", null, "numeric original" )
		var curCell	= createTiddlyElement( row, "td", null, "numeric current" )
		var spentCell	= createTiddlyElement( row, "td", null, "numeric spent" )
		var remCell	= createTiddlyElement( row, "td", null, "numeric remaining" )

		var sums = config.macros.tasksum.tasksums
		if ( sums && sums.length ) {
			var summary = [(state == this.NASCENT? NaN : orig), cur, spent]
			summary.owner = tiddler
			sums[0].push( summary )
		}

		// The description goes to the end of the line
		wikifier.subWikify( descCell, "$\\n?" )
		var descEnd = wikifier.nextMatch

		statusCell.setAttribute( "title", this.lingo.statusTips[state] )
		descCell.setAttribute(   "title", this.lingo.statusTips[state]+this.lingo.descClickTip )
		if (origCell) {
			createTiddlyElement( origCell, "div", null, null, orig )
			origCell.setAttribute( "title", this.lingo.origTip )
			curCell.setAttribute( "title", this.lingo.curTip )
		}
		else {
			curCell.setAttribute( "title", this.lingo.curTip2 )
		}
		var curDivContents = (state==this.NASCENT)? "?" : cur
		var curDiv = createTiddlyElement( curCell, "div", null, null, curDivContents )
		spentCell.setAttribute( "title", this.lingo.spentTip )
		var spentDiv = createTiddlyElement( spentCell, "div", null, null, spent )
		remCell.setAttribute( "title", this.lingo.remTip )
		var remDiv = createTiddlyElement( remCell, "div", null, null, rem )

		// Handle double-click on the description by going
		// into edit mode and selecting the description
		descCell.ondblclick = this.editDescription( tiddler, end, descEnd )

		function appTitle( el, suffix ) {
			el.setAttribute( "title", el.getAttribute("title")+suffix )
		}

		// For incomplete tasks, handle double-click on the bullet by marking the task complete
		if ( state != this.DONE ) {
			appTitle( statusCell, this.lingo.statusClickTip )
			statusCell.ondblclick = this.markTaskComplete( tiddler, start, end, macroName, orig, cur, state )
		}
		// For complete ones, handle double-click on the bullet by letting you adjust the time spent
		else {
			appTitle( statusCell, this.lingo.statusDoneTip )
			statusCell.ondblclick = this.adjustTimeSpent( tiddler, start, end, macroName, orig, cur, spent )
		}

		// Add click handlers for the numeric cells.
		if ( state != this.DONE ) {
			appTitle( curCell, this.lingo.clickTip )
			curDiv.className = "adjustable"
			curDiv.onclick = this.adjustCurrentEstimate( tiddler, start, end, macroName,
				orig, cur, spent, curDivContents )
		}
		appTitle( spentCell, this.lingo.clickTip )
		spentDiv.className = "adjustable"
		spentDiv.onclick = this.adjustTimeSpent( tiddler, start, end, macroName, orig, cur, spent )
		if ( state == this.LIVE ) {
			appTitle( remCell, this.lingo.clickTip )
			remDiv.className = "adjustable"
			remDiv.onclick = this.adjustTimeRemaining( tiddler, start, end, macroName, orig, cur, spent )
		}
	},

	// Puts the tiddler into edit mode, and selects the range of characters
	// defined by start and end.  Separated for leak prevention in IE.
	editDescription: function( tiddler, start, end ) {
		return wrapEventHandler( function(e) {
			story.displayTiddler( null, tiddler.title, DEFAULT_EDIT_TEMPLATE )
			var tiddlerElement = document.getElementById( story.idPrefix + tiddler.title )
			window.scrollTo( 0, ensureVisible(tiddlerElement) )
			var element = story.findEditField( tiddler.title, "text" )
			if ( element && element.tagName.toLowerCase() == "textarea" ) {
				// Back up one char if the last char's a newline
				if ( tiddler.text[end-1] == '\n' )
					--end
				element.focus()
				if ( element.setSelectionRange != undefined ) { // Mozilla
					element.setSelectionRange( start, end )
					// Damn mozilla doesn't scroll to visible.  Approximate.
					var max = 0.0 + element.scrollHeight
					var len = element.textLength
					var top = max*start/len, bot = max*end/len
					element.scrollTop = Math.min( top, (bot+top-element.clientHeight)/2 )
				}
				else if ( element.createTextRange != undefined ) { // IE
					var range = element.createTextRange()
					range.collapse()
					range.moveEnd("character", end)
					range.moveStart("character", start)
					range.select()
				}
				else // Other? Too bad, just select the whole thing.
					element.select()
				return false
			}
			else
				return true
		} )
	},

	// Modifies a task macro call such that the task appears complete.
	markTaskComplete: function( tiddler, start, end, macroName, orig, cur, state ) {
		var macro = this, text = tiddler.text
		return wrapEventHandler( function(e) {
			if ( text !== tiddler.text ) {
				alert( macro.lingo.notCurrent )
				return false
			}
			if ( state == macro.NASCENT )
				orig = cur = 0
			// The second "cur" in the call below bumps up the time spent
			// to match the current estimate.
			macro.replaceMacroCall( tiddler, start, end, macroName, orig, cur, cur )
			return false
		} )
	},

	// Asks the user for an adjustment to the current estimate, modifies the macro call accordingly.
	adjustCurrentEstimate: function( tiddler, start, end, macroName, orig, cur, spent, curDivContents ) {
		var macro = this, text = tiddler.text
		return wrapEventHandler( function(e) {
			if ( text !== tiddler.text ) {
				alert( macro.lingo.notCurrent )
				return false
			}
			var txt = prompt( macro.lingo.curPrompt, curDivContents )
			if ( txt != null ) {
				var a = macro.breakInput( txt )
				cur = macro.offset( cur, a[0] )
				if ( a.length > 1 )
					spent = macro.offset( spent, a[1] )
				macro.replaceMacroCall( tiddler, start, end, macroName, orig, cur, spent )
			}
			return false
		} )
	},

	// Asks the user for an adjustment to the time spent, modifies the macro call accordingly.
	adjustTimeSpent: function( tiddler, start, end, macroName, orig, cur, spent ) {
		var macro = this, text = tiddler.text
		return wrapEventHandler( function(e) {
			if ( text !== tiddler.text ) {
				alert( macro.lingo.notCurrent )
				return false
			}
			var txt = prompt( macro.lingo.spentPrompt, spent )
			if ( txt != null ) {
				var a = macro.breakInput( txt )
				spent = macro.offset( spent, a[0] )
				var rem = cur - spent
				if ( a.length > 1 ) {
					rem = macro.offset( rem, a[1] )
					cur = spent + rem
				}
				macro.replaceMacroCall( tiddler, start, end, macroName, orig, cur, spent )
			}
			return false
		} )
	},

	// Asks the user for an adjustment to the time remaining, modifies the macro call accordingly.
	adjustTimeRemaining: function( tiddler, start, end, macroName, orig, cur, spent ) {
		var macro = this
		var text  = tiddler.text
		var rem   = cur - spent
		return wrapEventHandler( function(e) {
			if ( text !== tiddler.text ) {
				alert( macro.lingo.notCurrent )
				return false
			}
			var txt = prompt( macro.lingo.remPrompt, rem )
			if ( txt != null ) {
				var a = macro.breakInput( txt )
				var newRem = macro.offset( rem, a[0] )
				if ( newRem > rem || a.length > 1 )
					cur += (newRem - rem)
				else
					spent += (rem - newRem)
				if ( a.length > 1 )
					spent = macro.offset( spent, a[1] )
				macro.replaceMacroCall( tiddler, start, end, macroName, orig, cur, spent )
			}
			return false
		} )
	},

	// Breaks input at spaces & commas, returns array
	breakInput: function( txt ) {
		var a = txt.trim().split( /[\s,]+/ )
		if ( a.length == 0 )
			a = [NaN]
		return a
	},

	// Adds to, subtracts from, or replaces a numeric value
	offset: function( num, txt ) {
		if ( txt == "" || typeof(txt) != "string" )
			return NaN
		if ( txt.match(/^[+-]/) )
			return num + (+txt)
		return +txt
	},

	// Does some error checking, then replaces the indicated macro
	// call within the text of the given tiddler.
	replaceMacroCall: function( tiddler, start, end, macroName, orig, cur, spent )
	{
		if ( isNaN(cur+spent) ) {
			alert( this.lingo.numbersOnly )
			return
		}
		if ( spent < 0 || cur < 0 ) {
			alert( this.lingo.noNegative )
			return
		}
		if ( isNaN(orig) )
			orig = cur
		if ( spent > cur )
			cur = spent
		var text = tiddler.text.substring(0,start) + "<<" + macroName + " " +
			orig + " " + cur + " " + spent + ">>" + tiddler.text.substring(end)
		var title = tiddler.title
		store.saveTiddler( title, title, text, config.options.txtUserName, new Date(), undefined )
		//story.refreshTiddler( title, null, true )
		if ( config.options.chkAutoSave )
			saveChanges()
	}
}
//}}}
/***
!Tasksum Macro
Usage:
> {{{<<tasksum "start" ["here" [intro]]>>}}}
or:
> {{{<<tasksum "end" [intro]>>}}}
Put one of the {{{<<tasksum start>>}}} lines before the tasks you want to summarize, and an {{{end}}} line after them.  By default, the summary goes at the end; if you include {{{here}}} in the start line, the summary will go at the top.  The intro argument, if supplied, replaces the default text introducing the summary.
***/
//{{{
config.macros.tasksum = {

	// Translatable text:
	lingo: {
		unrecVerb:	"<<%0>> requires 'start' or 'end' as its first argument",
		mustMatch:	"<<%0 end>> must match a preceding <<%0 start>>",
		defIntro:	"Task summary:",
		nascentSum:	"''%0 not estimated''",
		doneSum:	"%0 complete (in %1 hours)",
		liveSum:	"%0 ongoing (%1 hours so far, ''%2 hours remaining'')",
		overSum:	"Total overestimate: %0%.",
		underSum:	"Total underestimate: %0%.",
		descPattern:	"%0 %1. %2",
                origTip:	"Total original estimates in hours",
		curTip:		"Total current estimates in hours",
		spentTip:	"Total hours spent on tasks",
		remTip:		"Total hours remaining"
	},

	// The macro handler
	handler: function( place, macroName, params, wikifier, paramString, tiddler )
	{
		var sums = this.tasksums
		if ( params[0] == "start" ) {
			sums.unshift([])
			if ( params[1] == "here" ) {
				sums[0].intro = params[2] || this.lingo.defIntro
				sums[0].place = place
				sums[0].placement = place.childNodes.length
			}
		}
		else if ( params[0] == "end" ) {
			if ( ! sums.length )
				throw Error( this.lingo.mustMatch.format([macroName]) )
			var list = sums.shift()
			var intro = list.intro || params[1] || this.lingo.defIntro
			var nNascent=0, nLive=0, nDone=0, nMine=0
			var totLiveSpent=0, totDoneSpent=0
			var totOrig=0, totCur=0, totSpent=0
			for ( var i=0; i < list.length; ++i ) {
				var a = list[i]
				if ( a.length > 3 ) {
					nNascent 	+= a[0]
					nLive 		+= a[1]
					nDone 		+= a[2]
					totLiveSpent 	+= a[3]
					totDoneSpent 	+= a[4]
					totOrig 	+= a[5]
					totCur 		+= a[6]
					totSpent 	+= a[7]
					if ( a.owner == tiddler )
						nMine	+= a[8]
				}
				else {
					if ( a.owner == tiddler )
						++nMine
					if ( isNaN(a[0]) ) {
						++nNascent
					}
					else {
						if ( a[1] > a[2] ) {
							++nLive
							totLiveSpent += a[2]
						}
						else {
							++nDone
							totDoneSpent += a[2]
						}
						totOrig  += a[0]
						totCur   += a[1]
						totSpent += a[2]
					}
				}
			}

			// If we're nested, push a summary outward
                        if ( sums.length ) {
				var summary = [nNascent, nLive, nDone, totLiveSpent, totDoneSpent,
						totOrig, totCur, totSpent, nMine]
				summary.owner = tiddler
				sums[0].push( summary )
			}

			var descs = [], styles = []
			if ( nNascent > 0 ) {
				descs.push( this.lingo.nascentSum.format([nNascent]) )
				styles.push( "nascent" )
			}
			if ( nDone > 0 )
				descs.push( this.lingo.doneSum.format([nDone, totDoneSpent]) )
			if ( nLive > 0 ) {
				descs.push( this.lingo.liveSum.format([nLive, totLiveSpent, totCur-totSpent]) )
				styles.push( "live" )
			}
			else
				styles.push( "done" )
			var off = ""
			if ( totOrig > totCur )
				off = this.lingo.overSum.format( [Math.round(100.0*(totOrig-totCur)/totCur)] )
			else if ( totCur > totOrig )
				off = this.lingo.underSum.format( [Math.round(100.0*(totCur-totOrig)/totOrig)] )

			var top		= (list.intro != undefined)
			var table	= createTiddlyElement( null, "table", null, "tasksum "+(top?"top":"bottom") )
			var tbody	= createTiddlyElement( table, "tbody" )
			var row		= createTiddlyElement( tbody, "tr", null, styles.join(" ") )
			var descCell	= createTiddlyElement( row,   "td", null, "description" )

			var description = this.lingo.descPattern.format( [intro, descs.join(", "), off] )
			wikify( description, descCell, null, tiddler )

			var origCell	= totOrig == totCur? null
					: createTiddlyElement( row, "td", null, "numeric original", totOrig )
			var curCell	= createTiddlyElement( row, "td", null, "numeric current", totCur )
			var spentCell	= createTiddlyElement( row, "td", null, "numeric spent", totSpent )
			var remCell	= createTiddlyElement( row, "td", null, "numeric remaining", totCur-totSpent )

			if ( origCell )
				origCell.setAttribute( "title", this.lingo.origTip )
			curCell  .setAttribute( "title", this.lingo.curTip )
			spentCell.setAttribute( "title", this.lingo.spentTip )
			remCell  .setAttribute( "title", this.lingo.remTip )

			// Discard the table if there are no tasks
			if ( list.length > 0 ) {
				var place = top? list.place : place
				var placement = top? list.placement : place.childNodes.length
				if ( placement >= place.childNodes.length )
					place.appendChild( table )
				else
					place.insertBefore( table, place.childNodes[placement] )
			}
		}
		else
			throw Error( this.lingo.unrecVerb.format([macroName]) )

		// If we're wikifying, and are followed by end-of-line, swallow the newline.
		if ( wikifier && wikifier.source.charAt(wikifier.nextMatch) == "\n" )
			++wikifier.nextMatch
	},

	// This is the stack of pending summaries
	tasksums: []
}
//}}}
/***
!Taskadder Macro
Usage:
> {{{<<taskadder ["above"|"below"|"focus"|"nofocus"]...>>}}}
Creates a line with text entry fields for a description and an estimate.  By default, puts focus in the description field and adds tasks above the entry fields.  Use {{{nofocus}}} to not put focus in the description field.  Use {{{below}}} to add tasks below the entry fields.
***/
//{{{
config.macros.taskadder = {

	// Translatable text:
	lingo: {
		unrecParam:	"<<%0>> doesn't recognize '%1' as a parameter",
		descTip:	"Describe a new task",
		curTip:		"Estimate how long in hours the task will take",
		buttonText:	"add task",
		buttonTip:	"Add a new task with the description and estimate as entered",
		notCurrent:	"The tiddler has been modified since it was displayed, please redisplay it before adding a task this way.",

		eol:		"eol"
	},

	// The macro handler
	handler: function( place, macroName, params, wikifier, paramString, tiddler )
	{
		var above = true
		var focus = false

		while ( params.length > 0 ) {
			var p = params.shift()
			switch (p) {
			case "above": 	above = true;  break
			case "below": 	above = false; break
			case "focus": 	focus = true;  break
			case "nofocus":	focus = false; break
			default:	throw Error( this.lingo.unrecParam.format([macroName, p]) )
			}
		}

		// If we're followed by end-of-line, swallow the newline.
		if ( wikifier.source.charAt(wikifier.nextMatch) == "\n" )
			++wikifier.nextMatch

		var where	= above? wikifier.matchStart : wikifier.nextMatch

		var table	= createTiddlyElement( place, "table", null, "task" )
		var tbody	= createTiddlyElement( table, "tbody" )
		var row		= createTiddlyElement( tbody, "tr" )
		var statusCell	= createTiddlyElement( row,   "td", null, "status" )
		var descCell	= createTiddlyElement( row,   "td", null, "description" )
		var curCell	= createTiddlyElement( row,   "td", null, "numeric" )
		var addCell	= createTiddlyElement( row,   "td", null, "addtask" )

		var descId	= this.generateId()
		var curId	= this.generateId()
		var descInput	= createTiddlyElement( descCell, "input", descId )
		var curInput	= createTiddlyElement( curCell,  "input", curId  )

		descInput.setAttribute( "type", "text" )
		curInput .setAttribute( "type", "text" )
		descInput.setAttribute( "size", "40")
		curInput .setAttribute( "size", "6" )
		descInput.setAttribute( "autocomplete", "off" );
		curInput .setAttribute( "autocomplete", "off" );
		descInput.setAttribute( "title", this.lingo.descTip );
		curInput .setAttribute( "title", this.lingo.curTip  );

		var addAction	= this.addTask( tiddler, where, descId, curId, above )
		var addButton	= createTiddlyButton( addCell, this.lingo.buttonText, this.lingo.buttonTip, addAction )

		descInput.onkeypress = this.handleEnter(addAction)
		curInput .onkeypress = descInput.onkeypress
		addButton.onkeypress = this.handleSpace(addAction)
		if ( focus || tiddler.taskadderLocation == where ) {
			descInput.focus()
			descInput.select()
		}
	},

	// Returns a function that inserts a new task macro into the tiddler.
	addTask: function( tiddler, where, descId, curId, above ) {
		var macro = this, oldText = tiddler.text
		return wrapEventHandler( function(e) {
			if ( oldText !== tiddler.text ) {
				alert( macro.lingo.notCurrent )
				return false
			}
			var desc	= document.getElementById(descId).value
			var cur		= document.getElementById(curId) .value
			var init	= tiddler.text.substring(0,where) + "<<task " + cur + ">> " + desc + "\n"
			var text	= init + tiddler.text.substring(where)
			var title	= tiddler.title
			tiddler.taskadderLocation = (above? init.length : where)
			try {
				store.saveTiddler( title, title, text, config.options.txtUserName, new Date(), undefined )
				//story.refreshTiddler( title, null, true )
			}
			finally {
				delete tiddler.taskadderLocation
			}
			if ( config.options.chkAutoSave )
				saveChanges()
		} )
	},

	// Returns an event handler that delegates to two other functions: "matches" to decide
	// whether to consume the event, and "addTask" to actually perform the work.
	handleGeneric: function( addTask, matches ) {
		return function(e) {
			if (!e) var e = window.event
			var consume = false
			if ( matches(e) ) {
				consume = true
				addTask( e )
			}
			e.cancelBubble = consume;
			if ( consume && e.stopPropagation ) e.stopPropagation();
			return !consume;
		}
	},

	// Returns an event handler that handles enter keys by calling another event handler
	handleEnter: function( addTask ) {
		return this.handleGeneric( addTask, function(e){return e.keyCode == 13 || e.keyCode == 10} ) // Different codes for Enter
	},

	// Returns an event handler that handles the space key by calling another event handler
	handleSpace: function( addTask ) {
		return this.handleGeneric( addTask, function(e){return (e.charCode||e.keyCode) == 32} )
	},

	counter: 0,
	generateId: function() {
		return "taskadder:" + String(this.counter++)
	}
}
//}}}
/***
!Stylesheet
***/
//{{{
var stylesheet = '\
.viewer table.task, table.tasksum {\
	width: 100%;\
	padding: 0;\
	border-collapse: collapse;\
}\
.viewer table.task {\
	border: none;\
	margin: 0;\
}\
table.tasksum, .viewer table.tasksum {\
	border: solid 2px #999;\
	margin: 3px 0;\
}\
table.tasksum td {\
	text-align: center;\
	border: 1px solid #ddd;\
	background-color: #ffc;\
	vertical-align: middle;\
	margin: 0;\
	padding: 0;\
}\
.viewer table.task tr {\
	border: none;\
}\
.viewer table.task td {\
	text-align: center;\
	vertical-align: baseline;\
	border: 1px solid #fff;\
	background-color: inherit;\
	margin: 0;\
	padding: 0;\
}\
td.numeric {\
	width: 3em;\
}\
table.task td.numeric div {\
	border: 1px solid #ddd;\
	background-color: #ffc;\
	margin: 1px 0;\
	padding: 0;\
}\
table.task td.original div {\
	background-color: #fdd;\
}\
table.tasksum td.original {\
	background-color: #fdd;\
}\
table.tasksum td.description {\
	background-color: #e8e8e8;\
}\
table.task td.status {\
	width: 1.5em;\
	cursor: default;\
}\
table.task td.description, table.tasksum td.description {\
	width: auto;\
	text-align: left;\
	padding: 0 3px;\
}\
table.task.done td.status,table.task.done td.description {\
	color: #ccc;\
}\
table.task.done td.current, table.task.done td.remaining {\
	visibility: hidden;\
}\
table.task.done td.spent div, table.tasksum tr.done td.current,\
table.tasksum tr.done td.spent, table.tasksum tr.done td.remaining {\
	background-color: #eee;\
	color: #aaa;\
}\
table.task.nascent td.description {\
	color: #844;\
}\
table.task.nascent td.current div, table.tasksum tr.nascent td.numeric.current {\
	font-weight: bold;\
	color: #c00;\
	background-color: #def;\
}\
table.task.nascent td.spent, table.task.nascent td.remaining {\
	visibility: hidden;\
}\
td.remaining {\
	font-weight: bold;\
}\
.adjustable {\
	cursor: pointer; \
}\
table.task input {\
	display: block;\
	width: 100%;\
	font: inherit;\
	margin: 2px 0;\
	padding: 0;\
	border: 1px inset #999;\
}\
table.task td.numeric input {\
	background-color: #ffc;\
	text-align: center;\
}\
table.task td.addtask {\
	width: 6em;\
	border-left: 2px solid white;\
	vertical-align: middle;\
}\
'
setStylesheet( stylesheet, "TaskMacroPluginStylesheet" )
//}}}
