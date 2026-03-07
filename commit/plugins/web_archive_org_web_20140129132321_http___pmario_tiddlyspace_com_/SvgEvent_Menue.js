/***
|''Name''|SvgEvent_Menue|
|''Description''|contains the global TW jQuery custom events.|
|''Author''|Mario Pietsch|
|''Version''|0.2.1|
|''Status''|''stable''|
|''Source''|http://fxplugins.tiddlyspace.com|
|''CoreVersion''|2.6|
|''Documentation''|[[SvgEvent_Info]]|
|''Keywords''|svg, events, animation, commands|
!Important
!Known issues
!History
*V 0.2.1
**stable
**[[SvgEvent_Info]] has more info now
*Version: 0.2.0
**changed function names. They are not ugly anymore :)
**SvgEventzPlugin is not needed anymore!
*Version: 0.1.0
**initial release
!Code
***/
/*{{{*/
if(!version.extensions.SvgEvent_Menue) { //# ensure that the plugin is only installed once
version.extensions.SvgEvent_Menue= { installed: true };

(function($) {

var eventTypes = ["cCloseAll", "cPermaview", "cNewTiddler", "cNewJournal", "cSaveChanges", "cReadDoc", "cmd99"];

menue= {
	// if you add event types here. Also go to the end and adjust "var eventTypes" accordingly.

	//menueCloseAll
	cCloseAll: function(e, trial) {
		if  (! trial.comp.menue) return false;

		story.closeAllTiddlers();
		return false;
	}, 

	//menuePermaview
	cPermaview: function(e, trial) {
		if  (! trial.comp.menue) return false;
		story.permaView();
		return false;
	}, 

	//menueNewTiddler
	cNewTiddler: function(e, trial) {
		if  (! trial.comp.menue) return false;
		// trigger readOnly
		if (readOnly) {$(document).trigger('cmd99', trial); return false;}

		var title = 'New Tiddler';
		story.displayTiddler(null, title);
		config.commands.editTiddler.handler(null, null, title);
		return false;
	}, 

	//menueNewJournal
	cNewJournal: function(e, trial) {
		if  (! trial.comp.menue) return false;
		// trigger readOnly
		if (readOnly) {$(document).trigger('cmd99', trial); return false;}

		var title = config.macros.timeline.dateFormat;
		title = new Date().formatString(title.trim());
		story.displayTiddler(null, title);
		config.commands.editTiddler.handler(null, null, title);

		return false;
	}, 

	// menueSaveChanges
	cSaveChanges: function(e, trial) {
		if  (! trial.comp.menue) return false;
		// trigger readOnly
		if (readOnly) {$(document).trigger('cmd99', trial); return false;}
		
		saveChanges();
		return false;
	}, 

	cReadDoc: function(e, trial) {
		if  (! trial.comp.menue) return false;

		var rdDocMsg= "Read the documentation!";

		displayMessage(rdDocMsg);
		return false;
	},

	cmd99: function(e, trial) {
		var rdOnlyMsg= "System is readOnly!";

		if  (! trial.comp.menue) return false;

		displayMessage(rdOnlyMsg);

		trial.elem.setAttribute('opacity', 0.3);
		return false;
	}

}; // menue


// if you add components here a 
var components = [menue];

$.each(components, function(i,component) {
	$.each(eventTypes, function(j,eventType) {
		var handler = component[eventType];
		if (handler) $(document).bind(eventType, handler);
	});
});


})(jQuery);
} //# end of "install only once"

/*}}}*/