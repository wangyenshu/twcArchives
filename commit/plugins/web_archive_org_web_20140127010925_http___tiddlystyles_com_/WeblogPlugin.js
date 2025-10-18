/***
''Name:'' Weblog
''Version:'' 1.2.0
''Location:'' http://checkettsweb.com/styles/themes.htm#WeblogPlugin
''Author:'' Clint Checketts

''Description:'' Posts the most recently edited tiddlers when the TiddlyWiki is opened, similar to a blog.

''Syntax:'' Change the daysOrPosts and numOfDaysOrPosts variables in the code section. 
Examples: 
{{{
 var daysOrPosts = "days";
 var numOfDaysOrPosts = "2";
}}}
will display the defaultTiddlers then all the tiddlers from the 2 most recent days, except those tagged as SystemTiddlers.
{{{
 var daysOrPosts = "posts";
 var numOfDaysOrPosts = "15";
}}}
will display the defaultTiddlers then the 15 most recent posts, except those tagged as SystemTiddlers.

''Directions:'' Copy this tiddler and tag it as systemConfig. Next, change the daysOrPosts and numOfDaysOrPosts variable to your liking in the 'Settings section'

''Know Issues:'' If a defaultTiddlers references a tiddler that has recently been referenced it will appear in the chronological order rather than at the top of the page. Also, if you are inserting the 15 most recent posts and default tiddlers new enough they too will be part of that count. If there is not text in the default tiddler, the weblog plugin isn't run.

''Revision History:''
 v0.1.0 (03 Aug 2005): initial release
 v0.1.2 (03 Aug 2005): fixed 'day' sorting order and permalink breakage
 v0.1.3 (10 Aug 2005): fixed error for when the numOfDaysOrPosts is greater than number of tiddlers.
 v1.1.0 (25 Jan 2005): updated to be compatible with TiddlyWiki 2.0
 v1.2.0 (26 Jan 2005): enabled displaying of tiddlers by date created in addition to date modified

!Settings section: (edit these)
***/
//{{{
var daysOrPosts = "posts";
var numOfDaysOrPosts = "10";
var modifiedOrCreate = "modified" 
//}}}



/***
!Code section:
***/
//{{{
//modified is the other option
// // We don't want to show tiddlers tagged as systemTiddlers etc. (this doesn't work yet...)
var ignoreTags = ("systemTiddlers","systemConfig","weblogIgnore");

Story.prototype.displayTiddlers_original_TiddlyBlog = Story.prototype.displayTiddlers;
Story.prototype.displayTiddlers = function(src,titles,state,highlightText,highlightCaseSensitive,animate,slowly) {
 // if using the addressbar to select tiddlers return
 if(window.location.hash) daysOrPosts = "";
 if(daysOrPosts == "posts"){
 //lookup the last few posts
 var tiddlerNames = store.reverseLookup("tags","systemTiddlers",false,modifiedOrCreate);
 //Just display all tiddlers if there aren't enough
 if(tiddlerNames.length-numOfDaysOrPosts<0) numOfDaysOrPosts = tiddlerNames.length; 
 for(var t = tiddlerNames.length-numOfDaysOrPosts;t<=tiddlerNames.length-1;t++)
 displayTiddler(src,tiddlerNames[t].title,state,highlightText,highlightCaseSensitive,animate,slowly);
 }
 if (daysOrPosts == "days"){
 var lastDay = "";
 var tiddlerNames = store.reverseLookup("tags","systemTiddlers",false,modifiedOrCreate);
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
 displayTiddler(src,tiddlerNames[tFollower].title,state,highlightText,highlightCaseSensitive,animate,slowly);
 }

 }

 // call the original displayTiddlers function
 this.displayTiddlers_original_TiddlyBlog(src,titles,state,highlightText,highlightCaseSensitive,animate,slowly);

}
//}}}