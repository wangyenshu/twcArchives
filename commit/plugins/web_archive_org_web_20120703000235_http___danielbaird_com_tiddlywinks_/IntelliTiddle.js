/***
|''Name:''|IntelliTiddle|
|''Version:''|0.1 (Oct 2005)|
|''Source:''|Tiddly W;nks (http://danielbaird.com/tiddlywinks/)|
|''Author:''|[[Daniel Baird]]|
|''Type:''|Erm..|
!Description

Thinking about a typeahead thing abc

test zone




!Notes
* no notes so far
aaaa[[a
!Revision History
* 0.1 (Oct-05)
** first go

***/
/*{{{*/

// =======================================================================
version.extensions.intellitiddle = {major: 0, minor: 1, revision: 0};
// =======================================================================
var intelliTiddle_guessMode = false;
var intelliTiddle_lastCode = 0;
var intelliTiddle_startAt = 0;
// first, override the edit tiddler function to install a keylistener
// -----------------------------------------------------------------------
intelliTiddle_OldCreateTiddlerEditor = createTiddlerEditor;
// -----------------------------------------------------------------------
createTiddlerEditor = function(title) {
 intelliTiddle_OldCreateTiddlerEditor(title);
 theBodyBox = document.getElementById('editorBody'+title);
 intelliTiddle_guessMode = false;
 theBodyBox.onkeyup = intelliTiddle_handleKeyUp;
}
// -----------------------------------------------------------------------
intelliTiddle_handleKeyUp = function(e) {
 if (!e) var e = window.event;
 if (intelliTiddle_guessMode == true) {
 // char 221 is the ]
 if (e.keyCode == 221) {
 intelliTiddle_guessMode = false;
 } else {
 // make a guess here..
 var node = resolveTarget(e);
 intelliTiddle_insertGuess(node, intelliTiddle_guessTiddler(node) );
 }
 } else {
 // char 219 is the [
 intelliTiddle_guessMode =
 (intelliTiddle_lastCode == 219 && e.keyCode == 219);
 if (intelliTiddle_guessMode) intelliTiddle_startAt = resolveTarget(e).selectionStart;
 intelliTiddle_lastCode = e.keyCode;
 }
// alert('after keyup, guessMode = ' + intelliTiddle_guessMode + ', lastcode = ' + intelliTiddle_lastCode);
}
// -----------------------------------------------------------------------
intelliTiddle_guessTiddler = function(node) {
 var typedstart = intelliTiddle_startAt;
 var typedend = node.selectionStart;
 var typed = node.value.substring(typedstart, typedend);
 var typedlen = typed.length;

 for(var t in store.tiddlers) {
 if ( t.substr(0,typedlen-1) == typed ) return t.substr(typedlen);
 }
}
// -----------------------------------------------------------------------
intelliTiddle_insertGuess = function(node, guess) {
 if (document.selection) {
 // first try for ie type stuff
 node.focus();
 sel = document.selection.createRange();
 sel.text = guess;
 } else if (node.selectionStart || node.selectionStart == '0') {
 // next try for ff/moz
 var startPos = node.selectionStart;
 var endPos = node.selectionEnd;
 node.value = node.value.substring(0, startPos) + guess + node.value.substring(endPos, node.value.length);
 node.selectionStart = startPos;
 node.selectionEnd = startPos + guess.length;
 } else {
 // otherwise do something lame
 node.value += guess;
 }
}
// -----------------------------------------------------------------------
// =======================================================================
/*}}}*/
