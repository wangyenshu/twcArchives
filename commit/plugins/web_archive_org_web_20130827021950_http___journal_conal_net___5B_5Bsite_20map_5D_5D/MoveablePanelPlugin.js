/***
|Name|MoveablePanelPlugin|
|Source|http://www.TiddlyTools.com/#MoveablePanelPlugin|
|Version|1.3.4|
|Author|Eric Shulman - ELS Design Studios|
|License|http://www.TiddlyTools.com/#LegalStatements <<br>>and [[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|~CoreVersion|2.1|
|Type|plugin|
|Requires|NestedSlidersPlugin|
|Overrides||
|Description||

Add move, size, max/restore mouse event handling and fold/unfold, hover/scroll, and close/dock toolbar command items to any floating panel or tiddler. (see NestedSlidersPlugin for floating panel syntax/usage).

!!!!!Usage
<<<
syntax: {{{<<moveablePanel>>}}}

example: //using NestedSlidersPlugin 'floating panel' syntax//
//{{{
+++^30em^[panel]<<moveablePanel>>this is a headline for the panel
----
	this is a moveable floating panel
	with a few lines of text
	as an example for you to try...
	//note: this line is really long so you can see what happens to word wrapping when you re-size this panel//
===
//}}}
Try it: +++^30em^[panel]<<moveablePanel>>this is a headline for the panel
----
	this is a moveable floating panel
	with a few lines of text
	as an example for you to try...
	//note: this line is really long so you can see what happens to word wrapping when you re-size this panel//
===


When the mouse is just inside the edges of the tiddler/panel, the cursor will change to a "crossed-arrows" symbol, indicating that the panel is "moveable".  Grab (click-hold) the panel anywhere in the edge area and then drag the mouse to reposition the panel.

To resize the panel, hold the ''shift'' key and then grab the panel: the cursor will change to a "double-arrow" symbol.  Drag a side edge of the panel to stretch horizontally or vertically, or drag a corner of the panel to stretch in both dimensions at once.

Double-clicking anywhere in the edge area of a panel will 'maximize' it to fit the current browser window.

When the mouse is anywhere over a panel (not just near the edge), a 'toolbar menu' appears in the ''upper right corner'', with the following command items:
*fold/unfold: ''fold'' temporarily reduces the panel height to show just one line of text.  ''unfold'' restores the panel height.
*hover/scroll: when you scroll the browser window, the moveable panels scroll with it.  ''hover'' lets you keep a panel in view, while the rest of the page content moves in the window.  ''scroll'' restores the default scrolling behavior for the panel.  //Note: Due to browser limitations, this feature is not currently available when using Internet Explorer (v6 or lower)... sorry.//
*close: ''close'' hides a panel from the page display.  If you have moved/resized a panel, closing it restores its default position and size.
*dock: unlike a floating panel, a moveable //tiddler// does not "float" on the page until it has actually been moved from its default position.  When moving a tiddler, the ''close'' command is replaced with ''dock'', which restores the tiddler to its default //non-floating// location on the page.
<<<
!!!!!Installation
<<<
import (or copy/paste) the following tiddlers into your document:
''MoveablePanelPlugin'' (tagged with <<tag systemConfig>>)
Note: for compatibility, please also install the current version of ''NestedSlidersPlugin''.
<<<
!!!!!Revision History
<<<
''2006.10.17 [1.3.4]'' when moving panel, adjust position for relative containing DIV
''2006.05.25 [1.3.3]'' in closePanel(), use p.button.onclick() so that normal processing (updating slider button tooltip, access key, etc.) is performed
''2006.05.11 [1.3.2]'' doc update
''2006.05.11 [1.3.1]'' re-define all functions within moveablePanel object (eliminate global window.* function definitions (and some "leaky closures" in IE)
''2006.05.11 [1.3.0]'' converted from inline javascript to true plugin
''2006.05.09 [1.2.3]'' in closePanel(), set focus to sliderpanel button (if any)
''2006.05.02 [1.2.2]'' in MoveOrSizePanel(), calculate adjustments for top and left when inside nested floating panels
''2006.04.06 [1.2.1]'' in getPanel(), allow redefinition or bypass of "moveable" tag (changed from hard-coded "tearoff")
''2006.03.29 [1.2.0]'' in getPanel(), require "tearoff" tag to enable floating tiddlers
''2006.03.13 [1.1.0]'' added handling for floating tiddlers and conditional menu display
''2006.03.06 [1.0.2]'' set move or resize cursor during mousetracking
''2006.03.05 [1.0.1]'' use "window" vs "document.body" so mousetracking in FF doesn't drop the panel when moving too quickly
''2006.03.04 [1.0.0]'' Initial public release
<<<
!!!!!Credits
<<<
This feature was developed by EricShulman from [[ELS Design Studios|http:/www.elsdesign.com]]
<<<
!!!!!Code
***/
//{{{
version.extensions.moveablePanel= {major: 1, minor: 3, revision: 4, date: new Date(2006,10,17)};
//}}}
//{{{
config.macros.moveablePanel= { 
	handler:
	function(place,macroName,params) {
		var p=this.getPanel(place); if (!p) return;

		// remember original panel event handlers, size, location, border
		if (!p.saved) p.saved= {
			mouseover: p.onmouseover,
			mouseout: p.onmouseout,
			dblclick: p.ondblclick,
			top: p.style.top,
			left: p.style.left,
			width: p.style.width,
			height: p.style.height,
			position: p.style.position,
			border: p.style.border
		};

		// create control menu items
		var menupos=p.className=="floatingPanel"?"float:right;":"position:absolute;right:2em;top:3em;";
		var menustyle=p.className!="floatingPanel"?'style="border:1px solid #666;background:#ccc;color:#000;padding:0px .5em;"':"";
		var html='<div style="font-size:7pt;display:none;'+menupos+'">&nbsp;';
		if (p.className=="floatingPanel")
			html+='<a href="javascript:;" title="reduce panel size" '+menustyle
				+' onclick="return config.macros.moveablePanel.foldPanel(this,event)">fold</a>&nbsp; ';
		if (!config.browser.isIE)
			html+='<a href="javascript:;" title="keep panel in view when scrolling"'+menustyle
				+' onclick="return config.macros.moveablePanel.hoverPanel(this,event)">hover</a>&nbsp; ';
		if (p.className=="floatingPanel")
			html+='<a href="javascript:;" title="close panel and reset to default size and position"'+menustyle
				+' onclick="return config.macros.moveablePanel.closePanel(this,event)">close</a>';
		else
			html+='<a href="javascript:;" title="reset panel to default size and position"'+menustyle
				+' onclick="return config.macros.moveablePanel.closePanel(this,event)">dock</a>';
		html+='</div>';
		p.menudiv=createTiddlyElement(place,"span");
		p.menudiv.innerHTML=html;

		// init mouse handling and tooltip
		p.title="drag edge to move, shift key=stretch, double-click=max/restore";
		p.onmouseover=function(event) {
			if (this.className=="floatingPanel"||this.style.position=="absolute"||this.style.position=="fixed") {
				if (this.className!="floatingPanel") this.style.border="1px dotted #999"; // border around tiddler
				this.menudiv.firstChild.style.display="inline";
			}
			if (this.saved.mouseover) return this.saved.mouseover(event);
		};
		p.onmouseout=function(event) {
			this.menudiv.firstChild.style.display="none";
			if (this.className!="floatingPanel") this.style.border=this.saved.border;
			if (this.saved.mouseout) return this.saved.mouseout(event);
		};
		p.ondblclick=function(event) {
			if (!config.macros.moveablePanel.maximizePanel(this,event)) return false; // processed
			return this.saved.dblclick?this.saved.dblclick(event):true;
		};
		p.onmousemove=function(event) { return config.macros.moveablePanel.setCursorPanel(this,event); };
		p.onmousedown=function(event) { return config.macros.moveablePanel.moveOrSizePanel(this,event); };
	},

	getPanel:
	function(place) {
		var p=place; while (p && p.className!='floatingPanel') p=p.parentNode; if (p) return p; // floatingPanel
		p=story.findContainingTiddler(place); if (!p || !store.getTiddler(p.getAttribute("tiddler"))) return null; // not in a tiddler

		// moveable **tiddlers** in IE have LOTS of problems... DISABLED FOR NOW... but floating panels still work in IE
		if (config.browser.isIE) return null;

		// tiddlers tagged (e.g. with "moveable") to allow movement?  use null or "" to bypass tag check
		var tag="moveable"; if (!tag || !tag.trim().length) return p;
		return (store.getTiddler(p.getAttribute("tiddler")).tags.find(tag)!=null)?p:null; // tiddler is tagged for moving
	},

	processed:
	function(event) {
		event.cancelBubble=true; if (event.stopPropagation) event.stopPropagation(); return false;
	},

	getClientWidth:
	function() {
		if(document.width!=undefined) return document.width;
		if(document.documentElement && document.documentElement.clientWidth) return document.documentElement.clientWidth;
		if(document.body && document.body.clientWidth) return document.body.clientWidth;
		if(window.innerWidth!=undefined) return window.innerWidth;
		return 100; // should never get here
	},

	closePanel:
	function(place,event) {
		if (!event) var event=window.event;
		var p=this.getPanel(place); if (!p) return true;
		if (p.hover) this.hoverPanel(p.hoverButton,event); 
		if (p.folded) this.foldPanel(p.foldButton,event); 
		p.maxed=false; 
		p.style.top=p.saved.top;
		p.style.left=p.saved.left;
		p.style.width=p.saved.width;
		p.style.height=p.saved.height;
		p.style.position=p.saved.position;
		if (p.button) { p.button.focus(); onClickNestedSlider({target:p.button}); } // click on slider "button" (if any) to close the panel
		return this.processed(event);
	},

	foldPanel:
	function(place,event) {
		if (!event) var event=window.event;
		var p=this.getPanel(place); if (!p) return true;
		if (!p.foldButton) p.foldButton=place;
		if (p.folded) {
			p.style.height=p.folded_savedheight;
			p.style.overflow=p.folded_savedoverflow;
		} else {
			p.folded_savedheight=p.style.height; p.style.height="1em"; 
			p.folded_savedoverflow=p.style.overflow; p.style.overflow="hidden";
		}
		p.folded=!p.folded;
		place.innerHTML=p.folded?"unfold":"fold";
		place.title=p.folded?"restore panel size":"reduce panel size";
		return this.processed(event);
	},

	hoverPanel:
	function(place,event) {
		if (config.browser.isIE) { return this.processed(event); } // 'fixed' position is not handled properly by IE :-(
		if (!event) var event=window.event;
		var p=this.getPanel(place); if (!p) return true;
		if (!p.hoverButton) p.hoverButton=place;
		if (p.hover)
			p.style.position=p.hover_savedposition;
		else
			{ p.hover_savedposition=p.style.position; p.style.position="fixed"; }
		p.hover=!p.hover;
		place.innerHTML=p.hover?"scroll":"hover";
		place.title=p.hover?"make panel move with page when scrolling":"keep panel in view when scrolling page";
		return this.processed(event);
	},

	maximizePanel:
	function(place,event) {
		if (!event) var event=window.event;
		var p=this.getPanel(place); if (!p) return true;
		var left=findPosX(p); var top=findPosY(p);
		var width=p.offsetWidth; var height=p.offsetHeight;
		var x=!config.browser.isIE?event.pageX:event.clientX;
		var y=!config.browser.isIE?event.pageY:event.clientY;
		if (x<left||x>=left+width||y<top||y>=top+height) return true; // not inside panel, let mousedown bubble through
		var edgeWidth=10; var edgeHeight=10;
		var isTop=(y-top<edgeHeight);
		var isLeft=(x-left<edgeWidth);
		var isBottom=(top+height-y<edgeHeight);
		var isRight=(left+width-x<edgeWidth);
		if (!(isTop||isLeft||isBottom||isRight))
			return true; // not near an edge... let double click bubble through
		if (p.folded) this.foldPanel(p.foldButton,event); // unfold panel first (if needed)
		if (p.maxed) {
			p.style.top=p.max_savedtop;
			p.style.left=p.max_savedleft;
			p.style.width=p.max_savedwidth;
			p.style.height=p.max_savedheight;
			p.style.position=p.max_savedposition;
		} else {
			p.max_savedwidth=p.style.width;
			p.max_savedheight=p.style.height;
			p.max_savedtop=p.style.top;
			p.max_savedleft=p.style.left;
			p.max_savedposition=p.style.position;
			// IE gets the percentage stretch wrong if floating panel is inside a table
			p.style.width=config.browser.isIE?(getClientWidth()*0.95+"px"):"95%";
			p.style.height="95%";
			p.style.top=p.style.left='1em';
			p.style.position="absolute";
		}
		p.maxed=!p.maxed;
		return this.processed(event);
	},

	setCursorPanel:
	function(place,event) {
		if (!event) var event=window.event;
		var p=this.getPanel(place); if (!p) return true;
		var left=findPosX(p); var top=findPosY(p);
		var width=p.offsetWidth; var height=p.offsetHeight;
		var x=!config.browser.isIE?event.pageX:event.clientX;
		var y=!config.browser.isIE?event.pageY:event.clientY;
		if (x<left||x>=left+width||y<top||y>=top+height) return true; // not inside panel, let mousedown bubble through
		var edgeWidth=10; var edgeHeight=10;
		var isTop=(y-top<edgeHeight);
		var isLeft=(x-left<edgeWidth);
		var isBottom=(top+height-y<edgeHeight);
		var isRight=(left+width-x<edgeWidth);
		if (!(isTop||isLeft||isBottom||isRight))
			{ p.style.cursor="auto"; if (!p.savedtitle) p.savedtitle=p.title; p.title=""; }
		else {
			p.style.cursor=!event.shiftKey?"move":((isTop?'n':(isBottom?'s':''))+(isLeft?'w':(isRight?'e':''))+'-resize');
			if (p.savedtitle) p.title=p.savedtitle;
		}
		return true; // let mouseover event bubble through
	},

	moveOrSizePanel:
	function(place,event) {
		if (!event) var event=window.event;
		var p=this.getPanel(place); if (!p) return true;
		var left=findPosX(p); var top=findPosY(p);
		var width=p.offsetWidth; var height=p.offsetHeight;
		var x=!config.browser.isIE?event.pageX:event.clientX;
		var y=!config.browser.isIE?event.pageY:event.clientY;
		if (x<left||x>=left+width||y<top||y>=top+height) return true; // not inside panel, let mousedown bubble through
		var edgeWidth=10; var edgeHeight=10;
		var isTop=(y-top<edgeHeight);
		var isLeft=(x-left<edgeWidth);
		var isBottom=(top+height-y<edgeHeight);
		var isRight=(left+width-x<edgeWidth);
		if (!(isTop||isLeft||isBottom||isRight)) return true; // not near an edge... let mousedown bubble through
	
		// when resizing, change cursor to show directional (NSEW) "drag arrows"
		var sizing=event.shiftKey; // remember this for use during mousemove tracking
		if (sizing) p.style.cursor=((isTop?'n':(isBottom?'s':''))+(isLeft?'w':(isRight?'e':''))+'-resize');
	
		var adjustLeft=0; var adjustTop=0;
		var pp=p.parentNode; while (pp && pp.style.position!='relative') pp=parent.parentNode;
		if (pp) { adjustLeft+=findPosX(pp); adjustTop+=findPosY(pp); }
		var pp=p.parentNode; while (pp && pp.className!="floatingPanel") pp=pp.parentNode;
		if (pp) { adjustLeft+=findPosX(pp); adjustTop+=findPosY(pp); }
	
		// start tracking mousemove events
		config.macros.moveablePanel.activepanel=p;
		var target=p; // if 'capture' handling not supported, track within panel only
		if (document.body.setCapture) { document.body.setCapture(); var target=document.body; } // IE
		if (window.captureEvents) { window.captureEvents(Event.MouseMove|Event.MouseUp,true); var target=window; } // moz
		if (target.onmousemove!=undefined) target.saved_mousemove=target.onmousemove;
		target.onmousemove=function(e){
			if (!e) var e=window.event;
			var p=config.macros.moveablePanel.activepanel;
			if (!p) { this.onmousemove=this.saved_mousemove?this.saved_mousemove:null; return; }
	
			// PROBLEM: p.offsetWidth and p.offsetHeight do not seem to account for padding or borders
			// WORKAROUND: subtract padding and border (in px) when calculating new panel width and height
			// TBD: get these values from p.style... convert to px as needed.
			var paddingWidth=10.6667; var paddingHeight=10.6667;
			var borderWidth=1; var borderHeight=1;
			var adjustWidth=-(paddingWidth*2+borderWidth*2);
			var adjustHeight=-(paddingHeight*2+borderHeight*2);
	
			if (p.style.position!="absolute") { // convert relative DIV to movable absolute DIV
				p.style.position="absolute";
				p.style.left=left+"px"; p.style.top=top+"px";
				p.style.width=(width+adjustWidth)+"px"; p.style.top=(height+adjustHeight)+"px";
			}
			var newX=!config.browser.isIE?e.pageX:e.clientX;
			var newY=!config.browser.isIE?e.pageY:e.clientY;
			if (sizing) { // resize panel
				// don't let panel get smaller than edge "grab" zones
				var minWidth=edgeWidth*2-adjustWidth;
				var minHeight=edgeHeight*2-adjustHeight;
				p.maxed=false; // make sure panel is not maximized
				if (p.folded) this.foldPanel(p.foldButton,e); // make sure panel is unfolded
				if (isBottom) var newHeight=height+newY-y+1;
				if (isTop) var newHeight=height-newY+y+1;
				if (isLeft) var newWidth=width-newX+x+1;
				if (isRight) var newWidth=width+newX-x+1;
				if (isLeft||isRight) p.style.width=(newWidth>minWidth?newWidth:minWidth)+adjustWidth+"px";
				if (isLeft) p.style.left=left-adjustLeft+newX-x+1+"px";
				if (isTop||isBottom) p.style.height=(newHeight>minHeight?newHeight:minHeight)+adjustHeight+"px";
				if (isTop) p.style.top=top-adjustTop+newY-y+1+"px";
			} else { // move panel
				p.style.top=top-adjustTop+newY-y+1+"px";
				p.style.left=left-adjustLeft+newX-x+1+"px";
			}
			var status=sizing?("size: "+p.style.width+","+p.style.height):("pos: "+p.style.left+","+p.style.top);
			window.status=status.replace(/(\.[0-9]+)|px/g,""); // remove decimals and "px"
			return config.macros.moveablePanel.processed(e);
		};
	
		// stop tracking mousemove events
		if (target.onmouseup!=undefined) target.saved_mouseup=target.onmouseup;
		target.onmouseup=function(e){
			if (!e) var e=window.event;
			if (this.releaseCapture) this.releaseCapture(); // IE
			if (this.releaseEvents) this.releaseEvents(Event.MouseMove|Event.MouseUp); // moz
			this.onmousemove=this.saved_mousemove?this.saved_mousemove:null;
			this.onmouseup=this.saved_mouseup?this.saved_mouseup:null;
			config.macros.moveablePanel.activepanel=null;
			window.status="";
			return config.macros.moveablePanel.processed(e);
		};
		return this.processed(event); // mousedown handled
	}
};
//}}}