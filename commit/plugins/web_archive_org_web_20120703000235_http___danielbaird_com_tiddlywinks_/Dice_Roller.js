/***
|''Name:''|Dice|
|''Version:''|0.5 (21 Oct 2005)|
|''Source:''|Tiddly W;nks (http://danielbaird.com/tiddlywinks/)|
|''Author:''|[[Daniel Baird]]|
|''Type:''|Macro|
!Description
Tell it what dice you want, and it'll let you roll them.

!Syntax/Example usage

{{{<<dice>>}}} for 3d6

{{{<<dice }}}//{{{specifier}}}//{{{ [}}}//{{{options}}}//{{{]>>}}} where specifier is something like 3d6, 1d4+1, 2d10-5

{{{<<dice fudge [}}}//{{{options}}}//{{{]>>}}} will roll 3 fudge dice (a fudge die gives -1, 0, or +1)

options can be zero or more of the following:

* show:eachface
** shows the face of each die rolled, then the total (not yet implemented)
* show:eachroll
** shows the number on each die rolled, then the total (default)
* show:result
** shows just the total result of the roll
* initialroll:yes
** do a roll when initially displayed
* initialroll:no
** don't roll until the user says so (default)
* rollby:click
** user clicks anywhere on the diceroller area to roll
* rollby:link
** user clicks an underlined link to roll (default)
* rollby:button
** user clicks a button to roll

eg:

{{{<<dice>>}}}
<<dice>>

{{{<<dice 3d6+2 rollby:button>>}}}
<<dice 3d6+2 rollby:button>>

{{{<<dice fudge initialroll:yes rollby:click>>}}}
<<dice fudge initialroll:yes rollby:click>>


!Notes
* much changing during this 0.5 version.

!Revision History
* 0.1
** first release
* 0.2
** changed the corners to slightly prettier ugly text chars
** finally got rid of the borders
** got rid of heading
** added 'Fudge' mode
* 0.3 (5 Oct 2005)
** fixed the problem with multiple dice rollers
* 0.31 (12 Oct 2005)
** worked out how to use a closure as a event handler, which means that the code added in 0.3 could be made a lot simpler.
* 0.5 (21 Oct 2005)
** aiming at getting a whole rewrite done. much progress!.

***/
/*{{{*/
// =======================================================================
version.extensions.dice = {major: 0, minor: 5, revision: 0};

config.macros.dice = {};

config.macros.dice.handler = function(place,macroName,params) {

    var rolldesc = params[0];
    if (rolldesc == undefined) rolldesc = '3d6';

	var options = '';
    if (params.length > 1) {
		params.shift();
    	options = params.join(' ');
	}

    var thisDiceRoller = new DiceRoller();
    createTiddlyElement(place, 'div', thisDiceRoller.id, null, 'If you see this, DiceRoller is broken.  Let Daniel know (DanielBaird at gmail dot com).');
    thisDiceRoller.newDice(rolldesc, options);
}
// =======================================================================
function DiceRoller() {
	this.idprefix =  'dice';
    this.version = '0.5 beta';
    this.id = this.idprefix + DiceRoller.prototype.nextid;
    DiceRoller.prototype.nextid++;
    return this;
}
// -----------------------------------------------------------------------
DiceRoller.prototype.nextid = 0;
// -----------------------------------------------------------------------
DiceRoller.prototype.newDice = function(rolldesc, options) {

	this.error = null;
	this.initialroll = false;
	this.display = 'eachroll';
	this.rolltag = 'roll';
	this.rollagaintag = 'roll again';
	this.rollby = 'link';
	this.parseDesc(rolldesc);
	this.parseOpts(options);
	if (this.initialroll) this.rollDice();
	this.drawRoller();
// ^^^^^^^^^^^^^ new stuff above.. ^^^^^^^^^^^^^
//    this.rolls = rolls;

//    this.resultDisplay = 'dice';
//    if (resultDisplay != null)	this.resultDisplay = resultDisplay;

//    this.resultSystem = 'sum';
//    if (resultSystem != null)	this.resultSystem = resultSystem;

//    this.sides = 6;
//    this.createDice();
//	this.roll();
}
// -----------------------------------------------------------------------
DiceRoller.prototype.parseDesc = function(desc) {
	this.rollstr = desc;
	desc = desc.toLowerCase();
	this.dicetype = 'standard';
	this.adjuster = null;
	if (desc == 'fudge') {
		// 'fudge' system: 3d3, where the d3 gives -1, 0 or +1
		this.dicetype = 'fudge';
		this.dicesides = 3;
		this.rollcount = 3;
	} else {
		// normal system: eg 3d6+2
		var reg = /(\d+)d(\d+)(\+(\d+)|-(\d+))?/;
		var info = desc.match(reg);
		this.rollcount = parseInt(info[1]);
		this.dicesides = parseInt(info[2]);
		this.adjuster = parseInt(info[3]);
		if ( isNaN(this.adjuster) ) this.adjuster = 0;
	}
}
// -----------------------------------------------------------------------
DiceRoller.prototype.parseOpts = function(options) {
	this.optstr = options;
	options = ' ' + options + ' ';
	if (options.indexOf(' show:eachface ') != -1) this.display = 'eachface';
	if (options.indexOf(' show:eachroll ') != -1) this.display = 'eachroll';
	if (options.indexOf(' show:result ') != -1) this.display = 'result';

	if (options.indexOf(' initialroll:yes ') != -1) this.initialroll = true;
	if (options.indexOf(' initialroll:no ') != -1) this.initialroll = false;

	if (options.indexOf(' rollby:click ') != -1) this.rollby = 'click';
	if (options.indexOf(' rollby:link ') != -1) this.rollby = 'link';
	if (options.indexOf(' rollby:button ') != -1) this.rollby = 'button';
}
// -----------------------------------------------------------------------
DiceRoller.prototype.createDice = function() {
    this.results = new Array(this.rolls);
    this.result = 0;
    this.showDice();
}
// -----------------------------------------------------------------------
DiceRoller.prototype.drawRoller = function() {
    var node = document.getElementById(this.id);
	if (this.display == 'eachface') node.innerHTML = this.drawRollerEachFace();
	if (this.display == 'eachroll') node.innerHTML = this.drawRollerEachRoll();
	if (this.display == 'result') node.innerHTML = this.drawRollerResult();

    // getClickHandler() is a function that returns a function.. JS is sweet huh
    if (this.rollby == 'click') {
		node.onclick = this.getClickHandler();
	} else {
		document.getElementById(this.id + '_roll').onclick = this.getClickHandler();
	}
	/*
    var html = '';

	if (this.display == 'eachface')

    html += '<table class="diceroller">';
    html += '<tr>';

	if (this.resultDisplay == 'text') {
		html.push('<td>You rolled ');
	}
	if (this.resultDisplay != 'textsummary') {
		var separator = '';
		for (var roll = 0; roll < this.rolls; roll++) {
			html.push( separator + this.drawDie(roll) );
			if (this.resultDisplay == 'text')	separator = ', ';
		}
		html.push('<td>');
	}
    if (this.resultSystem == 'fudge') {
	var resprefix = '';
	if (this.result > 0) resprefix = '+';
	html.push('Result is ' + resprefix + this.result + '.<br />Click to roll again.</td>');
    } else {
	html.push('<td>'+this.rolls+'d'+this.sides+': you rolled ' + this.result + '.<br />Click to roll again.</td>');
    }

    html += '</tr></table>';
    node.innerHTML = html;
	*/
}
// -----------------------------------------------------------------------
DiceRoller.prototype.drawRollerResult = function() {
	var str = '';
	str += 'Rolling';
	str += ((this.dicetype == 'fudge')?(':'):(' ' + this.rollstr + ':'));
	if (this.result != undefined) {
		str += 'You rolled <strong>';
		str += ((this.dicetype == 'fudge')?(this.addSign(this.result)):(this.result));
		str += '</strong>.';
	}
	str += this.makeRollTrigger();
	return str;
}
// -----------------------------------------------------------------------
DiceRoller.prototype.drawRollerEachRoll = function() {
	var str = '';
	str += 'Rolling';
	str += ((this.dicetype == 'fudge')?(':'):(' ' + this.rollstr + ':'));
	if (this.result != undefined) {
		str += ' You rolled ';
		var joiner = '';
		for (var r = 0; r < this.rollcount; r++) {
			str += joiner + ((this.dicetype == 'fudge')?(this.addSign(this.results[r])):(this.results[r]));
			joiner = ', ';
		}
		str += ' totalling <strong>';
		str += ((this.dicetype == 'fudge')?(this.addSign(this.result)):(this.result));
		str += '</strong>.';
	}
	str += this.makeRollTrigger();
	return str;
}
// -----------------------------------------------------------------------
DiceRoller.prototype.addSign = function(num) {
	return ( ((parseInt(num) > 0)?('+'):('')) + (num) );
}
// -----------------------------------------------------------------------
DiceRoller.prototype.makeRollTrigger = function() {
	var tag = ((this.result == undefined)?(this.rolltag):(this.rollagaintag));
	if (this.rollby == 'click')  return ' Click to ' + tag + '.';
	if (this.rollby == 'link')   return ' <a style="text-decoration: underline" href="#" id="' + this.id + '_roll">' + tag + '</a>';
	if (this.rollby == 'button') return ' <button id="' + this.id + '_roll">' + tag + '</button>';
}
// -----------------------------------------------------------------------
DiceRoller.prototype.drawDie = function(roll) {
    var html = new Array();

	if (this.resultDisplay == 'text') {
		if (this.resultSystem == 'fudge' && this.results[roll] > 0) html.push('+');
		html.push(this.results[roll]);
	} else {
		html.push('<td class="die">');

		//there are seven possible dot positions
		var dots = Array();
		for (var dot = 0; dot < 7; dot++) {
			dots.push('&nbsp;');
		}
		if ( this.results[roll] ) {
			if (this.results[roll] > 1) dots[0] = 'O';
			if (this.results[roll] > 3) dots[1] = 'O';
			if (this.results[roll] == 6) dots[2] = 'O';
			if (this.results[roll]%2 == 1) dots[3] = 'O';
			if (this.results[roll] == 6) dots[4] = 'O';
			if (this.results[roll] > 3) dots[5] = 'O';
			if (this.results[roll] > 1) dots[6] = 'O';
		}
		var pipe = '|';
		var space = '&nbsp;';
		if (this.resultDisplay == 'dice') {
			html.push(',-----.<br />');
			html.push(pipe + space + dots[0] + space + dots[1] + space + pipe + '<br />');
			html.push(pipe + space + dots[2] + dots[3] + dots[4] + space + pipe + '<br />');
			html.push(pipe + space + dots[5] + space + dots[6] + space + pipe + '<br />');
			html.push('`-----\'<br />');
		} else if (this.resultDisplay == 'compact') {
			html.push(dots[0] + space + dots[1] + '<br />');
			html.push(dots[2] + dots[3] + dots[4] + '<br />');
			html.push(dots[5] + space + dots[6] + '<br />');
		}
		html.push('</td>');
	}
    return html.join('');
}
// -------------------------------------------------------------------
DiceRoller.prototype.rollDice = function() {
	this.result = this.adjuster;
	this.results = new Array(this.rollcount);
	for (var roll = 0; roll < this.rollcount; roll++) {
		this.results[roll] = Math.floor((this.dicesides)*Math.random())+1;
		if (this.dicetype == 'fudge') {
			this.results[roll] -= 2;
		}
		this.result += this.results[roll];
	}
	this.drawRoller();
}
// -----------------------------------------------------------------------
DiceRoller.prototype.getClickHandler = function() {
	// trickey bit.. first make a local var that references the
	// current dice roller object, then return an anonymous function
	// that calls that object's roll() method.  woot for closures!
	var thisroller = this;
	return function(e) {
		thisroller.rollDice();
		return false;
	};
}
// =======================================================================
setStylesheet(
	".viewer table.diceroller, .viewer table.diceroller tr { "+
		"border: none;" +
	"} \n"+

	".viewer table.diceroller tr td { "+
		"border: none; " +
	"} \n"+

	".viewer table.diceroller td.die { "+
		"padding: 0.5em; " +
		"font-family: monospace; " +
		"line-height: 0.95em; " +
	"} \n"+

	"",
	"DiceRoller");

/*}}}*/