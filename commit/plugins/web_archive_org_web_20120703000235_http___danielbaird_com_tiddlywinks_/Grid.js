/***
|''Name:''|Grid|
|''Version:''|0.1 (Oct 2005)|
|''Source:''|Tiddly W;nks (http://www.bur.st/~blazeoz/tiddlywinks/)|
|''Author:''|[[Daniel Baird]]|
|''Type:''|Macro|
!Description

Just testing a grid..

<<grid 30 10 10>>

!Notes
* Not very useful.

!Revision History
* 0.1 (Oct-05)
** first go

***/
/*{{{*/

version.extensions.grid = {major: 0, minor: 1, revision: 0};

config.macros.grid = {};

config.macros.grid.handler = function(place,macroName,params) {
    var width = params[1];
    var height = params[0];
    var zoom = params[2];
	var options = params[3];
	var realoptions = '';

    if (width == undefined) width = 30;
    if (height == undefined) height = width;
    if (zoom == undefined) zoom = 8;
    if (options == undefined) realoptions = 'resize';
    if (options == undefined && zoom > 2) realoptions = realoptions + ' gridlines';

	var aGrid = gridList.newGrid();

    createTiddlyElement(place,'div',aGrid.id,null,'If you see this, Grid is broken.  Let Daniel know (DanielBaird at gmail dot com).');
    aGrid.newGrid(width, height, zoom, realoptions);
}
// =======================================================================
function GridList() {
    this.prefix = 'grid';
    this.count = 0;
    this.list = {};
    return this;
}
// -----------------------------------------------------------------------
GridList.prototype.newGrid = function() {
    var newid = this.prefix+this.count;
    this.list[newid] = new Grid(newid);
    this.count++;
    return this.list[newid];
}
// -----------------------------------------------------------------------
GridList.prototype.handleClick = function(e) {
    if (!e) var e = window.event;
    var node = resolveTarget(e);
    var goodid = new RegExp('^'+gridList.prefix+'\\d+$');
    while ( ( !node.id || !goodid.test(node.id) ) && node.tagName.toUpperCase() != 'BODY'  ) {
        node = node.parentNode;
    }
    if (node.tagName.toUpperCase() != 'BODY') {
        gridList.list[node.id].handleClick(e);
    }
}
// =======================================================================
function Grid(id) {
	this.version = '0.1 alpha';
	this.id = id;
    return this;
}
// -----------------------------------------------------------------------
Grid.prototype.newGrid = function(height, width, zoom, options) {
    this.height = height;
    this.width = width;
    this.zoom = zoom;

	options = ' ' + options + ' ';
	this.options = {};
	this.options['gridlines'] = (options.indexOf(' gridlines ') != -1);
	this.options['resize'] = (options.indexOf(' resize ') != -1);

    this.startGrid();
}
// -----------------------------------------------------------------------
Grid.prototype.startGrid = function() {

    this.grid = new Array();

    // create the squares
    for (var x = 0; x < this.height; x++) {
        var row = new Array();
        for (var y = 0; y < this.width; y++) {
        	var red = Math.floor((255)*Math.random())+1;
        	var green = Math.floor((255)*Math.random())+1;
        	var blue = Math.floor((255)*Math.random())+1;
        	var sel = (1 == Math.floor((10)*Math.random())+1);
            row.push( {r:red, g:green, b:blue, selected: sel} );
        }
        this.grid.push(row);
    }
	this.message = 'not much happening yet.';
    this.showGrid();
}
// -----------------------------------------------------------------------
Grid.prototype.showGrid = function() {

    var node = document.getElementById(this.id);
    var html = new Array();

    html.push('<table class="grid">');
    html.push('<tr>');
	if (this.options.resize) html.push('<td></td><td></td>');
	html.push('<td class="info" colspan="'+this.width+'">Grid '+this.version+'</td>');
	if (this.options.resize) html.push('<td></td><td></td>');
	html.push('</tr>');
    if (this.options.resize) {
		html.push('<tr><td></td><td></td><td id="'+this.id+'_more_top" class="button" colspan="'+this.width+'">+</td><td></td><td></td></tr>');
		html.push('<tr><td></td><td></td><td id="'+this.id+'_less_top" class="button" colspan="'+this.width+'">-</td><td></td><td></td></tr>');
    }
    for (var x = 0; x < this.height; x++) {
        html.push('<tr>');
	    if (this.options.resize && x == 0) {
			html.push('<td id="'+this.id+'_more_left" class="button" rowspan="'+this.height+'">+</td>');
			html.push('<td id="'+this.id+'_less_left" class="button" rowspan="'+this.height+'">-</td>');
		}
        for (var y = 0; y < this.width; y++) {
            html.push( this.makeSquare(x,y) );
        }
	    if (this.options.resize && x == 0) {
			html.push('<td id="'+this.id+'_less_right" class="button" rowspan="'+this.height+'">-</td>');
			html.push('<td id="'+this.id+'_more_right" class="button" rowspan="'+this.height+'">+</td>');
		}
        html.push('</tr>');
    }
    if (this.options.resize) {
		html.push('<tr><td></td><td></td><td id="'+this.id+'_less_bot" class="button" colspan="'+this.width+'">-</td><td></td><td></td></tr>');
		html.push('<tr><td></td><td></td><td id="'+this.id+'_more_bot" class="button" colspan="'+this.width+'">+</td><td></td><td></td></tr>');
    }
    html.push('<tr>');
	if (this.options.resize) html.push('<td></td><td></td>');
	html.push('<td class="info" colspan="'+this.width+'">'+this.message);
    html.push('<small>');
    html.push('<br />' + this.height + ' x ' + this.width);
    html.push('</small>');
    html.push('</td>');
	if (this.options.resize) html.push('<td></td><td></td>');
	html.push('</tr>');
    html.push('</table>');
    node.innerHTML = html.join('');
    node.onclick = gridList.handleClick;
}
// -----------------------------------------------------------------------
Grid.prototype.makeSquare = function(x,y) {
    var sq = this.grid[x][y];
    var html = new Array();

    var padding = '0';
    if (this.options.gridlines) padding = '1px';

	var bordercolor = '#fff';
    if (sq.selected) bordercolor = '#f00';

    html.push('<td style="background-color:'+bordercolor+'; padding:'+padding+'">');
    html.push('<div style="margin:0; padding:0; width:'+this.zoom+'px; height:'+this.zoom+'px; background-color:rgb('+sq.r+','+sq.g+','+sq.b+')"></div>');
    html.push('</td>');
    return html.join('');
}
// -------------------------------------------------------------------
Grid.prototype.clickSquare = function(cx,cy,modifier) {
    // don't know what
}
// -------------------------------------------------------------------
Grid.prototype.handleClick = function(e) {
    // work out which cell was clicked
    if (!e) var e = window.event;
    var str = resolveTarget(e).id;
	if (str && str != undefined) {
        if (str == this.id + '_more_left') {
		} else {
			var cx = parseInt(str.substr( str.indexOf('x-')+2 ));
			var cy = parseInt(str.substr( str.indexOf('y-')+2 ));
			if ( !isNaN(cx) && !isNaN(cy) ) {
				this.clickSquare(cx,cy,(e.altKey || e.shiftKey || e.ctrlKey));
			}
		}
	}
}
// -----------------------------------------------------------------------
// for the event handling to work, we need a global list
var gridList = new GridList();
// -----------------------------------------------------------------------

setStylesheet(
	".viewer .grid { "+
		"border: none; "+
		"border-collapse: collapse; "+
		"border-spacing: 0px; "+
	"} \n"+

	".viewer .grid tr, .viewer .grid td { "+
		"border: none; "+
		"cursor: default; "+
        "padding: 0; "+
	"} \n"+

	".viewer .grid td.info { "+
		"width: auto; "+
        "padding: 0.2em; "+
	"} \n"+

	".viewer .grid td.button { "+
		"width: auto; "+
		"text-align: center; "+
		"vertical-align: center; "+
        "padding: 0.2em; "+
		"border: 1px solid #999; "+
		"border-left: 1px solid #ddd; "+
		"border-top: 1px solid #ddd; "+
		"background: #fff;"+
	"} \n"+

	"",
	"Grid");

/*}}}*/
