/***
|''Name:''|ResizeEditTextPlugin|
|''Author:''|Jon Scully|
|''~CoreVersion:''|2.1.2|
!!!!!Purpose
Adds a handle below the textarea of a tiddler, in edit mode, that the user can drag with the mouse to resize the textarea.
!!!!!Configuration
Add the following div to the end of the [[EditTemplate]] tiddler:
{{{<div macro='resize'></div>}}}
!!!!!Code
***/
/*{{{*/
config.macros.resize = {
	handler: function(place,macroName,params,wikifier,paramString,tiddler) {
		if (story.getTiddlerField(tiddler.title,"text"))
			new TextAreaResizer(story.getTiddlerField(tiddler.title,"text"));
	}
}
/*}}}*/
/***
!!!!!TextAreaResizer
TextAreaResizer script by Jason Johnston (jj@lojjic.net)
Created August 2003.  Use freely, but give me credit.

This script adds a handle below textareas that the user can drag with the mouse to resize the textarea.
***/
/*{{{*/
function TextAreaResizer(elt) {
	this.element = elt;
	this.create();
}
TextAreaResizer.prototype = {
	create : function() {
		var elt = this.element;
		var thisRef = this;

		var h = this.handle = document.createElement("div");
		//h.className = "textarea-resizer"; // optional: replace the next 3 lines
		h.style.height = "4px";
		h.style.background = "#ddd";
		h.style.cursor = "s-resize";
		h.title = "Drag to resize text box";
		h.addEventListener("mousedown", function(evt){thisRef.dragStart(evt);}, false);
		elt.parentNode.insertBefore(h, elt.nextSibling);
	},
	
	dragStart : function(evt) {
		var thisRef = this;
		this.dragStartY = evt.clientY;
		this.dragStartH = parseFloat(document.defaultView.getComputedStyle(this.element, null).getPropertyValue("height"));
		document.addEventListener("mousemove", this.dragMoveHdlr=function(evt){thisRef.dragMove(evt);}, false);
		document.addEventListener("mouseup", this.dragStopHdlr=function(evt){thisRef.dragStop(evt);}, false);
	},
	
	dragMove : function(evt) {
		this.element.style.height = this.dragStartH + evt.clientY - this.dragStartY + "px";
	},
	
	dragStop : function(evt) {
		document.removeEventListener("mousemove", this.dragMoveHdlr, false);
		document.removeEventListener("mouseup", this.dragStopHdlr, false);
	},
	
	destroy : function() {
		var elt = this.element;
		elt.parentNode.removeChild(this.handle);
		elt.style.height = "";
	}
};
//TextAreaResizer.scriptSheetSelector = "textarea";
/*}}}*/
