/***

|Name|NavigationMacro|
|Created by|SaqImtiaz|
|Location|http://tw.lewcid.org/#NavigationMacro|
|Version|0.3 |
|Requires|~TW2.08+|
!Description:
*Creates Next and Prev buttons on tiddlers, to cycle through tiddlers in order.
**you can create next and previous buttons to navigate through your journals, or the tiddlers of a tutorial.
*You can exclude certain tiddlers, or navigate through tiddlers with a specific tag only.
*The tiddlers can be sorted by modified or created.
*Custom ordering will be available after the release of TW 2.1
*Needs to be added to the ViewTemplate
*Buttons are updated dynamically and are hidden if there is no next or previous tiddler.

!Usage
{{{<<navigation>>}}}
or for more options:
{{{<<navigation sort exclude tag labelPrevious labelNext >>}}}
where sort is ''created'' (default) or ''modified''
exlcude is the tag to exclude.
tag is the tag to navigate through.
labelPrevious is the label for the previous button.
labelNext is the label for the next button. 

I recommend adding it to the ViewTemplate in the viewer div:
{{{<div class='viewer'>
<span macro='view text wikified'></span>
<span macro='navigation "" "" plugin'></span></div>}}}



!Example:
The next and previous buttons at the bottom of this tiddler will cycle through all of my extensions for TW.
!History
* 25-06-06 : version 0.3, first release

!Code
***/
//{{{
window.refreshNavLink = function (e) {
             var title = e.getAttribute("here");
             var sort = e.getAttribute("sort");
             var exclude =  e.getAttribute("exclude");
             if (e.getAttribute("tag")!=undefined) var tag = e.getAttribute("tag");
             var navtype = e.getAttribute("navtype");
              if (tag) {var tiddlers = store.getTaggedTiddlers(tag,sort);}
              else {var tiddlers = store.getTiddlers(sort,exclude);}
              for (var g=0; g<tiddlers.length; g++)
                  {if (title==tiddlers[g].title)
                       {if(navtype=="next" && !tiddlers[g+1])                             
                             e.className += " navNonExisting"
                        else if (navtype=="prev" && !tiddlers[g-1])
                             e.className += " navNonExisting"
                        else e.className = "button";}
                  }
}


config.refreshers.navLink = function(e,changeList){         
             refreshNavLink(e);
} 



config.macros.navigation={};
config.macros.navigation.handler = function(place,macroName,params,wikifier,paramString,tiddler){

          var sort = (params[0] && params[0]!=".")? params[0]: "created";
          var exclude =(params[1] && params[1]!=".")? params[1]: undefined;
          if (params[2])
                {var tag= params[2];
                 if(tiddler.tags.contains(tag)==false)
                 return false;
                }
          var labelPrev = params[3] ? params[3] : "Previous";
          var labelNext = params[4] ? params[4] : "Next";

          var next = function(e){
              if (!e) var e=window.event;
              var theTarget = resolveTarget(e);
              var navtype = theTarget.getAttribute("navtype");
              if (tag) {var tiddlers = store.getTaggedTiddlers(tag,sort);}
              else {var tiddlers = store.getTiddlers(sort,exclude);}
              for (var g=0; g<tiddlers.length; g++)
                  {if (tiddler.title==tiddlers[g].title)
                        {if (navtype == "next")
                            story.displayTiddler(theTarget,tiddlers[g+1].title)
                        else if (navtype == "prev")
                            story.displayTiddler(theTarget,tiddlers[g-1].title)}
                  }
              }

     var createNavBtn = function(text,theId,mode){
         var nextBtn = createTiddlyButton(place,text,text,next,null,theId);
         nextBtn.setAttribute("refresh","navLink");
         nextBtn.setAttribute("here",tiddler.title);
         nextBtn.setAttribute("sort",sort);
         nextBtn.setAttribute("exclude",exclude);
         nextBtn.setAttribute("navtype",mode);
         if (tag) nextBtn.setAttribute("tag",tag);
         refreshNavLink(nextBtn);
         }
    createNavBtn(labelNext+" ►","NavNext","next");
    createNavBtn("◄ "+labelPrev,"NavPrevious","prev");

}

setStylesheet(
"#NavNext {float:right;}\n"+
"#NavPrevious {float:left;}\n"+
".navNonExisting {display:none;}\n"+
 "",
"NavMacroStyles");
//}}}