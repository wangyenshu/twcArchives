/***
|Name|BetterTimelineMacro|
|Created by|SaqImtiaz|
|Location|http://tw.lewcid.org/#BetterTimelineMacro|
|Version|0.5 beta|
|Requires|~TW2.x|
!!!Description:
A replacement for the core timeline macro that offers more features:
*list tiddlers with only specfic tag
*exclude tiddlers with a particular tag
*limit entries to any number of days, for example one week
*specify a start date for the timeline, only tiddlers after that date will be listed.

!!!Installation:
Copy the contents of this tiddler to your TW, tag with systemConfig, save and reload your TW.
Edit the ViewTemplate to add the fullscreen command to the toolbar.

!!!Syntax:
{{{<<timeline better:true>>}}}
''the param better:true enables the advanced features, without it you will get the old timeline behaviour.''

additonal params:
(use only the ones you want)
{{{<<timeline better:true  onlyTag:Tag1 excludeTag:Tag2 sortBy:modified/created firstDay:YYYYMMDD maxDays:7 maxEntries:30>>}}}

''explanation of syntax:''
onlyTag: only tiddlers with this tag will be listed. Default is to list all tiddlers.
excludeTag: tiddlers with this tag will not be listed.
sortBy: sort tiddlers by date modified or date created. Possible values are modified or created.
firstDay: useful for starting timeline from a specific date. Example: 20060701 for 1st of July, 2006
maxDays: limits timeline to include only tiddlers from the specified number of days. If you use a value of 7 for example, only tiddlers from the last 7 days will be listed.
maxEntries: limit the total number of entries in the timeline.


!!!History:
*28-07-06: ver 0.5 beta, first release

!!!Code
***/
//{{{
// Return the tiddlers as a sorted array
TiddlyWiki.prototype.getTiddlers = function(field,excludeTag,includeTag)
{
          var results = [];
          this.forEachTiddler(function(title,tiddler)
          {
          if(excludeTag == undefined || tiddler.tags.find(excludeTag) == null)
                        if(includeTag == undefined || tiddler.tags.find(includeTag)!=null)
                                      results.push(tiddler);
          });
          if(field)
                   results.sort(function (a,b) {if(a[field] == b[field]) return(0); else return (a[field] < b[field]) ? -1 : +1; });
          return results;
}



//this function by Udo
function getParam(params, name, defaultValue)
{
          if (!params)
          return defaultValue;
          var p = params[0][name];
          return p ? p[0] : defaultValue;
}

window.old_timeline_handler= config.macros.timeline.handler;
config.macros.timeline.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
          var args = paramString.parseParams("list",null,true);
          var betterMode = getParam(args, "better", "false");
          if (betterMode == 'true')
          {
          var sortBy = getParam(args,"sortBy","modified");
          var excludeTag = getParam(args,"excludeTag",undefined);
          var includeTag = getParam(args,"onlyTag",undefined);
          var tiddlers = store.getTiddlers(sortBy,excludeTag,includeTag);
          var firstDayParam = getParam(args,"firstDay",undefined);
          var firstDay = (firstDayParam!=undefined)? firstDayParam: "00010101";
          var lastDay = "";
          var field= sortBy;
          var maxDaysParam = getParam(args,"maxDays",undefined);
          var maxDays = (maxDaysParam!=undefined)? maxDaysParam*24*60*60*1000: (new Date()).getTime() ;
          var maxEntries = getParam(args,"maxEntries",undefined);
          var last = (maxEntries!=undefined) ? tiddlers.length-Math.min(tiddlers.length,parseInt(maxEntries)) : 0;
          for(var t=tiddlers.length-1; t>=last; t--)
                  {
                  var tiddler = tiddlers[t];
                  var theDay = tiddler[field].convertToLocalYYYYMMDDHHMM().substr(0,8);
                  if ((theDay>=firstDay)&& (tiddler[field].getTime()> (new Date()).getTime() - maxDays))
                     {
                     if(theDay != lastDay)
                               {
                               var theDateList = document.createElement("ul");
                               place.appendChild(theDateList);
                               createTiddlyElement(theDateList,"li",null,"listTitle",tiddler[field].formatString(this.dateFormat));
                               lastDay = theDay;
                               }
                  var theDateListItem = createTiddlyElement(theDateList,"li",null,"listLink",null);
                  theDateListItem.appendChild(createTiddlyLink(place,tiddler.title,true));
                  }
                  }
          }

          else
              {
              window.old_timeline_handler.apply(this,arguments);
              }
}
//}}}