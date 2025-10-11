/***
|''Name''|SvgEvent_Animations|
|''Description''|contains the global TW jQuery custom events.|
|''Author''|Mario Pietsch|
|''Version''|0.2.2|
|''Status''|''stable''|
|''Source''|http://fxplugins.tiddlyspace.com|
|''CoreVersion''|2.6|
|''Documentation''|[[SvgEvent_Info]]|
|''Keywords''|svg, events, animation, commands|

!Important

!Known issues

!History
*V 0.2.2
**Status: stable
**[[SvgEvent_Info]] has more info now.

*V 0.2.1
**cTglBg searches from parent() now

*V 0.2.0
**SvgEventzPlugin is not needed anymore
**New event names

!Code
***/
/*{{{*/
if(!version.extensions.SvgEvent_Animations) { //# ensure that the plugin is only installed once
version.extensions.SvgEvent_Animations= { installed: true };

(function($) {

// if you add components here a 
var eventTypes = ["cTglOpacity", "cTglBg", "cBigger", "cResize", "cSmaller", "cmd99"];

animations = {
	// IMPORTANT: if you add commands here, don't forget to add them at "var eventTypes" too!
	//trialUpdate
	cTglOpacity: function(e, trial) {
		if  (! trial.comp.animations) return false;

		var val = trial.elem.getAttribute('opacity');
		val = (val == 0.8) ? 1:0.8;
		trial.elem.setAttribute('opacity', val);
	},

	cTglBg: function(e, trial) {
		if  (! trial.comp.animations) return false;

		var elem = jQuery(trial.elem).parent().find('.showOnHover');
		var val = elem.attr('opacity');
		var old = (elem.attr('oldopacity')) ? elem.attr('oldopacity') : val;
		val = (val == old) ? 1:old;
		elem.attr('opacity', val);
		elem.attr('oldopacity', old);
	},

	//trialFullSize hover, mouse in
	cBigger: function(e, trial) {
		if  (! trial.comp.animations) return false;
	
		trial.elem.setAttribute('height','35pt');
		trial.elem.setAttribute('width','35pt');
		
	},

	//mouse up = mouse out = resize
	cResize: function(e, trial) {
		if  (! trial.comp.animations) return false;

		trial.elem.setAttribute('height','29pt');		
		trial.elem.setAttribute('width','29pt');
	},

	//clicked mouse down
	cSmaller: function(e, trial) {
		if  (! trial.comp.animations) return false;

		trial.elem.setAttribute('height','27pt');		
	},

}; 

var components = [animations];
$.each(components, function(i,component) {
	$.each(eventTypes, function(j,eventType) {
		var handler = component[eventType];
		if (handler) $(document).bind(eventType, handler);
	});
});

})(jQuery);
} //# end of "install only once"

/*}}}*/