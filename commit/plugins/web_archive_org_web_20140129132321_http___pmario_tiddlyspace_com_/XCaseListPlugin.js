/***
|''Name:''|XCaseListPlugin|
|''Description:''|Adds a new command ''xCase'' to the core list macro|
|''Author:''|Mario Pietsch|
|''Version:''|0.3|
|''Date:''|2010.08.03|
|''Status:''|''beta''|
|''Source:''|http://apm-plugins.tiddlyspot.com/#XCaseListPlugin|
|''License''|[[MIT License]]|
|''CoreVersion:''|2.5.0|
|''Requires:''||
|''Documentation:''|this file|
|''Keywords:''|list, sort, not case sensitive, filter|

!Description
This plugin performs a alphabetical sort for tiddlers. Default it is not case sensitive. That means ab = AB = aB = Ab! And it does some little more filtering using the RegExp syntax. The RegExp Syntax can be a little bit tricky to read and configure. But the best description I have found is at [[regular-expressions.info]]

!!!Example
{{{
<<list xCase title '[m]'>>
}}}
< <list xCase title '[m]'>>

!Default Format
{{{
<<list xCase>>
}}}

!More Possibilities
<<<
!!!Reverse sort order
{{{
<<list xCase -title >>
}}}

!!!Some basic filtering
*Every tiddler title, that starts with a number from 0 to 9.
{{{
<<list xCase title '[0-9]'>>
}}}

*Every tiddler title, that starts with an ''"a"'' or ''"b"'' or ''"c"''.
{{{
<<list xCase title '[abc]'>>
}}}

*Every tiddler title, that starts with exactly ''abc''.
{{{
<<list xCase title 'abc'>>
}}}
<<<

!!!Some advanced filtering
<<<
*same as above but with a tagList for additional filtering.
*adding the tag filter will disable the "excludeLists" setting !!
**If you need excludeLists, than you have to define it with the expression.
*XCaseListPlugin should be compatible to [[MatchTagsPlugin]] from TiddlyTools!

{{{
<<list xCase title '[a]' "[tag[MyTag]]">>
}}}

!!!Global / Local Settings
|<<option chkXCaseListCaseSensitive>> Global sort case sensitive |Sets case sensitiv sort globally|
|<<option chkXCaseListCheckField>> Sortfield defines case sensitive |Ignores global setting. Evaluates sortField and sets the value everytime <br> {{{<<list xCase sortField ..>>}}} is executed.|

If sortField is eg: 'title' .. not case sensitive (default).
if sortField is eg: 'Title' or 'TITLE' .. case sesitive sort is active.

<<<

!Code
***/

/*{{{*/

if(!version.extensions.XCaseListPlugin) { //# ensure that the plugin is only installed once
version.extensions.XCaseListPlugin = { installed: true };

config.macros.list.xCase = {};
config.macros.list.xCase.handler = function(params){

	var lookupField = 'tags';
	var lookupValue = 'excludeLists';
	var lookupMatch = false;
	
	var sortField = params[1] || '+title';
	
	// global setting for case sensitive search
	var caseSensitive = config.options.chkXCaseListCaseSensitive || false;
	var chkSortField = config.options.chkXCaseListCheckField || false;

	// if this option is active the macro parameter sortField is parsed
	// global setting is ignored !!
	if (chkSortField) caseSensitive = (sortField != sortField.toLowerCase());	
	sortField = sortField.toLowerCase();

	// check if numberedText called this macro.
	// this parameter is used by <<list numberedText ..>> macro
	// if you directly use it, it will return an unsorted list !!!
	var numberedText = false;
	if (sortField.substr(0, 1)== '#') {
		numberedText = true;
		sortField = sortField.substr(1);
		caseSensitive = false;
	}

	// check for ascending or descending sort order		
	var asc = 1;
	switch (sortField.substr(0, 1)) {
		case "-":
			asc = -1;
		case "+":
			sortField = sortField.substr(1);
			break;
		default:	;
	}	
	
	var results = [];
	var tmpResults = [];
	
	// set the default for regExp filtering
	var regSnip = params[2] || '.';	
	var regExp = new RegExp('^' + regSnip, 'im');
	var match = null;

	// check if [tag[...]] is set
	var tagList = params[3] || '';		 
	var tagMatch = tagList.length != 0;		// if list is empty everything is valid.

	if (tagMatch) {
		tmpResults = store.filterTiddlers(params[3]);
		for (var i=0, max=tmpResults.length; i<max; i++){
//			match = tmpResults[i][sortField].match(regExp);
			match = tmpResults[i].title.match(regExp);
			if (match) results.push(tmpResults[i]);			
		}; // for ..
	}
	else {
		store.forEachTiddler(function(title, tiddler){
			var f = !lookupMatch;
			for (var lookup = 0; lookup < tiddler[lookupField].length; lookup++) {
				if (tiddler[lookupField][lookup] == lookupValue) {
					f = lookupMatch;
				}
			}; // for.. 
			if (f) {
//				match = tiddler[sortField].match(regExp);
				match = tiddler.title.match(regExp);
				if (match) results.push(tiddler);
			}; // if (f) ..
		}); // store.forEach ..
	}; // else ..
	
	if (TiddlyWiki.isStandardField(sortField)) {

		if (caseSensitive) {
			results.sort(function(a, b){
				return a[sortField] < b[sortField] ? -asc : a[sortField] == b[sortField] ? 0 : asc;
			}); // results.sort
		}
		else if (numberedText) {
			// do nothing, return the list, for further processing !	
		}
		else {
			results.sort(function(a, b){
				return a[sortField].toLowerCase() < b[sortField].toLowerCase() ? -asc : a[sortField].toLowerCase() == b[sortField].toLowerCase() ? 0 : asc;
			}); // results.sort
		}; // if
	}
	else {
		results.sort(function (a, b) {
			var aField = (a.fields[sortField]) ? a.fields[sortField] : 'zzz';
			var bField = (b.fields[sortField]) ? b.fields[sortField] : 'zzz';

			return aField.toLowerCase() < bField.toLowerCase() ? -asc : aField.toLowerCase() == bField.toLowerCase() ? 0 : +asc;
			});
	}
	return results;
}
} //# end of "install only once"

/*}}}*/