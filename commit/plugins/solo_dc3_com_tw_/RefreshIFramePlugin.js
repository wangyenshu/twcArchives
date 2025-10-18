/***
|''Name:''|RefreshIFramePlugin|
|''Description:''|Refresh an entire tiddler with optional periodic re-refresh|
|''Date:''|Oct 6, 2006|
|''Source:''|http://solo.dc3.com/tw/index.html#RefreshIFramePlugin|
|''Author:''|Bob Denny ~DC-3 Dreams, SP|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|''Version:''|1.0.4|
|''~CoreVersion:''|2.0.11, 2.1.0|
|''Browser:''|Firefox 1.5; Internet Explorer 6.0; Safari|
|''Require:''|CheckboxPlugin (http://www.TiddlyTools.com/#CheckboxPlugin)|
!Description
This macro provides a tiddler with an <iframe> refresh control. This permits refreshing just the iframe, avoiding flashing due to refreshing the entire tiddler. Normally, a refresh button appears at the location of the macro invocation. Clicking this button causes the contents of the tiddler to be refreshed. Optionally, a checkbox may also be displayed with which the user can enable and disable automatic periodic refresh of the tiddler at an interval specified by the third parameter. Finally, for special applications, a fourth parameter may be given, and if "true" both the button and the checkbox will be hidden, and the tiddler will simply refresh periodically at the interval given by the third parameter.

@@There is a //lot// you can do with iframes in a tiddler@@. For more information see my ~TiddkyWiki [[Magic With <iframe>|http://solo.dc3.com/tw/HandlingIframes.html]]. 
!Usage
This plugin supports tiddlers with a single <iframe>, thus it assiciates itself with the first/only <iframe> in a tiddler. To add refreshing, simply invoke the macro (with optional parameters as desired, see below) wherever you want the button and optional checkbox to appear.

There are four optional parameters:
|!Parameter|!Description|
|''1''|(optional) Button label, default "Refresh"|
|''2''|(optional) Button tooltip, default "Refresh the remote frame"|
|''3''|(optional) Periodic refresh interval, sec., default 0 (no periodic refresh checkbox)|
|''4''|(optional) If present and "true" and parameter 3 > 0 all controls will be hidden and the tiddler will refresh periodically whenever it is visible.|
!!Revision History
<<<
''2006.09.22 [1.0.1]'' Initial creation, from RefreshTiddler
''2006.09.29 [1.0.2]'' Refresh checkbox cookie names different from RefreshTiddler.
''2006.10.03 [1.0.3]'' Add parameter to hide button and checkbox while doing periodic refresh. Expand documentation, lint check, validate with ~TiddlyWiki 2.1.0
''2006.10.03 [1.0.4]'' Handle race condition on IE - initial refresh lost. Force refresh at end of handler(). Disable container refreshing for checkbox, see CheckboxPlugin.
<<<
!!Code
***/
//{{{
version.extensions.RefreshIFrame = {
 major: 1, minor: 0, revision: 4,
 date: new Date(2006, 10, 6), 
 type: 'macro',
 source: "#RefreshIFramePlugin"
};

config.macros.RefreshIFrame = 
{
	states: { },													// Associative array of refresh states indexed by tiddler name
    
	handler: function(place, macroName, params, wikifier, paramString, tiddler)
	{
		var tidTitle = tiddler.title;								// Shortcut
		if(!this.states[tidTitle]) this.states[tidTitle] = {		// Array of state objects for refreshed tiddlers
				iframe: null,
				butLabel: "",
				butTooltip: "",
				refInterval: 0,
				doRefresh: false,
				initPerRef: false,
				timerId: 0,
				chkBox: null
				};
		var state = this.states[tidTitle];							// Shortcut
		var iframes = place.getElementsByTagName("iframe");
		if(iframes.length === 0) {
			displayMessage("PostForm: No iframe in tiddler!");
 			return;
 		}
		state.iframe = iframes[0];									// Only 1st iframe
		state.butLabel = params[0] ? params[0] : "Refresh"; 		// Make these react to edits
		state.butTooltip = params[1] ? params[1] : "Refresh the remote frame";
		state.refInterval = params[2] ? params[2] : 0;				// 0 = no periodic refresh checkbox
		var hidden = params[3] && params[3].toLowerCase() == "true" && state.refInterval > 0;
		if(!hidden)	{												// Unless want hidden
			var btn = createTiddlyButton(place, state.butLabel, state.butTooltip, this.onButClick);
			btn.name = tidTitle;									// Set button name to tiddler name (see onButClick())
			if(state.refInterval > 0) 								// If periodic refresh wanted
			{
				wikify(" [ =chkPerRefIfr" + tiddler.created.convertToYYYYMMDDHHMM() + // Uniquify chkbox ID
					"{config.macros.RefreshIFrame.states[\"" + tidTitle + "\"].chkBox = this; " + 
					"this.refresh.container=false;}" +
					"{config.macros.RefreshIFrame.onChkClick(\"" +  tidTitle + "\");}] " + 
					state.butLabel + " every " + state.refInterval + " seconds", place);
				state.timerId = 0;
				if(!state.initPerRef) this.onChkClick(tidTitle);	// Simulate checkbox click (state already from cookie)
			}
		} else if(state.refInterval > 0 && !state.initPerRef) {		// Hidden, if per ref and not started, start it
			if(state.timerId) clearTimeout(state.timerId);
			this.startRefresh(tidTitle); 
			state.initPerRef = true;
		}
		state.iframe.src = state.iframe.src;						// Refresh!
	},
    
	onButClick: function(e) 
	{
		if(!e) e = window.event;
		var tidTitle = resolveTarget(e).name;						// Name is the tiddler name!
		//displayMessage("but " + tidTitle);
		var iframe = config.macros.RefreshIFrame.states[tidTitle].iframe;
		iframe.src = iframe.src;									// Refresh!
		return false;
	},
    
	onChkClick: function(tidTitle) 
	{
		var state = this.states[tidTitle];
		if(state.chkBox.checked) {
			if(state.timerId) clearTimeout(state.timerId);
			this.startRefresh(tidTitle); 
		} else { 
			state.doRefresh = false;
		}
		state.initPerRef = true;
	},
    
	startRefresh: function(tidTitle) 
	{
		var state = this.states[tidTitle];
		state.doRefresh = true;
		//displayMessage("st " + tidTitle + " " + state.refInterval);
		state.timerId = setTimeout("config.macros.RefreshIFrame.reRefresh(\"" + 
						tidTitle + "\")", state.refInterval * 1000);
	},
    
	reRefresh: function(tidTitle)
	{
		var state = this.states[tidTitle];
		state.timerId = 0;
		if(!state.doRefresh) return;
		// Kill re-refresh cycle if tiddler closed or edited
		var tidElem = document.getElementById(story.idPrefix + tidTitle);  // DON'T GET CUTE! THIS IS CORRECT!
		//**BUGBUG** Hardwired to EditTemplate!
		if(!tidElem || tidElem.attributes['template'].value == "EditTemplate") // Prevent hidden or editing
		{
			state.initPerRef = false;
			return;
		}
		//displayMessage("re " + tidTitle + " " + state.refInterval);
		state.iframe.src = state.iframe.src;						// Refresh!
		state.timerId = setTimeout("config.macros.RefreshIFrame.reRefresh(\"" + 
						tidTitle + "\")", state.refInterval * 1000);
	}
};
//}}}
