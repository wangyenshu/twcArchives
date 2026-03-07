/***
|''Name:''|FollowTiddlersButtonPlugin|
|''Description:''|Wraps followTiddlers macro into a button, which needs to be clicked to activate it.|
|''Author:''|Mario Pietsch|
|''Source:''||
|''Version:''|0.1.0|
|''Status:''|beta|
|''Date:''|2010.12.06|
|''Requires:''|TiddlySpaceFollowingPlugin|
|''License:''|BSD|
|''~CoreVersion:''||
Click the [?] button, to get {{{<<followTiddlers>>}}} macro activated.
!!!!Use
<<<
{{{
<<followTiddlersButton>> instead of <<followTiddlers>>
}}}
<<<
!!!!ViewTemplate 
<<<
{{{
	<div class='followPlaceHolder' macro='followTiddlersButton'>
		<span macro="view title replyLink"></span>
	</div>
}}}
<<<

***/
/*{{{*/
version.extensions.TiddlySpaceHacks = {major: 0, minor: 1, revision: 0, date: new Date(2010,12,06)};

(function ($) {

var ftb;		
config.macros.followTiddlersButton = ftb = {

	// should be done for easy localisation
	locale: {
		lblButton: '?',
		txtButton: 'Find other spaces, that contain a tiddler with the same title',
	},

	handler: function(place, macroName, params, wikifier, paramString, tiddler){
		if (!config.macros.followTiddlers) return false;
		var btn = null;

		// createTiddlyButton(parent, text, tooltip, action, className, id, accessKey, attribs)			
		btn = createTiddlyButton(place, ftb.locale.lblButton, ftb.locale.txtButton, ftb.onClick, 'followButton');

		// passing all arguments to the function
		$(btn).data('data', arguments);
	},

	onClick: function() {
		var a = $(this).data("data");

		if (a) {
			config.macros.followTiddlers.handler.apply(config.macros.followTiddlers, a);
			$(this).remove();
		}
		return false;
	}

}; // end of hello world

}) (jQuery);
/*}}}*/
