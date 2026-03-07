/***
!!!<<gradient horiz #fc3 #fff>>&nbsp;MemorizablePlugin^^<<tiddler CloseThisOpen with: ThirdPartyPlugins  '« back'>>|<<toolbar editTiddler>>» ^^>>

|Name|MemorizablePlugin|
|Source|URL: http://memorizable.com|
|Version|1.0.0|
|Author|Craig D. Muth Copyright (c) 2007|
|Description|Creats flashcard like tables for memorizing data|
|For use in TiddlyWiki see|http://tinyurl.com/34fjk6|
***/
//{{{
// License
//
// Note: This is a modified version of the X11 (aka MIT) open source
// license.  It lets you use, modify, distribute and sell, etc.,
// requiring only that you leave the "Help" and "About Memorizable
// Tables" links (under "Options") in tact.  If you desire to use the
// software without these links please contact the author.
//
// COPYRIGHT AND PERMISSION NOTICE for Memorizable Tables
//
// Copyright (c) 2007, Craig D. Muth, memorizable.com
// Author's Website URL: http://memorizable.com
//
// All rights reserved.
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use, copy,
// modify, merge, publish, distribute, and/or sell copies of the
// Software, and to permit persons to whom the Software is furnished
// to do so, subject to the following conditions:
//
// The above copyright notice, Author's Website URL, and this
// permission notice shall be included in all copies or substantial
// portions of the Software, and any hyperlinks in the user interface
// in the Software which refer to any page on the Author's Website may
// not be removed, disabled, altered, obscured, or repositioned.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT OF THIRD PARTY RIGHTS. IN NO EVENT SHALL THE
// COPYRIGHT HOLDER OR HOLDERS INCLUDED IN THIS NOTICE BE LIABLE FOR
// ANY CLAIM, OR ANY SPECIAL INDIRECT OR CONSEQUENTIAL DAMAGES, OR ANY
// DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
// WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS
// ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE
// OF THIS SOFTWARE.
//
// Except as contained in this notice, the name of a copyright holder
// shall not be used in advertising or otherwise to promote the sale,
// use or other dealings in this Software without prior written
// authorization of the copyright holder.
//

Mem = new Object();

Mem.blankRowCount = 9;
Mem.mGray = "#d8d4c0";
Mem.mGreen = "#fff";
Mem.mClicked = "#b8b4a0";

Mem.myCellIndex = function(th) {
 var cells = th.parentNode.cells;
 var inn = 0;
 for(var x=0; x<cells.length; x++) {
  if(cells.item(x) == th)
   inn = x;
 }
 return inn;
}
Mem.start = function( item ) {
 var columnClicked;

 item.parentNode.parentNode.parentNode.parentNode.isMem = true;
 var t = this.setT( item );

 columnClicked = Mem.myCellIndex(item.parentNode);

 // If already in progress
 if( t.s && t.s.tbodyBackup ) {
  // Kill blinking processes
  this.tChile('directionsDiv').cycles = 1;
  Mem.restore();
 }

 // Create new if necessary
 if( typeof( t.s ) != 'object')
  t.s = new Array();

 t.s.column = columnClicked;

 // Create backup
 var bak = t.tBodies[0].cloneNode( true );
 t.s.tbodyBackup = bak;

 // Init correct count
 t.s.correctCount = 0;

 t.s.pending = new Array();

 var initialLength = t.tBodies[0].rows.length;
 for(var x=1; x<initialLength; x++) {
  // Build up list of indexes
  t.s.pending[t.s.pending.length] = t.tBodies[0].rows[1];
  // Remove from table
  t.tBodies[0].removeChild( t.tBodies[0].rows[1] );
 }

 t.s.totalQuestions = t.s.pending.length;

 var tds = t.s.pending[0].getElementsByTagName("TD");
 var numberOfColumns=tds.length;

 // Add blank rows to end
 for(var x=1; x<t.s.pending.length; x++) {
  if( x <= this.blankRowCount ) {
   var tr = document.createElement("TR");

   // For each column
   for(var y=0; y<numberOfColumns; y++) {
     var td = document.createElement("TD");  td.innerHTML = "&nbsp;";
     tr.appendChild( td );
   }
   t.tBodies[0].appendChild( tr );
  }
 }

 // If hidden blank rows
 if( t.s.pending.length > this.blankRowCount + 1 ) {

   // Add ... row
   var tr = document.createElement("TR");
   var td = document.createElement("TD");
   //   td.innerHTML = ". &nbsp; . &nbsp; .";
   td.innerHTML = "<div style='text-align: center; font-weight: bold; font-size: 6px; font-family: arial black; margin-top: 2px;'>. &nbsp; &nbsp; . &nbsp; &nbsp; .</div>";
   var colspan = document.createAttribute("COLSPAN");
   colspan.nodeValue=numberOfColumns;
   td.setAttributeNode(colspan);
   tr.appendChild( td );
   //numberOfColumns
   t.tBodies[0].appendChild( tr );

 }

 this.shuffle( t.s.pending ); t.s.pending.reverse(); this.shuffle( t.s.pending );

 // Add buttons, etc. to end of table.
 var tr = document.createElement("TR");
 var statusTd = document.createElement("TD");
 statusTd.id = 'statusTd';
 tr.appendChild( statusTd );
 var colspan = document.createAttribute("COLSPAN");
 colspan.nodeValue=numberOfColumns;
 statusTd.setAttributeNode(colspan);
 t.tBodies[0].appendChild( tr );


 // Create placeholders for buttons, etc.
 statusTd.innerHTML = "\
  <div id=mode style='text-align:right; height:19px; font-size:10px; color:#666;'>" + Mem.getModeDiv(0) + "</div>\
  <div id=directionsDiv style='margin-bottom:4px; text-align: left; font-size:10px; font-family:verdana,arial,sans-serif; color:#666;'></div>\
  <div id=buttons style='float:left; height:21px;'></div>\
  <div id=options style='padding: 5px 0px 0px 8px; width:55px; margin-top:0px; float:right;'><a href='#' onclick='return Mem.showOptions(this);' id=optionsLink>Options</a></div>\
  <div id=progress style='margin-top:6px; float:right; font-size:8px; font-family:impact; color:#aaa; text-align:right; vertical-align:middle; '></div>\

" + this.getOptions();

 // Enable options if enabled before
 if( t.s.optionsOn )
  this.showOptions( statusTd );

 this.presentQuestion();

 this.glow(100);
 t.s.mode = "flashcard";

 return false;
}

Mem.addEvent = function( obj, type, fn ) {
 if ( obj.attachEvent ) {
  obj['e'+type+fn] = fn;
  obj[type+fn] = function() {obj['e'+type+fn]( window.event );}
  obj.attachEvent( 'on'+type, obj[type+fn] );
 } else
  obj.addEventListener( type, fn, false );
}

Mem.getQuestionCell = function() {
 return Mem.t.s.pending[0].cells[ Mem.t.s.column ];
}

Mem.createProgressBar = function() {
 var progress = "";
 var progressDups = "";
 var foundAlready = new Array();
 for(var x=0; x<Mem.t.s.pending.length ;x++) {

  // If found already
  if( foundAlready[ Mem.t.s.pending[x].innerHTML ] )
   progressDups += "|";
  else
   progress += "|";

  // Remember we found this one
  foundAlready[ Mem.t.s.pending[x].innerHTML ] = true;
 }
 return progress + "<span style='color:#f00;'>" + progressDups + "</span>";
}


Mem.presentQuestion = function() {

 this.tChile('directionsDiv').innerHTML = 
  "<div style='text-align:center;'>Guess the answer <b style='color:#4d0'>in your head</b>.<span style='font-size:7px;'></span> Then click <b>show answer</b>, or type <b>1</b>.</div>";
 this.tChile('buttons').innerHTML = "<button id=showAnswer style='margin-right:111px; width:11em; margin-bottom:1px; font-family: verdana,arial,sans-serif; font-size:9px;' onclick='Mem.showAnswer( this )' >show answer &nbsp;<span style='color:#aaa;text-decoration:underline;'>1</span></button>";

 var iveGuessed = this.tChile('showAnswer');
 Mem.addEvent( iveGuessed, 'mouseover', function(){ if(typeof( iveGuessedOnMouseOver ) =='function') iveGuessedOnMouseOver() } );
 Mem.addEvent( iveGuessed, 'mouseout', function(){ if(typeof( iveGuessedOnMouseOver ) =='function') iveGuessedOnMouseOut() } );

 // Add pending row
 Mem.t.tBodies[0].insertBefore( Mem.t.s.pending[0], Mem.t.tBodies[0].rows[ Mem.t.s.correctCount + 1 ] );

 // Insert "guess the answer", remembering old value
 var questionCell = this.getQuestionCell();
 Mem.t.s.questionCellOld = questionCell.innerHTML;
 questionCell.innerHTML = "<span style='text-decoration:none; color:#4d0; font-weight:bold; cursor:pointer;' title=\"Guess the answer in your head.  Then, click the 'show answer' button.\">what&nbsp;goes&nbsp;here?</span>";

 // Help alert
 Mem.addEvent( questionCell.getElementsByTagName("SPAN")[0], 'mousedown', function(){ alert('Guess the answer in your head.  Then, click the \'show answer\' button at the bottom of the table.') } );

 this.tChile('progress').innerHTML = this.createProgressBar();
}

Mem.showAnswer = function( button, noScroll ) {
 var t = this.setT( button );

 // Exit if other mode
 if( t.s.mode != "flashcard" )
  return;

 // Exit if no answer to show
 if( t.s.questionCellOld == null )
  return;

 var questionCell = this.getQuestionCell();
 questionCell.innerHTML = t.s.questionCellOld;
 t.s.questionCellOld = null;

 // Default
 var iWasRightText = "I was right";

 // Count how many of this remaining
 var timesFound = 0;
 for(var x=0; x<t.s.pending.length ;x++)
  if( t.s.pending[x].innerHTML == t.s.pending[0].innerHTML )
   timesFound++;

 // If not the last time
 if( timesFound > 1 )
  iWasRightText = "show later";

 this.tChile('directionsDiv').innerHTML = 
  "<div style='text-align:center;'>Press the appropriate button based on your guess, or type <b>1</b> or <b>2</b>.</div>";
 this.tChile('buttons').innerHTML = "\

<button id=iWasWrong style='width:11em; padding:0px; margin: 0px 12px 1px 0px; font-family: verdana,arial,sans-serif; font-size:9px;' onclick='Mem.answer( false, this )'>I was wrong &nbsp;<span style='color:#aaa;text-decoration:underline;'>1</span></button>\
<button id=iWasRight class='iWasRightButton' style='width:10em; margin-bottom:1px; font-family: verdana,arial,sans-serif; font-size:9px;' onclick='Mem.answer( true, this )' >" + iWasRightText + " &nbsp;<span style='color:#aaa;text-decoration:underline;'>2</span></button>\

";
 this.tChile('progress').innerHTML = this.createProgressBar();

 var iWasRight = this.tChile('iWasRight');
 var iWasWrong = this.tChile('iWasWrong');
 Mem.addEvent( iWasRight, 'mouseover', function(){ if(typeof( iWasRightOnMouseOver ) =='function') iWasRightOnMouseOver() } );
 Mem.addEvent( iWasRight, 'mouseout', function(){ if(typeof( iWasRightOnMouseOut ) =='function') iWasRightOnMouseOut() } );
 Mem.addEvent( iWasWrong, 'mouseover', function(){ if(typeof( iWasWrongOnMouseOver ) =='function') iWasWrongOnMouseOver() } );
 Mem.addEvent( iWasWrong, 'mouseout', function(){ if(typeof( iWasWrongOnMouseOut ) =='function') iWasWrongOnMouseOut() } );

 if(! noScroll)
  this.scrollDownIfNecessary( this.tChile('statusTd') );

}

Mem.answer = function( correct, button, noScroll ) {

 var t = this.setT( button );

 // If answer not shown
 if( t.s.questionCellOld != null )
  return;

 // If other mode
 if( t.s.mode != "flashcard" )
  return;

 var dup = this.currentIsDuplicate();
 var last = t.s.pending[0];

 // Remove from front of pending
 t.s.pending.splice( 0, 1 );

 var allRows = t.tBodies[0].rows;

 if( correct ) {
  // If elsewhere in pending, remove from table
  if( dup )
   t.tBodies[0].removeChild( last );

  // If pending is empty, they're finished
  if( t.s.pending.length == 0 ) {
   this.finished();
   return;
  }

  // If not dup, increase count of correct
  if( ! dup ) {
   t.s.correctCount++;

   // If enough rows in table, remove last one (blank or ...)
   if( t.s.correctCount + this.blankRowCount >= t.s.totalQuestions - 1 )
    t.tBodies[0].removeChild( allRows[allRows.length - 2] );
  }
 }
 // If they missed it
 else {

  // Remove from table
  t.tBodies[0].removeChild( last );
  t.s.pending.push( last );
  t.s.pending.splice( 2, 0, last );
 }

 this.presentQuestion();

 if(this.tChile('directionsDiv').cycles >= 3)
  this.tChile('directionsDiv').cycles = 2;

 if(! noScroll)
  this.scrollDownIfNecessary( this.tChile('statusTd') );
}

Mem.currentIsDuplicate = function() {
 for(var x=1; x<Mem.t.s.pending.length ;x++) {
  if( Mem.t.s.pending[x] == Mem.t.s.pending[0] )
   return true;
 }
 return false;
}

Mem.message = function( s ) {
 var d = document.createElement('div');
 var t = document.createTextNode( s );
 d.appendChild(t);
 document.body.appendChild(d);
}

Mem.shuffle = function( list ) {
  var holder, swaps, i, j;
  for (swaps=0; swaps<(list.length*2); swaps++) {
    i = Math.floor(Math.random()*list.length);
    j = Math.floor(Math.random()*list.length);
    holder = list[i];
    list[i] = list[j];
    list[j]=holder;
  }
  return list;
}

Mem.dump = function( o ) {
 var s = "";
 for(m in o)
  s += m + ", ";
 return s;
}

Mem.keyWasPressed = function( keyp ) {

 var pressed;
 if( navigator.appName == "Netscape" ) pressed = keyp.which;
 if( navigator.appVersion.indexOf("MSIE") != -1 ) pressed = event.keyCode;

 // In case no table in progress
 try {
  // Show answer
  if ( ( pressed == "1".charCodeAt(0) ) || ( pressed == 97 ) ) {
   // If answer not shown yet
   if( Mem.t.s.questionCellOld != null )
    Mem.showAnswer();
   else
    Mem.answer( false );
  }

  // TODO make sure there are no modifiers held down (because of ctrl-r)
  // I was right
  if ( ( pressed == "2".charCodeAt(0) ) || ( pressed == 98 ) )
   Mem.answer( true );

 } catch(e) {}
}

Mem.memorizeAllTables = function( item, onlyDoTheseTables ) {

 // If we are a "hide" link
 if( item.innerHTML == "close" ) {
  item.innerHTML = item.innerHTML_old;

  var removeThis = item.parentNode.getElementsByTagName("DIV")[0];
  // Close and exit
  item.parentNode.removeChild( removeThis );
  return false;
 }

 // Change link to 'close'
 item.innerHTML_old = item.innerHTML;
 item.innerHTML = "close";

 // Create table in new div
 var d = document.createElement("div");
 d.innerHTML = "\
 <table class=\"memorizableAll\"><tr> \
   <th>Left Side <a style=\"font-size: 9px;\" href=\"#\" onclick=\"return Mem.start(this)\">(memorize)</a></th> \
   <th>Right Side <a style=\"font-size: 9px;\" href=\"#\" onclick=\"return Mem.start(this)\">(memorize)</a></th>\
 </tr></table>";

 // Get ref to it
 var tb = d.getElementsByTagName("TBODY")[0];

 var memTableCount = 0;

 // Convert list to map
 var onlyMap = [];
 if( onlyDoTheseTables )
  for(var x=0; x<onlyDoTheseTables.length; x++)
   onlyMap[ onlyDoTheseTables[x].toString() ] = true;

 // For each table
 var ts = document.getElementsByTagName("table");
 for(var x=0; x<ts.length; x++) {

  // In case null pointer when seeking anchor
  try {

   // If mem table
   if( ts[x].id == "memTable" ) {
    memTableCount++;

    if( onlyDoTheseTables && ! onlyMap[memTableCount.toString()] )
     continue;

    var rs = ts[x].rows;

    // If in progress, use backup
    if( ts[x].s && ts[x].s.tbodyBackup )
     rs = ts[x].s.tbodyBackup.rows;

    // Add each row to the table    
    for(var z=1; z<rs.length; z++)
     tb.appendChild( rs[z].cloneNode( true ) );
   }
  } catch(e) {}
 }

 // Append div
 item.parentNode.appendChild( d )

 // Start a session, using the 2nd "(memorize)" link
 Mem.start( d.getElementsByTagName("A")[1] );

 return false;
}

// Returns Y coord of top of element.
Mem.findY = function( o ) {
 var curtop = 0;
 if (o.offsetParent) {
  curtop = o.offsetTop
  while (o = o.offsetParent)
   curtop += o.offsetTop
 }
 return curtop;
}

// Get distance from page top to window bottom
Mem.getWindowBottomY = function() {
 // Get scrollY
 var scrollY = document.body.scrollTop;
 if( window.pageYOffset )
  scrollY = window.pageYOffset

 var winY = document.body.clientHeight;
 if( window.innerHeight )
  winY = window.innerHeight;

 return scrollY + winY;
}

Mem.scrollDownIfNecessary = function( obj ) {
 // If last row close to getting off-screen
 if( this.findY( obj ) + 55 > this.getWindowBottomY() ) {
  // Scroll down smoothly
  var myInterval = window.setInterval(function () { window.scrollBy( 0, 2 ); }, 10);
  window.setTimeout(function () { clearInterval(myInterval); },650);
 }
}

Mem.startFirst = function(level) {
 var as = byid('memTable').getElementsByTagName('a');
 var a = as.length == 1 ? as[0] : as[1];
 Mem.start( a );

 // If 2, start another record
 if(level == 2) {
  Mem.showAnswer(this.tChile('showAnswer'), true);
  Mem.answer(true, this.tChile('iWasRightButton'), true);
  this.tChile('directionsDiv').cycles = 100;
 }
}

Mem.parents = function(node, levels) {
 for(x=1;x<=levels;x++) node = node.parentNode;
 return node; 
}

Mem.showOptions = function(node) {

 this.setT(node);
 this.tChile('optionsLink').style.display="none";
 this.tChile('optionsBox').style.display="block";

 Mem.t.s.optionsOn = true;

 // Don't let clicking on options change default table
 this.restoreTBody();

 return false;
}

Mem.hideOptions = function(node) {

 this.setT(node);
 this.tChile('optionsLink').style.display="block";
 this.tChile('optionsBox').style.display="none";

 Mem.t.s.optionsOn = false;

 // Don't let clicking on options change default table
 this.restoreTBody();

 return false;
}

Mem.close = function( node ) {

 var t = this.setT( node );

 // Don't re-open options
 Mem.t.s.optionsOn = false;

 Mem.restore();

 // Invoke hook if reset
 if(node != null) {
  // In case method not there
  try {
   mem_close( t );
  } catch(e) {}
 }

 return false;
}

Mem.finished = function() {

 var directions = this.tChile('directionsDiv');
 var buttons = this.tChile('buttons');
 // Default values
 directions.innerHTML = "<div style='text-align:center;'>Congratulations, you've finished.</div>";
 buttons.innerHTML = "";

 // Restore rows
 this.addRowsFromBackup();

 // Call hook
 try {
  mem_finished( [directions, buttons] );
 } catch(e) {}

 Mem.glow(2, "finished");
 return false;
}

Mem.startOver = function( node ) {

 var t = this.setT( node );

 if( t.s.mode == "flashcard" )
  Mem.start( t.getElementsByTagName('a')[t.s.column] );

 else if( t.s.mode == "matching" )
  Mem.startMatching( t );

 return false;
}


Mem.startMatching = function( node ) {
 var t = this.setT( node );

 t.s.match0 = t.s.match1 = null;

 // Change help text
 this.tChile('mode').innerHTML = Mem.getModeDiv(1);
 this.tChile('directionsDiv').innerHTML = 
  "<div style='text-align:center;'><b>Note:</b> this table has been <i style='font-weight:bold; color:#f90; cursor: pointer;'><span onclick='Mem.startOver(this);'>shuffled</span></i>. Click items to identify matches.</div>";
 this.tChile('buttons').innerHTML = "";
 this.tChile('progress').innerHTML = "";

 var rows = t.rows;

 // Add rows from backup
 this.addRowsFromBackup();

 // Format them
 rows = t.rows;
 for(var x=1; x<(rows.length-1); x++) {
  var tds = rows[x].cells;
  // Add click events
  Mem.addEvent( tds[0], 'click', function(){ Mem.matchingClicked( this, 0 ) } );
  Mem.addEvent( tds[1], 'click', function(){ Mem.matchingClicked( this, 1 ) } );
  tds[0].style.cursor = tds[1].style.cursor = "pointer";
  tds[0].style.background = tds[1].style.background = tds[0].style.endColor = tds[1].style.endColor = Mem.mGray;
  // Add indexes
  tds[0].mIndex = tds[1].mIndex = x;
 }

 // Shuffle columns
 for (swaps=0; swaps<(rows.length*4); swaps++) {
  Mem.swapOnce(rows,0);
  Mem.swapOnce(rows,1);
 }

 this.glow(100);

 t.s.mode = "matching";

 return false; 
}

Mem.matchingClicked = function(cell, side) {

 // Exit if already correct
 if(cell.mState == "correct")
  return;

 var t = this.setT( cell );

 var rows = t.rows;
 // Update colors of others, and count remaining
 var remaining = 0;
 for(var x=1; x<(rows.length-1); x++) {
  var td = rows[x].cells[side];

  // If gray, clear it
  if((cell != td) && (td.mState == "guess")) {
   td.mState = null;
   td.style.background = td.endColor= Mem.mGray;
  }

  if(td.mState != "correct")  remaining++;
 }

 // Remember this was clicked
 if(side == 0)  t.s.match0 = cell;
 else  t.s.match1 = cell;

 // If already guessed
 if(cell.mState == "guess") {
  cell.mState = null;
  cell.style.background = cell.endColor = Mem.mGray;
  // Clear it
  if(side == 0)  t.s.match0 = null;
  else  t.s.match1 = null;

 } else {
  // Make it selected
  cell.mState = "guess";
  cell.style.background = cell.endColor = Mem.mClicked;
 }

 // Exit if neither are selected
 if(! (t.s.match0 && t.s.match1))
  return;

 // Go through backup table and look for matches
 var found = false;
 var backupRows = t.s.tbodyBackup.getElementsByTagName('tr');

 for(var x=1; x<backupRows.length; x++) {
  var tds = backupRows[x].getElementsByTagName('td');
  if((trim(t.s.match0.innerHTML) == trim(tds[0].innerHTML))
  && (trim(t.s.match1.innerHTML) == trim(tds[1].innerHTML)))
   found = true;
 }

 // If match
 if(found) {
  var directions = this.tChile('directionsDiv');
  if(directions.cycles > 2)
   directions.cycles = 2;

  // Make me dark green
  t.s.match0.mState = t.s.match1.mState = "correct";
  t.s.match0.endColor = t.s.match1.endColor = Mem.mGreen;
  t.s.match0.style.cursor = t.s.match1.style.cursor = "";

  // If finished - congrats message, restore rows
  if(remaining == 1) {
   directions.innerHTML = "<div style='text-align:center;'>Congratulations, you've finished. \

&nbsp; Try <a href='#' onclick='return Mem.flashcardMode(this)'>flashcard mode</a>.</div>";
   Mem.glow(2, "finished");
   this.addRowsFromBackup();
  } else {
   cell.style.background = Mem.mGray;
   Mem.glow(1, "green", t.s.match0, Mem.mGreen);
   Mem.glow(1, "green", t.s.match1, Mem.mGreen);
  }
  t.s.match0 = t.s.match1 = null;

  return;
 }

 // Must not have been found
 cell.style.background = Mem.mGray;
 Mem.glow(1, "red", cell, Mem.mClicked);

}

Mem.swapOnce = function( rows, index ) {
 var r1 = rows[Math.floor(Math.random() * (rows.length-2)) + 1];
 var r2 = rows[Math.floor(Math.random() * (rows.length-2)) + 1];
 var c1 = r1.cells[index];
 r1.replaceChild(r2.cells[index], c1);
 if(index == 0)
  r2.insertBefore(c1, r2.cells[0]);
 else
  r2.appendChild(c1);
}

Mem.getModeDiv = function( index ) {

 var r = "\
<span style='width:260px; text-align:right; padding: 0px 0px 2px 10px; letter-spacing:2px;\
border-left: solid #ccc 1px; \
border-bottom: solid #ccc 1px;'>\

";

 var modes = [["flashcard mode", "return Mem.flashcardMode(this)"], ["matching mode", "return Mem.startMatching(this)"]];
 for(var x=0; x<modes.length; x++) {

  if( x > 0 ) r += " | ";

  if(index == x)
   r += "<b>" + modes[x][0] + "</b>";
  else
   r += "<a style='color:#aaa;' href='#' onclick=\"" + modes[x][1] + "\">" + modes[x][0] + "</a>";

 }   
 r += "</span>";

 return r;
}

Mem.getOptions = function() {
 return "\
 <div style='display:none; line-height:17px; margin:27px 6px 4px 6px; padding: 3px 4px 4px 20px; border:dashed #fc0 2px;' id=optionsBox>\
  <a style='float:right; margin-top:-7px; font-size:9px;' href='#' onClick='return Mem.hideOptions(this)'>Hide Options</a>\
  -&nbsp;<a target='_blank' href='http://memorizable.com/Help'>Help</a>\
  &nbsp; &nbsp; -&nbsp;<a onclick='return Mem.startOver(this)' href='#'>Restart</a>\
  &nbsp; &nbsp; -&nbsp;<a onclick='return Mem.close(this)' href='#'>Cancel</a>\
 <br>\
  -&nbsp;<a target='_blank' href='http://memorizable.com/About_Memorizable_Tables'>About Memorizable Tables</a>\
 </div>\
 ";
}

Mem.setT = function(node) {

 // Return current, if no change
 if(! node)
  return this.t;

 // Remember last, for restoreTBody
 if(( typeof( Mem.t ) == 'object'))
   Mem.lastT = Mem.t;

 // Climb up parent until we find table
 while( ! node.isMem )
  node = node.parentNode;

 this.t = node;

 return node;
}

Mem.lookupT = function(nodex) {

 // Climb up parent until we find table
 while(! nodex.isMem)
  nodex = nodex.parentNode;

 return nodex;
}


Mem.restoreTBody = function() {
 Mem.t = Mem.lastT;
}

Mem.restore = function() {
 var orig = Mem.t.s.tbodyBackup;
 Mem.t.replaceChild( orig, Mem.t.tBodies[0] );
 Mem.t = orig.parentNode;
 // Whipe out ref to backup
 Mem.t.s.tbodyBackup = null;
}

Mem.addRowsFromBackup = function() {
 var t = this.t;
 var rows = t.rows;
 // Delete rows - except top and bottom
 var length = rows.length;
 for(var x=1; x<=length-2; x++)
  t.tBodies[0].removeChild( rows[length - (x+1)] );

 // Make copies from backup, add them to table
 var bak = t.s.tbodyBackup.cloneNode( true );
 var backupRows = bak.getElementsByTagName('tr');
 var length = backupRows.length;
 for(var x=1; x<length; x++)
  t.tBodies[0].insertBefore( backupRows[1], rows[rows.length-1] );
}


Mem.glow = function(cycles, color, glowDiv, endColor) {

 // Remember table
 if(!glowDiv) {
  glowDiv = this.tChile('directionsDiv');
  // Do nothing if already going
  if(glowDiv.cycles >= 1)
    return;
 }

 glowDiv.cycles = cycles;

 if(!endColor)
  endColor = "#fff";
 // Set end color to cell
 glowDiv.endColor = endColor;

 var glowLevel = color == "green" ? 35 : 0;
 var glowIncrement = color == "red" ? 8 : 2;
 if(color == "green") glowIncrement = 1;

 var myInterval = window.setInterval(function () {
  // Stop if cycles over
  if(glowDiv.cycles <= 0) {
   clearInterval(myInterval);
   return;
  }

  // Change level
  glowLevel += glowIncrement;
  // Go darker
  if(glowLevel < 0) {
   glowIncrement = 2;
   glowLevel += glowIncrement;
   // If this is the end, set it to the end color
   if(--glowDiv.cycles == 0) {
    glowDiv.style.background = glowDiv.endColor;
    return;
   }
  }
  // Go lighter
  if(glowLevel > 44) {
   glowIncrement = -2;
   glowLevel += glowIncrement;
   if(glowDiv.cycles == 1) {
    glowIncrement = color == "red" ? -6 : -1;
    if(color == "green") glowIncrement = -6;
   }
  }

  if(color == "red")
    Mem.glowColor(glowDiv, glowLevel, 180, 1, -2, -2);
  else if(color == "green")
    Mem.glowColor(glowDiv, glowLevel, 255, -3, 0, -5);
  else if(color == "finished")
    Mem.glowColor(glowDiv, glowLevel, 255, -2, 0, -4);
  else  // Orange
    Mem.glowColor(glowDiv, glowLevel, 255, 0, -1, -4);

 }, 43);
}

Mem.glowColor = function(glowDiv, glowLevel, start, r, g, b) {
  glowDiv.style.background = "rgb(" + (start+glowLevel*r) + "," + (start+glowLevel*g) + "," + (start+glowLevel*b) + ")";
}

Mem.chile = function(root, idName) {

 var maybe = root.getElementsByTagName( '*' );

 for(var x=0; x<maybe.length; x++)
  if( maybe[x].id == idName )
   return maybe[x];
}

Mem.tChile = function(idName) {

 return this.chile(this.t, idName);
}

Mem.flashcardMode = function(node) {

 Mem.setT(node);
 return Mem.start( Mem.t.getElementsByTagName('a')[Mem.t.s.column] );
}


function trim( s ) {
 return s.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
}

function byid( key ) {
  return document.getElementById( key );
}

Mem.addEvent( document, "keydown", Mem.keyWasPressed );

//}}}