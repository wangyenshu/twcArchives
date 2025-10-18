/***
| Name|CloseOnCancelPlugin|
| Description|Closes the tiddler if you click new tiddler then cancel. Default behaviour is to leave it open|
| Version|3.0 ($Rev: 1845 $)|
| Date|$Date: 2007-03-16 15:19:22 +1000 (Fri, 16 Mar 2007) $|
| Source|http://mptw.tiddlyspot.com/#CloseOnCancelPlugin|
| Author|Simon Baird <simon.baird@gmail.com>|
| License|http://mptw.tiddlyspot.com/#TheBSDLicense|
***/
//{{{
merge(config.commands.cancelTiddler,{

	handler_orig_closeUnsaved: config.commands.cancelTiddler.handler,

	handler: function(event,src,title) {
		this.handler_orig_closeUnsaved(event,src,title);
		if (!store.tiddlerExists(title) && !store.isShadowTiddler(title))
			story.closeTiddler(title,true);
	 	return false;
	}

});

//}}}

