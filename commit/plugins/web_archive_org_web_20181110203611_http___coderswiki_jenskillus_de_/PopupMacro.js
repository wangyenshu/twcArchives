/***
|''Name:''|~PopupMacro|
|''Version:''|1.0.0 (2006-05-09)|
|''Source:''|http://tw.lewcid.org/#PopupMacro|
|''Author:''|Saq Imtiaz|
|''Description:''|Create popups with custom content|
|''Documentation:''|[[PopupMacro Documentation|PopupMacroDocs]]|
|''~Requires:''|TW Version 2.0.8 or better|
***/
// /%
{{{
config.macros.popup = {};
config.macros.popup.arrow = (document.all?"▼":"▾");
config.macros.popup.handler = function(place,macroName,params,wikifier,paramString,theTiddler) {

        if (!params[0] || !params[1]) 
             {createTiddlyError(place,'missing macro parameters','missing label or content parameter');
              return false;};
   
        var label = params[0];
        var source = (params[1]).replace(/\$\)\)/g,">>"); 
        var nestedId = params[2]? params[2]: 'nestedpopup';        

	var onclick = function(event) {
	        if(!event){var event = window.event;}
                var theTarget = resolveTarget(event);
                var nested = (!isNested(theTarget));
               
                if ((Popup.stack.length > 1)&&(nested==true)) {Popup.removeFrom(1);}
                else if(Popup.stack.length > 0 && nested==false) {Popup.removeFrom(0);};
                
                var theId = (nested==false)? "popup" : nestedId; 
	        var popup = createTiddlyElement(document.body,"ol",theId,"popup",null);
	        Popup.stack.push({root: button, popup: popup});

                wikify(source,popup);
		Popup.show(popup,true);
	        event.cancelBubble = true;
		if (event.stopPropagation) event.stopPropagation();
		return false;
	}
	var button = createTiddlyButton(place, label+this.arrow,label, onclick, null);
};

window.isNested = function(e) {
        while (e != null) {
                var contentWrapper = document.getElementById("contentWrapper");
                if (contentWrapper == e) return true;
                e = e.parentNode;
                }
        return false;
};

setStylesheet(
".popup, .popup a, .popup a:visited {color: #fff;}\n"+
".popup  a:hover {background: #014; color: #fff; border: none;}\n"+
".popup li , .popup ul, .popup ol {list-style:none !important; margin-left:0.3em !important; margin-right:0.3em; font-size:100%; padding-top:0.5px !important; padding:0px !important;}\n"+
"#nestedpopup {background:#2E5ADF; border: 1px solid #0331BF; margin-left:1em; }\n"+
"",
"CustomPopupStyles");

config.shadowTiddlers.PopupMacroDocs="The documentation is available [[here.|http://tw.lewcid.org/#PopupMacroDocs]]";
}}}
//%/