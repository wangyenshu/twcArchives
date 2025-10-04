/***
|''Name''|AllActivityPlugin|
|''Description''|Pulls in the activity on any given day as mangled tiddlers.|
|''Requires''|TiddlySpaceConfig ActivityStreamPlugin|
|''Version''|0.1.6|
***/
//{{{
(function($) {
var tiddlyspace = config.extensions.tiddlyspace;
var NOP = function(){};
var macro = config.macros.allActivity = {
	retrieved: 0,
	handler: function(place, macroName, params) {
		var offset = params[0];
		var date = new Date();
		if(offset) {
			date = new Date(date.setDate(date.getDate() - offset));
		}
		var msg = $("<span />").
			text("please wait while we look for activity across TiddlySpace...").appendTo(place)[0];
		var ts = date.convertToYYYYMMDDHHMM();
		var hour = parseInt(ts.substr(8, 2), 10);
		var suckin = function() {
			while(hour > -1) {
				var hourStr = hour < 10 ? "0" + hour : hour;
				ajaxReq({ dataType: "json",
					url: "/search?q=modified:" +  ts.substr(0, 8) + hourStr + "*",
					success: function(tiddlers) {
						$(msg).empty();
						macro.retrieved += tiddlers.length;
						macro.addToStore(tiddlers);
					}
				});
				hour -= 1;
			}
		};
		window.setInterval(function() {
			suckin();
		}, 300000);
		suckin();
		macro.handler = NOP;
	},
	addToStore: function(tiddlers) {
		config.macros.activity.updateStream(tiddlers.slice(0,11000), null, {}); // define a cut off in case psd's uploading geo stuff 

		refreshAll();
	}
}

})(jQuery);
//}}}