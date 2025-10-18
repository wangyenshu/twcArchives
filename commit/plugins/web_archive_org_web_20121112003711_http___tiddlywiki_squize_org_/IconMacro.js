//{{{
// version: beta 1.1
//replace macro buttons with icons
// params[0] = image location
//params[1] = image width
//params[2] = image height
//params[3] = image title (optional)
config.macros.icon={};
config.macros.icon.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{

               if (place.lastChild.tagName!="BR")
                     {
                     var tempTitle = place.lastChild.firstChild.title;
                     removeChildren(place.lastChild);
                     place.lastChild.className = "imgLink";
                     var img = createTiddlyElement(place.lastChild,"img");
                     img.src = params[0];
                     if (params[3])
                         img.title = params[3];
                     img.width= params[1];
                     img.height =params[2];
                     }
};

//use icons for toolbar commands.
// used in view template like:
// <span macro='commandIcon jump jump.bmp'></span>
//params[0] = command name
//params[1] = image location
config.macros.commandIcon={};
config.macros.commandIcon.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{if(!e) var e = window.event;
    var img = createTiddlyElement(place,"img",null,"toolbarImg");
    img.src = params[1];
    img.onclick = function(){config.commands[params[0]].handler(e,place,story.findContainingTiddler(place).getAttribute("tiddler"));};
    img.title = config.commands[params[0]].tooltip;
}

setStylesheet(".toolbarImg {vertical-align: middle; cursor:pointer;}\n","commandIconStyles"); 

//}}}