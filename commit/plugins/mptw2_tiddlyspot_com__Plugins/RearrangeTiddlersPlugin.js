//{{{

// adapted from: http://www.cs.utexas.edu/~joeraii/dragn/#Draggable
// changes by ELS:
// * hijack refreshTiddler() instead of overridding createTiddler()
// * find title element by className instead of elementID
// * set cursor style via code instead of stylesheet
// * set tooltip help text
// * set tiddler "position:relative" when starting drag event, restore saved value when drag ends

// * update 2006.08.07: use getElementsByTagName("*") to find title element, even when it is 'buried' deep in tiddler DOM elements (due to custom template usage)

Story.prototype.rearrangeTiddlersHijack_refreshTiddler = Story.prototype.refreshTiddler;
Story.prototype.refreshTiddler = function(title,template,unused1,unused2,unused3,unused4,unused5)
{
	this.rearrangeTiddlersHijack_refreshTiddler(title,template,unused1,unused2,unused3,unused4,unused5);
	var theTiddler = document.getElementById(this.idPrefix + title); if (!theTiddler) return;
	var theHandle;
	var children=theTiddler.getElementsByTagName("*");
	for (var i=0; i<children.length; i++) if (hasClass(children[i],"title")) { theHandle=children[i]; break; }
	if (!theHandle) return theTiddler;

	Drag.init(theHandle, theTiddler, 0, 0, null, null);
	theHandle.style.cursor="move";
	theHandle.title="drag title to re-arrange tiddlers"
	theTiddler.onDrag = function(x,y,myElem) {
		if (this.style.position!="relative")
			{ this.savedstyle=this.style.position; this.style.position="relative"; }
		y = myElem.offsetTop;
		var next = myElem.nextSibling;
		var prev = myElem.previousSibling;
		if (next && y + myElem.offsetHeight > next.offsetTop + next.offsetHeight/2) { 
			myElem.parentNode.removeChild(myElem);
			next.parentNode.insertBefore(myElem, next.nextSibling);//elems[pos+1]);
			myElem.style["top"] = -next.offsetHeight/2+"px";
		}
		if (prev && y < prev.offsetTop + prev.offsetHeight/2) { 
			myElem.parentNode.removeChild(myElem);
			prev.parentNode.insertBefore(myElem, prev);
			myElem.style["top"] = prev.offsetHeight/2+"px";
		}
	};
	theTiddler.onDragEnd = function(x,y,myElem) {
		myElem.style["top"] = "0px";
		if (this.savedstyle!=undefined)
			this.style.position=this.savedstyle;
	}
	return theTiddler;
}

/**************************************************
 * dom-drag.js
 * 09.25.2001
 * www.youngpup.net
 **************************************************
 * 10.28.2001 - fixed minor bug where events
 * sometimes fired off the handle, not the root.
 **************************************************/

var Drag = {
	obj:null,

	init:
	function(o, oRoot, minX, maxX, minY, maxY) {
		o.onmousedown = Drag.start;
		o.root = oRoot && oRoot != null ? oRoot : o ;
		if (isNaN(parseInt(o.root.style.left))) o.root.style.left="0px";
		if (isNaN(parseInt(o.root.style.top))) o.root.style.top="0px";
		o.minX = typeof minX != 'undefined' ? minX : null;
		o.minY = typeof minY != 'undefined' ? minY : null;
		o.maxX = typeof maxX != 'undefined' ? maxX : null;
		o.maxY = typeof maxY != 'undefined' ? maxY : null;
		o.root.onDragStart = new Function();
		o.root.onDragEnd = new Function();
		o.root.onDrag = new Function();
	},

	start:
	function(e) {
		var o = Drag.obj = this;
		e = Drag.fixE(e);
		var y = parseInt(o.root.style.top);
		var x = parseInt(o.root.style.left);
		o.root.onDragStart(x, y, Drag.obj.root);
		o.lastMouseX = e.clientX;
		o.lastMouseY = e.clientY;
		if (o.minX != null) o.minMouseX = e.clientX - x + o.minX;
		if (o.maxX != null) o.maxMouseX = o.minMouseX + o.maxX - o.minX;
		if (o.minY != null) o.minMouseY = e.clientY - y + o.minY;
		if (o.maxY != null) o.maxMouseY = o.minMouseY + o.maxY - o.minY;
		document.onmousemove = Drag.drag;
		document.onmouseup = Drag.end;
		Drag.obj.root.style["z-index"] = "10";
		return false;
	},

	drag:
	function(e) {
		e = Drag.fixE(e);
		var o = Drag.obj;
		var ey = e.clientY;
		var ex = e.clientX;
		var y = parseInt(o.root.style.top);
		var x = parseInt(o.root.style.left);
		var nx, ny;
		if (o.minX != null) ex = Math.max(ex, o.minMouseX);
		if (o.maxX != null) ex = Math.min(ex, o.maxMouseX);
		if (o.minY != null) ey = Math.max(ey, o.minMouseY);
		if (o.maxY != null) ey = Math.min(ey, o.maxMouseY);
		nx = x + (ex - o.lastMouseX);
		ny = y + (ey - o.lastMouseY);
		Drag.obj.root.style["left"] = nx + "px";
		Drag.obj.root.style["top"] = ny + "px";
		Drag.obj.lastMouseX = ex;
		Drag.obj.lastMouseY = ey;
		Drag.obj.root.onDrag(nx, ny, Drag.obj.root);
		return false;
	},

	end:
	function() {
		document.onmousemove = null;
		document.onmouseup = null;
		Drag.obj.root.style["z-index"] = "0";
		Drag.obj.root.onDragEnd(parseInt(Drag.obj.root.style["left"]), parseInt(Drag.obj.root.style["top"]), Drag.obj.root);
		Drag.obj = null;
	},

	fixE:
	function(e) {
		if (typeof e == 'undefined') e = window.event;
		if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
		if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
		return e;
	}
};
//}}}
