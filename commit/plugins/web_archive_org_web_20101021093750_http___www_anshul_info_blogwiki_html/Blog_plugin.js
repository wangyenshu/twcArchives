// //''Name:'' Blog
// //''Version:'' 0.1
// //''Author:'' [[Anshul Nigham|http://yavin4.anshul.info]] (adapted from an earlier plugin by [[ClintChecketts|http://www.checkettsweb.com/]]) 
// //''Type:'' Plugin
// //''Description:'' Posts the most recently edited tiddlers when the TiddlyWiki is opened, similar to a blog.
// //''Syntax:'' Change the daysOrPosts and numOfDaysOrPosts variables below
// // If daysOrPosts variable is "days", tiddlers from the past numOfDaysOrPosts dates will be displayed
// // If daysOrPosts variable is "posts", the past numOfDaysOrPosts tiddlers will be displayed 

// // ''Tested against:'' Tiddlywiki 2.1.3

// // ''HOWTO:'' Simply copy this entire tiddler and paste it into a new tiddler in your own tiddlywiki.
// // Tag it with systemConfig, and also with systemTiddlers if you don't want it to appear within the blog views. Name it anything you like

var daysOrPosts = "posts";
var numOfDaysOrPosts = "10";

function displayTopTiddlers()
{
	if(window.location.hash) daysOrPosts = "";
	if(daysOrPosts == "posts")
	{
		var tiddlerNames = store.reverseLookup("tags","systemTiddlers",false,"modified");
		if (tiddlerNames.length < numOfDaysOrPosts)
			numOfDaysOrPosts = tiddlerNames.length;
		for(var t = tiddlerNames.length-numOfDaysOrPosts;t<=tiddlerNames.length-1;t++)
		story.displayTiddler("top",tiddlerNames[t].title,DEFAULT_VIEW_TEMPLATE,false,false);
	}
	if (daysOrPosts == "days"){
		var lastDay = "";
		var tiddlerNames = store.reverseLookup("tags","systemTiddlers",false,"modified");
		var t = tiddlerNames.length -1;
		var tFollower = 0;
		for(t;t>=0;t--) if(numOfDaysOrPosts >= 0){
			var theDay = tiddlerNames[t].modified.convertToYYYYMMDDHHMM().substr(0,8);
			if(theDay != lastDay){
				numOfDaysOrPosts = numOfDaysOrPosts -1;
				lastDay = theDay;
				tFollower = t;
			}
		}

		for(tFollower = tFollower+1; tFollower < tiddlerNames.length;tFollower++){
			displayTiddler("top",tiddlerNames[tFollower].title,DEFAULT_VIEW_TEMPLATE,false,false);
		}

	}
}

window.original_restart = window.restart;
window.restart = function()
{
	window.original_restart();
	displayTopTiddlers();
}
