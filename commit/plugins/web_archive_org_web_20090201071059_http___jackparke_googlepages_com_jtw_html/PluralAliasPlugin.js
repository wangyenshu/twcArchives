/***
|''Name:''|PluralAliasPlugin|
|''Version:''|2.1 (29-May-2007)|
|''Author:''|[[Jack]]|
|''Type:''|Plugin|
!Description
This plugin ensures links to tiddlers in plural or singular form without the need to create duplicate tiddlers or resort to pretty linking. Example: "I love [[SiameseCat]] and even had a beautiful [[SiameseCat]] once."
!Usage
Just install the plugin and tag with systemConfig.
!Revision History
* Original by [[Jack]] on 2-Mar-2006
* Support createTiddler() function for aliased permalinks
* Support for reverseLookups (referrers functionality, thanks to Mike Fuellbrandt)
!Code
***/
//{{{
version.extensions.pluralAlias = {major: 2, minor: 1,
revision: 0, date: new Date("May 29, 2007")};

pluralAlias_createTiddlyLink = createTiddlyLink;
createTiddlyLink = function(place,title,includeText,theClass,isStatic) {
 title = pluralAlias_getTitle(title);
 return pluralAlias_createTiddlyLink(place,title,includeText,theClass,isStatic);
}
Story.prototype.pluralAlias_createTiddler= Story.prototype.createTiddler;
Story.prototype.createTiddler = function(place,before,title,template) {
 title = pluralAlias_getTitle(title);
 return this.pluralAlias_createTiddler(place,before,title,template);
}
function pluralAlias_getTitle(title) {
 if (!store.tiddlerExists(title)) {
 var aliasTitle = title.match(/s$/)?title.substr(0, title.length-1):title+"s";
 if (store.tiddlerExists(aliasTitle)) title = aliasTitle;
 }
 return title;
}
TiddlyWiki.prototype.reverseLookup = function(lookupField,lookupValue,lookupMatch,sortField)
{
 var results = [];
 this.forEachTiddler(function(title,tiddler) {
 var f = !lookupMatch;
 for(var lookup=0; lookup<tiddler[lookupField].length; lookup++)
 if(tiddler[lookupField][lookup] == lookupValue || pluralAlias_getTitle(tiddler[lookupField][lookup]) == lookupValue)
 f = lookupMatch;
 if(f)
 results.push(tiddler);
 });
 if(!sortField)
 sortField = "title";
 results.sort(function(a,b) {return a[sortField] < b[sortField] ? -1 : (a[sortField] == b[sortField] ? 0 : +1);});
 return results;
}
//}}}