/***
|''Name:''|~DC3.LightBox|
|''Description:''|LightBox support library|
|''Date:''|Dec 25, 2006|
|''Source:''|http://solo.dc3.com/tw/#LightBoxPlugin|
|''Author:''|Bob Denny ~DC-3 Dreams, SP|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|''Version:''|1.0.1|
|''~CoreVersion:''|2.1.x|
|''Browser:''|Firefox 1.5/2.0; Internet Explorer 6.0/7.0; Safari|
|''Require:''|LightBoxCSS (see below), support HTML in MarkupPreHead (see below), access to icon images in subdir ''im'' (showAlert() only)|
!Description
This plugin implements a lightbox widget for ~TiddlyWiki. Via Javascript, you can display any HTML div in the lightbox, or use "canned" divs for displaying HTML message in a box or an alert with icon. The lightbox is closed by either clicking the X-icon or anywhere outside the lightbox. Only one lightbox can be active at a time. See the usage section below.
!!Usage
This plugin is a __library__, not a macro. Thus, it must be tagged {{{systemConfig}}}, but it does not support macro invocation. It is callable only from Javascript so the [[InlineJavascriptPlugin|http://www.tiddlytools.com/#InlineJavascriptPlugin]] is a virtual necessity!
|!Usage|!Sample Javascript|
|Display HTML message|{{{DC3.LightBox.showContent("Some <i>message</i>");}}}|
|Display alert|{{{DC3.LightBox.showAlert("ok", "All is well");}}}|
|Display any DIV in a lightbox|{{{DC3.LightBox.showBox("myLightBox");}}}|
|Close current lightbox|{{{DC3.LightBox.hideBox()}}}|
*The frame for the showContent() and showAlert() methods should expand to enclose text, but this happens only on IE and not FireFox. To be safe, just keep your messages short and use showBox() and your own HTML div for "big" messages etc.
*The first parameter to showAlert() is the icon name. This is simply translated to {{{im/icon.png}}}. The standard icon image files (below) are used with icon strings of "error, "info", "ok", "question", and "warning". 
*The generalized showBox() method can be used to display images, media players, whatever you want! Just make up the HTML div, give it an id, then pass that ID to showBox().
!!Advanced Usage - onClose
All three of the above methods support an optional parameter onClose, supplied as the last parameter in a call. It must evaluate to a function which is called (with no parameters) when the lightbox is about to close. If the onClose() function returns false, the lightbox will not be closed. For example 
{{{
DC3.LightBox.showAlert("warning", "Something <em>bad</em> is about to happen", soundBuzzer);
}}}
!Installation
#Paste this entire tiddler into a tiddler called DC3.LightBox and tag it {{{systemConfig}}}.
#Paste the Required CSS (below) into a tiddler called LightBoxCSS and tag it {{{systemContent}}}.
#Paste the content for MarkupPreHead (below) into MarkupPreHead.
#Put the image files (below) into a subfolder ''im'' relative to the location of the TiddlyWiki. 
!!!Required CSS
Paste into a tiddler called LightBoxCSS.
{{{
#lightBoxOverlay {
    position:absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 90;   
    background-color: #000;
    -moz-opacity: 0.6;
    opacity: .60;
    filter: alpha(opacity=60);
}
#lightBoxOverlay[id]{ 
    position: fixed;
}

div.lightBox {
    background: #2d2d2d;
    color: #fff;
    border: 2px solid #eee;
}

img.lightBoxClose {
    position: absolute;
    top: -5px;
    right: -5px;
    margin: 0px;
    cursor: pointer;
}

div.lightBoxAlert {
    width: 300px;
    height: 64px;
    background: #2d2d2d;
    color: #fff;
    padding: 10px;
    border: 2px solid #eee;
}

div.lightBoxAlertIcon {
	position: absolute;
	top: 8px;
	left: 8px;
	width: 48px;
	height: 48px;
}

div.lightBoxAlertMessage {
	margin-left: 56px;
	margin-top: 16px;
}
}}}
!!!Content for MarkupPreHead
{{{
<!-- LightBox translucent overlay -->
<div id="lightBoxOverlay" onclick="DC3.LightBox.hideBox()" style="display:none"></div>
<!-- General use simple LightBox -->
<div class="lightBox" id="lightBox" style="display:none">
	<img class="lightBoxClose" src="im/close.gif" onclick="DC3.LightBox.hideBox()" alt="Close" title="Close this window" />
	<div id="lightBoxContent"></div>
</div>
<!-- General use Alert LightBox -->
<div class="lightBoxAlert" id="lightBoxAlert" style="display:none">
	<img class="lightBoxClose" src="im/close.gif" onclick="DC3.LightBox.hideBox()" alt="Close" title="Close this window" />
	<div class="lightBoxAlertIcon"><img id="lightBoxAlertIcon" src="runtime" alt="runtime" title="runtime"></div>
	<div class="lightBoxAlertMessage" id="lightBoxAlertMessage">runtime</div>
</div>
<!-- End of LightBox -->
}}}
!!!Images (close box and alert icons)
These must be in a subfolder ''im'' below the ~TiddlyWiki. You can get the images by right clicking on the links and //save target/link//, or right clicking on the images and //save image//. @@Note: The images below will display ugly in IE6, but they will display nice (with transparency) in the lightbox alerts, owing to the use of the DXFilters for transparency in the code.@@
|[[close.gif|im/close.gif]]|[img[im/close.gif]]|[[error.png|im/error.png]]|[img[im/error.png]]|
|[[info.png|im/info.png]]|[img[im/info.png]]|[[ok.png|im/ok.png]]|[img[im/ok.png]]|
|[[question.png|im/question.png]]|[img[im/question.png]]|[[warning.png|im/warning.png]]|[img[im/warning.png]]|
!!Credits
This TiddlyWiki library and CSS is an amalgamation of the techniques and code described in the following: 
* [[Original LightBox|http://www.huddletogether.com/projects/lightbox/]] by Lokesh Dhakar
* [[Lightweight LightBox|http://www.pjhyett.com/posts/190-the-lightbox-effect-without-lightbox]] that can show any DIV by PJ Hyett
* [[Better Modal Windows with LightBox|http://blog.feedmarker.com/2006/02/12/how-to-make-better-modal-windows-with-lightbox/]] by Bruno
Bruno's CSS for the overlay is much better than the first two, it is independent of any PNG image(s) and does not have CSS quirk-hacks for IE, nor does it use IE's DXFilters for PNG transparency. Of course for IE6, the DXFilters are used in the Javascript!
!!Revision History
<<<
''2006.12.02 [1.0.1]'' Initial creation
''2006.12.03 [1.0.1]'' hideBox() no longer takes //id// just closes currently open box. Needed for overlay click/close.
''2006.12.03 [1.0.1]'' Add support for special Alert type LightBox with switchable icon. Hack IE for alpha transparency. See inline comments. Add showContent(html), showAlert(icon, message)
''2006.12.04 [1.0.1]'' Ignore show calls if box is already displayed. Optional callback for hideBox(), can prevent hiding. Allows modal box to be set up by caller.
''2006.12.25 [1.0.1]'' Documentation and installation instructions
<<<
!!Code
***/
//{{{

// Initialize style sheet from tiddler
refreshStyles("LightBoxCSS");

if (!window.DC3) window.DC3 = {};
window.DC3.LightBox = 
{
	//
	//Internal proterties
	//
	_curBox: null,						// [sentinel]
	_onClose: null,						// [sentinel]
	_alertImgDiv: null,					// [sentinel]
	_alertImgHTML: null,				// [sentinel]
	
	//
	// Public interface
	//
	showContent: function(content, onClose) {							// Uses generic LightBox in MarkupPreBody
		if(this._curBox) return;										// Ignore if box already showing (typ.)
		document.getElementById("lightBoxContent").innerHTML = content;
		this.showBox("lightBox", onClose);
	},
	
	showAlert: function(icon, message, onClose) {						// Uses standard alert LightBox in MarkupPreBody
		if(this._curBox) return;
		var icoElem = document.getElementById("lightBoxAlertIcon");
		icoElem.src = "im/" + icon + ".png";							// Requires icon.png (48 x 48)
		icoElem.title = icon;
		icoElem.alt = icon;
		document.getElementById("lightBoxAlertMessage").innerHTML = message;
		DC3.LightBox.showBox("lightBoxAlert", onClose);
	},
	
	showBox: function(id, onClose) 
	{
		if(this._curBox) return;
		this._onClose = onClose;										// If valid, call this in hideBox. See comments there!
		//
		// Surprise! In IE, the height:100% in the #overlay CSS definition does
		// not honor the z-order, and calculates the height to be the top margin!
		// So, for IE, I have added this imperfect hack which ,forces the overlay
		// size to the scroll size. This causes funny scrollbar behavior, but the
		// alternatives I tried were really complex. 
		//
		// Surprise #2! IE6 doesn't support alpha transparency in PNG images, and 
		// I use same for the icons in the LightBox Alert. Another hack needed.
		// We can't just change the DIV from containing an IMG tag to using the
		// bloody MS AlphaImageLoader, we also have to save the original IMG tag
		// because the alert is multi-use: the image to be shown can be changed 
		// dynamically. When closing the Lightbox, we restore the original inner
		// IMG tag and clear the filter style. On showing the box, we grab the path
		// to the image file then zap the IMG tag, using the image file path in
		// the filter/AlphaImageLoader. Egad!!!
		//
		var ovly = document.getElementById('lightBoxOverlay');
		if(config.browser.isIE) {
			var h1 = document.documentElement.scrollHeight;
			var h2 = document.documentElement.offsetHeight;
			ovly.style.height = Math.max(h1, h2);
			ovly.style.width = document.documentElement.scrollWidth;
			// Change icon div for IE proprietary
			var alertDivs = document.getElementById(id).getElementsByTagName("div");
			this._alertImgDiv = null;
			for(var i in alertDivs) {
				if(alertDivs[i].className && alertDivs[i].className == "lightBoxAlertIcon") {
					this._alertImgDiv = alertDivs[i];
					break;
				}
			}
			if(this._alertImgDiv) {
				var imgFile = this._alertImgDiv.firstChild.src;
				this._alertImgHTML = this._alertImgDiv.innerHTML;		// Saved to allow dynamic change of image file
				this._alertImgDiv.innerHTML = "";
				this._alertImgDiv.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\"" + imgFile + "\", sizingMethod=\"scale\")";
			}
		}
	    ovly.style.display = 'block';
	    this._center(id);
	    this._curBox = id;
	    return false;
	},
	
	hideBox: function()
	{
		if(!this._curBox) return;
		if(this._onClose && this._onClose() === false)					// If onClose() returns false, refuse to close
			return false;
	    document.getElementById(this._curBox).style.display = 'none';
	    document.getElementById('lightBoxOverlay').style.display = 'none';
	    this._curBox = null;											// Allow show calls once again
		// Restore original non-IE image. Code may dynamically change image file!
		if(this._alertImgDiv) {
			this._alertImgDiv.innerHTML = this._alertImgHTML;
			this._alertImgDiv.style.filter = "";
		}
	    return false;
	},
	
	//
	// Internal methods
	//
	_getDimensions: function(elem)		// Lifted from Prototype and made independent
	{
		if(elem.style.display != 'none')
		  return { width: elem.offsetWidth, height: elem.offsetHeight};
		
		// All *Width and *Height properties give 0 on elements with display none,
		// so enable the elem temporarily
		var els = elem.style;
		var origVis = els.visibility;
		var origPos = els.position;
		els.visibility = 'hidden';
		els.position = 'absolute';
		els.display = '';
		var origW = elem.clientWidth;
		var origH = elem.clientHeight;
		els.display = 'none';
		els.position = origPos;
		els.visibility = origVis;
		return {width: origW, height: origH};
	},
	
	//
	// This is rather big. I'll have to look at more elegant way(s)
	// of doing this... some day! :-)
	//
	_center: function(elem)
	{
	    try{
	        elem = document.getElementById(elem);
	    }catch(e){
	        return;
	    }
	
	    var my_width  = 0;
	    var my_height = 0;
	
	    if ( typeof( window.innerWidth ) == 'number' ){
	        my_width  = window.innerWidth;
	        my_height = window.innerHeight;
	    } else if ( document.documentElement && 
	             ( document.documentElement.clientWidth ||
	               document.documentElement.clientHeight ) ){
	        my_width  = document.documentElement.clientWidth;
	        my_height = document.documentElement.clientHeight;
	    }
	    else if ( document.body &&
	            ( document.body.clientWidth || document.body.clientHeight ) ){
	        my_width  = document.body.clientWidth;
	        my_height = document.body.clientHeight;
	    }
	
	    elem.style.position = 'absolute';
	    elem.style.zIndex   = 99;
	
	    var scrollY = 0;
	
	    if ( document.documentElement && document.documentElement.scrollTop ){
	        scrollY = document.documentElement.scrollTop;
	    }else if ( document.body && document.body.scrollTop ){
	        scrollY = document.body.scrollTop;
	    }else if ( window.pageYOffset ){
	        scrollY = window.pageYOffset;
	    }else if ( window.scrollY ){
	        scrollY = window.scrollY;
	    }
	
	    var elementDimensions = this._getDimensions(elem);
	
	    var setX = ( my_width  - elementDimensions.width  ) / 2;
	    var setY = ( my_height - elementDimensions.height ) / 2 + scrollY;
	
	    setX = ( setX < 0 ) ? 0 : setX;
	    setY = ( setY < 0 ) ? 0 : setY;
	
	    elem.style.left = setX + "px";
	    elem.style.top  = setY + "px";
	
	    elem.style.display  = 'block';
	}
};
//}}}
