/***
|Name|NewSideBarHide|
|Originally Created by|SaqImtiaz converted by Morris Gray|
|Location|TBA|
|Version|007|
|Requires|~TW2.x|
!Description:
Toggle sidebar and header . Very handy for when you need more viewing space.

!Demo:
Click the sidebar» button to toggle sidebar and header..

!Installation:
Copy the contents of this tiddler to your TW, tag with systemConfig, save and reload your TW.
Edit the ViewTemplate to add the fullscreen command to the toolbar.

!History
*25.03.08: ver 1.1 MG
*25-07-06: ver 1.1
*20-07-06: ver 1.0

!Code
***/
//{{{
var lewcidFullSidebar = false;

config.commands.sidebar =
{
            text:"sidebar» ",
            tooltip:"toggle sidebar mode"
};

config.commands.sidebar.handler = function (event,src,title)
{
            if (lewcidFullSidebar == false)
               {
                lewcidFullSidebar = true;
                setStylesheet('#sidebar, .header {display:none;} #displayArea{margin: 0em 0em 0em 12.5em !important;}',"lewcidFullSidebarStyle");
               }
            else
               {
                lewcidFullSidebar = false;
                setStylesheet(' ',"lewcidFullSidebarStyle");
               }
}

config.macros.sidebar={};
config.macros.sidebar.handler =  function(place,macroName,params,wikifier,paramString,tiddler)
{
        var label = params[0]||" sidebar» ";
        var tooltip = params[1]||"togglesidebar mode";
        createTiddlyButton(place,label,tooltip,config.commands.sidebar.handler);
}

var lewcid_sidebar_closeTiddler = Story.prototype.closeTiddler;
Story.prototype.closeTiddler =function(title,animate,slowly)
{
           lewcid_sidebar_closeTiddler.apply(this,arguments);
           if (story.isEmpty() && lewcidFullSidebar == true)
              config.commands.sidebar.handler();
}


Slider.prototype.lewcidStop = Slider.prototype.stop;
Slider.prototype.stop = function()
{
           this.lewcidStop();
           if (story.isEmpty() && lewcidFullSidebar == true)
              config.commands.sidebar.handler();
}
//}}}