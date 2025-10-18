/***
|''Name:''|Corner|
|''Version:''|0.1 (Oct 2005)|
|''Source:''|Tiddly W;nks (http://www.bur.st/~blazeoz/tiddlywinks/)|
|''Author:''|[[Daniel Baird]]|
|''Type:''|Macro|
!Description

Just testing a corner made out of fat borders..

<<corner>>

!Notes
* Not very useful.

!Revision History
* 0.1 (Oct-05)
** first go

***/
/*{{{*/

version.extensions.corner = {major: 0, minor: 1, revision: 0};

config.macros.corner = {};

config.macros.corner.handler = function(place,macroName,params) {
    var pointing = params[0];
    var inColor = params[1];
	var outColor = params[2];
    var width = params[3];
    var height = params[4];

    if (pointing == undefined) pointing = 'nw';
    if (width == undefined) width = 3;
    if (height == undefined) height = width;
    if (inColor == undefined) inColor = '#003399';
    if (outColor == undefined) outColor = '#fff';

	var id = 'cornerhere';

    createTiddlyElement(place, 'div', id, null, 'corner here');
    var corner = new Corner(id);
    corner.drawCorner('nw', width, height, inColor, outColor);
    corner.drawCorner('ne', width, height, inColor, outColor);
}
// =======================================================================
function Corner(id) {
	this.version = '0.1 alpha';
	this.id = id;
    return this;
}
// -----------------------------------------------------------------------
Corner.prototype.makeBorder = function(elem, border, width, color) {
	var whichborder = border.substr(0,1).toUpperCase() + border.substr(1).toLowerCase();
	elem.style['border'+whichborder+'Style'] = 'solid';
	elem.style['border'+whichborder+'Width'] = width+'em';
	elem.style['border'+whichborder+'Color'] = color;
}
// -----------------------------------------------------------------------
Corner.prototype.drawCorner = function(pointing, width, height, inColor, outColor) {
	var inwidth = width * 0.75;
	var outwidth = width - inwidth;
	var inheight = height * 0.75;
	var outheight = height - inheight;

	if (pointing.substr(0,1) == 'n') {
		var bottomw = inheight;
		var bottomc = inColor;
		var topw = outheight;
		var topc = outColor;
	} else {
		var bottomw = outheight;
		var bottomc = outColor;
		var topw = inheight;
		var topc = inColor;
	}

	if (pointing.substr(1,1) == 'e') {
		var leftw = inwidth;
		var leftc = inColor;
		var rightw = outwidth;
		var rightc = outColor;
	} else {
		var leftw = outwidth;
		var leftc = outColor;
		var rightw = inwidth;
		var rightc = inColor;
	}

	var cnr = document.createElement('div');
	cnr.style.width = 0;
	cnr.style.height = 0;
	cnr.style.cssFloat = 'left';
//	cnr.style.display = 'block';
	this.makeBorder(cnr, 'top', topw, topc);
	this.makeBorder(cnr, 'right', rightw, rightc);
	this.makeBorder(cnr, 'bottom', bottomw, bottomc);
	this.makeBorder(cnr, 'left', leftw, leftc);

	document.getElementById(this.id).appendChild(cnr);
}
// =======================================================================
/*}}}*/
