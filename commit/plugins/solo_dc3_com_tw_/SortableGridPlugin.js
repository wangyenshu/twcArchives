/***
|''Name:''|SortableGridPlugin|
|''Description:''|Provide live sorting of tables by column|
|''Date:''|Nov 4, 2006|
|''Source:''|[[SortableGridPlugin|http://solo.dc3.com/tw/plugins.html#SortableGridPlugin]]|
|''Author:''|Stuart Langridge, Demian Johnson, Bob Denny|
|''License:''|See Below|
|''Version:''|1.1.2|
|''~CoreVersion:''|2.0.11 and 2.1.x|
|''Browser:''|Firefox 1.5/2.0; Internet Explorer 6.0/7.0; Safari|
!!Description
@@Please note that this works only with TiddlyWiki 2.0.11 and 2.1.0/1/2@@

This plugin provides live sorting of tables by clicking on a column header. To sort in reverse, click the same column header a second time. An arrow in the sort column shows the direction of sorting. 

It works by trying to automatically detect the type of data in a column, then sorting by the rules for that data type. Note that the data in the first row (before sorting for the first time) is used for type detection, so if other data types exist in the column below the first row, the results will be unpredictable. If it //can// recognize the string as prticular type it //will// sort that column by that type. Moral: keep all of your data in a column the same type. The following data types are checked in the order shown (in other words the table shows the precedence of type detection):

|!Type |!Description|
|Date|Various formats for dates, specifically any string format that can be converted to a date/time by Javascript's Date.Parse() method.|
|Currency|Any string beginning with $, £, or € followed by a numeric string (except no leading sign). Note that it does not do currency conversion, the raw currency values are sorted numerically. {{{/^[$|£|€]{1}\d*\.{0,1}\d+$/}}}|
|Numeric|Data must consist purely of digits, optional leading plus or minus sign, a single period. Javascript cannot handle the Continental virgule (comma decimal point). {{{/^[\+|\-]{0,1}\d*\.{0,1}\d+$/}}}|
|File Size|Numeric string (except no leading sign) with b, Kb, Mb, or Gb at the end. Sorts according to the actual value represented by the notation. {{{/^\d*\.{0,1}\d+[K|M|G]{0,1}b$}}}|
|Text|Anything that does not match the formats listed below. Text is sorted without regard to character case.|
!!Installation
Follow the usual procedure for installing a plugin: Edit this tiddler, copy, paste into a new tiddler in your TW, and tag it systemConfig. Close, Save, and Shift-Reload  your TW's page. The table below (in Example) should have hot column headers and be sortable.
!!Usage
To make a table sortable, append an {{{h}}} to the end of the first row. If the table is thus marked as sortable, the formatter will add a CSS class {{{sortable}}} to the generated {{{<table>}}} element. Thus you can use CSS to alter the appearance of the sortable table and/or its elements.
!!Example
|Name |Salary |Extension |Performance |File Size |Start date |h
|Bloggs, Fred |$12000.00 |1353 |+1.2 |74.2Kb |Aug 19, 2003 21:34:00 |
|Bloggs, Fred |$12000.00 |1353 |1.2 |3350b |09/18/2003 |
|Bloggs, Fred |$12000 |1353 |1.200 |55.2Kb |August 18, 2003 |
|Bloggs, Fred |$12000.00 |1353 |1.2 |2100b |07/18/2003 |
|Bloggs, Fred |$12000.00 |1353 |01.20 |6.156Mb |08/17/2003 05:43 |
|Turvey, Kevin |$191200.00 |2342 |-33 |1b |02/05/1979 |
|Mbogo, Arnold |$32010.12 |2755 |-21.673 |1.2Gb |09/08/1998 |
|Shakespeare, Bill |£122000.00|3211 |6 |33.22Gb |12/11/1961 |
|Shakespeare, Hamlet |£9000 |9005 |-8 |3Gb |01/01/2002 |
|Fitz, Marvin |€3300.30 |5554 |+5 |4Kb |05/22/1995 |
!!Revision History
<<<
''2003.11.?? [?.?.?]'' Stuart Langridge (http://www.kryogenix.org/code/browser/sorttable/) - Core code for DHTML sortable tables. Copyright and license for his code has been carried forward and applies to subsequent additions.
''2006.02.14 [1.0.0]'' Demian Johnson - Initial release, adaptation of Langridge code to TiddlyWiki.
''2006.09.29 [1.1.0]'' Bob Denny - Add standard-format plugin documentation, reformat and tabify code for readability, refactor references to plugin, add new "file size" detection and sorting, add sterling and euro to currency detection, allow any real numbers including optional sign and either period or comma for decimal point for numeric sorting, make RegExp matching strict for currency and numeric, clean up lint warnings, correct spelling of Hamlet's name.
''2006.10.19 [1.1.1]'' Bob Denny - Allow use with TW 2.1.1 and 2.1.2, hijack is identical with 2.1.0.
''2006.11.04 [1.1.2]'' Bob Denny - Oh hell, accept 2.1.x, bit again by 2.1.3 which was OK.
<<<
!!Code
***/
//{{{
//
// Begin SORTABLE.JS
// This Code is:
// Code downloaded from the Browser Experiments section of kryogenix.org is 
// licenced under the so-called MIT licence. The license is below.
// ----------------------------------------
// Copyright (c) 1997-date Stuart Langridge
// ----------------------------------------
// Permission is hereby granted, free of charge, to any person obtaining a copy of this 
// software and associated documentation files (the "Software"), to deal in the Software 
// without restriction, including without limitation the rights to use, copy, modify, merge, 
// publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
// to whom the Software is furnished to do so, subject to the following conditions:
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
// PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
// FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
// DEALINGS IN THE SOFTWARE.
//
// Modified under the same aforementioned terms by Demian Johnston, 2006
// Further modified under the same aforementioned terms by Bob Denny, 2006: 
//	1. Add flexible date/time 
//	2. Use 'this' instead of full dotted names 
//	3. Re-indent and tabify after being munged by TW/IE bu
//	4. Add "file size" sensing and sorting. Validate with Javascript Lint 
//
version.extensions.PersistentForm = {
	major: 1, minor: 1, revision: 2,
	date: new Date(2006, 11, 4), 
	type: 'extension',
	source: "http://solo.dc3.com/tw/plugins.html#SortableGridPlugin"
};
//}}}

//{{{
config.macros.sortableGridPlugin = { SORT_COLUMN_INDEX: 0 };

config.macros.sortableGridPlugin.ts_makeSortable = function(table) 
{
	var firstRow;
	if (table.rows && table.rows.length > 0) {
		firstRow = table.rows[0];
	}
	if (!firstRow) return;
    
	// We have a first row: assume it's the header, and make its contents clickable links
	for (var i=0;i<firstRow.cells.length;i++) {
		var cell = firstRow.cells[i];
		var txt = config.macros.sortableGridPlugin.ts_getInnerText(cell);
		cell.innerHTML = '<a href="#" class="sortheader" onclick="config.macros.sortableGridPlugin.ts_resortTable(this);return false;">' +
						txt + '<span class="sortarrow">&nbsp;&nbsp;&nbsp;</span></a>';
	}
};
//}}}

//{{{
config.macros.sortableGridPlugin.ts_getInnerText = function(el) 
{
	if (typeof el == "string") return el;
	if (typeof el == "undefined") { return el; }
	if (el.innerText) return el.innerText; //Not needed but it is faster
	var str = "";
	var cs = el.childNodes;
	var l = cs.length;
	for (var i = 0; i < l; i++) {
		switch (cs[i].nodeType) 
		{
			case 1: 										//ELEMENT_NODE
				str += config.macros.sortableGridPlugin.ts_getInnerText(cs[i]);
				break;
			case 3: 										//TEXT_NODE
				str += cs[i].nodeValue;
				break;
		}
	}
	return str;
};

config.macros.sortableGridPlugin.getParent = function(el, pTagName) 
{
	if (el === null) 
		return null;
	else if (el.nodeType == 1 && el.tagName.toLowerCase() == pTagName.toLowerCase()) // Gecko bug, supposed to be uppercase
		return el;
	else
		return config.macros.sortableGridPlugin.getParent(el.parentNode, pTagName);
};
//}}}

//{{{
config.macros.sortableGridPlugin.ts_resortTable = function(lnk) 
{
	var M = config.macros.sortableGridPlugin;
	// get the span
	var span;
	for (var ci = 0; ci < lnk.childNodes.length; ci++) {
	if (lnk.childNodes[ci].tagName && lnk.childNodes[ci].tagName.toLowerCase() == 'span') 
		span = lnk.childNodes[ci];
	}
	var td = lnk.parentNode;
	var column = td.cellIndex;
	var table = M.getParent(td,'TABLE');
    
	// Work out a type for the column
	if (table.rows.length <= 1) return;
	var itm = M.ts_getInnerText(table.rows[1].cells[column]);
	var sortfn = M.ts_sort_caseinsensitive;
	if(!isNaN(Date.parse(itm)))
		sortfn = M.ts_sort_date;
	else if(itm.match(/^[$|£|€]{1}\d*\.{0,1}\d+$/)) 
		sortfn = M.ts_sort_currency;
	else if(itm.match(/^[\+|\-]{0,1}\d*\.{0,1}\d+$/)) 
		sortfn = M.ts_sort_numeric;
	else if(itm.match(/^\d*\.{0,1}\d+[K|M|G]{0,1}b$/))
		sortfn = M.ts_sort_fileSize;
	M.SORT_COLUMN_INDEX = column;
	var firstRow = new Array();
	var newRows = new Array();
	for (var i = 0; i < table.rows[0].length; i++) { firstRow[i] = table.rows[0][i]; }
	for (var j = 1; j < table.rows.length; j++) { newRows[j-1] = table.rows[j]; }
    
	newRows.sort(sortfn);
	var ARROW;
	if (span.getAttribute("sortdir") == 'down') {
		ARROW = '&nbsp;&nbsp;&uarr;';
		newRows.reverse();
		span.setAttribute('sortdir','up');
	} else {
		ARROW = '&nbsp;&nbsp;&darr;';
		span.setAttribute('sortdir','down');
	}
    
	// We appendChild rows that already exist to the tbody, so it moves them 
	// rather than creating new ones. Don't do sortbottom rows
	for ( i=0;i<newRows.length;i++) { 
		if (!newRows[i].className || (newRows[i].className && (newRows[i].className.indexOf('sortbottom') == -1))) 
			table.tBodies[0].appendChild(newRows[i]);
	}
	// do sortbottom rows only
	for ( i=0;i<newRows.length;i++) { 
		if (newRows[i].className && (newRows[i].className.indexOf('sortbottom') != -1)) 
			table.tBodies[0].appendChild(newRows[i]);
	}
    
	// Delete any other arrows there may be showing
	var allspans = document.getElementsByTagName("span");
	for ( ci=0;ci<allspans.length;ci++) {
		if (allspans[ci].className == 'sortarrow') {
			if (M.getParent(allspans[ci],"table") == M.getParent(lnk,"table")) { // in the same table as us?
				allspans[ci].innerHTML = '&nbsp;&nbsp;&nbsp;';
			}
		}
	}
    
	span.innerHTML = ARROW;
};
//}}}

//{{{
config.macros.sortableGridPlugin.ts_sort_fileSize = function(a, b) 
{
	var M = config.macros.sortableGridPlugin;
	var convert = function(str)
	{
		var val;
		var i;
		if((i = str.indexOf("Kb")) != -1)
			val = 1024.0 * str.substr(0, i);
		else if((i = str.indexOf("Mb")) != -1)
			val = 1048576.0 * str.substr(0, i);
		else if((i = str.indexOf("Gb")) != -1)
			val = 1073741824.0 * str.substr(0, i);
		else
			val = 1.0 * str.substr(0, str.length - 1);
		return val;
	};
    
	var aa = M.ts_getInnerText(a.cells[M.SORT_COLUMN_INDEX]);
	var bb = M.ts_getInnerText(b.cells[M.SORT_COLUMN_INDEX]);
	var v1 = convert(aa);
	var v2 = convert(bb);
	if(v1 == v2) return 0;
	if(v1 < v2) return -1;
	return 1;
};

config.macros.sortableGridPlugin.ts_sort_date = function(a, b) 
{
	var M = config.macros.sortableGridPlugin;
	// Handles dates per the rules of Date.parse()
	var aa = M.ts_getInnerText(a.cells[M.SORT_COLUMN_INDEX]);
	var bb = M.ts_getInnerText(b.cells[M.SORT_COLUMN_INDEX]);
	var dt1 = Date.parse(aa);
	var dt2 = Date.parse(bb);
	if (dt1 == dt2) return 0;
	if (dt1 < dt2) return -1;
	return 1;
};

config.macros.sortableGridPlugin.ts_sort_currency = function(a, b) 
{ 
	var M = config.macros.sortableGridPlugin;
	var aa = M.ts_getInnerText(a.cells[M.SORT_COLUMN_INDEX]).replace(/[^0-9.]/g,'');
	var bb = M.ts_getInnerText(b.cells[M.SORT_COLUMN_INDEX]).replace(/[^0-9.]/g,'');
	return parseFloat(aa) - parseFloat(bb);
};

config.macros.sortableGridPlugin.ts_sort_numeric = function(a, b) 
{ 
	var M = config.macros.sortableGridPlugin;
	var aa = parseFloat(M.ts_getInnerText(a.cells[M.SORT_COLUMN_INDEX]));
	if (isNaN(aa)) aa = 0;
	var bb = parseFloat(M.ts_getInnerText(b.cells[M.SORT_COLUMN_INDEX])); 
	if (isNaN(bb)) bb = 0;
	return aa-bb;
};

config.macros.sortableGridPlugin.ts_sort_caseinsensitive = function(a, b) 
{
	var M = config.macros.sortableGridPlugin;
	var aa = M.ts_getInnerText(a.cells[M.SORT_COLUMN_INDEX]).toLowerCase();
	var bb = M.ts_getInnerText(b.cells[M.SORT_COLUMN_INDEX]).toLowerCase();
	if (aa == bb) return 0;
	if (aa < bb) return -1;
	return 1;
};

// config.macros.sortableGridPlugin.ts_sort_default = function(a, b) 
// {
//	var M = config.macros.sortableGridPlugin;
//	var aa = M.ts_getInnerText(a.cells[M.SORT_COLUMN_INDEX]);
//	var bb = M.ts_getInnerText(b.cells[M.SORT_COLUMN_INDEX]);
//	if (aa == bb) return 0;
//	if (aa < bb) return -1;
//	return 1;
// };
//
//}}}

//{{{
// end Code downloaded from the Browser Experiments section of kryogenix.org
// end Copyright (c) 1997-date Stuart Langridge//
// END SORTABLE.JS//
//}}}

//{{{
//
//
// CORE HIJACK WARNINGS: 
//	(1) Depends on the table formatter being first in the config.formatters array
//	(2) Version-specifics - test on your version before adding to the logic here!
//
if(version.major == 2 && version.minor === 0 && version.revision == 11)
{
	config.formatters[0].handler = function(w)
	{
		var table = createTiddlyElement(w.output,"table");
		w.nextMatch = w.matchStart;
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		var currRowType = null, nextRowType;
		var rowContainer, rowElement;
		var prevColumns = [];
		var rowCount = 0;
		var want_sortable=0;
		do {
			lookaheadRegExp.lastIndex = w.nextMatch;
			var lookaheadMatch = lookaheadRegExp.exec(w.source);
			var matched = lookaheadMatch && lookaheadMatch.index == w.nextMatch;
			if(matched)
			{
				nextRowType = lookaheadMatch[2];
				if(nextRowType != currRowType)
				rowContainer = createTiddlyElement(table,this.rowTypes[nextRowType]);
				currRowType = nextRowType;
				if(currRowType == "c")
				{
					if(rowCount === 0)
						rowContainer.setAttribute("align","top");
					else
						rowContainer.setAttribute("align","bottom");
					w.nextMatch = w.nextMatch + 1;
					w.subWikify(rowContainer,this.rowTerminator);
					table.insertBefore(rowContainer,table.firstChild);
				}
				else
				{
					var rowClass = (rowCount & 1) ? "oddRow" : "evenRow";
					rowElement = createTiddlyElement(rowContainer,"tr",null,rowClass);
					this.rowHandler(w,rowElement,prevColumns);
				}
				if(currRowType == "h") {
					want_sortable=1;
				}
				rowCount++;
			}
		} while(matched);
		if (want_sortable) {
			table.setAttribute("class","sortable");
			config.macros.sortableGridPlugin.ts_makeSortable(table);
		}
	};
} 
else if(version.major == 2 && version.minor == 1)
{
	config.formatters[0].handler = function(w)
	{
		var table = createTiddlyElement(w.output,"table");
		var prevColumns = [];
		var currRowType = null;
		var rowContainer;
		var rowCount = 0;
		var want_sortable = 0;
	    
		w.nextMatch = w.matchStart;
		this.lookaheadRegExp.lastIndex = w.nextMatch;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		while(lookaheadMatch && lookaheadMatch.index == w.nextMatch)
		{
			var nextRowType = lookaheadMatch[2];
			if(nextRowType == "k")
			{
				table.className = lookaheadMatch[1];
				w.nextMatch += lookaheadMatch[0].length+1;
			}
			else
			{
				if(nextRowType != currRowType)
				{
					rowContainer = createTiddlyElement(table,this.rowTypes[nextRowType]);
					currRowType = nextRowType;
				}
				if(currRowType == "c")
				{
					// Caption
					w.nextMatch++;
					if(rowContainer != table.firstChild)
						table.insertBefore(rowContainer,table.firstChild);
//[rbd lint warn]	rowContainer.setAttribute("align",rowCount == 0?"top":"bottom");
					rowContainer.setAttribute("align",rowCount === 0?"top":"bottom");
					w.subWikifyTerm(rowContainer,this.rowTermRegExp);
				}
				else
				{
					this.rowHandler(w,createTiddlyElement(rowContainer,"tr",null,(rowCount&1)?"oddRow":"evenRow"),prevColumns);
					if(currRowType == "h")	want_sortable = 1;
					rowCount++;
				}
			}
			this.lookaheadRegExp.lastIndex = w.nextMatch;
			lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		}
		if (want_sortable) {
			table.setAttribute("class","sortable");
			config.macros.sortableGridPlugin.ts_makeSortable(table);
		}
	};
}
else
	alert("SortableGridPlugin works only with TiddlyWiki 2.0.11 and 2.1.x");
    
//}}}
